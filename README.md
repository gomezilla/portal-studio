# Portal Studio

A browser-based editor for the supplied Omada captive-portal template. Authenticated portal drafts are stored in Supabase with row-level security; gallery uploads use a private Supabase Storage bucket.

## Gallery and visual presets

The gallery can contain up to 20 slides. Add JPG, PNG, GIF, or WebP images (up to 1 MB each), replace any slide, or remove stock and uploaded images. The first three looks are Material You, Facebook-inspired, and Gaming / Neon; Ocean, Sunset, Forest, Midnight, and Rose are also included.

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

Create a portal from the dashboard, then edit its content, plan rows, display options, theme preset, brand color, corner style, and gallery images. The **Main** preset uses `#2359d4`. The Content tab has guest Terms of Service acceptance turned off by default; enable it to require agreement before connecting. Edit the plain-text terms there; the linked terms open in a prompt. Review and adapt the sample terms to the network's real practices and applicable laws. Omada authentication messages appear in an accessible prompt dialog instead of inline red text. The appearance icon in the top bar cycles the editor through device, light, and dark modes. The editor autosaves drafts locally and supports multiple portals. Choose **Export ZIP** to download an Omada-ready archive containing the customized `index.html`, the original authentication and speed-test scripts, stylesheets, and required template images. Replaced gallery images are included in the archive.

The Content tab has seven steps: portal basics, gallery images, access method, plans, connection guide, speed card, and finishing touches. Choose a dropdown or tabs for access methods, and a dropdown or prompt for plans and the guide. Prompts open at the beginning and can be dismissed with a close button, Escape, or a click outside. The guide supports up to 20 steps with optional JPG, PNG, GIF, or WebP images of at most 500 KB each; existing images are preserved until replaced. The editor's **Message Prompt** tab customizes the Omada authentication result messages included in exported templates. Authentication failures offer a Retry button; after successful authentication, the success prompt is shown for three seconds before redirecting.

The live preview supports mobile and desktop layouts, fits the chosen viewport to the available space, and offers zoom controls. Browser-style chrome surrounds the preview, while its canvas matches the portal background. It starts with Voucher only; use the preview checkboxes in the access-method step to try other methods. These checkboxes do not change Omada's configuration. Access-method labels can be edited in the same step and are included in exports; the deployed portal uses the methods enabled in Omada, with Voucher first when enabled. Color mode can follow the visitor's device or be fixed to light or dark, and the preview follows that selected setting. The preview-only theme control lets you inspect the opposite mode without changing the saved setting.

Saved portal cards show the last-edited date and time. Lock a card to prevent accidental editing and deletion; open it read-only to preview or export, or unlock it from the card or editor to edit again. Duplicates are unlocked. This is a convenience safeguard, not a security boundary or protection against simultaneous changes from another device.

The portal's Wi-Fi icon turns green when a small connectivity check to `speed.cloudflare.com` succeeds and gray when access is not confirmed. The check runs even if the speed card is hidden, sends the visitor's IP address to Cloudflare, and may remain gray if pre-authentication access, browser policy, or the endpoint is blocked; gray does not necessarily mean the network has no internet. Allow `speed.cloudflare.com` in Omada pre-authentication access for the check to work before login.

After exporting, Portal Studio shows a dismissible success panel with an optional InstaPay QR contribution. The heart menu offers the support prompt, a link to star the GitHub project, and feedback or suggestions through a new public GitHub issue (GitHub sign-in is required to submit). Review the issue before posting and avoid sharing private information. The theme control and notifications bell remain visible in the top bar; account, feature, and admin actions are grouped under the menu icon. Notifications show pending administrator requests and access request decisions with approved credit totals. Creating a draft does not interrupt the editor with a donation prompt. The exported portal and Portal Studio include a non-editable “Made by Gomezilla Portal Studio” attribution.

Create an account with a unique, case-insensitive username and an email and password. Usernames use 3–30 letters, numbers, or underscores; sign-in still uses email. Existing users are prompted to choose a username. Signed-in users and administrators can change their password from the top menu. New accounts may need to verify their email before signing in, depending on the Supabase project's email-confirmation setting. Existing users can use **Forgot password?** to set a password; the reset link returns to the site and opens the new-password form automatically. In Supabase Authentication → URL Configuration, allow `https://gomezilla.github.io/portal-studio/` as a redirect URL. If Supabase's built-in email service reaches its rate limit, wait before requesting another email; configure custom SMTP in Supabase Dashboard → Authentication → SMTP Settings for reliable delivery.

The workspace greets signed-in users by their saved username according to the device's local time; signed-out visitors see a generic greeting. The offline copy uses a generic greeting because it has no user accounts.

