"""验证简历不再自动请求 PDF；显式点击才在新标签打开原件。"""
import hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:4173/'

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chromium')
        context = browser.new_context(viewport={'width':1440,'height':1000})
        page = context.new_page()
        requests, errors = [], []
        context.on('request', lambda request: requests.append(request.url))
        page.on('pageerror', lambda error: errors.append(str(error)))
        for language in ['zh','en']:
            for route in ['index.html', 'resume.html', 'honors.html', 'project.html?id=care']:
                requests.clear()
                page.goto(BASE+route+('&' if '?' in route else '?')+'lang='+language)
                page.wait_for_selector('main h1')
                page.wait_for_timeout(200)
                assert page.locator('object, embed, iframe').count()==0, 'No automatic PDF embed'
                assert not any('.pdf' in url.lower() for url in requests), requests
                links = page.locator('a[href="assets/resume-original.pdf"]:not([download])')
                assert links.count()==(1 if route=='resume.html' else 0)
                for link in links.all():
                    assert link.get_attribute('target')=='_blank'
                    assert 'noopener' in link.get_attribute('rel')
                if route=='resume.html':
                    page.wait_for_function('document.querySelector(".resume-original-image").naturalWidth>0')
                    for width in [1440,390,320]:
                        page.set_viewport_size({'width':width,'height':900})
                        assert page.locator('.resume-original-image').is_visible()
                        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                    page.set_viewport_size({'width':1440,'height':1000})
        # 从每个实际入口进入：查看简历不能直接导航到 PDF。
        for language in ['zh','en']:
            for selector in ['.nav-resume', '.hero-actions .button-light', '.contact-section .button-outline-light']:
                requests.clear()
                page.goto(BASE+'index.html?lang='+language)
                page.locator(selector).click()
                page.wait_for_selector('.resume-original-image')
                page.wait_for_function('document.querySelector(".resume-original-image").naturalWidth>0')
                assert 'resume.html' in page.url and 'lang='+language in page.url
                assert not any('.pdf' in url.lower() for url in requests), requests
                page.locator('.back-link').click()
                page.wait_for_selector('.hero')
        # 只有明确的“打开原版 PDF”按钮才新开原件。
        context.route('**/assets/resume-original.pdf', lambda route: route.fulfill(content_type='text/plain',body='PDF navigation test'))
        page.goto(BASE+'resume.html?lang=zh')
        with page.expect_popup() as popup:
            page.locator('.resume-toolbar .button-outline').click()
        popup.value.wait_for_load_state()
        assert popup.value.url==BASE+'assets/resume-original.pdf'
        popup.value.close()
        context.unroute('**/assets/resume-original.pdf')
        assert not errors, errors
        browser.close()
        # Headless-shell supports byte download validation without the native PDF viewer.
        browser = p.chromium.launch()
        page = browser.new_page(accept_downloads=True)
        expected = hashlib.sha256((ROOT/'assets/resume-original.pdf').read_bytes()).hexdigest()
        for language in ['zh','en']:
            page.goto(BASE+'resume.html?lang='+language)
            with page.expect_download() as download:
                page.locator('a[download]').click()
            actual = hashlib.sha256(Path(download.value.path()).read_bytes()).hexdigest()
            assert actual==expected
        page.set_viewport_size({'width':1440,'height':1000})
        page.goto(BASE+'resume.html?lang=zh')
        page.wait_for_function('document.querySelector(".resume-original-image").naturalWidth>0')
        page.screenshot(path=str(ROOT/'output/resume-no-auto-download.png'),full_page=True)
        browser.close()
    print('PASS: both locales, no automatic PDF requests, all preview entrypoints, explicit PDF links, responsive original preview, byte-identical downloads, no script errors')

if __name__=='__main__':
    verify()
