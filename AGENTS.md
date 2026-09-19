# 项目协作约定

- 这是 GitHub Pages 个人工程作品集，使用原生 HTML、CSS、JavaScript，无构建依赖。
- 维护说明使用中文；页面内容保持中英对应。
- 四个精选项目均由网站所有者担任队长；个人贡献与团队成果分开表述。
- 证书单独放在 honors.html，不能把证书图片混入作品区。
- 奖项名称和届次以证书正文为准；已公开专利申请不能标为已授权。
- 原始素材在网站目录之外，不能覆盖原始简历或素材；项目说明中不复制个人联系信息。
- 新改动使用 scripts/verify_preview.py 做相关浏览器检查。简历必须使用原始 PDF 字节副本，禁止从网页重新排版生成；第二版交互另用 scripts/verify_v2.py 检查。
- 本轮已获用户明确授权正式发布；后续修改仍先本地预览，仅在用户授权发布时推送。正式站点从 main 分支根目录发布。
- 四个作品已接入 PPT 视频逐页解说与“方法&关键决策”。作品正文维护在 content.js，逐页解说及秒数维护在 presentations.js；校准工具必须保留手工修改的解说。
- 本地预览使用 scripts/serve_preview.py（支持 HTTP Range）；不要改回 python -m http.server，否则长视频逐页跳转可能失效。通过 start-preview.cmd 启动。
- 导出只操作 output/presentation-export/ 中的副本；保留原始演示及视频。校准后核对逐页截图和动画，不能仅凭导出进程成功认定展示正确。
- 新交互验收：python scripts/verify_presentations.py --server-video 和 python scripts/verify_presentations.py --real；HTTP Range 验收：python scripts/test_preview_server.py。

- 所有“简历／查看简历”入口均在当前标签进入 resume.html 图片预览，不得直连 PDF。仅预览页内明确的“打开原版 PDF／下载 PDF”按钮请求原件。禁止自动 PDF 内嵌、预取或 fetch，避免 IDM 接管；用 scripts/verify_resume_links.py 验证实际点击各入口后仍无 PDF 请求。
- 首页已增加工程技能横幅及工作经历占位区；维护 `content.js` 的 `homeSkills` 和 `experience`。横幅状态逻辑位于 `skills-banner.js`，页面重新渲染必须先保存状态并清理监听器和 ResizeObserver。
- 横幅从左向右匀速循环；悬停暂停不能覆盖手动暂停，语言切换保留进度，减少动态效果使用静态词列。相关验收运行 `python scripts/verify_home_features.py`。
- “更多发现”第一项为 2025 AIGC 作品集（`aigc.html`）。原 PDF 保留不动，网页副本为 `assets/aigc/portfolio-2025.pdf`；43 页中文原文解说维护在 `aigc-content.js`。
- `aigc-viewer.js` 使用原 PDF 导出的逐页 WebP 图片连续阅读；保留固定主导航，侧栏展开不得遮挡 PDF。手机使用上下分区；当前页加粗放大、相邻页半透明，语言切换保留位置和侧栏状态。
- AIGC 在线阅读禁止自动请求 PDF（包括 fetch、Range、PDF.js、iframe 与预取），避免 IDM 拦截。仅主动点击原件链接才请求 PDF。页面图片由 `scripts/export_aigc_pages.py` 从原件副本导出，保留按需加载与销毁逻辑；专项验收 `python scripts/verify_aigc.py` 必须断言全程无 PDF 请求。旧 `vendor/pdfjs/` 当前未被使用。
- 项目封面后的概览按问题、个人贡献、三项关键设计与当前进展组织；维护 `content.js` 的 `brief`、`contribution`、`summary.highlights`、`summary.status`。不重复增加旧摘要，不把数字化验证写成实物试验；保留牛蛙项目进行中状态。
- 四个项目标题与封面之间增加“项目背景”，内容来自用户提供的背景文字，中英文维护在 `content.js` 的 `background` 字段；目标描述与实际完成阶段分开，后者见项目概览。

- 分段媒体支持 carousel（media-carousel.js），每组独立管理状态。安伴智护产品图与拓扑优化图均1秒；食界巧味模块化设计为图片1秒加视频播完一遍。修改后运行 scripts/verify_analysis_media.py；拓扑优化质量是原来的44.1%，不是减重44.1%。
