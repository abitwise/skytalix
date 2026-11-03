---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T10:17:03Z
subtask: arch-ABC-239
role: architect-design
ref: .grugops/context/arch-ABC-239/
branch: grugops/arch-ABC-239 — worktree .claude/worktrees/arch-ABC-239 (from main)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core; the lock is shared (the ABC-269 build may run). Prototype fits stay small: each single run ≤ 30 min, the hop's total host time ≤ 2 h; anything larger — stop and return the question (owner asks for > 1 h validation runs).
---
# Design ABC-239 (offline evaluation tuning) — design 3 of 3
Owner 2026-11-03: designs one-by-one for ABC-234, ABC-236, ABC-239. Both earlier designs came back premise-not-met (ADR-0065, ADR-0066 — search-side levers are exhausted on main); the EPIC-011 analysis (bapm-epic011-cut …08584853, …0fd882f7) ranks this ticket as the biggest evaluation lever.
Read plans/tickets/ABC-239*.md (A1 licence, A6 reading, the waits), ADR-0048 (licence; carved-out CC-BY-SA tables), ADR-0064 (E1: every term an mg/eg pair in src/evaluate-params.ts — the tuner's target; E1 is being built now on grugops/ABC-269, ADR accepted), ADR-0056 (Phase 4, per-change rule, Q-3K-4 (b) for evaluation tickets), ABC-205/ABC-207 history (hand weights lost; why), the arch-next-pull eval probe.
Decide and write ADR-0067 PROPOSED:
- Method (e.g. Texel-style logistic fit of eval to game result; or another, with the reason), loss, K-scaling, optimiser, regularisation, which parameters are free at first pull (keep it bounded), integer emission into evaluate-params.ts, reproducibility (seeded, scripted tool under tools/).
- Data: source and licence under ADR-0048 (own self-play games allowed by default; Lichess CC0 an option; a Stockfish-labelled set raises a product-identity question — if you need it, frame it as an owner question, don't assume). Size, de-duplication (note bapm found duplicated openings in the probe set), train/validation split, quiet-position filter.
- Pre-registered bars and falsifiers: validation-loss improvement, no regression on zugzwang/mate floor/G1, NFR-005 depth-6 floor, then the per-change 100 games at 100 ms (GAIN 50.0) and the owner's 400-game pair only if asked first.
- A small prototype under the width cap is welcome to show the pipeline works and the loss moves (on main's untapered table if E1 is not merged yet) — seal a PREREG before any measured run.
- Dependencies: say plainly whether the build must wait for ABC-269's merge (expected yes) and whether ABC-270/271/272 should go before or after the tuner.
Fences: memory-bank/50-decisions + your records + scratch under the scratchpad (no committed src/tools). Do NOT edit ADR-0056, EPIC-011 or ticket pages — list owed lines in a note. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-239, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result; brief + claim to done/.
