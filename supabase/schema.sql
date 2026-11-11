create extension if not exists pgcrypto;

create table if not exists public.portal_admins (
  email text primary key
);

create table if not exists public.portal_quotas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  extra_templates integer not null default 0 check (extra_templates >= 0),
  extra_exports integer not null default 0 check (extra_exports >= 0),
  exports_used integer not null default 0 check (exports_used >= 0),
  is_locked boolean not null default false,
  lock_reason text,
  locked_at timestamptz,
  locked_by text,
  updated_at timestamptz not null default now()
);

alter table public.portal_quotas
  add column if not exists is_locked boolean not null default false,
  add column if not exists lock_reason text,
  add column if not exists locked_at timestamptz,
  add column if not exists locked_by text;

create table if not exists public.portal_drafts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists portal_drafts_user_id_idx on public.portal_drafts(user_id);

create table if not exists public.portal_notification_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  notification_id text not null check (length(notification_id) <= 200),
  dismissed boolean not null default false,
  primary key (user_id, notification_id)
);
alter table public.portal_notification_state enable row level security;
drop policy if exists "Users manage own notification state" on public.portal_notification_state;
create policy "Users manage own notification state" on public.portal_notification_state
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, update, delete on public.portal_notification_state to authenticated;

create table if not exists public.portal_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text check (username is null or username ~ '^[A-Za-z0-9_]{3,30}$'),
  last_active_at timestamptz
);
create unique index if not exists portal_profiles_username_unique
  on public.portal_profiles (lower(username)) where username is not null;
alter table public.portal_profiles enable row level security;
drop policy if exists "Users read own portal profile" on public.portal_profiles;
create policy "Users read own portal profile" on public.portal_profiles
  for select to authenticated using (user_id = auth.uid());
grant select on public.portal_profiles to authenticated;

create or replace function public.create_portal_profile()
returns trigger language plpgsql security definer set search_path = public, auth as $$
declare requested_username text := nullif(trim(new.raw_user_meta_data ->> 'portal_username'), '');
begin
  if requested_username is not null and requested_username !~ '^[A-Za-z0-9_]{3,30}$' then
    raise exception 'Username must be 3 to 30 letters, numbers, or underscores.';
  end if;
  insert into public.portal_profiles(user_id, username) values (new.id, requested_username);
  return new;
end;
$$;
drop trigger if exists portal_create_profile on auth.users;
create trigger portal_create_profile after insert on auth.users
  for each row execute function public.create_portal_profile();
insert into public.portal_profiles(user_id)
select id from auth.users on conflict (user_id) do nothing;

create or replace function public.set_portal_username(p_username text)
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Sign in is required.'; end if;
  if trim(coalesce(p_username, '')) !~ '^[A-Za-z0-9_]{3,30}$' then
    raise exception 'Username must be 3 to 30 letters, numbers, or underscores.';
  end if;
  insert into public.portal_profiles(user_id, username) values (auth.uid(), trim(p_username))
  on conflict (user_id) do update set username = excluded.username;
exception when unique_violation then
  raise exception 'This username is already in use.';
end;
$$;

create or replace function public.record_portal_activity()
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Sign in is required.'; end if;
  insert into public.portal_profiles(user_id, last_active_at) values (auth.uid(), now())
  on conflict (user_id) do update set last_active_at = excluded.last_active_at
    where portal_profiles.last_active_at is null or portal_profiles.last_active_at < now() - interval '1 minute';
end;
$$;
revoke all on function public.create_portal_profile() from public, anon, authenticated;
revoke all on function public.set_portal_username(text) from public, anon;
revoke all on function public.record_portal_activity() from public, anon;
grant execute on function public.set_portal_username(text), public.record_portal_activity() to authenticated;

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

alter table public.portal_access_requests
  add column if not exists approved_templates integer not null default 0 check (approved_templates >= 0),
  add column if not exists approved_exports integer not null default 0 check (approved_exports >= 0);

