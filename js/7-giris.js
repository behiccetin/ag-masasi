/* ====================== ANA SAYFA: ağ atlası ======================
   Bütün şekiller sayfa açılırken bu aracın kendi motoruyla, sabit tohumlu kurgusal ağlardan çizilir. */
const VOB={anahtar:'',d:{}};
function vitrinOb(k,fn){const a=S.dil+'|'+document.documentElement.dataset.theme;if(VOB.anahtar!==a){VOB.anahtar=a;VOB.d={}}if(!(k in VOB.d))VOB.d[k]=fn();return VOB.d[k]}
const KITE_E=[[0,1],[0,2],[0,3],[0,5],[1,3],[1,4],[1,6],[2,3],[2,5],[3,4],[3,5],[3,6],[4,6],[5,6],[5,7],[6,7],[7,8],[8,9]];
const kiteAg=()=>sentetikAg(10,KITE_E.map(e=>[...e,1]),false,'ABCDEFGHIJ'.split(''));
/* küçük çizim: açıklama kutusu yok, tam alan */
function vitrinCiz(G,o={}){const Y=o.konum||yerlesimHesap(G,o.yerlesim||'kuvvet',o.tohum||3,o.grup?o.grup.map(x=>x??'~'):null,o.deger||G.U.map(L=>L.length),ALAN_TAM);
  if(!o.konum&&(o.yerlesim||'kuvvet')==='kuvvet'){const st=STILLER[o.stil||'vitrin'];const d=o.deger||G.U.map(L=>L.length);const mn=Math.min(...d),mx=Math.max(...d);cakismaGider(Y,d.map(v=>st.rmin+(st.rmax-st.rmin)*Math.sqrt(mx>mn?(v-mn)/(mx-mn):0)),ALAN_TAM)}
  return agSvg(G,Y,o.deger||G.U.map(L=>L.length),o.grup||null,{stil:o.stil||'vitrin',sb:o.sb,etiket:o.etiket??0,egri:o.egri!==false,gri:true,alan:!!o.alan,gad:!!o.gad,aciklama:!!o.aciklama,ok:true,grupAd:o.grupAd,renkBaslik:o.renkBaslik,boyutBaslik:o.boyutBaslik,zorunluEtiket:o.zorunlu,isaret:o.isaret,notlar:o.notlar,sayiYaz:v=>sayi(v,2),digerAd:t('other')}).svg}
