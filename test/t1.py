from playwright.sync_api import sync_playwright
import pathlib,sys
TAM="document.querySelector('.h-screen').style.height='auto';document.querySelector('#ana').style.overflow='visible'"
GERI="document.querySelector('.h-screen').style.height='';document.querySelector('#ana').style.overflow=''"
u='file://'+str(pathlib.Path('dist/ag-masasi.html').resolve())
G=pathlib.Path('test/ekran');G.mkdir(exist_ok=True)
with sync_playwright() as p:
  b=p.chromium.launch();c=b.new_context(viewport={'width':1440,'height':900},locale='tr-TR',accept_downloads=True);pg=c.new_page();err=[]
  pg.on('pageerror',lambda e:err.append(str(e)));pg.on('console',lambda m:m.type=='error' and err.append(m.text))
  pg.goto(u);pg.wait_for_timeout(2500)
  pg.evaluate(TAM);pg.screenshot(path=str(G/'01-ana.png'),full_page=True);pg.evaluate(GERI)
  print('hatalar',err[:5])
  pg.click('[data-garac="ornek"] >> nth=0');pg.wait_for_timeout(500);pg.screenshot(path=str(G/'01b-secim.png'));pg.click('[data-orn="gemi"]');pg.wait_for_timeout(1500)
  pg.screenshot(path=str(G/'02-ag.png'))
  for s in ['veri','olcu','grup','yapi','test','rapor','yardim']:
    pg.click(f'#sekmeler [data-sekme="{s}"]');pg.wait_for_timeout(900);pg.evaluate(TAM);pg.screenshot(path=str(G/f'03-{s}.png'),full_page=True);pg.evaluate(GERI)
  print('hatalar',err[:8])
  b.close()
