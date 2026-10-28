// Lossless transport for the original GLB. All requests stay on this site's origin.
window.loadIslandModel = async function loadIslandModel() {
  const manifestResponse = await fetch('model-manifest.json');
  if (!manifestResponse.ok) throw new Error('Could not load island manifest.');
  const manifest = await manifestResponse.json();
  const parts = new Array(manifest.chunks.length);
  let next = 0;
  async function worker() {
    while (next < manifest.chunks.length) {
      const index = next++;
      const chunk = manifest.chunks[index];
      const response = await fetch(chunk.file);
      if (!response.ok) throw new Error('Could not load island part ' + (index + 1));
      const data = await response.arrayBuffer();
      if (data.byteLength !== chunk.bytes) throw new Error('Incomplete island download.');
      parts[index] = data;
    }
  }
  await Promise.all(Array.from({length: 3}, worker));
  const stream = new Blob(parts).stream().pipeThrough(new DecompressionStream('gzip'));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  if (bytes.byteLength !== manifest.originalBytes) throw new Error('Invalid island model.');
  return bytes;
};
