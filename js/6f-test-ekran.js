/* ====================== TESTLER SEKMESİ ======================
   Beş test: QAP/MRQAP, rastgele ağla karşılaştırma (CUG), özellik ve konum, asortativite, topluluk yapısının anlamlılığı.
   Her testin formülü MathML ile yazılır; tarayıcı dışında bir kitaplık gerekmez. */
const TEST_SEC=['qap','cug','dugum','asort','mod'];
const TA={cug:{model:'um',perm:500},dugum:{y:'',x:'',perm:2000},asort:{x:'',perm:2000},mod:{perm:100}};
/* MathML yardımcıları */
const M={i:v=>`<mi>${v}</mi>`,n:v=>`<mn>${v}</mn>`,o:v=>`<mo>${v}</mo>`,tx:v=>`<mtext>${esc(v)}</mtext>`,r:(...a)=>`<mrow>${a.join('')}</mrow>`,
  fr:(a,b)=>`<mfrac>${a}${b}</mfrac>`,sub:(a,b)=>`<msub>${a}${b}</msub>`,sup:(a,b)=>`<msup>${a}${b}</msup>`,ss:(a,b,c)=>`<msubsup>${a}${b}${c}</msubsup>`,
  kok:a=>`<msqrt>${a}</msqrt>`,ust:(a,b)=>`<mover>${a}${b}</mover>`,top:(alt)=>`<munder><mo>∑</mo>${alt}</munder>`,bar:a=>`<mover>${a}<mo>‾</mo></mover>`,
  par:a=>`<mrow><mo>(</mo>${a}<mo>)</mo></mrow>`,kos:a=>`<mrow><mo>[</mo>${a}<mo>]</mo></mrow>`,say:a=>`<mrow><mo>#</mo><mo>{</mo>${a}<mo>}</mo></mrow>`};
const mat=(...a)=>`<math display="block">${M.r(...a)}</math>`;
function formul(k){const {i,n,o,tx,r,fr,sub,sup,kok,top,bar,par,kos,say}=M;const ij=r(i('i'),i('j'));const R=i('R');
  const pdef=(s)=>r(sub(i('p'),o('≥')),o('='),fr(r(say(r(s,i('*'),o('≥'),s))),R));
  if(k==='qap')return mat(i('r'),o('='),fr(r(top(ij),par(r(sub(i('x'),ij),o('−'),bar(i('x')))),par(r(sub(i('y'),ij),o('−'),bar(i('y'))))),kok(r(top(ij),sup(par(r(sub(i('x'),ij),o('−'),bar(i('x')))),n(2)),top(ij),sup(par(r(sub(i('y'),ij),o('−'),bar(i('y')))),n(2))))))
    +mat(sub(i('y'),ij),o('→'),sub(i('y'),r(i('π'),par(i('i')),i('π'),par(i('j')))),o(','),i('p'),o('='),fr(say(r(o('|'),sup(i('r'),i('π')),o('|'),o('≥'),o('|'),i('r'),o('|'))),R))
    +mat(sub(i('y'),ij),o('='),sub(i('b'),n(0)),o('+'),top(i('k')),sub(i('b'),i('k')),sub(i('x'),r(i('k'),i('i'),i('j'))),o('+'),sub(i('e'),ij),o(','),sub(i('β'),i('k')),o('='),sub(i('b'),i('k')),fr(sub(i('s'),sub(i('x'),i('k'))),sub(i('s'),i('y'))));
  if(k==='cug')return mat(sub(i('p'),o('≥')),o('='),fr(say(r(i('s'),par(sup(i('G'),o('*'))),o('≥'),i('s'),par(i('G')))),R),o(','),i('z'),o('='),fr(r(i('s'),par(i('G')),o('−'),bar(i('s'))),sub(i('σ'),i('s'))))
    +mat(i('T'),o('='),fr(r(n(3),o('×'),tx(t('fTriangles'))),tx(t('fTriples'))),o(','),sub(i('C'),i('D')),o('='),fr(r(top(i('i')),par(r(sub(i('d'),i('max')),o('−'),sub(i('d'),i('i'))))),r(par(r(i('n'),o('−'),n(1))),par(r(i('n'),o('−'),n(2))))));
  if(k==='dugum')return mat(i('F'),o('='),fr(r(sub(i('SS'),i('B')),o('/'),par(r(i('k'),o('−'),n(1)))),r(sub(i('SS'),i('W')),o('/'),par(r(i('N'),o('−'),i('k'))))),o(','),sup(i('η'),n(2)),o('='),fr(sub(i('SS'),i('B')),sub(i('SS'),i('T'))))
    +mat(sub(i('SS'),i('B')),o('='),top(i('g')),sub(i('n'),i('g')),sup(par(r(sub(bar(i('y')),i('g')),o('−'),bar(i('y')))),n(2)),o(','),i('p'),o('='),fr(say(r(sup(i('F'),i('π')),o('≥'),i('F'))),R));
  if(k==='asort')return mat(i('r'),o('='),fr(r(top(i('i')),sub(i('e'),r(i('i'),i('i'))),o('−'),top(i('i')),sub(i('a'),i('i')),sub(i('b'),i('i'))),r(n(1),o('−'),top(i('i')),sub(i('a'),i('i')),sub(i('b'),i('i')))))
    +mat(sub(i('a'),i('i')),o('='),top(i('j')),sub(i('e'),ij),o(','),sub(i('b'),i('j')),o('='),top(i('i')),sub(i('e'),ij));
  if(k==='mod')return mat(i('Q'),o('='),fr(n(1),r(n(2),i('m'))),top(ij),kos(r(sub(i('A'),ij),o('−'),fr(r(sub(i('k'),i('i')),sub(i('k'),i('j'))),r(n(2),i('m'))))),i('δ'),par(r(sub(i('c'),i('i')),o(','),sub(i('c'),i('j')))))
    +mat(i('z'),o('='),fr(r(i('Q'),o('−'),sub(bar(i('Q')),tx(t('fRand')))),sub(i('σ'),tx(t('fRand')))),o(','),sub(i('p'),o('≥')),o('='),fr(say(r(sup(i('Q'),o('*')),o('≥'),i('Q'))),R));
  return ''}
