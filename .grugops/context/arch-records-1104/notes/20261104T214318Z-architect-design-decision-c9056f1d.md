---
id: 20261104T214318Z-architect-design-decision-c9056f1d
kind: decision
by: architect-design
at: 2026-11-04T21:43:18Z
verified_by: 
confidence: high on the two readings under B-T4's written rule; medium on 'held elsewhere', reasoned from the rows and QE's mutant trees at shipped 0; nothing run
refs:
  - arch-records-1104
  - ABC-301
  - ABC-271
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - ADR-0064
  - B-T4
  - K1
  - a1e19981
  - 83894094
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - orch-2026-10-30a/20261104T212001Z-orchestrator-decision-878035ca
  - orch-2026-10-30a/20261104T212555Z-orchestrator-decision-0edae6fd
  - qe-ABC-301-s0/20261104T213516Z-qe-e2e-decision-9fd32f43
  - qe-ABC-301-s0/20261104T213516Z-qe-e2e-observation-270757f7
  - qe-ABC-271-freeze/20261104T133856Z-qe-e2e-decision-67b5eeac
  - se-ABC-301-s0/20261104T211909Z-software-engineer-observation-534a582c
  - se-ABC-301-fit
  - src/evaluate.passer.test.ts
supersedes: 
seal: sha256:9d415cd35bd4cae86bb02fabd170766a4933fe7d87de298b208fb161803c88af
---

# arch-records-1104 ruling: the first "every half 0" row is RE-PINNED on its eg line, and "every part is 0" is RETIRED. Committed first, at `a1e19981`, in `ADR-0067`; the fit may take it from there

Architect/Design, task `arch-records-1104`, on `grugops/arch-records-1104` from `main` `83894094`. Records only; nothing was run. Item 1 of the brief, ahead of everything else because `se-ABC-301-fit` scope 4 waits on it. The line of record is `ADR-0067`'s dated line above § What would falsify this, committed at `a1e19981` before any other line of this task. Rulings applied: `…42c82347`, as narrowed by `…0edae6fd` item 2.

| row (`src/evaluate.passer.test.ts`) | ruling | what the fit hop does at scope 4 |
|---|---|---|
| "PASSED_KING_ENEMY, PASSED_KING_OWN, PASSED_FREE: by own rank in PASSED's shape, every half 0" | **RE-PIN**, eg line only | the shared eg literal becomes three, each export's emitted array, with a dated comment and a PR table line. `pair.mg`, `toHaveLength` and `PASSED_UNSTOPPABLE` `{ mg: 0, eg: 0 }` stay as written. The row reads "mg 0, eg as fitted"; the describe, "four exports, mg 0, U 0, eg as fitted" |
| "at the shipped values (every half 0) every part is 0 on every fixture" | **RETIRE**, named in `ADR-0067` | delete the row and `ZERO`, its only use; list it as retired in the PR table, citing the line |

**Why they differ.**
- The first row's eg literal records the table: a pin, and only the literal moves. The row's other assertions are `ADR-0070` d1 and d7, which the fit must keep, so a red on one is a defect.
- The second row cannot be re-pinned under B-T4's rule, "only the literal moves; the assertion's form stays". It has one literal for 44 fixtures, and the seam returns a different triple per side per fixture once values exist: 264 figures and a different claim. Its sentence is false by design after the fit, which is `…0edae6fd` 2's test. QE's freeze says of value 0 that these rows "add no bar there" (`…67b5eeac`), and it is on none of B-T4's never-re-pinned classes.
- What it read stays held, by reading: the table by the re-pinned row, U's hold by that row's U line, the seam by K1 (c). It stayed green on all 11 of QE's mutant trees (`qe-ABC-301-s0` `raw/summary.txt`).

**Rejected:** re-pinning the 264 figures; keeping the row under an all-zero table; narrowing it to `un`. Reasons are in the line.

**When it applies:** at scope 4, on an emission with a non-zero E4a eg half. If every half stays 0, neither row is red and neither changes. If the pull does not merge, both stand.

**Weak, stated:** "held elsewhere" is reasoned from the rows and QE's mutant trees, which ran at shipped 0. No fitted table has been run through these rows.

**Stands unchanged:** no bar, level or free set moves. The K1 (b) literals stay pins by d6's line. The P1 row needs no change: QE read it green on a fit-shaped table (`raw/fit-shape.txt`).
