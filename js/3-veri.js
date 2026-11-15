/* ====================== VERİ: İÇE AKTARMA, DIŞA AKTARMA, ÖRNEKLER ======================
   Bütün okuyucular ortak bir ara biçim döndürür:
   {dugumler:[{ad, oz:{}}], kenarlar:[[adA, adB, w]], ozellikler:[{k, ad, tur}], yonlu?:bool, uyarilar:[]} */
const adAnahtar=s=>katla(String(s??'').replace(/\s+/g,' ').trim());
function hucreMetin(v){return String(v??'').replace(/\s+/g,' ').trim()}
function basliktaMi(satir){/* ilk satırın sayısal olmayan iki hücresi varsa başlıktır */return satir.length>=2&&sayiOku(satir[0])==null&&sayiOku(satir[1])==null&&satir.slice(2).every(h=>sayiOku(h)==null||h==='')}

/* ---------- Kenar listesi: kaynak, hedef, [ağırlık] ---------- */
function kenarListesiOku(sat,o={}){const L=sat.filter(r=>r.some(h=>hucreMetin(h)!==''));if(!L.length)return null;const bas=o.baslik??basliktaMi(L[0]);const govde=bas?L.slice(1):L;const uy=[];
  const ad=new Map(),kenar=[];let gecersiz=0;for(const r of govde){const a=hucreMetin(r[0]),b=hucreMetin(r[1]);if(!a||!b){if(a&&!b){ad.set(adAnahtar(a),a)}continue}
    let w=1;if(r.length>2&&hucreMetin(r[2])!==''){const x=sayiOku(r[2]);if(x==null||x<=0){gecersiz++;continue}w=x}ad.set(adAnahtar(a),ad.get(adAnahtar(a))||a);ad.set(adAnahtar(b),ad.get(adAnahtar(b))||b);if(adAnahtar(a)===adAnahtar(b))continue;kenar.push([a,b,w])}
  if(gecersiz)uy.push(t('impBadWeight',sayi(gecersiz)));return {dugumler:[...ad.values()].map(a=>({ad:a,oz:{}})),kenarlar:kenar,ozellikler:[],uyarilar:uy}}
/* ---------- Komşuluk matrisi: ilk satır ve ilk sütun adlar ---------- */
function matrisOku(sat){const L=sat.filter(r=>r.some(h=>hucreMetin(h)!==''));if(L.length<2)return null;const sutun=L[0].slice(1).map(hucreMetin);const satir=L.slice(1).map(r=>hucreMetin(r[0]));
  const uy=[];if(sutun.length!==satir.length||sutun.some((a,i)=>adAnahtar(a)!==adAnahtar(satir[i])))uy.push(t('impMatrixOrder'));const ad=[...new Map([...satir,...sutun].filter(Boolean).map(a=>[adAnahtar(a),a])).values()];
  const kenar=[];let gecersiz=0;L.slice(1).forEach((r,i)=>{for(let j=1;j<r.length&&j<=sutun.length;j++){const h=hucreMetin(r[j]);if(h===''||h==='0')continue;const x=sayiOku(h);if(x==null){gecersiz++;continue}if(x<=0)continue;if(!satir[i]||!sutun[j-1]||adAnahtar(satir[i])===adAnahtar(sutun[j-1]))continue;kenar.push([satir[i],sutun[j-1],x])}});
  if(gecersiz)uy.push(t('impBadCells',sayi(gecersiz)));
  /* simetrik mi? yönlü öneri */let asim=0;const S=new Map(kenar.map(([a,b,w])=>[adAnahtar(a)+'\u0001'+adAnahtar(b),w]));for(const [a,b,w] of kenar)if(S.get(adAnahtar(b)+'\u0001'+adAnahtar(a))!==w)asim++;
  return {dugumler:ad.map(a=>({ad:a,oz:{}})),kenarlar:kenar,ozellikler:[],uyarilar:uy,simetrik:asim===0}}
/* ---------- İki modlu veri ve izdüşüm ----------
   Biçim 'matris': satırlar aktör, sütunlar olay (hücre sıfırdan büyükse üyelik). Biçim 'uzun': her satır aktör, olay. */
