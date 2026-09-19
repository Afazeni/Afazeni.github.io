import { carouselMarkup, initializeCarousels } from './media-carousel.js';
// 项目媒体模板及生命周期。语言切换时由 app.js 清理旧计时器和观察器。
export function coverMarkup(project, t, s) {
  if (!project.gallery) return `<figure class="project-cover ${project.id}"><img src="assets/${project.image}" alt="${t(project.subtitle)}${s('渲染图',' rendering')}" fetchpriority="high"></figure>`;
  return carouselMarkup({id: `${project.id}-product`, items: project.gallery, intervalMs: project.galleryIntervalMs || 1000, label: s('安伴智护产品形态','Anban Care configurations'), cover: true}, t, s);
}

export function sectionMarkup(section, index, t, s) {
  const media = section.media || { type: 'image', src: section.image };
  const visual = media.type === 'carousel'
    ? carouselMarkup({...media, label: t(section.title)}, t, s)
    : media.type === 'video'
    ? `<video class="detail-video" controls muted loop playsinline preload="none" poster="assets/${media.poster}" aria-label="${t(section.title)}${s('演示',' demonstration')}"><source src="assets/${media.src}" type="video/mp4">${s('浏览器无法播放此视频。','Your browser cannot play this video.')} <a href="assets/${media.src}">${s('打开视频','Open video')}</a></video>`
    : `<img src="assets/${media.src}" alt="${t(section.title)}" loading="lazy">`;
  return `<section class="detail-section ${index%2 ? 'reverse' : ''}"><div class="detail-image ${media.type==='carousel' ? 'detail-carousel' : media.type==='video' ? 'detail-media-video' : ''}">${visual}</div><div><h2>${t(section.title)}</h2>${section.subtitle ? `<h3 class="detail-subtitle">${t(section.subtitle)}</h3>` : ''}<p>${t(section.text)}</p></div></section>`;
}

export function initializeMedia(s) {
  const controller = new AbortController();
  const signal = controller.signal;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cleanupCarousels = initializeCarousels(s, motion, signal);

  const states = [...document.querySelectorAll('.detail-video')].map(video => ({video, visible:false, userPaused:false, autoPause:false, blocked:false}));
  function stop(state) {
    if (!state.video.paused) { state.autoPause = true; state.video.pause(); }
  }
  function sync(state) {
    if (!state.visible || document.hidden) { stop(state); return; }
    if (!motion.matches && !state.userPaused && !state.blocked) {
      state.video.play().catch(error => {
        // 快速滚出可视区时 pause() 会取消尚未开始的 play()；返回后仍应能自动播放。
        if (error.name === 'NotAllowedError') state.blocked = true;
      });
    }
  }
  states.forEach(state => {
    state.video.muted = true;
    state.video.addEventListener('pause', () => {
      if (!state.autoPause) state.userPaused = true;
      state.autoPause = false;
    }, {signal});
    state.video.addEventListener('play', () => {
      state.userPaused = false; state.blocked = false;
      if (!state.visible || document.hidden) stop(state);
    }, {signal});
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const state = states.find(item => item.video===entry.target);
      state.visible = entry.isIntersecting && entry.intersectionRatio>=0.25;
      sync(state);
    });
  }, {threshold:[0,0.25]});
  states.forEach(state => observer.observe(state.video));
  document.addEventListener('visibilitychange', () => states.forEach(sync), {signal});
  motion.addEventListener('change', () => states.forEach(state => motion.matches ? stop(state) : sync(state)), {signal});
  return () => { controller.abort(); cleanupCarousels(); observer.disconnect(); states.forEach(stop); };
}
