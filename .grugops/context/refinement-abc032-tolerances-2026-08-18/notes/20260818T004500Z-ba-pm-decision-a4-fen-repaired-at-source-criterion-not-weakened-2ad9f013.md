---
id: 20260818T004500Z-ba-pm-decision-a4-fen-repaired-at-source-criterion-not-weakened-2ad9f013
kind: decision
by: ba-pm
at: 2026-08-18T00:45:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - ABC-031
  - A4
  - A2
  - G8
  - plans/tickets/ABC-032-parse-san.md
  - src/coordinate-move.test.ts
supersedes:
---

# `A4`'s FEN is repaired on the page. One character. The criterion is unchanged and is NOT weakened.

**What the page said:** `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1`. Kings adjacent on `e1`/`e2`; the position
is illegal; the entire legal list is `["Kxe2"]`; no promotion exists. **`A4` as printed was
unsatisfiable by any correct implementation** — confirmed by the engineer, independently by QE, and
independently again by this hop.

**What the page says now:** `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` — black king `e2` → `e3`, nothing else
changed. It yields `Kf1, Kd1, e8=Q+, e8=R+, e8=B, e8=N`. **This is the position the delivered code was
measured against**, so the page now states what was actually verified rather than something no
implementation could satisfy.

**The criterion itself is untouched, and that was the constraint on this repair.** Still four
promotions, still `e8=Q` by reference, still `outcome: "ambiguous"` with **exactly 4** on the bare
`e8`, still the suffix triple. Nothing was softened to make the row pass; the row already passed on
the position the engineer and QE both used. **Recorded on the page: `A4` is MET on the corrected
position.**

## Why the repair, rather than another pin

`ABC-031` chose the same one-character correction at its `A2` and it is the identical FEN, so the two
tickets now agree by construction rather than by coincidence. The alternative — leaving the page
defective and letting a third ticket rediscover it — is exactly the failure `G8` names.

## The `ABC-031` pin is CORRECT and must not be removed

`src/coordinate-move.test.ts:17` holds `A2_FEN_AS_WRITTEN = "8/4P3/8/8/8/8/4k3/4K3 w - - 0 1"` with a
row asserting the defect (`legal` is exactly one move). **That is a deliberate record of a known-bad
input, not a leftover.** It is what makes the repair verifiable rather than asserted, and a future
reader who finds a "wrong" FEN in a test file and tidies it away destroys the only executable
evidence that the two ticket pages were ever wrong. It is fenced OUT of `ABC-106`'s scope in writing
for that reason.

## Scope of this decision

The `ABC-032` page only. `ABC-031` is merged and its `A2` was repaired at its own hop; nothing there
is re-opened. `plans/board.md` is the Orchestrator's and was not opened. No file under `src/` was
touched.
