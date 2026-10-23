---
subtask: arch-runbook-ABC-212
role: architect-design
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/arch-runbook-ABC-212/
width: 3 of 3 (records only)
---

# ABC-212 A11: runbook § Operate names levels 1–7

## Do
- Own worktree from `grugops/scribe-ABC-212` (`2ba55ea7`) on new branch `grugops/arch-runbook-ABC-212`. Dated edit to `memory-bank/70-runbook.md` § Operate: `--difficulty 1–7`, default 5 is no longer the hardest, levels 6/7 think 5 s/30 s a move (hard ceilings 7 s / 32 s per NFR-004's owner text). Old wording visible. Verify against the branch's `src/cli-options.ts`/`src/levels.ts`.

## Fences
- Only `memory-bank/70-runbook.md` and your notes. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/runbook212/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-runbook-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