create unique index if not exists one_pending_portal_request_per_user
  on public.portal_access_requests(user_id) where status = 'pending';

create table if not exists public.portal_access_audit_log (
  id bigint generated always as identity primary key,
  request_id uuid,
  admin_email text not null,
  user_id uuid,
  user_email text not null,
  action text not null check (action in (
    'request_approved', 'request_denied', 'credits_granted', 'user_removed',
    'account_locked', 'account_unlocked', 'unlock_request_approved', 'unlock_request_denied'
  )),
  template_credits integer not null default 0 check (template_credits >= 0),
  export_credits integer not null default 0 check (export_credits >= 0),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.portal_access_audit_log
  drop constraint if exists portal_access_audit_log_action_check;
alter table public.portal_access_audit_log
  add constraint portal_access_audit_log_action_check check (action in (
    'request_approved', 'request_denied', 'credits_granted', 'user_removed',
    'account_locked', 'account_unlocked', 'unlock_request_approved', 'unlock_request_denied'
  ));

create index if not exists portal_access_audit_log_created_at_idx
  on public.portal_access_audit_log(created_at desc);

create table if not exists public.portal_unlock_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text
);

create unique index if not exists one_pending_portal_unlock_request_per_user
  on public.portal_unlock_requests(user_id) where status = 'pending';

create or replace function public.limit_portal_accounts_per_device()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  device_id text;
  device_accounts integer;
begin
  device_id := nullif(trim(new.raw_user_meta_data ->> 'portal_device_id'), '');
  if device_id is null or length(device_id) < 32 or length(device_id) > 128 then
    raise exception 'A valid device registration is required to create an account.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(device_id, 0));
  select count(*) into device_accounts
  from auth.users
  where raw_user_meta_data ->> 'portal_device_id' = device_id;

  if device_accounts >= 2 then
    raise exception 'This device has reached its limit of two Portal Studio accounts.';
  end if;
  return new;
end;
$$;

