---
id: 20260817T190710Z-qe-e2e-observation-abc076-the-full-mutation-ledger-every-mutant-run-and-restored-99a7fcf7
kind: observation
by: qe-e2e
at: 2026-08-17T19:07:10Z
verified_by:
confidence: high
refs:
  - src/evaluate.ts
  - src/evaluate.test.ts
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
supersedes:
---

# `ABC-076` mutation ledger — 16 mutants run against the delivered suite. Which went red, which survived, and the proof every one was restored.

Every mutant was applied to the working tree at `99a7fcf`, run, and reverted with `git checkout --`.
"suite" below means `npx vitest run src/evaluate.test.ts` (20 tests as delivered).

## Ledger

| # | mutation | expected | **observed** |
|---|---|---|---|
| 1 | `KNIGHT_TABLE[27]` (white `d5`/black `d4`, reached by children only) `20` → `999` | `A1`@184 RED, `A1`@12 GREEN | **SURVIVED both. Whole 889-test repo GREEN.** |
| 1b | **all 6 tables + all `PIECE_VALUE` randomised** ±1000 | — | **`A1`@184 GREEN, `A2` GREEN** |
| 2 | global sign flip — drop the negamax flip, `return score` | `A1` RED | **`A1` RED** (184: 170 mismatches; 12: 4) |
| 3 | `PIECE_VALUE` KNIGHT `320` → `280` | `A3` RED | **`A3` RED** |
| 3a | KNIGHT `320` → `300` | — | **SURVIVED — all 20 green** |
| 3b | KNIGHT → `260` / `250` / `240` / `200` / `100` / `3200` / `32` | — | **`A3` RED** in all seven |
| 4 | `PIECE_VALUE` PAWN `100` → `1` | — | **SURVIVED** |
| 5 | `PIECE_VALUE` BISHOP `330` → `1` | — | **SURVIVED** |
| 6 | `PIECE_VALUE` ROOK `500` → `1` | — | **SURVIVED** |
| 7 | `PIECE_VALUE` QUEEN `900` → `1` | — | **SURVIVED** |
| 8 | `PIECE_VALUE` KING `0` → `5000` | — | **SURVIVED** |
| 9 | `KNIGHT_TABLE[36]` — the `e4` entry — `20` → `-50` | `A4` RED | **`A4` RED**; `A1` green at 184 and 12 |
| 10 | mirror helper: `castling: mirroredCastling` → `castling: position.castling` | dedicated test RED | **RED** — *"swaps castling rights side for side"*. The 184-pair property stayed GREEN. |
| 11 | mirror helper: drop `epSquare` mirroring | dedicated test RED | **RED** — *"mirrors the en-passant square…"*. The 184-pair property stayed GREEN. |
| 12 | revert the `-0` fix: `0 - score` → `-score` | `A2` or `A1` RED | **`A1` RED**: `startpos: expected -0 to be +0 // Object.is equality`. **`A2` stayed GREEN.** |
| 13 | `position.halfmoveClock += 1` inside `evaluate` | `A5` RED | **`A5` RED — all six positions** |
| 14 | `position.board[0] = 7` inside `evaluate` (persistent) | `A5` RED | **RED — 10 of 20 failed** (`A1`–`A5`) |
| 15 | board mutated then **restored** inside `evaluate` (the zobrist shape) | — | **SURVIVED — all 20 green** |
| 16 | `buildCorpus` pushes `clonePosition(parseFen(START_FEN))` in both places — **184 copies of startpos** | — | **SURVIVED — all 20 green** |

## The four that matter, read out

- **Mutants 1 / 1b — the headline.** Full treatment in the companion `observation` on the 184-vs-12
  experiment. `A1` is an algebraic identity of the mirrored-*index* implementation and is
  insensitive to every table entry and every material value, at any corpus size.
- **Mutants 3a and 4–8 — the material surface is nearly unguarded.** `A3` pins **only the knight**,
  and only to the window `290 ≤ KNIGHT ≤ 440` (derived and confirmed: score = `KNIGHT - 40`, since
  removing the `b8` knight also removes `KNIGHT_TABLE[57] = -40`). **A knight priced at `300`
  passes everything.** PAWN, BISHOP, ROOK and QUEEN can each be set to `1`, and the KING to `5000`,
  with the entire suite green. This matches `A3` **as written** — the criterion only ever speaks
  about one black knight — so it is a residual, not a gap against the criterion. It is recorded
  because `ABC-077`'s search will consume these numbers.
- **Mutants 10 and 11 — the engineer's claim is confirmed exactly.** Both dedicated mirror-helper
  tests genuinely fail when the helper drops the field, and the 184-pair symmetry property stays
  green in both cases — which is the engineer's own point: today's evaluator reads neither field, so
  those two tests are the **only** thing holding castling and `epSquare` mirroring for `ABC-082`
  and `ABC-083`. **They are load-bearing and must not be tidied away.**
- **Mutant 15 — a named limit of `A5`, not a defect.** `A5` compares before against after, so a
  mutate-then-restore is undetectable by construction. The criterion says *"byte-identical before
  and after"* and the test does exactly that, so `A5` is MET. But `src/evaluate.test.ts:239`-`:240`
  says the row *"asserts the evaluator does not join"* `zobristKey`'s transient mutation, and it
  cannot: the transient shape is the one thing it is blind to. **Comment overstates; criterion is
  satisfied.**

## Mutant 16 was closed at QE

Nothing asserted **which** 184 positions the corpus holds — only that there were 184 of them, and
`A1`'s symmetry passes for any position. One test was **added** (never weakened, never skipped):
*"holds the RIGHT 184 — distinct positions, grouped per root"*. It asserts 184 distinct
`board|blackToMove|castling|epSquare` keys and walks the corpus in `PERFT_POSITIONS` order checking
each root is followed by exactly `depth1` children carrying its name. **Verified by re-running
mutant 16 against it: RED.** Suite is 21 tests.

## Restoration — verified, not asserted

- `src/evaluate.ts` sha256 `0969304560…502770` — **identical to the branch-tip blob**, unchanged
  from the pre-mutation capture.
- `git diff` against `99a7fcf` is **one file, `src/evaluate.test.ts`, +25/−0** — the added test and
  its comment, formatted with `npx biome format --write`. **No production line changed, no
  assertion weakened, no test skipped or deleted.**
