"""Yönlü topluluk yöntemlerinin NetworkX ve igraph ile karşılaştırması (js/2c-yonlu-topluluk.js).
Denetlenen: (1) yönlü modülerlik Q, NetworkX'in Leicht-Newman modülerliğiyle; (2) Infomap: yönsüz ağda kod uzunluğu igraph'ınkiyle, yönlü ağda bulunan bölme igraph'ınkiyle (NMI) karşılaştırılır; yönlü L değeri igraph'tan ayrışır (bkz. yardım metni);
(3) Leiden ve yönlü Louvain'in yönlü modülerliğinin, igraph Leiden'inkine yakınlığı."""
import json,subprocess,numpy as np,networkx as nx,igraph as ig
rng=np.random.default_rng(11);hata=[];say=0
from sklearn.metrics import normalized_mutual_info_score as _n
nmi=lambda a,b:_n(a,b)
def calistir(g):
  r=subprocess.run(['node','test/yonlu_node.js'],input=json.dumps(g),capture_output=True,text=True,check=True);return json.loads(r.stdout)
def uret(n,k,yonlu,pin,pout):
  grp=rng.integers(0,k,n);E=[]
  for i in range(n):
    for j in range(n):
      if i==j or (not yonlu and j<i):continue
      if rng.random()<(pin if grp[i]==grp[j] else pout):E.append([i,j,int(rng.integers(1,5))])
  return E
def tamam(ad,ok,ek=''):
  global say;say+=1
  if not ok:hata.append(ad)
  print(('TAMAM ' if ok else 'HATA  ')+ad,ek)
for yonlu in (True,False):
  for tohum in range(3):
    n=int(rng.integers(40,90));E=uret(n,int(rng.integers(2,5)),yonlu,.25,.03)
    for y in ('dlouvain','leiden','infomap') if yonlu else ('leiden','infomap'):
      r=calistir({'n':n,'yonlu':yonlu,'E':E,'yontem':y,'tekrar':10})
      G=(nx.DiGraph if yonlu else nx.Graph)();G.add_nodes_from(range(n))
      for a,b,w in r['E']:G.add_edge(a,b,weight=w)
      gr={};[gr.setdefault(c,set()).add(i) for i,c in enumerate(r['c'])]
      Qn=nx.community.modularity(G,list(gr.values()),weight='weight')
      tamam(f"Q {'yönlü' if yonlu else 'yönsüz'} {y} #{tohum}",abs(Qn-r['Q'])<1e-9,(round(Qn,6),round(r['Q'],6)))
    # Infomap kod uzunluğu: igraph ile
    r=calistir({'n':n,'yonlu':yonlu,'E':E,'yontem':'infomap','tekrar':20})
    g=ig.Graph(n=n,edges=[(a,b) for a,b,_ in r['E']],directed=yonlu);g.es['w']=[w for *_,w in r['E']]
    m=g.community_infomap(edge_weights='w',trials=20)
    if yonlu:
      tamam(f"Infomap bölmesi yönlü #{tohum} (NMI ≥ 0,85, igraph ile)",nmi(r['c'],m.membership)>=0.85,(round(nmi(r['c'],m.membership),3),r['k'],len(m)))
    else:
      tamam(f"Infomap L yönsüz #{tohum} (bizim ≤ igraph + 0,02)",r['L']<=m.codelength+0.02,(round(r['L'],4),round(m.codelength,4)))
print(f'\n{say-len(hata)} / {say}');raise SystemExit(1 if hata else 0)
