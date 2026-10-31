# timeline.py: files by start time, with the gap since the previous file ended on the same greedy slot (shape only)
import json,sys,os
d=json.load(open(sys.argv[1])); root=sys.argv[2]
fs=sorted(((f['startTime'],f['endTime'],os.path.relpath(f['name'],root)) for f in d['testResults']))
t0=d['startTime']; slots=[t0,t0]
for s,e,n in fs:
    i=min(range(2),key=lambda k:(abs(s-slots[k]) if slots[k]<=s else 1e12))
    gap=(s-slots[i])/1000; slots[i]=e
    print("%6.2f %6.2f slot%d gap %5.2f  %s"%((s-t0)/1000,(e-t0)/1000,i,gap,n))
print("report end (max endTime) %.2f"%((max(f[1] for f in fs)-t0)/1000))
