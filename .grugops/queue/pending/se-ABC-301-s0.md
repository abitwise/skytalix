---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T20:57:17Z
subtask: se-ABC-301-s0
role: software-engineer
ref: .grugops/context/se-ABC-301-s0/
branch: new grugops/ABC-301 from main — worktree .claude/worktrees/se-ABC-301
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games, and no fit: stop after scope 0. Host paths only as placeholders.
---
# ABC-301 scope 0 only: the second pull's preconditions
Read plans/tickets/ABC-301*.md (Scope 0), arch-second-pull-1104 …4917f0f7, qe-ABC-271's gaps …d0f7af61, ADR-0067 d5, and the Orchestrator notes …264e420e and …f30bd604.
Build, and do not go beyond:
- QE-271-h: the hot-path row at live values, exact on 44 of 44 fixtures; it must kill mutants E14–E16.
- QE-271-g: a guard row: no caller of pawnStructureForTest or passerTermsForTest outside test files.
- QE-271-i: tools/tune's emitter writes 17 exports, equal to main's values value for value, and the tracer traces E4a's features; typecheck passes; B-T1 reads 0 misses.
- QE-271-f is the PREREG's line, written at the fit, not here.
Lane budget: all of ABC-301 holds ≤ +0.10 s, so scope 0's rows should cost as little as they can; aim ≤ 90 ms in-thread; none added to src/cli.test.ts; rows ≥ 50 ms go deep; no new default-lane file.
Stay out of src/engine.ts and move ordering (se-ABC-282 is in them). No production value moves.
Fences: tools/tune, test files, your records. No ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-301-s0, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
