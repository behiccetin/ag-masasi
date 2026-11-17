/* ====================== GÖRSELLEŞTİRME MOTORU ======================
   Yerleşim, kodlama (renk, boyut, şekil), grup kabarcıkları, etiket yerleşimi, açıklama kutusu, matris görünümü ve grafikler.
   Bütün çizimler SVG metni olarak üretilir; ekranda, PNG'de ve Word raporunda aynı çıktı kullanılır. */
const CW=1200,CH=800;
const STILLER={
  dergi:{kara:'#e8eae5',zemin:'#ffffff',yazi:'#1c2230',soluk:'#6b7280',gri:'#a3a9b4',palet:['#0072B2','#D55E00','#009E73','#CC79A7','#B8860B','#56B4E9','#882255','#44AA99'],etPx:11,grupPx:13,rmin:3.2,rmax:15,bagMax:2.2,bagOp:[.18,.55],alanOp:.11,alanPad:13},
  sunum:{kara:'#e8eae5',zemin:'#ffffff',yazi:'#141922',soluk:'#5b6270',gri:'#b3b8c2',palet:['#1F6FB2','#E0642A','#1E9E72','#C2558F','#C9A227','#4FA9D8','#8E3B6B','#3E9C8C'],etPx:15,grupPx:17,rmin:4.5,rmax:20,bagMax:3,bagOp:[.2,.6],alanOp:.12,alanPad:16},
  poster:{kara:'#e8eae5',zemin:'#fbfbfa',yazi:'#1c2230',soluk:'#6b7280',gri:'#b6bbc4',palet:['#2B5C8A','#C8553D','#3C8D6E','#9C5A8C','#C59D2E','#5AA3C8','#7A3B5C','#4E9A8E'],etPx:10,grupPx:15,rmin:3,rmax:14,bagMax:2,bagOp:[.16,.5],alanOp:.13,alanPad:12},
  buyuk:{kara:'#e8eae5',zemin:'#ffffff',yazi:'#1c2230',soluk:'#6b7280',gri:'#a3a9b4',palet:['#0072B2','#D55E00','#009E73','#CC79A7','#B8860B','#56B4E9','#882255','#44AA99'],etPx:30,grupPx:30,rmin:12,rmax:34,bagMax:5,bagOp:[.35,.7],alanOp:.12,alanPad:22},
  vitrin:{kara:'#e8eae5',zemin:'#ffffff',yazi:'#1c2230',soluk:'#6b7280',gri:'#a3a9b4',palet:['#0072B2','#D55E00','#009E73','#CC79A7','#B8860B','#56B4E9','#882255','#44AA99'],etPx:22,grupPx:24,rmin:6,rmax:22,bagMax:3.2,bagOp:[.22,.6],alanOp:.13,alanPad:16},
  koyu:{kara:'#262a33',zemin:'#14161c',yazi:'#e7e9ee',soluk:'#9aa1ad',gri:'#4a505c',palet:['#5AA9E6','#FF8C5A','#3ECF9E','#F08BC4','#F5C54A','#8FD3FF','#E07AA8','#7FD6C2'],etPx:11,grupPx:13,rmin:3.2,rmax:15,bagMax:2.2,bagOp:[.22,.65],alanOp:.14,alanPad:13}};
const SB_DOLGU=['#1c1c1c','#ffffff','#7a7a7a','#ffffff','#b8b8b8','#3d3d3d','#ffffff','#9a9a9a'],SB_KOYU=['#f2f2f2','#14161c','#9a9a9a','#14161c','#5f5f5f','#d0d0d0','#14161c','#7a7a7a'];
const parlak=h=>{const x=parseInt(h.slice(1),16);return ((x>>16)*.299+((x>>8)&255)*.587+(x&255)*.114)/255};
const sbDolgu=st=>parlak(st.zemin)<.5?SB_KOYU:SB_DOLGU;const sbKenar=(st,f)=>Math.abs(parlak(f)-parlak(st.zemin))<.25?st.yazi:st.zemin;
const DIGER_RENK='#9aa1ad';

/* ---------- Yerleşim: ForceAtlas2 benzeri (LinLog), büyük ağlarda Barnes-Hut ---------- */
function bhAgac(x,y,kutle,n){/* dörtlü ağaç; düğüm başına kütle = derece + 1 */let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;for(let i=0;i<n;i++){if(x[i]<x0)x0=x[i];if(x[i]>x1)x1=x[i];if(y[i]<y0)y0=y[i];if(y[i]>y1)y1=y[i]}
  const boy=Math.max(x1-x0,y1-y0)+1;const D=[];const yeni=(cx,cy,s)=>{D.push({cx,cy,s,m:0,mx:0,my:0,c:null,i:-1});return D.length-1};const kok=yeni(x0+boy/2,y0+boy/2,boy/2);
  const ekle=(d,i,derin)=>{const k=D[d];if(k.c===null&&k.i<0&&k.m===0){k.i=i;k.m=kutle[i];k.mx=x[i]*kutle[i];k.my=y[i]*kutle[i];return}
    if(k.c===null){if(derin>40){k.m+=kutle[i];k.mx+=x[i]*kutle[i];k.my+=y[i]*kutle[i];return}const h=k.s/2;k.c=[yeni(k.cx-h,k.cy-h,h),yeni(k.cx+h,k.cy-h,h),yeni(k.cx-h,k.cy+h,h),yeni(k.cx+h,k.cy+h,h)];const eski=k.i;k.i=-1;if(eski>=0){k.m=0;k.mx=0;k.my=0;ekle(d,eski,derin)}}
    k.m+=kutle[i];k.mx+=x[i]*kutle[i];k.my+=y[i]*kutle[i];const q=(x[i]>=k.cx?1:0)+(y[i]>=k.cy?2:0);ekle(k.c[q],i,derin+1)};
  for(let i=0;i<n;i++)ekle(kok,i,0);return D}
