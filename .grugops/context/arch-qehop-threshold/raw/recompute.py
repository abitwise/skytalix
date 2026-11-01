import csv,sys,math
rows=list(csv.DictReader(open(sys.argv[1]),delimiter='\t'))
d={}
for r in rows:
    if r['round']=='0': continue
    d.setdefault(int(r['round']),{})[r['cond']]=(round(float(r['user'])*100)+round(float(r['sys'])*100), round(float(r['wall'])*100))
def med(x):
    x=sorted(x);n=len(x);return (x[n//2-1]+x[n//2])/2
for i,u in ((0,'cpu'),(1,'wall')):
    B=[d[k]['B'][i] for k in sorted(d)];H=[d[k]['H'][i] for k in sorted(d)];T=[d[k]['T'][i] for k in sorted(d)]
    tw=sorted(t-b for t,b in zip(T,B)); tr=sorted(h-b for h,b in zip(H,B))
    print(u,'n',len(B),'Bmed',med(B)/100,'Hmed',med(H)/100,'Tmed',med(T)/100)
    print(' twin',[x/100 for x in tw],'med',med(tw)/100,'R',max(abs(tw[1]),abs(tw[6]))/100)
    print(' treat',[x/100 for x in tr],'med',med(tr)/100,'int',tr[1]/100,tr[6]/100)
s=0.215/2630
N0=4272
for lab,v in (('median',0.455),('hi',0.490)):
    print(lab,'cross',N0+(0.650-v)/s)
print('75%',N0+(0.4875-0.455)/s)
for N in (4670,5000,5500,6000):
    print(N,'proj med',round(0.455+(N-N0)*s,4),'hi',round(0.490+(N-N0)*s,4))
print('slope us',s*1e6)
