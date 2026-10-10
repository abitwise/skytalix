---
id: 20261010T161123Z-software-engineer-decision-abc010-two-entries-rule-order-fixtures-re-authored-5b986289
kind: decision
by: software-engineer
at: 2026-10-10T16:11:23Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ADR-0033
  - ADR-0005
  - ABC-016
  - NFR-002
  - src/fen.ts
  - src/fen.test.ts
  - 20261010T161123Z-software-engineer-observation-abc010-gates-deep-lanes-9a-9f-nfr-cost-386fd214
supersedes:
---

# `ABC-010` build: `parseFen` = grammar then `ADR-0033`'s board rules; `parseFenGrammarOnly` for rules-core tests; 2 fixtures flipped to assert the rejection, 8 re-authored (PR note)

This note is hand-authored and unsealed. Branch `grugops/ABC-010-fen-semantic-validation`, from `be37e222`. The code commit is
`1304cc2c`. Not merged, not pushed. The readings are in the observation note `…386fd214`.

## Implementation decisions

- **The design is `ADR-0033`'s, and is not restated.** `src/fen.ts` has one private `parseGrammar`, which returns
  the position and the two king squares (`assertBothKingsPresent` now returns them, so there is no second scan). It has
  two exports:
  - `parseFen`, which is `parseGrammar` followed by `assertReachable`;
  - `parseFenGrammarOnly`, which is `parseGrammar` alone.

  There is no options bag. The non-string `typeof` test sits at the top of `parseGrammar`, so both entries throw
  `FenError` on it before anything is read.
- **The rule order is decision 3's:**
  1. non-string input;
  2. grammar in field order, with each clock field also required to satisfy `String(Number(f)) === f`;
  3. the pawn on rank 1 or 8;
  4. castling rights in `K`, `Q`, `k`, `q` order, testing the king's home square and then the rook's;
  5. en passant, in this order: wrong rank, square occupied, no pushed pawn in front, origin occupied. No capturer is
     required;
  6. the side not to move in check, through `moves.ts` `isSquareAttackedBy`.

  A test row pins the first-fault-wins order.
- **Messages.** Each one names the rule, the right, square or field, and why. For example:
  - `castling right "K" is inconsistent with the board: no white rook on h1`;
  - `pawn on a1: no pawn can stand on rank 1`;
  - `en-passant square e6 is inconsistent with the board: no black pawn on e5`;
  - `side not to move (black) is in check: its king on e8 is attacked`;
  - `halfmove clock "999999999999999999999999…" does not round-trip: it reads back as "Infinity"`. The field is
    truncated at 24 characters, so 400 nines do not land in a message;
  - `FEN must be a string, found null`, and likewise `undefined`, `a number`, `an object` and `an array`.

  There is one `FenError` class, with no codes and no subclasses.
- **The rank-1/rank-8 scan uses raw 0x88 squares (`0x00..0x07`, `0x70..0x77`), not `position.ts` `squareAt`.** This is
  measured. With `squareAt`, `ABC-016` `A13` (`src/status-panel.nfr.test.ts`, which spies `squareAt`) read 112 for
  96 and 83 for 67, so the panel's replay gained 16 spied calls. With raw squares the file is green unchanged. This
  is the same spy hazard as `ADR-0033` Alternative A, on a different export.
- **The castling home squares** are a private 0x88 table (`CASTLING_HOMES`), as decision 3(e) accepts.
- **`memory-bank/30-architecture.md`:** the `fen.ts` row moved from level 2 to level 3, now reads "grammar and
  semantics", and names `parseFenGrammarOnly`. That was the edit owed by `ADR-0033` § Consequences.

## PR note: every fixture changed (9(c)), the old FEN, the new FEN, and every expected value that changed

**Asserting the rejection (9(c), the kings are adjacent):**

| site | FEN (unchanged) | was | now |
|---|---|---|---|
| `src/coordinate-move.test.ts` `A2` row ("records why A2's printed FEN cannot carry the criterion: its kings are adjacent", name kept) | `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1` | `legalMoves` = `["e1e2"]` | `parseFen` throws `FenError` `/^side not to move \(black\) is in check/` |
| `src/san.parse.test.ts` `A4` row | same | SAN list `["Kxe2"]`; `parseSan("e8=Q")` rejected `no-such-move` | `open()` throws `FenError`, same regex |

The `san.parse` row's name changed from "…, `Kxe2` the only legal move" to "…, so parseFen rejects it". The old name
states a fact the boundary can no longer produce. The two constants' doc comments say why the FEN is rejected.

