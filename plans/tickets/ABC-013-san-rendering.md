---
id: ABC-013
title: SAN rendering — src/san.ts with toSan only
status: ready-for-uat
column: Ready for UAT
size: M
priority: P1
epic: EPIC-002
feature: —
---

# ABC-013 — SAN rendering: `src/san.ts` with `toSan` only

## Problem

*User*: any player who reads a move list. `e2e4` is a coordinate; `Nf3` is what a chess player
reads, and the difference is the difference between a debug dump and a chess game.

*Pain*: no SAN code exists anywhere in `src/`. A `Move` carries
`{ from, to, piece, captured, flags, promotion }` (`src/moves.ts:46`) — enough for `e2e4`, and not
enough for `Nbd2`. SAN needs **two** positions: the one before the move, for disambiguation
(which *other* legal moves of the same piece type reach that square), and the one after it, for
the `+` / `#` suffix.

*Value*: one grammar, in one place, that three epics share. The failure this prevents is silent
and it is the worst kind: if `EPIC-002` formats SAN inside its renderer and `EPIC-003` writes its
own parser, two grammars that disagree do not throw — **the move a player reads on screen and the
move their typed string resolves to simply stop being the same move.**

## Source

`memory-bank/50-decisions/ADR-0004-san-ownership.md` (**status `accepted` — ratified 2026-07-31,
clauses 1 and 3 as proposed, clause 2 as amended**) and task `epic-to-tickets-EPIC-002` note
`20260730T144200Z-architect-design-decision-63309fd4` ("SEAM 3 CLOSED"). This ticket implements the
seam; it does not re-decide it.

**What ratification changed for this ticket: nothing in its scope.** Clause 1 (the module and its
placement) and clause 3 (derived per frame, never stored) were accepted **as proposed**, and this
ticket is written against those two. Clause 2's amendment lands entirely on **`parseSan`**, which is
`EPIC-003`'s — it is carried below under Dependencies because this ticket creates the file that
function will be added to.

## Scope

**A new module `src/san.ts`, above `src/legal.ts` and beside `src/gameend.ts`**, exporting exactly
one function:

```ts
export function toSan(position: Position, move: Move, legal?: readonly Move[]): string;
```

- Piece letters `KQRBN`, pawns implicit; castling `O-O` / `O-O-O`; promotion `=Q` / `=R` / `=B` /
  `=N`; captures `x`, with the pawn's origin file for pawn captures (`exd5`); check `+`; mate `#`.
- **Disambiguation, in the standard order**: no qualifier when the piece is unique; otherwise the
  origin **file**; otherwise the origin **rank**; otherwise the full origin **square**. Decided
  against the other legal moves of the same piece type that reach the same destination.
- **The optional `legal` parameter is part of the contract, not a tuning detail.** Wave 1 measured
  `toSan` at **4.31–4.45 µs** when it computes its own legal list and **0.10–0.11 µs** when the
  caller supplies one — a 40x gap, because SAN is ~97% `legalMoves` and ~3% string work. The two
  `EPIC-003` call sites that already hold the list (the parser, which just validated; the `moves`
  command, which is formatting that very list) get that gap for one optional argument.
  *(Re-measured 2026-08-10 and the decision is unchanged, but the headline number is
  population-dependent and is recorded here as such: over the **whole legal move list** of the
  pinned position `P60` the parameter buys **8.6x**, not 40x. The two figures do not disagree — 40x
  is a piece move at a position with no checking moves; the mean over a real move list is dragged
  down by pawn moves, which need no list at all (**0.133 µs**), and up by checking moves, which pay
  a second `legalMoves` for the mate test. See `## Security / NFR triggers`. `ADR-0004` clause 2 is
  not re-opened by this: the parameter is still worth having, by a wide margin.)*
- **Caller obligations, stated because the contract has two and only wrote down one.** The supplied
  `legal` list **must be the legal moves of the supplied position** (`ADR-0004` clause 2 — supply
  another position's list and the answer is silently wrong; that is the price of the speedup and it
  is paid by the caller). The same holds for the move: **`move` must be a legal move of `position`**,
  as produced by `legalMoves(position)`. `toSan` is not asked to validate either, and **no criterion
  in this ticket asserts behaviour for an illegal `move`** — that is deliberately undefined here
  rather than quietly assumed. If `EPIC-003` ever needs a total `toSan`, that is a change to this
  contract and belongs in a ticket, not in an implementer's judgment call.
