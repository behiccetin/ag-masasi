/* ====================== EK İSTATİSTİK TESTLERİ ======================
   Koşullu tek biçimli çizge testi (Anderson, Butts ve Carley, 1999), düğüm düzeyinde permütasyon testi,
   asortativite testi (Newman, 2003) ve modülerliğin anlamlılığı (Guimerà, Sales-Pardo ve Amaral, 2004). */
function gYap(n,ciftler,yonlu){const E=ciftler.map(([s,t])=>({s,t,w:1}));const out=Array.from({length:n},()=>[]),inn=Array.from({length:n},()=>[]),Um=Array.from({length:n},()=>new Map());
  for(const e of E){out[e.s].push([e.t,1]);inn[e.t].push([e.s,1]);Um[e.s].set(e.t,1);Um[e.t].set(e.s,1);if(!yonlu){out[e.t].push([e.s,1]);inn[e.s].push([e.t,1])}}
  return {n,m:E.length,E,out,inn,U:Um.map(m=>[...m.entries()]),Um,yonlu,agirlikli:false}}
const ikiliCift=G=>G.E.map(e=>[e.s,e.t]);
/* yoğunluğu koruyan rastgele ağ: aynı düğüm ve bağ sayısı */
function rastgeleUm(n,m,yonlu,r){const N=yonlu?n*(n-1):n*(n-1)/2;const kod=k=>{if(yonlu){const i=Math.floor(k/(n-1));let j=k%(n-1);if(j>=i)j++;return [i,j]}let i=0,kal=k;while(kal>=n-1-i){kal-=n-1-i;i++}return [i,i+1+kal]};
  const sec=new Set();if(m>N/2){const dis=new Set();while(dis.size<N-m)dis.add(Math.floor(r()*N));for(let k=0;k<N;k++)if(!dis.has(k))sec.add(k)}else while(sec.size<m)sec.add(Math.floor(r()*N));
  return gYap(n,[...sec].map(kod),yonlu)}
/* dereceleri koruyan rastgele ağ: çift kenar takası (Maslov ve Sneppen, 2002) */
function rastgeleDerece(n,ciftler,yonlu,r,tur=10){const E=ciftler.map(c=>c.slice()),m=E.length;if(m<2)return gYap(n,E,yonlu);const an=(a,b)=>yonlu||a<b?a*n+b:b*n+a;const S=new Set(E.map(([a,b])=>an(a,b)));
  for(let k=0;k<tur*m;k++){const x=Math.floor(r()*m),y=Math.floor(r()*m);if(x===y)continue;let [a,b]=E[x],[c,d]=E[y];if(!yonlu&&r()<.5)[c,d]=[d,c];
    if(a===d||c===b||a===c||b===d)continue;if(S.has(an(a,d))||S.has(an(c,b)))continue;S.delete(an(a,b));S.delete(an(c,d));S.add(an(a,d));S.add(an(c,b));E[x]=[a,d];E[y]=[c,b]}
  return gYap(n,E,yonlu)}
function dereceMerkezilesmesi(G){const n=G.n;if(n<3)return null;const d=G.U.map(L=>L.length),mx=Math.max(...d);return topla(d.map(x=>mx-x))/((n-1)*(n-2))}
const CUG_OLCU=[{k:'gecislilik',f:G=>kumelenme(G).gecislilik},{k:'ortKumelenme',f:G=>kumelenme(G).ortalama},{k:'karsiliklilik',f:G=>karsiliklilik(G),yonlu:1},{k:'merkDerece',f:dereceMerkezilesmesi,dereceSabit:1},{k:'dereceUyumu',f:G=>dereceUyumu(G)}];
function dagilimOzet(gz,L){const v=L.filter(x=>x!=null&&isFinite(x));if(!v.length||gz==null)return null;const m=ortala(v),sd=Math.sqrt(ortala(v.map(x=>(x-m)**2)));const e=1e-12;
  return {gozlenen:gz,ort:m,sd,z:sd>0?(gz-m)/sd:null,pUst:v.filter(x=>x>=gz-e).length/v.length,pAlt:v.filter(x=>x<=gz+e).length/v.length,R:v.length}}
