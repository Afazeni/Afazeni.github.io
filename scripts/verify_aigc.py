"""AIGC 阅读页真实浏览器验收：保持本地 4173 服务开启。"""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
BASE='http://127.0.0.1:4173/'

def jump(page, number):
    page.locator('.aigc-page-input').fill(str(number))
    page.locator('.aigc-page-input').press('Enter')
    expect(page.locator('.aigc-reader')).to_have_attribute('data-current-page',str(number))
    page.locator(f'[data-pdf-page="{number}"][data-rendered]').wait_for(timeout=30000)

def no_overlap(page):
    assert page.evaluate('''() => {
      const sheet=document.querySelector('[data-pdf-page="'+document.querySelector('.aigc-reader').dataset.currentPage+'"]');
      const a=sheet.getBoundingClientRect(), p=document.querySelector('.aigc-pages').getBoundingClientRect();
      const n=document.querySelector('.aigc-notes').getBoundingClientRect();
      return a.left>=p.left && a.right<=p.right && a.width<=p.width && a.height<=p.height &&
        (n.right<=p.left || n.top>=p.bottom || n.width===0);
    }'''), 'Page must fit available area and never be covered by notes'

with sync_playwright() as p:
    b=p.chromium.launch()
    page=b.new_page(viewport={'width':1440,'height':1000})
    errors=[];pdf_requests=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('request',lambda r:pdf_requests.append(r.url) if r.url.endswith('.pdf') else None)
    page.goto(BASE+'index.html?lang=zh')
    menu=page.locator('.discover-toggle')
    expect(menu).to_be_visible()
    assert not pdf_requests, 'Home must not preload PDF'
    menu.click();expect(page.locator('.discover-menu')).to_be_visible()
    menu.press('Escape');expect(page.locator('.discover-menu')).to_be_hidden()
    menu.press('ArrowDown');expect(page.locator('.discover-menu a')).to_be_focused()
    page.locator('.discover-menu a').click()
    page.locator('[data-pdf-page="1"][data-rendered]').wait_for(timeout=30000)
    assert page.locator('.pdf-sheet').count()==43
    expect(page.locator('.aigc-notes')).to_be_hidden()
    page.locator('.aigc-rail').click()
    expect(page.locator('.aigc-notes')).to_be_visible()
    assert page.locator('.aigc-note').count()==43
    assert '2025 年暑假' in page.locator('.aigc-note.is-current').inner_text()
    no_overlap(page)
    first=page.locator('.aigc-note.is-current')
    assert first.evaluate('(el)=>getComputedStyle(el).fontWeight')=='700'
    assert page.locator('.aigc-note.is-adjacent').count()==1
    page.screenshot(path=str(ROOT/'output/aigc-desktop-open.png'))
    page.locator('.aigc-pages').hover();page.mouse.wheel(0,650)
    page.wait_for_function('Number(document.querySelector(".aigc-reader").dataset.currentPage)>1')
    expect(page.locator('.site-header')).to_be_in_viewport()
    jump(page,21)
    expect(page.locator('[data-note="20"]')).to_have_attribute('aria-current','page')
    assert page.locator('.aigc-note.is-adjacent').count()==2
    page.locator('[data-note="21"]').click()
    expect(page.locator('.aigc-reader')).to_have_attribute('data-current-page','22')
    page.locator('.language-toggle').click()
    page.locator('[data-pdf-page="22"][data-rendered]').wait_for(timeout=30000)
    expect(page.locator('.aigc-reader')).to_have_attribute('data-current-page','22')
    expect(page.locator('.aigc-notes')).to_be_visible()
    no_overlap(page)
    jump(page,43)
    assert '工具会不断变化' in page.locator('.aigc-note.is-current').inner_text()
    page.locator('.aigc-rail').click()
    expect(page.locator('.aigc-reader')).to_have_attribute('data-current-page','43')
    page.reload();page.locator('[data-pdf-page="43"][data-rendered]').wait_for(timeout=30000)
    expect(page.locator('.aigc-reader')).to_have_attribute('data-current-page','43')
    jump(page,1)
    # 全部 43 页必须能够解码；旧图片释放，不能随着翻页累积。
    for number in range(1,44):
        jump(page,number)
        assert page.locator('.pdf-sheet img').count()<=8
    for width in [1024,801,768,390,320]:
        page.set_viewport_size({'width':width,'height':844})
        page.wait_for_timeout(180)
        if page.locator('.aigc-rail').get_attribute('aria-expanded')!='true':page.locator('.aigc-rail').click()
        jump(page,12);no_overlap(page)
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    jump(page,42)
    expect(page.locator('.aigc-reader')).to_have_attribute('data-current-page','42')
    jump(page,43)
    jump(page,12)
    page.screenshot(path=str(ROOT/'output/aigc-mobile-open.png'))
    page.locator('.aigc-pages').focus();page.keyboard.press('Escape')
    expect(page.locator('.aigc-notes')).to_be_hidden()
    page.locator('.aigc-back').click()
    expect(page.locator('.hero')).to_be_visible()
    # 加载失败必须有可操作的重试；重试后保留深链页码。
    page.route('**/assets/aigc/*.webp',lambda route:route.abort())
    page.goto(BASE+'aigc.html?lang=zh#page=4')
    expect(page.locator('.aigc-error')).to_be_visible(timeout=30000)
    page.unroute('**/assets/aigc/*.webp')
    page.locator('.aigc-retry').click()
    page.locator('[data-pdf-page="4"][data-rendered]').wait_for(timeout=30000)
    assert not pdf_requests, pdf_requests
    assert not errors,errors
    b.close()
print('PASS: discover menu; 43 rendered pages; scroll sync; notes; resizing without overlap; language; return; retry; bounded images; no automatic PDF requests')
