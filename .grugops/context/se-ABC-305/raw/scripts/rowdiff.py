import json,glob,sys,statistics as st,re
O=sys.argv[1]
def rows(arms):
    d={}
    for a in arms:
        for p in glob.glob(f"{O}/runs/json-*-{a}.json"):
            seq=int(re.search(r'json-(\d+)-',p).group(1))
            if seq<3: continue
            for f in json.load(open(p))['testResults']:
                n=re.sub(r'.*/arms/[^/]+/','',f['name'])
                for r in f['assertionResults']:
                    d.setdefault((n,r['fullName']),[]).append(r.get('duration') or 0)
    return d
H=rows(['H','H2']);B=rows(['B'])
print('runs per row H+H2',len(next(iter(H.values()))),'B',len(next(iter(B.values()))))
new=[k for k in H if k not in B]; gone=[k for k in B if k not in H]
print('NEW',len(new)); [print(' ',round(st.median(H[k]),1),k) for k in new]
print('GONE',len(gone)); [print(' ',round(st.median(B[k]),1),k) for k in gone]
for fn in ['src/evaluate.passer.test.ts','src/evaluate.king-mobility.test.ts','tools/tune/tune.test.ts']:
    ks=[k for k in H if k[0]==fn]
    print(fn,len(ks),'H sum',round(sum(st.median(H[k]) for k in ks),1),'B sum',round(sum(st.median(B[k]) for k in B if k[0]==fn),1))
    for k in sorted(ks,key=lambda k:-st.median(H[k]))[:8]: print('  ',round(st.median(H[k]),1),round(st.median(B[k]),1) if k in B else None,k[1][:120])
