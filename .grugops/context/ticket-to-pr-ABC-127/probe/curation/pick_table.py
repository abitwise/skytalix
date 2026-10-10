import json,sys
cols=['shipped','shipped4','W1','W1b','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12','W13','W14','W15','W16']
def load(prefix,cand):
    mx={c:[json.loads(l) for l in open(f'{prefix}/{c}.jsonl')] for c in cols}
    rows=[json.loads(l) for l in open(cand)] if cand else None
    return mx,rows
old,_=load('mx-old40',None)
m3,m3r=load('mx-m3','pools/cand-m3.jsonl')
wm,wmr=load('mx-wm','pools/cand-wm.jsonl')
idx={}
for mx,rows in [(m3,m3r),(wm,wmr)]:
    for i,r in enumerate(rows): idx[r['name']]=(mx,i,r)
pick=sys.argv[1].split(',')
tot={c:sum(x['solved'] for x in old[c]) for c in cols}
miss={c:[] for c in cols}; gain={c:[] for c in cols}
for n in pick:
    mx,i,r=idx[n]
    for c in cols: tot[c]+=mx[c][i]['solved']
    s=mx['shipped'][i]['solved']
    for c in cols[1:]:
        if s and not mx[c][i]['solved']: miss[c].append(n)
        if not s and mx[c][i]['solved']: gain[c].append(n)
base=tot['shipped']; total=40+len(pick)
print(f'total {total} baseline {base} unsolved {total-base} 4x {tot["shipped4"]}')
for c in cols[2:]:
    print(f'{c:4} solved {tot[c]:3} {"RED" if tot[c]<base else "green"} drop {base-tot[c]:3}  new-missed {len(miss[c]):2} new-gained {len(gain[c])} {",".join(gain[c])}')
print('4x lost:', miss['shipped4'], 'gained', gain['shipped4'])
