---
id: 20260818T120000Z-orchestrator-decision-wave-scope-and-what-cannot-be-pulled-a1b2c3d4
kind: decision
by: orchestrator
at: 2026-08-18T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - ABC-037
  - ABC-043
  - ABC-033
  - ABC-035
  - plans/board.md
supersedes:
---

# The requested chain is `ABC-078` → `ABC-037` → `ABC-043`. Two of the three cannot be pulled today, and the reason is ordering, not judgement.

## What was asked

Continue with `ABC-078`, then `ABC-037`, then `ABC-043`.

## What the pages say, measured at `main` HEAD `16e9269`

- **`ABC-078`** — DoR **9/10, ⚠️x1**. The single ⚠️ is item 5, and its own page states it
  *"blocks NEITHER building NOR verifying"*: the `EPIC-004`/`EPIC-005` composition point is a
  cross-epic contract question with no owner. `EngineSeam` is merged at `src/turn-loop.ts:138`
  (re-measured, see the `ABC-078` task note) and `A6` pins `src/turn-loop.ts` byte-identical, so
  nothing in this ticket touches the contract the question is about. **PULLED, under a written
  waiver recorded below.**
- **`ABC-037`** — DoR **9/10, ⚠️x2**, and both ⚠️ are the same fact: **`ABC-033` and `ABC-035` are
  OPEN**. This module delegates its classification order to `ABC-035`'s command table and
  `ABC-033`'s dispatcher; it contains, by its own scope line, *"no grammar and no token table"*.
  There is nothing to delegate to yet. **NOT PULLED — the missing input is `ABC-033` + `ABC-035`.**
- **`ABC-043`** — DoR **7/10, ⚠️x2**. Blocker (a) is `ABC-037`, above. Blocker (b) is
  *"NO `EngineSeam` EXISTS"*. **NOT PULLED.**

## The real chain, written down so it is not rediscovered at the next hop

```
ABC-033 (DoR 10/10, pullable NOW) -> ABC-035 -> ABC-037 -> ABC-043
ABC-078 (pullable NOW) ------------------------------------^
```

Four merges stand between today and `ABC-043`, and three of them are `EPIC-003`'s. The requested
order is correct as a *sequence*; it is just longer than three tickets. `ABC-041` and `ABC-042` —
`ABC-043`'s two in-epic dependencies — are already in `Done`, so `EPIC-006` owes nothing here.

## What this wave does instead

Two heads of the chain in parallel, plus the one ruling hop that is holding the tail:

1. **`ABC-078`** — Software Engineer. Delivers the `EngineSeam` implementation, which discharges
   `ABC-043`'s blocker (b) **by construction**.
2. **`ABC-033`** — Software Engineer. DoR 10/10, zero ⚠️. Head of the `ABC-037` chain.
3. **The two open rulings** — Architect/Design. See `design-p0-chain-rulings-2026-08-18`.

`ABC-035` is NOT scheduled this wave: it is ordering-blocked on `ABC-033` and cannot run beside it.

## The written waiver for pulling `ABC-078` at 9/10

The Orchestrator's DoR gate says stop and name the missing input. The missing input is named:
**the `EPIC-004`/`EPIC-005` composition point, owner unassigned.** It is pulled anyway because

- BA/PM measured it as blocking neither build nor verification, and I re-measured the fact it rests
  on (`EngineSeam` is merged and unchanged at HEAD);
- all seven of `A1`–`A7` are executable without an answer;
- it is **routed in this same wave** to Architect/Design rather than deferred.

**The residual, named not smoothed:** if Architect/Design later rules that `EPIC-005`'s book needs
a different composition shape, `ABC-078`'s caller-side wiring may be reworked. Its module and its
seam conformance would not be. That is forward rework risk on a P0 that is blocking three other
tickets, and I am taking it deliberately.

## WIP

`In Development` goes 0 → 2 of 3. Wave width 3 of `queue.wip_limit` 3. No limit is exceeded and no
limit needed a waiver.
