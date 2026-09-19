"""Regression for decorative CAD layers; requires the local preview on port 4173."""
from playwright.sync_api import sync_playwright
BASE='http://127.0.0.1:4173/'
def verify():
 with sync_playwright() as p:
  browser=p.chromium.launch()
  page=browser.new_page(viewport={'width':1440,'height':1000})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE+'?lang=zh')
  path=page.locator('[data-linkage]');page.wait_for_timeout(100)
  a=path.get_attribute('d');page.wait_for_timeout(180);assert a!=path.get_attribute('d')
  page.locator('.cad-motion-toggle').click();page.wait_for_timeout(40)
  a=path.get_attribute('d');page.wait_for_timeout(150);assert a==path.get_attribute('d')
  page.locator('.language-toggle').click()
  assert page.locator('.cad-background').count()==1
  assert page.locator('.cad-banner').count()==1
  assert page.locator('.cad-locator').count()==4
  assert page.locator('.cad-motion-toggle').get_attribute('aria-pressed')=='true'
  page.locator('.language-toggle').click()
  page.locator('.cad-motion-toggle').click()
  page.evaluate('window.scrollTo({top:document.querySelector("#work").getBoundingClientRect().top+window.scrollY+20,behavior:"instant"})')
  page.wait_for_timeout(150);a=path.get_attribute('d');page.wait_for_timeout(150);assert a==path.get_attribute('d'),'offscreen background still running'
  card=page.locator('.project-card').first
  card.hover();page.wait_for_timeout(380)
  assert card.evaluate('(e)=>getComputedStyle(e).transform')=='matrix(1, 0, 0, 1, 0, -3)'
  assert card.locator('img').evaluate('(e)=>getComputedStyle(e).transform')=='matrix(1.015, 0, 0, 1.015, 0, 0)'
  assert card.locator('.cad-locator').evaluate('(e)=>getComputedStyle(e).opacity')=='0.23'
  page.mouse.move(1,500);card.locator('a').focus();page.wait_for_timeout(350)
  assert card.locator('.project-image').evaluate('(e)=>getComputedStyle(e,"::before").opacity')=='0.32'
  page.emulate_media(reduced_motion='reduce');page.evaluate('window.scrollTo({top:0,behavior:"instant"})');page.wait_for_timeout(100)
  a=path.get_attribute('d');page.wait_for_timeout(150);assert a==path.get_attribute('d')
  assert not page.locator('.cad-motion-toggle').is_visible()
  assert page.locator('.cad-section').first.evaluate('(e)=>e.getAnimations({subtree:true}).length')==0
  page.emulate_media(reduced_motion='no-preference')
  for width in [320,390,768,1024,1440]:
   page.set_viewport_size({'width':width,'height':900})
   for route in ['', 'project.html?id=care','project.html?id=printer','honors.html','resume.html','aigc.html']:
    page.goto(BASE+route);page.wait_for_selector('main')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(route,width)
    if route in ['resume.html','aigc.html']:assert page.locator('.cad-background').count()==0
    elif width<=800:
     assert page.locator('.cad-locator:visible').count()==0
     assert page.locator('.cad-background').evaluate('(e)=>e.style.getPropertyValue("--cad-grid-y")')=='0px'
  assert not errors,errors
  browser.close()
 print('PASS: motion/pause/offscreen, locale cleanup, pointer/keyboard cards, reduced motion, six routes at five widths')
if __name__=='__main__':verify()
