'use strict';
(()=>{
const root=document.querySelector('.project-gallery'),track=root.querySelector('.gallery-track'),button=root.querySelector('.gallery-pause');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=false,interacting=false,visible=false,last=0,position=0,direction=1,frame=0,loaded=0;
function show(img){const slide=img.closest('figure');if(!slide.hidden)return;slide.hidden=false;root.hidden=false;loaded++;position=track.scrollLeft;}
root.querySelectorAll('img').forEach(img=>{img.loading='eager';img.addEventListener('load',()=>show(img));if(img.complete&&img.naturalWidth)show(img);});
function tick(now){frame=0;const max=track.scrollWidth-track.clientWidth;if(!paused&&!interacting&&visible&&!reduced.matches&&loaded>1&&max>1){const dt=last?Math.min(now-last,50):0;track.classList.add('is-auto');position+=direction*dt*.025;if(position>=max){position=max;direction=-1}if(position<=0){position=0;direction=1}track.scrollLeft=position;last=now;frame=requestAnimationFrame(tick)}else{last=0;track.classList.remove('is-auto');}}
function start(){if(!frame)frame=requestAnimationFrame(tick)}
button.addEventListener('click',()=>{paused=!paused;button.textContent=paused?'Riprendi':'Pausa';button.setAttribute('aria-label',paused?'Riprendi lo scorrimento':'Metti in pausa lo scorrimento');position=track.scrollLeft;start()});
function stopTouch(){interacting=true;track.classList.remove('is-auto');}
function resume(){interacting=false;position=track.scrollLeft;start()}
track.addEventListener('pointerdown',stopTouch,{passive:true});window.addEventListener('pointerup',resume,{passive:true});window.addEventListener('pointercancel',resume,{passive:true});track.addEventListener('focusin',stopTouch);track.addEventListener('focusout',resume);track.addEventListener('mouseenter',stopTouch);track.addEventListener('mouseleave',resume);track.addEventListener('scroll',()=>{if(!track.classList.contains('is-auto'))position=track.scrollLeft},{passive:true});
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()},{threshold:.15}).observe(root);else{visible=true;start()}
root.querySelectorAll('img').forEach(img=>img.addEventListener('load',start));
if(reduced.addEventListener)reduced.addEventListener('change',start);
})();
