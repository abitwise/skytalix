---
id: 20261011T150610Z-architect-design-decision-abc083-refind-5061-as-5147-clean-lead-bar-8205516a
kind: decision
by: architect-design
at: 2026-10-11T15:06:10Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-127
  - ADR-0028
  - ADR-0034
  - ADR-0026
  - src/puzzle-corpus.ts
  - b29c837c
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-decision-abc083-seed5061-class-l-refind-route-b631991b.md
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-observation-abc083-seed5061-readings-lmr-near-tie-at-d5-67b0c99a.md
  - .grugops/context/design-ABC-083-refind-5061/probe/focus-base.txt
  - .grugops/context/design-ABC-083-refind-5061/probe/focus-branch.txt
  - .grugops/context/design-ABC-083-refind-5061/probe/screen-base.tsv
  - .grugops/context/design-ABC-083-refind-5061/probe/screen-branch.tsv
supersedes:
---

# Ruling: re-find seed 5061 as seed 5147 (`ADR-0028` decision 2, read through `ADR-0034` decision 4). Landed in its own commit, `b29c837c`. No owner word is owed

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.

## The ruling

- **QE's class L stands (`…b631991b`).** `ADR-0028` decision 1's three proofs:
  - Proofs 1 and 2 are MET on QE's record.
  - Proof 3 is MET at `b29c837c`: `PUZZLE_DEEP=weakened` reads 15/58 and exits 1, and its `A3` row is green.
- **The confound is an LMR near-tie, not a label margin.** The fix is therefore a row whose label is clear
  of LMR's drift. A re-weight would not fix it, and neither would a level move.
- **The bar this hop rules (QE's recommendation, widened to d ± 1).** It must hold on base `5ed308a8` and on
  the branch:
  1. ADR-0034 d4's list:
     - same class and tags (`win-material`, `["quiescence"]`), re-measured with `W1` and `W5`;
     - the answer comes from the material oracle;
     - solved on both trees, and solved at 0.8x readings on base;
     - its own commit, with no trigger-list file and no baseline file.
  2. **The clean lead is > 75 cp** (`ADR-0026` d9's ceiling) at d − 1, d and d + 1. Here d is the depth the
     suite's call completes. The lead is the best accepted move minus the best other move, each root child
     searched by `searchWithoutReductions` at one ply less, negated.
  3. At d, fixed-depth `search()` and the suite's call both play an accepted move.

## The replacement row

`win material, seed 5147: white Q+B against B+N`, `7k/6n1/7B/1Q6/1b6/5K2/8/8 w - - 0 1`.
- It accepts `b5b4`, `b5b8` and `h6g7`. The source is `${WIN3} +3, seed 5147`, and the tags are `["quiescence"]`.
- It comes from `ABC-127`'s own `cand-wm` pool, from the same generator and oracle as seed 5061. It is white
  to move, like seed 5061, and its accepted moves are not quiet, so it is not `quiet-key`, like 5061.

| reading | base `5ed308a8` | branch (`b29c837c`) |
|---|---|---|
| suite call, 20 / 25 / 26.25 / 27.5 / 31.25 / 37.5 readings | SOLVED `b5b4` d5 at every rung | SOLVED `b5b4` d5 at every rung |
| 50 readings | SOLVED `b5b4` d6 | SOLVED `b5b4` d6 |
| clean lead at d4 / d5 / d6 | 270 / 280 / 280 cp | 282 / 280 / 285 cp |
| `search()` at d4 / d5 / d6 | `b5b4` / `h6g7` / `b5b4` (all accepted) | `b5b4` / `h6g7` / `b5b4` (all accepted) |
| `chooseMoveWithoutReductions` at 25 | SOLVED d4 | SOLVED d4 |
| `W1` (quiescence off) | MISSED `b5e5` d5 | MISSED `b5e5` d5 |
| `W5` (depth cap 4) | SOLVED d4 | SOLVED d4 |

For comparison, seed 5061 led by 105 cp on base and 50 cp on the branch at d5 (`screen-*.tsv`).

**The other shortlisted rows** (white to move and `quiescence`-only on both trees; `focus-*.txt`):
- **1917:** 195 cp at d5 but **20 cp at d6**. Rejected. It is the reason for the ± 1.
- **1563:** passes, at 85–156 cp. Thinner than 5147.
- **1881:** passes, at 240–335 cp, but it solves at d7. 5147 was preferred because it solves at d5, the
  same depth as 5061.

## Readings on the committed tree (`.grugops/context/design-ABC-083-refind-5061/probe/`)

- **`PUZZLE_DEEP=1` at `b29c837c`:** **54/58**, exit 0, 18/18 passed. There are no NEWLY-MISSED and no
  NEWLY-SOLVED lines. The per-row lines differ from QE's `r1-branch.rows` only on this row, which went from
  MISSED `g2e1` to SOLVED `b5b4` d5 n20514.
- **`PUZZLE_DEEP=1` on base with the same row:** **54/58**, exit 0. The per-row lines differ from QE's
  `r1-base.rows` only on this row.
- **`PUZZLE_DEEP=weakened` at `b29c837c`:** 15/58, **exit 1**. The gate row is red, and `A3` is green.
- **Gates:**
  - `npm test`: 56 files, 1 739/1 739;
  - skip count 0;
  - `npm run lint` and `npm run typecheck` clean.
- **Scope (`scope.txt`):** the commit touches `src/puzzle-corpus.ts` only. No trigger glob matches it, and
  no production module imports it. The baseline file was not touched, and the count and total are
  unchanged.

## Whose word

There is no owner word for the re-find (`ADR-0028` d5). The standing bar is a PROPOSED `ADR-0034` addendum
(`…d95b51f2`). The owner's acceptance is owed for that addendum, but it does not block this ticket.
**Next:** QE re-reads the delta (`PUZZLE_DEEP=1` 54/58, `=weakened` exit 1).
