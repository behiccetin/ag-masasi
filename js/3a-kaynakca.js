/* ====================== KAYNAKÇA OKUMA (Tarama Masası'ndan) ====================== */
const doiTemizle=s=>{const m=String(s||'').match(/10\.\d{4,9}\/[^\s"<>,]+/i);return m?m[0].replace(/[.;:)\]]+$/,'').toLowerCase():''};
const yilBul=s=>{const m=String(s||'').match(/\b(1[89]\d{2}|20\d{2})\b/);return m?m[1]:''};
const bosluk=s=>String(s??'').replace(/\s+/g,' ').trim();
/* Başındaki "Abstract:" ya da büyük harfli "ABSTRACT" etiketi silinir; "Abstract" sözcüğüyle başlayan gerçek cümleye dokunulmaz. */
function ozetTemizle(m){m=bosluk(m);if(/^(abstract|özet|öz)\s*[:.]/i.test(m))return m.replace(/^(abstract|özet|öz)\s*[:.]\s*/i,'');if(/^(ABSTRACT|ÖZET)\s/.test(m))return m.replace(/^(ABSTRACT|ÖZET)\s+/,'');return m}
function kayitYap(o){return {tip:bosluk(o.tip),baslik:bosluk(o.baslik).replace(/\.$/,''),yazarlar:(o.yazarlar||[]).map(bosluk).filter(Boolean),yil:yilBul(o.yil),dergi:bosluk(o.dergi),cilt:bosluk(o.cilt),sayi:bosluk(o.sayi),sayfa:bosluk(o.sayfa),
  doi:doiTemizle(o.doi),pmid:(String(o.pmid||'').match(/\d{5,9}/)||[''])[0],ozet:ozetTemizle(o.ozet),anahtar:[...new Set((o.anahtar||[]).flatMap(k=>String(k).split(/\s*;\s*/)).map(bosluk).filter(Boolean))],url:bosluk(o.url),dil:bosluk(o.dil),issn:bosluk(o.issn)}}

/* ---- RIS ---- */
function risOku(m){const o=[];let r=null,son=null;
  for(const sat of m.split(/\r?\n/)){const e=sat.match(/^([A-Z][A-Z0-9]) {1,2}-(?: ?(.*))?$/);
    if(e){const tag=e[1],v=(e[2]||'').trim();if(tag==='TY'){if(r)o.push(risDon(r));r={TY:[v]};son=null;continue}if(!r)continue;
      if(tag==='ER'){o.push(risDon(r));r=null;son=null;continue}(r[tag]=r[tag]||[]).push(v);son=tag}
    else if(r&&son&&sat.trim()){const L=r[son];L[L.length-1]+=' '+sat.trim()}}
  if(r)o.push(risDon(r));return o}
function risDon(_){const g=(...t)=>{for(const x of t)if(_[x]&&_[x][0])return _[x][0];return ''},tum=(...t)=>t.flatMap(x=>_[x]||[]);
  const an=g('AN');return kayitYap({tip:g('TY'),baslik:g('TI','T1','CT','BT'),yazarlar:tum('AU','A1'),yil:g('PY','Y1','DA','Y2'),dergi:g('T2','JO','JF','JA','J2'),cilt:g('VL'),sayi:g('IS'),
    sayfa:[g('SP'),g('EP')].filter(Boolean).join('-'),doi:g('DO')||tum('UR','L2','M3','N1').find(x=>/10\.\d{4,}\//.test(x))||'',pmid:/^\d{6,9}$/.test(an)?an:'',ozet:g('AB','N2'),anahtar:tum('KW'),url:g('UR','L1'),dil:g('LA'),issn:g('SN')})}

/* ---- BibTeX ---- */
const AKSAN={'`':'̀',"'":'́','^':'̂','~':'̃','=':'̄','u':'̆','.':'̇','"':'̈','r':'̊','H':'̋','v':'̌','c':'̧','k':'̨'};
function latex(s){s=String(s||'');
  s=s.replace(/\{\\i\}|\\i(?![a-zA-Z])/g,'ı').replace(/\\ss(?![a-zA-Z])/g,'ß').replace(/\\o(?![a-zA-Z])/g,'ø').replace(/\\O(?![a-zA-Z])/g,'Ø').replace(/\\ae(?![a-zA-Z])/g,'æ').replace(/\\l(?![a-zA-Z])/g,'ł');
  s=s.replace(/\\([`'^"~=.uvcHkr])\s*\{?\s*([A-Za-zıİ])\s*\}?/g,(_,a,h)=>(h==='ı'&&a!=='c'?'i':h)+AKSAN[a]).normalize('NFC');
  s=s.replace(/\\[&%$#_{}]/g,m=>m[1]).replace(/---?/g,'-').replace(/~/g,' ').replace(/\\(textit|textbf|emph|textsc|textrm|mathrm|text)\s*\{/g,'{').replace(/\\[a-zA-Z]+\s*/g,'').replace(/[{}]/g,'');
  return bosluk(s)}
function bibOku(m){const o=[];let i=0;
  while((i=m.indexOf('@',i))>=0){const bas=m.slice(i,i+60).match(/^@\s*(\w+)\s*([{(])/);if(!bas){i++;continue}
    const tip=bas[1].toLowerCase();let j=i+bas[0].length;const kapa=bas[2]==='{'?'}':')';let derin=1,tirnak=false;const bas2=j;
    while(j<m.length&&derin>0){const c=m[j];if(c==='{')derin++;else if(c==='}'){derin--;if(derin===0&&kapa==='}')break}else if(c===')'&&kapa===')'&&derin===1)break;j++}
    const govde=m.slice(bas2,j);i=j+1;if(['comment','preamble','string'].includes(tip))continue;
    const vir=govde.indexOf(',');if(vir<0)continue;const alan={};let k=vir+1;
    while(k<govde.length){while(k<govde.length&&/[\s,]/.test(govde[k]))k++;const ad=govde.slice(k).match(/^([\w:-]+)\s*=\s*/);if(!ad)break;k+=ad[0].length;
      let deger='';for(;;){const c=govde[k];if(c==='{'){let d=1,s=k+1;k++;while(k<govde.length&&d>0){if(govde[k]==='{')d++;else if(govde[k]==='}')d--;k++}deger+=govde.slice(s,k-1)}
        else if(c==='"'){let d=0,s=k+1;k++;while(k<govde.length&&!(govde[k]==='"'&&d===0&&govde[k-1]!=='\\')){if(govde[k]==='{')d++;else if(govde[k]==='}')d--;k++}deger+=govde.slice(s,k);k++}
        else{const w=govde.slice(k).match(/^[^,#}\s]+/);if(w){deger+=w[0];k+=w[0].length}}
        while(k<govde.length&&/\s/.test(govde[k]))k++;if(govde[k]==='#'){k++;while(/\s/.test(govde[k]))k++;continue}break}
      alan[ad[1].toLowerCase()]=deger}
    const a=x=>latex(alan[x]||'');
    o.push(kayitYap({tip,baslik:a('title'),yazarlar:(alan.author||'').split(/\s+and\s+/i).map(latex).filter(Boolean),yil:a('year')||a('date'),dergi:a('journal')||a('journaltitle')||a('booktitle')||a('publisher')||a('school'),
      cilt:a('volume'),sayi:a('number')||a('issue'),sayfa:a('pages'),doi:a('doi')||a('url'),pmid:a('pmid'),ozet:a('abstract'),anahtar:a('keywords').split(/\s*[;,]\s*/),url:a('url'),dil:a('language'),issn:a('issn')}))}
  return o}

/* ---- PubMed MEDLINE (.nbib, .txt) ---- */
function nbibOku(m){const o=[];let r=null,son=null;
  for(const sat of m.split(/\r?\n/)){const e=sat.match(/^([A-Z]{2,4})\s*- (.*)$/);
    if(e){const tag=e[1];if(tag==='PMID'){if(r)o.push(nbibDon(r));r={}}if(!r)continue;(r[tag]=r[tag]||[]).push(e[2].trim());son=tag}
    else if(r&&son&&/^\s{2,}\S/.test(sat)){const L=r[son];L[L.length-1]+=' '+sat.trim()}}
  if(r)o.push(nbibDon(r));return o}
function nbibDon(_){const g=(...t)=>{for(const x of t)if(_[x]&&_[x][0])return _[x][0];return ''},tum=(...t)=>t.flatMap(x=>_[x]||[]);
  const doi=tum('LID','AID').find(x=>/\[doi\]/.test(x))||'';
  return kayitYap({tip:g('PT'),baslik:g('TI','BTI'),yazarlar:_.FAU?_.FAU:tum('AU'),yil:g('DP'),dergi:g('JT','TA'),cilt:g('VI'),sayi:g('IP'),sayfa:g('PG'),doi:doi.replace(/\s*\[doi\]/,''),pmid:g('PMID'),ozet:g('AB'),
    anahtar:[...tum('OT'),...tum('MH').map(x=>x.replace(/\*/g,'').split('/')[0])],dil:g('LA'),issn:g('IS')})}

/* ---- Web of Science düz metin ---- */
const WOS_COK=new Set(['AU','AF','BA','BF','CA','GP','C1','C3','CR','ED','RP','EM','RI','OI','FU']);
function wosOku(m){const o=[];let r=null,son=null;
  for(const sat of m.split(/\r?\n/)){if(/^ER\s*$/.test(sat)){if(r)o.push(wosDon(r));r=null;son=null;continue}
    const e=sat.match(/^([A-Z][A-Z0-9]) (.*)$/);
    if(e&&!/^(FN|VR|EF)$/.test(e[1])){if(e[1]==='PT')r={};if(!r)continue;(r[e[1]]=r[e[1]]||[]).push(e[2]);son=e[1]}
    else if(r&&son&&/^ {3}\S/.test(sat)){if(WOS_COK.has(son))r[son].push(sat.trim());else r[son][r[son].length-1]+=' '+sat.trim()}}
  if(r)o.push(wosDon(r));return o}
function wosDon(_){const g=(...t)=>{for(const x of t)if(_[x]&&_[x][0])return _[x][0];return ''};
  return kayitYap({tip:g('DT','PT'),baslik:g('TI'),yazarlar:_.AF||_.AU||[],yil:g('PY','EA'),dergi:g('SO'),cilt:g('VL'),sayi:g('IS'),sayfa:[g('BP'),g('EP')].filter(Boolean).join('-')||g('AR'),doi:g('DI'),pmid:g('PM'),ozet:g('AB'),
    anahtar:g('DE').split(/\s*;\s*/),dil:g('LA'),issn:g('SN')})}

/* ---- EndNote etiketli metin (.enw) ---- */
function enwOku(m){const o=[];let r=null,son=null;const bitir=()=>{if(r)o.push(enwDon(r));r=null;son=null};
  for(const sat of m.split(/\r?\n/)){const e=sat.match(/^%(\S) (.*)$/);if(e){if(e[1]==='0'){bitir();r={}}if(!r)r={};(r[e[1]]=r[e[1]]||[]).push(e[2].trim());son=e[1]}else if(!sat.trim())bitir();else if(r&&son){const L=r[son];L[L.length-1]+=' '+sat.trim()}}
  bitir();return o}
function enwDon(_){const g=(...t)=>{for(const x of t)if(_[x]&&_[x][0])return _[x][0];return ''};
  return kayitYap({tip:g('0'),baslik:g('T'),yazarlar:_.A||[],yil:g('D'),dergi:g('J','B'),cilt:g('V'),sayi:g('N'),sayfa:g('P'),doi:g('R')||(_.U||[]).find(x=>/10\.\d{4,}\//.test(x))||'',ozet:g('X'),anahtar:_.K||[],url:g('U'),dil:g('G'),issn:g('@')})}

/* ---- Tablo (CSV, sekmeli metin, Excel) ---- */
function bicimBul(m){if(/^\s*TY {1,2}-/m.test(m))return 'ris';if(/^%0 /m.test(m)&&/^%T /m.test(m))return 'enw';if(/^PMID- /m.test(m))return 'nbib';if(/^PT [A-Z]\s*$/m.test(m)&&/^ER\s*$/m.test(m))return 'wos';if(/@\s*\w+\s*[{(]/.test(m)&&/=\s*[{"\d]/.test(m))return 'bib';return 'tablo'}
const BICIM_AD={enw:'EndNote',ris:'RIS',bib:'BibTeX',nbib:'PubMed (MEDLINE)',wos:'Web of Science',tablo:'CSV',xlsx:'Excel'};
const BICIM_KAYNAK={nbib:'PubMed',wos:'Web of Science'};
