---
id: 20260730T151800Z-system-analyst-observation-ea2a3bce
kind: observation
by: system-analyst
at: 2026-07-30T15:18:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ADR-0002
  - NFR-002
  - NFR-003
  - 20260730T140500Z-orchestrator-observation-c41a7e92
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - plans/nfr-catalog.md
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - src/position.ts
  - src/moves.ts
  - src/apply.ts
  - src/legal.ts
  - src/gameend.ts
  - src/fen.ts
supersedes: 
---

# Status panel and board frame — item-by-item against what merged `src/` can actually supply

The epic lists six status-panel items: *"side to move, check indicator, captured/material
balance, move number, last move played, engine thinking indicator"*
(`plans/epics/EPIC-002-terminal-board-and-game-loop.md` `## Scope`). Three of them are free
from merged code, one is free only in a reduced form, one has a correctness trap, and one has
no supplier at all. Read against `src/` as merged on this branch.

## Availability table

| Panel item | Supplier today | Verdict |
|---|---|---|
| Side to move | `position.blackToMove` | **free** |
| Check indicator | `isInCheck(position)` (`src/legal.ts:32`) | **free** |
| Move number | `position.fullmoveNumber` | **free**, with one semantic caveat |
| Last move played | `Move` from the history module (`ADR-0002` cl. 2) | **coordinate form derivable today; SAN form is not** |
| Captured / material balance | board scan **or** move list — **different sources for the two halves** | **derivable, with a promotion trap** |
| Engine thinking indicator | nothing — EPIC-004 does not exist | **no supplier; the loop must own it as a state** |
| (board squares) | `position.board` via `squareAt` / `isOnBoard` | **free** |
| (move history, two-column SAN) | history module + a SAN formatter | **neither exists** |
| (terminal status / end reason) | `gameStatus(position, counts)` | **free, if and only if counts are supplied** |

## Item 1 — Side to move

`position.blackToMove` is a plain boolean on the live object. Nothing derived, nothing to cache.

## Item 2 — Check indicator

`isInCheck(position)` returns whether **the side to move** is in check, and only that. It costs
one `board.indexOf` scan plus one `isSquareAttackedBy` call. `gameStatus` also calls it, but only
inside the zero-legal-moves branch, so the panel's call is a second, independent one. That is
fine at this budget (see §NFR below) and it is the honest reading of epic acceptance #3.

## Item 3 — Move number

`position.fullmoveNumber`. **Semantics worth pinning down:** `makeMove` increments it when the
side that just moved was black, *before* the side flips (`src/apply.ts:145`). So the value on a
live position is the number of the move the side to move is **about** to play — which is exactly
what a status panel wants. The ply label is `fullmoveNumber` + `.` for white to move, + `...`
for black.

**Do not derive the move number from `history.length`.** `parseFen` accepts any fullmove ≥ 1
(`src/fen.ts:179`), and `ABC-010` is filed under EPIC-003 precisely because *"EPIC-003 accepts a
FEN from a user"* (`plans/board.md`). On a loaded position the move list is empty while the real
move number is not 1. `position.fullmoveNumber` is right in both cases; `history.length` is right
in only one.

## Item 4 — Last move played

The `Move` interface carries `{ from, to, piece, captured, flags, promotion }` (`src/moves.ts:46`).
That is enough for **coordinate form** and not enough for **SAN**:

- **Coordinate (`e2e4`)** — `squareName(from) + squareName(to)` from `src/position.ts:60`, already
  exported and already used by `toFen`. Available with no new chess logic. One gap: the promotion
  suffix (`e7e8q`) needs a piece-type → letter map, and the existing one (`CHAR_BY_PIECE`,
  `src/fen.ts:47`) is **module-private, not exported**. That is a handful of characters, not a
  design.
- **SAN (`Nbd2`, `exd5`, `O-O`, `Qxf7#`)** — needs two positions, not one: the position **before**
  the move for disambiguation (which other same-type pieces could also reach `to`? that is a
  `legalMoves` call on the pre-move position) and the position **after** it for the `+` / `#`
  suffix (an `isInCheck` plus a mate test on the post-move position). Neither of those falls out
  of a `Move` alone, and no SAN code exists anywhere in `src/`.

