/* ====================== YÖNLÜ AĞLAR İÇİN TOPLULUK BULMA ======================
   Üç yöntem, yönü yok saymadan çalışır (yönsüz ağda da kullanılabilir; bağlar iki yönlü sayılır):
   1) Yönlü Louvain: Leicht ve Newman (2008) modülerliği, Dugué ve Perez (2015) taşıma kazancıyla.
      Q = (1/m) Σ [A_ij - γ kçıkış_i kgiriş_j / m] δ(c_i, c_j)
   2) Leiden: Traag, Waltman ve van Eck (2019); yerel taşıma, iyi bağlı topluluk için inceleme (refinement) ve toplama.
      Aynı yönlü modülerliği kullanır.
   3) Infomap: Rosvall ve Bergstrom (2008); rastgele yürüyüşün harita denklemiyle (bit cinsinden kod uzunluğu) en kısa kodlanışını arar.
      Yönlü ağda yürüyüş, yeniden başlatma (teleportation) olasılığı 0,15 ile PageRank benzeri durağan dağılıma oturtulur. */

const renkNo=a=>{const m=new Map(),r=new Array(a.length);for(let i=0;i<a.length;i++){let k=m.get(a[i]);if(k===undefined){k=m.size;m.set(a[i],k)}r[i]=k}return {a:r,K:m.size}};
const kimlikDizi=N=>Array.from({length:N},(_,i)=>i);

/* ---------- Leicht-Newman yönlü modülerlik ---------- */
function modulerlikYonlu(G,c,gamma=1){const n=G.n,ko=new Float64Array(n),ki=new Float64Array(n);let m=0;
  for(let i=0;i<n;i++)for(const [j,w] of G.out[i]){ko[i]+=w;ki[j]+=w;m+=w}
  if(!m)return 0;const ic=new Map(),so=new Map(),si=new Map();
  for(let i=0;i<n;i++){so.set(c[i],(so.get(c[i])||0)+ko[i]);si.set(c[i],(si.get(c[i])||0)+ki[i]);for(const [j,w] of G.out[i])if(c[i]===c[j])ic.set(c[i],(ic.get(c[i])||0)+w)}
  let Q=0;for(const [k,o] of so)Q+=(ic.get(k)||0)/m-gamma*o*si.get(k)/(m*m);return Q}

/* ---------- ortak çekirdek: yönlü ağ durumu, taşıma, toplama ---------- */
function yonluTaban(G){const N=G.n,ko=new Float64Array(N),ki=new Float64Array(N);let m=0;
  for(let i=0;i<N;i++)for(const [j,w] of G.out[i]){ko[i]+=w;ki[j]+=w;m+=w}
  return {N,out:G.out,inn:G.inn,ko,ki,m}}
/* Düğümleri komşu topluluklara taşır. kuyruk=true: Leiden'in hızlı yerel taşıması; false: Louvain'in tam süpürmesi. */
function yonluHareket(S,com,gamma,r,kuyruk){const {N,out,inn,ko,ki,m}=S;let K=0;for(const c of com)if(c+1>K)K=c+1;K=Math.max(K,N);
  const To=new Float64Array(K),Ti=new Float64Array(K);for(let v=0;v<N;v++){To[com[v]]+=ko[v];Ti[com[v]]+=ki[v]}
  let degisti=false;
  const dene=v=>{const cv=com[v],mp=new Map();
    for(const [u,w] of out[v]){const c=com[u];let e=mp.get(c);if(!e){e=[0,0];mp.set(c,e)}e[0]+=w}
    for(const [u,w] of inn[v]){const c=com[u];let e=mp.get(c);if(!e){e=[0,0];mp.set(c,e)}e[1]+=w}
    To[cv]-=ko[v];Ti[cv]-=ki[v];
    const kazanc=c=>{const e=mp.get(c)||[0,0];return e[0]+e[1]-gamma*(ko[v]*Ti[c]+ki[v]*To[c])/m};
    let en=cv,eg=kazanc(cv);for(const c of mp.keys()){if(c===cv)continue;const g=kazanc(c);if(g>eg+1e-12){eg=g;en=c}}
    To[en]+=ko[v];Ti[en]+=ki[v];if(en!==cv){com[v]=en;degisti=true;return en}return -1};
  if(!kuyruk){let iyi=true,tur=0;while(iyi&&tur++<200){iyi=false;for(const v of karistir(N,r))if(dene(v)>=0)iyi=true}}
  else{const Q=Array.from(karistir(N,r)),var_=new Uint8Array(N).fill(1);let bas=0;
    while(bas<Q.length){const v=Q[bas++];var_[v]=0;const y=dene(v);if(y>=0){for(const [u] of out[v])if(com[u]!==y&&!var_[u]){var_[u]=1;Q.push(u)}for(const [u] of inn[v])if(com[u]!==y&&!var_[u]){var_[u]=1;Q.push(u)}}
      if(bas>4096&&bas*2>Q.length){Q.splice(0,bas);bas=0}}}
  return degisti}
