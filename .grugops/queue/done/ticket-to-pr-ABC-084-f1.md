---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-084-f1
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (Security/NFR required-fix loop)
ticket: plans/tickets/ABC-084-tactical-puzzle-suite-strength-regression-gate.md
ref: .grugops/context/ticket-to-pr-ABC-084/
fix_ref: .grugops/context/secnfr-ABC-084/   (on grugops/secnfr-ABC-084 @ ffc3bdd; decision …c3a91e57, F1)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T22:38:24Z
branch: grugops/ABC-084-puzzle-suite (continue; worktree .claude/worktrees/ABC-084-puzzle-suite)
base: grugops/ABC-084-puzzle-suite @ e426e91
---

# Subtask: apply Security/NFR `F1` to `ABC-084` — no false red from a busy machine

At load1 49–54 the gate row failed "Test timed out in 60000ms" while solving 40/40. Under the
owner's option B, red = QE FAIL, so wall-clock must not decide the verdict. Apply exactly:
- the gate row and the `A3` (weakened) row: vitest timeout → **300 000 ms** hang guard, the shape
  `src/engine.test.ts` already uses;
- drop "in <= 60 s" (or equivalent) from the gate row's NAME;
- `A5` stays a printed / recorded reading, not an assertion.
Nothing else. Re-run: `PUZZLE_DEEP=1` (expect 12 passed (9 default)), `PUZZLE_DEEP=weakened` (exit 1,
10/40), `npm test`, lint, typecheck. Do NOT touch the baseline file.

## Fences
`src/puzzle-suite.test.ts` only under `src/` (+ § Delivery addendum, a note, a trace row). Never merge;
never push. Commit-message file in a PRIVATE scratchpad subdirectory; `git commit -F`. Real UTC.

## Publish
`claim` note under `ref:`. Queue pending → claimed → done per Workflow 17. Report: the diff, the
re-runs, sha.
