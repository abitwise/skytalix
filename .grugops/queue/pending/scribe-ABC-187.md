---
subtask: scribe-ABC-187
role: agents-md-scribe
tickets: [ABC-187]
branch: grugops/ABC-187 (tip 1151e7c8; SE code 494f7862) — commit ON THIS BRANCH in the SE's worktree ../wt-ABC-187
ref: .grugops/context/scribe-ABC-187/
width: 2 (beside qe-ABC-185)
---

# Scribe: ABC-187's folded-in `AGENTS.md:7` line — "targets ≤ 24,576 B" → "≤ 18,432 B" (byte-neutral)

The Orchestrator folded the owed line into ABC-187 (page § Out of scope, first bullet; `A6`'s "only if folded in" clause; BA/PM `…52428ef9`). The SE has lowered `AGENTS_MD_BUDGET_BYTES` to 18,432 on `grugops/ABC-187`.

## Do
- In `../wt-ABC-187` (branch `grugops/ABC-187`; the SE has finished and touches nothing more), change only the number on `AGENTS.md:7`: `24,576` → `18,432`. `wc -c AGENTS.md` must stay 15,606. No other `AGENTS.md` line changes.
- Gates on the new tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987; the `ABC-109` guard row green against 18,432); skip-integrity `--skip-count 0`. No timing.

## Fences
- Only `AGENTS.md:7`. No `src/`, `plans/`, `memory-bank/` edits. Commit on `grugops/ABC-187` only. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `scribe-ABC-187`). **Pass the worktree `../wt-ABC-187` as the context root explicitly.** Take every `at` from `date -u`. Write notes inside that worktree.
- Write `.grugops/queue/done/scribe-ABC-187.md` (brief + `## Result`: new tip, before/after line, bytes, gates) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-187 (Scribe) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
