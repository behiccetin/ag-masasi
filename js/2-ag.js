/* ====================== AĞ ÇEKİRDEĞİ ======================
   Ağ, düğüm sırasına göre dizinlenir. G.out ve G.inn yönlü komşuluklar, G.U yön gözetmeyen (simetrik) komşuluktur.
   Yönsüz ağda G.out = G.inn = G.U. Ağırlıklar G.agirlikli kapalıysa 1 kabul edilir. */
const EPS=1e-12;
const topla=a=>{let s=0;for(const x of a)s+=x;return s};
const ortala=a=>a.length?topla(a)/a.length:0;
function agKur(p=P(),iliskiId=p.aktif){const r=p.iliskiler.find(x=>x.id===iliskiId);if(!r)return null;const n=p.dugumler.length;const ix=new Map(p.dugumler.map((d,i)=>[d.id,i]));
  const tek=new Map();for(const [a,b,w] of r.kenarlar){let i=ix.get(a),j=ix.get(b);if(i==null||j==null||i===j)continue;if(!p.yonlu&&i>j)[i,j]=[j,i];const k=i*n+j;const v=p.agirlikli?(+w||1):1;tek.set(k,p.agirlikli?(tek.get(k)||0)+v:1)}
  const E=[];for(const [k,w] of tek)E.push({s:Math.floor(k/n),t:k%n,w});E.sort((a,b)=>a.s-b.s||a.t-b.t);
  const out=Array.from({length:n},()=>[]),inn=Array.from({length:n},()=>[]),Um=Array.from({length:n},()=>new Map());
  for(const e of E){out[e.s].push([e.t,e.w]);inn[e.t].push([e.s,e.w]);Um[e.s].set(e.t,(Um[e.s].get(e.t)||0)+e.w);Um[e.t].set(e.s,(Um[e.t].get(e.s)||0)+e.w);if(!p.yonlu){out[e.t].push([e.s,e.w]);inn[e.s].push([e.t,e.w])}}
  const U=Um.map(m=>[...m.entries()]);
  return {n,m:E.length,E,out,inn,U,Um,yonlu:p.yonlu,agirlikli:p.agirlikli,ad:p.dugumler.map(d=>d.ad||d.id),ids:p.dugumler.map(d=>d.id)}}

/* ---------- En kısa yollar ---------- */
/* Tek kaynaktan: BFS (ağırlıksız) ya da Dijkstra (uzaklık = 1/ağırlık). Brandes için sıra, öncüller ve yol sayıları da döner. */
function kisaYol(G,s,agirlikli,komsu){const n=G.n,d=new Float64Array(n).fill(Infinity),sg=new Float64Array(n),Pr=Array.from({length:n},()=>[]),S=[];d[s]=0;sg[s]=1;
  if(!agirlikli){const Q=new Int32Array(n);let bas=0,son=0;Q[son++]=s;while(bas<son){const v=Q[bas++];S.push(v);for(const [w] of komsu[v]){if(d[w]===Infinity){d[w]=d[v]+1;Q[son++]=w}if(d[w]===d[v]+1){sg[w]+=sg[v];Pr[w].push(v)}}}}
  else{const H=[[0,s]];const bitti=new Uint8Array(n);const it=(a,b)=>a[0]<b[0];
    const ekle=x=>{H.push(x);let i=H.length-1;while(i>0){const p=(i-1)>>1;if(it(H[i],H[p])){[H[i],H[p]]=[H[p],H[i]];i=p}else break}};
    const al=()=>{const t=H[0],l=H.pop();if(H.length){H[0]=l;let i=0;for(;;){const a=2*i+1,b=a+1;let k=i;if(a<H.length&&it(H[a],H[k]))k=a;if(b<H.length&&it(H[b],H[k]))k=b;if(k===i)break;[H[i],H[k]]=[H[k],H[i]];i=k}}return t};
    while(H.length){const [dv,v]=al();if(bitti[v])continue;bitti[v]=1;S.push(v);for(const [w,ag] of komsu[v]){const nd=dv+1/ag;if(nd<d[w]-1e-12){d[w]=nd;sg[w]=sg[v];Pr[w]=[v];ekle([nd,w])}else if(Math.abs(nd-d[w])<=1e-12&&!bitti[w]){sg[w]+=sg[v];Pr[w].push(v)}}}}
  return {d,sg,Pr,S}}
/* Arasındalık (Brandes, 2001); normalleştirilmiş: yönsüz 2/((n-1)(n-2)), yönlü 1/((n-1)(n-2)) */
function arasindalik(G,agirlikli){const n=G.n,B=new Float64Array(n),K=G.yonlu?G.out:G.U;
  for(let s=0;s<n;s++){const {sg,Pr,S}=kisaYol(G,s,agirlikli,K);const dl=new Float64Array(n);for(let k=S.length-1;k>=0;k--){const w=S[k];for(const v of Pr[w])dl[v]+=sg[v]/sg[w]*(1+dl[w]);if(w!==s)B[w]+=dl[w]}}
  if(!G.yonlu)for(let i=0;i<n;i++)B[i]/=2;const k=n>2?(G.yonlu?1/((n-1)*(n-2)):2/((n-1)*(n-2))):0;return {ham:[...B],norm:[...B].map(b=>b*k)}}
/* Yakınlık: Wasserman-Faust düzeltmeli (ulaşılan düğüm oranıyla çarpılır) ve harmonik. Yönlü ağda çıkış yönü (düğümün başkalarına uzaklığı). */
function yakinlik(G,agirlikli){const n=G.n,K=G.yonlu?G.out:G.U,c=[],h=[];let topU=0,cift=0,cap=0;
  for(let s=0;s<n;s++){const {d}=kisaYol(G,s,agirlikli,K);let r=0,top=0,har=0;for(let j=0;j<n;j++)if(j!==s&&d[j]<Infinity){r++;top+=d[j];har+=1/d[j];if(d[j]>cap)cap=d[j]}topU+=top;cift+=r;
    c.push(top>0&&n>1?(r/(n-1))*(r/top):0);h.push(n>1?har/(n-1):0)}
  return {yakin:c,harmonik:h,ortUzaklik:cift?topU/cift:null,cap:cift?cap:null,ulasilanCift:cift}}

