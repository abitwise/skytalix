# qe-ABC-291-where: does a file's gap rise follow the file, or the file before it on the lane? usage: python3 -I cells.py <lanes2.json> <classes.json>
# A gap holds the previous file's teardown as well as this file's start. Each gap is taken less that file's own mean over all 24 runs, so which files land in a cell does not move the cell.
import json, statistics as st, sys
L = json.load(open(sys.argv[1])); CL = json.load(open(sys.argv[2])); rs = L["rounds"]; RUN = L["runs"]; ARMS = ("B", "H", "H2")
def cl(f):
    if f == "src/history-pane.nfr.test.ts": return "P"
    return {"1": "C", "2": "P", "4": "P", "3": "T", "5": "K"}[CL["cls"][f][0]]
K = {f: cl(f) for f in CL["cls"]}
T = {(r, a): RUN[f"{r}|{a}"]["files"] for r in rs for a in ARMS}
own = {}
for v in T.values():
    for f in v: own.setdefault(f["n"], []).append(f["gap"])
own = {k: st.mean(v) for k, v in own.items()}
cells = [("P", "P"), ("P", "K"), ("K", "P"), ("K", "K")]
def cell(r, a, c):
    x = [f["gap"] - own[f["n"]] for f in T[(r, a)] if f["prev"] and K[f["n"]] == c[0] and K[f["prev"]] == c[1]]
    return (sum(x), len(x))
print("cell = this file's class, previous file's class on the lane; mean residual ms per file, per-round; count per run")
tot = {}
for c in cells:
    d = {a: [cell(r, a, c) for r in rs] for a in ARMS}
    m = {a: [s / n if n else 0 for s, n in d[a]] for a in ARMS}
    b = [(x + y) / 2 - z for x, y, z in zip(m["H"], m["H2"], m["B"])]
    h = [x - z for x, z in zip(m["H"], m["B"])]; g = [x - z for x, z in zip(m["H2"], m["B"])]
    n = st.mean(x[1] for a in ARMS for x in d[a])
    print(f"file {c[0]} after {c[1]}: n/run {n:.1f}; H-B {st.mean(h):+.2f} H2-B {st.mean(g):+.2f} both {st.mean(b):+.2f} se {st.stdev(b)/8**.5:.2f} pos {sum(x>0 for x in b)}/8; worker ms at that count {st.mean(b)*n:+.0f}")
    tot[c] = b
ef = [(tot[("P", "P")][i] + tot[("K", "P")][i] - tot[("P", "K")][i] - tot[("K", "K")][i]) / 2 for i in range(8)]
ff = [(tot[("P", "P")][i] + tot[("P", "K")][i] - tot[("K", "P")][i] - tot[("K", "K")][i]) / 2 for i in range(8)]
print(f"effect of a P predecessor, ms per following file: {st.mean(ef):+.2f} se {st.stdev(ef)/8**.5:.2f} pos {sum(x>0 for x in ef)}/8")
print(f"effect of being a P file, ms per file: {st.mean(ff):+.2f} se {st.stdev(ff)/8**.5:.2f} pos {sum(x>0 for x in ff)}/8")
k = lambda r, a, side: sum(f["gap"] if side == "gap" else f["e"] - f["s"] for f in T[(r, a)] if K[f["n"]] == "K")
tw = []
for r in rs:
    x = [k(r, a, "gap") + k(r, a, "slot") for a in ARMS]; tw.append(((x[1] + x[2]) / 2 - x[0]) / 2)
print(f"control gap + slot, wall ms: both {st.mean(tw):+.1f} se {st.stdev(tw)/8**.5:.1f}")
