from playwright.sync_api import sync_playwright
import pathlib,zipfile
u='file://'+str(pathlib.Path('dist/ag-masasi.html').resolve());G=pathlib.Path('test/ekran');I=pathlib.Path('test/indir');ok=[]
def k(ad,x,ek=''):print(('TAMAM ' if x else 'HATA  ')+ad+(' '+str(ek)[:200] if ek else ''));ok.append(bool(x))
with sync_playwright() as p:
  b=p.chromium.launch();c=b.new_context(viewport={'width':1440,'height':900},locale='tr-TR',accept_downloads=True);pg=c.new_page();err=[]
  pg.on('pageerror',lambda e:err.append(str(e)));pg.on('console',lambda m:m.type=='error' and err.append(m.text))
  pg.goto(u);pg.wait_for_timeout(2000);ev=pg.evaluate
  pg.click('[data-garac="ornek"] >> nth=0');pg.wait_for_timeout(300);pg.click('[data-orn="gemi"]');pg.wait_for_timeout(1500)
  k('Gemi: düğüm ve 2023 bağları',ev('P().dugumler.length')==ev("new Set(Object.values(GEMI).flat().flatMap(e=>[e[0],e[1]])).size") and ev('agG().m')==ev("GEMI['2023'].filter(e=>e[0]!==e[1]).length"),[ev('P().dugumler.length'),ev('agG().m')])
  k('Bilinmeyen düğümü dışında bütün ülkeler haritada',ev('GORUNUM.konum.eksik.length')==1,ev('GORUNUM.konum.eksik'))
  k('Bayraklar çizildi',ev("document.querySelectorAll('#tuval image').length")>=40)
  with pg.expect_download() as d: pg.click('[data-png="2008"]')
  d.value.save_as(str(I/'harita.png'));from PIL import Image;im=Image.open(I/'harita.png');k('Harita PNG',im.size[0]==2008)
  # PNG içinde bayrak var mı (renkli piksel sayısı)
  px=im.convert('RGB').resize((400,267));red=sum(1 for p_ in px.getdata() if p_[0]>200 and p_[1]<60 and p_[2]<60);k('PNG bayrak renkleri',red>20,red)
  ev("sekmeAc('veri')");pg.wait_for_timeout(600);pg.evaluate("document.querySelector('.h-screen').style.height='auto';document.querySelector('#ana').style.overflow='visible'");pg.screenshot(path=str(G/'25-kaynak.png'),full_page=True);pg.evaluate("document.querySelector('.h-screen').style.height='';document.querySelector('#ana').style.overflow=''")
  k('Kaynak kutusu ve atıf',ev("$('#s-veri').textContent.includes('10.1504/IJSTL.2026.151953')"))
  ev("sekmeAc('ag')");pg.wait_for_timeout(800);pg.screenshot(path=str(G/'26-dunya.png'))
  # topluluk adı
  ev("sekmeAc('grup')");pg.wait_for_timeout(500);pg.fill('[data-tad="0"]','Avrupa çekirdeği');pg.press('[data-tad="0"]','Enter');pg.wait_for_timeout(400)
  k('Topluluk adı kaydedildi',ev('toplulukAd(0)')=='Avrupa çekirdeği')
  ev("islem(()=>{P().topluluk.tekrar=31})");pg.wait_for_timeout(400);k('Yeniden hesapta ad korunuyor',ev("toplulukAdlari().includes('Avrupa çekirdeği')"))
  ev("islem(()=>{P().gorsel.renk='topluluk'})");ev("sekmeAc('ag')");pg.wait_for_timeout(800);k('Açıklamada yeni ad',ev("$('#tuval svg').textContent.includes('Avrupa çekirdeği')"))
  # kısaltma
  ev("sekmeAc('test')");pg.wait_for_timeout(600);a=pg.locator('#s-test abbr.kisa').first;k('QAP kısaltması işaretli',pg.locator('abbr.kisa').count()>0)
  a.hover();pg.wait_for_timeout(300);k('Üzerine gelince tanım',ev("!$('#ipucuKutu').classList.contains('hidden')&&$('#ipucuKutu').textContent.includes('Karesel atama')"),ev("$('#ipucuKutu').textContent"))
  pg.screenshot(path=str(G/'23-kisaltma.png'))
  # rapor
  ev("sekmeAc('rapor')");pg.wait_for_timeout(500);k('Yöntem metninde NGO',ev("$('#s-rapor').textContent.includes('NGO Shipbreaking')") and ev("$('#s-rapor').textContent.includes('Filiz')"))
  with pg.expect_download() as d: pg.click('#rWord')
  d.value.save_as(str(I/'gemi.docx'));z=zipfile.ZipFile(I/'gemi.docx');k('Word harita resmi',any('ag.png' in n for n in z.namelist()))
  # Türkiye bölgeleri ve İngilizce
  pg.select_option('#dilSec','en');pg.wait_for_timeout(500);ev("sekmeAc('giris')");pg.wait_for_timeout(1500);pg.screenshot(path=str(G/'24-en-ana.png'))
  k('Hata yok',not err,err[:4]);b.close()
print(sum(ok),'/',len(ok))