function izdusum(uyelik,yontem){/* uyelik: Map(aktörAd -> Set(olay)) ; olay -> aktörler */const olay=new Map();for(const [a,S] of uyelik)for(const e of S){if(!olay.has(e))olay.set(e,[]);olay.get(e).push(a)}
  const W=new Map();const ekle=(a,b,v)=>{const k=a<b?a+'\u0001'+b:b+'\u0001'+a;W.set(k,(W.get(k)||0)+v)};
  for(const L of olay.values()){const k=L.length;if(k<2)continue;const v=yontem==='newman'?1/(k-1):1;for(let i=0;i<k;i++)for(let j=i+1;j<k;j++)ekle(L[i],L[j],v)}
  const kenar=[];for(const [k,w] of W){const [a,b]=k.split('\u0001');let v=w;if(yontem==='jaccard'){const A=uyelik.get(a),B=uyelik.get(b);v=w/(A.size+B.size-w)}kenar.push([a,b,+v.toPrecision(12)])}return {kenar,olaySay:olay.size}}
function ikiModOku(sat,o={}){const L=sat.filter(r=>r.some(h=>hucreMetin(h)!==''));if(L.length<2)return null;const uyelik=new Map();const ad=new Map();
  const uye=(a,e)=>{const k=adAnahtar(a);if(!k||!e)return;ad.set(k,ad.get(k)||a);if(!uyelik.has(k))uyelik.set(k,new Set());uyelik.get(k).add(adAnahtar(e))};
  if(o.bicim==='uzun'){const bas=basliktaMi(L[0])&&o.baslik!==false;(bas?L.slice(1):L).forEach(r=>{let a=hucreMetin(r[0]),e=hucreMetin(r[1]);if(o.yon==='sutun')[a,e]=[e,a];uye(a,e)})}
  else{const olay=L[0].slice(1).map(hucreMetin);if(o.yon==='sutun'){L.slice(1).forEach(r=>{const e=hucreMetin(r[0]);for(let j=1;j<r.length;j++){const x=sayiOku(r[j]);if(x!=null&&x>0)uye(olay[j-1],e)}})}
    else L.slice(1).forEach(r=>{const a=hucreMetin(r[0]);for(let j=1;j<r.length;j++){const x=sayiOku(r[j]);if(x!=null&&x>0)uye(a,olay[j-1])}})}
  const z=izdusum(uyelik,o.yontem||'sayi');const ka=k=>ad.get(k);return {dugumler:[...ad.values()].map(a=>({ad:a,oz:{}})),kenarlar:z.kenar.map(([a,b,w])=>[ka(a),ka(b),w]),ozellikler:[],uyarilar:[],olaySay:z.olaySay,aktorSay:ad.size}}
/* ---------- Kaynakçadan ortak yazarlık ----------
   Yazar adı "Soyad, Ad" ya da "Ad Soyad" olabilir. Eşleştirme anahtarı: soyadı ve adın ilk harfi. */
function yazarAnahtar(y){y=String(y||'').replace(/[{}]/g,'').replace(/\s+/g,' ').trim();if(!y)return null;let soy,ad;if(y.includes(',')){[soy,ad]=y.split(',').map(s=>s.trim())}else{const p=y.split(' ');soy=p.pop();ad=p.join(' ')}
  const bas=(ad||'').replace(/[^\p{L}]/gu,'').charAt(0);const g=(soy||'').trim();if(!g)return null;return {k:adAnahtar(g)+'|'+katla(bas),ad:bas?`${g}, ${bas.toLocaleUpperCase('tr')}.`:g}}
