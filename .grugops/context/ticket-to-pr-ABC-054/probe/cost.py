# ADR-0035 decision 2 harness: narrow set, 3 arms, fresh process per run, CPU = user+sys of the
# child tree (RUSAGE_CHILDREN delta), rotated order, round 0 discarded, counts asserted, load1 logged.
import os, re, resource, subprocess, sys, statistics
root = sys.argv[1]; rounds = int(sys.argv[2])
SET = ["src/history-pane.nfr.test.ts", "src/render-seam.test.ts"]
EXPECT = {"base": 23, "head": 24, "twin": 23}
arms = ["base", "head", "twin"]
print("round\tarm\tload1\tcpu_s\twall_s\ttests")
rows = []
for r in range(rounds):
    order = arms[r % 3:] + arms[:r % 3]
    for arm in order:
        load1 = os.getloadavg()[0]
        before = resource.getrusage(resource.RUSAGE_CHILDREN)
        import time; t0 = time.monotonic()
        out = subprocess.run(["node", "node_modules/vitest/vitest.mjs", "run", *SET], cwd=f"{root}/{arm}",
                             capture_output=True, text=True)
        wall = time.monotonic() - t0
        after = resource.getrusage(resource.RUSAGE_CHILDREN)
        cpu = (after.ru_utime - before.ru_utime) + (after.ru_stime - before.ru_stime)
        m = re.search(r"Tests\s+(\d+) passed \((\d+)\)", out.stdout)
        assert out.returncode == 0 and m and int(m.group(2)) == EXPECT[arm] and m.group(1) == m.group(2), (arm, out.stdout[-400:])
        print(f"{r}\t{arm}\t{load1:.2f}\t{cpu:.3f}\t{wall:.3f}\t{m.group(2)}", flush=True)
        rows.append((r, arm, cpu))
