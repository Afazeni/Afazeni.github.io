import { aigcMarkup, initializeAigc } from './aigc-viewer.js';
import { initializeMechanicalBackground } from './mechanical-background.js';
let cleanupMechanicalBackground = () => {};
let aigcReader;
let cleanupDiscover = () => {};
import { skillsMarkup, initializeSkills } from './skills-banner.js';
let skillsBanner;
import { profile, projects, awards, patents, homeSkills, experience } from './content.js';
import { coverMarkup, sectionMarkup, initializeMedia } from './media.js';
import { presentations } from './presentations.js';
import { presentationMarkup, initializePresentation } from './presentation-player.js';
let cleanupMedia = () => {};
let presentationPlayer;

const page = document.body.dataset.page;
let language = new URLSearchParams(location.search).get('lang');
if (!['zh','en'].includes(language)) {
  try { language = localStorage.getItem('portfolio-language'); } catch { /* 存储禁用时使用中文。 */ }
}
if (!['zh','en'].includes(language)) language = 'zh';
let yearFilter = 'all';
const t = value => typeof value === 'string' ? value : value[language];
const s = (zh, en) => language === 'zh' ? zh : en;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<span aria-hidden="true">↗</span>';
const link = (url, text, cls='') => `<a class="${cls}" href="${url}">${text}</a>`;
const resumeFile = () => 'assets/resume-original.pdf';

function header() {
  return `<header class="site-header"><div class="container header-inner">
    <a class="brand" href="index.html" aria-label="${s('陈影凌，首页','Yingling Chen, home')}"><span class="brand-mark">CY</span><span>${t(profile.name)}</span></a>
    <button class="menu-toggle" aria-controls="navigation" aria-expanded="false">${s('菜单','Menu')} <span aria-hidden="true">☰</span></button>
    <nav id="navigation" aria-label="${s('主导航','Main navigation')}">
      ${link('index.html#work',s('作品','Work'),page==='project'?'active':'')}
      ${link('index.html#experience',s('经历','Experience'))}
      ${link('index.html#about',s('关于','About'))}
      ${link('honors.html',s('荣誉与证书','Honors'),page==='honors'?'active':'')}
      <a class="nav-resume" href="resume.html">${s('简历','Resume')}</a>
      ${link('index.html#contact',s('联系','Contact'))}
      <div class="discover" id="discover"><button class="discover-toggle" aria-expanded="false" aria-controls="discover-menu">${s('更多发现','Discover')} <span aria-hidden="true">⌄</span></button><div class="discover-menu" id="discover-menu" hidden><a href="aigc.html">${s('AIGC作品集','AIGC Portfolio')} <span>2025 ↗</span></a></div></div>
      <button class="language-toggle" aria-label="${s('Switch to English','切换到中文')}">${s('EN','中文')}</button>
    </nav>
  </div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container footer-inner"><a class="footer-name" href="index.html">${t(profile.name)}<span> / AFAZENI</span></a><p>© ${new Date().getFullYear()} ${s('陈影凌 · 机械结构设计作品集','Yingling Chen · Mechanical Design Portfolio')}</p><a href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a></div></footer>`;
}

function projectCard(p) {
  return `<article class="project-card"><a href="project.html?id=${p.id}" aria-label="${s('查看项目：','View project: ')}${t(p.title)}">
    <div class="project-image ${p.id}"><img src="assets/${p.image}" alt="${t(p.subtitle)}${s('三维渲染图',' — 3D rendering')}" loading="lazy" width="800" height="600"><span class="image-index">${p.number} / ${p.year}</span><span class="image-arrow" aria-hidden="true">↗</span>${p.ongoing?`<span class="ongoing">${s('进行中','In progress')}</span>`:''}</div>
    <div class="project-category">${t(p.category)}</div><h3>${t(p.title)} <span>${t(p.subtitle)}</span></h3><p>${t(p.description)}</p><div class="project-role">${s('队长 · 机械结构设计','Team lead · Mechanical design')}</div>
  </a></article>`;
}

