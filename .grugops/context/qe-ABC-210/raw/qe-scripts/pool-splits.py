"""qe-ABC-210: pooled d1+d2 splits, reported only (never graded). elo() = pool.py's port of cutechess elo.cpp.
usage: python3 -I pool-splits.py   (W/L/D taken from each reading's analyse/load-free/power-split output, pasted below)"""
import math
def erf_inv(x):
    pi = 3.1415926535897; a = 8.0 * (pi - 3.0) / (3.0 * pi * (4.0 - pi)); y = math.log(1.0 - x * x); z = 2.0 / (pi * a) + y / 2.0
    r = math.sqrt(math.sqrt(z * z - y / a) - z); return -r if x < 0 else r
def phi_inv(p): return math.sqrt(2.0) * erf_inv(2.0 * p - 1.0)
def elo_of(p): return -400.0 * math.log10(1.0 / p - 1.0)
def elo(w, l, dr):
    n = w + l + dr; mu = (w + dr / 2) / n
    sd = math.sqrt((w / n) * (1 - mu) ** 2 + (l / n) * mu ** 2 + (dr / n) * (0.5 - mu) ** 2) / math.sqrt(n)
    x = elo_of(mu); y = (elo_of(mu + phi_inv(0.975) * sd) - elo_of(mu + phi_inv(0.025) * sd)) / 2
    return {"n": n, "W": w, "L": l, "D": dr, "X": round(x, 2), "Y": round(y, 2), "state": "GAIN" if x - y > 0 else "LOSS" if x + y < 0 else "NEUTRAL"}
S = {"vitest-overlap-free": [(57, 58, 141), (87, 96, 217)], "load-free": [(69, 68, 167), (78, 92, 208)],
     "AC at game start": [(89, 91, 220), (46, 46, 119)], "battery at game start": [(0, 0, 0), (41, 50, 98)]}
for k, parts in S.items():
    w, l, d = (sum(p[i] for p in parts) for i in range(3)); print("pooled", k, elo(w, l, d))
