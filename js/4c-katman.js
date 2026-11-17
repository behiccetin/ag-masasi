/* ====================== KATMANLI YERLEŞİM ======================
   Düğümler katmanlara (sütun ya da satır) dizilir: tedarik zinciri, üretim aşamaları, örgüt kademeleri gibi.
   Katman kaynağı p.gorsel.katman = {oz, sira, yon}:
     oz   : katmanı belirleyen kategorik özelliğin anahtarı; boşsa katmanlar bağ yönünden kendiliğinden çıkarılır
            (yönlü ağda her düğüm, kendisine ulaşan en uzun yolun uzunluğu kadar sağa; yönsüzde en çok bağlı düğümden uzaklığa göre)
     sira : katman adlarının sırası (boş katmanlar da tutulur, böylece yeni katman önceden açılabilir)
     yon  : 'yatay' (soldan sağa) ya da 'dikey' (yukarıdan aşağıya)
   Katman içindeki sıra, bağ kesişmelerini azaltmak için ağırlık merkezi (barycenter) yöntemiyle aşağı-yukarı taranarak bulunur
   (Sugiyama, Tagawa ve Toda, 1981). */
function katmanAyar(p=P()){const k=p.gorsel.katman;const oz=k&&k.oz&&p.ozellikler.some(o=>o.k===k.oz&&o.tur!=='sayi')?k.oz:'';
  return {oz,sira:k&&Array.isArray(k.sira)?k.sira.filter(x=>typeof x==='string'):[],yon:k&&k.yon==='dikey'?'dikey':'yatay'}}
/* yönlü ağda en uzun yol katmanlaması; döngüler DFS geri bağları atılarak kırılır */
function otoKatman(G){const n=G.n,kat=new Array(n).fill(0);if(!n)return kat;
  if(G.yonlu){const durum=new Uint8Array(n),geri=new Set();
    for(let s=0;s<n;s++){if(durum[s])continue;const yigin=[[s,0]];durum[s]=1;
      while(yigin.length){const top=yigin[yigin.length-1],[v,k]=top;if(k<G.out[v].length){top[1]++;const u=G.out[v][k][0];if(durum[u]===1)geri.add(v+'>'+u);else if(!durum[u]){durum[u]=1;yigin.push([u,0])}}else{durum[v]=2;yigin.pop()}}}
    const gir=new Array(n).fill(0);for(let v=0;v<n;v++)for(const [u] of G.out[v])if(u!==v&&!geri.has(v+'>'+u))gir[u]++;
    const Q=[];for(let v=0;v<n;v++)if(!gir[v])Q.push(v);
    for(let b=0;b<Q.length;b++){const v=Q[b];for(const [u] of G.out[v]){if(u===v||geri.has(v+'>'+u))continue;kat[u]=Math.max(kat[u],kat[v]+1);if(--gir[u]===0)Q.push(u)}}
    /* yalnız giden bağı olanları, hedeflerinin bir öncesine çek: kaynaklar sıkışık durmasın */
    for(let v=0;v<n;v++)if(!G.inn[v].length&&G.out[v].length){const m=Math.min(...G.out[v].filter(([u])=>u!==v).map(([u])=>kat[u]));if(isFinite(m)&&m-1>kat[v])kat[v]=m-1}
    return kat}
  const goruldu=new Uint8Array(n);const sira=Array.from({length:n},(_,i)=>i).sort((a,b)=>G.U[b].length-G.U[a].length);
  for(const s of sira){if(goruldu[s])continue;goruldu[s]=1;kat[s]=0;const Q=[s];for(let b=0;b<Q.length;b++){const v=Q[b];for(const [u] of G.U[v])if(!goruldu[u]){goruldu[u]=1;kat[u]=kat[v]+1;Q.push(u)}}}
  return kat}
