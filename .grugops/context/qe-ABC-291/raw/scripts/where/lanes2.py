# qe-ABC-291-where: two-lane assignment of each scored run by least cost, not by best fit. usage: python3 -I lanes2.py <a8.tsv> <runs dir> <out json>
# census's timeline.cjs gives each file to the lane that ended latest; here that puts src/cli.test.ts's long start on the wrong lane in about half the runs and leaves
# overlaps. This one forbids overlap (one file per lane at a time) and picks the assignment nearest each file's own typical gap, iterated to a fixed point.
# A file's JSON startTime is its first row's start and endTime its last row's end, so its gap holds worker start, import, collect and any hook. Lanes are inferred, not read.
import csv, json, re, statistics as st, sys
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t")); R = sys.argv[2]; OUT = sys.argv[3]
by = {}
for x in rows: by.setdefault(int(x["round"]), {})[x["arm"]] = x
rs = [r for r in sorted(by) if r >= 1 and len(by[r]) == 3 and all(by[r][a]["scored"] == "1" for a in ("B", "H", "H2"))]
strip = lambda n: re.sub(r".*/arms/[^/]+/", "", n)
def load(r, a):
    seq = by[r][a]["seq"]; j = json.load(open(f"{R}/json-{seq}-{a}.json")); t0 = j["startTime"]
    fs = sorted(({"n": strip(f["name"]), "s": f["startTime"] - t0, "e": f["endTime"] - t0} for f in j["testResults"]), key=lambda f: f["s"])
    return fs
RUNS = {(r, a): load(r, a) for r in rs for a in ("B", "H", "H2")}
TOL = 2.0
def assign(fs, typ):
    # state: index of the last file on the other lane (-1 = lane unused); the current file i is on one lane, so state after i is (i, j)
    INF = float("inf"); n = len(fs)
    def cost(i, prev):
        end = fs[prev]["e"] if prev >= 0 else 0.0
        g = fs[i]["s"] - end
        if g < -TOL: return INF, g
        t = typ.get(fs[i]["n"], 100.0)
        return abs(g - t), g
    cur = {-1: (0.0, None)}  # other-lane last index -> (cost, back)
    # first file sits on a lane; the other lane is unused
    c0, _ = cost(0, -1); cur = {-1: (c0, None)}; hist = [cur]
    for i in range(1, n):
        nxt = {}
        for j, (c, _) in cur.items():
            # i follows i-1 on its lane: other lane stays j
            cc, _g = cost(i, i - 1)
            if c + cc < nxt.get(j, (INF,))[0]: nxt[j] = (c + cc, (j, "same"))
            # i goes on the other lane (after j): other lane's last becomes i-1
            cc, _g = cost(i, j)
            if c + cc < nxt.get(i - 1, (INF,))[0]: nxt[i - 1] = (c + cc, (j, "swap"))
        cur = nxt; hist.append(cur)
    j = min(cur, key=lambda k: cur[k][0]); tot = cur[j][0]
    prevOf = [None] * n
    for i in range(n - 1, 0, -1):
        back = hist[i][j][1]; pj, how = back
        prevOf[i] = (i - 1) if how == "same" else pj
        j = pj
    prevOf[0] = -1
    return prevOf, tot
typ = {"src/cli.test.ts": 3500.0}
for it in range(12):
    gaps = {}; res = {}
    for k, fs in RUNS.items():
        prev, tot = assign(fs, typ)
        res[k] = prev
        for i, f in enumerate(fs):
            gaps.setdefault(f["n"], []).append(f["s"] - (fs[prev[i]]["e"] if prev[i] >= 0 else 0.0))
    new = {n: st.median(v) for n, v in gaps.items()}
    ch = sum(abs(new[n] - typ.get(n, 100.0)) for n in new); typ = new
    print("iter", it, "change", round(ch, 1))
    if ch < 0.5: break
out = {}
for (r, a), fs in RUNS.items():
    prev = res[(r, a)]; lanes = {}
    for i, f in enumerate(fs):
        p = prev[i]; f["gap"] = f["s"] - (fs[p]["e"] if p >= 0 else 0.0); f["prev"] = fs[p]["n"] if p >= 0 else None
    has_next = {p for p in prev if p >= 0}
    ends = [f["e"] for i, f in enumerate(fs) if i not in has_next]
    out[f"{r}|{a}"] = {"files": fs, "ends": sorted(ends)}
json.dump({"rounds": rs, "runs": out, "typ": typ}, open(OUT, "w"))
print("lane ends per run (count must be 2):", sorted({len(v["ends"]) for v in out.values()}))
print("min gap over all runs", round(min(f["gap"] for v in out.values() for f in v["files"]), 1))
cli = {a: [round(next(f["gap"] for f in out[f"{r}|{a}"]["files"] if f["n"] == "src/cli.test.ts")) for r in rs] for a in ("B", "H", "H2")}
print("cli gap", cli)
sds = sorted(((st.stdev(v), n) for n, v in gaps.items()), reverse=True)[:8]
print("largest sd of a file's gap over 24 runs:", [(round(a), b) for a, b in sds])
