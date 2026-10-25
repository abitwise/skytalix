---
id: 20261025T053234Z-software-engineer-decision-3c66f0d7
kind: decision
by: software-engineer
at: 2026-10-25T05:32:34Z
verified_by: 
confidence: high (built from the ruling; literals checked against the printed c2 block and by the A2 rebuild rows)
refs:
  - ABC-215
  - EPIC-008
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - arch-design-ABC-215/20261025T045829Z-architect-design-decision-e04234f4
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - bapm-amend-ABC-215/20261025T050544Z-ba-pm-decision-fb4f7c9c
  - grugops/ABC-215
  - ec9331e2
  - c8fc3075
  - ABC-214
  - ADR-0048
  - ADR-0036
  - ADR-0031
  - LIC-PUB-1
  - OQ-214-4
  - NOTICE
  - README.md
supersedes: 
seal: sha256:a363a77f0b9edff8da657c64a530ce9fb2a9b58a56628eb0e0de645be08acfa7
---

# ABC-215 built to the design ruling: seven arrays by rule (c2), one TEST-ONLY export, A2 rebuild rows, carve-out gone

Task `ticket-to-pr-ABC-215`, branch `grugops/ABC-215` from `main` `ec9331e2` (A1 at base: `NOTICE` 1, `See NOTICE` 1). Code commit `c8fc3075`. Not pushed, not merged.
Source: page § Design ruling (`arch-design-ABC-215` `…e04234f4`, `…cbbb9a63`) and A8/A8a as amended (`bapm-amend-ABC-215` `…fb4f7c9c`). The values were taken from the ruling, not re-derived.

## Values as built (`src/evaluate.ts`, rank 8 first)
- `PIECE_VALUE` `[0, 100, 325, 325, 500, 900, 0]`. Pawn `2 × e × (R − 2)`; knight `10 × n − 50`; bishop `5 × (n − 9)`; rook 20 on `R = 7`; queen `5 × ring − 5`; king `max(−50, −10 × d − 10 × (R − 1))`. Every literal equals the ruling's printed `c2` block.
- Cells differing from base: `PIECE_VALUE` 2/7, pawn 46/64, knight 64/64, bishop 18/64, rook 20/64, queen 27/64, king 50/64. These equal the ruling's counts.
- Each array keeps its 8×8 literal under a `// Rule:` comment. The hot path is unchanged (same `readonly number[]` lookups, no load-time builder).

## A2
- One TEST-ONLY export, `VALUE_TABLES_FOR_TEST`, names the seven arrays (the `evaluateWithoutMobility` precedent). Production does not read it.
- 15 rows were appended to `src/evaluate.test.ts` (default lane, no new file). The test imports only `./evaluate.ts` plus constants from `./position.ts`, which it already imported, so it adds no limb edge. The rows: keys equal to A1's seven (1); each array equals an independent rule rebuild over every entry (7: knight steps and diagonal squares counted on an empty 8×8 grid, 64 entries each, 7 `pieceType` indexes for `PIECE_VALUE`); each array differs from a base literal in at least one entry (7).

## Scope 3 and A8a
- Header `:16`–`:22` became one line: "`PIECE_VALUE` and the six tables are this project's own, each made by the rule written above it." `:12`–`:14` is kept. `:60` ("Deliberately small and hand-written…") now points at the rules.
- `NOTICE`: the `Evaluation values (CC BY-SA 3.0)` section and the blank line after it are deleted (base lines 7–16; the ruling's "7–15" leaves two blank lines). The file is byte-equal (`cmp`) to `ABC-214` Scope 5's common part.
- `README.md`: one `-U0` hunk `@@ -85,2 +85 @@`, ending "…lists them: four grugops kit files (MIT)."
