/* ====================== ATIF ====================== */
const DEPO='https://github.com/behiccetin/ag-masasi';
/* DOI_SURUM: bu sürümün Zenodo DOI'si (sürüm GitHub'da yayımlanıp Zenodo DOI verince yazılır). Boşken atıf, bütün sürümleri kapsayan DOI'yi kullanır. */
const DOI_SURUM='';
const DOI_TUM='10.5281/zenodo.24262475';
const DOI=DOI_SURUM||DOI_TUM;
const KAYNAK_URL=DOI?'https://doi.org/'+DOI:DEPO;
function atifMetinleri(){const y=ga('atif','yazilim'),sv=ga('atif','surum'),yay=DOI?'Zenodo. ':'';
  const ad=S.dil==='tr'?'Ağ Masası':'Ağ Masası (Ag Masasi)';
  return {apa:`Çetin, B., & Filiz, T. (2026). ${ad} (${sv} ${SURUM}) [${y}]. ${yay}${KAYNAK_URL}`,
    isnad:`Çetin, Behiç - Filiz, Taner. ${ad}. ${sv} ${SURUM}. ${y}. ${DOI?'Zenodo, ':''}2026. ${KAYNAK_URL}`,
    bibtex:`@software{cetin2026agmasasi,\n  author = {{\\c{C}}etin, Behi{\\c{c}} and Filiz, Taner},\n  title = {A{\\u{g}} Masas{\\i} (Ag Masasi)},\n  year = {2026},\n  version = {${SURUM}},${DOI?'\n  publisher = {Zenodo},':''}\n  url = {${KAYNAK_URL}}${DOI?`,\n  doi = {${DOI}}`:''}\n}`}}
function doiSatiri(){if(!DOI)return '';const l=(d,ad)=>`<a class="link link-primary" href="https://doi.org/${d}" target="_blank" rel="noopener noreferrer">${esc(d)}</a><span class="text-base-content/60"> ${esc(ad)}</span>`;
  return `<div class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm"><span><span class="badge badge-primary badge-sm mr-2">DOI</span>${DOI_SURUM?l(DOI_SURUM,ga('atif','buSurum').replace('{0}',SURUM)):l(DOI_TUM,ga('atif','tumSurum'))}</span>${DOI_SURUM&&DOI_TUM?`<span>${l(DOI_TUM,ga('atif','tumSurum'))}</span>`:''}</div>`}
function atifPencere(){const a=atifMetinleri();const blok=(k,v)=>`<div class="mt-4"><div class="flex items-center justify-between"><h4 class="text-sm font-semibold">${esc(ga('atif',k))}</h4><button class="btn btn-xs" data-kop="${k}">${esc(ga('atif','kopyala'))}</button></div><pre class="mt-1 bg-base-200 rounded-field p-3 text-sm whitespace-pre-wrap break-words">${esc(v)}</pre></div>`;
  pencere(ga('atif','baslik'),`<p class="text-sm text-base-content/75">${esc(ga('atif','ne'))}</p>${doiSatiri()}${blok('apa',a.apa)}${blok('isnad',a.isnad)}${blok('bibtex',a.bibtex)}`,null,{acilinca:()=>$$('[data-kop]').forEach(b=>b.onclick=()=>kopyala(a[b.dataset.kop]))})}