/* ---------- Diğer düğüm ölçüleri ---------- */
function ozvektor(G){const n=G.n;if(!G.m)return new Array(n).fill(0);let x=new Float64Array(n).fill(1/n);const K=G.yonlu?G.out:G.U;
  for(let it=0;it<2000;it++){const y=Float64Array.from(x);for(let v=0;v<n;v++){const xv=x[v];if(!xv)continue;for(const [w,ag] of K[v])y[w]+=xv*(G.agirlikli?ag:1)}
    let nm=0;for(const v of y)nm+=v*v;nm=Math.sqrt(nm)||1;let fark=0;for(let i=0;i<n;i++){y[i]/=nm;fark+=Math.abs(y[i]-x[i])}x=y;if(fark<n*1e-13)break}return [...x]}
function pagerank(G,a=0.85){const n=G.n;if(!n)return [];const K=G.out;const cikis=K.map(L=>L.reduce((s,[,w])=>s+(G.agirlikli?w:1),0));let x=new Float64Array(n).fill(1/n);
  for(let it=0;it<1000;it++){const y=new Float64Array(n);let sark=0;for(let v=0;v<n;v++){if(!cikis[v]){sark+=x[v];continue}for(const [w,ag] of K[v])y[w]+=a*x[v]*(G.agirlikli?ag:1)/cikis[v]}
    const ek=(1-a)/n+a*sark/n;let fark=0;for(let i=0;i<n;i++){y[i]+=ek;fark+=Math.abs(y[i]-x[i])}x=y;if(fark<n*1e-14)break}return [...x]}
function hits(G){const n=G.n;let h=new Float64Array(n).fill(1/n),a=new Float64Array(n);
  for(let it=0;it<1000;it++){a=new Float64Array(n);for(let v=0;v<n;v++)for(const [w,ag] of G.out[v])a[w]+=h[v]*(G.agirlikli?ag:1);
    const yh=new Float64Array(n);for(let v=0;v<n;v++)for(const [w,ag] of G.out[v])yh[v]+=a[w]*(G.agirlikli?ag:1);const s=topla(yh)||1;let f=0;for(let i=0;i<n;i++){yh[i]/=s;f+=Math.abs(yh[i]-h[i])}h=yh;if(f<n*1e-14)break}
  const sa=topla(a)||1;return {hub:[...h],otorite:[...a].map(x=>x/sa)}}
/* Çekirdek numarası (Batagelj ve Zaversnik), simetrik ve ikili ağ üzerinde */
function cekirdekNo(G){const n=G.n,der=G.U.map(L=>L.length),mx=Math.max(0,...der);const bin=new Int32Array(mx+1);der.forEach(d=>bin[d]++);let st=0;for(let d=0;d<=mx;d++){const c=bin[d];bin[d]=st;st+=c}
  const pos=new Int32Array(n),vert=new Int32Array(n);for(let v=0;v<n;v++){pos[v]=bin[der[v]];vert[pos[v]]=v;bin[der[v]]++}for(let d=mx;d>0;d--)bin[d]=bin[d-1];bin[0]=0;
  for(let i=0;i<n;i++){const v=vert[i];for(const [u] of G.U[v]){if(der[u]>der[v]){const du=der[u],pu=pos[u],pw=bin[du],w=vert[pw];if(u!==w){pos[u]=pw;vert[pu]=w;pos[w]=pu;vert[pw]=u}bin[du]++;der[u]--}}}return der}
/* Yerel kümelenme (simetrik, ikili) ve küresel geçişlilik */
function kumelenme(G){const n=G.n,c=new Array(n).fill(0);let ucgen=0,uclu=0;const S=G.Um;
  for(let v=0;v<n;v++){const L=G.U[v].map(x=>x[0]),k=L.length;if(k<2)continue;let t=0;for(let a=0;a<k;a++)for(let b=a+1;b<k;b++)if(S[L[a]].has(L[b]))t++;c[v]=2*t/(k*(k-1));ucgen+=t;uclu+=k*(k-1)/2}
  return {yerel:c,ortalama:n?ortala(c):0,gecislilik:uclu?ucgen/uclu:0}}
/* Burt: kısıtlama ve etkin büyüklük (simetrik; ağırlıklı ise karşılıklı ağırlıklar) */
function burt(G){const n=G.n,S=G.Um,ag=(i,j)=>G.agirlikli?(S[i].get(j)||0):(S[i].has(j)?1:0);const top=G.U.map((L,i)=>L.reduce((s,[j])=>s+ag(i,j),0));
  const p=(i,j)=>top[i]?ag(i,j)/top[i]:0;const kis=[],etk=[];
  for(let u=0;u<n;u++){const N=G.U[u].map(x=>x[0]);if(!N.length){kis.push(null);etk.push(null);continue}let c=0;
    for(const v of N){let ic=p(u,v);for(const w of N)if(w!==v&&S[w].has(v))ic+=p(u,w)*p(w,v);c+=ic*ic}kis.push(c);
    if(!G.agirlikli){let t=0;for(let a=0;a<N.length;a++)for(let b=a+1;b<N.length;b++)if(S[N[a]].has(N[b]))t++;etk.push(N.length-2*t/N.length)}
    else{let e=0;const mx=w=>Math.max(...G.U[w].map(([z])=>ag(w,z)));for(const v of N){let r=0;for(const w of N)if(w!==v)r+=p(u,w)*(mx(w)?ag(w,v)/mx(w):0);e+=1-r}etk.push(e)}}
  return {kisitlama:kis,etkinBuyukluk:etk}}

