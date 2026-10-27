"""qe-ABC-209: D split by the power source at each game's start (reported, never graded).
usage: python3 -I power-split.py <reading-dir>   (elo() = load-free.py's port of cutechess elo.cpp)"""
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
smp = []
for l in open(f"{d}/mon/sampler.log"):
    m = re.match(r"(\S+Z) load1=\S+ power=(\S+)", l)
    if m: smp.append((datetime.fromisoformat(m.group(1).replace("Z", "+00:00")), m.group(2)))
def power_at(t):
    p = smp[0][1]
    for s, q in smp:
        if s > t: break
        p = q
    return p
groups = {}
for ch in re.split(r"\n(?=\[Event )", open(f"{d}/out/d.pgn").read().strip()):
    t = dict(re.findall(r'^\[(\w+) "(.*)"\]$', ch, re.M))
    groups.setdefault(power_at(pt(t["GameStartTime"])), []).append((t["White"], t["Result"]))
for p, gs in groups.items():
    w = l = dr = 0
    for white, res in gs:
        if res == "1/2-1/2": dr += 1
        elif (res == "1-0") == (white == "skytalix"): w += 1
        else: l += 1
    print(p, elo(w, l, dr))
