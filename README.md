# 个人机械结构设计作品集

本地预览：中英文界面、四个作品的 PPT 视频与逐页解说、“方法&关键决策”、独立证书页、原版中文简历 PDF。网站是静态文件，无需 npm 安装或构建；正式站点：https://afazeni.github.io/ 。

## 启动与实时查看修改

网站源码位于本 README 所在目录；在该目录运行下述命令。

1. 双击此目录下的 `start-preview.cmd`，保持启动窗口打开。
2. 浏览器打开 http://127.0.0.1:4173/ 。如果已启动服务，不必重复启动。
3. 用 VS Code 或其他文本编辑器打开 `site-src` 文件夹，编辑文件并按 **Ctrl+S 保存**。
4. 切回浏览器按 **Ctrl+R 刷新**即可查看变化；如图片仍旧，按 **Ctrl+F5** 强制刷新。

这里没有自动热更新，保存后需要刷新；不必重新启动服务。关闭服务窗口或关机后需要重新启动。也可以在本目录的终端运行：

```powershell
python scripts/serve_preview.py --port 4173 --bind 127.0.0.1
```

`127.0.0.1` 指自己的电脑，当前链接只供本机使用。源文件和网页图片、视频均在本地；网页运行只读取 `assets/` 副本，不访问桌面材料或临时附件。不能直接双击 HTML 预览，因为网页使用 JavaScript 模块。

## 修改位置

| 想改什么 | 文件 / 位置 |
| --- | --- |
| 项目名称、中文/英文介绍、分类、顺序 | `content.js` 的 `projects` |
| 各项目图片、视频、小标题 | `content.js` 的 `gallery`、`sections`、`media` |
| 方法&关键决策 | `content.js` 各作品的 `methods` |
| PPT 每页标题、解说和跳转时间 | `presentations.js` 各作品的 `slides` |
| 首页自我介绍、导航、页面结构、占位卡 | `app.js` |
| 配色、字体、间距、首屏高度、手机布局 | `styles.css` |
| 轮播与视频播放规则 | `media-carousel.js`（独立轮播）及 `media.js`（分段视频） |
| 新封面、背景、轮播图、视频、简历 | `assets/` |
| 荣誉、证书文字与专利信息 | `content.js` 的 `awards` / `patents` |

`index.html`、`project.html`、`honors.html`、`resume.html` 是页面入口。项目地址分别为 `project.html?id=care`、`grooming`、`printer`、`frog`；`lang=zh` / `lang=en` 决定语言。证书继续单独展示在 `honors.html`。

首页背景是 `assets/hero-mesh.webp`。食界巧味新封面 `printer-cover.webp` 与原介绍图片 `printer.webp` 独立，替换封面不会改变后文。蛙鲜速剥封面为 `frog-cover.webp`，结构图为 `frog-structure.webp`。透明 PNG 转 WebP 时保留透明通道，CSS 用 contain 完整显示主体。

### 分段内容示例

```javascript
{
  title: b('功能创新', 'Functional innovation'),
  subtitle: b('可选红色小标题', 'Optional subtitle'),
  text: b('中文正文', 'English text'),
  media: {
    type: 'video',
    src: 'care-detail-1.mp4',
    poster: 'care-detail-1.webp'
  }
}
```

无需小标题时删除 `subtitle`；图片则使用 `media: { type: 'image', src: '图片.webp' }`。文件名只填 `assets/` 内的相对文件名。英文内容填写在 `b()` 的第二个参数。产品轮播 `gallery` 数组的顺序就是展示顺序；安伴智护的 `galleryIntervalMs: 1000` 表示每张1秒。

安伴智护顶部产品图及“拓扑优化”均每1秒切换。食界巧味“模块化设计”先显示原材料图1秒，再完整播放约9.5秒视频，播放结束后返回图片；不对这段视频设置自身循环。各组轮播独立运行，只有进入可视区域才启动；悬停、键盘焦点或手动切换会暂停，离屏或页面切到后台也会暂停。恢复时延续当前图片剩余时间或视频进度。主动点击“播放轮播”时，即使鼠标仍在按钮上也会播放；离开并再次进入后恢复悬停暂停。

分段独立视频进入可视区后静音循环、离开暂停；手动暂停会保持。启用减少动态效果时默认手动播放；自动播放受阻时保留原生视频控件及轮播手动按钮。总演示及逐页解说保持原有行为。

