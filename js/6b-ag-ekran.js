/* Şekil altı kaynak satırı: dergilerde görselin altına yazılan biçim; İngilizcede ğ ve ı yazamayanlar için Ag Masasi */
let RENK_ACIK=false;
function renkDuzenHtml(){const L=renkListesi();const oz=(P().gorsel.renkler||{})[P().gorsel.renk];
  return `<details class="mt-1 text-sm" id="rkAc" ${RENK_ACIK?'open':''}><summary class="cursor-pointer text-base-content/75 py-1 flex items-center gap-1">${esc(t('editColors'))}${ip('renkDuzen')}</summary><ul class="space-y-1 mt-1">${L.map(x=>`<li class="flex items-center gap-2"><input type="color" class="w-7 h-7 rounded border border-base-300 p-0 cursor-pointer bg-transparent" value="${esc(x.renk)}" data-rk="${esc(x.g)}" aria-label="${esc(t('colorOf',x.ad))}"><span class="truncate">${esc(x.ad)}</span></li>`).join('')}</ul>${oz&&Object.keys(oz).length?`<button class="btn btn-ghost btn-xs mt-1" id="rkSifirla">${esc(t('resetColors'))}</button>`:''}</details>`}
function imzaUyari(){return `<div role="note" class="rounded-box border border-warning/60 bg-warning/10 p-3 text-xs leading-relaxed mt-1 mb-2"><p>${esc(t('markOffNote'))}</p><div class="flex flex-wrap gap-1 mt-2"><button class="btn btn-xs" data-akop="tr">${esc(t('copyTr'))}</button><button class="btn btn-xs" data-akop="en">${esc(t('copyEn'))}</button><button class="btn btn-xs" data-akop="apa">${esc(t('copyApa'))}</button></div></div>`}
const SEKIL_KAYNAK={tr:'Kaynak: Yazarların Ağ Masası ile hazırladığı çizim (Çetin, 2026).',en:'Source: Authors\' own elaboration based on Ag Masasi software (Çetin, 2026).'};
/* ====================== AĞ SEKMESİ: çizim ve görsel ayarlar ====================== */
function yaziSvgStil(){/* sayfaya gömülü yazı yüzü, dışa aktarılan SVG ve PNG'de aynı görünüm için */let s='';try{for(const ss of document.styleSheets)for(const r of ss.cssRules)if(r.type===5&&/Ag Metin/.test(r.cssText)&&!/italic/.test(r.cssText))s+=r.cssText}catch(e){}return s?`<style>${s}</style>`:''}
function svgDisa(svg,gomulu=true){return svg.replace(/<svg([^>]*)>/,(m,a)=>`<svg${a}>${gomulu?yaziSvgStil():''}`)}
function pngDpi(blob,dpi){return blob.arrayBuffer().then(b=>{const u=new Uint8Array(b);const ppm=Math.round(dpi/0.0254);const veri=new Uint8Array(21);const dv=new DataView(veri.buffer);dv.setUint32(0,9);veri.set([112,72,89,115],4);dv.setUint32(8,ppm);dv.setUint32(12,ppm);veri[16]=1;dv.setUint32(17,CRC(veri.subarray(4,17)));
  const k=33;const o=new Uint8Array(u.length+21);o.set(u.subarray(0,k));o.set(veri,k);o.set(u.subarray(k),k+21);return new Blob([o],{type:'image/png'})})}
