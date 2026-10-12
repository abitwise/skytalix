---
id: 20261012T063636Z-architect-design-decision-cli-test-ts-floor-on-vitest-4-1-c2cb8ead
kind: decision
by: architect-design
task: design-2026-10-12-fold
at: 2026-10-12T06:36:36Z
verified_by:
confidence: high
refs:
  - ABC-116
  - ABC-144
  - ADR-0035
  - ADR-0040
  - ADR-0042
  - RISK-ABC144-FCAP
  - NFR-008
  - plans/nfr-catalog.md
  - .grugops/context/ticket-to-pr-ABC-116/probe/a2-runs.tsv
  - 20261012T055000Z-software-engineer-observation-abc116-a2-hook-deletion-re-measured-55c8efb6
  - 20261011T231917Z-architect-design-decision-abc144-fcap-floors-after-abc152-dd7a6ec9
supersedes:
---

# `src/cli.test.ts`: `F` = 0.100 s CPU / 0.180 s wall on vitest 4.1. `RISK-ABC144-FCAP` is unchanged

This note is hand-authored and unsealed. It covers items 2 and 5 of `design-2026-10-12-fold`. It is recorded in
`ADR-0035` § Status ("Per-set floor, 2026-10-12") and in the catalog's floors block.

## Recomputed from the raw TSV, not copied

This hop wrote its own script in the session scratchpad. It did not run the Engineer's `readout.py`.
- **Rows.** Status `ok` only, rounds 1–8 (round 0 discarded). That gives 24 rows, with no duplicate
  round/arm. `cpu_s` = `user_s` + `sys_s` on every row. Every row reads exit 0, 1 file, 69 tests, 0 failed,
  0 skipped.
- **Order statistic.** n = 8, so k = 2 by `ADR-0035` d1 (coverage 0.9297 ≥ 0.92).
- **Twin − base, CPU, sorted:** −0.24, **−0.10**, −0.03, −0.01, 0.01, 0.04, **0.06**, 0.47. So **R = 0.100 s**.
  The median is 0.000 s (0.00 % of the base median 5.610 s), with sign 4/8.
- **Twin − base, wall, sorted:** −0.08, **−0.03**, 0.00, 0.01, 0.01, 0.03, **0.18**, 1.39. So **R = 0.180 s**.
  The median is 0.010 s (0.25 % of 4.060 s), with 5 positive, 1 zero and 2 negative.
- These agree with the SE summary (`…55c8efb6`) to the last digit.

## The instrument

- Base `3c38a8ea`. `git merge-base --is-ancestor 7a920ca5 3c38a8ea` is true.
- Its `vitest.config.ts` has `pool: "threads"`, `maxWorkers: 2` and `experimental.viteModuleRunner: false`. Its
  `package.json` pins `vitest ~4.1.11`.
- Between `3c38a8ea` and `d8794608`, `src/` changed only by 28 comment lines in `src/cli.test.ts`. QE hashed
  the non-comment bytes equal. `vitest.config.ts` and `package.json` did not change.
- "k = 2" means two things here, and both are true: the order-statistic index at n = 8, and the worker cap
  (`ADR-0040` addendum 2).

## The ruling

- **`src/cli.test.ts`: `F` = 0.100 s CPU / 0.180 s wall**, on 4.1.11, runner off, `maxWorkers: 2`.
- It is the set's first admissible 4.1 reading. It replaces the provisional 16 %, which is 0.898 s CPU on this
  base. With fewer than three readings, the largest R is used. From the third on, the median of three governs
  (`ADR-0035` d3 amendment; FCAP note item 3).
- **Admissible.** The twin's median is ≤ 1.5 % and its sign is at chance, on both units.
- **One condition, stated and not hidden.** All three trees shared one symlinked `node_modules`.
  - The FCAP note's "twin with its own `npm ci`" is written for the full lane.
  - `ADR-0035` d2's harness asks only for a `cmp`/`diff -r` twin.
  - This hop does not extend the full-lane condition to narrow sets. If a later reading with separate
    installs reads wider, `F` rises by the median-of-three rule.
- **What it changes at the cut.** On this file, a 650 ms `N8-LANE` bound and the 0.30 s per-child clause are no
  longer refused at the cut. Before, both were below 1.097 s. The count stays the pin where a count exists.
- **Why `F` falls from 1.097 s to 0.100 s.** This hop does not attribute it to one cause. The 3.2.7 readings
  were taken at a different worker cap and runner, under heavier load. `F` is data (`ADR-0035` § Rollback), and
  the rule moves it.

## Item 5: `RISK-ABC144-FCAP`

- **Item 2 does not change it.** The risk is about the **full-lane** `F` under the cap (`ABC-144` page;
  `ADR-0040` addendum 2 item 6).
- `ADR-0035` d3 keys `F` per instrument. A one-file twin R is a different instrument from the full lane, and the
  FCAP note refuses projections between instruments.
- So the full lane keeps **1.72 s CPU / 3.25 s wall**. The risk stays **open** (owner Architect/Design, low).
  The full-lane twin R on 4.1 is still owed at the next paired full-lane window whose base carries `7a920ca5`.
- **What did move** is outside that risk. One narrow set left "provisional" because it now has its own 4.1
  reading. `src/history-pane.nfr.test.ts`, the `history-pane.nfr` + `render-seam.test` pair and the one-file row
  remain provisional.
