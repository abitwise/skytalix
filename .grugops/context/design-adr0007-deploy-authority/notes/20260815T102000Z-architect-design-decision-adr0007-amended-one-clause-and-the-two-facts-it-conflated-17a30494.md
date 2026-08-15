---
id: 20260815T102000Z-architect-design-decision-adr0007-amended-one-clause-and-the-two-facts-it-conflated-17a30494
kind: decision
by: architect-design
at: 2026-08-15T10:20:00Z
verified_by: 
confidence: high
refs:
  - ADR-0007
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - memory-bank/60-progress.md
  - owner-grants-2026-08-15
  - EPIC-006
  - production_requires_human_confirmation
supersedes: 
---

# `ADR-0007` AMENDED — clause 4's deploy-authority half-sentence is struck, the posture is untouched, and the two facts the file conflated are now separated

> **Hand-authored `decision`.** No `kind: finding` is admissible on this install and no `§14-gate#<id>`
> stamp is emittable; nothing here claims one. `verified_by` is empty because this kind does not carry
> one, not because a stamp was skipped.

## The ruling

> **`ADR-0007` clause 4 bullet 3's *"a human holds deploy"* is STRUCK; *"merge approval is still not
> deploy approval"* is KEPT; the branching-model deploy limit that bullet confirmed is marked
> RETIRED; and one amendment block separates CAPABILITY (nothing to deploy) from PERMISSION (an agent
> may deploy). The posture, both config keys, the flag, clauses 1/2/3/5/6, `D1`–`D6` and the
> Alternatives section are UNCHANGED. Status stays `accepted`.**

Four hunks in one file, `169 +/7 -`. **Zero bytes under `src/`. `plans/` not opened. `AGENTS.md` not
opened** (the Scribe holds it in parallel). `.grugops/factory.config.json` byte-identical —
`git diff --stat` on it is empty.

## The authority, cited and not restated

`memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test
and UAT are the agent's, per ticket. 2026-08-15" holds the owner's verbatim words and records all
four grants separately. The ADR now **cites that section by name** and quotes exactly two identifying
fragments — *"I allow you to deploy"* and *"it is local for now until completed"*. Anyone who wants
the sentence reads it there. **A ratified ADR that re-types an owner's words becomes a second copy
that can drift from the first.**

## What moved and what did not — the distinction the whole hop turns on

**The posture is CONFIRMED, not overturned.** *"it is local for now until completed"* says what the
2026-08-06 quote said and adds the owner's own bound. **What moved is who holds the deploy key.** So
the correct repair was never a supersession or a status change; it was one stale half-sentence inside
a document the owner has now confirmed twice.

**Two sentences in bullet 3 were overtaken and one still stands**, and the bullet now says which is
which rather than being rewritten into agreement with today:

| bullet 3's sentence | status | why |
|---|---|---|
| *"The deploy limit … `DEPLOY IS NOT INCLUDED` … is confirmed by this ADR"* | **DATED** — the limit was **RETIRED** 2026-08-15 | true for the nine days it stood; `60-progress.md` § 2's own table marks it retired |
| *"Merge approval is still not deploy approval"* | **KEPT, unchanged** | the two grants arrived **separately, nine days apart**. Neither implies the other, and that is exactly what this sentence says. It is now the record of *how* the deploy key arrived, and it forecloses the symmetric error — reading the deploy grant as widening something else |
| *"a human holds deploy"* | **STRUCK** | the owner granted the key to the agent |

**The struck text is preserved with `~~`, not deleted** — the mechanism this project's ADRs already
use for self-correction (`ADR-0011` four times). A reader in three months has to be able to see that
the sentence was once true, or the file reads as though it had always known.

## The thing nobody asked about, ruled: the distinction IS worth a clause, and it is one block

`ADR-0007` was written when *"deploys nowhere"* and *"may not deploy"* were one sentence. **They are
two facts now and they fail for different reasons.** The block states them as A and B:

- **A — CAPABILITY. Nothing to deploy, nowhere to deploy it.** Re-measured at this hop, not
  inherited: `D1` zero artifacts and still no YAML file of any kind; `D2` `private: true`, no `bin` /
  `main` / `exports` / `files`; `D3` no remote; `D4` `.gitkeep` only. **Unchanged. This is what stops
  a reader today.**
- **B — PERMISSION. An agent may deploy.** Granted 2026-08-15, dormant on arrival. **This stopped a
  reader before 2026-08-15 and does not stop him now.**

**The consequence that inverts the obvious reading of the grant, and it is the reason the block earns
its space:** three things would stop an agent from a production deploy — A, B, and
`production_requires_human_confirmation`. **B is gone. A is `EPIC-006`'s to remove BY DESIGN — that
is what packaging IS.** The flag is the only one of the three not scheduled to disappear. **Its
apparent redundancy and its actual importance went up on the same day.** That is an argument this
file could not make on 2026-08-06, and it is now the load-bearing argument for `D7`.

## Written as ONE block, not a new clause 7 — and that is a decision

**Adding a clause would imply this ADR decided something new about the posture. It did not — the
owner did, and the file records it.** Clauses are what this ADR *rules*; the ruling is unchanged. The
block sits at the end of clause 4 because clause 4 is where the conflation lived.

## What I deliberately did NOT amend

- **Clause 4 bullet 1** (`production_requires_human_confirmation` stays `true`). Its reasoning is
  intact and its forbidden inference is unchanged; the block adds a **second route** to the same
  forbidden conclusion and takes nothing away. **The flag was not flipped — see the `D7` decision.**
- **Clause 4 bullet 2** (release machinery, board column, workflows 12/13, and the never-deploy limit
  in all 17 role adapters, "untouched"). **Still literally true.** What is new is that those adapters
  now contradict the owner on this project — a precedence question, answered in the block, and
  explicitly **not** a licence to hand-edit a generated file. See my observation note.
- **Clauses 1, 2, 3, 5, 6; the Context measurement table; Alternatives; Rollback; `D1`–`D6`.** The
  Context table is a set of **dated measurements** — those do not go stale, they get superseded by
  later dated measurements, and I added mine to the block rather than editing rows dated 2026-08-06.
- **`.grugops/factory.config.json`.** Not opened for writing. `environments: ["local"]` and
  `default_stack.deploy: none-local-only` are correct and the subtask forbids moving them anyway.

## The one place I was tempted to widen scope and did not

`memory-bank/70-runbook.md` § Deploy and § On-call carry the same stale sentence in two spots, and
`memory-bank/30-architecture.md` carries a third. **I own those files as much as I own this one**, and
`D6`'s mitigation cites the runbook by name — so leaving them stale weakens `ADR-0007` slightly.
**Not fixed here**: my Definition of Done names `ADR-0007`, a second agent is live in this same
worktree, and files outside a named scope are exactly where two parallel hops collide. **Flagged with
line numbers in my observation note and reported to the Orchestrator** rather than swept in.
