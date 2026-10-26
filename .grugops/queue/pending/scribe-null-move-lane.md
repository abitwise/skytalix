---
subtask: scribe-null-move-lane
role: agents-md-scribe
ref: .grugops/context/scribe-null-move-lane/
branch: new records branch grugops/scribe-null-move-lane from main, worktree ../wt-scribe-null-move-lane
width: 1 of 2 — records only (you may run the one lane command once to confirm it; nothing else)
---

# AGENTS.md: the SEARCH_DEEP lane line for the null-move tests (ABC-208)

## Do
- Read Orchestrator `orch-2026-10-26q/…836cb92d` and QE `qe-ABC-208/…0477ac64` (lane run: 44/44 in 46.0 s).
- Add the lane line to AGENTS.md beside the existing SEARCH_DEEP lane lines, in their format and voice:
  `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts`
  with a short purpose in the same style as its neighbours (the ABC-208 null-move rows: door, zugzwang guard, oracle).
- Check that the file exists on main at `b5c67ab7` and that the command's flags match how the neighbouring lines are written. If they differ, follow the neighbours and say so.
- Keep AGENTS.md's 12 coding rules untouched.

## Fences
- Work only in your worktree. AGENTS.md only, plus your notes.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `scribe-null-move-lane`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
