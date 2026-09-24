---
id: 20260919T073100Z-software-engineer-decision-quiescence-module-shape-7a1c3e5b
kind: decision
by: software-engineer
at: 2026-09-19T07:31:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-077
  - ABC-078
  - ABC-080
  - ADR-0002
  - ADR-0020
  - RISK-002
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - src/search.test.ts
  - src/search.qe.test.ts
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
supersedes:
---

# `ABC-079` — the shape delivered, and the four choices a reviewer should check first

## 1. One new module, `src/quiescence.ts`, and BOTH recursions call it

`quiesce(position, alpha, beta, qply, visit)` is the leaf. `src/search.ts`'s `leafScore` and
`src/engine.ts`'s `leafScore` both call it for an in-progress leaf — the engine's abortable copy of
the negamax (`ABC-078`) is held equal to `search()` by the identity sweep in `src/engine.test.ts`,
so giving one recursion quiescence and not the other would red that sweep at once. Sharing the leaf
avoids a THIRD copy of a recursion. The identity sweep is green at the branch tip.

Standard textbook shape and nothing more: stand-pat as a fail-soft lower bound, captures only
(`move.captured !== EMPTY`, so en passant and CAPTURING promotions are searched; quiet promotions are
not, per the ticket's fence), alpha-beta in `ABC-077`'s convention, generation order (ordering is
`ABC-080`'s), no checks / delta pruning / SEE (out of scope by name), no terminal detection at a
quiescence node (a node with no captures stands pat).

## 2. The cap is `QUIESCENCE_MAX_PLY = 8`, and it degrades to the OLD horizon

At the cap the node stands pat — exactly the pre-quiescence leaf. So the guard can never make a
leaf WORSE than before; it can only stop the recursion. A rig of sixteen queens on alternating
squares reaches the cap exactly (deepest 8, 7 112 nodes, ~33 ms) and the corpus sweeps never exceed
it; `A3` asserts both. It is a runaway guard and NOT a budget: nothing in the engine reads it, and
`src/engine.ts` keeps its `for (… now() < budget.deadline …)` loop byte-identical.

## 3. `visit(qply)` — one hook, three consumers, and the engine's abort lands INSIDE quiescence

`quiesce` calls `visit` once per node entered through a capture (never for the leaf itself, which
the caller already counted). `src/search.ts` passes `() => counter.nodes++`, so `SearchResult.nodes`
counts quiescence nodes — which is what makes `A5`'s multiplier a real node ratio. `src/engine.ts`
passes `budget.visit = () => countNode(budget)`, the same node-counting clock check the full-width
recursion runs, so the abort granularity (`NODES_PER_CLOCK_CHECK`) holds through a capture sequence
rather than only between full-width nodes. `quiesce` unmakes in a `finally`, so the throw leaves the
position byte-identical (`A6` has a throwing-visitor case). A test's visitor records the deepest
`qply`, which is how `A3` observes the recursion depth without a debug field on the result.

`countNode` is the ONLY refactor in `src/engine.ts`: the inline `budget.nodes++ / nextCheck /
throw ABORTED` block moved into a function so the visitor and the recursion share it. Behaviour is
byte-identical for full-width nodes.

## 4. A FOURTH export on `src/search.ts`, and `ABC-077`'s `A6` list widened by one name

`searchWithoutQuiescence(position, depth)` is the TEST-ONLY door to the pre-quiescence leaf, the
same shape as `searchWithoutPruning`. The ticket REQUIRES a baseline arm in the same test (`A1`:
"the same set is run without quiescence in the same test"; `A4`: "identical to the pre-quiescence
build"; `A5`: the multiplier's denominator), and there is no way to run the delivered negamax with
the leaf switched off without a door. Two alternatives were rejected: a third recursion copy in the
test file (a baseline that is not the shipped code proves nothing about it), and an options
parameter on `search` (breaks `A6`'s `search.length === 2` and QE-G1's shape).

**The cost, stated plainly:** `src/search.test.ts` `A6` pinned the module to EXACTLY three exports;
the list now reads four, and the `Function.length === 2` check covers the fourth. `A6`'s INTENT —
every export takes a REQUIRED depth, no clock, nothing picks a move on its own (`RISK-002`) — is
unchanged and the new export satisfies it; `src/search.qe.test.ts` `QE-G1` gained the same
depthless-call case for it. This is an edit to a merged criterion's assertion and is flagged for
the reviewer as such; `src/engine.ts`'s header treats `A6` as a wall and was NOT contradicted —
it forbids a CLOCK there, and none was added.

## Not touched, by fence

`src/zobrist.ts` (ADR-0020 is `ABC-075`'s to build), `src/turn-loop.ts`, `src/cli.ts`,
`plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`. No per-ply key array was added.
