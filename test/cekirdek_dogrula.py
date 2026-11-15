import json,subprocess,numpy as np,networkx as nx,itertools,sys
rng=np.random.default_rng(5);hata=[];say=0
def kars(ad,a,b,tol=1e-7):
  global say;say+=1;a=np.asarray(a,float);b=np.asarray(b,float)
  if a.shape!=b.shape or not np.allclose(a,b,atol=tol,rtol=1e-6,equal_nan=True):hata.append(ad);print('FARK',ad,np.round(a[:6],5),np.round(b[:6],5))
def uret(n,yonlu,agirlikli):
  k=int(rng.integers(2,5));grp=rng.integers(0,k,n)
  L=[];L2=[]
  for i in range(n):
    for j in range(n):
      if i==j or (not yonlu and j<i):continue
      p=.22 if grp[i]==grp[j] else .03
      if rng.random()<p:
        w=int(rng.integers(1,6)) if agirlikli else 1;L.append([i,j,w])
        if rng.random()<.6:L2.append([i,j,int(rng.integers(1,4))])
      elif rng.random()<.02:L2.append([i,j,1])
  return grp,L,L2
for deneme in range(24):
  yonlu=deneme%2==1;agirlikli=deneme%3!=0;yolAg=agirlikli and deneme%4==1
  n=int(rng.integers(25,70));grp,L,L2=uret(n,yonlu,agirlikli);kidem=rng.integers(1,30,n)
  g={'ad':[f'n{i}' for i in range(n)],'grp':[f'g{x}' for x in grp],'kidem':kidem.tolist(),'yonlu':yonlu,'agirlikli':agirlikli,'yolAgirlik':yolAg,'iliskiler':[L,L2],'cpYoksay':deneme%2==0}
  r=subprocess.run(['node','test/cekirdek.js'],input=json.dumps(g),capture_output=True,text=True)
  if r.returncode:print(r.stderr[:2000]);sys.exit(1)
  o=json.loads(r.stdout);D=o['D'];A=o['A']
  G=nx.DiGraph() if yonlu else nx.Graph();G.add_nodes_from(range(n))
  from fractions import Fraction
  for s,t,w in o['E']:G.add_edge(s,t,weight=w,dist=1/w,kesir=Fraction(1,int(w)))
  Gu=nx.Graph();Gu.add_nodes_from(range(n))
  for s,t,w in o['E']:
    if Gu.has_edge(s,t):Gu[s][t]['weight']+=w
    else:Gu.add_edge(s,t,weight=w)
  W='weight' if agirlikli else None;dist='dist' if yolAg else None
  kars('derece',D['derece'],[Gu.degree(i) for i in range(n)])
  kars('guc',D['guc'],[Gu.degree(i,weight='weight') for i in range(n)])
  b=nx.betweenness_centrality(G,weight='kesir' if yolAg else None);kars(f'arasindalik yolAg={yolAg}',D['arasindalik'],[b[i] for i in range(n)])
  Gc=G.reverse() if yonlu else G
  c=nx.closeness_centrality(Gc,distance=dist);kars('yakinlik',D['yakinlik'],[c[i] for i in range(n)])
  h=nx.harmonic_centrality(Gc,distance=dist);kars('harmonik',D['harmonik'],[h[i]/(n-1) for i in range(n)])
  try:
    e=nx.eigenvector_centrality(G,max_iter=20000,tol=1e-13,weight=W);kars('ozvektor',D['ozvektor'],[e[i] for i in range(n)],1e-5)
  except Exception as ex:print('nx özvektör yakınsamadı',ex)
  pr=nx.pagerank(G,weight=W,tol=1e-13,max_iter=10000);kars('pagerank',D['pagerank'],[pr[i] for i in range(n)],1e-7)
  kars('cekirdek',D['cekirdek'],[nx.core_number(Gu)[i] for i in range(n)])
  kars('kumelenme',D['kumelenme'],[nx.clustering(Gu)[i] for i in range(n)]);kars('gecislilik',[A['gecislilik']],[nx.transitivity(Gu)]);kars('ortKum',[A['ortKumelenme']],[nx.average_clustering(Gu)])
  Gw=Gu if agirlikli else nx.Graph(Gu.edges())
  Gw.add_nodes_from(range(n))
  con=nx.constraint(Gw,weight='weight' if agirlikli else None);kars('kisitlama',[np.nan if x is None else x for x in D['kisitlama']],[con[i] for i in range(n)])
  es=nx.effective_size(Gw,weight='weight' if agirlikli else None);kars('etkinBuyukluk',[np.nan if x is None else x for x in D['etkinBuyukluk']],[es[i] for i in range(n)])
  if yonlu:
    hu,au=nx.hits(G,max_iter=100000,tol=1e-14);kars('hub',D['hub'],[hu[i] for i in range(n)],1e-6);kars('otorite',D['otorite'],[au[i] for i in range(n)],1e-6)
    kars('karsiliklilik',[A['karsiliklilik']],[nx.reciprocity(G)])
    tc=nx.triadic_census(G);kars('triad',[o['triad'][k] for k in tc],[tc[k] for k in tc])
    kars('gucluBilesen',[A['gucluBilesenSay']],[nx.number_strongly_connected_components(G)])
  kars('yogunluk',[A['yogunluk']],[nx.density(G)]);kars('bilesen',[A['bilesenSay']],[nx.number_connected_components(Gu)])
  kars('dereceUyumu',[A['dereceUyumu']],[nx.degree_assortativity_coefficient(nx.Graph(Gu.edges()))])
  kars('kesme',sorted(A['kesmeNoktalari']),sorted(nx.articulation_points(Gu)));kars('kopru',sorted(map(tuple,A['kopruler'])),sorted(tuple(sorted(e)) for e in nx.bridges(Gu)))
  if nx.is_connected(Gu) and not yonlu:
    kars('ortUzaklik',[A['ortUzaklik']],[nx.average_shortest_path_length(G,weight=dist)]);kars('cap',[A['cap']],[max(max(d.values()) for _,d in nx.shortest_path_length(G,weight=dist))])
  part={};[part.setdefault(c,set()).add(i) for i,c in enumerate(o['T']['c'])]
  kars('modulerlik',[o['T']['Q']],[nx.community.modularity(Gu,part.values(),weight='weight' if agirlikli else None)])
  qnx=max(nx.community.modularity(Gu,nx.community.louvain_communities(Gu,weight='weight' if agirlikli else None,seed=s),weight='weight' if agirlikli else None) for s in range(10))
  if o['T']['Q']<qnx-0.01:hata.append('louvain zayıf');print('Louvain Q',o['T']['Q'],'nx',qnx)
  # NMI
  from math import log
  a=[f'g{x}' for x in grp];bb=o['T']['c'];N=len(a)
  def H(x):
    from collections import Counter;return -sum(c/N*log(c/N) for c in Counter(x).values())
  from collections import Counter;ca,cb,cab=Counter(a),Counter(bb),Counter(zip(a,bb));I=sum(c/N*log((c/N)/((ca[x]/N)*(cb[y]/N))) for (x,y),c in cab.items())
  kars('nmi',[o['nmi']],[2*I/(H(a)+H(bb)) if H(a)+H(bb)>0 else 1])
  # E-I
  E_=sum(1 for s,t,w in o['E'] if grp[s]!=grp[t]);I_=len(o['E'])-E_;kars('ei',[o['ei']['ei']],[(E_-I_)/(E_+I_)])
  # omurga
  if agirlikli:
    so=[sum(w for s,t,w in o['E'] if s==i or (not yonlu and t==i)) for i in range(n)] if not yonlu else [sum(w for s,t,w in o['E'] if s==i) for i in range(n)]
    si=so if not yonlu else [sum(w for s,t,w in o['E'] if t==i) for i in range(n)]
    ko=[sum(1 for s,t,w in o['E'] if s==i or (not yonlu and t==i)) for i in range(n)] if not yonlu else [sum(1 for s,t,w in o['E'] if s==i) for i in range(n)]
    ki=ko if not yonlu else [sum(1 for s,t,w in o['E'] if t==i) for i in range(n)]
    al=lambda w,s,k:(1-w/s)**(k-1) if k>1 and s>0 else 1
    beklenen=[k for k,(s,t,w) in enumerate(o['E']) if min(al(w,so[s],ko[s]),al(w,si[t],ki[t]))<0.2];kars('omurga',o['omurga'],beklenen)
  # QAP korelasyonu ve MRQAP katsayıları
  Y=np.zeros((n,n));X1=np.zeros((n,n))
  for s,t,w in o['E']:Y[s,t]=w;(None if yonlu else Y.__setitem__((t,s),w))
  e2={}
  for s,t,w in L2:
    if not yonlu and s>t:s,t=t,s
    e2[(s,t)]=(e2.get((s,t),0)+w) if agirlikli else 1
  for (s,t),w in e2.items():X1[s,t]=w;(None if yonlu else X1.__setitem__((t,s),w))
  idx=[(i,j) for i in range(n) for j in range(n) if i!=j and (yonlu or i<j)]
  y=np.array([Y[i,j] for i,j in idx]);x1=np.array([X1[i,j] for i,j in idx]);x2=np.array([1.0 if grp[i]==grp[j] else 0 for i,j in idx]);x3=np.array([abs(kidem[i]-kidem[j]) for i,j in idx],float)
  kars('qap r',[o['qap']['r']],[np.corrcoef(y,x1)[0,1]])
  Xm=np.column_stack([np.ones(len(y)),x1,x2,x3]);bh=np.linalg.lstsq(Xm,y,rcond=None)[0];kars('mrqap b',o['mrqap']['b'],bh,1e-8)
  res=y-Xm@bh;R2=1-res@res/((y-y.mean())@(y-y.mean()));kars('mrqap R2',[o['mrqap']['R2']],[R2])
  if o['qap']['p']>0.05 and abs(o['qap']['r'])>0.3:print('QAP p şüpheli',o['qap'])
  # dayanıklılık (uyarlanır derece, ilk en büyük dizin)
  H2=Gu.copy();kal=set(range(n));egri=[]
  for k in range(n):
    v=max(sorted(kal),key=lambda i:(H2.degree(i),-i));H2.remove_node(v);kal.discard(v);egri.append(max((len(c) for c in nx.connected_components(H2)),default=0)/n)
  kars('dayaniklilik derece',o['day']['derece'][1:n+1],egri)
print(f'{say} karşılaştırma, {len(hata)} fark',hata[:10])
