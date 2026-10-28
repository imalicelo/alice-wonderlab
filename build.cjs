const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const {createHash} = require('node:crypto');

(async () => {
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'portfolio.js')],
    bundle: true,
    loader: {'.jpg': 'dataurl', '.pdf': 'binary'},
    format: 'iife',
    minify: true,
    outfile: path.join(__dirname, 'site-portfolio.js'),
  });
  const css = ['portfolio.css', 'cat-album.css', 'paw-cursor.css', 'mobile.css']
    .map(file => fs.readFileSync(path.join(__dirname, file), 'utf8')).join('\n');
  fs.writeFileSync(path.join(__dirname, 'site.css'), css);
  const html = fs.readFileSync(path.join(__dirname, 'shell.html'), 'utf8')
    .replace(/(src|href)="(model-loader\.js|legacy-00\.js|site\.css|site-portfolio\.js)(?:\?[^"\s]*)?"/g, (_,attribute,file) => {
      const version = createHash('sha256').update(fs.readFileSync(path.join(__dirname,file))).digest('hex').slice(0,12);
      return `${attribute}="${file}?v=${version}"`;
    });
  fs.writeFileSync(path.join(__dirname, 'index.html'), html);
  console.log('Built Alice Wonderlab. Serve this directory over HTTP to preview.');
})().catch(error => { console.error(error); process.exitCode = 1; });