- Imports `position.ts`, `moves.ts`, `apply.ts`, `legal.ts`. It does **not** import `gameend.ts`
  (the `#` suffix is checkmate only; `gameStatus` would additionally compute insufficient material
  and repetition, which are not SAN suffixes) and does **not** import `history.ts`.

## Out of scope

- **`parseSan` — `EPIC-003` adds it to this same file.** This is a cross-epic ticket boundary over
  one file, closed by wave 1 and **not re-opened here** *(its contract was amended when `ADR-0004`
  was ratified — the amended signature and the move-identity invariant are under Dependencies)*:
  `EPIC-002` creates `src/san.ts` with
  `toSan` only; `EPIC-003` adds `parseSan` and owns the `parse(toSan(move)) === move` round-trip
  property test its Test notes already name. This epic ships no parser (it has no use for one —
  AGENTS.md rule 5) and `EPIC-003` ships no second formatter.
- **Caching SAN strings anywhere.** `ADR-0004` clause 3: SAN is derived per frame, never stored in
  the history. `history.ts` does not import `san.ts`.
- **PGN**, move numbering, annotation glyphs (`!`, `?`, `!?`), comments and variations. Move
  numbering belongs to the panel that lays out the two columns (`ABC-017`), not to the grammar.
- Any change to `src/legal.ts` or the rules core.

## Acceptance (Given/When/Then)

**Repaired 2026-08-10 by BA/PM at the `Ready → Ready for Dev` exit — 13 criteria became 22, and
every one is now executable by an engineer holding only this ticket.** What was wrong, and how each
correction was measured, is in `## Definition of Ready`. The short version: the promise this section
opened with — *"Every criterion is a hand-built FEN with an exact expected string"* — was true of
**one of the thirteen**, and **nine wrong builds passed the whole table** even after its prose
criteria were charitably given the best FENs that can be built for them.

**Every criterion below is a literal FEN, a move named by `from`-`to` (and its promotion piece where
it has one), and an exact expected string.** Two rules bind the whole table:

1. **Every `Move` is obtained from `legalMoves(position)`** and selected by `(from, to, promotion)`.
   Never a hand-built `Move` object literal — `ADR-0004` clause 2b is the reason, and it is what lets
   `EPIC-003` extend this table instead of rebuilding it.
2. **Every expected string here was typed by hand from its FEN**, before any implementation of
   `toSan` existed anywhere. Do not compute an expectation with the disambiguation logic under test.

### The named positions

All 18 parse, round-trip through `toFen` byte-identically, and were confirmed legal on merged `main`
(the side not to move is not in check) with the named moves present in `legalMoves`.

| id | FEN | what it carries |
|---|---|---|
| `P-START` | `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` | the base case — 20 legal moves, no capture, no check, no ambiguity |
| `P-CASTLE` | `r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1` | both castles, plus a rook capture that gives check |
| `P-FILE-SR` | `4k3/8/8/8/8/8/8/1N1NK3 w - - 0 1` | knights `b1`+`d1` (same rank) → `c3`; also a cross-type pair on `d2` |
| `P-FILE-PREC` | `4k3/8/8/3N4/8/8/8/1N2K3 w - - 0 1` | knights `b1`+`d5` — **different file AND rank**, so the file/rank *precedence* is observable |
| `P-RANK` | `4k3/8/8/2N5/8/2N5/8/4K3 w - - 0 1` | knights `c3`+`c5` (same file) → `e4` |
| `P-QUEENS` | `6k1/8/8/8/4Q2Q/8/8/K6Q w - - 0 1` | three queens on `h4`,`h1`,`e4`, all reaching `e1` — all three rungs of the ladder in one position |
| `P-PIN` | `3r3k/8/8/8/8/6N1/3N4/3K4 w - - 0 1` | the `d2` knight reaches `e4` but is **pinned**, so its move is not legal |
| `P-PAWNX` | `4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1` | pawn capture and quiet push from the same pawn |
| `P-EP` | `4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1` | an en-passant capture — a pawn capture onto an **empty** square |
| `P-PIECEX` | `4k3/8/8/4p3/8/5N2/8/4K3 w - - 0 1` | a piece capture and a quiet piece move |
| `P-LETTERS` | `4k3/8/8/8/8/8/8/R1BQK1NR w KQ - 0 1` | one quiet move per piece letter, plus a cross-type pair on `d2` |
| `P-PROMO` | `3r4/4P3/8/8/8/8/8/K6k w - - 0 1` | all four promotions, as a push and as a capture, none of them check |
| `P-CHECK` | `4k3/8/8/8/8/8/8/R3K3 w - - 0 1` | check that is not mate |
| `P-MATE` | `6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1` | back-rank mate |
| `P-PROMOMATE` | `6k1/P4ppp/8/8/8/8/8/6K1 w - - 0 1` | two promotions that mate and two that do not |
| `P-CASTLECHK` | `5k2/8/8/8/8/8/8/4K2R w K - 0 1` | **kingside castling that gives check**, with an ordinary rook move as the control |
| `P-CASTLECHKQ` | `3k4/8/8/8/8/8/8/R3K3 w Q - 0 1` | queenside castling that gives check |
| `P-STALE` | `7k/8/8/8/6Q1/8/8/K7 w - - 0 1` | a move that **stalemates**, with a checking move as the control |