let AGSVG=null;/* son çizimin bilgileri: konumlar, yarıçaplar */
function cizAg(){const p=P(),G=agG();const kap=$('#s-ag');
  if(!G||!G.n){kap.innerHTML=`<div class="max-w-5xl mx-auto px-4 sm:px-8 py-8 w-full">${bolumBas('tabNetwork','agSekme',t('netLead'))}${agYok()}</div>`;bagla();return}
  if(!$('#tuval')){kap.innerHTML=`<div class="ag-duzen"><div class="relative min-h-[28rem] border-r border-base-300 flex flex-col"><div class="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-base-300 text-sm">
      <label class="input input-sm w-56">${IK.ara}<input type="search" id="aAra" placeholder="${esc(t('findNode'))}" list="dl-agdug"></label><datalist id="dl-agdug"></datalist>
      <div class="join"><button class="btn btn-sm join-item" id="aYak" aria-label="${esc(t('zoomIn'))}" title="${esc(t('zoomIn'))}">+</button><button class="btn btn-sm join-item" id="aUzak" aria-label="${esc(t('zoomOut'))}" title="${esc(t('zoomOut'))}">−</button><button class="btn btn-sm join-item" id="aSigdir">${esc(t('zoomFit'))}</button></div>${ip('agEtkilesim')}
      <span class="ml-auto text-xs text-base-content/60" id="aDurum"></span></div>
      <div id="tuval" class="flex-1 min-h-0 relative"></div><div id="aSecili" class="absolute left-3 bottom-3 w-80 max-w-[calc(100%-1.5rem)]"></div></div>
    <aside class="overflow-y-auto px-4 py-3 text-sm" id="aAyar"></aside></div>`;tuvalBagla()}
  agCiz();agAyarCiz()}
function agCiz(){const p=P(),g=p.gorsel;const Y=yerlesimAl();if(!Y)return;const A=agCizimAyar({ipucu:true});const zor=GORUNUM.secili!=null?[GORUNUM.secili]:[];
  const s=agSvg(A.G,Y,A.deger,A.grup,{...A.ayar,donusum:donusumYaz(),zorunluEtiket:zor,isaret:GORUNUM.secili!=null?new Set([GORUNUM.secili]):null});AGSVG={Y,rad:s.rad,gizli:s.gizliEtiket,E:A.G.E};
  const tv=$('#tuval');tv.style.background=STILLER[g.stil].zemin;tv.innerHTML=s.svg.replace('<svg ','<svg preserveAspectRatio="xMidYMid meet" ');
  const G=agG();$('#aDurum').textContent=t('netStatus',sayi(G.n),sayi(A.G.E.length),Y.kesisim==null?'-':sayi(Y.kesisim),sayi(s.gizliEtiket));
  const dl=$('#dl-agdug');if(dl&&dl.childElementCount!==G.n)dl.innerHTML=G.ad.slice(0,3000).map(a=>`<option value="${esc(a)}">`).join('');
  seciliCiz();if(GORUNUM.arama)aramaVurgu(GORUNUM.arama)}
