import json,sys,os
d=json.load(open(sys.argv[1])); root=sys.argv[2]
fs=sorted(d['testResults'],key=lambda f:f['startTime'])
t0=d['startTime']
# greedy assign to 2 lanes: a file goes to the lane whose last end <= its start (latest such)
lanes=[0.0,0.0]; names=[[],[]]
for f in fs:
    s=(f['startTime']-t0)/1000; e=(f['endTime']-t0)/1000
    cand=[i for i in range(2) if lanes[i]<=s+0.002]
    i=max(cand,key=lambda i:lanes[i]) if cand else None
    gap = s-lanes[i] if i is not None else None
    print("%6.2f %6.2f  lane %s gap-before %s  %s"%(s,e,i,("%.2f"%gap) if gap is not None else "OVERLAP>2", os.path.relpath(f['name'],root)))
    if i is not None: lanes[i]=e