### The criteria

- **A1 — the base case, exhaustively.** **Given** `P-START`, **when** every one of its **20** legal
  moves is formatted, **then** the 20 strings are exactly, as a set:
  `a3 a4 b3 b4 c3 c4 d3 d4 e3 e4 f3 f4 g3 g4 h3 h4 Na3 Nc3 Nf3 Nh3`.
  *Pawns carry no letter and no origin file on a quiet push; a unique piece carries no qualifier.
  Both halves are in `## Scope` and neither was asserted by any criterion before this repair.*
- **A2 — the piece letters.** **Given** `P-LETTERS`, **then** `a1`-`a3` is `Ra3`, `c1`-`d2` is
  `Bd2`, `d1`-`d2` is `Qd2`, `g1`-`f3` is `Nf3`, and `e1`-`f2` is `Kf2`. *`K` is reachable by no
  promotion, so it is pinned here or nowhere.*
- **A3 — castling.** **Given** `P-CASTLE`, **then** `e1`-`g1` is `O-O` and `e1`-`c1` is `O-O-O`
  (capital letter O, not zero); `h1`-`f1` is `Rf1` and `a1`-`a8` is `Rxa8+`.
- **A4 — file disambiguation, and that the file is PREFERRED.** **Given** `P-FILE-PREC`, **then**
  `b1`-`c3` is `Nbc3` and `d5`-`c3` is `Ndc3`. **And given** `P-FILE-SR`, **then** `b1`-`c3` is
  `Nbc3` and `d1`-`c3` is `Ndc3`. *The second pair alone cannot tell a file-first build from a
  rank-first one — both knights stand on rank 1, so the rank could not have been used. `P-FILE-PREC`
  is the pair where the rank WOULD separate them and the file must still win.*
- **A5 — rank disambiguation, used only because the file cannot separate them.** **Given** `P-RANK`,
  **then** `c3`-`e4` is `N3e4` and `c5`-`e4` is `N5e4`.
- **A6 — the whole ladder, in one position.** **Given** `P-QUEENS`, **then** `e4`-`e1` is `Qee1`
  (file `e` is unique), `h1`-`e1` is `Q1e1` (file `h` is shared with `h4`, rank `1` is unique), and
  `h4`-`e1` is `Qh4e1` (neither axis alone separates it). *All three, not just the full-square one:
  the two cheaper rungs are what falsify a build that jumps straight to the full square, and they
  come free from the same FEN.*
- **A7 — disambiguation is decided against LEGAL moves, not reachable ones.** **Given** `P-PIN`,
  **when** `g3`-`e4` is formatted, **then** the string is exactly `Ne4` — **no qualifier**. *The
  `d2` knight also reaches `e4`, but it is pinned to the king on `d1` by the rook on `d8`, so
  `Nd2e4` is not a legal move and is not a rival. `## Scope` says "the other **legal** moves"; this
  is the criterion that holds it to the word.*
- **A8 — disambiguation is same-piece-type only.** **Given** `P-FILE-SR`, **then** `b1`-`d2` is
  `Nd2` and `e1`-`d2` is `Kd2`. **And given** `P-LETTERS`, **then** `c1`-`d2` is `Bd2` and `d1`-`d2`
  is `Qd2`. *Two different piece types reaching one square never disambiguate each other.*
- **A9 — pawn capture and pawn push.** **Given** `P-PAWNX`, **then** `e4`-`d5` is `exd5` and
  `e4`-`e5` is `e5` — the same pawn, with and without the origin file.