const VSEKIL={
  ornek:()=>{const p=ornekProje();const G=agKur(p,'r1');const b=p.dugumler.map(d=>d.oz.bolum);const Y=yerlesimHesap(G,'kuvvet',4,b,null,ALAN_AG);const ar=arasindalik(G,false).norm;
    const st=STILLER.dergi;const mn=Math.min(...ar),mx=Math.max(...ar);cakismaGider(Y,ar.map(v=>st.rmin+(st.rmax-st.rmin)*Math.sqrt(mx>mn?(v-mn)/(mx-mn):0)),ALAN_AG);
    return agSvg(G,Y,ar,b,{stil:'dergi',etiket:10,egri:true,gri:true,alan:true,gad:true,aciklama:true,renkBaslik:t('sampleAttrDept'),boyutBaslik:olcuAd('arasindalik'),bagBaslik:t('legendWeight'),sayiYaz:v=>sayi(v,2),notlar:[t('legendNodes',sayi(G.n),sayi(G.m))],altBilgi:'Ağ Masası'}).svg},
  topluluk:()=>{const {G}=VITRIN.topluluk();const T=toplulukBul(G,{tekrar:10});return vitrinCiz(G,{grup:T.c.map(c=>'c'+c),alan:true,gad:true,grupAd:g=>t('communityN',+g.slice(1)+1),tohum:5})},
  cekirdek:()=>{const {G}=VITRIN.cekirdek();const C=cekirdekCevre(G);return vitrinCiz(G,{grup:C.cekirdek.map(c=>c?'a':null),alan:true,gad:true,grupAd:g=>t('core'),tohum:2})},
  merkez:()=>{const {G}=VITRIN.merkez();const d=G.U.map(L=>L.length);const ust=d.map((x,i)=>i).sort((a,b)=>d[b]-d[a]).slice(0,4);const G2={...G,ad:G.ad.map((a,i)=>ust.includes(i)?t('hubN',ust.indexOf(i)+1):a)};
    return vitrinCiz(G2,{deger:d,etiket:4,tohum:7})},
  tedarik:()=>{const {G,grup}=VITRIN.tedarik();const K=[0,1,2,3].map(k=>grup.map((g,i)=>i).filter(i=>grup[i]===k));const x=new Array(G.n),y=new Array(G.n);
    K.forEach((L,k)=>L.forEach((i,z)=>{x[i]=90+k*(1020/3);y[i]=110+(L.length>1?z*(600/(L.length-1)):300)}));
    const ad=[t('supplier'),t('manufacturer'),t('distributor'),t('retailer')];return vitrinCiz(G,{konum:{x,y},grup:grup.map(k=>'k'+k),grupAd:g=>ad[+g.slice(1)],gad:false,alan:false,deger:G.U.map(L=>L.length),egri:true})},
  araci:()=>{const {G,araci}=VITRIN.araci();const ar=arasindalik(G,false).norm;const grup=G.ad.map((_,i)=>araci.includes(i)?'x':i<18?'a':'b');const G2={...G,ad:G.ad.map((a,i)=>araci.includes(i)?t('brokerN',araci.indexOf(i)+1):a)};
    return vitrinCiz(G2,{deger:ar,grup,alan:false,gad:false,etiket:2,zorunlu:araci,isaret:new Set(araci),tohum:3})},
  harita:()=>{const E=GEMI['2023'].filter(e=>e[0]!=='XXX'&&e[1]!=='XXX'&&e[0]!==e[1]);const iso=[...new Set(E.flatMap(e=>[e[0],e[1]]))];const ix=new Map(iso.map((a,i)=>[a,i]));const G=sentetikAg(iso.length,E.map(([a,b,w])=>[ix.get(a),ix.get(b),w]),true,iso);
    const Y=haritaYerlesim(G,{tur:'dunya',eslesme:'ad'},ALAN_TAM);if(!Y)return '';const der=G.inn.map(L=>topla(L.map(x=>x[1])));cakismaGider(Y,yaricaplar(der,STILLER.vitrin,true),ALAN_TAM);const T=toplulukBul(G,{tekrar:10});const tr=S.dil==='tr';
    const G2={...G,ad:iso.map(a=>{const u=COG.ulke.get(a);return u?(tr?u.tr:u.en):a})};
    return agSvg(G2,Y,der,T.c.map(c=>'c'+c),{stil:'vitrin',etiket:7,egri:true,gri:true,alan:false,gad:false,aciklama:false,ok:true,harita:Y.katman,bayrak:iso.map(bayrakUri)}).svg},
  matris:()=>{const {G}=VITRIN.topluluk();const T=toplulukBul(G,{tekrar:10});const d=G.U.map(L=>L.length);const sira=G.ad.map((_,i)=>i).sort((a,b)=>T.c[a]-T.c[b]||d[b]-d[a]);const m=matrisSvg(G,sira,T.c);const w=+m.match(/width="(\d+)"/)[1];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><rect width="1200" height="800" fill="#fff"/><g transform="translate(${(1200-760)/2},20) scale(${760/w})">${m.replace(/<\/?svg[^>]*>/g,'')}</g></svg>`}};
function vSekil(k){return vitrinOb('s:'+k,()=>{try{return VSEKIL[k]()}catch(e){console.error(e);return ''}})}
/* ölçü örnekleri: Krackhardt uçurtması üzerinde */
function kiteSekil(olcu){return vitrinOb('kite:'+olcu,()=>{const G=kiteAg();const R=olcumler(G);const v=R.D[olcu]||R.D.derece;const mx=Math.max(...v);const en=v.map((x,i)=>i).filter(i=>v[i]>=mx-1e-12);
  const Y=yerlesimHesap(G,'kuvvet',9,null,v,{x0:140,y0:90,x1:1060,y1:710});return agSvg(G,Y,v,v.map((x,i)=>en.includes(i)?'u':'d'),{stil:'buyuk',etiket:10,egri:false,gri:false,alan:false,gad:false,aciklama:false,isaret:new Set(en)}).svg})}

function sekilHtml(k,baslik,altyazi,o={}){const svg=o.svg??vSekil(k);return `<figure class="sekil ${o.cls||''}"><button class="buyut rounded-box overflow-hidden border border-base-300 bg-white" data-buyut="${esc(k)}" aria-label="${esc(t('enlarge'))}: ${esc(baslik)}">${svg}</button>
  <figcaption><b>${esc(t('figShort',o.no))}</b> ${o.bas?`<b>${esc(baslik)}.</b> `:''}${esc(altyazi)}${o.kaynak&&KAYNAK[o.kaynak]?`<span class="block mt-1.5 text-xs text-base-content/70">${esc(t('sourceShort'))}: ${esc(KAYNAK[o.kaynak]).replace(/(https:\/\/[^\s<]+)/g,'<a class="link link-primary" href="$1" target="_blank" rel="noopener noreferrer">$1</a>')}</span>`:''}${o.git?` <button class="link link-primary" data-git="${o.git}" ${o.yk?`data-yk="${o.yk}"`:''}>${esc(o.gitAd||t('openInTool'))}</button>`:''}</figcaption></figure>`}
function cizGiris(){const g=k=>tAlt('giris',k),p=P(),dolu=p.dugumler.length>0;const dugme=(arac,ad,cls)=>`<button class="btn ${cls}" data-garac="${arac}">${esc(ad)}</button>`;
  const ATLAS=g('atlas')||[];const AKIS=g('akis')||[];const OLCULER=g('olculer')||[];const GIRDI=g('girdiler')||[];const CIKTI=g('ciktilar')||[];
  const devam=dolu?`<div class="flex flex-wrap items-center gap-4 border-y border-base-300 py-4"><p class="flex-1 min-w-48"><span class="text-sm text-base-content/60">${esc(g('devam'))}</span> <b>${esc(p.ad)}</b> <span class="text-sm text-base-content/60">${esc(t('dataSummary',sayi(p.dugumler.length),sayi(agG()?.m||0),sayi(p.iliskiler.length),sayi(p.ozellikler.length)))}</span></p><button class="btn btn-primary btn-sm" data-garac="devam">${esc(g('devamBtn'))}</button></div>`:'';
  const stiller=[['dergi',false],['sunum',false],['poster',false],['koyu',false],['dergi',true]];
  $('#s-giris').innerHTML=`<div class="w-full">
  <section class="grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-x-10 gap-y-6 px-4 sm:px-8 pt-10 pb-8 max-w-[96rem] mx-auto items-start">
    <div class="lg:pt-10">
      <p class="dar text-base-content/60 text-lg">Ağ Masası <span class="text-sm">v${SURUM}</span></p>
      <h1 class="text-5xl sm:text-6xl font-bold leading-[0.95] tracking-tight mt-3">${esc(g('baslik'))}</h1>
      <p class="mt-6 text-lg leading-relaxed text-base-content/80 max-w-md">${esc(g('alt'))}</p>
      <div class="flex flex-wrap gap-2 mt-8">${dugme('ornek',t('loadSample'),'btn-primary')}${dugme('veri',g('veriBtn'),'')}${dugme('ac',t('openProject'),'btn-ghost')}</div>
      <p class="text-sm text-base-content/75 mt-5 max-w-md border-l-2 border-primary pl-3">${esc(g('gizlilik'))}</p>
    </div>
    ${sekilHtml('ornek',g('s1b'),g('s1a'),{no:1,cls:'lg:-mr-8'})}
  </section>
  <div class="px-4 sm:px-8 max-w-[96rem] mx-auto">${devam}</div>

  <section class="px-4 sm:px-8 py-14 max-w-[96rem] mx-auto">
    <div class="grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-10 mb-10"><h2 class="text-4xl font-bold leading-none">${esc(g('atlasBaslik'))}</h2><p class="text-base-content/75 leading-relaxed max-w-2xl self-end">${esc(g('atlasAlt'))}</p></div>
    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">${ATLAS.map(([k,b,a,git,yk,kaynak],i)=>sekilHtml(k,b,a,{no:i+2,bas:true,git,yk,kaynak,gitAd:t('openInTool')})).join('')}</div>
  </section>

  <section class="bg-base-200 border-y border-base-300"><div class="px-4 sm:px-8 py-14 max-w-[96rem] mx-auto">
    <div class="grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-10 mb-10"><h2 class="text-4xl font-bold leading-none">${esc(g('akisBaslik'))}</h2><p class="text-base-content/75 leading-relaxed max-w-2xl self-end">${esc(g('akisAlt'))}</p></div>
    <ol class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">${AKIS.map(([b,a,git],i)=>`<li class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3"><span class="dar text-4xl font-bold text-primary leading-none">${i+1}</span><div><h3 class="dar text-xl font-bold">${esc(b)}</h3><div class="my-3 bg-base-100 border border-base-300 rounded-box overflow-hidden" aria-hidden="true">${akisGorsel(i)}</div><p class="text-sm text-base-content/75 leading-relaxed">${esc(a)}</p><button class="link link-primary text-sm mt-1" data-git="${git}">${esc(t('goTab',t(SEKME_AD[git])))}</button></div></li>`).join('')}</ol>
  </div></section>

  <section class="px-4 sm:px-8 py-14 max-w-[96rem] mx-auto">
    <div class="grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-10 mb-8"><h2 class="text-4xl font-bold leading-none">${esc(g('stilBaslik'))}</h2><p class="text-base-content/75 leading-relaxed max-w-2xl self-end">${esc(g('stilAlt'))}</p></div>
    <div class="relative"><div class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-3 scroll-smooth" id="serit" tabindex="0" aria-label="${esc(g('stilBaslik'))}">${stiller.map(([s,sb],i)=>`<figure class="sekil snap-start shrink-0 w-[85%] md:w-[60%] xl:w-[46%]"><div class="rounded-box overflow-hidden border border-base-300">${stilSekil(s,sb)}</div><figcaption><b>${esc(sb?t('blackWhite'):t('style_'+s))}.</b> ${esc((g('stilNot')||[])[i]||'')}</figcaption></figure>`).join('')}</div>
      <div class="flex gap-2 mt-3"><button class="btn btn-sm btn-circle" id="seritGeri" aria-label="${esc(t('previous'))}">‹</button><button class="btn btn-sm btn-circle" id="seritIleri" aria-label="${esc(t('next'))}">›</button><span class="text-sm text-base-content/60 self-center ml-2" id="seritYer"></span></div></div>
    <ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 mt-10 text-sm">${(g('gorselOz')||[]).map(([b,a])=>`<li><h3 class="font-bold">${esc(b)}</h3><p class="text-base-content/70 mt-1 leading-relaxed">${esc(a)}</p></li>`).join('')}</ul>
  </section>

  <section class="border-t border-base-300"><div class="px-4 sm:px-8 py-14 max-w-[96rem] mx-auto">
    <div class="grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-10 mb-8"><h2 class="text-4xl font-bold leading-none">${esc(g('olcuBaslik'))}</h2><p class="text-base-content/75 leading-relaxed max-w-2xl self-end">${esc(g('olcuAlt'))}</p></div>
    <div class="grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-10"><div><div class="grid grid-cols-2 gap-4">${['derece','arasindalik','yakinlik','ozvektor'].map(o=>`<figure class="sekil"><div class="border border-base-300 rounded-box overflow-hidden">${kiteSekil(o)}</div><figcaption><b>${esc(olcuAd(o))}</b></figcaption></figure>`).join('')}</div><p class="text-sm text-base-content/65 mt-3">${esc(g('kiteNot'))}</p></div>
      <div class="grid sm:grid-cols-2 gap-x-8 gap-y-6">${OLCULER.map(([b,L])=>`<div><h3 class="dar text-xl font-bold pb-1 mb-2 border-b border-base-content/80">${esc(b)}</h3><ul class="space-y-1.5 text-sm">${L.map(([a,d])=>`<li><b>${esc(a)}</b> <span class="text-base-content/70">${esc(d)}</span></li>`).join('')}</ul></div>`).join('')}</div></div>
    <button class="btn btn-sm mt-8" data-git="yardim">${esc(g('yardimBtn'))}</button>
  </div></section>

  <section class="bg-base-200 border-y border-base-300"><div class="px-4 sm:px-8 py-14 max-w-[96rem] mx-auto grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)_minmax(0,1fr)] gap-10">
    <h2 class="text-4xl font-bold leading-none">${esc(g('bicimBaslik'))}</h2>
    <div><h3 class="dar text-xl font-bold pb-1 mb-3 border-b border-base-content/80">${esc(g('girdiBaslik'))}</h3><ul class="space-y-2 text-sm">${GIRDI.map(([a,d])=>`<li><b>${esc(a)}</b> <span class="text-base-content/70">${esc(d)}</span></li>`).join('')}</ul></div>
    <div><h3 class="dar text-xl font-bold pb-1 mb-3 border-b border-base-content/80">${esc(g('ciktiBaslik'))}</h3><ul class="space-y-2 text-sm">${CIKTI.map(([a,d])=>`<li><b>${esc(a)}</b> <span class="text-base-content/70">${esc(d)}</span></li>`).join('')}</ul></div>
  </div></section>

  <section class="px-4 sm:px-8 py-14 max-w-[96rem] mx-auto grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-10">
    <h2 class="text-4xl font-bold leading-none">${esc(g('neBaslik'))}</h2>
    <div class="grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10"><div class="space-y-4 text-lg leading-relaxed text-base-content/85 max-w-[62ch]">${(g('neMetin')||[]).map(x=>`<p>${esc(x)}</p>`).join('')}</div>
      <div><h3 class="dar text-xl font-bold pb-1 mb-3 border-b border-base-content/80">${esc(g('neSoruBaslik'))}</h3><ul class="space-y-3 text-base-content/80">${(g('neSorular')||[]).map(x=>`<li class="border-l-2 border-primary pl-3">${esc(x)}</li>`).join('')}</ul></div></div>
  </section>
  <section class="border-t border-base-300"><div class="px-4 sm:px-8 py-14 max-w-[96rem] mx-auto grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-10">
    <h2 class="text-4xl font-bold leading-none">${esc(g('kimBaslik'))}</h2>
    <div class="space-y-10"><dl class="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-6">${(g('kimler')||[]).map(([a,d])=>`<div><dt class="dar text-lg font-bold">${esc(a)}</dt><dd class="text-base-content/75 mt-1 leading-relaxed">${esc(d)}</dd></div>`).join('')}</dl>
      <div><h3 class="dar text-xl font-bold pb-1 mb-3 border-b border-base-content/80">${esc(g('guvenBaslik'))}</h3><div class="grid md:grid-cols-2 gap-8 text-base-content/80 leading-relaxed">${(g('guven')||[]).map(x=>`<p>${esc(x)}</p>`).join('')}</div></div></div>
  </div></section>
  <section class="border-t border-base-300"><div class="px-4 sm:px-8 py-12 max-w-[96rem] mx-auto grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-10">${girisAtifHtml()}</div></section>
  <section class="bg-neutral text-neutral-content"><div class="px-4 sm:px-8 py-12 max-w-[96rem] mx-auto flex flex-wrap items-center gap-6"><p class="dar text-3xl font-bold flex-1 min-w-60">${esc(g('basla'))}</p><div class="flex flex-wrap gap-2">${dugme('ornek',t('loadSample'),'btn-primary')}${dugme('veri',g('veriBtn'),'')}</div></div></section>
  </div>`;
  $$('[data-garac]').forEach(b=>b.onclick=()=>{const a=b.dataset.garac;if(a==='devam'){sekmeAc('ag');return}if(a==='veri'){(async()=>{if(P().dugumler.length&&(await sor(t('startOwnQ',P().ad||''),t('newProject')))){once();S.P=bosProje();S.ver++;GORUNUM.konum=null;kaydet()}sekmeAc('veri')})();return}if(a==='atif'){atifPencere();return}ARAC[a]()});
  $$('[data-gkop]').forEach(b=>b.onclick=()=>kopyala(atifMetinleri()[b.dataset.gkop]));buyutmeBagla();seritBagla();bagla()}
const SEKME_AD={veri:'tabData',ag:'tabNetwork',olcu:'tabMeasures',grup:'tabGroups',yapi:'tabStructure',test:'tabTests',rapor:'tabReport',yardim:'tabHelp'};
function stilSekil(s,sb){return vitrinOb('stil:'+s+sb,()=>{const p=ornekProje();const G=agKur(p,'r1');const b=p.dugumler.map(d=>d.oz.bolum);const Y=yerlesimHesap(G,'kuvvet',4,b,null,ALAN_AG);const ar=arasindalik(G,false).norm;
  const st=STILLER[s];const mn=Math.min(...ar),mx=Math.max(...ar);cakismaGider(Y,ar.map(v=>st.rmin+(st.rmax-st.rmin)*Math.sqrt(mx>mn?(v-mn)/(mx-mn):0)),ALAN_AG);
  return agSvg(G,Y,ar,b,{stil:s,sb,etiket:s==='sunum'?6:10,egri:true,gri:true,alan:true,gad:true,aciklama:true,renkBaslik:t('sampleAttrDept'),boyutBaslik:olcuAd('arasindalik'),sayiYaz:v=>sayi(v,2)}).svg})}
/* akış adımlarının küçük görselleri */
function akisGorsel(i){return vitrinOb('akis'+i,()=>{const st=STILLER.dergi,W=360,H=150;const sv=ic=>`<svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block" font-family="Ag Metin, Helvetica, Arial, sans-serif" font-size="11"><rect width="${W}" height="${H}" fill="#fff"/>${ic}</svg>`;
  if(i===0){const r=[[t('source'),t('target'),t('weight')],['Ayla','Burak','3'],['Ayla','Ceren','1'],['Burak','Deniz','2'],['Ceren','Emre','1']];return sv(r.map((s,y)=>s.map((c,x)=>`<rect x="${20+x*110}" y="${14+y*25}" width="108" height="23" fill="${y?'#fff':'#f2f3f0'}" stroke="#d8dbd3"/><text x="${28+x*110}" y="${30+y*25}" fill="#1f2421" ${y?'':'font-weight="700"'}>${esc(c)}</text>`).join('')).join(''))}
  if(i===1){const s=vSekil('topluluk');return s.replace(/width="1200" height="800"/,'width="360" height="240"').replace('<svg ','<svg class="w-full h-auto block" ')}
  if(i===2){const v=[.92,.71,.55,.38,.3,.21];const ad=['D','F','G','A','B','H'];return sv(v.map((x,k)=>`<text x="24" y="${26+k*21}" fill="#1f2421">${ad[k]}</text><rect x="44" y="${16+k*21}" width="${x*280}" height="12" rx="2" fill="${st.palet[0]}" fill-opacity="${1-k*.12}"/><text x="${50+x*280}" y="${26+k*21}" fill="#6b7280">${sayi(x,2)}</text>`).join(''))}
  if(i===3){const m=vSekil('matris');return m?m.replace('<svg ','<svg class="w-full h-auto block" preserveAspectRatio="xMidYMid meet" style="max-height:150px" '):''}
  if(i===4){const r=prng(5);const b=Array.from({length:24},(_,k)=>Math.exp(-((k-9)**2)/14)*(.7+.3*r()));const mx=Math.max(...b);return sv(b.map((v,k)=>`<rect x="${20+k*13}" y="${125-v/mx*95}" width="10" height="${v/mx*95}" fill="#b6bbc4"/>`).join('')+`<line x1="${20+21*13}" x2="${20+21*13}" y1="22" y2="128" stroke="${st.palet[1]}" stroke-width="2.5"/><text x="${20+21*13-4}" y="18" text-anchor="end" fill="${st.palet[1]}" font-weight="700">r = 0,41</text><line x1="16" x2="345" y1="128" y2="128" stroke="#6b7280"/>`)}
  return sv(`<rect x="110" y="10" width="140" height="132" fill="#fff" stroke="#b6bbc4"/><rect x="124" y="24" width="80" height="8" fill="${st.palet[2]}" fill-opacity=".8"/>${[44,54,64].map(y=>`<rect x="124" y="${y}" width="112" height="4" fill="#d8dbd3"/>`).join('')}<rect x="124" y="76" width="112" height="34" fill="#f2f3f0"/>${[0,1,2,3,4].map(k=>`<circle cx="${136+k*22}" cy="${93+(k%2?6:-5)}" r="${3+k%3}" fill="${st.palet[k%3]}"/>`).join('')}${[118,128].map(y=>`<rect x="124" y="${y}" width="112" height="4" fill="#d8dbd3"/>`).join('')}<text x="262" y="40" fill="#1f2421" font-weight="700">.docx</text><text x="262" y="58" fill="#6b7280">.xlsx</text><text x="262" y="76" fill="#6b7280">.gexf</text>`)})}
function girisAtifHtml(){const a=atifMetinleri();return `<h2 class="text-4xl font-bold leading-none">${esc(ga('atif','baslik'))}</h2>
    <div class="max-w-3xl"><p class="text-base-content/80 leading-relaxed">${esc(ga('atif','ne'))}</p>${doiSatiri()}
    <div class="mt-4 border-l-2 border-primary pl-4"><div class="flex items-center justify-between gap-3"><h3 class="text-sm font-bold">${esc(ga('atif','apa'))}</h3><button class="btn btn-xs" data-gkop="apa">${esc(ga('atif','kopyala'))}</button></div>
    <p class="mt-2 text-sm leading-relaxed pl-6 -indent-6 break-words">${esc(a.apa)}</p></div>
    <button class="btn btn-sm btn-ghost mt-3" data-garac="atif">${esc(ga('atif','digerBicim'))}</button></div>`}
/* kaydırmalı şerit */
function seritBagla(){const s=$('#serit');if(!s)return;const n=s.children.length;const yer=()=>{const w=s.children[0].offsetWidth+24;const i=Math.round(s.scrollLeft/w);$('#seritYer').textContent=`${i+1} / ${n}`;$('#seritGeri').disabled=i<=0;$('#seritIleri').disabled=s.scrollLeft+s.clientWidth>=s.scrollWidth-4};
  const git=d=>{const w=s.children[0].offsetWidth+24;s.scrollBy({left:d*w,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
  $('#seritGeri').onclick=()=>git(-1);$('#seritIleri').onclick=()=>git(1);s.addEventListener('scroll',()=>{clearTimeout(s._z);s._z=setTimeout(yer,60)});s.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();git(1)}if(e.key==='ArrowLeft'){e.preventDefault();git(-1)}});
  let sur=null;s.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;sur={x:e.clientX,l:s.scrollLeft};s.style.scrollSnapType='none'});addEventListener('pointerup',()=>{if(sur){sur=null;s.style.scrollSnapType='';git(0)}});s.addEventListener('pointermove',e=>{if(sur)s.scrollLeft=sur.l-(e.clientX-sur.x)});yer()}