function formulKutu(k){return `<details class="border border-base-300 rounded-box bg-base-200/40" open><summary class="cursor-pointer px-4 py-2 font-semibold flex items-center gap-1">${esc(t('formula'))}</summary>
  <div class="px-4 pb-4 overflow-x-auto formul">${formul(k)}<div class="text-sm text-base-content/75 mt-3 space-y-1 max-w-3xl">${ga('formul',k)||''}</div></div></details>`}
const permSec=(id,L,v)=>`<label class="flex items-center justify-between gap-2"><span class="flex items-center gap-1">${esc(t('permutations'))}${ip('permSay')}</span><select class="select select-sm w-28" id="${id}">${L.map(x=>`<option value="${x}" ${x===v?'selected':''}>${sayi(x)}</option>`).join('')}</select></label>`;
const calisBtn=(dis)=>`<button class="btn btn-primary btn-block" id="tCalis2" ${dis||QAP_CALISIYOR?'disabled':''}>${esc(t('runTests'))}</button>`;
const pYon=(a,b)=>`<td class="n">${a==null?'-':pYaz(a)}</td><td class="n">${b==null?'-':pYaz(b)}</td>`;
function ozAdaylar(turler){const p=P();return p.ozellikler.filter(o=>turler.includes(o.tur)&&(o.tur==='sayi'||new Set(p.dugumler.map(d=>d.oz[o.k]).filter(v=>v!=null&&v!=='')).size<p.dugumler.length))}
async function testCalistir(tur,fn){if(QAP_CALISIYOR)return;QAP_CALISIYOR=true;ciz();const il=v=>{const e=$('#tIl');if(e)e.value=v};
  try{const v=await fn(il);if(!v)tost(t('testNoResult'),'warning');else{agirKoy('t:'+tur,v);gunlukEkle(t('logTest',t('test_'+tur)))}}catch(e){console.error(e);tost(t('qapError'),'error')}finally{QAP_CALISIYOR=false;ciz()}}
