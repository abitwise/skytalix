---
task: cut-agents-md-cap-2026-08-19
subtask: cut-agents-md-cap
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: —
ref: .grugops/context/cut-agents-md-cap-2026-08-19/
parent_ref: .grugops/context/agents-md-input-deep-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T14:00:00Z
branch: grugops/cut-agents-md-cap
base: main @ cfad1b7
---

# Subtask: cut ONE ticket — `AGENTS.md` is 3,019 bytes from a cap that truncates SILENTLY

Read `parent_ref:` (the Scribe's three notes) first. **The Scribe found this while correcting
something else, declined to fix it inside that hop, and said why: cutting content out of this file
is a dedicated hop with a mandate, not a side effect of a correction.** That judgement is right and
it is the reason you are cutting rather than someone patching.

## The measurement, taken by me first-hand at `grugops/agents-md-input-deep`

| | bytes |
|---|---|
| Codex cap | **32,768** |
| `AGENTS.md` today | **29,749** |
| headroom | **3,019 (9.2%)** |

Growth over the last four commits of `main`: `26,902 → 26,902 → 27,690 → 27,690`, and the Scribe's
pending amendment takes it to **29,749** — **+2,847 in two hops**. At the observed rate the cap is
reached in roughly **two more hops**.

## Why this is not cosmetic

**Past the cap the tool truncates the file SILENTLY.** There is no error and no warning; a role
simply reads less than the file says. And the truncation eats the **tail**, which currently holds
`## When uncertain` plus the Definition-of-Ready / Definition-of-Done pointers — i.e. **the gate
instructions vanish first, and nothing announces it.**

This project has already been bitten twice by documents that were true and unread. `ABC-070` exists
because a page named a drained claim as live; the Orchestrator's own 2026-08-16 disclosure records a
precondition violated *"because I did not read this file at hop start."* A file that silently stops
being read is the same failure with the evidence removed.

## What the ticket must and must not do

- **Cut the problem: `AGENTS.md` must fit under the cap with real headroom, and must not lose a
  load-bearing instruction.** How — compaction, extraction into pointed-to files, or a different
  structure — is the **AGENTS.md Scribe's**, and the Scribe owns the file's voice and its 12 coding
  rules. Name them as owner.
- **The hard part, and say so on the page:** the Scribe reports that *every remaining paragraph is a
  pointer to an owner directive or a kit-override precedence note*. So this is **not** a
  trim-the-fat exercise. Something load-bearing must move somewhere it is still read, or the file
  must be restructured. **Do not write the page as though slack exists.**
- **Acceptance must include a measured byte count with headroom stated**, and a check that no owner
  directive or kit-override precedence note lost its pointer. A diff that shrinks the file and drops
  a directive is the failure mode.
- **Consider, and rule on the page, whether a guard is owed** — this repo's habit is that an
  unenforced number goes stale. A byte-count check is cheap. But `ABC-108` says the lane's budget is
  spent, so weigh a new test file honestly rather than reflexively.

## What you may NOT do

- **Do not cut the content yourself and do not edit `AGENTS.md`.** You are cutting a ticket.
- Do not cut more than one ticket. Note anything else and I will route it.
- Nothing under `src/`. Do not move a board column, do not merge, do not deploy.
- **Do not size this by feel.** The numbers above are measured; use them.

## One loose end to record on the page, not to fix

The Scribe's amendment hop could not append a `plans/traceability.md` row — `plans/` was outside its
fences. **Whoever integrates that branch owes the row.** Note it; the integration is mine.

## Gate

No `src/` change. Contained lane, record numbers unchanged from `main`: **1152 tests / 38 files,
skip 0** at `cfad1b7`. An isolated worktree has no `.claude/worktrees/`, so the recorded commands
work inside one.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/cut-agents-md-cap`. **Commit incrementally.**

Commit on `grugops/cut-agents-md-cap`, never on `main`.
