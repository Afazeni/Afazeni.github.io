"""真实浏览器验收。先在 4173 端口启动静态服务。"""
import json
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'output'
OUTPUT.mkdir(exist_ok=True)
BASE = 'http://127.0.0.1:4173/'

def verify():
    errors, links, checks = [], set(), []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
        context.grant_permissions(['clipboard-read','clipboard-write'],origin=BASE.rstrip('/'))
        page = context.new_page()
        page.on('pageerror',lambda error:errors.append(str(error)))
        routes = ['index.html','honors.html','resume.html'] + [f'project.html?id={x}' for x in ['care','grooming','printer','frog']]
        for lang in ['zh','en']:
            for route in routes:
                url=BASE+route+('&' if '?' in route else '?')+'lang='+lang
                page.goto(url)
                page.wait_for_selector('main h1')
                assert page.locator('main h1').count()==1, url
                assert page.locator('html').get_attribute('lang')==('zh-CN' if lang=='zh' else 'en')
                page.eval_on_selector_all('img','images => images.forEach(i => i.loading="eager")')
                page.wait_for_function('Array.from(document.images).every(i => i.complete && i.naturalWidth > 0)')
                links.update(page.eval_on_selector_all('a[href]','els => els.map(a=>a.href)'))
                for width in [1440,768,390,320]:
                    page.set_viewport_size({'width':width,'height':900})
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow: {url} @ {width}'
                checks.append(f'{lang} {route}: 4 viewport widths; all images loaded')
                page.set_viewport_size({'width':1440,'height':1000})
        page.goto(BASE+'index.html?lang=zh')
        assert page.locator('.project-card').count()==4
        assert page.locator('.certificate-preview').count()==0
        page.locator('.language-toggle').click()
        expect(page.locator('html')).to_have_attribute('lang', 'en')
        page.locator('.project-card a').first.click()
        assert 'id=care' in page.url and 'lang=en' in page.url
        expect(page.locator('html')).to_have_attribute('lang', 'en')
        page.reload()
        expect(page.locator('html')).to_have_attribute('lang', 'en')
        checks.append('Language selection persists through navigation and reload')
        page.goto(BASE+'honors.html?lang=zh')
        assert page.locator('.award-card:visible').count()==20
        for year,count in [('2026',8),('2025',12),('all',20)]:
            page.locator(f'[data-filter="{year}"]').click()
            assert page.locator('.award-card:visible').count()==count
        trigger=page.locator('.award-card .certificate-preview').first
        trigger.click()
        assert page.locator('dialog').is_visible()
        page.wait_for_function('document.querySelector("dialog img").complete')
        page.keyboard.press('Escape')
        assert not page.locator('dialog').is_visible()
        assert trigger.evaluate('(el)=>document.activeElement===el')
        checks.append('All 20 certificates; year filters; dialog Escape and focus restoration')
        for id in ['care','grooming','printer','frog']:
            page.goto(BASE+f'project.html?id={id}&lang=zh')
            page.locator('.video-section video').evaluate('(v)=>{v.load();return v.play()}')
            page.wait_for_function('document.querySelector("video").currentTime > .2')
            page.locator('.video-section video').evaluate('(v)=>v.pause()')
        checks.append('All four videos decode and play')
        page.goto(BASE+'project.html?id=unknown')
        assert page.locator('.not-found').is_visible()
        page.goto(BASE+'index.html?lang=zh')
        page.locator('.copy-email').click()
        page.wait_for_function('document.querySelector(".copy-status").textContent.length > 0')
        assert page.locator('.copy-status').inner_text()=='邮箱已复制。'
        assert page.evaluate('navigator.clipboard.readText()')=='chenyingling5245@gmail.com'
        checks.append('Unknown project fallback and actual clipboard copy')
        page.set_viewport_size({'width':390,'height':844})
        page.locator('.menu-toggle').click()
        assert page.locator('#navigation').is_visible()
        page.locator('.language-toggle').focus()
        page.keyboard.press('Enter')
        assert page.locator('#navigation').is_visible(), 'Language switch must preserve the open mobile menu'
        assert page.locator('.language-toggle').evaluate('(el)=>document.activeElement===el'), 'Language switch must preserve keyboard focus'
        page.locator('.language-toggle').click()
        page.keyboard.press('Escape')
        assert not page.locator('#navigation').is_visible()
        page.locator('.menu-toggle').click()
        page.locator('#navigation a[href*="#work"]').click()
        assert not page.locator('#navigation').is_visible()
        checks.append('Mobile menu toggle, Escape and navigation closure')
        for lang in ['zh','en']:
            page.goto(BASE+'resume.html?lang='+lang)
            with page.expect_download() as download:
                page.locator('a[download]').click()
            assert download.value.suggested_filename=='resume-original.pdf'
        checks.append('Chinese and English PDF downloads')
        for route,name,width,height in [('index.html?lang=zh','home-desktop',1440,1000),('index.html?lang=zh','home-mobile',390,844),('index.html?lang=en','home-english',1440,1000),('honors.html?lang=zh','honors-desktop',1440,1000),('project.html?id=care&lang=zh','project-care',1440,1000)]:
            page.set_viewport_size({'width':width,'height':height})
            page.goto(BASE+route)
            page.eval_on_selector_all('img','images => images.forEach(i => i.loading="eager")')
            page.wait_for_function('Array.from(document.images).every(i => i.complete && i.naturalWidth > 0)')
            page.screenshot(path=str(OUTPUT/(name+'.png')),full_page=True)
            if name=='home-desktop':page.screenshot(path=str(OUTPUT/'home-first-screen.png'))
        browser.close()
    for link in links:
        if link.startswith(BASE):
            with urlopen(Request(link.split('#')[0],method='HEAD'),timeout=15) as response:
                assert response.status==200,link
    assert not errors,errors
    checks.append(f'{len([l for l in links if l.startswith(BASE)])} internal link targets return HTTP 200; no JavaScript errors')
    (OUTPUT/'verification.json').write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
    print('\n'.join(checks))

if __name__=='__main__':verify()
