---
id: 20261102T010954Z-software-engineer-decision-1fad1ebe
kind: decision
by: software-engineer
at: 2026-11-02T01:09:54Z
verified_by: 
confidence: high: as committed in 358b5f4a; ADR-0059 d1-d5 as written, one allowed helper
refs:
  - se-ABC-264
  - ABC-264
  - ADR-0059
  - ADR-0050
  - ADR-0026
  - ADR-0028
  - ADR-0056
  - EPIC-011
  - ABC-229
  - ABC-086
  - ABC-249
  - NFR-005
  - NFR-008
  - grugops/ABC-264
  - 358b5f4a
  - 0b73f51d
  - arch-ABC-264/20261102T003352Z-architect-design-observation-1e9c2549
supersedes: 
seal: sha256:5973f3776f8a19c0a41dc4047f880cac4a562429a3c72a46d76c2a36dbf49353
---

# se-ABC-264 design: ADR-0059 decisions 1-5 built as written, no deviation; one shared zugzwang-guard helper

On `grugops/ABC-264` from `main` `0b73f51d` (code commit: see the artifacts note).

## The rule (`ADR-0059` d1, d2)
- `reverseFutilityCut(position, depth, ply, beta): boolean`, exported from `src/search.ts`, pure.
- It returns false, in this order, at: ply 0; depth above 3; `beta >= MATE_FLOOR` or `beta <= -MATE_FLOOR` (`MATE_FLOOR` imported from `src/transposition.ts`); `isInCheck(position)`; fewer than three non-pawn pieces for the side to move.
- Otherwise it returns `evaluate(position) - 120 * depth >= beta`. The evaluation comes last, so a guarded node pays none.
- The static score is not tested against the mate band (d2: a static evaluation is under 10 000).
- **The helper `ADR-0059` d2 allows:** the zugzwang loop moved out of `nullMoveReduction` into the private `passesZugzwangGuard(position)`. Both predicates call it. The count (3, `NULL_MOVE_MIN_PIECES`) and the early stop at the third piece are unchanged. `nullMoveReduction`'s table rows and the cross-build door identity (A1) show its behaviour did not move.

## The node (d1)
- In both `negamax` bodies, after the repetition checks, the leaf/capacity guard and the table probe/cutoff, and before the null move:
  `if (<switch>.reverseFutility && alpha + 1 === beta && reverseFutilityCut(position, <depth|remaining>, ply, beta)) return beta;`
- The cut returns beta, never the static score, and stores nothing.
- The engine imports the predicate from `src/search.ts`, as it imports `nullMoveReduction`.

## Switch and doors (d3, d4, d5)
- `reverseFutility` in `Switches` (`src/search.ts`) and `Heuristics` (`src/engine.ts`). It is true in `search()` and `chooseMove` only, and false in every older door.
- The TEST-ONLY doors are `searchWithoutReverseFutility(position, depth)` and `chooseMoveWithoutReverseFutility(position, options)`. Each is the shipped path with only `reverseFutility` off (null move, evasions, quiet promotions and prior keys stay on).
- Export lists: `src/search.ts` +2 (door, predicate) and `src/engine.ts` +1 (door), three in all.
- Module headers name the switch.

## Read at review (d10, R-TC part 1 item 2)
The diff reads no budget, deadline, `movetime` or environment. The rule is keyed on depth, ply, beta and the position only.