分段图片／视频轮播配置示例（`id` 在同一页必须唯一）：

```javascript
media: {
  type: 'carousel',
  id: 'printer-modular',
  intervalMs: 1000,
  items: [
    { type: 'image', src: 'printer-material.webp', alt: b('材料分解图', 'Material breakdown') },
    { type: 'video', src: 'printer-modular.mp4', poster: 'printer-modular.webp', alt: b('模块化设计演示', 'Modular design demonstration') }
  ]
}
```

拓扑优化用4个 `type: 'image'` 项；图片可用 `durationMs` 单独覆盖默认停留时间。新增分析素材由 `scripts/prepare_analysis_assets.py` 接收原始材料目录并生成网页副本，示例：

```powershell
python scripts/prepare_analysis_assets.py '素材文件夹的完整路径' --ffmpeg 'ffmpeg程序完整路径'
python scripts/verify_analysis_media.py
```

图片按原始尺寸无损转 WebP；GIF 转 H.264 MP4，保留播放时序，不放大低分辨率动画。源文件不修改。拓扑优化质量为**原来的44.1%**，不能写成减重44.1%。

### 自己修改作品文字

用编辑器打开 `content.js`，搜索作品 ID：`care`（安伴智护）、`grooming`（锋度绅士）、`printer`（食界巧味）、`frog`（蛙鲜速剥）。作品名称是 `title`，简介是 `description`，设计目标是 `brief`，职责是 `contribution`，原有分段正文在 `sections`，最后的思考说明在 `methods`。

两种中英写法含义相同，只改引号内的文字，保留引号、逗号与括号：

```javascript
title: b('中文标题', 'English title')
// 或者：
"text": { "zh": "我的中文正文", "en": "My English text" }
```

保存后到浏览器刷新即可看到变化。`b()` 使用单引号时，正文内的英文单引号写成 `\'`；JSON 风格的双引号字符串内，双引号写成 `\"`，换行写成 `\n`。不要直接在字符串中敲回车。维护中英文时分别修改两项。

### PPT 逐页展示

四套原演示分别有 20、19、28、16 页，视频保存在 `assets/presentations/`。桌面左侧为解说、右侧为视频；手机先显示视频。默认手动播放、不循环。点击页码、上一页或下一页跳到该页，保留当前播放/暂停状态；拖动视频进度会同步解说。切换语言保留时间与播放状态，原 PPT 画面仍是中文。

**改每页解说只需编辑 `presentations.js`**：找到作品和该页的 `title` / `text`，修改 `zh` 或 `en`。例如：

```javascript
{
  "start": 9.2,
  "title": { "zh": "设计思路", "en": "Design approach" },
  "text": { "zh": "先明确约束，再说明机构如何满足需求。", "en": "Define the constraints, then explain how the mechanism addresses them." }
}
```

上面的秒数仅为格式示例，不是要求把现有时间改成 9.2。`start` 表示该页在完整视频中的定位时间（秒），第一页必须为 0，后续严格递增且小于视频总时长。定位点选在新页转场后的清晰画面，连续播放仍保留原转场。第一页另有 `seek`，用于点击“第 1 页”时跳过开场黑色淡入、显示封面；视频首次播放仍从 0 秒开始。只改解说不需要改这些秒数，只有更换或剪辑视频时才重新核对。

如需替换视频，把网页用 MP4 放入 `assets/presentations/`，修改该作品的 `video`（相对 `assets/` 的路径）及 `poster`，随后逐页播放确认并修改 `start`。不要改原始材料。浏览器若仍显示旧视频，用 Ctrl+F5 刷新。

逐页跳转依赖 HTTP Range 分段请求。**请使用 `start-preview.cmd` 或上面的 `serve_preview.py`，不要再用 `python -m http.server`**；旧服务不支持 Range 时，浏览器可能跳回视频开头。新服务只使用 Python 标准库，默认限本机访问。

### 重新从 PowerPoint 导出（仅更换演示时需要）

需 Windows 桌面 PowerPoint、Python 的 `pywin32` / `Pillow` / `numpy`，以及 PATH 中的 FFmpeg / ffprobe。日常修改网页文字不需要这些工具。

```powershell
python scripts/export_presentations.py 'C:\Users\Afazeni\Desktop\个人网站' --projects care
python scripts/calibrate_presentations.py --projects care
```

