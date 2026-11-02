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
