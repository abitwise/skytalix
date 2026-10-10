# ABC-057 SE — ADR-0035 decision 1+2 harness (copied from qe-ABC-054/probe/cost.py), ONE pre-registered set.
# Narrow set = the one modified test file. Arms base/head/twin, fresh process per run, CPU = user+sys
# of the child tree (RUSAGE_CHILDREN delta), rotated order, round 0 discarded, counts asserted,
# load1 logged before every run. Prints per-run rows, then twin-base and head-base summaries with R.
import os, re, resource, subprocess, sys, statistics, time
root, rounds = sys.argv[1], int(sys.argv[2])
SET = ["src/history-pane.nfr.test.ts"]
EXPECT = {"base": 12, "head": 12, "twin": 12}
arms = ["base", "head", "twin"]
cpu = {a: {} for a in arms}
print("round\tarm\tload1\tcpu_s\twall_s\ttests", flush=True)
for r in range(rounds):
    for arm in arms[r % 3:] + arms[:r % 3]:
        load1 = os.getloadavg()[0]
        b = resource.getrusage(resource.RUSAGE_CHILDREN); t0 = time.monotonic()
        out = subprocess.run(["node", "node_modules/vitest/vitest.mjs", "run", *SET], cwd=f"{root}/{arm}", capture_output=True, text=True)
        wall = time.monotonic() - t0; a = resource.getrusage(resource.RUSAGE_CHILDREN)
        c = (a.ru_utime - b.ru_utime) + (a.ru_stime - b.ru_stime)
        m = re.search(r"Tests\s+(\d+) passed \((\d+)\)", out.stdout)
        assert out.returncode == 0 and m and m.group(1) == m.group(2) and int(m.group(2)) == EXPECT[arm], (arm, out.stdout[-400:])
        print(f"{r}\t{arm}\t{load1:.2f}\t{c:.3f}\t{wall:.3f}\t{m.group(2)}", flush=True)
        cpu[arm][r] = c
scored = range(1, rounds)
n = len(scored); k = 2 if 8 <= n <= 10 else None
base_med = statistics.median(cpu["base"][r] for r in scored)
for arm in ("twin", "head"):
    d = sorted(cpu[arm][r] - cpu["base"][r] for r in scored)
    med = statistics.median(d); pos = sum(x > 0 for x in d)
    lo, hi = d[k - 1], d[n - k]; R = max(abs(lo), abs(hi))
    print(f"{arm}-base: n={n} k={k} deltas={[round(x,3) for x in d]} median={med:+.4f}s ({100*med/base_med:+.2f}% of base median {base_med:.3f}s) sign+={pos}/{n} interval x({k})..x({n+1-k})=[{lo:+.3f},{hi:+.3f}] R={R:.3f}s")