function kuvvetYerlesim(G,tohum,o={}){const n=G.n,r=prng(tohum);const iter=o.iter??(n>1500?350:n>400?500:800);const R=Math.sqrt(n)*12+10;const x=new Float64Array(n),y=new Float64Array(n);
  for(let i=0;i<n;i++){const a=r()*Math.PI*2,u=Math.sqrt(r())*R;x[i]=Math.cos(a)*u;y[i]=Math.sin(a)*u}
  const der=G.U.map(L=>L.length),kut=der.map(d=>d+1),kr=8,kg=1,dx=new Float64Array(n),dy=new Float64Array(n),bh=n>250,teta=1.2;
  const kenar=[];G.U.forEach((L,i)=>L.forEach(([j,w])=>{if(i<j)kenar.push([i,j,Math.sqrt(G.agirlikli?w:1)])}));
  for(let it=0;it<iter;it++){dx.fill(0);dy.fill(0);const T=R*0.12*Math.pow(1-it/iter,1.6)+0.15;
    if(!bh){for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){let ex=x[i]-x[j],ey=y[i]-y[j];let d2=ex*ex+ey*ey;if(d2<1e-4){ex=r()-.5;ey=r()-.5;d2=ex*ex+ey*ey}const f=kr*kut[i]*kut[j]/d2;dx[i]+=ex*f;dy[i]+=ey*f;dx[j]-=ex*f;dy[j]-=ey*f}}
    else{const D=bhAgac(x,y,kut,n);for(let i=0;i<n;i++){const yig=[0];while(yig.length){const k=D[yig.pop()];if(!k.m)continue;const mx=k.mx/k.m,my=k.my/k.m;let ex=x[i]-mx,ey=y[i]-my;const d2=ex*ex+ey*ey;
        if(k.i===i&&k.c===null)continue;if(k.c===null||(k.s*2)*(k.s*2)<teta*teta*d2){if(d2<1e-4)continue;const f=kr*kut[i]*k.m/d2;dx[i]+=ex*f;dy[i]+=ey*f}else for(const c of k.c)yig.push(c)}}}
    for(const [a,b,w] of kenar){const ex=x[a]-x[b],ey=y[a]-y[b];const d=Math.sqrt(ex*ex+ey*ey)+1e-9;const f=w*Math.log(1+d)/d;dx[a]-=ex*f;dy[a]-=ey*f;dx[b]+=ex*f;dy[b]+=ey*f}
    for(let i=0;i<n;i++){const d=Math.hypot(x[i],y[i])+1e-9;const f=kg*kut[i]/d;dx[i]-=x[i]*f;dy[i]-=y[i]*f;const L=Math.hypot(dx[i],dy[i]);if(L>0){const s=Math.min(L,T)/L;x[i]+=dx[i]*s;y[i]+=dy[i]*s}}}
  return {x:[...x],y:[...y]}}
function bagKesisim(P,E){if(E.length>1500)return null;let c=0;const ccw=(a,b,c2)=>(P.y[c2]-P.y[a])*(P.x[b]-P.x[a])>(P.y[b]-P.y[a])*(P.x[c2]-P.x[a]);
  for(let i=0;i<E.length;i++)for(let j=i+1;j<E.length;j++){const a=E[i],b=E[j];if(a.s===b.s||a.s===b.t||a.t===b.s||a.t===b.t)continue;if(ccw(a.s,b.s,b.t)!==ccw(a.t,b.s,b.t)&&ccw(a.s,a.t,b.s)!==ccw(a.s,a.t,b.t))c++}return c}
function alanaSigdir(P,alan,dondur=true){const n=P.x.length;if(!n)return {x:[],y:[]};let mx=0,my=0;for(let i=0;i<n;i++){mx+=P.x[i];my+=P.y[i]}mx/=n;my/=n;let q=0;
  if(dondur){let sxx=0,syy=0,sxy=0;for(let i=0;i<n;i++){const a=P.x[i]-mx,b=P.y[i]-my;sxx+=a*a;syy+=b*b;sxy+=a*b}q=-0.5*Math.atan2(2*sxy,sxx-syy)}const c=Math.cos(q),s=Math.sin(q);
  const X=[],Y=[];for(let i=0;i<n;i++){const a=P.x[i]-mx,b=P.y[i]-my;X.push(a*c-b*s);Y.push(a*s+b*c)}
  const a0=Math.min(...X),a1=Math.max(...X),b0=Math.min(...Y),b1=Math.max(...Y);const k=Math.min((alan.x1-alan.x0)/(a1-a0||1),(alan.y1-alan.y0)/(b1-b0||1));
  const ox=(alan.x0+alan.x1)/2-(a0+a1)/2*k,oy=(alan.y0+alan.y1)/2-(b0+b1)/2*k;return {x:X.map(v=>v*k+ox),y:Y.map(v=>v*k+oy)}}
/* Çakışma giderme; büyük ağlarda ızgara ile */
function cakismaGider(P,rad,alan,bosluk=0){const n=P.x.length;const h=Math.max(8,2*Math.max(...rad,1)+2+bosluk);
  for(let it=0;it<(n>800?40:120);it++){let hareket=0;const izg=new Map();for(let i=0;i<n;i++){const k=Math.floor(P.x[i]/h)+','+Math.floor(P.y[i]/h);if(!izg.has(k))izg.set(k,[]);izg.get(k).push(i)}
    for(let i=0;i<n;i++){const gx=Math.floor(P.x[i]/h),gy=Math.floor(P.y[i]/h);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=izg.get((gx+a)+','+(gy+b));if(!L)continue;for(const j of L){if(j<=i)continue;
      const ex=P.x[j]-P.x[i],ey=P.y[j]-P.y[i];const d=Math.hypot(ex,ey)||.01;const m=rad[i]+rad[j]+2+bosluk;if(d<m){const p=(m-d)/2;P.x[i]-=ex/d*p;P.y[i]-=ey/d*p;P.x[j]+=ex/d*p;P.y[j]+=ey/d*p;hareket++}}}}
    for(let i=0;i<n;i++){P.x[i]=Math.min(alan.x1,Math.max(alan.x0,P.x[i]));P.y[i]=Math.min(alan.y1,Math.max(alan.y0,P.y[i]))}if(!hareket)break}}
