#!/usr/bin/env python3
"""qe-ABC-223 reader: grades A2-A7 of ABC-223 (`uci-clock-mode`) from the harness output dir, by the PREREG's
derivations. It is qe-ABC-222's read222.py (as fixed after its rehearsal) with the budget, the ceiling and the
mode name changed, the longest move's place in its period added, and the foreign-vitest window check added.

usage: python3 -I read223.py <out-dir>        (reads gNN.log, gNN.pgn, harness.log, thermal.log)

Per-move time, exact: cutechess-cli 1.5.1 TimeControl::update() sets timeLeft -= lastMoveTime, and at a period's
end adds the base. So for a side's k-th move (k from 1, the first move it plays from the EPD position):
    elapsed_k = own_clock(go_k) - own_clock(go_{k+1}) + (900000 if k % 40 == 0 else 0)
For a side's last move in a game (no next go) elapsed is the debug-log stamp delta ts(bestmove) - ts(go).
The PGN's per-move time is the same lastMoveTime rendered by cutechess (whole seconds at >= 10 s); it is
cross-checked against elapsed. Clock left after move k = own_clock(go_k) - elapsed_k (before any base is added).
The budget of each move is derived from its go line by ADR-0052 D4 (no engine line carries it): with a clock t for
the side to move, increment i (0 if absent) and movestogo m (20 if absent),
    C = max(1, min((t - 1000 - 100 m) / m + i, t - 1100)),  budget = min(59500, C)
(src/uci-session.ts safeClockShare / parseGo at the build under test; unrounded). Overhead = elapsed - budget.
"""
import re
import statistics as st
import sys
from pathlib import Path

CAP_MS = 59500
BASE = 900000
CEIL = 60000
MODE = "uci-clock-mode"


def budget_of(t, inc, m):
    c = max(1.0, min((t - 1000 - 100 * m) / m + inc, t - 1100))
    return min(CAP_MS, c)
out = Path(sys.argv[1])
LINE = re.compile(r"^(\d+) ([<>])(skytalix-[ab])\((\d+)\): (.*)$")
RULE = re.compile(r"(White mates|Black mates|Draw by stalemate|Draw by insufficient mating material|"
                  r"Draw by fifty moves rule|Draw by 3-fold repetition)")
CAP = re.compile(r"adjudication.*maximal game length", re.I)
TIMELOSS = re.compile(r"loses on time")


def pgn_read(path):
    text = path.read_text()
    tags = dict(re.findall(r'^\[(\w+) "(.*)"\]$', text, re.M))
    body = "\n".join(l for l in text.splitlines() if not l.startswith("["))
    toks = re.findall(r"\{[^}]*\}|[^\s{}]+", body)
    plies = []  # (san, comment or None)
    for tk in toks:
        if tk.startswith("{"):
            if plies and plies[-1][1] is None:
                plies[-1] = (plies[-1][0], tk[1:-1])
            continue
        if re.fullmatch(r"\d+\.(\.\.)?", tk) or tk in ("1-0", "0-1", "1/2-1/2", "*"):
            continue
        tk = re.sub(r"^\d+\.(\.\.)?", "", tk)
        if tk:
            plies.append((tk, None))
    return tags, plies


def pgn_secs(comment):
    if comment is None:
        return None
    m = re.search(r"(?:^|\s)(\d+(?:\.\d+)?)s(?:,|$)", comment.strip())
    return (float(m.group(1)), m.group(1)) if m else None


def precision_ok(pgn, ms):
    val, s = pgn
    dec = len(s.split(".")[1]) if "." in s else 0
    return abs(val - ms / 1000.0) <= 0.5 * 10 ** (-dec) + 1e-9


