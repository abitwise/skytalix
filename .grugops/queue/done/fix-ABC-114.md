---
task: wave-2026-09-25
subtask: fix-ABC-114
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-114-four-false-sentences-in-epic-006s-own-instrument-comments.md
ref: .grugops/context/fix-ABC-114/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-114-instrument-comments (tip 30b34f44)
hold: dispatch AFTER ABC-144 quiet Window A
---

# Subtask: fix QE-114-a and QE-114-b on `ABC-114`. Comment-only.

The QE verdict is FAIL (`…a32a9616`); the gap register is `…168698b8`, under `.grugops/context/qe-ABC-114/notes/` on the branch.
- **QE-114-a (HIGH):** `src/cli.test.ts:2681` says the count row is "placed BEFORE the other two" and "speaks first" on any decoy. That is false: the initializer row (`:2669`) comes first, and it is the row that fails on `ORD`.
- **QE-114-b (LOW):** `:2687–2688` says D4 leaves "the lane GREEN … on the control". The control file carries 2 unrelated reds; only the A1 test is green there.

Write sentences you can back with a run. Re-plant `M9`, `D3` and `ORD` yourself before you write. A7 still binds: a fresh QE hop validates.
Do not touch QE-114-c; that is BA/PM's.

## Fences
`//` comment lines only. Never merge or push. Do not touch `plans/board.md`. Work in your own worktree. End each commit with a `Co-Authored-By:` trailer naming the model you actually are.