/* ---------- rastgele ağla karşılaştırma ---------- */
function cugPanel(){const G=agG(),a=TA.cug;const V=agir('t:cug');
  const sol=`<label class="block"><span class="flex items-center gap-1 font-semibold">${esc(t('nullModel'))}${ip('nullModel')}</span><select class="select select-sm w-full mt-1" id="tcM"><option value="um" ${a.model==='um'?'selected':''}>${esc(t('nullUm'))}</option><option value="derece" ${a.model==='derece'?'selected':''}>${esc(t('nullDeg'))}</option></select></label>
    ${permSec('tcP',[100,500,1000],a.perm)}${calisBtn(false)}${G.agirlikli?`<p class="text-xs text-base-content/65">${esc(t('binaryNote'))}</p>`:''}`;
  const sag=V?`<div class="overflow-x-auto"><table class="stablo"><thead><tr><th>${esc(t('measure'))}</th><th class="n">${esc(t('observed'))}</th><th class="n">${esc(t('randMean'))}</th><th class="n">${esc(t('sdShort'))}</th><th class="n">z</th><th class="n">p (≥)</th><th class="n">p (≤)</th></tr></thead><tbody>
    ${V.satir.map(s=>`<tr><td>${esc(tAlt('agOlcu',s.k)||t('cug_'+s.k))}</td><td class="n font-semibold">${s.gozlenen==null?'-':sayi(s.gozlenen,3)}</td><td class="n">${s.ort==null?'-':sayi(s.ort,3)}</td><td class="n">${s.sd==null?'-':sayi(s.sd,3)}</td><td class="n">${s.z==null?'-':sayi(s.z,2)}</td>${pYon(s.pUst,s.pAlt)}</tr>`).join('')}</tbody></table>
    <p class="text-sm text-base-content/70 mt-2">${esc(t(V.model==='derece'?'nullDeg':'nullUm'))}; n = ${sayi(V.n)}, m = ${sayi(V.m)}; ${esc(t('permutations'))}: ${sayi(V.perm)}</p></div><p class="text-sm text-base-content/75 max-w-3xl">${esc(cugYorum(V))}</p>`:intro('cug');
  return {sol,sag,bagla:()=>{$('#tcM').onchange=e=>{TA.cug.model=e.target.value};$('#tcP').onchange=e=>{TA.cug.perm=+e.target.value};$('#tCalis2').onclick=()=>testCalistir('cug',il=>cugTesti(agG(),{...TA.cug,ilerleme:il}))}}}
function cugYorum(V){const L=[];V.satir.forEach(s=>{if(s.pUst==null)return;const ad=tAlt('agOlcu',s.k)||t('cug_'+s.k);if(s.pUst<0.05)L.push(t('cugHigh',ad,sayi(s.gozlenen,3),sayi(s.ort,3),pMetin(s.pUst)));else if(s.pAlt<0.05)L.push(t('cugLow',ad,sayi(s.gozlenen,3),sayi(s.ort,3),pMetin(s.pAlt)))});return L.length?L.join(' '):t('cugNone')}
/* ---------- özellik ve konum ---------- */
function dugumAdaylar(){const G=agG(),p=P();return [...olcuListesi(G).map(o=>({k:o.k,ad:olcuAd(o.k)})),...p.ozellikler.filter(o=>o.tur==='sayi').map(o=>({k:'oz:'+o.k,ad:o.ad}))]}
function dugumY(k){const p=P();if(k.startsWith('oz:'))return p.dugumler.map(d=>sayiOku(d.oz[k.slice(3)]));return olcuDeger(k)}
function dugumPanel(){const a=TA.dugum,Y=dugumAdaylar(),X=ozAdaylar(['kat','sayi']);if(!Y.some(y=>y.k===a.y))a.y=Y.find(y=>y.k==='dereceGiris')?.k||Y[0]?.k||'';if(!X.some(x=>x.k===a.x))a.x=X[0]?.k||'';const V=agir('t:dugum');
  const sol=`<label class="block"><span class="flex items-center gap-1 font-semibold">${esc(t('nodeMeasureDep'))}${ip('dugumY')}</span><select class="select select-sm w-full mt-1" id="tdY">${Y.map(y=>`<option value="${esc(y.k)}" ${y.k===a.y?'selected':''}>${esc(y.ad)}</option>`).join('')}</select></label>
    <label class="block"><span class="flex items-center gap-1 font-semibold">${esc(t('attribute'))}${ip('dugumX')}</span><select class="select select-sm w-full mt-1" id="tdX">${X.map(x=>`<option value="${esc(x.k)}" ${x.k===a.x?'selected':''}>${esc(x.ad)}</option>`).join('')||`<option value="">${esc(t('needAttribute'))}</option>`}</select></label>
    ${permSec('tdP',[1000,2000,5000],a.perm)}${calisBtn(!X.length)}`;
  let sag=intro('dugum');if(V){if(V.tur==='sayi')sag=`<div class="overflow-x-auto"><table class="stablo"><thead><tr><th></th><th class="n">r</th><th class="n">r²</th><th class="n">p (≥)</th><th class="n">p (≤)</th><th class="n">${esc(t('pTwo'))}</th><th class="n">N</th></tr></thead><tbody><tr><td>${esc(V.yAd)} / ${esc(V.xAd)}</td><td class="n font-semibold">${sayi(V.r,3)}</td><td class="n">${sayi(V.r2,3)}</td>${pYon(V.pUst,V.pAlt)}<td class="n">${pYaz(V.p)}</td><td class="n">${sayi(V.N)}</td></tr></tbody></table></div>`;
    else sag=`<div class="overflow-x-auto"><table class="stablo"><thead><tr><th></th><th class="n">F</th><th class="n">${esc(t('dfShort'))}</th><th class="n">η²</th><th class="n">${esc(t('pPerm'))}</th><th class="n">N</th></tr></thead><tbody><tr><td>${esc(V.yAd)} / ${esc(V.xAd)}</td><td class="n font-semibold">${isFinite(V.F)?sayi(V.F,3):'∞'}</td><td class="n">${V.df1}, ${V.df2}</td><td class="n">${sayi(V.eta2,3)}</td><td class="n">${pYaz(V.p)}</td><td class="n">${sayi(V.N)}</td></tr></tbody></table>
      <table class="stablo mt-4"><thead><tr><th>${esc(V.xAd)}</th><th class="n">n</th><th class="n">${esc(t('mean'))}</th><th class="n">${esc(t('sdShort'))}</th></tr></thead><tbody>${V.grup.map(g=>`<tr><td>${esc(g.g)}</td><td class="n">${sayi(g.n)}</td><td class="n">${sayi(g.ort,3)}</td><td class="n">${g.sd==null?'-':sayi(g.sd,3)}</td></tr>`).join('')}</tbody></table></div>`;
    sag+=`<p class="text-sm text-base-content/70 mt-2">${esc(t('permutations'))}: ${sayi(V.perm)}</p><p class="text-sm text-base-content/75 max-w-3xl">${esc(dugumYorum(V))}</p>`}
  return {sol,sag,bagla:()=>{$('#tdY').onchange=e=>{TA.dugum.y=e.target.value};$('#tdX').onchange=e=>{TA.dugum.x=e.target.value};$('#tdP').onchange=e=>{TA.dugum.perm=+e.target.value};
    $('#tCalis2').onclick=()=>testCalistir('dugum',async il=>{const p=P(),o=p.ozellikler.find(z=>z.k===TA.dugum.x);if(!o)return null;const y=dugumY(TA.dugum.y);if(!y)return null;
      const x=p.dugumler.map(d=>o.tur==='sayi'?sayiOku(d.oz[o.k]):d.oz[o.k]);const v=await dugumTesti(y,x,o.tur,{perm:TA.dugum.perm,ilerleme:il});return v&&{...v,yAd:dugumAdaylar().find(z=>z.k===TA.dugum.y).ad,xAd:o.ad}})}}}
