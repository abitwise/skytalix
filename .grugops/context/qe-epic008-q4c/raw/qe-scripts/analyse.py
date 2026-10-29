"""qe-epic008-q4c: sampler fields tctl= (0.1 C). QE-owned independent analysis of one ABC-204 reading (qe-ABC-204 analyse.py; qe-epic008-close: Linux sampler fields,
foreign cutechess counted with foreign vitest, load-free figure added).
usage: python3 -I analyse.py <reading-dir> <mode r|d> <openings.epd> [E]
Reads <dir>/out/<mode>.out, <mode>.pgn, and <dir>/mon/sampler.log. Prints a report and writes <dir>/qe-analysis.json.
"""
import json, math, re, statistics, sys
from datetime import datetime, timedelta, timezone

d, mode, epd_path = sys.argv[1], sys.argv[2], sys.argv[3]
E = int(sys.argv[4]) if len(sys.argv) > 4 else None
out = f"{d}/out"
outtxt = open(f"{out}/{mode}.out", encoding="utf-8", errors="replace").read().split("\n")
pgntxt = open(f"{out}/{mode}.pgn", encoding="utf-8").read()
epd = [l for l in open(epd_path).read().split("\n") if l]
rep = {}

# ---------- elo.cpp (cutechess 1.5.1) re-implemented ----------
def erf_inv(x):  # cutechess elo.cpp Elo::erfInv, verbatim constants (pi truncated as in the source)
    pi = 3.1415926535897
    a = 8.0 * (pi - 3.0) / (3.0 * pi * (4.0 - pi))
    y = math.log(1.0 - x * x)
    z = 2.0 / (pi * a) + y / 2.0
    ret = math.sqrt(math.sqrt(z * z - y / a) - z)
    return -ret if x < 0.0 else ret
def phi_inv(p):
    return math.sqrt(2.0) * erf_inv(2.0 * p - 1.0)
def elo_of(p):
    if p <= 0: return -math.inf
    if p >= 1: return math.inf
    return -400.0 * math.log10(1.0 / p - 1.0)
def elo(w, l, dr):
    n = w + l + dr
    if n == 0: return None
    mu = (w + dr / 2) / n
    sd = math.sqrt((w / n) * (1 - mu) ** 2 + (l / n) * (0 - mu) ** 2 + (dr / n) * (0.5 - mu) ** 2) / math.sqrt(n)
    lo, hi = mu + phi_inv(0.025) * sd, mu + phi_inv(0.975) * sd
    try: err = (elo_of(hi) - elo_of(lo)) / 2
    except Exception: err = float("nan")
    los = 100 * 0.5 * (1 + math.erf(((w - l) / math.sqrt(w + l)) / math.sqrt(2))) if w + l else float("nan")
    return {"n": n, "W": w, "L": l, "D": dr, "score": mu, "X": elo_of(mu), "Y": err, "LOS": los, "draw_ratio": 100 * dr / n}

# ---------- PGN ----------
games = []
for chunk in re.split(r"\n(?=\[Event )", pgntxt.strip()):
    tags = dict(re.findall(r'^\[(\w+) "(.*)"\]$', chunk, re.M))
    body = re.sub(r"^\[.*\]$", "", chunk, flags=re.M)
    toks = re.findall(r"\{[^}]*\}|[^\s{}]+", body)
    side = tags.get("FEN", "x w").split()[1]
    moves = []  # (mover, san, comment or None)
    for t in toks:
        if re.fullmatch(r"\d+\.+", t) or t in ("1-0", "0-1", "1/2-1/2", "*"): continue
        if t.startswith("{"):
            if moves and moves[-1][2] is None: moves[-1] = (moves[-1][0], moves[-1][1], t)
            continue
        mover = tags["White"] if side == "w" else tags["Black"]
        moves.append((mover, t, None)); side = "b" if side == "w" else "w"
    def ptime(s):  # "2026-10-24T00:13:20.336 GMT+3"
        m = re.match(r"(\S+) (?:GMT([+-]\d+)|UTC)$", s)  # this host writes "... UTC"; the previous one "... GMT+3"
        return datetime.fromisoformat(m.group(1)).replace(tzinfo=timezone(timedelta(hours=int(m.group(2) or 0))))
    h, mi, s_ = map(int, tags["GameDuration"].split(":"))
    games.append({"round": int(tags["Round"]), "white": tags["White"], "black": tags["Black"], "result": tags["Result"],
                  "fen": tags.get("FEN"), "plies": int(tags["PlyCount"]), "dur": h * 3600 + mi * 60 + s_,
                  "start": ptime(tags["GameStartTime"]), "end": ptime(tags["GameEndTime"]), "moves": moves})
rep["pgn_games"] = len(games)

# ---------- .out: started/finished, faults, gaps, book ----------
started, finished = {}, {}
for l in outtxt:
    m = re.match(r"^Started game (\d+) of (\d+) \((.+) vs (.+)\)$", l)
    if m: started[int(m.group(1))] = (m.group(3), m.group(4))
    m = re.match(r"^Finished game (\d+) \((.+) vs (.+)\): (\S+) \{(.*)\}$", l)
    if m: finished[int(m.group(1))] = (m.group(2), m.group(3), m.group(4), m.group(5))
