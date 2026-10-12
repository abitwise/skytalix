#!/usr/bin/env python3
# Architect/Design independent recompute (design-ABC-105-lane). Integer centiseconds throughout,
# so no float rounding enters a median or a 1.5 % comparison. Usage: python3 -I recompute.py <ctx root>
import csv, sys, math
from datetime import datetime, timedelta
from fractions import Fraction as Fr

ROOT = sys.argv[1]
WINDOWS = [
    ("qe-ABC-105 (60415a8a)", "qe-ABC-105/probe", "n8-105.tsv", 28),
    ("qe3 w1 (db1cfb6c)", "qe3-ABC-105-lane/probe/w1", "n8-qe3.tsv", 32),
    ("qe3 w2 (db1cfb6c)", "qe3-ABC-105-lane/probe/w2", "n8-qe3.tsv", 32),
    ("qe3 w3 (db1cfb6c)", "qe3-ABC-105-lane/probe/w3", "n8-qe3.tsv", 32),
    ("qe4 w1 (8fd0c233)", "qe4-ABC-105/probe/w1", "n8-qe4.tsv", 32),
    ("qe4 w2 (8fd0c233)", "qe4-ABC-105/probe/w2", "n8-qe4.tsv", 32),
]
cs = lambda s: int(round(float(s) * 100))  # centiseconds (the 10 ms tick of /usr/bin/time -p)
P = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))

def kfor(n):
    best = 1
    for k in range(1, n // 2 + 1):
        if 1 - 2 * sum(math.comb(n, i) for i in range(k)) / 2 ** n >= 0.92: best = k
    return best

def med(xs):  # exact median as Fraction of centiseconds
    s = sorted(xs); n = len(s)
    return Fr(s[n // 2]) if n % 2 else Fr(s[n // 2 - 1] + s[n // 2], 2)

def p_two(pos, n):
    if n == 0: return 1.0
    return min(1.0, 2 * sum(math.comb(n, i) for i in range(0, min(pos, n - pos) + 1)) / 2 ** n)

for label, d, tsv, hcount in WINDOWS:
    rows = list(csv.DictReader(open(f"{ROOT}/{d}/{tsv}"), delimiter="\t"))
    samp = list(csv.DictReader(open(f"{ROOT}/{d}/sampler.tsv"), delimiter="\t"))
    exp = {"B": (1, 1), "T": (1, 1), "H": (1, hcount)}
    sumcheck = all(cs(r["user"]) + cs(r["sys"]) == cs(r["cpu"]) for r in rows)
    by = {}
    for r in rows:
        bad = []
        if r["status"] != "ok": bad.append("status")
        if (int(r["files"]), int(r["tests"])) != exp[r["cond"]]: bad.append("counts")
        if r["foreign_vitest"] != "0" or r["foreign_after"] != "0": bad.append("foreign")
        if r["thermal_before"] != "0" or r["thermal_after"] != "0": bad.append("thermal")
        if r["power"] != "AC Power" or r["power_after"] != "AC Power": bad.append("power")
        t0 = P(r["utc"]) - timedelta(seconds=5); t1 = P(r["utc"]) + timedelta(seconds=float(r["wall"]) + 5)
        if any(t0 <= P(s["utc"]) <= t1 and (s["foreign_runner"] != "0" or s["platform"] != "0" or s["thermal"] != "0" or s["power"] != "AC Power") for s in samp):
            bad.append("sampler")
        by.setdefault(int(r["round"]), {})[r["cond"]] = (cs(r["user"]) + cs(r["sys"]), cs(r["wall"]), bad, float(r["load1_before"]))
    scored = [k for k in sorted(by) if k != 0 and len(by[k]) == 3 and not any(v[2] for v in by[k].values())]
    n = len(scored)
    loads = [v[3] for k in scored for v in by[k].values()]
    print(f"== {label}: rows {len(rows)}, cpu==user+sys on every row: {sumcheck}; scored n={n} {scored}; discarded {[k for k in sorted(by) if k and k not in scored]}")
    if n == 0:
        print("   VOID (n = 0)\n"); continue
    print(f"   load1 over scored runs {min(loads):.2f}-{max(loads):.2f}")
    k = kfor(n)
    for ui, unit in ((0, "CPU"), (1, "wall")):
        B = [by[r]["B"][ui] for r in scored]
        tw = sorted(by[r]["T"][ui] - by[r]["B"][ui] for r in scored)
        tr = sorted(by[r]["H"][ui] - by[r]["B"][ui] for r in scored)
        bm = med(B); tm = med(tw)
        R = max(abs(tw[k - 1]), abs(tw[n - k]))
        pos = sum(d > 0 for d in tw); neg = sum(d < 0 for d in tw); zero = n - pos - neg
        p_qe = p_two(pos, n)              # the harness readout's convention: positives vs the rest
        p_ties = p_two(pos, pos + neg)    # conventional sign test: ties dropped
        lim15 = Fr(15, 1000) * bm         # 1.5 % of base, centiseconds
        limtick = max(lim15, Fr(1))       # max(1.5 %, one 10 ms tick)
        pct = float(tm / bm * 100)
        print(f"   [{unit}] n={n} k={k}; B median {float(bm)/100:.3f} s; twin sorted {[x/100 for x in tw]}")
        print(f"      twin median {float(tm)/100:+.3f} s = {pct:+.3f} % of B; 1.5 % limit = {float(lim15)*10:.3f} ms; sign +{pos}/-{neg}/0x{zero}: p(readout conv) {p_qe:.3f}, p(ties dropped) {p_ties:.3f}; R {R/100:.3f} s")
        print(f"      admissible @1.5 %: {abs(tm) <= lim15 and p_qe > 0.05};  @max(1.5 %, 1 tick): {abs(tm) <= limtick and p_qe > 0.05} (ties-dropped sign: {abs(tm) <= limtick and p_ties > 0.05})")
        print(f"      treatment H-B sorted {[x/100 for x in tr]}; median {float(med(tr))/100:+.3f} s; x({k})..x({n+1-k}) {tr[k-1]/100:+.3f}..{tr[n-k]/100:+.3f}")
        if ui == 0:
            hm = med(tr); b = 65
            def state(adm):
                if not adm: return "INADMISSIBLE (no state)"
                if tr[k - 1] > b: return "NOT MET (lower end > b)"
                if R <= b and hm <= b: return "MET"
                if R <= b: return "NOT MET"
                return "UNRESOLVED"
            print(f"      state at 650 ms: @1.5 % -> {state(abs(tm) <= lim15 and p_qe > 0.05)}; @max(1.5 %, tick) -> {state(abs(tm) <= limtick and p_qe > 0.05)}; provisional F 16 % = {0.16*float(bm)/100:.3f} s")
    print()
