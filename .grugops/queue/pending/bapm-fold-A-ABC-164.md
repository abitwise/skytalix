---
subtask: bapm-fold-A-ABC-164
role: ba-pm
ticket: plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md
ref: .grugops/context/bapm-fold-A-ABC-164/
width: 2 (beside ticket-to-pr-ABC-186; disjoint files)
---

# BA/PM: write the owner's Option A split into ABC-164 and re-score DoR

The owner chose **Option A** of the Scribe audit and kept ABC-164 at **P2** (Orchestrator record `…18e4ada0`). The audit is `.grugops/context/scribe-audit-agents-md/notes/` (`…ffbb746f` block table, `…38d2af93` proposed split) and `.grugops/queue/done/scribe-audit-agents-md.md`. Your re-scope is `…45c39699` (DoR 8/10, items 2 and 4 waiting on the audit).

## Do
- Write Option A into the page's Scope: which blocks stay, which split, which move, to which file and heading (`memory-bank/45-standing-rulings.md` new, `90-agents-md-command-log.md`, `40-contributing.md`, `00-index.md`), and the pointers `AGENTS.md` keeps. Option B is out of scope (no `src/` edit; all 17 vitest command lines stay).
- Make `A2`/`A3` concrete from the audit's list; keep `A1` (≤ 18,432 B; the audit estimates ~14,400) and the fixed keeps (17 commands, `Dev / run` slot, the 12 numbered rules, `§ Kit vs state` heading, Safety rules, note-writer block with O1, gate commands, `remain THREE`). O2 and O3 land in the command log; O3's command must not appear in backticks in `AGENTS.md` (the `ABC-173` A3 parser would count an 18th).
- The budget constant stays 24,576 in this ticket; lowering it is an open owner decision, not in scope.
- Re-score DoR. At 10/10 move the card to Ready. Builder: the Scribe, then QE.

## Fences
- Records only: the ABC-164 page, `plans/board.md` (the ABC-164 card, header counts, one `_Updated:` line prepended above the first existing one; re-read the board right before editing — the Orchestrator moves ABC-186 in parallel), notes. No `AGENTS.md`, `memory-bank/`, `src/` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-fold-A-ABC-164`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-fold-A-ABC-164.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (rule `…d2b9bf09`):
  `| ABC-164 (BA/PM) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
