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

## Result

- Branch `grugops/arch-runbook-ABC-212` (worktree `../wt-arch-runbook-ABC-212`) from `grugops/scribe-ABC-212` `2ba55ea7`. Runbook commit `8cc78fee`; notes commit on top `c0508fe9` (tip `c0508fe922fed85fff5221d18d54ce621033c350`). Not pushed, not merged.
- `memory-bank/70-runbook.md` § Operate, old: `--difficulty 1|2|3|4|5` (default 5, `ADR-0045`); prompt `difficulty (1|2|3|4|5) [5]: `. New: `--difficulty 1|2|3|4|5|6|7` (default 5, `ADR-0045`); prompt `difficulty (1|2|3|4|5|6|7) [5]: `; a new bullet says levels go 1 weakest to 7 strongest, default 5 is no longer the hardest (up to 3 s), 6 thinks 5 s and 7 thinks 30 s a move, hard ceilings 7 s / 32 s (`NFR-004` owner text, `ADR-0045` § AMENDMENT 2026-10-24). Old wording kept in a dated `[CHANGED 2026-10-24]` bracket; one `_Updated_` header line.
- Checked on `2ba55ea7`: `src/cli-options.ts` (1..7, default 5), `src/levels.ts` (5 = 3 000 ms, 6 = 5 000 ms, 7 = 30 000 ms; ceilings 5/7/32 s), `src/startup-questions.ts:120-124` (prompt list = `DIFFICULTY_VALUES.join("|")`).
- Open, fenced (Security/NFR's): `plans/nfr-catalog.md` `NFR-004` row on this branch still reads "hard ceiling 5 s at any difficulty".
- No test reads the runbook; no gate run (records only).
- Note (task `arch-runbook-ABC-212`, in the worktree's `.grugops/context/`): `20261023T222657Z-architect-design-decision-49e3ba84`.
- Trace row (Orchestrator appends):
  `| ABC-212 (Arch) | A11: runbook § Operate names --difficulty 1..7, default 5 not hardest, levels 6/7 at 5 s / 30 s (ceilings 7 s / 32 s) | EPIC-004 | NFR-004 | ADR-0045 § AMENDMENT 2026-10-24, ABC-200 | grugops/arch-runbook-ABC-212 @ c0508fe9<br>memory-bank/70-runbook.md, context note | records only; wording checked against src/cli-options.ts, src/levels.ts, src/startup-questions.ts | — | — | A11 runbook part closed; merge grugops/arch-runbook-ABC-212 into grugops/ABC-212 next; NFR-004 catalog row still 5 s (Security/NFR) |`
