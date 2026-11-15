import json,subprocess,numpy as np,itertools
rng=np.random.default_rng(9);kotu=0;toplam=0
def brute(A,yok):
  n=len(A);en=-2
  for mask in range(1,2**n-1):
    c=[(mask>>i)&1 for i in range(n)];a=[];d=[]
    for i in range(n):
      for j in range(i+1,n):
        if yok and c[i]!=c[j]:continue
        a.append(A[i][j]);d.append(1 if (c[i] and c[j]) or (not yok and (c[i] or c[j])) else 0)
    a=np.array(a,float);d=np.array(d,float)
    if a.std()==0 or d.std()==0:continue
    r=np.corrcoef(a,d)[0,1];en=max(en,r)
  return en
for k in range(30):
  n=int(rng.integers(7,13));yok=k%2==0;core=rng.random(n)<.35
  A=np.zeros((n,n),int);L=[]
  for i in range(n):
    for j in range(i+1,n):
      p=.8 if core[i] and core[j] else .35 if core[i] or core[j] else .08
      if rng.random()<p:A[i,j]=A[j,i]=1;L.append([i,j,1])
  if not L:continue
  g={'ad':[str(i) for i in range(n)],'grp':['a']*n,'kidem':[1]*n,'yonlu':False,'agirlikli':False,'yolAgirlik':False,'iliskiler':[L,L],'cpYoksay':yok}
  o=json.loads(subprocess.run(['node','test/cekirdek.js'],input=json.dumps(g),capture_output=True,text=True).stdout)
  if not o['cp']:continue
  b=brute(A,yok);toplam+=1
  if o['cp']['uyum']<b-1e-9:kotu+=1;print('eksik',n,yok,o['cp']['uyum'],b)
print(f'{toplam} ağda kaba kuvvetle karşılaştırma, {kotu} tanesinde en iyi bulunamadı')
