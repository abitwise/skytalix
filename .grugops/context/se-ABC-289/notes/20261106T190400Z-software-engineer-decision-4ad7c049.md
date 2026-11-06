---
id: 20261106T190400Z-software-engineer-decision-4ad7c049
kind: decision
by: software-engineer
at: 2026-11-06T19:04:00Z
verified_by: 
confidence: high on the form, which reproduces the probe to the count
refs:
  - ABC-289
  - ABC-282
  - ABC-303
  - EPIC-011
  - ADR-0024
  - ADR-0056
  - ADR-0071
  - ADR-0074
  - NFR-005
  - NFR-008
  - NFR-009
  - arch-ABC-303-w1-rows/20261105T124145Z-architect-design-decision-0f8a4f82
supersedes: 
seal: sha256:60577c552649071a20f371798bcda7bc8ac442ff1cea8f7706dada9caacc899c
---

# se-ABC-289 decision: `ADR-0074` built as form D200b, in four choices the ADR leaves to the engineer; DP1 (a)'s wording read one way

Code `41525692` on `grugops/ABC-289` from `main` `063ca870`, which holds bundle 1. Nothing tuned.

1. **`deltaBase = standPat + DELTA_MARGIN`, set on the stand-pat branch.** The ADR writes the sum in one line. Keeping `const standPat` where it stands leaves `src/evaluate.taper.test.ts`'s source row as it was; decision 10 names no change there. Integers, so the sum is the same.
2. **The test reads `move.promotion === EMPTY` alone.** Out of check the list holds captures and quiet queen promotions only, so "does not promote" is "a plain capture". The probe also read `captured !== 0`, which cannot fire there.
3. **`deltaPruning` is the top rung.** Twenty `search` and fifteen `chooseMove` doors turn it off, `ABC-303`'s five among them, per § Consequences.
4. **Two doc lines were corrected** that the new record made wrong (the `seePruning` and `taper` field comments, both recursions).

**DP1 (a) is worded so no faithful build passes it.** `ADR-0074` d10 (a) and the page say: at `alpha = standPat + victim + 200` skipped, "at one centipawn more it is searched". By decision 1 the test is `bound ≤ alpha`, so a higher alpha still skips. The row "both sides of the edge" can only mean the sum one centipawn over alpha, that is alpha one below. I wrote it so: 700 skipped, 699 searched. Mutants `<` and margin 201 both red it. No bar or value moved. The ADR's and page's words are for the Architect and BA/PM.

**A row added beyond d10's list:** the `deltaPruning` literals and the field row (`ADR-0074` d7, d8), in `src/quiescence.test.ts`, three rows.
