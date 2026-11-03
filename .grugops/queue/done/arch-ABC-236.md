---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T09:51:44Z
subtask: arch-ABC-236
role: architect-design
ref: .grugops/context/arch-ABC-236/
branch: grugops/arch-ABC-236 — worktree .claude/worktrees/arch-ABC-236 (from main)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core; the lock is shared (the ABC-269 build may run) — expect waits. Node counts / depth / move choice only; no wall-clock timing reads unless you record the window was alone. Any single planned run over 1 h: stop and return the question.
---
# Design ABC-236 (aspiration windows at the root) — design 2 of 3
Owner 2026-11-03: designs one-by-one for ABC-234, ABC-236, ABC-239. ABC-234 came back premise-not-met (ADR-0065, parked; decision …a4ed96aa) — reuse its probe harness (.grugops/context/arch-ABC-234/raw/probe/) and its finding that iterative deepening already gives most cut nodes a hash move.
Read plans/tickets/ABC-236*.md, ADR-0056 (per-change GAIN 50.0 / NEUTRAL 43.0, C2′ NEUTRAL rule), ADR-0061, ADR-0063, ADR-0065, src/search.ts, src/engine.ts (chooseMove iterative deepening).
- Seal a PREREG before any run. Measure the premise on main in the path the engine plays (chooseMove): nodes to reach depth 8 on the standard positions, fail-high/low and re-search rates per window width, effect on reach at 100 ms by nodes, zugzwang 7/7 hard gate, mate floor, puzzle suite, drift, and that mate scores and the PV survive a re-search.
- If the premise holds: ADR-0066 PROPOSED (window, widening rule, test-only off-door pair, file list, test rows, falsifiers, effort). If not: record it like ADR-0063/0065 and recommend park.
- E1 (ABC-269) is being built in parallel (evaluate files only); do not depend on it, but say whether E1's taper could change the window width.
Fences: memory-bank/50-decisions + your records + scratch probes under the scratchpad (no committed src). Do NOT edit ADR-0056, EPIC-011 or ticket pages — list owed lines in a note. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-236, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-ABC-236` from `main` `70db0e7f` (`src/` tree `58fa3eb4`, the tree `ADR-0063` / `ADR-0065` measured). Records only.
- **How it ran:** probes on a scratch `git archive` outside the repository. Three pre-registered batches (09:58–10:12Z), one job at a time under `flock <host-test.lock>`: 51 jobs, every exit 0, node counts only. Scratch copies deleted; nothing left running. Raw is under `.grugops/context/arch-ABC-236/raw/probe/`.
- **PREREG first:** `…69cfcb4a`, committed in `d5d360e1` before any measured run.
- **Forms:** A25 / A50 / A100 (δ0 25 / 50 / 100 cp, doubling, cap 400), A50F (δ0 50, one step). All start at iteration 5, with full window on a mate score.
- **Pay gate (`A3`, `chooseMove` d8, ≤ 0.95× on both): missed by every form.** Kiwipete / position-6:
  - A25 0.9985 / 0.9619;
  - A50 0.9950 / 0.9632;
  - **A100 (design of record) 0.9836 / 0.9913**;
  - A50F 0.9976 / 0.9632.
  - d7 over the 190: 1.020 / 0.989 / 0.978 / 1.002.
- **Rates (d7, the 190):** iterations re-searched 37.6 / 14.1 / 2.1 / 14.1 %; wasted nodes 14.5 / 5.7 / 0.9 / 5.6 %. No fail high was ever followed by a fail low.
- **Score swings |s_d − s_{d−1}|:** p90 63 / 67 / 42 cp at iterations 5 / 6 / 7.
- **Safety: passed by every form.**
  - Zugzwang 7 / 7; `G1` 54 / 58, none newly missed.
  - Mate d5 / d6: 0 violations, 188 / 210 exact.
  - Drift within bars (A100 0 cp).
  - `A2` exact on 1 / 1: only 1 of 535 corpus positions jumps ≥ 200 cp from d5 to d6.
  - The value and the move survive a re-search: A50 has 77 / 79 scores and 79 / 79 moves equal on re-searched iterations, max 54 cp.
- **Why it does not pay:** the root is already PVS, so a window narrows only the PV subtree. The no-fail ceiling is about 2 %.
- **Reach at 47 000:** +0.005 (A100), +0.016 (A50).
- **Fires at 100 ms: 70.4 % of nodes inside aspiration passes** (186 / 190 rows). So `ADR-0056`'s "S1 is depth-gated" is wrong, and a re-open is GAIN.
- **`ADR-0066` PROPOSED, premise not met on `main`** (F4 fired). Not put to the owner.
- **Recommendation: park `ABC-236`** (DoR 9 / 10).
  - Re-opens on T1 (bound-aware cutoffs) or a deeper shipped search.
  - E1 can move δ but not the ceiling, so it is not a re-open condition.
  - Effort if re-opened: S–M, about 0.5–1 Engineer day plus about 1 h QE read.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`; 4 of 4 read back):
  - decision `20261103T095821Z-architect-design-decision-69cfcb4a` (PREREG);
  - observation `20261103T101543Z-architect-design-observation-22d9d55f` (results);
  - decision `20261103T101543Z-architect-design-decision-0886976b` (verdict, depth-gated correction, re-open, effort, owed lines);
  - observation `20261103T101543Z-architect-design-observation-c7ff50e9` (artifacts).
- **Lines owed** (not edited; fenced), all in decision `…0886976b` § 7:
  - `ADR-0056`: row S1; the `ABC-236` row; the C2′ depth-gated list and the "C yes" examples (drop S1); a dated S1 line; the Phase 3 order;
  - `EPIC-011` rows 473 / 742 / 790;
  - the `ABC-236` page: DoR 10, the `A5` firing answer, `A2` fixture sourcing, stale line refs.
- **Commits:** claim `4bda1c30`; PREREG and probe sources `d5d360e1`; ADR, notes and raw `e1219f14`; this Result and the move to done/ in the closing commit. Not pushed, not merged.
- **Open:**
  - Orchestrator: (1) park `ABC-236` (recommended); (2) route the `ADR-0056` C2′ correction (S1 fires at 100 ms) to BA/PM / Architect records.
  - Next in the owner's order: `ABC-239` design.
  - Owner: nothing asked by this hop.