**Re-authored to FENs that `parseFen` accepts. Each test keeps its name and its point, and none switches to
`parseFenGrammarOnly`:**

| site | old FEN | new FEN | the change, and why | expected values |
|---|---|---|---|---|
| `src/fen.test.ts:29` | `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq e3 0 1` | `rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1` | the ticket's after-`1.e4` FEN (9(a)) | unchanged: `epSquare` e3, round-trips. The old FEN is now the "wrong rank" rejection row |
| `src/move-input.test.ts:30` `PROMOTION_CAPTURE_FEN` | `3q1k2/4P3/8/8/8/8/8/4K3 w - - 0 1` | `3q3k/4P3/8/8/8/8/8/4K3 w - - 0 1` | black king f8 → h8, out of the e7 pawn's attack | unchanged. Measured candidate lists byte-identical: `e7d8` `[exd8=Q+, exd8=R+, exd8=B, exd8=N]`, `e7e8` `[e8=Q+, e8=R+, e8=B, e8=N]` |
| `src/move-input.test.ts:51` `SIX_QUEENS_FEN` | `3Q1k2/8/1Q4Q1/8/Q2q3Q/8/1Q6/3Q1K2 w - - 0 1` | `3Q4/8/1Q4Q1/4k3/Q2q3Q/8/1Q6/3Q1K2 w - - 0 1` | black king f8 (checked by Qd8 through e8) → e5 | no asserted value changed (the rows assert `ambiguous`, ≥ 2, no `(+`, every candidate present, one render per candidate). The candidates went from `[Q1xd4#, Q2xd4#, Qaxd4#, Qhxd4#, Q6xd4#, Q8xd4]` to the same six with `Q8xd4#`, **one character wider**, so "the widest known to fit" is not weakened. No legal placement gives a byte-identical list: a search over every king square, plus one black blocker, found 0 hits |
| `src/moves.test.ts:257` | `4r2k/8/8/8/8/8/8/R3K2R w KQ - 0 1` | `4r1k1/8/8/8/8/8/8/R3K2R w KQ - 0 1` | black king h8 (on the h1 rook's file) → g8 | unchanged: castle targets `[]` (the e8 rook still checks e1) |
| `src/quiescence.test.ts:329` (runaway rig) | `q1q1q1qk/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/8/8/8/K7 w - - 0 1` | `q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/8/4k3/8/K7 w - - 0 1` | black king h8 (checked by Qh7) → e3, out of every queen's line. Sixteen queens kept | unchanged: `deepest` = `QUIESCENCE_MAX_PLY` (8), score finite. The comment's measurement changed from "7 112 nodes, ~33 ms" (stale: the shipped rig reads 6,932 at base) to "4 798 nodes, ~41 ms" |
| `src/evaluate.pawns.test.ts:121` ("seventh rank, enemy pawn behind on an adjacent file") | `2k5/3P4/4p3/8/8/8/8/4K3 w - - 0 1` | `7k/3P4/4p3/8/8/8/8/4K3 w - - 0 1` | black king c8 (attacked by the d7 pawn) → h8 | unchanged: d7 passed = `true` |
| `src/status-panel.nfr.test.ts:64` `SPARSE_FEN` | `4k3/8/8/8/8/8/8/4R1K1 w - - 0 1`, plies `e1e2 e8d8` / `e1e2 e8d8 e2e4 d8c8` | `4k3/8/8/8/8/8/8/R5K1 w - - 0 1`, plies `a1a2 e8d8` / `a1a2 e8d8 a2a4 d8c8` | the Architect's measured replacement (test note 5) | unchanged: every `A13` count; file 17/17 |
| `src/levels.test.ts:351` ("scores a stalemating child 0") | `7k/8/5QK1/8/8/8/8/8 w - - 0 1`, label `f6f7` | `7k/8/6K1/5Q2/8/8/8/8 w - - 0 1`, label `f5f7` | BA/PM's measured replacement (test note 6) | score 0, unchanged; the move label is `f5f7` |

**Six import swaps (9(b)).** `src/moves.castling.hardening.test.ts`, `src/moves.castling.test.ts`,
`src/moves.enpassant.hardening.test.ts`, `src/moves.enpassant.test.ts`, `src/legal.test.ts` and `src/zobrist.test.ts`
each change one line, `parseFen` → `parseFenGrammarOnly as parseFen`, and nothing else.