/* Yerleşim türleri */
function yerlesimHesap(G,tur,tohum,grup,deger,alan){const n=G.n;if(!n)return {x:[],y:[],kesisim:null};
  if(tur==='daire'||tur==='halka'){const sira=Array.from({length:n},(_,i)=>i);let P;
    if(tur==='daire'){sira.sort((a,b)=>(grup?String(grup[a]).localeCompare(String(grup[b]),'tr'):0)||deger[b]-deger[a]);const cx=(alan.x0+alan.x1)/2,cy=(alan.y0+alan.y1)/2,R=Math.min(alan.x1-alan.x0,alan.y1-alan.y0)/2;
      P={x:new Array(n),y:new Array(n)};sira.forEach((i,k)=>{const a=-Math.PI/2+k*2*Math.PI/n;P.x[i]=cx+R*Math.cos(a);P.y[i]=cy+R*Math.sin(a)})}
    else{/* iç halkada en yüksek değerler; dört halka */const sd=sira.slice().sort((a,b)=>deger[b]-deger[a]);const cx=(alan.x0+alan.x1)/2,cy=(alan.y0+alan.y1)/2,R=Math.min(alan.x1-alan.x0,alan.y1-alan.y0)/2;
      const sinir=[0,Math.ceil(n*.05),Math.ceil(n*.2),Math.ceil(n*.5),n];P={x:new Array(n),y:new Array(n)};
      for(let h=0;h<4;h++){const L=sd.slice(sinir[h],sinir[h+1]);if(grup)L.sort((a,b)=>String(grup[a]).localeCompare(String(grup[b]),'tr'));const r=L.length===1&&h===0?0:R*(h===0?.18:.18+h*.27);L.forEach((i,k)=>{const a=-Math.PI/2+k*2*Math.PI/L.length+h*.3;P.x[i]=cx+r*Math.cos(a);P.y[i]=cy+r*Math.sin(a)})}}
    return {...P,kesisim:bagKesisim(P,G.E)}}
  if(tur==='grup'&&grup){/* her grup kendi içinde kuvvetle yerleşir, gruplar büyüklüğe göre daireye dizilir */const gs=[...new Set(grup)];const boy=new Map(gs.map(g=>[g,grup.filter(x=>x===g).length]));gs.sort((a,b)=>boy.get(b)-boy.get(a));
    const x=new Array(n),y=new Array(n);const Rt=Math.sqrt(n)*30;gs.forEach((g,k)=>{const ix=grup.map((v,i)=>i).filter(i=>grup[i]===g);const yen=new Map(ix.map((v,z)=>[v,z]));
      const U=ix.map(i=>G.U[i].filter(([j])=>yen.has(j)).map(([j,w])=>[yen.get(j),w]));const H={n:ix.length,U,agirlikli:G.agirlikli};const Q=kuvvetYerlesim(H,tohum+k,{iter:300});
      const m=ix.length;const xs=Q.x,ys=Q.y;const mx=ortala(xs),my=ortala(ys);const yay=Math.max(...xs.map((v,z)=>Math.hypot(v-mx,ys[z]-my)),1);const r=Math.sqrt(m)*14;
      const a=k===0&&gs.length>1&&boy.get(g)>n*.4?null:-Math.PI/2+k*2*Math.PI/gs.length;const cx=a==null?0:Rt*Math.cos(a),cy=a==null?0:Rt*Math.sin(a);ix.forEach((i,z)=>{x[i]=cx+(xs[z]-mx)/yay*r;y[i]=cy+(ys[z]-my)/yay*r})});
    const P=alanaSigdir({x,y},alan,false);return {...P,kesisim:bagKesisim(P,G.E)}}
  /* bağı olmayan düğümler kuvvet yerleşiminde ağı ekranın ortasına sıkıştırmasın: alt şeride dizilir, bağlı kısım kalan alana yerleşir */
  const yal=[];for(let i=0;i<n;i++)if(!G.U[i].length)yal.push(i);
  if(yal.length&&yal.length<n){const ix=Array.from({length:n},(_,i)=>i).filter(i=>G.U[i].length);const yeni=new Map(ix.map((v,z)=>[v,z]));
    const H={n:ix.length,U:ix.map(i=>G.U[i].map(([j,w])=>[yeni.get(j),w])),agirlikli:G.agirlikli,E:G.E.map(e=>({...e,s:yeni.get(e.s),t:yeni.get(e.t)}))};
    const ad=Math.max(22,Math.min(60,(alan.x1-alan.x0)/Math.max(1,yal.length)));const sat=Math.ceil(yal.length*ad/(alan.x1-alan.x0));const serit=sat*ad+14;
    const Q=yerlesimHesap(H,'kuvvet',tohum,null,null,{...alan,y1:alan.y1-serit});const x=new Array(n),y=new Array(n);ix.forEach((v,z)=>{x[v]=Q.x[z];y[v]=Q.y[z]});
    const sira=Math.floor((alan.x1-alan.x0)/ad);yal.forEach((v,k)=>{x[v]=alan.x0+ad/2+(k%sira)*ad;y[v]=alan.y1-serit+14+Math.floor(k/sira)*ad+ad/2});return {x,y,kesisim:Q.kesisim,yalniz:yal}}
  const bas=n>600?1:4;let en=null;for(let k=0;k<bas;k++){const Q=alanaSigdir(kuvvetYerlesim(G,tohum*31+k),alan);const c=bagKesisim(Q,G.E);if(!en||(c!=null&&c<en.kesisim))en={...Q,kesisim:c}}return en}
/* çizimde kullanılan yarıçaplar: yerleşimdeki çakışma gidermesi de aynı değerleri kullanır */
function yaricaplar(deger,st,bayrak,aralik){const mn=Math.min(...deger),mx=Math.max(...deger);
  /* aralik: [en küçük çap, en büyük çap] piksel; verilmezse biçemin varsayılanı */
  const ar=gecerliAralik(aralik,1,200);const rmax=ar?ar[1]/2:st.rmax;const rmin=ar?ar[0]/2:bayrak?Math.max(st.rmin,st.rmax*.45):st.rmin;return deger.map(v=>{const t=mx>mn?(v-mn)/(mx-mn):0;return rmin+(rmax-rmin)*Math.sqrt(t)})}
function gecerliAralik(a,en,ust){return Array.isArray(a)&&a.length===2&&a.every(x=>typeof x==='number'&&isFinite(x)&&x>=en&&x<=ust)&&a[0]<=a[1]?a:null}
/* bağ kalınlığı: verilmezse 0,5 ile biçemin üst sınırı arasında; aralık verilirse en düşük ağırlık en ince, en yüksek en kalın */
function bagKalinlik(w,wmn,wmx,st,aralik){const ar=gecerliAralik(aralik,.2,40);if(!ar){const t=Math.sqrt(w/wmx);return 0.5+(st.bagMax-0.5)*t}
  const t=wmx>wmn?(Math.sqrt(w)-Math.sqrt(wmn))/(Math.sqrt(wmx)-Math.sqrt(wmn)):1;return ar[0]+(ar[1]-ar[0])*Math.max(0,Math.min(1,t))}

