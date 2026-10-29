"""Scores by opening, pentanomial errors, paired R2-R1, subsets, result types."""
import json, math, sys, statistics as st
from collections import Counter, defaultdict

D = json.load(open(sys.argv[1]))
ME = {"R1": "skytalix", "R2": "skytalix", "D": "skytalix"}


def elo(s):
    s = min(max(s, 1e-9), 1 - 1e-9)
    return -400 * math.log10(1 / s - 1)


def delo_ds(s):
    return 400 / math.log(10) / (s * (1 - s))


def score_of(g, me):
    r = g["result"]
    if r == "1/2-1/2":
        return 0.5
    w = r == "1-0"
    return 1.0 if (g["white"] == me) == w else 0.0


def summarize(games, me, label):
    sc = [score_of(g, me) for g in games]
    n = len(sc)
    m = sum(sc) / n
    W = sc.count(1.0); L = sc.count(0.0); Dr = sc.count(0.5)
    # trinomial
    var = sum((x - m) ** 2 for x in sc) / n
    se_t = math.sqrt(var / n)
    # pentanomial by round
    byr = defaultdict(list)
    for g, x in zip(games, sc):
        byr[g["round"]].append(x)
    pairs = [sum(v) / len(v) for v in byr.values() if len(v) == 2]
    if pairs:
        pm = sum(pairs) / len(pairs)
        pv = sum((x - pm) ** 2 for x in pairs) / len(pairs)
        se_p = math.sqrt(pv / len(pairs))
    else:
        se_p = float('nan')
    k = delo_ds(m)
    print(f"{label:28s} n={n:3d} W/L/D={W}/{L}/{Dr} s={m:.4f} elo={elo(m):+7.1f} "
          f"±tri {1.96*k*se_t:5.1f} ±penta {1.96*k*se_p:5.1f}")
    return m, k * se_t, k * se_p, byr


out = {}
for key in ("R1", "R2", "D"):
    gs = D[key]["games"]
    out[key] = summarize(gs, "skytalix", key + " all")
    summarize([g for g in gs if g["round"] <= 50], "skytalix", key + " openings 1-50")
    if key != "D":
        summarize([g for g in gs if g["round"] > 50], "skytalix", key + " openings 51-100")
    for col in ("white", "black"):
        summarize([g for g in gs if (g["white"] == "skytalix") == (col == "white")], "skytalix", f"{key} skytalix as {col}")

# paired R2-R1 by opening (same 100 openings, same colours)
b1 = out["R1"][3]; b2 = out["R2"][3]
diffs = [sum(b2[r]) / 2 - sum(b1[r]) / 2 for r in range(1, 101)]
md = sum(diffs) / 100
sd = math.sqrt(sum((x - md) ** 2 for x in diffs) / 100 / 100)
m1, m2 = out["R1"][0], out["R2"][0]
print(f"paired R2-R1 score diff {md:+.4f} se {sd:.4f}; elo diff {elo(m2)-elo(m1):+.1f}")
# delta method: elo2 - elo1 with covariance from pairing
k1 = delo_ds(m1); k2 = delo_ds(m2)
p1 = [sum(b1[r]) / 2 for r in range(1, 101)]; p2 = [sum(b2[r]) / 2 for r in range(1, 101)]
mp1, mp2 = sum(p1) / 100, sum(p2) / 100
v1 = sum((x - mp1) ** 2 for x in p1) / 100 / 100
v2 = sum((x - mp2) ** 2 for x in p2) / 100 / 100
cov = sum((a - mp1) * (b - mp2) for a, b in zip(p1, p2)) / 100 / 100
var_d = k2 * k2 * v2 + k1 * k1 * v1 - 2 * k1 * k2 * cov
print(f"elo diff ± (paired, penta, 95%) {1.96*math.sqrt(var_d):.1f}; unpaired penta ± {1.96*math.sqrt(k2*k2*v2+k1*k1*v1):.1f}; corr(p1,p2)={cov/math.sqrt(v1*v2):.3f}")
for lo, hi in ((1, 50), (51, 100)):
    a = [sum(b1[r]) / 2 for r in range(lo, hi + 1)]; b = [sum(b2[r]) / 2 for r in range(lo, hi + 1)]
    ma, mb = sum(a) / len(a), sum(b) / len(b)
    print(f"  openings {lo}-{hi}: R1 {elo(ma):+.1f} R2 {elo(mb):+.1f} diff {elo(mb)-elo(ma):+.1f}")
# pair outcome table R1 vs R2 per round
ct = Counter((sum(b1[r]), sum(b2[r])) for r in range(1, 101))
print("pair-sum R1 -> R2 crosstab:", sorted(ct.items()))
# D by opening vs R per opening
bd = out["D"][3]
pd = [sum(bd[r]) / 2 for r in range(1, 51)]
r21 = [diffs[r - 1] for r in range(1, 51)]
mpd = sum(pd) / 50; mr = sum(r21) / 50
c = sum((a - mpd) * (b - mr) for a, b in zip(pd, r21)) / 50
va = sum((a - mpd) ** 2 for a in pd) / 50; vb = sum((b - mr) ** 2 for b in r21) / 50
print(f"corr over openings 1-50 of D pair score and R2-R1 pair diff: {c/math.sqrt(va*vb):+.3f}")

# result types
for key in ("R1", "R2", "D"):
    gs = D[key]["games"]
    c = Counter()
    for g in gs:
        s = score_of(g, "skytalix")
        c[(("W" if s == 1 else "L" if s == 0 else "D"), g["term"])] += 1
    print(key, dict(c))
    # plies of wins/losses
    for lab, val in (("win", 1.0), ("loss", 0.0), ("draw", 0.5)):
        pl = [g["plies"] for g in gs if score_of(g, "skytalix") == val]
        if pl:
            q = st.quantiles(pl, n=4) if len(pl) > 1 else [pl[0]] * 3
            print(f"   {lab}: n={len(pl)} plies median {st.median(pl)} q1 {q[0]} q3 {q[2]} "
                  f"short(<=60) {sum(p<=60 for p in pl)} mid(61-120) {sum(60<p<=120 for p in pl)} long(>120) {sum(p>120 for p in pl)}")
