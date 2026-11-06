# qe-ABC-291-where: the split. usage: python3 -I final.py <lanes2.json> <classes.json> <a8.tsv> <runs dir>
# Worker ms unless marked. Wall identity per run: 2 x span = gaps + slots + lane end difference, so wall change = half of worker change, plus the outer and tail parts.
# Classes: C cli.test.ts; P reaches changed production (static closure, plus src/history-pane.nfr.test.ts, whose A11 row imports book.ts at run time); T tools/tune/tune.test.ts; K control, the rest.
import csv, json, math, random, re, statistics as st, sys
L = json.load(open(sys.argv[1])); CL = json.load(open(sys.argv[2])); rs = L["rounds"]; RUN = L["runs"]; R = sys.argv[4]
rows = list(csv.DictReader(open(sys.argv[3]), delimiter="\t"))
by = {}
for x in rows: by.setdefault(int(x["round"]), {})[x["arm"]] = x
ARMS = ("B", "H", "H2"); ansi = re.compile(r"\x1b\[[0-9;]*m"); strip = lambda n: re.sub(r".*/arms/[^/]+/", "", n)
def cl(f):
    c = CL["cls"][f][0]
    if f == "src/history-pane.nfr.test.ts": return "P"
    return {"1": "C", "2": "P", "4": "P", "3": "T", "5": "K"}[c]
K = {f: cl(f) for f in CL["cls"]}
T = {(r, a): {f["n"]: f for f in RUN[f"{r}|{a}"]["files"]} for r in rs for a in ARMS}
J = {(r, a): json.load(open(f"{R}/json-{by[r][a]['seq']}-{a}.json")) for r in rs for a in ARMS}
titles = {a: {(strip(f["name"]), t["fullName"]) for f in J[(rs[0], a)]["testResults"] for t in f["assertionResults"]} for a in ARMS}
added = titles["H"] - titles["B"]
def addms(r, a, cls=None):
    return sum((t.get("duration") or 0) for f in J[(r, a)]["testResults"] for t in f["assertionResults"]
               if (strip(f["name"]), t["fullName"]) in added and (cls is None or K[strip(f["name"])] == cls))
def phase(r, a):
    out = ansi.sub("", open(f"{R}/out-{by[r][a]['seq']}.txt").read()); m = re.search(r"Duration\s+([\d.]+)(ms|s)\s*\(([^)]*)\)", out)
    d = {"duration": float(m[1]) * (1000 if m[2] == "s" else 1)}
    for p in m[3].split(","):
        q = re.match(r"\s*(\w+)\s+([\d.]+)(ms|s)", p); d[q[1]] = float(q[2]) * (1000 if q[3] == "s" else 1)
    return d
P = {k: phase(*k) for k in T}
def stat(fn):
    h = [fn(r, "H") - fn(r, "B") for r in rs]; g = [fn(r, "H2") - fn(r, "B") for r in rs]; b = [(x + y) / 2 for x, y in zip(h, g)]; t = [y - x for x, y in zip(h, g)]
    return h, g, b, t
def row(name, fn, w=46):
    h, g, b, t = stat(fn)
    print(f"{name:<{w}} B {st.median(fn(r,'B') for r in rs):7.0f} | H {st.mean(h):+6.0f} (med {st.median(h):+5.0f}, {sum(x>0 for x in h)}/8) | H2 {st.mean(g):+6.0f} (med {st.median(g):+5.0f}, {sum(x>0 for x in g)}/8) | both {st.mean(b):+6.0f} se {st.stdev(b)/8**.5:4.0f} ({sum(x>0 for x in b)}/8) | wall {st.mean(b)/2:+5.0f} ms | twin sd {st.stdev(t):4.0f}")
span = lambda r, a: max(f["e"] for f in T[(r, a)].values())
sg = lambda r, a, c=None: sum(f["gap"] for n, f in T[(r, a)].items() if c is None or K[n] == c)
ss = lambda r, a, c=None: sum(f["e"] - f["s"] for n, f in T[(r, a)].items() if c is None or K[n] == c)
ed = lambda r, a: RUN[f"{r}|{a}"]["ends"][1] - RUN[f"{r}|{a}"]["ends"][0]
wall = lambda r, a: float(by[r][a]["wall_s"]) * 1000
print("WHOLE RUN, worker ms (wall column is half, except the rows marked)")
row("2 x span", lambda r, a: 2 * span(r, a))
row("gaps", sg); row("slots", ss); row("lane end difference", ed)
print("\nGAPS BY VITEST'S OWN PHASE LINE")
row("import (sum of file collect)", lambda r, a: P[(r, a)]["import"])
row("gaps less import", lambda r, a: sg(r, a) - P[(r, a)]["import"])
row("environment", lambda r, a: P[(r, a)]["environment"]); row("transform", lambda r, a: P[(r, a)]["transform"]); row("setup", lambda r, a: P[(r, a)]["setup"])
print("\nOUTSIDE THE LANES, real ms, not halved")
row("wall", wall); row("wall less vitest duration", lambda r, a: wall(r, a) - P[(r, a)]["duration"]); row("duration less span", lambda r, a: P[(r, a)]["duration"] - span(r, a))
print("\nBY CLASS")
n = {c: sum(v == c for v in K.values()) for c in "CPTK"}; print("files per class", n)
for c in "CPTK": row(f"gap {c}", lambda r, a, c=c: sg(r, a, c))
for c in "CPTK": row(f"slot {c}", lambda r, a, c=c: ss(r, a, c))
row("added rows, in-thread", lambda r, a: addms(r, a))
for c in "PT": row(f"slot {c} less added rows", lambda r, a, c=c: ss(r, a, c) - addms(r, a, c))
print("\nPER-FILE GAP, P against K")
fn = lambda r, a: sg(r, a, "P") / n["P"] - sg(r, a, "K") / n["K"]
h, g, b, t = stat(fn); print(f"P per file less K per file: H {st.mean(h):+.2f} H2 {st.mean(g):+.2f} both {st.mean(b):+.2f} ms se {st.stdev(b)/8**.5:.2f}, positive {sum(x>0 for x in b)}/8")
for c in "PK":
    h, g, b, t = stat(lambda r, a: sg(r, a, c) / n[c]); print(f"  {c} per file: both {st.mean(b):+.2f} ms se {st.stdev(b)/8**.5:.2f}")
