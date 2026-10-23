#!/usr/bin/env python3
# security-nfr-timing-2026-10-23 (ABC-200 N8-LANE) grading copy of qe-timing-ABC-178 readout174a.py (sha256 10a6e19be741), fixed
# BEFORE any reading. ONE change: T1. a round whose thermal_before/thermal_after is not 0 is KEPT and FLAGGED (the brief:
# "thermal kept and flagged"); the therm column still prints on every row, and a thermal summary line is printed. Every other
# rule (status, counts incl. the registered "multi" R5, n = 8, k, R, A1 admissibility, the 650 ms bound and the state ladder) is
# byte-for-byte readout174a.py.
#!/usr/bin/env python3
# qe-ABC-177-timing-2 amended copy (owner amendment b87c35b6, fixed BEFORE any timing-2 reading). ONE change: the 'foreign'
# and 'sampler' discard reasons are LOGGED, not discarded (foreign_b/foreign_a/sampler_bad still print on every row). Every
# other rule (status, counts, thermal, n = 8, k, R, A1 admissibility, the bound) is byte-for-byte the registered file.
# qe-ABC-174 N8-LANE readout: a copy of qe-ABC-173/probe/readout173.py with ONE change, fixed before the readings were read:
#   R6. The sampler is qe-ABC-174/probe/sampler174.mjs (columns utc, load1, user_procs, foreign, lines). A sample is bad when
#       its "foreign" count is not 0 (any vitest, oeselg-labs/platform, other-hop harness/worktree/probe not descended from
#       the driver). The bracket log prints load1, user_procs and foreign. Every other rule is unchanged.
# qe-ABC-173 N8-LANE readout: a copy of qe2-ABC-101/probe/readout-n8.py with ONE change:
#   R5. A 4th argument "multi" reads a MULTI-FILE narrow set whose row count the ticket moves (ABC-173 modifies 5 test files and
#       adds rows to 2): expected counts are B = T = (B's ROUND-0 files, B's ROUND-0 tests) and H = (H's ROUND-0 files and tests);
#       round 0 must read B = T. Every other rule (A1 admissibility, n/k/R, discard reasons, the 650 ms CPU ladder) is unchanged.
#!/usr/bin/env python3
# qe-ABC-101 N8-LANE readout: a copy of qe-n8-ABC-095/probe/readout-n8r.py (sha256 6804201f...3b65) with ONE change, fixed in
# qe-ABC-101/probe/preregistration.txt BEFORE window 1 (everything else is byte-for-byte that file):
#   R4. A 4th argument "changed" reads a CHANGED file whose row count the ticket moves (ABC-101 adds rows to src/cli.test.ts):
#       expected counts are B = T = (1 file, B's ROUND-0 count) and H = (1 file, H's ROUND-0 count); round 0 must read B = T and
#       1 file in every arm. Without it (and without "added"), the original rule holds: B, T and H read the same count.
# Usage: python3 -I readout-n8.py <window dir> <tag> <F seconds | 16pct> [added|changed]
#
# ---- the qe-n8-ABC-095 header follows ----
# qe-n8-ABC-095 N8-LANE re-read readout: a copy of qe-ABC-095/probe/readout-n8.py (sha256 f9492ecb...4d93d) with THREE
# changes, fixed in qe-n8-ABC-095/probe/preregistration.txt BEFORE window 1 (everything else, the A1 admissibility, n/k/R,
# the grade ladder at 650 ms CPU and every other discard rule, is byte-for-byte the original):
#   R1. POWER IS LOGGED, NOT A VOID CLAUSE (the brief of 2026-10-12): the "power" discard reason and the sampler's
#       "not AC" condition are removed. Both power columns are still printed on every row.
#   R2. A 4th argument "added" reads an ADDED file against the one-assertion placeholder (ADR-0035 decision 2): expected
#       counts are B = T = (1 file, 1 test) and H = (1 file, H's ROUND-0 count). Without it, the original rule holds.
#   R3. A bracket log, printed, deciding nothing: for every lane round, the last sampler row at or before the round's
#       first run and the first sampler row at or after its last run's end (load1, thermal, power, foreign, platform).
# Usage: python3 -I readout-n8r.py <window dir> <tag> <F seconds | 16pct> [added]
#
# ---- the original header follows ----
# qe-ABC-095 N8-LANE readout. A copy of qe-ABC-154/probe/readout-qe5.py (same discard rules, n/k/R, A1 admissibility,
# grade ladder at 650 ms CPU). Changes, fixed in preregistration.txt BEFORE window 1:
#   1. Arguments: <window dir> <tag> <F>, where F is the per-set floor in seconds, or "16pct" for the provisional
#      16 % of the window's own B CPU median (ADR-0035 decision 3 amendment, a set with no 4.1 reading).
#   2. Expected counts: files 1 in every arm; tests = the count each arm read in ROUND 0, and B, T and H must read the
#      same count (the ticket adds 0 rows to src/cli.test.ts and 0 default-lane rows to src/cli.real-engine.test.ts).
# Usage: python3 -I readout-n8.py <window dir> <tag> <F seconds | 16pct>
import csv, math, statistics, sys
from datetime import datetime, timedelta
from fractions import Fraction as Fr

