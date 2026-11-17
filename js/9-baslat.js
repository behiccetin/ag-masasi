/* ====================== GENEL ÇİZİM ====================== */
function metinleriYaz(){{const tr=S.dil==='tr',a=document.getElementById('behicNet'),c=document.getElementById('iletisimBag');if(a)a.href=tr?'https://behic.net/?dil=tr':'https://behic.net/en';if(c)c.href=(tr?'https://behic.net/?dil=tr':'https://behic.net/en')+'#iletisim'}document.documentElement.lang=S.dil;
  $$('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));$$('[data-tp]').forEach(e=>e.placeholder=t(e.dataset.tp));
  $$('[data-tg]').forEach(e=>{const [g,k]=e.dataset.tg.split('.');e.textContent=tAlt(g,k)});
  $$('[data-ta]').forEach(e=>{e.setAttribute('aria-label',t(e.dataset.ta));e.title=t(e.dataset.ta)});
  $$('header [data-ip]').forEach(e=>e.innerHTML=ip(e.dataset.ip));ipKapat();
  $('#kayitDurum').textContent=S.kaydedildi?t('saved'):'';$('#surumYaz').textContent=SURUM;
  $('#doiYaz').innerHTML=DOI?` DOI: <a class="link" href="https://doi.org/${DOI}" target="_blank" rel="noopener noreferrer">${DOI}</a>`:'';
  $('#dilSecM').innerHTML=$('#dilSec').innerHTML=Object.entries(DILLER).sort((a,b)=>a[1]._ad.localeCompare(b[1]._ad)).map(([k,v])=>`<option value="${esc(k)}" ${k===S.dil?'selected':''}>${esc(v._ad||k)}</option>`).join('');
  sekmeIsaretle()}
function sekmeIsaretle(){$$('[role=tab][data-sekme]').forEach(b=>{const on=b.dataset.sekme===S.sekme;b.setAttribute('aria-selected',on);b.tabIndex=on||(S.sekme==='giris'&&b.dataset.sekme==='veri')?0:-1});
  /* kayan işaret: etkin sekmenin altına kayar */const i=$('#skIsaret'),b=$(`#sekmeler [data-sekme="${S.sekme}"]`);if(!b){i.style.opacity=0;return}i.style.opacity=1;i.style.width=b.offsetWidth+'px';i.style.transform=`translateX(${b.offsetLeft}px)`;
  const nav=b.closest('nav');if(nav&&(b.offsetLeft<nav.scrollLeft||b.offsetLeft+b.offsetWidth>nav.scrollLeft+nav.clientWidth))nav.scrollTo({left:b.offsetLeft-24,behavior:'smooth'})}
function sekmeAc(s){S.sekme=s;$$('.sekme').forEach(e=>e.classList.add('hidden'));$('#s-'+s).classList.remove('hidden');sekmeIsaretle();$('#ana').scrollTop=0;$('#altBilgi').classList.toggle('hidden',s==='ag');ciz()}
function iliskiSecCiz(){const p=P(),s=$('#iliskiSec');s.innerHTML=p.iliskiler.length?p.iliskiler.map(r=>`<option value="${esc(r.id)}" ${r.id===p.aktif?'selected':''}>${esc(r.ad)}</option>`).join(''):`<option>${esc(t('noRelation'))}</option>`;s.disabled=!p.iliskiler.length;$('#iliskiSecKutu').classList.toggle('md:flex',p.iliskiler.length>1);$('#iliskiSecKutu').classList.toggle('md:hidden',p.iliskiler.length<=1)}
function rozetler(){const p=P();const G=agG();const yalniz=G?G.U.filter(L=>!L.length).length:0;$('#rozetVeri').textContent=yalniz?sayi(yalniz):'';$('#rozetVeri').classList.toggle('hidden',!yalniz);$('#rozetVeri').title=yalniz?t('checkIsolates',sayi(yalniz)):'';iliskiSecCiz();void p}
let cizimde=false;
function ciz(){if(cizimde){setTimeout(ciz,0);return}cizimde=true;try{$('#projeAd').value=P().ad||'';rozetler();
  ({giris:cizGiris,veri:cizVeri,ag:cizAg,olcu:cizOlcu,grup:cizGrup,yapi:cizYapi,test:cizTest,rapor:cizRapor,yardim:cizYardim})[S.sekme]()}
  catch(e){console.error(e);$('#s-'+S.sekme).innerHTML=`<div class="max-w-3xl mx-auto p-8">${uyari(t('calcError'),'error')}</div>`}finally{cizimde=false}}
/* bölüm içindeki araç düğmelerini ve sekme bağlantılarını bağla */
function bagla(){$$('main [data-arac]').forEach(b=>{if(b._b)return;b._b=1;b.addEventListener('click',()=>ARAC[b.dataset.arac]())});$$('main [data-git]').forEach(b=>{if(b._b)return;b._b=1;b.addEventListener('click',()=>{if(b.dataset.yk)YARDIM.konu=b.dataset.yk;sekmeAc(b.dataset.git)})});$$('main [data-orn]').forEach(b=>{if(b._b)return;b._b=1;b.addEventListener('click',()=>ornekAc(b.dataset.orn))})}

/* ====================== AYARLAR, GÜNLÜK, DİL, PROJE ====================== */
function ayarPencere(){const p=P();pencere(t('toolSettings'),`<div class="space-y-4"><label class="flex items-center justify-between gap-3 text-sm"><span>${esc(t('decimals'))}</span><input type="number" min="2" max="6" class="input input-sm w-24" id="ayOnd" value="${p.ondalik}"></label>
  <label class="block text-sm"><span>${esc(t('projectNote'))}</span><textarea class="textarea textarea-sm w-full mt-1" rows="4" id="ayNot" placeholder="${esc(t('projectNotePh'))}">${esc(p.not||'')}</textarea></label></div>`,
  [{ad:t('cancel'),d:null},{ad:t('save'),c:'btn-primary',f:()=>{islem(()=>{p.ondalik=Math.min(6,Math.max(2,+$('#ayOnd').value||3));p.not=$('#ayNot').value})}}],{ip:'ayarlar'})}
function gunlukPencere(){const L=[...P().gunluk].reverse();pencere(t('toolLog'),`<div class="flex gap-2 mb-3"><input id="gNot" class="input input-sm flex-1" placeholder="${esc(t('logAddPh'))}"><button class="btn btn-sm btn-primary" id="gEkle">${esc(t('add'))}</button></div>
  ${L.length?`<ul class="text-sm divide-y divide-base-300 max-h-96 overflow-auto">${L.map(g=>`<li class="py-2"><span class="text-xs text-base-content/55">${esc(new Date(g.t).toLocaleString(S.dil))}</span><br>${esc(g.m)}</li>`).join('')}</ul>`:`<p class="text-sm text-base-content/60">${esc(t('logEmpty'))}</p>`}`,null,
  {acilinca:()=>{$('#gEkle').onclick=()=>{const v=$('#gNot').value.trim();if(!v)return;islem(()=>gunlukEkle(v),{cizme:true});$('#pencere').close();gunlukPencere()}}})}
function projeIndir(){indir(dosyaAd(P().ad)+'.ag.json',new Blob([JSON.stringify(P())],{type:'application/json'}));tost(t('projectSaved'))}
function dilSablon(){const {_kod,_ad,_cevirmen,...m}=DILLER.en;indir('ag-masasi-dil-sablonu.json',new Blob([JSON.stringify({_kod:'xx',_ad:'Language name in its own language',_cevirmen:'Your name',...m},null,1)],{type:'application/json'}))}
function temizle(v){if(typeof v==='string')return v;if(Array.isArray(v))return v.map(temizle).filter(x=>x!=null);if(v&&typeof v==='object'){const o={};for(const [k,x] of Object.entries(v)){const y=temizle(x);if(y!=null)o[k]=y}return o}return null}
async function dilYukle(){const f=await dosyaOku('.json');if(!f)return;try{const j=JSON.parse(await f.text());if(!j._kod||!j._ad||!/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(j._kod))throw new Error(t('langBad'));
  const temiz=temizle(j);DILLER[j._kod]=temiz;const ek=JSON.parse(ls.al(KAYIT+'.diller')||'{}');ek[j._kod]=temiz;ls.koy(KAYIT+'.diller',JSON.stringify(ek));ls.koy(KAYIT+'.dil',j._kod);
  dilDegis(j._kod);const eksik=Object.keys(DILLER.en).filter(k=>temiz[k]===undefined).length;tost(t('langLoaded',j._ad)+(eksik?' '+t('langMissing',eksik):''))}catch(e){tost(e.message||t('langBad'),'error')}}
const ARAC={
  yeni:async()=>{if(P().dugumler.length&&!(await sor(t('newProjectQ'),t('newProject'),1)))return;once();S.P=bosProje();S.ver++;GORUNUM.konum=null;kaydet();sekmeAc('veri')},
  ac:()=>oturumAc(),
  kaydet:oturumKaydet,ornek:ornekYukle,ice:()=>icePencere(),disa:disaPencere,ayarlar:ayarPencere,gunluk:gunlukPencere,atif:atifPencere,dilSablon,dilYukle,
  excel:()=>{if(!agG()){tost(t('noNetwork'),'warning');return}indir(dosyaAd(P().ad)+'-sonuclar.xlsx',xlsxRapor());tost(t('downloaded'))}};

/* ====================== OLAYLAR ====================== */
$$('header [data-arac]').forEach(b=>b.addEventListener('click',()=>{document.activeElement&&document.activeElement.blur();ARAC[b.dataset.arac]()}));
$$('#sekmeler [data-sekme],#evBtn').forEach(b=>b.onclick=()=>sekmeAc(b.dataset.sekme));
$('#sekmeler').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;const L=$$('#sekmeler [data-sekme]');const i=L.findIndex(b=>b===document.activeElement);if(i<0)return;const j=(i+(e.key==='ArrowRight'?1:-1)+L.length)%L.length;L[j].focus();sekmeAc(L[j].dataset.sekme)});
$('#projeAd').onchange=e=>islem(()=>{P().ad=e.target.value.trim()||t('untitled')});
$('#iliskiSec').onchange=e=>{GORUNUM.konum=null;islem(()=>{P().aktif=e.target.value})};
function dilDegis(v){S.dil=v;S.ver++;ls.koy(KAYIT+'.dil',v);metinleriYaz();ciz()}
$('#dilSec').onchange=e=>dilDegis(e.target.value);$('#dilSecM').onchange=e=>dilDegis(e.target.value);
$('#temaBtn').onclick=()=>{const k=document.documentElement.dataset.theme==='ag-gece'?'ag':'ag-gece';document.documentElement.dataset.theme=k;ls.koy(KAYIT+'.tema',k);ciz()};
$('#geriAl').onclick=geriAl;$('#yinele').onclick=yinele;$('#yenile').onclick=()=>location.reload();
addEventListener('resize',()=>sekmeIsaretle());
document.addEventListener('keydown',e=>{const ae=document.activeElement;const yaz=(/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)||ae.isContentEditable);if(e.key==='Escape'&&!$('#buyutme').classList.contains('hidden')){buyutmeKapat();return}if(yaz||$('#pencere').open)return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.shiftKey){e.preventDefault();geriAl();return}
  if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==='y'||(e.key.toLowerCase()==='z'&&e.shiftKey))){e.preventDefault();yinele()}});