const donusumYaz=()=>{const d=GORUNUM.donusum;return d.k===1&&!d.x&&!d.y?'':`translate(${d.x.toFixed(1)},${d.y.toFixed(1)}) scale(${d.k.toFixed(3)})`};
function donusumUygula(){const g=$('#tuval .sah');if(g)g.setAttribute('transform',donusumYaz())}
/* ekran koordinatından SVG koordinatına */
function svgNokta(e){const svg=$('#tuval svg');const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(svg.getScreenCTM().inverse());return {x:q.x,y:q.y}}
function tuvalBagla(){const tv=$('#tuval');let sur=null;
  tv.addEventListener('wheel',e=>{if(!$('#tuval svg'))return;e.preventDefault();const q=svgNokta(e),d=GORUNUM.donusum;const f=Math.exp(-e.deltaY*0.0015);const k=Math.min(8,Math.max(0.4,d.k*f));const r=k/d.k;d.x=q.x-(q.x-d.x)*r;d.y=q.y-(q.y-d.y)*r;d.k=k;donusumUygula()},{passive:false});
  tv.addEventListener('pointerdown',e=>{if(!$('#tuval svg'))return;const d=e.target.closest('.d');const q=svgNokta(e);tv.setPointerCapture(e.pointerId);
    if(d){sur={tur:'dugum',i:+d.dataset.i,x0:q.x,y0:q.y,oynadi:false}}else sur={tur:'kaydir',x0:q.x,y0:q.y,dx:GORUNUM.donusum.x,dy:GORUNUM.donusum.y,oynadi:false};tv.classList.add('surukle')});
  tv.addEventListener('pointermove',e=>{if(!$('#tuval svg'))return;if(!sur){const d=e.target.closest('.d');vurgula(d?+d.dataset.i:null);return}const q=svgNokta(e);const D=GORUNUM.donusum;
    if(Math.hypot(q.x-sur.x0,q.y-sur.y0)>3)sur.oynadi=true;if(!sur.oynadi)return;
    if(sur.tur==='kaydir'){D.x=sur.dx+(q.x-sur.x0);D.y=sur.dy+(q.y-sur.y0);donusumUygula()}
    else{const Y=GORUNUM.konum;Y.x[sur.i]=(q.x-D.x)/D.k;Y.y[sur.i]=(q.y-D.y)/D.k;if(!sur.raf){sur.raf=requestAnimationFrame(()=>{sur&&(sur.raf=0);agCiz();vurgula(sur?sur.i:null)})}}});
  const bitir=e=>{if(!sur)return;tv.classList.remove('surukle');const s=sur;sur=null;
    if(s.tur==='dugum'&&s.oynadi){/* elle düzenlenen konumu projeye yaz (geri alma kaydı tutmadan) */const p=P(),G=agG(),Y=GORUNUM.konum;p.gorsel.konum={anahtar:GORUNUM.anahtar,poz:Object.fromEntries(G.ids.map((id,i)=>[id,[+Y.x[i].toFixed(1),+Y.y[i].toFixed(1)]]))};kaydet();agCiz()}
    else if(!s.oynadi){GORUNUM.secili=s.tur==='dugum'?(GORUNUM.secili===s.i?null:s.i):null;agCiz()}};
  tv.addEventListener('pointerup',bitir);tv.addEventListener('pointercancel',bitir);tv.addEventListener('pointerleave',()=>{if(!sur)vurgula(null)});
  $('#aYak').onclick=()=>yakinlas(1.3);$('#aUzak').onclick=()=>yakinlas(1/1.3);$('#aSigdir').onclick=()=>{GORUNUM.donusum={k:1,x:0,y:0};donusumUygula()};
  const ar=$('#aAra');ar.oninput=()=>{GORUNUM.arama=ar.value;aramaVurgu(ar.value)};ar.onchange=()=>{const G=agG();const i=G.ad.findIndex(a=>adAnahtar(a)===adAnahtar(ar.value));if(i>=0){GORUNUM.secili=i;agCiz()}}}
function yakinlas(f){const d=GORUNUM.donusum;const cx=CW/2,cy=CH/2;const k=Math.min(8,Math.max(.4,d.k*f));const r=k/d.k;d.x=cx-(cx-d.x)*r;d.y=cy-(cy-d.y)*r;d.k=k;donusumUygula()}
/* fareyle üstüne gelinen düğüm ve komşuları öne çıkar */
function vurgula(i){const svg=$('#tuval svg');if(!svg)return;$$('#tuval .on').forEach(e=>e.classList.remove('on'));if(i==null){svg.classList.remove('vurgu');return}
  const G=agG();const K=new Set([i,...G.U[i].map(x=>x[0])]);svg.classList.add('vurgu');
  svg.querySelectorAll('.d,.et').forEach(e=>{if(K.has(+e.dataset.i))e.classList.add('on')});svg.querySelectorAll('.e').forEach(e=>{const k=(AGSVG?AGSVG.E:G.E)[+e.dataset.k];if(k&&(k.s===i||k.t===i))e.classList.add('on')})}
