/* ====================== ÖRNEK PROJE 3: Makarna tedarik zinciri (kurgusal) ======================
   Buğday üreticisinden markete beş katmanlı, yönlü ve ağırlıklı bir ağ. Ağırlık: yıllık ürün akışı (bin ton).
   Adlar ve miktarlar kurgusaldır, gerçek firmaları ya da istatistikleri göstermez; katmanlı yerleşimi denemek içindir. */
const MAKARNA={
  katman:[['Buğday üreticisi','Wheat grower'],['Un ve irmik değirmeni','Flour and semolina mill'],['Makarna fabrikası','Pasta factory'],['Dağıtıcı','Distributor'],['Perakende','Retail']],
  /* [kimlik, katman sırası, Türkçe ad, İngilizce ad, bölge] */
  dugum:[
    ['b1',0,'Konya Ovası üreticileri','Konya Plain growers','İç Anadolu'],['b2',0,'Eskişehir üreticileri','Eskişehir growers','İç Anadolu'],
    ['b3',0,'Polatlı üreticileri','Polatlı growers','İç Anadolu'],['b4',0,'Karaman üreticileri','Karaman growers','İç Anadolu'],
    ['b5',0,'Şanlıurfa üreticileri','Şanlıurfa growers','Güneydoğu'],['b6',0,'Diyarbakır üreticileri','Diyarbakır growers','Güneydoğu'],
    ['b7',0,'Trakya üreticileri','Thrace growers','Marmara'],['b8',0,'İthal durum buğdayı','Imported durum wheat','Yurt dışı'],
    ['d1',1,'Değirmen A','Mill A','İç Anadolu'],['d2',1,'Değirmen B','Mill B','İç Anadolu'],['d3',1,'Değirmen C','Mill C','Güneydoğu'],['d4',1,'Değirmen D','Mill D','Marmara'],
    ['f1',2,'Makarna fabrikası 1','Pasta factory 1','İç Anadolu'],['f2',2,'Makarna fabrikası 2','Pasta factory 2','Güneydoğu'],['f3',2,'Makarna fabrikası 3','Pasta factory 3','Marmara'],
    ['t1',3,'İç Anadolu dağıtıcısı','Central Anatolia distributor','İç Anadolu'],['t2',3,'Marmara dağıtıcısı','Marmara distributor','Marmara'],
    ['t3',3,'Ege dağıtıcısı','Aegean distributor','Ege'],['t4',3,'Akdeniz dağıtıcısı','Mediterranean distributor','Akdeniz'],['t5',3,'İhracat (liman)','Export (port)','Marmara'],
    ['m1',4,'Ulusal market zinciri A','National supermarket chain A','Türkiye'],['m2',4,'Ulusal market zinciri B','National supermarket chain B','Türkiye'],
    ['m3',4,'Bölgesel marketler','Regional supermarkets','Türkiye'],['m4',4,'Yerel bakkallar','Local grocers','Türkiye'],
    ['m5',4,'Toplu tüketim (yemekhaneler)','Catering (canteens)','Türkiye'],['m6',4,'Yurt dışı alıcılar','Foreign buyers','Yurt dışı']],
  /* [kaynak, hedef, bin ton] */
  bag:[['b1','d1',120],['b1','d2',60],['b2','d2',70],['b2','d1',25],['b3','d1',55],['b3','d4',20],['b4','d2',45],['b5','d3',90],['b6','d3',65],['b6','d2',15],['b7','d4',50],['b8','d4',80],['b8','d3',30],
    ['d1','f1',150],['d2','f1',80],['d2','f2',30],['d3','f2',140],['d4','f3',130],['d4','f1',20],
    ['f1','t1',80],['f1','t3',50],['f1','t5',60],['f2','t4',60],['f2','t1',30],['f2','t5',70],['f3','t2',90],['f3','t3',30],['f3','t5',25],
    ['t1','m1',35],['t1','m3',30],['t1','m5',25],['t2','m1',30],['t2','m2',35],['t2','m4',20],['t3','m2',30],['t3','m3',25],['t3','m4',15],['t4','m1',20],['t4','m3',25],['t4','m5',15],['t5','m6',150]]};
function ornekMakarna(){const p=bosProje();const k=S.dil==='tr'?0:1;p.ad=t('sample3Name');p.yonlu=true;p.agirlikli=true;
  p.ozellikler=[{k:'asama',ad:t('sample3AttrStage'),tur:'kat'},{k:'bolge',ad:t('sample3AttrRegion'),tur:'kat'}];
  const bolge=v=>S.dil==='tr'?v:({'İç Anadolu':'Central Anatolia','Güneydoğu':'Southeast','Marmara':'Marmara','Ege':'Aegean','Akdeniz':'Mediterranean','Yurt dışı':'Abroad','Türkiye':'Türkiye'}[v]||v);
  p.dugumler=MAKARNA.dugum.map(([id,ks,tr,en,b])=>({id,ad:k?en:tr,oz:{asama:MAKARNA.katman[ks][k],bolge:bolge(b)}}));
  p.iliskiler=[{id:'akis',ad:t('sample3Rel'),kenarlar:MAKARNA.bag.map(e=>e.slice())}];p.aktif='akis';
  p.gorsel={...GORSEL_VARSAYILAN,yerlesim:'katman',katman:{oz:'asama',sira:MAKARNA.katman.map(x=>x[k]),yon:'yatay'},renk:'oz:asama',boyut:'guc',alan:false,gad:false,egri:true,ok:true,etiket:40};
  p.ei.oz='asama';p.not=t('sample3Note');return p}
/* ---------- içe aktarma için örnek dosyalar (İçe aktar penceresi) ----------
   tur: 'kenar' (bağ listesi: Kaynak, Hedef, Ağırlık) ya da 'ozellik' (düğüm özellikleri: Düğüm, Aşama, Bölge); bicim: 'csv' ya da 'xlsx'.
   CSV, Türkçe Excel'in doğrudan açabilmesi için noktalı virgülle ayrılır ve UTF-8 BOM ile başlar. */
function makarnaSatirlar(tur){const k=S.dil==='tr'?0:1;const ad=new Map(MAKARNA.dugum.map(d=>[d[0],k?d[3]:d[2]]));
  if(tur==='kenar')return [[t('colSource'),t('colTarget'),t('colWeightT')],...MAKARNA.bag.map(([a,b,w])=>[ad.get(a),ad.get(b),w])];
  const P_=ornekMakarna();return [[t('colNode'),t('sample3AttrStage'),t('sample3AttrRegion')],...P_.dugumler.map(d=>[d.ad,d.oz.asama,d.oz.bolge])]}
function ornekDosyaIndir(tur,bicim){const L=makarnaSatirlar(tur);const ad=t(tur==='kenar'?'sampleFileEdges':'sampleFileAttrs');
  if(bicim==='xlsx')indir(ad+'.xlsx',xlsxYap([{ad:t(tur==='kenar'?'sheetEdges':'sheetAttrs'),satirlar:[{h:L[0],kalin:true},...L.slice(1)]}]));
  else{const h=v=>{const s=String(v);return /[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};indir(ad+'.csv',new Blob(['﻿'+L.map(r=>r.map(h).join(';')).join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8'}))}
  tost(t('downloaded'))}
