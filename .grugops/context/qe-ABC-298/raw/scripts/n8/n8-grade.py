# qe-ABC-298 NFR-008 readout (ADR-0077 d11): qe-ABC-303's n8-grade.py (qe-ABC-282's) with the lines marked 298 changed.
# 298: every arm ran `npm test -- --maxWorkers=1` on one core (taskset -c 0), so the catalogue's absolute 10 s legs, defined
# on `npm test` at vitest's two-worker cap, are not read here: they are printed as INFO and grade nothing. The graded leg
# is d11's: the twin admissible, n >= 8, and the paired median of H - B wall <= +0.10 s. Usage: python3 -I n8-grade.py <a8.tsv>
# Uses only rounds >= 1 in which all three arms are scored (complete rounds).
import csv, sys, statistics as st
from math import comb
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t"))
by = {}
for x in rows:
    by.setdefault(int(x["round"]), {})[x["arm"]] = x
rounds = [r for r in sorted(by) if r >= 1 and len(by[r]) == 3 and all(by[r][a]["scored"] == "1" for a in ("B", "H", "H2"))]
n = len(rounds)
def k_of(n):  # ADR-0035 D1: largest k with 1 - 2*sum_{i<k} C(n,i)/2^n >= 0.92
    k = 1
    while k + 1 <= n and 1 - 2 * sum(comb(n, i) for i in range(k + 1)) / 2 ** n >= 0.92:
        k += 1
    return k
k = k_of(n)
def iv(v):
    s = sorted(v); return s[k - 1], s[n - k]
def R(v):
    lo, hi = iv(v); return max(abs(lo), abs(hi))
def sign(v):
    return sum(1 for d in v if d > 0), sum(1 for d in v if d != 0)
g = lambda r, a, f: float(by[r][a][f])
print(f"complete scored rounds n = {n} (rounds {rounds}); k = {k}")
for a in ("B", "H", "H2"):
    w = [g(r, a, "wall_s") for r in rounds]; c = [g(r, a, "cpu_s") for r in rounds]
    print(f"{a}: wall median {st.median(w):.2f} s, interval [{iv(w)[0]:.2f}, {iv(w)[1]:.2f}], max {max(w):.2f}; CPU median {st.median(c):.2f} s")
for f in ("wall_s", "cpu_s"):
    d = [g(r, "H", f) - g(r, "B", f) for r in rounds]
    p, nz = sign(d)
    print(f"H-B {f}: median {st.median(d):+.3f} s, interval [{iv(d)[0]:+.3f}, {iv(d)[1]:+.3f}], positive {p}/{nz}, deltas {sorted(round(x,2) for x in d)}")
hcpu = st.median([g(r, "H", "cpu_s") for r in rounds])
out = {}
for f in ("wall_s", "cpu_s"):
    d = [g(r, "H2", f) - g(r, "H", f) for r in rounds]
    p, nz = sign(d)
    out[f] = (st.median(d), R(d), p, nz)
    print(f"twin H2-H {f}: median {st.median(d):+.3f} s, R {R(d):.3f} s, positive {p}/{nz}, deltas {sorted(round(x,2) for x in d)}")
md, Rc, p, nz = out["cpu_s"]
lim = max(0.015 * hcpu, 0.01)
chance = (nz == 0) or (0 < p < nz)
adm = abs(md) <= lim and chance and n >= 8
print(f"twin admissibility: |median CPU delta| {abs(md):.3f} s = {100*abs(md)/hcpu:.2f} % of H CPU {hcpu:.2f} s (limit {lim:.3f} s); sign {p}/{nz} at chance: {chance}; n >= 8: {n >= 8} -> {'ADMISSIBLE' if adm else 'INADMISSIBLE'}")
hw = st.median([g(r, "H", "wall_s") for r in rounds])
Rw = out["wall_s"][1]
hb = [g(r, "H", "wall_s") - g(r, "B", "wall_s") for r in rounds]
paired = st.median(hb); mm = hw - st.median([g(r, "B", "wall_s") for r in rounds])
# 298: the one graded line. OVER is F7 (UNRESOLVED, not a defect, not merged while over, to the Architect).
if not adm: state = "VOID (inadmissible twin, or n < 8): not graded, not a miss"
elif paired <= 0.10: state = "MET"
else: state = "OVER: NFR-008 UNRESOLVED (F7)"
print(f"NFR-008 STATE (298, graded): {state}; paired H-B median wall {paired:+.3f} s against <= +0.10 s; difference of the two arm medians (reported): {mm:+.3f} s")
print(f"INFO (298, not graded at one worker): H median wall {hw:.2f} s; twin wall R {Rw:.3f} s; the 10 s legs are defined at two workers")
