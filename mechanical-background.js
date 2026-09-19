// Shared drafting patterns; illustrative only, never product dimensions or results.
export function draftingPattern(kind = 'arc') {
  const shapes = {
    arc: '<path d="M12 66H208"/><path d="M90 66A48 48 0 0 1 186 66"/><path d="M138 10V83M112 66H164" class="cad-centerline"/><circle cx="138" cy="66" r="4"/>',
    dimension: '<path d="M20 15V80M195 15V80M20 35H195M29 31L20 35L29 39M186 31L195 35L186 39"/><path d="M45 64H170" class="cad-centerline"/>',
    slider: '<path d="M14 66H208M155 45H183V73H155Z"/><path d="M44 60L85 27L169 59"/><circle cx="44" cy="60" r="17"/><circle cx="85" cy="27" r="4"/><path d="M44 20V84M15 60H76" class="cad-centerline"/>',
    section: '<path d="M30 20H182V70H30ZM30 70L80 20M54 70L104 20M78 70L128 20M102 70L152 20M126 70L176 20"/><path d="M10 45H208" class="cad-centerline"/>'
  };
  return `<svg viewBox="0 0 220 90" fill="none" aria-hidden="true">${shapes[kind] || shapes.arc}</svg>`;
}

function drawingHeader(number, pattern) {
  return `<div class="cad-section-drawing" aria-hidden="true">${draftingPattern(pattern)}<span>${number} / REV.A</span></div>`;
}

function bannerMarkup() {
  return `<svg viewBox="0 0 680 550" fill="none" aria-hidden="true"><g class="cad-fixed"><path d="M70 260H640M200 105V405" class="cad-centerline"/><circle cx="200" cy="260" r="65"/><path d="M290 248H600M290 272H600M200 430H540M200 413V447M540 413V447M210 425L200 430L210 435M530 425L540 430L530 435"/><path d="M155 332L200 305L245 332M168 338L178 328M184 338L194 318M200 338L210 312M216 338L226 322"/><path d="M115 138C265 34 424 65 566 168" class="cad-centerline"/></g><g class="cad-moving"><path data-linkage/><circle data-crank-pin r="6"/><circle cx="200" cy="260" r="7"/><rect data-slider y="243" width="36" height="34" rx="1"/><circle data-slider-pin cy="260" r="5"/></g><g class="cad-banner-labels"><text x="78" y="180">KINEMATIC STUDY</text><text x="348" y="468">ASSEMBLY / REV.A</text><text x="207" y="285">O</text><text x="576" y="250">X</text></g></svg>`;
}