可将 `care` 换成其他作品 ID。导出工具只修改 `output/presentation-export/` 下的副本：保留动画与转场，为缺失的点击排练计时补上自动触发；根据媒体和动画长度设置停留，输出 1080p MP4。之后的校准工具使用最终视频画面与原页顺序匹配，不按总时长平均分配；检查输出的 `contact-*.jpg`、`motion-*.jpg` 与每页视频后再采用结果。工具保留当前 `presentations.js` 已编辑的标题和解说；`presentation-copy.json` 是首次导入文案，不是日常修改入口。页数发生变化时，应先同步文案数组，不能沿用旧页码。

`output/` 内的 PPTX、截图及检查报告仅供本地核对，不上传。演示解说和方法正文依据原 PPT、设计报告整理，可自行润色；仿真结论与实测结论应继续区分。

## 原版简历

网站使用 `assets/resume-original.pdf`，为最初提供的 `简历 拷贝.pdf` 的字节级副本，**没有重新排版或修改内容**。中英文界面的导航“简历”、首页“查看简历”和联系区“查看个人简历”均在当前标签打开 `resume.html` 图片预览，不自动请求 PDF，避免 IDM 接管。只有预览页内明确的“打开原版 PDF／下载 PDF”按钮才请求同一份中文原件；主动打开或下载仍受浏览器和 IDM 设置影响。

`resume.html` 保留为原版图片预览页，桌面和手机都只读取原件生成的图片，不自动内嵌或请求 PDF；只有主动点击“打开原版 PDF”或“下载 PDF”才请求文件。这样访问预览页不会因为后台加载 PDF 而触发 IDM。

`assets/resume-original.png` 仅用于预览。请勿用修改网页文字的方式修改简历。后续如有新原版 PDF，运行：

```powershell
python scripts/export_resume.py '新原版PDF的完整路径'
```

该脚本已改为仅复制原文件并渲染预览图，必须指定原件路径，不会从网页生成或重写 PDF；目前支持一页原件。原来的中英文重排版 PDF 已不再被网站使用。

## 素材准备与验收

日常编辑已有文字和媒体不需要运行素材脚本。`scripts/prepare_assets.py` 为初版素材工具；`scripts/prepare_v2_assets.py` 接收原始材料目录，以及 `--background`、`--printer`、`--frog`、`--structure` 四张选定 PNG 的路径，生成第二版媒体。用 `--ffmpeg` 指定 FFmpeg 程序路径。运行 `python scripts/prepare_v2_assets.py --help` 查看参数。处理工具依赖 Pillow、PyMuPDF、FFmpeg；浏览器验收依赖 Python Playwright 和 Chromium。

保持本地服务开启后运行：

```powershell
python scripts/verify_preview.py
python scripts/verify_resume_links.py
python scripts/verify_v2.py '原始简历PDF的完整路径'
python scripts/test_preview_server.py
python scripts/test_export_timing.py
python scripts/verify_presentations.py --server-video
python scripts/verify_presentations.py --real
```

基础验收检查中英文页面、四种屏幕宽度、证书交互、导航、总演示视频和下载。第二版验收检查实际浏览器缩放、轮播、八段视频、减少动态效果、自动播放被拒后的手动播放、PDF 哈希及原版图片预览。简历专项验收检查点击全部查看入口后不请求 PDF、预览页返回、显式打开原件的新标签链接及下载文件一致性。截图和报告写入 `output/`（不上传）。缩放检查使用隔离的临时 Chromium 配置和本地测试扩展，不修改你的常用浏览器设置。

## 后续 GitHub Pages

远程仓库为 `Afazeni/Afazeni.github.io`。网站无需构建，可发布此目录中的 HTML、JS、CSS 与 `assets/`；素材必须与页面一起上传，相对路径才有效。桌面原始文件不需要上传。正式站点从 main 分支根目录发布，使用 .nojekyll 直接提供静态文件。

## 首页技能横幅与工作经历

在 `content.js` 文件末尾编辑 `homeSkills` 和 `experience`，按 **Ctrl+S → 浏览器刷新** 即可生效，不需要安装依赖或重启服务。