async function cugTesti(G,o={}){const R=o.perm??500,r=prng(o.tohum??31),model=o.model||'um';const C=ikiliCift(G),H=gYap(G.n,C,G.yonlu);
  const olc=CUG_OLCU.filter(x=>(!x.yonlu||G.yonlu)&&!(model==='derece'&&x.dereceSabit));const gz=olc.map(x=>x.f(H));const dag=olc.map(()=>[]);
  for(let k=0;k<R;k++){const Z=model==='derece'?rastgeleDerece(G.n,C,G.yonlu,r):rastgeleUm(G.n,C.length,G.yonlu,r);olc.forEach((x,i)=>dag[i].push(x.f(Z)));if(o.ilerleme&&k%20===19){o.ilerleme((k+1)/R);await bekle()}}
  return {model,perm:R,n:G.n,m:C.length,agirlikli:G.agirlikli,satir:olc.map((x,i)=>({k:x.k,...(dagilimOzet(gz[i],dag[i])||{gozlenen:gz[i]})}))}}
/* düğüm düzeyinde permütasyon testi: kategorik özellik için F (tek yönlü varyans analizi), sayısal özellik için Pearson r */
async function dugumTesti(y,x,tur,o={}){const R=o.perm??2000,r=prng(o.tohum??37);const ix=y.map((v,i)=>i).filter(i=>y[i]!=null&&isFinite(y[i])&&x[i]!=null&&x[i]!=='');if(ix.length<4)return null;
  const Y=ix.map(i=>y[i]);let X=ix.map(i=>x[i]);const N=Y.length;
  if(tur==='sayi'){X=X.map(Number);const r0=korelasyon(Float64Array.from(Y),Float64Array.from(X));if(r0==null)return null;let ust=0,alt=0,mut=0;const xp=X.slice();
    for(let k=0;k<R;k++){for(let i=N-1;i>0;i--){const j=Math.floor(r()*(i+1));[xp[i],xp[j]]=[xp[j],xp[i]]}const v=korelasyon(Float64Array.from(Y),Float64Array.from(xp));if(v==null)continue;if(v>=r0-1e-12)ust++;if(v<=r0+1e-12)alt++;if(Math.abs(v)>=Math.abs(r0)-1e-12)mut++;if(o.ilerleme&&k%200===199){o.ilerleme((k+1)/R);await bekle()}}
    return {tur,r:r0,r2:r0*r0,pUst:ust/R,pAlt:alt/R,p:mut/R,N,perm:R}}
  const gr=[...new Set(X.map(String))];if(gr.length<2||gr.length>=N)return null;const gi=X.map(v=>gr.indexOf(String(v)));const my=ortala(Y),sst=topla(Y.map(v=>(v-my)**2));const k=gr.length;
  const F=g=>{const s=new Float64Array(k),c=new Float64Array(k);g.forEach((a,i)=>{s[a]+=Y[i];c[a]++});let ssb=0;for(let a=0;a<k;a++)if(c[a])ssb+=c[a]*(s[a]/c[a]-my)**2;const ssw=sst-ssb;return {F:ssw>0?(ssb/(k-1))/(ssw/(N-k)):Infinity,eta2:sst>0?ssb/sst:0}};
  const f0=F(gi);let say=0;const gp=gi.slice();
  for(let q=0;q<R;q++){for(let i=N-1;i>0;i--){const j=Math.floor(r()*(i+1));[gp[i],gp[j]]=[gp[j],gp[i]]}if(F(gp).F>=f0.F-1e-12)say++;if(o.ilerleme&&q%200===199){o.ilerleme((q+1)/R);await bekle()}}
  const grup=gr.map((g,a)=>{const v=Y.filter((_,i)=>gi[i]===a);const m=ortala(v);return {g,n:v.length,ort:m,sd:v.length>1?Math.sqrt(topla(v.map(z=>(z-m)**2))/(v.length-1)):null}}).sort((a,b)=>b.ort-a.ort);
  return {tur,F:f0.F,eta2:f0.eta2,df1:k-1,df2:N-k,p:say/R,N,perm:R,grup}}
