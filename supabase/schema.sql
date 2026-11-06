create extension if not exists pgcrypto;

create table if not exists public.portal_admins (
  email text primary key
);

create table if not exists public.portal_quotas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  extra_templates integer not null default 0 check (extra_templates >= 0),
  extra_exports integer not null default 0 check (extra_exports >= 0),
  exports_used integer not null default 0 check (exports_used >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_drafts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists portal_drafts_user_id_idx on public.portal_drafts(user_id);

create table if not exists public.portal_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  requested_templates integer not null default 1 check (requested_templates between 1 and 10),
  requested_exports integer not null default 1 check (requested_exports between 1 and 10),
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text
);

create unique index if not exists one_pending_portal_request_per_user
  on public.portal_access_requests(user_id) where status = 'pending';

create or replace function public.is_portal_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.portal_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.ensure_portal_quota()
returns public.portal_quotas
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  quota public.portal_quotas;
begin
  if auth.uid() is null then
    raise exception 'Sign in is required.';
  end if;

  insert into public.portal_quotas(user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;

  select * into quota
  from public.portal_quotas
  where user_id = auth.uid();
  return quota;
end;
$$;

create or replace function public.enforce_portal_draft_limit()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  quota public.portal_quotas;
  saved_count integer;
begin
  if auth.uid() is null or new.user_id <> auth.uid() then
    raise exception 'You can only save your own portal.';
  end if;

  insert into public.portal_quotas(user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;

  select * into quota
  from public.portal_quotas
  where user_id = auth.uid()
  for update;

  if tg_op = 'UPDATE' then
    if old.user_id <> auth.uid() then
      raise exception 'You can only update your own portal.';
    end if;
    new.updated_at = now();
    return new;
  end if;

  select count(*) into saved_count
  from public.portal_drafts
  where user_id = auth.uid();

  if saved_count >= 1 + quota.extra_templates then
    raise exception 'You have reached your saved portal limit. Request additional access from the dashboard.';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portal_draft_limit on public.portal_drafts;
create trigger portal_draft_limit
before insert or update on public.portal_drafts
for each row execute function public.enforce_portal_draft_limit();

create or replace function public.get_my_portal_quota()
returns table(saved_limit integer, export_limit integer, exports_used integer)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  quota public.portal_quotas;
begin
  quota := public.ensure_portal_quota();
  return query select 1 + quota.extra_templates, 1 + quota.extra_exports, quota.exports_used;
end;
$$;

create or replace function public.reserve_portal_export(p_draft_id text)
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  quota public.portal_quotas;
begin
  if auth.uid() is null then
    raise exception 'Sign in is required to export.';
  end if;

  perform 1 from public.portal_drafts
  where id = p_draft_id and user_id = auth.uid();
  if not found then
    raise exception 'Save this portal before exporting.';
  end if;

  insert into public.portal_quotas(user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;

  select * into quota
  from public.portal_quotas
  where user_id = auth.uid()
  for update;

  if quota.exports_used >= 1 + quota.extra_exports then
    raise exception 'You have reached your export limit. Request additional access from the dashboard.';
  end if;

  update public.portal_quotas
  set exports_used = exports_used + 1, updated_at = now()
  where user_id = auth.uid()
  returning * into quota;
  return quota.exports_used;
end;
$$;

create or replace function public.request_extra_portal_access(p_reason text)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  request_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in is required to request additional access.';
  end if;
  if length(trim(coalesce(p_reason, ''))) < 10 then
    raise exception 'Please explain why you need additional access (at least 10 characters).';
  end if;

  insert into public.portal_access_requests(user_id, email, reason)
  values (auth.uid(), coalesce(auth.jwt() ->> 'email', ''), trim(p_reason))
  returning id into request_id;
  return request_id;
end;
$$;

create or replace function public.review_portal_access_request(
  p_request_id uuid,
  p_approve boolean,
  p_extra_templates integer default 1,
  p_extra_exports integer default 1
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  access_request public.portal_access_requests;
begin
  if not public.is_portal_admin() then
    raise exception 'Administrator access is required.';
  end if;
  if p_extra_templates < 0 or p_extra_templates > 10 or p_extra_exports < 0 or p_extra_exports > 10 then
    raise exception 'Grant values must be between 0 and 10.';
  end if;

  select * into access_request
  from public.portal_access_requests
  where id = p_request_id and status = 'pending'
  for update;
  if not found then
    raise exception 'This request is not pending.';
  end if;

  if p_approve then
    insert into public.portal_quotas(user_id)
    values (access_request.user_id)
    on conflict (user_id) do nothing;

    update public.portal_quotas
    set extra_templates = extra_templates + p_extra_templates,
        extra_exports = extra_exports + p_extra_exports,
        updated_at = now()
    where user_id = access_request.user_id;
  end if;

  update public.portal_access_requests
  set status = case when p_approve then 'approved' else 'denied' end,
      reviewed_at = now(),
      reviewed_by = auth.jwt() ->> 'email'
  where id = p_request_id;
end;
$$;

alter table public.portal_admins enable row level security;
alter table public.portal_quotas enable row level security;
alter table public.portal_drafts enable row level security;
alter table public.portal_access_requests enable row level security;

drop policy if exists "Users read own portal quota" on public.portal_quotas;
create policy "Users read own portal quota" on public.portal_quotas
for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users read own drafts" on public.portal_drafts;
drop policy if exists "Users insert own drafts" on public.portal_drafts;
drop policy if exists "Users update own drafts" on public.portal_drafts;
drop policy if exists "Users delete own drafts" on public.portal_drafts;
create policy "Users read own drafts" on public.portal_drafts
for select to authenticated using (user_id = auth.uid());
create policy "Users insert own drafts" on public.portal_drafts
for insert to authenticated with check (user_id = auth.uid());
create policy "Users update own drafts" on public.portal_drafts
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users delete own drafts" on public.portal_drafts
for delete to authenticated using (user_id = auth.uid());

drop policy if exists "Users read own access requests" on public.portal_access_requests;
create policy "Users read own access requests" on public.portal_access_requests
for select to authenticated using (user_id = auth.uid() or public.is_portal_admin());
drop policy if exists "Admins read all access requests" on public.portal_access_requests;
drop policy if exists "Users create own access requests" on public.portal_access_requests;
create policy "Users create own access requests" on public.portal_access_requests
for insert to authenticated with check (
  user_id = auth.uid()
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  and status = 'pending'
  and requested_templates = 1
  and requested_exports = 1
);

grant select, insert, update, delete on public.portal_drafts to authenticated;
grant select on public.portal_quotas to authenticated;
grant select, insert on public.portal_access_requests to authenticated;
grant execute on function public.get_my_portal_quota() to authenticated;
grant execute on function public.is_portal_admin() to authenticated;
grant execute on function public.reserve_portal_export(text) to authenticated;
grant execute on function public.request_extra_portal_access(text) to authenticated;
grant execute on function public.review_portal_access_request(uuid, boolean, integer, integer) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('portal-images', 'portal-images', false, 5242880, array['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = 5242880;

drop policy if exists "Users read their portal images" on storage.objects;
drop policy if exists "Users upload their portal images" on storage.objects;
drop policy if exists "Users update their portal images" on storage.objects;
drop policy if exists "Users delete their portal images" on storage.objects;
create policy "Users read their portal images" on storage.objects
for select to authenticated using (
  bucket_id = 'portal-images' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "Users upload their portal images" on storage.objects
for insert to authenticated with check (
  bucket_id = 'portal-images' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "Users update their portal images" on storage.objects
for update to authenticated using (
  bucket_id = 'portal-images' and (storage.foldername(name))[1] = auth.uid()::text
) with check (
  bucket_id = 'portal-images' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "Users delete their portal images" on storage.objects
for delete to authenticated using (
  bucket_id = 'portal-images' and (storage.foldername(name))[1] = auth.uid()::text
);

-- Sign in once with this verified email before running this schema.
delete from public.portal_admins
where lower(email) = 'chrsistianzemog@gmail.com';

insert into public.portal_admins(email)
values ('christianzemog@gmail.com')
on conflict (email) do nothing;
