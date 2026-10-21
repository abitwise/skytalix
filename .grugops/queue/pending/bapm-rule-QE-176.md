---
subtask: bapm-rule-QE-176
role: ba-pm
tickets: [ABC-176]
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-176/
width: 2 (beside security-nfr-QE-191-a)
---

# BA/PM (records only): rule QE-176-a/-b (LOW) and QE-176-c/-d (INFO) from ABC-176's QE gate. ABC-176 is merged; this gates nothing

## Read first
- QE verdict and gap register `.grugops/context/qe-ABC-176/notes/20261021T164420Z-qe-e2e-decision-75bc28e0.md`, mutants `…fbdf5a60`, ordering `…c9b3023e`; the `## QE` section on ABC-176's page.
- SE residuals `.grugops/context/ticket-to-pr-ABC-176/notes/20261021T162606Z-software-engineer-observation-74594565.md`; the ABC-176 page; `tools/grugops/heap-guard.js` and `result-file-reporter.js` headers.

## Do
- For each of QE-176-a (no test pins `setup` passing `process.stdout`; the call-site stderr mutant survives the suite), QE-176-b (line-before-JSON order rests on vitest internals; nothing re-runs the capture on a vitest upgrade), QE-176-c, QE-176-d: rule **cut** (a new ticket, sized, DoR-scored, measured at base where you can), **fold** into an existing ticket, or **accept** (with reason, owner, trigger). Prefer one small ticket if a and b share a home.
- QE-176-d: a dated erratum line on ABC-176's page (budget is 18,432 per ABC-187; A2 feasibility settled by SE and QE). Do not rewrite history on the page. Do not edit the `bapm-cut-ABC-176` notes; say what you'd do about their `sealed: false` state.
- One `_Updated:` line at the top of `plans/board.md`; any new card in its column. Next free id: ABC-192.

## Fences
- Only `plans/` (board, ABC-176 page, any new ticket page) and your notes. No `src/`, `tools/`, `AGENTS.md`, `memory-bank/`, branches or worktrees. Commit nothing. Another agent (Security/NFR) writes notes under `.grugops/context/security-nfr-QE-191-a/`; touch nothing of theirs.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-176`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/bapm-rule-QE-176.md` + `.claim.md`, main's tree, uncommitted).