/* asortativite (Newman, 2003): kategorik için e_ij karışım matrisi, sayısal için bağ uçları arasında Pearson r */
async function asortTesti(G,deger,tur,o={}){const R=o.perm??2000,r=prng(o.tohum??41);const gec=deger.map(v=>v!=null&&v!==''&&(tur!=='sayi'||isFinite(+v)));
  const uc=[];for(const e of G.E)if(gec[e.s]&&gec[e.t]){uc.push([e.s,e.t]);if(!G.yonlu)uc.push([e.t,e.s])}if(uc.length<4)return null;
  let hesap;if(tur==='sayi'){const v=deger.map(Number);hesap=d=>korelasyon(Float64Array.from(uc,u=>d[u[0]]),Float64Array.from(uc,u=>d[u[1]]));hesap.v=v}
  else{const gr=[...new Set(deger.filter((_,i)=>gec[i]).map(String))];const kod=deger.map(v=>gr.indexOf(String(v)));const k=gr.length;hesap=d=>{const e=new Float64Array(k*k);for(const [a,b] of uc)e[d[a]*k+d[b]]++;const M=uc.length;let tr=0,ab=0;const A=new Float64Array(k),B=new Float64Array(k);
      for(let i=0;i<k;i++)for(let j=0;j<k;j++){const x=e[i*k+j]/M;if(i===j)tr+=x;A[i]+=x;B[j]+=x}for(let i=0;i<k;i++)ab+=A[i]*B[i];return ab<1?(tr-ab)/(1-ab):null};hesap.v=kod}
  const d0=hesap.v,r0=hesap(d0);if(r0==null)return null;const ix=d0.map((_,i)=>i).filter(i=>gec[i]);const d2=d0.slice();let ust=0,alt=0,top=0,say=0;
  for(let q=0;q<R;q++){const v=ix.map(i=>d0[i]);for(let i=v.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[v[i],v[j]]=[v[j],v[i]]}ix.forEach((i,z)=>d2[i]=v[z]);const s=hesap(d2);if(s==null)continue;say++;top+=s;if(s>=r0-1e-12)ust++;if(s<=r0+1e-12)alt++;if(o.ilerleme&&q%200===199){o.ilerleme((q+1)/R);await bekle()}}
  return {tur,r:r0,beklenen:say?top/say:null,pUst:say?ust/say:null,pAlt:say?alt/say:null,bag:G.yonlu?uc.length:uc.length/2,perm:R}}
/* modülerliğin anlamlılığı: aynı derece dizisine sahip rastgele ağlarda bulunan en yüksek modülerlikle karşılaştırma */
async function modulerlikTesti(G,o={}){const R=o.perm??100,r=prng(o.tohum??43);const S=new Set(),C=[];for(let i=0;i<G.n;i++)for(const [j] of G.U[i])if(i<j&&!S.has(i*G.n+j)){S.add(i*G.n+j);C.push([i,j])}if(C.length<3)return null;
  const H=gYap(G.n,C,false);const Q0=toplulukBul(H,{tekrar:10}).Q;const L=[];
  for(let k=0;k<R;k++){const Z=rastgeleDerece(G.n,C,false,r);L.push(toplulukBul(Z,{tekrar:3,tohum:k+1}).Q);if(o.ilerleme){o.ilerleme((k+1)/R);await bekle()}}
  return {...dagilimOzet(Q0,L),perm:R,agirlikli:G.agirlikli,yonlu:G.yonlu}}
