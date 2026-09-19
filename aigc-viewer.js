import { aigc } from './aigc-content.js';
const escape = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function aigcMarkup(s) {
  return `<main id="main" class="aigc-reader"><div class="aigc-toolbar"><a class="aigc-back" href="index.html#discover">← ${s('返回首页','Back home')}</a><h1>${s('AIGC 作品集','AIGC Portfolio')} <span>2025</span></h1><label class="aigc-page-control">${s('页码','Page')} <input class="aigc-page-input" type="number" min="1" max="${aigc.pages.length}" value="1" aria-label="${s('跳转页码','Go to page')}"> / ${aigc.pages.length}</label><a class="aigc-original" href="${aigc.file}" target="_blank" rel="noopener noreferrer">${s('打开原件','Open PDF')} ↗</a></div><div class="aigc-workspace"><button class="aigc-rail" aria-expanded="false" aria-controls="aigc-notes" aria-label="${s('展开逐页解说','Show commentary')}" title="${s('展开逐页解说','Show commentary')}"><span aria-hidden="true">▸</span></button><aside id="aigc-notes" class="aigc-notes" hidden aria-label="${s('逐页解说','Page commentary (Chinese)')}" tabindex="0"><div class="aigc-notes-label">${s('逐页解说','COMMENTARY · 中文')}</div>${aigc.pages.map((p,i)=>`<button class="aigc-note" data-note="${i}" lang="zh-CN"><span class="aigc-note-number">P${p.page}</span><span>${escape(p.text)}</span></button>`).join('')}</aside><div class="aigc-pages" tabindex="0" aria-label="${s('作品集，滚轮连续阅读','Portfolio, scroll to read continuously')}"><div class="aigc-loading" role="status">${s('正在加载作品集…','Loading portfolio…')}</div></div><div class="aigc-error" hidden role="alert"><p></p><button class="aigc-retry">${s('重新加载','Retry')}</button><a href="${aigc.file}" target="_blank" rel="noopener noreferrer">${s('打开 PDF 原件','Open original PDF')}</a></div></div></main>`;
}

