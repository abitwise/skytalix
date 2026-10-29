"""Unseen errors: skytalix moves after which Stockfish's eval jumps while skytalix thinks it is fine."""
import json, sys, statistics as st
from collections import Counter, defaultdict

D = json.load(open(sys.argv[1]))


def men0(fen):
    return sum(ch.isalpha() for ch in fen.split()[0])


def phase(n):
    return "open" if n >= 26 else "mid" if n >= 14 else "end"


def run(key, me="skytalix", opp="stockfish"):
    gs = D[key]["games"]
    cnt = Counter(); seen = Counter(); tot = Counter(); jumps = defaultdict(list)
    by_ply = Counter()
    games_with_unseen = 0
    lost_with_unseen = 0
    lost = 0
    first_unseen_ply = []
    for g in gs:
        men = men0(g["fen"]); mv = g["moves"]; has = False; first = None
        for i, m in enumerate(mv):
            if "x" in m["san"]:
                men -= 1
            if m["mover"] != me or m["cp"] is None or i == 0 or i + 1 >= len(mv):
                continue
            a, b = mv[i - 1], mv[i + 1]
            if a["mover"] != opp or b["mover"] != opp or a["cp"] is None or b["cp"] is None:
                continue
            if abs(a["cp"]) >= 100000 or abs(m["cp"]) >= 100000:
                continue
            ph = phase(men)
            if -150 <= a["cp"] <= 150:  # level-ish position before skytalix's move
                tot[ph] += 1
                bcp = min(b["cp"], 2000)
                if bcp - a["cp"] >= 250:
                    if m["cp"] >= -50:
                        cnt[ph] += 1; has = True
                        by_ply[min(i // 20, 9)] += 1
                        if first is None:
                            first = i
                    else:
                        seen[ph] += 1
        res = g["result"]
        l = (res == "1-0" and g["black"] == me) or (res == "0-1" and g["white"] == me)
        lost += l
        games_with_unseen += has
        lost_with_unseen += l and has
        if l and first is not None:
            first_unseen_ply.append(first)
    print(f"== {key}: level positions (SF |eval|<=150 before skytalix's move) by phase {dict(tot)}")
    print(f"   UNSEEN errors (SF +250 after, skytalix eval >= -0.5): {dict(cnt)} rate/100 "
          f"{ {k: round(100*cnt[k]/tot[k],2) for k in tot} } total {sum(cnt.values())}")
    print(f"   seen errors (skytalix already < -0.5): {dict(seen)}")
    print(f"   games with >=1 unseen error {games_with_unseen}; lost games {lost}, of which with one {lost_with_unseen}")
    print(f"   unseen errors by ply bucket (20 plies): {sorted(by_ply.items())}")


for k in ("R1", "R2"):
    run(k)