export function initializeMechanicalBackground() {
  const main = document.querySelector('main');
  const page = document.body.dataset.page;
  if (!main || page === 'aigc' || page === 'resume') return () => {};
  const controller = new AbortController();
  const {signal} = controller;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 800px)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const staticMode = () => motion.matches || mobile.matches;
  const added = [];
  const decorated = [];
  const animations = new Set();
  main.classList.add('cad-document');
  const background = document.createElement('div');
  background.className = 'cad-background';
  background.setAttribute('aria-hidden','true');
  background.innerHTML = `<div class="cad-grid"></div><div class="cad-margin cad-margin-a">${draftingPattern('dimension')}<span>VIEW A</span></div><div class="cad-margin cad-margin-b">${draftingPattern('slider')}<span>MECHANISM DESIGN</span></div><div class="cad-sheet-note">DRAWING NO. CY-001 / REV.A</div>`;
  main.prepend(background); added.push(background);
  const hero = main.querySelector('.hero');
  let banner, pauseButton;
  let heroVisible = false, userPaused = false, phase = .65, lastTime = 0, frame = 0;
  if(hero){
    banner = document.createElement('div'); banner.className='cad-banner';
    banner.setAttribute('aria-hidden','true');banner.innerHTML=bannerMarkup();
    hero.prepend(banner);added.push(banner);
    pauseButton=document.createElement('button');pauseButton.className='cad-motion-toggle';
    pauseButton.type='button';try{userPaused=sessionStorage.getItem('cad-motion-paused')==='true';}catch{}
    const en=document.documentElement.lang==='en';
    const label=()=>{pauseButton.textContent=userPaused?(en?'Resume background':'播放背景'):(en?'Pause background':'暂停背景');pauseButton.setAttribute('aria-pressed',String(userPaused));};
    label();hero.append(pauseButton);added.push(pauseButton);
    pauseButton.addEventListener('click',()=>{userPaused=!userPaused;try{sessionStorage.setItem('cad-motion-paused',String(userPaused));}catch{}label();lastTime=0;schedule();},{signal});
  }
  const linkage=banner?.querySelector('[data-linkage]');
  function pose(){
    if(!banner)return;
    // Slider-crank: fixed crank radius 65, connecting rod length 230.
    const x=200+65*Math.cos(phase),y=260+65*Math.sin(phase);
    const slider=x+Math.sqrt(230**2-(y-260)**2);
    linkage.setAttribute('d',`M200 260L${x} ${y}L${slider} 260`);
    const pin=banner.querySelector('[data-crank-pin]');pin.setAttribute('cx',x);pin.setAttribute('cy',y);
    banner.querySelector('[data-slider]').setAttribute('x',slider-18);
    banner.querySelector('[data-slider-pin]').setAttribute('cx',slider);
  }
  function draw(time){
    frame=0;
    if(document.hidden)return;
    const still=staticMode();
    background.style.setProperty('--cad-grid-y',`${still?0:-(scrollY*.2)%110}px`);
    background.style.setProperty('--cad-geometry-y',`${still?0:Math.min(65,scrollY*.035)}px`);
    background.style.setProperty('--cad-note-y',`${still?0:Math.min(28,scrollY*.015)}px`);
    if(heroVisible&&!still&&!userPaused){if(lastTime)phase+=(Math.min(50,time-lastTime)/24000)*Math.PI*2;lastTime=time;pose();schedule();}else lastTime=0;
  }
  function schedule(){if(!frame&&!document.hidden)frame=requestAnimationFrame(draw);}
  const heroObserver=new IntersectionObserver(entries=>{heroVisible=entries.some(e=>e.isIntersecting);lastTime=0;schedule();});
  if(hero)heroObserver.observe(hero);
  pose();

  // Reserve the existing whitespace; do not wrap or reorder content.
  const targets=page==='home' ? [...main.querySelectorAll('#work > .section-heading,#experience > .section-heading,.about-grid > div:first-child')]
    : page==='honors' ? [...main.querySelectorAll('.page-intro,.patents-section .section-heading')]
    : [...main.querySelectorAll('.video-section > .section-heading,.detail-section > div:last-child,.methods-section > .section-heading')];
  const patterns=['arc','dimension','slider','section'];
  const sectionObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      const target=entry.target;sectionObserver.unobserve(target);target.classList.add('cad-drawn');
      if(staticMode())continue;
      const paths=target.querySelectorAll('.cad-section-drawing path,.cad-section-drawing circle');
      paths.forEach((path,i)=>{
        const length=path.getTotalLength();
        const anim=path.animate([{strokeDasharray:`${length} ${length}`,strokeDashoffset:length,opacity:0},{strokeDasharray:`${length} ${length}`,strokeDashoffset:0,opacity:1}],{duration:520,fill:'backwards',delay:Math.min(i*80,240),easing:'cubic-bezier(.22,1,.36,1)'});
        animations.add(anim);anim.onfinish=()=>animations.delete(anim);
      });
      const stamp=target.querySelector('.cad-section-drawing span');
      if(stamp){const anim=stamp.animate([{opacity:0},{opacity:.55}],{duration:240,delay:400,fill:'backwards'});animations.add(anim);anim.onfinish=()=>animations.delete(anim);}
      const title=target.querySelector('h2,h1');
      if(title){const anim=title.animate([{opacity:.72},{opacity:1}],{duration:320,delay:450,easing:'ease-out'});animations.add(anim);anim.onfinish=()=>animations.delete(anim);}
    }
  },{threshold:.15});
  targets.forEach((target,i)=>{
    target.classList.add('cad-section');decorated.push(target);
    const n=page==='honors'&&i===0?'04':String(i+1).padStart(2,'0');
    target.insertAdjacentHTML('afterbegin',drawingHeader(n,patterns[i%patterns.length]));
    added.push(target.firstElementChild);
    const label=target.querySelector('.section-label');
    if(label){const prefix=document.createElement('span');prefix.className='cad-section-number';prefix.setAttribute('aria-hidden','true');prefix.textContent=`${n} / `;label.prepend(prefix);added.push(prefix);}
    sectionObserver.observe(target);
  });

  main.querySelectorAll('.project-card').forEach(card=>{
    const image=card.querySelector('.project-image');
    const locator=document.createElement('span');locator.className='cad-locator';locator.setAttribute('aria-hidden','true');image.append(locator);added.push(locator);
    let cursorFrame=0,cursorX=0,cursorY=0;
    image.addEventListener('pointermove',e=>{
      if(staticMode()||!pointer.matches)return;
      const rect=image.getBoundingClientRect();cursorX=e.clientX-rect.left;cursorY=e.clientY-rect.top;
      if(!cursorFrame)cursorFrame=requestAnimationFrame(()=>{cursorFrame=0;locator.style.transform=`translate(${cursorX}px,${cursorY}px)`;});
    },{passive:true,signal});
    signal.addEventListener('abort',()=>cancelAnimationFrame(cursorFrame),{once:true});
  });
  function preference(){
    if(staticMode()) {animations.forEach(a=>a.cancel());animations.clear();phase=.65;pose();}
    lastTime=0;schedule();
  }
  window.addEventListener('scroll',schedule,{passive:true,signal});
  window.addEventListener('resize',schedule,{passive:true,signal});
  motion.addEventListener('change',preference,{signal});mobile.addEventListener('change',preference,{signal});
  document.addEventListener('visibilitychange',()=>{lastTime=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();},{signal});
  schedule();
  return ()=>{controller.abort();cancelAnimationFrame(frame);heroObserver.disconnect();sectionObserver.disconnect();animations.forEach(a=>a.cancel());added.forEach(el=>el.remove());decorated.forEach(el=>el.classList.remove('cad-section','cad-drawn'));main.classList.remove('cad-document');};
}