/* ref: düğüm -> yeni düğüm (0..M-1); aynı gruba düşen düğümler tek düğüm olur. Toplam derece korunur, grup içi bağlar atılır. */
function yonluTopla(S,ref,M){const mp=Array.from({length:M},()=>new Map()),ko=new Float64Array(M),ki=new Float64Array(M);
  for(let v=0;v<S.N;v++){const a=ref[v];ko[a]+=S.ko[v];ki[a]+=S.ki[v];for(const [u,w] of S.out[v]){const b=ref[u];if(a!==b)mp[a].set(b,(mp[a].get(b)||0)+w)}}
  const inn=Array.from({length:M},()=>[]);const out=mp.map((x,a)=>{const L=[...x];for(const [b,w] of L)inn[b].push([a,w]);return L});
  return {N:M,out,inn,ko,ki,m:S.m}}

/* ---------- 1) Yönlü Louvain ---------- */
function yonluLouvainTek(G,gamma,r){let S=yonluTaban(G),uye=kimlikDizi(G.n);if(!S.m)return uye;
  for(let duzey=0;duzey<50;duzey++){const com=kimlikDizi(S.N);if(!yonluHareket(S,com,gamma,r,false))break;const {a,K}=renkNo(com);uye=uye.map(u=>a[u]);if(K===S.N)break;S=yonluTopla(S,a,K)}
  return uye}

/* ---------- 2) Leiden ---------- */
/* İnceleme: her topluluğun içinde tek düğümlü gruplardan başlar; iyi bağlı düğümler, iyi bağlı alt gruplara olasılıkla (sıcaklık θ) katılır. */
function leidenInce(S,com,Kc,gamma,r,theta){const {N,out,inn,ko,ki,m}=S;const ref=kimlikDizi(N),Co=Float64Array.from(ko),Ci=Float64Array.from(ki),To=new Float64Array(Kc),Ti=new Float64Array(Kc),dis=new Float64Array(N),tek=new Uint8Array(N).fill(1);
  for(let v=0;v<N;v++){To[com[v]]+=ko[v];Ti[com[v]]+=ki[v];for(const [u,w] of out[v])if(com[u]===com[v])dis[v]+=w;for(const [u,w] of inn[v])if(com[u]===com[v])dis[v]+=w}
  const iyiBagli=(d,o,i,Sc)=>d>=gamma*(o*(Ti[Sc]-i)+i*(To[Sc]-o))/m-1e-12;
  for(const v of karistir(N,r)){if(!tek[v])continue;const Sc=com[v];if(!iyiBagli(dis[v],ko[v],ki[v],Sc))continue;
    const mp=new Map();for(const [u,w] of out[v])if(com[u]===Sc){const c=ref[u];let e=mp.get(c);if(!e){e=[0,0];mp.set(c,e)}e[0]+=w}
    for(const [u,w] of inn[v])if(com[u]===Sc){const c=ref[u];let e=mp.get(c);if(!e){e=[0,0];mp.set(c,e)}e[1]+=w}
    const ad=[v],dq=[0];
    for(const [c,e] of mp){if(c===v)continue;if(!iyiBagli(dis[c],Co[c],Ci[c],Sc))continue;const g=(e[0]+e[1]-gamma*(ko[v]*Ci[c]+ki[v]*Co[c])/m)/m;if(g>=0){ad.push(c);dq.push(g)}}
    if(ad.length<2)continue;const mx=Math.max(...dq),pr=dq.map(x=>Math.exp((x-mx)/theta));let t=pr.reduce((a,b)=>a+b,0)*r(),s=0;for(;s<pr.length-1;s++){t-=pr[s];if(t<=0)break}
    const c=ad[s];if(c===v)continue;const e=mp.get(c);dis[c]=dis[c]+dis[v]-2*(e[0]+e[1]);Co[c]+=ko[v];Ci[c]+=ki[v];ref[v]=c;tek[v]=0;tek[c]=0}
  return renkNo(ref)}
