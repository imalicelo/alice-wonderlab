(()=>{
const config=JSON.parse(document.querySelector('#cashier-config').textContent);
const dialog=document.querySelector('#cashier-dialog');let onOpen=null;
function openCashier(source='machine'){
 const event=new CustomEvent('alice:cashier-open',{cancelable:true,detail:{interactionId:'cashier',objectRoot:config.objectRoot,source}});
 if(!window.dispatchEvent(event))return;
 if(onOpen){onOpen(event.detail);return;}
 if(config.url){const u=new URL(config.url,location.href);if(['http:','https:','file:'].includes(u.protocol)){window.open(u.href,'_blank','noopener');return;}}
 if(!dialog.open)dialog.showModal();document.body.dataset.cashierOpen='true';
}
function closeCashier(){dialog.close();}
dialog.addEventListener('close',()=>{document.body.dataset.cashierOpen='false'});
dialog.querySelector('[data-close-cashier]').onclick=closeCashier;
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeCashier();}});
window.addEventListener('alice:cashier-activate',()=>openCashier('machine'));
window.ALICE_CASHIER={open:openCashier,close:closeCashier,configure(options={}){if('url'in options)config.url=options.url;if('onOpen'in options)onOpen=options.onOpen;},getConfig:()=>({...config})};
const b=document.createElement('button');b.id='cashier-focus';b.textContent='收银台特写';document.querySelector('[data-view="inside"]').after(b);
b.onclick=()=>{const r=window.__sceneReview;if(!r?.getModel())return;r.getModel().traverse(o=>{if(o.isMesh)o.visible=true});document.querySelector('#cup-choice').value='';document.querySelector('#selection').textContent='点击收银机打开';r.camera.position.set(-1.30,3.65,5.6);r.controls.target.set(-1.06,2.94,1.78);r.controls.update();};
})();