/* büyüyen şekil: şekil olduğu yerden ekranı dolduracak biçimde büyür */
let BUYUK=null;
function buyutmeBagla(){$$('[data-buyut]').forEach(b=>b.onclick=()=>buyutmeAc(b))}
function buyutmeAc(b){const k=$('#buyutme');const r=b.getBoundingClientRect();BUYUK={b};const svg=b.innerHTML;const cap=b.closest('figure')?.querySelector('figcaption')?.innerHTML||'';
  k.innerHTML=`<div class="kap" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px"><div class="p-0">${svg}</div><div class="px-5 py-3 text-sm sekil"><figcaption>${cap}</figcaption></div><button class="btn btn-sm btn-circle absolute right-3 top-3" id="buyutKapat" aria-label="${esc(t('close'))}">×</button></div>`;
  k.classList.remove('hidden');const kap=k.querySelector('.kap');const az=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W=Math.min(innerWidth-48,1400),oran=r.height/r.width,H=Math.min(innerHeight-48,W*oran+130);const w2=Math.min(W,(H-130)/oran);
  const son=()=>{kap.style.left=(innerWidth-w2)/2+'px';kap.style.top=(innerHeight-H)/2+'px';kap.style.width=w2+'px';kap.style.height=H+'px';k.classList.add('acik')};
  if(az)son();else requestAnimationFrame(()=>requestAnimationFrame(son));$('#buyutKapat').onclick=buyutmeKapat;k.onclick=e=>{if(e.target===k)buyutmeKapat()};k.querySelectorAll('[data-git]').forEach(x=>x.onclick=()=>{buyutmeKapat(true);if(x.dataset.yk)YARDIM.konu=x.dataset.yk;sekmeAc(x.dataset.git)});$('#buyutKapat').focus()}
