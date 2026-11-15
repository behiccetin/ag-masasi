from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('dist/ag-masasi.html').resolve());G=pathlib.Path('test/ekran')
with sync_playwright() as p:
  b=p.chromium.launch();c=b.new_context(viewport={'width':1440,'height':900},locale='en-GB');pg=c.new_page();err=[]
  pg.on('pageerror',lambda e:err.append(str(e)))
  pg.goto(u);pg.wait_for_timeout(2000);pg.screenshot(path=str(G/'11-en-ana.png'))
  pg.evaluate("YARDIM.konu='arasindalik';sekmeAc('yardim')");pg.wait_for_timeout(600);pg.screenshot(path=str(G/'12-yardim-ara.png'))
  pg.evaluate("YARDIM.konu='yerelYapi';sekmeAc('yardim')");pg.wait_for_timeout(600);pg.screenshot(path=str(G/'13-yardim-kis.png'))
  pg.fill('#yAra','modularity');pg.wait_for_timeout(700);pg.screenshot(path=str(G/'14-yardim-ara.png'))
  print(err);b.close()