- **A10 — en passant is a pawn capture.** **Given** `P-EP`, **then** `e5`-`d6` is `exd6` and
  `e5`-`e6` is `e6`. *The captured pawn does not stand on the destination square, so a build that
  decides "is this a capture" by reading `position.board[move.to]` silently drops the `x` here and
  nowhere else. `move.captured` is the field that is right in both cases.*
- **A11 — piece captures carry `x` and no origin file.** **Given** `P-PIECEX`, **then** `f3`-`e5`
  is `Nxe5` and `f3`-`d4` is `Nd4`. *The origin file is a pawn-only rule; a unique piece adds
  nothing to `x`.*
- **A12 — promotion, all four pieces, push and capture.** **Given** `P-PROMO`, **then** `e7`-`e8`
  gives exactly `e8=Q`, `e8=R`, `e8=B`, `e8=N`, and `e7`-`d8` gives exactly `exd8=Q`, `exd8=R`,
  `exd8=B`, `exd8=N`.
- **A13 — check.** **Given** `P-CHECK`, **when** `a1`-`a8` is formatted, **then** the string is
  exactly `Ra8+` — one `+`, no `#`.
- **A14 — mate.** **Given** `P-MATE`, **when** `a1`-`a8` is formatted, **then** the string is
  exactly `Ra8#` — one `#`, no `+`.
- **A15 — promotion mate, and the suffix order.** **Given** `P-PROMOMATE`, **then** `a7`-`a8` gives
  exactly `a8=Q#`, `a8=R#`, `a8=B` and `a8=N`. *The promotion piece precedes the marker, and the two
  promotions that mate are pinned beside the two that do not.*
- **A16 — a castle can give check.** **Given** `P-CASTLECHK`, **then** `e1`-`g1` is `O-O+` and
  `h1`-`f1` is `Rf1+`. **And given** `P-CASTLECHKQ`, **then** `e1`-`c1` is `O-O-O+`. *The rook lands
  on `f1`/`d1` and checks down the open file. A build that returns the castle string early, before
  the suffix, is wrong only here.*
- **A17 — stalemate is not mate.** **Given** `P-STALE`, **when** `g4`-`g6` is formatted, **then**
  the string is exactly `Qg6` — **no `#` and no `+`** — and `g4`-`g7` is `Qg7+`. *`#` is checkmate:
  check AND no reply. A build that emits `#` on "no reply" alone is wrong exactly here, and `## Scope`
  offers no third suffix for a stalemating move.*
- **A18 — purity, over a named set.** **Given** each of the **18 named positions above**, **when**
  every one of its legal moves is formatted **both** with and without the `legal` argument, **then**
  `toFen(position)` is **byte-identical** to its value before each call. *(The function makes and
  unmakes moves internally; it must leave the caller's live position exactly as it found it — the
  transient-mutation contract `memory-bank/30-architecture.md` records. Since `ABC-009` merged
  (2026-08-09) `legalMoves` honours this too, so this criterion now runs against a tree that already
  keeps its half of the bargain.)*
- **A19 — the `legal` argument changes nothing but cost.** **Given** each of the **18 named
  positions**, **when** every legal move is formatted with and without the `legal` argument, **then**
  the two strings are **identical** for every move.
- **A20 — the module surface.** **Given** `src/san.ts`, **then** it exports exactly one function,
  `toSan`, and imports exactly `./position.ts`, `./moves.ts`, `./apply.ts` and `./legal.ts` —
  **no `gameend.ts`, no `history.ts`, no `fen.ts`**. *`ADR-0004` clause 1 fixes this DAG and
  `## Scope` restates it; before this repair a build that imported `gameend.ts` or shipped a
  `parseSan` stub satisfied every criterion. `fen.ts` is named because `toFen` belongs to the
  TESTS, not to the module.*
- **A21 — the cost bars in *Security / NFR triggers* hold**, measured by their own stated method at
  the position they name, on the machine class they name.
- **A22 — the suite.** **Given** the full test suite, **when** it runs, **then** it is green with a
  skip count of **0** and **no existing test is modified**.

## Dependencies

- `ABC-005` (`legalMoves`, `isInCheck`) and `ABC-003` (`makeMove` / `unmakeMove`) — merged on
  `main`.
- **CLEARED 2026-07-31: `ADR-0004` is `accepted`.** It blocked the merge of the first line of
  `src/san.ts` — not the cutting — and that block is lifted. **Read its Status section before citing
  it:** it was ratified by the **Orchestrator under a named, quoted delegation from Olger Oeselg**,
  not by a human directly. It is the first such ADR here and it is explicitly **not** precedent; the
  standing rule that an ADR needs a named human is unchanged for every other ADR. This ticket moved
  `Blocked` → `Ready` on that ruling, having met every other Definition-of-Ready check since
  2026-07-30.
