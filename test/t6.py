from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('dist/ag-masasi.html').resolve());G=pathlib.Path('test/ekran')
with sync_playwright() as p:
  b=p.chromium.launch();c=b.new_context(viewport={'width':1440,'height':900},locale='tr-TR');pg=c.new_page();err=[];pg.on('pageerror',lambda e:err.append(str(e)))
  pg.goto(u);pg.wait_for_timeout(2000)
  pg.evaluate("S.P=ornekGemi();S.ver++;GORUNUM.konum=null;sekmeAc('ag')");pg.wait_for_timeout(1200);pg.screenshot(path=str(G/'27-harita.png'))
  pg.evaluate("islem(()=>{P().gorsel.yerlesim='kuvvet'});GORUNUM.konum=null;ciz()");pg.wait_for_timeout(2000);pg.screenshot(path=str(G/'28-kuvvet-bayrak.png'))
  # yalnız düğümlü ağ
  pg.evaluate("""(()=>{const p=P();for(let i=0;i<10;i++)p.dugumler.push({id:'y'+i,ad:['Norveç','İsviçre','Brezilya','Arjantin','Şili','Peru','Kenya','Nijerya','Gana','Fas'][i],oz:{}});S.ver++;GORUNUM.konum=null;ciz()})()""");pg.wait_for_timeout(2000);pg.screenshot(path=str(G/'29-yalniz.png'))
  # çakışma ölçümü
  print(pg.evaluate("(()=>{const Y=GORUNUM.konum,r=AGSVG.rad;let c=0;for(let i=0;i<Y.x.length;i++)for(let j=i+1;j<Y.x.length;j++)if(Math.hypot(Y.x[i]-Y.x[j],Y.y[i]-Y.y[j])<r[i]+r[j]-0.5)c++;return c})()"),'çakışan çift',err)
  b.close()
