---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T09:25:07Z
subtask: arch-ABC-234
role: architect-design
ref: .grugops/context/arch-ABC-234/
branch: grugops/arch-ABC-234 — worktree .claude/worktrees/arch-ABC-234 (from main 149bc2ef)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. Other hops share the lock (an Engineer build may run) — expect waits; no wall-clock timing reads (node counts, depth and move choice only) unless you note the window was alone. Any single run you'd plan over 1 h: stop and return the question.
---
# Design ABC-234 (SEE orders captures, ordering only)
Owner 2026-11-03: "do design one-by-one for ABC-234, ABC-236 and ABC-239". This is the first; ABC-236 follows after you return.
Read plans/tickets/ABC-234*.md, ADR-0056 (EPIC-011 path, S′ / per-change GAIN 50.0 / NEUTRAL 43.0 rules), ADR-0061 (futility, merged; cut audit), ADR-0063 (history premise not met — killers take ~90 % of quiet cutoffs; reuse its probe shape), src/search.ts, src/quiescence.ts, src/move-ordering (orderMoves).
- Measure the premise on main FIRST, with a PREREG note sealed before any run: how often losing captures (by SEE) sit ahead of quiets today and are refuted; nodes at fixed depth (d8) on the standard corpus; for ordering-only changes the pay gate is ≤ 0.95× nodes or the NEUTRAL route if the ticket qualifies. Include the zugzwang set as a hard gate and the cut-audit if any cut changes.
- Consider SEE also in quiescence (if it already prunes there, say so) — but scope stays the ticket's unless you rule otherwise.
- If the premise holds: write ADR-0065 PROPOSED (test-only off-door pair, file list, test rows, falsifiers, effort). If not: record it like ADR-0063 (proposed, premise not met) and recommend park.
- Note E1 (ABC-269) is being built in parallel and changes evaluate.ts/evaluate-params.ts only; do not depend on it.
Fences: memory-bank/50-decisions + your records + scratch probes (no committed src). Do NOT edit ADR-0056, EPIC-011 or ticket pages — list owed lines in a note. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-234, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-ABC-234` from `main` `17725732` (`src/` tree `58fa3eb4`, the tree `ADR-0063` measured). Records only.
- **How it ran:** probes on a scratch `git archive` outside the repository, one job at a time under `flock <host-test.lock>`. Three pre-registered batches (09:32–09:46Z, 42 jobs) and one DIAGNOSTIC batch (8 jobs), every exit 0, node counts only. Scratch copies deleted; nothing left running. Raw is under `.grugops/context/arch-ABC-234/raw/probe/`.
- **PREREG first:** `…9ac61a7a`, committed in `9ca30923` before any measured run.
- **The premise on `main` (d6, the 190):**
  - 69 % of full-width nodes put a losing capture (by SEE) ahead of a quiet move. 83 % of losing captures searched are refuted, and **9.1 % of all cutoffs are made by SEE-losing captures**.
  - The mechanism is real.
- **Pay gate: missed by every form** (d8, ≤ 0.95× on `search()` and `chooseMove`, kiwipete / position-6):
  - S1 (`see<0`, after the killers): 0.914 / 1.323 / 0.994 / 1.403.
  - S2 (after every quiet move): 1.43–2.51×.
  - **S1m (`see<−50`, after the killers; design of record): 0.901 / 0.943 / 0.986 / 0.955.**
- **Safety: passed by every form.** Zugzwang 7 / 7, `G1` 54 / 58, mate floor 0, drift within bars; audit 0 flips for S1 / S1m.
- **Why it does not pay:** in `chooseMove`, iterative deepening already hands most cut nodes a hash move.
- **`ADR-0065` PROPOSED, premise not met on `main`** (F4 fired). Not put to the owner.
  - The intent would be GAIN: O3s fires at 100 ms, so NEUTRAL "invisible" is closed to it.
  - A0 is ruled: `ADR-0024` d4 fences Q1 (quiescence pruning), not O3s. The premise decides.
- **Recommendation: park `ABC-234`** (DoR 9 / 10). Effort if re-opened: M (~1–1.5 Engineer days, plus ~1 h QE read).
- **DIAGNOSTIC (not pre-registered):** Q1 (quiescence skips `see<0` captures out of check) reads **+0.884 ply** of reach and d8 nodes 0.22–0.68×. It holds zugzwang 7 / 7, mate 0 and `G1` 54 / 58, with drift max 69 cp. That is the SEE lever on this engine; it is the Orchestrator's to weigh.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`; 4 of 4 read back):
  - decision `20261103T093240Z-architect-design-decision-9ac61a7a` (PREREG);
  - observation `20261103T095012Z-architect-design-observation-ffe76d35` (results);
  - decision `20261103T095012Z-architect-design-decision-a4ed96aa` (verdict, A0, park, Q1 evidence, owed lines);
  - observation `20261103T095020Z-architect-design-observation-895d420b` (artifact list).
- **Lines owed** (not edited; fenced): `ADR-0056` rows O3s / Q1, the survey row, the `EPIC-010` map row and a dated ranking line; `EPIC-011` Phase 3 and the Q1 stub; the `ABC-234` page (A0 answered, DoR 8 → 9 / 10). All are in decision `…a4ed96aa` § 5.
- **Commits:** PREREG and claim `9ca30923`; claim file `43def2b0`; ADR, notes and raw `b0e14f1b`; this Result and the move to done/ in the closing commit. Not pushed, not merged.
- **Open:**
  - Orchestrator: (1) park `ABC-234` (recommended); (2) whether to put "open `ADR-0024` d4 for Q1?" to the owner, and whether Q1 goes ahead of S1 (`ABC-236`) by D6's evidence rule.
  - Owner: nothing asked by this hop.