function leidenTek(G,gamma,r,theta=0.01){let S=yonluTaban(G),uye=kimlikDizi(G.n);if(!S.m)return uye;let com=kimlikDizi(S.N);
  for(let duzey=0;duzey<50;duzey++){yonluHareket(S,com,gamma,r,true);const rn=renkNo(com);com=rn.a;if(rn.K===S.N)break;
    const ref=leidenInce(S,com,rn.K,gamma,r,theta);if(ref.K===S.N)break;
    uye=uye.map(u=>ref.a[u]);const S2=yonluTopla(S,ref.a,ref.K),com2=new Array(ref.K);for(let v=0;v<S.N;v++)com2[ref.a[v]]=com[v];S=S2;com=renkNo(com2).a}
  return uye.map(u=>com[u])}

/* ---------- 3) Infomap (iki düzeyli harita denklemi) ---------- */
const plg=x=>x>1e-300?x*Math.log2(x):0;
const IM_TAU=0.15;
/* Akış: düğüm ziyaret oranları p, bağ akışları f, yeniden başlatma payı tp. Yönsüz ağda p dereceyle orantılıdır ve yeniden başlatma yoktur. */
function infomapAkis(G,tau=IM_TAU){const n=G.n,s=new Float64Array(n);for(let i=0;i<n;i++)for(const [,w] of G.out[i])s[i]+=w;
  const W=topla(s);if(!W)return null;const p=new Float64Array(n),tp=new Float64Array(n),fo=Array.from({length:n},()=>[]),fi=Array.from({length:n},()=>[]),ft=new Float64Array(n);
  if(!G.yonlu){for(let i=0;i<n;i++){p[i]=s[i]/W;for(const [j,w] of G.out[i]){fo[i].push([j,w/W]);fi[j].push([i,w/W]);ft[i]+=w/W}}}
  else{const ta=Float64Array.from(s,x=>x>0?tau:1);p.fill(1/n);
    for(let it=0;it<3000;it++){const q=new Float64Array(n);let tel=0;for(let i=0;i<n;i++){tel+=ta[i]*p[i];if(s[i]>0)for(const [j,w] of G.out[i])q[j]+=(1-tau)*p[i]*w/s[i]}
      let top=0,fark=0;for(let i=0;i<n;i++){q[i]+=tel/n;top+=q[i]}for(let i=0;i<n;i++){q[i]/=top;fark+=Math.abs(q[i]-p[i]);p[i]=q[i]}if(fark<1e-14)break}
    for(let i=0;i<n;i++){tp[i]=ta[i]*p[i];if(s[i]>0)for(const [j,w] of G.out[i]){const f=(1-tau)*p[i]*w/s[i];fo[i].push([j,f]);fi[j].push([i,f]);ft[i]+=f}}}
  let dl=0,H=0;for(let i=0;i<n;i++)dl+=plg(p[i]);H=-dl;
  return {n,taban:{N:n,p,tp,cnt:new Float64Array(n).fill(1),fo,fi,ft},dugumLog:dl,L1:H}}
function imKod(F,P,T,C,X,K){let sq=0,a=0,b=0;for(let c=0;c<K;c++){if(!P[c]&&!X[c])continue;const q=Math.max(0,T[c]*(F.n-C[c])/F.n+X[c]);sq+=q;a+=plg(q);b+=plg(q+P[c])}return plg(sq)-2*a+b-F.dugumLog}
function imDurum(S,com,K){const P=new Float64Array(K),T=new Float64Array(K),C=new Float64Array(K),X=new Float64Array(K);
  for(let v=0;v<S.N;v++){const c=com[v];P[c]+=S.p[v];T[c]+=S.tp[v];C[c]+=S.cnt[v];for(const [u,f] of S.fo[v])if(com[u]!==c)X[c]+=f}return {P,T,C,X}}
