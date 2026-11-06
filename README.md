# Portal Studio

A browser-based editor for the supplied Omada captive-portal template. Portal drafts are stored in the browser's IndexedDB; they are not uploaded to a service.

## Gallery and visual presets

The gallery can contain up to 20 slides. Add JPG, PNG, GIF, or WebP images (up to 5 MB each), replace any slide, or remove stock and uploaded images. The first three looks are Material You, Facebook-inspired, and Gaming / Neon; Ocean, Sunset, Forest, Midnight, and Rose are also included.

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

Drafts remain in each visitor's browser and are not shared across devices.
