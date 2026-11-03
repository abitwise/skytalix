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
