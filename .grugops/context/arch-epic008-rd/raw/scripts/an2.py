"""R1 vs R2: where skytalix's errors fall (Stockfish's eval as the judge), eval bias, depth by phase."""
import json, math, sys, statistics as st
from collections import Counter, defaultdict

D = json.load(open(sys.argv[1]))
CAP = 10000  # clamp mate scores


def clamp(v):
    return max(-CAP, min(CAP, v))


def pieces_in_fen(fen):
    return sum(ch.isalpha() for ch in fen.split()[0])


def phase(npieces):
    # by men on board
    if npieces >= 26:
        return "opening(>=26 men)"
    if npieces >= 14:
        return "middlegame(14-25)"
    return "endgame(<=13)"


def analyse(key, me="skytalix", opp="stockfish"):
    gs = D[key]["games"]
    blunders = Counter()       # by phase: count of skytalix moves with SF jump >= T
    moves_by_phase = Counter()
    bias = defaultdict(list)   # skytalix eval + SF next eval (both clamped), by phase
    depth = defaultdict(list)
    turning = Counter()        # phase at which a lost game turned (SF eval >= +300 for good)
    turning_ply = []
    per_game_bl = []
    T = 150
    for g in gs:
        men = pieces_in_fen(g["fen"])
        mv = g["moves"]
        nbl = 0
        for i, m in enumerate(mv):
            if "x" in m["san"]:
                men -= 1
            ph = phase(men)
            if m["mover"] != me or m["cp"] is None:
                continue
            moves_by_phase[ph] += 1
            depth[ph].append(m["depth"])
            # SF eval before (at i-1, SF to move) and after (at i+1)
            if i >= 1 and i + 1 < len(mv):
                a, b = mv[i - 1], mv[i + 1]
                if a["mover"] == opp and b["mover"] == opp and a["cp"] is not None and b["cp"] is not None:
                    if abs(a["cp"]) < 100000 and abs(b["cp"]) < 100000:
                        jump = b["cp"] - a["cp"]
                        if jump >= T and a["cp"] < 300:
                            blunders[ph] += 1
                            nbl += 1
                if b["mover"] == opp and b["cp"] is not None:
                    bias[ph].append(clamp(m["cp"]) + clamp(b["cp"]))
        per_game_bl.append(nbl)
        # turning point of a lost game
        res = g["result"]
        lost = (res == "1-0" and g["black"] == me) or (res == "0-1" and g["white"] == me)
        if lost:
            men = pieces_in_fen(g["fen"])
            tp = None
            for i, m in enumerate(mv):
                if "x" in m["san"]:
                    men -= 1
                if m["mover"] == opp and m["cp"] is not None:
                    if m["cp"] >= 300:
                        if tp is None:
                            tp = (i, phase(men))
                    else:
                        tp = None
            if tp:
                turning[tp[1]] += 1
                turning_ply.append(tp[0])
    print(f"== {key}")
    print("  skytalix searched moves by phase:", dict(moves_by_phase))
    print(f"  SF-judged skytalix errors (jump >= {T} cp, from < +300):", dict(blunders),
          f"total {sum(blunders.values())}, per 100 moves:",
          {k: round(100 * blunders[k] / moves_by_phase[k], 2) for k in moves_by_phase})
    print("  lost games: phase where SF's eval went >= +300 for good:", dict(turning),
          "turn ply median", st.median(turning_ply) if turning_ply else None)
    for ph in sorted(bias):
        b = bias[ph]
        print(f"  eval bias (skytalix + SF-next, cp, + = skytalix optimistic) {ph}: n={len(b)} "
              f"median {st.median(b):+.0f} mean {st.mean(b):+.1f}; depth mean {st.mean(depth[ph]):.2f}")
    return blunders, moves_by_phase


r1 = analyse("R1")
r2 = analyse("R2")

# D: candidate vs base depth and eval agreement by phase
gs = D["D"]["games"]
dep = defaultdict(list)
for g in gs:
    men = pieces_in_fen(g["fen"])
    for m in g["moves"]:
        if "x" in m["san"]:
            men -= 1
        if m["depth"] is not None:
            dep[(m["mover"], phase(men))].append(m["depth"])
print("== D depth by phase:", {k: (len(v), round(st.mean(v), 2)) for k, v in sorted(dep.items())})
