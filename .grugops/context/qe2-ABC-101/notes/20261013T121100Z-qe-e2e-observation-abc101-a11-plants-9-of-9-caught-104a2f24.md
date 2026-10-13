---
id: 20261013T121100Z-qe-e2e-observation-abc101-a11-plants-9-of-9-caught-104a2f24
kind: observation
by: qe-e2e
task: qe2-ABC-101
at: 2026-10-13T12:11:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-014
  - src/render.ts
  - src/render.test.ts
  - 20261013T121000Z-qe-e2e-observation-abc101-a11a-f-u0-merge-cli-deep-gates-b51fa1c4
supersedes:
---

# `A11` plants: 9 planted plus 1 control, 9 caught, 0 caught by nothing

This note is hand-authored and unsealed. Each plant was made in a fresh `git archive d22a709f` copy under the session
scratchpad (`…/scratchpad/qe2101/plants/<name>`), outside the repository. Each copy got one `node_modules` symlink and one
exact-string edit to `src/render.ts` (`probe/plants/plant_edits.py`, asserted to match once). Each copy ran the **full
default lane** (`npx vitest run`, `*_DEEP` unset, JSON result file), and then the copy was removed by exact path. The copy
count was **0 before and 0 after** each of the three batches. The script is `probe/plants/run_plants.sh`. The raw output is
`probe/plants/plants.batch{1,2,3}.out.txt`. In batch 2, `p3b`'s *listing* crashed in QE's printer on a lone surrogate in a
failure message. The printer got one line (`errors="backslashreplace"`), and `p3b` was re-run alone in batch 3. Its counts
are the same in both batches (1770 passed, 22 failed).

| plant | the edit | suite | caught by (rows that red) |
|---|---|---|---|
| `p0-control` | none | **1792/1792 green** | the copy is a valid instrument |
| `p1-one-pair-back` (brief: one pair back) | `[KNIGHT]: ["♘", "♞"]` | 9 failed | `render.test.ts`: the white-bottom literal; 5 snapshot `it`s (all but `position-3`, which has no knight); the oracle (24 cells); **`A11a`**, **`A11b`** |
| `p2-ascii-case-swapped` (brief: ASCII case too) | all six `ascii` pairs reversed | 11 failed | `render.test.ts`: "flips BOTH axes…", "draws ASCII pieces with case as the only colour marker", both start-position literals (white- and black-bottom), all 6 snapshot `it`s (`ascii` entries), the oracle. **`A11a`/`A11b`/`A11c` stay green**, correctly: they read `unicode` only, and the `ascii` guard is `A11d`'s snapshot entries plus ABC-014's rows |
| `p3a-variation-selector` (brief: 2-unit glyph) | White king `"♚︎"` (2 code points, 2 units) | 23 failed | `render.test.ts` 18, including **`A11a`, `A11b`, `A11c`** and ABC-014 QE's "keeps 9 rows of 18 CODE POINTS"; `frame.test.ts` 4 (ABC-018 message-region fit); `turn-loop.test.ts` 1 (ABC-021 `A9` widest refusal) |
| `p3b-astral-one-code-point` (the other 2-unit shape) | White king `"\u{1FA00}"` (1 code point, 2 UTF-16 units) | 22 failed | `render.test.ts` 17, including **`A11c`**'s units half, `A11a`, `A11b`, the geometry rows and the snapshots; `frame.test.ts` 4; `turn-loop.test.ts` 1. ABC-014 QE's code-point row stays green here, as it should, because this plant is 18 code points: **`A11c`'s `String.length` half is the row that this shape needs** |
| `p4a-escape-replaces-piece` (brief: escape byte) | White queen `"\u001b"` (length-preserving) | 17 failed | `render.test.ts` 12: ABC-014 QE "emits no ANSI escape and no control character", **`A11c`** (0 `U+001B`), `A11a`, `A11b`, the range `it`, the literal, 5 snapshots and the oracle; `render-seam.test.ts` 2 (ABC-041 `A1`, `A4`); `cli.test.ts` 1 (ABC-042 `A4`); `turn-loop.test.ts` 2 (ABC-019 `A7`, `A16`) |
| `p4b-escape-on-piece` | Black queen `"\u001b♕"` | 21 failed | `render.test.ts` 16 (both escape rows, **`A11c`**, the geometry rows, `A11a`, `A11b`, …); `render-seam.test.ts` 2; `cli.test.ts` 1; `turn-loop.test.ts` 2 |
| `p5a-orientation-flipped-old-table` (brief: orientation flipped without the glyph swap) | pre-`A11` table, `whiteBottom = orientation !== "white-bottom"` | 17 failed | `render.test.ts`: both start-position literals, "flips BOTH axes…", all 6 snapshots, the oracle, the file-letter column row, the no-pieces row, **`A11a`, `A11b`** |
| `p5b-orientation-flipped-new-table` | `A11` table, orientation inverted | 17 failed | the same 17 rows as `p5a` |

**Every plant the brief named is caught, and nothing is caught by nothing.** Two plants show which row carries them:
- `p3b` (18 code points but 19 units) passes ABC-014 QE's code-point row. It is caught by `A11c`'s `String.length` half and
  by the older `String.length`-based rows: row width, 64 cells, the occupied-board geometry row, the snapshots and the literal.
  `A11c` is therefore one of several catchers here, not the only one.
- `p4a` (an ESC that keeps the length) is caught by `A11c` **and** by ABC-014 QE's older escape row, so either one alone
  would hold it.
