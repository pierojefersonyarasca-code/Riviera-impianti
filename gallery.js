'use strict';
(()=>{
 const root=document.querySelector('.project-gallery');
 if(!root)return;
 const track=root.querySelector('.gallery-track'),button=root.querySelector('.gallery-pause');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=false,visible=false,loaded=0,frame=0,last=0,position=0,direction=1,resumeAt=0,touching=false,hovering=false,focused=false;
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;}
 function defer(){resumeAt=performance.now()+2500;stop();}
 function eligible(now){return !paused&&visible&&!document.hidden&&!reduced.matches&&loaded>1&&!touching&&!hovering&&!focused&&now>=resumeAt;}
 function tick(now){
  frame=0;
  if(!eligible(now)){last=0;return;}
  const max=Math.max(0,track.scrollWidth-track.clientWidth);
  if(max<2){last=0;return;}
  if(!last){position=track.scrollLeft;last=now;}
  const dt=Math.min(now-last,40);last=now;
  position+=direction*dt*.025;
  if(position>=max){position=max;direction=-1;}
  if(position<=0){position=0;direction=1;}
  track.scrollLeft=position;
  frame=requestAnimationFrame(tick);
 }
 function start(){if(!frame&&eligible(performance.now()))frame=requestAnimationFrame(tick);}
 const wake=setInterval(start,250);
 function show(img){const slide=img.closest('figure');if(!slide.hidden)return;slide.hidden=false;root.hidden=false;loaded++;start();}
 root.querySelectorAll('img').forEach(img=>{
  img.loading='eager';img.draggable=false;
  img.addEventListener('load',()=>show(img));
  if(img.complete&&img.naturalWidth)show(img);
 });
 button.addEventListener('click',()=>{
  paused=!paused;button.textContent=paused?'Riprendi':'Pausa';
  button.setAttribute('aria-label',paused?'Riprendi lo scorrimento':'Metti in pausa lo scorrimento');
  stop();if(!paused){resumeAt=0;start();}
 });
 track.addEventListener('touchstart',()=>{touching=true;defer();},{passive:true});
 track.addEventListener('touchend',e=>{touching=e.touches.length>0;defer();},{passive:true});
 track.addEventListener('touchcancel',()=>{touching=false;defer();},{passive:true});
 track.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;defer();}});
 track.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hovering=false;defer();}});
 track.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')defer();},{passive:true});
 track.addEventListener('wheel',defer,{passive:true});
 track.addEventListener('focusin',()=>{focused=true;defer();});
 track.addEventListener('focusout',e=>{if(!track.contains(e.relatedTarget)){focused=false;defer();}});
 track.addEventListener('scroll',()=>{if(!frame)resumeAt=Math.max(resumeAt,performance.now()+1500);},{passive:true});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)stop();else start();},{threshold:.15}).observe(root);
 else{visible=true;start();}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
 if(reduced.addEventListener)reduced.addEventListener('change',()=>{stop();start();});
 else reduced.addListener(()=>{stop();start();});
})();
