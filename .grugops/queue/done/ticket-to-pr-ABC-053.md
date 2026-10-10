---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-053
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-053-frame-path-probe-measures-load-time.md
ref: .grugops/context/ticket-to-pr-ABC-053/
source_refs: .grugops/context/ruling-abc053-abc054/ (decision …09539381, observation …151fda8a)  .grugops/context/owner-adrs-followups/ (…41693c28)  memory-bank/50-decisions/ADR-0029-* (accepted)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T11:45:15Z
branch: grugops/ABC-053-frame-path-per-frame
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-053` — the frame-path guard measures LOAD and PER FRAME (`ADR-0029`)

DoR 10/10, S, P1. The ticket page is the contract; `ADR-0029` (accepted) is binding: one declared
root `render-seam.ts`, closure derived, `FRAME_PRODUCERS` deleted, per-frame check by module loads
(not spies) on two game states, `assembleFrame` imported only by `render-seam.ts`.

## Stop conditions
- Any production file would change — STOP (the three stale production comments are an XS follow-up,
  not this ticket; name them in your note).
- Files beyond those the page names (incl. `src/render-seam.test.ts` A9) — STOP.
- Security clause (d) fires by design — record it for Security/NFR; do not avoid it.
- Cost per `ADR-0035` (proposed): narrow file set with a twin; report R; UNRESOLVED ≠ MET.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules`
into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.
`ABC-087` builds in parallel (engine/level files) — no overlap expected; STOP if one appears.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: gates, per-criterion evidence (the ADR's kill ledger reproduced),
cost reading, `src/` numstat, branch + sha.
