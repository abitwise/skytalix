---
id: 20260806T201200Z-agents-md-scribe-observation-060b1f86
kind: observation
by: agents-md-scribe
at: 2026-08-06T20:12:00Z
verified_by: 
confidence: high
refs:
  - agents-md-branching-model
  - AGENTS.md
  - agent-factory/_commit-convention.md
  - agent-factory/workflows/04-ticket-to-pr.md
  - agent-factory/workflows/05-pr-quality-gate.md
  - agent-factory/workflows/12-release.md
supersedes: 
---

# The remaining contradiction is KIT-vs-owner, it cannot be fixed where it lives, and `AGENTS.md` now rules precedence

## What was found

Fixing `AGENTS.md` does not end the disagreement, because the read-only kit still asserts the
retired rule in **twelve files**. Grepped at this hop for `never merge` / `Humans hold` /
`agents never merge` under the kit root; the four that agents actually hit on the delivery path
were then read line by line rather than counted:

- `_commit-convention.md:57` — section heading `## (c) Humans hold merge and deploy`
- `_commit-convention.md:61` — *"Agents never merge a protected branch and never deploy to production. **Humans hold both.**"*
- `workflows/04-ticket-to-pr.md:48` — *"This workflow honors `autonomy=pr` — the agent opens a branch and a PR; it never merges. Humans hold merge and deploy."*
- `workflows/05-pr-quality-gate.md:71` and `:74` — *"it never auto-merges and never deploys. Humans hold merge and deploy."*
- `workflows/12-release.md:49` — *"never merge, never deploy; the production action stays human-confirmed and humans hold both."*

The other seven files matched on the same phrasing in their `## Commit` sections
(`13-incident`, `14-ui-design-to-build`, `15-security-audit`, `16-context-read-write`,
`17-task-claim`, `18-context-compaction`, `packaging/adapters.md`).

## Why none of it was edited

The kit is **read-only KIT** under the kit-vs-state invariant, and it is **shared across projects**.
One project's owner cannot grant another project's merge key, so the kit is *correct as a default*
and simply cannot carry a per-project override. Editing it would be both a rule violation and wrong.

The consequence is that an agent reading Workflow 04 or 05 mid-task will read *"it never merges"*
and, without a precedence rule, will either stall or conclude the owner's directive is stale. That
is the same failure mode as the `ABC-015` / `ABC-014` knot: two documents that disagree, with no
statement of which wins.

## What was written instead

A short **Precedence** paragraph in `AGENTS.md` § `## Branching model` that names the kit files,
states that they are read-only and project-agnostic, and rules that on merge to `main` **in this
project** the owner's directive wins — while everything else in those same files (the branch guard,
the gate, never-deploy) stands unchanged. The scope is deliberately narrow: it overrides one
clause, not the convention.

## A second observation: the commit convention splits cleanly, and only half is affected

`_commit-convention.md` §(a) — commit on a `grugops/<workflow>-<id>` branch, never on a protected
one — is **untouched by the owner's directive and still binds**. The directive changes what happens
*after* the gate is green, not how work is produced. `AGENTS.md` says this in one sentence, because
a reader told "the convention is overridden" would otherwise drop the branch guard too, and start
committing on `main`.
