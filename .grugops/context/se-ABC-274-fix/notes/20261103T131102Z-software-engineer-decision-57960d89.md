---
id: 20261103T131102Z-software-engineer-decision-57960d89
kind: decision
by: software-engineer
at: 2026-11-03T13:11:02Z
verified_by: 
confidence: high: diff read back from git; S2 red-then-green observed
refs:
  - se-ABC-274-fix
  - grugops/ABC-274
  - ABC-274
  - EPIC-011
  - E2-pre
  - ADR-0067
  - arch-ABC-274-seam/20261103T130452Z-architect-design-decision-3169a174
  - S1
  - S2
  - S3
  - A3
  - Q1
  - withParametersForTest
  - src/evaluate.ts
  - src/evaluate.taper.test.ts
  - c131ecd0
  - 7daae342
supersedes: 
seal: sha256:c1af654dfe92df94cb9bc69de944f2846d22f24a1c10ea5ad40057c5cbee60b8
---

# se-ABC-274-fix: S1–S3 met by one test-only repair; seam body moves the loader inside `try`; A3's mobility count is a test board counter

Per `arch-ABC-274-seam` `…3169a174` (ADR-0067 d8 dated line).

- **S1 (choice: test counter, not the seam at 1/1).** `mobilityCount` in `src/evaluate.taper.test.ts` counts m by `squaresReached`'s rule (non-pawn pieces incl. kings; empty squares plus the first enemy-held square per line). `reach` returns it; the `null` clamp guard is dropped because the mobility shifts are written with `clamp`, which is exact whether or not mg's half is clamped. Chosen over the seam-at-1/1 route so A3's row selection reads nothing inside any seam (QE's Q1). A separate S1 row checks the counter against `evaluate` − `evaluateWithoutMobility` inside the seam at weights 1/1, caps 1 000 000, over the whole A3 corpus.
- **S2.** `withParametersForTest`'s body: `loadParameters(parameters); clearPawnCacheForTest();` moved inside `try`. The docblock (outside the body) is unchanged; its "even on a throw" now holds for a loader throw too.
- **S3.** One source-pin row in the `src/evaluate.pawns.test.ts` form, plus `tools/` read recursively and `loadParameters(` call lines pinned (load + 2 in the seam).
- **Board:** `plans/board.md` on the branch already equals `main` (git diff main empty); not edited.
- Consequence for row selection: the mobility families' first-six rows may differ from c131ecd0's (the null guard is gone); selection stays the stated rule. No expectation moved; no re-pin.
