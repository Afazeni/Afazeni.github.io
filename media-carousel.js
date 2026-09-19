// 产品图、分析图片和图片/视频混合轮播共用模板，各自维护计时与播放状态。
const attr = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function carouselMarkup({id, items, intervalMs = 1000, label, cover = false}, t, s) {
  return `<section class="project-carousel ${cover ? 'cover-carousel' : 'section-carousel'}" data-carousel-id="${attr(id)}" data-interval-ms="${intervalMs}" role="region" aria-roledescription="${s('轮播','carousel')}" aria-label="${attr(label)}" tabindex="0">
    <div class="carousel-slides">${items.map((item, index) => {
      const caption = t(item.alt);
      const visual = item.type === 'video'
        ? `<video class="carousel-video" controls muted playsinline preload="none" poster="assets/${attr(item.poster)}" aria-label="${attr(caption)}"><source src="assets/${attr(item.src)}" type="video/mp4"><a href="assets/${attr(item.src)}">${s('打开视频','Open video')}</a></video>`
        : `<img src="assets/${attr(item.src)}" alt="${attr(caption)}" ${cover && !index ? 'fetchpriority="high"' : 'loading="eager"'}>`;
      return `<figure class="carousel-slide ${cover ? 'project-cover' : 'carousel-slide-media'}" ${index ? 'hidden' : ''} data-caption="${attr(caption)}" data-duration-ms="${item.durationMs || intervalMs}" role="group" aria-roledescription="${s('幻灯片','slide')}" aria-label="${index+1} / ${items.length}">${visual}</figure>`;
    }).join('')}</div>
    <div class="carousel-controls"><div class="carousel-navigation"><button type="button" data-carousel="previous" aria-label="${s('上一项','Previous item')}">←</button><p class="carousel-count" aria-live="off" aria-atomic="true">1 / ${items.length}</p><button type="button" data-carousel="next" aria-label="${s('下一项','Next item')}">→</button></div><p class="carousel-caption">${attr(t(items[0].alt))}</p><button type="button" class="carousel-pause" data-carousel="pause"></button></div>
    <p class="carousel-status" role="status"></p>
  </section>`;
}

