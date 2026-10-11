---
id: 20261011T150610Z-architect-design-observation-abc083-win-material-clean-lead-screen-qe083c-3777f413
kind: observation
by: architect-design
at: 2026-10-11T15:06:10Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-127
  - ADR-0034
  - ADR-0026
  - QE-083-c
  - src/puzzle-corpus.ts
  - .grugops/context/design-ABC-083-refind-5061/probe/screen.mjs
  - .grugops/context/design-ABC-083-refind-5061/probe/screen-base.tsv
  - .grugops/context/design-ABC-083-refind-5061/probe/screen-branch.tsv
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-decision-abc083-seed5061-class-l-refind-route-b631991b.md
supersedes:
---

# QE-083-c screen: every `win-material` row's clean lead at its solving depth, on base and branch. Two retained rows are thin (seed 1700 at 75/75, seed 5180 at 120/77). Both are solved, and neither is cut

This note is hand-authored and unsealed. It reads all 16 `win-material` rows in `PUZZLES` and the 33 unused
rows of `ABC-127`'s `cand-wm` pool. The trees are base `5ed308a8` and branch `1b5d5c42`, whose corpus is
identical to base's. The probe is `screen.mjs`, with one row per line in `screen-{base,branch}.tsv`. Node
counts are deterministic.

- **What is measured.**
  - d = the depth the suite's call completes at 25 readings.
  - lead = the best accepted move minus the best other move, every root child searched by
    `searchWithoutReductions` at d − 1.
  - Also read on each row: fixed `search()` at d, `chooseMoveWithoutReductions`, the call at 20 readings,
    and the `W1` and `W5` variants.

| retained row | lead at d, base | lead at d, branch | solved, both trees |
|---|---:|---:|---|
| ABC-084's six rows | 335–995 | 377–1 068 | yes |
| seed 7 | 160 | 172 | yes |
| seed 111 | 405 | 417 | yes |
| **seed 1700** | **75** | **75** | yes (`g6g7` on base, `g6h6` on the branch) |
| seed 1706 | 210 | 273 | yes |
| seed 1811 | 310 | 366 | yes |
| **seed 5180** | 120 | **77** | yes |
| seed 5464 | 335 | 367 | yes |
| seed 5061 (replaced) | 105 | **50** | base only; base's fixed `search()` at d5 misses it |
| seed 5527 | 115 | 187 | yes (`chooseMoveWithoutReductions` misses it at d4 on both trees) |
| seed 279 | 185 | 181 | yes |

- **Only seed 5061 was below the bar on the branch.** Seeds 1700 and 5180 sit at or just over 75 cp. They
  are named, not changed. Cutting them would change `ADR-0034` d5's margin rule, which is the owner's word
  (see addendum `…d95b51f2`).
- **Tag drift, INFO.** On the branch, `W1` (quiescence off) solves seed 1700 (`g6h6` d5), so its
  `quiescence` tag no longer reads there. On base, `W1` misses it. Tags are `ABC-127` `A3` measurements
  recorded at curation, and no test asserts them. `ABC-127` `A1` counts the static tags and stays green.
- **Not measured:** `mate-in-N` and `do-not-hang` rows. A mate's lead is a mate score, and a do-not-hang
  row has no accepted set.
