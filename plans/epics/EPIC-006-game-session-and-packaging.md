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
