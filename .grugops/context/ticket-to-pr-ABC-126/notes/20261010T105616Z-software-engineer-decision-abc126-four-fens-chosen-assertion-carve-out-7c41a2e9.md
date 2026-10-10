---
id: 20261010T105616Z-software-engineer-decision-abc126-four-fens-chosen-assertion-carve-out-7c41a2e9
kind: decision
by: software-engineer
at: 2026-10-10T10:56:16Z
verified_by:
confidence: high
refs:
  - ABC-126
  - ABC-079
  - ABC-084
  - ABC-127
  - ABC-010
  - ADR-0028
  - ADR-0033
  - src/puzzle-corpus.ts
  - src/quiescence.test.ts
  - src/puzzle-suite.test.ts
  - .grugops/context/recut-abc010/notes/20261010T091320Z-ba-pm-decision-abc010-recut-criterion9-fence15-rows-fold-into-abc126-d91057f3.md
  - .grugops/context/qe-ABC-127/notes/20261010T094235Z-qe-e2e-decision-abc127-verdict-pass-with-gaps-affa3970.md
  - 20261010T105616Z-software-engineer-observation-abc126-gates-red-first-margins-puzzle-lane-b3d870e5
supersedes:
---

# `ABC-126`: the page's four measured candidates are adopted unchanged; the not-in-check claim is asserted in both rows; the carve-out goes

Hand-authored and unsealed (degraded posture, `AGENTS.md`). Branch `grugops/ABC-126-corpus-repairs`
from `d6aceeb5`; code commit `d10ffeff`. Readings: `…b3d870e5`.

## D1 — the pair: the page's candidate (king off the bishop's diagonal), both colours

- `4k3/8/1p6/b7/8/8/8/R4K2 w - - 0 1` (was `…/R3K3 w`), mirror `r4k2/8/8/8/B7/1P6/8/4K3 b - - 0 1`
  (was `r3k3/…`). Names and losing moves (`a1a5`, `a8a4`) unchanged; 24 rows unchanged.
- Why this one and no search for another: re-measured on this tree it meets every clause of `A2`/`A3`
  (not in check, capture legal, 12 legal / 8 non-king, `ADR-0033` accepted, quiescence avoids it at
  d1 and d3, the bare leaf takes it at d1), and it is the smallest edit — one king step per row.
- Provenance: a comment line pair above each row, in the shape of the `ABC-082` re-find comment.

## D2 — `A7`: the page's candidates, keys and gain from the oracle

- "pin: Re1": pawn h8 → h7, `4k3/7p/8/4q3/8/1P6/P2K4/R7 w - - 0 1`. Oracle keys `[a1e1]`, gain +4 —
  both unchanged, so `accept` and `source` are unchanged.
- "discovered check": black king g7 → f8, `3q1k2/8/8/8/3B4/8/6PP/3R2K1 w - - 0 1`. Oracle keys
  `[d4g7, d4c5]`, gain +4, so `accept` becomes `["d4g7", "d4c5"]` and `source` `+6` → `+4`. This also
  closes `QE-127-f`: the row's set no longer rests on the "a king is never captured" convention,
  because the position is legal, and the deep `A2` oracle row is green over it.
- Names byte-identical; `win-material` count unchanged (16); baseline untouched.

## D3 — the assertions

- `src/quiescence.test.ts` "carries at least 20 positions, none of them in check…": parses once,
  asserts `isInCheck(position) === false` with the row name, then legality as before. `isInCheck`
  joins the existing `legal.ts` import.
- `src/puzzle-suite.test.ts` A6 row: the `kind !== "do-not-hang"` guard and its three-line comment
  are removed; every puzzle (62) asserts not in check. The row title is kept byte-identical
  ("no added row starts in check"), even though "added" now undersells it — renaming a row title
  is not asked, and titles are what reports key on.
- The hard `expect` inside the loop stops at the first failing row, so "red on exactly 2" was shown
  stepwise (shipped → red on the first pair row; first row re-found → red on the mirror only;
  both → green), not with `expect.soft`, which would change the row's style.

## Not done, on purpose

- **`QE-127-e`** (cross-check `unsolved` names against the corpus) is routed to BA/PM, not on this
  page; adding a row would move the lane count. Left alone.
- **`HANGING_CORPUS`'s header** still says each row "was checked by hand". It is now also asserted;
  the comment is not false, so it is left (surgical).
- **No `AGENTS.md` line is owed**: no new test row, no lane count changes (quiescence deep 37 / 29
  default; puzzle 17 / 12 default — both as before).
