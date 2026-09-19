# 作品页演示与轮播验收记录

## 实现结果

- 四个作品新增 PPT 演示播放器和中英逐页解说，共 83 页；现有机构介绍后展示 PPT，随后展示“方法&关键决策”。
- 播放、拖动和页码跳转同步解说；页码跳转保持播放/暂停状态；切换语言保留时间、音量和播放速度。
- 主动播放轮播覆盖当前悬停暂停，下一次重新进入恢复悬停规则；页面显示真实暂停原因。
- 本地预览支持 HTTP Range，长视频可以按时间跳转，页面初始不预载整段演示。

## 媒体核查

- PowerPoint 只修改 output 中的工作副本；四个原始 PPTX 的 SHA-256 均与导出前一致。
- 原视频、页内动画、转场由 Windows PowerPoint 导出。缺失的点击计时补为自动顺序；GIF 另按完整周期计算停留时间。
- 四套视频全部逐页抽帧比对。视频/GIF 页在多个时刻抽样核对；这不是原始交互放映的逐帧一致性证明。
- 定位点位于新页转场后的可读画面；第一页保留 start=0，另用 seek 避免点击第一页时停在黑色淡入。
- 食界巧味第 13 页自动匹配曾被前页流程图干扰，人工核对后定为 126.75 秒。校正绑定最终视频 SHA-256，视频变更后不能直接套用。
- 最终逐页画面保存在 output/presentation-export 下各项目的 jumps-*.jpg；这些核查文件不发布。

## 通过的检查

- scripts/verify_presentations.py --real：四项目 20 / 19 / 28 / 16 个真实跳页点、中英解说、四段方法正文、桌面与手机布局。
- scripts/verify_presentations.py --server-video：悬停播放回归、连续播放与拖动同步、首尾页、结束、语言切换、失败重试及不预加载。
- scripts/verify_preview.py：中英文页面、四种视口、图片、证书、菜单、链接及原有演示视频，无 JavaScript 错误。
- scripts/verify_v2.py：原有轮播、分段视频、减少动态效果、自动播放拒绝、真实浏览器缩放与简历原件哈希。
- scripts/verify_resume_links.py：无自动 PDF 请求，原始 PDF 新标签链接与下载字节一致。
- scripts/test_preview_server.py：普通 GET、单范围/后缀/开放范围、HEAD、416 及多范围退回普通响应。
- scripts/test_export_timing.py：并行动画延时不累加、GIF 留足完整周期。
- JavaScript 文件通过 node --check。

只保留本地改动及预览服务，没有提交、推送或发布。