function kaynakcaOku(metin,o={}){const b=bicimBul(metin);const okur={ris:risOku,bib:bibOku,nbib:nbibOku,wos:wosOku,enw:enwOku}[b];if(!okur)return null;const kayit=okur(metin);
  const uyelik=new Map(),ad=new Map(),yayin=new Map();let tek=0;kayit.forEach((r,i)=>{const Y=[...new Map((r.yazarlar||[]).map(yazarAnahtar).filter(Boolean).map(x=>[x.k,x])).values()];if(Y.length<2)tek++;
    Y.forEach(x=>{if(!ad.has(x.k))ad.set(x.k,x.ad);if(!uyelik.has(x.k))uyelik.set(x.k,new Set());uyelik.get(x.k).add('r'+i);yayin.set(x.k,(yayin.get(x.k)||0)+1)})});
  if(o.enAz>1)for(const [k,n] of yayin)if(n<o.enAz){uyelik.delete(k);ad.delete(k)}
  const z=izdusum(uyelik,o.yontem||'sayi');const uy=[];if(tek)uy.push(t('impSingleAuthor',sayi(tek)));
  return {dugumler:[...ad.entries()].map(([k,a])=>({ad:a,oz:{yayin:String(yayin.get(k))}})),kenarlar:z.kenar.map(([a,b,w])=>[ad.get(a),ad.get(b),w]),ozellikler:[{k:'yayin',ad:t('attrPubs'),tur:'sayi'}],uyarilar:uy,kayitSay:kayit.length,bicim:BICIM_AD[b]}}
/* ---------- Düğüm özellikleri tablosu ---------- */
function ozellikOku(sat){const L=sat.filter(r=>r.some(h=>hucreMetin(h)!==''));if(L.length<2)return null;const bas=L[0].map(hucreMetin);const govde=L.slice(1);
  const oz=bas.slice(1).map((a,j)=>{const v=govde.map(r=>hucreMetin(r[j+1])).filter(Boolean);const sayisal=v.length>0&&v.every(x=>sayiOku(x)!=null)&&new Set(v).size>Math.min(6,v.length*.5);return {k:'o'+uid(),ad:a||t('attrN',j+1),tur:sayisal?'sayi':'kat'}});
  return {dugumler:govde.map(r=>({ad:hucreMetin(r[0]),oz:Object.fromEntries(oz.map((o,j)=>[o.k,hucreMetin(r[j+1])]).filter(x=>x[1]!==''))})).filter(d=>d.ad),kenarlar:[],ozellikler:oz,uyarilar:[]}}

/* ---------- Başka programların dosyaları: Pajek, GEXF, GraphML, UCINET DL ---------- */
function pajekOku(m){const L=m.replace(/\r/g,'').split('\n');let bol='',yonlu=false;const ad=new Map(),kenar=[];let i=0;
  const tirnak=s=>{const r=[];s.replace(/"([^"]*)"|(\S+)/g,(_,a,b)=>{r.push(a!=null?a:b)});return r};
  for(const sat of L){const s=sat.trim();if(!s||s.startsWith('%'))continue;if(s.startsWith('*')){const k=s.toLowerCase();bol=k.startsWith('*vertices')?'v':k.startsWith('*arcslist')?'al':k.startsWith('*edgeslist')?'el':k.startsWith('*arcs')?'a':k.startsWith('*edges')?'e':'?';if(bol==='a'||bol==='al')yonlu=true;continue}
    const p=tirnak(s);if(bol==='v'){ad.set(p[0],p[1]??p[0])}else if(bol==='a'||bol==='e'){const w=p[2]!=null?sayiOku(p[2]):1;if(ad.get(p[0])==null)ad.set(p[0],p[0]);if(ad.get(p[1])==null)ad.set(p[1],p[1]);if(w>0&&p[0]!==p[1])kenar.push([ad.get(p[0]),ad.get(p[1]),w??1])}
    else if(bol==='al'||bol==='el'){for(const q of p.slice(1)){if(ad.get(q)==null)ad.set(q,q);if(p[0]!==q)kenar.push([ad.get(p[0]),ad.get(q),1])}}void i}
  return {dugumler:[...ad.values()].map(a=>({ad:String(a),oz:{}})),kenarlar:kenar,ozellikler:[],uyarilar:[],yonlu}}