/* ---------- Bileşenler, kesme noktaları, köprüler ---------- */
function bilesenler(G){const n=G.n,b=new Int32Array(n).fill(-1);let k=0;const boy=[];for(let s=0;s<n;s++){if(b[s]>=0)continue;const Q=[s];b[s]=k;let c=0;while(Q.length){const v=Q.pop();c++;for(const [w] of G.U[v])if(b[w]<0){b[w]=k;Q.push(w)}}boy.push(c);k++}return {etiket:[...b],boyut:boy}}
function gucluBilesen(G){const n=G.n;let ix=0;const st=[],ust=new Uint8Array(n),I=new Int32Array(n).fill(-1),L=new Int32Array(n);let say=0;
  for(let s=0;s<n;s++){if(I[s]>=0)continue;const yig=[[s,0]];I[s]=L[s]=ix++;st.push(s);ust[s]=1;
    while(yig.length){const top=yig[yig.length-1],v=top[0];if(top[1]<G.out[v].length){const w=G.out[v][top[1]++][0];if(I[w]<0){I[w]=L[w]=ix++;st.push(w);ust[w]=1;yig.push([w,0])}else if(ust[w])L[v]=Math.min(L[v],I[w])}
      else{yig.pop();if(yig.length){const u=yig[yig.length-1][0];L[u]=Math.min(L[u],L[v])}if(L[v]===I[v]){let w;do{w=st.pop();ust[w]=0}while(w!==v);say++}}}}return say}
function kesmeNoktalari(G){const n=G.n,dis=new Int32Array(n).fill(-1),low=new Int32Array(n),par=new Int32Array(n).fill(-1);let z=0;const nok=new Set(),kopru=[];
  for(let r=0;r<n;r++){if(dis[r]>=0)continue;let cocuk=0;const yig=[[r,0]];dis[r]=low[r]=z++;
    while(yig.length){const t=yig[yig.length-1],v=t[0];if(t[1]<G.U[v].length){const w=G.U[v][t[1]++][0];if(dis[w]<0){par[w]=v;if(v===r)cocuk++;dis[w]=low[w]=z++;yig.push([w,0])}else if(w!==par[v])low[v]=Math.min(low[v],dis[w])}
      else{yig.pop();const u=par[v];if(u>=0){low[u]=Math.min(low[u],low[v]);if(low[v]>dis[u])kopru.push([Math.min(u,v),Math.max(u,v)]);if(u!==r&&low[v]>=dis[u])nok.add(u)}}}
    if(cocuk>1)nok.add(r)}return {noktalar:[...nok].sort((a,b)=>a-b),kopruler:kopru}}

/* ---------- Ağ düzeyi ---------- */
function karsiliklilik(G){if(!G.yonlu||!G.m)return null;let k=0;const S=new Set(G.E.map(e=>e.s*G.n+e.t));for(const e of G.E)if(S.has(e.t*G.n+e.s))k++;return k/G.m}
function dereceUyumu(G){const n=G.n,k=G.U.map(L=>L.length);let s1=0,s2=0,s3=0,M=0;for(let i=0;i<n;i++)for(const [j] of G.U[i])if(i<j){const a=k[i],b=k[j];M++;s1+=a*b;s2+=(a+b)/2;s3+=(a*a+b*b)/2}
  if(!M)return null;const num=s1/M-(s2/M)**2,den=s3/M-(s2/M)**2;return Math.abs(den)<EPS?null:num/den}
function ozellikUyumu(G,deger){/* kategorik; Newman (2003) */const kat=[...new Set(deger.filter(x=>x!=null&&x!==''))];if(kat.length<2)return null;const ix=new Map(kat.map((k,i)=>[k,i]));const K=kat.length,e=Array.from({length:K},()=>new Float64Array(K));let M=0;
  for(let i=0;i<G.n;i++)for(const [j] of G.U[i])if(i<j){const a=ix.get(deger[i]),b=ix.get(deger[j]);if(a==null||b==null)continue;e[a][b]++;e[b][a]++;M+=2}if(!M)return null;
  let tr=0,ab=0;for(let a=0;a<K;a++){tr+=e[a][a]/M;let ai=0,bi=0;for(let b=0;b<K;b++){ai+=e[a][b]/M;bi+=e[b][a]/M}ab+=ai*bi}return Math.abs(1-ab)<EPS?null:(tr-ab)/(1-ab)}
function merkezilesme(der,araNorm,n){if(n<3)return {derece:null,arasindalik:null};const dm=Math.max(...der),bm=Math.max(...araNorm);
  return {derece:topla(der.map(d=>dm-d))/((n-1)*(n-2)),arasindalik:topla(araNorm.map(b=>bm-b))/(n-1)}}

/* ---------- Bütün düğüm ölçüleri ---------- */
function olcumler(G,o={}){const n=G.n,yolAg=!!o.yolAgirlik&&G.agirlikli;
  const derGir=G.inn.map(L=>L.length),derCik=G.out.map(L=>L.length),derTop=G.U.map(L=>L.length);
  const gucGir=G.inn.map(L=>topla(L.map(x=>x[1]))),gucCik=G.out.map(L=>topla(L.map(x=>x[1]))),guc=G.U.map(L=>topla(L.map(x=>x[1])));
  const ar=arasindalik(G,yolAg),yk=yakinlik(G,yolAg),kum=kumelenme(G),bu=burt(G),bil=bilesenler(G);
  const D={derece:G.yonlu?derTop:derTop,dereceNorm:derTop.map(d=>n>1?d/(n-1):0),guc,arasindalik:ar.norm,arasindalikHam:ar.ham,yakinlik:yk.yakin,harmonik:yk.harmonik,
    ozvektor:ozvektor(G),pagerank:pagerank(G),cekirdek:cekirdekNo(G),kumelenme:kum.yerel,kisitlama:bu.kisitlama,etkinBuyukluk:bu.etkinBuyukluk,bilesen:bil.etiket};
  if(G.yonlu){Object.assign(D,{dereceGiris:derGir,dereceCikis:derCik,gucGiris:gucGir,gucCikis:gucCik});const h=hits(G);D.hub=h.hub;D.otorite=h.otorite}
  const kn=kesmeNoktalari(G);const enb=Math.max(0,...bil.boyut);
  const A={n,m:G.m,yogunluk:n>1?G.m/(G.yonlu?n*(n-1):n*(n-1)/2):0,ortDerece:n?(G.yonlu?G.m/n:2*G.m/n):0,karsiliklilik:karsiliklilik(G),gecislilik:kum.gecislilik,ortKumelenme:kum.ortalama,
    bilesenSay:bil.boyut.length,gucluBilesenSay:G.yonlu?gucluBilesen(G):null,enBuyukBilesen:enb,enBuyukOran:n?enb/n:0,yalniz:derTop.filter(d=>!d).length,
    ortUzaklik:yk.ortUzaklik,cap:yk.cap,dereceUyumu:dereceUyumu(G),...(()=>{const m=merkezilesme(derTop,ar.norm,n);return {merkDerece:m.derece,merkArasindalik:m.arasindalik}})(),
    kesmeNoktalari:kn.noktalar,kopruler:kn.kopruler,yolAgirlik:yolAg};
  return {D,A}}