The notification bell shows the newest five updates first, with a Show all control, mark-all-read and clear actions. Read and cleared status syncs to the account; clearing does not delete the underlying requests or audit records. The administrator user table shows last active separately from last login. Activity is recorded on sign-in and at most once every five minutes during interaction; it is not an exact presence indicator. The existing sign-in activity filters and analytics continue to use last login.

## Template source

The files in `template/` are bundled from the supplied `omada-portal-template` folder. Keep the portal files in the exported ZIP together when uploading the portal to an Omada controller.

## GitHub Pages

Live site: [https://gomezilla.github.io/portal-studio/](https://gomezilla.github.io/portal-studio/)

Source: [github.com/gomezilla/portal-studio](https://github.com/gomezilla/portal-studio)

Supabase must be configured by running the schema and enabling email/password authentication before visitors can save or export. Until setup is complete, the hosted app fails closed instead of falling back to insecure client-side quotas.

## Account quotas and approval workflow

The app uses Supabase email/password authentication, private image storage, database-enforced starting limits of one saved portal and three exports for new accounts, and administrator review of requests. Existing accounts keep their existing export allowances. New account creation is limited to two accounts per browser device registration, enforced by a database trigger; clearing browser site data or changing the client registration can create a new identifier, so this is an abuse deterrent rather than strong device identity verification. Image uploads are capped at 1 MB per file in both the editor and Supabase Storage. The browser publishable key is in `supabase-config.js`; it is designed for public use and is protected by Supabase row-level security. Never put a Supabase service-role key in the website.

To activate account saving and approvals for a Supabase project:

1. Enable email/password sign-in. In Supabase Authentication → Users, confirm an account exists for `christianzemog@gmail.com`. The SQL schema adds an administrator allowlist entry; it does not create an Auth account or set its password. If this account previously used magic links, use **Forgot password?** on the sign-in form. If it does not exist, create it through the app and verify its email before signing in. The administrator must set their initial password through Supabase Auth or the email reset flow; never place an initial password in the public app.
2. Before deploying the updated website, run [`supabase/schema.sql`](./supabase/schema.sql) in Supabase **SQL Editor**. This creates the profile and notification-state tables and migrates existing users to profiles without usernames; the app prompts those users to choose one. Its final statement registers the verified administrator email; it is safe to run again.
3. In **Authentication → URL Configuration**, set the site URL to `https://gomezilla.github.io/portal-studio/` and add it to the redirect URLs.
4. Configure email confirmation as desired. If the schema or auth setup is incomplete, account saving/export remain unavailable rather than falling back to an insecure client-side quota.

Admin approvals record and display the number of template and export credits granted. The administrator can also grant credits directly, open a user's saved templates from their clickable email, edit those templates, and export them without account quotas. The admin dashboard shows total allowed exports, signup and last-login dates with local times, account-lock controls, pending unlock requests, and an activity log for approvals, denials, credit grants, account locks, and user removals. A locked account cannot create or export portals; it can submit one unlock request at a time with a written justification. Admin accounts cannot be locked. Admin accounts have unlimited saved portals and exports. The user list supports email search, role/activity/portal/export filters, and server-side sorting across the full list. User removal permanently deletes their account, drafts, quota records, requests, and uploaded images. The admin dashboard, audit log, account-creation limit, and updated SQL RPCs are available only after the current `supabase/schema.sql` has been run. Rerunning the schema applies the latest database changes. Notification items become read when clicked and their unread state is saved to the account. The app does not send email notifications for new requests or approval results. The 2 MB ZIP limit is separate from the per-account export allowance.

Administrators can send plain-text notifications to all current accounts or up to 500 selected existing account email addresses. Recipients see them in the notification bell; read and clear status syncs with their account. Notifications are not email. Only a full administrator can grant or revoke individual delegated permissions: review access requests, review unlock requests, grant credits, lock/unlock accounts, view users and portals, or send notifications. Delegated user/portal viewing is read-only and does not permit editing or exporting other users' portals. Approving access requests requires both review and credit-grant permissions; delegates cannot approve their own requests or grant themselves credits. Permission changes and broadcasts are recorded in the administrator activity log. Permissions are enforced by database policies and functions, and delegates cannot grant permissions or remove users.

The app does not collect IP addresses for signup limits. IP-only account limits can affect many legitimate users on a shared network and are unreliable with VPNs or changing addresses; use Supabase Auth's built-in rate limits and bot protections instead.

## Offline copy

The no-account offline edition is maintained separately in a private repository; access requires the repository owner's authorization. Its source and macOS installer are not distributed in this public repository. The offline edition saves drafts and gallery images in browser IndexedDB and does not require Supabase for editing or export. Browser drafts are local to that browser and can be lost if its site data is cleared, so keep ZIP backups.
