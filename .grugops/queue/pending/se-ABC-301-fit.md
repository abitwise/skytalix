---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T21:36:44Z
subtask: se-ABC-301-fit
role: software-engineer
ref: .grugops/context/se-ABC-301-fit/
branch: existing grugops/ABC-301 — worktree .claude/worktrees/se-ABC-301
width: wrap EVERY test, build or engine run, every fit, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games (QE plays B-T5–B-T8). Any single run estimated over 1 h: STOP and report first. Host paths only as placeholders.
---
# ABC-301 scopes 1–4: PREREG, one fit, emission, re-pins. Stop before the reads
QE read scope 0 GREEN (qe-ABC-301-s0 …9fd32f43). Read plans/tickets/ABC-301*.md, ADR-0067 (d5, d6, F3 in the amended form, B-T0–B-T8, the first pull's f3f4 block), ADR-0070 d7, arch-second-pull-1104 …4917f0f7, qe-ABC-301-s0's gaps …270757f7, and the Orchestrator notes …264e420e and of 2026-11-04T21:20:01Z.
0. In the worktree, `git merge --no-ff grugops/qe-ABC-301-s0`, then `git merge --no-ff main` (no rewrite).
1. Scope 1: the bound-set enumeration, with every relation row's FEN as a constant and its source row. QE-301-b, required: a non-zero round-trip row for the emitter's E4a columns.
2. Scope 2: seal the PREREG BEFORE any fit: the bound set and its count, the free set, the data and player names, the base SHA, the bars, and the endgame G2 row (≤ 1.02×; QE-271-f). A G2 reading above that is a B-T4 miss.
3. Scope 3: ONE fit, every relation bounded from the start, no refit. TUNE_DEEP must be green at the fit commit. Check tableOf(emission) against fit.json (QE-301-b). A red relation on the emission is a defect: fix the tool and run the same procedure. An infeasible bound set is a STOP to Architect/Design; no row is dropped. If zugzwang.001 or any safety row is red, STOP and report; no re-fit to chase it.
4. Scope 4: B-T4's re-pins old → new in one table. For the two "every half 0" rows follow the Architect's ruling (arch-records-1104, being written now, lands on main; merge main again to get it). If it has not landed when you reach them, stop and report.
Lane budget: all of ABC-301 ≤ +0.10 s; aim ≤ 90 ms in-thread; none in src/cli.test.ts; rows ≥ 50 ms go deep; no new default-lane file.
Stay out of src/engine.ts and move ordering; only src/evaluate-params.ts moves in production. Report B-T1–B-T4's offline readings and the fit's time and heap.
Fences: tools/tune, src/evaluate-params.ts, test files, your records. No ticket, EPIC, ADR or board edits. No push, force, amend, or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-301-fit, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
