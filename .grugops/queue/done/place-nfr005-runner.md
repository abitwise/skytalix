---
task: wave-2026-09-24
subtask: place-nfr005-runner
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md (catalogue placement on the owner's word)
ref: .grugops/context/place-nfr005-runner/
decision_ref: .grugops/context/wave-2026-09-24/notes/20260925T190000Z-orchestrator-decision-aa98a05d.md
source_ref: .grugops/context/secnfr-ABC-081/notes/20260925T124500Z-security-nfr-decision-abc081-pass-with-risks-nfr005-met-plain-node-no-security-finding-48e9e17c.md
enqueued_by: orchestrator
enqueued_at: 2026-09-25T19:05:00Z
branch: grugops/place-nfr005-runner
base: grugops/ABC-081-transposition-table (tip after this enqueue)
---

# Subtask: place the `NFR-005` runner wording and close `AR-NFR005-079`

Owner's word, verbatim: *"3. use recommendation"* (decision `…aa98a05d`, item 3a/3b).

1. Place, in `plans/nfr-catalog.md`'s `NFR-005` row, exactly the runner wording your
   `secnfr-ABC-081` decision proposed, plus its drafted status line (floor met on plain node at
   `ABC-081`; depth 7 WARN stands). Add an `_Updated:` line. No other row, no level moved.
2. Close `AR-NFR005-079` where it is recorded (ticket § Security/NFR of `ABC-079` and/or the trace),
   with the reason: its condition no longer holds on the owner-ruled runner.

## Fences
Zero lines under `src/`. No `plans/board.md`, `AGENTS.md`, ADRs. Never merge; never push. Own
`git worktree` under `.claude/worktrees/`; commit messages via a scratchpad file and
`git commit -F`. Small hop: no re-measurement.

## Publish
One `decision` note under `ref:`, a trace row. Queue pending → claimed → done per Workflow 17.
Report: sha, numstat, the exact text placed.