function contact() {
  return `<section class="contact-section" id="contact"><div class="container contact-inner"><div><span class="section-label">${s('保持联系','GET IN TOUCH')}</span><h2>${s('期待下一次，<br>把想法做成结构。','Let’s build<br>what comes next.')}</h2><p>${s('正在寻找结构设计相关实习机会，也欢迎交流机器人与机械设计。','Seeking mechanical design internship opportunities. Always happy to talk about robotics and mechanism design.')}</p></div><div class="contact-links"><a class="contact-email" href="mailto:${profile.email}">${profile.email} ${arrow}</a><div class="contact-actions"><button class="copy-email">${s('复制邮箱','Copy email')}</button><a href="tel:+86${profile.phone}">${profile.phone}</a><a href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a></div><a class="button button-outline-light" href="resume.html">${s('查看个人简历','View my resume')} ${arrow}</a><p class="copy-status" role="status" aria-live="polite"></p></div></div></section>`;
}

function home() {
  return `<main id="main"><section class="hero"><div class="hero-background" aria-hidden="true"></div>${skillsMarkup(homeSkills,s)}<div class="container hero-inner"><div class="hero-copy"><p class="hero-kicker">${s('武汉轻工大学 · 智能制造工程 · 2028 届','WUHAN POLYTECHNIC UNIVERSITY · CLASS OF 2028')}</p><h1>${s('陈影凌','YINGLING<br>CHEN')}</h1><p class="name-roman">${s('YINGLING CHEN','MECHANICAL DESIGN PORTFOLIO')}</p><p class="hero-intro">${s('从机构构思，到结构实现。','From mechanism concepts<br>to mechanical design.')}</p><p class="hero-description">${s('我是一名智能制造工程专业的大三学生，<br class="desktop-break">专注机械结构设计、可重构机构与机器人开发。<br class="desktop-break">在项目中建模、分析，也不断改进。','An undergraduate in Intelligent Manufacturing Engineering, focused on mechanical design, reconfigurable mechanisms and robotics. Modeling, analyzing and refining ideas through project work.')}</p><div class="hero-actions"><a class="button button-primary" href="#work">${s('探索我的作品','Explore selected work')} <span aria-hidden="true">↓</span></a><a class="button button-light" href="resume.html">${s('查看简历','View resume')} ${arrow}</a></div><div class="hero-social"><a href="mailto:${profile.email}">${profile.email}</a><span aria-hidden="true">/</span><a href="${profile.github}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a></div></div><div class="portrait-area"><div class="portrait-frame"><img src="assets/portrait.webp" alt="${s('陈影凌个人肖像','Portrait of Yingling Chen')}" width="800" height="1034" fetchpriority="high"></div><div class="portrait-caption"><span class="availability-dot" aria-hidden="true"></span>${s('寻求结构设计实习机会','Open to mechanical design internships')}</div></div></div><div class="container hero-bottom"><span>${s('机械设计 / 机构创新 / 仿真分析','MECHANICAL DESIGN / MECHANISMS / SIMULATION')}</span><a href="#work">${s('向下探索','SCROLL TO EXPLORE')} <span aria-hidden="true">↓</span></a></div></section>
    <section class="work-section container" id="work"><div class="section-heading"><div><span class="section-label">${s('精选作品','SELECTED WORK')}</span><h2>${s('把设计，落在每一个机构里。','Ideas made mechanical.')}</h2></div><p>${s('四个由我担任队长的项目。<br>从整机方案，到关键结构的细节。','Four projects I led.<br>From system concepts to structural details.')}</p></div><div class="projects-grid">${projects.map(projectCard).join('')}<article class="project-placeholder"><div class="project-image upcoming-image"><span class="image-index">05 / ${s('下一件作品','NEXT PROJECT')}</span><div><span aria-hidden="true" class="upcoming-mark">＋</span><h3>${s('敬请期待','Coming soon')}</h3><p>${s('Coming soon','More work to come')}</p></div></div></article></div></section>
    <section class="experience-section container" id="experience" aria-labelledby="experience-title"><div class="section-heading"><div><span class="section-label">${escape(t(experience.label))}</span><h2 id="experience-title">${escape(t(experience.title))}</h2></div></div><div class="experience-placeholder">${escape(t(experience.placeholder))}</div></section>
    <section class="about-section" id="about"><div class="container about-grid"><div><span class="section-label">${s('关于我','ABOUT ME')}</span><h2>${s('用结构思考，<br>用设计回答。','Thinking in structures.<br>Answering through design.')}</h2><p class="about-description">${s('我喜欢拆解一个动作背后的机械逻辑，再把它变成能够配合运动的零件与机构。从可重构机器人到食品打印机，我关心方案如何实现、零件如何配合，以及结构如何验证。','I enjoy breaking down the mechanical logic behind a motion, then turning it into parts and mechanisms that work together. From reconfigurable robots to food printers, I care about how a concept is realized, how parts fit and how a structure is evaluated.')}</p><a class="text-link" href="honors.html">${s('查看荣誉与证书','Explore honors & certificates')} ${arrow}</a></div><div class="about-facts"><div class="education"><span class="fact-label">${s('教育背景','EDUCATION')}</span><h3>${s('武汉轻工大学','Wuhan Polytechnic University')}</h3><p>${s('智能制造工程 · 本科','B.Eng. in Intelligent Manufacturing Engineering')}</p><div class="education-meta"><span>2024.09 — 2028.06</span><span>${s('专业成绩前 10%','Top 10% academically')}</span></div></div><div class="skill-group"><span class="fact-label">${s('建模与结构设计','CAD & MECHANICAL DESIGN')}</span><p>SolidWorks / NX / AutoCAD</p></div><div class="skill-group"><span class="fact-label">${s('仿真与优化','SIMULATION & OPTIMIZATION')}</span><p>Ansys / Adams / MATLAB / Fusion</p></div><div class="skill-group"><span class="fact-label">${s('开发与制造','DEVELOPMENT & FABRICATION')}</span><p>${s('Python / C/C++ 基础 / 3D 打印 / DFM & DFA','Python / C/C++ fundamentals / 3D printing / DFM & DFA')}</p></div></div></div></section>
    ${contact()}</main>`;
}

