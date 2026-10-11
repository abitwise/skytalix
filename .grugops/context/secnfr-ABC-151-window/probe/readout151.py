# secnfr-ABC-151-window: read the window's TSVs and print every number the notes use. Reads only; writes nothing.
# Usage: python3 -I readout151.py <w151 dir>. Order statistics as ADR-0035 d1 (same kof/rof as Window B's readout.py).
import sys, os, statistics as st
from math import comb
from collections import Counter
from datetime import datetime

D = sys.argv[1]
W = 10.0


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


def t(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


def lvl(x):
    try:
        return int(x)
    except ValueError:
        return -1


print("=== every run over W = 10 s, all steps")
for tag in ("abc151-warm", "abc151-heat-k2", "abc151-heat-k3", "abc151-cooled"):
    for r in rows_of(tag):
        if r["wall"] > W:
            print(f"  {tag} round {int(r['round'])} {r['cond']} wall {r['wall']} cpu {r['cpu']} load1 {r['load1_before']}->{r['load1_after']} th {r['thermal_before']}->{r['thermal_after']} fv {r['foreign_vitest']:.0f}/{r['foreign_after']:.0f}")

for tag in ("abc151-warm", "abc151-cooled"):
    rows = rows_of(tag)
    if not rows:
        continue
    sc = [r for r in rows if r["round"] >= 1]
    print(f"\n=== {tag}: {len(rows)} runs, errors {sum(r['status'] != 'ok' for r in rows)}, utc {rows[0]['utc']} .. {rows[-1]['utc']}")
    by = {c: [r for r in sc if r["cond"] == c] for c in ("B", "H", "T")}
    med = {}
    for c, g in by.items():
        cpu = [r["cpu"] for r in g]; wall = [r["wall"] for r in g]; lb = [r["load1_before"] for r in g]
        med[c] = dict(cpu=st.median(cpu), wall=st.median(wall))
        print(f"  {c} n={len(g)} cpu {st.median(cpu):.2f} ({min(cpu):.2f}-{max(cpu):.2f}) wall {st.median(wall):.2f} ({min(wall):.2f}-{max(wall):.2f}) "
              f"par {st.median(r['par'] for r in g):.3f} load1b {st.median(lb):.2f} ({min(lb):.2f}-{max(lb):.2f}) load1b>8 {sum(x > 8 for x in lb)}/{len(g)} "
              f"files {sorted(set(int(r['files']) for r in g))} tests {sorted(set(int(r['tests']) for r in g))} "
              f"fv_before {Counter(int(r['foreign_vitest']) for r in g)} fv_after {Counter(int(r['foreign_after']) for r in g)} "
              f"power {sorted(set(r['power'] for r in g) | set(r['power_after'] for r in g))} speed_limit {sorted(set(r['speed_limit'] for r in g))}")
        print(f"     thermal before {dict(sorted(Counter(r['thermal_before'] for r in g).items()))} after {dict(sorted(Counter(r['thermal_after'] for r in g).items()))}")
    allc = Counter(r["thermal_before"] for r in rows) + Counter(r["thermal_after"] for r in rows)
    print(f"  all {len(rows)} runs incl round 0, before+after: {dict(sorted(allc.items()))}")
    print("  round 0 (discarded): " + ", ".join(f"{r['cond']} cpu {r['cpu']} wall {r['wall']}" for r in rows if r["round"] == 0))
    bcpu = med["B"]["cpu"]; res = {}
    for c in ("H", "T"):
        for key in ("cpu", "wall"):
            d = [r[key] - next(b[key] for b in by["B"] if b["round"] == r["round"]) for r in by[c]]
            k, lo, hi, R = rof(d); m = st.median(d); pos = sum(x > 0 for x in d)
            pct = f" ({100*m/bcpu:+.2f} % of B cpu; interval {100*lo/bcpu:+.2f}..{100*hi/bcpu:+.2f} %)" if key == "cpu" else ""
            print(f"  {c}-B {key} median {m:+.3f}{pct} sign+ {pos}/{len(d)} k {k} interval [{lo:+.3f}, {hi:+.3f}] R {R:.3f}")
            res[(c, key)] = (m, lo, hi, R, pos, len(d))
    tm, _, _, tR, tpos, tn = res[("T", "cpu")]
    kk = kof(tn)
    print(f"  twin: cpu median {100*tm/bcpu:+.2f} % of B (limit 1.5 %), sign {tpos}/{tn} (chance band {kk}..{tn-kk}) -> admissible {abs(tm) <= 0.015*bcpu and kk <= tpos <= tn-kk}; "
          f"twin cpu R {res[('T','cpu')][3]:.3f} s ({100*res[('T','cpu')][3]/bcpu:.2f} % of B); twin wall R {res[('T','wall')][3]:.3f} s")
    a3 = med["H"]["wall"] + res[("T", "wall")][3]
    print(f"  A3: H wall median {med['H']['wall']:.3f} + twin wall R {res[('T','wall')][3]:.3f} = {a3:.3f} s  (<= 10 s: {a3 <= W}; > 9.0 s cooled owed: {a3 > 9.0})")
    hm, hlo, hhi = res[("H", "cpu")][:3]
    print(f"  A4: H-B cpu median {hm:+.3f} s ({100*hm/bcpu:+.2f} %), interval [{hlo:+.3f}, {hhi:+.3f}] s = [{100*hlo/bcpu:+.2f} %, {100*hhi/bcpu:+.2f} %]; wholly below 0: {hhi < 0}")
    print(f"  ratio of medians H/B cpu {med['H']['cpu']/bcpu:.4f}, wall {med['H']['wall']/med['B']['wall']:.4f}")

seqs = {}
sp = os.path.join(D, "sequences.tsv")
if os.path.exists(sp):
    with open(sp) as fh:
        hdr = fh.readline().rstrip("\n").split("\t")
        for line in fh:
            f = dict(zip(hdr, line.rstrip("\n").split("\t")))
            seqs[f["step"]] = f
    print("\n=== sequences.tsv")
    for f in seqs.values():
        print("  " + " | ".join(f"{k}={v}" for k, v in f.items()))

samp = []
tp = os.path.join(D, "w151.thermal.tsv")
if os.path.exists(tp):
    with open(tp) as fh:
        fh.readline()
        for line in fh:
            u, l, lv, *_ = line.rstrip("\n").split("\t")
            samp.append((t(u), float(l), lvl(lv), line.rstrip("\n").split("\t")[-1]))

for step, tag, arm in (("2", "abc151-heat-k2", "H"), ("3", "abc151-heat-k3", "B")):
    rows = rows_of(tag)
    if not rows:
        continue
    print(f"\n=== A5 {tag} ({arm} only, {len(rows)} runs back to back), errors {sum(r['status'] != 'ok' for r in rows)}")
    reads = []
    for i, r in enumerate(rows, 1):
        reads.append((i, "before", lvl(r["thermal_before"])))
        reads.append((i, "after", lvl(r["thermal_after"])))
    first = next(((i, w) for i, w, v in reads if v >= 1), None)
    n1 = sum(v >= 1 for _, _, v in reads)
    print(f"  first read at level >= 1: {('run ' + str(first[0]) + ' (' + first[1] + ')') if first else 'none'}; reads at >= 1: {n1} of {len(reads)}; max level {max(v for _, _, v in reads)}")
    s = seqs.get(step)
    if s:
        idle = (t(rows[0]["utc"]) - t(s["prev_end_utc"])).total_seconds()
        print(f"  idle s from previous run's end ({s['prev_end_utc']}) to first run ({rows[0]['utc']}): {idle:.0f}; gate {s['gate_start_utc']} -> pass {s['gate_pass_utc']}; battery {s['battery']}; load1 {s['load1']}; level {s['thermal']}")
    wall = [r["wall"] for r in rows]; cpu = [r["cpu"] for r in rows]
    print(f"  wall median {st.median(wall):.2f} ({min(wall):.2f}-{max(wall):.2f}), cpu median {st.median(cpu):.2f} ({min(cpu):.2f}-{max(cpu):.2f}), "
          f"files {sorted(set(int(r['files']) for r in rows))} tests {sorted(set(int(r['tests']) for r in rows))} load1b {min(r['load1_before'] for r in rows):.2f}-{max(r['load1_before'] for r in rows):.2f} "
          f"fv_before {Counter(int(r['foreign_vitest']) for r in rows)} power {sorted(set(r['power'] for r in rows) | set(r['power_after'] for r in rows))}")
    end = t(rows[-1]["utc"]).timestamp() + rows[-1]["wall"]
    seg = [x for x in samp if t(rows[0]["utc"]).timestamp() <= x[0].timestamp() <= end]
    fs = next((x for x in seg if x[2] >= 1), None)
    print(f"  sampler during the sequence: {len(seg)} samples, {sum(x[2] >= 1 for x in seg)} at >= 1, first >= 1 at {fs[0].isoformat() if fs else 'none'}"
          f" ({(fs[0] - t(rows[0]['utc'])).total_seconds():.0f} s after the first run started)" if fs else f"  sampler during the sequence: {len(seg)} samples, 0 at >= 1")
    print("  idx\tround\twall\tcpu\tpar\tload1_b\tload1_a\tth_b\tth_a\tfv_b\tstatus\tutc")
    for i, r in enumerate(rows, 1):
        print(f"  {i}\t{int(r['round'])}\t{r['wall']}\t{r['cpu']}\t{r['par']}\t{r['load1_before']}\t{r['load1_after']}\t{r['thermal_before']}\t{r['thermal_after']}\t{int(r['foreign_vitest'])}\t{r['status']}\t{r['utc']}")
