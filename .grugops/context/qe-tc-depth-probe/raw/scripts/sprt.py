# qe-tc-depth-probe: SPRT expected-game arithmetic (estimate, not a reading). Logistic Elo, trinomial W/D/L with a fixed
# draw ratio, alpha = beta = 0.05, Wald's approximations for the OC and the ASN, plus a seeded Monte Carlo check.
# usage: python3 -I sprt.py <draw-ratio> <gph-100> <gph-500> [mc-sims]
import math, random, sys
d = float(sys.argv[1]); gph = {"100 ms": float(sys.argv[2]), "500 ms": float(sys.argv[3])}
sims = int(sys.argv[4]) if len(sys.argv) > 4 else 0
alpha = beta = 0.05
A = math.log(beta / (1 - alpha)); B = math.log((1 - beta) / alpha)
def probs(elo):
    s = 1 / (1 + 10 ** (-elo / 400)); w = s - d / 2; l = 1 - s - d / 2
    assert w > 0 and l > 0, (elo, w, l)
    return (w, d, l)
def asn(elo0, elo1, true):
    p0, p1, pt = probs(elo0), probs(elo1), probs(true)
    z = [math.log(a / b) for a, b in zip(p1, p0)]
    mu = sum(p * zi for p, zi in zip(pt, z))
    if abs(mu) < 1e-12:
        return -A * B / sum(p * zi * zi for p, zi in zip(pt, z)), 0.5
    f = lambda h: sum(p * math.exp(h * zi) for p, zi in zip(pt, z)) - 1
    lo, hi = (1e-6, 50.0) if mu < 0 else (-50.0, -1e-6)  # nonzero root has the sign opposite to mu
    for _ in range(200):
        mid = (lo + hi) / 2
        if (f(lo) > 0) == (f(mid) > 0): lo = mid
        else: hi = mid
    h = (lo + hi) / 2
    L = (math.exp(h * B) - 1) / (math.exp(h * B) - math.exp(h * A))  # P(accept H0)
    return (L * A + (1 - L) * B) / mu, 1 - L
def mc(elo0, elo1, true, n, seed=20261101):
    p0, p1, pt = probs(elo0), probs(elo1), probs(true)
    z = [math.log(a / b) for a, b in zip(p1, p0)]
    rng = random.Random(seed); tot = 0; acc = 0
    for _ in range(n):
        llr = 0.0; k = 0
        while A < llr < B:
            r = rng.random(); i = 0 if r < pt[0] else (1 if r < pt[0] + pt[1] else 2)
            llr += z[i]; k += 1
        tot += k; acc += llr >= B
    return tot / n, acc / n
print(f"draw ratio {d:.2f}; alpha = beta = 0.05; A = {A:.4f}, B = {B:.4f}")
print("bounds | true Elo | E[games] (Wald) | P(H1) | " + " | ".join(f"h at {k} ({v:.1f}/h)" for k, v in gph.items()) + (" | MC games / P(H1)" if sims else ""))
for e0, e1 in [(0, 10), (0, 30), (0, 50)]:
    for t in [-e1 / 2, 0, e1 / 2, e1, 2 * e1]:
        n, p = asn(e0, e1, t)
        row = f"[{e0},{e1}] | {t:+g} | {n:,.0f} | {p:.2f} | " + " | ".join(f"{n / v:.1f}" for v in gph.values())
        if sims: m, pa = mc(e0, e1, t, sims); row += f" | {m:,.0f} / {pa:.2f}"
        print(row)
# fixed-N resolution (the owner's 2026-11-01 rule: 100 games per change, 400 per epic): 95 % half-width at a 50 % score
for N in (100, 400):
    sd = math.sqrt((1 - d) * 0.25 / N)  # per-game score variance at s = 0.5: (1-d)/4
    dE = 400 / math.log(10) / (0.5 * 0.5) * 1.96 * sd
    print(f"fixed N = {N}: score SE {sd:.4f}, 95 % half-width about +/-{dE:.0f} Elo; " + "; ".join(f"{N / v:.2f} h at {k}" for k, v in gph.items()))
