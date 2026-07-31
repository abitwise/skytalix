---
id: ABC-013
title: SAN rendering — src/san.ts with toSan only
status: ready
column: Ready
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
  command, which is formatting that very list) get the 40x for one optional argument.
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
**no major unresolved blocker ✅ — `ADR-0004` ratified 2026-07-31.**

**This ticket now meets the Definition of Ready in full** and moved `Blocked` → `Ready` on
2026-07-31. It was blocked for one day of a two-day `blocked_escalation_days` window and never
escalated. Everything on the checklist except the last line was already met on 2026-07-30, and the
ruling changed nothing in this ticket's scope, size, acceptance criteria or NFR bars — clauses 1 and
3, the two this ticket is written against, were accepted **as proposed**. Its remaining dependencies
(`ABC-003`, `ABC-005`) are merged on `main`, so it is pullable.
