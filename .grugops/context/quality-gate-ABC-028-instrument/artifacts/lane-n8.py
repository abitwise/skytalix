#!/usr/bin/env python3
"""
N8-LANE's own method, applied to the ABC-028 A4 candidate.

  instrument : CPU (user + sys) of the default lane, NOT wall
  statistic  : median of paired per-round deltas, n >= 7 interleaved rounds,
               condition order rotated every round, one fresh OS process per run,
               round 0 discarded as warm-up, sign test reported beside it
  admission  : identity null control (cmp-verified byte-identical tree),
               <= 1.5% CPU with its sign at chance
  net        : subtract 160 ms CPU per test file ADDED — this candidate adds ZERO files
  runner     : invoked DIRECTLY (node node_modules/vitest/vitest.mjs run), PERFT_DEEP unset
"""
import os
import statistics
import sys

SCRATCH = os.path.dirname(os.path.abspath(__file__))
CONDITIONS = ["A", "B", "N"]
DIRS = {c: os.path.join(SCRATCH, f"lane{c}") for c in CONDITIONS}
ROUNDS = 9  # round 0 discarded -> 8 usable
VITEST = "node_modules/vitest/vitest.mjs"


def cpu_of_one_run(cwd: str) -> float:
    """CPU seconds (user + sys) of one fresh OS process tree running the lane."""
    env = {k: v for k, v in os.environ.items() if k != "PERFT_DEEP"}
    pid = os.fork()
    if pid == 0:
        os.chdir(cwd)
        null = os.open(os.devnull, os.O_WRONLY)
        os.dup2(null, 1)
        os.dup2(null, 2)
        os.execve("/usr/bin/env", ["/usr/bin/env", "node", VITEST, "run"], env)
        os._exit(127)
    _, status, usage = os.wait4(pid, 0)
    if os.waitstatus_to_exitcode(status) != 0:
        print(f"  !! non-zero exit in {cwd}", file=sys.stderr)
    return usage.ru_utime + usage.ru_stime


samples = {c: [] for c in CONDITIONS}
for round_index in range(ROUNDS):
    order = CONDITIONS[round_index % 3:] + CONDITIONS[: round_index % 3]
    row = {}
    for condition in order:
        row[condition] = cpu_of_one_run(DIRS[condition])
    tag = "warm-up, discarded" if round_index == 0 else ""
    print(
        f"round {round_index}  order={'>'.join(order)}  "
        + "  ".join(f"{c}={row[c]:7.3f}s" for c in CONDITIONS)
        + f"  {tag}"
    )
    if round_index > 0:
        for condition in CONDITIONS:
            samples[condition].append(row[condition])

n = len(samples["A"])
delta_b = [b - a for a, b in zip(samples["A"], samples["B"])]
delta_n = [x - a for a, x in zip(samples["A"], samples["N"])]
base = statistics.median(samples["A"])

print(f"\nn = {n} paired rounds (round 0 discarded)")
print(f"baseline laneA median CPU = {base:.3f} s")
for name, deltas in (("laneB - laneA  (the candidate)", delta_b), ("laneN - laneA  (identity null)", delta_n)):
    median = statistics.median(deltas)
    positive = sum(1 for d in deltas if d > 0)
    print(
        f"{name}: median {median * 1000:+8.1f} ms  ({median / base * 100:+6.2f}% of lane CPU)"
        f"  sign {positive}/{n} positive"
        f"  raw [{', '.join(f'{d * 1000:+.0f}' for d in deltas)}] ms"
    )
