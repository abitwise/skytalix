---
id: 20260925T184000Z-software-engineer-decision-abc121-one-searchmove-per-recursion-one-predicate-pre-move-5a4b6553
kind: decision
by: software-engineer
at: 2026-09-25T18:40:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - ADR-0024
  - ADR-0025
  - src/search.ts
  - src/engine.ts
supersedes:
---

# ABC-121 build shape: one `searchMove` per recursion, one pure predicate called before the move

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). This is how `ADR-0026` was built. It
adds no architecture: every choice below sits inside decisions 1–6.

## PVS and LMR: one child-search function per recursion

- `src/search.ts` and `src/engine.ts` each gained ONE private `searchMove(...)`. It is the only
  place a child is searched, at the root and below, so the two recursions keep one shape.
- The order inside it:
  1. The first move (`index` 0), or any move with `pvs` off: the node's own window, exactly as
     before `ABC-121`.
  2. Otherwise: the null window `(alpha, alpha + 1)` at `depth - 1 - reduction`.
  3. If that fails high and `reduction > 0`: the same null window at full depth `depth - 1`. This
     is the LMR re-search.
  4. If the score is then strictly inside `(alpha, beta)`: the full window. This is PVS's
     re-search. At a null-window node no score is strictly inside, so step 4 never fires there,
     and that is why `A4` is built at such a node.
- This is the reference probe's order (`validate-adr0026/probe/lmr.ts`). The build reproduces the
  probe's drift, node ratio, depth-7 node counts and mate floor exactly (see the readings note).

## The predicate: `lateMoveReduction(position, move, depth, index, atRoot)`

- It returns 0 or 1. Callers subtract exactly that: `depth - 1 - reduction` in `search.ts`,
  `remaining - 1 - reduction` in `engine.ts`. It lives in `search.ts` and `engine.ts` imports
  it, so the engine carries no copy of the rule.
- **It is called BEFORE the move is made.** It needs the position before the move for "side to
  move in check". It plays the move and takes it back to see "gives check", so the position is
  byte-identical on return; `A3`'s table asserts that on every row. The cheap exits (root, depth,
  index, capture/promotion) come first, so `isInCheck` and the make/unmake run only for late
  quiet moves at depth ≥ 3.
- **The root calls it too, with `atRoot = true`.** The root flag then has a real caller, and
  "never at the root" is the predicate's own answer rather than a missing call site. At the root
  it always returns 0.
- `REDUCTION_MIN_DEPTH = 3` and `REDUCTION_MIN_INDEX = 3` are module constants, not exported.

## Switches and doors

- `search.ts`'s `Switches` gained `pvs` and `reductions`. `search()` has both on,
  `searchWithoutReductions` has `pvs` only, and every other door has both off (decision 3).
- `engine.ts` gained one `Heuristics { pvs, reductions }` record that `Budget` extends. The three
  entry points (`chooseMove`, `chooseMoveWithoutReductions`, `chooseMoveWithoutPvsOrReductions`)
  are one-line calls into a private `deepen(position, options, heuristics)`, which is the former
  body of `chooseMove`, unchanged. `A4`'s `for (let iteration = 2; now() < budget.deadline;
  iteration++)` is intact, and none of the three takes a depth.
- `reductions` without `pvs` is unreachable: the reduced search exists only in `searchMove`'s
  PVS branch (decision 1).

## Rejected at the keyboard

- **Passing the tactical facts into the predicate.** Rejected: `ADR-0026` decision 6 (amended)
  forbids it, and it is the `tactical` variant's hiding place.
- **Calling the predicate after `makeMove`.** Rejected: it would need the parent's in-check fact
  passed in, which is the same forbidden hiding place.