games = sorted(out.glob("g[0-9][0-9].log"))
allmoves = []
report = []
faults, timeloss, killed_after = [], 0, []
go_with = go_without = isready_during = 0
first_go = None
setopt = {}
refusals = 0
stamp_vs_exact = []
pgn_mismatch = []
period_rows = []
for glog in games:
    g = glog.stem
    tags, plies = pgn_read(out / f"{g}.pgn")
    stm = tags["FEN"].split()[1]
    color = {tags["White"]: "w", tags["Black"]: "b"}
    fin = [l for l in glog.read_text().splitlines() if l.startswith("Finished game")]
    restext = fin[0] if fin else "(no result line)"
    if TIMELOSS.search(restext):
        kind = "loss on time"
        timeloss += 1
    elif CAP.search(restext):
        kind = "move cap"
    elif RULE.search(restext):
        kind = "rule result"
    else:
        kind = "FAULT"
        faults.append((g, restext))
    ev = {"skytalix-a": [], "skytalix-b": []}
    lines = glog.read_text().splitlines()
    result_idx = next((i for i, l in enumerate(lines) if l.startswith("Finished game")), len(lines))
    for i, l in enumerate(lines):
        m = LINE.match(l)
        if not m:
            if i > result_idx and re.search(r"(terminat|kill|not responding|timeout)", l, re.I):
                killed_after.append((g, l))
            continue
        ts, d, eng, _, msg = int(m.group(1)), m.group(2), m.group(3), m.group(4), m.group(5)
        if d == ">" and msg.startswith("setoption name TimeMode"):
            setopt.setdefault(g, []).append(f"{eng}: {msg}")
        if d == "<" and "TimeMode takes" in msg:
            refusals += 1
        ev[eng].append((ts, d, msg, i))
    for eng, evs in ev.items():
        side = color[eng]
        gos, bms, inbook = [], [], []
        open_go = None
        book = False
        for ts, d, msg, i in evs:
            if d == ">" and msg.startswith("go "):
                if first_go is None:
                    first_go = f"{g} {eng}: {msg}"
                tok = msg.split()
                kv = {tok[j]: tok[j + 1] for j in range(1, len(tok) - 1)
                      if tok[j] in ("wtime", "btime", "winc", "binc", "movestogo", "movetime")}
                if "movestogo" in kv:
                    go_with += 1
                else:
                    go_without += 1
                own = int(kv["wtime" if side == "w" else "btime"])
                inc = int(kv.get("winc" if side == "w" else "binc", 0))
                mtg_v = kv.get("movestogo")
                if "movetime" in kv:
                    bud = min(int(kv["movetime"]), CAP_MS)
                else:
                    bud = budget_of(own, inc, int(mtg_v) if mtg_v else 20)
                open_go = (ts, own, mtg_v, bud)
                book = False
            elif d == ">" and msg == "isready" and open_go is not None:
                isready_during += 1
            elif d == "<" and msg == "info string book" and open_go is not None:
                book = True
            elif d == "<" and msg.startswith("bestmove") and open_go is not None:
                gos.append(open_go)
                bms.append(ts)
                inbook.append(book)
                open_go = None
        n = len(gos)
        side_plies = [p for j, p in enumerate(plies) if (j % 2 == 0) == (side == stm)]
        if len(side_plies) != n:
            report.append(f"WARN {g} {eng}: {n} go/bestmove pairs vs {len(side_plies)} PGN plies")
        rows = []
        for k in range(n):
            ts_go, clock, mtg, bud = gos[k]
            stamp = bms[k] - ts_go
            if k + 1 < n:
                exact = clock - gos[k + 1][1] + (BASE if (k + 1) % 40 == 0 else 0)
                stamp_vs_exact.append(stamp - exact)
                src = "clock"
            else:
                exact = stamp
                src = "stamp"
            if (k + 1) % 40 == 0 and mtg not in (None, "1"):
                report.append(f"WARN {g} {eng} move {k+1}: movestogo {mtg} at a period end")
            ps = pgn_secs(side_plies[k][1]) if k < len(side_plies) else None
            if ps is not None and not precision_ok(ps, exact):
                pgn_mismatch.append((g, eng, k + 1, ps[1], exact, src))
            row = dict(g=g, eng=eng, side=side, k=k + 1, clock=clock, elapsed=exact, src=src,
                       left=clock - exact, book=inbook[k], pgn=ps[1] if ps else None, mtg=mtg, budget=bud,
                       ts=ts_go)
            rows.append(row)
            allmoves.append(row)
        for p in (1, 2, 3):
            if n >= 40 * p:
                seg = rows[40 * (p - 1): 40 * p]
                used = sum(r["elapsed"] for r in seg)
                period_rows.append((g, eng, side, p, used, used / BASE, seg[-1]["left"],
                                    sum(r["book"] for r in seg)))
    report.append(f"{g}: opening FEN side {stm}; plies {len(plies)}; {kind}: {restext}")

print("== games")
for r in report:
    print(r)
print("\n== A1 setoption lines (game 1)")
for g in sorted(setopt)[:1]:
    for s in setopt[g]:
        print(" ", s)