/* her düğümün katman sırası ve katman adları */
function katmanBilgi(p=P(),G=agG()){const A=katmanAyar(p);
  if(!A.oz){const k=otoKatman(G);const L=k.length?Math.max(...k)+1:0;return {kat:k,adlar:Array.from({length:L},(_,i)=>t('layerN',i+1)),oz:'',yon:A.yon,bos:false}}
  const deger=G.ids.map(id=>{const d=p.dugumler.find(x=>x.id===id);const v=d?d.oz[A.oz]:null;return v==null?'':String(v).trim()});
  const adlar=[...new Set(A.sira.map(s=>s.trim()).filter(Boolean))];const anahtar=new Map(adlar.map((a,i)=>[adAnahtar(a),i]));
  /* sırası belirlenmemiş katmanlar akış yönüne göre dizilir: düğümlerinin kendiliğinden katman ortalaması küçük olan önce (içe aktarılan veride buğday, değirmen, fabrika... sırası kendiliğinden çıkar) */
  let yeni=[...new Set(deger.filter(v=>v&&!anahtar.has(adAnahtar(v))))];if(yeni.length>1){const ok=otoKatman(G),top=new Map();deger.forEach((v,i)=>{if(!v)return;const e=top.get(v)||[0,0];e[0]+=ok[i];e[1]++;top.set(v,e)});const ort=v=>{const e=top.get(v);return e?e[0]/e[1]:0};yeni.sort((a,b)=>ort(a)-ort(b)||a.localeCompare(b,S.dil))}yeni.forEach(v=>{anahtar.set(adAnahtar(v),adlar.length);adlar.push(v)});
  const bos=deger.some(v=>!v);const kat=deger.map(v=>v?anahtar.get(adAnahtar(v)):adlar.length);if(bos)adlar.push(t('layerNone'));
  return {kat,adlar,oz:A.oz,yon:A.yon,bos}}
/* yerleşim önbelleği için: katman ataması değişince yeniden yerleşir, ad değişince yerleşmez */
function katmanParmakIzi(p=P(),G=agG()){const B=katmanBilgi(p,G);return B.yon+'|'+B.adlar.length+'|'+B.kat.join(',')}
function katmanYerlesim(G,alan,B=katmanBilgi(P(),G),rad=null,bosluk=0){const n=G.n,L=Math.max(1,B.adlar.length);const kat=B.kat;
  const katlar=Array.from({length:L},()=>[]);for(let i=0;i<n;i++)katlar[kat[i]].push(i);
  /* başlangıç sırası: dereceye göre, sonra ağırlık merkezi taramaları */
  katlar.forEach(K=>K.sort((a,b)=>G.U[b].length-G.U[a].length||a-b));const yer=new Float64Array(n);
  const konumla=()=>katlar.forEach(K=>K.forEach((v,z)=>{yer[v]=K.length>1?z/(K.length-1):.5}));konumla();
  const tara=(k,komsuKat)=>{const K=katlar[k];if(K.length<2)return;const m=new Map();
    for(const v of K){let s=0,a=0;for(const [u,w] of G.U[v])if(kat[u]===komsuKat){s+=yer[u]*w;a+=w}m.set(v,a?s/a:yer[v])}
    K.sort((x,y)=>m.get(x)-m.get(y)||yer[x]-yer[y]);K.forEach((v,z)=>{yer[v]=z/(K.length-1)})};
  for(let it=0;it<12;it++){for(let k=1;k<L;k++)tara(k,k-1);for(let k=L-2;k>=0;k--)tara(k,k+1)}
  const x=new Array(n),y=new Array(n),baslik=[];const dikey=B.yon==='dikey';
  const X0=alan.x0+(dikey?24:70),X1=alan.x1-(dikey?24:70),Y0=alan.y0+(dikey?44:46),Y1=alan.y1-24;
  for(let k=0;k<L;k++){const K=katlar[k];const a=L>1?k/(L-1):.5;
    /* ardışık iki düğüm arasında en az: iki yarıçap + pay (yatayda etiket yüksekliği) + ek boşluk; sığmazsa sütun alanın dışına taşar, Sığdır ile görülür */
    const dizi=(adim,enAz)=>{const z=[0];for(let j=1;j<K.length;j++){const r=rad?rad[K[j-1]]+rad[K[j]]:0;z.push(z[j-1]+Math.max(adim,r+4+bosluk,enAz+bosluk))}return z};
    if(!dikey){const cx=X0+a*(X1-X0);baslik.push({x:cx,y:0,m:B.adlar[k]||'',hiza:'middle'});const z=dizi(K.length>1?Math.min(70,(Y1-Y0)/(K.length-1)):0,14),ust=(Y0+Y1)/2-z[z.length-1]/2;K.forEach((v,j)=>{x[v]=cx;y[v]=Math.max(Y0,ust)+z[j]})}
    else{const cy=Y0+a*(Y1-Y0);baslik.push({x:alan.x0,y:cy-26,m:B.adlar[k]||'',hiza:'start'});const z=dizi(K.length>1?Math.min(90,(X1-X0)/(K.length-1)):0,0),sol=(X0+X1)/2-z[z.length-1]/2;K.forEach((v,j)=>{x[v]=Math.max(X0,sol)+z[j];y[v]=cy})}}
  if(!dikey){const ust=n?Math.min(...y):Y0;const hy=Math.max(alan.y0+8,ust-34);baslik.forEach(b=>{b.y=hy})}
  const P_={x,y};return {x,y,kesisim:bagKesisim(P_,G.E),baslik}}

