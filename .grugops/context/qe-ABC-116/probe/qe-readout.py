"""QE ABC-116 A2 readout: paired mutant - base deltas per round (kept rows only, round 0 excluded)."""
import csv, statistics, sys

rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t"))
kept = [r for r in rows if r["verdict"] == "kept"]
disc = [r for r in rows if r["verdict"].startswith("DISCARD")]
print(f"rows {len(rows)}; kept {len(kept)}; warmup {sum(r['verdict']=='warmup' for r in rows)}; discarded {len(disc)}")
for r in disc:
    print("  DISCARD", r["round"], r["tree"], r["attempt"], r["foreign_pre"], r["foreign_during"], r["foreign_post"])
by = {}
for r in kept:
    by.setdefault(int(r["round"]), {})[r["tree"]] = r
print("round order  base_real mut_real d_wall  base_cpu mut_cpu d_cpu  tests(b|m)  load1 pre(b,m)  thermal(b,m pre/post)")
dw, dc = [], []
for k in sorted(by):
    b, m = by[k].get("base"), by[k].get("mutant")
    if not (b and m):
        print(k, "INCOMPLETE"); continue
    order = "B-M" if b["slot"] == "1" else "M-B"
    w = float(m["real_s"]) - float(b["real_s"]); c = float(m["cpu_s"]) - float(b["cpu_s"])
    dw.append(w); dc.append(c)
    print(f"{k:>5} {order}  {float(b['real_s']):8.2f} {float(m['real_s']):8.2f} {w:+6.2f}  {float(b['cpu_s']):8.2f} {float(m['cpu_s']):7.2f} {c:+6.2f}  "
          f"{b['tests']}|{m['tests']}  {b['load1_pre']},{m['load1_pre']}  {b['thermal_pre']}/{b['thermal_post']},{m['thermal_pre']}/{m['thermal_post']}")
for name, d in (("wall", dw), ("cpu", dc)):
    s = sorted(d); n = len(s)
    inner = f"{s[1]:+.2f}..{s[-2]:+.2f}" if n >= 4 else "n/a"
    print(f"{name}: n={n} median {statistics.median(s):+.3f}  range {s[0]:+.2f}..{s[-1]:+.2f}  x(2)..x(n-1) {inner}  positive {sum(x>0 for x in s)}/{n}")
print("exits", sorted({r["exit"] for r in kept}), "power", sorted({r["power_pre"] for r in kept} | {r["power_post"] for r in kept}),
      "thermal", sorted({r["thermal_pre"] for r in kept} | {r["thermal_post"] for r in kept}),
      "load1 pre min/max", min(float(r["load1_pre"]) for r in kept), max(float(r["load1_pre"]) for r in kept))
