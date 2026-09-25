---
kind: adr
id: ADR-0026
---
# ADR-0026: PVS and LMR arrive behind test-only off doors that keep every existing oracle byte-valid; LMR is judged by a bounded oracle, not identity

## Status

**proposed**. The owner accepts it or not. Written 2026-09-25 by Architect/Design at task
`wave-2026-09-25`, subtask `ruling-abc121-lmr-oracle` (Workflow 07, a design ruling owed to
`ABC-121`'s DoR before BA/PM re-scores it).

- It builds on `ADR-0024` decision 7 and `ADR-0025` decision 6 (the test-only door precedent and
  the ladder rule) and amends neither.
- No code changes because of this ADR. `ABC-121` builds against it once `ABC-122` lands.
- The probe and its raw output are in `.grugops/context/ruling-abc121-lmr-oracle/probe/`, and
  the readings are in that task's `notes/`. They are cited here, not restated in full.

## Context

Every search heuristic this project has shipped so far changes the WORK and not the VALUE:
alpha-beta (`ABC-077`), move ordering (`ABC-080`) and the transposition table (`ABC-081`). The
suite rests on that fact in two kinds of row:

- **Identity rows.** These compare a search with a test-only door, or the engine with `search()`,
  and demand the same score:
  - `ABC-077` `A1`: pruned vs unpruned (the only window-bug detector);
  - `ABC-079` `A4`: quiescence vs bare leaf, on quiet positions;
  - `ABC-080` `A1`: ordered vs unordered;
  - `ABC-081` `A1`: table vs `searchWithoutTable`;
  - `ABC-078` `A3`: `chooseMove`'s completed iteration vs `search()`, move and score, with an
    equal-score licence on the move.
- **Work rows.** These are node ratios and exact node pins between the same pairs:
  - `ABC-077` `A2`;
  - `ABC-079` `A5`;
  - `ABC-080` `A3`/`A4`;
  - `ABC-081` `A2`/`A3`/`A5`.

`ABC-121` adds principal-variation search (PVS) and late-move reductions (LMR). Measured at this
hop with a probe that reproduces `search()` to the node: 0 mismatches in 48 cells, and it
reproduces the shipped ratio figures exactly. The corpus is 190 positions: the six roots, every
position one move away, and six endgames.

- **PVS is value-preserving.**
  - 0 of 190 score divergences at depth 3 and at depth 4, on all three identity shapes: PVS vs
    `search()`, table on vs off, and deepening vs fixed depth.
  - All five of the suite's mate rows hold.
- **PVS breaks the work rows when it is on both sides.** It saves more on the weaker side of each
  pair, so it shrinks the denominators:
  - `ABC-080` `A3`: 47.5% vs its 40.5% bar (default lane), 6.59% / 4.19% vs its 4% bar (depth 4);
  - `ABC-081` `A3`: 77.3% / 77.0% vs its 70% bar.

  With PVS on neither side, those rows read their shipped figures, to the node.
- **LMR is not value-preserving, and its value depends on move order.** Whether a move gets
  reduced depends on its index in the ordered list, and the index depends on the hash move and
  the killers. With LMR on BOTH sides:
  - deepening vs fixed depth diverges on 5/190 (depth 4) and 6/190 (depth 5);
  - table on vs off diverges on 3/190 (depth 5).

  So `ABC-078` `A3` and `ABC-081` `A1` cannot hold as identities with LMR on.
- **LMR only acts from root depth 4.** The rule is remaining depth >= 3, and the root is never
  reduced.

## Decision

1. **Two switches, `pvs` and `reductions`, in BOTH recursions.**
   - Both switches are on in `search()` and `chooseMove`.
   - `reductions` implies `pvs`, because the reduced null-window search lives inside PVS's frame.
   - A null window is a cutoff, so the unpruned doors carry neither switch.
2. **Four TEST-ONLY doors, two per recursion.**
   - **`src/search.ts`:**
     - `searchWithoutReductions`: PVS on, LMR off.
     - `searchWithoutPvsOrReductions`: both off. This is the pre-`ABC-121` `search()`, node for
       node. The name follows `searchWithoutPruningOrQuiescence`.
   - **`src/engine.ts`:**
     - `chooseMoveWithoutReductions(position, options)`: PVS on, LMR off.
     - `chooseMoveWithoutPvsOrReductions(position, options)`: both off. This is the
       pre-`ABC-121` `chooseMove`.
     - Neither takes a depth, so `ABC-078` `A4`'s rule holds. Its export list grows by these two
       names.
   - `ABC-077` `A6`'s export list grows by the two `search.ts` doors and by decision 6's
     predicate.
   - Rejected: an `EngineOptions` field or an options parameter on `search()`, because either
     becomes an engine option in production (`ADR-0024` decision 7, coding rule 7). Also
     rejected: a module-level hook, because it is global mutable state.
3. **Every door that exists before `ABC-121` turns PVS and LMR off,** so each one reproduces its
   pre-`ABC-121` self node for node. This is `ADR-0025` decision 6's ladder rule: a door removes
   its rung and every rung above it, and PVS and LMR are the top two rungs.
4. **Every existing WORK reading re-points its shipped side to the pre-`ABC-121` door of the same
   recursion** (`searchWithoutPvsOrReductions` / `chooseMoveWithoutPvsOrReductions`).
   - A work reading is a node count, a node ratio, a hit rate, or any row that compares the
     shipped path with a door.
   - This includes the rows that switch the table off through `transposition.test.ts`'s `vi.mock`
     instrument (`deepenTo`, `hitRate`).
   - It is a mechanical rename. **Not one existing bar, ratio or node pin is re-levelled or
     re-pinned.** The probe reproduces them with PVS off on both sides. With PVS on both sides,
     three of them fail (Context).
5. **The two DRIFT DETECTORS take the `…WithoutReductions` pair instead,** so PVS sits under them.
   - **`ABC-077` `A1`** (pruned vs unpruned, the only window-bug detector, score only): its
     pruned side becomes `searchWithoutReductions`.
   - **`ABC-078` `A3`** (engine vs `search()`, move and score, equal-score licence, including the
     abort row's `search()` reference): it compares `chooseMoveWithoutReductions` with
     `searchWithoutReductions`.
   - PVS keeps both identities: 0/190 at depths 3 and 4, in the fixed and deepening shapes.
6. **The reduction rule is ONE exported pure predicate in `src/search.ts`, and both recursions
   route every reduction through it.** This has `orderMoves`'s shape: it decides and picks no
   move. The rule is the scope R5 measured:
   - reduce by one ply;
   - remaining depth >= 3;
   - index >= 3, 0-based in the ordered list, which is R5's "move >= 4";
   - the move neither captures nor promotes;
   - the side to move is not in check;
   - the move does not give check;
   - never at the root.

   The rule cannot drift between the recursions. It is tested as a pure function plus a source
   assertion that both recursions call it. No production counter or hook is added.
7. **VALUE and behaviour rows on the shipped path stay where they are, with PVS and LMR on.**
   - Examples: mate found, shorter mate preferred (the depth-5 and depth-7 mate rows already
     exercise LMR), stalemate and repetition exactly 0, legal root move, position unchanged, the
     `G6` knight pair, `QE-G2`/`QE-G3`, the quiescence hanging-piece count, and the engine's
     clock, abort and budget rows. They bind the engine the player gets.
   - Where one row asserts both a literal value and a door comparison, the literal half may stay
     on the shipped path. An example is `transposition.test.ts`'s depth-10 rook ending: the
     probe reads -29 992 under every configuration.
8. **The identity chain covers what decision 4 moved off the shipped search.** The chain is:
   - `search()` ≈ `searchWithoutReductions`, bounded (decision 9);
   - `searchWithoutReductions` ≡ `searchWithoutPvsOrReductions`, a score-identity row
     `ABC-121` adds at depth 4 on the corpus;
   - `searchWithoutPvsOrReductions` ≡ every old door and the unpruned search.

   Every link is a test.
9. **With LMR on, the oracle is bounded, never identity.** It is measured at a fixed depth
   against `searchWithoutReductions`:
   - a centipawn-drift bound on the corpus;
   - a hard floor of zero mate-status flips;
   - every mate row on the shipped search green;
   - depth-in-budget.

   The numbers are `ABC-121`'s criteria, and BA/PM writes them from this hop's readings.
10. **The next value-changing heuristic follows the same pattern.** That includes `C2` null move.
    It gets a switch, a pair of doors, and joins the "off in every older door" set, and it is
    judged by a bounded oracle. It cites this ADR rather than re-deriving it.

## Alternatives

- **PVS on in every pruned door, and re-point old rows to a PVS-on door only** (one door per
  recursion, not two). This was the first draft at this hop, and it is **rejected by
  measurement**. With PVS on both sides, `ABC-080` `A3` and `ABC-081` `A3` fail their bars:
  47.5% vs 40.5%, 6.59% vs 4%, 77.3% vs 70%. Keeping it would force a re-level of merged bars
  that measure something PVS is not.
- **Keep LMR out of `search()` and put it only in the engine.** Rejected. `ABC-078` `A3` would
  then compare two algorithms, and it breaks `ABC-080`'s ruling (`…f7e66060`, R1 point 3).
- **Relax the identity rows to a tolerance.** Rejected. It blinds `ABC-077` `A1`, the only
  window-bug detector, exactly when PVS adds windows.
- **Make the reduction independent of move order.** Rejected. The hash move and the killers
  still differ between a warm and a cold table.
- **Rely on "LMR cannot fire below depth 4" and compare `search()` at depth <= 3 instead of
  adding a door.** Rejected. Every row's meaning would hang silently on one threshold constant.
- **An options parameter on `search()` / `chooseMove`.** Rejected, as in `ADR-0024` decision 7.

## Consequences

- **Every existing bar, ratio, hit rate and node pin survives unchanged.** It is re-pointed at
  a door that IS the pre-`ABC-121` search or engine. The shipped search's own node counts are
  then pinned only by `ABC-121`'s new rows. A mutant in shared code (for example, dropping the
  hash move) is still caught, because the doors run the same recursion.
- **Three exports are added to `src/search.ts`** (two doors and the predicate) **and two to
  `src/engine.ts`** (two doors). All are test-only or pure. None has a production caller, and
  none picks a move without a caller-supplied depth or budget.
- **PVS alone is not a depth lever.** It gives 0 plies: 1 640 040 / 1 452 406 cumulative nodes to
  depth 7, against a 3 s capacity of about 0.85–0.89 M. Its value is inside LMR: position-6 to
  depth 7 costs 755 013 nodes with LMR and no PVS, and 467 461 with both.
- **LMR's effect on playing strength is BOUNDED, not proven neutral.** `ABC-084` is unbuilt. The
  drift row and the mate rows are the best oracle this codebase has today.
- **Some pruned trees get BIGGER under PVS.** Position-4 at depth 4 reads 9 054 nodes base,
  12 227 with PVS and 9 581 with PVS+LMR. Any "nodes fall" row is scoped to named positions,
  never "every position".

## Rollback

- **To drop LMR:** delete the `reductions` switch, the predicate and the two
  `…WithoutReductions` doors. Point decision 5's two drift detectors back at `search()` /
  `chooseMove`. No work row changes.
- **To drop PVS too:** revert `ABC-121`. Every old row then points at a door identical to
  `search()`, so the rename can be reverted or left.
- No stored data, format or dependency depends on this ADR.
