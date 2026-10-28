import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// A small, independent 3D bar. All meshes are local; the saved island stays intact.
export function createTeaLab(mount,{onIngredient,onShake,reducedMotion=false}={}){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.domElement.className='aw-tea-canvas';renderer.domElement.setAttribute('aria-label','Interactive 3D tea bar');renderer.domElement.setAttribute('role','img');mount.prepend(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,40);
 camera.position.set(3.5,3.4,6.5);camera.lookAt(0,1.25,0);
 scene.add(new THREE.HemisphereLight(0xfff8df,0x8a9c88,3.1));
 const key=new THREE.DirectionalLight(0xfff2d9,3.4);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.normalBias=.025;scene.add(key);
 const edge=new THREE.DirectionalLight(0xe1f7ee,2);edge.position.set(4,3,-3);scene.add(edge);
 const matte=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.48,...extra});
 function mesh(geo,mat,parent=scene,x=0,y=0,z=0){const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function cyl(rt,rb,h,mat,parent,x=0,y=0,z=0){return mesh(new THREE.CylinderGeometry(rt,rb,h,64),mat,parent,x,y,z);}
 function ring(r,t,mat,parent,y){const o=mesh(new THREE.TorusGeometry(r,t,12,64),mat,parent,0,y,0);o.rotation.x=Math.PI/2;return o;}
 function label(text,color='#55674b',size=1){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const c=canvas.getContext('2d');c.fillStyle=color;c.textAlign='center';c.font='italic 55px Georgia';c.fillText(text,256,116);c.font='18px sans-serif';c.fillText('ALICE WONDERLAB',256,160);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return mesh(new THREE.PlaneGeometry(size,size/2),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}),new THREE.Group());}
 const floor=cyl(2.6,2.6,.12,matte('#e1d2b4'),scene,0,-.09,0);
 const board=cyl(.95,.98,.09,matte('#d6ba88'),scene,.55,.015,0);ring(.85,.012,matte('#bba171'),board,.05);
 const saucer=cyl(.62,.65,.06,matte('#b2bfa2'),scene,-1.18,.015,-.08);
 const cup=new THREE.Group();cup.position.set(.55,.09,0);scene.add(cup);
 const glass=new THREE.MeshPhysicalMaterial({color:'#e8f3e7',roughness:.07,metalness:.05,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false});
 const profile=[new THREE.Vector2(.47,.1),new THREE.Vector2(.5,.18),new THREE.Vector2(.63,1.78),new THREE.Vector2(.65,1.86)];
 const shell=mesh(new THREE.LatheGeometry(profile,64),glass,cup);shell.castShadow=false;shell.renderOrder=5;
 const silver=matte('#d0d9c2',{metalness:.5,roughness:.24});
 ring(.65,.024,silver,cup,1.86);ring(.48,.025,silver,cup,.1);
 const reflection=matte('#ffffff',{transparent:true,opacity:.5,depthWrite:false});
 for(const angle of [-.95,1.6]){const o=mesh(new THREE.CylinderGeometry(.64,.49,1.68,32,1,true,angle,.045),reflection,cup,0,.96,0);o.castShadow=false;o.renderOrder=6;}
 const cupLabel=label('Jasmine', '#4f6048',.74);cup.add(cupLabel);cupLabel.position.set(.16,1.14,.59);cupLabel.rotation.y=.25;cupLabel.renderOrder=7;
 const drinkMat=matte('#b9bc75',{roughness:.22});
 const liquid=cyl(.59,.47,1,drinkMat,cup,0,.2,0);liquid.visible=false;
 const surface=ring(.48,.012,matte('#e7e6c1',{transparent:true,opacity:.5}),cup,.25);surface.visible=false;
 const iceMat=new THREE.MeshPhysicalMaterial({color:'#e5f4ef',transparent:true,opacity:.82,roughness:.1,metalness:.12});
 const cubes=Array.from({length:7},(_,i)=>{const o=mesh(new RoundedBoxGeometry(.33,.33,.33,2,.045),iceMat,cup);o.visible=false;o.rotation.set(i*.63,i*.79,i*.43);o.userData.rest=new THREE.Vector3(Math.cos(i*2.4)*.27,.28+Math.floor(i/3)*.28,Math.sin(i*2.4)*.27);return o;});
 const lid=new THREE.Group();cup.add(lid);cyl(.64,.67,.16,silver,lid,0,1.93);cyl(.32,.57,.2,silver,lid,0,2.11);cyl(.23,.26,.13,silver,lid,0,2.27);ring(.65,.025,matte('#8b9a7e'),lid,1.88);lid.visible=false;
 const source=new THREE.Group();scene.add(source);source.position.set(-1.18,1.3,-.08);
 const containers=[];
 const bowl=new THREE.Group();source.add(bowl);containers.push(bowl);
 mesh(new THREE.SphereGeometry(.46,40,24,0,Math.PI*2,0,Math.PI/2),matte('#e3e9d4',{side:THREE.DoubleSide}),bowl,0,-.05,0).rotation.z=Math.PI;
 ring(.46,.026,matte('#a7b797'),bowl,-.05);
 for(let i=0;i<5;i++){const o=mesh(new RoundedBoxGeometry(.25,.25,.25,2,.035),iceMat,bowl,Math.cos(i*2)*.21,.04+Math.floor(i/3)*.13,Math.sin(i*2)*.21);o.rotation.set(i,.3,i*.4);}
 const jug=new THREE.Group();source.add(jug);containers.push(jug);
 cyl(.36,.4,.85,matte('#bbc58b',{roughness:.18}),jug,0,-.05);ring(.36,.025,silver,jug,.39);
 const handle=mesh(new THREE.TorusGeometry(.25,.047,12,32,Math.PI*1.7),matte('#a8b67c'),jug,-.4,0,0);handle.rotation.z=-Math.PI*.85;
 const spout=mesh(new THREE.ConeGeometry(.15,.28,3),matte('#bbc58b'),jug,.35,.35,0);spout.rotation.z=-Math.PI/2;
 const teaLabel=label('Tea','#536840',.48);jug.add(teaLabel);teaLabel.position.set(0,.04,.405);
 const milk=new THREE.Group();source.add(milk);containers.push(milk);
 mesh(new RoundedBoxGeometry(.67,.95,.55,2,.05),matte('#fff6e1'),milk,0,-.03,0);
 const top=mesh(new THREE.CylinderGeometry(.25,.4,.24,4),matte('#c3d2b3'),milk,0,.56,0);top.rotation.y=Math.PI/4;
 cyl(.09,.09,.06,matte('#f9f5df'),milk,.18,.71,.02);
 const milkLabel=label('Milk','#738d65',.59);milk.add(milkLabel);milkLabel.position.set(0,.02,.281);
 const syrup=new THREE.Group();source.add(syrup);containers.push(syrup);
 cyl(.28,.31,.8,matte('#b97d30',{metalness:.13,roughness:.18}),syrup,0,-.05);
 cyl(.13,.25,.2,matte('#c49b53'),syrup,0,.45);cyl(.13,.13,.2,silver,syrup,0,.63);
 const nozzle=mesh(new THREE.BoxGeometry(.36,.07,.11),silver,syrup,.1,.75,0);
 const syrupLabel=label('Syrup','#fff7d7',.48);syrup.add(syrupLabel);syrupLabel.position.set(0,0,.311);
 const drops=Array.from({length:26},(_,i)=>{const o=mesh(new THREE.SphereGeometry(.023+(i%3)*.006,8,6),matte('#b6bd7b'),scene);o.visible=false;return o;});
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
 let step=0,visible=false,action=null,currentHeight=0,turn=0,frame=0,disposed=false,down=null,actionNumber=0;
 const heights=[0,.75,1.29,1.49],colors=['#c5ddda','#b6bd7b','#e5d8b0','#decea0'];
 function resize(){const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.position.set(3.2,3.2,Math.max(6.6,5.7/camera.aspect));camera.lookAt(0,1.3,0);camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(mount);
 function setStep(value){step=value;containers.forEach((o,i)=>o.visible=i===step);source.visible=step<4;lid.visible=step>=4;}
 function reset(){action=null;actionNumber++;step=0;currentHeight=0;liquid.visible=false;surface.visible=false;cubes.forEach(o=>o.visible=false);drops.forEach(o=>o.visible=false);cup.rotation.set(0,0,0);source.rotation.set(0,0,0);setStep(0);}
 function pour(index,duration=1800){action={type:'pour',index,start:performance.now(),duration,from:currentHeight};actionNumber++;}
 function shake(duration=1250){action={type:'shake',start:performance.now(),duration};actionNumber++;}
 function cancel(){action=null;drops.forEach(o=>o.visible=false);cup.rotation.set(0,0,0);source.rotation.set(0,0,0);}
 function tick(now){if(disposed)return;frame=requestAnimationFrame(tick);if(!visible)return;
  const t=action?Math.min(1,(now-action.start)/action.duration):0;
  const shakeAmount=action?.type==='shake'&&!reducedMotion?Math.sin(t*Math.PI*10)*Math.sin(Math.PI*t):0;
  cup.position.x=.55+shakeAmount*.27;cup.position.y=.09+Math.abs(shakeAmount)*.15;cup.rotation.z=shakeAmount*.3;
  source.position.set(-1.18,1.33+(reducedMotion?0:Math.sin(now*.0018)*.025),-.08);source.rotation.set(0,turn*.25,0);if(down?.hit&&down.moved&&step<4&&!action){const shift=new THREE.Vector3(down.dx/mount.clientWidth*5,-down.dy/mount.clientHeight*4,0).applyQuaternion(camera.quaternion);source.position.add(shift);}
  drops.forEach(o=>o.visible=false);
  if(action?.type==='pour'){
   const i=action.index,ease=Math.sin(Math.PI*t),fill=THREE.MathUtils.smoothstep(t,.2,.88);
   source.position.set(-1.18+ease*.87,1.33+ease*1.45,0);source.rotation.z=-ease*.95;
   currentHeight=THREE.MathUtils.lerp(action.from,heights[i],fill);
   if(i===0)cubes.forEach((o,j)=>{const fall=THREE.MathUtils.clamp((t-.14-j*.06)*3.3,0,1);o.visible=fall>0;o.position.copy(o.userData.rest);o.position.y+=(1-fall*fall)*2.35;o.rotation.z=j*.43+(1-fall)*2;});
   else {drinkMat.color.lerp(new THREE.Color(colors[i]),.09);const start=i===2?new THREE.Vector3(.18,.74,.02):i===3?new THREE.Vector3(.29,.75,.02):new THREE.Vector3(.48,.35,.02);source.updateMatrixWorld();source.localToWorld(start);drops.forEach((o,j)=>{o.visible=t>.22&&t<.88;const f=((now*.0015+j/26)%1);o.position.lerpVectors(start,new THREE.Vector3(.55,.25+currentHeight,0),f);o.position.x+=Math.sin(f*Math.PI)*.13;o.scale.set(i===3?.65:1,2.6,1);o.material.color.set(colors[i]);});}
  }
  if(currentHeight>.01){liquid.visible=true;liquid.scale.y=currentHeight;liquid.position.y=.14+currentHeight/2;surface.visible=true;surface.position.y=.15+currentHeight;surface.scale.setScalar(.95+currentHeight*.1);surface.rotation.z=Math.sin(now*.004)*.035;}
  if(step>0&&action?.index!==0)cubes.forEach((o,j)=>{o.visible=true;o.position.copy(o.userData.rest);o.position.y+=currentHeight*.54+(reducedMotion?0:Math.sin(now*.002+j)*.025);o.rotation.y=j*.79+shakeAmount*.45;});
  if(action&&t>=1){if(action.type==='pour')currentHeight=heights[action.index];action=null;}
  if(step===5){drinkMat.color.lerp(new THREE.Color('#d9c59a'),.03);cup.rotation.y=reducedMotion?0:Math.sin(now*.0006)*.15;}
  renderer.render(scene,camera);
 }
 function hit(e,objects=step<4?[source]:[cup]){const b=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2);ray.setFromCamera(mouse,camera);return ray.intersectObjects(objects,true).some(x=>x.object.visible);}
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,hit:hit(e),moved:false,dx:0,dy:0};renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x;down.dx=dx;down.dy=e.clientY-down.y;if(Math.hypot(dx,down.dy)>8)down.moved=true;if(step===4&&down.hit&&Math.abs(dx)>25){onShake?.();down.x=e.clientX;}else if(step<4&&down.hit){turn=dx*.01;source.rotation.z=Math.max(-.5,Math.min(.5,dx*.008));}});
 renderer.domElement.addEventListener('pointerup',e=>{if(down?.hit&&step<4&&(!down.moved||hit(e,[cup])))onIngredient?.();if(down?.hit&&step===4&&!down.moved)onShake?.();down=null;turn=0;});
 renderer.domElement.addEventListener('pointercancel',()=>{down=null;turn=0;});
 reset();resize();frame=requestAnimationFrame(tick);
 return {reset,setStep,pour,shake,cancel,setVisible(value){visible=value;if(value)resize();else cancel();},get state(){return {step,visible,action:action?.type||null,currentHeight,cubes:cubes.filter(x=>x.visible).length,actionNumber,renderer:'WebGL'};},dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();const gs=new Set(),ms=new Set();scene.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)ms.add(o.material);});gs.forEach(g=>g.dispose());ms.forEach(m=>{m.map?.dispose();m.dispose();});renderer.dispose();renderer.domElement.remove();}};
}
