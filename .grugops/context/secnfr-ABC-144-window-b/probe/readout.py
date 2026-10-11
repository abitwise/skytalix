# secnfr-ABC-144-window-b: read the three Window B TSVs and the sampler; print every number the notes use.
# Usage: python3 -I readout.py <winb dir>. Reads only; writes nothing.
import sys, os, statistics as st
from math import comb
from collections import Counter

D = sys.argv[1]
W = 10.0      # NFR-008 R-1 level, s
F = 1.097     # AR-N8SPAWN-DRIFT floor for src/cli.test.ts, s CPU


def load(tag):
    rows = []
    with open(os.path.join(D, f"{tag}.tsv")) as fh:
        hdr = fh.readline().rstrip("\n").split("\t")
        for line in fh:
            f = dict(zip(hdr, line.rstrip("\n").split("\t")))
            for k in ("round", "wall", "cpu", "par", "files", "tests", "load1_before", "load1_after", "foreign_vitest", "foreign_after"):
                f[k] = float(f[k])
            rows.append(f)
    return rows


def kof(n):
    k = 1
    for c in range(2, n // 2 + 1):
        tail = sum(comb(n, i) for i in range(c))
        if 1 - 2 * tail / 2 ** n >= 0.92:
            k = c
    return k


def rof(ds):
    s = sorted(ds); n = len(s); k = kof(n)
    return k, s[k - 1], s[n - k], max(abs(s[k - 1]), abs(s[n - k]))


def med(xs):
    return st.median(xs)


def report(tag):
    rows = load(tag)
    sc = [r for r in rows if r["round"] >= 1]
    print(f"\n=== {tag}: {len(rows)} runs, scored {len(sc)}, errors(all) {sum(r['status'] != 'ok' for r in rows)}, errors(scored) {sum(r['status'] != 'ok' for r in sc)}")
    print(f"  utc {rows[0]['utc']} .. {rows[-1]['utc']}")
    by = {c: [r for r in sc if r["cond"] == c] for c in ("B", "H", "T")}
    out = {}
    for c, g in by.items():
        cpu = [r["cpu"] for r in g]; wall = [r["wall"] for r in g]; par = [r["par"] for r in g]
        lb = [r["load1_before"] for r in g]; la = [r["load1_after"] for r in g]
        q = st.quantiles(wall, n=4)
        out[c] = dict(cpu=med(cpu), wall=med(wall), par=med(par))
        print(f"  {c} n={len(g)} cpu {med(cpu):.2f} ({min(cpu):.2f}-{max(cpu):.2f}) wall {med(wall):.2f} ({min(wall):.2f}-{max(wall):.2f}) wallIQR {q[2]-q[0]:.3f} "
              f"par {med(par):.3f} load1b {med(lb):.2f} ({min(lb):.2f}-{max(lb):.2f}) load1a {med(la):.2f} ({min(la):.2f}-{max(la):.2f}) load1b>8 {sum(x>8 for x in lb)}/{len(g)} "
              f"files {set(int(r['files']) for r in g)} tests {set(int(r['tests']) for r in g)} fv_b {max(r['foreign_vitest'] for r in g):.0f} fv_a {max(r['foreign_after'] for r in g):.0f} "
              f"power {set(r['power'] for r in g) | set(r['power_after'] for r in g)} speed_limit {set(r['speed_limit'] for r in g)}")
        print(f"     thermal_before {dict(sorted(Counter(r['thermal_before'] for r in g).items()))} thermal_after {dict(sorted(Counter(r['thermal_after'] for r in g).items()))}")
    allc = Counter(r["thermal_before"] for r in rows) + Counter(r["thermal_after"] for r in rows)
    print(f"  all {len(rows)} runs incl round 0, before+after reads: {dict(sorted(allc.items()))}")
    r0 = [r for r in rows if r["round"] == 0]
    print(f"  round 0 (discarded): " + ", ".join(f"{r['cond']} cpu {r['cpu']} wall {r['wall']} th {r['thermal_before']}->{r['thermal_after']}" for r in r0))
    bcpu = out["B"]["cpu"]
    for c in ("H", "T"):
        for key in ("cpu", "wall"):
            d = [r[key] - next(b[key] for b in by["B"] if b["round"] == r["round"]) for r in by[c]]
            k, lo, hi, R = rof(d); m = med(d)
            pct = f" ({100*m/bcpu:+.2f} % of B cpu; interval {100*lo/bcpu:+.2f}..{100*hi/bcpu:+.2f} %)" if key == "cpu" else ""
            print(f"  {c}-B {key} median {m:+.3f}{pct} sign+ {sum(x>0 for x in d)}/{len(d)} k {k} interval [{lo:+.3f}, {hi:+.3f}] R {R:.3f}")
            out[f"{c}-B-{key}"] = dict(m=m, lo=lo, hi=hi, R=R, pos=sum(x > 0 for x in d), n=len(d))
    t = out["T-B-cpu"]
    out["admissible"] = abs(t["m"]) <= 0.015 * bcpu
    print(f"  twin cpu median {100*t['m']/bcpu:+.2f} % of B (limit 1.5 %), sign {t['pos']}/{t['n']} -> admissible-by-size {out['admissible']}")
    print(f"  ratio of medians H/B cpu {out['H']['cpu']/bcpu:.4f}, wall {out['H']['wall']/out['B']['wall']:.4f}")
    return out, rows


res = {}
for tag in ("abc144-warm", "abc144-cooled", "abc144-cli-narrow"):
    if os.path.exists(os.path.join(D, f"{tag}.tsv")) and len(load(tag)) >= 27:
        res[tag] = report(tag)

if "abc144-warm" in res and "abc144-cooled" in res:
    w, c = res["abc144-warm"][0], res["abc144-cooled"][0]
    print("\n=== grades")
    for nm, o in (("warm", w), ("cooled", c)):
        hb = o["H-B-cpu"]
        print(f"  A1 {nm}: H-B cpu {100*hb['m']/o['B']['cpu']:+.2f} % (bar <= -15 %), interval upper {100*hb['hi']/o['B']['cpu']:+.2f} %, twin cpu R {o['T-B-cpu']['R']:.3f} s = {100*o['T-B-cpu']['R']/o['B']['cpu']:.2f} % of B; |delta| {abs(hb['m']):.3f} > R? {abs(hb['m']) > o['T-B-cpu']['R']}")
        print(f"  A4 {nm}: H wall {o['H']['wall']:.2f} + twin wall R {o['T-B-wall']['R']:.3f} = {o['H']['wall']+o['T-B-wall']['R']:.2f} (<= {W})")
        print(f"  A2 {nm}: par B {o['B']['par']:.3f} H {o['H']['par']:.3f} T {o['T']['par']:.3f}")
    fac = c["H"]["wall"] / w["H"]["wall"]
    print(f"  A3 warm H wall {w['H']['wall']:.2f} <= {W}")
    print(f"  cooled/warm wall factor at H {fac:.4f}; at B {c['B']['wall']/w['B']['wall']:.4f}; re-open trigger W/factor {W/fac:.2f} s")
    print(f"  cooled/warm cpu factor at H {c['H']['cpu']/w['H']['cpu']:.4f}; at B {c['B']['cpu']/w['B']['cpu']:.4f}")
if "abc144-cli-narrow" in res:
    n = res["abc144-cli-narrow"][0]
    print(f"  AR-N8SPAWN-DRIFT: H-B cpu paired median {n['H-B-cpu']['m']:+.3f} s vs F {F}; H med {n['H']['cpu']:.2f} B med {n['B']['cpu']:.2f}; twin R {n['T-B-cpu']['R']:.3f}")

samp = os.path.join(D, "winb.thermal.tsv")
if os.path.exists(samp):
    with open(samp) as fh:
        fh.readline(); S = [l.rstrip("\n").split("\t") for l in fh]
    print(f"\n=== sampler {len(S)} samples {S[0][0]} .. {S[-1][0]}")
    for tag in res:
        rows = res[tag][1]
        from datetime import datetime, timedelta, timezone
        end = datetime.strptime(rows[-1]["utc"][:19], "%Y-%m-%dT%H:%M:%S") + timedelta(seconds=rows[-1]["wall"] + 1)
        a, b = rows[0]["utc"][:19] + "Z", end.strftime("%Y-%m-%dT%H:%M:%SZ")
        seg = [s for s in S if a <= s[0] <= b]
        print(f"  {tag} [{a}..{b}] level counts {dict(sorted(Counter(s[2] for s in seg).items()))} load1 med {med([float(s[1]) for s in seg]):.2f} power {set(s[4] for s in seg)} speed_limit {set(s[3] for s in seg)}")
    print("  transitions: " + ", ".join(f"{S[i][0]} {S[i-1][2]}->{S[i][2]}" for i in range(1, len(S)) if S[i][2] != S[i-1][2]))
