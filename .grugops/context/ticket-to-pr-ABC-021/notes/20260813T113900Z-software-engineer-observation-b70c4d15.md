---
id: 20260813T113900Z-software-engineer-observation-b70c4d15
kind: observation
by: software-engineer
at: 2026-08-13T11:39:00Z
verified_by:
confidence: high
refs:
  - ABC-021
  - plans/board.md
  - plans/traceability.md
  - 20260813T112448Z-software-engineer-observation-a347e08a
  - 20260813T112448Z-software-engineer-artifact-ref-e933933b
supersedes:
---

# Two of my own numbers were stale by the time I published them — corrected at the source

> **Hand-authored**, per the sibling notes. Not a `finding`. `supersedes` is deliberately EMPTY:
> this corrects two statements in `…-observation-a347e08a` and one in `…-artifact-ref-e933933b`;
> everything else in both notes stands, and folding either of them out of the replay would lose the
> four other items they carry.

## 1. `plans/board.md` — I described my BRANCH POINT and called it the board

`…-observation-a347e08a` § 4 says *"`ABC-021` still sits in `Ready` (WIP 2/8) there"* and *"the
ticket was never moved INTO `In Development`"*. **True at `06c5427`, which is where my worktree is
pinned, and stale by the time I wrote it.**

Checked at the source after committing — `git show main:plans/board.md`, not a row that carries the
claim:

- `main` has advanced to **`87e771a`** (*"docs(board): grug pull two, Ready 0/8 and In Development
  2/3"*), ONE commit past my branch point.
- `## Ready` is **0/8**. `## In Development` is **2/3** and holds
  **`[ABC-021] … owner: Software Engineer, pulled: 2026-08-13 at task `abc021-2026-08-13`, DoR
  10/10`** alongside `ABC-026`.

**So `Ready → In Development` was already made by the Orchestrator, and the ONLY board move still
owed is `In Development → In Review`** — the Software Engineer's own transition under Workflow 04,
which this subtask's boundaries forbid me to write. `plans/traceability.md`'s `Status` cell and its
`_Updated:` line were corrected in place to say this.

**The lesson is this board's own recurring one, and I walked into it from the other side.** Six
stale `blocked-until` rows have been found here because *"the row is corrected when the blocker is
checked, not when the blocker merges"*. Mine is the same failure with the tips swapped: I read the
board out of my pinned worktree and reported it as the board's state. **A statement about a shared
file must name the tip it was read from, and a worktree pinned at a branch point is not that tip.**

## 2. The diff is `+89/−10`, not `+88/−10`

`src/turn-loop.ts`. I measured `+88` before a last comment edit (the transition-16 comment's opening
sentence, which replaced four lines with five) and did not re-measure after it.
`git diff --numstat main...HEAD` reads **`89 10 src/turn-loop.ts`**. Corrected in
`plans/traceability.md`; the `artifact-ref` note's table still reads `+88 / −10` and is superseded
by this line rather than edited, because notes are append-only.

The other numbers in that note were re-checked at the same time and hold: `src/turn-loop.test.ts`
**+206 / −0**, `plans/traceability.md` one table row, 28 test files before and after, 814 tests.

## 3. Rebase exposure: none in `src/`

`git diff --stat $(git merge-base main HEAD)..main -- src/` is **empty** — the one commit `main`
gained is board prose. The branch is one commit behind and there is nothing in `src/` to conflict,
so the merge this branch is waiting for needs no `src/` reconciliation from me.