function dugumYorum(V){if(V.tur==='sayi')return t(V.p<0.05?(V.r>0?'dugumPos':'dugumNeg'):'dugumNoneR',V.xAd,V.yAd,sayi(V.r,3),pMetin(V.p));
  return t(V.p<0.05?'dugumF':'dugumNoneF',V.yAd,V.xAd,sayi(V.eta2,3),pMetin(V.p),V.grup[0]?.g??'')}
/* ---------- asortativite ---------- */
function asortPanel(){const a=TA.asort,X=ozAdaylar(['kat','sayi']);if(!X.some(x=>x.k===a.x))a.x=X[0]?.k||'';const V=agir('t:asort');
  const sol=`<label class="block"><span class="flex items-center gap-1 font-semibold">${esc(t('attribute'))}${ip('asortX')}</span><select class="select select-sm w-full mt-1" id="taX">${X.map(x=>`<option value="${esc(x.k)}" ${x.k===a.x?'selected':''}>${esc(x.ad)}</option>`).join('')||`<option value="">${esc(t('needAttribute'))}</option>`}</select></label>
    ${permSec('taP',[1000,2000,5000],a.perm)}${calisBtn(!X.length)}`;
  const sag=V?`<div class="overflow-x-auto"><table class="stablo"><thead><tr><th></th><th class="n">r</th><th class="n">${esc(t('expected'))}</th><th class="n">p (≥)</th><th class="n">p (≤)</th><th class="n">${esc(t('ties'))}</th></tr></thead><tbody><tr><td>${esc(V.xAd)}</td><td class="n font-semibold">${sayi(V.r,3)}</td><td class="n">${V.beklenen==null?'-':sayi(V.beklenen,3)}</td>${pYon(V.pUst,V.pAlt)}<td class="n">${sayi(V.bag)}</td></tr></tbody></table></div>
    <p class="text-sm text-base-content/70 mt-2">${esc(t('permutations'))}: ${sayi(V.perm)}</p><p class="text-sm text-base-content/75 max-w-3xl">${esc(asortYorum(V))}</p>`:intro('asort');
  return {sol,sag,bagla:()=>{$('#taX').onchange=e=>{TA.asort.x=e.target.value};$('#taP').onchange=e=>{TA.asort.perm=+e.target.value};
    $('#tCalis2').onclick=()=>testCalistir('asort',async il=>{const p=P(),o=p.ozellikler.find(z=>z.k===TA.asort.x);if(!o)return null;const d=p.dugumler.map(z=>o.tur==='sayi'?sayiOku(z.oz[o.k]):z.oz[o.k]);const v=await asortTesti(agG(),d,o.tur,{perm:TA.asort.perm,ilerleme:il});return v&&{...v,xAd:o.ad}})}}}
