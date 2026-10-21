---
subtask: scribe-ABC-164
role: agents-md-scribe
tickets: [ABC-164]
branch: grugops/ABC-164 (from main @ the main tip at your start); worktree ../wt-ABC-164
ref: .grugops/context/scribe-ABC-164/
width: 2 (beside qe-ABC-186; disjoint files)
---

# Scribe: ABC-164: split `AGENTS.md` per the owner's Option A — keep what every role session needs, move the rest word for word to named files reachable by a pointer. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md` (DoR 10/10 after `bapm-fold-A-ABC-164`): every criterion `A1`–`A7`, the 39-block Scope table, the fixed keeps, the corrections C1 (the `PERFT_DEEP=1` line stays) and C2 (`## Safety rules` stays whole), and the trap (no new backticked `npx vitest` text in `AGENTS.md`).
- The audit `.grugops/context/scribe-audit-agents-md/notes/` (`…ffbb746f`, `…38d2af93`), BA/PM `…d197dcbd`, `…a7cd9ce2`, and the owner record `…18e4ada0`.

## Do
- Create the worktree `../wt-ABC-164` on `grugops/ABC-164` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Read every criterion at base first, with scripts, on joined text.
- Implement exactly the page's Scope: move text **byte for byte** (no rewording beyond what the page names), keep headings so `§` citations resolve, land O1 in `AGENTS.md`, O2 and O3 in the command log.
- Show `A4` (every removed line is found in a target file) with a script and list any miss.
- Gates on the tip: lint, typecheck, build; `npm test` + `.test-results/last-run.json` success (59 / 1987, equal to base; the `ABC-042`, `ABC-059`, `ABC-065`, `ABC-067`, `ABC-071`, `ABC-109` and `ABC-173` rows must stay green); skip-integrity `--skip-count 0`. `npm test` sets heap 128 itself; one run at a time. No timing.
- Measure the UAT waiver in AGENTS.md's form (must print nothing). Report `wc -c AGENTS.md` before and after, and the headroom in edits at 1,159 B/edit.

## Fences
- Exactly the 5 files the page allows. No `src/`, `plans/` (except nothing), or other worktrees. The budget constant stays.
- Commit on `grugops/ABC-164` only. Never push or merge.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `scribe-ABC-164`. **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree. Include a `kind: decision`.
- Write `.grugops/queue/done/scribe-ABC-164.md` (brief + `## Result`: tip, per-criterion results, bytes, gates, waiver) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`); do NOT append it yourself:
  `| ABC-164 (Scribe) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
