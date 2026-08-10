---
id: 20260810T120833Z-ba-pm-observation-dcc61846
kind: observation
by: ba-pm
at: 2026-08-10T12:08:33Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - plans/tickets/ABC-013-san-rendering.md
  - src/fen.ts
  - src/legal.ts
  - src/moves.ts
  - src/apply.ts
supersedes: 
---

# Eighteen positions built, parsed and confirmed legal on merged `main` — the thing the pre-check explicitly did not do

The decision note that opened this task recorded, under "what this note does NOT establish", that it
had *"[not] construct[ed] or validate[d] a **single FEN**, or type[d] a single expected SAN string"*.
This note is that work.

## Method

A read-only harness outside the repository (`verify-positions.ts`), importing merged `src/` by
absolute path. Nothing under `src/` was written; `git status --short -- src/` is empty. For each
candidate FEN it asserts, and prints:

- `parseFen` succeeds and `toFen(parseFen(fen))` is **byte-identical** to the input;
- the side **not** to move is **not** attacked (`isSquareAttackedBy` against that king) — i.e. the
  position is legal, not merely parseable;
- `generateMoves` and `legalMoves` counts;
- every legal move in **coordinate** form with its flags, and whether it gives check, mate or
  stalemate (by `makeMove` → `isInCheck` / `legalMoves(after).length` → `unmakeMove`);
- that `toFen` is byte-identical again after the whole probe.

**The harness prints no SAN.** It answers only "does this position exist, is it legal, and is the
move I want in `legalMoves`". Every expected string in the ticket was typed by hand from the FEN.

## Result — 18 of 18 positions legal, every named move present, no position mutated

| id | FEN | pseudo / legal | what it establishes |
|---|---|---:|---|
| `P-START` | `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` | 20 / 20 | exactly 20 legal moves, none a capture, check or ambiguity |
| `P-CASTLE` | `r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1` | 26 / 26 | both castles legal; `a1`-`a8` and `h1`-`h8` are rook captures that give check |
| `P-FILE-SR` | `4k3/8/8/8/8/8/8/1N1NK3 w - - 0 1` | 11 / 11 | `b1`→`c3` and `d1`→`c3` both legal; `c3` is their ONLY shared destination; `d2` is reachable by the `b1` knight AND the king |
| `P-FILE-PREC` | `4k3/8/8/3N4/8/8/8/1N2K3 w - - 0 1` | — | `b1`→`c3` and `d5`→`c3` both legal, different file AND different rank |
| `P-RANK` | `4k3/8/8/2N5/8/2N5/8/4K3 w - - 0 1` | 21 / 21 | `c3`→`e4` and `c5`→`e4` both legal, same file |
| `P-QUEENS` | `6k1/8/8/8/4Q2Q/8/8/K6Q w - - 0 1` | 53 / 53 | **all three** queens (`h4`, `h1`, `e4`) reach `e1` legally, and none of the three gives check, mate or stalemate |
| `P-PIN` | `3r3k/8/8/8/8/6N1/3N4/3K4 w - - 0 1` | **16 / 10** | the six-move gap IS the pin: the `d2` knight is pseudo-legal and wholly illegal, so `e4` has exactly ONE legal mover |
| `P-PAWNX` | `4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1` | 7 / 7 | `e4`x`d5` and the quiet `e4`-`e5` from the same pawn |
| `P-EP` | `4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1` | 7 / 7 | `e5`→`d6` carries `FLAG_EN_PASSANT` and `captured` = black pawn, with `d6` EMPTY |
| `P-PIECEX` | `4k3/8/8/4p3/8/5N2/8/4K3 w - - 0 1` | 12 / 12 | `f3`x`e5` piece capture, `f3`-`d4` quiet |
| `P-LETTERS` | `4k3/8/8/8/8/8/8/R1BQK1NR w KQ - 0 1` | 43 / 43 | one quiet unambiguous move per letter; no castle is legal here (both corridors blocked), so the letters stand alone |
| `P-PROMO` | `3r4/4P3/8/8/8/8/8/K6k w - - 0 1` | 11 / 11 | four push-promotions and four capture-promotions, **none of them check** |
| `P-CHECK` | `4k3/8/8/8/8/8/8/R3K3 w - - 0 1` | 15 / 15 | `a1`→`a8` is check and NOT mate (three flight squares) |
| `P-MATE` | `6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1` | 17 / 17 | `a1`→`a8` is **MATE** |
| `P-PROMOMATE` | `6k1/P4ppp/8/8/8/8/8/6K1 w - - 0 1` | 9 / 9 | `a8=Q` and `a8=R` **MATE**; `a8=B` and `a8=N` neither check nor mate |
| `P-CASTLECHK` | `5k2/8/8/8/8/8/8/4K2R w K - 0 1` | 15 / 15 | **the castle `e1`→`g1` is flagged CHECK** — the fifth candidate defect, confirmed by construction |
| `P-CASTLECHKQ` | `3k4/8/8/8/8/8/8/R3K3 w Q - 0 1` | 16 / 16 | `e1`→`c1` castle is CHECK (rook lands `d1`, king on `d8`) |
| `P-STALE` | `7k/8/8/8/6Q1/8/8/K7 w - - 0 1` | 26 / 26 | `g4`→`g6` is **STALEMATE**; `g4`→`g7` is check — the pair that separates `#` from "no reply" |

Every position reported `toFen` **byte-identical** before and after its own probe, which incidentally
re-exercises what `ABC-009` fixed.

## Two things worth flagging for the engineer

- **`P-PIN` is the only position whose pseudo-legal and legal counts differ** (16 vs 10). That gap is
  the criterion: disambiguation is decided against `legalMoves`, and this is the position where the
  two lists disagree.
- **`P-QUEENS` is the textbook three-queen case and it is genuinely constructible.** The pre-check
  could not confirm that the position was legal or that `Qh4e1` was the right answer; it is, and it
  is. The other two queens' moves to `e1` are `Qee1` and `Q1e1`, which the ticket had been throwing
  away.

Transcription back out of the ticket was checked mechanically: all 18 FENs appear in
`plans/tickets/ABC-013-san-rendering.md`, all 18 parse and round-trip byte-identically from the
ticket text, and all 49 distinct expected strings appear in it. Criterion `A1`'s 20-string set was
re-extracted from the ticket and compared against `legalMoves(startpos)` — 20 members, exact match,
no member missing and none extra.
