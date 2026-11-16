/* ====================== OTURUM DOSYASI (.agm) ======================
   Ağ Masası oturum dosyası: proje verisinin yanında çalışma ortamını da saklar, dosya yeniden açılınca kalınan yerden sürülür.
   İçerik düz JSON'dur: {tur:'ag-masasi-oturum', bicim, surum, kayit, proje, arayuz, sonuclar, gecmis}.
   arayuz: açık sekme, yakınlaştırma ve kaydırma, seçili düğüm, arama, sekme ayarları (ölçüler, gruplar, testler, yardım, veri araması).
   sonuclar: düğmeyle hesaplanan ağır sonuçlar (küçük dünya, dayanıklılık, QAP, testler); yeniden hesaplamak gerekmez.
   gecmis: son 30 geri alma adımı. Eski proje dosyaları (.ag.json, tur:'ag-masasi') da açılır. */
const AGM_UZANTI='.agm',AGM_BICIM=1,AGM_GECMIS=30;
/* JSON'un taşıyamadığı değerler: Float64Array gibi diziler, NaN ve sonsuz */
function agmKodla(v){if(typeof v==='number'&&!isFinite(v))return {__agm:'n',v:String(v)};if(ArrayBuffer.isView(v)&&!(v instanceof DataView))return {__agm:'ta',t:v.constructor.name,v:Array.from(v,agmKodla)};
  if(v instanceof Map||v instanceof Set||typeof v==='function')throw new Error('agm');if(Array.isArray(v))return v.map(agmKodla);if(v&&typeof v==='object'){const o={};for(const [k,x] of Object.entries(v))o[k]=agmKodla(x);return o}return v}
const AGM_DIZI={Float64Array,Float32Array,Int32Array,Uint32Array,Int16Array,Uint16Array,Int8Array,Uint8Array};
function agmCoz(v){if(Array.isArray(v))return v.map(agmCoz);if(v&&typeof v==='object'){if(v.__agm==='n')return Number(v.v);if(v.__agm==='ta'&&AGM_DIZI[v.t])return AGM_DIZI[v.t].from(v.v.map(agmCoz));const o={};for(const [k,x] of Object.entries(v))o[k]=agmCoz(x);return o}return v}
function oturumVerisi(){const G=agG(),i=GORUNUM.secili;const son={};for(const [k,a] of Object.entries(AGIR)){if(!a||a.ver!==S.ver)continue;try{son[k]=agmKodla(a.v)}catch(e){}}
  return {tur:'ag-masasi-oturum',bicim:AGM_BICIM,uygulama:'Ağ Masası',surum:SURUM,kayit:new Date().toISOString(),proje:P(),
    arayuz:{sekme:S.sekme,donusum:{...GORUNUM.donusum},secili:i!=null&&G&&i<G.n?G.ids[i]:null,arama:GORUNUM.arama||'',dugumPanel:{...DUGUM_PANEL},
      olcu:{...OLCU_GORUNUM},grup:{...GRUP_GORUNUM},test:JSON.parse(JSON.stringify(TA)),yardim:{...YARDIM},veri:{...VERI}},
    sonuclar:son,gecmis:GECMIS.geri.slice(-AGM_GECMIS)}}
function oturumKaydet(){let m;try{m=JSON.stringify(oturumVerisi())}catch(e){console.error(e);m=JSON.stringify({tur:'ag-masasi-oturum',bicim:AGM_BICIM,surum:SURUM,kayit:new Date().toISOString(),proje:P(),arayuz:{sekme:S.sekme}})}
  indir(dosyaAd(P().ad)+AGM_UZANTI,new Blob([m],{type:'application/octet-stream'}));tost(t('sessionSaved',dosyaAd(P().ad)+AGM_UZANTI))}
const ata=(hedef,kaynak)=>{if(kaynak&&typeof kaynak==='object')for(const k of Object.keys(hedef))if(k in kaynak&&(hedef[k]==null||kaynak[k]==null?typeof kaynak[k]!=='object'||kaynak[k]===null:typeof kaynak[k]===typeof hedef[k]))hedef[k]=kaynak[k]};
/* metin: dosyanın içeriği. Başarılıysa true döner. */
function oturumYukle(metin){let j;try{j=JSON.parse(metin)}catch(e){return false}if(!j||typeof j!=='object')return false;
  if(j.tur==='ag-masasi'){/* eski proje dosyası: yalnız veri */once();S.P=projeDuzelt(j);S.ver++;GORUNUM.konum=null;GORUNUM.secili=null;kaydet();sekmeAc(P().dugumler.length?'ag':'veri');return true}
  if(j.tur!=='ag-masasi-oturum'||!j.proje||j.proje.tur!=='ag-masasi')return false;
  const a=j.arayuz||{};
  S.P=projeDuzelt(j.proje);S.ver++;GORUNUM.konum=null;GORUNUM.secili=null;
  GECMIS.geri=(Array.isArray(j.gecmis)?j.gecmis:[]).filter(x=>typeof x==='string').slice(-AGM_GECMIS);GECMIS.ileri=[];
  const d=a.donusum;if(d&&[d.k,d.x,d.y].every(x=>typeof x==='number'&&isFinite(x)))GORUNUM.donusum={k:Math.min(8,Math.max(.4,d.k)),x:d.x,y:d.y};else GORUNUM.donusum={k:1,x:0,y:0};
  GORUNUM.arama=typeof a.arama==='string'?a.arama:'';
  ata(DUGUM_PANEL,a.dugumPanel);ata(OLCU_GORUNUM,a.olcu);ata(GRUP_GORUNUM,a.grup);ata(YARDIM,a.yardim);ata(VERI,a.veri);
  if(a.test&&typeof a.test==='object')for(const k of Object.keys(TA))ata(TA[k],a.test[k]);
  for(const k of Object.keys(AGIR))delete AGIR[k];if(j.sonuclar&&typeof j.sonuclar==='object')for(const [k,v] of Object.entries(j.sonuclar)){try{AGIR[k]={ver:S.ver,v:agmCoz(v)}}catch(e){}}
  const G=agG();if(a.secili!=null&&G){const i=G.ids.indexOf(String(a.secili));if(i>=0)GORUNUM.secili=i}
  kaydet();gecmisDugme();
  const sk=['giris','veri','ag','olcu','grup','yapi','test','rapor','yardim'].includes(a.sekme)?a.sekme:(P().dugumler.length?'ag':'veri');sekmeAc(sk);return true}
async function oturumAc(dosya){const f=dosya||await dosyaOku(AGM_UZANTI+',.json,application/json');if(!f)return;
  if(P().dugumler.length&&!(await sor(t('openSessionQ',P().ad),t('openProject'))))return;
  let ok=false;try{ok=oturumYukle(await f.text())}catch(e){console.error(e);ok=false}tost(ok?t('sessionLoaded',f.name):t('badProject'),ok?'success':'error')}
/* Ctrl+S (Mac'te Cmd+S): kaydet. Pencereye .agm bırakmak: aç. */
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&!e.altKey&&e.key.toLowerCase()==='s'){e.preventDefault();oturumKaydet()}});
addEventListener('drop',e=>{const f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];if(!f||!/\.agm$|\.ag\.json$/i.test(f.name))return;if(e.target.closest&&e.target.closest('#pencere'))return;e.preventDefault();oturumAc(f)});
