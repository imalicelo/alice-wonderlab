// User-supplied recording, played locally; music and game sounds have independent controls.
import recordings from './sfx-data.json';
export function createCafeAudio(onChange=()=>{}){
 let ctx,master,music,sfx,compressor,decoding,meowBuffer,media,mediaNode,mediaUrl;
 let playVersion=0,effectVersion=0,pendingPlay=false,playing=false,preferred=true,volume=.32;
 let effectsEnabled=true,lastEffect=null,effectCount=0,bellCount=0;
 const activeEffects=new Set(),buffers={};let shakeTake=0;
 try{preferred=localStorage.getItem('alice-music')!=='off';effectsEnabled=localStorage.getItem('alice-effects')!=='off';if(localStorage.getItem('alice-volume')!==null)volume=Math.max(0,Math.min(1,Number(localStorage.getItem('alice-volume'))));}catch{}
 async function init(){
  if(!ctx){
   ctx=new (window.AudioContext||window.webkitAudioContext)();
   master=ctx.createGain();master.gain.value=.82;compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-14;compressor.knee.value=15;compressor.ratio.value=3;master.connect(compressor);compressor.connect(ctx.destination);
   music=ctx.createGain();music.gain.value=0;music.connect(master);sfx=ctx.createGain();sfx.gain.value=.58;sfx.connect(master);
   decoding=Promise.all(Object.entries(recordings).map(async([key,data])=>{const bytes=Uint8Array.from(atob(data.base64),c=>c.charCodeAt(0));buffers[key]=await ctx.decodeAudioData(bytes.buffer);})).then(()=>{meowBuffer=buffers.meow;});
  }
  if(ctx.state==='suspended')await ctx.resume();await decoding;
 }
 function getTrack(){
  if(media)return media;
  if(!media){
   const embedded=document.getElementById('background-music');if(!embedded)throw Error('Background music is missing.');
   mediaUrl=embedded.dataset.src;media=new Audio(mediaUrl);media.id='aw-background-track';media.preload='metadata';media.loop=true;media.hidden=true;document.body.append(media);
  }
  media.volume=volume*.66;
  media.addEventListener('play',()=>{playing=true;preferred=true;onChange();});
  media.addEventListener('pause',()=>{playing=false;onChange();});
  media.addEventListener('error',()=>{playing=false;pendingPlay=false;onChange();});
  return media;
 }
 async function play(){
  if(playing||pendingPlay)return;
  const version=++playVersion;pendingPlay=true;
  try{
   const track=getTrack();
   await track.play();
   if(version!==playVersion){if(!pendingPlay)track.pause();return;}
   pendingPlay=false;playing=true;preferred=true;try{localStorage.setItem('alice-music','on');}catch{}onChange();
  }catch(error){if(version!==playVersion)return;pendingPlay=false;playing=false;onChange();throw error;}
 }
 function pause(){playVersion++;pendingPlay=false;playing=false;preferred=false;media?.pause();try{localStorage.setItem('alice-music','off');}catch{}onChange();}
 async function toggle(){if(playing||pendingPlay)pause();else await play();}
 function setVolume(value){volume=Math.max(0,Math.min(1,value));if(media)media.volume=volume*.66;try{localStorage.setItem('alice-volume',String(volume));}catch{}}
 async function meow(){const version=effectVersion;await init();if(!effectsEnabled||version!==effectVersion)return 0;const src=ctx.createBufferSource();src.buffer=meowBuffer;const soft=ctx.createGain();soft.gain.value=.72;src.connect(soft);soft.connect(sfx);activeEffects.add(src);src.start();src.onended=()=>{src.disconnect();soft.disconnect();activeEffects.delete(src);};bellCount++;return meowBuffer.duration;}
 // Real recorded foley, played at its original pitch and speed. Only the success chime is musical synthesis.
 async function effect(kind,duration=1.6){
  const version=effectVersion;await init();if(!effectsEnabled||version!==effectVersion)return;
  let buffer;
  if(kind==='complete'){
   const rate=22050,n=Math.ceil(rate*duration);buffer=ctx.createBuffer(1,n,rate);const data=buffer.getChannelData(0);
   for(let i=0;i<n;i++){const t=i/rate;let v=0;for(let j=0;j<3;j++){const d=t-j*.17;if(d>=0)v+=Math.sin(d*[523.25,659.25,783.99][j]*Math.PI*2)*Math.exp(-d*5)*.16;}data[i]=v*Math.min(1,t/.02,(duration-t)/.06);}
  }else buffer=buffers[kind==='shake'?(shakeTake++%2?'shake2':'shake'):kind];
  if(!buffer)return;
  const source=ctx.createBufferSource();source.buffer=buffer;source.playbackRate.value=1;source.connect(sfx);activeEffects.add(source);source.start();lastEffect=kind;effectCount++;
  source.onended=()=>{source.disconnect();activeEffects.delete(source);};
 }
 function stopEffects(){effectVersion++;for(const voice of activeEffects){try{voice.stop();}catch{}voice.disconnect();}activeEffects.clear();}
 function setEffectsEnabled(value){effectsEnabled=!!value;if(!effectsEnabled)stopEffects();try{localStorage.setItem('alice-effects',effectsEnabled?'on':'off');}catch{}}


 return{unlock:init,play,pause,toggle,meow,setVolume,effect,stopEffects,setEffectsEnabled,get state(){return{playing,pendingPlay,volume,preferred,effectsEnabled,lastEffect,effectCount,activeEffects:activeEffects.size,contextState:ctx?.state||'not-started',currentTime:ctx?.currentTime||0,bellCount,meowDuration:meowBuffer?.duration||0,foley:'real-recordings',recordingsReady:Object.keys(buffers),title:'海滨',artist:'龙一Taki',trackTime:media?.currentTime||0,trackDuration:Number.isFinite(media?.duration)?media.duration:0,loop:media?.loop??true};}};
}
