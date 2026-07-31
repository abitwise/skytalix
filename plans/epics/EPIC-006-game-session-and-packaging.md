---
id: EPIC-006
title: Game session and packaging
status: backlog
column: Backlog
priority: P2
size: M
owner: BA/PM
---

# EPIC-006 — Game session and packaging

## User value

The difference between a demo and a game people actually play: you can start one in
seconds, take back the move you fat-fingered, resign a lost position, and see a real
result screen at the end.

## Scope

- Startup: choose colour (white/black/random) and difficulty, via prompt or CLI flags.
- Session commands: `undo` (takes back the human move *and* the engine reply, as one step),
  `resign`, `new`, `quit` with confirmation.
- Game-end screen: result, reason (checkmate / stalemate / repetition / fifty-move /
  insufficient material / resignation), and the full move list.

  **[AMENDED 2026-07-31 by BA/PM — the reason set is wider than six, and the exact count is settled
  at this epic's decomposition.]** `ABC-020` splits two of the six above and adds two more, because
  FIDE distinguishes a draw the player *claims* from one that arrives automatically:
  *repetition* becomes **threefold, claimed** (9.2) and **fivefold, automatic** (9.6.1);
  *fifty-move* becomes **fifty-move, claimed** (9.3) and **75-move, automatic** (9.6.2).
  With checkmate, stalemate, insufficient material and resignation that is **eight** distinct
  reasons, not six. The result screen must name which one, and a screen that says "draw by
  repetition" without saying whether anyone claimed it is under-reporting what happened in the game.

  The acceptance criterion below is left reading "any of the six terminal conditions" **deliberately
  unamended**: what it actually tests — that the reason is named explicitly and the process exits 0 —
  is unchanged and still testable, and replacing "six" with a number this epic has not yet decomposed
  would be trading a stale count for a guessed one. QE recorded the count as unsettled for a second
  reason as well (`20260731T153200Z-qe-e2e-claim-aab64fc7` §4): a draw-offer command would add a
  ninth, and this product has none today. **Settle the count at decomposition, against `ABC-020`'s
  shipped reason set.**
- Packaging: runs via `npx` with no install step and no global dependency.

## Out of scope

- Network or multiplayer play — permanent non-goal.
- Accounts, cloud sync, ratings, or a stored game history database.
- A GUI or web front end — permanent non-goal.

## Negotiable slice

Save/resume to a local file and PGN export are **negotiable**, not MVP. They are worth
building only if play-testing shows people abandon games mid-way. Cut them first if this
epic runs long.

## Acceptance (epic level)

- **Given** `npx <package>` on a machine with Node installed and nothing else, **when** it
  is run, **then** a playable game starts with no additional install step.
- **Given** a completed engine reply, **when** the player runs `undo`, **then** the position
  returns to before the player's own last move — two plies back, one command.
- **Given** any of the six terminal conditions, **when** the game ends, **then** the result
  screen names the reason explicitly and the process exits cleanly with code 0.
- **Given** `--colour black --difficulty 3`, **when** the game starts, **then** no prompts
  appear and the engine opens as white.

## Dependencies

- `EPIC-001` (terminal states, undo of position state), `EPIC-002` (the loop it wraps),
  `EPIC-003` (the command prompt it extends).

## Risks

- Undo interacts with the engine's transposition table and the book's position history;
  a shallow undo that forgets repetition history would corrupt draw detection.

## NFR triggers

- `NFR-007` Cold-start time — `npx` invocation to first rendered board in **< 2 s** with a
  warm npm cache. Architect seeds the row in `plans/nfr-catalog.md`.

## Test notes

End-to-end test that drives a scripted game from `npx` invocation to a checkmate result
screen through the real stdin/stdout interface. Undo test must assert the repetition
history is rewound too, not just the board.