rep["started"], rep["finished"] = len(started), len(finished)
texts = {}
for v in finished.values(): texts[v[3]] = texts.get(v[3], 0) + 1
rep["result_texts"] = texts
fault_re = re.compile(r"loses on time|Draw by timeout|illegal move|disconnects|Draw by disconnection|connection stalls|stalled connection|No result|Result error")
rep["fault_games"] = sorted(k for k, v in finished.items() if fault_re.search(v[3]))
rep["out_fault_lines"] = [l for l in outtxt if re.search(r"illegal|stall|disconnect|loses on time|[Tt]ime ?forfeit|Terminating process|crash", l) and not l.startswith(("...", "Elo", "SPRT"))][:20]

go, gaps, book = {}, {}, {}
pending_book = {}
first_go = {}
for l in outtxt:
    m = re.match(r"^(\d+) ([<>])(\S+)\((\d+)\): (.*)$", l)
    if not m: continue
    t, dirn, name, idx, msg = int(m.group(1)), m.group(2), m.group(3), m.group(4), m.group(5)
    key = (name, idx)
    if dirn == ">" and msg.startswith("go "):
        go[key] = t; pending_book[key] = False
        first_go.setdefault(name, l)
    elif dirn == "<" and msg == "info string book":
        pending_book[key] = True
    elif dirn == "<" and msg.startswith("bestmove") and key in go:
        g = t - go.pop(key)
        b = pending_book.pop(key, False)
        gaps.setdefault(name, {"searched": [], "book": []})["book" if b else "searched"].append(g)
rep["first_go_raw"] = first_go
budget = {}
for name in gaps:
    m = re.search(rf"^\d+ >{re.escape(name)}\(\d+\): go movetime (\d+)$", "\n".join(outtxt), re.M)
    budget[name] = int(m.group(1)) if m else None
rep["gaps"] = {}
for name, g in gaps.items():
    s = g["searched"]; B = budget[name]
    rep["gaps"][name] = {"budget_ms": B, "searched_n": len(s), "book_n": len(g["book"]),
                         "median": statistics.median(s) if s else None, "max": max(s) if s else None,
                         f"over_{B+31}": sum(1 for x in s if x > B + 31), f"over_{B}": sum(1 for x in s if x > B),
                         "p99": sorted(s)[int(0.99 * (len(s) - 1))] if s else None}

# PGN view of book moves: skytalix moves with no comment
pgn_nocomment = {}
for g in games:
    for mover, san, c in g["moves"]:
        if c is None: pgn_nocomment[mover] = pgn_nocomment.get(mover, 0) + 1
rep["pgn_moves_without_comment"] = pgn_nocomment

# ---------- [FEN] colour pairs ----------
by_round = {}
for g in games: by_round.setdefault(g["round"], []).append(g)
bad_pairs = []
for r, gs in sorted(by_round.items()):
    want = epd[(r - 1) % len(epd)]
    ok = len(gs) == 2 and gs[0]["fen"] == gs[1]["fen"] and gs[0]["white"] == gs[1]["black"] and gs[0]["black"] == gs[1]["white"] \
         and gs[0]["fen"].split()[:3] == want.split()[:3] \
         and (gs[0]["fen"].split()[3] == want.split()[3] or gs[0]["fen"].split()[3] == "-")
    if not ok: bad_pairs.append(r)
