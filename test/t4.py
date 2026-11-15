from playwright.sync_api import sync_playwright
import pathlib
u='file://'+str(pathlib.Path('dist/ag-masasi.html').resolve());G=pathlib.Path('test/ekran')
with sync_playwright() as p:
  b=p.chromium.launch();c=b.new_context(viewport={'width':1440,'height':900},locale='tr-TR');pg=c.new_page();err=[]
  pg.on('pageerror',lambda e:err.append(str(e)));pg.on('console',lambda m:m.type=='error' and err.append(m.text))
  pg.goto(u);pg.wait_for_timeout(2500)
  pg.evaluate("""(()=>{const E=[['Türkiye','Almanya',5],['Türkiye','ABD',3],['Almanya','Fransa',4],['USA','Çin',6],['Çin','Japonya',3],['Rusya','Türkiye',2],['Brezilya','ABD',2],['Hindistan','Çin',2],['Mısır','Türkiye',1],['Avustralya','Çin',3],['Nijerya','Fransa',1],['Kanada','ABD',4],['Birleşik Krallık','Almanya',2],['Güney Kore','Japonya',2],['İspanya','Fransa',2],['İtalya','Almanya',3]];
   once();S.P=bosProje();veriUygula({dugumler:[],kenarlar:E,ozellikler:[]},{hedef:'degistir',iliskiAd:'Ticaret',yonlu:true});P().gorsel.yerlesim='harita';P().gorsel.bayrak=true;P().gorsel.renk='topluluk';S.ver++;GORUNUM.konum=null;sekmeAc('ag')})()""")
  pg.wait_for_timeout(1500);pg.screenshot(path=str(G/'20-dunya.png'))
  pg.evaluate("""(()=>{const E=[['İstanbul','Ankara',5],['İzmir','İstanbul',4],['Burdur','Antalya',3],['Antalya','İstanbul',3],['06','Konya',2],['Kahramanmaraş','Gaziantep',2],['Zonguldak','Bartın',1],['Kırıkkale','Ankara',2],['Şanlıurfa','Diyarbakır',2],['Van','Erzurum',1],['Trabzon','Rize',2],['Isparta','Burdur',3]];
   S.P=bosProje();veriUygula({dugumler:[],kenarlar:E,ozellikler:[]},{hedef:'degistir',iliskiAd:'Göç',yonlu:true});Object.assign(P().gorsel,{yerlesim:'harita',renk:'topluluk'});P().gorsel.harita.tur='bolge';P().gorsel.harita.ulke='TUR';S.ver++;GORUNUM.konum=null;sekmeAc('ag')})()""")
  pg.wait_for_timeout(1500);pg.screenshot(path=str(G/'21-turkiye.png'))
  pg.evaluate("(()=>{P().gorsel.harita.tur='kita';P().gorsel.harita.kita='Europe';S.ver++;GORUNUM.konum=null;ciz()})()")
  pg.evaluate("""(()=>{const E=[['Almanya','Fransa',4],['Fransa','İspanya',2],['Almanya','Polonya',3],['İtalya','Almanya',3],['Hollanda','Belçika',2],['Türkiye','Bulgaristan',1],['İsveç','Norveç',2],['Yunanistan','İtalya',1]];
   S.P=bosProje();veriUygula({dugumler:[],kenarlar:E,ozellikler:[]},{hedef:'degistir',iliskiAd:'X',yonlu:false});Object.assign(P().gorsel,{yerlesim:'harita',bayrak:true});P().gorsel.harita.tur='kita';P().gorsel.harita.kita='Europe';S.ver++;GORUNUM.konum=null;sekmeAc('ag')})()""")
  pg.wait_for_timeout(1500);pg.screenshot(path=str(G/'22-avrupa.png'))
  print(err[:5]);b.close()
