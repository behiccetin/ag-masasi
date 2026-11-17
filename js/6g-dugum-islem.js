/* ====================== AĞ SEKMESİ: SEÇİLİ DÜĞÜM ÜZERİNDE İŞLEMLER ======================
   Düğüme tıklayınca açılan kart: bilgi, komşular (tıklayınca o düğüme geçer, × ile bağ silinir), ad ve özellik düzenleme,
   düğüme özel renk, boyut ve etiket, bağ ekleme, ortalama ve silme. Bütün değişiklikler geri alınabilir.
   Bağ yapısını değiştiren işlemlerde öteki düğümlerin ekrandaki yeri korunur. */
const DUGUM_PANEL={duzenle:false};
/* bağ yapısını değiştiren bir işlemi, ekrandaki konumları koruyarak uygular */
function konumKoruyarak(fn,haric=[]){const p=P(),Y=GORUNUM.konum,G0=agG();
  const poz=Y&&G0&&Y.x&&Y.x.length===G0.n?Object.fromEntries(G0.ids.map((id,i)=>[id,[+Y.x[i].toFixed(1),+Y.y[i].toFixed(1)]])):null;
  return islem(()=>{const r=fn();if(poz&&p.aktif){const G=agKur(p);if(G&&G.n){const kal={};G.ids.forEach(id=>{if(poz[id]&&!haric.includes(id))kal[id]=poz[id]});p.gorsel.konum={anahtar:yerlesimAnahtar(p,G),poz:kal}}}return r})}
function dugumOzelAl(id){const D=P().gorsel.dugum;return (D&&D[id])||{}}
function dugumOzelKoy(id,anahtar,deger){const g=P().gorsel;islem(()=>{if(!g.dugum)g.dugum={};const x={...(g.dugum[id]||{})};if(deger==null||deger===''||deger===1)delete x[anahtar];else x[anahtar]=deger;
  if(Object.keys(x).length)g.dugum[id]=x;else delete g.dugum[id];if(!Object.keys(g.dugum).length)delete g.dugum})}
async function dugumSilAg(i){const p=P(),d=p.dugumler[i];if(!d)return;const n=p.iliskiler.reduce((s,r)=>s+r.kenarlar.filter(k=>k[0]===d.id||k[1]===d.id).length,0);
  if(!(await sor(n?t('deleteNodeQ',d.ad,sayi(n)):t('deleteNodeQ0',d.ad),t('delete'),true)))return;GORUNUM.secili=null;
  konumKoruyarak(()=>{p.dugumler=p.dugumler.filter(x=>x!==d);p.iliskiler.forEach(r=>r.kenarlar=r.kenarlar.filter(k=>k[0]!==d.id&&k[1]!==d.id));if(p.gorsel.dugum){delete p.gorsel.dugum[d.id];if(!Object.keys(p.gorsel.dugum).length)delete p.gorsel.dugum}gunlukEkle(t('logNodeDel',d.ad))});tost(t('nodeDeleted',d.ad))}
/* düğümü başka katmana taşır; elle yerleştirilmiş öteki düğümler yerinde kalır, taşınan düğüm yeni katmanında yerini alır */
function dugumKatmanKoy(d,oz,v){const Y=GORUNUM.konum,p=P();const yaz=()=>{if(v)d.oz[oz]=v;else delete d.oz[oz];gunlukEkle(t('logNodeLayer',d.ad,v||t('layerNone')))};
  if(Y&&Y.elle)konumKoruyarak(yaz,[d.id]);else islem(yaz)}
