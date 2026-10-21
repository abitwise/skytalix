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

## Result

- **ABC-164: Backlog → Ready, DoR 10/10** (was 8/10; items 2 and 4 now met). S and P2 hold. Builder: the AGENTS.md Scribe, then QE. The page: `plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md`. The board: the card is in Ready, the header is Ready 0/8 → 1/8, and one `_Updated:` line is prepended (board re-read after the Orchestrator's ABC-186 move). Records only: no AGENTS.md, memory-bank, src or traceability edits; nothing committed.
- **Option A written into Scope:** 39 blocks. 26 keep whole, 10 split (B02, B11, B17, B18, B20, B23, B31–B34), 3 move (B10, B12, B30).
  - Targets: NEW `memory-bank/45-standing-rulings.md` gets the five governance §§ verbatim.
  - `90-agents-md-command-log.md` gets new §§ "On-demand commands" (with a 15-row lane table), "Vitest worker cap and module runner" and "Self-play ladder lane"; lane comments go to the existing lane §§.
  - `40-contributing.md` § "Conventions" gets the QE-hop comment.
  - `00-index.md` gets a row only.
  - AGENTS.md gets a new `## Standing rulings` section: pointer lines plus operative sentences that occur verbatim in 45 (rule S, 11 named strings, `remain THREE` among them).
- **Two corrections to the audit:**
  - **C1:** the `PERFT_DEEP=1 …` line (AGENTS.md:67) stays. It is one of the 17 commands ABC-173 A3 parses, and A3 requires it. The audit's B11 MOVE would make 16 and red `npm test`.
  - **C2:** `## Safety rules` stays whole. It is a fixed keep, and folding its merge/deploy bullets would make A4 miss. Only its three `## X` references re-point to 45.
- **A2/A3 concrete:**
  - A2: 5 heading lines and 4 backticked self-references go to 0; `### Test` comments go 10 → 1; 20 canaries go to 0 (base counts on the page).
  - A3: the heading-match rule; 8 new headings each exactly 1; 6 pointer lines; the lane table as the lane index.
  - Traps written in: no new backticked `npx vitest` span in AGENTS.md (never quote a 90 lane heading); the Dev/run slot pins.
- **Byte target:** A1 ≤ **18,432 B**. Expected about **15,000 B**: the audit's 14,400 ± 600, plus 127 for C1 and about 490 for C2. That is about 8.2 edits of headroom against 24,576.
  - O1 lands in AGENTS.md.
  - O2 lands in 90 § "Real-engine CLI lane".
  - O3 lands in 90 § "Self-play ladder lane". It never goes in AGENTS.md, where it would be an 18th parsed command.
  - A7 fence: exactly 5 files.
- **Open owner decision, not in scope:** lowering the 24,576 B guard (`src/cli.test.ts:2484`, an Engineer change) after this merges. The audit recommends 18,432.
- **Flagged, not cut:** `src/cli.test.ts:2242` comment says "13 further closers"; about 8 remain after the split. It is a stale comment only, no assertion.
- Notes, sealed with `admitAndAppend`, context root = the main checkout:
  - `.grugops/context/bapm-fold-A-ABC-164/notes/20261021T131002Z-ba-pm-observation-d197dcbd.md` (readings);
  - `…20261021T131002Z-ba-pm-decision-a7cd9ce2.md` (fold and DoR).

### Trace row (10 cells, for the Orchestrator to append; `plans/traceability.md` is fenced from me)

`| ABC-164 (BA/PM) | Folded owner's Option A into the page: 39-block split (26 keep, 10 split, 3 move) to 45-standing-rulings (new), 90 command log, 40-contributing; A2/A3 made concrete; audit corrected (C1 PERFT_DEEP stays, C2 Safety whole); DoR 8 → 10/10 | — | — | ABC-109, ABC-173, ABC-186; notes …d197dcbd, …a7cd9ce2; audit …ffbb746f, …38d2af93; owner …18e4ada0 | records only, main @ 60d72e66 (uncommitted)<br>plans/tickets/ABC-164-…md, plans/board.md | — (records only; ABC-173 parser read: 17 commands) | — | — | Backlog → Ready (Ready 0/8 → 1/8) |`
