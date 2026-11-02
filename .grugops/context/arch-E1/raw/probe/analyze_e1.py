# SCRATCH (arch-E1): the evaluation instrument's metrics (information only; arch-next-pull's metrics, per form).
# Usage: python3 analyze_e1.py <sf16 main (arch-next-pull)> <sf16-LP> <play-BASE> <play-L> <play-P>
import json, sys, statistics as st
sfA = {r["id"]: r for r in map(json.loads, open(sys.argv[1]))}
sfB = {r["id"]: r for r in map(json.loads, open(sys.argv[2]))}
plays = {f: {r["id"]: r for r in map(json.loads, open(p))} for f, p in zip(["BASE", "L", "P"], sys.argv[3:6])}
out = {"sbestEqual": sum(sfA[i]["sbest"] == sfB[i]["sbest"] and sfA[i]["best"] == sfB[i]["best"] for i in sfA), "positions": len(sfA)}
def loss(f, i):
    m = plays[f][i]["move"]
    return (sfA[i] if f == "BASE" else sfB[i])["loss"].get(m)
for f in plays:
    ids = [i for i in sfA if loss(f, i) is not None]
    L = [loss(f, i) for i in ids]
    row = {"scored": len(ids), "meanLoss": round(st.mean(L), 1), "medianLoss": st.median(L), "sfBestPct": round(100 * sum(x == 0 for x in L) / len(L), 1),
           "err50": sum(x >= 50 for x in L), "err150": sum(x >= 150 for x in L), "err300": sum(x >= 300 for x in L),
           "meanDepth": round(st.mean(plays[f][i]["depth"] for i in ids), 2)}
    for b in ("p20", "p40", "p60"):
        bi = [i for i in ids if i.endswith(b)]
        row[b] = {"n": len(bi), "err50": sum(loss(f, i) >= 50 for i in bi), "meanLoss": round(st.mean(loss(f, i) for i in bi), 1)}
    out[f] = row
for f in ("L", "P"):
    ids = [i for i in sfA if loss(f, i) is not None and loss("BASE", i) is not None]
    out[f]["vsBase"] = {"better": sum(loss(f, i) < loss("BASE", i) for i in ids), "worse": sum(loss(f, i) > loss("BASE", i) for i in ids),
                        "fixedErr50": sum(loss("BASE", i) >= 50 and loss(f, i) < 50 for i in ids), "newErr50": sum(loss("BASE", i) < 50 and loss(f, i) >= 50 for i in ids)}
print(json.dumps(out, indent=1))
