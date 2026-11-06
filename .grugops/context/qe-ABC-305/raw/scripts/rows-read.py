# qe-ABC-305: A5's rows re-derived from the read's 24 scored JSON reports. Usage: python3 -I rows-read.py <out dir with runs/ and a8.tsv>
import csv,json,sys,re,statistics as st
O=sys.argv[1]
rows=[r for r in csv.DictReader(open(f"{O}/a8.tsv"),delimiter="\t") if r["scored"]=="1"]
D={"H":{}, "H2":{}, "B":{}}; F={"H":{}, "H2":{}, "B":{}}; SUM={"H":[], "H2":[], "B":[]}
for r in rows:
    a=r["arm"]; j=json.load(open(f"{O}/runs/json-{r['seq']}-{a}.json")); tot=0
    for f in j["testResults"]:
        n=re.sub(r".*/arms/[^/]+/","",f["name"]); F[a].setdefault(n,[]).append(f["endTime"]-f["startTime"])
        for t in f["assertionResults"]:
            d=t.get("duration") or 0; D[a].setdefault((n,t["fullName"]),[]).append(d); tot+=d
    SUM[a].append(tot)
print("runs",{a:len(SUM[a]) for a in SUM})
HH={k:D["H"][k]+D["H2"].get(k,[]) for k in D["H"]}
B=D["B"]
med=lambda v:st.median(v)
new=[k for k in HH if k not in B]; gone=[k for k in B if k not in HH]
s=0
print("ADDED/CHANGED by title (H+H2, n=16):")
for k in new: m=med(HH[k]); s+=m; print(f"  {m:.3f} ms n={len(HH[k])} {k[0]} :: {k[1][:90]}")
print(f"sum {s:.3f} ms (the aim 90 ms)")
g=sum(med(B[k]) for k in gone); print(f"GONE from B (their old forms): {g:.3f} ms; net in-thread {s-g:+.3f} ms")
print("rows that call the changed zeroed helper:")
z=[k for k in HH if k[0].endswith("king-mobility.test.ts") and "phase-24 twin bites" in k[1]]
zs=0
for k in z: m=med(HH[k]); zs+=m; print(f"  {m:.3f} ms {k[1][:90]}")
print(f"sum with them {s+zs:.3f} ms")
print("H+H2 rows >= 50 ms median, whole lane:",sum(1 for k in HH if med(HH[k])>=50), "; of them new against B:",sum(1 for k in new if med(HH[k])>=50))
three=("src/evaluate.passer.test.ts","src/evaluate.king-mobility.test.ts","tools/tune/tune.test.ts")
print("rows >= 50 ms in the three files, any single run max:",[(k[1][:50],max(HH[k])) for k in HH if k[0] in three and max(HH[k])>=50])
print("max single-run duration of the added/changed rows:",{k[1][:40]:round(max(HH[k]),2) for k in new})
print("file slots, ms, median: file H+H2 B delta")
for n in three:
    h=med(F["H"][n]+F["H2"][n]); b=med(F["B"][n]); print(f"  {n} {h:.1f} {b:.1f} {h-b:+.1f}")
print("lane in-thread sum, ms, median:",{a:round(med(SUM[a]),1) for a in SUM}, "H-B",round(med(SUM["H"])-med(SUM["B"]),1),"H2-B",round(med(SUM["H2"])-med(SUM["B"]),1),"H2-H",round(med(SUM["H2"])-med(SUM["H"]),1))