export function initializeCarousels(s, motion, signal) {
  const cleanups = [...document.querySelectorAll('[data-carousel-id]')].map(carousel => {
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const counter = carousel.querySelector('.carousel-count');
    const caption = carousel.querySelector('.carousel-caption');
    const toggle = carousel.querySelector('[data-carousel="pause"]');
    const status = carousel.querySelector('.carousel-status');
    const expectedPauses = new WeakSet();
    let index = 0, manualPaused = motion.matches, hovered = false, ignoreHover = false;
    let visible = false, manualVideo = false, disposed = false;
    let timer = null, started = 0, remaining = Number(slides[0].dataset.durationMs);
    const currentVideo = () => slides[index].querySelector('video');
    const running = () => !disposed && !manualPaused && visible && !document.hidden && (!hovered || ignoreHover);
    function clearTimer() {
      if (timer !== null) {
        clearTimeout(timer);
        remaining = Math.max(0, remaining - (performance.now() - started));
        timer = null;
      }
    }
    function pauseVideo(video) {
      if (video && !video.paused) { expectedPauses.add(video); video.pause(); }
    }
    function updateStatus() {
      toggle.textContent = manualPaused ? s('播放轮播','Play slideshow') : s('暂停轮播','Pause slideshow');
      counter.setAttribute('aria-live', running() ? 'off' : 'polite');
      const seconds = Number(slides[index].dataset.durationMs)/1000;
      status.textContent = manualPaused ? s('已暂停 · 点击播放轮播继续','Paused · Select Play slideshow to continue')
        : document.hidden || !visible ? s('不在可视区域，已暂停','Paused while out of view')
        : hovered && !ignoreHover ? s('鼠标停留，暂时暂停','Temporarily paused while hovering')
        : currentVideo() ? s('视频播放完毕后切换','Advances when the video ends')
        : s(`每 ${seconds} 秒切换一张`,`Advances after ${seconds} second${seconds===1?'':'s'}`);
    }
    function sync() {
      clearTimer();
      if (disposed) return;
      updateStatus();
      const video = currentVideo();
      if (!running()) {
        if (!manualVideo || !visible || document.hidden) pauseVideo(video);
        return;
      }
      if (video) {
        if (video.ended) { show(index+1); return; }
        video.play().then(() => {
          if (disposed || video !== currentVideo() || (!running() && !manualVideo)) pauseVideo(video);
        }).catch(error => {
          // 离屏或切项取消 play() 时仍允许再次进入后播放。
          if (!disposed && video === currentVideo() && error.name !== 'AbortError') {
            manualPaused = true; manualVideo = false; sync();
          }
        });
      } else {
        started = performance.now();
        timer = setTimeout(() => { timer = null; remaining = 0; show(index+1); }, remaining);
      }
    }
    function show(next) {
      clearTimer();
      const previous = currentVideo();
      pauseVideo(previous);
      if (previous) previous.currentTime = 0;
      manualVideo = false;
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i!==index; });
      remaining = Number(slides[index].dataset.durationMs);
      counter.textContent = `${index+1} / ${slides.length}`;
      caption.textContent = slides[index].dataset.caption;
      sync();
    }
    function manual(next) { manualPaused = true; show(next); }
    carousel.querySelector('[data-carousel="previous"]').addEventListener('click', () => manual(index-1), {signal});
    carousel.querySelector('[data-carousel="next"]').addEventListener('click', () => manual(index+1), {signal});
    toggle.addEventListener('click', () => {
      manualPaused = !manualPaused; ignoreHover = !manualPaused; manualVideo = false;
      sync();
    }, {signal});
    carousel.addEventListener('mouseenter', () => { hovered = true; ignoreHover = false; manualVideo = false; sync(); }, {signal});
    carousel.addEventListener('mouseleave', () => { hovered = false; sync(); }, {signal});
    carousel.addEventListener('focusin', event => {
      if (event.target.matches(':focus-visible')) { manualPaused = true; manualVideo = false; sync(); }
    }, {signal});
    carousel.addEventListener('keydown', event => {
      // 方向键在原生视频控件上用于快进/音量，不劫持。
      if (event.target.closest('video')) return;
      if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
        event.preventDefault();
        manual(event.key==='Home' ? 0 : event.key==='End' ? slides.length-1 : index+(event.key==='ArrowRight'?1:-1));
      }
    }, {signal});
    carousel.querySelectorAll('video').forEach(video => {
      video.muted = true;
      video.addEventListener('play', () => {
        if (disposed || video !== currentVideo() || !visible || document.hidden) { pauseVideo(video); return; }
        // 自动播放暂停时仍允许用户单独操作原生播放按钮。
        if (!running()) manualVideo = true;
      }, {signal});
      video.addEventListener('pause', () => {
        if (expectedPauses.has(video)) { expectedPauses.delete(video); return; }
        if (video === currentVideo() && !video.ended) {
          manualPaused = true; manualVideo = false; sync();
        }
      }, {signal});
      video.addEventListener('ended', () => {
        if (video === currentVideo() && running()) show(index+1);
      }, {signal});
    });
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio>=0.25;
      if (!visible) manualVideo = false;
      sync();
    }, {threshold:[0,0.25]});
    observer.observe(carousel);
    document.addEventListener('visibilitychange', () => { if (document.hidden) manualVideo = false; sync(); }, {signal});
    motion.addEventListener('change', () => {
      if (motion.matches) { manualPaused = true; manualVideo = false; }
      sync();
    }, {signal});
    updateStatus();
    return () => {
      disposed = true; clearTimer(); observer.disconnect();
      carousel.querySelectorAll('video').forEach(pauseVideo);
    };
  });
  return () => cleanups.forEach(cleanup => cleanup());
}
