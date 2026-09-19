from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:4173/'

def x(page):
    return page.locator('.skills-track').evaluate('(el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41')

def still(page):
    before = x(page)
    page.wait_for_timeout(250)
    assert abs(x(page)-before) < 1, 'Banner must remain paused'

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width':1440,'height':1000})
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(BASE+'index.html?lang=zh')
    assert page.locator('.skills-banner').count() == 1, 'Missing skills banner'
    page.wait_for_timeout(200)
    before = x(page)
    page.wait_for_timeout(500)
    assert 12 < x(page)-before < 24, 'Expected rightward movement at 35 px/s'
    word = page.locator('.skills-word').filter(has_text='SOLIDWORKS').nth(1)
    word.hover(force=True)
    still(page)
    assert word.evaluate('(el)=>getComputedStyle(el).color') == 'rgb(255, 255, 255)'
    page.mouse.move(10, 400)
    before = x(page)
    page.wait_for_timeout(250)
    assert x(page) > before + 5
    page.locator('.skills-toggle').click()
    still(page)
    word.hover(force=True)
    page.mouse.move(10, 400)
    still(page)
    paused_x = x(page)
    page.locator('.language-toggle').click()
    still(page)
    assert abs(x(page)-paused_x)<1, 'Language switch must preserve animation position'
    assert page.locator('#experience h2').inner_text() == 'Work experience'
    assert page.locator('.experience-placeholder').inner_text() == 'Coming soon'
    page.locator('.skills-toggle').focus()
    page.keyboard.press('Enter')
    page.locator('.language-toggle').focus()
    before = x(page)
    page.wait_for_timeout(250)
    assert x(page) > before + 5
    page.locator('.skills-viewport').focus()
    still(page)
    page.locator('.language-toggle').focus()
    # Loop endpoint must be visually identical: a word from the next group replaces it.
    assert page.locator('.skills-track').evaluate('''el => {
        const a=el.getAnimations()[0]; a.pause();
        const duration=a.effect.getTiming().duration;
        a.currentTime=0;
        const start=el.children[1].getBoundingClientRect().x;
        a.currentTime=duration-0.01;
        const end=el.children[0].getBoundingClientRect().x;
        return Math.abs(start-end)<1;
    }''')
    for width in [1920, 768, 390, 320]:
        page.set_viewport_size({'width':width,'height':900})
        page.wait_for_timeout(100)
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert page.locator('.skills-banner').evaluate('(el)=>el.getBoundingClientRect().bottom <= document.querySelector(".hero-inner").getBoundingClientRect().top')
    page.emulate_media(reduced_motion='reduce')
    page.wait_for_timeout(100)
    assert page.locator('.skills-viewport').evaluate('(el)=>getComputedStyle(el).overflowX') == 'auto'
    assert page.locator('.skills-toggle').is_hidden()
    assert page.locator('.skills-group').count() == 1
    assert page.locator('#experience').evaluate('(el)=>document.querySelector("#work").compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING')
    assert not errors, errors
    page.screenshot(path=str(Path(__file__).resolve().parents[1]/'output/home-skills-mobile.png'), full_page=True)
    page.set_viewport_size({'width':1440,'height':1000})
    page.emulate_media(reduced_motion='no-preference')
    page.goto(BASE+'index.html?lang=zh')
    page.screenshot(path=str(Path(__file__).resolve().parents[1]/'output/home-skills-desktop.png'), full_page=True)
    touch = browser.new_context(viewport={'width':390,'height':844}, has_touch=True, is_mobile=True)
    mobile = touch.new_page()
    mobile.goto(BASE+'index.html?lang=zh')
    mobile.wait_for_selector('.skills-toggle')
    mobile.locator('.skills-toggle').tap()
    still(mobile)
    mobile.locator('.skills-toggle').tap()
    before = x(mobile)
    mobile.wait_for_timeout(250)
    assert x(mobile) > before+5, 'Touch resume must not stick in hover pause'
    touch.close()
    browser.close()
print('PASS: direction, speed, hover, manual pause, language, keyboard, seam, responsive and reduced motion')
