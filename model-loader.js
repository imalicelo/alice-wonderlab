// Select once per visit, so rotating a phone never downloads a second model.
window.islandMobile = matchMedia('(max-width:700px), (pointer:coarse), (max-height:500px) and (max-width:1000px)').matches;
// All requests stay on this site's origin. Desktop keeps the original GLB.
async function readIslandModel() {
  const manifestResponse = await fetch(window.islandMobile ? 'model-mobile-manifest.json' : 'model-manifest.json');
  if (!manifestResponse.ok) throw new Error('Could not load island manifest.');
  const manifest = await manifestResponse.json();
  let received = 0, index = 0;
  const total = manifest.chunks.reduce((sum,part)=>sum+part.bytes,0);
  const pending = new Map();
  function prefetch(index) {
    if (index >= manifest.chunks.length) return;
    const promise = (async () => {
      const chunk = manifest.chunks[index];
      const response = await fetch(chunk.file);
      if (!response.ok) throw new Error('Could not load island part ' + (index + 1));
      const data = await response.arrayBuffer();
      if (data.byteLength !== chunk.bytes) throw new Error('Incomplete island download.');
      received += data.byteLength;
      window.dispatchEvent(new CustomEvent('alice:load-progress',{detail:Math.round(received/total*100)}));
      return new Uint8Array(data);
    })();
    // A future chunk may fail before it is pulled; surface it through the stream.
    promise.catch(()=>{});
    pending.set(index,promise);
  }
  prefetch(0);prefetch(1);
  const source = new ReadableStream({async pull(controller) {
    if(index===manifest.chunks.length){controller.close();return;}
    try {
      const data=await pending.get(index);
      pending.delete(index++);
      controller.enqueue(data);
      prefetch(index+1);
    } catch(error) {controller.error(error);}
  }});
  // Decompress incrementally instead of retaining a full compressed Blob too.
  const stream = source.pipeThrough(new DecompressionStream('gzip'));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  if (bytes.byteLength !== manifest.originalBytes) throw new Error('Invalid island model.');
  return bytes;
};

window.loadIslandModel=()=>readIslandModel().catch(error=>{window.dispatchEvent(new Event('alice:load-error'));throw error;});