/* ====================== KAYNAKÇA (APA 7; künyeler Crossref kayıtlarıyla doğrulandı) ====================== */
const KAYNAK={
  wasserman1994:'Wasserman, S., & Faust, K. (1994). Social network analysis: Methods and applications. Cambridge University Press. https://doi.org/10.1017/CBO9780511815478',
  freeman1978:'Freeman, L. C. (1978). Centrality in social networks conceptual clarification. Social Networks, 1(3), 215-239. https://doi.org/10.1016/0378-8733(78)90021-7',
  brandes2001:'Brandes, U. (2001). A faster algorithm for betweenness centrality. The Journal of Mathematical Sociology, 25(2), 163-177. https://doi.org/10.1080/0022250X.2001.9990249',
  newman2001:'Newman, M. E. J. (2001). Scientific collaboration networks. II. Shortest paths, weighted networks, and centrality. Physical Review E, 64(1), 016132. https://doi.org/10.1103/PhysRevE.64.016132',
  marchiori2000:'Marchiori, M., & Latora, V. (2000). Harmony in the small-world. Physica A: Statistical Mechanics and its Applications, 285(3-4), 539-546. https://doi.org/10.1016/S0378-4371(00)00311-3',
  bonacich1972:'Bonacich, P. (1972). Factoring and weighting approaches to status scores and clique identification. The Journal of Mathematical Sociology, 2(1), 113-120. https://doi.org/10.1080/0022250X.1972.9989806',
  page1999:'Page, L., Brin, S., Motwani, R., & Winograd, T. (1999). The PageRank citation ranking: Bringing order to the web (Technical Report 1999-66). Stanford InfoLab. http://ilpubs.stanford.edu:8090/422/',
  kleinberg1999:'Kleinberg, J. M. (1999). Authoritative sources in a hyperlinked environment. Journal of the ACM, 46(5), 604-632. https://doi.org/10.1145/324133.324140',
  batagelj2003:'Batagelj, V., & Zaveršnik, M. (2003). An O(m) algorithm for cores decomposition of networks (arXiv:cs/0310049). arXiv. https://doi.org/10.48550/arXiv.cs/0310049',
  watts1998:'Watts, D. J., & Strogatz, S. H. (1998). Collective dynamics of "small-world" networks. Nature, 393(6684), 440-442. https://doi.org/10.1038/30918',
  burt1992:'Burt, R. S. (1992). Structural holes: The social structure of competition. Harvard University Press.',
  hopcroft1973:'Hopcroft, J., & Tarjan, R. (1973). Algorithm 447: Efficient algorithms for graph manipulation. Communications of the ACM, 16(6), 372-378. https://doi.org/10.1145/362248.362272',
  tarjan1972:'Tarjan, R. (1972). Depth-first search and linear graph algorithms. SIAM Journal on Computing, 1(2), 146-160. https://doi.org/10.1137/0201010',
  newman2002:'Newman, M. E. J. (2002). Assortative mixing in networks. Physical Review Letters, 89(20), 208701. https://doi.org/10.1103/PhysRevLett.89.208701',
  newman2003:'Newman, M. E. J. (2003). Mixing patterns in networks. Physical Review E, 67(2), 026126. https://doi.org/10.1103/PhysRevE.67.026126',
  leicht2008:'Leicht, E. A., & Newman, M. E. J. (2008). Community structure in directed networks. Physical Review Letters, 100(11), 118703. https://doi.org/10.1103/PhysRevLett.100.118703',
  traag2019:'Traag, V. A., Waltman, L., & van Eck, N. J. (2019). From Louvain to Leiden: Guaranteeing well-connected communities. Scientific Reports, 9, 5233. https://doi.org/10.1038/s41598-019-41695-z',
  rosvall2008:'Rosvall, M., & Bergstrom, C. T. (2008). Maps of random walks on complex networks reveal community structure. Proceedings of the National Academy of Sciences, 105(4), 1118-1123. https://doi.org/10.1073/pnas.0706851105',
  dugue2015:'Dugué, N., & Perez, A. (2015). Directed Louvain: Maximizing modularity in directed networks [Research report]. Université d\'Orléans. https://hal.science/hal-01231784',
  blondel2008:'Blondel, V. D., Guillaume, J.-L., Lambiotte, R., & Lefebvre, E. (2008). Fast unfolding of communities in large networks. Journal of Statistical Mechanics: Theory and Experiment, 2008(10), P10008. https://doi.org/10.1088/1742-5468/2008/10/P10008',
  newman2004:'Newman, M. E. J., & Girvan, M. (2004). Finding and evaluating community structure in networks. Physical Review E, 69(2), 026113. https://doi.org/10.1103/PhysRevE.69.026113',
  reichardt2006:'Reichardt, J., & Bornholdt, S. (2006). Statistical mechanics of community detection. Physical Review E, 74(1), 016110. https://doi.org/10.1103/PhysRevE.74.016110',
  danon2005:'Danon, L., Díaz-Guilera, A., Duch, J., & Arenas, A. (2005). Comparing community structure identification. Journal of Statistical Mechanics: Theory and Experiment, 2005(09), P09008. https://doi.org/10.1088/1742-5468/2005/09/P09008',
  krackhardt1988s:'Krackhardt, D., & Stern, R. N. (1988). Informal networks and organizational crises: An experimental simulation. Social Psychology Quarterly, 51(2), 123-140. https://doi.org/10.2307/2786835',
  borgatti2000:'Borgatti, S. P., & Everett, M. G. (2000). Models of core/periphery structures. Social Networks, 21(4), 375-395. https://doi.org/10.1016/S0378-8733(99)00019-2',
  batagelj2001:'Batagelj, V., & Mrvar, A. (2001). A subquadratic triad census algorithm for large sparse networks with small maximum degree. Social Networks, 23(3), 237-243. https://doi.org/10.1016/S0378-8733(01)00035-1',
  humphries2008:'Humphries, M. D., & Gurney, K. (2008). Network "small-world-ness": A quantitative method for determining canonical network equivalence. PLoS ONE, 3(4), e0002051. https://doi.org/10.1371/journal.pone.0002051',
  maslov2002:'Maslov, S., & Sneppen, K. (2002). Specificity and stability in topology of protein networks. Science, 296(5569), 910-913. https://doi.org/10.1126/science.1065103',
  schneider2011:'Schneider, C. M., Moreira, A. A., Andrade, J. S., Havlin, S., & Herrmann, H. J. (2011). Mitigation of malicious attacks on networks. Proceedings of the National Academy of Sciences, 108(10), 3838-3841. https://doi.org/10.1073/pnas.1009440108',
  krackhardt1988:'Krackhardt, D. (1988). Predicting with networks: Nonparametric multiple regression analysis of dyadic data. Social Networks, 10(4), 359-381. https://doi.org/10.1016/0378-8733(88)90004-4',
  dekker2007:'Dekker, D., Krackhardt, D., & Snijders, T. A. B. (2007). Sensitivity of MRQAP tests to collinearity and autocorrelation conditions. Psychometrika, 72(4), 563-581. https://doi.org/10.1007/s11336-007-9016-1',
  serrano2009:'Serrano, M. Á., Boguñá, M., & Vespignani, A. (2009). Extracting the multiscale backbone of complex weighted networks. Proceedings of the National Academy of Sciences, 106(16), 6483-6488. https://doi.org/10.1073/pnas.0808904106',
  cetin2023:'Çetin, B., & Filiz, T. (2023). Küresel hurda demir ticareti ilişkilerinin sosyal ağ analizi yöntemiyle değerlendirilmesi. Mehmet Akif Ersoy Üniversitesi İktisadi ve İdari Bilimler Fakültesi Dergisi, 10(1), 158-182. https://doi.org/10.30798/makuiibf.1097376',
  filiz2026:'Filiz, T., & Çetin, B. (2026). Global trade dynamics of the shipbreaking industry: A complex network analysis approach. International Journal of Shipping and Transport Logistics, 22(2), 235-262. https://doi.org/10.1504/IJSTL.2026.151953',
  ngosbp:'NGO Shipbreaking Platform. (2024). Annual lists of scrapped ships [Veri seti]. https://shipbreakingplatform.org/annual-lists/',
  anderson1999:'Anderson, B. S., Butts, C., & Carley, K. (1999). The interaction of size and density with graph-level indices. Social Networks, 21(3), 239-267. https://doi.org/10.1016/S0378-8733(99)00011-8',
  guimera2004:'Guimerà, R., Sales-Pardo, M., & Amaral, L. A. N. (2004). Modularity from fluctuations in random graphs and complex networks. Physical Review E, 70(2), 025101. https://doi.org/10.1103/PhysRevE.70.025101',
  borgatti2018:'Borgatti, S. P., Everett, M. G., & Johnson, J. C. (2018). Analyzing social networks (2. bs.). SAGE.',
  comtrade:'United Nations. (2026). UN Comtrade database [Veri seti]. https://comtradeplus.un.org/',
  jacomy2014:'Jacomy, M., Venturini, T., Heymann, S., & Bastian, M. (2014). ForceAtlas2, a continuous graph layout algorithm for handy network visualization designed for the Gephi software. PLoS ONE, 9(6), e98679. https://doi.org/10.1371/journal.pone.0098679',
  sugiyama1981:'Sugiyama, K., Tagawa, S., & Toda, M. (1981). Methods for visual understanding of hierarchical system structures. IEEE Transactions on Systems, Man, and Cybernetics, 11(2), 109-125. https://doi.org/10.1109/TSMC.1981.4308636',
  noack2007:'Noack, A. (2007). Energy models for graph clustering. Journal of Graph Algorithms and Applications, 11(2), 453-480. https://doi.org/10.7155/jgaa.00154'};
