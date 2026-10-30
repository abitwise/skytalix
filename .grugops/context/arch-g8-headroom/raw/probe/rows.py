import json,sys,os
d=json.load(open(sys.argv[1])); pat=sys.argv[2]; top=int(sys.argv[3])
for f in d['testResults']:
    if not f['name'].endswith(pat): continue
    rows=[(a.get('duration') or 0, ' > '.join(a['ancestorTitles'][:1])[:60], a['title'][:90]) for a in f['assertionResults']]
    tot=sum(r[0] for r in rows)
    # per describe
    by={}
    for r in rows: by[r[1]]=by.get(r[1],0)+r[0]
    print("FILE",pat,"rows",len(rows),"sum %.0f ms"%tot)
    for k,v in sorted(by.items(),key=lambda x:-x[1])[:top]: print("  %6.0f  %s"%(v,k))
    print(" top rows:")
    for r in sorted(rows,reverse=True)[:top]: print("  %6.0f  %s | %s"%r)
