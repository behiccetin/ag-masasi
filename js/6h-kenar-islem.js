/* ====================== AĞ SEKMESİ: SEÇİLİ BAĞ ÜZERİNDE İŞLEMLER ======================
   Bir bağa tıklayınca açılan kart: ağırlık, bu bağa özel kalınlık, renk ve çizgi türü (düz, kesikli, noktalı),
   yönü çevirme, bağı silme, kaynağa ya da hedefe gitme. Değişiklikler etkin ilişkide yapılır ve geri alınabilir.
   Bağa özel görünüm p.gorsel.kenar içinde, "ilişki|kaynak>hedef" (yönsüzde "ilişki|a~b") anahtarıyla saklanır. */
function kenarAnahtar(p,a,b){return p.aktif+'|'+(p.yonlu?a+'>'+b:(a<b?a+'~'+b:b+'~'+a))}
/* çizilen bağların (AGSVG.E) sırasıyla bağa özel görünüm; hiçbiri yoksa null */
function kenarOzelDizi(G){const p=P(),D=p.gorsel.kenar;if(!D||!G)return null;let var_=false;const L=G.E.map(e=>{const x=D[kenarAnahtar(p,G.ids[e.s],G.ids[e.t])];if(x){var_=true;return x}return null});return var_?L:null}
/* seçili bağın çizimdeki sırası (yoksa null) */
function seciliKenarNo(){const S_=GORUNUM.seciliKenar;if(!S_||!AGSVG||!AGSVG.E)return null;const G=agG();if(!G)return null;const p=P();
  const k=AGSVG.E.findIndex(e=>{const a=G.ids[e.s],b=G.ids[e.t];return (a===S_.a&&b===S_.b)||(!p.yonlu&&a===S_.b&&b===S_.a)});return k>=0?k:null}
/* etkin ilişkide bu iki düğüm arasındaki ham bağlar (yönlüde yalnız a'dan b'ye) */
const kenarEsles=(p,a,b)=>x=>(x[0]===a&&x[1]===b)||(!p.yonlu&&x[0]===b&&x[1]===a);
function kenarOzelKoy(a,b,anahtar,deger){const p=P(),g=p.gorsel;islem(()=>{if(!g.kenar)g.kenar={};const ka=kenarAnahtar(p,a,b);const x={...(g.kenar[ka]||{})};if(deger==null||deger==='')delete x[anahtar];else x[anahtar]=deger;
  if(Object.keys(x).length)g.kenar[ka]=x;else delete g.kenar[ka];if(!Object.keys(g.kenar).length)delete g.kenar})}
function kenarSil(a,b){const p=P(),r=aktifIliski(),G=agG();if(!r)return;const ad=i=>G.ad[G.ids.indexOf(i)];GORUNUM.seciliKenar=null;
  konumKoruyarak(()=>{r.kenarlar=r.kenarlar.filter(x=>!kenarEsles(p,a,b)(x));if(p.gorsel.kenar){delete p.gorsel.kenar[kenarAnahtar(p,a,b)];if(!Object.keys(p.gorsel.kenar).length)delete p.gorsel.kenar}gunlukEkle(t('logTieDel',ad(a),ad(b)))});tost(t('tieDeletedUndo'))}