/* metin içi atıf adları */
const ATIF_AD={wasserman1994:'Wasserman ve Faust, 1994',freeman1978:'Freeman, 1978',brandes2001:'Brandes, 2001',newman2001:'Newman, 2001',marchiori2000:'Marchiori ve Latora, 2000',bonacich1972:'Bonacich, 1972',page1999:'Page vd., 1999',kleinberg1999:'Kleinberg, 1999',
  batagelj2003:'Batagelj ve Zaveršnik, 2003',watts1998:'Watts ve Strogatz, 1998',burt1992:'Burt, 1992',hopcroft1973:'Hopcroft ve Tarjan, 1973',tarjan1972:'Tarjan, 1972',newman2002:'Newman, 2002',newman2003:'Newman, 2003',blondel2008:'Blondel vd., 2008',leicht2008:'Leicht ve Newman, 2008',traag2019:'Traag vd., 2019',rosvall2008:'Rosvall ve Bergstrom, 2008',dugue2015:'Dugué ve Perez, 2015',newman2004:'Newman ve Girvan, 2004',
  reichardt2006:'Reichardt ve Bornholdt, 2006',danon2005:'Danon vd., 2005',krackhardt1988s:'Krackhardt ve Stern, 1988',borgatti2000:'Borgatti ve Everett, 2000',batagelj2001:'Batagelj ve Mrvar, 2001',humphries2008:'Humphries ve Gurney, 2008',maslov2002:'Maslov ve Sneppen, 2002',
  schneider2011:'Schneider vd., 2011',krackhardt1988:'Krackhardt, 1988',dekker2007:'Dekker vd., 2007',serrano2009:'Serrano vd., 2009',jacomy2014:'Jacomy vd., 2014',sugiyama1981:'Sugiyama vd., 1981',cetin2023:'Çetin ve Filiz, 2023',anderson1999:'Anderson vd., 1999',filiz2026:'Filiz ve Çetin, 2026',ngosbp:'NGO Shipbreaking Platform, 2024',guimera2004:'Guimerà vd., 2004',borgatti2018:'Borgatti vd., 2018',comtrade:'United Nations, 2026',noack2007:'Noack, 2007'};
const atf=(...k)=>'('+k.map(x=>{const a=ATIF_AD[x];return S.dil==='tr'?a:a.replace(' ve ',' & ').replace(' vd.',' et al.')}).join('; ')+')';

/* ====================== YÖNTEM METNİ ======================
   Yalnız hesaplanmış olan analizler anlatılır; her paragraf kullanılan yöntemin kaynağını taşır. */