/* ====================== TOPLULUK BULMA: Louvain (Blondel vd., 2008) ====================== */
function modulerlik(G,c,gamma=1){const n=G.n;let m2=0;const k=new Float64Array(n);for(let i=0;i<n;i++)for(const [,w] of G.U[i]){k[i]+=G.agirlikli?w:1}m2=topla(k);if(!m2)return 0;
  const ic=new Map(),dc=new Map();for(let i=0;i<n;i++){dc.set(c[i],(dc.get(c[i])||0)+k[i]);for(const [j,w] of G.U[i])if(c[i]===c[j])ic.set(c[i],(ic.get(c[i])||0)+(G.agirlikli?w:1))}
  let Q=0;for(const [cc,d] of dc)Q+=(ic.get(cc)||0)/m2-gamma*(d/m2)**2;return Q}
function louvainTek(G,gamma,r){/* komşuluk: dizinler ve ağırlıklar; düzey düzey toplanır */
  let N=G.n,adj=G.U.map(L=>L.map(([j,w])=>[j,G.agirlikli?w:1]));let uye=Array.from({length:N},(_,i)=>i);/* özgün düğüm -> üst düğüm */
  let m2=0;for(const L of adj)for(const [,w] of L)m2+=w;if(!m2)return uye.map((_,i)=>i);
  for(let duzey=0;duzey<50;duzey++){const k=adj.map(L=>L.reduce((s,[,w])=>s+w,0)),self=adj.map((L,i)=>L.filter(([j])=>j===i).reduce((s,[,w])=>s+w,0));
    const com=Array.from({length:N},(_,i)=>i),tot=Float64Array.from(k);let degisti=false,iyi=true;const sira=Array.from({length:N},(_,i)=>i);
    for(let i=N-1;i>0;i--){const j=Math.floor(r()*(i+1));[sira[i],sira[j]]=[sira[j],sira[i]]}
    while(iyi){iyi=false;for(const v of sira){const cv=com[v];const w2c=new Map();for(const [u,w] of adj[v])if(u!==v)w2c.set(com[u],(w2c.get(com[u])||0)+w);
        tot[cv]-=k[v];let enC=cv,enK=(w2c.get(cv)||0)-gamma*tot[cv]*k[v]/m2;for(const [c,wc] of w2c){const g=wc-gamma*tot[c]*k[v]/m2;if(g>enK+1e-12){enK=g;enC=c}}
        tot[enC]+=k[v];if(enC!==cv){com[v]=enC;iyi=true;degisti=true}}}
    if(!degisti)break;const yeni=new Map();com.forEach(c=>{if(!yeni.has(c))yeni.set(c,yeni.size)});const M=yeni.size;
    uye=uye.map(u=>yeni.get(com[u]));const ag=Array.from({length:M},()=>new Map());for(let v=0;v<N;v++)for(const [u,w] of adj[v]){const a=yeni.get(com[v]),b=yeni.get(com[u]);ag[a].set(b,(ag[a].get(b)||0)+w)}
    adj=ag.map(m=>[...m.entries()]);N=M;void self}
  return uye}
/* yontem: 'louvain' (yönü yok sayar; özgün, varsayılan), 'dlouvain' (Leicht-Newman yönlü Louvain), 'leiden', 'infomap'. Ayrıntılar js/2c-yonlu-topluluk.js */
const TOPLULUK_YONTEMLERI=['louvain','dlouvain','leiden','infomap'];
function toplulukBul(G,o={}){const gamma=o.gamma??1,R=Math.max(1,o.tekrar??30),r=prng(o.tohum??7);const kos=[];
  let yontem=TOPLULUK_YONTEMLERI.includes(o.yontem)?o.yontem:'louvain';if(yontem==='dlouvain'&&!G.yonlu)yontem='louvain';
  const F=yontem==='infomap'?infomapAkis(G):null;if(yontem==='infomap'&&!F)yontem='louvain';
  for(let k=0;k<R;k++){let c,Q;
    if(yontem==='louvain'){c=louvainTek(G,gamma,r);Q=modulerlik(G,c,gamma)}
    else{c=yontem==='dlouvain'?yonluLouvainTek(G,gamma,r):yontem==='leiden'?leidenTek(G,gamma,r):infomapTek(F,r);Q=modulerlikYonlu(G,c,yontem==='infomap'?1:gamma)}
    const e={c,Q,skor:Q};if(F){e.L=imL(F,c);e.skor=-e.L}kos.push(e)}
  kos.sort((a,b)=>b.skor-a.skor);const en=kos[0];
  /* toplulukları büyüklüğe göre 0'dan numarala */
  const say=new Map();en.c.forEach(c=>say.set(c,(say.get(c)||0)+1));const sira=[...say.entries()].sort((a,b)=>b[1]-a[1]||a[0]-b[0]).map(x=>x[0]);const yeni=new Map(sira.map((c,i)=>[c,i]));const c=en.c.map(x=>yeni.get(x));
  /* kararlılık: düğümün en iyi bölmedeki topluluğu ile her koşudaki topluluğu arasındaki Jaccard benzerliğinin ortalaması */
  const uyeler=k=>{const m=new Map();k.forEach((x,i)=>{if(!m.has(x))m.set(x,[]);m.get(x).push(i)});return m};const enU=uyeler(c);
  const kar=new Float64Array(G.n);for(const ko of kos){const U2=uyeler(ko.c);for(let i=0;i<G.n;i++){const A=enU.get(c[i]),B=new Set(U2.get(ko.c[i]));let ks=0;for(const x of A)if(B.has(x))ks++;kar[i]+=ks/(A.length+B.size-ks)}}
  const karar=[...kar].map(x=>x/R);const kSay=sira.length;const tKar=Array.from({length:kSay},(_,k)=>ortala(enU.get(k).map(i=>karar[i])));
  return {c,Q:en.Q,k:kSay,boyut:sira.map(x=>say.get(x)),kararlilik:karar,toplulukKararlilik:tKar,Qaralik:[Math.min(...kos.map(x=>x.Q)),Math.max(...kos.map(x=>x.Q))],tekrar:R,gamma,yontem,L:F?en.L:null,L1:F?F.L1:null}}
