/* ====================== ANALİZ KATMANI ======================
   Hesaplar istendikçe yapılır ve proje sürümü (S.ver) değişene kadar saklanır. Ağır işler (küçük dünya, dayanıklılık, QAP) yalnız düğmeyle başlar. */
const OB={ver:-1,d:{}};
function ob(anahtar,fn){if(OB.ver!==S.ver){OB.ver=S.ver;OB.d={}}if(!(anahtar in OB.d))OB.d[anahtar]=fn();return OB.d[anahtar]}
const agG=()=>ob('G',()=>{const p=P();return p.aktif?agKur(p):null});
const agOlc=()=>ob('olc',()=>{const G=agG();return G&&G.n?olcumler(G,{yolAgirlik:P().yolAgirlik}):null});
const agTop=()=>ob('top',()=>{const G=agG();if(!G||!G.m)return null;const o=P().topluluk;return toplulukBul(G,{gamma:o.cozunurluk,tekrar:o.tekrar,yontem:o.yontem})});
const agCp=()=>ob('cp',()=>{const G=agG();return G?cekirdekCevre(G,{cpYoksay:P().cekirdek.cpYoksay}):null});
const agEi=k=>ob('ei:'+k,()=>{const G=agG(),p=P();if(!G||!k)return null;return eiEndeksi(G,p.dugumler.map(d=>d.oz[k]??null))});
const agUyum=k=>ob('uy:'+k,()=>{const G=agG(),p=P();if(!G||!k)return null;const o=p.ozellikler.find(x=>x.k===k);if(!o)return null;const v=p.dugumler.map(d=>o.tur==='sayi'?sayiOku(d.oz[k]):(d.oz[k]??null));
  if(o.tur==='sayi'){const x=[],y=[];G.E.forEach(e=>{const a=v[e.s],b=v[e.t];if(a==null||b==null)return;x.push(a);y.push(b);if(!G.yonlu){x.push(b);y.push(a)}});return {tur:'sayi',r:x.length>2?korelasyon(x,y):null}}
  return {tur:'kat',r:ozellikUyumu(G,v)}});
const agTriad=()=>ob('triad',()=>{const G=agG();return G?triadSayimi(G):null});
const agDiad=()=>ob('diad',()=>{const G=agG();return G?diadSayimi(G):null});
const agOmurga=()=>ob('omurga',()=>{const G=agG();return G&&P().omurga.acik?omurga(G,P().omurga.alfa):null});
/* düğmeyle başlatılan ağır hesaplar: sonuç sürümle birlikte saklanır */
const AGIR={};
function agir(k){const a=AGIR[k];return a&&a.ver===S.ver?a.v:null}
function agirKoy(k,v){AGIR[k]={ver:S.ver,v}}

/* ---------- Ölçü kataloğu ---------- */
const OLCU=[
  {k:'derece',grup:'merkez'},{k:'dereceGiris',grup:'merkez',yonlu:1},{k:'dereceCikis',grup:'merkez',yonlu:1},{k:'guc',grup:'merkez',agirlikli:1},{k:'gucGiris',grup:'merkez',yonlu:1,agirlikli:1},{k:'gucCikis',grup:'merkez',yonlu:1,agirlikli:1},
  {k:'arasindalik',grup:'merkez'},{k:'yakinlik',grup:'merkez'},{k:'harmonik',grup:'merkez'},{k:'ozvektor',grup:'merkez'},{k:'pagerank',grup:'merkez'},{k:'hub',grup:'merkez',yonlu:1},{k:'otorite',grup:'merkez',yonlu:1},
  {k:'cekirdek',grup:'yapi',tam:1},{k:'kumelenme',grup:'yapi'},{k:'kisitlama',grup:'yapi'},{k:'etkinBuyukluk',grup:'yapi'}];
function olcuListesi(G=agG()){if(!G)return [];return OLCU.filter(o=>(!o.yonlu||G.yonlu)&&(!o.agirlikli||G.agirlikli))}
const olcuAd=k=>tAlt('olcu',k)||k;
function olcuDeger(k){const R=agOlc();if(!R)return null;return R.D[k]||null}

