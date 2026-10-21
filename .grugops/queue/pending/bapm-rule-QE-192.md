---
subtask: bapm-rule-QE-192
role: ba-pm
tickets: [ABC-192]
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-192/
width: 2 (beside qe-ABC-193)
---

# BA/PM (records only): rule QE-192-a (LOW) and QE-192-b/-c/-d (INFO) from ABC-192's QE gate. ABC-192 is merged; this gates nothing

## Read first
- QE verdict and gap register `.grugops/context/qe-ABC-192/notes/20261021T175649Z-qe-e2e-decision-21079de0.md`, mutants `…5eac2736`; the `## QE` section on ABC-192's page.
- SE design `.grugops/context/ticket-to-pr-ABC-192/notes/…8fd17c58`; your own `bapm-rule-QE-176` notes (`…73efba41`); ABC-173's page (A4–A6, "never runs uncapped"); `tools/grugops/heap-guard.js`.

## Do
- For each of QE-192-a (a `try/catch` around `setup`'s guard call survives every gate and the run is no longer stopped — against ABC-173's "never runs uncapped"; QE's suggested closure: A1 also requires the call to be a direct statement of `setup`'s body), QE-192-b (shadowing `process` inside `setup`; QE recommends accept), QE-192-c (row fails on equivalent refactors), QE-192-d (A2 reads only vitest's `package.json`): rule **cut** (sized, DoR-scored, measured at base on a scratch copy outside the repository where you can), **fold**, or **accept** (reason, owner, trigger).
- One `_Updated:` line at the top of `plans/board.md`; any new card in its column. Next free id: ABC-194.

## Fences
- Only `plans/` (board, any new ticket page, a dated line on ABC-192's page if needed) and your notes. No `src/`, `tools/`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing. A QE agent works in `../wt-qe-ABC-193`; touch nothing of theirs.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-192`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-rule-QE-192.md` + `.claim.md`, main's tree, uncommitted).
