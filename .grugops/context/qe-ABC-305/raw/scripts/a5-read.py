# qe-ABC-305: A5 re-derived from a8.tsv and foreign.tsv with QE's own code, not the harness's grader. Usage: python3 -I a5-read.py <a8.tsv> <foreign.tsv>
import csv, sys, statistics as st
from datetime import datetime, timedelta
rows=list(csv.DictReader(open(sys.argv[1]),delimiter="\t"))
print("rows",len(rows),"rounds",sorted({int(r["round"]) for r in rows}))
exp={"B":2709,"H":2710,"H2":2710}
bad=[r for r in rows if r["exit"]!="0" or int(r["passed"])!=exp[r["arm"]] or r["files"]!="71" or r["skipped"]!="0" or r["failed"]!="0"]
print("runs off expected",len(bad))
print("orders",[ " ".join(r["arm"] for r in rows if r["round"]==str(k)) for k in range(9)])
print("scored flags by round",{k:[r["scored"] for r in rows if r["round"]==str(k)] for k in range(9)})
print("load_wait_s nonzero",sum(1 for r in rows if r["load_wait_s"]!="0"),"load1 min/max",min(float(r["load1"]) for r in rows),max(float(r["load1"]) for r in rows))
print("vitest fields nonzero",sum(1 for r in rows for f in("vitest_run_foreign","vitest_busy_foreign","vitest_after","vitest_busy_after") if r[f]!="0"))
sc=[r for r in rows if r["scored"]=="1" and int(r["round"])>=1]
w={a:{int(r["round"]):float(r["wall_s"]) for r in sc if r["arm"]==a} for a in exp}
c={a:{int(r["round"]):float(r["cpu_s"]) for r in sc if r["arm"]==a} for a in exp}
R=sorted(w["H"]); n=len(R); print("n",n)
for a in exp:
    s=sorted(w[a].values()); print(a,"walls",s,"median",round(st.median(s),4),"[k=2]",s[1],s[n-2],"max",s[-1],"cpu median",round(st.median(c[a].values()),3))
d=[round(w["H"][k]-w["B"][k],2) for k in R]; ds=sorted(d)
print("H-B paired by round",dict(zip(R,d)))
print("sorted",ds,"median",round(st.median(ds),4),"[k=2]",ds[1],ds[n-2],"positive",sum(x>0 for x in ds),"over +0.10:",sum(x>0.10 for x in ds))
dc=sorted(round(c["H"][k]-c["B"][k],2) for k in R); print("H-B cpu",dc,"median",round(st.median(dc),4),"[k=2]",dc[1],dc[n-2])
t=sorted(round(w["H2"][k]-w["H"][k],2) for k in R); print("H2-H wall",t,"median",round(st.median(t),4),"[k=2]",t[1],t[n-2],"over +0.10 abs:",sum(abs(x)>0.10 for x in t))
tc=sorted(round(c["H2"][k]-c["H"][k],2) for k in R); hc=st.median(c["H"].values()); m=st.median(tc)
print("H2-H cpu",tc,"median",round(m,4),"pct of H",round(100*abs(m)/hc,3),"limit",round(max(.015*hc,.01),4),"sign",sum(x>0 for x in tc),"/",sum(x!=0 for x in tc))
t2=sorted(round(w["H2"][k]-w["B"][k],2) for k in R); print("H2-B wall (the same tree against B)",t2,"median",round(st.median(t2),4),"[k=2]",t2[1],t2[n-2])
# position in round: does the arm order move the wall?
pos={}
for r in sc:
    i=[x["arm"] for x in rows if x["round"]==r["round"]].index(r["arm"]); pos.setdefault(i,[]).append(float(r["wall_s"]))
print("wall median by slot in round",{k:round(st.median(v),3) for k,v in sorted(pos.items())})
print("wall by round order",[ (r["round"],r["arm"],r["wall_s"]) for r in sc][:6])
# flags, own code
fs=[l.rstrip("\n").split("\t") for l in open(sys.argv[2]) if l.strip()]
print("samples",len(fs),"unique ts",len({f[0] for f in fs}),"rows not 'none'",sum(1 for f in fs if f[2:]!=["none"]),"field counts",sorted({len(f) for f in fs}))
fc=[float(r["foreign_cpu_s"]) for r in sc]; print("foreign_cpu_s median",st.median(fc),"min",min(fc),"max",max(fc),"threshold",st.median(fc)+5)
ts=lambda s:datetime.strptime(s,"%Y-%m-%dT%H:%M:%SZ")
gaps=[(ts(b[0])-ts(a[0])).total_seconds() for a,b in zip(fs,fs[1:])]; print("sample gap s max",max(gaps),"first",fs[0][0],"last",fs[-1][0])
print("first run start",rows[0]["start_utc"],"last run start",rows[-1]["start_utc"])
