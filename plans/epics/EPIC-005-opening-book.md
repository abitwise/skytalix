---
id: EPIC-005
title: Opening book
status: backlog
column: Backlog
priority: P1
size: S
owner: BA/PM
---

# EPIC-005 — Opening book

## User value

Without a book, a search-only engine plays the same odd first moves every game and burns
its whole time budget on positions that chess theory settled a century ago. With one, the
opponent plays real lines — Ruy Lopez, Italian, Sicilian, Queen's Gambit — the early game
is instant, and games vary between sessions.

This is the requester's "take strategies and openings from internet", resolved as: research
real opening theory now, compile it into a static file, ship it. No runtime network.

## Scope

- Research and select opening lines from a legally clean, attributable source; record the
  source and its licence in the epic's first ticket before any data is copied.
- Compile the selected lines into a compact static book file keyed by position, checked
  into the repo as a build artifact.
- Book probe: on the engine's turn, if the current position is in the book, play a book
  move (weighted random among the book's moves for that position) and skip the search.
- Graceful exit from book: when the position leaves the book, fall through to EPIC-004's
  search with no discontinuity visible to the player.
- Display which named opening is being played, when known.

## Out of scope

- Runtime queries to Lichess, ChessDB, or any other online explorer — explicitly considered
  and declined. The game must work with no network, always.
- Book *learning* from played games.
- Deep book coverage. Roughly 8-10 plies of mainline theory is the target; this is a
  variety-and-speed feature, not a theory database.

## Acceptance (epic level)

- **Given** the starting position, **when** the engine moves, **then** the move comes from
  the book and is returned in well under the search time budget.
- **Given** ten fresh games where the human plays `e4` each time, **when** the engine
  responds, **then** at least three distinct book replies appear across the ten games.
- **Given** a position outside the book, **when** the engine moves, **then** it searches
  normally and nothing in the output indicates an error.
- **Given** the book file is missing or corrupt, **when** the game starts, **then** it plays
  on using search alone and warns once — it never crashes.

## Dependencies

- `EPIC-001` — book keys are positions; needs FEN/position hashing.
- `EPIC-004` — the book is a short-circuit in front of the search.

## Risks

- `RISK-004` Source licensing — opening data must come from a source whose licence permits
  redistribution. Resolve this *before* copying any data, not after.

## NFR triggers

- `NFR-006` Book file size — the compiled book stays **≤ 1 MB** so it does not bloat the
  published package. Architect seeds the row in `plans/nfr-catalog.md`.

## Test notes

Assert every move in the compiled book is legal in its keyed position — a corrupt book
entry would otherwise surface as a crash mid-game. Assert book lookup is deterministic
under a fixed seed.
