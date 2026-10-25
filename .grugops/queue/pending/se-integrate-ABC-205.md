---
subtask: se-integrate-ABC-205
role: software-engineer
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/se-integrate-ABC-205/
branch: new grugops/ABC-205-final from main, worktree ../wt-ABC-205-final
width: 3 of 3 (beside qe-ABC-216, qe-ABC-217; no real-clock timing, no engine games)
---

# Integrate ABC-205 onto current main (re-apply the restore, then the owner-word edits)

## Why
ABC-205's original code reached main early through a records merge (a20ae77f) and was taken back off by `7c9cd9b9` (Orchestrator `…c3d204a5`). Its code commits are therefore already ancestors of main, so **merging main into `grugops/ABC-205` would delete its code — do not do that.** Main has since gained ABC-206 (search speed, identical answers), ABC-212 (levels 6–7) and ABC-204 (rating harness).

## Do
- From current `main`: `git revert --no-edit 7c9cd9b9` (re-applies ABC-205's code; message names ABC-205), then `git merge --no-ff grugops/ABC-205` (`f3e14a00`: the owner-word edits 18a0570e — S1 maxDepth 10, drift bar 118 cp, quiescence cell 16x). Resolve conflicts against ABC-206/212 in favour of both changes' stated intent; any conflict you can't resolve by intent → STOP and name it.
- Verify: `git diff 4f650a45 grugops/ABC-205 -- src` equals the ABC-205 part of your diff vs main (show it); `src/evaluate.ts` equals `grugops/ABC-205`'s byte for byte unless ABC-206 touched it.
- Re-check ABC-205's own pins at the new base (node counts, drift max, mate-floor 0/180, quiescence ratio) — ABC-206 kept answers identical, so node pins should hold; report any that move with the reason. Pin moves outside the page's licensed list → STOP.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration), skips, `SEARCH_DEEP`, `ENGINE_DEEP`. No real-clock timing reading, no G6, no harness games (those are QE's alone run).

## Fences
- Only your worktree and `<scratchpad>/se205int/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task se-integrate-ABC-205). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
