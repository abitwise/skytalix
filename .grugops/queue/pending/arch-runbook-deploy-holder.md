---
subtask: arch-runbook-deploy-holder
role: architect-design
ticket: memory-bank/70-runbook.md
ref: .grugops/context/arch-runbook-deploy-holder/
width: 2 (records only; disjoint files from scribe-drift-2026-10-23)
---

# Align the runbook's "who holds deploy" wording with the 2026-08-15 owner directive (records only)

## Do
- Your STOP (`…b9dc8455`) is ruled by the Orchestrator: it is drift, not a new governance call. The owner decided deploy authority on 2026-08-15 (`memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED…"; read in `45-standing-rulings.md` lines 142–148). Correct § Deploy and § On-call with dated edits that state that ruling exactly as recorded: the agent may deploy, no deploy is needed, nothing runs anywhere but locally, and `production_requires_human_confirmation` stays `true` (a human confirms anything production). Keep the old wording visible.
- Quote, don't paraphrase, where the directive's words are the authority. If the recorded directive and the runbook genuinely conflict in a way the directive does not settle, STOP again and quote both.

## Fences
- Work on `grugops/arch-runbook-deploy-holder` (worktree `../wt-arch-runbook-deploy-holder` from `main`). Only `memory-bank/70-runbook.md` and your notes. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/runbook2/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-runbook-deploy-holder`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
