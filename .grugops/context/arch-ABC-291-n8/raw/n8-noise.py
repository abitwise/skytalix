# arch-ABC-291-n8: reads a8.tsv files only; runs no test. usage: python3 -I n8-noise.py <291 a8.tsv> <clean a8.tsv> ...
# Prints ABC-291's pooled and sign figures, the position effect, the twin paired median of each clean read and their RMS,
# then the chance a read of median-of-8 lands at or under +0.10 s for a true H - B, as a normal with that RMS.
import csv, math, statistics as st, sys
def load(f):
    by = {}
    for x in csv.DictReader(open(f), delimiter="\t"):
        if x.get("round"): by.setdefault(int(x["round"]), {})[x["arm"]] = x
    R = [r for r in sorted(by) if r >= 1 and len(by[r]) == 3 and all(by[r][a]["scored"] == "1" for a in ("B", "H", "H2"))]
    return by, R
by, R = load(sys.argv[1])
g = lambda b, r, a, c="wall_s": float(b[r][a][c])
for c in ("wall_s", "cpu_s"):
    h = [g(by, r, "H", c) - g(by, r, "B", c) for r in R]; h2 = [g(by, r, "H2", c) - g(by, r, "B", c) for r in R]
    both = [(x + y) / 2 for x, y in zip(h, h2)]
    print(f"{c}: H-B median {st.median(h):+.3f} mean {st.mean(h):+.3f}; H2-B median {st.median(h2):+.3f} mean {st.mean(h2):+.3f}; "
          f"per-round mean of the two arms less B: median {st.median(both):+.3f} mean {st.mean(both):+.3f} sd {st.stdev(both):.3f}; "
          f"positive H {sum(x > 0 for x in h)}/8, H2 {sum(x > 0 for x in h2)}/8")
pos = {}
for r in R:
    for i, x in enumerate(sorted(by[r].values(), key=lambda x: int(x["seq"]))): pos.setdefault(i, []).append(float(x["wall_s"]))
print("wall mean by position in the round:", {k: round(st.mean(v), 3) for k, v in pos.items()})
tw = []
for f in sys.argv[1:]:
    b, r = load(f); d = st.median(g(b, q, "H2") - g(b, q, "H") for q in r); tw.append(d)
    print(f"twin paired median wall {d:+.3f}  n {len(r)}  {'/'.join(f.split('/')[-4:-1])}")
rms = math.sqrt(sum(x * x for x in tw) / len(tw))
print(f"clean reads {len(tw)}; RMS of the twin paired median {rms:.3f} s")
phi = lambda z: 0.5 * (1 + math.erf(z / math.sqrt(2)))
for t in (0.175, 0.155, 0.10, 0.085, 0.065, 0.035, 0.02, 0.0):
    print(f"true H-B {t:+.3f}: chance a read lands <= +0.10 is {phi((0.10 - t) / rms):.2f}")
print("float: 9.40 - 9.30 =", repr(9.40 - 9.30), "reads <= 0.10:", 9.40 - 9.30 <= 0.10)