function xmlAgOku(m){const d=new DOMParser().parseFromString(m,'application/xml');if(d.querySelector('parsererror'))return null;const kok=d.documentElement.localName;const E=(el,ad)=>[...el.getElementsByTagNameNS('*',ad)];
  if(kok==='gexf'){const g=E(d,'graph')[0];if(!g)return null;const yonlu=(g.getAttribute('defaultedgetype')||'undirected')==='directed';const tanim=new Map();E(g,'attribute').forEach(a=>{const ust=a.parentNode.getAttribute('class');if(ust==='node')tanim.set(a.getAttribute('id'),{k:'o'+uid(),ad:a.getAttribute('title')||a.getAttribute('id'),tur:/^(integer|long|float|double)$/.test(a.getAttribute('type'))?'sayi':'kat'})});
    const ad=new Map();const dug=E(g,'node').map(n=>{const id=n.getAttribute('id');const a=n.getAttribute('label')||id;ad.set(id,a);const oz={};E(n,'attvalue').forEach(v=>{const tn=tanim.get(v.getAttribute('for')||v.getAttribute('id'));if(tn)oz[tn.k]=v.getAttribute('value')});return {ad:a,oz}});
    const kenar=E(g,'edge').map(e=>[ad.get(e.getAttribute('source')),ad.get(e.getAttribute('target')),+(e.getAttribute('weight')||1)]).filter(e=>e[0]!=null&&e[1]!=null&&e[0]!==e[1]&&e[2]>0);
    return {dugumler:dug,kenarlar:kenar,ozellikler:[...tanim.values()],uyarilar:[],yonlu}}
  if(kok==='graphml'){const g=E(d,'graph')[0];if(!g)return null;const yonlu=(g.getAttribute('edgedefault')||'directed')==='directed';const anah=new Map();let agirlikK=null,etiketK=null;
    E(d,'key').forEach(k=>{const f=k.getAttribute('for'),n=k.getAttribute('attr.name')||k.getAttribute('id');if(f==='edge'&&/^(weight|ağırlık|agirlik)$/i.test(n))agirlikK=k.getAttribute('id');else if(f==='node'&&/^(label|name|ad)$/i.test(n))etiketK=k.getAttribute('id');else if(f==='node')anah.set(k.getAttribute('id'),{k:'o'+uid(),ad:n,tur:/^(int|long|float|double)$/.test(k.getAttribute('attr.type'))?'sayi':'kat'})});
    const ad=new Map();const dug=E(g,'node').map(n=>{const id=n.getAttribute('id');const oz={};let a=id;E(n,'data').forEach(v=>{const k=v.getAttribute('key');if(k===etiketK)a=v.textContent.trim()||id;else if(anah.has(k))oz[anah.get(k).k]=v.textContent.trim()});ad.set(id,a);return {ad:a,oz}});
    const kenar=E(g,'edge').map(e=>{let w=1;E(e,'data').forEach(v=>{if(v.getAttribute('key')===agirlikK)w=sayiOku(v.textContent)??1});return [ad.get(e.getAttribute('source')),ad.get(e.getAttribute('target')),w]}).filter(e=>e[0]!=null&&e[1]!=null&&e[0]!==e[1]&&e[2]>0);
    return {dugumler:dug,kenarlar:kenar,ozellikler:[...anah.values()],uyarilar:[],yonlu}}return null}
function dlOku(m){const s=m.replace(/\r/g,'');const bas=s.match(/^\s*dl\b([\s\S]*?)\bdata\s*:/im);if(!bas)return null;const h=bas[1];const n=+(h.match(/\bn\s*=\s*(\d+)/i)||[])[1];const bicim=((h.match(/format\s*=\s*(\w+)/i)||[])[1]||'fullmatrix').toLowerCase();
  let etiket=[];const em=h.match(/labels\s*:\s*([\s\S]*?)(?=\n\s*\w+\s*[:=]|$)/i);if(em)etiket=em[1].split(/[\s,]+/).filter(Boolean).map(x=>x.replace(/^"|"$/g,''));const gomulu=/labels\s+embedded/i.test(h);
  let govde=s.slice(bas.index+bas[0].length).trim().split('\n').map(x=>x.trim()).filter(Boolean);const kenar=[];
  if(bicim.startsWith('edgelist')){for(const r of govde){const p=r.split(/[\s,]+/);const a=gomulu?p[0]:(etiket[+p[0]-1]||p[0]),b=gomulu?p[1]:(etiket[+p[1]-1]||p[1]);const w=p[2]!=null?sayiOku(p[2]):1;if(a&&b&&a!==b&&w>0)kenar.push([a,b,w])}
    const ad=[...new Set([...etiket,...kenar.flatMap(e=>[e[0],e[1]])])];return {dugumler:ad.map(a=>({ad:a,oz:{}})),kenarlar:kenar,ozellikler:[],uyarilar:[]}}
  if(gomulu){etiket=govde[0].split(/[\s,]+/);govde=govde.slice(1).map(r=>r.split(/[\s,]+/).slice(1).join(' '))}const N=n||etiket.length||govde.length;if(!etiket.length)etiket=Array.from({length:N},(_,i)=>String(i+1));
  const deg=govde.join(' ').split(/[\s,]+/).filter(Boolean).map(Number);for(let i=0;i<N;i++)for(let j=0;j<N;j++){const v=deg[i*N+j];if(i!==j&&v>0)kenar.push([etiket[i],etiket[j],v])}
  return {dugumler:etiket.map(a=>({ad:a,oz:{}})),kenarlar:kenar,ozellikler:[],uyarilar:[]}}

