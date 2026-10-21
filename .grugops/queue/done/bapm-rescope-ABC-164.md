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

## Result

**DONE.** Records only, uncommitted on `main`: base `a222592b`, `main` at `3d36999b` on finish; `AGENTS.md` is byte-equal to `89fd4e83`'s.
- **Touched:** the ABC-164 page, `plans/board.md` (the ABC-164 card plus one `_Updated:` line prepended; no header count changed, because ABC-164 stays in Backlog), and two notes.
- **Notes:** both sealed with `admitAndAppend`, `contextRoot` = this checkout's `.grugops/context`. Both returned `findings: []` and were read back with `readContext`:
  - `20261021T124905Z-ba-pm-observation-c8a818d5`: base readings, what pins `AGENTS.md`, the owed-line sources, the byte estimate.
  - `20261021T124920Z-ba-pm-decision-45c39699`: the rulings below.

**Read first.** The task context held the Orchestrator's owner-direction note `…c6bf41be` (with the clock note `…d9a75204`): *"what is not necessary for every role session should be moved out…"*. That note routes the final cut through `scribe-audit-agents-md`, so this hop's output is input to that re-score.

**1. Problem and value.** ABC-164 is kept, not closed, and re-stated.
- *Problem:* `AGENTS.md` is 24,575 of 24,576 B (1 B, 0.0 edits), three owed lines cannot land, and every session reads on-demand text. BA/PM estimates about 11.9 KB of it: UNKNOWN - verify by the audit.
- *Target:* `wc -c AGENTS.md` ≤ **18,432 B** with O1 included. That is ≥ 6,144 B, about **5.3 edits** at 1,159 B/edit. The audit may lower the target, never raise it.
- *What may move:* any block the audit classes on demand. It moves verbatim to `memory-bank/90-agents-md-command-log.md` or a named `memory-bank/` file, behind a one-pointer link.
- *What may not move:* all 17 vitest commands (ABC-173 A3 counts ≥ 17, and base has exactly 17); the Dev/run slot (ABC-042 A1, ABC-065/067/071, ABC-059); the 12 rules and their numbering; Kit vs state, Safety, the writer blockquote and the gate commands; `remain THREE`.
- *Budget:* the 24,576 B budget is unchanged. Raising it is out of scope. Lowering it is an owner follow-up, because it is a `src/` constant.

**2. Owed lines, all landing in this ticket.**
- **O1, `contextRoot` pointer:** in `AGENTS.md`.
- **O2, QE-184-c `--reporter=verbose` child-count rule:** in the CLI lane's on-demand text; it costs no `AGENTS.md` bytes.
- **O3, ladder comment correction to route V:** `LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 … --reporter=verbose` with ADR-0038 addendum 2, per Orchestrator `…6a2f9d03`, which ruled it "ride with ABC-164".
- **Not owed:** ABC-146's `node` line (moot, route V) and QE-159-f's line (landed in `8187ee19`).

**3. Acceptance A1–A7** (see the page). Each criterion is red at base and green at head, except A4, a conservation read at head:
- A1: bytes ≤ 18,432.
- A2: on-demand blocks absent.
- A3: each moved block has a pointer naming file § heading; the heading occurs once.
- A4: removed lines found in the targets; 0 misses beyond O2, O3 and the pointers.
- A5: `exits 124`, `never SIGKILL`, `NOT DEFINED, not skipped`, `Run at QE`, `RISK-ABC152-NEGWORKERS`, `RISK-ABC143-01` and `pgrep` survive; `remain THREE` stays in `AGENTS.md`.
- A6: base `contextRoot` 0, `reporter=verbose` 0, `plain node` 1.
- A7: `npm test` green with the pinned rows; 17 vitest commands; fence of `AGENTS.md` plus the named `memory-bank/*.md` files; 0 `src/` lines; `AGENTS_MD_BUDGET_BYTES` unchanged.

**4. Size, priority, DoR, column.**
- **Size and priority:** **S, P2** (was XS, P3). The promotion trigger fired: O3 rides here, O1 already put stray notes in the plugin cache, and the last 15 B are spent; the owner's direction comes on top. Re-size to M if the audit names more than 3 target docs or any rewording beyond O2/O3.
- **DoR 8/10: items 2 and 4 wait on the audit's per-block split table.** The ticket **stays in Backlog**.
- **Re-score trigger:** `.grugops/queue/done/scribe-audit-agents-md.md` exists. Then BA/PM writes the table into Scope 1 and A2/A3, and the ticket goes to Ready.
- **Builder:** the Scribe, then QE.

**Trace row for the Orchestrator to append** (`plans/traceability.md` was fenced; 10 cells, in header order):

| ABC-164 (BA/PM) | Re-scoped on the owner's every-session direction: AGENTS.md keeps what every role session needs, the rest moves behind one-pointer links; target ≤ 18,432 B; owed lines O1–O3 land here | — | — | ABC-109 budget; ABC-173 A3 pin; QE-184-c; ADR-0038 addendum 2 | main @ 3d36999b (records only, uncommitted)<br>plans/tickets/ABC-164-…md, plans/board.md, .grugops/context/bapm-rescope-ABC-164/ (2 notes) | — (no gates run; readings only: AGENTS.md 24,575 B, 17 vitest commands) | — | — | Backlog (stays); XS/P3 → S/P2; DoR 10/10 → 8/10 pending scribe-audit-agents-md |

**For the owner:**
1. Should the 24,576 B guard be lowered after this merges, to keep the freed headroom from refilling? That is one `src/cli.test.ts` constant, so it needs an Engineer hop.
2. Is P2 right, or does your direction make this P1?
