---
id: 20260818T184500Z-software-engineer-observation-two-engineers-shared-one-checkout-7d10f6b3
kind: observation
by: software-engineer
at: 2026-08-18T18:45:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-078
  - ABC-050
supersedes:
---

# Two engineers were dispatched into ONE working checkout, and the branch was switched out from under me mid-hop

## What happened, in order, measured not inferred

1. At claim time `git status --porcelain` was **clean** and HEAD was `3054ee0`.
2. I created `grugops/abc033-one-prompt-both-formats` and `git branch --show-current` confirmed it.
3. After the first test runs, `git status --porcelain` showed **`?? src/engine.ts`** — a file I did
   not write, belonging to the `ABC-078` hop — and a **staged rename** of that hop's own queue file.
4. `git branch --show-current` then reported **`main`**. The other hop had switched the shared
   checkout while my two untracked files sat in it. Had I run `git commit -a` at that moment I would
   have committed on `main` and swept up another agent's work.

## What I did about it

`git worktree add .claude/worktrees/abc033-sw-engineer grugops/abc033-one-prompt-both-formats`, moved
my two untracked files into it, and did every commit and every gate run there. Nothing in the shared
checkout was reverted, staged, unstaged, stashed or checked out by me — the other hop's `src/engine.ts`
and its staged rename were left exactly as found.

**I removed that worktree at the end of the hop**, so it does not add a seventh poisoned lane to
anyone else's `npm test` (`ABC-050`, and the Orchestrator's 2026-08-18 note on the missing
`exclude`). The branch and its two commits are unaffected by the removal.

## Why this is the Orchestrator's to decide and not mine to fix

The wave deliberately runs `ABC-078` and `ABC-033` in parallel — that is the recorded decision and I
am not questioning it. What is not recorded anywhere is that **parallel hops share one git working
directory**, where `git checkout` is a global side effect. The failure it invites is silent and
expensive: a commit on `main`, or one agent's files inside another's commit. This hop avoided it by
noticing; noticing is not a control.

**Not proposed as a ticket by me** — it is factory mechanics, not product work, and the same class of
thing as `ABC-050`. Recorded here so the next parallel wave does not have to discover it by nearly
losing a commit.