/* ---------- Ara biçimi projeye yazma ----------
   hedef: 'yeni' (yeni ilişki), 'degistir' (bütün projeyi değiştir) ya da var olan ilişki kimliği (bağları ekle). */
function veriUygula(v,o){const p=P();if(o.hedef==='degistir'){const b=bosProje();b.ad=p.ad;b.gorsel=p.gorsel;Object.assign(p,{dugumler:[],ozellikler:[],iliskiler:[],aktif:null});if(v.yonlu!=null)p.yonlu=v.yonlu}
  if(o.yonlu!=null)p.yonlu=o.yonlu;const ix=new Map(p.dugumler.map(d=>[adAnahtar(d.ad||d.id),d]));let yeniD=0;
  /* özellikleri ada göre birleştir */const ozEs=new Map();for(const oz of v.ozellikler||[]){const var_=p.ozellikler.find(x=>adAnahtar(x.ad)===adAnahtar(oz.ad));if(var_)ozEs.set(oz.k,var_.k);else{p.ozellikler.push({...oz});ozEs.set(oz.k,oz.k)}}
  const dug=a=>{const k=adAnahtar(a);let d=ix.get(k);if(!d){d={id:'d'+uid(),ad:hucreMetin(a),oz:{}};p.dugumler.push(d);ix.set(k,d);yeniD++}return d};
  for(const d of v.dugumler){if(!d.ad)continue;if(o.yalnizVar&&!ix.has(adAnahtar(d.ad)))continue;const x=dug(d.ad);for(const [k,val] of Object.entries(d.oz||{}))if(ozEs.has(k))x.oz[ozEs.get(k)]=val}
  let r=null;if(v.kenarlar.length||o.hedef==='yeni'||o.hedef==='degistir'){if(o.hedef==='yeni'||o.hedef==='degistir'){r={id:'r'+uid(),ad:o.iliskiAd||t('relationN',p.iliskiler.length+1),kenarlar:[]};p.iliskiler.push(r)}else r=p.iliskiler.find(x=>x.id===o.hedef);
    if(r){for(const [a,b,w] of v.kenarlar)r.kenarlar.push([dug(a).id,dug(b).id,w]);p.aktif=r.id}}
  if(v.kenarlar.length&&!o.agirlikKoru){const agirlikli=v.kenarlar.some(e=>e[2]!==1);if(agirlikli)p.agirlikli=true}
  return {yeniDugum:yeniD,kenar:v.kenarlar.length,iliski:r}}

