# qe-tc-depth-probe readout (PREREG section 4). usage: python3 -I analyse.py <run-dir>
import json, math, os, re, statistics as st, sys
from datetime import datetime
run = sys.argv[1]
def rows(p):
    return [json.loads(l) for l in open(p)] if os.path.exists(p) else []
def q(v, p):  # nearest-rank percentile
    v = sorted(v); return v[max(0, math.ceil(p / 100 * len(v)) - 1)] if v else None
def med(v): return st.median(v) if v else None
def busy_minutes(d):
    s = set()
    p = os.path.join(d, "busy.log")
    if os.path.exists(p):
        for l in open(p):
            if "owner=foreign" in l: s.add(re.search(r"at=(\S+)", l).group(1)[:16])
    return s
def clean(r, bm): return r["vitest"] == 0 and r["at"][:16] not in bm

b1 = os.path.join(run, "b1-search"); bm1 = busy_minutes(b1)
fresh = rows(os.path.join(b1, "fresh.jsonl"))
NAMED = {"start", "kiwipete", "position-6", "endgame-cpw3", "in-check"}
print("== R1 fresh, one process per search ==")
print(f"rows {len(fresh)}; clean {sum(clean(r, bm1) for r in fresh)}; foreign busy minutes {sorted(bm1)}")
print("budget | set | n | depth med [min-max] | nodes med | nps med | over med | over p95 | over max | engine_ms med | clean")
for b in sorted({r["budget"] for r in fresh}):
    for name, sel in [("all", lambda r: True), ("named", lambda r: r["pos"] in NAMED), ("sampled", lambda r: r["pos"] not in NAMED)]:
        R = [r for r in fresh if r["budget"] == b and sel(r)]
        d = [r["depth"] for r in R]; o = [r["over_ms"] for r in R]
        print(f"{b} | {name} | {len(R)} | {med(d)} [{min(d)}-{max(d)}] | {med([r['nodes'] for r in R]):,.0f} | {med([r['nps'] for r in R]):,.0f} | "
              f"{med(o):.2f} | {q(o, 95):.2f} | {max(o):.2f} | {med([r['engine_ms'] for r in R])} | {sum(clean(r, bm1) for r in R)}/{len(R)}")
print("per position depth at 100/250/500/1000/4000:")
for p in dict.fromkeys(r["pos"] for r in fresh):
    print(f"  {p}: " + " ".join(str(r["depth"]) for r in sorted([r for r in fresh if r["pos"] == p], key=lambda r: r["budget"])))
print("doublings: median nodes ratio vs 100 ms:", {b: round(med([r["nodes"] for r in fresh if r["budget"] == b]) / med([r["nodes"] for r in fresh if r["budget"] == 100]), 2) for b in sorted({r["budget"] for r in fresh})})

warm = rows(os.path.join(b1, "warm.jsonl"))
if warm:
    print("== R2 warm-up at 100 ms ==")
    cold = {r["pos"]: r for r in warm if r["phase"] == "cold"}; wm = {r["pos"]: r for r in warm if r["phase"] == "warm"}
    ratio = [wm[p]["nodes"] / cold[p]["nodes"] for p in cold if p in wm]
    dd = [wm[p]["depth"] - cold[p]["depth"] for p in cold if p in wm]
    print(f"positions {len(ratio)}; warm/cold nodes ratio median {med(ratio):.2f} [min {min(ratio):.2f} max {max(ratio):.2f}]; "
          f"depth diff median {med(dd)}; gain>=1 ply {sum(x >= 1 for x in dd)}; lose>=1 ply {sum(x <= -1 for x in dd)}")
    print(f"cold depth med {med([r['depth'] for r in cold.values()])}, warm depth med {med([r['depth'] for r in wm.values()])}; "
          f"cold nps med {med([r['nps'] for r in cold.values()]):,.0f}, warm nps med {med([r['nps'] for r in wm.values()]):,.0f}")
    print(f"overshoot cold med {med([r['over_ms'] for r in cold.values()]):.2f} max {max(r['over_ms'] for r in cold.values()):.2f}; "
          f"warm med {med([r['over_ms'] for r in wm.values()]):.2f} max {max(r['over_ms'] for r in wm.values()):.2f}; "
          f"clean {sum(clean(r, bm1) for r in warm)}/{len(warm)}")
    for p in cold: print(f"  {p}: cold d{cold[p]['depth']} {cold[p]['nodes']} / warm d{wm[p]['depth']} {wm[p]['nodes']}")

rep = rows(os.path.join(b1, "repeat.jsonl"))
if rep:
    print("== R3 noise, named x 3 fresh at 100 ms ==")
    for p in dict.fromkeys(r["pos"] for r in rep):
        R = [r for r in rep if r["pos"] == p]
        print(f"  {p}: depth {[r['depth'] for r in R]} nodes {[r['nodes'] for r in R]} over {[r['over_ms'] for r in R]}")

