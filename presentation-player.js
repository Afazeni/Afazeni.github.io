// 逐页内容独立于播放器；所有媒体地址相对 assets。
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function presentationMarkup(id, deck, t, s) {
  if (!deck?.slides?.length) return '';
  return `<section class="presentation-section" data-presentation="${escape(id)}" aria-labelledby="presentation-heading">
    <div class="section-heading"><h2 id="presentation-heading">${s('PPT 逐页展示','Presentation walkthrough')}</h2><p>${s('播放演示，或选择一页查看解说。','Play the presentation or select a slide to explore.')}</p></div>
    <div class="presentation-layout"><div class="presentation-notes">
      <p class="presentation-count" aria-live="polite" aria-atomic="true"></p>
      <h3 class="presentation-title"></h3><p class="presentation-text"></p>
      <div class="presentation-navigation"><button type="button" data-presentation-action="previous">← ${s('上一页','Previous')}</button><button type="button" data-presentation-action="next">${s('下一页','Next')} →</button></div>
      <nav class="presentation-pages" aria-label="${s('选择演示页','Select presentation slide')}">${deck.slides.map((slide,i)=>`<button type="button" data-slide="${i}" aria-label="${escape(s(`第 ${i+1} 页：`,`Slide ${i+1}: `)+t(slide.title))}">${i+1}</button>`).join('')}</nav>
    </div><div class="presentation-screen"><video class="presentation-video" controls playsinline preload="none" poster="assets/${escape(deck.poster)}" aria-label="${s('PPT 完整演示视频','Complete presentation video')}"><source src="assets/${escape(deck.video)}" type="video/mp4">${s('浏览器无法播放此视频。','Your browser cannot play this video.')}</video><div class="presentation-error" role="alert" hidden><p>${s('演示视频暂时无法加载，请检查网络后重试。','The presentation could not load. Check your connection and retry.')}</p><button type="button" data-presentation-action="retry">${s('重试','Retry')}</button></div><p class="presentation-hint">${s('演示画面为中文；左侧解说支持中英切换。','The presentation is in Chinese; the commentary is available in English and Chinese.')}</p></div></div>
  </section>`;
}

export function initializePresentation(decks, t, s, restored) {
  const root = document.querySelector('[data-presentation]');
  if (!root) return { snapshot: () => null, destroy: () => {} };
  const deck = decks[root.dataset.presentation];
  const video = root.querySelector('video');
  const controller = new AbortController();
  const signal = controller.signal;
  const buttons = [...root.querySelectorAll('[data-slide]')];
  const previous = root.querySelector('[data-presentation-action="previous"]');
  const next = root.querySelector('[data-presentation-action="next"]');
  const error = root.querySelector('.presentation-error');
  let index = -1, pendingTime = null, wantPlaying = false;
  function show(i) {
    if (i === index) return;
    index = i;
    const slide = deck.slides[i];
    root.querySelector('.presentation-count').textContent = s(`第 ${i+1} 页 / 共 ${deck.slides.length} 页`, `Slide ${i+1} of ${deck.slides.length}`);
    root.querySelector('.presentation-title').textContent = t(slide.title);
    root.querySelector('.presentation-text').textContent = t(slide.text);
    buttons.forEach((button,n)=>{ if(n===i) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current'); });
    previous.disabled = i===0;
    next.disabled = i===deck.slides.length-1;
  }
  function sync() {
    if (pendingTime !== null) return;
    let current = 0;
    for (let i=1; i<deck.slides.length && deck.slides[i].start<=video.currentTime; i++) current=i;
    show(current);
  }
  function applySeek() {
    if (pendingTime === null || video.readyState < 1) return;
    video.currentTime = Math.min(pendingTime, Number.isFinite(video.duration) ? video.duration : pendingTime);
    pendingTime = null;
    sync();
    if (wantPlaying) video.play().catch(()=>{ wantPlaying = false; });
  }
  function seek(time, playing) {
    pendingTime = time;
    wantPlaying = playing;
    if (video.readyState >= 1) applySeek();
    else video.load();
  }
  function select(i) {
    show(i);
    seek(deck.slides[i].seek ?? deck.slides[i].start, !video.paused || (pendingTime !== null && wantPlaying));
  }
  buttons.forEach((button,i)=>button.addEventListener('click',()=>select(i),{signal}));
  previous.addEventListener('click',()=>select(Math.max(0,index-1)),{signal});
  next.addEventListener('click',()=>select(Math.min(deck.slides.length-1,index+1)),{signal});
  video.addEventListener('loadedmetadata',applySeek,{signal});
  ['timeupdate','seeked','ended'].forEach(event=>video.addEventListener(event,sync,{signal}));
  const failed = () => { error.hidden = false; };
  video.addEventListener('error',failed,{signal});
  video.querySelector('source').addEventListener('error',failed,{signal});
  root.querySelector('[data-presentation-action="retry"]').addEventListener('click',()=>{
    error.hidden = true;
    pendingTime = pendingTime ?? video.currentTime;
    video.load();
  },{signal});
  show(0);
  if (restored?.id === root.dataset.presentation) {
    video.muted = restored.muted;
    video.volume = restored.volume;
    video.playbackRate = restored.rate;
    show(restored.index);
    if (restored.loaded || restored.time > 0 || restored.playing) seek(restored.time, restored.playing);
  }
  return {
    snapshot: () => ({id:root.dataset.presentation, index, time:pendingTime ?? video.currentTime, playing:pendingTime !== null ? wantPlaying : !video.paused, loaded:video.readyState>0, muted:video.muted, volume:video.volume, rate:video.playbackRate}),
    destroy: () => { controller.abort(); video.pause(); video.removeAttribute('src'); video.querySelector('source').removeAttribute('src'); video.load(); }
  };
}