const doldur=(m,o)=>String(m||'').replace(/\{(\w+)\}/g,(_,k)=>o[k]??'');
function liste(L){if(L.length<2)return L.join('');const ve=ga('yontem','ve');return L.slice(0,-1).join(', ')+' '+ve+' '+L[L.length-1]}
function yontemMetni(){const p=P(),G=agG(),R=agOlc();const g=k=>ga('yontem',k);if(!G||!R)return {par:[],kay:new Set()};const kay=new Set(['wasserman1994']);const o=[];const A=R.A,r=aktifIliski();
  if(p.kaynak==='gemi'){o.push(doldur(g('gemiVeri'),{a1:atf('ngosbp'),a2:atf('filiz2026')}));kay.add('ngosbp');kay.add('filiz2026')}
  o.push(doldur(g(A.bilesenSay===1?'veriBagli':'veri'),{n:sayi(G.n),m:sayi(G.m),iliski:r.ad,tur:G.yonlu?g('yonlu'):g('yonsuz'),agirlik:G.agirlikli?g('agirlikli'):g('agirliksiz'),yog:sayi(A.yogunluk,3),bil:sayi(A.bilesenSay),oran:yuzde(A.enBuyukOran),atif:atf('wasserman1994')}));
  const L=olcuListesi(G).map(x=>x.k);const ka=k=>olcuAd(k).toLocaleLowerCase(S.dil);const ml=[`${ka('derece')} ${atf('freeman1978')}`,`${ka('arasindalik')} ${atf('freeman1978','brandes2001')}`,`${ka('yakinlik')}`,`${ka('harmonik')} ${atf('marchiori2000')}`,`${ka('ozvektor')} ${atf('bonacich1972')}`,`PageRank ${atf('page1999')}`];
  kay.add('freeman1978');kay.add('brandes2001');kay.add('marchiori2000');kay.add('bonacich1972');kay.add('page1999');if(L.includes('hub')){ml.push(`${ka('hub')} / ${ka('otorite')} ${atf('kleinberg1999')}`);kay.add('kleinberg1999')}
  let p2=doldur(g('merkez'),{liste:liste(ml)});if(G.agirlikli)p2+=' '+(p.yolAgirlik?doldur(g('yolAgirlikli'),{atif:atf('newman2001')}):g('yolAgirliksiz'));if(p.yolAgirlik&&G.agirlikli)kay.add('newman2001');
  p2+=' '+doldur(g('yapiOlcu'),{a1:atf('batagelj2003'),a2:atf('watts1998'),a3:atf('burt1992'),a4:atf('hopcroft1973')});['batagelj2003','watts1998','burt1992','hopcroft1973'].forEach(x=>kay.add(x));
  if(A.dereceUyumu!=null){p2+=' '+doldur(g('uyum'),{r:sayi(A.dereceUyumu,3),atif:atf('newman2002')});kay.add('newman2002')}o.push(p2);
  const T=agTop();if(T){const yon=T.yontem,yl=G.yonlu;const pr={gam:sayi(T.gamma,2),R:sayi(T.tekrar),k:sayi(T.k),q:sayi(T.Q,3),q0:sayi(T.Qaralik[0],3),kar:sayi(ortala(T.kararlilik),3),L:sayi(T.L??0,3),L1:sayi(T.L1??0,3)};let p3,gk=[];
    if(yon==='louvain'){p3=doldur(g('topluluk'),{...pr,a1:atf('blondel2008'),a2:atf('newman2004')});gk=['blondel2008','newman2004']}
    else if(yon==='dlouvain'){p3=doldur(g('toplulukDLouvain'),{...pr,a1:atf('dugue2015'),a2:atf('leicht2008')});gk=['dugue2015','leicht2008']}
    else if(yon==='leiden'){p3=doldur(g('toplulukLeiden'),{...pr,modad:g(yl?'modYonlu':'modYonsuz'),a1:atf('traag2019'),a2:atf(yl?'leicht2008':'newman2004')});gk=['traag2019',yl?'leicht2008':'newman2004']}
    else{p3=doldur(g('toplulukInfomap'),{...pr,yurus:g(yl?'infomapYurusYonlu':'infomapYurusYonsuz'),a1:atf('rosvall2008')});gk=['rosvall2008']}
    gk.forEach(x=>kay.add(x));
    if(T.gamma!==1&&yon!=='infomap'){p3+=' '+doldur(g('gamma'),{atif:atf('reichardt2006')});kay.add('reichardt2006')}const oz=p.ozellikler.find(x=>x.k===p.ei.oz&&x.tur==='kat');
    if(oz){const v=p.dugumler.map(d=>d.oz[oz.k]);const ix=v.map((x,i)=>i).filter(i=>v[i]!=null&&v[i]!=='');if(ix.length>1){p3+=' '+doldur(g('nmi'),{oz:oz.ad,v:sayi(nmi(ix.map(i=>T.c[i]),ix.map(i=>v[i])),3),atif:atf('danon2005')});kay.add('danon2005')}}o.push(p3)}
  const oz=p.ozellikler.find(x=>x.k===p.ei.oz&&x.tur==='kat');if(oz){const E=agEi(oz.k),U=agUyum(oz.k);if(E){o.push(doldur(g('ei'),{oz:oz.ad,ei:sayi(E.ei,3),bek:sayi(E.beklenen,3),perm:sayi(E.perm),p:pMetin(E.ei<E.beklenen?E.pKucuk:E.pBuyuk),r:U&&U.r!=null?sayi(U.r,3):'-',a1:atf('krackhardt1988s'),a2:atf('newman2003')}));kay.add('krackhardt1988s');kay.add('newman2003')}}
  const C=agCp();if(C){o.push(doldur(g('cp'),{atif:atf('borgatti2000'),f:sayi(C.uyum,3),nc:sayi(C.nc),n:sayi(G.n),cc:sd(C.yogunluk.cc,3),pp:sd(C.yogunluk.pp,3),mod:C.cpYoksay?g('cpYoksay'):g('cpBir')}));kay.add('borgatti2000')}
  if(G.yonlu){const Tr=agTriad();o.push(doldur(g('triad'),{atif:atf('batagelj2001'),kars:yuzde(A.karsiliklilik),t300:sayi(Tr['300']),t030:sayi(Tr['030T'])}));kay.add('batagelj2001')}
  const KD=agir('kd');if(KD&&KD.sigma!=null){o.push(doldur(g('kd'),{a1:atf('humphries2008'),a2:atf('maslov2002'),s:sayi(KD.sigma,2),R:sayi(KD.tekrar)}));kay.add('humphries2008');kay.add('maslov2002')}
  const DY=agir('day');if(DY){o.push(doldur(g('day'),{atif:atf('schneider2011'),rd:sayi(DY.R.derece,3),ra:sayi(DY.R.arasindalik,3),rr:sayi(DY.R.rastgele,3)}));kay.add('schneider2011')}
  const Q=agir('qap');if(Q){let p9=doldur(g('qap'),{bag:Q.bagimli,liste:liste(Q.adlar),perm:sayi(Q.perm),a1:atf('krackhardt1988')});kay.add('krackhardt1988');if(Q.mr){p9+=' '+doldur(g('mrqap'),{atif:atf('dekker2007'),r2:sayi(Q.mr.R2,3)});kay.add('dekker2007')}p9+=' '+qapYorum(Q);o.push(p9)}
  {const V=agir('t:cug');if(V){o.push(doldur(g('cugT'),{model:g(V.model==='derece'?'cugDeg':'cugUm'),perm:sayi(V.perm),atif:atf(...(V.model==='derece'?['anderson1999','maslov2002']:['anderson1999']))})+' '+cugYorum(V));kay.add('anderson1999');if(V.model==='derece')kay.add('maslov2002')}}
  {const V=agir('t:dugum');if(V){o.push(doldur(g('dugumT'),{y:V.yAd,x:V.xAd,perm:sayi(V.perm),atif:atf('borgatti2018')})+' '+dugumYorum(V));kay.add('borgatti2018')}}
  {const V=agir('t:asort');if(V){o.push(doldur(g('asortT'),{x:V.xAd,perm:sayi(V.perm),atif:atf('newman2003')})+' '+asortYorum(V));kay.add('newman2003')}}
  {const V=agir('t:mod');if(V){o.push(doldur(g('modT'),{perm:sayi(V.R),atif:atf('guimera2004','maslov2002')})+' '+modYorum(V));kay.add('guimera2004');kay.add('maslov2002')}}
  let pv;if(p.gorsel.yerlesim==='katman'){const B=katmanBilgi(p,G);pv=doldur(g('gorselKatman'),{a1:atf('sugiyama1981'),k:sayi(B.adlar.length),adlar:B.adlar.join(', ')});kay.add('sugiyama1981')}else{pv=doldur(g('gorsel'),{a1:atf('jacomy2014','noack2007')});kay.add('jacomy2014');kay.add('noack2007')}if(p.omurga.acik&&G.agirlikli){pv+=' '+doldur(g('omurga'),{atif:atf('serrano2009'),a:sayi(p.omurga.alfa,2),k:sayi((agOmurga()||[]).length)});kay.add('serrano2009')}o.push(pv);
  o.push(g('arac'));return {par:o,kay}}
