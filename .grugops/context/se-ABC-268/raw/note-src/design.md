# se-ABC-268 design: ADR-0061 decisions 1-5 built as written, no deviation; futilityNode / futileMove, switch `futility`, doors searchWithoutFutility / chooseMoveWithoutFutility

On `grugops/ABC-268` from `main` `ca6e8506` (src tree `f2388e40`, the probe's tree). Code commit `df984484`.

## The rule (`ADR-0061` d1, d2)
- `FUTILITY_MARGIN: readonly number[] = [0, 150, 350, 550]`, module-private in `src/search.ts`, never written after load.
- `futilityNode(position, depth, ply, alphaIn, beta): boolean`, exported, pure. False, in this order, at: `ply === 0`; `alphaIn + 1 !== beta`; `depth < 1 || depth > 3`; `alphaIn` in the mate band (`>= MATE_FLOOR` or `<= -MATE_FLOOR`); `beta` in the mate band; `isInCheck(position)`. Otherwise `evaluate(position) + FUTILITY_MARGIN[depth] <= alphaIn`. The evaluation is last, so a guarded node pays none. `MATE_FLOOR` is imported from `src/transposition.ts`.
- `futileMove(position, move, index): boolean`, exported, pure: false at `index < 1`, false for `move.captured !== EMPTY || move.promotion !== EMPTY`, else `!givesCheck(position, move)` (`ABC-206`'s non-mutating answer).

## The node (d1)
- In both `negamax` bodies, after the table probe/cutoff, the null move, `legalMoves` and `const alphaIn = alpha;`:
  `const futile = <switches|budget>.futility && futilityNode(position, <depth|remaining>, ply, alphaIn, beta);`
- First statement of the move loop: `if (futile && futileMove(position, move, index)) { index++; continue; }`. A skipped move is not made, not searched, not counted; the index still advances, so later moves' LMR index is unchanged.
- `best` / `bestMove` / the store are untouched: the node returns the best score among the moves searched (fail-soft) and stores `boundOf(best, alphaIn, beta)` as before. The first move is always searched, so `best` is always a searched score.
- The engine imports both predicates from `src/search.ts`, as it imports `nullMoveReduction`.

## Switch and doors (d3, d4, d5)
- `futility` in `Switches` (`src/search.ts`) and `Heuristics` (`src/engine.ts`); true in `search()` and `chooseMove` only, false in all 11 older search doors and 5 older engine doors. Not module state, not an `EngineOptions` field, not a `search()` parameter.
- TEST-ONLY doors `searchWithoutFutility(position, depth)` and `chooseMoveWithoutFutility(position, options)`: the shipped path with only `futility` off (null move, both quiescence switches and prior keys stay on).
- Export lists: `src/search.ts` +3 (`futileMove`, `futilityNode`, `searchWithoutFutility`), `src/engine.ts` +1 (`chooseMoveWithoutFutility`).
- Module headers in both files name the switch and the predicates.

## Read at review (d10, R-TC part 1 item 2)
The diff reads no budget, deadline, `movetime`, test flag or environment. The rule is keyed on depth, ply, the entry window, the move and the position only.
