---
id: 20260811T190000Z-orchestrator-failed-attempt-3d81f0a4
kind: failed-attempt
by: orchestrator
at: 2026-08-11T19:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-019
  - ABC-027
supersedes:
---

# I enqueued three subtasks whose `parent_ref:` pointed at context folders I never created

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **This is not a `finding`.**

## What happened

Three subtask files carried a `parent_ref:` to a task context folder that did not exist:

| subtask | `parent_ref:` written | existed? |
|---|---|---|
| `refinement-ABC-016-qe-gaps` | `.grugops/context/abc016-qe-gaps-2026-08-11/` | **no** |
| `refinement-ABC-019-qe-gaps` | `.grugops/context/abc019-qe-gaps-2026-08-11/` | **no** |
| `ticket-to-pr-ABC-027-dev` (ticket-driven) | `.grugops/context/abc027-gate-2026-08-11/` | **no** |

For five earlier hops I wrote an Orchestrator note into the task folder before enqueuing against it
(`abc016-review-a13`, `abc016-d19b`, `abc019-review`, `abc019-a9b`, `adr0010-routing` — all present).
**From the `abc016-qe-gaps` hop onward I stopped writing the note and did not stop writing the
reference.** The board header and the ticket history absorbed the reasoning instead, so nothing was
*lost* — but it was not where I told three agents to look for it.

## Why this is a substrate defect and not a typo

**The shared verified context is the only inter-role memory** (`AGENTS.md`, Workflow 16). A
`parent_ref:` is a promise that the reasoning behind a delegation is on disk at that path. I made the
promise three times and did not keep it, while simultaneously instructing every agent that the
on-disk context is the only channel and that nothing may be relayed. **An empty `parent_ref` pushes a
role toward reconstructing intent from the prompt — which is the relay I forbid.**

## How it was caught

**Not by me.** BA/PM, ruling `ABC-016`'s seven QE gaps, reported: *"The `parent_ref:` ... does not
exist — not in the worktree, not in `main`, `git log --all` on the path returns nothing. I read the
brief and `plans/board.md` instead, and recorded it rather than working around it silently."*

That is the correct behaviour and it is the second time this round a role has caught me by refusing
to paper over a missing input. It also means the failure was **survivable**: the board header carried
enough that the hop still produced a good ruling.

## Correction

The three folders now exist and carry a note. This one is deliberately a `failed-attempt` rather than
a `decision`, because the honest content of the `abc016-qe-gaps` hop's context is *"the Orchestrator
did not write one"*. Backfilling a `decision` dated after the fact and presenting it as the input the
agent should have had would be a fabricated trail — the exact thing the admission rules exist to
prevent.

**Standing correction for the rest of this session: create the task folder and write the note BEFORE
enqueuing any subtask that references it.** The five hops that did this correctly are the pattern;
the three that did not are this note.
