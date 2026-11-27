'use strict';
(()=>{
const trigger=document.querySelector('header .menu'),panel=document.getElementById('mobileNav'),close=panel.querySelector('.engineering-close');
function openMenu(){if(panel.open)return;panel.showModal();trigger.setAttribute('aria-expanded','true');document.body.classList.add('nav-open');}
function closeMenu(){if(panel.open)panel.close();}
trigger.addEventListener('click',openMenu);
close.addEventListener('click',closeMenu);
panel.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');document.body.classList.remove('nav-open');});
panel.addEventListener('click',e=>{const link=e.target.closest('a[href^="#"]');if(!link)return;e.preventDefault();const target=document.getElementById(link.hash.slice(1));closeMenu();if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});history.replaceState(null,'',link.hash);}});
})();