b2 = os.path.join(run, "b2-sf"); bm2 = busy_minutes(b2)
sf = rows(os.path.join(b2, "sf.jsonl"))
if sf:
    print("== R5 Stockfish 19 time to pick depth (go depth D) ==")
    print("E | level | D | n | wall p50 | p95 | max | need (p95 up to 10 ms) | ADR C1 rule max(4xp95, 500) | >100 ms | depth reached | clean")
    for E in sorted({r["E"] for r in sf}):
        R = [r for r in sf if r["E"] == E]; w = [r["wall_ms"] for r in R]; p95 = q(w, 95)
        print(f"{E} | {R[0]['level']} | {R[0]['pick_depth']} | {len(R)} | {med(w):.1f} | {p95:.1f} | {max(w):.1f} | {math.ceil(p95 / 10) * 10} | "
              f"{max(4 * p95, 500):.0f} | {sum(x > 100 for x in w)} | {sum(r['max_depth'] >= r['pick_depth'] for r in R)}/{len(R)} | {sum(clean(r, bm2) for r in R)}/{len(R)}")

def sanity(label, budget):
    d = os.path.join(run, label)
    if not os.path.exists(os.path.join(d, "s.log")): return None
    log = open(os.path.join(d, "s.log")).read().splitlines()
    pending = {}; over = []; book = 0; searched = 0; lastinfo = {}
    for l in log:
        m = re.match(r"^(\d+) ([<>])(sky-[ab])\((\d+)\): (.*)$", l)
        if not m: continue
        t, dirn, eng, _, msg = int(m.group(1)), m.group(2), m.group(3), m.group(4), m.group(5)
        if dirn == ">" and msg.startswith("go "): pending[eng] = t; lastinfo[eng] = None
        elif dirn == "<" and msg == "info string book": lastinfo[eng] = "book"
        elif dirn == "<" and msg.startswith("bestmove") and eng in pending:
            if lastinfo.get(eng) == "book": book += 1
            else: searched += 1; over.append(t - pending[eng] - budget)
            del pending[eng]
    pgn = open(os.path.join(d, "s.pgn")).read() if os.path.exists(os.path.join(d, "s.pgn")) else ""
    games = [g for g in re.split(r"\n(?=\[Event )", pgn) if g.strip()]
    res = [re.search(r'\[Result "([^"]+)"\]', g).group(1) for g in games]
    plies = [int(re.search(r'\[PlyCount "(\d+)"\]', g).group(1)) for g in games]
    term = [re.findall(r"\{([^{}]*)\}\s*(?:1-0|0-1|1/2-1/2)\s*$", g.strip()) for g in games]
    term = [t[0] if t else "" for t in term]
    forfeits = sum("on time" in t for t in term)
    ends = [datetime.fromisoformat(re.search(r'\[GameEndTime "([^ ]+) UTC"\]', g).group(1)) for g in games]
    bl = open(os.path.join(d, "block.log")).read()
    start = int(re.search(r"block start .* t=(\d+)", bl).group(1))
    last_end = max(ends).timestamp() if ends else start
    gph = 3600 * len(games) / (last_end - start) if games else 0
    hl = [l for l in open(os.path.join(d, "host.log"))] if os.path.exists(os.path.join(d, "host.log")) else []
    vit = sum(int(re.search(r"vitest=(\d+)", l).group(1)) > 0 for l in hl)
    fb = len(busy_minutes(d))
    tct = [float(re.search(r"tctl=([\d.]+)", l).group(1)) for l in hl]
    print(f"== R4 {label} (budget {budget} ms) ==")
    print(f"games {len(games)}; W/D/L (white POV) {res.count('1-0')}/{res.count('1/2-1/2')}/{res.count('0-1')}; draw ratio {res.count('1/2-1/2') / max(1, len(games)):.2f}; "
          f"plies mean {st.mean(plies) if plies else 0:.1f} [min {min(plies) if plies else 0} max {max(plies) if plies else 0}]; time forfeits (cutechess) {forfeits}")
    print(f"terminations: {dict((t, term.count(t)) for t in set(term))}")
    print(f"moves: searched {searched}, book {book}; overshoot med {med(over)} p99 {q(over, 99)} max {max(over) if over else None} ms; "
          + "; ".join(f">{m} ms: {sum(x > m for x in over)}" for m in (0, 10, 25, 50, 100)))
    print(f"block start -> last game end {last_end - start:.0f} s; games/hour {gph:.1f}; mean s/game {(last_end - start) / max(1, len(games)):.1f}")
    print(f"host samples {len(hl)}; with foreign vitest {vit}; foreign busy minutes {fb}; Tctl median {med(tct)} max {max(tct) if tct else None}; "
          f"CAPPED {'CAP at' in bl}; THERMAL {'THERMAL' in bl}")
    return len(games), res.count("1/2-1/2"), gph
s1 = sanity("b3-sanity-100", 100); s2 = sanity("b4-sanity-500", 500)
if s1 and s2:
    print(f"pooled draw ratio {(s1[1] + s2[1]) / (s1[0] + s2[0]):.3f}; gph 100 {s1[2]:.1f}; gph 500 {s2[2]:.1f}")
allh = os.path.join(run, "all-host.log")
if os.path.exists(allh):
    t = [float(re.search(r"tctl=([\d.]+)", l).group(1)) for l in open(allh)]
    print(f"== host, probe-wide: samples {len(t)}; Tctl median {med(t)} max {max(t)} ==")
