---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T01:11:26Z
subtask: qe-ABC-264
role: qe-e2e
ref: .grugops/context/qe-ABC-264/
branch: new grugops/qe-ABC-264 from grugops/ABC-264 (head 4e6a59ee; code 358b5f4a; base 0b73f51d) — worktree .claude/worktrees/qe-ABC-264
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`.
---
# QE part 1: grade ABC-264 (reverse futility) — everything EXCEPT A6's games
## Read
plans/tickets/ABC-264*.md (aligned to ADR-0059), ADR-0059 (PROPOSED), se-ABC-264 notes on the branch (…1fad1ebe, …470e5bf6, …d18a94a0).
## Do
- Re-read A1 (doors node-equal, out of tree), A2 (predicate table; plant at least 3 defects of your own, including the mate-band guard), A3 (drift + 160 cp cap, mate corpus, zugzwang 7/7), A4 (deterministic counts 658 971 / 1 021 190 / 972 596 / 299 183).
- Gates: G1, G5 (real clock), graded G6, G8 interleaved, G9, G11, lint/typecheck/build, npm test ×3 (expect 2 403), skip-integrity, lane inventory. Review the ABC-086 A6 fixture re-pin (3→5 ms).
- Measure how often the rule fires at 100 ms on startpos/kiwipete/position-6 (INFO).
- DO NOT run the 100-game read, the smoke or the Levels lane: they wait for owner acceptance of ADR-0059 (a part-2 hop).
- Verdict for part 1: READY-FOR-A6 / GAPS (with ids) / FAIL.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-264, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.
