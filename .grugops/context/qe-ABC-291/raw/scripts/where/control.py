# qe-ABC-291-where: where the control class's slot and gap change sit, by file and by row. usage: python3 -I control.py <lanes2.json> <classes.json> <a8.tsv> <runs dir>
import csv, json, re, statistics as st, sys
L = json.load(open(sys.argv[1])); C = json.load(open(sys.argv[2])); cls = C["cls"]; rs = L["rounds"]; RUN = L["runs"]
rows = list(csv.DictReader(open(sys.argv[3]), delimiter="\t")); R = sys.argv[4]
by = {}
for x in rows: by.setdefault(int(x["round"]), {})[x["arm"]] = x
T = {(r, a): {f["n"]: f for f in RUN[f"{r}|{a}"]["files"]} for r in rs for a in ("B", "H", "H2")}
ctrl = [f for f in cls if cls[f].startswith("5")]
print("control files, slot: B median, H-B mean, H2-B mean, both pos of 16")
d = []
for f in ctrl:
    sl = lambda r, a: T[(r, a)][f]["e"] - T[(r, a)][f]["s"]
    h = [sl(r, "H") - sl(r, "B") for r in rs]; g = [sl(r, "H2") - sl(r, "B") for r in rs]
    d.append((st.mean(h + g), st.mean(h), st.mean(g), st.median(sl(r, "B") for r in rs), sum(x > 0 for x in h + g), f))
d.sort(reverse=True)
for x in d[:16]: print(f"{x[0]:+6.1f} H {x[1]:+6.1f} H2 {x[2]:+6.1f} B {x[3]:6.1f} pos {x[4]}/16 {x[5]}")
print("...")
for x in d[-5:]: print(f"{x[0]:+6.1f} H {x[1]:+6.1f} H2 {x[2]:+6.1f} B {x[3]:6.1f} pos {x[4]}/16 {x[5]}")
print("sum of control mean slot change", round(sum(x[0] for x in d), 1), "files with change > 0:", sum(x[0] > 0 for x in d), "of", len(d))
strip = lambda n: re.sub(r".*/arms/[^/]+/", "", n)
rowd = {}
for r in rs:
    for a in ("B", "H", "H2"):
        j = json.load(open(f"{R}/json-{by[r][a]['seq']}-{a}.json"))
        for f in j["testResults"]:
            n = strip(f["name"])
            if n not in ctrl: continue
            for t in f["assertionResults"]:
                rowd.setdefault((n, t["fullName"]), {}).setdefault(a, {})[r] = t.get("duration") or 0
out = []
for k, v in rowd.items():
    if not all(a in v and len(v[a]) == 8 for a in ("B", "H", "H2")): continue
    h = [v["H"][r] - v["B"][r] for r in rs]; g = [v["H2"][r] - v["B"][r] for r in rs]
    out.append((st.mean(h + g), st.mean(h), st.mean(g), st.median(v["B"].values()), sum(x > 0 for x in h + g), k))
out.sort(reverse=True, key=lambda x: x[0])
print("\ncontrol rows by mean change (ms)")
for x in out[:14]: print(f"{x[0]:+6.2f} H {x[1]:+6.2f} H2 {x[2]:+6.2f} B {x[3]:6.2f} pos {x[4]}/16 {x[5][0].replace('src/','')} :: {x[5][1][:90]}")
print("rows in control", len(out), "sum of mean change", round(sum(x[0] for x in out), 1))
