"""新增分析段落、独立轮播与图片/视频轮播验收。"""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = 'http://127.0.0.1:4173/'
ROOT = Path(__file__).resolve().parents[1]

def center(locator):
    locator.evaluate('(e)=>e.scrollIntoView({block:"center",behavior:"instant"})')

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width':1440,'height':1000})
        page = context.new_page()
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(BASE+'project.html?id=care&lang=zh')
        page.wait_for_selector('.detail-section')
        assert page.locator('.detail-section').count()==5
        product=page.locator('[data-carousel-id="care-product"]')
        topology=page.locator('[data-carousel-id="care-topology"]')
        assert topology.locator('img').evaluate_all('(a)=>a.map(i=>i.alt)')==['初始模型','第一次优化','应力仿真1','应力仿真2']
        for carousel in [product,topology]:
            center(carousel)
            expect(carousel.locator('.carousel-count')).to_have_text('2 / 4',timeout=1800)
            carousel.hover()
            count=carousel.locator('.carousel-count').inner_text()
            page.wait_for_timeout(1300)
            assert carousel.locator('.carousel-count').inner_text()==count
            carousel.locator('[data-carousel=next]').click()
            carousel.focus()
            page.keyboard.press('End')
            expect(carousel.locator('.carousel-count')).to_have_text('4 / 4')
            page.mouse.move(0,0)
            page.wait_for_timeout(1200)
            expect(carousel.locator('.carousel-count')).to_have_text('4 / 4')
        # Each instance retains its independent index while offscreen.
        expect(product.locator('.carousel-count')).to_have_text('4 / 4')
        obstacle=page.locator('.detail-section').nth(4).locator('video')
        center(obstacle)
        page.wait_for_function('(v)=>!v.paused&&v.currentTime>.1',arg=obstacle.element_handle())
        page.evaluate('scrollTo({top:0,behavior:"instant"})')
        expect(obstacle).to_have_js_property('paused',True)
        assert '降至原来的' in page.locator('.detail-section').nth(3).inner_text()

        page.goto(BASE+'project.html?id=printer&lang=zh')
        assert page.locator('.detail-section h2').all_text_contents()==['精准与均匀送料','自动换料设计','旋转收纳设计','模块化设计']
        mixed=page.locator('[data-carousel-id="printer-modular"]')
        assert mixed.locator('img').first.get_attribute('src')=='assets/printer-material.webp'
        video=mixed.locator('video')
        assert not video.evaluate('(v)=>v.loop')
        center(mixed)
        expect(mixed.locator('.carousel-count')).to_have_text('2 / 2',timeout=1800)
        page.wait_for_function('(v)=>v.currentTime>.2&&!v.paused',arg=video.element_handle())
        page.wait_for_timeout(1600)
        expect(mixed.locator('.carousel-count')).to_have_text('2 / 2')
        mixed.hover()
        expect(video).to_have_js_property('paused',True)
        held=video.evaluate('(v)=>v.currentTime')
        page.wait_for_timeout(400)
        assert abs(video.evaluate('(v)=>v.currentTime')-held)<.08
        page.mouse.move(0,0)
        page.wait_for_function('(v)=>v.currentTime>1&&!v.paused',arg=video.element_handle())
        page.evaluate('scrollTo({top:0,behavior:"instant"})')
        expect(video).to_have_js_property('paused',True)
        position=video.evaluate('(v)=>v.currentTime')
        center(mixed)
        page.wait_for_function('(v)=>!v.paused',arg=video.element_handle())
        assert video.evaluate('(v)=>v.currentTime')>=position
        expect(mixed.locator('.carousel-count')).to_have_text('1 / 2',timeout=12000)
        expect(mixed.locator('.carousel-count')).to_have_text('2 / 2',timeout=1800)
        mixed.locator('[data-carousel=pause]').click()
        expect(video).to_have_js_property('paused',True)
        page.mouse.move(0,0)
        page.wait_for_timeout(1300)
        expect(mixed.locator('.carousel-count')).to_have_text('2 / 2')
        mixed.locator('[data-carousel=pause]').click()
        page.wait_for_function('(v)=>!v.paused',arg=video.element_handle())

        # Exercise the visibility event path without relying on headless tab scheduling.
        page.evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});document.dispatchEvent(new Event("visibilitychange"))')
        expect(video).to_have_js_property('paused',True)
        held=video.evaluate('(v)=>v.currentTime')
        page.wait_for_timeout(400)
        assert abs(video.evaluate('(v)=>v.currentTime')-held)<.08
        page.evaluate('delete document.hidden;document.dispatchEvent(new Event("visibilitychange"))')
        page.wait_for_function('(v)=>!v.paused',arg=video.element_handle())
        assert video.evaluate('(v)=>v.currentTime')>=held
        old_video=video.element_handle()
        page.locator('.language-toggle').click()
        assert old_video.evaluate('(v)=>v.paused && !v.isConnected')
        assert page.locator('[data-carousel-id="printer-modular"]').count()==1

        # A denied autoplay request must leave a usable manual playback path.
        blocked=browser.new_page()
        blocked.add_init_script('''const original=HTMLMediaElement.prototype.play;
          HTMLMediaElement.prototype.play=function(){if(this.classList.contains('carousel-video')&&!window.allowPlay)return Promise.reject(new DOMException('Blocked','NotAllowedError'));return original.call(this)};''')
        blocked.goto(BASE+'project.html?id=printer&lang=zh')
        denied=blocked.locator('[data-carousel-id="printer-modular"]')
        center(denied)
        expect(denied.locator('.carousel-count')).to_have_text('2 / 2',timeout=1800)
        expect(denied.locator('[data-carousel=pause]')).to_have_text('播放轮播')
        blocked.evaluate('window.allowPlay=true')
        denied.locator('[data-carousel=pause]').click()
        blocked.wait_for_function('document.querySelector(".carousel-video").currentTime>.1')
        blocked.close()

        page.emulate_media(reduced_motion='reduce')
        page.reload()
        mixed=page.locator('[data-carousel-id="printer-modular"]')
        center(mixed)
        page.wait_for_timeout(1300)
        expect(mixed.locator('.carousel-count')).to_have_text('1 / 2')
        mixed.locator('[data-carousel=next]').click()
        video=mixed.locator('video')
        expect(video).to_have_js_property('paused',True)
        video.evaluate('(v)=>v.play()')
        page.wait_for_function('(v)=>v.currentTime>.1',arg=video.element_handle())

        for lang in ['zh','en']:
            for project in ['care','printer']:
                page.goto(BASE+f'project.html?id={project}&lang={lang}')
                page.eval_on_selector_all('img','a=>a.forEach(i=>i.loading="eager")')
                page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
                for width in [1440,768,390,320]:
                    page.set_viewport_size({'width':width,'height':900})
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                page.set_viewport_size({'width':1440,'height':1000})
                if lang=='zh':page.screenshot(path=str(ROOT/f'output/analysis-{project}.png'),full_page=True)
        assert not errors,errors
        browser.close()
    print('PASS: section content, independent 1-second galleries, full mixed-video cycle, hover/manual/offscreen pause, reduced motion, bilingual responsive layouts; no script errors')

if __name__=='__main__':verify()