function kaynakcaListesi(kay){return [atifMetinleri().apa,...[...kay].map(x=>KAYNAK[x])].sort((a,b)=>a.localeCompare(b,'tr'))}

/* ====================== RAPOR SEKMESİ ====================== */
function cizRapor(){const p=P(),G=agG();const k=$('#s-rapor');const Y=G&&G.n?yontemMetni():{par:[],kay:new Set()};const hazir=Y.par.length>0;
  k.innerHTML=`<div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">${bolumBas('tabReport','raporSekme',t('reportLead'))}
    <div class="grid xl:grid-cols-[minmax(0,1fr)_22rem] gap-10"><article class="min-w-0"><div class="flex items-center gap-2 mb-3"><h2 class="text-xl font-bold mr-auto flex items-center gap-1">${esc(ga('yontem','baslik'))}${ip('yontemMetni')}</h2><button class="btn btn-xs" id="rKopya" ${hazir?'':'disabled'}>${esc(ga('atif','kopyala'))}</button></div>
      <p class="text-xs text-base-content/60 mb-4 max-w-3xl">${esc(ga('yontem','not'))}</p>
      ${hazir?`<div class="space-y-3 leading-relaxed max-w-3xl text-[0.95rem]">${Y.par.map(x=>`<p>${esc(x)}</p>`).join('')}</div><h3 class="font-bold mt-8 mb-2">${esc(ga('yontem','kaynakca'))}</h3><ul class="text-sm space-y-1.5 text-base-content/85 max-w-3xl">${kaynakcaListesi(Y.kay).map(x=>`<li class="pl-6 -indent-6 break-words">${esc(x)}</li>`).join('')}</ul>`:agYok()}</article>
    <aside class="space-y-6"><section><h2 class="text-lg font-bold flex items-center gap-1 mb-3">${esc(t('downloads'))}${ip('rapor')}</h2><div class="space-y-2">
      <button class="btn btn-primary btn-block" id="rWord" ${hazir?'':'disabled'}>${esc(t('wordReport'))}</button><button class="btn btn-block" id="rXlsx" ${hazir?'':'disabled'}>${esc(t('xlsxReport'))}</button>
      <button class="btn btn-block btn-ghost border-base-300" data-arac="disa" ${hazir?'':'disabled'}>${esc(t('exportData'))}</button></div>
      <p class="text-xs text-base-content/60 mt-3">${esc(t('reportHeavyNote'))}</p></section>
      <section class="pt-5 border-t border-base-300"><div class="flex items-center gap-2 mb-2"><h2 class="text-lg font-bold mr-auto">${esc(ga('atif','baslik'))}</h2><button class="btn btn-xs btn-ghost" data-arac="atif">${esc(ga('atif','dugme'))}</button></div><p class="text-sm text-base-content/70">${esc(ga('atif','ne'))}</p></section></aside></div></div>`;
  bagla();if(!hazir)return;
  $('#rKopya').onclick=()=>kopyala(Y.par.join('\n\n')+'\n\n'+ga('yontem','kaynakca')+'\n'+kaynakcaListesi(Y.kay).join('\n'));
  $('#rWord').onclick=async()=>{const b=$('#rWord');b.disabled=true;b.innerHTML=`<span class="loading loading-spinner loading-xs"></span>${esc(t('preparing'))}`;try{indir(dosyaAd(p.ad)+'-rapor.docx',await wordRapor());tost(t('downloaded'))}catch(e){tost(t('reportFail'),'error')}finally{ciz()}};
  $('#rXlsx').onclick=()=>{try{indir(dosyaAd(p.ad)+'-sonuclar.xlsx',xlsxRapor());tost(t('downloaded'))}catch(e){tost(t('reportFail'),'error')}}}

