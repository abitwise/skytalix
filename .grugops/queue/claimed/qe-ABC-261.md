---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T19:12:31Z
subtask: qe-ABC-261
role: qe-e2e
ref: .grugops/context/qe-ABC-261/
branch: new grugops/qe-ABC-261 from grugops/ABC-261 (head 06d6d987; code dd8b17ea; base ceb28780) — worktree .claude/worktrees/qe-ABC-261
width: TESTS SERIALIZED. Wrap EVERY test/build run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; qe-ABC-260 and se-ABC-250 share it.
---
# QE: grade ABC-261 (lazy-legality rows, test-only)
## Ticket
plans/tickets/ABC-261*.md, A1–A9. SE notes on the branch .grugops/context/se-ABC-261/ (…96e8d155, …6d10ccab, …8912d2dc, …00c188c0). Plants: .grugops/context/qe-ABC-254/raw/ (plant.py, PL1/PL3a/PQ2).
## Do
- Re-plant PL3a, PQ2, PL1 yourself (copy .grugops/context too so qe-hop-integrity does not fail spuriously); plus one plant of your own per row (e.g. early exit lost only when not in check on a different board; a promotion to a minor piece instead of queen in check). Report survivors.
- Judge the early-exit bar: production 2 calls vs PL3a 6 — is "≤ 2" brittle to a harmless reorder of the generator (king move no longer first)? The row asserts the king move is first; say if that precondition is fragile.
- A7 (accept the 2 claim paths in dd8b17ea — Orchestrator ruled), A8 cost, A9 gates (npm test ×3 expect 2 374, skip-integrity, lane-inventory), G8 interleaved head vs base under the lock (wait cap 15 min, SHARED otherwise). UAT waiver. Merge-tree against main.
- Run time ≤ 30 min excluding waits.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Verdict with gap ids; sealed notes (task qe-ABC-261, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.