addEventListener('dragover',e=>e.preventDefault());addEventListener('drop',e=>e.preventDefault());

/* ====================== BAŞLAT ====================== */
(async function(){
  try{Object.assign(DILLER,JSON.parse(ls.al(KAYIT+'.diller')||'{}'))}catch(_){}
  const d=ls.al(KAYIT+'.dil'),nl=(navigator.language||'tr').slice(0,2);S.dil=d&&DILLER[d]?d:(DILLER[nl]?nl:'en');
  const tm=ls.al(KAYIT+'.tema');if(tm==='ag-gece'||(!tm&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.dataset.theme='ag-gece';
  try{await document.fonts.ready}catch(_){}
  await cografyaYukle();
  await VT.ac();S.P=(await projeYukle())||bosProje();metinleriYaz();sekmeAc('giris');gecmisDugme()})();

/* ====================== KISALTMALAR: üzerine gelince açıklama ======================
   QAP, MRQAP gibi kısaltmalar metinde olduğu gibi kalır; fareyle üzerine gelince ya da odaklanınca dile göre tam adı ve kısa tanımı görünür. */
const KISA_RE=/(?<![\w-])(MRQAP|QAP|E-I|NMI|HITS|GEXF|Louvain|Infomap|Leiden|Leicht-Newman|[Mm]odülerlik|[Mm]odularity|[Hh]arita denklemi|[Mm]ap equation|PageRank|ForceAtlas2|LinLog|[Aa]sortativite|[Aa]ssortativity|[Hh]omofili|[Hh]omophily)(?![\wçğıöşüÇĞİÖŞÜ-])/g;
const kisaAnah=x=>x.charAt(0).toUpperCase()+x.slice(1);
function kisaltmaIsle(kok){const tan=t('kisaltma');if(!tan||typeof tan!=='object')return;const yuru=document.createTreeWalker(kok,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const e=n.parentElement;if(!e||e.closest('svg,abbr,input,textarea,select,option,script,style,pre,code,#ipucuKutu'))return NodeFilter.FILTER_REJECT;KISA_RE.lastIndex=0;return KISA_RE.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const L=[];while(yuru.nextNode())L.push(yuru.currentNode);for(const n of L){const s=n.nodeValue;const f=document.createDocumentFragment();let son=0;KISA_RE.lastIndex=0;let m;
    while((m=KISA_RE.exec(s))){if(m.index>son)f.appendChild(document.createTextNode(s.slice(son,m.index)));const a=document.createElement('abbr');a.className='kisa';a.textContent=m[1];a.tabIndex=0;a.dataset.kisa=kisaAnah(m[1]);a.setAttribute('aria-label',m[1]+': '+(tan[kisaAnah(m[1])]||''));f.appendChild(a);son=m.index+m[1].length}
    if(son<s.length)f.appendChild(document.createTextNode(s.slice(son)));n.parentNode.replaceChild(f,n)}}
let kisaZ=null;new MutationObserver(()=>{clearTimeout(kisaZ);kisaZ=setTimeout(()=>{kisaltmaIsle($('#ana'));kisaltmaIsle($('#pIcerik'))},30)}).observe(document.body,{childList:true,subtree:true});
let kisaAcik=null;
function kisaGoster(a){const tan=t('kisaltma')||{};const k=$('#ipucuKutu');if(ipAcik)ipKapat();k.textContent=tan[a.dataset.kisa]||'';k.classList.remove('hidden');const r=a.getBoundingClientRect(),w=k.offsetWidth,h=k.offsetHeight;let x=r.left+r.width/2-w/2,y=r.bottom+6;x=Math.max(8,Math.min(x,innerWidth-w-8));if(y+h>innerHeight-8)y=Math.max(8,r.top-h-6);k.style.left=x+'px';k.style.top=y+'px';kisaAcik=a}
function kisaGizle(){if(!kisaAcik)return;kisaAcik=null;if(!ipAcik)$('#ipucuKutu').classList.add('hidden')}
document.addEventListener('mouseover',e=>{const a=e.target.closest&&e.target.closest('abbr.kisa');if(a&&a!==kisaAcik)kisaGoster(a);else if(!a&&kisaAcik)kisaGizle()});
document.addEventListener('focusin',e=>{const a=e.target.closest&&e.target.closest('abbr.kisa');if(a)kisaGoster(a);else kisaGizle()});
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('abbr.kisa');if(a){e.stopPropagation();kisaAcik===a?kisaGizle():kisaGoster(a)}});