/* İki bölme arasındaki normalleştirilmiş karşılıklı bilgi (aritmetik ortalama ile) */
function nmi(a,b){a=a.map(String);b=b.map(String);const n=a.length;const say=(x)=>{const m=new Map();x.forEach(v=>m.set(v,(m.get(v)||0)+1));return m};const A=say(a),B=say(b),AB=new Map();for(let i=0;i<n;i++){const k=a[i]+'\u0001'+b[i];AB.set(k,(AB.get(k)||0)+1)}
  const H=m=>-[...m.values()].reduce((s,c)=>s+(c/n)*Math.log(c/n),0);let I=0;for(const [k,c] of AB){const [x,y]=k.split('\u0001');I+=(c/n)*Math.log((c/n)/((A.get(x)/n)*(B.get(y)/n)))}
  const ha=H(A),hb=H(B);return ha+hb>0?2*I/(ha+hb):1}

/* ====================== ÇEKİRDEK-ÇEVRE (Borgatti ve Everett, 2000; kesikli model) ======================
   İdeal desen: çekirdek-çekirdek 1, çevre-çevre 0; çekirdek-çevre bağları yok sayılır (varsayılan) ya da 1 kabul edilir.
   Uyum, gözlenen ikili matris ile ideal desen arasındaki Pearson korelasyonudur. Yerel arama, çok başlangıçlı. */
function cekirdekCevre(G,o={}){const n=G.n,S=G.Um,yok=o.cpYoksay!==false,r=prng(o.tohum??11),M=G.U.reduce((s,L)=>s+L.length,0)/2;if(n<4||!M)return null;
  const uyum=(nc,acc,app)=>{const Ncc=nc*(nc-1)/2,Npp=(n-nc)*(n-nc-1)/2;let N,Sa,Sd,Sad;if(yok){N=Ncc+Npp;Sa=acc+app;Sd=Ncc;Sad=acc}else{N=n*(n-1)/2;Sa=M;Sd=N-Npp;Sad=M-app}
    const pay=N*Sad-Sa*Sd,p1=N*Sa-Sa*Sa,p2=N*Sd-Sd*Sd;return p1>0&&p2>0?pay/Math.sqrt(p1*p2):-1};
  const coz=(bas)=>{const c=Uint8Array.from(bas);const kc=new Int32Array(n);for(let i=0;i<n;i++)for(const [j] of G.U[i])if(c[j])kc[i]++;
    let nc=0,acc=0,app=0;for(let i=0;i<n;i++)if(c[i])nc++;for(let i=0;i<n;i++)for(const [j] of G.U[i])if(i<j){if(c[i]&&c[j])acc++;else if(!c[i]&&!c[j])app++}
    let f=uyum(nc,acc,app);for(let tur=0;tur<200;tur++){let enI=-1,enF=f;
      for(let i=0;i<n;i++){const d=G.U[i].length,kci=kc[i],kpi=d-kci;let f2;if(c[i])f2=uyum(nc-1,acc-kci,app+kpi);else f2=uyum(nc+1,acc+kci,app-kpi);if(f2>enF+1e-12){enF=f2;enI=i}}
      if(enI<0)break;const i=enI,d=G.U[i].length,kci=kc[i];if(c[i]){c[i]=0;nc--;acc-=kci;app+=d-kci;for(const [j] of G.U[i])kc[j]--}else{c[i]=1;nc++;acc+=kci;app-=d-kci;for(const [j] of G.U[i])kc[j]++}f=enF}
    return {c,f}};
  const der=G.U.map(L=>L.length);const sira=der.map((d,i)=>i).sort((a,b)=>der[b]-der[a]);let en=null;
  for(let k=0;k<(o.baslangic??25);k++){const bas=new Uint8Array(n);if(k===0){const t=Math.max(2,Math.round(n*.15));sira.slice(0,t).forEach(i=>bas[i]=1)}else for(let i=0;i<n;i++)bas[i]=r()<(.1+.4*r())?1:0;const z=coz(bas);if(!en||z.f>en.f)en=z}
  const c=[...en.c];let cc=0,cp=0,pp=0;const nc=c.filter(Boolean).length;for(let i=0;i<n;i++)for(const [j] of G.U[i])if(i<j){if(c[i]&&c[j])cc++;else if(c[i]||c[j])cp++;else pp++}
  const Ncc=nc*(nc-1)/2,Ncp=nc*(n-nc),Npp=(n-nc)*(n-nc-1)/2;return {cekirdek:c,uyum:en.f,nc,yogunluk:{cc:Ncc?cc/Ncc:null,cp:Ncp?cp/Ncp:null,pp:Npp?pp/Npp:null},cpYoksay:yok}}

