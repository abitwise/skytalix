# se-ABC-283 design: the O1h + O3s + S1 bundle is built on one branch, each part exactly as its ADR's decision list, behind its own switch and door, with one all-off door. Every older door turns all three off.

Ruling `orch-2026-10-30a` `…4c4cb03d` (the owner's word, 2026-11-04). Brief `se-ABC-283`. Branch `grugops/ABC-283` from `main` `09694a4e`.

## What was built

- **History (`ADR-0063` d1-d6), in `src/search.ts`, used by both recursions.**
  - One module-scope `Int32Array(2 × 64 × 64)` = 32 768 B, indexed by mover colour × from × to on 0-63 squares.
  - **Update** (`recordHistoryCutoff`): at a main-tree beta cutoff, with `history` on, in both `negamax` bodies, by a QUIET cutter only. The cutter gets +d² and each earlier quiet move that was searched gets −d². Gravity is h ← h + b − trunc(h·|b|/16 384).
  - A futility-skipped move gets no malus. The update asks `futileMove` again on the restored position, so the node keeps no per-node list and allocates nothing.
  - Nothing is updated in quiescence, at the root, or on a null-move cutoff.
  - **Lifetime:** `clearHistory()` runs at `searchRoot` entry (beside `clearTable`) and at `deepen` entry, only when the switch is on. The table is kept across `chooseMove`'s iterations.
  - **Order:** quiet moves are keyed by their cell, below the killers (killers move from 1/2 to 500 000 + rank). The root uses the same comparator.
- **SEE ordering (`ADR-0065` d2-d4, S1m), in `src/search.ts`, reusing `src/see.ts`'s `see` from ABC-279.**
  - **Losing for ordering** (`losingForOrdering`): the capture does not promote, the mover is not the king, the victim is a lesser piece type, and `see < −50`.
  - The "lesser" test compares `pieceType` (P < N < B < R < Q is `see`'s value order), so SEE runs only when victim < attacker, as in ADR-0065 d2.
  - Q1's `isLosingCapture` (threshold 0) and quiescence are unchanged.
  - Losing captures key at 100 000 + MVV-LVA. That is below the killers (500 000+) and above every history cell (|h| < 16 384). The hash move still comes first.
  - `orderMoves(moves, killers, hashMove, seePosition = null, history = false)`. Every full-width call site passes `position` only when `seeOrdering` is on: search.ts `ordered()` at negamax and root, and engine.ts negamax and root.
- **Aspiration (`ADR-0066` d1-d7, A100), in `src/engine.ts` only.**
  - `runIteration` takes `(alphaIn, betaIn)`. It breaks the root loop on `best >= betaIn` and stores `BOUND_LOWER` with that move. A fail low (`best <= alphaIn`) stores nothing.
  - `aspirate` runs from iteration 5 with the window (prev ± 100). It takes the full window when |prev| ≥ `MATE_FLOOR`. On a fail, δ doubles and only the failed side moves, to score ∓ δ, or to ±∞ once δ > 400 or the bound reaches ±`MATE_FLOOR`.
  - No new clock read: an abort in any pass throws to `deepen`, as before. `search()` has no aspiration.
- **Switches:** `history` and `seeOrdering` are in `Switches` and `Heuristics`; `aspiration` is in `Heuristics` only.
- **Doors** (each is the shipped path with ONE part off):
  - `searchWithoutHistory`, `searchWithoutSeeOrdering`;
  - `chooseMoveWithoutHistory`, `chooseMoveWithoutSeeOrdering`, `chooseMoveWithoutAspiration`;
  - **all-off:** `searchWithoutBundle` and `chooseMoveWithoutBundle`.
  - Every older door (14 in search.ts, 8 in engine.ts) turns all three off, by the ADR-0026 d10 ladder.

## Decisions taken where the three ADRs did not meet (each recorded, none tuned)

1. **The tiers when both orderings are on.** ADR-0063 d4 keys the quiet moves by history. ADR-0065 d3 puts losing captures "after the killers, before every other quiet move". Taken literally together: hash > good captures > killers > losing captures > history-ordered quiets.
   - With either switch off, the relative order is that ADR's alone, exactly.
   - With both off, it is main's (P0 below).
2. **Export count.** ADR-0063 d6 listed +3 on search.ts (door, `historyByteLength`, `historyScore`). The engine's recursion needs the shared clear and update, so `clearHistory` and `recordHistoryCutoff` are exported too, like `lateMoveReduction` and `futileMove`. search.ts grows by 7 (3 doors + 4 history pieces) and engine.ts by 4 doors.
3. **`orderMoves`' two new parameters default off.** Existing three-argument calls in tests are then the pre-ticket comparator unchanged. ADR-0065 d4 wrote the parameter as required; making it optional keeps 13 test call sites untouched.
4. **No per-node "tried quiets" list.** The probe's `hhTried: Move[]` allocated one per node. The build recomputes from the ordered list at the cutoff (ABC-240's no-allocation rule). The result is the same set: searched quiet moves before the cutter.
5. **Door names.** `…WithoutBundle` names the all-off door the brief asks for ("one door that turns all three off").
