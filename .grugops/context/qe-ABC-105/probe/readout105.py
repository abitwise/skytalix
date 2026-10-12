#!/usr/bin/env python3
# qe-ABC-105 N8-LANE readout per ADR-0035 decisions 1-3 (+ the 2026-10-10 per-set F amendment).
# Usage: python3 -I readout105.py <window dir>
import csv, sys, statistics, math
from datetime import datetime, timedelta

D = sys.argv[1]
BOUND = 0.650
rows = list(csv.DictReader(open(f"{D}/n8-105.tsv"), delimiter="\t"))
samp = list(csv.DictReader(open(f"{D}/sampler.tsv"), delimiter="\t"))
P = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))


def foreign_overlap(r):
    t0 = P(r["utc"]) - timedelta(seconds=5)
    t1 = P(r["utc"]) + timedelta(seconds=float(r["wall"]) + 5)
    bad = [s for s in samp if t0 <= P(s["utc"]) <= t1 and (s["foreign_runner"] != "0" or s["platform"] != "0" or s["thermal"] != "0" or s["power"] != "AC Power")]
    return len(bad)


exp = {"B": (1, 1), "T": (1, 1), "H": (1, 28)}
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
    by_round.setdefault(rd, {})[r["cond"]] = (float(r["cpu"]), float(r["wall"]), reasons)
    print("\t".join([r["round"], r["cond"], r["cpu"], r["wall"], r["files"], r["tests"], r["load1_before"], r["load1_after"], r["foreign_vitest"], r["foreign_after"], f'{r["thermal_before"]}->{r["thermal_after"]}', r["power"], str(sb), r["status"], "round0" if rd == 0 else ("DISCARD:" + ",".join(reasons) if reasons else "ok")]))

scored = [rd for rd, c in sorted(by_round.items()) if rd != 0 and len(c) == 3 and not any(v[2] for v in c.values())]
discarded = [rd for rd in by_round if rd != 0 and rd not in scored]
n = len(scored)
print(f"\nscored rounds {n} {scored}; discarded rounds {sorted(discarded)}")


def k_for(n):
    best = 1
    for k in range(1, n // 2 + 1):
        cov = 1 - 2 * sum(math.comb(n, i) for i in range(k)) / 2 ** n
        if cov >= 0.92: best = k
    return best


def summarise(unit_idx, unit):
    base = [by_round[r]["B"][unit_idx] for r in scored]
    twin = sorted(by_round[r]["T"][unit_idx] - by_round[r]["B"][unit_idx] for r in scored)
    trt = sorted(by_round[r]["H"][unit_idx] - by_round[r]["B"][unit_idx] for r in scored)
    k = k_for(n)
    R = max(abs(twin[k - 1]), abs(twin[n - k]))
    bmed = statistics.median(base)
    tmed = statistics.median(twin)
    pos = sum(1 for d in twin if d > 0)
    p_sign = min(1.0, 2 * sum(math.comb(n, i) for i in range(0, min(pos, n - pos) + 1)) / 2 ** n)
    adm = abs(tmed) <= 0.015 * bmed and p_sign > 0.05
    hmed = statistics.median(trt)
    lo, hi = trt[k - 1], trt[n - k]
    print(f"\n[{unit}] n={n} k={k}")
    print(f"  base B median {bmed:.3f} s; H median {statistics.median([by_round[r]['H'][unit_idx] for r in scored]):.3f} s; T median {statistics.median([by_round[r]['T'][unit_idx] for r in scored]):.3f} s")
    print(f"  twin T-B sorted: {', '.join(f'{d:+.2f}' for d in twin)}")
    print(f"  twin median {tmed:+.3f} s ({100*tmed/bmed:+.2f} % of base), sign {pos}/{n} (two-sided p {p_sign:.3f}), R {R:.3f} s -> admissible {adm}")
    print(f"  treatment H-B sorted: {', '.join(f'{d:+.2f}' for d in trt)}")
    print(f"  treatment median {hmed:+.3f} s, interval x(k)..x(n+1-k) = {lo:+.3f}..{hi:+.3f}")
    return bmed, R, adm, hmed, lo, hi


bmed, R, adm, hmed, lo, hi = summarise(0, "CPU user+sys")
Fprov = 0.16 * bmed
print(f"\n  provisional F = 16 % x base CPU {bmed:.3f} = {Fprov:.3f} s; 650 ms >= F: {BOUND >= Fprov}")
if not adm:
    state = "INADMISSIBLE (no state)"
elif lo > BOUND:
    state = "NOT MET"
elif R <= BOUND and hmed <= BOUND:
    state = "MET"
elif R <= BOUND:
    state = "NOT MET"
else:
    state = f"UNRESOLVED (charge at most {hi:+.3f} s)"
print(f"  resolves 650 ms (R <= b): {R <= BOUND}; STATE at 650 ms CPU: {state}")
summarise(1, "wall")