function aramaVurgu(m){const svg=$('#tuval svg');if(!svg)return;svg.querySelectorAll('.bul').forEach(e=>e.classList.remove('bul'));const q=katla(m.trim());if(!q)return;const G=agG();svg.querySelectorAll('.d').forEach(e=>{if(katla(G.ad[+e.dataset.i]).includes(q))e.classList.add('bul')})}
function seciliCiz(){const k=$('#aSecili');if(!k)return;const i=GORUNUM.secili;const G=agG();if(i==null||!G||i>=G.n){k.innerHTML='';return}dugumPaneli(k,i)}
/* ---------- Ayar paneli ---------- */
function agAyarCiz(){const p=P(),g=p.gorsel,G=agG();const ozK=p.ozellikler.filter(o=>o.tur==='kat'),ozS=p.ozellikler.filter(o=>o.tur==='sayi');
  const secim=(id,deger,L)=>`<select class="select select-sm w-full" id="${id}">${L.map(([v,a])=>`<option value="${esc(v)}" ${v===deger?'selected':''}>${esc(a)}</option>`).join('')}</select>`;
  const anah=(id,a,ipk,on,dis)=>`<label class="flex items-center justify-between gap-2 py-0.5 ${dis?'opacity-50':''}"><span class="flex items-center gap-1">${esc(a)}${ipk?ip(ipk):''}</span><input type="checkbox" class="toggle toggle-xs toggle-primary" id="${id}" ${on?'checked':''} ${dis?'disabled':''}></label>`;
  const renkL=[['topluluk',t('colorCommunity')],['cekirdek',t('colorCorePeriphery')],['bilesen',t('colorComponent')],...p.ozellikler.map(o=>['oz:'+o.k,o.ad]),['yok',t('colorNone')]];
  const boyL=[...olcuListesi().map(o=>[o.k,olcuAd(o.k)]),...ozS.map(o=>['oz:'+o.k,o.ad]),['esit',t('sizeEqual')]];
  const wmx=Math.max(1,...G.E.map(e=>e.w));const kal=agKalite();void ozK;
  $('#aAyar').innerHTML=`<h2 class="text-lg font-bold flex items-center gap-1">${esc(t('tabNetwork'))}${ip('agSekme')}</h2>
    <p class="ayar-baslik flex items-center gap-1">${esc(t('layout'))}${ip('yerlesim')}</p>${secim('gY',g.yerlesim,[['kuvvet',t('layoutForce')],['grup',t('layoutGroup')],['daire',t('layoutCircle')],['halka',t('layoutRings')],['harita',t('layoutMap')]])}${g.yerlesim==='harita'?haritaAyarHtml(secim):''}
    <div class="flex gap-1 mt-1.5"><button class="btn btn-xs flex-1" id="gYeni">${IK.yenile}<span>${esc(t('relayout'))}</span></button><button class="btn btn-xs flex-1" id="gSifir" ${p.gorsel.konum?'':'disabled'}>${esc(t('resetManual'))}</button></div>
    <p class="ayar-baslik flex items-center gap-1">${esc(t('colorBy'))}${ip('renk')}</p>${secim('gR',g.renk,renkL)}${g.sb?'':renkDuzenHtml()}
    <p class="ayar-baslik flex items-center gap-1">${esc(t('sizeBy'))}${ip('boyut')}</p>${secim('gB',g.boyut,boyL)}
    ${bayrakVar()?`<div class="mt-1.5">${anah('gBay',t('flags'),'bayrak',g.bayrak)}</div>`:''}
    <p class="ayar-baslik flex items-center gap-1">${esc(t('labels'))}${ip('etiket')}<span class="ml-auto rakam" id="gEtY">${g.etiket>=G.n?esc(t('all')):sayi(g.etiket)}</span></p><input type="range" class="range range-xs range-primary w-full" id="gEt" min="0" max="${Math.min(G.n,80)}" value="${Math.min(g.etiket,G.n,80)}">
    <p class="ayar-baslik flex items-center gap-1">${esc(t('style'))}${ip('stil')}</p><div class="grid grid-cols-4 gap-1" role="radiogroup">${['dergi','sunum','poster','koyu'].map(s=>`<button class="btn btn-xs ${g.stil===s?'btn-primary':'btn-ghost border-base-300'}" data-stil="${s}" role="radio" aria-checked="${g.stil===s}">${esc(t('style_'+s))}</button>`).join('')}</div>
    <div class="mt-1.5">${anah('gSb',t('blackWhite'),'siyahBeyaz',g.sb)}</div>
    <p class="ayar-baslik">${esc(t('ties'))}</p>${anah('gEg',t('curved'),'egri',g.egri)}${anah('gGr',t('grayBetween'),'griBag',g.gri)}${G.yonlu?anah('gOk',t('arrows'),'ok',g.ok):''}
    ${G.agirlikli?`<p class="flex items-center gap-1 mt-1">${esc(t('minWeight'))}${ip('esik')}<span class="ml-auto rakam" id="gEsY">${sayi(g.esik,Number.isInteger(g.esik)?0:2)}</span></p><input type="range" class="range range-xs w-full" id="gEs" min="0" max="${wmx}" step="${wmx>20?1:wmx/40}" value="${Math.min(g.esik,wmx)}">
      ${anah('gOm',t('backbone'),'omurga',p.omurga.acik)}${p.omurga.acik?`<label class="flex items-center justify-between gap-2"><span>α</span><select class="select select-xs w-24" id="gOmA">${[0.01,0.05,0.1,0.2,0.3].map(a=>`<option value="${a}" ${a===p.omurga.alfa?'selected':''}>${sayi(a,2)}</option>`).join('')}</select></label>`:''}`:''}
    <p class="ayar-baslik">${esc(t('groupsAndLegend'))}</p>${anah('gAl',t('groupAreas'),'grupAlan',g.alan)}${anah('gGa',t('groupNames'),'grupAd',g.gad)}${anah('gAc',t('legend'),'aciklama',g.aciklama)}${anah('gIm',t('toolMark'),'imzaYazi',g.imzaAcik)}${g.imzaAcik?'':imzaUyari()}
    <p class="ayar-baslik flex items-center gap-1">${esc(t('download'))}${ip('agIndir')}</p>
    <div class="grid grid-cols-2 gap-1"><button class="btn btn-sm" data-png="2008">${esc(t('pngSingle'))}</button><button class="btn btn-sm" data-png="4110">${esc(t('pngDouble'))}</button><button class="btn btn-sm" data-png="1920">${esc(t('pngSlides'))}</button><button class="btn btn-sm" id="gSvg">SVG</button></div>
    <button class="btn btn-sm btn-block mt-1" id="gHtml">${esc(t('interactiveHtml'))}</button>
    <p class="ayar-baslik flex items-center gap-1 mt-3">${esc(t('figSource'))}${ip('sekilKaynak')}</p><p class="text-xs text-base-content/75 leading-relaxed">${esc(SEKIL_KAYNAK[S.dil==='tr'?'tr':'en'])}</p>
    <div class="grid grid-cols-2 gap-1 mt-1"><button class="btn btn-xs" data-skop="tr">${esc(t('copyTr'))}</button><button class="btn btn-xs" data-skop="en">${esc(t('copyEn'))}</button></div>
    <div class="mt-5 pt-3 border-t border-base-300"><h3 class="font-bold flex items-center gap-1">${esc(t('quality'))}${ip('kalite')}</h3><ul class="mt-1 space-y-1 text-xs">${kal.map(([tur,m])=>`<li class="flex gap-1.5"><span class="${tur==='iyi'?'text-success':'text-warning'}" aria-hidden="true">${tur==='iyi'?'●':'▲'}</span><span>${esc(m)}</span></li>`).join('')}</ul></div>`;
  agAyarBagla()}
