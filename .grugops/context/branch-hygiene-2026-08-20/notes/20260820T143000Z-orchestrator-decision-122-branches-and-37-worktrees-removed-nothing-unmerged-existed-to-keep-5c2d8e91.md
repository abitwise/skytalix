---
id: 20260820T143000Z-orchestrator-decision-122-branches-and-37-worktrees-removed-nothing-unmerged-existed-to-keep-5c2d8e91
kind: decision
by: orchestrator
role: orchestrator
task: branch-hygiene-2026-08-20
at: 2026-08-20T14:30:00Z
verified_by:
confidence: high
refs:
  - AGENTS.md#branching-model
  - ABC-050
  - ABC-113
supersedes:
---

# 122 branches and 37 worktrees removed. **NOTHING UNMERGED EXISTED — so nothing was kept, and nothing was lost**

## The question asked was "which are not merged, and merge those" — the answer is NONE

Measured before anything was touched: **every single branch tip in the repository was already an
ancestor of `main`.** 78 `grugops/*` branches, 43 `worktree-agent-*` branches and `qe-abc032-work` —
**122 in total, 0 unmerged.** There was no merging to do. The instruction's first half found nothing
to act on, and that is the finding, not a formality.

## The four safety checks, ALL run BEFORE the first deletion

Deletion is the one thing that cannot be retracted by an append, so it was measured first:

1. **Unmerged tips** — `git merge-base --is-ancestor <tip> main` over `refs/heads`, every ref.
   **Zero exceptions.**
2. **Uncommitted work** — `git status --porcelain` inside **each of the 37 worktrees**.
   **All zero.** Not sampled; every one.
3. **Stashes** — `git stash list`. **Zero.** These would not appear in check 2, which is why they
   were checked separately.
4. **Detached HEADs** — a worktree parked off-branch could hold commits no branch names.
   **None.**

## The deletion used a flag that REFUSES, rather than an assertion that it was safe

Every branch was removed with **`git branch -d`**, never `-D`. `-d` refuses to delete a branch that
is not merged — so the guard was **enforced by the tool on each of the 122 deletions**, not by my
having measured beforehand and trusted myself. **Result: 122 deleted, 0 refused.** Had a single one
been unmerged, git would have kept it and said so.

Likewise `git worktree remove` was tried **without** `--force` first, every time. **All 37 came out
clean and NOT ONE needed forcing** — independent corroboration of check 2, from a different mechanism.

## What this retires — a live condition that several merged records still describe as present

**32 of the 37 worktrees were IN-REPO, under `.claude/worktrees/`.** That is the condition four hops
worked around by hand and wrote into the record as current:

- `npm run lint` (`biome check .`) exiting 1 on 32 sibling `biome.json` files — worked around at
  `ABC-043`, `ABC-044` and `ABC-113` by substituting `npx biome check src/`.
- The default test lane sweeping other branches' tests — measured at **245 files / 6993 tests** on a
  lane `NFR-008` sizes for 999, and named on the board as a **"GATE INTEGRITY DEFECT FOUND AND NOT
  PATCHED"**.

**Both were already fixed by the owner's `2bef492`** (`biome.json` + `vitest.config.ts` excludes);
this removes the thing those excludes were excluding. Gate on `main` after all deletions, unchanged:
lint **0** (72 files), typecheck **0**, `npx vitest run` **40 files / 1207 tests / skip 0**.

**The 5 remaining worktrees were under `/private/tmp/…/scratchpad` and belonged to TWO OTHER Claude
sessions**, neither of them this one. They were clean and merged, so removing them destroyed nothing —
but it IS a cross-session action and is named here rather than folded into the count.

## Why deleting them is the documented model, not just tidiness

`AGENTS.md` § `Branching model`: *"Work happens on a short-lived `grugops/<task>` branch … and merges
to `main` as soon as it is green. No long-lived feature branches."* **122 merged branches standing
open is that model not being finished, not a second opinion about it.** The names are not lost —
every one survives in its merge commit message, which is where trunk-based development keeps them.

## What was NOT done

- **`main` was not touched.** Still `597b466`, working tree clean, gate green before and after.
- **Nothing was force-deleted and nothing was pruned by `-D`.**
- **`ABC-050`** — the open ticket that `vitest.config.ts` is read by no static tool — **is untouched
  and still open.** The owner's excludes changed that file; whether `ABC-050`'s criteria still describe
  it is a re-read somebody owes, and it is not this cleanup's.
- **No board column moved and no ticket changed state.** This is repo hygiene, not delivery.
