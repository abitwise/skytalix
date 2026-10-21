---
subtask: bapm-rescope-ABC-164
role: ba-pm
ticket: plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md
ref: .grugops/context/bapm-rescope-ABC-164/
width: 2 (beside bapm-rule-QE-165; disjoint pages)
---

# BA/PM: re-scope ABC-164. Its two counts are already gone; the headroom problem is not (owner go to start ABC-164, 2026-10-21)

The Orchestrator read the page against `main` `89fd4e83` before pulling it:
- **`Test (all)` (`AGENTS.md:82-84`):** no count left; `affee860` (ABC-173) removed `57 / 1775`.
- **`CLI_DEEP` (`AGENTS.md:123-126`):** no count left; it reads "(count: the test file)" (an earlier Scribe hop today).
- **The four rule strings** (`exits 124`, `never SIGKILL`, `NOT DEFINED, not skipped`, `Run at QE`) are all present.
- **`wc -c AGENTS.md` = 24,575** of the 24,576 budget, after `scribe-trace-row-pointer` added ` (10 cells/row)` (`89fd4e83`). **1 B of headroom.** So A1 (`< 24,576`) and A2/A3 hold at base with no change: the page no longer tests its value.
- What is still true: the next `AGENTS.md` line cannot land, and owed lines are waiting (e.g. the writer's `contextRoot` pointer the Orchestrator has been carrying in briefs; QE-184-c's `--reporter=verbose` child-count rule; `ABC-146`'s owed `node`-route line, if still owed).

## Decide
1. **The new problem and value.** Re-state ABC-164 as buying back headroom (or close it and cut a new ticket, your call). Set a measurable target (bytes freed, or headroom in edits at `ABC-109`'s 1,159 B/edit), and what may be cut or moved to `memory-bank/90-agents-md-command-log.md` without losing a rule or trap. Keep raising the budget out of scope unless you rule otherwise with a reason.
2. **Owed lines.** List the lines waiting for headroom, and say whether they land in this ticket or after it.
3. **Acceptance** that is red at base and green at head; read on joined text; fences; the budget test in `src/cli.test.ts` stays green.
4. **Size, priority** (the page's P2 promotion trigger — "a ticket that must add text to `AGENTS.md` is cut or pulled" — may already have fired), **DoR**; place it. Builder: the Scribe, then QE.

## Fences
- Records only: the ABC-164 page (or a new page), `plans/board.md` (cards, header counts, one `_Updated:` line prepended above the first existing one), notes. No `AGENTS.md`, `src/` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rescope-ABC-164`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-rescope-ABC-164.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace rows: exactly 10 cells each, in header order** (rule `…d2b9bf09`):
  `| ABC-164 (BA/PM) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
