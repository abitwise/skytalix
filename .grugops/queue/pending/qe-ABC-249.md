---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:27:36Z
subtask: qe-ABC-249
role: qe-e2e
ref: .grugops/context/qe-ABC-249/
branch: new grugops/qe-ABC-249 from grugops/ABC-249 (head dd66bfee; code 25371747; base 09d1f675) — worktree .claude/worktrees/qe-ABC-249
width: TESTS ARE SERIALIZED. Wrap EVERY test/build run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>` (qe-ABC-254 holds it for its timing window; wait). Records hops run beside you.
---
# QE: grade ABC-249 (test-only row: pre-root repetition at ply 4; QE-248-c)
## Ticket
plans/tickets/ABC-249*.md. SE notes on the branch: .grugops/context/se-ABC-249/ (…bcb0e207 fixture, …67c090b7 runs, …3bbfaabc artifacts). SE scratch: /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-249/ (qply4-red.txt, mutant tree).
## Do
- Re-apply QPLY4 out of tree yourself: row red; production green; non-vacuity asserts hold.
- G8 (npm test wall) head vs base, under the lock; foreign vitest recurs — log admissibility, wait-for-clear cap 20 min. New row ≤ 0.1 s.
- Gates: lint/typecheck/build, npm test, skip-integrity, lane-inventory. UAT waiver (test-only) confirm.
- Comment on brittleness: the row pins move+score (404/497); say whether pinning score is right for ADR-0054 decision 3 or a weaker assertion (e.g. score sign/draw vs not-draw) proves the same thing more durably. Do not change it unless it's a gap.
- Run time ≤ 30 min excluding waits. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400; worktree needs npm ci.
## Fences
Tests and your records only. No src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Verdict PASS / PASS_WITH_GAPS / FAIL with gap ids; sealed notes (task qe-ABC-249, contextRoot = worktree, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.
