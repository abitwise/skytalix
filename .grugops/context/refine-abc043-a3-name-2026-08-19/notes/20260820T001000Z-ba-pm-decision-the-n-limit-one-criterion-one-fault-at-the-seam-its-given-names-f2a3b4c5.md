---
id: 20260820T001000Z-ba-pm-decision-the-n-limit-one-criterion-one-fault-at-the-seam-its-given-names-f2a3b4c5
kind: decision
by: ba-pm
at: 2026-08-20T00:10:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-044
  - ABC-045
  - ADR-0015
supersedes:
---

# The NEW LIMIT, so `ABC-044`/`ABC-045` inherit a RULE and not this ticket's outcome: **one criterion, one constructed fault, at the seam its Given stipulates.**

The authoritative statement is on the ticket page under `## The (N) limit — one criterion, one
constructed fault, at the seam its Given names`, per this project's process rule 2. This note carries
the reasoning and the refusals.

## The rule

A double substituted into a spawned child, **having already passed `ADR-0015` (S) and (C)**, is
admissible only if **all three** hold. (S)/(C) is a structural filter and Architect/Design's; (N) is
mine and applies **afterwards, per criterion**.

- **(N1) SEAM THE GIVEN STIPULATES.** The double stands at the component the criterion's own **Given**
  stipulates as **constructed** — `A3`'s *"an `InputSeam` that throws"*, `A5`'s *"an `EngineSeam` that
  throws"*. A Given that stipulates no constructed component licenses **no** substitution; that
  criterion comes back to BA/PM rather than to a hook.
- **(N2) GIVEN ONLY — never the When, never a Then.** Every observable the criterion asserts must be
  produced by product code that was **not** substituted. **A component the Given stipulates as REAL
  may never be doubled** — that is the sharpest form of *"testing the harness instead of the
  product"*, and it is what my `A2` refusal always was.
- **(N3) ONE CRITERION, ONE SEAM.** A second double, at a seam the Given does not stipulate, is
  refused even when it passes (S) and (C). It is a fixture quietly widening the criterion, and it is
  what my `A5` refusal always was.

**(N) is criterion-relative. A module refused under one criterion is not thereby refused under
another; a module admitted under one is not thereby admitted generally. There is no module list, in
either direction** — that is the misread to refuse in advance, and it is the same misread I flagged
at the original licence (*"BA/PM licensed module substitution, so mock anything"*).

## Why this is the rule my three names were examples of, and not a rule convenient to this hop

The same test that gives `A3` a yes gives **four** noes, three of them mine already:

| criterion + double | fails | verdict |
|---|---|---|
| `A2` + `./line-input.ts` | **(N2)** — `A2`'s Given stipulates a **real** piped stdin carrying the scripted line | refused, unchanged |
| `A5` + `./line-input.ts` beside the engine double | **(N3)** — second seam, unstipulated | refused, unchanged |
| any criterion + `./turn-loop.ts` | **(N2)** — it is the subject; it produces every asserted observable | refused, unchanged (and now also `ADR-0015` (S)) |
| `A3` + `./command-input.ts`, the rig that SHIPPED | **(N1)** — `A3`'s Given stipulates the `InputSeam`, not the parser | **refused by (N) as well as by (S)** |
| `A5` + `./engine.ts` | — | admissible: the original grant, reproduced |
| **`A3` + `./line-input.ts`** | — | **admissible: the name lifted, for `A3` only** |

**Three of my original names and both of my original grants come out of (N1)–(N3) mechanically, and
so does a refusal of the shipped instrument.** That is the evidence it is a generalisation of the
licence rather than an invention that unblocks a ticket — the same standard `ADR-0015` held itself to
for clause (S), applied to my half.

`./frame.ts` is absent from that table on purpose: it never reaches (N), because `ADR-0015` (S)
disposes of it first. **(N) is only ever asked of a double that already passed (S) and (C).**

## How `ABC-044`/`ABC-045` are to use it

The question is never *"is this module on a list"*. It is two readings of the criterion, both cheap:

1. **Does my Given stipulate this component as CONSTRUCTED?** If not, stop.
2. **Is everything my Then asserts produced by something I did NOT replace?** If not, stop.

Where either answer is no, **`ADR-0015` clause 2 already rules and I do not amend it**: re-scope the
criterion, or move it to an opt-in lane — with BA/PM, and with the owner where the product's promise
moves. **Never widen the fence at the point of need.** A widening bought to unblock a ticket is a
precedent, and the next ticket inherits the precedent and none of the reasoning.

**One thing (N) deliberately does NOT do**: it does not make a criterion testable by being written
cleverly. A Given can stipulate a constructed component only where the composition really has a seam
there — that is (S), it is Architect/Design's, and it is checked first. **(N) can only ever narrow
what (S) and (C) admit. It cannot widen it, and this note is not a route around a structural
refusal.**
