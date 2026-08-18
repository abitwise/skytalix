---
id: 20260818T161500Z-ba-pm-claim-the-epic-005-epic-004-composition-point-needs-an-owner-c7f30a5b
kind: claim
by: ba-pm
at: 2026-08-18T16:15:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-078
  - EPIC-004
  - EPIC-005
  - src/turn-loop.ts
  - plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
supersedes: 
---

**The one open question this hop produces, stated precisely enough to route and NOT answered here.**
`ABC-078`'s DoR item 5 stays ⚠️ because of it. BA/PM does not resolve a cross-epic contract and
**invents no owner**; the confidence on this note is `UNKNOWN - verify` because the answer is
genuinely undecided, not because the question is soft.

**The question, in one sentence.** *When `EPIC-005`'s opening book and `EPIC-004`'s search both want
to answer "what move do I play in this position", which of them owns `EngineSeam`, and does the
composition happen behind the seam or in front of it?*

**The three shapes it could take, surfaced rather than picked** (coding rule 2):

1. **Book wraps engine, behind the merged seam.** `EngineSeam` is unchanged; the book is a decorator
   that consults itself first and delegates on a miss. Costs `EPIC-004` nothing.
2. **Book precedes engine, in front of the seam.** The caller (`runTurnLoop`, or something above it)
   asks the book, then the engine. `EngineSeam` is unchanged but `src/turn-loop.ts` is not — and
   `ABC-078` `A6` pins that file byte-identical, so this shape puts the change on a **merged** file
   and needs its own ticket.
3. **The seam itself grows** — a "skip the book" flag, a composition parameter, or a richer return.
   **This is a contract change on a merged type** and is the expensive one.

**Why it does not gate `ABC-078`, and I am explicit about this so nobody uses it to hold the
ticket.** `ABC-078` builds against `EngineSeam` exactly as merged (`src/turn-loop.ts:138`, read at
HEAD `7ea9e1b`), and `A6` requires `src/turn-loop.ts` byte-identical on delivery. Every one of
`A1`–`A7` is measurable without an answer to the question. **It blocks neither BUILDING nor
VERIFYING.** What it carries is **forward rework risk**: under shape 3, work delivered by `ABC-078`
would need revisiting. It is kept as ⚠️ so it stays visible and routable rather than being smoothed
to ✅ and forgotten.

**Who I think should be asked, without assigning it.** It is a decision about a seam between two
epics on a merged type, which is Architect/Design's shape of work, and `ADR-0003` / `ADR-0004` are
where decisions of this kind on this project have been recorded. **`EPIC-005` has not been
decomposed**, so the question can equally be answered at that decomposition rather than now.
**Routing is the Orchestrator's; naming the owner is not mine.**

**What would make it moot.** If `EPIC-005`'s decomposition lands on shape 1, nothing changes and
`ABC-078` item 5 can be re-scored ✅ at that point on a measurement rather than an opinion.
