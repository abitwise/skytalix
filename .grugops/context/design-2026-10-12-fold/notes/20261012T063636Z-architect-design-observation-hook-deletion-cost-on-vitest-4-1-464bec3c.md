---
id: 20261012T063636Z-architect-design-observation-hook-deletion-cost-on-vitest-4-1-464bec3c
kind: observation
by: architect-design
task: design-2026-10-12-fold
at: 2026-10-12T06:36:36Z
verified_by:
confidence: high
refs:
  - ABC-116
  - ADR-0017
  - AR-N8SPAWN-DRIFT
  - ABC-144
  - .grugops/context/ticket-to-pr-ABC-116/probe/a2-runs.tsv
  - .grugops/context/qe-ABC-116/probe/qe-readout.out.txt
supersedes:
---

# The hook-deletion cost on 4.1, beside `ADR-0017`'s 3.2.7 figure. No single cause is claimed

This note is hand-authored and unsealed. It covers item 3 of `design-2026-10-12-fold`, and item A3 of the same
addendum. It is recorded as `ADR-0017` § Addendum 2026-10-12 A2 and A3. **No timing reading was taken at this
hop.**

## The three readings

- **`ADR-0017` d3, 2026-08-21: +2.68 s wall / +2.60 s CPU.** Full lane, 40 files. vitest 3.2.7 at its default
  worker count, Node v24.12.0, tree `e4a5c48`, load1 4.30.
- **SE, `ABC-116` A2: +3.08 s wall / +3.12 s CPU**, n = 8, 8/8 positive. The k = 2 intervals are +2.91..+3.19 and
  +3.00..+3.27. This hop recomputed them from the raw TSV.
  - Setting: `src/cli.test.ts` alone, vitest 4.1.11, `maxWorkers: 2`, runner off, Node v26.11.0, tree
    `3c38a8ea`.
- **QE spot, `qe-ABC-116`: +3.15 s wall / +3.21 s CPU**, n = 5, 5/5 positive, ranges +3.09..+3.46 and
  +3.13..+3.58. It has no twin, so it corroborates and is not graded under `ADR-0035` d1. This hop checked the
  medians against `qe-readout.out.txt`.

## What follows

- **The difference.** The 4.1 readings are +0.40 s wall / +0.52 s CPU over `ADR-0017` (SE), and +0.47 / +0.61
  (QE). They differ from it in instrument, vitest version and runner, worker count, Node version and tree, and
  none of these was varied alone. **No cause is claimed.**
- **Against the clause.** NOT MET against the 0.30 s per-child clause at any R. The lower end is +3.00 s, about
  10x the clause.
- **Against the new `F`.** About 31x `src/cli.test.ts`'s new `F` of 0.100 s, so `AR-N8SPAWN-DRIFT`'s discharge
  condition can see it.

## The discharge condition reads the current `F` (A3)

- `ADR-0017` § Pointers 2026-10-11 wrote "`F` = 1.097 s", which was the floor then. The condition reads the set's
  `F` at the time of the reading. Today that is 0.100 s CPU.
- A 4.1 reading compares only against a 4.1 base. `ABC-144`'s discharge for `5ddf150e` was on 3.2.7 and stands.
- The `ABC-116` reading is not a discharge. It is the **first 4.1 base** for this set: median 5.610 s CPU /
  4.060 s wall at `3c38a8ea`.
- **A stale line reference.** `ADR-0017` § Rollback gives the mutant as `src/cli.test.ts:626`. By content, it is
  `black`'s `FIRST_LEGAL_ENGINE` hook in `CHILDREN`, `:698` at `d8794608`.