/* ---------- Dışa aktarma: tekrarlı satırlar birleştirilmiş bağlar yazılır ---------- */
function disaBaglar(p,iliskiId){const G=agKur(p,iliskiId);return G?G.E.map(e=>[G.ids[e.s],G.ids[e.t],e.w]):[]}
function gexfYaz(p,iliskiId,konum,renk){const r=p.iliskiler.find(x=>x.id===iliskiId);const ix=new Map(p.dugumler.map((d,i)=>[d.id,i]));const tip=o=>o.tur==='sayi'?'double':'string';
  let s=`<?xml version="1.0" encoding="UTF-8"?>\n<gexf xmlns="http://gexf.net/1.3" xmlns:viz="http://gexf.net/1.3/viz" version="1.3">\n<meta><creator>Ağ Masası ${SURUM}</creator><description>${X(p.ad)} / ${X(r?.ad||'')}</description></meta>\n<graph defaultedgetype="${p.yonlu?'directed':'undirected'}" mode="static">\n<attributes class="node">${p.ozellikler.map((o,i)=>`<attribute id="${i}" title="${X(o.ad)}" type="${tip(o)}"/>`).join('')}</attributes>\n<nodes>\n`;
  p.dugumler.forEach((d,i)=>{s+=`<node id="${X(d.id)}" label="${X(d.ad)}"><attvalues>${p.ozellikler.map((o,j)=>d.oz[o.k]!=null&&d.oz[o.k]!==''?`<attvalue for="${j}" value="${X(o.tur==='sayi'?(sayiOku(d.oz[o.k])??''):d.oz[o.k])}"/>`:'').join('')}</attvalues>`;
    if(konum)s+=`<viz:position x="${konum.x[i].toFixed(2)}" y="${(-konum.y[i]).toFixed(2)}" z="0"/>`;if(renk){const h=renk[i].replace('#','');s+=`<viz:color r="${parseInt(h.slice(0,2),16)}" g="${parseInt(h.slice(2,4),16)}" b="${parseInt(h.slice(4,6),16)}"/>`}s+='</node>\n'});
  s+='</nodes>\n<edges>\n';disaBaglar(p,iliskiId).forEach(([a,b,w],k)=>{if(ix.has(a)&&ix.has(b))s+=`<edge id="${k}" source="${X(a)}" target="${X(b)}" weight="${w}"/>\n`});return s+'</edges>\n</graph>\n</gexf>\n'}
function graphmlYaz(p,iliskiId){const r=p.iliskiler.find(x=>x.id===iliskiId);let s=`<?xml version="1.0" encoding="UTF-8"?>\n<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n<key id="label" for="node" attr.name="label" attr.type="string"/>\n<key id="weight" for="edge" attr.name="weight" attr.type="double"/>\n`;
  p.ozellikler.forEach((o,i)=>s+=`<key id="a${i}" for="node" attr.name="${X(o.ad)}" attr.type="${o.tur==='sayi'?'double':'string'}"/>\n`);s+=`<graph id="G" edgedefault="${p.yonlu?'directed':'undirected'}">\n`;
  p.dugumler.forEach(d=>{s+=`<node id="${X(d.id)}"><data key="label">${X(d.ad)}</data>${p.ozellikler.map((o,i)=>d.oz[o.k]!=null&&d.oz[o.k]!==''?`<data key="a${i}">${X(o.tur==='sayi'?(sayiOku(d.oz[o.k])??''):d.oz[o.k])}</data>`:'').join('')}</node>\n`});
  disaBaglar(p,iliskiId).forEach(([a,b,w])=>s+=`<edge source="${X(a)}" target="${X(b)}"><data key="weight">${w}</data></edge>\n`);return s+'</graph>\n</graphml>\n'}
