'use strict';
(()=>{
 const hero=document.querySelector('.hero'), art=hero?.querySelector('.art-layer');
 if(!hero||!art)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const sections=[...document.querySelectorAll('.editorial-section:not(#lavora) .editorial-image img')];
 const clamp=n=>Math.min(1,Math.max(0,n));
 const mobile=()=>matchMedia('(max-width:760px)').matches;
 const paint=(p)=>{art.style.transformOrigin=mobile()?'60% 65%':'65% 55%';art.style.transform='scale('+(1+p*(mobile()?.38:.48))+')';};
 let raf=0, cleanup=()=>{}, generation=0;
 function reset(){art.style.removeProperty('transform');art.style.removeProperty('transform-origin');sections.forEach(el=>el.style.removeProperty('transform'));}
 function native(){
  function render(){raf=0;if(reduced.matches)return;const r=hero.getBoundingClientRect();paint(clamp(-r.top/(r.height*.6)));for(const el of sections){const b=el.parentElement.getBoundingClientRect();const p=clamp((innerHeight-b.top)/(innerHeight+b.height));el.style.transform='scale('+(1+.09*Math.sin(Math.PI*p))+')';}}
  function schedule(){if(!raf)raf=requestAnimationFrame(render);}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});schedule();
  return ()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(raf);raf=0;reset();};
 }
 function start(){
  cleanup();reset();if(reduced.matches)return;
  if(window.gsap&&window.ScrollTrigger){
   gsap.registerPlugin(ScrollTrigger);
   const ctx=gsap.context(()=>{
    const state={p:0};
    gsap.to(state,{p:1,ease:'none',onUpdate:()=>paint(state.p),scrollTrigger:{trigger:hero,start:'top top',end:()=>'+='+Math.round(hero.offsetHeight*.6),scrub:true,invalidateOnRefresh:true}});
    for(const el of sections){gsap.fromTo(el,{scale:1},{scale:1.09,ease:'sine.inOut',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true,invalidateOnRefresh:true}});}
   });
   ScrollTrigger.refresh();
   cleanup=()=>{ctx.revert();reset();};
  }else cleanup=native();
 }
 function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});}
 start();
 if(reduced.addEventListener)reduced.addEventListener('change',start);else reduced.addListener(start);
 if(!window.gsap)load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js').then(()=>load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js')).then(start).catch(()=>{});
 else if(!window.ScrollTrigger)load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js').then(start).catch(()=>{});
})();