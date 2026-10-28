import * as THREE from 'three';

// A shallow, rounded wooden keepsake island, in the café's existing warm palette.
const N=160,TAU=Math.PI*2;
const outline=a=>1+.018*Math.sin(3*a+.4)+.012*Math.sin(5*a-1);
export function createFloatingIsland({model,scene,controls}){
 const group=new THREE.Group();group.name='Warm_Wood_Floating_Island';scene.add(group);
 const water=model.getObjectByName('Turquoise_Water');
 if(!water)throw new Error('The island needs its original ocean surface.');
 const previousCompile=water.material.onBeforeCompile;
 water.material.onBeforeCompile=function(shader,renderer){
  previousCompile.call(this,shader,renderer);
  shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>',`
   vec2 islandP=vec2(vOceanWorld.x/11.2,(vOceanWorld.z-0.55)/10.5);
   float islandA=atan(islandP.y,islandP.x);
   float islandOutline=1.0+0.018*sin(3.0*islandA+0.4)+0.012*sin(5.0*islandA-1.0);
   float islandR=length(islandP)/islandOutline;
   if(islandR>1.0)discard;
   gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(0.88,0.98,0.94),smoothstep(0.986,1.0,islandR)*0.45);
   #include <dithering_fragment>
  `);
 };
 water.material.customProgramCacheKey=()=> 'AliceWoodLagoon117';water.material.needsUpdate=true;
 const textureCanvas=document.createElement('canvas');textureCanvas.width=1024;textureCanvas.height=256;
 const c=textureCanvas.getContext('2d');c.fillStyle='#e2b77f';c.fillRect(0,0,1024,256);
 for(let j=0;j<50;j++){c.strokeStyle=j%3?'#b4783522':'#fff2ca38';c.lineWidth=j%4===0?2:1;c.beginPath();for(let x=0;x<=1024;x+=4){const y=j*5.2+Math.sin(x*.013+j)*1.7+Math.sin(x*.031+j*1.7)*.65;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
 const grain=new THREE.CanvasTexture(textureCanvas);grain.colorSpace=THREE.SRGBColorSpace;grain.wrapS=THREE.RepeatWrapping;grain.repeat.set(3,1);
 // Soft bevel at the rim, then a modest asymmetrical taper; no cliff or debris.
 const rings=[[-.48,1.006],[-.62,1.012],[-.9,1.006],[-1.04,.985],[-1.35,.96],[-1.8,.86],[-2.35,.69],[-2.9,.46],[-3.3,.22],[-3.55,.025]];
 const positions=[],uv=[],indices=[];
 rings.forEach(([y,r],j)=>{for(let i=0;i<=N;i++){const a=i/N*TAU,ir=outline(a)*r,shift=j/9;positions.push(Math.cos(a)*11.2*ir-shift*.65,y-(j>4?.13*Math.sin(3*a)*shift:0),Math.sin(a)*10.5*ir+.55+shift*.3);uv.push(i/N,j/9);}});
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<N;i++){const a=j*(N+1)+i,b=a+1,d=a+N+1,e=d+1;indices.push(a,d,b,b,d,e);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
 const wood=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:grain,color:'#fff2d8',roughness:.82,side:THREE.DoubleSide}));wood.name='Rounded_Honey_Wood_Base';group.add(wood);
 // A fine cream inlay around the top edge echoes the shop's trim.
 const rimPoints=[];for(let i=0;i<N;i++){const a=i/N*TAU;rimPoints.push(new THREE.Vector3(Math.cos(a)*11.2*outline(a)*1.008,-.72,Math.sin(a)*10.5*outline(a)*1.008+.55));}
 const rim=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPoints,true),N,.035,5,true),new THREE.MeshStandardMaterial({color:'#ffebbd',roughness:.8}));group.add(rim);
 const cloudMaterial=new THREE.MeshStandardMaterial({color:'#fff9e8',roughness:1,transparent:true,opacity:.8,depthWrite:false}),clouds=[];
 for(let i=0;i<3;i++){const cloud=new THREE.Group();for(let j=0;j<4;j++){const puff=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),cloudMaterial);puff.position.set((j-1.5)*.85,Math.sin(j*2)*.18,0);puff.scale.set(1.1,.42,.7);cloud.add(puff);}const a=i/3*TAU+.6;cloud.position.set(Math.cos(a)*15,-3-i*.65,Math.sin(a)*13);cloud.scale.setScalar(.6);group.add(cloud);clouds.push({mesh:cloud,x:cloud.position.x});}
 const sky=document.createElement('canvas');sky.width=2;sky.height=512;const ctx=sky.getContext('2d'),gradient=ctx.createLinearGradient(0,0,0,512);gradient.addColorStop(0,'#a7ddf0');gradient.addColorStop(.58,'#dcf3f5');gradient.addColorStop(1,'#fff0d5');ctx.fillStyle=gradient;ctx.fillRect(0,0,2,512);const previousBackground=scene.background;scene.background=new THREE.CanvasTexture(sky);scene.background.colorSpace=THREE.SRGBColorSpace;
 controls.maxDistance=90;controls.minDistance=3;controls.maxPolarAngle=Math.PI*.65;
 let disposed=false;
 return{group,update(now){if(disposed||matchMedia('(prefers-reduced-motion: reduce)').matches)return;clouds.forEach((v,i)=>v.mesh.position.x=v.x+Math.sin(now*.00007+i)*.45);},dispose(){disposed=true;group.removeFromParent();group.traverse(o=>{o.geometry?.dispose();if(o.material&&o.material!==cloudMaterial)o.material.dispose();});cloudMaterial.dispose();grain.dispose();scene.background.dispose();scene.background=previousBackground;}};
}
