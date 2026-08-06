---
id: 20260806T210000Z-orchestrator-decision-3d1f97a2
kind: decision
by: orchestrator
at: 2026-08-06T21:00:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - .grugops/factory.config.json
  - AGENTS.md
  - memory-bank/30-architecture.md
  - memory-bank/60-progress.md
  - memory-bank/70-runbook.md
  - plans/nfr-catalog.md
  - EPIC-006
supersedes: 
---

# The owner says this project deploys nowhere and runs locally — write it down where it binds

## The instruction, quoted verbatim

**Project owner Olger Oeselg, 2026-08-06:**

> *"this project currently does not deploy anywhere, mark that as well, it will be used locally for
> now."*

"as well" points at the act performed earlier the same day for the branching model: a standing fact
about how this project works, recorded in the substrate rather than left in a chat window.

## How this is read, stated so a later reader can check the reading rather than inherit it

Two words in the instruction are doing load-bearing work and are honoured, not rounded up:

- **"currently"** and **"for now"** — this is a statement of **present posture, explicitly
  revisitable**. It is NOT a ruling that the project may never be distributed. Nothing that exists to
  serve a future deploy gets deleted on the strength of it; what gets fixed is every place the
  substrate currently **claims** a deploy target that does not exist.
- **"used locally"** — the delivery target is a machine a developer already sits at. There is no
  environment to promote to, so there is nothing to promote **between**.

**The revisit trigger is named rather than left to memory: `EPIC-006` (packaging).** That is the
first work in this project that produces an artifact a person other than its author could run, which
is the first moment "where does this go" becomes a real question. This is the same shape as the
merge-checkpoint consequence recorded under the branching-model directive, which is also parked at
`EPIC-006`.

## Why this is not a no-op — three places the substrate says otherwise today

The repo does not currently read as a local-only project. It reads as an undeployed **service**:

1. `.grugops/factory.config.json` → `default_stack.deploy: "kubernetes-ready"` — a bootstrap default
   nothing in this repo implements. There is no Dockerfile, no manifest, no chart.
2. `.grugops/factory.config.json` → `environments: ["dev","staging","prod"]` — three environments,
   none of which exists.
3. `.grugops/factory.config.json` → `nfr.availability: "99.9%"` — an availability SLO on something
   that is never up, because it is never running anywhere but a terminal someone opened.

`AGENTS.md` has no deployment section at all, and `memory-bank/70-runbook.md` — the file whose stated
purpose is *"how to operate, deploy, and roll back in production"* — is still the shipped empty
template. A reader looking for "how do I deploy this" today finds an empty template and three config
values that all imply Kubernetes.

## THE CONFIG *CAN* CARRY THIS, AND THAT IS THE DIFFERENCE FROM THE BRANCHING-MODEL CASE

Recorded explicitly, because the branching-model entry from earlier today deliberately did NOT edit
the config and a later reader could easily over-generalise that into "grugops never edits the
config".

The branching model had **no expressible dial**: `autonomy` allows only `diff`/`branch`/`pr`, no
value means "agents may merge", and there is no `branching_model` key — so inventing one would have
placed a control nothing reads in the first file every role opens. **That reasoning does not transfer
here.** `environments` is documented in the kit's own config reference as *"Deployment environments
the factory recognizes"* — a free-form array of strings; `default_stack.deploy` is a free-form
string; `nfr.availability` is a free-form string. All three are **honest dials for exactly this
fact**, so the finding this time is the opposite one: leave them and the config lies.

**The verification is still owed and is NOT assumed.** Whoever edits reads
`agent-factory/config/factory.config.md` first and confirms each key's contract before writing. If a
key turns out to be constrained after all, record that and leave it — a fake dial is worse than a
documented gap, which is the whole lesson of the branching-model entry.

## ONE HARD CONSTRAINT — `production_requires_human_confirmation` STAYS `true`

No agent on this task may set it to `false`, delete it, or "clean it up as no longer applicable".

The kit's config reference calls it a must-stay flag, and the reasoning is not conditional on a prod
environment existing: **"we have no production" is a fact about today, and the flag is a rail for the
day that changes.** A rail that costs nothing while unused is not dead config. The same holds for the
never-deploy hard limit in every role file and for the deploy limit written into the branching-model
directive — *"DEPLOY IS NOT INCLUDED"* — which this instruction confirms rather than modifies.

Likewise: **nothing under `plans/releases/`, no board column, and no workflow is deleted.** Scope is
"stop claiming a deploy target that does not exist", never "remove the machinery for ever having
one".

## Routing, and why it is two hops rather than one

Three subtasks, split by **who can verify the thing** — the owner's standing directive of 2026-08-03
(*"in most cases send decision to correct role"*) — and by **disjoint file ownership**, so no two
agents write the same file.

**Hop 1 — Architect/Design** (`architect-deploy-posture`): rules the posture as an architecture fact,
owns `default_stack.deploy` + `environments` in the config, `memory-bank/30-architecture.md`,
`memory-bank/70-runbook.md`, and an ADR if one is warranted. Runs alone because both hop-2 subtasks
depend on the ruling.

**Hop 2, in parallel (width 2, cap is 3):**
- **Security/NFR** (`security-nfr-availability-bar`): `nfr.availability` is an **NFR bar**, and NFR
  bars are Security/NFR's under the same standing directive — not the Architect's and not the
  Orchestrator's. Owns the `nfr` block and `plans/nfr-catalog.md`, nothing else.
- **AGENTS.md Scribe** (`agents-md-deployment-section`): owns `AGENTS.md` and only `AGENTS.md`.

**The two hop-2 subtasks are independent of each other**, which is why they run together: the
availability bar is a catalog concern and does not belong in `AGENTS.md`, whose deployment section
needs the Architect's ruling and nothing from Security/NFR.

**No data is relayed between any of them.** Each reads this folder and the published notes of the
hop before it. The Orchestrator carries no payload between agents.

## What is NOT in scope, named so nobody widens it

- Not deleting release/deploy machinery (see the hard constraint above).
- Not deciding how the CLI will eventually be distributed — npm, a binary, a git clone. That is
  `EPIC-006`'s question and this task must not pre-empt it. Recording "undecided" is correct here;
  inventing an answer is not.
- Not cutting a ticket. This is a governance/substrate record, the same shape as the branching-model
  entry, which also moved no board column.
- Not touching `plans/board.md`. No column moves, no WIP consumed — checked before scheduling:
  `In Analysis` 0/2, `In Design` 0/2, `In Development` 0/3, every column empty between `Ready` and
  `Done`.

## Degraded substrate, restated because every role here has recorded it rather than glossed it

This install has **no `scripts/claim.js` and no `scripts/context-io.ts`**. Workflow 17 step 2's
atomic claim cannot execute and Workflow 16's sanctioned writer does not exist. Move the subtask file
`pending/` → `claimed/<subtask>/` → `done/` **by hand** and say so. Hand-write notes into `notes/` in
the schema's exact shape. **`finding` is NOT admissible on this task** — there is no §14 gate here to
issue a stamp. Use `decision` / `observation` / `claim` / `artifact-ref`. Never self-stamp.

## Stop conditions

- Any agent that finds itself about to weaken `production_requires_human_confirmation`, delete a
  never-deploy limit, or remove release machinery: **stop and say so** rather than proceeding.
- Any agent that finds a config key is constrained and cannot honestly carry this fact: **record the
  finding and leave the key**, exactly as the branching-model entry did.
- Any agent that needs the owner to decide the eventual distribution mechanism: **stop and ask** —
  do not invent one to fill a slot.
