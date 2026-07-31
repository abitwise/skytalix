---
id: EPIC-003
title: Move input and controls
status: backlog
column: Backlog
priority: P0
size: M
owner: BA/PM
---

# EPIC-003 — Move input and controls

## User value

"Controls should be easy to use" — stated explicitly by the requester. A player who does
not know algebraic notation must still be able to play, and a player who does must not be
forced to type more than they need to.

## Scope

- Dual-format move parser, both always accepted, no mode switch:
  - SAN — `e4`, `Nf3`, `exd5`, `O-O`, `O-O-O`, `Qxf7#`, `e8=Q`
  - Coordinate — `e2e4`, `e7e8q`
- Case-insensitive and decoration-tolerant input (`E2E4`, `e2-e4`, `Nxf3+` without the `+`).
- Ambiguity handling: when input matches more than one legal move, list the candidates and
  re-prompt rather than guessing.
- Rejection messages that teach: name *why* the move is illegal (own king would be in
  check / no piece on that square / that piece cannot move there), never a bare "invalid".
- In-game commands: `moves` (list legal moves), `help`, `board` (redraw), `quit`, **`claim`**.
- Tab-completion of legal moves at the prompt.

**[AMENDED 2026-07-31 by BA/PM — `claim` added to the command set.]** `ABC-020` makes threefold
repetition (FIDE 9.2) and the fifty-move rule (FIDE 9.3) **claimable by the player having the move**
rather than applied automatically, which is what the Laws require and what the project owner's
standing legality-first priority of 2026-07-31 demands. A right the player cannot type is not a
right, so the verb belongs in this epic's command set — it is an in-game command at the prompt, the
category this epic already owns.

What this epic owns for it: the **grammar** (the token, its tolerance and case-insensitivity, whether
it takes an argument naming which claim, tab-completion), and the **rejection message that teaches**
when no claim is available — this epic's headline standard, applied to a command rather than to a
move. What it does **not** own: whether a claim is available (`ABC-020`), what happens to the loop
when one is made (`ABC-021`), the status-panel indicator that announces one (`ABC-016`), or the
result screen (`EPIC-006`). Cut this at decomposition; it is not a separate epic and it is small.

## Out of scope

- Arrow-key cursor board navigation — explicitly considered and declined; revisit only if
  play-testing shows the typed interface is a barrier.
- Voice, mouse, or config-file keybindings.

## Acceptance (epic level)

- **Given** the starting position, **when** the player types any of `e4`, `E4`, `e2e4`, or
  `e2-e4`, **then** the same pawn move is played.
- **Given** an input that matches two legal knight moves, **when** it is submitted, **then**
  both candidate moves are listed in SAN and the player is re-prompted; no move is applied.
- **Given** an illegal move, **when** it is submitted, **then** the message names the
  specific reason and the position is unchanged.
- **Given** the `moves` command, **when** it is run, **then** every legal move in the
  position is listed in SAN and the count matches EPIC-001's generator exactly.

## Dependencies

- `EPIC-001` — the legal move list is the parser's source of truth.

## Risks

- SAN disambiguation rules (`Nbd2` vs `N1d2`) are fiddly in both directions. Mitigated by
  round-trip testing: generate SAN from a move, parse it back, assert identity.

## NFR triggers

- `NFR-003` Input responsiveness — keystroke echo at the prompt **< 50 ms**; the `moves`
  command and tab-completion return **< 100 ms**. Architect seeds the row in
  `plans/nfr-catalog.md`.

## Test notes

Round-trip property test over perft positions: for every legal move, `parse(toSAN(move))`
must return that same move. This single test covers most of the disambiguation surface.