create or replace function public.set_portal_user_lock(
  p_user_id uuid,
  p_locked boolean,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_email text;
begin
  if not public.is_portal_admin() then
    raise exception 'Administrator access is required.';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You cannot lock or unlock your own administrator account.';
  end if;
  if exists (
    select 1 from public.portal_admins a
    join auth.users u on lower(u.email) = lower(a.email)
    where u.id = p_user_id
  ) then
    raise exception 'Administrator accounts cannot be locked here.';
  end if;
  if p_locked and length(trim(coalesce(p_reason, ''))) < 10 then
    raise exception 'Provide a lock reason of at least 10 characters.';
  end if;

  select email into target_email from auth.users where id = p_user_id;
  if not found then
    raise exception 'The user no longer exists.';
  end if;

  insert into public.portal_quotas(user_id, is_locked, lock_reason, locked_at, locked_by)
  values (
    p_user_id,
    p_locked,
    case when p_locked then trim(p_reason) else null end,
    case when p_locked then now() else null end,
    case when p_locked then auth.jwt() ->> 'email' else null end
  )
  on conflict (user_id) do update
  set is_locked = excluded.is_locked,
      lock_reason = excluded.lock_reason,
      locked_at = excluded.locked_at,
      locked_by = excluded.locked_by,
      updated_at = now();

  if not p_locked then
    update public.portal_unlock_requests
    set status = 'approved', reviewed_at = now(), reviewed_by = auth.jwt() ->> 'email'
    where user_id = p_user_id and status = 'pending';
  end if;

  insert into public.portal_access_audit_log(admin_email, user_id, user_email, action, details)
  values (
    coalesce(auth.jwt() ->> 'email', ''),
    p_user_id,
    coalesce(target_email, ''),
    case when p_locked then 'account_locked' else 'account_unlocked' end,
    case when p_locked then jsonb_build_object('reason', trim(p_reason)) else '{}'::jsonb end
  );
end;
$$;

create or replace function public.request_portal_unlock(p_reason text)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  request_id uuid;
  user_quota public.portal_quotas;
begin
  if auth.uid() is null then
    raise exception 'Sign in is required to request an account unlock.';
  end if;
  if length(trim(coalesce(p_reason, ''))) < 10 then
    raise exception 'Please provide a justification of at least 10 characters.';
  end if;
  select * into user_quota from public.portal_quotas where user_id = auth.uid() for update;
  if not found or not user_quota.is_locked then
    raise exception 'Your account is not locked.';
  end if;
  if exists (
    select 1 from public.portal_unlock_requests where user_id = auth.uid() and status = 'pending'
  ) then
    raise exception 'You already have a pending unlock request. Please wait for an administrator to review it.';
  end if;

  insert into public.portal_unlock_requests(user_id, email, reason)
  values (auth.uid(), coalesce(auth.jwt() ->> 'email', ''), trim(p_reason))
  returning id into request_id;
  return request_id;
end;
$$;

create or replace function public.review_portal_unlock_request(p_request_id uuid, p_approve boolean)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  unlock_request public.portal_unlock_requests;
begin
  if not public.is_portal_admin() then
    raise exception 'Administrator access is required.';
  end if;

  select * into unlock_request
  from public.portal_unlock_requests
  where id = p_request_id and status = 'pending'
  for update;
  if not found then
    raise exception 'This unlock request is not pending.';
  end if;

  if p_approve then
    update public.portal_quotas
    set is_locked = false, lock_reason = null, locked_at = null, locked_by = null, updated_at = now()
    where user_id = unlock_request.user_id;
  end if;

  update public.portal_unlock_requests
  set status = case when p_approve then 'approved' else 'denied' end,
      reviewed_at = now(), reviewed_by = auth.jwt() ->> 'email'
  where id = p_request_id;

  insert into public.portal_access_audit_log(admin_email, user_id, user_email, action, details)
  values (
    coalesce(auth.jwt() ->> 'email', ''),
    unlock_request.user_id,
    unlock_request.email,
    case when p_approve then 'unlock_request_approved' else 'unlock_request_denied' end,
    jsonb_build_object('reason', unlock_request.reason)
  );
end;
$$;

drop trigger if exists portal_account_device_limit on auth.users;
create trigger portal_account_device_limit
before insert on auth.users
for each row execute function public.limit_portal_accounts_per_device();

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
  if public.is_portal_admin() then
    new.updated_at = now();
    return new;
  end if;

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

  if tg_op = 'INSERT' and quota.is_locked then
    raise exception 'Your account is locked. Submit an unlock request before creating a portal.';
  end if;

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

drop function if exists public.get_my_portal_quota();
create function public.get_my_portal_quota()
returns table(saved_limit integer, export_limit integer, exports_used integer, is_locked boolean, lock_reason text)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  quota public.portal_quotas;
begin
  quota := public.ensure_portal_quota();
  if public.is_portal_admin() then
    return query select 2147483647, 2147483647, quota.exports_used, false, null::text;
  else
    return query select 1 + quota.extra_templates, 1 + quota.extra_exports, quota.exports_used,
      quota.is_locked, quota.lock_reason;
  end if;
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
  where id = p_draft_id
    and (user_id = auth.uid() or public.is_portal_admin());
  if not found then
    raise exception 'Save this portal before exporting.';
  end if;

  if public.is_portal_admin() then
    return 0;
  end if;

  insert into public.portal_quotas(user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;

  select * into quota
  from public.portal_quotas
  where user_id = auth.uid()
  for update;

  if quota.is_locked then
    raise exception 'Your account is locked. Submit an unlock request before exporting.';
  end if;

  if not public.is_portal_admin() and quota.exports_used >= 1 + quota.extra_exports then
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

  if exists (
    select 1 from public.portal_access_requests
    where user_id = auth.uid() and status = 'pending'
  ) then
    raise exception 'You already have a pending access request. Please wait for an administrator to review it.';
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
  if p_extra_templates is null or p_extra_templates < 0 or p_extra_templates > 10
     or p_extra_exports is null or p_extra_exports < 0 or p_extra_exports > 10 then
    raise exception 'Grant values must be between 0 and 10.';
  end if;
  if p_approve and p_extra_templates = 0 and p_extra_exports = 0 then
    raise exception 'Approve at least one template or export credit.';
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
      reviewed_by = auth.jwt() ->> 'email',
      approved_templates = case when p_approve then p_extra_templates else 0 end,
      approved_exports = case when p_approve then p_extra_exports else 0 end
  where id = p_request_id;

  insert into public.portal_access_audit_log(
    request_id, admin_email, user_id, user_email, action, template_credits, export_credits, details
  )
  values (
    access_request.id,
    coalesce(auth.jwt() ->> 'email', ''),
    access_request.user_id,
    access_request.email,
    case when p_approve then 'request_approved' else 'request_denied' end,
    case when p_approve then p_extra_templates else 0 end,
    case when p_approve then p_extra_exports else 0 end,
    jsonb_build_object('reason', access_request.reason)
  );
end;
$$;

create or replace function public.grant_portal_credits(
  p_user_id uuid,
  p_extra_templates integer,
  p_extra_exports integer
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_email text;
begin
  if not public.is_portal_admin() then
    raise exception 'Administrator access is required.';
  end if;
  if p_extra_templates is null or p_extra_templates < 0 or p_extra_templates > 1000
     or p_extra_exports is null or p_extra_exports < 0 or p_extra_exports > 1000 then
    raise exception 'Credit values must be between 0 and 1000.';
  end if;
  if p_extra_templates = 0 and p_extra_exports = 0 then
    raise exception 'Grant at least one template or export credit.';
  end if;

  select email into target_email from auth.users where id = p_user_id;
  if not found then
    raise exception 'The user no longer exists.';
  end if;

  insert into public.portal_quotas(user_id, extra_templates, extra_exports)
  values (p_user_id, p_extra_templates, p_extra_exports)
  on conflict (user_id) do update
  set extra_templates = public.portal_quotas.extra_templates + excluded.extra_templates,
      extra_exports = public.portal_quotas.extra_exports + excluded.extra_exports,
      updated_at = now();

  insert into public.portal_access_audit_log(
    admin_email, user_id, user_email, action, template_credits, export_credits
  )
  values (
    coalesce(auth.jwt() ->> 'email', ''), p_user_id, coalesce(target_email, ''),
    'credits_granted', p_extra_templates, p_extra_exports
  );
end;
$$;

drop function if exists public.get_portal_admin_analytics();
create function public.get_portal_admin_analytics()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, auth
as $$
begin
  if not public.is_portal_admin() then
    raise exception 'Administrator access is required.';
  end if;

  return jsonb_build_object(
    'total_users', (select count(*) from auth.users),
    'active_users_30d', (select count(*) from auth.users where last_sign_in_at >= now() - interval '30 days'),
    'signups_30d', (select count(*) from auth.users where created_at >= now() - interval '30 days'),
    'saved_templates', (select count(*) from public.portal_drafts),
    'exports_used', (select coalesce(sum(exports_used), 0) from public.portal_quotas),
    'pending_requests', (select count(*) from public.portal_access_requests where status = 'pending')
  );
end;
$$;

create or replace function public.list_portal_admin_users(p_limit integer default 50, p_offset integer default 0)
returns table(
  account_id uuid,
  email text,
  signed_up_at timestamptz,
  last_sign_in_at timestamptz,
  templates_saved bigint,
  exports_used integer,
  is_admin boolean
)
language plpgsql
stable
security definer
set search_path = public, auth
as $$
begin
  if not public.is_portal_admin() then
    raise exception 'Administrator access is required.';
  end if;

  return query
  select u.id::uuid, coalesce(u.email, '')::text, u.created_at::timestamptz, u.last_sign_in_at::timestamptz,
         count(d.id)::bigint, coalesce(q.exports_used, 0)::integer,
         exists (select 1 from public.portal_admins a where lower(a.email) = lower(coalesce(u.email, '')))::boolean
  from auth.users u
  left join public.portal_drafts d on d.user_id = u.id
  left join public.portal_quotas q on q.user_id = u.id
  group by u.id, u.email, u.created_at, u.last_sign_in_at, q.exports_used
  order by u.created_at desc
  limit greatest(1, least(coalesce(p_limit, 50), 100))
  offset greatest(coalesce(p_offset, 0), 0);
end;
$$;

drop function if exists public.search_portal_admin_users(integer, integer, text, text, text, text, text, text, text);
create function public.search_portal_admin_users(
  p_limit integer default 50,
  p_offset integer default 0,
  p_search text default null,
  p_role text default 'all',
  p_activity text default 'all',
  p_templates text default 'all',
  p_exports text default 'all',
  p_sort_by text default 'signed_up_at',
  p_sort_direction text default 'desc'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  result jsonb;
begin
  if not public.is_portal_admin() then
    raise exception 'Administrator access is required.';
  end if;
  if coalesce(p_role, 'all') not in ('all', 'admin', 'user')
     or coalesce(p_activity, 'all') not in ('all', 'active', 'inactive', 'never')
     or coalesce(p_templates, 'all') not in ('all', 'has', 'none')
     or coalesce(p_exports, 'all') not in ('all', 'has', 'none')
     or coalesce(p_sort_by, 'signed_up_at') not in ('email', 'templates_saved', 'exports_used', 'signed_up_at', 'last_sign_in_at')
     or coalesce(p_sort_direction, 'desc') not in ('asc', 'desc') then
    raise exception 'Invalid user-list filter or sort option.';
  end if;

  with admin_users as (
    select u.id::uuid as account_id,
           coalesce(u.email, '')::text as email,
           u.created_at::timestamptz as signed_up_at,
           u.last_sign_in_at::timestamptz as last_sign_in_at,
           p.last_active_at::timestamptz as last_active_at,
           count(d.id)::bigint as templates_saved,
           coalesce(q.exports_used, 0)::integer as exports_used,
           case
             when exists (
               select 1 from public.portal_admins a
               where lower(a.email) = lower(coalesce(u.email, ''))
             ) then 2147483647
             else (1 + coalesce(q.extra_exports, 0))::integer
           end as exports_allowed,
           coalesce(q.is_locked, false) as is_locked,
           coalesce(q.lock_reason, '')::text as lock_reason,
           exists (
             select 1 from public.portal_admins a
             where lower(a.email) = lower(coalesce(u.email, ''))
           )::boolean as is_admin
    from auth.users u
    left join public.portal_drafts d on d.user_id = u.id
    left join public.portal_quotas q on q.user_id = u.id
    left join public.portal_profiles p on p.user_id = u.id
    group by u.id, u.email, u.created_at, u.last_sign_in_at, q.exports_used, q.extra_exports,
             q.is_locked, q.lock_reason, p.last_active_at
  ),
  filtered as (
    select *
    from admin_users
    where (
        nullif(trim(coalesce(p_search, '')), '') is null
        or position(lower(trim(p_search)) in lower(email)) > 0
      )
      and (
        coalesce(p_role, 'all') = 'all'
        or (p_role = 'admin' and is_admin)
        or (p_role = 'user' and not is_admin)
      )
      and (
        coalesce(p_activity, 'all') = 'all'
        or (p_activity = 'active' and last_sign_in_at >= now() - interval '30 days')
        or (p_activity = 'inactive' and last_sign_in_at < now() - interval '30 days')
        or (p_activity = 'never' and last_sign_in_at is null)
      )
      and (
        coalesce(p_templates, 'all') = 'all'
        or (p_templates = 'has' and templates_saved > 0)
        or (p_templates = 'none' and templates_saved = 0)
      )
      and (
        coalesce(p_exports, 'all') = 'all'
        or (p_exports = 'has' and exports_used > 0)
        or (p_exports = 'none' and exports_used = 0)
      )
  ),
  ordered as (
    select filtered.*,
           row_number() over (
             order by
               case when p_sort_by = 'email' and p_sort_direction = 'asc' then lower(email) end asc nulls last,
               case when p_sort_by = 'email' and p_sort_direction = 'desc' then lower(email) end desc nulls last,
               case when p_sort_by = 'templates_saved' and p_sort_direction = 'asc' then templates_saved end asc nulls last,
               case when p_sort_by = 'templates_saved' and p_sort_direction = 'desc' then templates_saved end desc nulls last,
               case when p_sort_by = 'exports_used' and p_sort_direction = 'asc' then exports_used end asc nulls last,
               case when p_sort_by = 'exports_used' and p_sort_direction = 'desc' then exports_used end desc nulls last,
               case when p_sort_by = 'signed_up_at' and p_sort_direction = 'asc' then signed_up_at end asc nulls last,
               case when p_sort_by = 'signed_up_at' and p_sort_direction = 'desc' then signed_up_at end desc nulls last,
               case when p_sort_by = 'last_sign_in_at' and p_sort_direction = 'asc' then last_sign_in_at end asc nulls last,
               case when p_sort_by = 'last_sign_in_at' and p_sort_direction = 'desc' then last_sign_in_at end desc nulls last,
               account_id
           ) as page_order
    from filtered
  ),
  paged as (
    select *
    from ordered
    where page_order > greatest(coalesce(p_offset, 0), 0)
      and page_order <= greatest(coalesce(p_offset, 0), 0) + greatest(1, least(coalesce(p_limit, 50), 100))
  )
  select jsonb_build_object(
    'total_count', (select count(*) from filtered),
    'users', coalesce(
      (select jsonb_agg(to_jsonb(page) - 'page_order' order by page.page_order) from paged page),
      '[]'::jsonb
    )
  )
  into result;

  return result;
end;
$$;

create or replace function public.remove_portal_user(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_email text;
begin
  if not public.is_portal_admin() then
    raise exception 'Administrator access is required.';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You cannot remove your own administrator account.';
  end if;
  if exists (
    select 1 from public.portal_admins a
    join auth.users u on lower(u.email) = lower(a.email)
    where u.id = p_user_id
  ) then
    raise exception 'Administrator accounts cannot be removed here.';
  end if;

  select email into target_email from auth.users where id = p_user_id;
  if not found then
    raise exception 'The user no longer exists.';
  end if;

  insert into public.portal_access_audit_log(admin_email, user_id, user_email, action)
  values (coalesce(auth.jwt() ->> 'email', ''), p_user_id, coalesce(target_email, ''), 'user_removed');

  delete from auth.users where id = p_user_id;
end;
$$;

alter table public.portal_admins enable row level security;
alter table public.portal_quotas enable row level security;
alter table public.portal_drafts enable row level security;
alter table public.portal_access_requests enable row level security;
alter table public.portal_access_audit_log enable row level security;
alter table public.portal_unlock_requests enable row level security;

drop policy if exists "Users read own portal quota" on public.portal_quotas;
create policy "Users read own portal quota" on public.portal_quotas
for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users read own drafts" on public.portal_drafts;
drop policy if exists "Users insert own drafts" on public.portal_drafts;
drop policy if exists "Users update own drafts" on public.portal_drafts;
drop policy if exists "Users delete own drafts" on public.portal_drafts;
create policy "Users read own drafts" on public.portal_drafts
for select to authenticated using (user_id = auth.uid() or public.is_portal_admin());
create policy "Users insert own drafts" on public.portal_drafts
for insert to authenticated with check (user_id = auth.uid());
create policy "Users update own drafts" on public.portal_drafts
for update to authenticated using (user_id = auth.uid() or public.is_portal_admin())
with check (user_id = auth.uid() or public.is_portal_admin());
create policy "Users delete own drafts" on public.portal_drafts
for delete to authenticated using (user_id = auth.uid());

drop policy if exists "Users read own access requests" on public.portal_access_requests;
create policy "Users read own access requests" on public.portal_access_requests
for select to authenticated using (user_id = auth.uid() or public.is_portal_admin());
drop policy if exists "Admins read access audit log" on public.portal_access_audit_log;
drop policy if exists "Users read own or admin access audit log" on public.portal_access_audit_log;
create policy "Users read own or admin access audit log" on public.portal_access_audit_log
for select to authenticated using (user_id = auth.uid() or public.is_portal_admin());
drop policy if exists "Users read own or admin unlock requests" on public.portal_unlock_requests;
create policy "Users read own or admin unlock requests" on public.portal_unlock_requests
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
grant select on public.portal_access_audit_log to authenticated;
grant select on public.portal_unlock_requests to authenticated;
grant execute on function public.get_my_portal_quota() to authenticated;
grant execute on function public.set_portal_user_lock(uuid, boolean, text) to authenticated;
grant execute on function public.request_portal_unlock(text) to authenticated;
grant execute on function public.review_portal_unlock_request(uuid, boolean) to authenticated;
grant execute on function public.is_portal_admin() to authenticated;
grant execute on function public.reserve_portal_export(text) to authenticated;
grant execute on function public.request_extra_portal_access(text) to authenticated;
grant execute on function public.review_portal_access_request(uuid, boolean, integer, integer) to authenticated;
grant execute on function public.grant_portal_credits(uuid, integer, integer) to authenticated;
grant execute on function public.get_portal_admin_analytics() to authenticated;
grant execute on function public.list_portal_admin_users(integer, integer) to authenticated;
grant execute on function public.search_portal_admin_users(integer, integer, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.remove_portal_user(uuid) to authenticated;
revoke all on function public.get_portal_admin_analytics() from public, anon;
revoke all on function public.list_portal_admin_users(integer, integer) from public, anon;
revoke all on function public.search_portal_admin_users(integer, integer, text, text, text, text, text, text, text) from public, anon;
revoke all on function public.remove_portal_user(uuid) from public, anon;
revoke all on function public.set_portal_user_lock(uuid, boolean, text) from public, anon;
revoke all on function public.request_portal_unlock(text) from public, anon;
revoke all on function public.review_portal_unlock_request(uuid, boolean) from public, anon;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('portal-images', 'portal-images', false, 1048576, array['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = 1048576;

drop policy if exists "Users read their portal images" on storage.objects;
drop policy if exists "Users upload their portal images" on storage.objects;
drop policy if exists "Users update their portal images" on storage.objects;
drop policy if exists "Users delete their portal images" on storage.objects;
drop policy if exists "Admins read portal images" on storage.objects;
create policy "Admins read portal images" on storage.objects
for select to authenticated using (
  bucket_id = 'portal-images' and public.is_portal_admin()
);
create policy "Users read their portal images" on storage.objects
for select to authenticated using (
  bucket_id = 'portal-images' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "Users upload their portal images" on storage.objects
for insert to authenticated with check (
  bucket_id = 'portal-images' and (
    (storage.foldername(name))[1] = auth.uid()::text or public.is_portal_admin()
  )
);
create policy "Users update their portal images" on storage.objects
for update to authenticated using (
  bucket_id = 'portal-images' and (
    (storage.foldername(name))[1] = auth.uid()::text or public.is_portal_admin()
  )
) with check (
  bucket_id = 'portal-images' and (
    (storage.foldername(name))[1] = auth.uid()::text or public.is_portal_admin()
  )
);
create policy "Users delete their portal images" on storage.objects
for delete to authenticated using (
  bucket_id = 'portal-images'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_portal_admin()
  )
);

-- Sign in once with this verified email before running this schema.
delete from public.portal_admins
where lower(email) = 'chrsistianzemog@gmail.com';

insert into public.portal_admins(email)
values ('christianzemog@gmail.com')
on conflict (email) do nothing;
