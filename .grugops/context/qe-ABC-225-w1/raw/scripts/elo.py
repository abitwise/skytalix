"""qe-ABC-225-w1: cutechess-cli 1.5.1's Elo line (elo.cpp), re-typed by QE independently of tools/rating/pair.ts.
usage: python3 -I elo.py W L D  -> prints 'X +/- Y' to one decimal, as cutechess-cli prints it.
"""
import math
import sys

PI = 3.1415926535897  # elo.cpp's truncated pi


def erf_inv(x):
    a = 8.0 * (PI - 3.0) / (3.0 * PI * (4.0 - PI))
    y = math.log(1.0 - x * x)
    z = 2.0 / (PI * a) + y / 2.0
    r = math.sqrt(math.sqrt(z * z - y / a) - z)
    return -r if x < 0 else r


def phi_inv(p):
    return math.sqrt(2.0) * erf_inv(2.0 * p - 1.0)


def diff(p):
    return -400.0 * math.log10(1.0 / p - 1.0)


def elo(w, l, d):
    n = w + l + d
    mu = (w + d / 2.0) / n
    sd = math.sqrt(w / n * (1 - mu) ** 2 + l / n * mu ** 2 + d / n * (0.5 - mu) ** 2) / math.sqrt(n)
    lo, hi = mu + phi_inv(0.025) * sd, mu + phi_inv(0.975) * sd
    return diff(mu), (diff(hi) - diff(lo)) / 2.0


if __name__ == "__main__":
    w, l, d = map(int, sys.argv[1:4])
    x, y = elo(w, l, d)
    print(f"{x:.1f} +/- {y:.1f}")
