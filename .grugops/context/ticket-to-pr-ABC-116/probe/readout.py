#!/usr/bin/env python3
# ticket-to-pr-ABC-116 A2 readout: medians and paired differences (M-B, T-B) per scored round, ADR-0035 decision 1's R.
# Scored = rounds >= 1 (round 0 discarded), status ok, the last attempt per (round, arm). Usage: python3 -I readout.py a2-runs.tsv
import csv, statistics, sys
from math import comb

rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t"))
disc = [r for r in rows if r["status"] != "ok"]
good = {}
for r in rows:
    if r["status"] == "ok":
        good[(int(r["round"]), r["arm"])] = r
rounds = sorted({k[0] for k in good if k[0] >= 1 and all((k[0], a) in good for a in "BMT")})
n = len(rounds)

def k_of(n):
    k = 1
    for c in range(2, n // 2 + 1):
        if 1 - 2 * sum(comb(n, i) for i in range(c)) / 2 ** n >= 0.92:
            k = c
    return k

k = k_of(n)
print(f"scored rounds n = {n} (round 0 discarded), k = {k}; discarded/errored rows: {len(disc)}")
for d in disc:
    print(f"  DISCARDED seq {d['seq']} round {d['round']} arm {d['arm']} attempt {d['attempt']} status {d['status']} "
          f"foreign b/d/a {d['foreign_before']}/{d['foreign_during']}/{d['foreign_after']}")
for unit, col in (("wall", "wall_s"), ("CPU", "cpu_s")):
    v = {a: [float(good[(r, a)][col]) for r in rounds] for a in "BMT"}
    dm = [m - b for m, b in zip(v["M"], v["B"])]
    dt = [t - b for t, b in zip(v["T"], v["B"])]
    sm, st = sorted(dm), sorted(dt)
    R = max(abs(st[k - 1]), abs(st[n - k]))
    print(f"\n{unit}: median B {statistics.median(v['B']):.3f}  M {statistics.median(v['M']):.3f}  T {statistics.median(v['T']):.3f} s")
    print(f"  M-B per round: {' '.join(f'{x:+.2f}' for x in dm)}")
    print(f"  M-B median {statistics.median(dm):+.3f} s, interval x({k})..x({n+1-k}) = {sm[k-1]:+.3f}..{sm[n-k]:+.3f}, sign + {sum(x > 0 for x in dm)}/{n}")
    print(f"  T-B per round: {' '.join(f'{x:+.2f}' for x in dt)}")
    tb = statistics.median(dt)
    print(f"  T-B median {tb:+.3f} s ({100 * tb / statistics.median(v['B']):+.2f} % of base), sign + {sum(x > 0 for x in dt)}/{n}, twin R = {R:.3f} s")
    if unit == "CPU":
        b = 0.30
        adm = abs(tb) <= 0.015 * statistics.median(v["B"])
        state = ("NOT MET" if sm[k - 1] > b else "MET" if (R <= b and statistics.median(dm) <= b) else
                 "NOT MET" if R <= b else "UNRESOLVED")
        print(f"  per-child clause b = {b} s CPU: twin admissible (|median| <= 1.5 %) = {adm}; resolves b (R <= b) = {R <= b}; state = {state}")
print("\nper-run load1 / thermal / foreign / power (scored and round 0):")
for r in rows:
    print(f"  seq {r['seq']:>2} r{r['round']} {r['arm']} a{r['attempt']} load1 {r['load1_before']}->{r['load1_after']} "
          f"therm {r['thermal_before']}->{r['thermal_after']} foreign {r['foreign_before']}/{r['foreign_during']}/{r['foreign_after']} "
          f"pgrep {r['pgrep_before']}/{r['pgrep_after']} power {r['power_before']}->{r['power_after']} {r['status']}")
