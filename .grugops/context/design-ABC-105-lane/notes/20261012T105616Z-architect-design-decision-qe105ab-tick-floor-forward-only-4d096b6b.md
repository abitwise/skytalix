---
id: 20261012T105616Z-architect-design-decision-qe105ab-tick-floor-forward-only-4d096b6b
kind: decision
by: architect-design
task: design-ABC-105-lane
at: 2026-10-12T10:56:16Z
verified_by:
confidence: high
refs:
  - QE-105-ab
  - ABC-105
  - ADR-0035
  - N8-LANE
  - NFR-008
  - plans/nfr-catalog.md
  - 20261012T103300Z-qe-e2e-observation-abc105-qe4-n8-lane-not-read-622677c5
  - 20261012T105615Z-architect-design-observation-abc105-six-windows-recomputed-d1e341ef
supersedes:
---

# `QE-105-ab` ruled: the admissibility limit is max(1.5 %, one tick), and the sign test drops zeros, forward-only

This note is hand-authored and unsealed. The full text is `ADR-0035` § Addendum 2026-10-12 A1, and the catalog's
`N8-LANE` admissibility bullet carries a dated sub-bullet.

## Ruling

- **Admissible** means |twin median| ≤ **max(1.5 % of the B median, one tick)**.
  - The tick is 0.010 s for `/usr/bin/time -p`, for CPU and wall.
  - It binds only where the B median is below 0.667 s. The full lane and `src/cli.test.ts` are unchanged.
- **Sign at chance** means the two-sided sign test on the **non-zero** deltas, at p > 0.05.
- **Forward-only.**
  - It applies to windows whose pre-registration lands after the addendum. Where there is no pre-registration,
    the window's first run counts.
  - Graded windows stay as graded. Re-grading a window under a rule chosen after it was seen is what a
    pre-registration exists to prevent.

## What QE3 w1 and QE4 w2 would read (recorded, NOT regraded)

| window | under A1 | would read at 650 ms |
|---|---|---|
| QE3 w1, `db1cfb6c` | admissible: +0.010 s ≤ 0.010; 7 + / 1 −, p 0.070 | **NOT MET**: x(2) +0.660 > 0.650. It agrees with QE3 w3 |
| QE4 w2, `8fd0c233` | admissible: +0.010 s ≤ 0.010; 5 + / 2 − / 1 zero, p 0.453 | **MET**: +0.370 s (+0.370..+0.400), R 0.030 |

- **Both stay INADMISSIBLE with no state.**
- **The QE4 w2 line is a counterfactual, not a MET.**
  - `N8-LANE` at `8fd0c233` stays NOT READ.
  - `QE-105-x` is not discharged.
  - The merge rests on the owner's ruling (`…2a41a1c4`).

## Alternatives

- **Keep 1.5 %.** Rejected: it refuses windows for quantisation and not for bias. Two of the four non-void
  windows on this set fell to it, each by exactly one tick.
- **A two-tick floor.** Rejected: it is wider than needed, at 3.5 % on this set.
- **A µs timer.** Rejected for now. It changes the sha-pinned harness `lane144b.mjs`, and every recorded `F` would
  need a re-read. **It becomes the route if a bound is ever cut within a few ticks of a reading.**

## Authority

- **This amends decision 1 of an accepted ADR.** `ADR-0035` § Status assigns decisions 1–5, the protocol, to
  Architect/Design. No level moves.
- **Reported to the owner, who may revert it.** Rollback: revert to 1.5 % and take the timer route if a
  floor-only admission is followed by readings that flip sides of a bound.
- **QE's readout scripts** count zeros as negatives. That is not wrong for any recorded state, but the next
  pre-registration should state the zeros-dropped convention. QE owns its probes, so this is noted here and not
  edited.
