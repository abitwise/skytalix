"""Host speed from the debug logs: per-move nps of skytalix and of Stockfish, by reading and by quarter."""
import json, sys, statistics as st

D = json.load(open(sys.argv[1]))


def q(v):
    v = sorted(v)
    n = len(v)
    return v[int(0.1 * n)], v[n // 2], v[int(0.9 * n)]


for key in ("R1", "R2", "D"):
    info = D[key]["info"]
    for name, recs in info.items():
        nps = [r["nps"] for r in recs if "nps" in r and r.get("time", 0) >= 400]
        nodes = [r["nodes"] for r in recs if "nodes" in r and r.get("time", 0) >= 400]
        n = len(nps)
        quarters = [nps[i * n // 4:(i + 1) * n // 4] for i in range(4)]
        p10, p50, p90 = q(nps)
        print(f"{key:3s} {name:9s} moves {n:5d} nps p10 {p10:8d} median {p50:8d} p90 {p90:8d} | "
              f"median by quarter {[int(st.median(x)) for x in quarters]} | nodes median {int(st.median(nodes))}")
        # slow-core share: nps below 70 % of the reading's median
        slow = sum(x < 0.7 * p50 for x in nps)
        print(f"     moves below 70 % of median nps: {slow} ({100*slow/n:.1f} %)")
