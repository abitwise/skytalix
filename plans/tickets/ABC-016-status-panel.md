---
id: ABC-016
title: Status panel — side to move, check, material balance, move number, last move, thinking row
status: backlog
column: Backlog
size: M
priority: P1
epic: EPIC-002
feature: —
---

# ABC-016 — Status panel: side to move, check, material balance, move number, last move, thinking row

## Problem

*User*: the player mid-game, who needs to know four things without counting pieces on the screen —
whose turn it is, whether they are in check, what move number it is, and what just happened.

*Pain*: a board alone does not answer any of them. Worst of these, a player who does not notice
they are in check will try an illegal move and get a rejection they do not understand.

*Value*: epic acceptance **#3** lives here — *"Given the side to move is in check, when the board
renders, then the status line states it explicitly."* Everything else in the panel is what turns a
board picture into a game.

## Scope

**A panel renderer that returns a fixed number of rows** (three, in the reference layout) as a
value, given the live position, the history and the loop's thinking flag. Writes nothing.

Six items:

1. **Side to move** — `position.blackToMove`. A plain boolean on the live object.
2. **Check indicator** — `isInCheck(position)` (`src/legal.ts:32`), which reports whether **the side
   to move** is in check and nothing else. That is exactly what criterion #3 asks for, and it is
   never the wrong primitive: a position in which the side *not* to move is in check is illegal and
   unreachable through legal play.
3. **Move number** — `position.fullmoveNumber`, rendered `N.` when white is to move and `N...` when
   black is.
4. **Last move played, in SAN** — `toSan` of the last `Move` in the history against the position
   **before** it. Blank when the game has no moves yet.
5. **Material balance** — sum the piece values of each colour by scanning the 64 squares of
   `position.board` and take the difference, rendered as a signed number from white's point of view
   (`+3`, `-1`, `0`).
6. **Engine thinking indicator** — **static**, from a flag the loop owns. Shown while the loop is in
   the thinking state, and **its row exists in every frame, blank when idle**, so the frame's height
   does not change when the engine starts or stops.

## Out of scope

- **The captured-piece list.** Cut from the MVP by epic amendment `[A4]`. It is a different quantity
  from the balance with a different correct derivation (the move list, never the board) and two
  traps: a board diff is wrong after any promotion, and en passant does not put the captured pawn on
  the destination square, so it must be read from `move.captured` and never from `undo.captured` or
  `board[to]`. Deferred, with the traps recorded here so whoever picks it up does not rediscover
  them.
- **An animating thinking indicator.** Static only — epic `## Out of scope`. Node is
  single-threaded; an updating indicator would be a requirement on `EPIC-004`'s internals.
- **The board itself** (`ABC-014`), **the move-history pane** (`ABC-017`), **the message region and
  all writing** (`ABC-018`), **the loop that owns the thinking flag** (`ABC-019`).
- **Terminal-state text** ("checkmate — white wins"). The loop's terminal reason and `EPIC-006`'s
  result screen own that; this panel reports check, not game over.

## Acceptance (Given/When/Then)

- **Given** any position with `blackToMove` false, **when** the panel renders, **then** it states
  white to move; **and given** `blackToMove` true, **then** black. *(Assert on the rendered text,
  both ways — a panel that always says "white" passes a one-sided test.)*
