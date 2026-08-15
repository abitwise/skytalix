---
task: owner-grants-2026-08-15
subtask: design-adr0007-deploy-authority
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/design-adr0007-deploy-authority/
parent_ref: .grugops/context/owner-grants-2026-08-15/
enqueued_by: orchestrator
enqueued_at: 2026-08-15T13:20:00Z
branch: grugops/design-adr0007-deploy-authority
base: grugops/owner-grants-2026-08-15 @ TIP — branch by NAME, not by sha
---

# Subtask: `ADR-0007` says a human holds deploy. As of 2026-08-15 that is no longer true.

**Branch from `grugops/owner-grants-2026-08-15` by NAME, at its tip.** No sha: the tip is the commit
that adds this file.

## The authority — read it, do not take it from this file

**`memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test
and UAT are the agent's, per ticket. 2026-08-15."** The owner's words are quoted verbatim there.

**This is the same shape as `N8-SPAWN` one hop ago**, and it worked: the owner authorized, and the
role that owns the document wrote it. **The Orchestrator does not edit a ratified ADR**, and did not.

## The precise problem

`ADR-0007` is the authority on this project's deployment posture. **Its posture is CONFIRMED by the
owner's sentence, not overturned** — *"it is local for now until completed"* says what the 2026-08-06
quote said. **What moved is who holds the deploy key.** So this is not a reversal, it is one clause
going stale inside a document that is otherwise more right than ever.

At least these need your judgement (find the rest yourself; this list is not a scope fence):

1. **The clause stating that a human holds deploy**, and that merge approval is not deploy approval.
   The first half has moved. **The second half may still be worth keeping as a statement about
   scope** — the two grants arrived separately and on different dates.
2. **Decision row `D7`** — *`production_requires_human_confirmation` is found set to `false`, deleted,
   or argued obsolete on the strength of this ADR* → *must read `true`*. **The flag is still `true`
   and the Orchestrator deliberately did not flip it**, precisely because `D7` exists and because the
   owner did not name the flag. **`D7` is doing its job and this hop is the first real test of it.**
   Rule on it explicitly: does `D7` survive as written, does it need re-wording now that the
   *authority* has changed while the *flag* has not, and **what would legitimately move that flag** —
   because "an owner said so in session" is now a live possibility and `D7` should be able to tell
   that apart from an agent's inference.
3. **`ADR-0007`'s own clause 4** (the one `D7` says forbids the inference) — check whether it still
   reads correctly against a world where deploy is permitted but unneeded.

## What is NOT being asked

- **Do not change the deployment posture.** Nothing deploys, nowhere, and the owner said so again.
  `environments: ["local"]` and `default_stack.deploy: none-local-only` stay.
- **Do not flip `production_requires_human_confirmation`.** If your ruling is that it should move,
  **that is a recommendation to the owner, not an edit** — the same limit Security/NFR observed at
  `G1`, and it held.
- **Do not decide how the CLI is distributed.** `EPIC-006` decides that and it is still undecided.
- **Do not write `AGENTS.md`.** The AGENTS.md Scribe is working the same authority in parallel on its
  own branch. **Your ADR is the thing it points AT.** Expect a merge only if you both touch the same
  file, and you should not.
- **Zero bytes under `src/`. Do not touch `plans/`. Do not merge, do not deploy.**

## One thing to rule that nobody has asked about

`ADR-0007` was written when "deploys nowhere" and "may not deploy" were the same sentence. **They are
now two different facts and the ADR does not distinguish them.** A reader arriving in three months
needs to know which one stops them. If that distinction is worth a clause, write it; if it is already
clear, say so and leave the file alone. **An ADR amended more than it needs is worse than one amended
exactly enough.**

## Definition of done

`ADR-0007` reflects who holds deploy today, with the posture untouched and its detection rows either
still valid or explicitly re-ruled; the amendment cites the authority rather than restating it; your
notes are published per Workflow 16 under `ref:` (hand-authored, **no `kind: finding`, no invented
stamp**); the queue claim was taken by hand per `AGENTS.md`; and gates were run on your branch tip and
recorded.
