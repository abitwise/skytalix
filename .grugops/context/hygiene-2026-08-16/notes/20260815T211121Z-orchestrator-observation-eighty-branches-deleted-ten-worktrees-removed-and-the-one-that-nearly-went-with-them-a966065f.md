---
id: 20260815T211121Z-orchestrator-observation-eighty-branches-deleted-ten-worktrees-removed-and-the-one-that-nearly-went-with-them-a966065f
kind: observation
by: orchestrator
at: 2026-08-15T21:11:21Z
verified_by: 
confidence: high
refs:
  - .grugops/context/hygiene-2026-08-16/notes/
supersedes: 
---

# 80 branches deleted, 10 worktrees removed, and the live branch that nearly went with them

## The near-miss, first, because it is the reusable part

The deletion list was built as `git branch --merged main`, minus `main`. A sanity grep ran against
that list for protected names before a single `git branch -d`. It **fired**:

```
grugops/lint-config-drift
!!! ABORT !!!
```

**A branch with no commits yet is trivially "merged".** The Software Engineer working
`lint-config-drift` in parallel had created its branch and had not yet committed, so its tip was
`c732fe2` — an ancestor of `main` — and `--merged main` listed it as a deletion candidate
alongside 80 genuinely finished ones. Nothing distinguished it by name pattern, by age, or by
`--merged`. Deleting it would have destroyed a live agent's branch mid-hop while it worked.

**`git branch -d`'s own safety would NOT have caught this** — that check is exactly "is it merged",
and the answer was yes. The only thing that caught it was an explicit protect-list checked before
the loop. **The lesson is not "be careful": it is that `--merged` answers a question about
ancestry, not a question about whether anyone is still using the branch.** Any future sweep that
runs while agents are scheduled must exclude live branches by name, from the queue's `claimed/`
directory or the worktree list — not infer them.

## What was deleted

- **80 branches**, all `grugops/*`, all deleted with `git branch -d` — the safe form that refuses
  anything not fully merged. **`deleted=80 refused=0`.** Zero refusals means every one was a true
  ancestor of `main`; not one deletion needed `-D`, and none was forced.
- **3 branches remain**: `main` (`60721e5`), `grugops/hygiene-2026-08-16` (this hop),
  `grugops/lint-config-drift` (the live engineer).

## What was removed to make it possible

**10 `git worktree`s**, which is why this list never drained on its own: git refuses to delete a
branch that is checked out in a worktree, and every earlier sweep would have hit that wall.

Nine were siblings of this repo (`cli-chess-bapm041`, `cli-chess-dev041b`, `cli-chess-dev041c`,
`cli-chess-dev042b`, `cli-chess-qe041`, `cli-chess-qe041b`, `cli-chess-qe042b`,
`cli-chess-scribe042`, `cli-chess-sec041`); one was a scratchpad under `/private/tmp/claude-501/…`
from a session that ended without cleaning up.

**All ten were re-verified immediately before removal, not once at the start**: `git status
--porcelain` empty on every one (zero uncommitted bytes), and `git merge-base --is-ancestor <br>
main` true on every one. `git worktree remove` was used **without `--force`** — it refuses on
modified or untracked content, so the removals are a second independent confirmation that nothing
was in them. All ten returned success.

## Nothing was orphaned, and here is the check rather than the assurance

`git fsck --no-reflogs --unreachable` reports **399 unreachable commits**, and **0 of them are
ancestors of `main`**. That number is alarming until it is dated: **the newest is
`2026-08-14T01:20:50`**, which is before this hop began. They are pre-existing debris from
amended commits and one dropped stash across the project's history — **not** a product of these
deletions. Had a deletion orphaned anything, the orphan would carry today's date; none does.

**One item in that debris is worth a human's eye and was deliberately not touched** (coding rule
12 — flag, don't delete): `eae5b0a`, a **dropped stash** labelled
`On grugops/ticket-to-pr-ABC-041: abc041-baseline-probe`, with its index and untracked-files
companions `edaf2ff` / `c4d756a`. Someone stashed a baseline probe during `ABC-041` and the stash
was dropped rather than applied. It is still recoverable today by sha; it will not survive a `git
gc`. Recovering or discarding it is not this hop's call.

## Two other places work could have hidden, both checked and both empty

- **`git stash list`** — empty. Nothing parked.
- **`git remote -v`** — empty. This repo has no remote, which is why `autonomy: "pr"` has always
  meant "branch + gate" here: there is nothing to push and no PR to open. **Deleting these
  branches deletes the only copy**, which is why `-d` and not `-D`, and why every branch's content
  was confirmed inside `main` first.
