# Portal Studio

- This repository contains the public online editor. The offline edition is maintained separately in a private repository; do not copy private content, user drafts, exports, credentials, or unpublished changes here without authorization.
- When a requested change applies to both editions, inspect and adapt each implementation independently; do not assume their files are identical or introduce Supabase dependencies into the offline edition.
- Account authorization, quotas, and delegated permissions are enforced in `supabase/schema.sql`. Test database changes and document migration requirements; do not claim a live migration occurred unless verified.
- Serve the editor with `python3 -m http.server 4173`, run `node --check app.js`, and use targeted browser or database checks for changed behavior. See the README for setup and export constraints.
- If an offline installer update is requested, rebuild and verify it in the offline repository; do not add it to this public repository.