/* ---------- Geometri ---------- */
function sekilYolu(tur,x,y,r){const nok=(k,a0,rr=r)=>Array.from({length:k},(_,i)=>{const a=a0+i*2*Math.PI/k;return [x+rr*Math.cos(a),y+rr*Math.sin(a)]});const yol=L=>'M'+L.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join('L')+'Z';
  switch(tur%8){case 1:return yol(nok(4,Math.PI/4,r*1.22));case 2:return yol(nok(3,-Math.PI/2,r*1.35));case 3:return yol(nok(4,0,r*1.3));case 4:return yol(nok(5,-Math.PI/2,r*1.18));case 5:return yol(nok(6,0,r*1.12));
    case 6:{const L=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.6:r*1.35;L.push([x+rr*Math.cos(a),y+rr*Math.sin(a)])}return yol(L)}case 7:return yol(nok(8,Math.PI/8,r*1.08));default:return null}}
const olcCanvas=document.createElement('canvas').getContext('2d');
function yaziGen(m,px,kalin){olcCanvas.font=`${kalin?600:400} ${px}px "Ag Metin",Helvetica,Arial,sans-serif`;return olcCanvas.measureText(m).width}

/* ---------- Ağ çizimi ----------
   girdi: G (gösterilecek bağlar), P (konumlar), deger (boyut ölçüsü), grup (renk grubu dizisi ya da null), grupAd (grup -> ad), o (ayarlar) */
