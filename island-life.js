import * as THREE from 'three';

const clamp=THREE.MathUtils.clamp, smooth=t=>t*t*(3-2*t);
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.84,...extra});
function mesh(g,m,parent,pos){const o=new THREE.Mesh(g,m);if(pos)o.position.copy(pos);parent.add(o);return o;}
function ellipsoid(parent,m,pos,scale){const o=mesh(new THREE.SphereGeometry(1,16,10),m,parent,pos);o.scale.set(...scale);return o;}
function wingShape(side=1){const shape=new THREE.Shape();shape.moveTo(0,0);shape.quadraticCurveTo(side*.4,.12,side*.94,-.2);shape.lineTo(side*1.16,-.44);shape.quadraticCurveTo(side*.62,-.25,side*.18,-.19);shape.closePath();const g=new THREE.ShapeGeometry(shape,12);g.rotateX(Math.PI/2);return g;}
function makeGull(){
 const g=new THREE.Group(),white=mat('#f4f3e7'),grey=mat('#b8c5c7'),black=mat('#465657'),beak=mat('#dfb351');
 ellipsoid(g,white,V(),[.17,.14,.4]);ellipsoid(g,white,V(0,.1,.31),[.14,.14,.17]);
 const bill=mesh(new THREE.ConeGeometry(.06,.23,8),beak,g,V(0,.08,.51));bill.rotation.x=Math.PI/2;
 for(const side of [-1,1])ellipsoid(g,black,V(side*.12,.145,.38),[.023,.023,.023]);
 const wings=[];for(const side of [-1,1]){const p=new THREE.Group();p.position.set(side*.1,.05,0);g.add(p);const w=mesh(wingShape(side),white,p);w.material=new THREE.MeshStandardMaterial({color:'#ecefe8',roughness:.85,side:THREE.DoubleSide});
  const tipShape=new THREE.Shape();tipShape.moveTo(side*.78,-.16);tipShape.lineTo(side*1.16,-.44);tipShape.lineTo(side*.72,-.29);tipShape.closePath();const geo=new THREE.ShapeGeometry(tipShape);geo.rotateX(Math.PI/2);mesh(geo,new THREE.MeshStandardMaterial({color:'#667577',roughness:.9,side:THREE.DoubleSide}),p,V(0,.008,0));wings.push(p);}
 const tail=mesh(new THREE.ConeGeometry(.18,.32,3),grey,g,V(0,.015,-.44));tail.rotation.x=-Math.PI/2;tail.scale.z=.25;
 return{g,wings};
}
function makeStar(material,parent){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?.045:.105;const x=Math.sin(a)*r,y=Math.cos(a)*r;i?s.lineTo(x,y):s.moveTo(x,y);}s.closePath();return mesh(new THREE.ShapeGeometry(s),material,parent);}