```javascript
export const homeSkills = {
  speed: 35, // 像素/秒；例如改成 25，移动就会更慢。应填写大于 0 的数字。
  words: ['SOLIDWORKS', 'UG/NX', 'AUTOCAD'], // 示例：按显示顺序增删字符串
};
export const experience = {
  label: b('职业足迹', 'EXPERIENCE'),
  title: b('工作经历', 'Work experience'),
  placeholder: b('敬请期待', 'Coming soon'), // 可以替换为中英文说明
};
```

上述词列是编辑示例，网站实际配置保留全部十个指定词语。英文专业词在两种语言中保持相同拼写；`b()` 的第一个参数是中文、第二个参数是英文。未来添加多段正式经历时需再扩展条目布局，不要在当前占位文本中嵌入 HTML。

横幅位于深色首屏姓名上方，从左向右无缝滚动。悬停单词时全条暂停，该词变白；离开继续。右下角“暂停横幅／继续横幅”可用鼠标、触屏或键盘操作，手动暂停不会被鼠标离开覆盖。键盘聚焦词列时也暂停；系统减少动态效果开启时，显示可横向滚动的静态词列。工作经历位于作品列表和关于我之间，导航“经历”可以直接跳转。

动画逻辑位于 `skills-banner.js`，样式位于 `styles.css`。中英文切换保留横幅进度与手动暂停状态。新增回归验收：

```powershell
python scripts/verify_home_features.py
```

该验收检查移动方向与速度、悬停、手动暂停、键盘和触屏、语言切换、循环接缝、响应式布局和减少动态效果；截图写入 `output/home-skills-desktop.png` 与 `output/home-skills-mobile.png`。

## AIGC 作品集：更多发现

右上角“更多发现”展开纵向菜单，第一项为 **AIGC作品集**，进入 `aigc.html`。顶部主导航保持固定，阅读区使用余下窗口。PDF 可用鼠标滚轮、触控或键盘连续滚动，工具栏页码框可直接跳页；“返回首页”提供稳定返回入口，“打开原件”在新标签打开原 PDF。

左边窄竖条可以展开／收起逐页解说。当前页解说放大加粗，相邻页半透明；点击解说跳至对应页。桌面展开侧栏后 PDF 自适应剩余宽高，手机采用上方作品、下方解说分区，均不遮挡页面。按 Escape 收起解说。刷新保留 URL 中的页码（例如 `aigc.html#page=21`）；切换语言保留阅读位置和侧栏状态。用户提供的 43 段中文解说保持原文，英文界面标注为中文解说。

### 修改解说

编辑 `aigc-content.js` 中对应页的 `text`，保持 `page` 顺序与 PDF 一致：

```javascript
{
  "page": 1,
  "text": "在这里修改第 1 页解说。"
}
```

编辑 → Ctrl+S → 浏览器刷新即可，无须安装依赖或重启服务。

### PDF 与渲染依赖

网页副本为 `assets/aigc/portfolio-2025.pdf`，由用户提供的 43 页、960 × 540 PDF 原样复制；原始文件未修改。替换作品时同步调整 `aigc-content.js` 的 `file` 和 `pages`，并核对页数、页序及解说。当前阅读器按这本作品统一的 16:9 页面适配；若新 PDF 页幅不同，需同步调整阅读器尺寸逻辑，不能仅替换文件。

在线阅读使用原 PDF 逐页导出的 WebP 图片，不再自动加载 PDF、PDF.js 或 PDF 分段请求，避免 IDM 接管阅读请求。每页提供 2400px 高清版本与 1200px 小屏版本，浏览器按显示尺寸选择；只加载当前视口和邻近页。仅主动点击“打开原件”才请求 PDF，该行为仍由访客的浏览器及下载管理器设置决定。

替换 PDF 后运行以下命令重新生成 43 页图片（需要 PyMuPDF 与 Pillow；不会修改 PDF 或解说）：

```powershell
python scripts/export_aigc_pages.py
```

日常修改解说不需要重新导出图片。`vendor/pdfjs/` 是之前实现的保留文件，当前页面不引用、不加载，部署图片阅读页无需携带该目录。

保持本地预览服务运行后验收：

```powershell
python scripts/verify_aigc.py
```

覆盖菜单鼠标／键盘操作、43 页实际渲染、滚动解说同步、相邻状态、首尾页、语言切换、桌面和手机无覆盖、返回、失败重试与图片数量以及整个阅读过程无 PDF 请求。截图保存到 `output/aigc-desktop-open.png` 和 `output/aigc-mobile-open.png`。发布时需要带上 `aigc.html`、两个 `aigc-*.js` 文件、`assets/aigc/` 中的 86 张 WebP 页面图片及供手动打开的 PDF 副本；已纳入正式站点发布。

