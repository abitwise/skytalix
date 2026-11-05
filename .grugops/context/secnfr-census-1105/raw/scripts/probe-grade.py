# secnfr-nfr008-1104 probe readout. Usage: python3 -I probe-grade.py <a8.tsv>. Complete rounds >= 1 only; k by ADR-0035 D1.
import csv, sys, statistics as st
from math import comb
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t"))
by = {}
for x in rows: by.setdefault(int(x["round"]), {})[x["arm"]] = x
A = ("H", "P1", "P2")
rounds = [r for r in sorted(by) if r >= 1 and len(by[r]) == 3 and all(by[r][a]["scored"] == "1" for a in A)]
n = len(rounds)
k = 1
while k + 1 <= n and 1 - 2 * sum(comb(n, i) for i in range(k + 1)) / 2 ** n >= 0.92: k += 1
iv = lambda v: (sorted(v)[k - 1], sorted(v)[n - k])
g = lambda r, a, f: float(by[r][a][f])
print(f"complete scored rounds n = {n} (rounds {rounds}); k = {k}")
for a in A:
    w = [g(r, a, "wall_s") for r in rounds]; c = [g(r, a, "cpu_s") for r in rounds]
    print(f"{a}: wall median {st.median(w):.2f} s [{iv(w)[0]:.2f}, {iv(w)[1]:.2f}], max {max(w):.2f}; CPU median {st.median(c):.2f} s")
for p in ("P1", "P2"):
    for f in ("wall_s", "cpu_s"):
        d = [g(r, p, f) - g(r, "H", f) for r in rounds]
        print(f"{p}-H {f}: median {st.median(d):+.3f} s [{iv(d)[0]:+.3f}, {iv(d)[1]:+.3f}], negative {sum(1 for x in d if x < 0)}/{n}, deltas {sorted(round(x, 2) for x in d)}")
