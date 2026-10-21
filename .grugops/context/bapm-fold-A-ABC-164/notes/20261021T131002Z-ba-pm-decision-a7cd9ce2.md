---
id: 20261021T131002Z-ba-pm-decision-a7cd9ce2
kind: decision
by: ba-pm
at: 2026-10-21T13:10:02Z
verified_by: 
confidence: high
refs:
  - ABC-164
  - ABC-173
  - ABC-109
  - ABC-186
  - 20261021T130200Z-orchestrator-decision-18e4ada0
  - 20261021T125254Z-agents-md-scribe-observation-ffbb746f
  - 20261021T125315Z-agents-md-scribe-decision-38d2af93
  - 20261021T124920Z-ba-pm-decision-45c39699
  - plans/tickets/ABC-164-agents-md-sits-at-its-byte-budget-with-two-stale-test-receipts.md
  - plans/board.md
  - memory-bank/45-standing-rulings.md
  - memory-bank/90-agents-md-command-log.md
  - memory-bank/40-contributing.md
  - memory-bank/00-index.md
supersedes: 
seal: sha256:aee62693eaeaa53ad7774354c3518e2d063f181f85a4a5f2e8cbac406494e8a8
---

# ABC-164: owner's Option A written into the page; DoR 10/10, Backlog -> Ready. S/P2 hold. Builder: AGENTS.md Scribe, then QE

Authority: owner via the Orchestrator `…18e4ada0` ("option A; ABC-164 priority keep P2"). Input: audit `…ffbb746f` (block table) and `…38d2af93` (split). Readings: the observation beside this note. **Authoritative text: the page's `## Scope (Option A)` and `## Acceptance`.**

1. **Split:** 39 blocks. 26 KEEP whole, 10 SPLIT (B02, B11, B17, B18, B20, B23, B31-B34), 3 MOVE (B10, B12, B30).
   - Targets: NEW `memory-bank/45-standing-rulings.md` (the five governance sections, verbatim headings).
   - `90-agents-md-command-log.md`: new §§ "On-demand commands" (with a 15-row lane table), "Vitest worker cap and module runner" and "Self-play ladder lane"; lane comments go to the existing per-lane §§.
   - `40-contributing.md` § "Conventions": the QE-hop comment.
   - `00-index.md`: a row only.
2. **Corrections to the audit:**
   - C1: B11 is SPLIT, because the `PERFT_DEEP` line is one of the 17 that ABC-173 A3 needs.
   - C2: B35 Safety rules stays whole. It is a fixed keep, and A4 would miss its words. Only its three `## X` references re-point to 45.
3. **Rule S:** `AGENTS.md` gets `## Standing rulings`, with pointer lines plus operative sentences that occur verbatim in 45. 11 required sentences/strings are named on the page, `remain THREE` among them. So the summary is no rewording, and S holds (3 target documents).
4. **A2** is concrete: 5 heading lines (0 at head), 4 backticked self-references (0), `### Test` comments 10 -> 1, 20 canaries (0 at head, base counts recorded), and rule S met. **A3** is concrete:
   - the heading-match rule;
   - five 45 headings and three new 90 headings, each exactly 1;
   - 6 pointer lines in AGENTS.md, plus Memory bank & plans and an `00-index.md` row;
   - the lane table as the index for lane comments.
   - Traps: no new backticked `npx vitest` span in AGENTS.md (never quote a 90 lane heading); the Dev/run slot pins.
5. **Targets:**
   - A1 stays ≤ 18,432 B; about 15,000 expected (audit 14,400 ± 600, +127 for C1, +~490 for C2).
   - O1 goes in AGENTS.md. O2 goes in 90 § "Real-engine CLI lane". O3 goes in 90 § "Self-play ladder lane" and never in AGENTS.md.
   - A7 fence: exactly 5 files.
6. **Out of scope:** the budget constant stays 24,576. Lowering it (the audit recommends 18,432) is an open owner decision for an Engineer ticket after merge. Option B is out.
7. **DoR 10/10** (items 2 and 4 now met). Backlog -> Ready. Ready 0/8 -> 1/8.
