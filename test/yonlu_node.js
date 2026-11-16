/* Yönlü topluluk yöntemlerini çalıştırır; stdin: {n, yonlu, E:[[a,b,w]], yontem, tekrar}; stdout: {c,Q,L,L1,k} */
const fs=require('fs'),vm=require('vm');
const ctx={console,Math,Array,Object,Set,Map,Number,String,isFinite,isNaN,JSON,Infinity,NaN,Float64Array,Int32Array,Uint8Array,Promise,setTimeout,S:{dil:'tr'}};vm.createContext(ctx);
const tem=fs.readFileSync(__dirname+'/../js/1-temel.js','utf8');const al=(a,b)=>tem.slice(tem.indexOf(a),tem.indexOf(b));
vm.runInContext(tem.match(/function prng[^\n]*/)[0]+'\n'+al('function sayiOku','/* ====================== KALICI'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../js/2-ag.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../js/2c-yonlu-topluluk.js','utf8')+';this.__={agKur,toplulukBul,modulerlikYonlu,infomapAkis,imL};',ctx);
const H=ctx.__,g=JSON.parse(fs.readFileSync(0,'utf8'));
const p={dugumler:Array.from({length:g.n},(_,i)=>({id:'d'+i,ad:'d'+i,oz:{}})),ozellikler:[],yonlu:g.yonlu,agirlikli:true,iliskiler:[{id:'r0',ad:'r',kenarlar:g.E.map(([a,b,w])=>['d'+a,'d'+b,w])}],aktif:'r0'};
const G=H.agKur(p,'r0');if(g.c){const F=H.infomapAkis(G);console.log(JSON.stringify({L:H.imL(F,g.c),L1:F.L1}));process.exit(0)}
const T=H.toplulukBul(G,{tekrar:g.tekrar||20,yontem:g.yontem});
console.log(JSON.stringify({c:T.c,Q:T.Q,L:T.L,L1:T.L1,k:T.k,yontem:T.yontem,E:G.E.map(e=>[e.s,e.t,e.w])}));
