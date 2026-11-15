#!/usr/bin/env python3
"""Ağ Masası derleyici: sablon.html + stil.css + yazi/*.woff2 + js/*.js + diller/*.json -> dist/ag-masasi.html ve index.html"""
import json,glob,os,subprocess,base64
K=os.path.dirname(os.path.abspath(__file__))
def oku(p): return open(os.path.join(K,p),encoding='utf-8').read()
subprocess.run(['npx','@tailwindcss/cli','-i','stil.css','-o','dist/stil.css','--minify'],cwd=K,check=True,capture_output=True)
def yazi(ad,dosya,kalin,bicem='normal'):
    b=base64.b64encode(open(os.path.join(K,'yazi',dosya),'rb').read()).decode()
    return '@font-face{font-family:"%s";font-weight:%d;font-style:%s;font-display:swap;src:url(data:font/woff2;base64,%s) format("woff2")}'%(ad,kalin,bicem,b)
# TeX Gyre Heros ve Heros Condensed: GUST Font License (yazi/GUST-FONT-LICENSE.txt)
css=''.join([yazi('Ag Dar','heroscn-regular.woff2',400),yazi('Ag Dar','heroscn-bold.woff2',700),
    yazi('Ag Metin','heros-regular.woff2',400),yazi('Ag Metin','heros-bold.woff2',700),yazi('Ag Metin','heros-italic.woff2',400,'italic')])+oku('dist/stil.css')
diller={}
for f in sorted(glob.glob(os.path.join(K,'diller','*.json'))):
    d=json.load(open(f,encoding='utf-8'))
    assert d.get('_kod') and d.get('_ad'), f
    diller[d['_kod']]=d
js='\n'.join(oku(os.path.relpath(f,K)) for f in sorted(glob.glob(os.path.join(K,'js','*.js'))))
s=oku('sablon.html')
for a in ['/*__CSS__*/','/*__DILLER__*/{}','//__JS__']: assert s.count(a)==1,a
djson=json.dumps(diller,ensure_ascii=False).replace('</','<\\/')
cog=oku('veri/cografya.b64').strip();bay=oku('veri/bayrak.b64').strip()
assert s.count('/*__COG__*/')==1 and s.count('/*__BAYRAK__*/')==1
s=s.replace('/*__COG__*/',cog).replace('/*__BAYRAK__*/',bay)
s=s.replace('/*__CSS__*/',css).replace('/*__DILLER__*/{}',djson).replace('//__JS__',js.replace('</script','<\\/script'))
os.makedirs(os.path.join(K,'dist'),exist_ok=True)
open(os.path.join(K,'dist','ag-masasi.html'),'w',encoding='utf-8').write(s)
open(os.path.join(K,'index.html'),'w',encoding='utf-8').write(s)  # GitHub Pages
print('diller:',','.join(diller),'| boyut:',round(len(s.encode())/1024),'KB')
