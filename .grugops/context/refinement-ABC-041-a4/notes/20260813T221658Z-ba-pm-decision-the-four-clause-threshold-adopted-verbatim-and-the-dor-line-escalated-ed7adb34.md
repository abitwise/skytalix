---
id: 20260813T221658Z-ba-pm-decision-the-four-clause-threshold-adopted-verbatim-and-the-dor-line-escalated-ed7adb34
kind: decision
by: ba-pm
at: 2026-08-13T22:16:58Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - ABC-042
  - plans/tickets/ABC-041-render-seam-closure.md
  - agent-factory/checklists/definition-of-ready.md
  - AGENTS.md
  - 20260813T214232Z-security-nfr-claim-the-threshold-cannot-discriminate-and-here-is-the-wording-that-can-2554d421
supersedes: 
---

# Security/NFR's four-clause threshold ADOPTED VERBATIM on `ABC-041`. Two of its three homed items are done here; the third is the owner's, because the kit is read-only.

Security/NFR drafted the repair and homed it to me. **I adopted it as drafted** — four clauses, each
with its own stated subject — rather than re-deriving a fifth wording. Its sharper half is the one the
Engineer did not have: **the old predicate was already true of `main`**, so it measured the repo
rather than the change.

## Why I did not amend the draft

The defect Security named is precise: the old clause used **one subject for a property that has two
different scopes**. *"The production artifact acquires no I/O capability"* is scoped to production
code and its runtime closure; *"the blast radius stays in three named files"* is scoped to the whole
diff. Both are good clauses. Welding them onto one subject makes one of them wrong whichever subject
is chosen — which is exactly the dispute the Engineer and Security had, and neither of them was being
careless. Splitting the subject dissolves it. **A wording I improved for taste would have reopened an
adjudication that is already settled and evidenced.**

The adjudication itself I am not reopening either: the trigger **fired** on the literal construction,
and Security's argument settles it *inside the sentence* — disjunct 3 enumerates *"its test file"* as
a permitted file of "the delivered diff", so the author had already fixed that subject as all three
files. I agree, and I wrote the clause I wrote.

## What I changed about `ABC-041`'s page, and what I did not

- `## Security / NFR triggers` now carries clauses **(a)** runtime dependency, **(b)** production
  capability, **(c)** test-lane capability beyond existing precedent, **(d)** blast radius (`A10`,
  unchanged).
- I added Security's process point as the closing sentence: **on a disputed reading it fires and the
  gate resolves it.** The implementer is structurally the wrong decider of a threshold whose answer
  decides whether their own work is reviewed.
- **Applied to `ABC-041` as delivered, none of the four fires** — which is what "still discriminates"
  has to mean, and it is why this is a repair rather than a softening. It would have fired loudly on a
  runtime dep, a `process.env` read in the seam, or a spawn in the test lane.
- **`A3`'s and `A6`'s instruments were NOT deleted to keep the threshold quiet.** The Engineer said
  that would be the wrong repair and it would have been; `src/render-seam.test.ts`'s `node:fs` import
  is precedent-following (`src/san.test.ts`, `src/history-pane.nfr.test.ts`) and clause (c) says so by
  name.

## `ABC-042` — flagged, deliberately NOT edited

Security's note is right that `ABC-042` is where clause (b) stops being free: it reads argv, resolves
`random`, names `process.stdout` and **spawns**. **`src/`'s zero-production-Node-builtin invariant —
0 of 47 files today — ends there, and it should be a deliberate reviewed crossing rather than a
surprise.** That sentence is now on `ABC-041`'s clause (b) so the next reader inherits it.

**I did not edit `ABC-042`'s own trigger section.** It is not this page, it is not in flight, and this
subtask owns a blocker — expanding a blocker-clearing hop into a neighbouring ticket is how blockers
stay blocked. `ABC-042` gets its `Ready for Dev`-exit criteria review before it is pulled
(`AGENTS.md` § Process rules, rule 1) and that review reads the tree `ABC-041` will have changed,
which is the right moment. **Owed to the Orchestrator: sequence a BA/PM pass on `ABC-042`'s trigger
section before that pull.** The clause text is above and needs no re-derivation.

## The Definition-of-Ready line — ESCALATED, not written

Security recommends one line on DoR item 6: *a trigger's firing condition must be decidable without
judgement; if a delivered diff makes it arguable, it fires and the gate resolves it.* I agree with it
and **I cannot write it where it belongs.**

`agent-factory/checklists/definition-of-ready.md` is **KIT — read-only** (`AGENTS.md` § Kit vs state).
The project-level place for a rule the kit is silent on is `AGENTS.md` § Process rules, and **both
rules there were adopted by the owner**, not by an agent. So:

- The rule is **live on `ABC-041`'s page today** as the threshold's closing sentence, which is where
  it does work immediately.
- Making it a standing DoR item is **the owner's call**, and this note is the escalation. It is not
  ticketed, because "add a third owner-adopted process rule" is not work an agent hands to another
  agent.

**Not claimed:** that the line is in force beyond `ABC-041`'s page. It is not, until the owner says so.