/* ---------- Renk ve boyut kaynakları ---------- */
function renkGrubu(kaynak=P().gorsel.renk){const p=P(),G=agG();if(!G)return null;
  if(kaynak==='topluluk'){const T=agTop();if(!T)return null;return {grup:T.c.map(c=>'c'+c),ad:g=>toplulukAd(+g.slice(1)),baslik:t('colorCommunity')}}
  if(kaynak==='cekirdek'){const C=agCp();if(!C)return null;return {grup:C.cekirdek.map(c=>c?'a':'b'),ad:g=>g==='a'?t('core'):t('periphery'),baslik:t('colorCorePeriphery')}}
  if(kaynak==='bilesen'){const R=agOlc();if(!R)return null;return {grup:R.D.bilesen.map(c=>'k'+c),ad:g=>t('componentN',+g.slice(1)+1),baslik:t('colorComponent')}}
  if(kaynak&&kaynak.startsWith('oz:')){const k=kaynak.slice(3),o=p.ozellikler.find(x=>x.k===k);if(!o)return null;
    if(o.tur==='sayi'){/* sayısal özellik: dörde bölünen dilimler */const v=p.dugumler.map(d=>sayiOku(d.oz[k]));const s=v.filter(x=>x!=null).sort((a,b)=>a-b);if(!s.length)return null;const q=[.25,.5,.75].map(f=>s[Math.min(s.length-1,Math.floor(f*s.length))]);
      const dil=x=>x==null?null:'q'+(x<=q[0]?0:x<=q[1]?1:x<=q[2]?2:3);const sinir=[s[0],...q,s[s.length-1]];return {grup:v.map(dil),ad:g=>{const i=+g.slice(1);return `${sayi(sinir[i],1)} – ${sayi(sinir[i+1],1)}`.replace('–','-')},baslik:o.ad,sirali:true}}
    return {grup:p.dugumler.map(d=>{const x=d.oz[k];return x==null||x===''?null:String(x)}),ad:g=>g,baslik:o.ad}}
  return null}
/* renk düzenleme listesi: çizimdeki sırayla ilk 8 grup ve şu anki renkleri */
function renkListesi(){const p=P(),g=p.gorsel,st=STILLER[g.stil]||STILLER.dergi,oz=(g.renkler||{})[g.renk]||{};const RG=renkGrubu();
  if(!RG)return [{g:'__tek',ad:t('allNodes'),renk:oz.__tek||st.palet[0]}];const say=new Map();RG.grup.forEach(x=>{if(x!=null&&x!=='')say.set(x,(say.get(x)||0)+1)});
  return [...say.entries()].sort((a,b)=>b[1]-a[1]||String(a[0]).localeCompare(String(b[0]),'tr')).slice(0,8).map(([x],k)=>({g:x,ad:RG.ad?RG.ad(x):x,renk:oz[x]||st.palet[k]}))}
function boyutDeger(kaynak=P().gorsel.boyut){const G=agG(),p=P();if(!G)return [];if(kaynak==='esit')return new Array(G.n).fill(1);
  if(kaynak&&kaynak.startsWith('oz:')){const k=kaynak.slice(3);const v=p.dugumler.map(d=>sayiOku(d.oz[k]));const mn=Math.min(...v.filter(x=>x!=null));return v.map(x=>x==null?mn:x)}
  const d=olcuDeger(kaynak)||olcuDeger('derece');return d||new Array(G.n).fill(1)}
function boyutAd(kaynak=P().gorsel.boyut){if(kaynak==='esit')return '';if(kaynak&&kaynak.startsWith('oz:')){const o=P().ozellikler.find(x=>x.k===kaynak.slice(3));return o?o.ad:''}return olcuAd(kaynak)}

