const fs=require('fs'),vm=require('vm');
const ctx={console,Math,Array,Object,Set,Map,Number,String,isFinite,isNaN,JSON,Infinity,NaN,Float64Array,Int32Array,Uint8Array,Promise,setTimeout,S:{dil:'tr'}};vm.createContext(ctx);
const tem=fs.readFileSync(__dirname+'/../js/1-temel.js','utf8');
const al=(a,b)=>tem.slice(tem.indexOf(a),tem.indexOf(b));
vm.runInContext(tem.match(/function prng[^\n]*/)[0]+'\n'+al('function sayiOku','/* ====================== KALICI'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../js/2-ag.js','utf8')+';this.__={agKur,olcumler,toplulukBul,modulerlik,nmi,cekirdekCevre,eiEndeksi,triadSayimi,diadSayimi,kucukDunya,dayaniklilik,omurga,qapKorelasyon,mrqap,iliskiMatrisi,ozellikMatrisi,arasindalik,yakinlik};',ctx);
const H=ctx.__;const g=JSON.parse(fs.readFileSync(0,'utf8'));
(async()=>{const p={dugumler:g.ad.map((a,i)=>({id:'d'+i,ad:a,oz:{grp:g.grp[i],kidem:String(g.kidem[i])}})),ozellikler:[{k:'grp',ad:'g',tur:'kat'},{k:'kidem',ad:'k',tur:'sayi'}],yonlu:g.yonlu,agirlikli:g.agirlikli,
  iliskiler:g.iliskiler.map((L,k)=>({id:'r'+k,ad:'r'+k,kenarlar:L.map(([a,b,w])=>['d'+a,'d'+b,w])})),aktif:'r0'};
 const G=H.agKur(p,'r0');const o={};const {D,A}=H.olcumler(G,{yolAgirlik:g.yolAgirlik});o.D=D;o.A=A;
 const ab=H.arasindalik(G,!!g.yolAgirlik&&g.agirlikli);o.araHam=ab.ham;
 const T=H.toplulukBul(G,{tekrar:10});o.T={c:T.c,Q:T.Q,Qnx:H.modulerlik(G,T.c)};
 o.nmi=H.nmi(g.grp,T.c);o.triad=H.triadSayimi(G);o.diad=H.diadSayimi(G);o.cp=H.cekirdekCevre(G,{cpYoksay:g.cpYoksay});
 o.ei=H.eiEndeksi(G,g.grp,{perm:500});o.omurga=H.omurga(G,0.2);o.E=G.E.map(e=>[e.s,e.t,e.w]);
 o.day=H.dayaniklilik(G,{rastgeleTekrar:3});
 const Y=H.iliskiMatrisi(p,'r0'),X1=H.iliskiMatrisi(p,'r1'),X2=H.ozellikMatrisi(p,'grp'),X3=H.ozellikMatrisi(p,'kidem');
 o.qap=await H.qapKorelasyon(G.n,g.yonlu,Y,X1,{perm:200});o.mrqap=await H.mrqap(G.n,g.yonlu,Y,[X1,X2,X3],{perm:100});
 console.log(JSON.stringify(o))})();
