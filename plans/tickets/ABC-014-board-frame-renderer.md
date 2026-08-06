---
id: ABC-014
title: Board frame renderer — grid, labels, shading, orientation, both glyph modes
status: in-development
column: In Development
size: M
priority: P0
epic: EPIC-002
feature: —
---

# ABC-014 — Board frame renderer: grid, labels, shading, orientation, both glyph modes

## Problem

*User*: every player, on every single ply. This is the thing they look at.

*Pain*: there is no way to see a chess position in this product. `toFen` produces
`rnbqkbnr/pppppppp/8/8/...`, which is a serialization format, not a board. The stated requirement
is a *console chess game* — "you glance at the terminal and instantly read the position".

*Value*: the headline of the epic. Everything else in `EPIC-002` decorates this.

## Scope

**A board renderer that returns a frame as a value** — an array of strings, or one string — and
writes nothing. `ABC-018` owns writing.

- **8x8 grid**, all 64 squares, with **rank numbers `1-8`** on the board rows and a **file-label
  row `a-h`**.
- **Light/dark square shading by CHARACTER**, not by ANSI background colour. A character survives
  a pipe, a snapshot diff, and a terminal with no colour support; an ANSI background survives none
  of them, and `EPIC-006`'s end-to-end test drives stdout as a pipe. *(Scope amendment `[A4]` on
  the epic. ANSI colour is deferred, not deleted.)*
- **Two glyph modes over one layout**: Unicode figurines (`♔♕♖♗♘♙` / `♚♛♜♝♞♟`) and ASCII letters
  (`KQRBNP` upper = white, `kqrbnp` lower = black). The mode is a **parameter**, not something this
  module decides — `ABC-015` decides it.
- **Orientation is a parameter and it rotates both axes together.** White at the bottom: ranks
  7→0 down the frame, files 0→7 across, rank labels `8..1`, file labels `a..h`. Black at the
  bottom: ranks 0→7, files **7→0**, rank labels `1..8`, file labels **`h..a`**.
- Declares the `GlyphMode` and orientation types this epic's other tickets consume.

## Out of scope

- **Deciding the glyph mode** — `ABC-015`.
- **The status panel** (`ABC-016`), **the move-history pane** (`ABC-017`), **the message region**
  and **writing anything to stdout** (`ABC-018`), **the loop** (`ABC-019`).
- **ANSI colour and the `NO_COLOR` convention** — cut from the MVP by scope amendment `[A4]`.
- Square highlighting of the last move or of the checked king. Not in the epic's scope line, which
  lists grid, labels, shading and pieces and nothing else.
- Validating the position. This renderer draws whatever `position.board` holds. `ABC-009` and
  `ABC-010` own position validity and neither is in this epic.

## Acceptance (Given/When/Then)