/* Verilen bölmenin kod uzunluğu L (bit/adım) */
function imL(F,c){const rn=renkNo(c),d=imDurum(F.taban,rn.a,rn.K);return imKod(F,d.P,d.T,d.C,d.X,rn.K)}
function imHareket(F,S,com,r){const N=S.N;let K=0;for(const c of com)if(c+1>K)K=c+1;K=Math.max(K,N);const {P,T,C,X}=imDurum(S,com,K);const n=F.n;
  const q=c=>Math.max(0,T[c]*(n-C[c])/n+X[c]);let sq=0,sa=0,sb=0;for(let c=0;c<K;c++){if(!P[c]&&!X[c])continue;const x=q(c);sq+=x;sa+=plg(x);sb+=plg(x+P[c])}
  let degisti=false;
  for(let tur=0;tur<100;tur++){let hareket=false;
    for(const v of karistir(N,r)){const A=com[v],mp=new Map();
      for(const [u,f] of S.fo[v]){const c=com[u];let e=mp.get(c);if(!e){e=[0,0];mp.set(c,e)}e[0]+=f}
      for(const [u,f] of S.fi[v]){const c=com[u];let e=mp.get(c);if(!e){e=[0,0];mp.set(c,e)}e[1]+=f}
      const eA=mp.get(A)||[0,0],qA=q(A),pA=P[A],pv=S.p[v],tv=S.tp[v],cv=S.cnt[v],ft=S.ft[v];
      const PA=pA-pv,TA=T[A]-tv,CA=C[A]-cv,XA=X[A]-(ft-eA[0])+eA[1],qA2=Math.max(0,TA*(n-CA)/n+XA);
      const L0=plg(sq)-2*sa+sb-F.dugumLog;let en=A,eL=L0-1e-10;
      for(const [B,e] of mp){if(B===A)continue;const qB=q(B),PB=P[B]+pv,TB=T[B]+tv,CB=C[B]+cv,XB=X[B]+(ft-e[0])-e[1],qB2=Math.max(0,TB*(n-CB)/n+XB);
        const sq2=sq-qA-qB+qA2+qB2,sa2=sa-plg(qA)-plg(qB)+plg(qA2)+plg(qB2),sb2=sb-plg(qA+pA)-plg(qB+P[B])+plg(qA2+PA)+plg(qB2+PB),L=plg(sq2)-2*sa2+sb2-F.dugumLog;
        if(L<eL){eL=L;en=B}}
      if(en!==A){const e=mp.get(en),qB=q(en);const PB=P[en]+pv,TB=T[en]+tv,CB=C[en]+cv,XB=X[en]+(ft-e[0])-e[1];
        sq+=-qA-qB;sa+=-plg(qA)-plg(qB);sb+=-plg(qA+pA)-plg(qB+P[en]);
        P[A]=PA;T[A]=TA;C[A]=CA;X[A]=XA;P[en]=PB;T[en]=TB;C[en]=CB;X[en]=XB;com[v]=en;
        const a2=q(A),b2=q(en);sq+=a2+b2;sa+=plg(a2)+plg(b2);sb+=plg(a2+P[A])+plg(b2+P[en]);hareket=true;degisti=true}}
    if(!hareket)break}
  return degisti}
function imTopla(S,ren,K){const p=new Float64Array(K),tp=new Float64Array(K),cnt=new Float64Array(K),mp=Array.from({length:K},()=>new Map());
  for(let v=0;v<S.N;v++){const a=ren[v];p[a]+=S.p[v];tp[a]+=S.tp[v];cnt[a]+=S.cnt[v];for(const [u,f] of S.fo[v]){const b=ren[u];if(a!==b)mp[a].set(b,(mp[a].get(b)||0)+f)}}
  const fi=Array.from({length:K},()=>[]),ft=new Float64Array(K);const fo=mp.map((x,a)=>{const L=[...x];for(const [b,f] of L){fi[b].push([a,f]);ft[a]+=f}return L});
  return {N:K,p,tp,cnt,fo,fi,ft}}
function infomapGecis(F,r,ilk){let S=F.taban,uye=kimlikDizi(F.n),com=ilk?ilk.slice():kimlikDizi(S.N);
  for(let duzey=0;duzey<50;duzey++){const h=imHareket(F,S,com,r);const rn=renkNo(com);uye=uye.map(u=>rn.a[u]);if(rn.K===S.N||(!h&&duzey>0))break;S=imTopla(S,rn.a,rn.K);com=kimlikDizi(S.N)}
  return uye}
function infomapTek(F,r){let c=infomapGecis(F,r,null),L=imL(F,c);
  for(let it=0;it<4;it++){const c2=infomapGecis(F,r,renkNo(c).a),L2=imL(F,c2);if(L2<L-1e-9){c=c2;L=L2}else break}
  /* Infomap gibi, tek topluluklu kodlamayı da aday sayar: bölme onu kısaltamıyorsa ağda topluluk yapısı yoktur */
  if(F.L1<=L+1e-9)return new Array(F.n).fill(0);
  return renkNo(c).a}
