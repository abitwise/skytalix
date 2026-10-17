---
id: 20261017T110000Z-software-engineer-observation-remeasure-31f8734a
kind: observation
by: software-engineer
at: 2026-10-17T11:00:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-024
  - ABC-024
  - ABC-009
  - ABC-023
  - .grugops/context/ticket-to-pr-ABC-024/probe/
supersedes:
---

# ABC-024 re-measured at base `b84dc637`, then with the rows (code commit `a18da7f5`)

No timing was read. Instrument: `probe/harness.mjs`. Two copies of the tree made by `git archive b84dc637`,
held in scratch outside the repo, with `node_modules` symlinked. Each mutant gets its own fresh `tsc --noEmit`
process and its own fresh `vitest run --reporter=json` process. `PERFT_DEEP` is deleted from the env. Each
anchor is asserted to occur exactly once. `src/moves.ts` is restored and re-hashed to
`6335b452fc21ffe2d0f902ecab930840` after every mutant. Result: 31 tree states per run, 0 broken builds,
0 harness errors. Raw output: `probe/mutants.base.log` and `probe/mutants.rows.log`.

- `md5 -q src/moves.ts` at base and at tip: `6335b452fc21ffe2d0f902ecab930840`. This is unchanged.
- Base default lane: 1792/1792 on 58 files, skip 0. With the rows: 1810/1810 on 58 files.

| mutant | base 1792 | with rows 1810 | ABC-024 rows that fail |
|---|---|---|---|
| WK f1 dropped | killed 1764 (incidental) | killed | A1 f1 only (+ A3 corridor quantifier) |
| WK g1 | killed 1791 (position-5 perft(3)) | killed | A1 g1 only (+ A3) |
| WQ b1 | killed 1789 (moves.test b1 row, perft) | killed | A1 b1 only (+ A3) |
| WQ c1 | killed 1790 (perft) | killed | A1 c1 only (+ A3) |
| WQ d1 | killed 1788 (perft, engine, book) | killed | A1 d1 only (+ A3) |
| BK f8 | killed 1778 (incidental) | killed | A1 f8 only (+ A3) |
| **BK g8** | **survived** | killed 1808 | A1 g8 only (+ A3) |
| **BQ b8** | **survived** | killed 1808 | A1 b8 only (+ A3) |
| **BQ c8** | **survived** | killed 1808 | A1 c8 only (+ A3) |
| BQ d8 | killed 1791 (book.test A2 only) | killed 1807 | A1 d8 only (+ A3) |
| **right test skipped, halfmove != 0** | **survived** | killed 1808 | both A2 `clocks` rows |
| right test skipped, fullmove != 1 | killed 1791 (search.ordering 262 nodes only) | killed 1805 | all four A2 rows |
| **right test skipped, ep set** | **survived** | killed 1808 | both A2 `ep` rows |
| CONTROL empty test removed | killed (97 failed of 1737; 2 files fail at load) | killed | all ten A1 rows |
| CONTROL right test removed | killed 1789 (NO_RIGHT_HELD x2, 262-node row) | killed 1803 | all four A2 rows |
| EQ01–EQ15 (the fifteen ABC-023 A5 controls) | **15 survived** | **15 survived** | none |

Five of the seven named survivors survived the base lane: BK g8, BQ b8, BQ c8, R-half and R-ep. The
other two died at base only on one incidental row each: BQ d8 on `tools/opening-book/book.test.ts` A2, and
R-full on `src/search.ordering.test.ts` "262 nodes". That is the same set BA/PM found at `1eb2edbc`.

How the fifteen controls are written in `harness.mjs`. 1–6 widen a guard to also admit the enemy KING,
QUEEN or ROOK: 1–3 on the king's square, 4–6 on the rook's. 7–9 make a guard colour-blind (`pieceType`):
7 the king's square, 8 the rook's, 9 both. 10 and 11 turn the king guard's `continue` into `break` and
`return`. 12–14 move both identity guards below the empty test, below the through-check test, and above
the right test. 15 adds an extra condition that the rook's square is non-`EMPTY`. These are my encodings of
ABC-023 A5's prose list. No earlier hop committed its own mutant source.

A3 test-file mutants (`probe/qmut.mjs`, the hardening file alone): deleting any one of the 10 A1 rows turns
the A3 corridor quantifier red. Narrowing any one of the 4 A2 rows to `- 0 1` turns the A3 scalar quantifier
red. 14/14 went red. I also widened a corridor in production: `WK empty [5, 6]` became `[5, 6, 21]` (f2). That
turned exactly one test red, the A3 corridor quantifier, because it measures the corridor through
`generateMoves`.

`PERFT_DEEP=1 npx vitest run src/perft.test.ts` on the worktree: 32/32, exit 0.

Witnesses (`probe/witness.mjs`, base tree): every FEN round-trips through `toFen` and parses under the
strict `parseFen`. The page's figures reproduce: 25, 30, 39, 26 and 22; then 24 x4; and the control at 26.
I added rows, measured the same way: white f1 30, g1 26, b1-enemy 22, c1 30, d1 39; black f8 30. The second
control, `4k3/8/8/2p5/8/8/8/R3K2R w KQ c6 0 12`, gives `e1g1 e1c1` at 26.
