---
id: 20260820T000500Z-ba-pm-decision-the-line-input-refusal-does-not-extend-to-a3-e1f2a3b4
kind: decision
by: ba-pm
at: 2026-08-20T00:05:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-019
  - ADR-0015
  - ADR-0013
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# The answer: **my name-refusal of `./line-input.ts` does NOT extend to `A3`.** Branch 1. It stands unchanged on `A2` and `A5`.

## The one question, answered in one line

> **Does BA/PM's name-refusal of `./line-input.ts` extend to `A3`?**

**No.** `A3` is rebuilt on a `./line-input.ts` double whose `createLineInputSeam` returns an
`InputSeam` that throws. **`G-01`'s BA/PM half closes.** The new limit — clause (N) stated as a rule,
so `ABC-044`/`ABC-045` inherit a rule and not this ticket's outcome — is a separate decision note and
is on the ticket page under `## The (N) limit`.

## Why, from my own words rather than from the ticket's need

My refusal was one sentence with two parts, and only the second part is a judgement:

> *"The rig is licensed for the ENGINE seam under `A2`/`A5` **only**. Substituting `./line-input.ts`,
> `./frame.ts` or `./turn-loop.ts` **would test the harness instead of the product**."*

The first part is a **scope limit**: the licence I granted did not reach past `A2`/`A5`, so any other
use needs a fresh decision. **This hop is that fresh decision** — not an erosion of the limit, its
intended mechanism. The second part is a **reason**, and `ADR-0015` correctly identifies it as
criterion-relative. So the honest test is not *"did I write the name"* — I did — but **does the
reason hold at `A3`.**

**It does not, and I can say exactly why for each criterion I wrote it for.**

- **`A2`'s Given stipulates the reader as REAL** — *"a piped stdin carrying a scripted mating line"*.
  A `line-input` double there makes the criterion's own Given **false**: the scripted lines are never
  parsed by the product, and what the frames are asserted against is the harness's move list. That is
  literally testing the harness instead of the product, and it is unchanged.
- **`A5`'s Given stipulates ONE constructed component — the `EngineSeam`.** The reader must sit still
  and be real while the engine faults; a second double at a second seam widens the criterion without
  the criterion saying so. Unchanged.
- **`A3`'s Given stipulates the `InputSeam` ITSELF as the constructed fault** — *"Given an
  `InputSeam` that throws"*. Its subject is `src/cli.ts`'s top-level handler,
  `src/turn-loop.ts`'s repair-and-rethrow, and the process's own exit code. **Nothing `A3` asserts is
  produced by the substituted module**: the internal-error line, the absence of the ten
  `TerminalReason` words, the absence of a result screen, and the non-zero exit are all real product
  code, driven through the real spawned entry point. The reader is `A3`'s **instrument**, and the
  criterion says so in its first four words.

**The consistency argument that settles it.** `A5`'s engine double and `A3`'s input double are the
**same act**: a constructed fault at an injected seam named by the criterion's Given, driven through
the real entry point. I already granted that act at `engine:`, on my own reasoning that *"a
constructed fault at a seam is a test double by definition"*. `input:` sits at `src/cli.ts:155`,
one line above `engine:` at `:156`, in the same `runTurnLoop({ … })` bag — **verified by me at this
hop, not taken on report.** Refusing the identical act at the adjacent line, for a criterion whose
Given names that very seam, would make my own licence incoherent: a criterion could not be tested at
the seam its Given names. **I decline to hold a position I cannot state a reason for.**

## What this is NOT, stated so it cannot be read wider

- **Not a lifting of the name generally.** `./line-input.ts` is admissible as **`A3`'s constructed
  fault** and nowhere else. On `A2` and `A5` the refusal is byte-unchanged.
- **Not a module allow-list, in either direction.** (N) is applied per criterion; see the rule note.
- **Not a widening of `ADR-0015`.** Clauses (S) and (C) are Architect/Design's, are untouched, and I
  applied neither. Clause 2 (a criterion needing a fault no seam can construct is re-scoped, never a
  licence to widen) is untouched and unused — `A3` does **not** need it, because a seam **does**
  construct its fault.
- **Not a ratification of anything on `main`.** See below.

## I checked myself against the merge pressure, and here is the check

The brief told me `ABC-043`'s code is already on `main` and told me not to be pushed by it. **The
answer is unchanged by that fact, and there is a mechanical way to see that rather than my assurance:
my answer REFUSES the rig that shipped.** Under (N1) the `parserBug` child that substitutes
`./command-input.ts` is out — `A3`'s Given stipulates the `InputSeam`, not the parser — so it is
refused by my clause independently of `ADR-0015`'s (S). **Branch 1 requires the engineer to DELETE
what is on `main` and build something else.** It is not the path of least resistance for the merged
tree; it ratifies no merged line. Had "already merged" been steering me, the answer that served it
was alternative A of `ADR-0015` — treat my three names as an exhaustive deny-list and keep the
shipped child. **That answer is wrong and I refuse it here as well**, for the reason QE gave: a fence
walked around by going one import deeper is not a fence.

`ABC-043` remains `In Review` and unaccepted. **I moved no board column and re-scored nothing.**

## What follows, and none of it is mine

- **The `parserBug` child comes out of `src/cli.test.ts`; the `line-input` throwing-seam child goes
  in.** Test-file only, **one spawn** — `N8-SPAWN`'s pin of 17 does not move — and no `src/`
  production line. **The implementation is the engineer's; I wrote no line of it and named only the
  shape.**
- `A3`'s criterion text is **unchanged**. Nothing was re-scoped, and no ticket was cut.
- **The honest cost `ADR-0015` recorded stands and I am not softening it**: with the fault
  constructed at the seam, `src/line-input.ts`'s own body — the layer `ABC-019` `[D31]`'s *"a parser
  bug"* narrative was about — is exercised by no criterion on this page. That is a real uncovered
  layer. **I am not cutting a ticket for it here** (out of brief); it is named in this task's
  observation note for the Orchestrator to route.
