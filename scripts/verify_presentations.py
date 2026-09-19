"""逐页演示与轮播回归；先启动 README 中的本地 4173 服务。"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:4173/'
ROOT = Path(__file__).resolve().parents[1]

def serve_video(route):
    data = (ROOT/'assets/care-demo.mp4').read_bytes()
    requested = route.request.headers.get('range')
    headers = {'Accept-Ranges':'bytes', 'Content-Type':'video/mp4'}
    if requested:
        start, end = requested.removeprefix('bytes=').split('-')
        start, end = int(start or 0), int(end) if end else len(data)-1
        headers['Content-Range'] = f'bytes {start}-{end}/{len(data)}'
        route.fulfill(status=206, headers=headers, body=data[start:end+1])
    else:
        route.fulfill(status=200, headers=headers, body=data)

def fixture(route):
    deck = {'video':'care-demo.mp4', 'poster':'care.webp', 'slides':[
        {'start':i, 'title':{'zh':f'测试第 {i+1} 页','en':f'Test slide {i+1}'},
         'text':{'zh':'用于检验同步行为的测试解说。','en':'Fixture commentary for playback verification.'}}
        for i in range(3)]}
    deck['slides'][0]['seek'] = .25
    route.fulfill(content_type='text/javascript', body='export const presentations = '+json.dumps({key:deck for key in ['care','grooming','printer','frog']})+';')

def carousel(page):
    page.goto(BASE+'project.html?id=care&lang=zh')
    page.evaluate('document.documentElement.style.scrollBehavior="auto"')
    page.locator('.cover-carousel [data-carousel=next]').click()
    before = page.locator('.cover-carousel .carousel-count').inner_text()
    page.locator('.cover-carousel [data-carousel=pause]').click()
    # 鼠标刻意留在播放按钮，重现原先“显示暂停轮播却没有计时”的冲突。
    page.wait_for_function('(before)=>document.querySelector(".cover-carousel .carousel-count").textContent!==before', arg=before, timeout=2500)
    page.mouse.move(0,0)
    page.locator('.cover-carousel').hover()
    frozen = page.locator('.cover-carousel .carousel-count').inner_text()
    page.wait_for_timeout(1300)
    assert page.locator('.cover-carousel .carousel-count').inner_text() == frozen
    print('PASS: 点击播放后鼠标不移开仍一秒切换；重新悬停暂停')

def presentation(page):
    requests = []
    page.on('request', lambda request: requests.append(request.url))
    page.goto(BASE+'project.html?id=care&lang=zh')
    page.evaluate('document.documentElement.style.scrollBehavior="auto"')
    video = page.locator('.presentation-video')
    assert video.count() == 1
    assert video.evaluate('(v)=>v.paused && !v.loop && !v.autoplay && v.preload==="none"')
    assert not any(url.endswith('/care-demo.mp4') for url in requests), 'Presentation must not preload video'
    page.locator('[data-slide="1"]').click()
    page.wait_for_function('Math.abs(document.querySelector(".presentation-video").currentTime-1)<.1')
    assert video.evaluate('(v)=>v.paused'), 'Selecting a page preserves pause'
    assert page.locator('.presentation-title').inner_text() == '测试第 2 页'
    page.locator('.language-toggle').click()
    page.wait_for_function('Math.abs(document.querySelector(".presentation-video").currentTime-1)<.1')
    assert page.locator('.presentation-title').inner_text() == 'Test slide 2'
    assert video.evaluate('(v)=>v.paused')
    video.evaluate('(v)=>{v.muted=true;return v.play()}')
    page.wait_for_function('document.querySelector(".presentation-title").textContent==="Test slide 3"')
    time = video.evaluate('(v)=>v.currentTime')
    page.locator('.language-toggle').click()
    page.wait_for_function('(time)=>{const v=document.querySelector(".presentation-video");return !v.paused && v.currentTime>=time}', arg=time)
    assert video.evaluate('(v)=>v.muted'), 'Language switching preserves mute'
    page.locator('[data-slide="0"]').click()
    assert not video.evaluate('(v)=>v.paused'), 'Selecting a page preserves playback'
    video.evaluate('(v)=>{v.pause();v.currentTime=1.5}')
    page.wait_for_function('document.querySelector(".presentation-title").textContent==="测试第 2 页"')
    video.evaluate('(v)=>{v.currentTime=v.duration-.1;return v.play()}')
    page.wait_for_function('document.querySelector(".presentation-video").ended')
    assert page.locator('[data-presentation-action="next"]').is_disabled()
    page.locator('[data-slide="0"]').click()
    assert page.locator('[data-presentation-action="previous"]').is_disabled()
    page.wait_for_function('Math.abs(document.querySelector(".presentation-video").currentTime-.25)<.1')
    assert video.evaluate('(v)=>v.paused')
    desktop = page.locator('.presentation-notes').bounding_box()
    screen = page.locator('.presentation-screen').bounding_box()
    assert desktop['x'] < screen['x']
    page.set_viewport_size({'width':390,'height':844})
    notes = page.locator('.presentation-notes').bounding_box()
    screen = page.locator('.presentation-screen').bounding_box()
    assert screen['y'] < notes['y']
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.locator('.presentation-section').screenshot(path=str(ROOT/'output/presentation-mobile.png'))
    page.set_viewport_size({'width':1440,'height':1000})
    page.locator('.presentation-section').screenshot(path=str(ROOT/'output/presentation-desktop.png'))
    print('PASS: 手动播放、不预加载、逐页跳转/播放/拖动同步、首尾页、换语言保留播放及暂停状态、桌面/手机布局')

def retry(page, server_video=False):
    page.route('**/care-demo.mp4', lambda route: route.abort())
    page.goto(BASE+'project.html?id=care&lang=zh')
    page.locator('[data-slide="1"]').click()
    page.locator('.presentation-error').wait_for(state='visible')
    page.unroute('**/care-demo.mp4')
    if not server_video:
        page.route('**/care-demo.mp4', serve_video)
    page.locator('[data-presentation-action="retry"]').click()
    page.wait_for_function('Math.abs(document.querySelector(".presentation-video").currentTime-1)<.1')
    assert not page.locator('.presentation-error').is_visible()
    print('PASS: 加载失败提示、重试后恢复所选页面')

def real_presentations(page):
    for project, expected in [('care',20),('grooming',19),('printer',28),('frog',16)]:
        page.goto(BASE+f'project.html?id={project}&lang=zh')
        deck = page.evaluate('(id)=>import("./presentations.js").then(m=>m.presentations[id])', project)
        assert len(deck['slides']) == expected
        assert page.locator('[data-slide]').count() == expected
        assert page.locator('.methods-grid article').count() == 4
        assert deck['slides'][0]['start'] == 0
        assert all(a['start'] < b['start'] for a,b in zip(deck['slides'],deck['slides'][1:]))
        for i, slide in enumerate(deck['slides']):
            page.locator(f'[data-slide="{i}"]').click()
            page.wait_for_function('(time)=>{const v=document.querySelector(".presentation-video");return v.readyState>=2 && !v.seeking && Math.abs(v.currentTime-time)<.15}', arg=slide.get('seek',slide['start']))
            assert page.locator('.presentation-title').inner_text() == slide['title']['zh']
            assert page.locator('.presentation-text').inner_text() == slide['text']['zh']
        video = page.locator('.presentation-video')
        assert video.evaluate('(v)=>v.duration') > deck['slides'][-1]['start']
        page.locator('.language-toggle').click()
        page.wait_for_function('(time)=>{const v=document.querySelector(".presentation-video");return v.readyState>=2 && !v.seeking && Math.abs(v.currentTime-time)<.15}', arg=deck['slides'][-1]['start'])
        assert page.locator('.presentation-title').inner_text() == deck['slides'][-1]['title']['en']
        assert video.evaluate('(v)=>v.paused')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.locator('.presentation-section').screenshot(path=str(ROOT/f'output/{project}-presentation-desktop.png'))
        page.set_viewport_size({'width':390,'height':844})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.locator('.presentation-section').screenshot(path=str(ROOT/f'output/{project}-presentation-mobile.png'))
        page.set_viewport_size({'width':1440,'height':1000})
        print(f'PASS: {project} {expected} real slide boundaries, bilingual content, methods and responsive layout')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--carousel-only', action='store_true')
    parser.add_argument('--server-video', action='store_true', help='使用真实预览服务提供 MP4，验证 Range 支持')
    parser.add_argument('--real', action='store_true', help='使用实际四套演示数据和视频验证所有页时间点')
    args = parser.parse_args()
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chromium')
        page = browser.new_page(viewport={'width':1440,'height':1000})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        if not args.real:
            page.route('**/presentations.js', fixture)
            if not args.server_video:
                page.route('**/care-demo.mp4', serve_video)
        carousel(page)
        if not args.carousel_only:
            (ROOT/'output').mkdir(exist_ok=True)
            if args.real:
                real_presentations(page)
            else:
                presentation(page)
                retry(page, args.server_video)
        assert not errors, errors
        browser.close()
