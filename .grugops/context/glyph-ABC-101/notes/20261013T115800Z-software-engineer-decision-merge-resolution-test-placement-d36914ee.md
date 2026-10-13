---
id: 20261013T115800Z-software-engineer-decision-merge-resolution-test-placement-d36914ee
kind: decision
by: software-engineer
task: glyph-ABC-101
at: 2026-10-13T11:58:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - src/render.test.ts
  - 20261013T115000Z-ba-pm-decision-a11-folded-a9-widened-dor-10-of-10-se-qe-steps-493e3ec3
supersedes:
---

# Merge resolution, `A11` test placement, the merge commit's trailer

This note is hand-authored and unsealed.

1. **Merge resolution (pre-ruled, keep both).**
   - `plans/traceability.md`: the branch's two rows ("build delivered on branch", "`AGENTS.md` slot landed") come first, then
     `main`'s two rows (design contract, BA/PM amendment 2). Only the markers were removed.
   - The ABC-101 page: the branch's
     "Delivery — addendum, 2026-10-12" comes first, then `main`'s "Amendment — 2026-10-13". Both are whole. The only added text is one
     blank line between the addendum's table and the amendment's heading, so the heading does not run into the table.
2. **Test placement.** `A11a`–`A11c` are one new `describe("ABC-101 A11 — piece polarity")` at the end of
   `src/render.test.ts`. It reuses the file's own helpers (`piecesFromFenPlacement`, `cellAt`, `glyphOf`,
   `eachMatrixCell`), so the bounded hunk is a pure append. `A11a`'s expected table is written as code-point numbers, so
   it is independent of both `render.ts` and the re-pinned `UNICODE_BY_FEN_LETTER`.
3. **The merge commit has no `Co-Authored-By:` trailer.** The brief orders `git commit --no-edit`, and that keeps
   git's default merge message, as the prior merge `e88a7832` did. Adding the trailer afterwards would need
   `--amend`, which is fenced. `d22a709f` and the records commit carry the trailer.