/* ====================== E-I ENDEKSİ (Krackhardt ve Stern, 1988) ve permütasyon testi ====================== */
function eiEndeksi(G,deger,o={}){const n=G.n,R=o.perm??2000,r=prng(o.tohum??13);const gecerli=deger.map(v=>v!=null&&v!=='');const kenar=G.E.filter(e=>gecerli[e.s]&&gecerli[e.t]);if(!kenar.length)return null;
  const hesap=d=>{let E=0,I=0;for(const e of kenar)d[e.s]===d[e.t]?I++:E++;return (E-I)/(E+I)};const ei=hesap(deger);
  const gruplar=[...new Set(deger.filter((v,i)=>gecerli[i]))];const grupEI=gruplar.map(g=>{let E=0,I=0;for(const e of kenar){const a=deger[e.s]===g,b=deger[e.t]===g;if(a&&b)I++;else if(a||b)E++}return {g,E,I,ei:E+I?(E-I)/(E+I):null}});
  const ix=deger.map((v,i)=>i).filter(i=>gecerli[i]);const d2=deger.slice();let kucuk=0,buyuk=0,top=0;const dag=[];
  for(let k=0;k<R;k++){const vals=ix.map(i=>deger[i]);for(let i=vals.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[vals[i],vals[j]]=[vals[j],vals[i]]}ix.forEach((i,z)=>d2[i]=vals[z]);const v=hesap(d2);dag.push(v);top+=v;if(v<=ei+1e-12)kucuk++;if(v>=ei-1e-12)buyuk++}
  return {ei,beklenen:top/R,pKucuk:kucuk/R,pBuyuk:buyuk/R,grupEI,E:kenar.filter(e=>deger[e.s]!==deger[e.t]).length,I:kenar.filter(e=>deger[e.s]===deger[e.t]).length,perm:R}}

/* ====================== TRİAD VE DİAD SAYIMI (Batagelj ve Mrvar, 2001) ====================== */
const TRIAD_AD=['003','012','102','021D','021U','021C','111D','111U','030T','030C','201','120D','120U','120C','210','300'];
const TRIAD_KOD=[1,2,2,3,2,4,6,8,2,6,5,7,3,8,7,11,2,6,4,8,5,9,9,13,6,10,9,14,7,14,12,15,2,5,6,7,6,9,10,14,4,9,9,12,8,13,14,15,3,7,8,11,7,12,14,15,8,14,13,15,11,15,15,16];
function triadSayimi(G){if(!G.yonlu)return null;const n=G.n,A=Array.from({length:n},()=>new Set());G.E.forEach(e=>A[e.s].add(e.t));const tik=(i,j)=>A[i].has(j);
  const N=G.U.map(L=>L.map(x=>x[0]));const say=new Float64Array(16);const kod=(v,u,w)=>{let c=0;if(tik(v,u))c+=1;if(tik(u,v))c+=2;if(tik(v,w))c+=4;if(tik(w,v))c+=8;if(tik(u,w))c+=16;if(tik(w,u))c+=32;return TRIAD_KOD[c]-1};
  for(let v=0;v<n;v++)for(const u of N[v]){if(u<=v)continue;const Sx=new Set([...N[u],...N[v]]);Sx.delete(u);Sx.delete(v);const tip=(tik(v,u)&&tik(u,v))?2:1;say[tip]+=n-Sx.size-2;
    for(const w of Sx)if(u<w||(v<w&&w<u&&!N[v].includes(w)))say[kod(v,u,w)]++}
  const toplam=n*(n-1)*(n-2)/6;say[0]=toplam-topla(say.slice(1));const o={};TRIAD_AD.forEach((a,i)=>o[a]=say[i]);return o}
function diadSayimi(G){const n=G.n,S=new Set(G.E.map(e=>e.s*n+e.t));let M=0,A=0;if(!G.yonlu)return {M:G.m,A:0,N:n*(n-1)/2-G.m};for(const e of G.E){if(S.has(e.t*n+e.s)){if(e.s<e.t)M++}else A++}return {M,A,N:n*(n-1)/2-M-A}}

/* ====================== DERECE DAĞILIMI ve KÜÇÜK DÜNYA ====================== */
function dereceDagilimi(der){const m=new Map();der.forEach(d=>m.set(d,(m.get(d)||0)+1));const k=[...m.keys()].sort((a,b)=>a-b);const n=der.length;let kal=n;const ccdf=[];for(const d of k){ccdf.push([d,kal/n]);kal-=m.get(d)}return {deger:k,sayi:k.map(d=>m.get(d)),ccdf}}
/* Derece korunarak yeniden bağlama (çift kenar takası) ile rastgele karşılaştırma ağı */
function rastgeleKarsilik(G,r,tur=10){const n=G.n;const E=[];const S=new Set();for(let i=0;i<n;i++)for(const [j] of G.U[i])if(i<j){E.push([i,j]);S.add(i*n+j)}const m=E.length;if(m<2)return null;const anah=(a,b)=>a<b?a*n+b:b*n+a;
  for(let k=0;k<tur*m;k++){const x=Math.floor(r()*m),y=Math.floor(r()*m);if(x===y)continue;let [a,b]=E[x],[c,d]=E[y];if(r()<.5)[c,d]=[d,c];if(a===d||c===b||a===c||b===d)continue;if(S.has(anah(a,d))||S.has(anah(c,b)))continue;
    S.delete(anah(a,b));S.delete(anah(c,d));S.add(anah(a,d));S.add(anah(c,b));E[x]=[a,d];E[y]=[c,b]}
  const U=Array.from({length:n},()=>[]),Um=Array.from({length:n},()=>new Map());for(const [a,b] of E){U[a].push([b,1]);U[b].push([a,1]);Um[a].set(b,1);Um[b].set(a,1)}return {n,m,U,Um,out:U,inn:U,E:E.map(([s,t])=>({s,t,w:1})),yonlu:false,agirlikli:false}}
