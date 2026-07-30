---
id: ABC-017
title: Bounded move-history pane — two-column SAN, constant height
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-002
feature: —
---

# ABC-017 — Bounded move-history pane: two-column SAN, constant height

## Problem

*User*: the player who wants to see how the game got here without scrolling back through eighty
reprinted boards.

*Pain*: the move list exists only inside the history module as `Move` objects. There is nothing a
player can read.

*Value*: the two-column SAN move list is what a chess player expects on a board display, and it is
what makes a terminal chess game look like a chess game rather than a REPL.

## The bound, and why it is the whole point of this ticket

Wave 1 quantified an overflow that arrives far earlier than epic acceptance #4's own move 40: with
board and labels at ~10 rows, the status panel at ~3 and the message region at 2, a conventional
24-row terminal leaves ~8 rows for history, so an **unbounded** pane overflows the viewport at
**roughly move 9 — before the opening is over**. At move 40 the frame would be ~56 rows, more than
twice the viewport, and "redraws without leaving stale rows" is not merely hard there, it is
**undefined**: the frame does not fit the region it is being redrawn into.

BA/PM ruled on 2026-07-30 (epic amendment `[A2]`, criteria `4a`–`4d`) that **the pane is bounded**.
This ticket implements the bound. It is a genuine reduction and it is recorded as one in the epic:
the live frame no longer shows the whole game. `EPIC-006`'s game-end screen already promises *"the
full move list"*, so the information stays in the product.

## Scope

**A pane renderer returning a constant number of rows** (8 in the reference layout) as a value,
given the history and the glyph mode. Writes nothing.

- **Two-column SAN**, one row per move pair: `12. Nf3 Nc6`.
- **Bounded to the most recent 8 move pairs.** A longer game shows the last 8; a shorter game is
  **blank-padded** to 8 rows so the pane's height never changes.
- **Move numbers are the real ones** — the pane shows moves 33–40 of a 40-move game, numbered 33–40,
  not 1–8.
- A game in which black has not yet replied shows the white ply alone in that row.
- SAN comes from `toSan` (`ABC-013`); the pane does the layout and the numbering.

**This pre-adopts `ADR-0004`'s own first response to its clause-3 trigger** — *"render only the
visible window ... the frame becomes O(window) with no cache at all, and it is a renderer decision
inside `EPIC-002`"*. It is adopted up front rather than held in reserve, because the viewport
arithmetic above forces the bound anyway.

## Out of scope

- **Caching or storing SAN strings.** `ADR-0004` clause 3: derived per frame, never stored in the
  history, and `history.ts` does not import `san.ts`. The bound is what makes deriving affordable
  at any game length; a cache would buy nothing here.
