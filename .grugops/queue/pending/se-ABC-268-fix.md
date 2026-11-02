---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T18:54:36Z
subtask: se-ABC-268-fix
role: software-engineer
ref: .grugops/context/se-ABC-268-fix/
branch: new grugops/ABC-268-fix from grugops/qe-ABC-268 (3895297f, on top of ABC-268 4ca819c3) — worktree .claude/worktrees/se-ABC-268-fix
width: wrap EVERY test/build run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# Close QE-268-a/b/c with test rows (no production change)
Read qe-ABC-268 plants note (…0a18c9a1) and gaps (…aa73c424); QE's plant scripts are under .grugops/context/qe-ABC-268/raw/.
- QE-268-a: a row pinning chooseMoveWithoutFutility's priorKeys: true (QP5 red).
- QE-268-b: a row pinning the fail-soft return at a futile node, search and engine (QP3, QP4 red).
- QE-268-c: futileMove cells for en passant (not futile — it captures) and a quiet king move (futile) (QP2, QP6 red).
Show each named plant red with your rows and head green; npm test, lint, typecheck. If any row can't be made to catch its plant without changing a bar or production code, stop and report. Tests only. No push, force-push, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-268-fix, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
