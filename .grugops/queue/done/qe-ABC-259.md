---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T16:57:14Z
subtask: qe-ABC-259
role: qe-e2e
ref: .grugops/context/qe-ABC-259/
branch: new grugops/qe-ABC-259 from grugops/ABC-259 (head 4dbfde26; code e1c10e19; base 8f2fc9b5) — worktree .claude/worktrees/qe-ABC-259
width: TESTS SERIALIZED. Wrap EVERY test/build run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; qe-ABC-254 / qe-ABC-255 may hold it — wait.
---
# QE: grade ABC-259 (R-TC source-scan rows, test-only)
## Ticket
plans/tickets/ABC-259*.md, A1–A9. SE notes on the branch .grugops/context/se-ABC-259/ (…1a6787f8, …727bc11a, …1b9a99af); SE plants in /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-259/.
## Do
- Re-plant A2–A4 yourself out of tree (plus at least one plant the SE did not try, e.g. a budget read via an alias in engine.ts, a `_DEEP` constant in transposition.ts) and A5's comment-only control; report which plants survive (an alias that survives is a known scope limit — say so, LOW).
- A7 diff fence; A8 row cost; A9 gates (lint/typecheck/build, npm test ×3, skip-integrity, lane-inventory); G8 informal head vs base under the lock — foreign vitest recurs, wait cap 15 min then flag SHARED; count only real vitest, not flock waiters (QE-249-c). UAT waiver confirm.
- Run time ≤ 30 min excluding waits.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Verdict PASS / PASS_WITH_GAPS / FAIL with gap ids; sealed notes (task qe-ABC-259, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.
