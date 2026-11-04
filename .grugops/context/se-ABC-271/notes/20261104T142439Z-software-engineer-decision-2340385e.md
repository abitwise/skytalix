---
id: 20261104T142439Z-software-engineer-decision-2340385e
kind: decision
by: software-engineer
at: 2026-11-04T14:24:39Z
verified_by: 
confidence: high (built and read against QE's frozen rows; the six readings are stated for QE and the reviewer)
refs:
  - se-ABC-271
  - grugops/ABC-271
  - ABC-271
  - EPIC-011
  - E4a
  - ADR-0070
  - orch-2026-10-30a/…730399e5
  - orch-2026-10-30a/…6ccd8243
  - qe-ABC-271-freeze/20261104T133856Z-qe-e2e-decision-67b5eeac
  - qe-ABC-271-freeze/20261104T133902Z-qe-e2e-observation-a8173b00
  - sha256:bf3c205bf4106209e3151717d93542180d90d344cecfdfbb6f2a30c9d5db887a
  - 10f29a82
  - src/08e56302
  - main/3a08d244
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.passer.test.ts
  - src/evaluate.passer-fixtures.json
  - src/evaluate.taper.test.ts
  - src/evaluate.pawns.test.ts
  - src/transposition.test.ts
  - K0
  - K1
  - K2
  - K3
  - K4
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
supersedes: 
seal: sha256:319987fb30407a56ef56d20063024fe3f03efa8d680309df3ad5303f1b155129
---

# se-ABC-271 design: E4a built as ADR-0070 d1–d4 state it, at 0, outside the pawn memo; the form choices and the three places the build reads the ADR one way

Software Engineer, task `se-ABC-271`, on `grugops/ABC-271` from `main` `3a08d244` (`src/` tree `4fb3da04`, the tree QE froze on; non-test `src/` unchanged since the probe's `8adb0a18`, so one K0 set). Code commit `10f29a82` (`src/` tree `08e56302`).

## What was built
- **`src/evaluate-params.ts`** (data only): `PASSED_KING_ENEMY`, `PASSED_KING_OWN`, `PASSED_FREE` as `MgEg<readonly number[]>` in `PASSED`'s shape (8 entries, own rank 0 … 7, 0 and 7 never read), and `PASSED_UNSTOPPABLE: MgEg<number>`. Every half of every entry is 0. Each comment carries "start (prior): 0. The rule (below) was probed and not shipped (`ADR-0070`)" and the probed rule.
- **`src/evaluate.ts`:**
  - `loadParameters` fills three `Int32Array(8)` from the `.eg` halves and one scalar for U. The middlegame halves are not read (d1: every mg half stays 0; a data row pins it).
  - `pawnStructure` records the frontmost passer of each file per side as a 24-bit word (3 bits a file, the board rank, 0 for none): white overwrites as ranks rise, black keeps the first one it meets. The rear passer of a doubled pair is not recorded (d2).
  - The memo stores the two words in two new `Int32Array(2^14)`: 2^14 × 36 bytes = 576 KiB (d2). A hit sets the words as a miss does.
  - `passerTerms(board, word, ownKing, enemyKing, white, defenderToMove, phase)`, one side, one loop over the eight files: Chebyshev distances to Q, both capped at 5 for king distance; the walk along the file up to and including Q (any piece blocks, a king included); U at `phase === 0` once per side when a free passer's moves (5 on R 1, else 7 − R) < d(enemy king, Q), **uncapped** (`QE-271-b`), − 1 if the defender is to move.
  - In `whiteMinusBlack`, after the blend's `w` is known: `if (w < PHASE_SPAN && (whitePassers | blackPassers) !== 0)`, Δ += white side − black side. The king squares are the walk's; no new pass over the pieces. No fast path at value 0 (d3).
  - No switch, no door pair (d4; Orchestrator `…730399e5` item 1).
- **Seams (test-only):** `passerTermsForTest(position)` returns `{ white: { kd, free, un }, black: { kd, free, un } }`, per side and never netted (`QE-271-a`), from the same `passerTerms`. `pawnStructureForTest(position, memo)` returns the packed sum and both words, through the memo or fresh, for K1 (e).

## Readings taken (each stated so QE can grade it)
1. **The arrays have 8 entries, not QE's 7.** QE's `values` run R 0 … 6. The ADR says "in the file's present shape", which is `PASSED`'s 8. The tests pad QE's arrays with a trailing 0 (index 7, never read). QE's frozen rows are unchanged.
2. **The seam computes the parts at every phase** (`QE-271-c`). `evaluate` skips them at w = D. No K1 (c) fixture is at phase 24.
3. **U reads the phase argument (`phase === 0`).** That is the phase the search carries (cut C1) and `phaseOf` for `evaluate`.
4. **A second test-only export, `pawnStructureForTest`,** was added for K1 (e) ("the two passer words included"). No existing seam exposes the words. Only test files call it. Flagged for the reviewer: one more `…ForTest` export than the ADR names.
5. **K1 (d)**: `ABC-274` A9's bound now counts the E4a pairs conservatively (8 frontmost passers a side × (5·max|KE| + 5·max|KO| + max|FREE|) + |U|), even though they add to Δ outside the packed sum, so a fitted table stays bounded. One new row shows a large half turns it red. At 0 the bound reads 15 910 / 17 510, as before.
6. **QE's fixtures are a byte copy**, `src/evaluate.passer-fixtures.json`, and the test checks its sha256 (`bf3c205b…887a`). Nothing was retyped.

## Not done, by the ADR
- F2's cost cut (the 128 × 128 distance table, the bit-scan) is not taken: K3 is under its bar on the graded set (see the acceptance note).
- No `tools/` edit. The emitter's 13-export list (`…6ccd8243` item 3) is still the second pull's.
- No ticket, EPIC, ADR or board edit (brief fences).
