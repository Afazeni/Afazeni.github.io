// 首页技能横幅：内容、动画状态和清理均独立于页面渲染。
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function skillsMarkup(config, s) {
  return `<section class="skills-banner" aria-label="${s('工程技能','Engineering skills')}"><div class="skills-viewport" tabindex="0" aria-label="${s('技能列表，可横向浏览','Skills list, scroll horizontally')}"><div class="skills-track"><div class="skills-group" role="list">${config.words.map(word=>`<span class="skills-word" role="listitem">${escape(word)}</span>`).join('')}</div></div></div><button class="skills-toggle" type="button" aria-pressed="false">${s('暂停横幅','Pause banner')}</button></section>`;
}

export function initializeSkills(config, s, saved) {
  const root = document.querySelector('.skills-banner');
  if (!root) return;
  const viewport = root.querySelector('.skills-viewport');
  const track = root.querySelector('.skills-track');
  const group = track.firstElementChild;
  const toggle = root.querySelector('.skills-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverDevice = matchMedia('(hover: hover)');
  const controller = new AbortController();
  const options = {signal:controller.signal};
  let manual = saved?.manual ?? false;
  let hovering = false;
  let focused = false;
  let disposed = false;
  let progress = saved?.progress ?? 0;
  let width = 0;
  let copies = 0;
  const animation = () => track.getAnimations()[0];
  const phase = () => {
    const a = animation();
    return a ? (Number(a.currentTime) % Number(a.effect.getTiming().duration)) / Number(a.effect.getTiming().duration) : progress;
  };
  function update() {
    const paused = manual || hovering || focused || reduced.matches;
    track.style.animationPlayState = paused ? 'paused' : 'running';
    toggle.hidden = reduced.matches;
    toggle.setAttribute('aria-pressed', String(manual));
    toggle.textContent = manual ? s('继续横幅','Resume banner') : s('暂停横幅','Pause banner');
    root.dataset.paused = String(paused);
  }
  function measure() {
    if (disposed) return;
    const newWidth = group.getBoundingClientRect().width;
    if (!newWidth) return;
    const needed = reduced.matches ? 1 : Math.ceil(viewport.clientWidth / newWidth) + 2;
    if (newWidth === width && needed === copies) return;
    if (width) progress = phase();
    while (track.children.length > 1) track.lastElementChild.remove();
    for (let i=1; i<needed; i++) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden','true');
      track.append(clone);
    }
    width = newWidth;
    copies = needed;
    track.style.setProperty('--skills-distance', `${width}px`);
    const duration = width / (Number(config.speed) > 0 ? Number(config.speed) : 35);
    track.style.setProperty('--skills-duration', `${duration}s`);
    root.classList.toggle('is-static', reduced.matches);
    const a = animation();
    if (a) a.currentTime = progress * duration * 1000;
    update();
  }
  viewport.addEventListener('pointerover', event => {
    if (hoverDevice.matches && event.pointerType !== 'touch' && event.target.closest('.skills-word')) { hovering=true; update(); }
  }, options);
  viewport.addEventListener('pointerout', event => {
    if (!event.relatedTarget?.closest?.('.skills-word')) { hovering=false; update(); }
  }, options);
  viewport.addEventListener('focus', () => { focused=true; update(); }, options);
  viewport.addEventListener('blur', () => { focused=false; update(); }, options);
  toggle.addEventListener('click', () => { manual=!manual; update(); }, options);
  reduced.addEventListener('change', () => { copies=0; hovering=false; measure(); }, options);
  const observer = new ResizeObserver(measure);
  observer.observe(viewport);
  observer.observe(group);
  measure();
  document.fonts.ready.then(measure);
  return {
    snapshot: () => ({manual, progress:phase()}),
    destroy: () => { disposed=true; observer.disconnect(); controller.abort(); }
  };
}
