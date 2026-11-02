---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T17:02:26Z
subtask: se-ABC-265-fix
role: software-engineer
ref: .grugops/context/se-ABC-265-fix/
branch: new grugops/ABC-265-fix from grugops/qe-ABC-265 (6a4b0d37, on top of ABC-265 cad6ae13) — worktree .claude/worktrees/se-ABC-265-fix
width: wrap EVERY test/build run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# Close QE-265-a: pin the non-zero data word in the hit rule
Add one row to src/transposition.shared.test.ts: after clearTable(), probeTable(0n) returns -1 (a zero data word never hits). Show QE plant QP4 (hit on a zero data word) red with it, head green. npm test (expect 2 388), lint, typecheck. Tests only; no production src edits. No push, force-push, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-265-fix, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