function asortYorum(V){if(V.pUst!=null&&V.pUst<0.05)return t('asortPos',V.xAd,sayi(V.r,3),pMetin(V.pUst));if(V.pAlt!=null&&V.pAlt<0.05)return t('asortNeg',V.xAd,sayi(V.r,3),pMetin(V.pAlt));return t('asortNone',V.xAd,sayi(V.r,3))}
/* ---------- topluluk yapısının anlamlılığı ---------- */
function modPanel(){const G=agG(),a=TA.mod,V=agir('t:mod');
  const sol=`${permSec('tmP',[50,100,200],a.perm)}${calisBtn(false)}<p class="text-xs text-base-content/65">${esc(t('modNote'))}</p>`;
  const sag=V?`<div class="overflow-x-auto"><table class="stablo"><thead><tr><th></th><th class="n">${esc(t('observed'))}</th><th class="n">${esc(t('randMean'))}</th><th class="n">${esc(t('sdShort'))}</th><th class="n">z</th><th class="n">p (≥)</th></tr></thead><tbody><tr><td>${esc(t('modularity'))} Q</td><td class="n font-semibold">${sayi(V.gozlenen,3)}</td><td class="n">${sayi(V.ort,3)}</td><td class="n">${sayi(V.sd,3)}</td><td class="n">${V.z==null?'-':sayi(V.z,2)}</td><td class="n">${pYaz(V.pUst)}</td></tr></tbody></table></div>
    <p class="text-sm text-base-content/70 mt-2">${esc(t('nullDeg'))}; ${esc(t('permutations'))}: ${sayi(V.R)}</p><p class="text-sm text-base-content/75 max-w-3xl">${esc(modYorum(V))}</p>`:intro('mod');void G;
  return {sol,sag,bagla:()=>{$('#tmP').onchange=e=>{TA.mod.perm=+e.target.value};$('#tCalis2').onclick=()=>testCalistir('mod',il=>modulerlikTesti(agG(),{...TA.mod,ilerleme:il}))}}}
function modYorum(V){return t(V.pUst<0.05?'modSig':'modNone',sayi(V.gozlenen,3),sayi(V.ort,3),V.z==null?'-':sayi(V.z,2),pMetin(V.pUst))}
const intro=k=>`<div class="text-sm text-base-content/70 space-y-3 max-w-2xl">${ga('testGiris',k)||''}</div>`;
/* ---------- sekme ---------- */
function cizTest(){const p=P();const k=$('#s-test');if(!p.dugumler.length||!p.iliskiler.length){k.innerHTML=`<div class="max-w-5xl mx-auto px-4 sm:px-8 py-8 w-full">${bolumBas('tabTests','testSekme',t('testsLead'))}${agYok()}</div>`;bagla();return}
  if(!TEST_SEC.includes(S.testSec))S.testSec='qap';const s=S.testSec;const P_={qap:qapPanel,cug:cugPanel,dugum:dugumPanel,asort:asortPanel,mod:modPanel}[s]();
  k.innerHTML=`<div class="max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full space-y-6">${bolumBas('tabTests','testSekme',t('testsLead'))}
    <div class="flex flex-wrap gap-1" role="tablist">${TEST_SEC.map(x=>`<button role="tab" class="btn btn-sm ${x===s?'btn-primary':'btn-ghost border-base-300'}" aria-selected="${x===s}" data-tsec="${x}"><span>${esc(t('test_'+x))}</span></button>`).join('')}</div>
    <p class="text-sm text-base-content/75 max-w-3xl -mt-2">${esc(t('testQ_'+s))}</p>
    <section class="grid lg:grid-cols-[22rem_minmax(0,1fr)] gap-8"><div class="space-y-4 text-sm">${P_.sol}<progress class="progress progress-primary w-full ${QAP_CALISIYOR?'':'hidden'}" id="tIl" value="0" max="1"></progress></div>
      <div class="space-y-6 min-w-0">${formulKutu(s)}${P_.sag}</div></section></div>`;
  bagla();P_.bagla();$$('[data-tsec]').forEach(b=>b.onclick=()=>{S.testSec=b.dataset.tsec;ciz()})}
