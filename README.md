# Portal Studio

A browser-based editor for the supplied Omada captive-portal template. Authenticated portal drafts are stored in Supabase with row-level security; gallery uploads use a private Supabase Storage bucket.

## Gallery and visual presets

The gallery can contain up to 20 slides. Add JPG, PNG, GIF, or WebP images (up to 5 MB each), replace any slide, or remove stock and uploaded images. The first three looks are Material You, Facebook-inspired, and Gaming / Neon; Ocean, Sunset, Forest, Midnight, and Rose are also included.

## Speed-test access

The speed-test card can be enabled or disabled in the editor. When enabled, add both `speed.cloudflare.com` and `ipwho.is` to **Omada Controller → Portal → Access Control → Pre-authentication Access** so visitors can run the test before authentication. Disabling the card also removes the speed-test script from the exported portal.

## Export size

The editor calculates the actual ZIP archive size and allows export only when it is below 2,000,000 bytes (2 MB). Removing unused gallery slides reduces the ZIP; replacing large photos with smaller, optimized JPG or WebP images can reduce it further.

## Run locally

From this directory, start a local static server:

```sh
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173). The editor fetches the bundled files under `template/`, so it must be served over HTTP rather than opened directly as a `file://` page.

## Customize and export

Create a portal from the dashboard, then edit its content, plan rows, display options, theme preset, brand color, corner style, and gallery images. The editor autosaves drafts locally and supports multiple portals. Choose **Export ZIP** to download an Omada-ready archive containing the customized `index.html`, the original authentication and speed-test scripts, stylesheets, and required template images. Replaced gallery images are included in the archive.

Color mode can follow the visitor's device or be fixed to light or dark. The preview-only theme control lets you inspect both modes without changing the saved setting.

## Template source

The files in `template/` are bundled from the supplied `omada-portal-template` folder. Keep the portal files in the exported ZIP together when uploading the portal to an Omada controller.

## GitHub Pages

Live site: [https://gomezilla.github.io/portal-studio/](https://gomezilla.github.io/portal-studio/)

Source: [github.com/gomezilla/portal-studio](https://github.com/gomezilla/portal-studio)

Supabase must be configured by running the schema and enabling email authentication before visitors can save or export. Until setup is complete, the app fails closed instead of falling back to insecure local quotas.

## Account quotas and approval workflow

The app uses Supabase email magic-link authentication, private image storage, database-enforced one-saved-portal and one-export starting limits, and administrator review of requests for one additional portal/export. The browser publishable key is in `supabase-config.js`; it is designed for public use and is protected by Supabase row-level security. Never put a Supabase service-role key in the website.

To activate account saving and approvals for a Supabase project:

1. In Supabase **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql).
2. In that SQL file's final statement, replace `REPLACE_WITH_ADMIN_EMAIL` with the administrator's verified email and run the statement. This keeps the admin address out of the public app configuration.
3. In **Authentication → URL Configuration**, set the site URL to `https://gomezilla.github.io/portal-studio/` and add it to the redirect URLs.
4. Enable email sign-in/magic links. Users need a verified account to save or export. If the schema or auth setup is incomplete, account saving/export remain unavailable rather than falling back to an insecure client-side quota.

Each approved request grants that account one additional saved portal and one additional export. The administrator reviews pending requests in the dashboard. The 2 MB ZIP limit is separate from the per-account export allowance.
