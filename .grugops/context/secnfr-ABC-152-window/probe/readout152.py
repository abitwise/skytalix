# secnfr-ABC-152-window: read the window's TSVs and print every number the notes use. Reads only; writes nothing.
# Shaped on secnfr-ABC-151-window/probe/readout151.py (same kof/rof order statistics, ADR-0035 d1).
# Usage: python3 -I readout152.py <w152 dir>            -> the full readout
#        python3 -I readout152.py <w152 dir> --owed     -> exit 0 if the cooled state is owed (H warm median wall +
#                                                          T wall R > 9.0 s, ticket V10), exit 1 if not
import sys, os, statistics as st
from math import comb
from collections import Counter

D = sys.argv[1]
W = 10.0
OWED_AT = 9.0
BAR = -0.15  # V9: H - B paired median CPU <= -15 % of B's median merges


def rows_of(tag):
    p = os.path.join(D, f"{tag}.tsv")
    if not os.path.exists(p):
        return []
    out = []
    with open(p) as fh:
        hdr = fh.readline().rstrip("\n").split("\t")
        for line in fh:
            f = dict(zip(hdr, line.rstrip("\n").split("\t")))
            for k in ("round", "wall", "cpu", "par", "files", "tests", "load1_before", "load1_after", "foreign_vitest", "foreign_after"):
                f[k] = float(f[k])
            out.append(f)
    return out


