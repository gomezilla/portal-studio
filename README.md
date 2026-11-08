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

Create a portal from the dashboard, then edit its content, plan rows, display options, theme preset, brand color, corner style, and gallery images. The appearance icon in the top bar cycles the editor through device, light, and dark modes. The editor autosaves drafts locally and supports multiple portals. Choose **Export ZIP** to download an Omada-ready archive containing the customized `index.html`, the original authentication and speed-test scripts, stylesheets, and required template images. Replaced gallery images are included in the archive.

Each of the three connection-guide steps has its own sample image control. Replace a sample with a JPG, PNG, GIF, or WebP up to 5 MB, or remove it to omit that image from the preview and exported ZIP.

The live preview opens in mobile size by default; switch to desktop to inspect the wider layout. Color mode can follow the visitor's device or be fixed to light or dark, and the preview follows that selected setting. The preview-only theme control lets you inspect the opposite mode without changing the saved setting.

After exporting, Portal Studio shows a dismissible success panel with an optional InstaPay QR contribution. A **Support** button in the header opens the same contribution page anytime. Creating a draft does not interrupt the editor with a donation prompt. The exported portal and Portal Studio include a non-editable “Made by Gomezilla Portal Studio” attribution.

Create an account or sign in with an email and password. Signed-in users and administrators can change their password from the top menu. New accounts may need to verify their email before signing in, depending on the Supabase project's email-confirmation setting. Existing users can use **Forgot password?** to set a password; the reset link returns to the site and opens the new-password form automatically. In Supabase Authentication → URL Configuration, allow `https://gomezilla.github.io/portal-studio/` as a redirect URL. If Supabase's built-in email service reaches its rate limit, wait before requesting another email; configure custom SMTP in Supabase Dashboard → Authentication → SMTP Settings for reliable delivery.

## Template source

The files in `template/` are bundled from the supplied `omada-portal-template` folder. Keep the portal files in the exported ZIP together when uploading the portal to an Omada controller.

## GitHub Pages

Live site: [https://gomezilla.github.io/portal-studio/](https://gomezilla.github.io/portal-studio/)

Source: [github.com/gomezilla/portal-studio](https://github.com/gomezilla/portal-studio)

Supabase must be configured by running the schema and enabling email/password authentication before visitors can save or export. Until setup is complete, the hosted app fails closed instead of falling back to insecure client-side quotas.

## Account quotas and approval workflow

The app uses Supabase email/password authentication, private image storage, database-enforced one-saved-portal and one-export starting limits, and administrator review of requests for one additional portal/export. The browser publishable key is in `supabase-config.js`; it is designed for public use and is protected by Supabase row-level security. Never put a Supabase service-role key in the website.

To activate account saving and approvals for a Supabase project:

1. Enable email/password sign-in. In Supabase Authentication → Users, confirm an account exists for `christianzemog@gmail.com`. The SQL schema adds an administrator allowlist entry; it does not create an Auth account or set its password. If this account previously used magic links, use **Forgot password?** on the sign-in form. If it does not exist, create it through the app and verify its email before signing in. The administrator must set their initial password through Supabase Auth or the email reset flow; never place an initial password in the public app.
2. In Supabase **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql). Its final statement registers the verified administrator email; it is safe to run again.
3. In **Authentication → URL Configuration**, set the site URL to `https://gomezilla.github.io/portal-studio/` and add it to the redirect URLs.
4. Configure email confirmation as desired. If the schema or auth setup is incomplete, account saving/export remain unavailable rather than falling back to an insecure client-side quota.

Each approved request grants a regular account one additional saved portal and one additional export. Admin accounts have unlimited saved portals and exports. The administrator can open **Admin dashboard** to view signup dates, account tenure, idle time, saved-portal/export counts, analytics, pending requests, and remove non-admin users. The user list supports email search, role/activity/portal/export filters, and server-side sorting across the full list. User removal permanently deletes their account, drafts, quota records, requests, and uploaded images. The admin dashboard, unlimited admin quota enforcement, and new SQL RPCs are available only after the current `supabase/schema.sql` has been run. Rerunning the current schema drops and recreates the analytics and user-search RPCs to repair outdated return types and update user-list filtering/sorting. Approval decisions currently appear in the dashboard; the app does not send email notifications for new requests or approval results. The 2 MB ZIP limit is separate from the per-account export allowance.

## Offline copy

A separate no-authentication version is available in `/Users/system32/Documents/omada-portal-studio-offline`. Run `python3 -m http.server 4173` from that folder and open `http://localhost:4173`. It saves drafts and gallery images in browser IndexedDB with no account or template/export-count limits. The strict under-2-MB ZIP limit still applies. In a supported browser, choose the `saved-portals/` folder from the editor to write ZIP exports there; otherwise exports use the browser's regular download flow. Browser drafts are local to that browser and can be lost if its site data is cleared, so keep ZIP backups.

For macOS, use the [Portal Studio Offline DMG installer](../omada-portal-studio-offline/dist/Portal-Studio-Offline-macOS.dmg). It is built for Apple Silicon and is locally signed but not Apple-notarized, so macOS may require Control-click → **Open** the first time.
