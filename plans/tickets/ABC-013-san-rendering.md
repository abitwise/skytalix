---
id: ABC-013
title: SAN rendering — src/san.ts with toSan only
status: blocked
column: Blocked
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

`memory-bank/50-decisions/ADR-0004-san-ownership.md` (**status `proposed`**) and task
`epic-to-tickets-EPIC-002` note `20260730T144200Z-architect-design-decision-63309fd4` ("SEAM 3
CLOSED"). This ticket implements the seam; it does not re-decide it.

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
  command, which is formatting that very list) get the 40x for one optional argument.
- Imports `position.ts`, `moves.ts`, `apply.ts`, `legal.ts`. It does **not** import `gameend.ts`
  (the `#` suffix is checkmate only; `gameStatus` would additionally compute insufficient material
  and repetition, which are not SAN suffixes) and does **not** import `history.ts`.

## Out of scope

- **`parseSan` — `EPIC-003` adds it to this same file.** This is a cross-epic ticket boundary over
  one file, closed by wave 1 and **not re-opened here**: `EPIC-002` creates `src/san.ts` with
  `toSan` only; `EPIC-003` adds `parseSan` and owns the `parse(toSan(move)) === move` round-trip
  property test its Test notes already name. This epic ships no parser (it has no use for one —
  AGENTS.md rule 5) and `EPIC-003` ships no second formatter.
- **Caching SAN strings anywhere.** `ADR-0004` clause 3: SAN is derived per frame, never stored in
  the history. `history.ts` does not import `san.ts`.
- **PGN**, move numbering, annotation glyphs (`!`, `?`, `!?`), comments and variations. Move
  numbering belongs to the panel that lays out the two columns (`ABC-017`), not to the grammar.
- Any change to `src/legal.ts` or the rules core.

## Acceptance (Given/When/Then)

Every criterion is a hand-built FEN with an exact expected string.

- **Given** `r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1`, **when** each castling move is formatted,
  **then** the strings are exactly `O-O` and `O-O-O` (capital letter O, not zero).
- **Given** a position with white knights on `b1` and `d1` both able to reach `c3`, **when** each
  is formatted, **then** the strings are `Nbc3` and `Ndc3` — file disambiguation.
- **Given** a position with white knights on `c3` and `c5` both able to reach `e4`, **when** each
  is formatted, **then** the strings are `N3e4` and `N5e4` — **rank** disambiguation, used only
  because the file does not separate them.
- **Given** a position with three white queens able to reach one square, two sharing a file and
  two sharing a rank, **when** the one that is ambiguous on both axes is formatted, **then** the
  string carries the **full origin square** (e.g. `Qh4e1`).
- **Given** a white pawn on `e4` capturing on `d5`, **when** it is formatted, **then** the string
  is exactly `exd5` — a pawn capture always carries its origin file.
- **Given** a white pawn on `e7` promoting on `e8`, **when** all four promotion moves are
  formatted, **then** the strings are exactly `e8=Q`, `e8=R`, `e8=B`, `e8=N`; **and given** the
  same promotion as a capture on `d8`, **then** they are `exd8=Q` and so on.
- **Given** a move that gives check but not mate, **when** it is formatted, **then** the string
  ends in exactly one `+` and no `#`.
- **Given** a move that delivers checkmate, **when** it is formatted, **then** the string ends in
  exactly one `#` and no `+`.
- **Given** a promotion that delivers mate, **when** it is formatted, **then** the suffix order is
  `=Q#` — the promotion piece precedes the check marker.
- **Given** any position, **when** `toSan(position, move)` returns, **then**
  `toFen(position)` is **byte-identical** to its value before the call. *(The function makes and
  unmakes moves internally; it must leave the caller's live position exactly as it found it. This
  is the transient-mutation contract `memory-bank/30-architecture.md` records.)*
- **Given** the same `(position, move)`, **when** formatted with and without the `legal` argument,
  **then** the two strings are **identical**.
- **Given** the cost bars in *Security / NFR triggers*, **when** measured on the machine class the
  baseline was taken on, **then** they hold.
- **Given** the full test suite, **when** it runs, **then** it is green with a skip count of **0**
  and **no existing test is modified**.

## Dependencies

- `ABC-005` (`legalMoves`, `isInCheck`) and `ABC-003` (`makeMove` / `unmakeMove`) — merged on
  `main`.
- **BLOCKING: `ADR-0004` is `proposed`, not `accepted`.** The ADR states it itself: it does not
  block cutting tickets, **but it blocks the merge of the first line of `src/san.ts`**, because
  that is the point at which the decision becomes expensive to reverse. **No agent may mark an ADR
  `accepted`** — `ADR-0002` and `ADR-0003` were each ratified in session by a named human and this
  one needs the same ruling. **This ticket therefore sits in `Blocked` with
  `blocked-by: ADR-0004 unratified — needs a named human`, dated 2026-07-30**, rather than in
  `Ready` where it would be pullable into work that cannot land.
- Blocks `ABC-016` (last move in SAN) and `ABC-017` (the move-history pane).

## Security / NFR triggers

- `NFR-002` (16 ms frame) — SAN is the most expensive single item in a frame, and ~97% of that
  cost is inside `legal.ts`, so anyone profiling the renderer will land in the rules core. Bars at
  ~1.5x wave 1's measured figures, **Apple M3, Node v24.12.0, darwin/arm64, `UNKNOWN - verify` on
  any other hardware**, at a ply-60 middlegame position:
  - `toSan(position, move, legal)` ≤ **0.20 µs** *(measured 0.10–0.11 µs)*
  - `toSan(position, move)` ≤ **6.5 µs** *(measured 4.31–4.45 µs)*
- `NFR-003` (`moves` command < 100 ms) — not this epic's criterion, but this function is what
  `EPIC-003` will format ~41 moves with. At the supplied-list cost that is ~4 µs total, ~25,000x
  under the budget. Recorded so nobody re-derives it.
- **No security trigger.** Input is a `Move` from the generator and a `Position`; no user-supplied
  string reaches this module. *(The user-supplied-string risk in this epic is in the frame's
  message region and is carried by `ABC-018`.)*

## Test notes

**The honest limit, stated up front:** the round-trip property test that is the real safety net
for this grammar — `parse(toSan(move)) === move` over the perft positions — belongs to `EPIC-003`,
because it needs the parser. Until then this module's only oracle is the hand-built table above.
Write it as a table of `(fen, move, expected)` triples so `EPIC-003` can extend rather than replace
it.

- **Disambiguation is where the bugs are, in both directions** (`EPIC-003`'s Risks section says so
  too). The three-queen case is not exotic padding: file-then-rank-then-square is a precedence, and
  an implementation that jumps straight to the full square is wrong on the common case while
  looking right.
- **Test the transient-mutation criterion explicitly**, by asserting `toFen` before and after. The
  function calls `makeMove` and `legalMoves`, both of which mutate and restore. Wave 1's harness
  held this at 120 plies on well-formed positions; it says nothing about `ABC-009` (malformed
  positions), which is out of scope here.
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
measurable ✅ (exact strings from exact FENs) · dependencies ✅ · NFR triggers ✅ (two numeric
per-call bars with machine) · test notes ✅ · size `M` ✅ · priority `P1` ✅ ·
**no major unresolved blocker ❌ — `ADR-0004` is unratified.**

**This ticket does NOT meet the Definition of Ready** on the last check, and it is deliberately not
promoted to `Ready`. It sits in `Blocked`, visible and time-tracked (`blocked_escalation_days: 2`),
so the human ruling it needs is on the board rather than buried in a dependency line. Everything
else on the checklist is met, so ratification alone clears it.
