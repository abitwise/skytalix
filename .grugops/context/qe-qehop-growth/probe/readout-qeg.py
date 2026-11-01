#!/usr/bin/env python3
# qe-qehop-growth N8-LANE readout (T-QEHOP-GROWTH). Derived from qe-ABC-154/probe/readout-qe5.py (sha256 490d6ab8...a42255a6):
# the same n / k / R, integer centiseconds, exact Fraction medians, the A1 admissibility rule (|twin CPU median| <=
# max(1.5 % of B, one 10 ms tick) AND the two-sided sign test on the NON-ZERO twin deltas at p > 0.05), F = 0.020 s, and
# the same grade ladder at 650 ms CPU. Changes, all fixed in preregistration.txt BEFORE window 1:
#   1. The TSV is n8-qeg.tsv when present, else n8-qe5.tsv (the self-test on qe-ABC-154 w1). H count stays 32 (same blob).
#   2. Host columns. A macOS TSV (thermal_before present) is read with readout-qe5's exact discard rules. A Linux TSV
#      (tctl_before present) discards a round on: status; counts; a vitest before/after the run; cutechess-cli before/after;
#      Tctl >= 100.0 C before/after (Tjmax of the Ryzen AI 9 HX 370: the throttle point, which stands in for macOS
#      thermalpressurelevel != 0); or any 5 s sampler row in [start-5 s, end+5 s] with a foreign vitest (cwd not under the
#      arms), an oeselg-labs/platform process, a cutechess-cli, or Tctl >= 100.0. There is no power rule (no power device).
#   3. Thermal stop (the brief): the window is VOID when the median Tctl over the window (every per-run before/after reading
#      and every sampler row from the first run's start to the last run's end) is > 85.0 C.
# Usage: python3 -I readout-qeg.py <window dir>
import csv, math, os, statistics, sys
from datetime import datetime, timedelta
from fractions import Fraction as Fr

D = sys.argv[1]
BOUND = 65  # 650 ms CPU, in centiseconds
TICK = 1    # one 10 ms tick, in centiseconds
F_SET = 2   # per-set F = 0.020 s, in centiseconds
TJMAX = 100.0
TSTOP = 85.0
tsv = f"{D}/n8-qeg.tsv" if os.path.exists(f"{D}/n8-qeg.tsv") else f"{D}/n8-qe5.tsv"
rows = list(csv.DictReader(open(tsv), delimiter="\t"))
samp = list(csv.DictReader(open(f"{D}/sampler.tsv"), delimiter="\t"))
LINUX = "tctl_before" in rows[0]
P = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))
cs = lambda s: int(round(float(s) * 100))
print(f"tsv {os.path.basename(tsv)}; host columns: {'linux (Tctl)' if LINUX else 'macOS (thermal pressure, power)'}")


def bad_sample(s):
    if LINUX:
        return s["foreign_runner"] != "0" or s["platform"] != "0" or s["cutechess"] != "0" or float(s["tctl"]) >= TJMAX
    return s["foreign_runner"] != "0" or s["platform"] != "0" or s["thermal"] != "0" or s["power"] != "AC Power"


def window_of(r):
    t0 = P(r["utc"]) - timedelta(seconds=5)
    return t0, P(r["utc"]) + timedelta(seconds=float(r["wall"]) + 5)


def foreign_overlap(r):
    t0, t1 = window_of(r)
    return len([s for s in samp if t0 <= P(s["utc"]) <= t1 and bad_sample(s)])


exp = {"B": (1, 1), "T": (1, 1), "H": (1, 32)}
by_round = {}
print("round\tcond\tcpu\twall\tfiles\ttests\tload_b\tload_a\tforeign_b\tforeign_a\ttherm\tpower_or_cutechess\tsampler_bad\tstatus\tkept")
for r in rows:
    rd = int(r["round"])
    reasons = []
    if r["status"] != "ok": reasons.append("status")
    if (int(r["files"]), int(r["tests"])) != exp[r["cond"]]: reasons.append("counts")
    if r["foreign_vitest"] != "0" or r["foreign_after"] != "0": reasons.append("foreign")
    if LINUX:
        if r["cutechess_before"] != "0" or r["cutechess_after"] != "0": reasons.append("cutechess")
        if float(r["tctl_before"]) >= TJMAX or float(r["tctl_after"]) >= TJMAX: reasons.append("thermal")
        therm, pw = f'{r["tctl_before"]}->{r["tctl_after"]}', f'cc {r["cutechess_before"]}/{r["cutechess_after"]}'
    else:
        if r["thermal_before"] != "0" or r["thermal_after"] != "0": reasons.append("thermal")
        if r["power"] != "AC Power" or r["power_after"] != "AC Power": reasons.append("power")
        therm, pw = f'{r["thermal_before"]}->{r["thermal_after"]}', r["power"]
    sb = foreign_overlap(r)
    if sb: reasons.append("sampler")
    by_round.setdefault(rd, {})[r["cond"]] = (cs(r["user"]) + cs(r["sys"]), cs(r["wall"]), reasons, float(r["load1_before"]))
    print("\t".join([r["round"], r["cond"], r["cpu"], r["wall"], r["files"], r["tests"], r["load1_before"], r["load1_after"], r["foreign_vitest"], r["foreign_after"], therm, pw, str(sb), r["status"], "round0" if rd == 0 else ("DISCARD:" + ",".join(reasons) if reasons else "ok")]))

print(f"\ncpu == user + sys (centiseconds) on every row: {all(cs(r['user']) + cs(r['sys']) == cs(r['cpu']) for r in rows)}")
if LINUX:
    t_first, t_last = P(rows[0]["utc"]), max(window_of(r)[1] for r in rows) - timedelta(seconds=5)
    temps = [float(r[k]) for r in rows for k in ("tctl_before", "tctl_after")] + [float(s["tctl"]) for s in samp if t_first <= P(s["utc"]) <= t_last]
    tmed = statistics.median(temps)
    print(f"Tctl over the window: median {tmed:.1f} C, max {max(temps):.1f} C, n {len(temps)} (thermal stop > {TSTOP} C: {tmed > TSTOP})")
    lanesamp = [s for s in samp if t_first - timedelta(seconds=5) <= P(s["utc"]) <= t_last + timedelta(seconds=5)]
    print(f"sampler rows over the lane: {len(lanesamp)}; bad {sum(bad_sample(s) for s in lanesamp)}; whole file {len(samp)} rows, bad {sum(bad_sample(s) for s in samp)}")
    if tmed > TSTOP:
        print("WINDOW STATE: VOID (thermal stop). No summary is used.")
        sys.exit(0)
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
print(f"\n  per-set F = {F_SET/100:.3f} s (ADR-0035 § Addendum A2 / B2); 650 ms >= F: {BOUND >= F_SET}")
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