function agSvg(G,P,deger,grup,o){let st=STILLER[o.stil]||STILLER.dergi;const sb=!!o.sb,n=G.n,acikla=o.aciklama!==false;const ad=G.ad;const on='s'+Math.random().toString(36).slice(2,8);const bay=o.bayrak&&o.bayrak.some(Boolean)?o.bayrak:null;
  const mn=Math.min(...deger),mx=Math.max(...deger);const rad=yaricaplar(deger,st,!!bay,o.dugumAralik);const DO=o.dugumOzel||null;if(o.olcek&&o.olcek!==1)for(let i=0;i<n;i++)rad[i]*=o.olcek;if(DO)DO.forEach((x,i)=>{if(x&&x.boyut&&x.boyut!==1)rad[i]*=x.boyut});
  /* gruplar: en büyük 8 grup renk alır, kalanlar "diğer" */
  let gruplar=[],grIx=new Map();if(grup){const say=new Map();grup.forEach(g=>{if(g!=null&&g!=='')say.set(g,(say.get(g)||0)+1)});const gs=o.grupSira?new Map(o.grupSira.map((g,i)=>[g,i])):null;gruplar=[...say.entries()].sort((a,b)=>(gs?(gs.has(a[0])?gs.get(a[0]):1e9)-(gs.has(b[0])?gs.get(b[0]):1e9):0)||b[1]-a[1]||String(a[0]).localeCompare(String(b[0]),'tr')).map(x=>x[0]);gruplar.slice(0,8).forEach((g,k)=>grIx.set(g,k))}
  if(o.ozelRenk&&!sb){const pal=st.palet.slice();if(grup)gruplar.slice(0,8).forEach((g,k)=>{if(o.ozelRenk[g])pal[k]=o.ozelRenk[g]});else if(o.ozelRenk.__tek)pal[0]=o.ozelRenk.__tek;st={...st,palet:pal}}
  const SBD=sbDolgu(st);const renk=i=>{if(DO&&DO[i]&&DO[i].renk&&!sb)return DO[i].renk;if(!grup)return sb?SBD[5]:st.palet[0];const k=grIx.get(grup[i]);if(k==null)return sb?'#a0a0a0':DIGER_RENK;return sb?SBD[k]:st.palet[k]};
  const grRenk=k=>sb?'#555':st.palet[k];const alanSag=acikla?930:CW-30;
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CW} ${CH}" width="${CW}" height="${CH}" font-family="Ag Metin, Helvetica, Arial, sans-serif"><rect width="${CW}" height="${CH}" fill="${st.zemin}"/>`;
  if(o.baslik)s+=`<text x="40" y="34" font-size="18" font-weight="700" fill="${st.yazi}">${esc(o.baslik)}</text>`;
  s+=`<g class="sah" transform="${o.donusum||''}">`;if(o.harita)s+=`<clipPath id="${on}hk"><rect x="20" y="40" width="${(acikla?915:CW-40)}" height="${CH-56}"/></clipPath><path clip-path="url(#${on}hk)" d="${o.harita}" fill="${st.kara||'#eceee9'}" stroke="${st.zemin}" stroke-width="0.7" stroke-linejoin="round"/>`;
  /* katman başlıkları (katmanlı yerleşim) */
  if(P.baslik)P.baslik.forEach(b=>{s+=`<text x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" text-anchor="${b.hiza}" font-size="13" font-weight="700" fill="${st.soluk}" letter-spacing="0.3">${esc(b.m)}</text>`});
  /* kabarcıklar */
  const alanlar=[];if(grup&&(o.alan||o.gad)&&!P.baslik){gruplar.slice(0,8).forEach((g,k)=>{const ix=[];for(let i=0;i<n;i++)if(grup[i]===g)ix.push(i);if(ix.length<3)return;
      const ici=i=>{const L=G.U[i];return L.length?L.filter(([j])=>grup[j]===g).length/L.length:0};const ady=ix.filter(i=>ici(i)>=.5);if(ady.length<2)return;
      const cx0=ortala(ady.map(i=>P.x[i])),cy0=ortala(ady.map(i=>P.y[i]));const dd=ady.map(i=>Math.hypot(P.x[i]-cx0,P.y[i]-cy0));const md=dd.slice().sort((a,b)=>a-b)[Math.floor(dd.length/2)]||1;
      const cek=new Set(ady.filter((i,z)=>dd[z]<=md*2.2));if(cek.size<2)return;const uz=(a,b)=>Math.hypot(P.x[a]-P.x[b],P.y[a]-P.y[b]);
      let bag=[];for(const i of cek)for(const [j] of G.U[i])if(i<j&&cek.has(j))bag.push([i,j]);const mu=bag.map(([a,b])=>uz(a,b)).sort((a,b)=>a-b)[Math.floor(bag.length/2)]||40;bag=bag.filter(([a,b])=>uz(a,b)<=Math.max(60,mu*2.2));
      const kom=new Map([...cek].map(i=>[i,[]]));bag.forEach(([a,b])=>{kom.get(a).push(b);kom.get(b).push(a)});let enb=[];const gor=new Set();
      for(const i of cek){if(gor.has(i))continue;const p2=[i];gor.add(i);for(let q=0;q<p2.length;q++)for(const j of kom.get(p2[q]))if(!gor.has(j)){gor.add(j);p2.push(j)}if(p2.length>enb.length)enb=p2}
      alanlar.push({k,g,cek:[...cek],bag,ust:Math.min(...enb.map(i=>P.y[i]-rad[i]-st.alanPad)),cx:ortala(enb.map(i=>P.x[i])),boyut:ix.length})});
    if(o.alan)alanlar.forEach(a=>{const c=grRenk(a.k);s+=`<g class="h" opacity="${sb?.07:st.alanOp}" fill="${c}" stroke="${c}" stroke-linecap="round">`;
      a.bag.forEach(([i,j])=>{s+=`<line x1="${P.x[i].toFixed(1)}" y1="${P.y[i].toFixed(1)}" x2="${P.x[j].toFixed(1)}" y2="${P.y[j].toFixed(1)}" stroke-width="${(st.alanPad*1.6).toFixed(1)}"/>`});
      a.cek.forEach(i=>{s+=`<circle cx="${P.x[i].toFixed(1)}" cy="${P.y[i].toFixed(1)}" r="${(rad[i]+st.alanPad).toFixed(1)}" stroke="none"/>`});s+='</g>'})}
  /* bağlar */
  const E=G.E.map((e,k)=>({...e,k})).filter(e=>e.w>=(o.esik||0));const wmx=Math.max(1,...G.E.map(e=>e.w)),wmn=G.E.length?Math.min(...G.E.map(e=>e.w)):1,ok=G.yonlu&&o.ok!==false;const KO=o.kenarOzel||null;
  E.sort((a,b)=>a.w-b.w).forEach(e=>{const t=Math.sqrt(e.w/wmx);const ic=grup&&grup[e.s]===grup[e.t]&&grIx.has(grup[e.s]);let c=sb?'#777':(!grup||(!ic&&o.gri)||(!ic&&!grup))?st.gri:(ic?grRenk(grIx.get(grup[e.s])):st.gri);
    const ko=KO&&KO[e.k];let op=st.bagOp[0]+(st.bagOp[1]-st.bagOp[0])*t,gen=bagKalinlik(e.w,wmn,wmx,st,o.kenarAralik);if(o.bagRenk&&!sb)c=o.bagRenk;if(ko){if(ko.kalinlik)gen=ko.kalinlik;if(ko.renk&&!sb){c=ko.renk;op=Math.max(op,.85)}}
    const cz=ko&&ko.cizgi?ko.cizgi:o.bagCizgi;const kesik=cz?` stroke-dasharray="${cz==='nokta'?`0.1 ${(gen*2.2+2).toFixed(1)}`:`${(gen*3+4).toFixed(1)} ${(gen*2+3).toFixed(1)}`}"`:'';let x1=P.x[e.s],y1=P.y[e.s],x2=P.x[e.t],y2=P.y[e.t];const L=Math.hypot(x2-x1,y2-y1)||1;
    let qx=(x1+x2)/2,qy=(y1+y2)/2;if(o.egri){qx-=(y2-y1)*.12;qy+=(x2-x1)*.12}
    if(ok){/* ok: biçim (dolu üçgen, dar üçgen, açık), büyüklük, konum (uçta ya da bağın ortasında), gösterim yönü (ters: yalnız çizim, veri değişmez) */
      let rT=rad[e.t];if(o.okTers){[x1,x2]=[x2,x1];[y1,y2]=[y2,y1];rT=rad[e.s]}const ob=(4+gen*1.6)*(o.okBoy||1),gn=o.okBicim==='dar'?.3:.5;
      const bas=(ex,ey,ux,uy)=>{const px=-uy,py=ux,a1x=ex-ux*ob+px*ob*gn,a1y=ey-uy*ob+py*ob*gn,a2x=ex-ux*ob-px*ob*gn,a2y=ey-uy*ob-py*ob*gn;
        return o.okBicim==='acik'?`<path class="e" data-k="${e.k}" d="M${a1x.toFixed(1)},${a1y.toFixed(1)}L${ex.toFixed(1)},${ey.toFixed(1)}L${a2x.toFixed(1)},${a2y.toFixed(1)}" fill="none" stroke="${c}" stroke-opacity="${Math.min(1,op+.15).toFixed(2)}" stroke-width="${Math.max(1,gen*.9).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`
          :`<path class="e" data-k="${e.k}" d="M${ex.toFixed(1)},${ey.toFixed(1)}L${a1x.toFixed(1)},${a1y.toFixed(1)}L${a2x.toFixed(1)},${a2y.toFixed(1)}Z" fill="${c}" fill-opacity="${Math.min(1,op+.15).toFixed(2)}"/>`};
      const tx=x2-qx,ty=y2-qy,tl=Math.hypot(tx,ty)||1;const ux=tx/tl,uy=ty/tl;const geri=rT+1.5;const ex=x2-ux*geri,ey=y2-uy*geri;
      if(o.okYer==='orta'){s+=`<path class="e" data-k="${e.k}" d="M${x1.toFixed(1)},${y1.toFixed(1)}Q${qx.toFixed(1)},${qy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="${c}" stroke-opacity="${op.toFixed(2)}" stroke-width="${gen.toFixed(2)}" stroke-linecap="round"${kesik}/>`;
        const mx=.25*x1+.5*qx+.25*ex,my=.25*y1+.5*qy+.25*ey,dx=ex-x1,dy=ey-y1,dl=Math.hypot(dx,dy)||1;s+=bas(mx+dx/dl*ob/2,my+dy/dl*ob/2,dx/dl,dy/dl)}
      else{const kis=o.okBicim==='acik'?gen*.5:ob*.8;x2=ex-ux*kis;y2=ey-uy*kis;
        s+=`<path class="e" data-k="${e.k}" d="M${x1.toFixed(1)},${y1.toFixed(1)}Q${qx.toFixed(1)},${qy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="${c}" stroke-opacity="${op.toFixed(2)}" stroke-width="${gen.toFixed(2)}" stroke-linecap="round"${kesik}/>`;s+=bas(ex,ey,ux,uy)}}
    else s+=`<path class="e" data-k="${e.k}" d="M${x1.toFixed(1)},${y1.toFixed(1)}${o.egri?`Q${qx.toFixed(1)},${qy.toFixed(1)} `:'L'}${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="${c}" stroke-opacity="${op.toFixed(2)}" stroke-width="${gen.toFixed(2)}" stroke-linecap="round"${kesik}/>`;
    /* etkileşimli görünümde ince bağlara tıklanabilsin diye görünmez geniş alan */if(o.kenarTik)s+=`<path class="eh" data-k="${e.k}" d="M${P.x[e.s].toFixed(1)},${P.y[e.s].toFixed(1)}${o.egri?`Q${qx.toFixed(1)},${qy.toFixed(1)} `:'L'}${P.x[e.t].toFixed(1)},${P.y[e.t].toFixed(1)}" fill="none" stroke="#000" stroke-opacity="0" stroke-width="${Math.max(10,gen+8).toFixed(1)}" pointer-events="stroke"/>`;void L});
  /* düğümler */
  const isaret=o.isaret||null;
  Array.from({length:n},(_,i)=>i).sort((a,b)=>rad[a]-rad[b]).forEach(i=>{const c=renk(i);const k=grup?(grIx.get(grup[i])??7):0;const yol=sb&&grup?sekilYolu(k,P.x[i],P.y[i],rad[i]):null;
    const kn=sb?sbKenar(st,c):st.zemin;const baslik=o.ipucuBaslik?`<title>${esc(ad[i])}</title>`:'';
    if(bay&&bay[i]){const r=rad[i],x=P.x[i],y=P.y[i];s+=`<g class="d" data-i="${i}"><clipPath id="${on}b${i}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}"/></clipPath><image href="${bay[i]}" x="${(x-r*4/3).toFixed(1)}" y="${(y-r).toFixed(1)}" width="${(r*8/3).toFixed(1)}" height="${(r*2).toFixed(1)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${on}b${i})"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="none" stroke="${grup&&grIx.has(grup[i])?c:st.soluk}" stroke-width="${grup&&grIx.has(grup[i])?2.2:0.9}"/>${baslik}</g>`}
    else s+=yol?`<path class="d" data-i="${i}" d="${yol}" fill="${c}" stroke="${kn}" stroke-width="1">${baslik}</path>`:`<circle class="d" data-i="${i}" cx="${P.x[i].toFixed(1)}" cy="${P.y[i].toFixed(1)}" r="${rad[i].toFixed(2)}" fill="${c}" stroke="${kn}" stroke-width="${rad[i]>8?1.4:1}">${baslik}</circle>`;
    if(isaret&&isaret.has(i))s+=`<circle cx="${P.x[i].toFixed(1)}" cy="${P.y[i].toFixed(1)}" r="${(rad[i]+4).toFixed(1)}" fill="none" stroke="${st.yazi}" stroke-width="1.6"/>`});
  /* etiketler */
  const K=o.etiket??14,sira=Array.from({length:n},(_,i)=>i).sort((a,b)=>rad[b]-rad[a]);const kutu=[];let gizli=0;const px=st.etPx;
  const izg=new Map(),h=40;for(let i=0;i<n;i++){const k=Math.floor(P.x[i]/h)+','+Math.floor(P.y[i]/h);if(!izg.has(k))izg.set(k,[]);izg.get(k).push(i)}
  const carp=b=>{if(kutu.some(k=>b.x0<k.x1&&b.x1>k.x0&&b.y0<k.y1&&b.y1>k.y0))return true;if(b.x0<6||b.x1>alanSag+40||b.y0<6||b.y1>CH-6)return true;
    for(let gx=Math.floor((b.x0-20)/h);gx<=Math.floor((b.x1+20)/h);gx++)for(let gy=Math.floor((b.y0-20)/h);gy<=Math.floor((b.y1+20)/h);gy++){const L=izg.get(gx+','+gy);if(!L)continue;for(const j of L){const cx=Math.max(b.x0,Math.min(P.x[j],b.x1)),cy=Math.max(b.y0,Math.min(P.y[j],b.y1));if(Math.hypot(P.x[j]-cx,P.y[j]-cy)<rad[j]-.5)return true}}return false};
  let etL=sira.slice(0,K);if(DO){etL=etL.filter(i=>!(DO[i]&&DO[i].etiket==='gizle'));sira.forEach(i=>{if(DO[i]&&DO[i].etiket==='goster'&&!etL.includes(i))etL.unshift(i)})}(o.zorunluEtiket||[]).forEach(i=>{if(!etL.includes(i)&&!(DO&&DO[i]&&DO[i].etiket==='gizle'))etL.unshift(i)});
  etL.forEach(i=>{const m=ad[i],kal=rad[i]>st.rmax*.6,w=yaziGen(m,px,kal),hh=px*1.15,of=rad[i]+3;
    const aday=[[P.x[i]+of,P.y[i]-hh/2],[P.x[i]-of-w,P.y[i]-hh/2],[P.x[i]-w/2,P.y[i]-of-hh],[P.x[i]-w/2,P.y[i]+of]];const yer=aday.find(([x,y])=>!carp({x0:x-1,y0:y-1,x1:x+w+1,y1:y+hh+1}));if(!yer){gizli++;return}
    const [x,y]=yer;kutu.push({x0:x-1,y0:y-1,x1:x+w+1,y1:y+hh+1});s+=`<text class="et" data-i="${i}" x="${x.toFixed(1)}" y="${(y+hh*.8).toFixed(1)}" font-size="${px}" font-weight="${kal?600:400}" fill="${st.yazi}" stroke="${st.zemin}" stroke-width="3" stroke-linejoin="round" paint-order="stroke">${esc(m)}</text>`});
  /* grup adları */
  if(grup&&o.gad)alanlar.forEach(a=>{const c=sb?'#333':grRenk(a.k);const m=o.grupAd?o.grupAd(a.g):String(a.g);const gw=yaziGen(m,st.grupPx,1),gh=st.grupPx*1.2;const aday=[];for(let k=0;k<6;k++)aday.push([a.cx,a.ust-5-k*7]);aday.push([a.cx-gw*.7,a.ust+gh],[a.cx+gw*.7,a.ust+gh]);
    const yer=aday.find(([x,y])=>!carp({x0:x-gw/2-2,y0:y-gh*.85,x1:x+gw/2+2,y1:y+gh*.2}))||aday[0];kutu.push({x0:yer[0]-gw/2-2,y0:yer[1]-gh*.85,x1:yer[0]+gw/2+2,y1:yer[1]+gh*.2});
    s+=`<text class="ga" x="${yer[0].toFixed(1)}" y="${yer[1].toFixed(1)}" text-anchor="middle" font-size="${st.grupPx}" font-weight="700" letter-spacing=".3" fill="${c}" stroke="${st.zemin}" stroke-width="4" stroke-linejoin="round" paint-order="stroke">${esc(m)}</text>`});
  s+='</g>';
  if(acikla)s+=aciklamaKutusu(st,sb,gruplar,grIx,o,mn,mx,wmx,n,G.m,wmn);
  s+='</svg>';return {svg:s,gizliEtiket:gizli,rad}}