function agKalite(){const G=agG(),Y=GORUNUM.konum,g=P().gorsel;const L=[];if(!G||!Y)return L;
  if(Y.kesisim!=null)L.push([Y.kesisim<=G.m*.5?'iyi':'uyari',t('qCross',sayi(Y.kesisim))]);if(AGSVG&&AGSVG.gizli)L.push(['uyari',t('qHiddenLabels',sayi(AGSVG.gizli))]);
  const R=agOlc();if(R&&R.A.enBuyukOran<.9)L.push(['uyari',t('qComponents',sayi(R.A.bilesenSay),yuzde(R.A.enBuyukOran))]);
  if(G.n>150&&g.etiket>30)L.push(['uyari',t('qManyLabels')]);if(G.m>G.n*6&&!P().omurga.acik&&G.agirlikli)L.push(['uyari',t('qDense')]);
  const RG=renkGrubu();if(RG){const k=new Set(RG.grup.filter(x=>x!=null)).size;if(k>8)L.push(['uyari',t('qManyGroups',sayi(k))])}if(!g.sb&&RG)L.push(['iyi',t('qPalette')]);if(!L.some(x=>x[0]==='uyari'))L.push(['iyi',t('qOk')]);return L}
function agAyarBagla(){const p=P(),g=p.gorsel;const yaz=(fn,yeniYer)=>{fn();if(yeniYer)GORUNUM.konum=null;kaydet();agCiz();agAyarCiz()};
  $('#gY').onchange=e=>yaz(()=>{g.yerlesim=e.target.value;g.konum=null},true);
  $('#gYeni').onclick=()=>yaz(()=>{g.tohum=(g.tohum||1)+1;g.konum=null},true);$('#gSifir').onclick=()=>yaz(()=>{g.konum=null},true);
  $('#gR').onchange=e=>yaz(()=>{g.renk=e.target.value},g.yerlesim!=='kuvvet');$('#gB').onchange=e=>yaz(()=>{g.boyut=e.target.value},g.yerlesim!=='kuvvet');
  const et=$('#gEt');et.oninput=()=>{const G=agG();g.etiket=+et.value>=Math.min(G.n,80)?G.n:+et.value;$('#gEtY').textContent=g.etiket>=G.n?t('all'):sayi(g.etiket);clearTimeout(et._z);et._z=setTimeout(()=>{kaydet();agCiz()},60)};
  $$('[data-stil]').forEach(b=>b.onclick=()=>yaz(()=>{g.stil=b.dataset.stil}));
  const ac=(id,k)=>{const e=$('#'+id);if(e)e.onchange=()=>yaz(()=>{g[k]=e.checked},k==='aciklama')};ac('gBay','bayrak');haritaAyarBagla(yaz);ac('gSb','sb');ac('gEg','egri');ac('gGr','gri');ac('gOk','ok');ac('gAl','alan');ac('gGa','gad');ac('gAc','aciklama');ac('gIm','imzaAcik');$$('[data-rk]').forEach(e=>e.onchange=()=>yaz(()=>{g.renkler=g.renkler||{};const m=g.renkler[g.renk]=g.renkler[g.renk]||{};m[e.dataset.rk]=e.value}));{const s=$('#rkSifirla');if(s)s.onclick=()=>yaz(()=>{if(g.renkler)delete g.renkler[g.renk]})};{const d=$('#rkAc');if(d)d.ontoggle=()=>{RENK_ACIK=d.open}};$$('[data-akop]').forEach(b=>b.onclick=()=>{const k=b.dataset.akop;kopyala(k==='apa'?atifMetinleri().apa:SEKIL_KAYNAK[k])});
  const es=$('#gEs');if(es)es.oninput=()=>{g.esik=+es.value;$('#gEsY').textContent=sayi(g.esik,Number.isInteger(g.esik)?0:2);clearTimeout(es._z);es._z=setTimeout(()=>{kaydet();agCiz()},60)};
  const om=$('#gOm');if(om)om.onchange=()=>{p.omurga.acik=om.checked;S.ver++;yaz(()=>{})};const oa=$('#gOmA');if(oa)oa.onchange=()=>{p.omurga.alfa=+oa.value;S.ver++;yaz(()=>{})};
  $$('[data-skop]').forEach(b=>b.onclick=()=>kopyala(SEKIL_KAYNAK[b.dataset.skop]));$$('[data-png]').forEach(b=>b.onclick=()=>agPng(+b.dataset.png));$('#gSvg').onclick=()=>{indir(dosyaAd(P().ad)+'-ag.svg',new Blob([svgDisa(agDisaSvg(),false)],{type:'image/svg+xml'}));tost(t('downloaded'))};
  $('#gHtml').onclick=agHtml}
