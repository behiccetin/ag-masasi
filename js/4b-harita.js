/* ====================== HARİTA VE BAYRAKLAR ======================
   Gömülü veri: Natural Earth (kamu malı) 1:50m ülkeler ve 1:10m birinci düzey idari bölümler; bayraklar flag-icons (MIT).
   Veri sıkıştırılmış (gzip, base64) gömülür ve açılışta tarayıcının DecompressionStream arayüzüyle açılır. */
const COG={d:null,b:null,ix:null,bayrakUri:{}};
async function gzAc(b64){const bayt=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));const s=new Blob([bayt]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(s).text())}
async function cografyaYukle(){if(COG.d)return;try{COG.d=await gzAc(GOMULU_COGRAFYA);COG.b=await gzAc(GOMULU_BAYRAK);ulkeDizini()}catch(e){console.error(e);COG.d=null}}
const yerKatla=s=>katla(String(s??'')).normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'');
/* Türkçe ve İngilizce yaygın ülke adları ile Comtrade adları için ek eşlemeler */
const ULKE_EK={KNA:['stkittsnevis','saintkittsandnevis','stkittsandnevis'],ATG:['antiguabarbuda','antiguaandbarbuda'],USA:['abd','amerika','amerikabirlesikdevletleri','usa','us','unitedstatesofamerica'],GBR:['ingiltere','birlesikkrallik','uk','unitedkingdom','greatbritain'],RUS:['rusya','russianfederation'],KOR:['koreasouth','southkorea','guneykore','republicofkorea','repofkorea','korearep'],
  PRK:['kuzeykore','dempeoplesrepofkorea'],CHN:['cin','china'],HKG:['hongkong','chinahongkongsar'],TWN:['tayvan','otherasianes'],NLD:['hollanda','netherlands'],CZE:['cekya','cekcumhuriyeti','czechia','czechrep'],TUR:['turkiye','turkey','turkiyecumhuriyeti'],
  IRN:['iran'],VNM:['vietnam','vietnamviet','vietnam'],SYR:['suriye','syria'],LAO:['laos'],BOL:['bolivya'],VEN:['venezuela'],TZA:['tanzanya','unitedreptanzania'],MDA:['moldova','repofmoldova'],MKD:['kuzeymakedonya','makedonya','northmacedonia'],
  BIH:['bosnahersek','bosniaherzegovina'],CIV:['fildisisahili','cotedivoire'],COD:['demokratikkongocumhuriyeti','demrepofthecongo'],COG:['kongo','congo'],ARE:['bae','birlesikaraplemirlikleri','unitedarabemirates'],SAU:['suudiarabistan'],
  DEU:['almanya'],FRA:['fransa'],ITA:['italya'],ESP:['ispanya'],BEL:['belcika'],POL:['polonya'],ROU:['romanya'],BGR:['bulgaristan'],GRC:['yunanistan'],UKR:['ukrayna'],IND:['hindistan'],JPN:['japonya'],EGY:['misir'],MAR:['fas'],DZA:['cezayir'],
  TUN:['tunus'],LBY:['libya'],AZE:['azerbaycan'],GEO:['gurcistan'],KAZ:['kazakistan'],UZB:['ozbekistan'],TKM:['turkmenistan'],KGZ:['kirgizistan'],SWE:['isvec'],NOR:['norvec'],FIN:['finlandiya'],DNK:['danimarka'],CHE:['isvicre'],AUT:['avusturya'],
  HUN:['macaristan'],PRT:['portekiz'],IRL:['irlanda','irishrepublic'],CAN:['kanada'],MEX:['meksika'],BRA:['brezilya'],ARG:['arjantin'],AUS:['avustralya'],NZL:['yenizelanda'],ZAF:['guneyafrika'],IDN:['endonezya'],MYS:['malezya'],THA:['tayland'],PAK:['pakistan'],
  BGD:['banglades'],SGP:['singapur'],PHL:['filipinler'],ISR:['israil'],IRQ:['irak'],JOR:['urdun'],LBN:['lubnan'],KWT:['kuveyt'],QAT:['katar'],OMN:['umman'],YEM:['yemen'],SRB:['sirbistan'],HRV:['hirvatistan'],SVN:['slovenya'],SVK:['slovakya'],
  LTU:['litvanya'],LVA:['letonya'],EST:['estonya'],BLR:['belarus','beyazrusya'],ALB:['arnavutluk'],CYP:['kibris','guneykibris'],KOS:['kosova'],MNE:['karadag'],LUX:['luksemburg'],ISL:['izlanda'],DOM:['dominikcumhuriyeti','dominicanrep'],CAF:['ortaafrikacumhuriyeti','centralafricanrep']};
