import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {simplifyPrimitive, textureCompress, weld} from '@gltf-transform/functions';
import {MeshoptSimplifier} from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
import {gzipSync, gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';

// Keep every named object and its hierarchy: the island interactions use them.
const original = JSON.parse(fs.readFileSync('model-manifest.json'));
const source = gunzipSync(Buffer.concat(original.chunks.map(c => fs.readFileSync(c.file))));
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.readBinary(source);
const before = doc.getRoot().listNodes().map(n => n.getName()).sort();
const triangleCount = () => doc.getRoot().listMeshes().reduce((sum,mesh) => sum + mesh.listPrimitives().reduce((n,p) => n+(p.getIndices()?.getCount()||0)/3,0),0);
const originalTriangles = triangleCount();
await MeshoptSimplifier.ready;
await doc.transform(weld());
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    // Tiny props and text retain their geometry; detailed sculpts get an LOD.
    if ((prim.getIndices()?.getCount()||0) > 6000)
      simplifyPrimitive(prim, {simplifier:MeshoptSimplifier, ratio:.2, error:.0025});
  }
}
await doc.transform(textureCompress({encoder:sharp, resize:[1024,1024]}));
// Round insignificant float noise without introducing a decoder or moving nodes.
// UV precision stays well below one pixel at the mobile texture resolution.
const rounded=new Set();
for(const mesh of doc.getRoot().listMeshes())for(const prim of mesh.listPrimitives()) {
  for(const semantic of prim.listSemantics()) {
    const accessor=prim.getAttribute(semantic),array=accessor.getArray();
    if(rounded.has(accessor)||!(array instanceof Float32Array))continue;
    const precision=/^(NORMAL|TANGENT)/.test(semantic)?1000:10000;
    for(let i=0;i<array.length;i++)array[i]=Math.round(array[i]*precision)/precision;
    rounded.add(accessor);
  }
}
if (JSON.stringify(before)!==JSON.stringify(doc.getRoot().listNodes().map(n=>n.getName()).sort()))
  throw new Error('Mobile model lost a named scene object.');
const bytes = Buffer.from(await io.writeBinary(doc));
const compressed = gzipSync(bytes,{level:9});
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const previousChunks=fs.existsSync('model-mobile-manifest.json')?JSON.parse(fs.readFileSync('model-mobile-manifest.json')).chunks:[];
const chunks = [];
for (let offset=0,index=0;offset<compressed.length;offset+=10*1024*1024,index++) {
  const part=compressed.subarray(offset,Math.min(compressed.length,offset+10*1024*1024));
  const file=`scene-mobile-${String(index).padStart(2,'0')}.bin`;
  fs.writeFileSync(file,part); chunks.push({file,bytes:part.length,sha256:hash(part)});
}
const manifest={...original,originalBytes:bytes.length,originalSha256:hash(bytes),chunks,
  sourceSha256:original.originalSha256,variant:'mobile',originalTriangles,triangles:triangleCount(),
  compressedBytes:compressed.length,textureMaxSize:1024};
fs.writeFileSync('model-mobile-manifest.json',JSON.stringify(manifest,null,2)+'\n');
for(const old of previousChunks)if(!chunks.some(c=>c.file===old.file))fs.unlinkSync(old.file);
console.log(JSON.stringify({originalTriangles,mobileTriangles:manifest.triangles,originalBytes:source.length,mobileBytes:bytes.length,downloadBytes:compressed.length,chunks:chunks.length},null,2));