/* dışa aktarılan çizim: yakınlaştırma ve seçim olmadan */
function agDisaSvg(o={}){const Y=yerlesimAl();const A=agCizimAyar(o);return agSvg(A.G,Y,A.deger,A.grup,{...A.ayar,...o}).svg}
async function agPng(px){try{const s=svgDisa(agDisaSvg());const r=await svgPng(s,px/CW);const dpi=px===1920?150:600;const b=await pngDpi(r.blob,dpi);indir(dosyaAd(P().ad)+`-ag-${px}px.png`,b);tost(t('downloaded'))}catch(e){tost(t('pngFail'),'error')}}
function agHtml(){const p=P();const s=agDisaSvg({ipucu:true});const G=agG();const komsu=JSON.stringify(G.U.map(L=>L.map(x=>x[0])));const kenar=JSON.stringify(agCizimAyar().G.E.map(e=>[e.s,e.t]));
  const html=`<!DOCTYPE html><html lang="${S.dil}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.ad)}</title><style>${yaziSvgStil().replace(/<\/?style>/g,'')}body{margin:0;font-family:"Ag Metin",Helvetica,Arial,sans-serif;background:${STILLER[p.gorsel.stil].zemin}}svg{width:100vw;height:100vh;display:block}svg.v .h,svg.v .e,svg.v .d,svg.v .et,svg.v .ga{opacity:.07}svg.v .on{opacity:1!important}.d{cursor:pointer}p{position:fixed;left:12px;bottom:6px;font-size:12px;color:#6b7280;margin:0}</style></head><body>${s}<p>${esc(t('htmlNote'))}</p>
<script>(()=>{const K=${komsu},E=${kenar};const svg=document.querySelector('svg'),g=svg.querySelector('.sah');let k=1,x=0,y=0,s=null;const u=()=>g.setAttribute('transform','translate('+x+','+y+') scale('+k+')');
const nk=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())};
svg.addEventListener('wheel',e=>{e.preventDefault();const q=nk(e),f=Math.exp(-e.deltaY*.0015),n=Math.min(8,Math.max(.4,k*f)),r=n/k;x=q.x-(q.x-x)*r;y=q.y-(q.y-y)*r;k=n;u()},{passive:false});
svg.addEventListener('pointerdown',e=>{const q=nk(e);s={x:q.x,y:q.y,a:x,b:y}});svg.addEventListener('pointerup',()=>s=null);
svg.addEventListener('pointermove',e=>{if(s){const q=nk(e);x=s.a+q.x-s.x;y=s.b+q.y-s.y;u();return}const d=e.target.closest('.d');svg.querySelectorAll('.on').forEach(z=>z.classList.remove('on'));if(!d){svg.classList.remove('v');return}const i=+d.dataset.i,S=new Set([i,...K[i]]);svg.classList.add('v');
svg.querySelectorAll('.d,.et').forEach(z=>{if(S.has(+z.dataset.i))z.classList.add('on')});svg.querySelectorAll('.e').forEach(z=>{const c=E[+z.dataset.k];if(c&&(c[0]===i||c[1]===i))z.classList.add('on')})})})()<\/script></body></html>`;
  indir(dosyaAd(p.ad)+'-ag.html',new Blob([html],{type:'text/html'}));tost(t('downloaded'))}

