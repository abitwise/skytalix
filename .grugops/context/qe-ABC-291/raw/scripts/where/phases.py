# qe-ABC-291-where: phases of the NFR-008 runs from the runs' own files. usage: python3 -I phases.py <a8.tsv> <runs dir>
import csv, json, re, statistics as st, sys
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t")); R = sys.argv[2]
by = {}
for x in rows: by.setdefault(int(x["round"]), {})[x["arm"]] = x
rs = [r for r in sorted(by) if r >= 1 and len(by[r]) == 3 and all(by[r][a]["scored"] == "1" for a in ("B", "H", "H2"))]
ansi = re.compile(r"\x1b\[[0-9;]*m")
def unit(v, u): return float(v) * (1000 if u == "s" else 1)
def load(r, a):
    x = by[r][a]; seq = x["seq"]
    out = ansi.sub("", open(f"{R}/out-{seq}.txt").read())
    m = re.search(r"Duration\s+([\d.]+)(ms|s)\s*\(([^)]*)\)", out)
    d = {"duration": unit(m[1], m[2])}
    for p in m[3].split(","):
        q = re.match(r"\s*(\w+)\s+([\d.]+)(ms|s)", p); d[q[1]] = unit(q[2], q[3])
    d["wall"] = float(x["wall_s"]) * 1000; d["cpu"] = float(x["cpu_s"]) * 1000; d["user"] = float(x["user_s"]) * 1000; d["sys"] = float(x["sys_s"]) * 1000
    d["outer"] = d["wall"] - d["duration"]
    j = json.load(open(f"{R}/json-{seq}-{a}.json"))
    fs = j["testResults"]; t0 = j["startTime"]
    d["inthread"] = sum((t.get("duration") or 0) for f in fs for t in f["assertionResults"])
    d["slots"] = sum(f["endTime"] - f["startTime"] for f in fs)
    d["firstTest"] = min(f["startTime"] for f in fs) - t0
    d["span"] = max(f["endTime"] for f in fs) - t0
    d["tail"] = d["duration"] - d["span"]
    d["cpu_out"] = d["cpu"] - d["inthread"]
    return d
D = {(r, a): load(r, a) for r in rs for a in ("B", "H", "H2")}
keys = ["wall", "outer", "duration", "span", "tail", "firstTest", "import", "tests", "slots", "inthread", "environment", "transform", "setup", "cpu", "user", "sys", "cpu_out"]
print("rounds", rs)
print("part\tB med\tH med\tH2 med\tH-B med\tH-B mean\tH-B pos\tH2-B med\tH2-B mean\tH2-B pos\tH2-H med\tpooled med\tper-round both-less-B med")
for k in keys:
    v = {a: [D[(r, a)][k] for r in rs] for a in ("B", "H", "H2")}
    h = [D[(r, "H")][k] - D[(r, "B")][k] for r in rs]; g = [D[(r, "H2")][k] - D[(r, "B")][k] for r in rs]; t = [D[(r, "H2")][k] - D[(r, "H")][k] for r in rs]
    both = [(a + b) / 2 for a, b in zip(h, g)]
    print(f"{k}\t{st.median(v['B']):.0f}\t{st.median(v['H']):.0f}\t{st.median(v['H2']):.0f}\t{st.median(h):+.0f}\t{st.mean(h):+.0f}\t{sum(x>0 for x in h)}/8\t{st.median(g):+.0f}\t{st.mean(g):+.0f}\t{sum(x>0 for x in g)}/8\t{st.median(t):+.0f}\t{st.median(h+g):+.0f}\t{st.median(both):+.0f}")
print("\nper run")
print("round\tarm\t" + "\t".join(keys))
for r in rs:
    for a in ("B", "H", "H2"):
        print(f"{r}\t{a}\t" + "\t".join(f"{D[(r,a)][k]:.0f}" for k in keys))
