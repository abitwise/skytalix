---
id: 20261012T055000Z-software-engineer-observation-abc116-a2-hook-deletion-re-measured-55c8efb6
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-116
at: 2026-10-12T05:50:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - AR-N8SPAWN-DRIFT
  - ADR-0017
  - ADR-0035
  - .grugops/context/ticket-to-pr-ABC-116/probe/a2-runs.tsv
  - .grugops/context/ticket-to-pr-ABC-116/probe/a2window.sh
  - .grugops/context/ticket-to-pr-ABC-116/probe/readout.out.txt
supersedes:
---

# `ABC-116` A2: the one-line hook deletion, re-measured on today's stack

Hand-authored, unsealed. This is a measurement of the MUTANT's cost. It is **not** a `T2` re-measure:
`T2` does not fire on this delivery.

## Set-up
- **Trees.** Three trees outside the repository, in the session scratchpad. Each is a `git archive` of
  `main` @ `3c38a8ea`, with `node_modules` symlinked to the main checkout's (vitest 4.1.11). Each tree
  takes `maxWorkers: 2`, `pool: threads` and the module runner off from its own `vitest.config.ts`.
  - B = base.
  - T = identity twin. `/usr/bin/diff -r` B T reads equal.
  - M = B with line 670 changed from
    `black: play(["--colour", "black"], { hook: substituting("engine.ts", FIRST_LEGAL_ENGINE) }),` to
    `black: play(["--colour", "black"], {}),` (`probe/mutant.diff`).
  - `ADR-0017` wrote the mutant as `play(["--colour", "black"])`. The two are the same at run time,
    because `childOf` defaults `options` to `{}`.
- **Command.** `/usr/bin/time -l npx vitest run src/cli.test.ts`, the `ADR-0035` decision 2 narrow set.
  CPU is user + sys of the whole waited process tree.
- **Host.** Mac15,13, Apple M3, 8 cores, Darwin 25.5.0, Node v26.11.0, on AC power all through.
- **Order.** Rotated B,M,T / M,T,B / T,B,M, so base and mutant alternate and never run twice in a row.
  - 9 rounds; round 0 is discarded, which leaves n = 8 (k = 2).
  - That is ≥ 5 pairs, so the subtask's rule and the re-score's `ADR-0035` harness are met together.
  - Strict ABAB was not used, because the twin needs its own slot in each round.
- **Idle.** 60 s before the first run, then 20 s before every run.
- **Logging.** Before AND after every run the harness logged:
  - `uptime` load1;
  - `notifyutil -g com.apple.system.thermalpressurelevel` (`kern.thermalpressurelevel` is an unknown oid
    on this host, so it could not be used);
  - `pgrep -fl vitest`;
  - `pmset -g batt | head -1`.
  - A 1 s sampler also logged any vitest process that was not a descendant of the harness while a run
    was going.

## Readings (n = 8 scored rounds)

| | B median | M median | T median | M−B median | M−B interval x(2)..x(7) | sign | T−B median | twin R |
|---|---|---|---|---|---|---|---|---|
| wall | 4.060 s | 7.070 s | 4.115 s | **+3.080 s** | +2.910..+3.190 | 8/8 | +0.010 s (+0.25 %) | 0.180 s |
| CPU | 5.610 s | 8.735 s | 5.625 s | **+3.115 s** | +3.000..+3.270 | 8/8 | +0.000 s (0.00 %) | 0.100 s |

Paired M−B by round:
- CPU: +3.00 +3.12 +3.25 +3.11 +3.27 +3.29 +2.90 +3.05.
- Wall: +2.91 +2.99 +3.05 +2.83 +3.19 +3.23 +3.12 +3.11.

What the readings say:
- **The twin is admissible.** Its median is ≤ 1.5 % of base, and its sign is 4/8 on CPU and 5/8 on
  wall. It resolves 0.30 s, because R = 0.10 s ≤ 0.30 s.
- **State against the 0.30 s per-child CPU clause: NOT MET.** x(2) = +3.00 s is over 0.30 s, so it is
  NOT MET at any R. That is about 10.4x the clause, from one child.
- **The mutant stays green.** Every run read 1 file and 69 tests, with 0 failed, 0 skipped and exit 0.
- **Conditions.** Thermal pressure read 0 before and after all 30 runs. Power was AC throughout.
- **Load, logged and not gated.** Per-run load1 ran from 2.41 to 9.26. It was 2.4–3.9 for most runs
  and 5–9 for rounds 7–8.

## Discarded runs (recorded, not graded)
- **Where the foreign runners came from.** Every one seen was from
  `<private-repo>` (`<foreign: vitest>`).
  - That is another project's session, not the `public/grugops` one the subtask named.
  - This hop did not touch it.
- **Three runs were discarded** for a foreign runner during or after the run. Each was re-taken once
  the runner had gone, plus 20 s:
  - seq 14 (r4 T): during and after;
  - seq 19 (r5 M): during and after;
  - seq 24 (r7 M): during.
- **Waits before a run.** The harness also waited for foreign runners four times before a run, at
  05:27, 05:34–05:38, 05:39 and 05:44.
- **One earlier start was aborted before any run** (`probe/aborted-start-1/`).
  - A foreign runner appeared during its 60 s initial idle.
  - The harness was changed so that the first run's post-wait idle is 60 s rather than 20 s, and then
    it was restarted.
- **A smoke round is not a reading.** One round (`probe/smoke-not-a-reading/`) was taken before the
  window to test the harness.
- **Residual limit.** A foreign process that both starts and ends within one 20 s gap is not caught.

## The disagreement with `ADR-0017`, written down
- **`ADR-0017`:** +2.68 s wall / +2.60 s CPU. Its conditions: the full lane (40 files), vitest 3.2.7,
  its default worker count, Node v24.12.0, load1 4.30.
- **This hop:** +3.08 s wall / +3.12 s CPU, which is **+0.40 s wall and +0.52 s CPU more**.
- **Why they can differ.** The two readings use a different instrument (one file vs the lane), a
  different runner and worker cap, a different Node (v26.11.0), and a different tree (`3c38a8ea` vs
  `e4a5c48`).
- **No single cause is isolated here, and none is claimed.**
- **They agree on size.** Both put the drift at about 9–10x the per-child clause.

## For the owner of `F` (Architect/Design), not ruled here
- **What this reading is.** It is the narrow set `src/cli.test.ts`'s first twin reading on 4.1.11 with
  the runner off: R = 0.100 s CPU and 0.180 s wall, admissible, base CPU 5.61 s.
- **Why it matters.** `ADR-0035`'s 2026-10-12 floors block says a set's first 4.1 reading replaces the
  provisional 16 %.
- **Whose step it is.** Recording it as that set's `F` is the owner's step. This hop does not take it.
