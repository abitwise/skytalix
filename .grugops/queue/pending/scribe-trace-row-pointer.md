---
subtask: scribe-trace-row-pointer
role: agents-md-scribe
ref: .grugops/context/scribe-trace-row-pointer/
branch: grugops/scribe-trace-row-pointer (from main @ the main tip at your start); worktree ../wt-scribe-trace-row
width: 2 (beside bapm-rule-QE-165; disjoint files)
---

# Scribe: point `AGENTS.md`'s Traceability line at the 10-cell trace row rule (owner go, 2026-10-21)

BA/PM set a forward rule (`…d2b9bf09`, adopted by the Orchestrator `…34da66ba`): every row appended to `plans/traceability.md`'s table has exactly 10 GFM cells in header order. ABC-165 (merged `17f64ea4`) wrote the rule and its template into the trace's own note. The owner approved a pointer in `AGENTS.md`.

## Do
- `AGENTS.md` is 24,560 of 24,576 bytes; the budget test is in `src/cli.test.ts` (BA/PM cited `:2484`). Add the shortest pointer that fits, on `:181` (`- Traceability: \`plans/traceability.md\``), e.g. ` (10 cells/row)`. Measure the byte count after; it must stay ≤ the budget, and the budget test must pass.
- Change nothing else in `AGENTS.md`. If no pointer fits, stop and report.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. Heap: `npm test` sets 128 itself. No timing.

## Fences
- Only `AGENTS.md`. Never touch `plans/`, `src/`, other worktrees.
- Commit on your branch only. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `scribe-trace-row-pointer`). **Pass your worktree as the context root explicitly**; the default root is the plugin's own directory. Write notes inside your worktree. Take every `at` from `date -u`.
- Write `.grugops/queue/done/scribe-trace-row-pointer.md` (brief + `## Result`: tip, byte count before/after, gates) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`):
  `| Scribe (trace-row pointer) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
  `—` for an empty cell; a literal `|` is `\|`, inside code spans too.
