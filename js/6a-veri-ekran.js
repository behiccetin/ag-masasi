/* ====================== ORTAK ARAYÜZ PARÇALARI ====================== */
const IK={/* küçük simgeler */
  ekle:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  sil:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  ice:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
  disa:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5M5 21h14"/></svg>',
  ara:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  yenile:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>',
  ok:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'};
/* Bölüm başlığı: büyük dar başlık, altında kısa açıklama */
function bolumBas(baslikK,ipK,aciklama,sag=''){return `<div class="flex flex-wrap items-end gap-3 pb-4 mb-6 cizgi-alt"><div class="flex-1 min-w-60"><h1 class="text-3xl font-bold flex items-center gap-1">${esc(t(baslikK))}${ip(ipK)}</h1>${aciklama?`<p class="text-sm text-base-content/70 mt-1 max-w-3xl">${esc(aciklama)}</p>`:''}</div>${sag}</div>`}
function kutu(baslik,ipK,icerik,o={}){return `<section class="border border-base-300 rounded-box ${o.cls||''}" ${o.id?`id="${o.id}"`:''}><div class="flex items-center gap-1 px-4 pt-3 ${o.duz?'':'pb-2'}"><h2 class="font-bold text-lg mr-auto flex items-center gap-1">${esc(baslik)}${ip(ipK)}</h2>${o.sag||''}</div><div class="${o.ic??'px-4 pb-4'}">${icerik}</div></section>`}
function uyari(m,tur='warning'){return `<div role="alert" class="alert alert-${tur} alert-soft text-sm py-2"><span>${esc(m)}</span></div>`}
function bosDurum(m,dugmeler=''){return `<div class="border border-dashed border-base-300 rounded-box px-6 py-10 text-center"><p class="text-base-content/70 max-w-lg mx-auto">${esc(m)}</p>${dugmeler?`<div class="flex flex-wrap justify-center gap-2 mt-5">${dugmeler}</div>`:''}</div>`}
const sd=(v,o)=>v==null||!isFinite(v)?'-':sayi(v,o??P().ondalik);
const agYok=()=>bosDurum(t('noNetwork'),`<button class="btn btn-primary btn-sm" data-arac="ice">${esc(t('importData'))}</button><button class="btn btn-sm" data-arac="ornek">${esc(t('loadSample'))}</button>`);

/* Kayan sayı: rakamlar önceki değerden yenisine kayar */
const KAYAN={};
function kayan(anahtar,metin){const eski=KAYAN[anahtar];KAYAN[anahtar]=metin;const e=eski&&eski.length===metin.length?eski:null;
  return `<span class="kayan rakam" data-kayan="${esc(anahtar)}" aria-label="${esc(metin)}">${[...metin].map((c,i)=>/\d/.test(c)?`<span><i data-h="${c}" style="transform:translateY(-${(e&&/\d/.test(e[i])?+e[i]:+c)*1.15}em)">${'0123456789'.split('').map(d=>`<b class="block font-[inherit]" style="height:1.15em">${d}</b>`).join('')}</i></span>`:`<span>${esc(c)}</span>`).join('')}</span>`}
function kayanOynat(){requestAnimationFrame(()=>requestAnimationFrame(()=>$$('.kayan i[data-h]').forEach(i=>i.style.transform=`translateY(-${+i.dataset.h*1.15}em)`)))}

/* Sayfalı tablo yardımcısı */
const SAYFA={};
function sayfaDugme(k,toplam,boy){const s=SAYFA[k]||0,son=Math.max(0,Math.ceil(toplam/boy)-1);if(son===0)return '';return `<div class="flex items-center justify-end gap-2 px-4 py-2 text-sm"><span class="text-base-content/60 rakam">${esc(t('pageOf',sayi(s+1),sayi(son+1)))}</span><div class="join"><button class="btn btn-xs join-item" data-sayfa="${k}" data-y="-1" ${s<=0?'disabled':''}>‹</button><button class="btn btn-xs join-item" data-sayfa="${k}" data-y="1" ${s>=son?'disabled':''}>›</button></div></div>`}
function sayfaBagla(){$$('[data-sayfa]').forEach(b=>b.onclick=()=>{SAYFA[b.dataset.sayfa]=(SAYFA[b.dataset.sayfa]||0)+(+b.dataset.y);ciz()})}

/* ====================== VERİ SEKMESİ ====================== */
const VERI={ara:'',kara:''};
function cizVeri(){const p=P(),r=aktifIliski();const G=agG();
  const ozet=p.dugumler.length?t('dataSummary',sayi(p.dugumler.length),sayi(G?G.m:0),sayi(p.iliskiler.length),sayi(p.ozellikler.length)):'';
  const sag=`<div class="flex gap-2"><button class="btn" data-arac="disa">${IK.disa}<span>${esc(t('exportData'))}</span></button><button class="btn btn-primary" data-arac="ice">${IK.ice}<span>${esc(t('importData'))}</span></button></div>`;
  if(!p.dugumler.length){$('#s-veri').innerHTML=`<div class="max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full">${bolumBas('tabData','veri',t('dataLead'),sag)}${veriBaslangic()}</div>`;bagla();$$('[data-icetur]').forEach(b=>b.onclick=()=>icePencere(b.dataset.icetur));return}
  const ozSec=p.ozellikler;
  /* ilişkiler */
  const iliski=`<ul class="divide-y divide-base-300">${p.iliskiler.map(x=>{const n=new Set(x.kenarlar.map(e=>p.yonlu?e[0]+'>'+e[1]:[e[0],e[1]].sort().join('|'))).size;return `<li class="flex items-center gap-2 py-1.5 ${x.id===p.aktif?'font-semibold':''}">
      <input type="radio" class="radio radio-sm radio-primary" name="aktifR" value="${esc(x.id)}" ${x.id===p.aktif?'checked':''} aria-label="${esc(t('makeActive'))}">
      <input class="input input-ghost input-sm flex-1 min-w-0" data-riad="${esc(x.id)}" value="${esc(x.ad)}" aria-label="${esc(t('relationName'))}">
      <span class="text-xs text-base-content/60 rakam whitespace-nowrap">${esc(t('nTies',sayi(n)))}</span>
      <button class="btn btn-ghost btn-xs btn-square" data-risil="${esc(x.id)}" aria-label="${esc(t('deleteRelation'))}" title="${esc(t('deleteRelation'))}">${IK.sil}</button></li>`}).join('')}</ul>
    <button class="btn btn-sm btn-ghost mt-2" id="vIliskiEkle">${IK.ekle}<span>${esc(t('addRelation'))}</span></button>`;
  const tur=`<div class="space-y-3 text-sm">
      <label class="flex items-center justify-between gap-3"><span class="flex items-center gap-1">${esc(t('directed'))}${ip('yonlu')}</span><input type="checkbox" class="toggle toggle-sm toggle-primary" id="vYonlu" ${p.yonlu?'checked':''}></label>
      <label class="flex items-center justify-between gap-3"><span class="flex items-center gap-1">${esc(t('weighted'))}${ip('agirlikli')}</span><input type="checkbox" class="toggle toggle-sm toggle-primary" id="vAgirlikli" ${p.agirlikli?'checked':''}></label>
      ${G?`<p class="text-xs text-base-content/60 pt-2 border-t border-base-300">${esc(veriKontrol(G))}</p>`:''}</div>`;
  /* düğüm tablosu */
  const ara=katla(VERI.ara);const sat=p.dugumler.map((d,i)=>({d,i})).filter(x=>!ara||katla(x.d.ad).includes(ara)||Object.values(x.d.oz).some(v=>katla(v).includes(ara)));const BOY=60,s0=(SAYFA.dug||0)*BOY;if(s0>=sat.length)SAYFA.dug=0;
  const der=G?G.U.map(L=>L.length):[];
  const dTablo=`<div class="flex flex-wrap items-center gap-2 px-4 pb-2"><label class="input input-sm w-64">${IK.ara}<input type="search" id="vAra" value="${esc(VERI.ara)}" placeholder="${esc(t('searchNodes'))}"></label>
      <button class="btn btn-sm" id="vDugEkle">${IK.ekle}<span>${esc(t('addNode'))}</span></button><button class="btn btn-sm" id="vOzEkle">${IK.ekle}<span>${esc(t('addAttribute'))}</span></button>${ip('ozellik')}
      <span class="ml-auto text-xs text-base-content/60">${esc(t('nodesShown',sayi(sat.length),sayi(p.dugumler.length)))}</span></div>
    <div class="overflow-x-auto"><table class="stablo"><thead><tr><th class="w-10 n">#</th><th>${esc(t('nodeName'))}</th>${ozSec.map(o=>`<th><span class="inline-flex items-center gap-1">${esc(o.ad)} <span class="badge badge-ghost badge-xs">${esc(o.tur==='sayi'?t('typeNumeric'):t('typeCategorical'))}</span><button class="btn btn-ghost btn-xs btn-square" data-ozdz="${esc(o.k)}" aria-label="${esc(t('editAttribute'))}" title="${esc(t('editAttribute'))}">…</button></span></th>`).join('')}<th class="n">${esc(t('degreeShort'))}</th><th class="w-8"></th></tr></thead>
    <tbody>${sat.slice(s0,s0+BOY).map(({d,i})=>`<tr><td class="n text-base-content/50">${i+1}</td><td class="p-0"><input class="hucre font-medium" data-dad="${esc(d.id)}" value="${esc(d.ad)}"></td>${ozSec.map(o=>`<td class="p-0"><input class="hucre ${o.tur==='sayi'?'text-right rakam':''}" data-doz="${esc(d.id)}" data-ok="${esc(o.k)}" value="${esc(d.oz[o.k]??'')}" ${o.tur==='kat'?`list="dl-${esc(o.k)}"`:''}></td>`).join('')}<td class="n">${G?sayi(der[i]):''}</td><td><button class="btn btn-ghost btn-xs btn-square" data-dsil="${esc(d.id)}" aria-label="${esc(t('deleteNode'))}" title="${esc(t('deleteNode'))}">${IK.sil}</button></td></tr>`).join('')}</tbody></table></div>
    ${sayfaDugme('dug',sat.length,BOY)}${ozSec.filter(o=>o.tur==='kat').map(o=>`<datalist id="dl-${esc(o.k)}">${[...new Set(p.dugumler.map(d=>d.oz[o.k]).filter(Boolean))].slice(0,200).map(v=>`<option value="${esc(v)}">`).join('')}</datalist>`).join('')}`;
  /* bağ tablosu */
  let kTablo='';if(r){const ad=new Map(p.dugumler.map(d=>[d.id,d.ad]));const kara=katla(VERI.kara);const K=r.kenarlar.map((e,k)=>({e,k})).filter(x=>!kara||katla(ad.get(x.e[0])).includes(kara)||katla(ad.get(x.e[1])).includes(kara));const KB=80,k0=(SAYFA.kenar||0)*KB;if(k0>=K.length)SAYFA.kenar=0;
    kTablo=`<div class="flex flex-wrap items-center gap-2 px-4 pb-2"><label class="input input-sm w-64">${IK.ara}<input type="search" id="vKAra" value="${esc(VERI.kara)}" placeholder="${esc(t('searchTies'))}"></label>
      <span class="text-sm flex items-center gap-2"><input class="input input-sm w-44" id="vKA" list="dl-dug" placeholder="${esc(p.yonlu?t('source'):t('nodeA'))}"><span aria-hidden="true">${p.yonlu?'→':'–'}</span><input class="input input-sm w-44" id="vKB" list="dl-dug" placeholder="${esc(p.yonlu?t('target'):t('nodeB'))}"><input class="input input-sm w-20 rakam" id="vKW" value="1" aria-label="${esc(t('weight'))}"><button class="btn btn-sm" id="vKEkle">${IK.ekle}<span>${esc(t('addTie'))}</span></button></span>
      <span class="ml-auto text-xs text-base-content/60">${esc(t('tiesShown',sayi(K.length),sayi(r.kenarlar.length)))}</span></div>
      <datalist id="dl-dug">${p.dugumler.slice(0,3000).map(d=>`<option value="${esc(d.ad)}">`).join('')}</datalist>
      <div class="overflow-x-auto"><table class="stablo"><thead><tr><th>${esc(p.yonlu?t('source'):t('nodeA'))}</th><th>${esc(p.yonlu?t('target'):t('nodeB'))}</th><th class="n">${esc(t('weight'))}</th><th class="w-8"></th></tr></thead>
      <tbody>${K.slice(k0,k0+KB).map(({e,k})=>`<tr><td>${esc(ad.get(e[0]))}</td><td>${esc(ad.get(e[1]))}</td><td class="p-0 w-28"><input class="hucre text-right rakam" data-kw="${k}" value="${esc(sayi(e[2],Number.isInteger(e[2])?0:3))}"></td><td><button class="btn btn-ghost btn-xs btn-square" data-ksil="${k}" aria-label="${esc(t('deleteTie'))}" title="${esc(t('deleteTie'))}">${IK.sil}</button></td></tr>`).join('')}</tbody></table></div>${sayfaDugme('kenar',K.length,KB)}`}
  $('#s-veri').innerHTML=`<div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full space-y-6">${bolumBas('tabData','veri',ozet,sag)}
    <div class="grid lg:grid-cols-[minmax(0,1fr)_20rem] gap-6">${kutu(t('relations'),'iliskiler',iliski)}${kutu(t('networkType'),'agTuru',tur)}</div>
    ${p.kaynak==='gemi'?kutu(t('dataSource'),'veriKaynagi',kaynakKutusu()):''}
    ${kutu(t('nodes'),'dugumler',dTablo,{ic:''})}
    ${r?kutu(t('tiesOf',r.ad),'baglar',kTablo,{ic:''}):''}</div>`;
  bagla();veriBagla()}
function veriKontrol(G){const p=P();const r=aktifIliski();const oz=r?r.kenarlar.filter(e=>e[0]===e[1]).length:0;const tekrar=r?r.kenarlar.length-oz-G.m:0;const yalniz=G.U.filter(L=>!L.length).length;const L=[];
  L.push(t('checkNodes',sayi(G.n),sayi(G.m)));if(yalniz)L.push(t('checkIsolates',sayi(yalniz)));if(tekrar>0)L.push(p.agirlikli?t('checkDupSum',sayi(tekrar)):t('checkDupOne',sayi(tekrar)));if(oz)L.push(t('checkSelfLoops',sayi(oz)));return L.join(' ')}
function veriBaslangic(){const yol=[['edges','kenar'],['matrix','matris'],['twomode','ikimod'],['biblio','kaynakca'],['attrs','ozellik'],['other','diger']];
  return `<div class="grid md:grid-cols-[minmax(0,1fr)_18rem] gap-8"><div><h2 class="text-xl font-bold mb-3">${esc(t('startHow'))}</h2><ul class="divide-y divide-base-300 border-y border-base-300">${yol.map(([k,tur])=>`<li><button class="w-full text-left py-3 px-1 flex gap-4 items-baseline hover:bg-base-200" data-icetur="${tur}"><span class="font-semibold w-48 shrink-0">${esc(t('imp_'+k))}</span><span class="text-sm text-base-content/70">${esc(t('imp_'+k+'_d'))}</span></button></li>`).join('')}</ul></div>
    <div class="text-sm space-y-3"><h2 class="text-xl font-bold">${esc(t('orSample'))}</h2><p class="text-base-content/70">${esc(t('sampleDesc'))}</p><button class="btn btn-primary btn-sm" data-arac="ornek">${esc(t('loadSample'))}</button></div></div>`}
function veriBagla(){const p=P();
  $$('[name=aktifR]').forEach(e=>e.onchange=()=>{GORUNUM.konum=null;islem(()=>{p.aktif=e.value})});
  $$('[data-riad]').forEach(e=>e.onchange=()=>islem(()=>{const r=p.iliskiler.find(x=>x.id===e.dataset.riad);if(r)r.ad=e.value.trim()||r.ad}));
  $$('[data-risil]').forEach(e=>e.onclick=async()=>{const r=p.iliskiler.find(x=>x.id===e.dataset.risil);if(!r||!(await sor(t('deleteRelationQ',r.ad),t('delete'),true)))return;islem(()=>{p.iliskiler=p.iliskiler.filter(x=>x!==r);if(p.aktif===r.id)p.aktif=p.iliskiler[0]?.id||null;gunlukEkle(t('logRelDel',r.ad))})});
  const ie=$('#vIliskiEkle');if(ie)ie.onclick=()=>islem(()=>{const r={id:'r'+uid(),ad:t('relationN',p.iliskiler.length+1),kenarlar:[]};p.iliskiler.push(r);p.aktif=r.id});
  const y=$('#vYonlu');if(y)y.onchange=async()=>{if(!y.checked&&p.yonlu&&!(await sor(t('toUndirectedQ'),t('apply')))){y.checked=true;return}GORUNUM.konum=null;islem(()=>{p.yonlu=y.checked})};
  const a=$('#vAgirlikli');if(a)a.onchange=()=>islem(()=>{p.agirlikli=a.checked});
  const va=$('#vAra');if(va)va.oninput=()=>{VERI.ara=va.value;SAYFA.dug=0;clearTimeout(va._z);va._z=setTimeout(()=>{ciz();const n=$('#vAra');n.focus();n.setSelectionRange(n.value.length,n.value.length)},250)};
  const ka=$('#vKAra');if(ka)ka.oninput=()=>{VERI.kara=ka.value;SAYFA.kenar=0;clearTimeout(ka._z);ka._z=setTimeout(()=>{ciz();const n=$('#vKAra');n.focus();n.setSelectionRange(n.value.length,n.value.length)},250)};
  $$('[data-dad]').forEach(e=>e.onchange=()=>{const v=e.value.trim();const d=p.dugumler.find(x=>x.id===e.dataset.dad);if(!d)return;if(!v){e.value=d.ad;return}
    if(p.dugumler.some(x=>x!==d&&adAnahtar(x.ad)===adAnahtar(v))){tost(t('dupNodeName'),'warning');e.value=d.ad;return}islem(()=>{d.ad=v},{cizme:true});rozetler()});
  $$('[data-doz]').forEach(e=>e.onchange=()=>{const d=p.dugumler.find(x=>x.id===e.dataset.doz),o=p.ozellikler.find(x=>x.k===e.dataset.ok);if(!d||!o)return;let v=e.value.trim();
    if(o.tur==='sayi'&&v&&sayiOku(v)==null){tost(t('notNumber'),'warning');e.value=d.oz[o.k]??'';return}islem(()=>{if(v)d.oz[o.k]=v;else delete d.oz[o.k]},{cizme:true})});
  $$('[data-dsil]').forEach(e=>e.onclick=async()=>{const d=p.dugumler.find(x=>x.id===e.dataset.dsil);if(!d)return;const n=p.iliskiler.reduce((s,r)=>s+r.kenarlar.filter(k=>k[0]===d.id||k[1]===d.id).length,0);
    if(n&&!(await sor(t('deleteNodeQ',d.ad,sayi(n)),t('delete'),true)))return;GORUNUM.konum=null;islem(()=>{p.dugumler=p.dugumler.filter(x=>x!==d);p.iliskiler.forEach(r=>r.kenarlar=r.kenarlar.filter(k=>k[0]!==d.id&&k[1]!==d.id));gunlukEkle(t('logNodeDel',d.ad))})});
  const de=$('#vDugEkle');if(de)de.onclick=()=>{islem(()=>{let k=p.dugumler.length+1,ad;do{ad=t('nodeN',k++)}while(p.dugumler.some(x=>adAnahtar(x.ad)===adAnahtar(ad)));p.dugumler.push({id:'d'+uid(),ad,oz:{}})});SAYFA.dug=Math.floor((p.dugumler.length-1)/60);ciz()};
  const oe=$('#vOzEkle');if(oe)oe.onclick=()=>ozellikPencere();
  $$('[data-ozdz]').forEach(e=>e.onclick=()=>ozellikPencere(e.dataset.ozdz));
  const r=aktifIliski();
  $$('[data-kw]').forEach(e=>e.onchange=()=>{const v=sayiOku(e.value);const k=+e.dataset.kw;if(v==null||v<=0){tost(t('weightPositive'),'warning');e.value=sayi(r.kenarlar[k][2]);return}islem(()=>{r.kenarlar[k][2]=v},{cizme:true})});
  $$('[data-ksil]').forEach(e=>e.onclick=()=>islem(()=>{r.kenarlar.splice(+e.dataset.ksil,1)}));
  const ke=$('#vKEkle');if(ke)ke.onclick=()=>{const A=$('#vKA').value.trim(),B=$('#vKB').value.trim(),w=sayiOku($('#vKW').value)??1;if(!A||!B){tost(t('needTwoNodes'),'warning');return}if(adAnahtar(A)===adAnahtar(B)){tost(t('noSelfLoop'),'warning');return}if(w<=0){tost(t('weightPositive'),'warning');return}
    const z=islem(()=>veriUygula({dugumler:[],kenarlar:[[A,B,w]],ozellikler:[]},{hedef:r.id,agirlikKoru:true}));if(z.yeniDugum)tost(t('nodesCreated',sayi(z.yeniDugum)),'info');setTimeout(()=>{const a=$('#vKA');if(a)a.focus()},0)};
  $$('[data-icetur]').forEach(b=>b.onclick=()=>icePencere(b.dataset.icetur))}
function ozellikPencere(k){const p=P(),o=k?p.ozellikler.find(x=>x.k===k):null;
  pencere(o?t('editAttribute'):t('addAttribute'),`<div class="space-y-3 text-sm"><label class="block"><span>${esc(t('attrName'))}</span><input class="input input-sm w-full mt-1" id="ozAd" value="${esc(o?.ad||'')}"></label>
    <fieldset><legend class="mb-1 flex items-center gap-1">${esc(t('attrType'))}${ip('ozTur')}</legend><label class="flex items-center gap-2"><input type="radio" class="radio radio-sm" name="ozTur" value="kat" ${o?.tur!=='sayi'?'checked':''}>${esc(t('typeCategoricalLong'))}</label><label class="flex items-center gap-2 mt-1"><input type="radio" class="radio radio-sm" name="ozTur" value="sayi" ${o?.tur==='sayi'?'checked':''}>${esc(t('typeNumericLong'))}</label></fieldset></div>`,
    [...(o?[{ad:t('delete'),c:'btn-ghost text-error mr-auto',f:async()=>{$('#pencere').close();if(await sor(t('deleteAttrQ',o.ad),t('delete'),true))islem(()=>{p.ozellikler=p.ozellikler.filter(x=>x!==o);p.dugumler.forEach(d=>delete d.oz[o.k]);if(p.gorsel.renk==='oz:'+o.k)p.gorsel.renk='topluluk';if(p.gorsel.boyut==='oz:'+o.k)p.gorsel.boyut='ara'});return false}}]:[]),
     {ad:t('cancel'),d:null},{ad:t('save'),c:'btn-primary',f:()=>{const ad=$('#ozAd').value.trim();if(!ad){tost(t('nameRequired'),'warning');return false}const tur=$('[name=ozTur]:checked').value;
      if(tur==='sayi'){const kotu=p.dugumler.filter(d=>{const v=d.oz[o?.k];return v!=null&&v!==''&&sayiOku(v)==null}).length;if(o&&kotu){tost(t('attrNotNumeric',sayi(kotu)),'warning');return false}}
      islem(()=>{if(o){o.ad=ad;o.tur=tur}else p.ozellikler.push({k:'o'+uid(),ad,tur})})}}],{ip:'ozellik'})}

/* ====================== İÇE AKTARMA PENCERESİ ====================== */
const ICE_TUR=['kenar','matris','ikimod','kaynakca','ozellik','diger'];
const ICE_AD={kenar:'edges',matris:'matrix',ikimod:'twomode',kaynakca:'biblio',ozellik:'attrs',diger:'other'};
function icePencere(tur='kenar'){const p=P();const D={tur,metin:'',dosya:null,sat:null,sonuc:null};
  const sec=()=>`<div class="flex flex-wrap gap-1" role="radiogroup">${ICE_TUR.map(x=>`<button class="btn btn-sm ${x===D.tur?'btn-primary':'btn-ghost'}" data-it="${x}" role="radio" aria-checked="${x===D.tur}">${esc(t('imp_'+ICE_AD[x]))}</button>`).join('')}</div>`;
  const secenek=()=>{const x=D.tur;if(x==='ikimod')return `<div class="grid sm:grid-cols-3 gap-3 text-sm"><label><span class="flex items-center gap-1">${esc(t('tmFormat'))}${ip('ikiBicim')}</span><select class="select select-sm w-full mt-1" id="iBicim"><option value="matris">${esc(t('tmMatrix'))}</option><option value="uzun">${esc(t('tmLong'))}</option></select></label>
      <label><span class="flex items-center gap-1">${esc(t('tmProject'))}${ip('izdusum')}</span><select class="select select-sm w-full mt-1" id="iYon"><option value="satir">${esc(t('tmRows'))}</option><option value="sutun">${esc(t('tmCols'))}</option></select></label>
      <label><span class="flex items-center gap-1">${esc(t('tmWeight'))}${ip('izdusumAgirlik')}</span><select class="select select-sm w-full mt-1" id="iYontem"><option value="sayi">${esc(t('tmCount'))}</option><option value="newman">Newman</option><option value="jaccard">Jaccard</option></select></label></div>`;
    if(x==='kaynakca')return `<div class="grid sm:grid-cols-2 gap-3 text-sm"><label><span class="flex items-center gap-1">${esc(t('tmWeight'))}${ip('izdusumAgirlik')}</span><select class="select select-sm w-full mt-1" id="iYontem"><option value="sayi">${esc(t('bibCount'))}</option><option value="newman">${esc(t('bibNewman'))}</option></select></label>
      <label><span class="flex items-center gap-1">${esc(t('bibMin'))}${ip('enAzYayin')}</span><input type="number" min="1" class="input input-sm w-full mt-1" id="iEnAz" value="1"></label></div>`;
    if(x==='kenar')return `<label class="flex items-center gap-2 text-sm"><input type="checkbox" class="checkbox checkbox-sm" id="iYonlu" ${p.yonlu?'checked':''}>${esc(t('edgesDirected'))}${ip('yonlu')}</label>`;
    return ''};
  const hedef=()=>D.tur==='ozellik'?'':`<div class="grid sm:grid-cols-2 gap-3 text-sm pt-3 border-t border-base-300"><label><span class="flex items-center gap-1">${esc(t('impTarget'))}${ip('iceHedef')}</span><select class="select select-sm w-full mt-1" id="iHedef">${p.dugumler.length?`<option value="yeni">${esc(t('impNewRel'))}</option>${p.iliskiler.map(r=>`<option value="${esc(r.id)}">${esc(t('impAddTo',r.ad))}</option>`).join('')}`:''}<option value="degistir">${esc(t('impReplace'))}</option></select></label>
    <label><span>${esc(t('relationName'))}</span><input class="input input-sm w-full mt-1" id="iAd" value="${esc(t('relationN',p.iliskiler.length+1))}"></label></div>`;
  const icerik=()=>`<div class="space-y-4"><p class="text-xs rounded-field bg-primary/8 border border-primary/30 px-3 py-2 flex gap-2 items-start"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5 text-primary" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span>${esc(t('importPrivacy'))}</span></p>${sec()}<p class="text-sm text-base-content/70">${esc(t('imp_'+ICE_AD[D.tur]+'_l'))}</p>${D.tur==='kenar'||D.tur==='ozellik'?`<p class="text-xs text-base-content/70 flex flex-wrap items-center gap-x-2 gap-y-1">${esc(t(D.tur==='kenar'?'sampleFileEdgesLead':'sampleFileAttrsLead'))}<button class="link link-primary" data-ornd="csv">CSV</button><button class="link link-primary" data-ornd="xlsx">Excel</button>${ip('ornekDosya')}</p>`:''}
    <div class="flex items-center gap-2"><button class="btn btn-sm" id="iDosya">${IK.ice}<span>${esc(t('chooseFile'))}</span></button><span class="text-xs text-base-content/60" id="iDosyaAd">${esc(D.dosya||'')}</span>${ip('iceBicim')}</div>
    <textarea class="textarea textarea-sm w-full font-mono text-xs" rows="8" id="iMetin" placeholder="${esc(t('imp_'+ICE_AD[D.tur]+'_ph'))}">${esc(D.metin)}</textarea>
    ${secenek()}${hedef()}<div id="iOnizle" class="text-sm"></div></div>`;
  const oku=async()=>{const x=D.tur,m=D.metin;let v=null;try{
      if(x==='kaynakca')v=kaynakcaOku(m,{yontem:$('#iYontem')?.value,enAz:+($('#iEnAz')?.value||1)});
      else if(x==='diger'){const s=m.trim();v=/^\s*</.test(s)?xmlAgOku(s):/^\s*dl\b/i.test(s)?dlOku(s):/^\s*\*vertices/im.test(s)?pajekOku(s):null}
      else{const sat=D.sat||csvSatirlar(m);if(x==='kenar')v=kenarListesiOku(sat);else if(x==='matris')v=matrisOku(sat);else if(x==='ikimod')v=ikiModOku(sat,{bicim:$('#iBicim')?.value,yon:$('#iYon')?.value,yontem:$('#iYontem')?.value});else if(x==='ozellik')v=ozellikOku(sat)}}catch(e){v=null}
    D.sonuc=v;const o=$('#iOnizle');if(!o)return;if(!m.trim()&&!D.sat){o.innerHTML='';return}if(!v||(!v.kenarlar.length&&!v.dugumler.length)){o.innerHTML=uyari(t('nothingToImport'));return}
    const ek=[];if(v.olaySay!=null)ek.push(t('tmEvents',sayi(v.aktorSay),sayi(v.olaySay)));if(v.kayitSay!=null)ek.push(t('bibRecords',v.bicim,sayi(v.kayitSay)));if(v.simetrik===false&&!p.yonlu)ek.push(t('asymNote'));if(v.yonlu)ek.push(t('fileDirected'));
    o.innerHTML=`<p class="font-medium">${esc(x==='ozellik'?t('previewAttrs',sayi(v.dugumler.length),sayi(v.ozellikler.length)):t('previewNet',sayi(v.dugumler.length),sayi(v.kenarlar.length)))}</p>${ek.map(m=>`<p class="text-base-content/70">${esc(m)}</p>`).join('')}${(v.uyarilar||[]).map(m=>`<p class="text-warning">${esc(m)}</p>`).join('')}`};
  const bag=()=>{$$('[data-it]').forEach(b=>b.onclick=()=>{D.tur=b.dataset.it;$('#pIcerik').innerHTML=icerik();bag();oku()});$$('[data-ornd]').forEach(b=>b.onclick=()=>ornekDosyaIndir(D.tur,b.dataset.ornd));
    $('#iMetin').oninput=()=>{D.metin=$('#iMetin').value;D.sat=null;D.dosya=null;$('#iDosyaAd').textContent='';clearTimeout(D.z);D.z=setTimeout(oku,250)};
    $$('#iBicim,#iYon,#iYontem,#iEnAz').forEach(e=>e.onchange=oku);
    $('#iDosya').onclick=async()=>{const f=await dosyaOku('.csv,.tsv,.txt,.xlsx,.ris,.bib,.nbib,.ciw,.enw,.net,.gexf,.graphml,.xml,.dl');if(!f)return;D.dosya=f.name;
      try{if(/\.xlsx$/i.test(f.name)){D.sat=await xlsxSatirlar(await f.arrayBuffer());D.metin=D.sat.slice(0,30).map(r=>r.join('\t')).join('\n')+(D.sat.length>30?'\n…':'')}else{D.metin=await f.text();D.sat=null}}catch(e){tost(t('badFile'),'error');return}
      if(/\.(ris|bib|nbib|ciw|enw)$/i.test(f.name)&&D.tur!=='kaynakca')D.tur='kaynakca';if(/\.(net|gexf|graphml|dl)$/i.test(f.name)&&D.tur!=='diger')D.tur='diger';
      $('#pIcerik').innerHTML=icerik();bag();if(D.sat)$('#iMetin').readOnly=true;$('#iDosyaAd').textContent=f.name;oku()}};
  pencere(t('importData'),icerik(),[{ad:t('cancel'),d:null},{ad:t('importDo'),c:'btn-primary',f:async()=>{await oku();const v=D.sonuc;if(!v||(!v.kenarlar.length&&!v.dugumler.length)){tost(t('nothingToImport'),'warning');return false}
      const h=$('#iHedef')?.value||(D.tur==='ozellik'?'var':'yeni');if(h==='degistir'&&p.dugumler.length){$('#pencere').close();if(!(await sor(t('replaceQ'),t('impReplace'),true)))return false;icerikUygula(v,h);return false}icerikUygula(v,h);return true}}],{ip:'iceAktar',genis:true,acilinca:bag});
  function icerikUygula(v,h){const yonlu=D.tur==='kenar'?$('#iYonlu')?.checked:(v.yonlu!=null?v.yonlu:(D.tur==='matris'&&v.simetrik===false?true:null));const ad=$('#iAd')?.value.trim();GORUNUM.konum=null;
    const z=islem(()=>{const o={hedef:h==='var'?null:h,iliskiAd:ad,yonlu:h==='degistir'||!P().dugumler.length?yonlu:(yonlu&&!P().yonlu?true:null)};if(D.tur==='ozellik'){o.hedef='__yok';o.yalnizVar=false}const r=veriUygula(v,o);gunlukEkle(t('logImported',t('imp_'+ICE_AD[D.tur]),sayi(v.dugumler.length),sayi(v.kenarlar.length)));return r});
    tost(D.tur==='ozellik'?t('attrsImported',sayi(v.dugumler.length)):t('importedNet',sayi(z.kenar),sayi(z.yeniDugum)));if(S.sekme==='giris')sekmeAc('veri')}
  setTimeout(()=>{if(D.tur)oku()},0)}

/* ====================== DIŞA AKTARMA PENCERESİ ====================== */
function disaPencere(){const p=P();if(!p.dugumler.length){tost(t('noNetwork'),'warning');return}const r=aktifIliski();
  const B=[['gexf','GEXF (Gephi)'],['graphml','GraphML (Cytoscape, yEd, igraph)'],['net','Pajek .net'],['dl','UCINET DL'],['kenarcsv',t('expEdgesCsv')],['dugcsv',t('expNodesCsv')],['proje',t('saveProject')]];
  pencere(t('exportData'),`<p class="text-sm text-base-content/70 mb-3">${esc(t('exportLead',r?r.ad:''))}</p><ul class="divide-y divide-base-300 border-y border-base-300">${B.map(([k,a])=>`<li><button class="w-full text-left py-2.5 px-1 hover:bg-base-200 flex items-baseline gap-3" data-dx="${k}"><span class="font-medium w-64 shrink-0">${esc(a)}</span><span class="text-xs text-base-content/60">${esc(t('exp_'+k))}</span></button></li>`).join('')}</ul>`,null,{ip:'disaAktar',acilinca:()=>$$('[data-dx]').forEach(b=>b.onclick=()=>disaYap(b.dataset.dx))})}
function disaYap(k){const p=P(),r=aktifIliski(),ad=dosyaAd(p.ad)+(r?'-'+dosyaAd(r.ad):'');const xml=(m,tip)=>new Blob([m],{type:tip});
  if(k==='proje'){ARAC.kaydet();return}if(!r&&k!=='dugcsv'){tost(t('noRelation'),'warning');return}
  if(k==='gexf'){const Y=GORUNUM.konum&&GORUNUM.konum.x.length===p.dugumler.length?GORUNUM.konum:null;const RG=renkGrubu();let renk=null;if(RG){const st=STILLER[p.gorsel.stil]||STILLER.dergi;const say=new Map();RG.grup.forEach(g=>g!=null&&say.set(g,(say.get(g)||0)+1));const L=[...say.entries()].sort((a,b)=>b[1]-a[1]).map(x=>x[0]);renk=RG.grup.map(g=>{const i=L.indexOf(g);return i>=0&&i<8?st.palet[i]:DIGER_RENK})}
    indir(ad+'.gexf',xml(gexfYaz(p,r.id,Y,renk),'application/xml'))}
  else if(k==='graphml')indir(ad+'.graphml',xml(graphmlYaz(p,r.id),'application/xml'));else if(k==='net')indir(ad+'.net',xml(pajekYaz(p,r.id),'text/plain'));else if(k==='dl')indir(ad+'.dl',xml(dlYaz(p,r.id),'text/plain'));
  else if(k==='kenarcsv'){const a=new Map(p.dugumler.map(d=>[d.id,d.ad]));indir(ad+'-baglar.csv',csv([[p.yonlu?t('source'):t('nodeA'),p.yonlu?t('target'):t('nodeB'),t('weight')],...disaBaglar(p,r.id).map(e=>[a.get(e[0]),a.get(e[1]),sayi(e[2],Number.isInteger(e[2])?0:6)])]))}
  else if(k==='dugcsv')indir(dosyaAd(p.ad)+'-dugumler.csv',csv([[t('nodeName'),...p.ozellikler.map(o=>o.ad)],...p.dugumler.map(d=>[d.ad,...p.ozellikler.map(o=>d.oz[o.k]??'')])]));
  tost(t('downloaded'))}

/* Örnek verinin kaynağı: atıf, açıklama ve makaleyle karşılaştırma */
function kaynakKutusu(){const L=['filiz2026','ngosbp'].map(k=>KAYNAK[k]);const bag=m=>esc(m).replace(/(https:\/\/[^\s<]+)/g,'<a class="link link-primary" href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  return `<div class="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] gap-6 text-sm"><div><p class="text-base-content/80 leading-relaxed">${esc(t('sample2Note'))}</p><h3 class="font-bold mt-4 mb-1">${esc(ga('yontem','kaynakca'))}</h3><ul class="space-y-1.5">${L.map(m=>`<li class="pl-6 -indent-6 break-words">${bag(m)}</li>`).join('')}</ul>
    <button class="btn btn-xs mt-3" id="kKopya">${esc(ga('atif','kopyala'))}</button></div><div><h3 class="font-bold flex items-center gap-1">${esc(t('cmpTitle'))}${ip('makaleKiyas')}</h3>${gemiKiyasHtml()}<p class="text-xs text-base-content/60 mt-2">${esc(t('cmpNote'))}</p></div></div>`}
document.addEventListener('click',e=>{if(e.target&&e.target.id==='kKopya')kopyala(['filiz2026','ngosbp'].map(k=>KAYNAK[k]).join('\n'))});