- **Given** `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` and white-at-bottom,
  **when** the frame is rendered, **then** it contains **exactly 64 square cells**, the file-label
  row reads `a b c d e f g h` in that order, and the rank labels read `8,7,6,5,4,3,2,1` from the
  first board row to the last. *(Epic acceptance #1.)*
- **Given** the same position and **black**-at-bottom, **when** the frame is rendered, **then** the
  file-label row reads `h g f e d c b a` **and** the rank labels read `1,2,3,4,5,6,7,8`, **and**
  the frame is **not** equal to the white-at-bottom frame with its rows simply reversed. *(Both
  axes flip. Flipping ranks alone produces a left-right mirror in which the king and queen swap
  files — a board that looks plausible and is wrong.)*
- **Given** glyph mode **ASCII** and any position, **when** the frame is rendered, **then** the
  count of code points above `U+007F` in the frame is **exactly 0**. *(Epic acceptance **#2a**.
  Assert on the code-point count, not on a visual check — a terminal cannot substitute a glyph it
  was never sent.)*
- **Given** glyph mode **Unicode** and the starting position, **when** the frame is rendered,
  **then** every piece cell contains a code point in `U+2654`–`U+265F`, and white and black pieces
  of the same type use **different** code points.
- **Given** glyph mode **ASCII** and the starting position, **when** the frame is rendered, **then**
  white pieces appear as `RNBQKBNR` / `PPPPPPPP` and black as `rnbqkbnr` / `pppppppp` — case is the
  only colour marker.
- **Given** any two adjacent squares on the same rank, **when** the frame is rendered, **then**
  their shading characters differ; **and given** `a1` and `h8`, **then** both are dark. *(The
  standard colouring, asserted as a property rather than by eye.)*
- **Given** an empty square, **when** it is rendered in each mode, **then** the cell contains only
  the shading character for that square — the shading is not replaced by a space on empty squares
  in one mode and not the other.
- **Given** the same position and the same mode rendered twice, **when** the two frames are
  compared, **then** they are **byte-identical**, and `toFen(position)` is unchanged by rendering.
- **Given** every position in the standing perft FEN table (`src/perft.test.ts`), **when** each is
  rendered in both modes, **then** every frame has the **same row count and the same row width**
  in every row. *(Constant geometry is what `ABC-018` and epic acceptance `4a` stand on.)*
- **Given** the cost bar in *Security / NFR triggers*, **when** measured, **then** it holds.

## Dependencies

- `ABC-001` — `position.board`, `squareAt`, `fileOf` / `rankOf`, `pieceType`, `isBlack`, all merged
  on `main`. **No unbuilt dependency.**
- `ABC-015` consumes the type this ticket declares and must merge **with or before `ABC-018`**, which
  is this ticket's first user-visible use — see `ABC-015`.

> **CLARIFIED IN PLACE 2026-08-04 by BA/PM** (task `refinement-2026-08-04`, Workflow 07). This
> clause was already the **correct** half of a contradiction: `ABC-015` stated the same constraint as
> *"with or before `ABC-014` reaches `Done`"*, which is a cycle — `ABC-015` cannot be written before
> this ticket declares `GlyphMode`. **`ABC-015` was corrected, not this ticket**; the only change
> here is naming which ticket "first user-visible use" means, so a reader does not have to re-derive
> it. It is `ABC-018` — this renderer *"returns a frame as a value … and writes nothing"*, and takes
> the glyph mode as a **parameter**, so nothing this ticket merges can put a hardcoded mode in front
> of a player. **`ABC-014` DOES NOT BLOCK ON `ABC-015` AND NEVER DID.** This ticket is pullable now;
> the two Orchestrator declines of 2026-08-02 and 2026-08-03 were against the contradiction, which is
> resolved.

## Security / NFR triggers

- `NFR-002` (full redraw < 16 ms) — this is the board half of the frame, and it is one of the two
  halves nobody has measured. Bar: **board-frame compute ≤ 500 µs per frame** (3% of the budget),
  measured over the standing perft FENs and **recorded with its machine**, per the convention in
  `plans/nfr-catalog.md`. *(For calibration, wave 1 measured the SAN history derive — the item
  known to be largest in a frame — at 171–176 µs for 40 plies on Apple M3 / Node v24.12.0 /
  darwin-arm64. A board scan is 64 iterations and should be far under it. If it is not, that is a
  finding, not a rounding error.)*
- **No security trigger.** No user-supplied string reaches this module; it renders bytes from
  `position.board`. *(The message region, which does carry user-influenced text, is `ABC-018`'s and
  carries the escape-sequence trigger.)*

## Test notes

Snapshot tests over a set of known FENs in both glyph modes and both orientations — the epic's
`## Test notes` call for exactly this, and snapshots make a rendering regression obvious in a diff.
Three things that a snapshot alone will not catch, and which need explicit assertions:

- **The orientation criterion must assert the file order, not just that the two frames differ.**
  A one-axis flip produces a different frame that is wrong. Assert the label row directly.
- **The ASCII criterion must count code points, not characters.** `[...frame].filter(c =>
  c.codePointAt(0) > 0x7f).length === 0`. A `.charCodeAt` scan over a surrogate pair reports the
  wrong thing.
- **Snapshots must be written with the frame as a value.** If the only way to obtain a frame is to
  attach a terminal, `EPIC-006`'s pipe-driven end-to-end test cannot assert anything and epic
  acceptance `4c` is untestable.

## Size and priority rationale

**Size `M` (3).** Two nested loops, two glyph tables, an orientation rotation and a shading rule —
the code is modest; the tests are a matrix of (position x mode x orientation). Calibrated against
`ABC-002` (pseudo-legal generation, `M`) and `ABC-005` (`M`). It would be `L` if it also owned the
status panel and the history pane; keeping those in `ABC-016` and `ABC-017` is deliberate — folding
all three into one renderer ticket gives an 8-point `XL` and an automatic `SPLIT_REQUIRED`.

**Priority `P0`.** It is the epic's headline value and the ticket every other frame ticket builds
on. With `ABC-012`, one of the two tickets in this decomposition with no unbuilt dependency, so it
goes straight to `Ready`.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ (merged `src/` only) · acceptance measurable ✅
(exact label orders, code-point count of 0, byte-identical frames, constant geometry) ·
dependencies ✅ (none blocking) · NFR triggers ✅ (numeric bar, machine required on the record) ·
test notes ✅ · size `M` ✅ · priority `P0` ✅ · no blocker ✅

**Promoted to `Ready` 2026-07-30 by BA/PM.**