function projectPage() {
  const id = new URLSearchParams(location.search).get('id');
  const p = projects.find(project => project.id === id);
  if (!p) return `<main id="main" class="container not-found"><p>404</p><h1>${s('没有找到这个项目','Project not found')}</h1><a class="button button-primary" href="index.html#work">${s('返回作品列表','Back to selected work')}</a></main>`;
  document.title = `${t(p.title)} · ${t(profile.name)}`;
  const next = projects[(projects.indexOf(p)+1)%projects.length];
  return `<main id="main"><div class="container project-heading"><a class="back-link" href="index.html#work">← ${s('全部作品','All projects')}</a><div class="project-heading-row"><div><p class="section-label">${t(p.category)}</p><h1>${t(p.title)}</h1><p class="project-subtitle">${t(p.subtitle)}</p></div><span class="project-year">${p.year}${p.ongoing?`<small>${s('进行中','In progress')}</small>`:''}</span></div></div><div class="container"><section class="project-background" aria-labelledby="project-background-heading"><h2 id="project-background-heading">${s('项目背景','Project background')}</h2><p>${escape(t(p.background))}</p></section>${coverMarkup(p,t,s)}${projectOverview(p)}<section class="video-section"><div class="section-heading"><h2>${s('看看机构如何运动','See the mechanisms in motion')}</h2><p>${s('项目演示 · 数字样机动画','Project demonstration · Digital prototype animation')}</p></div><video controls playsinline preload="none" poster="assets/${p.demoPoster || p.image}" aria-label="${t(p.title)}${s('机构演示动画',' mechanism demonstration')}"><source src="assets/${p.id}-demo.mp4" type="video/mp4">${s('浏览器无法播放此视频。','Your browser cannot play this video.')} <a href="assets/${p.id}-demo.mp4">${s('下载视频','Download video')}</a></video></section><div class="project-sections">${p.sections.map((section,index)=>sectionMarkup(section,index,t,s)).join('')}</div>${presentationMarkup(p.id,presentations[p.id],t,s)}${methodsMarkup(p)}<a class="next-project" href="project.html?id=${next.id}"><span>${s('下一个项目','NEXT PROJECT')}</span><strong>${t(next.title)}</strong><span aria-hidden="true">↗</span></a></div>${contact()}</main>`;
}

