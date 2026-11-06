---
id: 20261106T205243Z-software-engineer-decision-96abeaf8
kind: decision
by: software-engineer
at: 2026-11-06T20:52:43Z
verified_by: 
confidence: high: rows compared back to QE's file, 0 differ; the flip is my call, open to QE
refs:
  - ABC-291
  - ADR-0075
  - EPIC-011
  - NFR-008
  - qe-ABC-291-k1/20261106T203639Z-qe-e2e-observation-b850a2ad
  - qe-ABC-291-k1/20261106T202814Z-qe-e2e-decision-2e186a33
  - qe-ABC-291-k1/20261106T203702Z-qe-e2e-observation-5de6a358
supersedes: 
seal: sha256:afd7927d7ebc60f582f7081b731d0c57a87346abbbcf1d8c488f5239d68064b7
---

# se-ABC-291-k1rows decision: QE's 24 rows join `SEAM_ROWS`, values unchanged; the seam block reads all four images

The brief's rows are all in `src/evaluate.pawns.test.ts`. Ids, titles, FENs and values were generated from `raw/k1-rows.mjs` (sha256 `2e963a1b…`, as sealed in `…2e186a33`) and QE's `fenOf`, then compared back: 24 rows, 0 differ.

- **The rows:** N13, N14, N16, N17; L4; D2, D3, N2, N5, N6, N11, N12; W1–W7; P4; B9, B11, A5, B7. `SEAM_ROWS` goes from 36 to 60.
- **Why they went into `SEAM_ROWS`, not a new table:** K1 (c)'s block, and both hot-path rows of K1 (d), read that table. So all 24 are also read by the hot path and the unequal halves with no new `it`.
- **Title:** "a backward rear pawn of a doubled pair still pays: d2" now reads "a backward rear pawn of a doubled pair pays backward: d2; the seam holds no DOUBLED part". Value unchanged.
- **Comment:** the file's head now says QE's freeze came after the build, cites `…2e186a33`, and says whose rows are whose. The old line, "No QE freeze … is on record", is gone.

## One call beyond the brief's list
The block now also reads the file flip and the flip with the colour mirror, through a local `fileFlip` helper of six lines. The brief names `b850a2ad`'s rows, and that note's Smaller gaps list "Wings" apart from them. QE's rows are defined as four images (`…2e186a33`), so a row read in two is not QE's row. It is also load-bearing: with the plant on the left arm only, N6 goes red by its flip alone. It applies to all 60 rows, adds no `it`, and changes no expected value. To undo it, delete the helper and its five lines in the block; no row depends on it to pass.

## Not carried
QE's run also read each image with the side to move flipped, where legal, and read the memo per row. These rows read the side the FEN gives. Neither is in the brief.