def kof(n):
    k = 1
    for c in range(2, n // 2 + 1):
        if 1 - 2 * sum(comb(n, i) for i in range(c)) / 2 ** n >= 0.92:
            k = c
    return k


def rof(ds):
    s = sorted(ds); n = len(s); k = kof(n)
    return k, s[k - 1], s[n - k], max(abs(s[k - 1]), abs(s[n - k]))


def lvl(x):
    try:
        return int(x)
    except ValueError:
        return -1


def paired(by, c, key):
    return [r[key] - next(b[key] for b in by["B"] if b["round"] == r["round"]) for r in by[c]]


def grade(tag, verbose=True):
    rows = rows_of(tag)
    if not rows:
        return None
    sc = [r for r in rows if r["round"] >= 1]
    by = {c: [r for r in sc if r["cond"] == c] for c in ("B", "H", "T")}
    med = {c: dict(cpu=st.median(r["cpu"] for r in g), wall=st.median(r["wall"] for r in g)) for c, g in by.items()}
    res = {}
    for c in ("H", "T"):
        for key in ("cpu", "wall"):
            d = paired(by, c, key)
            k, lo, hi, R = rof(d)
            res[(c, key)] = dict(m=st.median(d), lo=lo, hi=hi, R=R, pos=sum(x > 0 for x in d), n=len(d), k=k, d=d)
    out = dict(rows=rows, by=by, med=med, res=res)
    if not verbose:
        return out
    print(f"\n=== {tag}: {len(rows)} runs, harness errors {sum(r['status'] != 'ok' for r in rows)}, utc {rows[0]['utc']} .. {rows[-1]['utc']}")
    for c, g in by.items():
        cpu = [r["cpu"] for r in g]; wall = [r["wall"] for r in g]; lb = [r["load1_before"] for r in g]
        print(f"  {c} n={len(g)} cpu {med[c]['cpu']:.2f} ({min(cpu):.2f}-{max(cpu):.2f}) wall {med[c]['wall']:.2f} ({min(wall):.2f}-{max(wall):.2f}) "
              f"par {st.median(r['par'] for r in g):.3f} load1b {st.median(lb):.2f} ({min(lb):.2f}-{max(lb):.2f}) load1b>8 {sum(x > 8 for x in lb)}/{len(g)} "
              f"files {sorted(set(int(r['files']) for r in g))} tests {sorted(set(int(r['tests']) for r in g))} "
              f"foreign_before {dict(Counter(int(r['foreign_vitest']) for r in g))} foreign_after {dict(Counter(int(r['foreign_after']) for r in g))} "
              f"power {sorted(set(r['power'] for r in g) | set(r['power_after'] for r in g))} speed_limit {sorted(set(r['speed_limit'] for r in g))}")
    print("  round 0 (discarded): " + ", ".join(f"{r['cond']} cpu {r['cpu']} wall {r['wall']} files {int(r['files'])} tests {int(r['tests'])} {r['status']}" for r in rows if r["round"] == 0))
    bcpu = med["B"]["cpu"]
    for c in ("H", "T"):
        for key in ("cpu", "wall"):
            x = res[(c, key)]
            pct = f" ({100*x['m']/bcpu:+.2f} % of B cpu; interval {100*x['lo']/bcpu:+.2f}..{100*x['hi']/bcpu:+.2f} %)" if key == "cpu" else ""
            print(f"  {c}-B {key} median {x['m']:+.3f}{pct} sign+ {x['pos']}/{x['n']} k {x['k']} interval [{x['lo']:+.3f}, {x['hi']:+.3f}] R {x['R']:.3f}")
            print(f"      per-round deltas {[round(v, 2) for v in x['d']]}")
    t = res[("T", "cpu")]; kk = kof(t["n"])
    adm35 = abs(t["m"]) <= 0.015 * bcpu and kk <= t["pos"] <= t["n"] - kk
    adm152 = t["R"] <= 0.15 * bcpu
    print(f"  TWIN: cpu median {100*t['m']/bcpu:+.2f} % of B (ADR-0035 d1 limit 1.5 %), sign {t['pos']}/{t['n']} (chance band {kk}..{t['n']-kk}) -> ADR-0035 d1 admissible {adm35}")
    print(f"        cpu R {t['R']:.3f} s = {100*t['R']/bcpu:.2f} % of B (ticket V9: <= 15 %) -> ticket admissible {adm152}; wall R {res[('T','wall')]['R']:.3f} s")
    h = res[("H", "cpu")]; dpct = h["m"] / bcpu; hi = h["hi"] / bcpu
    if dpct <= BAR:
        band = "MERGES (<= -15 %)"
    elif dpct < 0 and h["hi"] < 0:
        band = "OWNER (between -15 % and 0, interval wholly below 0)"
    else:
        band = "NO MERGE (any other result)"
    print(f"  V9: H-B cpu median {h['m']:+.3f} s = {100*dpct:+.2f} % of B median {bcpu:.2f} s; interval [{100*h['lo']/bcpu:+.2f} %, {100*hi:+.2f} %]; sign {h['pos']}/{h['n']} -> {band}")
    print(f"      ratio of medians H/B cpu {med['H']['cpu']/bcpu:.4f}; the bar at -15 % is {BAR*bcpu:+.3f} s")
    tw = res[("T", "wall")]["R"]; v10 = med["H"]["wall"] + tw; hw = res[("H", "wall")]
    print(f"  V10: H wall median {med['H']['wall']:.3f} + T wall R {tw:.3f} = {v10:.3f} s (<= 10 s: {v10 <= W}; > 9.0 s cooled owed: {v10 > OWED_AT})")
    print(f"       H-B paired median wall {hw['m']:+.3f} s, interval [{hw['lo']:+.3f}, {hw['hi']:+.3f}] <= + T wall R {tw:.3f}: {hw['m'] <= tw}")
    print("  V11, runs with thermal level >= 1 (before OR after), per arm:")
    for c in ("B", "H", "T"):
        allr = [r for r in rows if r["cond"] == c]
        hot = [r for r in allr if lvl(r["thermal_before"]) >= 1 or lvl(r["thermal_after"]) >= 1]
        hs = [r for r in hot if r["round"] >= 1]
        mx = max(max(lvl(r["thermal_before"]), lvl(r["thermal_after"])) for r in allr)
        print(f"    {c}: {len(hs)}/{len([r for r in allr if r['round'] >= 1])} scored runs ({len(hot)}/{len(allr)} incl. round 0); max level {mx}; "
              f"before {dict(sorted(Counter(r['thermal_before'] for r in allr).items()))} after {dict(sorted(Counter(r['thermal_after'] for r in allr).items()))}")
    fr = [r for r in rows if r["foreign_vitest"] > 0]
    print(f"  foreign runner present before {len(fr)}/{len(rows)} runs: {[(int(r['round']), r['cond']) for r in fr]}")
    over = [r for r in rows if r["wall"] > W]
    print(f"  runs over W = 10 s: {[(int(r['round']), r['cond'], r['wall']) for r in over]}")
    return out


if len(sys.argv) > 2 and sys.argv[2] == "--owed":
    g = grade("abc152-warm", verbose=False)
    v10 = g["med"]["H"]["wall"] + g["res"][("T", "wall")]["R"]
    print(f"owed check: H warm median wall + T wall R = {v10:.3f} s; owed {v10 > OWED_AT}")
    sys.exit(0 if v10 > OWED_AT else 1)

for tag in ("abc152-warm", "abc152-cooled"):
    grade(tag)

pz = os.path.join(D, "abc152-puzzle.tsv")
if os.path.exists(pz):
    with open(pz) as fh:
        hdr = fh.readline().rstrip("\n").split("\t")
        P = [dict(zip(hdr, l.rstrip("\n").split("\t"))) for l in fh]
    print(f"\n=== abc152-puzzle (RISK-ABC152-PUZZLE-SPY, not a gate): {len(P)} runs")
    for r in P:
        print("  " + " | ".join(f"{k}={r[k]}" for k in hdr))
    s = [r for r in P if int(r["round"]) >= 1]
    for c in ("B", "H"):
        g = [r for r in s if r["cond"] == c]
        f = lambda k: [float(r[k]) for r in g if r[k]]
        print(f"  {c} n={len(g)} exits {sorted(set(r['exit'] for r in g))} printed PUZZLES wall median {st.median(f('printed_puzzles_wall')):.2f} ({min(f('printed_puzzles_wall')):.2f}-{max(f('printed_puzzles_wall')):.2f}) "
              f"process wall median {st.median(f('wall')):.2f} ({min(f('wall')):.2f}-{max(f('wall')):.2f}) cpu median {st.median(f('cpu')):.2f} "
              f"solved {sorted(set(r['solved'] for r in g))} tests {sorted(set(r['tests_line'] for r in g))}")
    for key in ("printed_puzzles_wall", "wall", "cpu"):
        d = [float(h[key]) - float(next(b for b in s if b["cond"] == "B" and b["round"] == h["round"])[key]) for h in s if h["cond"] == "H"]
        print(f"  H-B {key}: per round {[round(x, 2) for x in d]}, median {st.median(d):+.2f}")