## 项目概览摘要

四个作品封面下方的“项目概览”直接替换原有设计目标与职责摘要，按“解决的问题、我的贡献、关键设计、当前进展”组织。仍在 `content.js` 对应项目中维护：`brief` 为问题描述，`contribution` 为个人贡献，`summary.highlights` 为三条设计亮点，`summary.status` 为当前进展；每个字段提供 `zh` 和 `en`。编辑保存后刷新即可。

摘要需要区分个人负责事项与项目整体成果；阶段描述以已有材料为依据。牛蛙项目保留进行中状态，数字样机、动画与仿真成果不能改写为已经完成实物测试或投产。详细机构解释继续放在“方法&关键决策”。

每个项目标题下方、封面上方的“项目背景”维护在 `content.js` 对应项目的 `background.zh` 和 `background.en`。背景说明需求来源与立项目标；封面下方“项目概览”概括贡献与当前进展。修改保存后刷新即可。

## CAD 工程图册视觉层

原生 HTML/CSS/ES 模块架构不变，未增加动画依赖。`mechanical-background.js` 通过现有 `app.js` 渲染生命周期初始化、销毁背景与交互；`styles.css` 末尾 CAD design-manual layer 管理样式。保存后刷新本地预览即可。

- 网格：22px 细网格、110px 主网格，灰色透明度 2.5% / 4.5%，正文区进一步弱化。
- 可复用图形：圆弧中心线、尺寸延长线、滑块轨迹、局部剖面四种 SVG。用于段落上方与页边，不代表真实产品尺寸。
- 分段描线：IntersectionObserver 触发一次；SVG dash 动画、编号、标题依次呈现，总时长约 0.8 秒。标题与正文默认可见，不依赖动画才能阅读。
- 首屏：保留原背景图片资源和高度，灰度及深色遮罩压低科技光感；SVG 曲柄半径 65、连杆长度 230（装饰坐标），24 秒周期。离屏或后台停止，右下角可暂停；暂停偏好保留到当前浏览器会话。
- 视差：网格滚动偏移系数 0.2；几何和技术字使用有上限的轻微位移，避免长页面累积漂移。被动滚动监听配合单个 requestAnimationFrame。
- 卡片：上浮 3px、图片 1.015 倍、定位角标、酒红底线、箭头位移，约 320ms；键盘聚焦也显示角标。鼠标准星仅限图片区域，26px、透明度 0.23。
- 手机 / 平板窄屏（≤800px）：静态背景、无视差、无描线、无准星；减少动态效果模式关闭所有新增动态效果。简历和 AIGC 阅读器不叠加装饰。
- 生命周期：语言切换清理观察器、事件、动画和待执行帧；不改变项目文案、图片、排序、导航、轮播或视频控制。

验证：`python scripts/verify_cad_design.py`、`python scripts/verify_preview.py`。截图在 `output/cad-*.png`；按用户授权发布至 GitHub Pages。

## 正式上线维护

正式网址：https://afazeni.github.io/ 。公开仓库为 Afazeni/Afazeni.github.io，GitHub Pages 使用 main 分支根目录；.nojekyll 关闭 Jekyll 处理。

本地保存只更新本地预览，线上版本需要重新提交并推送 main 后等待 Pages 部署成功。发布内容包括所有根目录 HTML / JS / CSS 和 assets/；output/、临时截图、缓存以及未使用的 vendor/pdfjs/ 不上传。修改前先 git fetch origin 并核对远程更新，不使用强制推送。

本轮视觉收敛：首页连杆可见度提高、原图光感压低，作品区网格中心进一步弱化，卡片上浮 3px / 缩放 1.015，灰色定位角标配少量酒红交互强调。

## 2026-10-08 证书更新

荣誉页新增 2026 年中国大学生机械工程创新创意大赛「智能装备创新设计赛」一等奖，作品为「灵筑安伴——多构型老人陪护机器人」。新增条目编号为 20，原尺寸无损 WebP 和缩略图位于 `assets/certificate-20.webp` 与 `assets/certificate-20-thumb.webp`；荣誉页共 20 项记录，其中 2026 年 8 项、2025 年 12 项。