export function createIslandLife({model,scene,camera,uiRoot,locale,audio,onStart,onFrame,onStateChange,canInteract,isNearPalm=()=>false,reducedMotion=false}){
 const world=new THREE.Group();world.name='Island_Life_Stage114';scene.add(world);
 const gulls=Array.from({length:5},(_,i)=>{const bird=makeGull();world.add(bird.g);bird.g.name='Seagull_'+(i+1);bird.g.scale.setScalar(i<3?.75:.55);return{...bird,offset:i*1.29,radius:8+i*1.2,height:10.5+(i%3)*.8};});
 const tree=model.getObjectByName('Left_Giant_Palm'),cat=model.getObjectByName('Cat_Sesame');
 if(!tree||!cat)throw Error('The island story needs the original palm and Sesame.');
 model.updateMatrixWorld(true);const treeRest=tree.quaternion.clone(),treeParent=tree.parent;const treePivot=new THREE.Group();treePivot.name='Palm_Story_Sway_Pivot';treePivot.position.copy(tree.position);treeParent.add(treePivot);treePivot.attach(tree);
 const catRest={visible:cat.visible},catStart=cat.getWorldPosition(V()),floorY=1.38,hit=V(-6.15,floorY,6.15),workSpot=V(-5.12,floorY,5.98);
 const story=new THREE.Group();story.name='Coconut_Repair_Story';world.add(story);
 const brown=mat('#826044'),cream=mat('#fff5dd'),wood=mat('#bf9467'),gold=mat('#e7bc5b'),mint=mat('#819b87');
 const coconut=new THREE.Group();coconut.name='Falling_Coconut';story.add(coconut);ellipsoid(coconut,brown,V(),[.29,.34,.28]);
 for(let i=0;i<3;i++)ellipsoid(coconut,mat('#503e30'),V((i-1)*.085,.2,.21),[.035,.043,.025]);
 for(let i=0;i<7;i++){const seam=mesh(new THREE.TorusGeometry(.285,.006,3,28,Math.PI*1.6),mat('#9a7854'),coconut);seam.rotation.set(.2,i*Math.PI/7,0);}
 const coconutStart=V(-6.05,8.45,3.1);coconut.position.copy(coconutStart);coconut.visible=false;
 const damage=new THREE.Group();damage.name='Broken_Deck_Patch';damage.position.copy(hit);story.add(damage);damage.visible=false;
 const holeShape=new THREE.Shape();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?.57:.76,x=Math.cos(a)*r,y=Math.sin(a)*r*.65;i?holeShape.lineTo(x,y):holeShape.moveTo(x,y);}holeShape.closePath();
 const hole=mesh(new THREE.ShapeGeometry(holeShape),mat('#574331'),damage,V(0,.018,0));hole.rotation.x=-Math.PI/2;
 const cracks=new THREE.Group();damage.add(cracks);for(let i=0;i<6;i++){const a=i*Math.PI/3;const pts=[V(Math.cos(a)*.37,.022,Math.sin(a)*.27),V(Math.cos(a+.12)*.74,.022,Math.sin(a+.12)*.48),V(Math.cos(a)*1.02,.022,Math.sin(a)*.64)];cracks.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#6d5439'})));}
 const splinters=[];for(let i=0;i<7;i++){const o=mesh(new THREE.BoxGeometry(.18+.04*(i%3),.055,.41),wood,damage,V(Math.cos(i)*.54,.06,Math.sin(i)*.37));o.rotation.set((i%2?1:-1)*.2,i*.8,(i%3-1)*.2);splinters.push({o,p:o.position.clone(),r:o.rotation.clone()});}
 const actor=new THREE.Group();actor.name='Sesame_Repair_Cat';world.add(actor);actor.visible=false;
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d'),gradient=sc.createRadialGradient(64,64,5,64,64,64);gradient.addColorStop(0,'rgba(71,51,31,0.25)');gradient.addColorStop(.45,'rgba(71,51,31,0.15)');gradient.addColorStop(1,'rgba(71,51,31,0)');sc.fillStyle=gradient;sc.fillRect(0,0,128,128);const workerShadow=mesh(new THREE.PlaneGeometry(1.05,.8),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}),world);workerShadow.name='Sesame_Contact_Shadow';workerShadow.rotation.x=-Math.PI/2;workerShadow.visible=false;
 const visual=cat.clone(true);visual.name='Sesame_Worker_Visual';visual.position.set(0,0,0);visual.quaternion.identity();actor.add(visual);
 const morphs=[];visual.traverse(o=>{o.userData={};if(o.isMesh&&o.morphTargetDictionary)morphs.push(o);});
 function morph(name,v){for(const m of morphs){const i=m.morphTargetDictionary[name];if(i!==undefined)m.morphTargetInfluences[i]=v;}}
 const hat=new THREE.Group();hat.name='Sesame_Yellow_Safety_Helmet';actor.add(hat);hat.position.set(0,1.015,.075);
 const brim=mesh(new THREE.CylinderGeometry(.32,.34,.045,24),gold,hat);brim.scale.z=.9;
 const dome=mesh(new THREE.SphereGeometry(.295,24,14,0,Math.PI*2,0,Math.PI/2),gold,hat,V(0,.005,0));dome.scale.y=.75;
 const ridge=mesh(new THREE.TorusGeometry(.225,.024,7,20,Math.PI),cream,hat,V(0,.012,0));ridge.rotation.y=Math.PI/2;
 mesh(new THREE.BoxGeometry(.12,.07,.018),cream,hat,V(0,.1,.27));
 const hammer=new THREE.Group();hammer.name='Sesame_Repair_Hammer';hammer.position.set(.25,.6,.29);actor.add(hammer);
 mesh(new THREE.CylinderGeometry(.035,.035,.41,8),wood,hammer,V(0,-.18,0));mesh(new THREE.BoxGeometry(.27,.12,.14),mat('#849193'),hammer,V(0,-.4,0));hammer.visible=false;
 const kit=new THREE.Group();kit.name='Repair_Toolkit';story.add(kit);kit.position.set(workSpot.x+.5,floorY+.13,workSpot.z+.1);mesh(new THREE.BoxGeometry(.36,.25,.26),mint,kit);mesh(new THREE.TorusGeometry(.09,.018,5,12,Math.PI),brown,kit,V(0,.17,0));kit.visible=false;
 const site=new THREE.Group();site.name='Tiny_Construction_Site';story.add(site);site.visible=false;
 for(const [x,z] of [[-.9,-.65],[.9,-.65],[-.9,.65],[.9,.65]]){const p=V(hit.x+x,floorY,hit.z+z);mesh(new THREE.BoxGeometry(.22,.045,.22),brown,site,p.clone().add(V(0,.022,0)));mesh(new THREE.ConeGeometry(.1,.32,12),gold,site,p.clone().add(V(0,.19,0)));mesh(new THREE.CylinderGeometry(.066,.078,.052,12),cream,site,p.clone().add(V(0,.18,0)));}
 const barrier=mesh(new THREE.BoxGeometry(1.75,.13,.055),gold,site,V(hit.x,floorY+.36,hit.z-.64));for(let i=0;i<8;i++){const stripe=mesh(new THREE.BoxGeometry(.08,.14,.065),brown,site,V(hit.x-.77+i*.22,floorY+.36,hit.z-.64));stripe.rotation.z=-.38;}
 const particles=[];for(let i=0;i<18;i++){const m=mat('#eee1c6',{transparent:true,opacity:0,depthWrite:false});const o=mesh(new THREE.IcosahedronGeometry(.12,1),m,story);o.visible=false;particles.push({o,age:99,angle:0});}
 const sparkles=[];for(let i=0;i<9;i++){const o=makeStar(new THREE.MeshBasicMaterial({color:i%2?'#f4d887':'#fff8d8',side:THREE.DoubleSide,transparent:true,depthWrite:false}),story);o.visible=false;sparkles.push(o);}
 const kibble=new THREE.Group();kibble.name='Five_Kibble_Thank_You';story.add(kibble);kibble.visible=false;for(let i=0;i<5;i++){const o=mesh(new THREE.DodecahedronGeometry(.095),mat(i%2?'#ba8853':'#956b43'),kibble);o.userData.index=i;}
 const panel=document.createElement('section');panel.className='aw-island-story';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','aw-story-title');panel.setAttribute('tabindex','-1');uiRoot.append(panel);
 let phase='idle',age=0,time=0,last=0,hammerHits=0,rewardCount=0,repaired=false,palmHovered=false,hoverUntil=0;
 function setPalmHovered(value){palmHovered=!!value;if(value)hoverUntil=performance.now()+650;}
 const touch=document.createElement('button');touch.className='aw-palm-touch';touch.hidden=true;touch.setAttribute('aria-label','Give the coconut tree a little shake');touch.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c2-6 2-10 0-15M12 7C7 1 3 4 3 9c3-3 6-3 9-2Zm0 0c4-6 9-4 9 1-3-2-6-2-9-1Zm0 0c-5-2-8 1-7 5 2-3 4-4 7-5Z"/></svg><span>Shake gently</span>';uiRoot.append(touch);touch.onclick=()=>start();touch.onpointerenter=()=>setPalmHovered(true);touch.onpointerleave=()=>setPalmHovered(false);
 function sound(kind){audio.effect(kind).catch(console.error);}
 function setPhase(next){palmHovered=false;hoverUntil=0;phase=next;age=0;document.body.dataset.islandStory=next;onStateChange?.();}
 function render(title,copy,actions=[],status=false){panel.innerHTML=`<button class="aw-story-close" aria-label="Close island story">×</button><span class="aw-story-eyebrow">${phase==='ask'?'A tiny island incident':'SESAME · ISLAND REPAIR CREW'}</span><h2 id="aw-story-title">${title}</h2><p>${copy}</p>${status?'<div class="aw-repair-progress" role="progressbar" aria-label="Deck repair progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>':''}<div class="aw-story-actions"></div>`;
  const box=panel.querySelector('.aw-story-actions');actions.forEach(([label,fn,primary])=>{const b=document.createElement('button');b.textContent=label;if(primary)b.className='primary';b.onclick=fn;box.append(b);});panel.querySelector('.aw-story-close').onclick=cancel;panel.hidden=false;locale.refresh();panel.focus({preventScroll:true});onStateChange?.();}
 function puff(strength=1){particles.forEach((p,i)=>{p.age=-(i%3)*.04;p.angle=i*2.399;p.o.position.copy(hit).add(V(Math.cos(p.angle)*.32,.1,Math.sin(p.angle)*.22));p.o.userData.strength=strength;p.o.visible=true;});}
 function start(){if(phase!=='idle'||!canInteract())return false;audio.unlock?.().catch(console.error);onStart();catRest.visible=cat.visible;sceneReviewCats()?.resetForNavigation();sceneReviewCats()?.pause(true);repaired=false;rewardCount=0;hammerHits=0;coconut.position.copy(coconutStart);coconut.rotation.set(0,0,0);coconut.visible=true;setPhase('sway');return true;}
 function sceneReviewCats(){return window.__sceneReview?.getCats?.();}
 function ask(){setPhase('ask');render('Oops. Coconut delivery!','The deck has a little crack. Ask the café cats to fix it?',[['Ask Sesame to help',beginRepair,true],['Maybe later',cancel,false]]);}
 function beginRepair(){if(phase!=='ask')return;cat.visible=false;actor.visible=true;actor.position.copy(catStart);actor.quaternion.copy(cat.getWorldQuaternion(new THREE.Quaternion()));kit.visible=true;setPhase('walking');onFrame('repair');render('Hard hat on. Paws ready.','Sesame is on the way. Tiny paws, very serious business.',[],true);}
 function giveKibble(){if(phase!=='thanks')return;rewardCount=5;setPhase('reward');kibble.visible=true;audio.meow().catch(console.error);render('Five treats?! For me?','Another milk tea, here I come! Best. Side quest. Ever.',[['Enjoy your milk tea!',goHome,true]]);}
 function goHome(){if(phase!=='reward')return;panel.hidden=true;kibble.visible=false;kit.visible=false;setPhase('returning');}
 function finish(){actor.visible=false;workerShadow.visible=false;cat.visible=catRest.visible;sceneReviewCats()?.pause(false);setPhase('idle');onStateChange?.();touch.focus({preventScroll:true});}
 function cancel(){if(phase==='idle')return;treePivot.quaternion.identity();coconut.visible=false;damage.visible=false;site.visible=false;kit.visible=false;actor.visible=false;workerShadow.visible=false;hammer.visible=false;panel.hidden=true;kibble.visible=false;particles.forEach(p=>p.o.visible=false);sparkles.forEach(o=>o.visible=false);cat.visible=catRest.visible;morph('Sip_Paws',0);morph('Sip_Head',0);sceneReviewCats()?.pause(false);audio.stopEffects();setPhase('idle');}
 const walkPoints=[catStart,V(-4.06,floorY,2.8),V(-5.85,floorY,3.0),V(-6.35,floorY,4.95),workSpot];
 function walk(t,reverse=false){const u=clamp(reverse?1-t:t,0,1)*(walkPoints.length-1),i=Math.min(walkPoints.length-2,Math.floor(u)),f=u-i;actor.position.lerpVectors(walkPoints[i],walkPoints[i+1],smooth(f));if(!reducedMotion)actor.position.y+=Math.abs(Math.sin(t*Math.PI*14))*.055+(i===0?Math.sin(f*Math.PI)*.12:0);const dir=walkPoints[i+1].clone().sub(walkPoints[i]).multiplyScalar(reverse?-1:1);actor.rotation.set(0,Math.atan2(dir.x,dir.z),reducedMotion?0:Math.sin(t*Math.PI*14)*.035);morph('Sip_Paws',Math.max(0,Math.sin(t*Math.PI*14))*.32);}
 function update(now){const dt=last?Math.max(0,Math.min(.06,(now-last)/1000)):0;last=now;if(document.hidden)return;time+=dt;age+=dt;
  gulls.forEach((b,i)=>{const t=(reducedMotion?i*.9:time*.075)+b.offset;const x=Math.cos(t)*b.radius,z=Math.sin(t)*b.radius*.62-1.5;b.g.position.set(x,b.height+(reducedMotion?0:Math.sin(t*2+i)*.55),z);b.g.rotation.set(0,Math.atan2(-Math.sin(t)*b.radius,Math.cos(t)*b.radius*.62),Math.sin(t+i)*.12);const glide=Math.sin(time*.57+i)>.35,flap=reducedMotion?0:glide?.05:Math.sin(time*5.6+i)*.42;b.wings[0].rotation.z=-flap;b.wings[1].rotation.z=flap;});
  touch.hidden=phase!=='idle'||!canInteract();
  if(touch.hidden){palmHovered=false;hoverUntil=0;touch.classList.remove('is-discovered');}
  else{const p=treePivot.getWorldPosition(V()).add(V(.25,2.6,.3)).project(camera);touch.hidden=p.z>1||p.z< -1||Math.abs(p.x)>.93||Math.abs(p.y)>.86;touch.style.left=(p.x*.5+.5)*innerWidth+'px';touch.style.top=(-p.y*.5+.5)*innerHeight+'px';touch.classList.toggle('is-discovered',palmHovered||now<hoverUntil||isNearPalm());}
  if(phase==='sway'){treePivot.rotation.z=reducedMotion?0:Math.sin(age*9)*.023*Math.sin(Math.min(1,age/1.1)*Math.PI);if(age>=1.1){treePivot.quaternion.identity();setPhase('falling');}}
  if(phase==='falling'){const t=clamp(age/1.25,0,1);coconut.position.lerpVectors(coconutStart,hit.clone().add(V(0,.28,0)),t*t);coconut.rotation.set(t*4,t*2,t);if(t===1){damage.visible=true;puff(1.15);sound('impact');setPhase('impact');}}
  if(phase==='impact'){const t=clamp(age/.7,0,1);coconut.position.set(hit.x+.46*t,hit.y+.28+Math.sin(t*Math.PI)*.35,hit.z+.3*t);coconut.rotation.x+=dt*4;for(const [i,s]of splinters.entries()){s.o.position.copy(s.p).add(V(0,Math.sin(t*Math.PI)*(.1+i*.018),0));}if(age>.72){onFrame('repair');ask();}}
  if(phase==='walking'){walk(clamp(age/3,0,1));if(age>=3){actor.position.copy(workSpot);actor.rotation.set(0,Math.atan2(hit.x-workSpot.x,hit.z-workSpot.z),0);morph('Sip_Paws',0);site.visible=true;hammer.visible=true;setPhase('repairing');render('A little island makeover.','Tap, tap… almost good as new.',[],true);}}
  if(phase==='repairing'){const t=age,beat=t<1.5?t:t-1.5;hammer.rotation.x=-.4-Math.sin(clamp(beat/.8,0,1)*Math.PI)*1.4;actor.rotation.z=reducedMotion?0:Math.sin(t*8)*.025;morph('Sip_Paws',.3);morph('Sip_Head',.15);if((t>=.8&&hammerHits===0)||(t>=2.3&&hammerHits===1)){hammerHits++;puff(.8);sound('hammer');}const progress=panel.querySelector('.aw-repair-progress');if(progress){progress.setAttribute('aria-valuenow',String(Math.round(clamp(t/3,0,1)*100)));progress.querySelector('i').style.width=clamp(t/3,0,1)*100+'%';}if(t>=3){repaired=true;damage.visible=false;coconut.visible=false;site.visible=false;hammer.visible=false;actor.rotation.z=0;morph('Sip_Paws',0);morph('Sip_Head',0);sound('complete');setPhase('thanks');render('Good as new!','Two taps. Three seconds. One very talented cat.',[['Thank you! Give 5 treats',giveKibble,true]]);}}
  if(phase==='thanks'){sparkles.forEach((o,i)=>{const t=age-i*.035;o.visible=t>=0&&t<1.3;if(o.visible){o.position.copy(hit).add(V(Math.cos(i*2.4)*(.3+t*.35),.3+t*.5,Math.sin(i*2.4)*(.3+t*.35)));o.quaternion.copy(camera.quaternion);o.material.opacity=1-t/1.3;}});}
  if(phase==='reward'){kibble.children.forEach((o,i)=>{const t=clamp((age-i*.14)/.8,0,1);o.visible=t<1;o.position.lerpVectors(hit.clone().add(V(-.3+i*.15,.5,.4)),actor.position.clone().add(V(0,.65,.25)),t);o.position.y+=Math.sin(t*Math.PI)*.65;o.rotation.set(t*5,i+t*4,0);});if(age<1.1&&!reducedMotion)actor.position.y=workSpot.y+Math.sin(age/1.1*Math.PI)*.14;else actor.position.y=workSpot.y;}
  if(phase==='returning'){walk(clamp(age/2.6,0,1),true);if(age>=2.6)finish();}
  workerShadow.visible=actor.visible;workerShadow.position.set(actor.position.x,floorY+.006,actor.position.z);workerShadow.material.opacity=1/(1+Math.max(0,actor.position.y-floorY)*2);
  particles.forEach(p=>{if(!p.o.visible)return;p.age+=dt;const t=p.age;if(t<0)return;const k=p.o.userData.strength;p.o.position.x+=Math.cos(p.angle)*dt*.5*k;p.o.position.z+=Math.sin(p.angle)*dt*.4*k;p.o.position.y+=dt*.22;p.o.scale.setScalar(.5+t*2*k);p.o.material.opacity=Math.max(0,(1-t/.85)*.6);if(t>.85)p.o.visible=false;});
 }
 function dispose(){cancel();treeParent.attach(tree);tree.quaternion.copy(treeRest);treePivot.removeFromParent();world.removeFromParent();panel.remove();touch.remove();/* The worker clone shares original scene textures, so do not dispose those. */}
 return{setPalmHovered,start,beginRepair,giveKibble,goHome,cancel,update,dispose,tree, get state(){return{phase,busy:phase!=='idle',gulls:gulls.length,hammerHits,rewardCount,repaired,workerVisible:actor.visible,helmetVisible:actor.visible&&hat.visible,damageVisible:damage.visible,repairDuration:3};}};
}