- **`EPIC-003`'s `parseSan` contract, as AMENDED on ratification — carried here because this ticket
  creates the file it lands in.** `EPIC-003` implements it; `ABC-013` must not close the door on it.

  ```ts
  export function parseSan(position: Position, text: string, legal?: readonly Move[]): SanParseResult;

  export type SanParseResult =
    | { readonly outcome: "move"; readonly move: Move }
    | { readonly outcome: "ambiguous"; readonly candidates: readonly Move[] }   // N ≥ 2
    | { readonly outcome: "rejected"; readonly reason: SanRejectReason };
  ```

  - The draft's `Move | null` was **rejected**: `null` collapses *"more than one legal move matches —
    disambiguate"* into *"no legal move matches — you broke a rule"*, and under this project's
    legality-first priority the player must be told which. The three outcome names are the System
    Analyst's seam contract's own; the seam's other two (`command`, `input-unavailable`) belong to
    `EPIC-003`'s input layer and **never** to `src/san.ts`.
  - `parseSan` is **total** — it does not throw for ordinary bad input, deliberately unlike
    `src/fen.ts`'s `parseFen`. SAN arrives on every typed line, on the re-prompt edge.
  - **The move-identity invariant (`ADR-0004` clause 2b), normative:** every `Move` returned — the one
    in `move` and every one in `ambiguous.candidates` — **is an element of the legal move list
    generated for that position**, never a `Move` reconstructed from the parsed text. A fabricated
    `Move` can be plainly illegal (a pinned piece, a king into check); and one with a wrong
    `piece`/`captured`/`flags` applies plausibly, then puts a **wrong piece on the board during a
    take-back** — `src/apply.ts:157` writes the mover back from `move.piece`, `src/apply.ts:160`
    branches on `move.flags`, and `undoSpecial`'s en-passant arm (`src/apply.ts:109`) materialises the
    captured pawn from `move.captured`. Nothing throws; the corruption surfaces during `EPIC-006`'s
    `undo`, a full move later. *(Only `src/apply.ts:158` is safe there, and only because
    `undo.captured` was read from the live board at `src/apply.ts:124`.)*
- Blocks `ABC-016` (last move in SAN) and `ABC-017` (the move-history pane). Both are in `Backlog`
  behind this ticket and neither is affected by the clause-2 amendment — they consume `toSan`.

## Security / NFR triggers

- `NFR-002` (16 ms frame) — SAN is the most expensive single item in a frame, and most of that cost
  is inside `legal.ts`, so anyone profiling the renderer will land in the rules core.

  **The bars were RE-DERIVED on today's `main` on 2026-08-10 and their SHAPE changed, because the
  old pair had no aggregation and no move population and a correct implementation fails BOTH of them
  under the natural per-call reading.** Measured: a *checking* piece move costs **9.34 / 9.25 µs**
  unassisted (1.42x the old 6.5 µs bar) and **4.50 / 4.49 µs** with the list supplied (22.5x the old
  0.20 µs bar) — not because anything is slow, but because deciding `+` versus `#` requires a second
  `legalMoves` on the position after the move, which is `ADR-0004`'s own definition of the mate
  suffix. A bar a correct build cannot meet is not a build target; the repair is to name the
  population and the aggregation.

  **The position is now PINNED as a literal FEN**, because "a ply-60 middlegame position of a
  deterministic random-legal game" names a method whose seed was never recorded, so wave 1's exact
  position cannot be reconstructed and no like-for-like comparison with its figures is possible:

  ```
  P60 = 1rb4r/3k4/p1ppNn2/1p1np1Q1/1q1P1B1P/PRP2p2/3KP1BR/6N1 w - - 2 31
        42 legal moves, of which 3 give check
  ```

  Bars at ~1.5x figures measured at `P60` on 2026-08-10, **Apple M3, Node v24.12.0, darwin/arm64,
  `UNKNOWN - verify` on any other hardware**, two full runs that agree to within 1%:

  | id | bar | measured |
  |---|---|---|
  | `N1` | **the mean `toSan(position, move, legal)` at `P60` is ≤ 1/5 of the mean `toSan(position, move)` over the same 42 moves** | **8.62x / 8.65x** |
  | `N2` | mean `toSan(position, move, legal)` over all 42 legal moves at `P60` ≤ **0.75 µs** | 0.491 / 0.490 µs |
  | `N3` | mean `toSan(position, move)` over all 42 legal moves at `P60` ≤ **6.5 µs** | 4.232 / 4.241 µs |
  | `N4` | **no single** legal move at `P60` exceeds **14 µs** in either call form | worst 9.34 / 9.25 µs |

  **`N1` is the primary bar and the only one that is machine-independent** — it is a ratio, so it
  survives a hardware change, and it asserts what the optional parameter is actually FOR. `N3` is
  the ticket's original 6.5 µs figure, re-measured and **CONFIRMED rather than moved**. `N4` exists
  so nobody reads `N2` or `N3` as a per-call bar again.

  Two limits on these numbers, stated rather than buried. **(a)** They were produced by a reference
  `toSan` written for this hop in a scratchpad outside the repository, read-only against merged
  `src/`; it allocates a rivals array per call, so every figure above is an **upper bound** for a
  tuned build and the bars are ceilings a correct implementation should clear comfortably. **(b)**
  `legalMoves` at `P60` measures **4.58 / 4.57 µs** against wave 1's published 3.18 µs, and that gap
  is **not** evidence of a regression from `ABC-009`'s or `ABC-022`'s guards: it is a different
  position, and 4.58 µs sits inside `ADR-0003`'s published 1.8–5.4 µs range. Position variance
  dominates; the guard cost is not resolvable by this instrument and was not measured here.

