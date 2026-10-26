"""qe-ABC-215: D over games that touch no load1 > 8 sample (reported beside the all-games and vitest-overlap-free figures).
usage: python3 -I load-free.py <reading-dir>   (elo() is analyse.py's port of cutechess elo.cpp)"""
import math, re, sys
from datetime import datetime, timedelta, timezone
d = sys.argv[1]
def erf_inv(x):
    pi = 3.1415926535897; a = 8.0 * (pi - 3.0) / (3.0 * pi * (4.0 - pi)); y = math.log(1.0 - x * x); z = 2.0 / (pi * a) + y / 2.0
    r = math.sqrt(math.sqrt(z * z - y / a) - z); return -r if x < 0 else r
def phi_inv(p): return math.sqrt(2.0) * erf_inv(2.0 * p - 1.0)
def elo_of(p): return -400.0 * math.log10(1.0 / p - 1.0)
def elo(w, l, dr):
    n = w + l + dr; mu = (w + dr / 2) / n
    sd = math.sqrt((w / n) * (1 - mu) ** 2 + (l / n) * mu ** 2 + (dr / n) * (0.5 - mu) ** 2) / math.sqrt(n)
    return {"n": n, "W": w, "L": l, "D": dr, "X": round(elo_of(mu), 2), "Y": round((elo_of(mu + phi_inv(0.975) * sd) - elo_of(mu + phi_inv(0.025) * sd)) / 2, 2)}
def pt(s):
    m = re.match(r"(\S+) GMT([+-]\d+)", s); return datetime.fromisoformat(m.group(1)).replace(tzinfo=timezone(timedelta(hours=int(m.group(2)))))
games = []
for ch in re.split(r"\n(?=\[Event )", open(f"{d}/out/d.pgn").read().strip()):
    t = dict(re.findall(r'^\[(\w+) "(.*)"\]$', ch, re.M)); games.append((t["White"], t["Result"], pt(t["GameStartTime"]), pt(t["GameEndTime"]), int(t["Round"])))
hi = []
for l in open(f"{d}/mon/sampler.log"):
    m = re.match(r"(\S+Z) load1=(\S+)", l)
    if m and float(m.group(2)) > 8: hi.append(datetime.fromisoformat(m.group(1).replace("Z", "+00:00")))
def wld(gs):
    w = l = dr = 0
    for white, res, *_ in gs:
        if res == "1/2-1/2": dr += 1
        elif (res == "1-0") == (white == "skytalix"): w += 1
        else: l += 1
    return w, l, dr
touch = [g for g in games if any(g[2] <= t <= g[3] for t in hi)]
free = [g for g in games if g not in touch]
print("load>8 samples", len(hi), [t.isoformat() for t in hi])
print("games touching", len(touch), "rounds", sorted({g[4] for g in touch}))
print("all", elo(*wld(games)))
print("load-free", elo(*wld(free)))
