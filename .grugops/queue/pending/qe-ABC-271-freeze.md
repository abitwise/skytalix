---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:16:58Z
subtask: qe-ABC-271-freeze
role: qe-e2e
ref: .grugops/context/qe-ABC-271-freeze/
branch: new grugops/qe-ABC-271-freeze from main — worktree .claude/worktrees/qe-ABC-271-freeze
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Small reads only (≤ 30 min); no games. Host paths only as placeholders.
---
# Freeze ABC-271's K1 rows and K0 counts before the build (ADR-0070 ACCEPTED, form (a))
Read plans/tickets/ABC-271*.md (structure only, K0–K4, test note 1), ADR-0070, the Orchestrator rulings …730399e5 and …6ccd8243, and qe-ABC-270-freeze's done brief as the precedent.
Freeze in a sealed decision note before any SE build exists:
- K1 (a): ≥ 10 passer positions for the mirror.
- K1 (c): the seam fixtures at the page's floors (≥ 8 / ≥ 6 / ≥ 4, plus one pair past the distance cap of 5 and one own-king pair). Give each as FEN, side and the expected feature values for PASSED_KING_ENEMY, PASSED_KING_OWN, PASSED_FREE and PASSED_UNSTOPPABLE, derived by hand from ADR-0070's definitions, not from code.
- K0's seven exact node counts as the ADR lists them.
SE implements these rows and may not change them; QE grades against them later.
Fences: your records, plus optional frozen-fixture files under test fixtures if the precedent did that. No src, ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-271-freeze, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