/* ---------- Harita ayarları ---------- */
function bayrakVar(){const G=agG();if(!G||!COG.d)return false;const g=P().gorsel;const e=g.yerlesim==='harita'?g.harita.eslesme:'ad';return bayraklar(G,e).filter(Boolean).length>=Math.max(1,G.n*.3)}
function haritaAyarHtml(secim){const p=P(),h=p.gorsel.harita;const ozK=p.ozellikler,ozS=p.ozellikler.filter(o=>o.tur==='sayi');if(!COG.d)return `<p class="text-xs text-error mt-1">${esc(t('mapNoData'))}</p>`;
  const Y=GORUNUM.konum&&GORUNUM.konum.harita?GORUNUM.konum:null;const G=agG();const eks=Y?Y.eksik:[];
  return `<div class="mt-2 pl-2 border-l-2 border-primary/40 space-y-1.5">
    <p class="ayar-baslik mt-0 flex items-center gap-1">${esc(t('mapType'))}${ip('haritaTur')}</p>${secim('hT',h.tur,[['dunya',t('mapWorld')],['kita',t('mapContinent')],['bolge',t('mapRegions')],['koord',t('mapCoords')],['ozel',t('mapCustom')]])}
    ${h.tur==='kita'?secim('hK',h.kita,KITALAR.map(k=>[k,t('kita_'+k.replace(' ','_'))])):''}
    ${h.tur==='bolge'?secim('hU',h.ulke,bolgeUlkeleri().map(u=>[u.a3,`${u.ad} (${u.n})`])):''}
    ${h.tur==='koord'?`<div class="grid grid-cols-2 gap-1"><label class="text-xs">${esc(t('latitude'))}${secim('hLa',h.enlem,[['',t('choose')],...ozS.map(o=>['oz:'+o.k,o.ad])])}</label><label class="text-xs">${esc(t('longitude'))}${secim('hLo',h.boylam,[['',t('choose')],...ozS.map(o=>['oz:'+o.k,o.ad])])}</label></div>`:''}
    ${h.tur==='ozel'?`<button class="btn btn-xs btn-block" id="hGeo">${IK.ice}<span>${esc(h.geo?t('geoReplace'):t('geoLoad'))}</span></button>${h.geo?`<label class="text-xs block">${esc(t('geoField'))}${secim('hGA',h.geoAlan||'',[['',t('auto')],...[...new Set((h.geo.features||[]).flatMap(f=>Object.keys(f.properties||{})))].slice(0,60).map(k=>[k,k])])}</label>`:''}`:''}
    ${h.tur!=='koord'?`<p class="ayar-baslik flex items-center gap-1">${esc(t('mapMatch'))}${ip('haritaEslesme')}</p>${secim('hE',h.eslesme,[['ad',t('nodeName')],...ozK.map(o=>['oz:'+o.k,o.ad])])}`:''}
    ${Y?`<p class="text-xs ${eks.length?'text-warning':'text-success'}">${esc(eks.length?t('mapUnmatched',sayi(eks.length),sayi(G.n)):t('mapAllMatched'))}</p>${eks.length?`<p class="text-xs text-base-content/70 max-h-20 overflow-auto">${esc(eks.slice(0,40).map(i=>G.ad[i]).join(', '))}${eks.length>40?' …':''}</p>`:''}`:''}</div>`}
function haritaAyarBagla(yaz){const p=P(),h=p.gorsel.harita;const deg=(id,k)=>{const e=$('#'+id);if(e)e.onchange=()=>yaz(()=>{h[k]=e.value;p.gorsel.konum=null},true)};
  deg('hT','tur');deg('hK','kita');deg('hU','ulke');deg('hLa','enlem');deg('hLo','boylam');deg('hE','eslesme');deg('hGA','geoAlan');
  const gb=$('#hGeo');if(gb)gb.onclick=async()=>{const f=await dosyaOku('.geojson,.json');if(!f)return;try{const j=JSON.parse(await f.text());if(j.type!=='FeatureCollection'||!Array.isArray(j.features))throw 0;
    const sade={type:'FeatureCollection',features:j.features.filter(x=>x&&x.geometry).map(x=>({type:'Feature',properties:x.properties||{},geometry:x.geometry}))};if(JSON.stringify(sade).length>15e6){tost(t('geoTooBig'),'warning');return}
    yaz(()=>{h.geo=sade;h.geoAlan='';p.gorsel.konum=null},true);tost(t('geoLoaded',sayi(sade.features.length)))}catch(e){tost(t('geoBad'),'error')}}}