function aciklamaKutusu(st,sb,gruplar,grIx,o,mn,mx,wmx,n,m,wmn=1){const x=948;let y=58;let s=`<g font-size="12" fill="${st.yazi}">${o.harita?`<rect x="${x-14}" y="36" width="${CW-x+4}" height="${CH-44}" fill="${st.zemin}" fill-opacity=".92"/>`:''}`;
  if(o.renkBaslik){s+=`<text x="${x}" y="${y}" font-size="13" font-weight="700">${esc(o.renkBaslik)}</text>`;y+=10;
    gruplar.slice(0,8).forEach((g,k)=>{const yol=sb?sekilYolu(k,x+7,y+10,6):null;const c=sb?sbDolgu(st)[k]:st.palet[k];
      s+=(yol?`<path d="${yol}" fill="${c}" stroke="${sbKenar(st,c)}" stroke-width="1"/>`:`<circle cx="${x+7}" cy="${y+10}" r="6" fill="${c}"/>`)+`<text x="${x+20}" y="${y+14}">${esc(kisalt(o.grupAd?o.grupAd(g):String(g),26))}</text>`;y+=21});
    if(gruplar.length>8){s+=`<circle cx="${x+7}" cy="${y+10}" r="6" fill="${sb?'#d0d0d0':DIGER_RENK}"/><text x="${x+20}" y="${y+14}">${esc(o.digerAd||'…')} (${gruplar.length-8})</text>`;y+=21}y+=20}
  if(o.boyutBaslik){s+=`<text x="${x}" y="${y}" font-size="13" font-weight="700">${esc(o.boyutBaslik)}</text>`;y+=12;
    /* aralık verilmişse açıklamadaki daireler aynı oranla, en çok 22 piksel yarıçapla gösterilir */const ar=gecerliAralik(o.dugumAralik,1,200);const R0=ar?ar[0]/2:st.rmin,R1=ar?ar[1]/2:st.rmax;const ol=ar&&R1>22?22/R1:1;const RM=ar?R1*ol:st.rmax;
    [0,.25,1].forEach((t,k)=>{const r=(R0+(R1-R0)*Math.sqrt(t))*ol;const cy=y+RM;const cx=x+RM+k*(RM*2+18);const v=mn+(mx-mn)*t;
      s+=`<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${st.soluk}" stroke-width="1"/><text x="${cx}" y="${cy+RM+15}" text-anchor="middle" fill="${st.soluk}" font-size="11">${esc(o.sayiYaz?o.sayiYaz(v):v.toFixed(2))}</text>`});y+=RM*2+44}
  if(o.bagBaslik&&wmx>1){s+=`<text x="${x}" y="${y}" font-size="13" font-weight="700">${esc(o.bagBaslik)}</text>`;y+=16;
    const kar=gecerliAralik(o.kenarAralik,.2,40);(kar?[wmn,Math.round((wmn+wmx)/2),wmx]:[1,Math.round((1+wmx)/2),wmx]).filter((v,i,a)=>a.indexOf(v)===i).forEach((w,k)=>{s+=`<line x1="${x}" x2="${x+44}" y1="${y+k*20}" y2="${y+k*20}" stroke="${st.gri}" stroke-width="${Math.min(14,bagKalinlik(w,wmn,wmx,st,o.kenarAralik)).toFixed(2)}" stroke-linecap="round"/><text x="${x+54}" y="${y+k*20+4}" fill="${st.soluk}" font-size="11">${esc(Number.isInteger(w)?Number(w).toLocaleString(S.dil):(o.sayiYaz?o.sayiYaz(w):String(w)))}</text>`});y+=70}
  if(o.notlar)o.notlar.forEach(m=>{s+=`<text x="${x}" y="${y}" fill="${st.soluk}" font-size="11">${esc(m)}</text>`;y+=16});
  if(o.altBilgi)s+=`<text x="${x}" y="${CH-24}" fill="${st.soluk}" font-size="10.5">${esc(o.altBilgi)}</text>`;return s+'</g>'}

