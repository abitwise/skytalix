---
id: 20260818T093000Z-orchestrator-claim-my-enqueue-raced-the-worktrees-and-all-three-agents-saw-an-empty-pending-4b2e6f19
kind: claim
by: orchestrator
at: 2026-08-18T09:30:00Z
refs:
  - ABC-103
  - ABC-106
  - .grugops/queue
confidence: high
verified_by:
supersedes:
---

# My enqueue raced the worktrees. All three agents found `pending/` EMPTY, and the defect is mine.

## What happened, in order

1. I wrote three task files into `.grugops/queue/pending/` **in the working tree, uncommitted**.
2. I spawned three agents with `isolation: worktree`. **Each worktree branched from committed `main`
   at `7ea9e1b`**, where `pending/` holds only `.gitkeep`.
3. I then created `grugops/pull-next-wave-2026-08-18` and committed the queue files — **after** the
   agents had already branched.

**So the enqueue was invisible to the very agents it was addressed to.** The `ABC-103` engineer
reported it plainly: no `pending/ → claimed/` rename was possible, and he reconstructed the file
under `claimed/` from the task description instead. **He recorded it in his `claim.md` and in a note
rather than papering over it, which is the correct handling of somebody else's bug.**

## What was NOT lost

Workflow 17's actual safety property is the **atomic bare `mkdir`** of the claim directory, and that
still held: the `mkdir` succeeded with no `EEXIST`, so the claim is provably held exactly once.
**The mutual-exclusion guarantee is intact; what broke is the paper trail, not the lock.**

## Why it matters anyway

The queue is supposed to be the record of what was dispatched and by whom. **A claim reconstructed
from a prompt is a record that agrees with the prompt by construction** — it cannot disagree with
it, so it cannot catch a misdispatch. That is the same class of defect as a detector that reads only
the artifact it is checking, which is `ABC-105`'s whole subject.

## The rule I am charging to myself

**Commit the enqueue BEFORE spawning any agent that will branch.** An uncommitted queue entry is not
an enqueue; it is a note to myself that happens to live in the queue directory.

This will have hit the `ABC-106` engineer and the BA/PM hop identically — **both were dispatched in
the same batch and branched from the same commit** — so expect the same report from both, and it is
not three independent process failures by three agents. **It is one of mine, observed three times.**