function ulkeDizini(){const m=new Map();const ekle=(k,a3)=>{const x=yerKatla(k);if(x&&!m.has(x))m.set(x,a3)};
  for(const u of COG.d.dunya){ekle(u.a3,u.a3);ekle(u.a2,u.a3);ekle(u.en,u.a3);ekle(u.tr,u.a3);u.alt.forEach(a=>ekle(a,u.a3))}
  for(const [a3,L] of Object.entries(ULKE_EK))L.forEach(a=>ekle(a,a3));COG.ix=m;COG.ulke=new Map();for(const u of COG.d.dunya)if(!COG.ulke.has(u.a3))COG.ulke.set(u.a3,u)}
const ulkeBul=ad=>COG.ix?COG.ix.get(yerKatla(ad))||null:null;
const KITALAR=['Africa','Asia','Europe','North America','South America','Oceania'];
/* ülkeler: bölge verisi olanlar, Türkçe ada göre sıralı */
function bolgeUlkeleri(){if(!COG.d)return [];return Object.keys(COG.d.bolge).map(a3=>{const u=COG.ulke.get(a3);return {a3,ad:u?(S.dil==='tr'?u.tr:u.en):a3,n:COG.d.bolge[a3].length}}).sort((a,b)=>a.ad.localeCompare(b.ad,S.dil))}
function bolgeDizini(a3){const L=COG.d.bolge[a3]||[];const m=new Map();const ekle=(k,i)=>{const x=yerKatla(k);if(x&&!m.has(x))m.set(x,i)};
  L.forEach((b,i)=>{ekle(b.n,i);b.alt.forEach(a=>ekle(a,i));if(b.c){ekle(b.c,i);const p=b.c.split('-')[1];if(p){ekle(p,i);if(/^\d+$/.test(p))ekle(String(+p),i)}}});return m}
/* çokgen çözme: göreli tam sayılar -> derece */
function cozHalka(L,q){const o=[];let x=0,y=0;for(let i=0;i<L.length;i+=2){x+=L[i];y+=L[i+1];o.push([x*q,y*q])}return o}
/* Equal Earth izdüşümü (Šavrič, Patterson ve Jenny, 2019) */
const EE=(()=>{const A1=1.340264,A2=-0.081106,A3=0.000893,A4=0.003796,M=Math.sqrt(3)/2;return (lon,lat)=>{const l=lon*Math.PI/180,p=Math.asin(M*Math.sin(lat*Math.PI/180)),p2=p*p,p6=p2*p2*p2;
  return [l*Math.cos(p)/(M*(A1+3*A2*p2+p6*(7*A3+9*A4*p2))),p*(A1+A2*p2+p6*(A3+A4*p2))]}})();
