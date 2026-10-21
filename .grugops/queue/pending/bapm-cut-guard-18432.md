---
subtask: bapm-cut-guard-18432
role: ba-pm
ticket: (new) lower the AGENTS.md byte guard to 18,432
ref: .grugops/context/bapm-cut-guard-18432/
width: 3 (beside ticket-to-pr-ABC-185 and scribe-amend-90; records only)
---

# BA/PM: cut the XS ticket that lowers the `AGENTS.md` byte guard from 24,576 to 18,432 (owner decision `…cba9c8eb`)

The owner decided: the guard `AGENTS_MD_BUDGET_BYTES` in `src/cli.test.ts` (ABC-109 A5) drops from 24,576 to **18,432**. `AGENTS.md` is 15,606 B after ABC-164 (`1ce736af`), so 2,826 B (≈ 2.4 edits at 1,159 B/edit) of room remain under the new guard.

## Cut
- Next free id **ABC-187** (verify in `plans/tickets/`). Size XS; priority your call (the owner wants it done now). Builder: SE, then QE.
- Scope: the constant, and any test name, comment or message in `src/cli.test.ts` that states 24,576 or "24 KiB" for this guard; nothing else. Name every occurrence at `main`.
- Acceptance red at base, green at head: e.g. a scratch `AGENTS.md` of 18,433 B passes the base guard and fails the head guard; the real `AGENTS.md` (15,606 B) passes head; `npm test` counts equal base (59 / 1987), skips 0; 0 production lines (waiver form empty).
- Also: the stale comment at `src/cli.test.ts:2242` ("13 further closers"; 8 remain after ABC-164, QE-164-h). Fold it in only if it sits in the same file and costs one line; say which.
- Score DoR; at 10/10 place it in Ready.

## Fences
- Records only: the new ticket page, `plans/board.md` (one card, header counts, one `_Updated:` line prepended above the first existing one; re-read the board right before editing — the Orchestrator moves ABC-185 in parallel), notes. No `src/`, `AGENTS.md` or `plans/traceability.md` edits. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-guard-18432`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-cut-guard-18432.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| {ticket} ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