/* ====================== WORD RAPORU ====================== */
async function wordRapor(){const p=P(),G=agG(),R=agOlc(),T=agTop(),C=agCp();const tarih=new Date().toLocaleDateString(S.dil);let b='';const R_=R.A;
  const H=m=>wP(m,{st:'Heading1',keep:1,bf:240,af:120}),H2=m=>wP(m,{st:'Heading2',keep:1,bf:160,af:80}),Not=m=>wP(m,{i:1,sz:18,c:'5F6670'});
  let tn=0;const TB=m=>wP(t('tableN',++tn,m),{b:1,sz:19,keep:1,bf:120,af:60});let sn=0;const SB=m=>wP(t('figureN',++sn,m),{i:1,sz:19,jc:'center',af:200});
  const resimler=[];const resimEkle=async(svg,ad)=>{try{const r=await svgPng(svgDisa(svg),2.2);const id=resimler.length+2;resimler.push({id,ad,r});return wResim(id,ad,r)}catch(e){return ''}};
  const tablo=(bas,sat,sayisal)=>{const n=bas.length;const ilk=Math.min(3200,Math.max(1800,9638*.3));const gen=sigdir([ilk,...Array(n-1).fill((9638-ilk)/Math.max(1,n-1))]);return wTk(gen,[bas.map(s=>({s,jc:'center'})),...sat.map(r=>r.map((v,j)=>j===0?{s:String(v)}:{s:String(v),jc:sayisal===false?'left':'right'}))],n>7?16:18)};
  b+=wP(t('reportTitle'),{b:1,sz:36,c:'24553F',af:80});b+=wP(p.ad,{b:1,sz:26,af:60});b+=wP(t('reportDate',tarih)+'. '+aktifIliski().ad,{sz:18,c:'5F6670',af:240});
  b+=H(t('secNetwork'));b+=wP(agOzetYorum(R_,G));b+=await resimEkle(agDisaSvg({etiket:Math.min(P().gorsel.etiket,25)}),'ag');b+=SB(t('figNetwork',aktifIliski().ad));
  b+=TB(t('netLevel'));b+=tablo([t('measure'),t('value')],AG_OZET.filter(([k,,y])=>!y||G.yonlu).map(([k,tur])=>[tAlt('agOlcu',k),ozetDeger(R_,k,tur)]));
  b+=H(t('secCentrality'));const L=['derece','arasindalik','yakinlik','ozvektor','pagerank'].concat(G.agirlikli?['guc']:[]);const ilk=[...Array(G.n).keys()].sort((a,c)=>R.D.arasindalik[c]-R.D.arasindalik[a]||R.D.derece[c]-R.D.derece[a]).slice(0,15);
  b+=TB(t('topNodes',sayi(ilk.length)));b+=tablo([t('nodeName'),...L.map(olcuAd)],ilk.map(i=>[G.ad[i],...L.map(k=>['derece'].includes(k)?sayi(R.D[k][i]):sayi(R.D[k][i],k==='guc'?2:3))]));b+=Not(t('topNodesNote'));
  const dd=dereceDagilimi(R.D.derece);const cc=grafikSvg({seriler:[{noktalar:dd.ccdf,tur:'nokta',r:3.6,renk:STILLER.dergi.palet[0]}],logX:true,logY:true,xAd:t('degreeK'),yAd:'P(K ≥ k)',W:620,H:360});if(cc){b+=await resimEkle(cc,'derece');b+=SB(t('degreeDist'))}
  if(T){b+=H(t('communities'));b+=wP(toplulukYorum(T));b+=TB(t('communities'));b+=tablo([t('community'),t('size'),t('stability'),t('topMembers')],T.boyut.map((s,c)=>{const I=T.c.map((x,i)=>i).filter(i=>T.c[i]===c).sort((a,z)=>R.D.derece[z]-R.D.derece[a]).slice(0,5);return [toplulukAd(c),sayi(s),sayi(T.toplulukKararlilik[c],3),I.map(i=>G.ad[i]).join(', ')]}));
    if(P().gorsel.renk!=='topluluk'){const Y=yerlesimAl();const A=agCizimAyar();const RG=renkGrubu('topluluk');b+=await resimEkle(agSvg(A.G,Y,A.deger,RG.grup,{...A.ayar,renkBaslik:RG.baslik,grupAd:RG.ad,alan:true,gad:true,etiket:Math.min(A.ayar.etiket,20)}).svg,'topluluk');b+=SB(t('figCommunities'))}}
  const oz=p.ozellikler.find(x=>x.k===p.ei.oz&&x.tur==='kat');if(oz){const E=agEi(oz.k);if(E){b+=H(t('homophily'));b+=wP(eiYorum(E,oz.ad));b+=TB(t('eiTable',oz.ad));b+=tablo([oz.ad,t('tiesInside'),t('tiesOutside'),'E-I'],E.grupEI.map(g=>[g.g,sayi(g.I),sayi(g.E),g.ei==null?'-':sayi(g.ei,3)]))}}
  if(C){b+=H(t('corePeriphery'));b+=wP(cpYorum(C));b+=TB(t('blockDensity'));b+=tablo(['',t('core'),t('periphery')],[[t('core'),sd(C.yogunluk.cc,3),sd(C.yogunluk.cp,3)],[t('periphery'),sd(C.yogunluk.cp,3),sd(C.yogunluk.pp,3)]]);b+=wP(t('coreMembers')+': '+C.cekirdek.map((c,i)=>c?G.ad[i]:null).filter(Boolean).join(', '),{sz:19})}
  b+=H(t('brokers'));const ar=[...Array(G.n).keys()].filter(i=>G.U[i].length>=2).sort((a,c)=>R.D.kisitlama[a]-R.D.kisitlama[c]).slice(0,10);b+=TB(t('lowConstraint'));b+=tablo([t('nodeName'),olcuAd('kisitlama'),olcuAd('etkinBuyukluk'),olcuAd('arasindalik')],ar.map(i=>[G.ad[i],sayi(R.D.kisitlama[i],3),sayi(R.D.etkinBuyukluk[i],2),sayi(R.D.arasindalik[i],3)]));
  b+=wP(t('cutSummary',sayi(R_.kesmeNoktalari.length),sayi(R_.kopruler.length)));
  if(G.yonlu){const Tr=agTriad();b+=H(t('triadCensus'));b+=TB(t('triadCensus'));b+=tablo([t('triadType'),t('count')],TRIAD_AD.map(a=>[a,sayi(Tr[a])]))}
  const KD=agir('kd');if(KD&&KD.sigma!=null){b+=H(t('smallWorld'));b+=wP(t('swYes',sayi(KD.sigma,2),sayi(KD.n),sayi(KD.tekrar)))}
  const DY=agir('day');if(DY){b+=H(t('robustness'));const n=DY.n;const xs=a=>a.map((v,i)=>[i/n,v]);b+=await resimEkle(grafikSvg({seriler:[{ad:t('attackDegree'),noktalar:xs(DY.derece),tur:'cizgi',renk:STILLER.dergi.palet[1]},{ad:t('attackBetweenness'),noktalar:xs(DY.arasindalik),tur:'cizgi',renk:STILLER.dergi.palet[3]},{ad:t('attackRandom'),noktalar:xs(DY.rastgele),tur:'cizgi',renk:STILLER.dergi.palet[0],kesik:true}],xAd:t('removedShare'),yAd:t('giantShare'),aciklamaSag:true,W:640,H:360,y0:0,y1:1,x0:0,sayiYaz:v=>sayi(v,1)}),'dayaniklilik');b+=SB(t('robustness'))}
  const Q=agir('qap');if(Q){b+=H(t('tabTests'));b+=TB(t('qapCorr'));b+=tablo([t('predictor'),'r','p (≥)','p (≤)',t('pTwo')],Q.tek.filter(x=>x.r).map(x=>[x.ad,sayi(x.r.r,3),pYaz(x.r.pUst),pYaz(x.r.pAlt),pYaz(x.r.p)]));
    if(Q.mr){b+=TB('MRQAP');b+=tablo([t('predictor'),'b','β',t('pPerm')],[[t('intercept'),sayi(Q.mr.b[0],4),'',''],...Q.adlar.map((a,i)=>[a,sayi(Q.mr.b[i+1],4),Q.mr.beta[i]==null?'-':sayi(Q.mr.beta[i],3),pYaz(Q.mr.p[i])])]);b+=Not(`R² = ${sayi(Q.mr.R2,3)}; ${t('cells')}: ${sayi(Q.mr.N)}; ${t('permutations')}: ${sayi(Q.mr.perm)}`)}b+=wP(qapYorum(Q))}
  {const C=agir('t:cug'),Dg=agir('t:dugum'),A=agir('t:asort'),Mo=agir('t:mod');if((C||Dg||A||Mo)&&!Q)b+=H(t('tabTests'));
    if(C){b+=TB(t('test_cug'));b+=tablo([t('measure'),t('observed'),t('randMean'),t('sdShort'),'z','p (≥)','p (≤)'],C.satir.map(s=>[tAlt('agOlcu',s.k)||s.k,s.gozlenen==null?'-':sayi(s.gozlenen,3),s.ort==null?'-':sayi(s.ort,3),s.sd==null?'-':sayi(s.sd,3),s.z==null?'-':sayi(s.z,2),s.pUst==null?'-':pYaz(s.pUst),s.pAlt==null?'-':pYaz(s.pAlt)]));b+=Not(`${t(C.model==='derece'?'nullDeg':'nullUm')}; ${t('permutations')}: ${sayi(C.perm)}`);b+=wP(cugYorum(C))}
    if(Dg){b+=TB(t('test_dugum'));b+=Dg.tur==='sayi'?tablo(['','r','r²',t('pTwo'),'N'],[[Dg.yAd+' / '+Dg.xAd,sayi(Dg.r,3),sayi(Dg.r2,3),pYaz(Dg.p),sayi(Dg.N)]]):tablo([Dg.xAd,'n',t('mean'),t('sdShort')],Dg.grup.map(x=>[x.g,sayi(x.n),sayi(x.ort,3),x.sd==null?'-':sayi(x.sd,3)]));if(Dg.tur!=='sayi')b+=Not(`F(${Dg.df1}, ${Dg.df2}) = ${isFinite(Dg.F)?sayi(Dg.F,3):'∞'}; η² = ${sayi(Dg.eta2,3)}; ${t('pPerm')} ${pMetin(Dg.p)}`);b+=wP(dugumYorum(Dg))}
    if(A){b+=TB(t('test_asort'));b+=tablo(['','r',t('expected'),'p (≥)','p (≤)',t('ties')],[[A.xAd,sayi(A.r,3),A.beklenen==null?'-':sayi(A.beklenen,3),A.pUst==null?'-':pYaz(A.pUst),A.pAlt==null?'-':pYaz(A.pAlt),sayi(A.bag)]]);b+=wP(asortYorum(A))}
    if(Mo){b+=TB(t('test_mod'));b+=tablo(['',t('observed'),t('randMean'),t('sdShort'),'z','p (≥)'],[[t('modularity')+' Q',sayi(Mo.gozlenen,3),sayi(Mo.ort,3),sayi(Mo.sd,3),Mo.z==null?'-':sayi(Mo.z,2),pYaz(Mo.pUst)]]);b+=wP(modYorum(Mo))}}
  const Y=yontemMetni();b+=H(ga('yontem','baslik'));b+=Not(ga('yontem','not'));Y.par.forEach(x=>{b+=wP(x,{af:140,jc:'both'})});b+=H(ga('yontem','kaynakca'));kaynakcaListesi(Y.kay).forEach(x=>{b+=wP(x,{asili:1,af:80})});
  b+=wP(`Ağ Masası v${SURUM}. ${t('credit')} Öğr. Gör. Dr. Behiç ÇETİN. ${t('contributor')} Dr. Taner FİLİZ.`,{sz:14,c:'8A9099',bf:300});
  return docxPaketle(b,resimler)}