function buyutmeKapat(hemen){const k=$('#buyutme');if(k.classList.contains('hidden'))return;const kap=k.querySelector('.kap');const b=BUYUK&&BUYUK.b;k.classList.remove('acik');
  if(!hemen&&b&&document.body.contains(b)&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const r=b.getBoundingClientRect();kap.style.left=r.left+'px';kap.style.top=r.top+'px';kap.style.width=r.width+'px';kap.style.height=r.height+'px';setTimeout(()=>{k.classList.add('hidden');k.innerHTML=''},320)}
  else{k.classList.add('hidden');k.innerHTML=''}if(b&&document.body.contains(b))b.focus();BUYUK=null}

/* ====================== YARDIM SEKMESİ ======================
   Konular dil dosyasında: yardim.<konu> = {g: grup, b: başlık, m: HTML metin, s: şekil anahtarı (isteğe bağlı)} */
const YARDIM={konu:'nedir',ara:''};
function yardimKonulari(){const Y=tAlt('yardim','_sira')||[];return Y.map(k=>({k,...tAlt('yardim',k)})).filter(x=>x.b)}
function yardimSekil(s){if(!s)return '';if(s.startsWith('kite:'))return kiteSekil(s.slice(5));if(VSEKIL[s])return vSekil(s);if(s==='stil')return stilSekil('dergi',false);return ''}
function cizYardim(){const L=yardimKonulari();if(!L.some(x=>x.k===YARDIM.konu))YARDIM.konu=L[0]?.k;const q=katla(YARDIM.ara.trim());
  const eslesen=q?L.filter(x=>katla(x.b+' '+String(x.m).replace(/<[^>]+>/g,' ')).includes(q)):L;const gruplar=[...new Set(eslesen.map(x=>x.g))];
  const k=L.find(x=>x.k===YARDIM.konu);const i=L.indexOf(k);
  $('#s-yardim').innerHTML=`<div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">${bolumBas('tabHelp','yardimSekme',t('helpLead'))}
    <div class="grid lg:grid-cols-[17rem_minmax(0,1fr)] gap-10"><nav aria-label="${esc(t('helpTopics'))}" class="lg:sticky lg:top-4 self-start"><label class="input input-sm w-full mb-4">${IK.ara}<input type="search" id="yAra" value="${esc(YARDIM.ara)}" placeholder="${esc(t('helpSearch'))}"></label>
      ${gruplar.map(g=>`<p class="dar font-bold text-base mt-4 mb-1">${esc(g)}</p><ul class="text-sm">${eslesen.filter(x=>x.g===g).map(x=>`<li><button class="w-full text-left px-2 py-1 rounded-field ${x.k===YARDIM.konu?'bg-primary text-primary-content':'hover:bg-base-200'}" data-yk="${esc(x.k)}">${esc(x.b)}</button></li>`).join('')}</ul>`).join('')||`<p class="text-sm text-base-content/60">${esc(t('helpNoMatch'))}</p>`}</nav>
      <article class="min-w-0 panel-gir" id="yIcerik">${k?`<p class="text-sm text-base-content/60">${esc(k.g)}</p><h2 class="text-4xl font-bold mt-1 mb-5">${esc(k.b)}</h2>
        <div class="grid ${k.s?'xl:grid-cols-[minmax(0,1fr)_22rem]':''} gap-8"><div class="ipucu-metin leading-relaxed max-w-[68ch] text-[0.97rem] yardim-metin">${guvenliHtml(k.m)}</div>${k.s?`<figure class="sekil"><button class="buyut rounded-box overflow-hidden border border-base-300 bg-white" data-buyut="y">${yardimSekil(k.s)}</button>${k.sa?`<figcaption>${esc(k.sa)}</figcaption>`:''}</figure>`:''}</div>
        ${k.git?`<button class="btn btn-sm mt-6" data-git="${esc(k.git)}">${esc(t('goTab',t(SEKME_AD[k.git])))}</button>`:''}
        <div class="flex justify-between gap-4 mt-10 pt-4 border-t border-base-300 text-sm">${i>0?`<button class="link" data-yk="${esc(L[i-1].k)}">‹ ${esc(L[i-1].b)}</button>`:'<span></span>'}${i<L.length-1?`<button class="link" data-yk="${esc(L[i+1].k)}">${esc(L[i+1].b)} ›</button>`:''}</div>`:''}</article></div></div>`;
  bagla();buyutmeBagla();
  $$('#s-yardim [data-yk]').forEach(b=>b.onclick=()=>{YARDIM.konu=b.dataset.yk;cizYardim();$('#ana').scrollTop=0});
  const a=$('#yAra');a.oninput=()=>{YARDIM.ara=a.value;clearTimeout(a._z);a._z=setTimeout(()=>{const q2=katla(YARDIM.ara.trim()),L2=yardimKonulari();const ilk=L2.find(x=>katla(x.b).includes(q2))||L2.find(x=>katla(x.b+' '+String(x.m).replace(/<[^>]+>/g,' ')).includes(q2));if(ilk)YARDIM.konu=ilk.k;cizYardim();const n=$('#yAra');n.focus();n.setSelectionRange(n.value.length,n.value.length)},200)}}
