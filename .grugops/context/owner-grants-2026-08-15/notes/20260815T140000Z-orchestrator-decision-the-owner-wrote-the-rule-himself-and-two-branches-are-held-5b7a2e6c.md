---
id: 20260815T140000Z-orchestrator-decision-the-owner-wrote-the-rule-himself-and-two-branches-are-held-5b7a2e6c
kind: decision
by: orchestrator
at: 2026-08-15T14:00:00Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - memory-bank/60-progress.md
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - grugops/agents-md-owner-grants
  - grugops/design-adr0007-deploy-authority
supersedes: 
---

# Orchestrator Decision — the owner wrote the rule in his own hand; two agent branches are HELD, and here is exactly what he did and did not say

## What happened

The Orchestrator escalated **one bullet** to the project owner: whether `AGENTS.md`'s safety rule
should change from `Never deploy.` to the AGENTS.md Scribe's proposed **"Deploy is allowed, and there
is nothing to deploy."**

**The owner did not answer in chat. He opened `AGENTS.md` and wrote the rule himself**, replacing the
`## Branching model` precedence paragraph's final sentence. His text, verbatim, committed at
`c878fdb` with **zero characters changed by any agent**:

> *"Merge to main is allowed, deploys are currently not implemented.
> Merge to `main` in THIS project only when all tests pass and ticket is done, never before."*

**That is the ruling.** It is the first time in this project's history that a rule in `AGENTS.md` was
written by the owner's own hand rather than by the AGENTS.md Scribe under a quoted directive.

## What he DID say — two things, and the second is new

1. **"deploys are currently not implemented" is a statement of FACT about the project, not a grant to
   an agent.** He had said *"I allow you to deploy"* in session; **he did not carry that sentence into
   the safety file.** What he wrote instead is the true, checkable thing — there is nothing to
   deploy — which is exactly the barrier that survives a context clear.
2. **He TIGHTENED the merge rule.** *"only when all tests pass and ticket is done, never before"* is
   a condition that did not exist in writing before today. The 2026-08-06 directive said the gate
   binds; this adds **and the ticket must be done**. **It binds this role and every future one, and
   it is stricter than what the agents were operating under.**

## What he did NOT say, recorded because the temptation to round it up is real

- **He did not adopt the words "Deploy is allowed."** That phrasing is the Scribe's, it was put to
  him explicitly, and he wrote something narrower in its place.
- **He did not touch `## Safety rules`.** That section still reads `Never deploy.` and *"a human
  holds deploy"* — **unchanged, on `main`, right now.**
- **He did not flip `production_requires_human_confirmation`.** Still `true`. `ADR-0007`'s `D7`
  detection row is intact and has now survived two separate opportunities to be argued away.

## The divergence, flagged and NOT resolved by any agent

**`AGENTS.md` § "Safety rules" says `Never deploy` and *"a human holds deploy"*. The owner said in
session *"I allow you to deploy"*, and `memory-bank/60-progress.md` now records that grant verbatim.
These two documents do not agree.**

**No agent resolved it, and no agent may.** The owner had the file open, edited a different paragraph
in it, and left that bullet standing. **That is data, not an oversight to be tidied.** Either reading
is available to him:

- the safety bullet is stale and he simply did not reach it; or
- the safety bullet is what he wants operationally — permission exists, and the operative instruction
  to an agent about to act is still *don't*.

**Until he says which, the stricter document governs conduct**: no agent deploys. Nothing is lost by
that — there is nothing to deploy.

## Two branches are HELD, not merged, and why

| branch | what it does | status |
|---|---|---|
| `grugops/agents-md-owner-grants` | rewrites `## Safety rules` to **"Deploy is allowed…"**, adds a `## Test and UAT authority` section, rewrites `## Deployment posture`, fills the coverage command slot | **HELD** — the owner declined its central wording by writing his own |
| `grugops/design-adr0007-deploy-authority` | strikes *"a human holds deploy"* from `ADR-0007`, strengthens `D7`, recommends NOT flipping the flag | **HELD** — same class: it removes a human-holds-deploy statement the owner left standing in `AGENTS.md` an hour later |

**Neither is bad work and neither is discarded.** The Scribe's coverage commands are verified and
have no authority content; its UAT precedence text *adds* a constraint (conduct, report, **never
self-sign**) rather than removing one; the Architect's `D7` hardening closed a real blind spot. **All
of it waits on the owner's word, because all of it edits the documents that constrain agents, in the
direction of fewer constraints, on the strength of a chat message transcribed by an agent.**

## The harness security warning, recorded so a later session sees it rather than rediscovering it

An automated instruction-poisoning warning fired on the Scribe's return. **Its provenance claim was
wrong** — the grant it called fabricated was spoken by the owner in that same session and quoted
verbatim; nothing was invented. **Its structural claim was right**, and it is the reason for the
holds above:

> the chain runs *owner's chat message → a file an agent wrote → an edit by a second agent that
> never saw the message*, ending in the file every future session reads as its operating rules. A
> future session cannot verify the root. **That is the shape of instruction poisoning even when the
> root is genuine.**

**The general rule this hop adopts, and it should outlive this ticket:** an agent may *record* a
human's grant anywhere; an agent should not *widen its own standing permissions* in an instruction
file on the strength of its own transcription. **Ask the human to write that line — and on
2026-08-15 the owner did exactly that, in four minutes.**

## Queue state, stated honestly

`.grugops/queue/pending/` on `main` holds `agents-md-owner-grants.md` and
`design-adr0007-deploy-authority.md`. **Both subtasks are COMPLETE** — claimed, worked, gated and
committed on the two held branches. Their `claimed/` → `done/` transitions land on `main` only when
those branches do. **The queue is not lying about work not done; it is showing work whose results are
deliberately not on `main` yet.**