function izdusumYap(tur,kutu){/* kutu: [lon0,lat0,lon1,lat1] */if(tur==='esit')return EE;const c=Math.cos(((kutu[1]+kutu[3])/2)*Math.PI/180);return (lon,lat)=>[lon*Math.PI/180*c,lat*Math.PI/180]}
/* harita katmanı: verilen çokgenler ve izdüşümle, alana sığdırılmış SVG yolu ve nokta dönüştürücü */
function haritaKatmani(cokgenler,izd,alan,kutuNok){let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;const P=cokgenler.map(h=>h.map(([lo,la])=>{const [x,y]=izd(lo,la);return [x,-y]}));
  const kap=kutuNok&&kutuNok.length?kutuNok.map(([lo,la])=>{const [x,y]=izd(lo,la);return [x,-y]}):P.flat();for(const [x,y] of kap){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  const k=Math.min((alan.x1-alan.x0)/(x1-x0||1),(alan.y1-alan.y0)/(y1-y0||1));const ox=(alan.x0+alan.x1)/2-(x0+x1)/2*k,oy=(alan.y0+alan.y1)/2-(y0+y1)/2*k;
  const don=(lo,la)=>{const [x,y]=izd(lo,la);return [x*k+ox,-y*k+oy]};const yol=P.map(h=>'M'+h.map(([x,y])=>(x*k+ox).toFixed(1)+','+(y*k+oy).toFixed(1)).join('L')+'Z').join('');return {yol,don}}
/* düğümleri haritaya yerleştir: dönüş {x,y,eslesen:[bool], katman:svg yolu, eksik:[ad]} */
function haritaYerlesim(G,h,alan){const p=P();const ad=i=>h.eslesme&&h.eslesme!=='ad'?(p.dugumler[i].oz[h.eslesme.slice(3)]??''):G.ad[i];const n=G.n;const nok=new Array(n).fill(null);let cok=[],kutuNok=[],izd;
  if(h.tur==='koord'){const la=p.dugumler.map(d=>sayiOku(d.oz[(h.enlem||'').slice(3)])),lo=p.dugumler.map(d=>sayiOku(d.oz[(h.boylam||'').slice(3)]));
    for(let i=0;i<n;i++)if(la[i]!=null&&lo[i]!=null&&Math.abs(la[i])<=90&&Math.abs(lo[i])<=180)nok[i]=[lo[i],la[i]];
    const V=nok.filter(Boolean);if(V.length){const b=[Math.min(...V.map(x=>x[0])),Math.min(...V.map(x=>x[1])),Math.max(...V.map(x=>x[0])),Math.max(...V.map(x=>x[1]))];const pay=Math.max(.05,(b[2]-b[0])*.08,(b[3]-b[1])*.08);
      kutuNok=[[b[0]-pay,b[1]-pay],[b[2]+pay,b[3]+pay]];izd=izdusumYap(b[2]-b[0]>60?'esit':'yerel',b);const q=COG.d.q.d;
      cok=COG.d.dunya.flatMap(u=>u.g.map(L=>cozHalka(L,q))).filter(H=>H.some(([x,y])=>x>=kutuNok[0][0]-20&&x<=kutuNok[1][0]+20&&y>=kutuNok[0][1]-20&&y<=kutuNok[1][1]+20))}}
  else if(h.tur==='dunya'||h.tur==='kita'){const q=COG.d.q.d;const U=COG.d.dunya.filter(u=>h.tur==='dunya'?u.a3!=='ATA':u.k===h.kita);izd=izdusumYap(h.tur==='dunya'?'esit':'yerel',[-180,-60,180,85]);
    for(let i=0;i<n;i++){const a3=ulkeBul(ad(i));const u=a3&&COG.ulke.get(a3);if(u)nok[i]=[u.x,u.y]}
    cok=(h.tur==='dunya'?COG.d.dunya.filter(u=>u.a3!=='ATA'):COG.d.dunya).flatMap(u=>u.g.map(L=>cozHalka(L,q)));
    if(h.tur==='kita'){const ic=U.flatMap(u=>u.g.map(L=>cozHalka(L,q)));const Lo=ic.flat();const b=[Math.min(...Lo.map(x=>x[0])),Math.min(...Lo.map(x=>x[1])),Math.max(...Lo.map(x=>x[0])),Math.max(...Lo.map(x=>x[1]))];
      /* Avrupa: uzak denizaşırı topraklar kutuyu bozmasın */if(h.kita==='Europe'){b[0]=Math.max(b[0],-25);b[2]=Math.min(b[2],45);b[1]=Math.max(b[1],34);b[3]=Math.min(b[3],71.5)}if(h.kita==='Asia'){b[0]=Math.max(b[0],25);b[3]=Math.min(b[3],78)}if(h.kita==='Oceania'){b[0]=Math.max(b[0],110);b[2]=Math.min(b[2],180)}if(h.kita==='North America'){b[1]=Math.max(b[1],7)}
      kutuNok=[[b[0],b[1]],[b[2],b[3]]];izd=izdusumYap('yerel',b);cok=cok.filter(H=>H.some(([x,y])=>x>=b[0]-15&&x<=b[2]+15&&y>=b[1]-15&&y<=b[3]+15))}
    else kutuNok=[[-170,-58],[180,83],[-180,0],[180,0],[-170,30],[180,30]]}
  else if(h.tur==='bolge'){const L=COG.d.bolge[h.ulke]||[];const q=COG.d.q.b;const ix=bolgeDizini(h.ulke);for(let i=0;i<n;i++){const k=ix.get(yerKatla(ad(i)));if(k!=null)nok[i]=[L[k].x,L[k].y]}
    cok=L.flatMap(b=>b.g.map(R=>cozHalka(R,q)));const Lo=cok.flat();const b=[Math.min(...Lo.map(x=>x[0])),Math.min(...Lo.map(x=>x[1])),Math.max(...Lo.map(x=>x[0])),Math.max(...Lo.map(x=>x[1]))];
    if(h.ulke==='USA'){b[0]=Math.max(b[0],-125);b[1]=Math.max(b[1],24)}if(h.ulke==='RUS')b[0]=Math.max(b[0],19);if(h.ulke==='FRA'){b[0]=Math.max(b[0],-6);b[1]=Math.max(b[1],41)}if(h.ulke==='NLD'||h.ulke==='NOR'||h.ulke==='ESP'||h.ulke==='PRT'){b[1]=Math.max(b[1],h.ulke==='ESP'?35.5:h.ulke==='PRT'?36.5:h.ulke==='NOR'?57:50.5)}
    kutuNok=[[b[0],b[1]],[b[2],b[3]]];izd=izdusumYap('yerel',b);cok=cok.filter(H=>H.some(([x,y])=>x>=b[0]-2&&x<=b[2]+2&&y>=b[1]-2&&y<=b[3]+2))}
  else if(h.tur==='ozel'&&h.geo){const F=ozelOzellikler(h.geo);const alanAd=h.geoAlan||ozelAlanBul(F,G,ad);const ix=new Map();F.forEach((f,k)=>{const x=yerKatla(f.p[alanAd]);if(x&&!ix.has(x))ix.set(x,k)});
    for(let i=0;i<n;i++){const k=ix.get(yerKatla(ad(i)));if(k!=null)nok[i]=F[k].m}cok=F.flatMap(f=>f.h);const Lo=cok.flat();const b=[Math.min(...Lo.map(x=>x[0])),Math.min(...Lo.map(x=>x[1])),Math.max(...Lo.map(x=>x[0])),Math.max(...Lo.map(x=>x[1]))];kutuNok=[[b[0],b[1]],[b[2],b[3]]];izd=izdusumYap('yerel',b)}
  if(!izd)return null;const K=haritaKatmani(cok,izd,alan,kutuNok);const x=new Array(n),y=new Array(n),eksik=[];let ek=0;
  for(let i=0;i<n;i++){if(nok[i]){const [a,b]=K.don(nok[i][0],nok[i][1]);x[i]=a;y[i]=b}else{eksik.push(i);x[i]=alan.x0+8+(ek%14)*14;y[i]=alan.y1-4-Math.floor(ek/14)*14;ek++}}
  /* aynı noktadaki düğümleri biraz aç */const gor=new Map();for(let i=0;i<n;i++){if(!nok[i])continue;const k=Math.round(x[i])+','+Math.round(y[i]);const c=gor.get(k)||0;if(c){const a=c*2.4;x[i]+=Math.cos(a)*6*Math.sqrt(c);y[i]+=Math.sin(a)*6*Math.sqrt(c)}gor.set(k,c+1)}
  return {x,y,kesisim:bagKesisim({x,y},G.E),katman:K.yol,eksik,harita:true}}
/* kullanıcının GeoJSON'u: çokgenler ve ağırlık merkezleri */
function ozelOzellikler(geo){if(geo._oz)return geo._oz;const o=[];for(const f of geo.features||[]){const g=f.geometry;if(!g)continue;let H=[];if(g.type==='Polygon')H=[g.coordinates[0]];else if(g.type==='MultiPolygon')H=g.coordinates.map(p=>p[0]);else if(g.type==='Point'){o.push({p:f.properties||{},h:[],m:g.coordinates});continue}
    let A=0,cx=0,cy=0;for(const R of H)for(let i=0,j=R.length-1;i<R.length;j=i++){const c=R[j][0]*R[i][1]-R[i][0]*R[j][1];A+=c;cx+=(R[j][0]+R[i][0])*c;cy+=(R[j][1]+R[i][1])*c}const m=A?[cx/(3*A),cy/(3*A)]:H[0][0];o.push({p:f.properties||{},h:H,m})}
  Object.defineProperty(geo,'_oz',{value:o,enumerable:false});return o}
function ozelAlanBul(F,G,ad){const adlar=new Set(G.ad.map((_,i)=>yerKatla(ad(i))));let en=null,es=-1;const anah=[...new Set(F.flatMap(f=>Object.keys(f.p)))];for(const k of anah){const s=F.filter(f=>adlar.has(yerKatla(f.p[k]))).length;if(s>es){es=s;en=k}}return en}
/* bayrak: düğüm adı ya da seçilen özellik bir ülkeye karşılık geliyorsa veri URI'si */
function bayrakUri(a3){if(!COG.b||!a3)return null;if(a3 in COG.bayrakUri)return COG.bayrakUri[a3];const u=COG.ulke.get(a3);const a2=(u&&u.a2||'').toLowerCase();const s=COG.b[a2]||(a3==='KOS'?COG.b.xk:null);
  const v=s?(s.startsWith('data:')?s:'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(s)))):null;COG.bayrakUri[a3]=v;return v}
function bayraklar(G,eslesme){const p=P();return G.ad.map((a,i)=>bayrakUri(ulkeBul(eslesme&&eslesme!=='ad'?p.dugumler[i].oz[eslesme.slice(3)]:a)))}
