const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

(async () => {
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'portfolio.js')],
    bundle: true,
    loader: {'.jpg': 'dataurl', '.pdf': 'binary'},
    format: 'iife',
    minify: true,
    outfile: path.join(__dirname, 'site-portfolio.js'),
  });
  const css = ['portfolio.css', 'cat-album.css', 'paw-cursor.css']
    .map(file => fs.readFileSync(path.join(__dirname, file), 'utf8')).join('\n');
  fs.writeFileSync(path.join(__dirname, 'site.css'), css);
  fs.writeFileSync(path.join(__dirname, 'index.html'), fs.readFileSync(path.join(__dirname, 'shell.html')));
  console.log('Built Alice Wonderlab. Serve this directory over HTTP to preview.');
})().catch(error => { console.error(error); process.exitCode = 1; });
