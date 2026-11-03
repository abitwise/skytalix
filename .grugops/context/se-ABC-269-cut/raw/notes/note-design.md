# se-ABC-269-cut design: cut C1 built as ordered (decision …a0468a78). The phase is seeded once per root by `phaseOf` and carried down the recursion as a number argument, each child by `phaseAfterMove`. The tapered entry `evaluateAtPhase(position, phase)` takes it. The board walk holds no phase add and no king Δ, and the king Δ is read after the walk from the two king squares. Nothing was added to `Position`, `UndoRecord` or module state. Code commit `561fc028` on `grugops/ABC-269`

Software Engineer, task `se-ABC-269-cut`, worktree `.claude/worktrees/se-ABC-269`, on `be1aa535` (uncut src tree `b8b44ff3`). This hop took no timing reading: `G2` is QE's, under PREREG `…e36ee7ca`.

## What was built (`src/evaluate.ts`)
- **`phaseOf(position)`** is Σ `PHASE_WEIGHT[pieceType]` over the 64 squares, unclamped. It is the seed and the oracle.
- **`phaseAfterMove(phase, move)`** is `phase − PHASE_WEIGHT[move.captured & 7] + PHASE_WEIGHT[move.promotion]`. It is pure, has no branch and needs no undo. Both functions are exported, side by side.
- **`evaluateAtPhase(position, phase)`** is the one tapered entry. `evaluate(p)` is `evaluateAtPhase(p, phaseOf(p))`. `evaluateWithoutMobility` and `evaluateWithoutPawnCache` pass `phaseOf(p)`. `evaluateWithoutTaper` passes 0, which it never reads.
- **`whiteMinusBlack(…, taper, phase)`:**
  - The walk lost `let phase` / `let egDelta`, the per-piece `phase += PHASE_WEIGHT[type]` and the in-walk king Δ. The only king-branch work left is recording `whiteKing` / `blackKing`.
  - After `if (!taper) return mg;` the king Δ is `KING_EG_DELTA[(7 − rank(wK)) × 8 + file(wK)] − KING_EG_DELTA[rank(bK) × 8 + file(bK)]`, using the walk's own table index. A king square of −1 adds 0.
  - The clamp to 24 stays in the blend.

## Carrier (search / engine / quiescence)
- **`src/search.ts`:**
  - `negamax` takes a trailing `phase`, `searchMove` a trailing `childPhase` and `leafScore` a trailing `phase`.
  - In the node loop and in `searchRoot`'s loop, the child is `phaseAfterMove(phase | rootPhase, move)`.
  - The null-move child gets `phase` unchanged.
  - `searchRoot` seeds once (`const rootPhase = phaseOf(position)`). The depth-less leaf path calls `phaseOf` itself, once.
  - `futilityNode` takes `phase` as its seventh argument.
- **`src/engine.ts`:** the same, on `negamax` / `searchMove` / `leafScore` / `runIteration`. `deepen` seeds once per `chooseMove` call. The position is byte-identical between iterations, so every iteration gets the same `rootPhase`.
- **`src/quiescence.ts`:** `quiesce(…, visit, phase)`. The tapered stand pat is `evaluateAtPhase(position, phase)`, and the untapered records ignore the phase. The child gets `phaseAfterMove(phase, move)`.
- **The untapered doors** carry the phase too, as one load and two adds per made move, but never read it. That keeps one recursion shape. Their values are unchanged (P4).

## Untouched (from `git diff --stat be1aa535 561fc028`)
- `src/position.ts`, `apply.ts`, `legal.ts`, `moves.ts`, `zobrist.ts` and `evaluate-params.ts` are absent from the stat.
- QE's `src/evaluate.taper-corpus.ts` is unchanged (sha256 `05ed9e81…6e96339`, re-read after the commit).
- P5 also pins that neither `position.ts` nor `apply.ts` contains "phase".

## Choices that were mine
- Names: `phaseOf`, `phaseAfterMove`, `evaluateAtPhase`, `childPhase`, `rootPhase`.
- The P5 guard is a **source pin**, not a call counter. A counter on `phaseOf` would miss plant 3: a self-walking `evaluate(position)` calls `phaseOf` through the module-local binding, which a module spy does not see. The pin goes red on it (P5 plant 3).
