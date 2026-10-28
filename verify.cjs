const fs = require('node:fs');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const vm = require('node:vm');
const path = require('node:path');
process.chdir(__dirname);
const manifest = JSON.parse(fs.readFileSync('model-manifest.json'));
const parts = manifest.chunks.map(chunk => {
  const data = fs.readFileSync(chunk.file);
  if (data.length !== chunk.bytes || crypto.createHash('sha256').update(data).digest('hex') !== chunk.sha256)
    throw new Error('Invalid model chunk: ' + chunk.file);
  return data;
});
const original = zlib.gunzipSync(Buffer.concat(parts));
if (crypto.createHash('sha256').update(original).digest('hex') !== manifest.originalSha256)
  throw new Error('Model differs from the saved Stage125 original.');
const html = fs.readFileSync('index.html', 'utf8');
for (const match of html.matchAll(/<script\b[^>]*\ssrc="([^"]+)"/g)) {
  const file = match[1].split('?')[0];
  if (!fs.existsSync(file)) throw new Error('Missing script: ' + match[1]);
  new vm.Script(fs.readFileSync(file, 'utf8'), {filename: file});
}
for (const name of fs.readdirSync('.')) {
  if (fs.statSync(name).isFile() && fs.statSync(name).size > 25 * 1024 * 1024)
    throw new Error('File exceeds browser upload limit: ' + name);
}
console.log('Verified: original model unchanged, all chunks intact, runtime syntax valid, upload sizes valid.');
