import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {createTapTracker} from './tap-tracker.mjs';
import {Matrix4,Vector3,Quaternion} from 'three';

const pointer=(id,x=0,y=0)=>({pointerId:id,clientX:x,clientY:y});
const tap=createTapTracker();
tap.start(pointer(1));assert(tap.end(pointer(1,2)));
tap.start(pointer(1));tap.move(pointer(1,30));tap.move(pointer(1));assert(!tap.end(pointer(1)));
tap.start(pointer(1));tap.start(pointer(2,50));assert(!tap.end(pointer(2,50)));assert(!tap.end(pointer(1)));
tap.start(pointer(1));tap.cancel(pointer(1));assert(!tap.end(pointer(1)));
tap.start(pointer(2));assert(tap.end(pointer(2))); // next gesture recovers

// Exercise the real streaming loader, including reordering, profile selection,
// and an incomplete download. This does not need a WebGL/browser context.
const expected=Buffer.from('The café and its three cats. '.repeat(500));
const gzip=gzipSync(expected);
const chunks=[gzip.subarray(0,20),gzip.subarray(20,40),gzip.subarray(40)];
const fixture={originalBytes:expected.length,chunks:chunks.map((b,i)=>({file:`part-${i}`,bytes:b.length}))};
async function checkLoader(mobile,broken=false){
  const requests=[],events=[];
  const dispatchEvent=event=>events.push(event);
  const context=vm.createContext({dispatchEvent,matchMedia:()=>({matches:mobile}),ReadableStream,DecompressionStream,Response,Uint8Array,Event,CustomEvent,
    fetch:async name=>{requests.push(name);if(name.endsWith('.json'))return new Response(JSON.stringify(fixture));const i=Number(name.slice(5));if(i===0)await new Promise(r=>setTimeout(r,10));return new Response(broken&&i===1?chunks[i].subarray(1):chunks[i]);}});
  context.window=context;
  const window=context;
  vm.runInContext(fs.readFileSync('model-loader.js','utf8'),context);
  if(broken){await assert.rejects(window.loadIslandModel(),/Incomplete/);assert(events.some(e=>e.type==='alice:load-error'));}
  else{assert.deepEqual(Buffer.from(await window.loadIslandModel()),expected);assert(events.some(e=>e.type==='alice:load-progress'&&e.detail===100));}
  assert.equal(requests[0],mobile?'model-mobile-manifest.json':'model-manifest.json');
}
await checkLoader(false);await checkLoader(true);await checkLoader(true,true);

function model(name){
  const manifest=JSON.parse(fs.readFileSync(name));
  const chunks=manifest.chunks.map(c=>{const data=fs.readFileSync(c.file);assert.equal(data.length,c.bytes);assert.equal(createHash('sha256').update(data).digest('hex'),c.sha256);return data;});
  const data=gunzipSync(Buffer.concat(chunks));
  assert.equal(data.length,manifest.originalBytes);
  assert.equal(createHash('sha256').update(data).digest('hex'),manifest.originalSha256);
  return {manifest,json:JSON.parse(data.subarray(20,20+data.readUInt32LE(12)).toString())};
}
const original=model('model-manifest.json'),mobile=model('model-mobile-manifest.json');
assert.equal(mobile.manifest.sourceSha256,original.manifest.originalSha256);
// Exact named parent/child relationships and transforms keep raycasts, cat
// animations, repair props and all navigation anchors attached correctly.
function sceneStructure(json){return json.nodes.map(n=>({name:n.name,children:(n.children||[]).map(i=>json.nodes[i].name)}));}
assert.deepEqual(sceneStructure(mobile.json),sceneStructure(original.json));
function matrix(n){return n.matrix||new Matrix4().compose(new Vector3(...(n.translation||[0,0,0])),new Quaternion(...(n.rotation||[0,0,0,1])),new Vector3(...(n.scale||[1,1,1]))).elements;}
original.json.nodes.forEach((node,i)=>matrix(node).forEach((value,j)=>assert(Math.abs(value-matrix(mobile.json.nodes[i])[j])<1e-5,`Transform changed: ${node.name}`)));
assert.equal(mobile.json.meshes.length,original.json.meshes.length);
assert.equal(mobile.json.materials.length,original.json.materials.length);
assert(mobile.manifest.compressedBytes<original.manifest.compressedBytes*.4);
console.log('Mobile checks passed: taps/pinches, streaming/recovery, both model profiles, all scene objects and transforms preserved.');
