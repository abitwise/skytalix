---
subtask: bapm-rule-QE-194
role: ba-pm
tickets: [ABC-194]
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-194/
width: 2 (beside qe-ABC-195)
---

# BA/PM (records only): rule QE-194-a (LOW proposed) and QE-194-b/-c/-d (INFO) from ABC-194's QE gate. ABC-194 is merged; this gates nothing

## Read first
- QE verdict and gap register `.grugops/context/qe-ABC-194/notes/20261021T201352Z-qe-e2e-decision-ac075665.md`, mutants `…2412ce70`; the `## QE` section on ABC-194's page.
- Your own `bapm-rule-QE-192` notes (`…09a201ba`: QE-192-b accepted because a parser check cannot resolve bindings or off-switches keyed outside its reach); ABC-173's page; `ADR-0008`; `tools/grugops/heap-guard.js`.

## Do
- **QE-194-a** (an off-switch on the guard's *inputs* — e.g. `env ? { heap_size_limit: 0 } : v8.getHeapStatistics()`, overwriting `v8.getHeapStatistics`, `if (env) return;` inside `guard` — passes every gate): rule cut / fold / accept. Weigh it against the QE-192-b precedent: each closure pins one more spelling while a switch keyed on a file or `argv` stays out of a parser's reach. If you lean to a cut, say what a closure must hold and measure it at base on a scratch copy outside the repository; if you need a Security/NFR rating first, say so and stop there rather than guess one.
- **QE-194-b** (two weakenings of the check survive its own plant table; two more plants close it), **QE-194-c** (`npm test` exit 0 alone does not prove a run happened; `last-run.json` does), **QE-194-d**: rule each.
- If anything is cut, one `_Updated:` line at the top of `plans/board.md` and the card; next free id ABC-196. Otherwise only a dated line on ABC-194's page.

## Fences
- Only `plans/` (board, any new ticket page, a dated line on ABC-194's page) and your notes. No `src/`, `tools/`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`. Commit nothing. A QE agent works in `../wt-qe-ABC-195`; touch nothing of theirs.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-194`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-rule-QE-194.md` + `.claim.md`, main's tree, uncommitted).