function kenarPaneli(kart,k){const p=P(),G=agG(),r=aktifIliski(),e=AGSVG.E[k];if(!e||!r){kart.innerHTML='';return}
  const a=G.ids[e.s],b=G.ids[e.t],ka=kenarAnahtar(p,a,b),oz=(p.gorsel.kenar&&p.gorsel.kenar[ka])||{};
  const ters=p.yonlu?r.kenarlar.filter(x=>x[0]===b&&x[1]===a).reduce((s,x)=>s+(+x[2]||1),0):0;
  const st=STILLER[p.gorsel.stil]||STILLER.dergi;const wmx=Math.max(1,...AGSVG.E.map(x=>x.w)),wmn=Math.min(...AGSVG.E.map(x=>x.w));const kend=bagKalinlik(e.w,wmn,wmx,st,p.gorsel.kenarAralik);
  const satir=(et,ic,ipk)=>`<label class="grid grid-cols-[6.5rem_1fr] items-center gap-2"><span class="text-base-content/70 flex items-center gap-0.5">${esc(et)}${ipk||''}</span>${ic}</label>`;
  kart.innerHTML=`<div class="bg-base-100 border border-base-300 rounded-box p-3 text-sm shadow-sm max-h-[calc(100vh-14rem)] overflow-y-auto" role="dialog" aria-label="${esc(t('tieCard'))}">
    <div class="flex items-start gap-1"><p class="font-bold dar text-lg flex-1 break-words">${esc(G.ad[e.s])} <span class="text-base-content/60">${p.yonlu?'→':'–'}</span> ${esc(G.ad[e.t])}</p>${ip('kenarIslem')}<button class="btn btn-ghost btn-xs btn-square" id="kKapat" aria-label="${esc(t('close'))}" title="${esc(t('close'))}">×</button></div>
    <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 mt-1"><dt class="text-base-content/60">${esc(t('relation'))}</dt><dd>${esc(r.ad)}</dd>
      <dt class="text-base-content/60">${esc(t('weight'))}</dt><dd class="rakam">${sayi(e.w,Number.isInteger(e.w)?0:2)}${p.agirlikli?'':` <span class="text-base-content/60">(${esc(t('unweightedNet'))})</span>`}</dd>
      ${ters?`<dt class="text-base-content/60">${esc(t('reverseTie'))}</dt><dd class="rakam">${sayi(ters,Number.isInteger(ters)?0:2)}</dd>`:''}</dl>
    <div class="flex flex-wrap gap-1 mt-3"><button class="btn btn-xs" id="kKaynak" title="${esc(t('goToNode',G.ad[e.s]))}">${esc(p.yonlu?t('goSource'):G.ad[e.s])}</button><button class="btn btn-xs" id="kHedef" title="${esc(t('goToNode',G.ad[e.t]))}">${esc(p.yonlu?t('goTarget'):G.ad[e.t])}</button>
      ${p.yonlu?`<button class="btn btn-xs" id="kTers" title="${esc(t('reverseTieTip'))}">${esc(t('reverseTieBtn'))}</button>`:''}<button class="btn btn-xs btn-ghost text-error ml-auto" id="kSil" title="${esc(t('deleteTieTip'))}">${esc(t('deleteTie'))}</button></div>
    <div class="space-y-2 mt-3 border-t border-base-300 pt-2"><p class="text-xs font-medium text-base-content/70">${esc(t('editTie'))}</p>
      ${p.agirlikli?satir(t('weight'),`<input class="input input-xs w-full" id="kAgirlik" value="${esc(String(e.w))}" inputmode="decimal">`,ip('kenarAgirlik')):''}
      ${satir(t('tieWidth'),`<span class="flex items-center gap-2"><input type="number" min="0.2" max="40" step="0.5" class="input input-xs w-20" id="kKal" value="${oz.kalinlik??''}" placeholder="${sayi(kend,1)}" aria-label="${esc(t('tieWidth'))}"><span class="text-xs text-base-content/60">px</span>${oz.kalinlik?`<button class="btn btn-xs btn-ghost" id="kKalSifir">${esc(t('resetDefault'))}</button>`:''}</span>`,ip('kenarKalinlik'))}
      ${satir(t('nodeColor'),`<span class="flex items-center gap-2"><input type="color" class="w-7 h-7 rounded border border-base-300 p-0 cursor-pointer bg-transparent" id="kRenk" value="${esc(oz.renk||st.gri)}" aria-label="${esc(t('nodeColor'))}" ${p.gorsel.sb?'disabled':''}>${oz.renk?`<button class="btn btn-xs btn-ghost" id="kRenkSifir">${esc(t('resetDefault'))}</button>`:''}</span>`,ip('kenarRenk'))}
      ${satir(t('lineType'),`<select class="select select-xs w-full" id="kCizgi">${[['',t('lineSolid')],['kesik',t('lineDashed')],['nokta',t('lineDotted')]].map(([v,m])=>`<option value="${v}" ${(oz.cizgi||'')===v?'selected':''}>${esc(m)}</option>`).join('')}</select>`)}
      ${oz.renk||oz.cizgi?`<div class="flex items-center gap-1"><button class="btn btn-xs" id="kHepsi">${esc(t('applyAllTies'))}</button>${ip('kenarHepsi')}</div>`:''}
    </div></div>`;
  const git=i=>{GORUNUM.seciliKenar=null;GORUNUM.secili=i;agCiz()};
  $('#kKapat').onclick=()=>{GORUNUM.seciliKenar=null;agCiz()};$('#kKaynak').onclick=()=>git(e.s);$('#kHedef').onclick=()=>git(e.t);
  $('#kSil').onclick=()=>kenarSil(a,b);
  const kt=$('#kTers');if(kt)kt.onclick=()=>{konumKoruyarak(()=>{r.kenarlar=r.kenarlar.map(x=>x[0]===a&&x[1]===b?[b,a,...x.slice(2)]:x);const g=p.gorsel;if(g.kenar&&g.kenar[ka]){g.kenar[kenarAnahtar(p,b,a)]=g.kenar[ka];delete g.kenar[ka]}gunlukEkle(t('logTieReverse',G.ad[e.s],G.ad[e.t]))});GORUNUM.seciliKenar={a:b,b:a};agCiz();tost(t('tieReversed'))};
  const ka_=$('#kAgirlik');if(ka_)ka_.onchange=()=>{const w=sayiOku(ka_.value);if(w==null||w<=0){tost(t('weightPositive'),'warning');ka_.value=e.w;return}
    islem(()=>{const esl=kenarEsles(p,a,b);r.kenarlar=r.kenarlar.filter(x=>!esl(x));r.kenarlar.push([a,b,w]);gunlukEkle(t('logTieWeight',G.ad[e.s],G.ad[e.t],sayi(w,Number.isInteger(w)?0:2)))})};
  const kk=$('#kKal');kk.onchange=()=>{const v=kk.value.trim()===''?null:sayiOku(kk.value);if(v!=null&&(v<0.2||v>40)){tost(t('tieWidthRange'),'warning');kk.value=oz.kalinlik??'';return}kenarOzelKoy(a,b,'kalinlik',v)};
  const ks=$('#kKalSifir');if(ks)ks.onclick=()=>kenarOzelKoy(a,b,'kalinlik',null);
  $('#kRenk').onchange=ev=>kenarOzelKoy(a,b,'renk',ev.target.value);const rs=$('#kRenkSifir');if(rs)rs.onclick=()=>kenarOzelKoy(a,b,'renk',null);
  $('#kCizgi').onchange=ev=>kenarOzelKoy(a,b,'cizgi',ev.target.value||null);
  /* bu bağın rengini ve çizgi türünü genel bağ ayarı yap; diğer bağlardaki özel renk ve çizgi kaldırılır, özel kalınlıklar kalır */
  const kh=$('#kHepsi');if(kh)kh.onclick=()=>{islem(()=>{const g=p.gorsel;if(oz.renk)g.bagRenk=oz.renk;if(oz.cizgi)g.bagCizgi=oz.cizgi;
    if(g.kenar){for(const x of Object.keys(g.kenar)){const y=g.kenar[x];if(oz.renk)delete y.renk;if(oz.cizgi)delete y.cizgi;if(!Object.keys(y).length)delete g.kenar[x]}if(!Object.keys(g.kenar).length)delete g.kenar}});tost(t('appliedAllTies'))}}
/* Delete: seçili bağı sil; Esc: seçimi kaldır */
document.addEventListener('keydown',e=>{if(S.sekme!=='ag'||GORUNUM.secili!=null||!GORUNUM.seciliKenar)return;const el=document.activeElement;if(el&&el.closest('input,textarea,select,[contenteditable],dialog[open]'))return;
  if(e.key==='Delete'){e.preventDefault();kenarSil(GORUNUM.seciliKenar.a,GORUNUM.seciliKenar.b)}else if(e.key==='Escape'&&!ipAcik){GORUNUM.seciliKenar=null;agCiz()}});