function projectOverview(p) {
  return `<section class="project-overview" aria-labelledby="project-summary-heading"><aside class="project-metadata"><div><span>${s('我的角色','MY ROLE')}</span><strong>${s('队长 · 机械结构设计','Team lead · Mechanical design')}</strong></div><div><span>${s('项目时间','TIMELINE')}</span><strong>${escape(t(p.date))}</strong></div><div><span>${s('设计工具','TOOLS')}</span><strong>${escape(p.tools.join(' / '))}</strong></div></aside><div class="project-summary"><h2 id="project-summary-heading">${s('项目概览','Project at a glance')}</h2><div class="summary-row"><h3>${s('解决的问题','The problem')}</h3><p>${escape(t(p.brief))}</p></div><div class="summary-row"><h3>${s('我的贡献','My contribution')}</h3><p>${escape(t(p.contribution))}</p></div><div class="summary-row"><h3>${s('关键设计','Key design features')}</h3><ul>${p.summary.highlights.map(item=>`<li>${escape(t(item))}</li>`).join('')}</ul></div><div class="summary-row summary-progress"><h3>${s('当前进展','Project status')}</h3><p>${escape(t(p.summary.status))}</p></div></div></section>`;
}

function methodsMarkup(project) {
  if (!project.methods?.length) return '';
  return `<section class="methods-section" aria-labelledby="methods-heading"><div class="section-heading"><h2 id="methods-heading">${s('方法&关键决策','Methods & key decisions')}</h2></div><div class="methods-grid">${project.methods.map((item,i)=>`<article><span class="method-number">${String(i+1).padStart(2,'0')}</span><h3>${escape(t(item.title))}</h3><p>${escape(t(item.text))}</p></article>`).join('')}</div></section>`;
}

function certificateCard(award) {
  const file = `certificate-${String(award.id).padStart(2,'0')}`;
  const caption = `${t(award.title)} · ${t(award.prize)} · ${t(award.work)}`;
  return `<article class="award-card" data-year="${award.year}"><button class="certificate-preview" data-image="assets/${file}.webp" data-caption="${escape(caption)}" aria-label="${s('放大证书：','Enlarge certificate: ')}${escape(caption)}"><img src="assets/${file}-thumb.webp" alt="${escape(caption)}" loading="lazy" width="640" height="440"><span class="expand-icon" aria-hidden="true">↗</span></button><div class="award-info"><div class="award-meta"><span>${award.year}</span><span class="award-prize">${t(award.prize)}</span></div><h2>${t(award.title)}</h2><p>${t(award.work)}</p></div></article>`;
}

