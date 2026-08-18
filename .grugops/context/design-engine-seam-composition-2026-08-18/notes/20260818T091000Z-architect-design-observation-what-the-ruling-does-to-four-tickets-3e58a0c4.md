---
id: 20260818T091000Z-architect-design-observation-what-the-ruling-does-to-four-tickets-3e58a0c4
kind: observation
by: architect-design
at: 2026-08-18T09:10:00Z
verified_by: 
confidence: high
refs:
  - ADR-0012
  - ABC-043
  - ABC-077
  - ABC-078
  - ABC-094
  - ABC-095
  - ABC-096
  - ABC-103
  - ADR-0011
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - NFR-008
supersedes: 
---

# What the ruling does to four tickets — including one blocker `ABC-095` did not know it had

## Scope

Consequences of `ADR-0012` on named tickets, measured against files read at this hop. **No ticket
page was edited and no DoR was re-scored — both are BA/PM's pen.**

## `ABC-078` `A6` — UNCHANGED. Pull the ticket.

The ruling requires **zero bytes of `src/turn-loop.ts`** and no change to any `ABC-078` criterion.
`A6`'s byte-identical pin stands exactly as written and is strengthened in role: it is now the
criterion that protects the composition point. **There is no collision to re-cut for.**

One piece of `ABC-078` **prose** is stale and is not a criterion: its `## Dependencies` bullet ends
*"Owner: whoever decides the `EPIC-005`/`EPIC-004` composition point. Flagged, not designed."* That
owner is named and the decision is taken. **Recommended for BA/PM's pen; not edited here.**

## `ABC-095` `G3` — CLOSED, plus three answered unknowns

`G3` and the question routed to this hop are **the same question**, differently framed. `G3` offered
two locations; the answer is closest to *"the caller above it"*, with the caller identified as
`ABC-043`'s composition root and the mechanism identified as a decorator module rather than an
inline call.

Three of `ABC-095`'s named sub-unknowns are now answerable:

- **(a) `EPIC-004`'s ticket id — `ABC-078`.** Read from `plans/tickets/`, not guessed.
- **(b) wrappable from outside — YES**, by construction; `EngineSeam` is a function type and
  `ABC-078` `A6` requires assignability to it.
- **(c) spy-able — YES**, and more strongly than hoped: the decorator takes the inner seam **as an
  argument**, so `A1`/`A3` pass a counting stub and need no module mocking. Test note 1's failure
  case ("called through a closure the caller cannot see") **cannot occur** under this shape.

Therefore `ABC-095`'s `S` size holds (it was conditional on a wrappable seam) and `A6` is
satisfiable rather than a stop condition.

**My reading of the DoR, offered to BA/PM and NOT applied:** item 5 clears (dependencies now known
by identity), item 10 blocker (b) is discharged and blocker (a) — `EPIC-004`'s move interface does
not exist — stands until `ABC-078` lands. That reads **8 of 10, items 3 and 10 ⚠️**. **BA/PM's call
and BA/PM's pen.**

## `ABC-043` — the blocker `ABC-095` did not know it had, and it is narrower than it looks

`ABC-095`'s scope says *"two or three call sites"*. Under this ruling one is the composition root,
and **`src/turn-loop.ts` has 0 production importers today** — `runTurnLoop` is reached only from
`src/turn-loop.test.ts`, `src/turn-loop.nfr.test.ts` and `src/render-seam.test.ts`, and `src/cli.ts`
says so in its own header.

**Measured claim: `ABC-043` blocks `EPIC-005`'s user value, not `ABC-095`'s criteria.** `A1`, `A3`
and `A6` are satisfiable by wiring the decorator in a test; `A4` and `A5` are satisfiable by driving
`runTurnLoop` directly, as `src/turn-loop.test.ts` already does. But until `ABC-043` lands, no
human's game consults the book. **Whether `ABC-095` owns the one wiring line in `src/cli.ts` or
`ABC-043` does is a boundary for BA/PM to draw; it is flagged, not drawn.**

## `ABC-103` — a real sequencing collision, measured

`src/cli.test.ts:738` asserts `productionModules()` has length **23**, over every non-`.test.ts`
file directly in `src/`. There are exactly 23 today (`ls src/*.ts | grep -v test` at this hop). This
ruling adds **at least two** production modules — `ABC-078`'s engine-seam module and `ABC-095`'s
decorator — and `ADR-0012` clause 8 places both inside that guard's flat read.

**Each one reds `src/cli.test.ts` on arrival, on an assertion unrelated to either ticket.**
`ABC-103` is already cut for exactly this defect. **Recommended sequencing: `ABC-103` before
`ABC-078`.** The sequencing call is the Orchestrator's.

## Risks

- Clause 8's "flat in `src/`" is not taste. `ADR-0011` clause 1's own amendment records that both of
  its instruments read `src/` **non-recursively**; a `src/engine/` or `src/book/` subdirectory would
  put the two newest production modules outside the reach of `NFR-002`'s frame-path guard and
  `ADR-0002` clause 4's single-supplier regex **while every existing assertion stayed green**.
- `NFR-008` is not moved by this ADR. It is moved by `ABC-103` not landing first.
