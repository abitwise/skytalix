---
id: EPIC-004
title: Engine and AI opponent
status: backlog
column: Backlog
priority: P0
size: L
owner: BA/PM
---

# EPIC-004 — Engine and AI opponent

## User value

"Hard enough to be challenging" — the opponent is the product. An engine that hangs pieces
is not worth playing twice; one that takes 30 seconds a move is not worth playing once.
Target: club level, roughly 1400-1700, with weaker difficulty levels selectable below it.

## Scope

- Search: negamax with alpha-beta pruning, iterative deepening, quiescence search on
  captures, and a transposition table.
- Move ordering: MVV-LVA for captures, killer moves, hash move first. Move ordering is
  where most of the strength-per-line-of-code lives.
- Evaluation: material, piece-square tables, pawn structure (doubled/isolated/passed),
  king safety, mobility. Deliberately hand-tuned and small, not learned.
- Difficulty levels that map to a search budget plus a blunder rate, so lower levels are
  beatable by a beginner without being random.
- Time control: engine returns a move within a bounded wall-clock budget per move, using
  iterative deepening so it can always return the best move found so far.

## Out of scope

- Neural network evaluation, NNUE, or any learned component — permanent non-goal.
- UCI protocol support or driving an external engine such as Stockfish — permanent
  non-goal; this is a self-contained engine.
- Endgame tablebases — permanent non-goal.
- Strength above ~1700 — the requester's "not too complex" constraint binds here.

## Acceptance (epic level)

- **Given** the hardest difficulty, **when** the engine plays 100 games against the easiest
  difficulty, **then** it scores at least 90%.
- **Given** any position, **when** the engine is asked for a move under the default time
  budget, **then** it returns a legal move within that budget, every time.
- **Given** a position with a forced mate in 2, **when** the engine searches at default
  strength, **then** it finds the mate.
- **Given** a position where a piece hangs to a simple one-move tactic, **when** the engine
  searches at default strength, **then** it does not play the losing move.
- **Given** the same position and the same difficulty twice, **when** the engine searches,
  **then** the chosen move is reproducible under a fixed seed.

## Dependencies

- `EPIC-001` — move generation and apply/undo are the search's inner loop.

## Risks

- `RISK-002` Node/JS search throughput may cap achievable depth below what 1400-1700
  requires. Mitigate with an early timeboxed spike that measures nodes/sec before the full
  build commits to the design.
- `RISK-003` Strength is hard to *verify* without a reference opponent. Mitigate with the
  self-play ladder plus a fixed tactical-puzzle suite as a regression gate.

## NFR triggers

- `NFR-004` Move-search wall clock — the engine returns a move in **≤ 3 s** at default
  difficulty, with a **hard ceiling of 5 s** never exceeded at any difficulty.
- `NFR-005` Search throughput — target **≥ 500,000 nodes/sec** during search (slower than
  raw perft because evaluation runs). This is the leading indicator for NFR-004 and the
  primary output of the spike; until the spike reports, it is `UNKNOWN - verify`.

Architect seeds both rows in `plans/nfr-catalog.md` at design time.

## Test notes

Tactical puzzle suite (mate-in-N and win-material positions) as a strength regression gate;
a commit that drops puzzle-solve count fails the gate. Self-play ladder for relative
strength. Absolute Elo is `UNKNOWN - verify` until measured against a rated reference.
