"""qe-ABC-225-w1: the pair and the opening-paired (pentanomial) line from two block PGNs, by QE.
Per opening: skytalix's mean score over its 2 games; Elo of each build's mean; delta-method variance with the
cross-build covariance (population form, as qe-ABC-225 / an1 took it); 1.96.  usage: penta.py <base.pgn> <cand.pgn> x1 y1 x2 y2
"""
import math
import re
import sys


def per_opening(path):
    by = {}
    for g in re.split(r"\n(?=\[Event )", open(path).read()):
        t = dict(re.findall(r'^\[(\w+) "(.*)"\]$', g, re.M))
        if "Result" not in t:
            continue
        r = t["Result"]
        s = 0.5 if r == "1/2-1/2" else (1.0 if (r == "1-0") == (t["White"] == "skytalix") else 0.0)
        by.setdefault(int(t["Round"]), []).append(s)
    return {k: sum(v) / 2 for k, v in by.items() if len(v) == 2}


elo = lambda s: -400 * math.log10(1 / s - 1)  # noqa: E731
gd = lambda s: 400 / (math.log(10) * s * (1 - s))  # noqa: E731
a, b = per_opening(sys.argv[1]), per_opening(sys.argv[2])
k = sorted(set(a) & set(b)); n = len(k)
x = [a[i] for i in k]; y = [b[i] for i in k]
mx, my = sum(x) / n, sum(y) / n
vx = sum((v - mx) ** 2 for v in x) / n; vy = sum((v - my) ** 2 for v in y) / n
c = sum((x[i] - mx) * (y[i] - my) for i in range(n)) / n
var = (gd(mx) ** 2 * vx + gd(my) ** 2 * vy - 2 * gd(mx) * gd(my) * c) / n
print(f"pentanomial: n={n} s_base={mx:.3f} s_cand={my:.3f} diff={elo(my) - elo(mx):.1f} +/- {1.96 * math.sqrt(var):.1f} r={c / math.sqrt(vx * vy):.3f}")
x1, y1, x2, y2 = map(float, sys.argv[3:7])
print(f"pair: {x2 - x1:.1f} +/- {math.hypot(y1, y2):.1f}")