/* ---------- Görünüm durumu (kaydedilmez) ---------- */
const GORUNUM={konum:null,anahtar:'',donusum:{k:1,x:0,y:0},secili:null,arama:'',kalite:null};
const ALAN_AG={x0:40,y0:56,x1:910,y1:770},ALAN_TAM={x0:40,y0:56,x1:1160,y1:770};
function yerlesimAnahtar(){const p=P(),g=p.gorsel;return [S.ver_yapi??'',p.aktif,g.yerlesim,g.tohum,g.aciklama,g.renk,agG()?.m].join('|')}
/* yerleşimin önbellek anahtarı; G verilmezse etkin ağ kullanılır */
function yerlesimAnahtar(p=P(),G=agG()){const g=p.gorsel;const hk=g.yerlesim==='harita'?JSON.stringify({...g.harita,geo:g.harita.geo?(g.harita.geo.features||[]).length:0}):'';return [p.aktif,G.n,G.m,g.yerlesim,g.tohum,g.aciklama?1:0,hk,g.yerlesim==='grup'||g.yerlesim==='daire'||g.yerlesim==='halka'?g.renk+g.boyut:'',yapiParmakIzi()].join('|')+(g.yerlesim==='katman'?'|K'+katmanParmakIzi(p,G)+'|'+g.stil+g.boyut+(g.olcek||1)+'|'+(g.bosluk||0):'')}
function yerlesimAl(){const p=P(),g=p.gorsel,G=agG();if(!G)return null;const k=yerlesimAnahtar(p,G);
  const yc=()=>{const st=STILLER[g.stil]||STILLER.dergi;const bay=g.bayrak&&COG.d?bayraklar(G,g.yerlesim==='harita'?g.harita.eslesme:'ad').some(Boolean):false;return {st,bay,imza:g.stil+'|'+bay+'|'+g.boyut+'|'+(g.olcek||1)+'|'+(g.bosluk||0)}};
  const rd=c=>{const r=yaricaplar(boyutDeger(),c.st,c.bay);const o=g.olcek||1;return o===1?r:r.map(v=>v*o)};
  if(GORUNUM.konum&&GORUNUM.anahtar===k){const Y=GORUNUM.konum;if(!Y.elle&&['kuvvet','harita','grup'].includes(g.yerlesim)){const c=yc();if(Y.imza!==c.imza){cakismaGider(Y,rd(c),g.aciklama?ALAN_AG:ALAN_TAM,g.bosluk||0);Y.imza=c.imza}}return Y}const RG=renkGrubu();const alan=g.aciklama?ALAN_AG:ALAN_TAM;
  const Y=g.yerlesim==='katman'?katmanYerlesim(G,alan,katmanBilgi(p,G),rd(yc()),g.bosluk||0):g.yerlesim==='harita'&&COG.d?(haritaYerlesim(G,g.harita,alan)||yerlesimHesap(G,'kuvvet',g.tohum,null,boyutDeger(),alan)):yerlesimHesap(G,g.yerlesim==='harita'?'kuvvet':g.yerlesim,g.tohum,RG?RG.grup.map(x=>x??'~'):null,boyutDeger(),alan);
  /* kaydedilmiş elle düzenlemeler */const kay=p.gorsel.konum;if(kay&&kay.anahtar===k&&kay.poz){G.ids.forEach((id,i)=>{const q=kay.poz[id];if(q){Y.x[i]=q[0];Y.y[i]=q[1]}});Y.elle=true}
  else if(['kuvvet','harita','grup'].includes(g.yerlesim)){const c=yc();cakismaGider(Y,rd(c),alan,g.bosluk||0);Y.imza=c.imza}
  GORUNUM.konum=Y;GORUNUM.anahtar=k;return Y}
/* yalnız bağ yapısı değiştiğinde yerleşim yeniden hesaplanır; ad ya da özellik düzenlemesi konumu bozmaz */
function yapiParmakIzi(){const r=aktifIliski();if(!r)return '';let h=2166136261;for(const [a,b,w] of r.kenarlar){const s=a+'>'+b+':'+w+';';for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}}return (h>>>0).toString(36)+':'+P().dugumler.length+':'+(P().yonlu?1:0)+':'+(P().agirlikli?1:0)}

