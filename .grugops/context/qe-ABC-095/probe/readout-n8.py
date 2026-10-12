#!/usr/bin/env python3
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
TICK = 1    # one 10 ms tick, in centiseconds
rows = list(csv.DictReader(open(f"{D}/{TAG}.tsv"), delimiter="\t"))
samp = list(csv.DictReader(open(f"{D}/sampler.tsv"), delimiter="\t"))
P = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))
cs = lambda s: int(round(float(s) * 100))


def foreign_overlap(r):
    t0 = P(r["utc"]) - timedelta(seconds=5)
    t1 = P(r["utc"]) + timedelta(seconds=float(r["wall"]) + 5)
    bad = [s for s in samp if t0 <= P(s["utc"]) <= t1 and (s["foreign_runner"] != "0" or s["platform"] != "0" or s["thermal"] != "0" or s["power"] != "AC Power")]
    return len(bad)


r0 = {r["cond"]: (int(r["files"]), int(r["tests"])) for r in rows if r["round"] == "0"}
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
    if r["foreign_vitest"] != "0" or r["foreign_after"] != "0": reasons.append("foreign")
    if r["thermal_before"] != "0" or r["thermal_after"] != "0": reasons.append("thermal")
    if r["power"] != "AC Power" or r["power_after"] != "AC Power": reasons.append("power")
    sb = foreign_overlap(r)
    if sb: reasons.append("sampler")
    by_round.setdefault(rd, {})[r["cond"]] = (cs(r["user"]) + cs(r["sys"]), cs(r["wall"]), reasons, float(r["load1_before"]))
    print("\t".join([r["round"], r["cond"], r["cpu"], r["wall"], r["files"], r["tests"], r["load1_before"], r["load1_after"], r["foreign_vitest"], r["foreign_after"], f'{r["thermal_before"]}->{r["thermal_after"]}', r["power"], str(sb), r["status"], "round0" if rd == 0 else ("DISCARD:" + ",".join(reasons) if reasons else "ok")]))

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
