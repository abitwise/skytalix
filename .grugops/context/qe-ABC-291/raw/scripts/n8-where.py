# qe-ABC-291-read: a report, no bar. Where NFR-008's H - B sits, from the runs' own files. usage: python3 -I n8-where.py <a8.tsv> <runs dir>
# Paired H2 - B wall (the same code as H) beside H - B; then per-title median in-thread duration over scored rounds: titles only H has, and the change on shared titles.
import csv, glob, json, os, statistics as st, sys
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t")); R = sys.argv[2]
by = {}
for x in rows: by.setdefault(int(x["round"]), {})[x["arm"]] = x
rs = [r for r in sorted(by) if r >= 1 and len(by[r]) == 3 and all(by[r][a]["scored"] == "1" for a in ("B", "H", "H2"))]
for a in ("H", "H2"):
    d = sorted(float(by[r][a]["wall_s"]) - float(by[r]["B"]["wall_s"]) for r in rs); c = sorted(float(by[r][a]["cpu_s"]) - float(by[r]["B"]["cpu_s"]) for r in rs)
    print(f"paired {a} - B: wall median {st.median(d):+.3f} s, deltas {[round(x, 2) for x in d]}; CPU median {st.median(c):+.3f} s, positive {sum(x > 0 for x in c)}/{len(c)}")
both = sorted(float(by[r][a]["wall_s"]) - float(by[r]["B"]["wall_s"]) for r in rs for a in ("H", "H2"))
print(f"H and H2 pooled against B, 16 pairs: wall median {st.median(both):+.3f} s")
def load(arm):
    t = {}
    for r in rs:
        seq = by[r][arm]["seq"]; j = json.load(open(f"{R}/json-{seq}-{arm}.json"))
        for f in j["testResults"]:
            n = f["name"].split("/src/")[-1] if "/src/" in f["name"] else f["name"].split("/tools/")[-1]
            for a in f["assertionResults"]:
                t.setdefault((n, a["fullName"]), []).append(a.get("duration") or 0)
    return {k: st.median(v) for k, v in t.items()}
b, h, h2 = load("B"), load("H"), load("H2")
new = {k: v for k, v in h.items() if k not in b}; new2 = sum(v for k, v in h2.items() if k not in b); gone = [k for k in b if k not in h]
print(f"titles: B {len(b)}, H {len(h)}, only in H {len(new)}, only in B {len(gone)}")
print(f"added titles, sum of median in-thread ms: H {sum(new.values()):.0f}, H2 {new2:.0f} (the aim is <= 90 ms)")
sh = [k for k in h if k in b]
print(f"shared titles, in-thread sum ms: B {sum(b[k] for k in sh):.0f}, H {sum(h[k] for k in sh):.0f}, H2 {sum(h2.get(k, 0) for k in sh):.0f}")
ff = {}
for k, v in new.items(): ff[k[0]] = ff.get(k[0], 0) + v
print("added ms by file:", {k: round(v) for k, v in sorted(ff.items(), key=lambda x: -x[1])[:6]})
dd = {}
for k in sh: dd[k[0]] = dd.get(k[0], 0) + h[k] - b[k]
print("shared-title change ms by file, largest:", {k: round(v) for k, v in sorted(dd.items(), key=lambda x: -abs(x[1]))[:6]})
