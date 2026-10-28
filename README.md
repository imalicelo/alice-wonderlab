# Alice Wonderlab

Wanyi Wei’s interactive 3D island portfolio: a seaside tea café, work experience, projects, a milk-tea skills game, and a family album starring Crème, Sesame and Pudding.

Live website: https://imalicelo.github.io/alice-wonderlab/

## Website

The site is static and runs directly from `index.html` on GitHub Pages. English and Simplified Chinese are included. Music starts after a visitor interaction and has an off control. Desktop visitors see a cat-paw cursor.

This release preserves the saved Stage125 design, interactions, résumé, and original 3D model. The model is gzip-compressed without loss and split into files under 25 MiB; the browser assembles and decompresses it before rendering. It is a detailed scene, so the first visit requires a substantial download. A recent browser with WebGL and DecompressionStream support is recommended.

## Editing

- `content.json`, `content-zh.json`: portfolio text.
- `portfolio.js`, `portfolio.css`: main interface and interactions.
- `cat-credits.js`, `cat-album.css`: cat photo album.
- `localization.js`: interface translations.
- `wanyi-wei-resume.pdf`: downloadable résumé.
- `legacy-*.js`, `shell.html`: preserved scene viewer and scene setup.

Run `npm ci`, then `npm run build` after editing. Run `npm run check` to verify the model, runtime scripts and file sizes. Preview by serving this directory with a local HTTP server, for example `python3 -m http.server 8114`.

GitHub Pages publishes `main` from the repository root. Commit the generated `index.html`, `site.css` and `site-portfolio.js` with source changes. No API keys or runtime credentials are required.

## Credits

See `AUDIO_CREDITS.txt`, `TOOLKIT_LOGO_CREDITS.txt`, and `PHOTO_TREATMENT.txt`. Cat photographs are Alice’s original photos; the album uses subtle display-only lighting adjustments. Artwork, photographs, résumé and music are not granted an additional reuse license by this repository.
