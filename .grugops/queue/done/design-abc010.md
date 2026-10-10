---
task: wave-2026-09-25
subtask: design-abc010
role: architect-design
workflow: agent-factory/workflows (Architect design hop: Ready → In Design → Ready for Dev)
ticket: plans/tickets/ABC-010-fen-semantic-validation.md
ref: .grugops/context/design-abc010/
source_refs: .grugops/context/rescore-batch-2026-10-10/ (BA/PM decision …973fd389; probe/ fen-*.mjs)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T08:46:52Z
branch: grugops/design-abc010
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: design hop for `ABC-010` — FEN semantic validation

DoR 10/10, P2. The page routes it `Ready → In Design → Ready for Dev` for the open design question
(page § "Open design question — hand to Architect/Design at the design hop"). Answer that question,
and any other design input the page names, so an Engineer can build without deciding structure.
Respect `NFR-002` as re-derived on the page (≤ 10 µs per validated `parseFen`).
Output: a design section on the ticket page (or an ADR `proposed` if the answer is a structural
decision — next free number after ADR-0032), typed decision note per Workflow 16, trace row at the
END of `plans/traceability.md`. Fences: no `src/`, no `plans/board.md`, no DoR re-score, no
other ticket pages.