D = sys.argv[1]
BOUND = 65  # 650 ms CPU, in centiseconds
TAG = sys.argv[2]
F_ARG = sys.argv[3]
ADDED = len(sys.argv) > 4 and sys.argv[4] == "added"   # R2
CHANGED = len(sys.argv) > 4 and sys.argv[4] == "changed"   # R4
MULTI = len(sys.argv) > 4 and sys.argv[4] == "multi"   # R5
TICK = 1    # one 10 ms tick, in centiseconds
rows = list(csv.DictReader(open(f"{D}/{TAG}.tsv"), delimiter="\t"))
samp = list(csv.DictReader(open(f"{D}/sampler.tsv"), delimiter="\t"))
P = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))
cs = lambda s: int(round(float(s) * 100))


def foreign_overlap(r):
    t0 = P(r["utc"]) - timedelta(seconds=5)
    t1 = P(r["utc"]) + timedelta(seconds=float(r["wall"]) + 5)
    bad = [s for s in samp if t0 <= P(s["utc"]) <= t1 and s["foreign"] != "0"]  # R6
    return len(bad)


r0 = {r["cond"]: (int(r["files"]), int(r["tests"])) for r in rows if r["round"] == "0"}
if ADDED:  # R2: placeholder base and twin read 1 file / 1 test; H reads its own round-0 count
    if not (r0.get("B") == r0.get("T") == (1, 1) and r0.get("H", (0, 0))[0] == 1):
        print(f"ROUND-0 COUNTS DISAGREE {r0}: every round is discarded on counts")
    exp = {"B": (1, 1), "T": (1, 1), "H": (1, r0.get("H", (1, -1))[1])}
elif MULTI:  # R5
    if not (r0.get("B") == r0.get("T")):
        print(f"ROUND-0 COUNTS DISAGREE {r0}: every round is discarded on counts")
    exp = {"B": r0.get("B"), "T": r0.get("B"), "H": r0.get("H")}
elif CHANGED:  # R4: base and twin read the same count; the head reads its own round-0 count; 1 file everywhere
    if not (r0.get("B") == r0.get("T") and all(r0.get(c, (0, 0))[0] == 1 for c in ("B", "T", "H"))):
        print(f"ROUND-0 COUNTS DISAGREE {r0}: every round is discarded on counts")
    exp = {"B": (1, r0.get("B", (1, -1))[1]), "T": (1, r0.get("B", (1, -1))[1]), "H": (1, r0.get("H", (1, -1))[1])}