function pajekYaz(p,iliskiId){const r=p.iliskiler.find(x=>x.id===iliskiId);const ix=new Map(p.dugumler.map((d,i)=>[d.id,i+1]));const q=s=>'"'+String(s).replace(/"/g,"'")+'"';
  return `*Vertices ${p.dugumler.length}\r\n`+p.dugumler.map((d,i)=>`${i+1} ${q(d.ad)}`).join('\r\n')+`\r\n${p.yonlu?'*Arcs':'*Edges'}\r\n`+disaBaglar(p,iliskiId).map(([a,b,w])=>`${ix.get(a)} ${ix.get(b)} ${w}`).join('\r\n')+'\r\n'}
function dlYaz(p,iliskiId){const r=p.iliskiler.find(x=>x.id===iliskiId);const ix=new Map(p.dugumler.map((d,i)=>[d.id,i+1]));const et=d=>String(d.ad).replace(/[\s,]+/g,'_');
  return `dl n=${p.dugumler.length} format=edgelist1\r\nlabels:\r\n${p.dugumler.map(et).join(',')}\r\ndata:\r\n`+disaBaglar(p,iliskiId).flatMap(([a,b,w])=>p.yonlu?[`${ix.get(a)} ${ix.get(b)} ${w}`]:[`${ix.get(a)} ${ix.get(b)} ${w}`,`${ix.get(b)} ${ix.get(a)} ${w}`]).join('\r\n')+'\r\n'}

/* ====================== ÖRNEK PROJE (kurgusal veri) ======================
   Altı bölümden 48 öğretim elemanının iki işbirliği ilişkisi. Adlar ve bağlar tamamen kurgusaldır, sabit tohumla üretilir. */
const ORNEK_AD=['Ayla','Burak','Ceren','Deniz','Emre','Fulya','Gökhan','Hande','İlker','Jale','Kerem','Leyla','Murat','Nalan','Okan','Pelin','Rıza','Selin','Tarık','Umay','Volkan','Yeliz','Zafer','Aslı','Berk','Cansu','Doruk','Ebru','Ferhat','Gizem','Hakan','Irmak','Kaan','Lale','Mert','Nil','Onur','Özge','Polat','Rana','Serkan','Tuba','Ufuk','Vildan','Yiğit','Zeynep','Alper','Bahar'];
const ORNEK_SOYAD=['Akın','Bal','Coşkun','Doğan','Erel','Filiz','Güneş','Halis','Işık','Kara','Lale','Meriç','Nar','Oral','Ören','Pala','Sarp','Şen','Tan','Uçar','Var','Yazıcı','Zengin','Akar'];
const ORNEK_BOLUM=[['İktisat','Economics'],['İşletme','Management'],['Lojistik','Logistics'],['Bilgisayar','Computing'],['Turizm','Tourism'],['Muhasebe','Accounting']];
const ORNEK_UNVAN=[['Prof. Dr.','Professor'],['Doç. Dr.','Associate professor'],['Dr. Öğr. Üyesi','Assistant professor'],['Öğr. Gör.','Lecturer']];
function ornekProje(){const k=S.dil==='tr'?0:1;const r=prng(2026);const p=bosProje();p.ad=t('sampleName');
  p.ozellikler=[{k:'bolum',ad:t('sampleAttrDept'),tur:'kat'},{k:'unvan',ad:t('sampleAttrTitle'),tur:'kat'},{k:'kidem',ad:t('sampleAttrSeniority'),tur:'sayi'}];
  const n=48;for(let i=0;i<n;i++){const b=i%6,u=r()<.12?0:r()<.3?1:r()<.55?2:3;p.dugumler.push({id:'d'+(i+1),ad:ORNEK_AD[i]+' '+ORNEK_SOYAD[Math.floor(r()*ORNEK_SOYAD.length)],oz:{bolum:ORNEK_BOLUM[b][k],unvan:ORNEK_UNVAN[u][k],kidem:String([22,15,9,5][u]+Math.floor(r()*6))}})}
  const B=i=>i%6;const yakin=(a,b)=>Math.abs(B(a)-B(b))===1||Math.abs(B(a)-B(b))===5;const aracilar=new Set([2,13,27,40]);
  const yayin=[],proje=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){let pr=B(i)===B(j)?.42:yakin(i,j)?.04:.012;if(aracilar.has(i)||aracilar.has(j))pr=B(i)===B(j)?.5:.14;
    if(r()<pr)yayin.push(['d'+(i+1),'d'+(j+1),1+Math.floor(r()*r()*5)]);let pp=B(i)===B(j)?.22:.05;if(aracilar.has(i)||aracilar.has(j))pp=.12;if(r()<pp)proje.push(['d'+(i+1),'d'+(j+1),1+Math.floor(r()*2)])}
  p.iliskiler=[{id:'r1',ad:t('sampleRel1'),kenarlar:yayin},{id:'r2',ad:t('sampleRel2'),kenarlar:proje}];p.aktif='r1';p.agirlikli=true;
  p.gorsel={...GORSEL_VARSAYILAN,renk:'oz:bolum'};p.ei.oz='bolum';p.qap={bagimli:'r1',bagimsiz:['r2','oz:bolum','oz:kidem'],perm:1000};p.not=t('sampleNote');return p}