- `NFR-003` (`moves` command < 100 ms) — not this epic's criterion, but this function is what
  `EPIC-003` will format ~41 moves with. **Re-derived 2026-08-10: 41 × 0.490 µs = ~20 µs total,
  ~5,000x under the budget** — the old parenthetical said ~4 µs and ~25,000x, which rested on the
  0.10 µs figure that has no stated move population. Recorded so nobody re-derives it.
- **Frame context, measured at the same hop and recorded so `ABC-016`/`ABC-017` do not re-derive
  it:** a full move-history render (replay + `toSan` per ply) costs **180 / 182 µs at 40 plies** and
  **395 / 392 µs at 120 plies — 2.5% of a 16 ms frame**. `ADR-0004` published 171/176 µs and
  517/533 µs (3.3%) for the same two points; today's figures are in the same band and `NFR-002`'s
  headroom is intact. No `plans/nfr-catalog.md` target is touched by any of this.
- **No security trigger.** Input is a `Move` from the generator and a `Position`; no user-supplied
  string reaches this module. *(The user-supplied-string risk in this epic is in the frame's
  message region and is carried by `ABC-018`.)*

## Test notes

**The honest limit, stated up front:** the round-trip property test that is the real safety net
for this grammar belongs to `EPIC-003`, because it needs the parser. Until then this module's only
oracle is the hand-built table above. Write it as a table of `(fen, move, expected)` triples so
`EPIC-003` can extend rather than replace it.

**Write `toSan`'s tests so that round trip can be bolted on without reshaping them.** `ADR-0004`
clause 2b fixed the test's exact form on ratification, and it is not the shape the draft implied:

```ts
const legal = legalMoves(position);
for (const move of legal) {
  const parsed = parseSan(position, toSan(position, move, legal), legal);
  // outcome === "move" && parsed.move === move  — identity, not field equality
}
```

**One legal list, handed to both directions.** `generateMoves` allocates a fresh `Move` object per
call, so two `legalMoves(position)` calls return field-equal but reference-distinct objects: the
literal `parse(toSan(move)) === move` across two calls can never pass, and a deep-equality comparison
would happily accept a `Move` reconstructed from text — i.e. it cannot falsify clause 2b at all.
Reference identity against one shared list is the only assertion that can. Practical consequence for
**this** ticket: the `(fen, move, expected)` rows should obtain their `move` from
`legalMoves(position)` — never from a hand-built object literal — so `EPIC-003` extends the same
table instead of rebuilding it.

- **Disambiguation is where the bugs are, in both directions** (`EPIC-003`'s Risks section says so
  too). The three-queen case is not exotic padding: file-then-rank-then-square is a precedence, and
  an implementation that jumps straight to the full square is wrong on the common case while
  looking right. **Measured 2026-08-10, and it is worse than that sentence implies:** of the four
  disambiguation bugs a wrong build can have — full-square-always, rank-before-file, rivals taken
  from the pseudo-legal list, and rivals not filtered by piece type — the acceptance table as it
  stood caught **one**. `A4`, `A6`, `A7` and `A8` are the four rows that catch the other three,
  and `A4`'s second pair exists only because the first pair cannot see a rank-first build at all.