else:
    if not (r0.get("B") == r0.get("T") == r0.get("H") and r0["B"][0] == 1):
        print(f"ROUND-0 COUNTS DISAGREE {r0}: every round is discarded on counts")
    exp = {c: (1, r0.get("B", (1, -1))[1]) for c in ("B", "T", "H")}
print(f"expected counts (round 0): {exp}")
by_round = {}
print("round\tcond\tcpu\twall\tfiles\ttests\tload_b\tload_a\tforeign_b\tforeign_a\ttherm\tpower\tsampler_bad\tstatus\tkept")
for r in rows:
    rd = int(r["round"])
    reasons = []
    if r["status"] != "ok": reasons.append("status")
    if (int(r["files"]), int(r["tests"])) != exp[r["cond"]]: reasons.append("counts")
    if r["foreign_vitest"] != "0" or r["foreign_after"] != "0": pass  # b87c35b6: foreign logged, not discarded
    if r["thermal_before"] != "0" or r["thermal_after"] != "0": pass  # T1 (sec-timing-ABC-200): thermal KEPT and FLAGGED, not discarded
    # R1: power is logged (columns power / power_after), never a discard reason
    sb = foreign_overlap(r)
    if sb: pass  # b87c35b6: sampler foreign logged, not discarded
    by_round.setdefault(rd, {})[r["cond"]] = (cs(r["user"]) + cs(r["sys"]), cs(r["wall"]), reasons, float(r["load1_before"]))
    print("\t".join([r["round"], r["cond"], r["cpu"], r["wall"], r["files"], r["tests"], r["load1_before"], r["load1_after"], r["foreign_vitest"], r["foreign_after"], f'{r["thermal_before"]}->{r["thermal_after"]}', r["power"], str(sb), r["status"], "round0" if rd == 0 else ("DISCARD:" + ",".join(reasons) if reasons else "ok")]))

# R3: the bracket log (prints only)
print("\nbracket log per lane round (sampler row at/before the first run's start | at/after the last run's end):")
print("round\tbefore_utc\tload1\tuser_procs\tforeign\t|\tafter_utc\tload1\tuser_procs\tforeign")  # R6
for rd in sorted({int(r["round"]) for r in rows}):
    rr = [r for r in rows if int(r["round"]) == rd]
    t0 = min(P(r["utc"]) for r in rr)
    t1 = max(P(r["utc"]) + timedelta(seconds=float(r["wall"])) for r in rr)
    pre = [x for x in samp if P(x["utc"]) <= t0]
    post = [x for x in samp if P(x["utc"]) >= t1]
    f = lambda x: "\t".join([x["utc"], x["load1"], x["user_procs"], x["foreign"]]) if x else "none\t-\t-\t-"  # R6
    print(f"{rd}\t{f(pre[-1] if pre else None)}\t|\t{f(post[0] if post else None)}")
print(f"\nthermal-flagged runs (kept, T1): {sum(1 for r in rows if r['round'] != '0' and (r['thermal_before'] != '0' or r['thermal_after'] != '0'))} of {sum(1 for r in rows if r['round'] != '0')} scored-round runs")
print(f"\ncpu == user + sys (centiseconds) on every row: {all(cs(r['user']) + cs(r['sys']) == cs(r['cpu']) for r in rows)}")
scored = [rd for rd, c in sorted(by_round.items()) if rd != 0 and len(c) == 3 and not any(v[2] for v in c.values())]
discarded = [rd for rd in by_round if rd != 0 and rd not in scored]
n = len(scored)
print(f"scored rounds {n} {scored}; discarded rounds {sorted(discarded)}")
if n != 8:
    print("WINDOW STATE: VOID (n must be 8; a window with any discarded round is void). No summary is used.")
    sys.exit(0)
loads = [v[3] for rd in scored for v in by_round[rd].values()]
print(f"load1 before each scored run: {min(loads):.2f}-{max(loads):.2f}")


