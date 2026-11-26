'use strict';
const trigger=document.querySelector('.menu');
const panel=document.getElementById('mobileNav');
const desktop=matchMedia('(min-width:1101px)');
function setMenu(open,restoreFocus=false){
  open=Boolean(open)&&!desktop.matches;
  document.body.classList.toggle('nav-open',open);
  trigger.setAttribute('aria-expanded',String(open));
  trigger.setAttribute('aria-label',open?'Chiudi menu':'Apri menu');
  panel.inert=!open;
  panel.setAttribute('aria-hidden',String(!open));
  if(restoreFocus)trigger.focus();
}
trigger.addEventListener('click',()=>setMenu(trigger.getAttribute('aria-expanded')!=='true'));
panel.addEventListener('click',event=>{
  const link=event.target.closest('a');
  if(link){setMenu(false);const target=document.querySelector(link.hash);if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&trigger.getAttribute('aria-expanded')==='true'){setMenu(false,true);}
});
document.addEventListener('pointerdown',event=>{
  if(!event.target.closest('header')&&trigger.getAttribute('aria-expanded')==='true')setMenu(false);
});
if(desktop.addEventListener)desktop.addEventListener('change',()=>setMenu(false));
else desktop.addListener(()=>setMenu(false));
