# SCRATCH (arch-next-pull): metrics of the evaluation-lever probe, fixed before the run.
# Usage: python3 analyze_eval.py <sf.jsonl> <play47.jsonl> <play94.jsonl> <play188.jsonl>
import json, sys, statistics as st
sf = {r["id"]: r for r in map(json.loads, open(sys.argv[1]))}
plays = [{r["id"]: r for r in map(json.loads, open(f))} for f in sys.argv[2:5]]
labels = ["1x 47000", "2x 94000", "4x 188000"]
ids = [i for i in sf if all(sf[i]["loss"].get(p[i]["move"]) is not None for p in plays)]
out = {"positions": len(sf), "scored": len(ids)}
loss = {lab: [sf[i]["loss"][p[i]["move"]] for i in ids] for lab, p in zip(labels, plays)}
for lab in labels:
    L = loss[lab]
    out[lab] = {"meanLoss": round(st.mean(L), 1), "medianLoss": st.median(L), "sfBestPct": round(100 * sum(x == 0 for x in L) / len(L), 1),
                "err50": sum(x >= 50 for x in L), "err150": sum(x >= 150 for x in L), "err300": sum(x >= 300 for x in L),
                "meanDepth": round(st.mean(p[i]["depth"] for i in ids), 2)}
e1 = [k for k, i in enumerate(ids) if loss[labels[0]][k] >= 50]
out["persist"] = {"err50At1x": len(e1), "stillErr50At2x": sum(loss[labels[1]][k] >= 50 for k in e1),
                  "stillErr50At4x": sum(loss[labels[2]][k] >= 50 for k in e1)}
out["persist"]["persistShare4x"] = round(out["persist"]["stillErr50At4x"] / max(1, len(e1)), 3)
b1 = [k for k, i in enumerate(ids) if loss[labels[0]][k] >= 150]
out["persist"]["err150At1x"] = len(b1); out["persist"]["stillErr150At4x"] = sum(loss[labels[2]][k] >= 150 for k in b1)
out["doublingGain"] = {"meanLoss1to2": round(out[labels[0]]["meanLoss"] - out[labels[1]]["meanLoss"], 1),
                       "meanLoss2to4": round(out[labels[1]]["meanLoss"] - out[labels[2]]["meanLoss"], 1)}
# assessment: skytalix's 47 000-node score against Stockfish's best score (side to move), non-mate both, clamp +-1000
pairs = [(max(-1000, min(1000, plays[0][i]["score"])), max(-1000, min(1000, sf[i]["sbest"]))) for i in ids
         if abs(plays[0][i]["score"]) < 9000 and abs(sf[i]["sbest"]) < 9000]
xs, ys = [a for a, _ in pairs], [b for _, b in pairs]
mx, my = st.mean(xs), st.mean(ys)
cov = sum((a - mx) * (b - my) for a, b in pairs); vx = sum((a - mx) ** 2 for a in xs); vy = sum((b - my) ** 2 for b in ys)
slope = cov / vx if vx else 0
out["assess"] = {"n": len(pairs), "pearson": round(cov / (vx * vy) ** 0.5, 3) if vx and vy else None,
                 "maeRaw": round(st.mean(abs(a - b) for a, b in pairs), 1), "slopeSfOnSky": round(slope, 3),
                 "maeFit": round(st.mean(abs(my + slope * (a - mx) - b) for a, b in pairs), 1),
                 "signDisagreeSfAbove100": sum(1 for a, b in pairs if abs(b) >= 100 and (a > 0) != (b > 0)),
                 "sfAbove100": sum(1 for _, b in pairs if abs(b) >= 100)}
print(json.dumps(out, indent=1))
