---
task: owner-grants-2026-08-15
subtask: agents-md-owner-grants
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/agents-md-owner-grants/
parent_ref: .grugops/context/owner-grants-2026-08-15/
enqueued_by: orchestrator
enqueued_at: 2026-08-15T13:20:00Z
branch: grugops/agents-md-owner-grants
base: grugops/owner-grants-2026-08-15 @ TIP — branch by NAME, not by sha
---

# Subtask: `AGENTS.md` now understates what the owner has granted, and one command slot can finally be filled

**Branch from `grugops/owner-grants-2026-08-15` by NAME, at its tip.** No sha: the tip is the commit
that adds this file. `main` IS an ancestor of that branch, so it is safe to read `main`'s history, but
branch from the named branch — it carries the authority entry you must cite.

## The authority — read it, do not take it from this file

**`memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test
and UAT are the agent's, per ticket. 2026-08-15."** That section is the authority; **`AGENTS.md`
points at it and does not restate it**, exactly as `AGENTS.md` already does for the branching model
and the deployment posture. The owner's words are quoted verbatim there. Do not paraphrase them into
`AGENTS.md`.

**`parent_ref:`** holds one note: the first coverage measurement ever taken in this project.

## What is now WRONG or INCOMPLETE in `AGENTS.md`

Read each against the authority entry and fix only what is actually wrong:

1. **`## Safety rules` says "Never deploy."** That is no longer what the owner has said. **It is also
   not simply false** — the same sentence that granted deploy said the project does not need
   deploying and is local until completed. **Both halves are the owner's.** Write the rule so a role
   under pressure cannot read it as "deploy freely" and cannot read it as "the old prohibition
   stands" either.
2. **`## Deployment posture`** says a human holds deploy and that merge approval is not deploy
   approval. The posture (deploys nowhere, local, revisit at `EPIC-006`) is **CONFIRMED** by the
   owner's sentence and must not be weakened. **What changed is who holds the key.**
3. **`production_requires_human_confirmation` is still `true` and was deliberately NOT flipped.**
   `ADR-0007` carries a detection row (`D7`) for that flag being found `false`. **Record the flag's
   real state; do not argue it obsolete** — arguing it obsolete is precisely what `D7` detects.
   Architect/Design is separately amending `ADR-0007`; **do not do their edit for them, and do not
   restate their ADR here.**
4. **Merge and test are now explicitly per ticket, and UAT is the agent's to conduct.** `AGENTS.md`
   has no line about UAT authority today. The authority entry records a distinction that **must
   survive the trip into `AGENTS.md` if you mention UAT at all**: an agent-run UAT executes the
   scenarios and reports the result; it is **not** a named human's acceptance signature.
5. **`### Test` has no coverage command, and one now exists and has been RUN.**
   `npx vitest run --coverage` was executed on `main` @ `7313156`, exit 0. **`@vitest/coverage-v8` is
   installed and nothing had ever invoked it.** Fill the slot **only with what you have run
   yourself** — the file's own rule is real commands only, never fabricate, and `UNKNOWN - verify`
   over a guess. The measured figures and the denominator problem are in `parent_ref:`; **the numbers
   belong there, not in `AGENTS.md`.**

## Hard limits

- **`AGENTS.md` is yours; `memory-bank/60-progress.md` and `ADR-0007` are NOT.** Cite them.
- **Do not restate the owner's quote, the coverage numbers, or the ADR's clauses into `AGENTS.md`.**
  This file has a standing problem with growing copies that drift; it already carries the
  precedence-pointer pattern for two other directives. Use it.
- **Do not change any config value**, do not add a gate, do not touch `plans/`, do not touch `src/`.
- **Do not merge, do not deploy.** The Orchestrator merges this.

## Definition of done

`AGENTS.md` tells a role arriving cold, in the fewest words that are true: what may be deployed
(nothing, today) and by whose authority that could change; that merge and test are the agent's per
ticket and the gate still binds; that UAT may now be conducted by an agent and what that does and
does not mean; and a coverage command that has actually been run. Notes published per Workflow 16
under `ref:` (hand-authored, **no `kind: finding`, no invented stamp**); queue claim taken by hand per
`AGENTS.md`; gates run on your branch tip and recorded.