def k_for(n):
    best = 1
    for k in range(1, n // 2 + 1):
        if 1 - 2 * sum(math.comb(n, i) for i in range(k)) / 2 ** n >= 0.92: best = k
    return best


def med(xs):
    s = sorted(xs); m = len(s)
    return Fr(s[m // 2]) if m % 2 else Fr(s[m // 2 - 1] + s[m // 2], 2)


def p_two(pos, m):
    if m == 0: return 1.0
    return min(1.0, 2 * sum(math.comb(m, i) for i in range(0, min(pos, m - pos) + 1)) / 2 ** m)


s = lambda x: f"{float(x) / 100:+.3f}"


def summarise(ui, unit):
    base = [by_round[r]["B"][ui] for r in scored]
    twin = sorted(by_round[r]["T"][ui] - by_round[r]["B"][ui] for r in scored)
    trt = sorted(by_round[r]["H"][ui] - by_round[r]["B"][ui] for r in scored)
    k = k_for(n)
    R = max(abs(twin[k - 1]), abs(twin[n - k]))
    bmed, tmed, hmed = med(base), med(twin), med(trt)
    pos = sum(d > 0 for d in twin); neg = sum(d < 0 for d in twin); zero = n - pos - neg
    p_rule = p_two(pos, pos + neg)   # A1: non-zero deltas only
    p_old = p_two(pos, n)            # the old scripts' convention, printed only
    lim = max(Fr(15, 1000) * bmed, Fr(TICK))
    adm = abs(tmed) <= lim and p_rule > 0.05
    print(f"\n[{unit}] n={n} k={k}")
    print(f"  B median {float(bmed)/100:.3f} s; H median {float(med([by_round[r]['H'][ui] for r in scored]))/100:.3f} s; T median {float(med([by_round[r]['T'][ui] for r in scored]))/100:.3f} s")
    print(f"  twin T-B sorted: {', '.join(s(d) for d in twin)}")
    print(f"  twin median {s(tmed)} s ({float(100 * tmed / bmed):+.3f} % of B); limit max(1.5 % = {float(Fr(15,1000)*bmed)*10:.2f} ms, one tick 10 ms) = {float(lim)*10:.2f} ms")
    print(f"  sign on non-zero deltas: +{pos} / -{neg} (zeros {zero}, dropped): two-sided p {p_rule:.3f}  [old convention, not used: {pos}/{n}, p {p_old:.3f}]")
    print(f"  R {float(R)/100:.3f} s -> ADMISSIBLE (A1) {adm}")
    print(f"  treatment H-B sorted: {', '.join(s(d) for d in trt)}")
    print(f"  treatment median {s(hmed)} s, interval x({k})..x({n + 1 - k}) = {s(trt[k - 1])}..{s(trt[n - k])}")
    return adm, R, hmed, trt[k - 1], trt[n - k]


adm, R, hmed, lo, hi = summarise(0, "CPU user+sys")
bmed_cpu = med([by_round[r]["B"][0] for r in scored])
F_SET = Fr(16, 100) * bmed_cpu if F_ARG == "16pct" else Fr(round(float(F_ARG) * 100))
print(f"\n  per-set F = {float(F_SET)/100:.3f} s ({'provisional 16 % of this window B CPU median' if F_ARG == '16pct' else 'recorded per-set F'}); 650 ms >= F: {BOUND >= F_SET}")
if not adm:
    state = "INADMISSIBLE (no state)"
elif lo > BOUND:
    state = "NOT MET"
elif R <= BOUND and hmed <= BOUND:
    state = "MET"
elif R <= BOUND:
    state = "NOT MET"
else:
    state = f"UNRESOLVED (charge at most {s(hi)} s)"
print(f"  resolves 650 ms (R <= b): {R <= BOUND}; lower end x(k) {s(lo)} s > b: {lo > BOUND}; median {s(hmed)} s <= b: {hmed <= BOUND}")
print(f"  STATE at 650 ms CPU: {state}")
summarise(1, "wall")