- **Test the transient-mutation criterion explicitly** (`A18`), by asserting `toFen` before and
  after. The function calls `makeMove` and `legalMoves`, both of which mutate and restore. Wave 1's
  harness held this at 120 plies on well-formed positions.
  **Corrected 2026-08-10: `ABC-009` MERGED to `main` on 2026-08-09.** This sentence used to read
  *"it says nothing about `ABC-009` (malformed positions), which is out of scope here"*, written on
  2026-07-30 as though that ticket were still open, and leaving a merged ticket teaching a false
  rule is what `ABC-023`'s defect 3 was about. What is true today: `ABC-009` was *"`legalMoves`
  mutates the position it documents as unchanged"*, and its two guard conditions in
  `addCastlingMoves` are precisely what makes `A18` passable — on 2026-07-30 this criterion asserted
  something the tree did not yet honour. `A18` is therefore a criterion this module must not
  **re-break**, not one it must fix. Malformed positions remain out of scope: all 18 named positions
  are well-formed and `parseFen`-round-trippable.
- **Do not test against a generated expectation.** Every expected string in the table is typed by
  hand from the FEN. A test that computes the expected value with the same disambiguation logic
  proves nothing.

## Size and priority rationale

**Size `M` (3).** One new module, one exported function, and a grammar with four disambiguation
levels, two castle forms, four promotion pieces and two suffixes. The code is small; the case table
is not. Calibrated against `ABC-005` (legal filtering, `M`) and below `ABC-004` (special moves,
`L`) — this formats what `ABC-004` had to generate. It would be `L` if it also carried `parseSan`,
which is exactly why the cross-epic boundary puts the parser in `EPIC-003`.

**Priority `P1`, not `P0`.** The game is playable without SAN — the board renders, the loop runs,
moves apply. SAN is what makes the status panel and the history pane readable, and it is the
prerequisite for two `P1`/`P2` tickets in this epic plus work in `EPIC-003` and `EPIC-006`. Not
`P2`, because three epics wait on this one file and it is the ticket with a human dependency, so
the ratification clock should start early.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ (cross-epic file boundary named) · INVEST ✅ · acceptance
measurable ✅ **(only after the 2026-08-10 repair below — this row was ⚠️, not ✅, from 2026-07-30
until then)** · dependencies ✅ · NFR triggers ✅ **(re-derived 2026-08-10; the previous pair was
not a usable target — see below)** · test notes ✅ · size `M` ✅ · priority `P1` ✅ ·
**no major unresolved blocker ✅ — `ADR-0004` ratified 2026-07-31.**

**All ten rows hold as of 2026-08-10 and the ticket moved `Ready` → `Ready for Dev`.** It had moved
`Blocked` → `Ready` on 2026-07-31 after one day of a two-day `blocked_escalation_days` window,
never escalated; its dependencies (`ABC-003`, `ABC-005`) are merged on `main`.

### The 2026-08-10 repair — EIGHTEEN corrections, NINE of them witnessed by a wrong build

Re-checked at the `Ready → Ready for Dev` exit, ten days after the ticket was cut. **Nothing here
was unsatisfiable** — this was never `ABC-023`. The ticket was buildable the whole time; what it was
not is *runnable as acceptance*. The pre-check that opened this hop named four defects and a fifth
it declined to assert; **the measured count is eighteen**, which is the fifth consecutive ticket on
this board where the opening count was low. *(First written as "seventeen" and corrected on recount
within the same hop: the enumerated list is the authority and it has eighteen entries — nine
witnessed by a wrong build, eight found by reading, and the contract gap. Recorded rather than
quietly amended, because a count nobody can re-derive from the list under it is the same defect this
hop spent its day repairing.)*

**The load-bearing number is not eighteen, it is nine.** Nine deliberately wrong builds of `toSan`
passed **all thirteen criteria as they were written** — and passed them *charitably*, with each
prose criterion given the best FEN that can be built for it, which is more than an engineer holding
only the ticket would have had. All nine die on the repaired table. Each was run as a real build
against a hand-typed oracle of 52 rows over 18 positions, on merged `main`, outside the repository:

