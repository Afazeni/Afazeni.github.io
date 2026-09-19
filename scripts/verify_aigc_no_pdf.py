from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch();page=b.new_page();requests=[]
 page.on('request',lambda r:requests.append(r.url) if '.pdf' in r.url else None)
 page.goto('http://127.0.0.1:4173/aigc.html?lang=zh');page.wait_for_timeout(1500)
 assert not requests, f'Unexpected automatic PDF requests: {requests[:3]}'
 b.close()
