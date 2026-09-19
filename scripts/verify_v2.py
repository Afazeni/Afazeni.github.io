"""第二版验收：真实浏览器缩放、媒体状态与原版简历。保持本地 4173 服务运行。"""
import argparse
import hashlib
import json
import tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'output'
BASE = 'http://127.0.0.1:4173/'

def digest(data):
    return hashlib.sha256(data).hexdigest()

def verify(original):
    OUTPUT.mkdir(exist_ok=True)
    checks, errors = [], []
    expected_hash = digest(original.read_bytes())
    assert digest((ROOT/'assets/resume-original.pdf').read_bytes()) == expected_hash
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chromium')
        page = browser.new_page(viewport={'width':1440,'height':1000}, reduced_motion='no-preference')
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE+'index.html?lang=zh')
        assert page.locator('.project-card').count() == 4
        assert page.locator('.project-placeholder').count() == 1
        assert page.locator('.project-placeholder a, .project-placeholder button').count() == 0
        assert page.locator('.project-image.printer img').get_attribute('src') == 'assets/printer-cover.webp'
        assert page.locator('.project-image.frog img').get_attribute('src') == 'assets/frog-cover.webp'
        checks.append('Four real projects plus a noninteractive placeholder; new covers')

        page.goto(BASE+'project.html?id=care&lang=zh')
        page.evaluate('document.documentElement.style.scrollBehavior="auto"')
        gallery = page.locator('[data-carousel-id="care-product"]')
        gallery.evaluate('(e)=>e.scrollIntoView({block:"center",behavior:"instant"})')
        assert page.locator('.cover-carousel .carousel-slide img').evaluate_all('(imgs)=>imgs.map(i=>i.alt)') == ['老人陪护机器人','机器人-透明外壳','机器人-椅子','机器人-椅子-人']
        counter = page.locator('.cover-carousel .carousel-count')
        assert counter.inner_text() == '1 / 4'
        page.wait_for_function('document.querySelector(".cover-carousel .carousel-count").textContent === "2 / 4"', timeout=2500)
        gallery.hover()
        frozen = counter.inner_text()
        page.wait_for_timeout(1300)
        assert counter.inner_text() == frozen, 'Hover must pause'
        page.locator('.cover-carousel [data-carousel=next]').click()
        assert counter.inner_text() == '3 / 4'
        page.locator('.cover-carousel [data-carousel=previous]').click()
        assert counter.inner_text() == '2 / 4'
        gallery.focus()
        page.keyboard.press('End')
        assert counter.inner_text() == '4 / 4'
        page.keyboard.press('ArrowRight')
        assert counter.inner_text() == '1 / 4'
        page.keyboard.press('Home')
        page.mouse.move(0,0)
        page.wait_for_timeout(1300)
        assert counter.inner_text() == '1 / 4', 'Keyboard navigation must pause'
        page.locator('.cover-carousel [data-carousel=pause]').click()
        page.mouse.move(0,0)
        page.wait_for_function('document.querySelector(".cover-carousel .carousel-count").textContent === "2 / 4"', timeout=2500)
        page.locator('.cover-carousel [data-carousel=pause]').click()
        page.mouse.move(0,0)
        frozen = counter.inner_text()
        page.wait_for_timeout(1300)
        assert counter.inner_text() == frozen, 'Pause button must stop rotation'
        checks.append('Carousel order, one-second autoplay, hover, arrows, keyboard, wraparound and pause/resume')

        expectations = {
            'care': [('功能创新','care-detail-1.mp4'),('结构创新','care-detail-2.mp4'),('机构创新','care-detail-3.mp4'),('拓扑优化',None),('过障分析','care-obstacle.mp4')],
            'grooming': [('功能创新','grooming-detail-1.mp4'),('机构创新','grooming-detail-2.mp4'),('结构创新','grooming-detail-3.mp4')],
            'frog': [('模块化一体化设计',None),('摆正与夹头机构创新','frog-detail-1.mp4'),('多工位往复加工创新','frog-detail-2.mp4')]
        }
        for project, expected in expectations.items():
            page.goto(BASE+f'project.html?id={project}&lang=zh')
            page.evaluate('document.documentElement.style.scrollBehavior="auto"')
            sections = page.locator('.detail-section')
            assert sections.count() == len(expected)
            assert page.locator('.detail-subtitle').count() == (5 if project=='care' else 0)
            for i, (title, filename) in enumerate(expected):
                section = sections.nth(i)
                assert section.locator('h2').inner_text() == title
                if not filename:
                    assert section.locator('img').first.get_attribute('src') == ('assets/care-topology-1.webp' if project=='care' else 'assets/frog-structure.webp')
                    continue
                video = section.locator('video')
                assert video.locator('source').get_attribute('src') == 'assets/'+filename
                assert video.evaluate('(v)=>v.paused'), 'Offscreen video must wait'
                video.evaluate('(v)=>v.scrollIntoView({block:"center",behavior:"instant"})')
                page.wait_for_function('(v)=>v.currentTime>.15&&!v.paused', arg=video.element_handle())
                assert video.evaluate('(v)=>v.muted && v.loop && v.controls && v.videoWidth>0')
                page.evaluate('scrollTo({top:0,behavior:"instant"})')
                page.wait_for_function('(src)=>[...document.querySelectorAll("video")].find(v=>v.querySelector("source").getAttribute("src").endsWith(src)).paused', arg=filename)
            checks.append(project+': exact section/video mapping; muted looping playback on entry and pause on exit')

        video = page.locator('.detail-video').first
        video.evaluate('(v)=>v.scrollIntoView({block:"center",behavior:"instant"})')
        page.wait_for_function('!document.querySelector(".detail-video").paused')
        video.evaluate('(v)=>v.pause()')
        page.wait_for_timeout(100)
        page.evaluate('scrollTo({top:0,behavior:"instant"})')
        page.wait_for_timeout(200)
        video.evaluate('(v)=>v.scrollIntoView({block:"center",behavior:"instant"})')
        page.wait_for_timeout(400)
        assert video.evaluate('(v)=>v.paused'), 'Manual pause must survive scrolling'
        checks.append('A manually paused video stays paused when scrolling away and back')

        page.emulate_media(reduced_motion='reduce')
        page.goto(BASE+'project.html?id=care&lang=zh')
        assert page.locator('.cover-carousel [data-carousel=pause]').inner_text() == '播放轮播'
        page.wait_for_timeout(1300)
        assert page.locator('.cover-carousel .carousel-count').inner_text() == '1 / 4'
        video = page.locator('.detail-video').first
        video.evaluate('(v)=>v.scrollIntoView({block:"center",behavior:"instant"})')
        page.wait_for_timeout(400)
        assert video.evaluate('(v)=>v.paused')
        video.evaluate('(v)=>v.play()')
        page.wait_for_function('document.querySelector(".detail-video").currentTime>.15')
        checks.append('Reduced motion disables automatic rotation/playback; native manual playback works')

        # Simulate an autoplay rejection; native controls must still support a user-initiated play.
        blocked = browser.new_page()
        blocked.add_init_script('''const play=HTMLMediaElement.prototype.play;
          HTMLMediaElement.prototype.play=function(){if(!window.allowPlayback)return Promise.reject(new DOMException('Blocked','NotAllowedError'));return play.call(this)};''')
        blocked.goto(BASE+'project.html?id=grooming&lang=zh')
        blocked.locator('.detail-video').first.evaluate('(v)=>v.scrollIntoView({block:"center",behavior:"instant"})')
        blocked.wait_for_timeout(500)
        assert blocked.locator('.detail-video').first.evaluate('(v)=>v.paused && v.controls')
        blocked.evaluate('window.allowPlayback=true')
        blocked.locator('.detail-video').first.evaluate('(v)=>v.play()')
        blocked.wait_for_function('document.querySelector(".detail-video").currentTime>.15')
        blocked.close()
        checks.append('Autoplay rejection falls back to working native manual controls')

        # Leaving before the first frame may cancel play() with AbortError, not a policy failure.
        fast_scroll = browser.new_page()
        def delayed_response(route):
            import time
            response = route.fetch()
            time.sleep(1)
            route.fulfill(response=response)
        fast_scroll.route('**/care-detail-1.mp4', delayed_response)
        fast_scroll.goto(BASE+'project.html?id=care&lang=zh')
        fast_scroll.locator('.detail-video').first.evaluate('''v => {
            v.scrollIntoView({block:'center',behavior:'instant'});
            setTimeout(()=>scrollTo({top:0,behavior:'instant'}),25);
        }''')
        fast_scroll.wait_for_timeout(1600)
        fast_scroll.locator('.detail-video').first.evaluate('(v)=>v.scrollIntoView({block:"center",behavior:"instant"})')
        fast_scroll.wait_for_function('!document.querySelector(".detail-video").paused && document.querySelector(".detail-video").currentTime>.15')
        fast_scroll.close()
        checks.append('Fast scrolling during first video load does not permanently block autoplay')

        # Preview must not auto-request a PDF; use headless-shell for file download assertions.
        download_browser = p.chromium.launch()
        download_page = download_browser.new_page(accept_downloads=True)
        for language in ['zh','en']:
            page.goto(BASE+'resume.html?lang='+language)
            assert page.locator('object, embed, iframe').count() == 0
            assert page.locator('.resume-original-image').is_visible()
            download_page.goto(BASE+'resume.html?lang='+language)
            with download_page.expect_download() as download:
                download_page.locator('a[download]').click()
            assert digest(Path(download.value.path()).read_bytes()) == expected_hash
        download_browser.close()
        page.set_viewport_size({'width':390,'height':844})
        page.reload()
        assert page.locator('object').count() == 0
        assert page.locator('.resume-original-image').is_visible()
        page.screenshot(path=str(OUTPUT/'v2-resume-mobile.png'), full_page=True)
        fallback = browser.new_page()
        fallback.add_init_script('Object.defineProperty(navigator,"pdfViewerEnabled",{get:()=>false})')
        fallback.goto(BASE+'resume.html')
        assert fallback.locator('.resume-original-image').is_visible()
        fallback.close()
        checks.append('Both downloaded PDFs match the original SHA-256; original image preview on desktop/mobile')
        browser.close()

        # A tiny local test extension changes the browser tab zoom (not CSS zoom/emulation).
        extension = OUTPUT/'zoom-extension'
        extension.mkdir(exist_ok=True)
        (extension/'manifest.json').write_text(json.dumps({'manifest_version':3,'name':'Local preview zoom verification','version':'1.0','permissions':['tabs'],'background':{'service_worker':'worker.js'}}))
        (extension/'worker.js').write_text('chrome.runtime.onInstalled.addListener(() => {});')
        with tempfile.TemporaryDirectory() as profile:
            context=p.chromium.launch_persistent_context(profile,headless=True,channel='chromium',args=[f'--disable-extensions-except={extension}',f'--load-extension={extension}'],viewport={'width':1440,'height':1000})
            worker=context.service_workers[0] if context.service_workers else context.wait_for_event('serviceworker')
            page=context.pages[0]
            for language in ['zh','en']:
                page.goto(BASE+'index.html?lang='+language)
                for zoom in [.25,.5,1,1.25]:
                    worker.evaluate('async zoom=>{const tabs=await chrome.tabs.query({});await chrome.tabs.setZoom(tabs.find(t=>t.url.startsWith("http://127.0.0.1:4173/")).id,zoom)}',zoom)
                    page.wait_for_timeout(200)
                    geometry=page.evaluate('''() => {const h=document.querySelector('.hero').getBoundingClientRect(), c=document.querySelector('.hero-inner').getBoundingClientRect(), b=document.querySelector('.hero-background').getBoundingClientRect();return {width:innerWidth,height:innerHeight,dpr:devicePixelRatio,hero:{top:h.top,bottom:h.bottom,width:h.width},center:c.x+c.width/2,bg:{height:b.height,width:b.width},overflow:document.documentElement.scrollWidth>innerWidth}}''')
                    assert abs(geometry['dpr']-zoom)<.01, geometry
                    assert geometry['hero']['bottom'] >= geometry['height']-1, geometry
                    assert abs(geometry['center']-geometry['width']/2)<1, geometry
                    assert geometry['bg']['width']>=geometry['width']-1 and not geometry['overflow'], geometry
                    page.screenshot(path=str(OUTPUT/f'v2-home-{language}-zoom-{int(zoom*100)}.png'))
                    checks.append(f'{language} actual browser zoom {int(zoom*100)}%: hero fills viewport, content centered, no overflow')
            context.close()
    assert not errors, errors
    (OUTPUT/'verification-v2.json').write_text(json.dumps({'checks':checks,'errors':errors,'original_pdf_sha256':expected_hash},ensure_ascii=False,indent=2),encoding='utf-8')
    print('\n'.join(checks))

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('original_pdf',type=Path)
    verify(parser.parse_args().original_pdf)
