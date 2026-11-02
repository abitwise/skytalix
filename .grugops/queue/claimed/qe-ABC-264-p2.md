---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T13:42:00Z
subtask: qe-ABC-264-p2
role: qe-e2e
ref: .grugops/context/qe-ABC-264-p2/
branch: new grugops/qe-ABC-264-p2 from grugops/ABC-264-fix (head 4d1c0616; code 358b5f4a + engine-door row; base build 0b73f51d = main's engine, no src/tools change since) — worktree .claude/worktrees/qe-ABC-264-p2
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One game at a time, one core.
---
# QE part 2: ABC-264 game reads (owner ACCEPTED ADR-0059, note …81ae2db4)
## Read
plans/tickets/ABC-264*.md, ADR-0059, ADR-0056 D5/S′/difficulty lanes, part-1 verdict on grugops/qe-ABC-264 (1dede4f2: GAPS, QE-264-a closed by se-ABC-264-fix 4d1c0616).
## Do
1. npm test once on the branch (expect 2 404) and lint/typecheck/build.
2. A6 per-change read: `d <head> 0b73f51d <out> --budget-ms 100 --rounds 50 --concurrency 1` (100 games). Pass GAIN ≥ 50.0/100; report W/D/L, Elo ± and time losses (50 ms margin).
3. Smoke: `r <head> <out> --budget-ms 500 --rounds 5 --concurrency 1` vs E1650 (10 games). Report score and the pooled S′ count (pool was 18/20; ≥ 30 games > 85 % fires the upward re-pin — report, do not re-pin).
4. Levels deep lane (57 tests).
5. Verdict: PASS / PASS_WITH_GAPS / FAIL, with ids.
Expected host time ≈ 40 min. Delete raw game outputs after recording figures.
## Fences
Tests and your records only; no src/ edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-264-p2, contextRoot = worktree's .grugops/context, never the plugin cache); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
