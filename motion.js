'use strict';
(()=>{
 const hero=document.querySelector('.hero');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let pending=false;
 function render(){
  pending=false;
  if(reduce.matches){hero.style.removeProperty('--art-shift');hero.style.removeProperty('--grid-shift');return;}
  const rect=hero.getBoundingClientRect();
  const distance=Math.max(0,Math.min(hero.offsetHeight,-rect.top));
  hero.style.setProperty('--art-shift',Math.min(42,distance*.065)+'px');
  hero.style.setProperty('--grid-shift',Math.min(80,distance*.12)+'px');
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(render);}}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 if(reduce.addEventListener)reduce.addEventListener('change',schedule);
 else reduce.addListener(schedule);
 schedule();
})();