function honorsPage() {
  return `<main id="main"><section class="page-intro container"><a class="back-link" href="index.html">← ${s('返回首页','Back home')}</a><span class="section-label">${s('成长的记录','RECOGNITION')}</span><h1>${s('荣誉与证书','Honors & certificates')}</h1><p>${s('记录项目之外的每一次肯定。<br>竞赛获奖证书与参与申请的发明专利，在这里集中展示。','Recognition along the way.<br>A collection of competition certificates and published patent applications.')}</p></section><section class="container awards-section" aria-label="${s('竞赛证书','Competition certificates')}"><div class="awards-toolbar"><div class="filters" role="group" aria-label="${s('按年份筛选','Filter by year')}">${[['all',s('全部年份','All years')],['2026','2026'],['2025','2025']].map(([value,label])=>`<button data-filter="${value}" aria-pressed="${yearFilter===value}">${label}</button>`).join('')}</div><p id="award-count" aria-live="polite"></p></div><div class="awards-grid">${awards.map(certificateCard).join('')}</div></section><section class="patents-section"><div class="container"><div class="section-heading"><div><span class="section-label">${s('发明专利申请','PATENT APPLICATIONS')}</span><h2>${s('让设计留下自己的痕迹。','Design, documented.')}</h2></div><p>${s('参与申请 · 已公开','Contributing inventor · Published applications')}</p></div><div class="patents-grid">${patents.map(p=>`<article class="patent-card"><button class="certificate-preview patent-preview" data-image="assets/patent-${p.id}.webp" data-caption="${escape(t(p.title)+' · '+p.number)}" aria-label="${s('查看专利公开文本首页：','View published patent front page: ')}${t(p.title)}"><img src="assets/patent-${p.id}.webp" alt="${t(p.title)}${s('申请公布文本首页',' application front page')}" loading="lazy"><span class="expand-icon" aria-hidden="true">↗</span></button><div><span class="patent-status">${s('发明申请 · 已公开','Invention application · Published')}</span><h3>${t(p.title)}</h3><p>${p.number}</p><p>${s('公开日','Published')} ${p.date}</p></div></article>`).join('')}</div></div></section></main><dialog class="lightbox" aria-labelledby="lightbox-caption"><button class="lightbox-close" aria-label="${s('关闭证书预览','Close certificate preview')}">×</button><img src="assets/certificate-01.webp" alt=""><p id="lightbox-caption"></p></dialog>`;
}

function resumePage() {
  // 预览只读取原件渲染图；不得自动内嵌或 fetch PDF，避免下载管理器接管。
  return `<main id="main" class="container resume-container"><div class="resume-toolbar"><a class="back-link" href="index.html">← ${s('返回首页','Back home')}</a><div><a class="button button-outline" href="${resumeFile()}" target="_blank" rel="noopener noreferrer">${s('打开原版 PDF','Open original PDF')} ↗</a><a class="button button-primary" href="${resumeFile()}" download>${s('下载 PDF','Download PDF')} ↓</a></div></div><h1 class="resume-title">${s('个人简历','Resume')}</h1><p class="resume-note">${s('原版简历 · 中文 PDF','Original resume · Chinese PDF')}</p><img class="resume-original-image" src="assets/resume-original.png" alt="${s('陈影凌原版个人简历','Yingling Chen’s original resume in Chinese')}" width="1240" height="1754"></main>`;
}

function filterAwards() {
  let count = 0;
  document.querySelectorAll('.award-card').forEach(card => {card.hidden=yearFilter!=='all'&&card.dataset.year!==yearFilter;if(!card.hidden)count++;});
  document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===yearFilter)));
  const label=document.getElementById('award-count');
  if(label)label.textContent=s(`${count} 项记录 · 点击证书查看大图`,`${count} records · Select a certificate to enlarge`);
}