function enBuyukParca(G){const b=bilesenler(G);const enb=b.boyut.indexOf(Math.max(...b.boyut));const ix=b.etiket.map((x,i)=>i).filter(i=>b.etiket[i]===enb);const yeni=new Map(ix.map((v,k)=>[v,k]));
  const U=ix.map(i=>G.U[i].filter(([j])=>yeni.has(j)).map(([j])=>[yeni.get(j),1]));const Um=U.map(L=>new Map(L.map(([j])=>[j,1])));const E=[];U.forEach((L,i)=>L.forEach(([j])=>{if(i<j)E.push({s:i,t:j,w:1})}));
  return {n:ix.length,m:E.length,U,Um,out:U,inn:U,E,yonlu:false,agirlikli:false}}
function kucukDunya(G,o={}){const H=enBuyukParca(G);if(H.n<10||H.m<H.n)return null;const r=prng(o.tohum??17),k=o.tekrar??10;
  const C=kumelenme(H).ortalama,L=yakinlik(H,false).ortUzaklik;let Cr=0,Lr=0,say=0;for(let i=0;i<k;i++){const R=rastgeleKarsilik(H,r);if(!R)continue;const RL=yakinlik(R,false).ortUzaklik;if(!RL)continue;Cr+=kumelenme(R).ortalama;Lr+=RL;say++}
  if(!say)return null;Cr/=say;Lr/=say;return {C,L,Cr,Lr,sigma:Cr>0?(C/Cr)/(L/Lr):null,n:H.n,tekrar:say}}

/* ====================== DAYANIKLILIK: düğüm çıkarma benzetimi ======================
   Her adımda en büyük bileşenin özgün düğüm sayısına oranı. R endeksi (Schneider vd., 2011) eğrinin ortalamasıdır. */
function dayaniklilik(G,o={}){const n=G.n;if(n<3)return null;const r=prng(o.tohum??19);
  const egri=(sira)=>{/* ters sırayla ekleyerek birleşim-bul */const par=new Int32Array(n).fill(-1),boy=new Int32Array(n).fill(1),var_=new Uint8Array(n);const bul=x=>{while(par[x]>=0&&par[par[x]]>=0){par[x]=par[par[x]];x=par[x]}return par[x]>=0?par[x]:x};
    const S=new Array(n+1).fill(0);let enb=0;for(let k=n-1;k>=0;k--){const v=sira[k];var_[v]=1;enb=Math.max(enb,1);for(const [u] of G.U[v])if(var_[u]){let a=bul(v),b=bul(u);if(a!==b){if(boy[a]<boy[b])[a,b]=[b,a];par[b]=a;boy[a]+=boy[b];if(boy[a]>enb)enb=boy[a]}}S[k]=enb/n}S[n]=0;return S};
  const der=G.U.map(L=>L.length);/* uyarlanır derece: her çıkarmadan sonra yeniden */
  const kalan=new Uint8Array(n).fill(1),d=der.slice(),sDer=[];for(let k=0;k<n;k++){let en=-1;for(let i=0;i<n;i++)if(kalan[i]&&(en<0||d[i]>d[en]))en=i;sDer.push(en);kalan[en]=0;for(const [u] of G.U[en])if(kalan[u])d[u]--}
  const ar=o.arasindalik||arasindalik(G,false).ham;const sAra=ar.map((b,i)=>i).sort((a,b)=>ar[b]-ar[a]||der[b]-der[a]);
  const T=o.rastgeleTekrar??20,rast=new Array(n+1).fill(0);for(let k=0;k<T;k++){const s=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[s[i],s[j]]=[s[j],s[i]]}egri(s).forEach((v,i)=>rast[i]+=v/T)}
  const D=egri(sDer),A=egri(sAra);const R=x=>topla(x.slice(1,n+1))/n;return {derece:D,arasindalik:A,rastgele:rast,R:{derece:R(D),arasindalik:R(A),rastgele:R(rast)},n}}

/* ====================== OMURGA: eşitsizlik süzgeci (Serrano, Boguñá ve Vespignani, 2009) ====================== */
function omurga(G,alfa=0.05){if(!G.agirlikli)return null;const n=G.n;const gS=G.yonlu?G.out:G.U,gG=G.yonlu?G.inn:G.U;const sC=gS.map(L=>topla(L.map(x=>x[1]))),sG=gG.map(L=>topla(L.map(x=>x[1])));
  const a=(w,s,k)=>k>1&&s>0?Math.pow(1-w/s,k-1):1;const kalan=[];
  for(let k=0;k<G.E.length;k++){const e=G.E[k];const a1=a(e.w,sC[e.s],gS[e.s].length),a2=a(e.w,sG[e.t],gG[e.t].length);if(Math.min(a1,a2)<alfa)kalan.push(k)}return kalan}

/* ====================== QAP ve MRQAP ======================
   Matrisler n x n dizi olarak tutulur; yönsüz ağda i<j, yönlü ağda i!=j hücreleri kullanılır.
   QAP korelasyonu (Krackhardt, 1988); MRQAP çift yarı kısmi artık permütasyonu (Dekker, Krackhardt ve Snijders, 2007). */
function iliskiMatrisi(p,iliskiId){const G=agKur(p,iliskiId);if(!G)return null;const n=G.n,M=new Float64Array(n*n);for(const e of G.E){M[e.s*n+e.t]=e.w;if(!G.yonlu)M[e.t*n+e.s]=e.w}return M}
function ozellikMatrisi(p,k){const o=p.ozellikler.find(x=>x.k===k);if(!o)return null;const n=p.dugumler.length,v=p.dugumler.map(d=>d.oz[k]);const M=new Float64Array(n*n);
  if(o.tur==='sayi'){const x=v.map(sayiOku);for(let i=0;i<n;i++)for(let j=0;j<n;j++)M[i*n+j]=x[i]==null||x[j]==null?NaN:Math.abs(x[i]-x[j])}
  else for(let i=0;i<n;i++)for(let j=0;j<n;j++)M[i*n+j]=v[i]==null||v[i]===''||v[j]==null||v[j]===''?NaN:(v[i]===v[j]?1:0);return M}
