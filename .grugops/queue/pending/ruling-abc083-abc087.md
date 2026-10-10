---
task: wave-2026-09-25
subtask: ruling-abc083-abc087
role: architect-design
workflow: agent-factory/workflows (Architect ruling hop; ADR per memory-bank/50-decisions/ADR-template.md)
ref: .grugops/context/ruling-abc083-abc087/
source_refs: .grugops/context/rescore-batch-2026-10-10/ (BA/PM decision …973fd389, questions R1 and R3)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T08:26:24Z
branch: grugops/ruling-abc083-abc087
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: rule R1 (`ABC-083`) and R3 (`ABC-087`) — the two Architect questions blocking Ready

Both questions are stated verbatim in the BA/PM decision note under `source_refs`.
- **R1, `ABC-083`:** if `A5`'s total leaf cost exceeds 1,100 ns with every mobility form measured
  (legal / pseudo-legal / attack-map count), which ships: (i) king safety alone, mobility re-cut to
  Backlog, or (ii) nothing until `ADR-0003`'s depth model is re-derived?
- **R3, `ABC-087`:** under PVS only the first root move gets an exact score. Which blunder
  construction ships: (a) score candidates separately inside the per-move budget, or (b) widen the
  root window under `ADR-0026` decision 10? Does a blunder pick the n-th best or a uniform choice
  among non-worst moves? On that construction's scores, what is the "worst-scoring move" `A4`
  forbids? (Under (b) the ticket likely resizes to L — say so.)

Respect `ADR-0027` (deterministic mode: virtual clock; seed never reaches move selection) and
`ADR-0028` (level reddened by an eval term). Owner question R2 (kiwipete depth 7) is the OWNER's —
do not rule it; you may state what each answer would imply.

Output: ADR(s) `proposed` (next free number after ADR-0030), typed decision note per Workflow 16,
the DoR item(s) discharged marked with the ADR id on the ticket page. No DoR re-score (BA/PM),
no `src/`, no `plans/board.md`, no pages `ABC-036`/`ABC-127`/`ABC-126`. Trace rows appended at the
END of `plans/traceability.md`.