print("\nK GAP BY PREDECESSOR ON THE LANE, mean ms per file")
for a in ARMS:
    d = {"P": [], "K": [], "other": []}
    for r in rs:
        for x, f in T[(r, a)].items():
            if K[x] == "K" and f["prev"]: d[K[f["prev"]] if K[f["prev"]] in "PK" else "other"].append(f["gap"])
    print(a, {k: (round(st.mean(v), 1), len(v)) for k, v in d.items() if v})
print("\nK SLOT BY WHETHER CLI'S START OVERLAPS, mean ms per file")
for a in ARMS:
    i, o = [], []
    for r in rs:
        c = T[(r, a)]["src/cli.test.ts"]
        for x, f in T[(r, a)].items():
            if K[x] == "K": (i if f["s"] < c["s"] else o).append(f["e"] - f["s"])
    print(a, "during", round(st.mean(i), 2), len(i), "after", round(st.mean(o), 2), len(o))
print("\nsrc/uci-session.test.ts, the +83 ms")
row("slot uci-session", lambda r, a: T[(r, a)]["src/uci-session.test.ts"]["e"] - T[(r, a)]["src/uci-session.test.ts"]["s"])
row("gap uci-session", lambda r, a: T[(r, a)]["src/uci-session.test.ts"]["gap"])
print("\nCPU, s")
for k in ("cpu_s", "user_s", "sys_s"):
    h = [float(by[r]["H"][k]) - float(by[r]["B"][k]) for r in rs]; g = [float(by[r]["H2"][k]) - float(by[r]["B"][k]) for r in rs]; b = [(x + y) / 2 for x, y in zip(h, g)]
    print(f"{k}: H {st.mean(h):+.3f} med {st.median(h):+.3f}; H2 {st.mean(g):+.3f} med {st.median(g):+.3f}; both {st.mean(b):+.3f} se {st.stdev(b)/8**.5:.3f}")
print("\nTHE FIGURES")
hw = [(wall(r, "H") - wall(r, "B")) / 1000 for r in rs]; gw = [(wall(r, "H2") - wall(r, "B")) / 1000 for r in rs]; bw = [(x + y) / 2 for x, y in zip(hw, gw)]
print(f"sd of one pair: H {st.stdev(hw):.3f} H2 {st.stdev(gw):.3f}; both-arm per-round mean {st.mean(bw):+.3f} sd {st.stdev(bw):.3f} se {st.stdev(bw)/8**.5:.3f} t {st.mean(bw)/(st.stdev(bw)/8**.5):.2f}; 95 % t(7) {st.mean(bw)-2.365*st.stdev(bw)/8**.5:+.3f} to {st.mean(bw)+2.365*st.stdev(bw)/8**.5:+.3f}")
rnd = random.Random(291); N = 200000
def boot(pool, k=8):
    m = []
    for _ in range(N):
        s = sorted(rnd.choice(pool) for _ in range(k)); m.append((s[3] + s[4]) / 2)
    m.sort(); return m
for name, pool in (("H-B", hw), ("H2-B", gw), ("16 pairs", hw + gw)):
    m = boot(pool); le = sum(x <= 0.10 + 1e-9 for x in m) / N
    print(f"bootstrap median of 8 from {name}: sd {st.pstdev(m):.3f}, 2.5-97.5 % {m[int(.025*N)]:+.3f} to {m[int(.975*N)]:+.3f}, share <= +0.10: {le:.2f}")
phi = lambda z: .5 * (1 + math.erf(z / 2 ** .5))
se = st.stdev(bw) / 8 ** .5
for c in (0.133, 0.155, 0.165, 0.175):
    print(f"centre {c:+.3f}: Architect's form, sigma 0.060: {phi((.10-c)/.06):.2f}; centre also uncertain by se {se:.3f}: sigma {math.hypot(.06,se):.3f}: {phi((.10-c)/math.hypot(.06,se)):.2f}")