- **Given** `rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3` (white to move, in
  check), **when** the panel renders, **then** the check indicator is present. **Given** the
  starting position, **then** it is absent. *(Epic acceptance #3.)*
- **Given** the starting position, **when** the panel renders, **then** the move number reads `1.`;
  **given** the position after `1.e4`, **then** it reads `1...`; **given** the position after
  `1.e4 e5`, **then** it reads `2.`. *(`makeMove` increments `fullmoveNumber` when the side that
  just moved was black, before the side flips — so the live value is the number of the move the side
  to move is **about** to play, which is what the panel wants.)*
- **Given** a position loaded from a FEN with `fullmoveNumber` 27 and an **empty** move list,
  **when** the panel renders, **then** the move number reads `27.`, not `1.`. *(**Do not derive the
  move number from the history length.** `parseFen` accepts any fullmove ≥ 1, and `EPIC-003` will
  accept a FEN from a user — `ABC-010` exists for that reason. `position.fullmoveNumber` is right in
  both cases; `history.length` is right in only one.)*
- **Given** a history whose last move was `Ng1f3`, **when** the panel renders, **then** the last-move
  cell reads exactly `Nf3`. **Given** an empty history, **then** the cell is blank and the panel
  still has its full row count.
- **Given** the starting position, **when** the panel renders, **then** the material balance reads
  `0`. **Given** a position one white queen down, **then** it reads `-9`. **Given** a position in
  which white has promoted a pawn to a queen and black is otherwise level, **then** it reads `+8`.
  *(The promotion case is the one a board-diff-against-the-starting-complement gets wrong; a
  64-square scan gets it right.)*
- **Given** the loop's thinking flag true, **when** the panel renders, **then** the indicator is
  present; **given** it false, **then** the indicator row is present and **blank**, and the panel's
  **row count is identical** in both cases. *(This is the panel's half of epic acceptance `4a`.)*
- **Given** any of the above rendered twice, **when** compared, **then** the panels are
  byte-identical and `toFen(position)` is unchanged by rendering.
- **Given** glyph mode ASCII, **when** the panel renders, **then** the count of code points above
  `U+007F` in the panel is **exactly 0**. *(The panel is part of the frame; epic acceptance `2a`
  covers all of it, not just the board.)*
- **Given** the cost bar in *Security / NFR triggers*, **when** measured, **then** it holds.

## Dependencies

- **`ABC-014`** — the frame this panel is part of, and the `GlyphMode` type.
- **`ABC-013`** — `toSan`, for the last-move cell. `ABC-013` is `Blocked` on `ADR-0004`'s
  ratification, so **this ticket inherits that wait**. It is in `Backlog` behind two tickets rather
  than in `Blocked`: its blocker is a ticket, not a decision.
- **`ABC-012`** — the history supplies the last `Move` and the position before it.
- `ABC-005` (`isInCheck`) merged on `main`.

## Security / NFR triggers

- `NFR-002` (full redraw < 16 ms) — bar: **panel compute ≤ 250 µs per frame**, recorded with its
  machine per `plans/nfr-catalog.md`'s convention. Derivation, so the bar is checkable rather than
  guessed: one 64-square scan, one `isInCheck` (inside `legalMoves`'s measured 2.1–5.3 µs band on
  Apple M3 / Node v24.12.0 / darwin-arm64), and one `toSan` (measured 4.31–4.45 µs unassisted). The
  expected total is well under 20 µs; the bar is set an order of magnitude above it so that missing
  it means something is structurally wrong, not that the machine was busy.
- **The panel calls `isInCheck` a second time**, independently of the one `gameStatus` makes inside
  its zero-legal-moves branch. That is deliberate and it is affordable at this budget; it is the
  honest reading of criterion #3, which is about the rendered board and not about the terminal check.
- **No security trigger.** Every value rendered here is derived from `position` and from generator-
  owned `Move`s. No user-supplied string reaches this panel.

## Test notes

- **Write the material-balance test as a table of FENs with exact expected integers**, including the
  promotion case. It is the one item where the obvious implementation (diff the board against the
  standard starting complement) is wrong in a way that looks right for the first twenty moves.
- **The move-number test needs the loaded-FEN case**, not just the from-startpos case. The
  from-startpos case passes under the wrong implementation.
- **Assert the row count in both thinking states in the same test.** A separate test per state will
  not catch the height change, which is the thing epic acceptance `4a` turns on.
- Panel snapshots go beside `ABC-014`'s board snapshots and in the same shape, so the frame can later
  be snapshot as a whole.

## Size and priority rationale

**Size `M` (3).** Six small items, but four of them have a correctness trap that has already been
identified (move number from FEN, material after promotion, `isInCheck` semantics, the invariant row
count) and each needs a named test. The code is short; the panel is where several quiet wrong answers
would live. Calibrated against `ABC-007` (`M`) and above `ABC-006` (`S`).

**Priority `P1`.** It carries epic acceptance #3, so the epic is not done without it, but the game
runs and is playable with a board and a loop alone. Below the four `P0` tickets and above `ABC-017`.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ (exact FENs, exact
strings, exact integers, identical row counts) · dependencies ✅ (`ABC-012`, `ABC-013`, `ABC-014`;
the `ADR-0004` wait is inherited through `ABC-013` and named) · NFR triggers ✅ (numeric bar with a
stated derivation) · test notes ✅ · size `M` ✅ · priority `P1` ✅ · no blocker ✅ *(its
dependencies are tickets, not unresolved decisions)*

Sits in `Backlog`. Promotion to `Ready` is a separate BA/PM step.
