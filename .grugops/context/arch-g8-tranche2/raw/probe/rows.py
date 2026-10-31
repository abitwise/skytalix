# rows.py: per-row and per-describe durations from a vitest JSON report (shape and ranking only)
import json,sys,os,collections
d=json.load(open(sys.argv[1])); root=sys.argv[2]
rows=[]
for f in d['testResults']:
    n=os.path.relpath(f['name'],root)
    for a in f['assertionResults']:
        rows.append(((a.get('duration') or 0),n,' > '.join(a.get('ancestorTitles') or []),a['title']))
rows.sort(reverse=True)
print("## top 60 rows (ms)")
for r in rows[:60]: print("%7.1f  %s | %s | %s"%r)
for fn in ["src/uci-session.test.ts","src/search.null-move.test.ts","src/engine.test.ts","src/cli.test.ts","tools/grugops/qe-hop-integrity.test.ts","src/levels.test.ts"]:
    g=collections.defaultdict(lambda:[0,0.0])
    for r in rows:
        if r[1]==fn:
            k=r[2].split(' > ')[0] if r[2] else '(top)'
            g[k][0]+=1; g[k][1]+=r[0]
    print("\n## %s by top-level describe (rows, ms)"%fn)
    for k,v in sorted(g.items(),key=lambda kv:-kv[1][1]): print("%4d %8.1f  %s"%(v[0],v[1],k))
