---
id: 20261102T003352Z-architect-design-decision-b48c5a3e
kind: decision
by: architect-design
at: 2026-11-02T00:33:52Z
verified_by: 
confidence: high on the measured choices (margin, guard, return, order, PV); the Elo value stays an estimate until C2' reads it; acceptance is the owner's
refs:
  - arch-ABC-264
  - grugops/arch-ABC-264
  - ecc0331f
  - ABC-264
  - EPIC-011
  - ADR-0059
  - ADR-0056
  - ADR-0050
  - ADR-0058
  - ADR-0026
  - ADR-0025
  - ADR-0034
  - ABC-077
  - ABC-078
  - ABC-249
  - ABC-255
  - ABC-239
  - NFR-005
  - NFR-004
  - NFR-008
  - NFR-009
  - bapm-phase1-pause/20261102T001344Z-ba-pm-decision-425d9834
  - arch-phase1-replan/20261102T000240Z-architect-design-decision-64e95bfa
supersedes: 
seal: sha256:ddb66316d0b90a90bb2a1bf3ba4cfdbed445f725cb76352951ffb2b9db1ddd05
---

# ADR-0059 (PROPOSED): reverse futility in both recursions at null-window nodes, remaining depth 1-3, margin 120 cp a ply, returns beta and stores nothing; guards root / |beta| >= MATE_FLOOR / in check / fewer than three non-pawn pieces; A4 replaced by <= 0.75x in both recursions; A3 gains a 160 cp cap; ABC-264 DoR 10/10 on reading (b)

Authoritative: memory-bank/50-decisions/ADR-0059-*.md on grugops/arch-ABC-264.

## The rule
- Order in negamax (both): repetition (and pre-root repetition in engine.ts), leaf/capacity, table probe, THEN reverse futility, THEN null move, then moves.
- Fires only if switch reverseFutility on, alpha + 1 === beta, and reverseFutilityCut(position, depth, ply, beta) (exported pure predicate in src/search.ts, engine imports it). False when ply 0; depth > 3; beta >= MATE_FLOOR or <= -MATE_FLOOR; in check; side to move has < 3 non-pawn pieces (ADR-0050 d6's count). Else evaluate(position) - 120 * depth >= beta.
- Static-score mate clause: vacuous (static eval < 10 000, asserted in transposition.test.ts); A2's row met by that relation plus the beta row.
- Doors: searchWithoutReverseFutility(position, depth), chooseMoveWithoutReverseFutility(position, options); every older door off; re-point / re-pin per ADR-0050 d4 and ADR-0058 d5.
- Export lists: ABC-077 A6 +2 (door, predicate), ABC-078 A4 +1 (door): three names in all.

## Bars
- A3: d5 on the 190 both recursions >= 95 % within 25 cp, none beyond 160 cp (floor(1.5 x 107)), 0 mate sign changes; 287 mate floor same sign (distance reported); ADR-0050 d9's seven rows played at 9/11/12/8/8/8/8.
- A4 replaced: depth 8, kiwipete and position-6, search() AND chooseMove, nodes <= 0.75x the door (measured 0.5901 / 0.6373 / 0.6173 / 0.6282), plus G6 >= base. Expected head counts to the node: 658 971 / 1 021 190 / 972 596 / 299 183; a different count is explained before A4 is read (instrument check, not a bar).
- Falsifiers F1-F7 (ADR-0059 table). F1 first fallback: 150 cp a ply by dated amendment (owner's).

## ABC-264 DoR
- Row 10 (no major blocker: the ADR) now met: ADR written, PROPOSED; build may start (reading (b)); the read and the merge wait on the owner.
- Row 4 (testable acceptance; A4 confirmed by the ADR) and row 6 (NFR targets) met with the replacement figures.
- So 10/10 on reading (b), once BA/PM applies the page deltas: A1 export count three names; A2 static-score row by argument; A3 160 cp cap and zugzwang depths; A4 0.75x both recursions. Board move to Ready is the Orchestrator's.

## Scope
ADR-0059 (new) and two dated ADR-0056 lines. No src/, plans/, board.

## Risks
- A missing mate-band guard passes every oracle row (planted); only the predicate's table catches it.
- Owner acceptance of ADR-0059 gates A6 and the merge.
- Margin re-read when E1/E2 land.