| wrong build | what it emits | killed now by |
|---|---|---|
| rank before file | `N1c3` where the file would have separated them | `A4` |
| rivals from the pseudo-legal list | `Nge4` when the rival is pinned | `A7` |
| rivals not filtered by piece type | `Nbd2`, `Rhf1`, `Ngf3` … (12 rows red) | `A8` |
| `#` on "no reply" without "in check" | `Qg6#` for a **stalemate** | `A17` |
| capture decided by `board[move.to]` | `d6` for an en-passant capture | `A10` |
| `x` only for pawn captures | `Ne5`, `Ra8+` | `A11`, `A3` |
| castle returns before the suffix | `O-O` where the rook checks | `A16` |
| wrong `K` letter | `Md2`, `Mf2` | `A2` |
| `P` on a quiet pawn push | `Pe4`, `Pe5` | `A1` |

**The pre-check's own `Pe4` lead was CONFIRMED but its stated mechanism was WRONG, and that is
recorded rather than quietly absorbed.** The build it described — an explicit `P` on every quiet
pawn move — is killed by the promotion criterion, because it also emits `Pe8=Q`. The build that
actually survives is the narrower one whose promotion branch is written separately and correctly.
The gap is real; the witness is not the one that was predicted.

The other eight corrections, none of which a wrong build was needed to show:

1. **One of thirteen criteria was executable as written.** `## Acceptance` opened *"Every criterion
   is a hand-built FEN with an exact expected string"*; only the castling criterion was. Five named
   a position in prose, three named none at all, two were unbounded universals (*"any position"*),
   and two were about the bars and the suite.
2. **The three-queen expected value was a hedge** — `(e.g. Qh4e1)` is not an expected string. The
   position is now built, confirmed legal, and pinned; the queen on `h4` does move to `e1` and it
   does need the full square.
3. **Two of that position's three rows were being thrown away.** `Qee1` and `Q1e1` come free from
   the same FEN and are the rungs that catch a full-square-always build.
4. **Purity (`A18`) and the `legal`-argument equivalence (`A19`) had no witness set** — *"given any
   position"* cannot be run. Both are now quantified over the 18 named positions and every legal
   move of each, in both call forms.
5. **The module surface was asserted by nothing.** A build that imported `gameend.ts`, or shipped a
   `parseSan` stub against the epic boundary, satisfied all thirteen criteria. `A20`.
6. **The NFR bars named no move population and no aggregation**, and under the per-call reading a
   *correct* build fails both — measured 1.42x over the `6.5 µs` bar and 22.5x over the `0.20 µs`
   bar on a checking piece move, because the mate test is a second `legalMoves`. Re-derived as
   `N1`–`N4` against a position now pinned as a literal FEN.
7. **`NFR-003`'s parenthetical was wrong by ~5x** (~20 µs and ~5,000x under budget, not ~4 µs and
   ~25,000x).
8. **A `## Test notes` sentence had become false** — it described `ABC-009` as open; it merged
   2026-08-09. Corrected in place, with what the merge actually means for `A18`.

And one contract gap, now written down rather than left to an implementer: **`toSan`'s precondition
on `move`**. The contract stated the caller obligation for the `legal` list and not for the move
itself; behaviour on an illegal `move` is now explicitly undefined and asserted by no criterion,
rather than silently assumed. See `## Scope`.

### What this repair does NOT establish

- **Not that the table is complete.** Nine wrong builds passed a table a careful pre-check had just
  reviewed; the honest prior is that more exist. `QE`'s mutation hop is the independent check, and
  it must be independent: the reference implementation that scored these nine was written by the
  same role that wrote the rows, which is exactly the dependency `ABC-023`'s QE hop broke.
- **Not that `legalMoves` has or has not regressed** since wave 1. The comparison is not available:
  wave 1 named a method, not a position.
- **Size `M` (3) is unchanged**, and re-checked rather than assumed. Every added criterion is a row
  in a table `## Scope` already required, not new behaviour — the implementation is the same
  implementation. The engineer now receives all 18 FENs and all 52 expected strings instead of
  having to invent positions from prose, which moves work out of the build, not into it. Priority
  `P1` unchanged. `## Scope` and `## Out of scope` re-read and **not** widened: every new criterion
  cites the Scope bullet it enforces.

## Board history

Every `plans/board.md` entry ever written about this ticket — column entries and exits, the WIP
counts at each move, and what each gate recorded — is in
[`history/ABC-013-board-history.md`](history/ABC-013-board-history.md) (3,598 bytes), moved there **verbatim** on 2026-08-10 when the board
was tidied. It is not duplicated on the board and nothing was summarised or dropped.