export function initializeAigc(s, saved) {
  const root = document.querySelector('.aigc-reader');
  if (!root) return;
  const pages = root.querySelector('.aigc-pages');
  const notes = root.querySelector('.aigc-notes');
  const noteButtons = [...notes.querySelectorAll('.aigc-note')];
  const rail = root.querySelector('.aigc-rail');
  const input = root.querySelector('.aigc-page-input');
  const errorBox = root.querySelector('.aigc-error');
  const controller = new AbortController();
  const opts = {signal:controller.signal};
  let disposed=false, observer, frame=0, pumping=false;
  let current = Math.max(0,Math.min(aigc.pages.length-1,saved?.current ?? (Number(new URLSearchParams(location.hash.slice(1)).get('page')) || 1)-1));
  let open = saved?.open ?? false;
  let sheets=[], desired=new Set(), sheetWidth=0, lastOffset=saved?.offset ?? 0;
  const rendered = new Map();
  function sidebar() {
    root.classList.toggle('notes-open',open);
    notes.hidden=!open;
    rail.setAttribute('aria-expanded',String(open));
    const label=open?s('收起逐页解说','Hide commentary'):s('展开逐页解说','Show commentary');
    rail.setAttribute('aria-label',label);rail.title=label;
    rail.firstElementChild.textContent=open?'◂':'▸';
  }
  function highlight(force=false) {
    input.value=String(current+1);
    root.dataset.currentPage=String(current+1);
    noteButtons.forEach((button,i)=>{
      button.classList.toggle('is-current',i===current);
      button.classList.toggle('is-adjacent',Math.abs(i-current)===1);
      if(i===current)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
    });
    if(open && force)notes.scrollTop=noteButtons[current].offsetTop-24;
    const url=new URL(location.href);url.hash=`page=${current+1}`;history.replaceState(null,'',url);
  }
  function fail(message) {
    if(disposed)return;
    errorBox.hidden=false;errorBox.querySelector('p').textContent=message;
    root.querySelector('.aigc-loading')?.remove();
  }
  function jump(index) {
    current=Math.max(0,Math.min(aigc.pages.length-1,index));lastOffset=0;
    if(sheets.length)pages.scrollTop=sheets[current].offsetTop-16;
    highlight(true);schedule();
  }
  function measure() {
    if(disposed || !sheets.length)return;
    const nextWidth=Math.max(1,Math.floor(Math.min(pages.clientWidth-32,(pages.clientHeight-32)*960/540)));
    // 最后一页也能对齐阅读区顶部，手机跳到倒数几页时不会被滚动边界推到 P43。
    pages.style.paddingBottom=`${Math.max(16,pages.clientHeight-nextWidth*540/960-16)}px`;
    if(nextWidth===sheetWidth)return;
    sheetWidth=nextWidth;
    pages.style.setProperty('--pdf-width',`${sheetWidth}px`);
    pages.querySelectorAll('img').forEach(image=>{image.sizes=`${sheetWidth}px`;});
    pages.scrollTop=sheets[current].offsetTop-16+lastOffset*sheets[current].clientHeight;
    schedule();
  }
  function schedule(){if(!disposed && !frame)frame=requestAnimationFrame(update);}
  function update() {
    frame=0;if(disposed || !sheets.length)return;
    const top=pages.scrollTop, height=pages.clientHeight;
    const line=top+Math.min(100,height*.25);
    let next=0;
    for(let i=0;i<sheets.length;i++){if(sheets[i].offsetTop<=line)next=i;else break;}
    if(top+height>=pages.scrollHeight-2)next=sheets.length-1;
    const changed=next!==current;current=next;
    lastOffset=(top-(sheets[current].offsetTop-16))/Math.max(1,sheets[current].clientHeight);
    if(changed)highlight(true);
    desired=new Set();
    sheets.forEach((sheet,i)=>{
      if(sheet.offsetTop+sheet.clientHeight>top-height*.6 && sheet.offsetTop<top+height*1.6)desired.add(i);
      else if(rendered.has(i)){
        sheet.querySelector('img')?.remove();
        rendered.delete(i);sheet.removeAttribute('data-rendered');
      }
    });
    void pump();
  }
  async function pump(){
    if(pumping || disposed)return;
    pumping=true;
    try {
      while(!disposed){
        const target=[...desired].sort((a,b)=>Math.abs(a-current)-Math.abs(b-current)).find(i=>!rendered.has(i));
        if(target===undefined)break;
        const image=new Image();
        const prefix=`assets/aigc/page-${String(target+1).padStart(2,'0')}`;
        image.alt=s(`作品集第 ${target+1} 页`,`Portfolio page ${target+1}`);
        image.width=2400;image.height=1350;image.decoding='async';
        image.srcset=`${prefix}-small.webp 1200w, ${prefix}.webp 2400w`;
        image.sizes=`${sheetWidth}px`;
        image.src=`${prefix}.webp`;
        try{await image.decode();}catch(error){
          if(disposed)return;
          if(!desired.has(target))continue;
          throw error;
        }
        if(disposed)break;
        if(!desired.has(target))continue;
        sheets[target].querySelector('img')?.remove();sheets[target].append(image);
        rendered.set(target,true);sheets[target].dataset.rendered='true';
      }
    }catch(error){if(!disposed)fail(s('页面图片加载失败，请重试。','Page image could not load. Please retry.'));}
    finally{pumping=false;}
  }
  rail.addEventListener('click',()=>{open=!open;sidebar();measure();highlight(true);},opts);
  notes.addEventListener('click',event=>{const button=event.target.closest('[data-note]');if(button)jump(Number(button.dataset.note));},opts);
  input.addEventListener('change',()=>{const number=Number(input.value);if(Number.isInteger(number)&&number>=1&&number<=aigc.pages.length)jump(number-1);else input.value=String(current+1);},opts);
  input.addEventListener('keydown',event=>{if(event.key==='Enter'){input.dispatchEvent(new Event('change'));pages.focus();}},opts);
  pages.addEventListener('scroll',schedule,{...opts,passive:true});
  pages.addEventListener('keydown',event=>{if(event.key==='Home'||event.key==='End'){event.preventDefault();jump(event.key==='Home'?0:aigc.pages.length-1);}},opts);
  root.addEventListener('keydown',event=>{if(event.key==='Escape' && open){open=false;sidebar();measure();rail.focus();}},opts);
  root.querySelector('.aigc-retry').addEventListener('click',()=>location.reload(),opts);
  window.addEventListener('hashchange',()=>{const number=Number(new URLSearchParams(location.hash.slice(1)).get('page'));if(Number.isInteger(number)&&number>=1&&number<=aigc.pages.length)jump(number-1);},opts);
  sidebar();highlight(true);
  // 在线阅读只加载页面图片。PDF 仅用于主动点击原件链接，避免下载管理器拦截。
  pages.innerHTML=aigc.pages.map(p=>`<article class="pdf-sheet" data-pdf-page="${p.page}" aria-label="${s('第','Page ')}${p.page}${s('页','')}"><span class="pdf-sheet-label">P${p.page}</span></article>`).join('');
  sheets=[...pages.querySelectorAll('.pdf-sheet')];
  measure();highlight(true);observer=new ResizeObserver(measure);observer.observe(pages);schedule();
  return {
    snapshot:()=>({current,offset:lastOffset,open}),
    destroy:()=>{disposed=true;controller.abort();observer?.disconnect();cancelAnimationFrame(frame);}
  };
}