function events() {
  const discover = document.querySelector('.discover');
  const discoverButton = discover.querySelector('button');
  const discoverMenu = discover.querySelector('.discover-menu');
  const discoverEvents = new AbortController();
  const closeDiscover = () => { discoverMenu.hidden=true; discoverButton.setAttribute('aria-expanded','false'); };
  discoverButton.addEventListener('click',()=>{const open=discoverMenu.hidden;discoverMenu.hidden=!open;discoverButton.setAttribute('aria-expanded',String(open));});
  document.addEventListener('click',event=>{if(!discover.contains(event.target))closeDiscover();},{signal:discoverEvents.signal});
  discover.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();closeDiscover();discoverButton.focus();}else if(event.key==='ArrowDown'){event.preventDefault();discoverMenu.hidden=false;discoverButton.setAttribute('aria-expanded','true');discoverMenu.querySelector('a').focus();}});
  discover.addEventListener('focusout',event=>{if(!discover.contains(event.relatedTarget))closeDiscover();});
  cleanupDiscover=()=>discoverEvents.abort();
  document.querySelector('.language-toggle').addEventListener('click',()=> {
    const position=window.scrollY;
    const menuWasOpen=document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='true';
    language=language==='zh'?'en':'zh';
    try {localStorage.setItem('portfolio-language',language);}catch{/* 当前页面仍可切换。 */}
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);
    render();
    if(menuWasOpen){document.querySelector('.menu-toggle').setAttribute('aria-expanded','true');document.getElementById('navigation').classList.add('is-open');}
    window.scrollTo(0,position);document.querySelector('.language-toggle').focus({preventScroll:true});
  });
  const menu=document.querySelector('.menu-toggle');
  menu.addEventListener('click',()=> {const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.getElementById('navigation').classList.toggle('is-open',open);});
  document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');document.getElementById('navigation').classList.remove('is-open');}));
  document.querySelectorAll('.copy-email').forEach(button=>button.addEventListener('click',async()=> {
    const status=document.querySelector('.copy-status');
    try{await navigator.clipboard.writeText(profile.email);status.textContent=s('邮箱已复制。','Email copied.');}
    catch{status.textContent=s(`请复制邮箱：${profile.email}`,`Please copy: ${profile.email}`);}
  }));
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{yearFilter=button.dataset.filter;filterAwards();}));
  const dialog=document.querySelector('.lightbox');
  if(dialog){
    let trigger;
    document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{trigger=button;dialog.querySelector('img').src=button.dataset.image;dialog.querySelector('img').alt=button.dataset.caption;dialog.querySelector('p').textContent=button.dataset.caption;dialog.showModal();document.body.classList.add('modal-open');}));
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
    dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');trigger?.focus({preventScroll:true});});
  }
  // 链接携带语言，存储不可用时仍能保留跨页面语言选择。
  document.querySelectorAll('a[href]').forEach(a=>{const href=a.getAttribute('href');if(/^(index|project|honors|resume|aigc)\.html/.test(href)){const u=new URL(href,location.href);u.searchParams.set('lang',language);a.setAttribute('href',u.pathname.split('/').pop()+u.search+u.hash);}});
}

function render() {
  cleanupMechanicalBackground();
  const aigcState=aigcReader?.snapshot();
  aigcReader?.destroy();
  cleanupDiscover();
  const skillsState = skillsBanner?.snapshot();
  skillsBanner?.destroy();
  const presentationState = presentationPlayer?.snapshot();
  presentationPlayer?.destroy();
  cleanupMedia();
  document.documentElement.lang=language==='zh'?'zh-CN':'en';document.body.classList.remove('modal-open');
  document.title=s('陈影凌 · 机械结构设计作品集','Yingling Chen · Mechanical Design Portfolio');
  const titles={aigc:s('AIGC 作品集 · 2025','AIGC Portfolio · 2025'),honors:s('荣誉与证书','Honors & certificates'),resume:s('简历','Resume')};
  if(titles[page])document.title=`${titles[page]} · ${t(profile.name)}`;
  const content=page==='aigc'?aigcMarkup(s):page==='home'?home():page==='project'?projectPage():page==='honors'?honorsPage():resumePage();
  document.getElementById('app').innerHTML=header()+content+(page==='aigc'?'':footer());events();aigcReader=initializeAigc(s,aigcState);skillsBanner=initializeSkills(homeSkills,s,skillsState);cleanupMedia=initializeMedia(s);presentationPlayer=initializePresentation(presentations,t,s,presentationState);if(page==='honors')filterAwards();
  cleanupMechanicalBackground = initializeMechanicalBackground();
}

document.addEventListener('keydown',event=>{if(event.key==='Escape'){const menu=document.querySelector('.menu-toggle');if(menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');document.getElementById('navigation').classList.remove('is-open');menu.focus();}}});
render();
