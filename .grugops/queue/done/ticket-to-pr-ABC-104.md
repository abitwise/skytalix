---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-104
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-104-coordinate-move-totality-claim.md
ref: .grugops/context/ticket-to-pr-ABC-104/
source_refs: .grugops/context/rescore-batch-2-2026-10-10/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:26:31Z
branch: grugops/ABC-104-coordinate-move-docblock
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-104` — `src/coordinate-move.ts` header claims total; it is total over `text` only

DoR 10/10, XS, P3. The ticket page is the contract (A1–A3; A3 re-worded 2026-10-10 to a hunk-location
check). Comment-only change to ONE production file. Re-verify the premise first (the sentence at `:30`,
both throws) at the current wave tip before editing; if the premise is stale, STOP and report.

## Stop conditions
- Any non-comment change to `src/coordinate-move.ts`, or any other `src/` file — STOP.
- The page says do not add a test — do not.
- Behaviour change (making the function total over all arguments) is fenced out as an `ADR-0004` question.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules`
into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps
from `date -u`. Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand: bare `mkdir` + `claim.md` in the MAIN checkout; leave uncommitted).
Report: gates, per-criterion evidence, `src/` numstat (expect comment lines only), branch + sha.
