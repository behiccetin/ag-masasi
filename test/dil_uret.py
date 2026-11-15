#!/usr/bin/env python3
"""Ağ Masası dil dosyalarını üretir: diller/tr.json ve diller/en.json. Kaynak: test/dil_a.py ... dil_d.py ([tr, en] çiftleri)."""
import json,os,sys
B=os.path.dirname(os.path.abspath(__file__));K=os.path.dirname(B);sys.path.insert(0,B)
from dil_a import D
from dil_b import OLCU,AGOLCU,IPUCU,YONTEM,ATIF
from dil_c import GIRIS
from dil_d import YARDIM
from dil_e import D2,IPUCU2,FORMUL,TESTGIRIS,YONTEM2
D.update(D2);IPUCU.update(IPUCU2);YONTEM.update(YONTEM2)
G={'olcu':OLCU,'agOlcu':AGOLCU,'ipucu':IPUCU,'yontem':YONTEM,'atif':ATIF,'giris':GIRIS,'yardim':YARDIM,'formul':FORMUL,'testGiris':TESTGIRIS}
def cevir(v,i,yol):
    if isinstance(v,dict): return {k:cevir(x,i,yol+'.'+k) for k,x in v.items()}
    assert isinstance(v,list) and len(v)==2, yol
    return v[i]
yasak='—'
for i,kod in enumerate(['tr','en']):
    o={k:cevir(v,i,k) for k,v in D.items()}
    for g,alt in G.items(): o[g]=cevir(alt,i,g)
    s=json.dumps(o,ensure_ascii=False,indent=1)
    assert yasak not in s, 'uzun tire'
    open(os.path.join(K,'diller',kod+'.json'),'w',encoding='utf-8').write(s)
print('tamam:',len(D),'düz,',sum(len(x) for x in G.values()),'gruplu')