function hucreler(n,yonlu){const L=[];for(let i=0;i<n;i++)for(let j=yonlu?0:i+1;j<n;j++)if(i!==j)L.push(i*n+j);return L}
function korelasyon(a,b){const n=a.length;let sa=0,sb=0;for(let i=0;i<n;i++){sa+=a[i];sb+=b[i]}const ma=sa/n,mb=sb/n;let p=0,qa=0,qb=0;for(let i=0;i<n;i++){const x=a[i]-ma,y=b[i]-mb;p+=x*y;qa+=x*x;qb+=y*y}return qa>0&&qb>0?p/Math.sqrt(qa*qb):null}
function karistir(n,r){const s=Int32Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=s[i];s[i]=s[j];s[j]=t}return s}
const bekle=()=>new Promise(r=>setTimeout(r,0));
async function qapKorelasyon(n,yonlu,Y,X,o={}){const R=o.perm??1000,r=prng(o.tohum??23),H=hucreler(n,yonlu).filter(h=>!isNaN(Y[h])&&!isNaN(X[h]));if(H.length<3)return null;
  const x=Float64Array.from(H,h=>X[h]),y=Float64Array.from(H,h=>Y[h]);const r0=korelasyon(y,x);if(r0==null)return null;let ust=0,alt=0,mut=0;const yp=new Float64Array(H.length);
  for(let k=0;k<R;k++){const s=karistir(n,r);for(let z=0;z<H.length;z++){const h=H[z],i=Math.floor(h/n),j=h%n;yp[z]=Y[s[i]*n+s[j]]}const v=korelasyon(yp,x);if(v==null)continue;if(v>=r0-1e-12)ust++;if(v<=r0+1e-12)alt++;if(Math.abs(v)>=Math.abs(r0)-1e-12)mut++;if(o.ilerleme&&k%50===49){o.ilerleme((k+1)/R);await bekle()}}
  return {r:r0,pUst:ust/R,pAlt:alt/R,p:mut/R,perm:R,hucre:H.length}}
function ekk(Xs,y){/* en küçük kareler: Xs sütun dizileri (sabit ekli), normal denklemler */const p=Xs.length,N=y.length;const A=Array.from({length:p},()=>new Float64Array(p)),b=new Float64Array(p);
  for(let a=0;a<p;a++){for(let c=a;c<p;c++){let s=0;const xa=Xs[a],xc=Xs[c];for(let i=0;i<N;i++)s+=xa[i]*xc[i];A[a][c]=A[c][a]=s}let s=0;for(let i=0;i<N;i++)s+=Xs[a][i]*y[i];b[a]=s}
  const inv=tersMatris(A);if(!inv)return null;const be=inv.map(row=>row.reduce((s,v,k)=>s+v*b[k],0));let sse=0,sst=0;const my=ortala(y);for(let i=0;i<N;i++){let f=0;for(let a=0;a<p;a++)f+=be[a]*Xs[a][i];sse+=(y[i]-f)**2;sst+=(y[i]-my)**2}
  const s2=sse/Math.max(1,N-p);const se=inv.map((row,a)=>Math.sqrt(Math.max(0,row[a]*s2)));return {b:be,se,t:be.map((v,a)=>se[a]>0?v/se[a]:0),R2:sst>0?1-sse/sst:0,N}}
function tersMatris(A){const n=A.length,M=A.map((r,i)=>[...r,...Array.from({length:n},(_,j)=>i===j?1:0)]);for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;if(Math.abs(M[p][c])<1e-12)return null;[M[c],M[p]]=[M[p],M[c]];const d=M[c][c];for(let j=0;j<2*n;j++)M[c][j]/=d;for(let r=0;r<n;r++)if(r!==c){const f=M[r][c];if(f)for(let j=0;j<2*n;j++)M[r][j]-=f*M[c][j]}}return M.map(r=>r.slice(n))}
async function mrqap(n,yonlu,Y,Xler,o={}){const R=o.perm??1000,r=prng(o.tohum??29);const H=hucreler(n,yonlu).filter(h=>!isNaN(Y[h])&&Xler.every(X=>!isNaN(X[h])));const N=H.length,K=Xler.length;if(N<K+3)return null;
  const bir=new Float64Array(N).fill(1),y=Float64Array.from(H,h=>Y[h]),xs=Xler.map(X=>Float64Array.from(H,h=>X[h]));const tam=ekk([bir,...xs],y);if(!tam)return null;
  const sdy=Math.sqrt(ortala([...y].map(v=>(v-ortala(y))**2)));const beta=xs.map((x,k)=>{const m=ortala(x);const sd=Math.sqrt(ortala([...x].map(v=>(v-m)**2)));return sdy>0?tam.b[k+1]*sd/sdy:null});
  const p=new Array(K).fill(0);const hucreIx=new Map(H.map((h,z)=>[h,z]));
  for(let k=0;k<K;k++){const diger=[bir,...xs.filter((_,z)=>z!==k)];const ar=ekk(diger,xs[k]);if(!ar)continue;const res=new Float64Array(n*n).fill(NaN);
    for(let z=0;z<N;z++){let f=0;for(let a=0;a<diger.length;a++)f+=ar.b[a]*diger[a][z];res[H[z]]=xs[k][z]-f}
    const t0=tam.t[k+1];let say=0;const rp=new Float64Array(N);
    for(let q=0;q<R;q++){const s=karistir(n,r);for(let z=0;z<N;z++){const h=H[z],i=Math.floor(h/n),j=h%n;const v=res[s[i]*n+s[j]];rp[z]=isNaN(v)?0:v}
      const f=ekk([...diger,rp],y);if(f&&Math.abs(f.t[f.t.length-1])>=Math.abs(t0)-1e-12)say++;if(o.ilerleme&&q%25===24){o.ilerleme((k*R+q+1)/(K*R));await bekle()}}p[k]=say/R}
  void hucreIx;return {b:tam.b,se:tam.se,t:tam.t,beta,p,R2:tam.R2,N,perm:R}}
