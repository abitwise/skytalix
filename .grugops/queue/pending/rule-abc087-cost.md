---
task: wave-2026-09-25
subtask: rule-abc087-cost
role: ba-pm
workflow: agent-factory/workflows (BA/PM criterion ruling)
ticket: plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
ref: .grugops/context/rule-abc087-cost/
source_refs: .grugops/context/ticket-to-pr-ABC-087/ (decision …4e5f0323, observation …25962b19, claim …53ebd6d1, probe/)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T11:55:13Z
branch: grugops/ABC-087-difficulty-levels (commit on top of ef297855 in worktree .claude/worktrees/ABC-087-difficulty-levels — the page's § Delivery lives there)
base: grugops/wave-2026-09-25
---

# Subtask: rule `ABC-087`'s N8-LANE overrun, and two findings the build surfaced

The build met A1–A10, but its default-lane cost reads +0.825 s CPU (interval 0.78–0.85, twin R 0.060 s —
resolved, NOT MET) against `N8-LANE` ≤ 650 ms. The Engineer's three options: (a) move the default-lane
A4 run into the `ENGINE_DEEP` lane (keeps every count; its +0.54 s reading was on an inadmissible
twin); (b) change the criterion's move count; (c) accept the overrun (owner's word). Rule which — a
criterion may move lanes but must not be weakened; any bar lowering or accepted overrun is the owner's
(say so and stop short). If you choose (a), say exactly which rows move and what stays in the default
lane, so the Engineer can re-measure. Also rule: (2) A4's rate formula reads p(1−q)/(1−pq), not p, on
positions with no candidate (pawn endings 25.8 % vs 40 %) — reword A4 or flag for `ABC-085`; (3) levels
3/4/5 differ only by budget — risk to `ABC-085` A2; name it on `ABC-085`'s page or route it. Re-score.
Fences: no `src/`, `plans/board.md`, ADRs, catalog. Decision note per Workflow 16; trace row at the END
of `plans/traceability.md`.
