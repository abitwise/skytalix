# se-ABC-283-merge: a copy of qe-ABC-283's readout, plus the K0 rows. usage: python3 -I grade-offline.py <outdir>
import json, sys, os
o = sys.argv[1]
L = lambda f: [json.loads(l) for l in open(os.path.join(o, f)) if l.strip()]
kb, kh = L("k0-base.jsonl"), L("k0-head.jsonl")
print(f"K0 (ABC-271): {sum(1 for x, y in zip(kb, kh) if x == y)} / {len(kb)} rows byte-equal (main 715beb1c shipped vs merged all-off doors)")
for x, y in zip(kb, kh):
    if x != y: print("  K0 DIFF", x, y)
b, h = L("p0-base.jsonl"), L("p0-head.jsonl")
same = sum(1 for x, y in zip(b, h) if x == y)
print(f"P0: {same} / {len(b)} rows byte-equal (base main search/chooseMove vs head all-off doors; nodes, score, move, depth)")
for x, y in zip(b, h):
    if x != y: print("  P0 DIFF", x, y)
fh = {r["row"]: r for r in L("floor-head.jsonl")}; fb = {r["row"]: r for r in L("floor-base.jsonl")}
M = fh["search d5"]["mateScore"]; isM = lambda s: abs(s) > M - 1000
def viol(door, head):
    mates = v = 0; rows = []
    for i, (r, g) in enumerate(zip(door, head)):
        if not isM(r): continue
        mates += 1
        if not isM(g) or (g > 0) != (r > 0): v += 1; rows.append((i, r, g))
    return mates, v, rows
for label, door, head in [
    ("search d5 vs searchWithoutBundle d5 (head)", fh["door search d5"], fh["search d5"]),
    ("search d5 vs base main search d5", fb["search d5"], fh["search d5"]),
    ("chooseMove d5 vs chooseMoveWithoutBundle d5 (head)", fh["door choose d5"], fh["choose d5"]),
    ("chooseMove d5 vs base main chooseMove d5", fb["choose d5"], fh["choose d5"]),
    ("futility row: search d5 vs searchWithoutFutility d5", fh["futility-door d5"], fh["search d5"]),
    ("see row: search d5 vs searchWithoutSeePruning d5", fh["seepruning-door d5"], fh["search d5"]),
    ("taper row: search d5 vs searchWithoutTaper d5", fh["taper-door d5"], fh["search d5"]),
    ("taper row: search d5 vs searchWithoutTaper d4", fh["taper-door d4"], fh["search d5"]),
    ("REPORT chooseMove d6 vs chooseMoveWithoutBundle d6", fh["door choose d6"], fh["choose d6"]),
    ("REPORT chooseMove d6 vs base main chooseMove d6", fb["choose d6"], fh["choose d6"]),
    ("REPORT older form: search d5 vs base main search d4", fb["search d4"], fh["search d5"]),
]:
    m, v, rows = viol(door["scores"], head["scores"])
    print(f"floor {label}: {v} of {m} violated {[(i, r, g) for i, r, g in rows]}")
print("door==base main (all-off equals main on the corpus):", all(fh[a]["scores"] == fb[c]["scores"] for a, c in [("door search d5", "search d5"), ("door choose d5", "choose d5"), ("door choose d6", "choose d6")]))
for f in ("zug.jsonl", "g1.jsonl", "g1-base.jsonl", "ratio.jsonl", "ratio-base.jsonl"):  # drift not read (not asked)
    rows = L(f)
    if f.startswith("g1"):
        print(f, json.dumps(rows[-1]))
    else:
        for r in rows: print(f, json.dumps(r))
g1h, g1b = L("g1.jsonl")[-1], L("g1-base.jsonl")[-1]
print("G1 newly missed vs base main's own run:", sorted(set(g1h["missed"]) - set(g1b["missed"])), "newly solved:", sorted(set(g1b["missed"]) - set(g1h["missed"])))
rb = {r["ratio"]: r for r in L("ratio-base.jsonl")}
for r in L("ratio.jsonl"):
    x = rb[r["ratio"]]
    print(f"d8 ratio {r['ratio']}: search {r['search']['nodes']}/{x['search']['nodes']} = {r['search']['nodes']/x['search']['nodes']:.4f}, chooseMove {r['choose']['nodes']}/{x['choose']['nodes']} = {r['choose']['nodes']/x['choose']['nodes']:.4f}")