/* renk, katmanı belirleyen özellikse açıklama ve renkler katman sırasını izler */
function katmanRenkSira(g,G){if(g.yerlesim!=='katman')return null;const A=katmanAyar();if(!A.oz||g.renk!=='oz:'+A.oz)return null;return katmanBilgi(P(),G).adlar}
/* ---------- ayar paneli (Ağ sekmesi, Yerleşim: Katmanlı) ---------- */
function katmanAyarHtml(secim){const p=P(),G=agG(),A=katmanAyar(p),B=katmanBilgi(p,G);const katOz=p.ozellikler.filter(o=>o.tur!=='sayi');
  const say=new Array(B.adlar.length).fill(0);B.kat.forEach(k=>say[k]++);
  let h=`<div class="mt-2 space-y-2 border-l-2 border-base-300 pl-2">
    <label class="block text-xs text-base-content/70"><span class="flex items-center gap-0.5">${esc(t('layerSource'))}${ip('katmanOz')}</span>${secim('kKaynak',A.oz,[['',t('layerAuto')],...katOz.map(o=>[o.k,o.ad])])}</label>
    <label class="block text-xs text-base-content/70"><span class="flex items-center gap-0.5">${esc(t('layerDirection'))}${ip('katmanYon')}</span>${secim('kYon',A.yon,[['yatay',t('layerLeftRight')],['dikey',t('layerTopDown')]])}</label>`;
  if(!A.oz){h+=`<p class="text-xs text-base-content/70 leading-relaxed">${esc(t('layerAutoNote',sayi(B.adlar.length)))}</p><button class="btn btn-xs w-full" id="kOlustur">${esc(t('layerMakeEditable'))}</button>`}
  else{h+=`<p class="text-xs text-base-content/70 flex items-center gap-0.5">${esc(t('layerList'))}${ip('katmanListe')}</p><ol class="space-y-1" id="kListe">${B.adlar.map((a,k)=>{const bosK=B.bos&&k===B.adlar.length-1;return `<li class="flex items-center gap-1"><span class="rakam text-xs w-4 text-right text-base-content/60">${k+1}</span>
      ${bosK?`<span class="flex-1 text-xs italic text-base-content/70 px-1">${esc(a)}</span>`:`<input class="input input-xs flex-1 min-w-0" data-kad="${k}" value="${esc(a)}" aria-label="${esc(t('layerNameN',k+1))}">`}
      <span class="badge badge-ghost badge-sm rakam" title="${esc(t('layerCount'))}">${sayi(say[k])}</span>
      ${bosK?'':`${k===0?'<span class="inline-block w-6 shrink-0"></span>':`<button class="btn btn-ghost btn-xs btn-square" data-kyukari="${k}" aria-label="${esc(t('moveUp'))}" title="${esc(t('moveUp'))}">↑</button>`}${k>=B.adlar.length-1-(B.bos?1:0)?'<span class="inline-block w-6 shrink-0"></span>':`<button class="btn btn-ghost btn-xs btn-square" data-kasagi="${k}" aria-label="${esc(t('moveDown'))}" title="${esc(t('moveDown'))}">↓</button>`}
      ${say[k]?'':`<button class="btn btn-ghost btn-xs btn-square hover:text-error" data-ksil="${k}" aria-label="${esc(t('layerDelete'))}" title="${esc(t('layerDelete'))}">×</button>`}`}</li>`}).join('')}</ol>
    <div class="flex gap-1"><input class="input input-xs flex-1 min-w-0" id="kYeni" placeholder="${esc(t('layerNewPh'))}" aria-label="${esc(t('layerNewPh'))}"><button class="btn btn-xs" id="kEkle">${esc(t('add'))}</button></div>
    <p class="text-xs text-base-content/60 leading-relaxed">${esc(t('layerAssignNote'))}</p>`}
  return h+'</div>'}