/* ====================== VİTRİN AĞLARI (ana sayfa ve yardım görselleri) ======================
   Hepsi sabit tohumla üretilen kurgusal ağlardır; motorun kendisiyle çizilir. */
function sentetikAg(n,kenarlar,yonlu=false,adlar){const p={yonlu,agirlikli:kenarlar.some(e=>e[2]!==1),dugumler:Array.from({length:n},(_,i)=>({id:'v'+i,ad:adlar?adlar[i]:String(i+1)})),iliskiler:[{id:'x',kenarlar:kenarlar.map(([a,b,w])=>['v'+a,'v'+b,w??1])}]};return agKur(p,'x')}
const VITRIN={
  topluluk(){const r=prng(41),g=[16,14,12,12,10];const grup=[];g.forEach((s,k)=>{for(let i=0;i<s;i++)grup.push(k)});const n=grup.length,E=[];
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(r()<(grup[i]===grup[j]?.34:.012))E.push([i,j,1+Math.floor(r()*r()*4)]);return {G:sentetikAg(n,E),grup:null}},
  cekirdek(){const r=prng(43),n=56,c=9,E=[];const der=new Array(n).fill(0);for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const pr=i<c&&j<c?.85:i<c||j<c?.08:.01;if(r()<pr){E.push([i,j,1]);der[i]++;der[j]++}}for(let i=c;i<n;i++)if(!der[i])E.push([Math.floor(r()*c),i,1]);return {G:sentetikAg(n,E)}},
  merkez(){/* tercihli bağlanma, m=1 ve m=2 karışık */const r=prng(47),n=70,E=[[0,1],[1,2],[0,2]];const der=[2,2,2];for(let i=3;i<n;i++){const m=r()<.35?2:1;const sec=new Set();while(sec.size<m){let top=der.reduce((a,b)=>a+b,0),x=r()*top,j=0;while(x>der[j]){x-=der[j];j++}sec.add(j)}der.push(0);for(const j of sec){E.push([i,j]);der[i]++;der[j]++}}return {G:sentetikAg(n,E.map(e=>[...e,1]))}},
  tedarik(){/* katmanlı yönlü ağ: tedarikçi -> üretici -> dağıtıcı -> perakende */const r=prng(53),K=[14,6,5,16];const kat=[];K.forEach((s,k)=>{for(let i=0;i<s;i++)kat.push(k)});const n=kat.length,E=[];const bas=k=>K.slice(0,k).reduce((a,b)=>a+b,0);
    for(let i=0;i<n;i++){const k=kat[i];if(k===3)continue;const hedef=K[k+1];const m=k===0?1+Math.floor(r()*2):k===1?2+Math.floor(r()*2):3+Math.floor(r()*2);const sec=new Set();while(sec.size<Math.min(m,hedef))sec.add(bas(k+1)+Math.floor(r()*hedef));for(const j of sec)E.push([i,j,1+Math.floor(r()*4)])}return {G:sentetikAg(n,E,true),grup:kat}},
  araci(){const r=prng(59),A=18,B=18,n=A+B+2,E=[];for(let i=0;i<A;i++)for(let j=i+1;j<A;j++)if(r()<.3)E.push([i,j,1]);for(let i=A;i<A+B;i++)for(let j=i+1;j<A+B;j++)if(r()<.3)E.push([i,j,1]);
    const a1=A+B,a2=A+B+1;for(let k=0;k<4;k++){E.push([a1,Math.floor(r()*A),1]);E.push([a1,A+Math.floor(r()*B),1])}E.push([a2,Math.floor(r()*A),1]);E.push([a2,A+Math.floor(r()*B),1]);E.push([a2,a1,1]);return {G:sentetikAg(n,E),araci:[a1,a2]}},
  kucuk(){/* Watts-Strogatz benzeri halka */const r=prng(61),n=40,E=new Set();const ek=(a,b)=>E.add(a<b?a+','+b:b+','+a);for(let i=0;i<n;i++)for(let k=1;k<=2;k++){let j=(i+k)%n;if(r()<.12)j=Math.floor(r()*n);if(j!==i)ek(i,j)}return {G:sentetikAg(n,[...E].map(s=>{const [a,b]=s.split(',').map(Number);return [a,b,1]}))}}};
