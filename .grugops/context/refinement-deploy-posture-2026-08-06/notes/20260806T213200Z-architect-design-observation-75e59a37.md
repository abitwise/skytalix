---
id: 20260806T213200Z-architect-design-observation-75e59a37
kind: observation
by: architect-design
at: 2026-08-06T21:32:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - architect-deploy-posture
  - 20260806T212500Z-architect-design-decision-40352dd5
  - .grugops/factory.config.json
  - memory-bank/00-index.md
  - plans/traceability.md
  - EPIC-006
supersedes: 
---

# Four things found and deliberately NOT fixed — flagged, with who owns each

Named rather than fixed, because each is outside this subtask's ownership. Flagging beats silently
widening scope, and it beats leaving them for someone to rediscover.

## 1. `default_stack.container` is still `"docker"` and there is no Dockerfile — and it was NOT on the Orchestrator's list

The Orchestrator's decision note named **three** places the substrate claims a deploy target
(`default_stack.deploy`, `environments`, `nfr.availability`). **There is a fourth**, in the same file
and the same object: `default_stack.container: "docker"`. It is the same class of untrue claim this
task exists to remove, and verification row 1 covers it — there is no Dockerfile and no compose file
anywhere in this repo.

**Not fixed**, because this subtask's config ownership is `default_stack.deploy` and `environments`
**only**, stated as a closed list. Whoever picks it up needs no new evidence; the scan is in the
sibling `observation` note.

**The wider version, since it was measured anyway: five of the seven `default_stack` keys describe a
stack this project does not use** — `backend: node-fastify`, `frontend: vue`, `db: postgresql`,
`e2e: playwright`, `container: docker`. Verified against a project with **zero runtime
dependencies**, no server, no UI surface, no database and no Playwright (`memory-bank/30-architecture.md`
§ "Tech context" and `AGENTS.md` § Stack both already describe the real stack correctly). Only
`language: typescript` and now `deploy` are true. **This is a decision for the owner or a later
Architect hop; it is deliberately not taken here** — it is a bigger question than the deploy posture
and it was not asked.

## 2. `memory-bank/00-index.md`'s fill-state note is now stale BECAUSE of this task — one line, not mine

Its "Fill state" block lists `70-runbook` among the files that *"are still the shipped empty
templates"*. **That stopped being true at this hop**: `70-runbook.md` is now filled. The same block's
claim that only three files carry real content is now off by one.

**Not edited**, because `00-index.md` is not on this subtask's ownership list, which was given as a
closed set ("these files and NOTHING else"). **This is a known-false line in the substrate created by
this task's own edit, and it needs one line changed by whoever owns that file** — recorded loudly
rather than quietly left, since leaving a fresh falsehood behind would contradict the whole point of
the task.

## 3. The read-only kit still hardcodes `dev → staging → prod`, and it cannot carry a project override

Two places, both KIT and therefore unwritable:

- `agent-factory/workflows/12-release.md` step 3 — *"the migration plan, the rollback plan, and the
  DR notes (RTO/RPO) for the `dev -> staging -> prod` path"*.
- `agent-factory/roles/release-manager.md` — the release-record template lists an *"environments path
  `dev → staging → prod`"*.

Both will now disagree with `environments: ["local"]`. **This is expected and is not a defect to
chase**: the kit is shared and project-agnostic. **Precedence is stated in `ADR-0007`** — on this
project's deployment posture, `.grugops/factory.config.json`, `ADR-0007` and `memory-bank/` win, and
everything else in those kit files (the never-deploy limit, the human-confirmation requirement)
stands unchanged. **This is the same shape `AGENTS.md` already uses for the branching model**, which
is why it is called out for the Scribe: the deployment section may want to mirror that precedence
paragraph rather than invent a new one.

## 4. No `plans/traceability.md` row was appended, and that is the file's own rule rather than an omission

The Architect role file says to append a trace row linking the design and any ADRs to their ticket.
**There is no ticket here** — the Orchestrator ruled explicitly that this task cuts none — and
`plans/traceability.md`'s own header states its format rule: **one row per ticket**. A governance /
substrate record has no ticket to hang off.

**Checked rather than assumed**, against the nearest precedent: the branching-model directive of
earlier the same day is the same shape, and `plans/traceability.md` mentions it **zero** times.
`ADR-0005` and `ADR-0006` likewise have no rows of their own. Appending a ticket-less row would break
the file's format to satisfy a role instruction that assumes a ticket exists. `plans/traceability.md`
is also not on this subtask's ownership list.

## Not a gap, but worth the next reader's attention

`memory-bank/60-progress.md` — the plan-of-record and the first file roles are told to read — already
says *"**Nothing is deployed and nothing is released.**"* under "What's left", so it does not
contradict this ruling. It has **no pointer to the new posture section or to `ADR-0007`**, and the
branching model got a full standing-directive section there. **Whether this posture deserves the same
is the Orchestrator's or the owner's call, not this role's** — `60-progress.md` is not on this
subtask's ownership list and was not edited.