print(f"games with both engines sent `setoption name TimeMode value {MODE}`: "
      f"{sum(1 for g in setopt if sum(('value ' + MODE) in s for s in setopt[g]) == 2)} of {len(games)}; "
      f"engine refusals `TimeMode takes`: {refusals}")
print("\n== A2")
print(f"games {len(games)}; faults {len(faults)} {faults}; engine kill/timeout lines after the result: {len(killed_after)}")
for g, l in killed_after:
    print("  ", g, l)
print("\n== A3")
lo = min(allmoves, key=lambda r: r["left"])
print(f"losses on time: {timeloss}")
print(f"closest call: {lo['left']} ms  ({lo['g']} {lo['eng']} move {lo['k']}, clock {lo['clock']}, elapsed {lo['elapsed']} [{lo['src']}])")
lows = sorted(allmoves, key=lambda r: r["left"])[:5]
print("five least:", [(r["g"], r["eng"], r["k"], r["left"]) for r in lows])
print("\n== A4 completed periods (game, engine, side, period, used ms, fraction, clock left after 40th, book moves)")
for row in period_rows:
    print(f"  {row[0]} {row[1]} {row[2]} P{row[3]}: used {row[4]} ms = {100*row[5]:.2f} %; left {row[6]} ms; book {row[7]}")
print(f"completed side-periods: {len(period_rows)}; min use "
      f"{(100*min(r[5] for r in period_rows)) if period_rows else float('nan'):.2f} %")
print("\n== A5")
hi = max(allmoves, key=lambda r: r["elapsed"])
print(f"longest move: {hi['elapsed']} ms ({hi['g']} {hi['eng']} move {hi['k']} [{hi['src']}], PGN '{hi['pgn']}s'); "
      f"budget {hi['budget']:.1f} ms; period {(hi['k'] - 1) // 40 + 1}, move {(hi['k'] - 1) % 40 + 1} of 40; "
      f"go movestogo {hi['mtg']}; book {hi['book']}; <= 60 000: {hi['elapsed'] <= CEIL}")
print("five longest:", [(r["g"], r["eng"], r["k"], r["elapsed"], round(r["budget"], 1)) for r in
                        sorted(allmoves, key=lambda r: -r["elapsed"])[:5]])
pg = [float(r["pgn"]) for r in allmoves if r["pgn"] is not None]
print(f"PGN times present {len(pg)} of {len(allmoves)}; max PGN time {max(pg) if pg else None} s; "
      f"PGN strings > 60: {sum(1 for x in pg if x > 60)}")
print(f"moves over 59 500 ms: {sum(1 for r in allmoves if r['elapsed'] > CAP_MS)}; budgets at the 59 500 cap: "
      f"{sum(1 for r in allmoves if r['budget'] >= CAP_MS)} of {len(allmoves)}; max budget "
      f"{max(r['budget'] for r in allmoves):.1f} ms")
print(f"PGN vs exact mismatches: {len(pgn_mismatch)} {pgn_mismatch[:5]}")
if stamp_vs_exact:
    print(f"stamp - exact over {len(stamp_vs_exact)} moves: min {min(stamp_vs_exact)} max {max(stamp_vs_exact)} "
          f"median {st.median(stamp_vs_exact)}")
print("\n== A6")
print("clock left after each period's 40th move:", [(r[0], r[1], f"P{r[3]}", r[6]) for r in period_rows])
print(f"go lines with movestogo {go_with}, without {go_without}; first go: {first_go}")
print(f"isready during a search: {isready_during}")
srch = [r for r in allmoves if not r["book"]]
ov = [r["elapsed"] - r["budget"] for r in srch]
fullr = [r for r in srch if r["elapsed"] >= r["budget"] - 1000]
full = [r["elapsed"] - r["budget"] for r in fullr]
print(f"moves {len(allmoves)}: book {len(allmoves) - len(srch)}, searched {len(srch)}; searched under budget - 1 000 ms "
      f"(early returns): {len(srch) - len(full)}")
if ov:
    print(f"overhead (elapsed - budget) over searched moves: median {st.median(ov):.1f} ms, max {max(ov):.1f} ms, "
          f"min {min(ov):.1f} ms")
if full:
    cl = [r["elapsed"] - r["budget"] for r in fullr if r["src"] == "clock"]
    print(f"overhead over searched moves >= budget - 1 000 ms: median {st.median(full):.1f} ms, max {max(full):.1f} ms; "
          f"exact-clock only: max {max(cl) if cl else float('nan'):.1f} ms")