function dugumOrtala(i){const Y=GORUNUM.konum;if(!Y)return;const d=GORUNUM.donusum;const k=Math.max(d.k,2);d.k=k;d.x=CW/2-Y.x[i]*k;d.y=CH/2-Y.y[i]*k;donusumUygula()}
function dugumPaneli(k,i){const p=P(),G=agG(),d=p.dugumler[i],R=agOlc(),T=agTop(),r=aktifIliski(),oz=dugumOzelAl(d.id);
  const sira=(v)=>{const s=[...v].sort((a,b)=>b-a);return s.indexOf(v[i])+1};
  const cik=new Set(G.out[i].map(x=>x[0])),gir=new Set(G.inn[i].map(x=>x[0]));
  const kom=G.U[i].map(([j,w])=>({j,w})).sort((a,b)=>b.w-a.w||G.ad[a.j].localeCompare(G.ad[b.j],S.dil));
  const yon=j=>!G.yonlu?'':cik.has(j)&&gir.has(j)?'↔ ':cik.has(j)?'→ ':'← ';
  const KO=(()=>{if(p.gorsel.yerlesim!=='katman')return null;const A=katmanAyar(p);if(!A.oz)return null;const B=katmanBilgi(p,G);return {oz:A.oz,adlar:B.adlar.filter((a,k)=>!(B.bos&&k===B.adlar.length-1))}})();
  const RG=renkGrubu();const varsayilanRenk=(()=>{const L=renkListesi?renkListesi():[];const g=RG&&RG.grup?RG.grup[i]:null;const x=L.find(y=>String(y.g)===String(g));return x?x.renk:STILLER[p.gorsel.stil].palet[0]})();
  const sec=(id,v,L)=>`<select class="select select-xs w-full" id="${id}">${L.map(([a,b])=>`<option value="${a}" ${String(a)===String(v)?'selected':''}>${esc(b)}</option>`).join('')}</select>`;
  const satir=(et,ic,ipk)=>`<label class="grid grid-cols-[6.5rem_1fr] items-center gap-2"><span class="text-base-content/70 flex items-center gap-0.5">${esc(et)}${ipk||''}</span>${ic}</label>`;
  k.innerHTML=`<div class="bg-base-100 border border-base-300 rounded-box p-3 text-sm shadow-sm max-h-[calc(100vh-14rem)] overflow-y-auto" role="dialog" aria-label="${esc(d.ad)}">
    <div class="flex items-start gap-1"><p class="font-bold dar text-lg flex-1 break-words">${esc(d.ad)}</p>${ip('dugumIslem')}<button class="btn btn-ghost btn-xs btn-square" id="aSecKapat" aria-label="${esc(t('close'))}" title="${esc(t('close'))}">×</button></div>
    <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 mt-1">${p.ozellikler.map(o=>d.oz[o.k]?`<dt class="text-base-content/60">${esc(o.ad)}</dt><dd>${esc(d.oz[o.k])}</dd>`:'').join('')}
    <dt class="text-base-content/60">${esc(olcuAd('derece'))}</dt><dd class="rakam">${sayi(R.D.derece[i])} <span class="text-base-content/50">(${esc(t('rankN',sayi(sira(R.D.derece))))})</span></dd>
    <dt class="text-base-content/60">${esc(olcuAd('arasindalik'))}</dt><dd class="rakam">${sd(R.D.arasindalik[i])} <span class="text-base-content/50">(${esc(t('rankN',sayi(sira(R.D.arasindalik))))})</span></dd>
    ${T?`<dt class="text-base-content/60">${esc(t('community'))}</dt><dd>${esc(toplulukAd(T.c[i]))}</dd>`:''}</dl>
    ${KO?`<label class="flex items-center gap-2 mt-2"><span class="text-base-content/70 flex items-center gap-0.5">${esc(t('layerOfNode'))}${ip('dugumKatman')}</span><select class="select select-xs flex-1" id="dKatman">${KO.adlar.map(a=>`<option value="${esc(a)}" ${adAnahtar(a)===adAnahtar(String(d.oz[KO.oz]??''))?'selected':''}>${esc(a)}</option>`).join('')}<option value="" ${String(d.oz[KO.oz]??'').trim()?'':'selected'}>${esc(t('layerNone'))}</option></select></label>`:''}
    <p class="text-xs text-base-content/60 mt-2 flex items-center gap-0.5">${esc(t('neighborsN',sayi(kom.length)))}${ip('komsuListe')}</p>
    <ul class="text-xs leading-relaxed max-h-28 overflow-auto flex flex-wrap gap-1 mt-1">${kom.slice(0,60).map(x=>`<li class="inline-flex items-center rounded-field border border-base-300"><button class="px-1.5 py-0.5 hover:bg-base-200 rounded-l-field" data-komsu="${x.j}" title="${esc(t('goToNode',G.ad[x.j]))}">${esc(yon(x.j)+G.ad[x.j])}${G.agirlikli&&x.w!==1?` <span class="text-base-content/55">(${sayi(x.w,Number.isInteger(x.w)?0:2)})</span>`:''}</button><button class="px-1 text-base-content/55 hover:text-error hover:bg-base-200 rounded-r-field" data-bagsil="${x.j}" aria-label="${esc(t('deleteTieWith',G.ad[x.j]))}" title="${esc(t('deleteTieWith',G.ad[x.j]))}">×</button></li>`).join('')}${kom.length>60?'<li class="px-1">…</li>':''}</ul>
    <div class="flex flex-wrap gap-1 mt-3"><button class="btn btn-xs" id="dOrtala" title="${esc(t('centerNodeTip'))}">${esc(t('centerNode'))}</button><button class="btn btn-xs btn-ghost text-error ml-auto" id="dSil" title="${esc(t('deleteNodeTip'))}">${esc(t('deleteNode'))}</button></div>
    <details class="mt-3 border-t border-base-300 pt-2" id="dDuzAc" ${DUGUM_PANEL.duzenle?'open':''}><summary class="cursor-pointer font-medium py-1">${esc(t('editNode'))}</summary>
      <div class="space-y-2 mt-2">
        ${satir(t('nodeName'),`<input class="input input-xs w-full" id="dAd" value="${esc(d.ad)}">`)}
        ${p.ozellikler.filter(o=>!KO||o.k!==KO.oz).map(o=>satir(o.ad,`<input class="input input-xs w-full" data-dpoz="${esc(o.k)}" value="${esc(d.oz[o.k]??'')}" ${o.tur==='sayi'?'inputmode="decimal"':''}>`)).join('')}
        <p class="text-xs font-medium text-base-content/70 pt-1">${esc(t('nodeLook'))}</p>
        ${satir(t('nodeColor'),`<span class="flex items-center gap-2"><input type="color" class="w-7 h-7 rounded border border-base-300 p-0 cursor-pointer bg-transparent" id="dRenk" value="${esc(oz.renk||varsayilanRenk)}" aria-label="${esc(t('nodeColor'))}" ${p.gorsel.sb?'disabled':''}>${oz.renk?`<button class="btn btn-xs btn-ghost" id="dRenkSifir">${esc(t('resetDefault'))}</button>`:''}</span>`,ip('dugumRenk'))}
        ${satir(t('nodeSizeF'),sec('dBoyut',oz.boyut||1,[0.5,0.75,1,1.5,2,3].map(a=>[a,a===1?t('sizeNormal'):(S.dil==='tr'?'%'+a*100:a*100+'%')])),ip('dugumBoyut'))}
        ${satir(t('nodeLabel'),sec('dEtiket',oz.etiket||'',[['',t('labelAuto')],['goster',t('labelAlways')],['gizle',t('labelHide')]]),ip('dugumEtiket'))}
        ${r?`<p class="text-xs font-medium text-base-content/70 pt-1 flex items-center gap-0.5">${esc(t('addTieTitle',r.ad))}${ip('bagEkleAg')}</p>
        <div class="flex items-center gap-1">${G.yonlu?`<select class="select select-xs w-24 shrink-0" id="dYon" aria-label="${esc(t('tieDirection'))}"><option value="cik">${esc(t('tieOut'))}</option><option value="gir">${esc(t('tieIn'))}</option><option value="iki">${esc(t('tieBoth'))}</option></select>`:''}
          <input class="input input-xs flex-1 min-w-0" id="dHedef" list="dl-agdug" placeholder="${esc(t('targetNode'))}" aria-label="${esc(t('targetNode'))}"></div>
        <div class="flex items-center gap-2">${p.agirlikli?`<label class="flex items-center gap-1 text-base-content/70">${esc(t('weight'))}<input class="input input-xs w-16" id="dAgirlik" value="1" inputmode="decimal"></label>`:''}<button class="btn btn-xs btn-primary ml-auto" id="dBagEkle">${esc(t('add'))}</button></div>`:''}
      </div></details></div>`;
  $('#aSecKapat').onclick=()=>{GORUNUM.secili=null;agCiz()};
  $('#dDuzAc').ontoggle=e=>{DUGUM_PANEL.duzenle=e.target.open};
  $$('#aSecili [data-komsu]').forEach(b=>b.onclick=()=>{GORUNUM.secili=+b.dataset.komsu;agCiz()});
  $$('#aSecili [data-bagsil]').forEach(b=>b.onclick=()=>{const j=+b.dataset.bagsil,a=d.id,c=G.ids[j];if(!r)return;konumKoruyarak(()=>{r.kenarlar=r.kenarlar.filter(x=>!((x[0]===a&&x[1]===c)||(x[0]===c&&x[1]===a)));gunlukEkle(t('logTieDel',d.ad,G.ad[j]))});tost(t('tieDeleted'))});
  $('#dOrtala').onclick=()=>dugumOrtala(i);
  $('#dSil').onclick=()=>dugumSilAg(i);
  $('#dAd').onchange=e=>{const v=e.target.value.trim();if(!v){e.target.value=d.ad;return}if(p.dugumler.some(x=>x!==d&&adAnahtar(x.ad)===adAnahtar(v))){tost(t('dupNodeName'),'warning');e.target.value=d.ad;return}const eski=d.ad;islem(()=>{d.ad=v;gunlukEkle(t('logNodeRename',eski,v))})};
  $$('#aSecili [data-dpoz]').forEach(e=>e.onchange=()=>{const o=p.ozellikler.find(x=>x.k===e.dataset.dpoz);if(!o)return;const v=e.value.trim();if(o.tur==='sayi'&&v&&sayiOku(v)==null){tost(t('notNumber'),'warning');e.value=d.oz[o.k]??'';return}islem(()=>{if(v)d.oz[o.k]=v;else delete d.oz[o.k]})});
  const dk=$('#dKatman');if(dk)dk.onchange=()=>dugumKatmanKoy(d,KO.oz,dk.value);
  $('#dRenk').onchange=e=>dugumOzelKoy(d.id,'renk',e.target.value);
  const rs=$('#dRenkSifir');if(rs)rs.onclick=()=>dugumOzelKoy(d.id,'renk',null);
  $('#dBoyut').onchange=e=>dugumOzelKoy(d.id,'boyut',+e.target.value);
  $('#dEtiket').onchange=e=>dugumOzelKoy(d.id,'etiket',e.target.value||null);
  const be=$('#dBagEkle');if(be){const ekle=()=>{const h=$('#dHedef').value.trim();if(!h){tost(t('needTwoNodes'),'warning');return}if(adAnahtar(h)===adAnahtar(d.ad)){tost(t('noSelfLoop'),'warning');return}
      const w=p.agirlikli?sayiOku($('#dAgirlik').value):1;if(w==null||w<=0){tost(t('weightPositive'),'warning');return}const yn=G.yonlu?$('#dYon').value:'cik';
      const K=yn==='gir'?[[h,d.ad,w]]:yn==='iki'?[[d.ad,h,w],[h,d.ad,w]]:[[d.ad,h,w]];
      const z=konumKoruyarak(()=>{const hd=p.dugumler.find(x=>adAnahtar(x.ad)===adAnahtar(h));if(hd){/* aynı bağ varsa yenisiyle değiştirilir */const ayni=(x,[a,b])=>{const A=a===d.ad?d.id:hd.id,B=b===d.ad?d.id:hd.id;return (x[0]===A&&x[1]===B)||(!p.yonlu&&x[0]===B&&x[1]===A)};r.kenarlar=r.kenarlar.filter(x=>!K.some(k=>ayni(x,k)))}
        const z=veriUygula({dugumler:[],kenarlar:K,ozellikler:[]},{hedef:r.id,agirlikKoru:true});gunlukEkle(t('logTieAdd',d.ad,h));return z});
      tost(z&&z.yeniDugum?t('nodesCreated',sayi(z.yeniDugum)):t('tieAdded'),z&&z.yeniDugum?'info':'success');const hh=$('#dHedef');if(hh)hh.focus()};
    be.onclick=ekle;$('#dHedef').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();ekle()}}}}
/* Delete: seçili düğümü sil; Esc: seçimi kaldır (yazı alanındayken çalışmaz) */
document.addEventListener('keydown',e=>{if(S.sekme!=='ag'||GORUNUM.secili==null)return;const el=document.activeElement;if(el&&el.closest('input,textarea,select,[contenteditable],dialog[open]'))return;if($('#pencere')&&$('#pencere').open)return;
  if(e.key==='Delete'){e.preventDefault();dugumSilAg(GORUNUM.secili)}else if(e.key==='Escape'&&!ipAcik){GORUNUM.secili=null;agCiz()}});
