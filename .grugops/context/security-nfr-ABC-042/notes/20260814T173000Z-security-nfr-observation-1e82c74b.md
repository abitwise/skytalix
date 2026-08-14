---
id: 20260814T173000Z-security-nfr-observation-1e82c74b
kind: observation
by: security-nfr
at: 2026-08-14T17:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/board.md
supersedes: 
---

# Evidence for the ESCALATED DoR line — is `ABC-042`'s firing threshold decidable without judgement?

**Read the first sentence before the answer.** `plans/board.md:3` records that the DoR line *"a
trigger's firing condition must be decidable without judgement"* was **ESCALATED TO THE OWNER, not
adopted**. It is therefore **not a rule I may enforce**, and **none of `ABC-042`'s block rests on
it**. The block in `…decision-eb042ead` rests entirely on ASVS **V2.2.1 [L1]** and
`security.block_on: high`. What follows is a data point offered to the owner for that escalation, and
nothing more.

## The threshold, quoted whole

> *"**Firing threshold, falsifiable:** the security half fires — and the added lines get read before
> the ticket leaves review — if the diff adds a runtime dependency, imports any Node builtin other
> than none, or touches any file under `src/` other than the two new modules and their test file(s)."*

## Clause by clause

| clause | decidable without judgement? |
|---|---|
| *"adds a runtime dependency"* | **YES.** A `dependencies` key in `package.json`. `A10` already asserts it key by key against `HEAD`. |
| *"imports any Node builtin other than none"* | **NO, as written. YES, only after a role rules.** The permitted set being empty is decidable; **the SET IT RANGES OVER is not.** "The diff" contains production modules and a test file, and the answer flips on which. It took a Security/NFR ruling (`…decision-592c0a9e`) to fix that scope. Two agents reading the same sentence in good faith reached opposite answers — the Orchestrator recorded the collision as unresolvable-on-the-letter; I resolved it, but by *applying the ticket's own measurement method from a different section*, which is judgement, not reading. |
| *"touches any file under `src/` other than the two new modules and their test file(s)"* | **YES.** `git diff --name-only`. |

## The structural observation, which matters more than the clause count

**The threshold cannot change the outcome it names.** The same section opens with:

> *"**Security: triggered, and NOT waived** — this is the first production module in the repository
> that reads `process.argv`."*

The security half is declared fired **unconditionally, three lines above**. So the threshold cannot
fire it (already fired) and cannot un-fire it (declared not waived). Its only operative content is
the clause in the dash — *"and the added lines get read before the ticket leaves review"* — which is
a **review obligation**, not a firing condition. It is well-formed and useful; it is simply not the
thing it is labelled.

## Verified, incidentally: the trigger's own premise is TRUE

*"the first production module in the repository that reads `process.argv`"* — measured at HEAD:
**zero** occurrences of `process.argv` in any of the 18 production files. The repository's existing
`ADR-0011` clause-4 entry point, `src/perft-bench.ts`, takes no arguments at all; its positions and
depths are hard-coded (`:25-48`). The claim is exact.

## The data point, stated plainly

Against the escalated line *"a trigger's firing condition must be decidable without judgement"*, this
threshold **fails on one clause of three** — and it failed in the field, not in theory: the collision
consumed an Orchestrator hop and a Security/NFR ruling before any line of `ABC-042` was written. The
cause was not vagueness in the *predicate* (`imports any Node builtin` is perfectly sharp) but an
**unstated scope for the set the predicate ranges over**. If the owner adopts the line, that is the
cheap form it should take: *a firing condition must name the file set it is measured over.* One
clause, mechanically checkable at cut time, and it would have caught this.

**Owner of the escalation: the project owner.** I am reporting, not enforcing, and `ABC-042` is not
blocked on any part of this note.
