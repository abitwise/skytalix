---
id: 20260813T122000Z-qe-e2e-claim-the-slope-adjudicated-9f350c27
kind: claim
by: qe-e2e
at: 2026-08-13T12:20:00Z
verified_by:
confidence: medium
refs:
  - ABC-026
  - ABC-026-A2
  - ABC-026-A4
  - quality-gate-ABC-026
  - arch-audit-2026-08-12
  - NFR-008
  - plans/nfr-catalog.md
supersedes:
---

# The two slope claims adjudicated: **`ABC-026` is RIGHT and the architecture audit is WRONG — the slope does fall. But `ABC-026`'s −12.2% is the optimistic end, and I read −9.0%.**

A `claim`, `confidence: medium`, and the confidence is the honest part. **The numbers below are
measured; the adjudication between two prior hops is an inference over three file counts under heavy
concurrent load, and a three-point fit is a three-point fit.**

## The dispute

- **Architecture audit, 2026-08-12:** threads is *"a one-time discount, not a change in the slope"*.
- **`ABC-026`, 2026-08-13:** *"REFUTED: the slope falls 12.2%"* — 158.2 → 138.9 ms/file, R² 0.9988.

## My measurement — independent trees, independent harness

Three out-of-tree copies at **28 / 32 / 36** files (`K` trivial one-assertion fillers importing nothing
from the repository), every copied repository file `cmp`-verified byte-identical before any condition
was applied. Six conditions interleaved, **condition order rotated every round, round 0 discarded as
warm-up, 8 rounds, 7 usable, one fresh OS process per run.** **Every run asserts its own file and test
counts against its label — 48 runs, 0 harness errors.** CPU = `user + sys`; wall and CPU never blended.

```
                 28 files          32 files          36 files        FIT
threads        9.760 s CPU       10.470 s          11.080 s      5.157 s + 165.0 ms x files   R^2 0.9981
forks         10.570 s          11.390 s          12.020 s      5.527 s + 181.3 ms x files   R^2 0.9943

slope change   165.0 / 181.3 = 0.910   ->   -9.0%
```

## The verdict

**1. The audit's "no change in the slope" is NOT SUPPORTED.** Two independent harnesses, two sessions,
two different absolute levels, both put the threads slope clearly below the forks slope:

```
ABC-026   138.9 / 158.2 = 0.878     -12.2%
mine      165.0 / 181.3 = 0.910      -9.0%
```

**The RATIOS agree within 3.2 percentage points, which is the form of agreement this catalog's own rule
predicts** — *absolutes are session properties and drift ~20%; ratios replicate.* My absolutes are
14–17% higher than the prior hop's throughout, which is exactly what a 1-minute load average of **16–22
on 8 cores** should do to them. **`ABC-026`'s direction is replicated. Its magnitude is at the
optimistic end of the two readings, and the honest range is roughly −9% to −12%.**

**2. But the audit's PRACTICAL point survives, and my paired data is why.** A one-time discount and a
slope change are distinguished by whether the threads-minus-forks saving **grows with file count**:

```
paired threads-minus-forks CPU delta, same round, same tree
  28 files   -0.810 s    sign 7/7 negative
  32 files   -0.800 s    sign 7/7 negative
  36 files   -0.920 s    sign 7/7 negative
```

**The saving is overwhelmingly a constant ~0.8 s offset. The file-count-dependent part is ~0.11 s
across 8 added files** — and it is **not monotonic**: 28 → 32 moves the wrong way (−0.810 → −0.800)
before 36 recovers. **So the slope change is real in the fit and marginal in the paired data**, which
is the pattern of a small true effect sitting inside run-to-run noise, not of a strong one.

**3. Neither hop is careless, and the reconciliation is not a scoreboard.** The audit's sentence is
wrong as stated. **Its underlying warning — that threads does not change the shape of this problem — is
right, and `ABC-026` says so itself** in the same breath as its refutation: *"the per-file floor is
still ~139 ms and still the structural driver... anyone treating threads as 'the answer' will still be
back inside two epics."* **On my numbers the floor is ~165 ms and the point is stronger, not
weaker.** A −9% slope change buys roughly **one extra file per eleven added** — real, worth having,
and nowhere near a fix for the floor.

**Recommended reading for the record, if anyone restates this:** *the slope falls by 9–12%; the saving
is dominated by a ~0.8 s constant offset; both hops' planning conclusion is unchanged.*

## Fences

**Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7,
tinypool 1.1.1. `UNKNOWN - verify` on any other hardware.** `node_modules` **symlinked** from the
sibling `cli-chess-example` worktree — the same disclosed deviation from `NFR-008`'s named environment
the prior three hops carried; **the symlink is removed before this hop finishes.** **Measured with a
concurrent agent gating `ABC-021` on the same cores, load average 16–22 throughout** — which inflates
my absolutes and makes the slope comparison conservative rather than flattering, because both arms of
every paired comparison took the same weather. **Three points is the minimum for a slope and the R²
values above should not be read as precision.**
