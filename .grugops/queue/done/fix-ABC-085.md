---
task: wave-2026-09-25
subtask: fix-ABC-085
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-085-self-play-ladder.md
ref: .grugops/context/fix-ABC-085/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-085-self-play-ladder (tip 3783ae15)
---

# Subtask: close QE-085-a/b/c on the ABC-085 harness before any verdict run

QE verdict PASS_WITH_GAPS (`3783ae15`; notes under `.grugops/context/qe-ABC-085/notes/` on the branch). The verdict runs once and takes 10–44 h,
so a wrong "MET" must be caught by a default-lane row, not discovered afterwards.
- **QE-085-a (MEDIUM):** the colour schedule, the pair score, the A1 bar (`>= 90`) and the claimed-draw count are unchecked. Mutants M6, M11, M12 and M14 survive.
- **QE-085-b (LOW):** the level budgets used unchanged, and the game counts. M5, M7 and M7b survive.
- **QE-085-c (LOW):** `PLY_CAP`, the only hang guard. M13 survives.

Add default-lane rows, cheap and in-process with **0 games played**, that kill each named mutant. Show each one red on a scratch copy, then revert. The default lane
keeps 0 ladder games and +1 file (item 6, by count); the row count grows, so state the new count. M9 and M10 are INFO; leave them.
QE-085-e (an AGENTS.md line) is the Scribe's; leave it.

## Fences
Test file and `tools/` only, with 0 production lines. Never merge or push. Do not touch `plans/board.md`. Take no timing grades. Work in your own worktree.
End each commit with a `Co-Authored-By:` trailer naming the model you actually are. In this shell `diff` is a git wrapper; use `/usr/bin/diff`.
Publish notes per Workflow 16. Move the queue file pending → claimed → done by hand.
