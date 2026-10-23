---
subtask: scribe-ABC-212
role: agents-md-scribe
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/scribe-ABC-212/
branch: grugops/ABC-212 (73339912)
width: 3 of 3
---

# ABC-212 A11: AGENTS.md "Dev / run" names levels 1–7 (makes U3 green)

## Do
- Own worktree `../wt-scribe-ABC-212` on new branch `grugops/scribe-ABC-212` **from `grugops/ABC-212` (`73339912`)**, own `npm ci --ignore-scripts`.
- Edit AGENTS.md "Dev / run": `--difficulty 1|2|3|4|5` → `--difficulty 1|2|3|4|5|6|7` exactly once, no second list, no new `--` token; say the default 5 is no longer the hardest and levels 6/7 think 5 s / 30 s a move. Matching entry in `memory-bank/90-agents-md-command-log.md`. Stay within the AGENTS.md size budget.
- Prove it: `npm test` on your branch → 0 failures (U3 green); lint. Report the counts.

## Fences
- Only `AGENTS.md`, `memory-bank/90-agents-md-command-log.md`, your notes. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/scribe212/`. Explicit context root. Never push, force, amend or rebase; never merge into `main` or into `grugops/ABC-212`; don't touch the remote.

## Publish
- Seal notes (task `scribe-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
