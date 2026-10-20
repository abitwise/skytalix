import json,sys,os,datetime
d=json.load(open(sys.argv[1]))
root=sys.argv[2]
rows=[]
t0=min(f['startTime'] for f in d['testResults']); t1=max(f['endTime'] for f in d['testResults'])
for f in d['testResults']:
    n=os.path.relpath(f['name'],root)
    span=(f['endTime']-f['startTime'])/1000
    s=sum((a.get('duration') or 0) for a in f['assertionResults'])/1000
    rows.append((span,s,len(f['assertionResults']),n,(f['startTime']-t0)/1000,(f['endTime']-t0)/1000))
rows.sort(reverse=True)
print("run start", datetime.datetime.utcfromtimestamp(d['startTime']/1000), "first file start->last end %.2fs"%((t1-t0)/1000), "report start->first file %.2fs"%((t0-d['startTime'])/1000))
tot=sum(r[0] for r in rows); tots=sum(r[1] for r in rows)
print("sum span %.2f  sum testdur %.2f  files %d"%(tot,tots,len(rows)))
c=0
for r in rows:
    c+=r[0]
    print("%7.3f %7.3f %4d  cum%5.1f%%  [%6.2f-%6.2f] %s"%(r[0],r[1],r[2],100*c/tot,r[4],r[5],r[3]))
