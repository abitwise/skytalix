"""QE A3 spot check, written independently of tools/rating/pair.ts.

Pair: X2 - X1 +/- sqrt(Y1^2 + Y2^2) from the printed lines.
Pentanomial (opening-paired): per opening, skytalix's mean score over its 2 games; Elo of each
build's mean score; delta-method variance with the cross-build covariance; 1.96.
Usage: a3check.py <r1.pgn> <r2.pgn> <x1> <y1> <x2> <y2>
"""
import math
import re
import sys


def games(path):
    out, cur = [], {}
    for line in open(path):
        m = re.match(r'^\[(\w+) "(.*)"\]', line)
        if m:
            cur[m.group(1)] = m.group(2)
            if m.group(1) == "Result":
                pass
        elif line.strip() == "" and "Result" in cur and cur.get("_done") is None and "White" in cur:
            pass
        if m and m.group(1) == "WhiteTimeControl":
            out.append(cur)
            cur = {}
    return out


def score(g):
    sky_white = g["White"] == "skytalix"
    r = g["Result"]
    if r == "1/2-1/2":
        return 0.5
    if r == "1-0":
        return 1.0 if sky_white else 0.0
    if r == "0-1":
        return 0.0 if sky_white else 1.0
    raise ValueError(r)


def per_opening(path):
    gs = games(path)
    assert len(gs) == 200, len(gs)
    by = {}
    for g in gs:
        by.setdefault(int(g["Round"]), []).append(g)
    res = {}
    for rnd, pair in by.items():
        assert len(pair) == 2, (rnd, len(pair))
        assert {p["White"] for p in pair} == {"skytalix", "stockfish"}
        f = {" ".join(p["FEN"].split()[:2]) for p in pair}
        assert len(f) == 1, (rnd, f)
        res[rnd] = sum(score(p) for p in pair) / 2
    return res


def elo(s):
    return -400 * math.log10(1 / s - 1)


def g(s):
    return 400 / (math.log(10) * s * (1 - s))


a, b = per_opening(sys.argv[1]), per_opening(sys.argv[2])
keys = sorted(set(a) & set(b))
n = len(keys)
x = [a[k] for k in keys]
y = [b[k] for k in keys]
mx, my = sum(x) / n, sum(y) / n
for ddof in (0, 1):
    vx = sum((v - mx) ** 2 for v in x) / (n - ddof)
    vy = sum((v - my) ** 2 for v in y) / (n - ddof)
    cxy = sum((x[i] - mx) * (y[i] - my) for i in range(n)) / (n - ddof)
    var = (g(mx) ** 2 * vx + g(my) ** 2 * vy - 2 * g(mx) * g(my) * cxy) / n
    corr = cxy / math.sqrt(vx * vy)
    print(f"ddof={ddof}: n={n} s1={mx:.4f} s2={my:.4f} diff={elo(my) - elo(mx):.2f} +/- {1.96 * math.sqrt(var):.2f} corr={corr:.3f}")
x1, y1, x2, y2 = map(float, sys.argv[3:7])
print(f"pair: {x2 - x1:.1f} +/- {math.sqrt(y1 ** 2 + y2 ** 2):.3f}")
