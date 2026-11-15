from playwright.sync_api import sync_playwright
import pathlib,json,zipfile,io,re,subprocess
u='file://'+str(pathlib.Path('dist/ag-masasi.html').resolve())
G=pathlib.Path('test/ekran');ok=[]
def kontrol(ad,k,ek=''):
  print(('TAMAM ' if k else 'HATA  ')+ad+(' '+str(ek)[:300] if ek else ''));ok.append(bool(k))
INDIR=pathlib.Path('test/indir');INDIR.mkdir(exist_ok=True)
with sync_playwright() as p:
  b=p.chromium.launch();c=b.new_context(viewport={'width':1440,'height':900},locale='tr-TR',accept_downloads=True);pg=c.new_page();err=[]
  pg.on('pageerror',lambda e:err.append(str(e)));pg.on('console',lambda m:m.type=='error' and err.append(m.text))
  pg.goto(u);pg.wait_for_timeout(1500);ev=lambda js:pg.evaluate(js)
  def indir(fn,ad):
    with pg.expect_download() as d: fn()
    yol=INDIR/ad;d.value.save_as(str(yol));return yol
  # içe aktarma: kenar listesi yapıştır
  pg.click('#sekmeler [data-sekme="veri"]');pg.wait_for_timeout(300)
  pg.click('[data-icetur="kenar"]');pg.wait_for_timeout(300)
  pg.fill('#iMetin','Kaynak\tHedef\tAğırlık\nAli\tVeli\t2\nAli\tCan\t1\nVeli\tCan\t3\nCan\tDeniz\t1\nDeniz\tEce\t1\nEce\tFatih\t2\nDeniz\tFatih\t1\nali \tVELİ\t1');pg.wait_for_timeout(500)
  kontrol('Önizleme',ev("$('#iOnizle').textContent").startswith('Okunan: 6 düğüm, 8 bağ'),ev("$('#iOnizle').textContent"))
  pg.click('#pDugmeler .btn-primary');pg.wait_for_timeout(500)
  kontrol('Kenar listesi içe aktarıldı',ev('P().dugumler.length')==6 and ev('agG().m')==7,(ev('P().dugumler.length'),ev('agG().m')))
  kontrol('Tekrar eden bağın ağırlığı toplandı',ev("agG().E.find(e=>agG().ad[e.s]==='Ali'&&agG().ad[e.t]==='Veli').w")==3)
  # özellikler
  ev("icePencere('ozellik')");pg.wait_for_timeout(300);pg.fill('#iMetin','Düğüm\tBölüm\tYaş\nAli\tA\t30\nVeli\tA\t41\nCan\tA\t35\nDeniz\tB\t28\nEce\tB\t50\nFatih\tB\t33');pg.wait_for_timeout(400)
  pg.click('#pDugmeler .btn-primary');pg.wait_for_timeout(400)
  kontrol('Özellikler: tür',ev("P().ozellikler.map(o=>o.tur).join()")=='kat,sayi',ev("P().ozellikler"))
  # matris içe aktarma yeni ilişki
  ev("icePencere('matris')");pg.wait_for_timeout(300);pg.fill('#iMetin','\tAli\tVeli\tCan\nAli\t0\t1\t0\nVeli\t0\t0\t1\nCan\t1\t0\t0');pg.wait_for_timeout(400)
  kontrol('Asimetrik matris uyarısı',ev("$('#iOnizle').textContent").find('yönlü')>=0)
  pg.click('#pDugmeler .btn-primary');pg.wait_for_timeout(400)
  kontrol('Matris yeni ilişki, yönlü',ev('P().iliskiler.length')==2 and ev('P().yonlu')==True)
  ev("islem(()=>{P().yonlu=false;P().aktif=P().iliskiler[0].id})")
  # iki modlu newman
  ev("icePencere('ikimod')");pg.wait_for_timeout(300);pg.fill('#iMetin','\tE1\tE2\tE3\nAli\t1\t1\t0\nVeli\t1\t0\t1\nCan\t1\t0\t0\nGül\t0\t1\t1');pg.wait_for_timeout(300)
  pg.select_option('#iYontem','newman');pg.wait_for_timeout(300);pg.click('#pDugmeler .btn-primary');pg.wait_for_timeout(400)
  r=ev("(()=>{const p=P(),r=p.iliskiler[2],a=new Map(p.dugumler.map(d=>[d.id,d.ad]));return r.kenarlar.map(e=>[a.get(e[0]),a.get(e[1]),+e[2].toFixed(4)])})()")
  d={tuple(sorted(x[:2])):x[2] for x in r}
  kontrol('Newman izdüşümü',abs(d[('Ali','Veli')]-0.5)<1e-9 and abs(d[('Ali','Gül')]-1)<1e-9 and abs(d[('Gül','Veli')]-1)<1e-9,r)
  # kaynakça
  ris='TY  - JOUR\nAU  - Kaya, Ali\nAU  - Demir, Ayşe\nAU  - Yıldız, B.\nTI  - X\nER  - \nTY  - JOUR\nAU  - Kaya, A.\nAU  - Demir, Ayse\nTI  - Y\nER  - \n'
  ev("icePencere('kaynakca')");pg.wait_for_timeout(300);pg.fill('#iMetin',ris);pg.wait_for_timeout(400)
  kontrol('Kaynakça önizleme',ev("$('#iOnizle').textContent").find('3 düğüm, 3 bağ')>=0,ev("$('#iOnizle').textContent"))
  pg.click('#pDugmeler .btn-primary');pg.wait_for_timeout(400)
  r=ev("(()=>{const p=P(),r=p.iliskiler[3],a=new Map(p.dugumler.map(d=>[d.id,d.ad]));return r.kenarlar.map(e=>[a.get(e[0]),a.get(e[1]),e[2]])})()")
  kontrol('Ortak yazarlık: Kaya-Demir 2 yayın',any(set(x[:2])=={'Kaya, A.','Demir, A.'} and x[2]==2 for x in r),r)
  # pajek ve gexf gidiş-dönüş
  ev("islem(()=>{P().aktif=P().iliskiler[0].id})")
  for k,uz in [('gexf','gexf'),('graphml','graphml'),('net','net'),('dl','dl')]:
    y=indir(lambda:ev(f"disaYap('{k}')"),'t.'+uz);m=y.read_text(encoding='utf-8')
    v=ev(f"(()=>{{const m={json.dumps(m)};const v=/^\\s*</.test(m)?xmlAgOku(m):/^\\s*dl/i.test(m)?dlOku(m):pajekOku(m);return [v.dugumler.length,v.kenarlar.length,v.ozellikler.length,v.kenarlar.reduce((s,e)=>s+e[2],0)]}})()")
    kontrol(f'{k} gidiş-dönüş',v[0]==10 and v[1]==(14 if k=='dl' else 7) and v[3]==(24 if k=='dl' else 12),v)
  # networkx ile GEXF ve GraphML okunabilir mi
  out=subprocess.run(['python3','-c',"import networkx as nx;g=nx.read_gexf('test/indir/t.gexf');h=nx.read_graphml('test/indir/t.graphml');p=nx.read_pajek('test/indir/t.net');print(g.number_of_nodes(),g.number_of_edges(),h.number_of_edges(),p.number_of_edges())"],capture_output=True,text=True)
  kontrol('NetworkX dosyaları okuyor',out.stdout.strip()=='10 7 7 7',out.stdout+out.stderr)
  # örnek proje ve analizler
  ev("S.P=ornekProje();S.ver++;GORUNUM.konum=null;kaydet();sekmeAc('yapi')");pg.wait_for_timeout(800)
  pg.click('#yKd');pg.wait_for_timeout(4000);kontrol('Küçük dünya',ev("agir('kd')&&agir('kd').sigma>1"),ev("agir('kd')"))
  pg.click('#yDay');pg.wait_for_timeout(3000);kontrol('Dayanıklılık',ev("!!agir('day')"),ev("agir('day')&&agir('day').R"))
  ev("sekmeAc('test')");pg.wait_for_timeout(500);pg.click('#tCalis');pg.wait_for_timeout(15000)
  q=ev("agir('qap')&&{tek:agir('qap').tek.map(x=>x.r&&[x.r.r,x.r.p]),mr:agir('qap').mr&&{b:agir('qap').mr.b,p:agir('qap').mr.p,R2:agir('qap').mr.R2}}")
  kontrol('QAP ve MRQAP',q and q['mr'] is not None,q)
  pg.screenshot(path=str(G/'04-test.png'),full_page=False)
  ev("sekmeAc('rapor')");pg.wait_for_timeout(500);pg.screenshot(path=str(G/'05-rapor.png'))
  y=indir(lambda:pg.click('#rWord'),'rapor.docx');z=zipfile.ZipFile(y)
  doc=z.read('word/document.xml').decode();kontrol('Word: resimler',len([n for n in z.namelist() if n.startswith('word/media/')])>=4,[n for n in z.namelist() if 'media' in n])
  kontrol('Word: yöntem metni ve kaynakça','Blondel' in doc and 'Krackhardt' in doc and 'Dekker' in doc)
  y=indir(lambda:pg.click('#rXlsx'),'sonuc.xlsx');import openpyxl;wb=openpyxl.load_workbook(y);kontrol('Excel sayfaları',wb.sheetnames,wb.sheetnames)
  # ağ PNG ve html
  ev("sekmeAc('ag')");pg.wait_for_timeout(800)
  y=indir(lambda:pg.click('[data-png="4110"]'),'ag.png');from PIL import Image;im=Image.open(y);kontrol('PNG 4110 px ve 600 dpi',im.size[0]==4110 and round(im.info.get('dpi',(0,))[0])==600,(im.size,im.info.get('dpi')))
  y=indir(lambda:pg.click('#gHtml'),'ag.html');kontrol('Etkileşimli HTML',y.stat().st_size>20000)
  y=indir(lambda:pg.click('#gSvg'),'ag.svg');kontrol('SVG',y.read_text().startswith('<svg'))
  # etkileşim: sürükle
  box=pg.locator('#tuval').bounding_box();n0=ev("GORUNUM.konum.x[0]")
  d=pg.locator('#tuval .d[data-i="0"]').bounding_box();pg.mouse.move(d['x']+d['width']/2,d['y']+d['height']/2);pg.mouse.down();pg.mouse.move(d['x']+60,d['y']+40,steps=5);pg.mouse.up();pg.wait_for_timeout(300)
  kontrol('Düğüm sürüklendi ve kaydedildi',ev("GORUNUM.konum.x[0]")!=n0 and ev("!!P().gorsel.konum"))
  # stiller
  for s in ['sunum','poster','koyu']:
    pg.click(f'[data-stil="{s}"]');pg.wait_for_timeout(300)
  pg.click('#gSb');pg.wait_for_timeout(300);pg.screenshot(path=str(G/'06-ag-sb.png'))
  # İngilizce
  pg.select_option('#dilSec','en');pg.wait_for_timeout(1000);ev("sekmeAc('giris')");pg.wait_for_timeout(1500);pg.screenshot(path=str(G/'07-en.png'))
  kontrol('İngilizce başlık',ev("$('#s-giris h1').textContent")=='Network analysis, in your browser.')
  ev("sekmeAc('grup')");pg.wait_for_timeout(500);kontrol('İngilizce gruplar',ev("$('#s-grup h1').textContent").startswith('Groups'))
  # koyu tema
  pg.click('#temaBtn');pg.wait_for_timeout(300);ev("sekmeAc('olcu')");pg.wait_for_timeout(500);pg.screenshot(path=str(G/'08-koyu.png'))
  # ipucu
  pg.click('#s-olcu .ipucu-btn >> nth=0');pg.wait_for_timeout(200);kontrol('İpucu açıldı',ev("!$('#ipucuKutu').classList.contains('hidden')"))
  # büyütme
  pg.click('#temaBtn');pg.select_option('#dilSec','tr');ev("sekmeAc('giris')");pg.wait_for_timeout(1200);pg.click('[data-buyut="topluluk"]');pg.wait_for_timeout(600);pg.screenshot(path=str(G/'09-buyut.png'))
  kontrol('Büyütme açık',ev("!$('#buyutme').classList.contains('hidden')"));pg.keyboard.press('Escape');pg.wait_for_timeout(500);kontrol('Büyütme kapandı',ev("$('#buyutme').classList.contains('hidden')"))
  # mobil
  m=b.new_context(viewport={'width':390,'height':844},locale='tr-TR');mp=m.new_page();mp.on('pageerror',lambda e:err.append(str(e)));mp.goto(u);mp.wait_for_timeout(1500);mp.screenshot(path=str(G/'10-mobil.png'))
  kontrol('Hata yok',not err,err[:5])
  b.close()
print(sum(ok),'/',len(ok))