/* ---------- Matris görünümü ---------- */
function matrisSvg(G,sira,grup,o={}){const n=G.n;if(n>400)return null;const st=STILLER[o.stil]||STILLER.dergi;const ust=o.etiket&&n<=60?110:20,sol=ust;const hc=Math.max(2,Math.min(16,Math.floor(680/n)));const W=sol+n*hc+20,H=ust+n*hc+20;
  const pos=new Map(sira.map((v,k)=>[v,k]));const gruplar=[...new Set(grup||[])];const gIx=new Map(gruplar.map((g,k)=>[g,k]));const wmx=Math.max(1,...G.E.map(e=>e.w));
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Ag Metin, Helvetica, Arial, sans-serif"><rect width="${W}" height="${H}" fill="${st.zemin}"/><rect x="${sol}" y="${ust}" width="${n*hc}" height="${n*hc}" fill="none" stroke="${st.gri}" stroke-width=".6"/>`;
  for(const e of G.E){const a=pos.get(e.s),b=pos.get(e.t);const ic=grup&&grup[e.s]===grup[e.t];const k=ic?gIx.get(grup[e.s]):null;const c=ic&&k<8?st.palet[k]:st.yazi;const op=(0.35+0.65*Math.sqrt(e.w/wmx)).toFixed(2);
    s+=`<rect x="${sol+b*hc}" y="${ust+a*hc}" width="${hc}" height="${hc}" fill="${c}" fill-opacity="${op}"/>`;if(!G.yonlu)s+=`<rect x="${sol+a*hc}" y="${ust+b*hc}" width="${hc}" height="${hc}" fill="${c}" fill-opacity="${op}"/>`}
  if(grup){let k=0;while(k<n){let z=k;while(z<n&&grup[sira[z]]===grup[sira[k]])z++;s+=`<rect x="${sol+k*hc}" y="${ust+k*hc}" width="${(z-k)*hc}" height="${(z-k)*hc}" fill="none" stroke="${st.yazi}" stroke-opacity=".55" stroke-width="1"/>`;k=z}}
  if(o.etiket&&n<=60)sira.forEach((v,k)=>{s+=`<text x="${sol-4}" y="${ust+k*hc+hc*.75}" text-anchor="end" font-size="${Math.min(10,hc*.8)}" fill="${st.yazi}">${esc(kisalt(G.ad[v],16))}</text><text transform="translate(${sol+k*hc+hc*.75},${ust-4}) rotate(-60)" font-size="${Math.min(10,hc*.8)}" fill="${st.yazi}">${esc(kisalt(G.ad[v],16))}</text>`});
  return s+'</svg>'}

