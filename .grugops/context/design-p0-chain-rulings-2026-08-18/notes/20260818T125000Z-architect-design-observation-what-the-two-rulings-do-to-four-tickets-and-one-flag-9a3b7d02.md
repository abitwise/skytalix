---
id: 20260818T125000Z-architect-design-observation-what-the-two-rulings-do-to-four-tickets-and-one-flag-9a3b7d02
kind: observation
by: architect-design
at: 2026-08-18T12:50:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - ABC-095
  - ABC-043
  - ABC-096
  - ADR-0012
  - ADR-0013
supersedes:
---

# What the two rulings do to four tickets, and the one criterion problem I flagged instead of ruling

## Scope

Consequences only. **No board column is moved and no DoR is re-scored here** — both are other roles'.
Ticket pages were touched in their `## Dependencies` sections only, as the brief licensed.

## Per ticket

| ticket | what changes | what does NOT |
|---|---|---|
| **`ABC-078`** | **⚠️(5)'s question is answered**: the composition point is a decorator outside the seam. Its `## Dependencies` gains a RULED bullet. | **No criterion moves. `A6`'s byte-identical pin stands** and is now the criterion that protects the composition point. Its "Owner: whoever decides…" sentence is **stale prose** — refreshing it and re-scoring ⚠️(5) is **BA/PM's**. |
| **`ABC-095`** | Its "OPEN AND DELIBERATELY NOT RESOLVED" bullet is answered, and its three `EPIC-004` unknowns with it: **(a) `ABC-078`**, **(b) wrappable — YES**, **(c) spy-able — YES** (the inner seam is an argument; no module mocking). `A6` cannot fire; the `S` size holds. | **DoR re-score and closing `G3` on the board are BA/PM's.** `ADR-0012` clause 6 still flags that one of its "two or three call sites" is `ABC-043`'s composition root, which does not exist — that blocks `EPIC-005`'s **user value**, not this ticket's criteria. |
| **`ABC-043`** | Its named decision is **answered: NO**. The consequence it wrote resolves to *"a playable game waits for `EPIC-004`"*. | **No dependency changes** — the `EngineSeam` blocker was already stated — and the ticket is **not pullable** regardless: `ABC-037` is open behind `ABC-033` + `ABC-035`. |
| **`ABC-096`** | Untouched, and named so it is not a surprise: under `ADR-0012` clause 7 it **cannot** learn the opening name through the seam and must consult the probe directly. | Not ruled here; it is `ABC-096`'s design and it is `P3`. |

## The one thing I flagged instead of ruling, because it is not mine

**`ABC-043` `A5` may not be satisfiable as written.** It requires an `EngineSeam` that **throws**, and
one that returns a move `legalMoves` did not produce, asserted *"through the real entry point rather
than through a stub harness"* — while `src/cli.ts` **exports nothing** (`ADR-0011` clause 4) and `A8`
forbids any production change outside the entry point and its test file. There is no injection point
for a faulty engine. **`A2` has the same shape**: it asks for *"a deterministic opponent"* driven
through the child process.

This is a **criterion-versus-design tension and it is BA/PM's pen**, at that ticket's `Ready for Dev`
exit under this project's process rule 1. I am recording it, not answering it. **It is not an argument
for a default opponent** — `ADR-0013` clause 7 says so explicitly — and it does not become one if the
re-cut is uncomfortable.

## Risks

- **The tempting misread of ruling 2, named in advance:** *"9c does not cover it, therefore it is
  allowed."* The first half is `ADR-0013` clause 2 and it is true; the second half is exactly what
  clauses 3–5 refuse.
- **The tempting misread of ruling 1:** that `ABC-095` may now be pulled. Its other hard blockers
  (`ABC-094`, `ABC-093`, `ABC-078`) are untouched by this ruling.