function katmanAyarBagla(){const p=P(),g=p.gorsel;const A=katmanAyar(p);
  const kay=(fn)=>islem(()=>{fn();g.konum=null;GORUNUM.konum=null});
  const ks=$('#kKaynak');if(ks)ks.onchange=()=>kay(()=>{const oz=ks.value;g.katman={...A,oz,sira:oz?katmanBilgi({...p,gorsel:{...g,katman:{oz,sira:[],yon:A.yon}}},agG()).adlar.filter(a=>a!==t('layerNone')):[]}});
  const ky=$('#kYon');if(ky)ky.onchange=()=>kay(()=>{g.katman={...A,yon:ky.value}});
  const ko=$('#kOlustur');if(ko)ko.onclick=()=>{const G=agG(),B=katmanBilgi(p,G);kay(()=>{let o=p.ozellikler.find(x=>adAnahtar(x.ad)===adAnahtar(t('layerAttrName')));if(!o||o.tur==='sayi'){o={k:'o'+uid(),ad:t('layerAttrName'),tur:'kat'};p.ozellikler.push(o)}
      G.ids.forEach((id,i)=>{const d=p.dugumler.find(x=>x.id===id);if(d)d.oz[o.k]=B.adlar[B.kat[i]]});g.katman={oz:o.k,sira:B.adlar.slice(),yon:A.yon};gunlukEkle(t('logLayerAttr',o.ad))});tost(t('layerMadeEditable'))};
  if(!A.oz)return;const B=katmanBilgi(p,agG());const sira=B.adlar.filter((a,k)=>!(B.bos&&k===B.adlar.length-1));
  $$('[data-kad]').forEach(e=>e.onchange=()=>{const k=+e.dataset.kad,eski=sira[k],yeni=e.value.trim();if(!yeni||yeni===eski){e.value=eski;return}
    if(sira.some((a,z)=>z!==k&&adAnahtar(a)===adAnahtar(yeni))){tost(t('layerDup'),'warning');e.value=eski;return}
    islem(()=>{p.dugumler.forEach(d=>{if(d.oz[A.oz]!=null&&adAnahtar(String(d.oz[A.oz]).trim())===adAnahtar(eski))d.oz[A.oz]=yeni});const s=sira.slice();s[k]=yeni;g.katman={...A,sira:s};gunlukEkle(t('logLayerRename',eski,yeni))})});
  const tasi=(k,d)=>kay(()=>{const s=sira.slice();[s[k],s[k+d]]=[s[k+d],s[k]];g.katman={...A,sira:s}});
  $$('[data-kyukari]').forEach(b=>b.onclick=()=>tasi(+b.dataset.kyukari,-1));$$('[data-kasagi]').forEach(b=>b.onclick=()=>tasi(+b.dataset.kasagi,1));
  $$('[data-ksil]').forEach(b=>b.onclick=()=>kay(()=>{const s=sira.slice();s.splice(+b.dataset.ksil,1);g.katman={...A,sira:s}}));
  const ekle=()=>{const e=$('#kYeni'),v=e.value.trim();if(!v)return;if(sira.some(a=>adAnahtar(a)===adAnahtar(v))){tost(t('layerDup'),'warning');return}kay(()=>{g.katman={...A,sira:[...sira,v]};gunlukEkle(t('logLayerAdd',v))});tost(t('layerAdded',v))};
  $('#kEkle').onclick=ekle;$('#kYeni').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();ekle()}}}
