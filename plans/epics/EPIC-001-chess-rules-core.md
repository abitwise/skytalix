---
id: EPIC-001
title: Chess rules core
status: done
column: Done
priority: P0
size: XL
owner: BA/PM
tickets: ABC-001, ABC-002, ABC-003, ABC-004, ABC-005, ABC-006, ABC-007
---

# EPIC-001 — Chess rules core

> **Size corrected `L` → `XL` on 2026-07-22.** The indicative `L` set at idea-to-epics time
> was wrong: decomposition came to 7 tickets totalling 22 points. Recording the correction
> rather than leaving a stale estimate. The Orchestrator's no-XL-into-dev rule applies to
> **tickets**, not epics — and this epic is already split into ABC-001..ABC-007, none of
> which is XL, so the rule is satisfied.

## User value

A player never sees an illegal move, a missed checkmate, or a phantom check. Every other
epic sits on this one: a rules bug is not a cosmetic defect, it silently invalidates the
whole game.

## Scope

- Board representation and side-to-move / castling-rights / en-passant / halfmove-clock state.
- Legal move generation for all six piece types, including the awkward cases: castling
  (kingside/queenside, blocked, through check, rights lost), en passant, pawn promotion
  (all four pieces), pinned pieces, and check evasion.
- Game-end detection: checkmate, stalemate, threefold repetition, fifty-move rule,
  insufficient material.
- FEN parse and serialize (needed by the engine, the opening book, and save/load).
- `perft` move-count verification harness.

## Out of scope

- Any search, evaluation, or move *choice* — that is EPIC-004.
- Any rendering or input parsing — EPIC-002 and EPIC-003.
- Chess variants (Chess960, atomic, etc.) — permanent non-goal.

## Acceptance (epic level)

- **Given** the standard `perft` test positions (startpos, Kiwipete, positions 3-6),
  **when** the generator runs to the published depths, **then** node counts match the
  known-correct values exactly at every depth — zero tolerance.
- **Given** any legal position, **when** the game asks for legal moves, **then** no
  returned move leaves the mover's own king in check.
- **Given** a position meeting any of the five terminal conditions, **when** the state is
  evaluated, **then** the correct terminal result is reported (win/loss/draw + reason).

## Dependencies

None. This epic unblocks all others.

## Risks

- `RISK-001` Move-generation edge cases — the classic silent killer. Mitigated by the
  perft harness being built *with* the generator, not after it.

## NFR triggers

- `NFR-001` Move generation throughput — target **≥ 1,000,000 nodes/sec** on perft, measured
  on a current-generation laptop. The engine's reachable depth is bounded by this number.
  Feasibility is confirmed by the EPIC-004 spike; until then treat the number as a target,
  not a promise. Architect seeds the row in `plans/nfr-catalog.md` at design time.

## Test notes

Perft is the acceptance test, not a nice-to-have. Property test: for every generated move,
apply-then-undo must restore a byte-identical position.
