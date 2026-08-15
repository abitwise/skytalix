---
id: 20260815T134000Z-agents-md-scribe-decision-agents-md-now-carries-the-three-grants-as-pointers-c8ac4362
kind: decision
by: agents-md-scribe
at: 2026-08-15T13:40:00Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - memory-bank/60-progress.md
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - .grugops/context/owner-grants-2026-08-15/notes/
  - production_requires_human_confirmation
supersedes: 
---

# Decision — `AGENTS.md` carries the 2026-08-15 grants as POINTERS, and one sentence is written so it cannot be misread in either direction

**No stamp is claimed.** `context.human_admission` is `off` and `scripts/context-io.ts` is absent on
this install, so this is a hand-authored `decision`. No `finding` was written and no `verified_by`
was invented.

## The rule I applied to every edit

`AGENTS.md` already carries the precedence-pointer pattern twice (branching model, deployment
posture). **The owner's words, the coverage figures and `ADR-0007`'s clauses were NOT copied in.**
Each edit names the section that holds the authority and stops. This file has a standing problem with
growing copies that drift; a third copy of a quote would be the drift, not the fix.

## What changed, and why each change was owed

**1. `## Safety rules` — "Never deploy." is gone; the bullet now states BOTH halves of the grant.**
The old sentence was no longer what the owner has said. The new bullet leads with *deploy is allowed,
and there is nothing to deploy*, then closes the two misreadings by name — **not "deploy freely",
not "the old prohibition stands"**. The stopping fact is deliberately the ABSENCE of a deploy
surface (no artifact, no target, no release machinery, `EPIC-006` the trigger), **not** a prohibition
that no longer exists — because a role under pressure that discovers the prohibition is gone must
still find the true reason nothing gets deployed today, and that reason is factual and checkable.

**2. `## Deployment posture` — the posture is untouched; only the key-holder moved.** A new paragraph
says *who holds the deploy key changed on 2026-08-15, and where anything runs did not*, records that
both halves came from the owner in one breath, and points at the memory-bank section for the words.
`ADR-0007` stays named as the authority **on the posture** and is explicitly flagged as
Architect/Design's to amend — I did not edit it, did not restate it, and did not wait for it.

**3. `production_requires_human_confirmation` — REAL STATE RECORDED, no argument made.** The file now
says the flag is still `true`, that the grant deliberately did not flip it, and that `ADR-0007`
carries a detection row for it being found `false` **or argued obsolete**. I did not argue it
obsolete and I did not spell out the row's text — naming its existence is a pointer; quoting it would
be the copy this task forbids. **Not flipping a flag is also a decision, and it is recorded here as
one.**

**4. `## Branching model` — one limit RETIRED, two STAND, stated in place.** The section still claimed
*"Three limits did not move: deploy is NOT included…"*, which is now false in its first third and
true in its other two. It would have been cheaper to delete the sentence; that would have destroyed
the fact that a limit was retired **by a later grant** rather than never having existed. The
retirement is now visible, dated, and pointed at the section that carries it.

**5. NEW `## Test and UAT authority` — because the file had no UAT line at all.** Short section: tests
and UAT are the agent's per ticket, same two limits (gate binds, authority is the owner's and
revocable), and the distinction that had to survive the trip — **an agent-run UAT executes the
scenarios against a real build and reports the result; it is NOT a named human's acceptance
signature**, and on this install it cannot be stamped, so it is recorded as `decision` /
`observation` like everything else. One line of context earns its place: every ticket to date
deferred UAT to `EPIC-006` because nothing was exercisable, and `npm run chess` ended that reason —
a role arriving cold otherwise reads 28 tickets saying "UAT deferred" and concludes it still cannot.

**6. `### Test` — the coverage slot is filled with two commands I RAN myself** (see the sibling
`observation` note). The figures and the denominator question stayed in
`.grugops/context/owner-grants-2026-08-15/notes/`, where the subtask put them.

## What I deliberately did NOT do

- **No config value changed.** Not the flag, not `autonomy`, not `mandatory_gates`. `coverage` was
  NOT added to `quality.mandatory_gates` — recording a command is not adopting a bar, and the bar's
  denominator is undecided.
- **`ADR-0007`, `memory-bank/60-progress.md`, `plans/`, `src/`: zero bytes.** Cited only.
- **`plans/traceability.md` was NOT appended to**, and that is a conflict I resolved rather than
  ignored — see the sibling `observation` note; the subtask's hard limit is authoritative over the
  role file's standing trace duty, and the row is now owed by whoever merges this.
- **Nothing merged, nothing deployed** — including under the new grant. The grant makes deploy
  *permitted*; it does not make a deploy *this hop's work*, and there is nothing to deploy.
- **No line was removed to "pay" for the added ones.** The role's remove-as-much-as-you-add rule was
  applied by trimming my own additions twice, not by deleting somebody else's true sentence to make
  room. `AGENTS.md` is 20.6 KiB of the 32 KiB cap.
