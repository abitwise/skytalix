---
id: EPIC-002
title: Terminal board and game loop
status: backlog
column: Backlog
priority: P0
size: M
owner: BA/PM
---

# EPIC-002 — Terminal board and game loop

## User value

The game must *feel* like a console chess game — you glance at the terminal and instantly
read the position. This is the whole "console-based chess game, but in CLI" requirement.

## Scope

- Board rendering: 8x8 grid with rank/file labels, light/dark square shading, pieces.
- Piece display with a portability fallback: Unicode figurines (♔♕♖♗♘♙) by default,
  ASCII letters (KQRBNP, case = colour) when the terminal cannot render them or when
  `--ascii` is passed.
- Board orientation follows the human player's colour (your pieces at the bottom).
- Status panel: side to move, check indicator, captured/material balance, move number,
  last move played, engine thinking indicator.
- Move history display in two-column SAN.
- The turn loop itself: render → prompt human → apply → render → engine moves → repeat.

## Out of scope

- Move *input parsing* — EPIC-003. This epic owns output only, plus the loop skeleton.
- Animations, mouse support, split-pane TUI framework.

## Acceptance (epic level)

- **Given** any legal position, **when** the board renders, **then** all 64 squares plus
  file letters `a-h` and rank numbers `1-8` are shown, oriented to the human's colour.
- **Given** a terminal without Unicode support (or `--ascii`), **when** the board renders,
  **then** the ASCII fallback is used and no replacement glyphs (`?`/`�`) appear.
- **Given** the side to move is in check, **when** the board renders, **then** the status
  line states it explicitly.
- **Given** a 40-move game, **when** rendering after each move, **then** the board redraws
  without leaving stale rows from the previous frame.

## Dependencies

- `EPIC-001` — needs position state and check status to render.

## Risks

- `RISK-005` Terminal portability — Unicode chess glyphs and colour behave differently
  across Windows Terminal, iTerm2, tmux, and CI. Mitigated by the ASCII fallback being
  built in from the start rather than retrofitted.

## NFR triggers

- `NFR-002` Render latency — a full board redraw completes in **< 16 ms**, so a redraw is
  never perceptible as a stall. Architect seeds the row in `plans/nfr-catalog.md`.

## Test notes

Snapshot-test the rendered board for a set of known FENs, in both Unicode and ASCII modes.
Snapshots make rendering regressions obvious in a diff.