/* ---------- Ağ çizimi için ortak ayarlar ---------- */
/* düğüme özel görsel ayarlar (renk, boyut çarpanı, etiket), düğüm sırasına göre; hiçbiri yoksa null */
function dugumOzelDizi(G){const D=P().gorsel.dugum;if(!D||!G)return null;let var_=false;const L=G.ids.map(id=>{const x=D[id];if(x&&(x.renk||x.boyut||x.etiket)){var_=true;return x}return null});return var_?L:null}
function agCizimAyar(o={}){const p=P(),g=p.gorsel,G=agG();const RG=renkGrubu();const om=agOmurga();const Gc=om?{...G,E:om.map(k=>G.E[k])}:G;
  return {G:Gc,deger:boyutDeger(),grup:RG?RG.grup:null,ayar:{stil:g.stil,sb:g.sb,etiket:g.etiket,esik:g.esik,egri:g.egri,gri:g.gri,alan:g.alan&&!!RG&&!RG.sirali&&g.yerlesim!=='harita',gad:g.gad&&!!RG&&!RG.sirali,aciklama:g.aciklama,ok:g.ok,
    renkBaslik:RG?RG.baslik:null,grupAd:RG?RG.ad:null,digerAd:t('other'),boyutBaslik:g.boyut==='esit'?null:boyutAd(),bagBaslik:G.agirlikli?t('legendWeight'):null,sayiYaz:v=>sayi(v,Math.abs(v)<10?2:0),
    harita:GORUNUM.konum&&GORUNUM.konum.harita?GORUNUM.konum.katman:null,bayrak:g.bayrak&&COG.d?bayraklar(G,g.yerlesim==='harita'?g.harita.eslesme:'ad'):null,
    notlar:[t('legendNodes',sayi(G.n),sayi(Gc.E.length))].concat(om?[t('legendBackbone',sayi(om.length),sayi(G.m))]:[]),ozelRenk:(g.renkler||{})[g.renk]||null,dugumOzel:dugumOzelDizi(G),grupSira:katmanRenkSira(g,G),olcek:g.olcek||1,altBilgi:g.imzaAcik?(S.dil==='tr'?'Ağ Masası (Çetin ve Filiz, 2026)':'Ağ Masası (Çetin & Filiz, 2026)'):null,baslik:o.baslik,ipucuBaslik:o.ipucu,...o}}}

/* ---------- Topluluk adları: üyelere bağlı tutulur ----------
   p.topluluk.adlar = [{ad, uye:[düğüm kimlikleri]}]. Yeni bölmede üyeleri Jaccard ≥ 0,5 örtüşen topluluk aynı adı alır. */
function toplulukUyeleri(c){const T=agTop(),p=P();return T?p.dugumler.filter((d,i)=>T.c[i]===c).map(d=>d.id):[]}
const jaccard=(a,b)=>{const B=new Set(b);let k=0;for(const x of a)if(B.has(x))k++;return k/(a.length+B.size-k||1)};
function toplulukAdlari(){return ob('tad',()=>{const T=agTop(),p=P();if(!T)return [];const L=p.topluluk.adlar||[];return Array.from({length:T.k},(_,c)=>{const U=toplulukUyeleri(c);let en=null,es=0;for(const x of L){const j=jaccard(U,x.uye||[]);if(j>es){es=j;en=x}}return es>=0.5&&en.ad?en.ad:null})})}
function toplulukOto(){return ob('toto',()=>{const T=agTop(),p=P();if(!T)return [];const n=p.dugumler.length;const g=p.gorsel||{};const ad=[];
  const K=p.ozellikler.filter(o=>o.tur==='kat'&&new Set(p.dugumler.map(d=>d.oz?.[o.k]).filter(v=>v!=null&&v!=='')).size<=Math.max(2,n/3));
  const on=String(g.renk||'').startsWith('oz:')?g.renk.slice(3):null;K.sort((a,b)=>(b.k===on)-(a.k===on));
  for(const o of K){const r=Array.from({length:T.k},(_,c)=>{const say={};let top=0;p.dugumler.forEach((d,i)=>{if(T.c[i]!==c)return;top++;const v=d.oz?.[o.k];if(v!=null&&v!=='')say[v]=(say[v]||0)+1});let en=null,es=0;for(const v in say)if(say[v]>es){es=say[v];en=v}return top>=2&&es/top>=0.6?en:null});
    if(r.filter(Boolean).length>=Math.min(2,T.k)){const s={};r.forEach(v=>{if(v)s[v]=(s[v]||0)+1});const z={};return r.map(v=>{if(!v)return null;if(s[v]===1)return v;z[v]=(z[v]||0)+1;return v+' '+z[v]})}}
  return ad})}
function toplulukAd(c){const a=toplulukAdlari()[c];return a||toplulukOto()[c]||t('communityN',c+1)}
function toplulukAdKoy(c,ad){const p=P();const U=toplulukUyeleri(c);p.topluluk.adlar=(p.topluluk.adlar||[]).filter(x=>jaccard(U,x.uye||[])<0.5);if(ad.trim())p.topluluk.adlar.push({ad:ad.trim(),uye:U})}