/* ---------- Grafikler ---------- */
function grafikSvg(o){/* o: {seriler:[{ad,renk,noktalar:[[x,y]],tur:'cizgi'|'nokta'|'cubuk'}], xAd, yAd, logX, logY, W, H, etiketler:[{x,y,m}] } */
  const W=o.W||640,H=o.H||380,sol=62,sag=20,ust=o.baslik?40:18,alt=48;const st=STILLER[o.stil]||STILLER.dergi;const tum=o.seriler.flatMap(s=>s.noktalar).filter(p=>isFinite(p[0])&&isFinite(p[1])&&(!o.logX||p[0]>0)&&(!o.logY||p[1]>0));
  if(!tum.length)return null;const tx=v=>o.logX?Math.log10(v):v,ty=v=>o.logY?Math.log10(v):v;let x0=Math.min(...tum.map(p=>tx(p[0]))),x1=Math.max(...tum.map(p=>tx(p[0]))),y0=Math.min(...tum.map(p=>ty(p[1]))),y1=Math.max(...tum.map(p=>ty(p[1])));
  if(o.y0!=null)y0=o.y0;if(o.y1!=null)y1=o.y1;if(o.x0!=null)x0=o.x0;if(x1===x0){x0-=1;x1+=1}if(y1===y0){y0-=1;y1+=1}const py=(y1-y0)*.06;if(o.y0==null)y0-=o.logY?0:py;if(o.y1==null)y1+=py;
  const X=v=>sol+(tx(v)-x0)/(x1-x0)*(W-sol-sag),Y=v=>H-alt-(ty(v)-y0)/(y1-y0)*(H-alt-ust);
  const izler=(a,b,log,tam)=>{if(log){const L=[];for(let e=Math.floor(a);e<=Math.ceil(b);e++)L.push(e);return L}const ad=Math.pow(10,Math.floor(Math.log10((b-a)/5||1)));let st2=[1,2,5,10].map(k=>k*ad).find(k=>(b-a)/k<=6)||ad*10;if(tam&&st2<1)st2=1;const L=[];for(let v=Math.ceil(a/st2)*st2;v<=b+1e-9;v+=st2)L.push(+v.toPrecision(10));return L};
  const yaz=(v,log)=>{if(log){const p=Math.pow(10,v);return p>=10000||p<0.001?'10^'+v:Number(+p.toPrecision(3)).toLocaleString(S.dil)}return Number.isInteger(v)?Number(v).toLocaleString(S.dil):(o.sayiYaz?o.sayiYaz(v):Number(v).toLocaleString(S.dil))};
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Ag Metin, Helvetica, Arial, sans-serif" font-size="11"><rect width="${W}" height="${H}" fill="${st.zemin}"/>`;
  if(o.baslik)s+=`<text x="${sol}" y="22" font-size="14" font-weight="700" fill="${st.yazi}">${esc(o.baslik)}</text>`;
  izler(y0,y1,o.logY).forEach(v=>{const yy=H-alt-(v-y0)/(y1-y0)*(H-alt-ust);if(yy<ust-1||yy>H-alt+1)return;s+=`<line x1="${sol}" x2="${W-sag}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" stroke="${st.gri}" stroke-opacity=".35"/><text x="${sol-6}" y="${(yy+4).toFixed(1)}" text-anchor="end" fill="${st.soluk}">${esc(yaz(v,o.logY))}</text>`});
  izler(x0,x1,o.logX,o.tamX).forEach(v=>{const xx=sol+(v-x0)/(x1-x0)*(W-sol-sag);if(xx<sol-1||xx>W-sag+1)return;s+=`<line x1="${xx.toFixed(1)}" x2="${xx.toFixed(1)}" y1="${H-alt}" y2="${H-alt+4}" stroke="${st.soluk}"/><text x="${xx.toFixed(1)}" y="${H-alt+17}" text-anchor="middle" fill="${st.soluk}">${esc(yaz(v,o.logX))}</text>`});
  s+=`<line x1="${sol}" x2="${W-sag}" y1="${H-alt}" y2="${H-alt}" stroke="${st.soluk}"/><text x="${(sol+W-sag)/2}" y="${H-10}" text-anchor="middle" fill="${st.yazi}" font-size="12">${esc(o.xAd||'')}</text><text transform="translate(16,${(ust+H-alt)/2}) rotate(-90)" text-anchor="middle" fill="${st.yazi}" font-size="12">${esc(o.yAd||'')}</text>`;
  o.seriler.forEach((sr,k)=>{const c=sr.renk||st.palet[k%8];const N=sr.noktalar.filter(p=>isFinite(p[0])&&isFinite(p[1])&&(!o.logX||p[0]>0)&&(!o.logY||p[1]>0));
    if(sr.tur==='cizgi')s+=`<path d="M${N.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join('L')}" fill="none" stroke="${c}" stroke-width="2" ${sr.kesik?'stroke-dasharray="5 4"':''}/>`;
    else if(sr.tur==='cubuk'){const bw=Math.max(3,(W-sol-sag)/N.length*.7);N.forEach(p=>{s+=`<rect x="${(X(p[0])-bw/2).toFixed(1)}" y="${Y(p[1]).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0,H-alt-Y(p[1])).toFixed(1)}" fill="${c}" rx="2"/>`})}
    else N.forEach(p=>{s+=`<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="${sr.r||3.2}" fill="${c}" fill-opacity=".75"/>`})});
  if(o.cubukEtiket)o.cubukEtiket.forEach(([x,m])=>{s+=`<text transform="translate(${X(x).toFixed(1)},${H-alt+12}) rotate(-45)" text-anchor="end" fill="${st.soluk}" font-size="10">${esc(m)}</text>`});
  (o.etiketler||[]).forEach(e=>{const sol2=X(e.x)>W-sag-yaziGen(e.m,10.5)-8;s+=`<text x="${(X(e.x)+(sol2?-5:5)).toFixed(1)}" text-anchor="${sol2?'end':'start'}" y="${(Y(e.y)-5).toFixed(1)}" fill="${st.yazi}" font-size="10.5" stroke="${st.zemin}" stroke-width="3" paint-order="stroke">${esc(e.m)}</text>`});
  if(o.seriler.length>1&&o.seriler.some(s=>s.ad)){const top=o.seriler.reduce((t,sr)=>t+24+yaziGen(sr.ad,11)+14,0);let lx=o.aciklamaSag?W-sag-top:sol+10;o.seriler.forEach((sr,k)=>{const c=sr.renk||st.palet[k%8];s+=`<rect x="${lx}" y="${ust+4}" width="12" height="4" fill="${c}"/><text x="${lx+16}" y="${ust+10}" fill="${st.yazi}">${esc(sr.ad)}</text>`;lx+=24+yaziGen(sr.ad,11)+14})}
  return s+'</svg>'}
