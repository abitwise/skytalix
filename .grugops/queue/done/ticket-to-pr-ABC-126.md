---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-126
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-126-hanging-corpus-pair-starts-in-check.md
ref: .grugops/context/ticket-to-pr-ABC-126/
source_refs: .grugops/context/recut-abc010/ (decision …d91057f3, probe/ candidate FENs)  .grugops/context/qe-ABC-127/ (QE-127-e, QE-127-f)  memory-bank/50-decisions/ADR-0033-* (accepted)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:49:54Z
branch: grugops/ABC-126-corpus-repairs
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-126` — re-find the in-check hanging pair and the two defective puzzle rows

DoR 10/10, S. The ticket page is the contract (`A1`–`A7`; `A4`/`A6` read the BASE's baseline file and
puzzle count — `ABC-127` is merged, so that is 58/62). `ADR-0033` is now ACCEPTED: every re-found row
must pass its six rules. Keep QE-127-f in view: the two re-authored rows feed `ABC-127`'s deep A2
win-material oracle row, which must stay green.

## Stop conditions
- The baseline file would need to change — STOP (lowering is the owner's word; the page says it doesn't move).
- A replacement the shipped engine does not solve → re-find, per the page; if none found, STOP and report.
- Any engine/search/evaluate/quiescence/transposition production file — STOP.
- `N8-LANE` > 650 ms CPU — STOP.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md` (draft any line in your note).
Own worktree; link `node_modules` into YOUR worktree only. Commit-message file in a PRIVATE scratchpad
subdirectory. Real UTC stamps.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: gates, `PUZZLE_DEEP=1` (three processes) and `SEARCH_DEEP`
quiescence readings, per-criterion evidence, `src/` numstat, branch + sha.
