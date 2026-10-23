---
subtask: scribe-drift-2026-10-23
role: agents-md-scribe
ticket: AGENTS.md
ref: .grugops/context/scribe-drift-2026-10-23/
width: 2 (records only; disjoint files from arch-runbook-deploy-holder)
---

# Fix three factual drifts in AGENTS.md / the command log / standing rulings (records only)

## Do
1. **Startup questions (ABC-200):** AGENTS.md "Dev / run" and `memory-bank/90-agents-md-command-log.md` § "Dev / run" don't mention that `npm run chess` asks colour and difficulty on a terminal (skipped by flags or non-TTY stdin). Add it, verified against `src/startup-questions.ts` and `src/cli.ts`.
2. **The `--` separator wording:** AGENTS.md says that without `--` npm "silently drops the flag and runs with defaults". On npm 11.20.0 that holds only for value-less flags (`--ascii` exits 0); for value flags npm eats the flag name and the CLI refuses the value (`npm run chess --colour black` exits 1). Re-verify yourself (`npm --version`, run both, read-only) and correct the wording.
3. **`45-standing-rulings.md` § Deployment posture** still says "no `bin`/`main`/`exports`/`files`" — wrong since ABC-168. Add a dated correction pointing to the owner-approved notes on ADR-0007 (`…0f003634`) and ADR-0018 (`…5ffd0ca7`); the baseline tuple is `[true,{"skytalix":"dist/uci.js"},false,false,false]`. Keep the old text visible. No ruling changes.
- Follow your role's rules for AGENTS.md edits (command-log entry etc.).

## Fences
- Work on `grugops/scribe-drift-2026-10-23` (worktree `../wt-scribe-drift-2026-10-23` from `main`). Only `AGENTS.md`, `memory-bank/90-agents-md-command-log.md`, `memory-bank/45-standing-rulings.md` and your notes. Not `memory-bank/70-runbook.md` (parallel hop). No `src/`, `package*.json`, `plans/`, ADRs, config. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/scribe1023/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `scribe-drift-2026-10-23`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
