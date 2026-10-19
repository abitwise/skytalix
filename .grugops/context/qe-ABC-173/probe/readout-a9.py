#!/usr/bin/env python3
# qe-ABC-173 A9 (NFR-008 total) readout over lane173.mjs's TSV for CONDS=H,H2 (BASE=H, TWIN=H2: two byte-identical head
# trees, `npm test` as spelled). The admissibility (A1), n/k/R and the discard rules are qe2-ABC-101/probe/readout-n8.py's,
# copied; the bound is NFR-008's live level: `npm test` WALL <= 10 s at load1 <= 8, CPU reported (ADR-0035 D6, ADR-0008
# addendum Ruling 5). MET needs: admissible, wall R <= 10 s, H median wall <= 10 s, every scored run's load1 <= 8.
import csv, math, sys
from datetime import datetime, timedelta
from fractions import Fraction as Fr
D, TAG = sys.argv[1], sys.argv[2]
rows = list(csv.DictReader(open(f"{D}/{TAG}.tsv"), delimiter="\t"))
samp = list(csv.DictReader(open(f"{D}/sampler.tsv"), delimiter="\t"))
P = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))
cs = lambda s: int(round(float(s) * 100))
def foreign_overlap(r):
    t0 = P(r["utc"]) - timedelta(seconds=5); t1 = P(r["utc"]) + timedelta(seconds=float(r["wall"]) + 5)
    return len([s for s in samp if t0 <= P(s["utc"]) <= t1 and (s["foreign_runner"] != "0" or s["platform"] != "0" or s["thermal"] != "0")])
r0 = {r["cond"]: (int(r["files"]), int(r["tests"])) for r in rows if r["round"] == "0"}
exp = r0.get("H")
if r0.get("H") != r0.get("H2"): print(f"ROUND-0 COUNTS DISAGREE {r0}")
by = {}
for r in rows:
    rd = int(r["round"]); why = []
    if r["status"] != "ok": why.append("status")
    if (int(r["files"]), int(r["tests"])) != exp: why.append("counts")
    if r["foreign_vitest"] != "0" or r["foreign_after"] != "0": why.append("foreign")
    if r["thermal_before"] != "0" or r["thermal_after"] != "0": why.append("thermal")
    if foreign_overlap(r): why.append("sampler")
    by.setdefault(rd, {})[r["cond"]] = (cs(r["user"]) + cs(r["sys"]), cs(r["wall"]), why, float(r["load1_before"]))
    print(r["round"], r["cond"], "cpu", r["cpu"], "wall", r["wall"], "files", r["files"], "tests", r["tests"], "load1", r["load1_before"], "->", r["load1_after"], "round0" if rd == 0 else ("DISCARD:" + ",".join(why) if why else "ok"))
scored = [rd for rd, c in sorted(by.items()) if rd != 0 and len(c) == 2 and not any(v[2] for v in c.values())]
n = len(scored); print(f"scored {n} {scored}")
if n != 8: print("WINDOW STATE: VOID"); sys.exit(0)
def k_for(n):
    best = 1
    for k in range(1, n // 2 + 1):
        if 1 - 2 * sum(math.comb(n, i) for i in range(k)) / 2 ** n >= 0.92: best = k
    return best
def med(xs):
    s = sorted(xs); m = len(s); return Fr(s[m // 2]) if m % 2 else Fr(s[m // 2 - 1] + s[m // 2], 2)
def p_two(pos, m):
    return 1.0 if m == 0 else min(1.0, 2 * sum(math.comb(m, i) for i in range(0, min(pos, m - pos) + 1)) / 2 ** m)
k = k_for(n)
loads = [v[3] for rd in scored for v in by[rd].values()]
out = {}
for ui, unit in ((0, "cpu"), (1, "wall")):
    h = [by[r]["H"][ui] for r in scored]; t = sorted(by[r]["H2"][ui] - by[r]["H"][ui] for r in scored)
    R = max(abs(t[k - 1]), abs(t[n - k])); pos = sum(d > 0 for d in t); neg = sum(d < 0 for d in t)
    out[unit] = dict(hmed=med(h), h2med=med([by[r]["H2"][ui] for r in scored]), tmed=med(t), R=R, pos=pos, neg=neg, p=p_two(pos, pos + neg), lo=min(h), hi=max(h), deltas=t)
    print(f"[{unit}] n={n} k={k} H median {float(out[unit]['hmed'])/100:.3f} s (range {min(h)/100:.2f}-{max(h)/100:.2f}); H2 median {float(out[unit]['h2med'])/100:.3f} s")
    print(f"  twin H2-H sorted: {', '.join(f'{d/100:+.2f}' for d in t)}; median {float(out[unit]['tmed'])/100:+.3f} s; sign +{pos}/-{neg} p {out[unit]['p']:.3f}; R {R/100:.3f} s")
c = out["cpu"]; lim = max(Fr(15, 1000) * c["hmed"], Fr(1))
adm = abs(c["tmed"]) <= lim and c["p"] > 0.05
print(f"admissible (A1: |twin cpu median| {float(abs(c['tmed']))/100:.3f} s <= max(1.5 % of H cpu = {float(Fr(15,1000)*c['hmed'])/100:.3f} s, 1 tick); sign p > 0.05): {adm}")
w = out["wall"]; B = 1000
print(f"load1 before each scored run: {min(loads):.2f}-{max(loads):.2f}; all <= 8: {max(loads) <= 8}")
if not adm: state = "INADMISSIBLE (no state)"
elif max(loads) > 8: state = "NOT APPLICABLE (load1 > 8 on a scored run; the clause is read at load1 <= 8)"
elif w["R"] <= B and w["hmed"] <= B: state = "MET"
elif w["R"] <= B: state = "NOT MET"
else: state = "UNRESOLVED"
print(f"A9 STATE at 10 s wall: {state} (wall median {float(w['hmed'])/100:.2f} s, R {w['R']/100:.2f} s; CPU median {float(c['hmed'])/100:.2f} s reported)")
