"""qe-ABC-210: the S1 pooled figure. W/L/D = sum of the two readings' own final "Score of" lines; X +/- Y by analyse.py's
port of cutechess elo.cpp (checked equal to the tool line on d1 and d2). usage: python3 -I pool.py <d1> <d2>"""
import json, math, re, sys
def erf_inv(x):
    pi = 3.1415926535897; a = 8.0 * (pi - 3.0) / (3.0 * pi * (4.0 - pi)); y = math.log(1.0 - x * x); z = 2.0 / (pi * a) + y / 2.0
    r = math.sqrt(math.sqrt(z * z - y / a) - z); return -r if x < 0 else r
def phi_inv(p): return math.sqrt(2.0) * erf_inv(2.0 * p - 1.0)
def elo_of(p): return -400.0 * math.log10(1.0 / p - 1.0)
def elo(w, l, dr):
    n = w + l + dr; mu = (w + dr / 2) / n
    sd = math.sqrt((w / n) * (1 - mu) ** 2 + (l / n) * mu ** 2 + (dr / n) * (0.5 - mu) ** 2) / math.sqrt(n)
    x = elo_of(mu); y = (elo_of(mu + phi_inv(0.975) * sd) - elo_of(mu + phi_inv(0.025) * sd)) / 2
    los = 100 * 0.5 * (1 + math.erf(((w - l) / math.sqrt(w + l)) / math.sqrt(2)))
    st = "GAIN" if x - y > 0 else "LOSS" if x + y < 0 else "NEUTRAL"
    return {"n": n, "W": w, "L": l, "D": dr, "score": round(mu, 4), "X": round(x, 2), "Y": round(y, 2), "X-Y": round(x - y, 2), "X+Y": round(x + y, 2), "LOS": round(los, 1), "draw_ratio": round(100 * dr / n, 1), "state": st}
tot = [0, 0, 0]
for d in sys.argv[1:]:
    line = [l for l in open(f"{d}/out/d.out", encoding="utf-8", errors="replace") if l.startswith("Score of ")][-1]
    w, l, dr = map(int, re.search(r": (\d+) - (\d+) - (\d+)", line).groups())
    print(d.rsplit("/", 1)[-1], line.strip(), json.dumps(elo(w, l, dr)))
    tot = [tot[0] + w, tot[1] + l, tot[2] + dr]
print("pooled", json.dumps(elo(*tot)))