**Consequence for whoever cuts the tickets:** "last move played" and "move history in two-column
SAN" are not one capability. The loop can display a correct last-move in coordinate form with
zero new chess logic; both of them in SAN require the formatter first. *(Where the formatter
lives is Architect/Design's seam — deliberately not touched here.)*

## Item 5 — Captured pieces and material balance

These are **two different quantities with two different correct derivations**, and the epic's
slash hides that.

**Material balance → derive by scanning the 64 squares.** Sum piece values by colour off
`position.board`, difference them. Correct after promotions, correct from a loaded FEN, correct
with no history at all. ~64 iterations plus `pieceType`.

**Captured-piece list → derive from the move list, never from the board.** Accumulate
`move.captured` over the history (`ADR-0002` clause 2 makes the move list the authoritative
state, and every `Move` already carries `captured`, `EMPTY` on a quiet move). Two traps:

- **The board-diff shortcut is wrong after a promotion.** Diffing the current board against the
  standard starting complement says "black has captured −1 queen" once white promotes. Material
  balance by scan is unaffected; the *list* is not.
- **En passant does not put the captured pawn on `to`.** `Move.captured` is set to the enemy pawn
  (`src/moves.ts:192`) while `board[to]` was `EMPTY`; consequently `UndoRecord.captured` is
  `EMPTY` for an en-passant move (`src/apply.ts:124`) and the pawn is restored from `move.captured`
  in `undoSpecial` (`src/apply.ts:109`). **Read `move.captured`, never `undo.captured`, and never
  `board[to]`,** when building the captured list.

Also: from a loaded FEN, "captured this game" is the only truthful phrasing — pieces missing
before the load are not in the move list.

## Item 6 — Engine thinking indicator, with no engine

Nothing in `src/` can supply it and nothing will until EPIC-004. What EPIC-002 *can* own, fully
and testably today, is the **loop state**: `S4 engine-thinking` exists in the state map
regardless of what fills it. So the indicator's requirement restates cleanly as a property of the
loop rather than of the engine:

> Given the loop is in `engine-thinking`, when a frame renders, then the thinking indicator is
> shown; given any other state, the indicator's row is present and blank.

That is verifiable against a stub that merely takes time, and it keeps frame height invariant
across the transition (see the settled-rules note). What **cannot** be verified inside EPIC-002 is
whether the indicator updates *during* a real 3-second search — that is a contract on EPIC-004's
internals and is on the stop list.

## The frame's full data requirement, stated once

Per frame: `board[64]`, orientation, `blackToMove`, `isInCheck`, `fullmoveNumber`, `GameStatus`,
last `Move`, the `Move[]` history, material balance, thinking flag. Everything except the last
four comes off the live `Position`; the last four come from the history module, the loop's own
state, and a formatter that does not exist.

## Cost, against NFR-002 and NFR-003

Numbers below are **transcribed**, not measured here, each carrying its machine per the standing
convention in `plans/nfr-catalog.md`. All are **Apple M3, Node v24.12.0, darwin/arm64**.

- One `legalMoves()` call: **2.1–5.3 µs** (`plans/nfr-catalog.md`, NFR-003 row, measured
  2026-07-29). A frame costs one such call inside `gameStatus`, plus an `isInCheck`, plus two
  128-entry scans.
- Deriving the whole history by replaying a 120-ply move list: **41 µs**; undo **44.5 µs**
  (`ADR-0002` Context table).

Against `NFR-002`'s 16 ms frame budget, a full derive-everything frame is on the order of
**0.3%** of the budget on that machine. **The compute half of NFR-002 is not the risk; the
terminal write and the terminal's own paint are, and they are `UNKNOWN - verify` because nothing
is built.** This also confirms, for the loop specifically, that `ADR-0002` clause 2's
derive-don't-maintain call is comfortable here: replaying once per ply costs ~0.26% of one frame
budget, and the ADR's own trigger for revisiting it ("a consumer that needs the derived counts
more than a few times per turn") is not met by this loop — one derive per ply, one frame per ply.
