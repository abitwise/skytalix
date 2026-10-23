---
subtask: arch-runbook-operate
role: architect-design
ticket: memory-bank/70-runbook.md
ref: .grugops/context/arch-runbook-operate/
width: 1 (records only)
---

# Bring memory-bank/70-runbook.md § Operate up to date (records only)

## Do
- § Operate is stale (`…5ffd0ca7` follow-up). Rewrite it with a dated correction, old wording kept visible as dated history, to what `main` does today: how to run the game (`npm run chess`, flags, startup questions), the UCI engine (`npm run uci`, `npm run build` → `dist/uci.js` / `skytalix`), the test lanes as AGENTS.md spells them (cite, don't restate at length). Verify every command on `main` (read `package.json`, run read-only where cheap). Short and exact.
- Sweep the rest of the runbook for the same staleness and fix only plain factual drift the same way; anything that would change a decision → STOP and report.

## Fences
- Work on `grugops/arch-runbook-operate` (worktree `../wt-arch-runbook-operate` from `main`). Only `memory-bank/70-runbook.md` and your notes. No `src/`, `package*.json`, `plans/`, ADRs, `AGENTS.md`, config. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/runbook/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-runbook-operate`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