pe = [r for r in allmoves if r["k"] % 40 == 0]
if pe:
    print("period-end moves (game, engine, k, clock in go, budget, elapsed, left):",
          [(r["g"], r["eng"], r["k"], r["clock"], round(r["budget"], 1), r["elapsed"], r["left"]) for r in pe])
bk = [r["elapsed"] for r in allmoves if r["book"]]
if bk:
    print(f"book moves: {len(bk)}, elapsed max {max(bk)} ms, total {sum(bk)} ms")

print("\n== A7 host (play window: first game start to last game end, harness.log)")
if not (out / "harness.log").exists():
    sys.exit(0)
H = (out / "harness.log").read_text().splitlines()
starts = [int(re.search(r" t=(\d+)", l).group(1)) for l in H if re.match(r"game \d+ start", l)]
ends = [int(re.search(r" t=(\d+)", l).group(1)) for l in H if re.match(r"game \d+ end", l)]
t0, t1 = min(starts), max(ends)
S = []
for l in (out / "thermal.log").read_text().splitlines():
    kv = dict(x.split("=", 1) for x in l.split())
    t = int(kv["t"])
    if t0 <= t <= t1:
        S.append((t, float(kv["tctl"]), int(kv["fmax"]), int(kv["fmean"]), float(kv["load1"]),
                  int(kv["vitest"]), int(kv["cutechess"])))
gaps = [b[0] - a[0] for a, b in zip(S, S[1:])]
print(f"play wall {t1 - t0} s; samples {len(S)}; largest gap {max(gaps) if gaps else None} s")
q = (t1 - t0) / 4
qs = [[s for s in S if t0 + i * q <= s[0] < t0 + (i + 1) * q + (1 if i == 3 else 0)] for i in range(4)]
f1 = st.median([s[2] for s in qs[0]])
for i, qq in enumerate(qs):
    fm = st.median([s[2] for s in qq])
    print(f"  Q{i+1}: n {len(qq)} Tctl median {st.median([s[1] for s in qq]):.1f} max {max(s[1] for s in qq):.1f}; "
          f"fmax median {fm} kHz ({100*(fm/f1-1):+.2f} % vs Q1); fmean median {st.median([s[3] for s in qq])} kHz; "
          f"load1 median {st.median([s[4] for s in qq])}")
print(f"Tctl median (all) {st.median([s[1] for s in S]):.1f}; max {max(s[1] for s in S):.1f}")
print(f"frequency fall > 5 % from Q1 in any quarter: "
      f"{any(st.median([s[2] for s in qq]) < 0.95 * f1 for qq in qs[1:])}")
print(f"samples with a foreign vitest: {sum(1 for s in S if s[5] > 0)}; with more than one cutechess-cli: "
      f"{sum(1 for s in S if s[6] > 1)}")

# PREREG section 5, A7: a loss on time, a closest call under 1 000 ms, or a move >= 59 900 ms inside a foreign
# vitest's window (a sample with vitest > 0 within 60 s of the move) leaves A3 / A5 UNRESOLVED.
gstart = {int(re.match(r"game (\d+) start", l).group(1)): int(re.search(r" t=(\d+)", l).group(1))
          for l in H if re.match(r"game \d+ start", l)}
vit_t = [s[0] for s in S if s[5] > 0]


def in_window(r):
    t = gstart[int(r["g"][1:])] + r["ts"] / 1000.0
    return any(abs(v - t) <= 60 for v in vit_t)


flag = [r for r in allmoves if (r["left"] < 1000 or r["elapsed"] >= 59900) and in_window(r)]
print(f"A3/A5 foreign-window rule: moves with left < 1 000 ms or elapsed >= 59 900 ms: "
      f"{sum(1 for r in allmoves if r['left'] < 1000 or r['elapsed'] >= 59900)}; inside a foreign vitest window: "
      f"{len(flag)}; closest call inside a window: {in_window(lo)}; longest move inside a window: {in_window(hi)}")
if (out / "foreign.log").exists():
    FL = (out / "foreign.log").read_text().splitlines()
    vl = [l for l in FL if " vitest " in l]
    bl = [l for l in FL if " busy " in l]
    print(f"foreign.log: vitest lines {len(vl)} (distinct pids {len(set(re.search(r'pid=(\d+)', l).group(1) for l in vl))}); "
          f"busy (>= 50 % of a core) lines {len(bl)}")
    for l in bl[:20]:
        print("  ", l)
