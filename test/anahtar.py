import re,json,glob
s=''.join(open(f).read() for f in sorted(glob.glob('js/*.js')))+open('sablon.html').read()
d=json.load(open('diller/tr.json'));e=json.load(open('diller/en.json'))
t=set(re.findall(r"\bt\('([A-Za-z0-9_]+)'",s))|set(re.findall(r'data-t="([A-Za-z0-9_]+)"',s))|set(re.findall(r'data-ta="([A-Za-z0-9_]+)"',s))
t|={'imp_'+a+b for a in ['edges','matrix','twomode','biblio','attrs','other'] for b in ['','_d','_l','_ph']}|{'style_'+x for x in ['dergi','sunum','poster','koyu']}|{'exp_'+x for x in ['gexf','graphml','net','dl','kenarcsv','dugcsv','proje']}
t-={'imp_','style_','exp_'}
print('eksik düz:',sorted(k for k in t if k not in d))
ip=set(re.findall(r"\bip\('([A-Za-z0-9_]+)'\)",s))|set(re.findall(r'data-ip="([A-Za-z0-9_]+)"',s))|set(re.findall(r"bolumBas\('[A-Za-z]+','([A-Za-z]+)'",s))|set(re.findall(r"kutu\([^,]+,'([A-Za-z_]+)'",s))|set(re.findall(r"\{ip:'([A-Za-z]+)'",s))
ip|=set(re.findall(r"anah\('[A-Za-z]+',t\('[A-Za-z]+'\),'([A-Za-z]+)'",s))
ip|={'o_'+k for k in d['olcu']}|{'a_'+k for k in d['agOlcu']}
print('eksik ipucu:',sorted(k for k in ip if k not in d['ipucu']))
print('kullanılmayan ipucu:',sorted(k for k in d['ipucu'] if k not in ip))
g=set(re.findall(r"(?:tAlt|ga)\('([a-zA-Z]+)','([A-Za-z0-9_]+)'",s))
print('eksik grup:',sorted(x for x in g if x[1] not in d.get(x[0],{})))
gi=set(re.findall(r"\bg\('([A-Za-z0-9]+)'\)",open('js/7-giris.js').read()))|set(re.findall(r"g\(k\+'D'\)",''))
print('eksik giris:',sorted(k for k in gi if k not in d['giris']))
yk=set(re.findall(r"g\('([A-Za-z0-9]+)'\)",open('js/6e-rapor.js').read()))
print('eksik yontem:',sorted(k for k in yk if k not in d['yontem']))
for k in d:
  if k not in e: print('en eksik',k)