- **Scrolling within the pane, paging, or a `history` command.** Not in any epic's command set
  (`moves` / `help` / `board` / `quit`, plus `EPIC-006`'s `undo` / `resign` / `new` / `quit`). If a
  player wants the full list, the end screen has it.
- **The full move list** — `EPIC-006`'s game-end screen.
- **PGN export** — `EPIC-006`'s negotiable slice.
- The board (`ABC-014`), the status panel (`ABC-016`), writing (`ABC-018`).

## Acceptance (Given/When/Then)

- **Given** a history of **0** plies, **when** the pane renders, **then** it has **exactly 8 rows**
  and every row is blank.
- **Given** a history of **1** ply (`1.e4`), **when** the pane renders, **then** it has **exactly 8
  rows**, one of which reads `1. e4` with no black ply, and the rest are blank.
- **Given** a history of **80 plies (40 moves)**, **when** the pane renders, **then** it has
  **exactly 8 rows**, the first reads `33.` … and the last reads `40.` … — the **most recent** 8
  pairs, numbered **33–40**.
- **Given** a history of **300 plies**, **when** the pane renders, **then** it has **exactly 8
  rows**, identical in count and width to the 0-ply case. *(This is the criterion the unbounded
  model could not meet at any length.)*
- **Given** a history of 80 plies and the same history after `takeBack(2)`, **when** both panes
  render, **then** the second shows one fewer move pair in its last row and still has **exactly 8
  rows**.
- **Given** any history, **when** the pane renders twice, **then** the two are byte-identical and
  `toFen(history.position)` is unchanged by rendering.
- **Given** glyph mode ASCII, **when** the pane renders, **then** the count of code points above
  `U+007F` is **exactly 0**. *(SAN is ASCII by construction; this asserts that the layout — padding,
  separators, alignment — did not introduce a non-ASCII character.)*
- **Given** the pane rendered at **40, 120 and 300 plies**, **when** each is measured, **then** the
  three costs differ by **less than 2x** and all three are **≤ 150 µs**. *(This is the O(window)
  proof — see NFR triggers. Under the unbounded model the same three measurements were 171–176 µs,
  517–533 µs and 1,272–1,318 µs, a spread of 7.5x.)*

## Dependencies

- **`ABC-013`** (`toSan`) — and through it the wait on `ADR-0004`'s ratification.
- **`ABC-012`** (the history) and **`ABC-014`** (frame conventions, glyph mode).

## Security / NFR triggers

- `NFR-002` (full redraw < 16 ms) — bar: **pane compute ≤ 150 µs at any game length**, and the
  40/120/300-ply figures within **2x** of each other. Recorded with its machine, per
  `plans/nfr-catalog.md`'s convention.
  **Derivation, stated so the bar is checkable:** replay to the window's first ply costs 2.2–3.9 µs
  (measured, flat, dominated by one `parseFen` at 1.62 µs) and 16 visible plies at 4.31–4.45 µs
  each is ~70 µs, so ~**70–75 µs** total. The bar is ~2x that. All figures **Apple M3,
  Node v24.12.0, darwin/arm64**, transcribed from wave 1's measurement note;
  **`UNKNOWN - verify` on any other hardware.** *This is BA/PM arithmetic over someone else's
  measurement — it is a target, not a result.*
- **`plans/nfr-catalog.md`'s NFR-002 row is owed an update and this ticket is the reason.** That row
  records that *"the frame is a function of GAME LENGTH, not only of position — the history panel is
  O(plies)"*, which was true of the unbounded model and is not true of this one. **The row is
  Architect/Design's to rewrite; flagged here, not edited.**
- **No security trigger.** SAN strings are derived from generator-owned `Move`s; no user-supplied
  text reaches this pane.

## Test notes

- **The three length cases (0, 1, 80, 300 plies) must assert the row count explicitly**, not just
  the content. The row count is the criterion; the content is the feature.
- **The 80-ply case must assert the move *numbers*** (33–40), not merely that eight rows are
  present. An implementation that shows the first 8 pairs instead of the last 8 passes a
  count-only test and is useless.
- **The cost test asserts a ratio, not only an absolute.** The absolute bar is machine-dependent and
  will drift; the "within 2x across 40/120/300 plies" ratio is what proves the pane is O(window),
  and it is machine-independent.
- Generating an 80-ply and a 300-ply history for the tests: reuse whatever `ABC-012`'s tests use to
  build a long game. Do not hand-write 300 moves.

## Size and priority rationale

**Size `S` (2).** Layout and numbering over a slice of an existing list, plus `toSan` per visible
ply. No chess logic, no new module of consequence, and the bound removes the only hard part.
Calibrated against `ABC-006` (`S`) and `ABC-011` (`S`). It would have been `M` or worse under the
unbounded model, where the pane would have had to negotiate with the viewport.

**Priority `P2`.** The game is fully playable without it: the board renders, the loop runs, the
status panel names the last move. It is the "feel" item, and `EPIC-006`'s end screen carries the
full list regardless. Not `P3` — `P3` is "someday", and this is in the epic's scope line and in its
Done. It is the right thing to drop first if this epic runs long.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ · acceptance measurable ✅ (exact row counts at
four game lengths, exact move numbers, a ratio bound and an absolute bound) · dependencies ✅
(`ABC-012`, `ABC-013`, `ABC-014`; the `ADR-0004` wait inherited through `ABC-013` and named) ·
NFR triggers ✅ (numeric bar plus a machine-independent ratio, derivation shown) · test notes ✅ ·
size `S` ✅ · priority `P2` ✅ · no blocker ✅

Sits in `Backlog`. Promotion to `Ready` is a separate BA/PM step.