started_ok = all(started.get(2 * k - 1, ("a", "b")) == tuple(reversed(started.get(2 * k, ("x", "y")))) for k in range(1, len(started) // 2 + 1))
ep_norm = sum(1 for r, gs in by_round.items() if epd[(r - 1) % len(epd)].split()[3] != "-" and gs[0]["fen"].split()[3] == "-")
incomplete = [r for r, gs in by_round.items() if len(gs) != 2]
rep["fen_pairs"] = {"rounds": len(by_round), "bad_rounds": bad_pairs, "incomplete_rounds": incomplete, "ep_square_dropped_by_cutechess_rounds": ep_norm, "started_2k-1_2k_swapped": started_ok}

# ---------- depth guard (R) ----------
if mode == "r":
    e = (E - 1320) / (3190 - 1320)
    level = min(19, max(0, ((37.2473 * e - 40.8525) * e + 22.2943) * e - 0.311438))
    floor = 1 + int(level)
    n = miss = 0; mind = 99
    for g in games:
        for mover, san, c in g["moves"]:
            if mover != "stockfish": continue
            n += 1
            m = re.match(r"\{[+-]?M?[\d.]+/(\d+)", c or "")
            if not m or int(m.group(1)) < floor: miss += 1
            if m: mind = min(mind, int(m.group(1)))
    rep["depth_guard"] = {"E": E, "level": level, "floor": floor, "stockfish_moves": n, "misses": miss, "min_depth": mind}

# ---------- score from candidate/first-engine view ----------
first = "skytalix"
def wld(gs):
    w = l = dr = 0
    for g in gs:
        if g["result"] == "1/2-1/2": dr += 1
        elif (g["result"] == "1-0") == (g["white"] == first): w += 1
        else: l += 1
    return w, l, dr
rep["elo_all_qe"] = elo(*wld(games))
eline = [l for l in outtxt if l.startswith("Elo difference:")]
sline = [l for l in outtxt if l.startswith("Score of ")]
rep["cutechess_elo_line_raw"] = eline[-1] if eline else None
rep["cutechess_score_line_raw"] = sline[-1] if sline else None
rep["one_result_line_raw"] = next((l for l in outtxt if l.startswith("Finished game")), None)
caps = sum(1 for v in finished.values() if v[3].startswith("Draw by adjudication"))
rep["move_cap_draws"] = caps

# ---------- wall ----------
durs = [g["dur"] for g in games]
rep["wall"] = {"median_game_s": statistics.median(durs), "mean_game_s": statistics.mean(durs), "min": min(durs), "max": max(durs),
               "median_plies": statistics.median(g["plies"] for g in games),
               "first_start": min(g["start"] for g in games).astimezone(timezone.utc).isoformat(),
               "last_end": max(g["end"] for g in games).astimezone(timezone.utc).isoformat()}
msd = [(g["end"] - g["start"]).total_seconds() for g in games]
rep["wall"]["median_game_s_from_start_end_ms"] = statistics.median(msd)
rep["wall"]["duration_tag_vs_start_end_max_abs_diff_s"] = max(abs(a - b) for a, b in zip(durs, msd))
span = (max(g["end"] for g in games) - min(g["start"] for g in games)).total_seconds()
rep["wall"]["match_span_s"] = span
rep["wall"]["games_per_hour_measured"] = len(games) / (span / 3600)

# ---------- overlap with foreign vitest / load ----------
samples = []
try:
    for l in open(f"{d}/mon/sampler.log"):
        m = re.match(r"(\S+Z) load1=(\S+) power=(\S+) tctl=(\S+) vitest=(\d+) cutechess_foreign=(\d+)", l)
        if m: samples.append((datetime.fromisoformat(m.group(1).replace("Z", "+00:00")), float(m.group(2)), m.group(3), m.group(4), int(m.group(5)), int(m.group(6))))
except FileNotFoundError: pass
rep["samples"] = len(samples)
if samples:
    rep["sampler"] = {"load1_min": min(s[1] for s in samples), "load1_max": max(s[1] for s in samples),
                      "load1_median": statistics.median(s[1] for s in samples),
                      "power": sorted({s[2] for s in samples}),
                      "tctl_C": {"min": min(float(s[3]) for s in samples if s[3] != "?"), "median": statistics.median(float(s[3]) for s in samples if s[3] != "?"), "max": max(float(s[3]) for s in samples if s[3] != "?")} if any(s[3] != "?" for s in samples) else None,
                      "vitest_samples": sum(1 for s in samples if s[4] > 0), "cutechess_foreign_samples": sum(1 for s in samples if s[5] > 0),
                      "load_gt8_samples": sum(1 for s in samples if s[1] > 8)}
    # burst windows: contiguous vitest>0 samples, padded 10 s each side (one sample period)
    pad = timedelta(seconds=10)
    bursts, cur = [], None
    for t, l1, p, th, v, cf in samples:
        if v > 0 or cf > 0:
            cur = [t, t] if cur is None else [cur[0], t]
        elif cur is not None:
            bursts.append(cur); cur = None
    if cur: bursts.append(cur)
    rep["foreign_bursts"] = [[a.isoformat(), b.isoformat()] for a, b in bursts]
    def overlaps(g):
        return any(g["start"] <= b + pad and g["end"] >= a - pad for a, b in bursts)
    clean = [g for g in games if not overlaps(g)]
    rep["overlap_games"] = len(games) - len(clean)
    rep["elo_clean_qe"] = elo(*wld(clean)) if clean else None
    rep["wall_clean_median_s"] = statistics.median(g["dur"] for g in clean) if clean else None
    rep["wall_clean_median_s_ms"] = statistics.median((g["end"] - g["start"]).total_seconds() for g in clean) if clean else None
    rep["overlap_game_rounds"] = sorted({g["round"] for g in games if overlaps(g)})
    # load>8 overlap too (reported)
    hi = [s[0] for s in samples if s[1] > 8]
    touch = [g for g in games if any(g["start"] - pad <= t <= g["end"] + pad for t in hi)]
    rep["games_touching_load_gt8"] = len(touch)
    rep["load_gt8_game_rounds"] = sorted({g["round"] for g in touch})
    lfree = [g for g in games if g not in touch]
    rep["elo_load_free_qe"] = elo(*wld(lfree)) if lfree else None
    both = [g for g in clean if g not in touch]
    rep["elo_overlap_and_load_free_qe"] = elo(*wld(both)) if both else None

json.dump(rep, open(f"{d}/qe-analysis.json", "w"), indent=1, default=str)
for k, v in rep.items():
    print(f"{k}: {json.dumps(v, default=str)}")