/* ====================== EXCEL ÇIKTISI ====================== */
function xlsxRapor(){const p=P(),G=agG(),R=agOlc(),T=agTop(),C=agCp();const L=olcuListesi(G);
  const S1=[{h:[t('nodeName'),...p.ozellikler.map(o=>o.ad),...L.map(o=>olcuAd(o.k)),...(T?[t('community')]:[]),...(C?[t('colorCorePeriphery')]:[]),t('component')],kalin:1},
    ...G.ad.map((a,i)=>({h:[a,...p.ozellikler.map(o=>{const v=p.dugumler[i].oz[o.k];return o.tur==='sayi'&&v!=null?(sayiOku(v)??v):(v??'')}),...L.map(o=>R.D[o.k][i]),...(T?[T.c[i]+1]:[]),...(C?[C.cekirdek[i]?t('core'):t('periphery')]:[]),R.D.bilesen[i]+1],ilkKalin:1}))];
  const S2=[{h:[t('measure'),t('value')],kalin:1},...AG_OZET.filter(([k,,y])=>!y||G.yonlu).map(([k])=>({h:[tAlt('agOlcu',k),R.A[k]??''],ilkKalin:1}))];
  const ad=new Map(p.dugumler.map(d=>[d.id,d.ad]));const S3=[{h:[p.yonlu?t('source'):t('nodeA'),p.yonlu?t('target'):t('nodeB'),t('weight')],kalin:1},...G.E.map(e=>({h:[G.ad[e.s],G.ad[e.t],e.w]}))];void ad;
  const sayfa=[{ad:t('nodes'),satirlar:S1},{ad:t('netLevel'),satirlar:S2},{ad:t('ties'),satirlar:S3}];
  if(T)sayfa.push({ad:t('communities'),satirlar:[{h:[t('community'),t('size'),t('stability')],kalin:1},...T.boyut.map((s,c)=>({h:[toplulukAd(c),s,T.toplulukKararlilik[c]]})),[],...(T.yontem!=='louvain'?[[t('method'),t({dlouvain:'mDLouvain',leiden:'mLeiden',infomap:'mInfomap'}[T.yontem])]]:[]),[t('modularity')+' Q',T.Q],...(T.yontem==='infomap'?[['L ('+'bit)',T.L],['L1 (bit)',T.L1]]:[['γ',T.gamma]]),[t('runs'),T.tekrar]]});
  const Q=agir('qap');if(Q){const Z=[{h:[t('predictor'),'r','p (≥)','p (≤)',t('pTwo')],kalin:1},...Q.tek.filter(x=>x.r).map(x=>({h:[x.ad,x.r.r,x.r.pUst,x.r.pAlt,x.r.p]}))];if(Q.mr){Z.push([]);Z.push({h:[t('predictor'),'b','β',t('pPerm')],kalin:1});Z.push([t('intercept'),Q.mr.b[0]]);Q.adlar.forEach((a,i)=>Z.push([a,Q.mr.b[i+1],Q.mr.beta[i]??'',Q.mr.p[i]]));Z.push(['R²',Q.mr.R2])}sayfa.push({ad:'QAP',satirlar:Z})}
  return xlsxYap(sayfa)}
