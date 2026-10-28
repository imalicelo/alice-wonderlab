# Alice Wonderlab

Wanyi Wei’s interactive 3D island portfolio: a seaside tea café, work experience, projects, a milk-tea skills game, and a family album starring Crème, Sesame and Pudding.

Live website: https://imalicelo.github.io/alice-wonderlab/

## Website

The site is static and runs directly from `index.html` on GitHub Pages. English and Simplified Chinese are included. Music starts after a visitor interaction and has an off control. Desktop visitors see a cat-paw cursor.

Desktop uses the original Stage125 3D model. Phones and touch devices use a separate lightweight model with the same named objects, hierarchy and interactions, fewer triangles, and textures capped at 1024 pixels. Its compressed download is about 68 MB, compared with 194 MB for the original. Both profiles stream gzip fragments from this site and show loading progress. The profile is selected once per visit; rotating a phone does not trigger another download. The scene still requires a substantial first download and a recent browser with WebGL 2 and DecompressionStream support.

Phone layouts include safe-area spacing, larger touch controls, scrollable sheets with pinned close/download controls, a compact landscape dock, and a tap action beside the 3D tea cup. Drag/pinch gestures are separated from object taps. Mobile rendering limits pixel density, skips the extra bloom pass, and pauses the background scene while reading a panel.

## Editing

- `content.json`, `content-zh.json`: portfolio text.
- `portfolio.js`, `portfolio.css`: main interface and interactions.
- `mobile.css`, `tap-tracker.mjs`: mobile layout and gesture handling.
- `cat-credits.js`, `cat-album.css`: cat photo album.
- `localization.js`: interface translations.
- `wanyi-wei-resume.pdf`: downloadable résumé.
- `legacy-*.js`, `shell.html`: preserved scene viewer and scene setup.

Run `npm ci`, then `npm run build` after editing. Run `npm run check` to verify the model, runtime scripts and file sizes. Preview by serving this directory with a local HTTP server, for example `python3 -m http.server 8114`.

`npm run build:mobile` rebuilds the mobile variant from the original model fragments; normal UI/content edits do not require this. Commit its generated manifest and fragments together. Checks cover both fragment sets, unchanged scene object relationships and transforms, streaming failures, and tap/drag/pinch behavior. Responsive browser QA covers 320×568, 390×844, 430×932 and 844×390; this is viewport testing, not certification on physical iOS/Android devices.

GitHub Pages publishes `main` from the repository root. Commit the generated `index.html`, `site.css` and `site-portfolio.js` with source changes. No API keys or runtime credentials are required.

## Credits

See `AUDIO_CREDITS.txt`, `TOOLKIT_LOGO_CREDITS.txt`, and `PHOTO_TREATMENT.txt`. Cat photographs are Alice’s original photos; the album uses subtle display-only lighting adjustments. Artwork, photographs, résumé and music are not granted an additional reuse license by this repository.
