---
task: wave-2026-09-25
subtask: ruling-timing-protocol
role: architect-design
workflow: agent-factory/workflows (Architect ruling hop; ADR per memory-bank/50-decisions/ADR-template.md)
ref: .grugops/context/ruling-timing-protocol/
source_refs: .grugops/context/qe-ABC-119/ (A2 …e28c062a, gaps …b300968a QE-119-a)  .grugops/context/rule-abc119-a2/ (…9f278676)  .grugops/context/secnfr-ABC-127/ (…6a3b6274)  memory-bank/50-decisions/ADR-0019-*
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:44:41Z
branch: grugops/ruling-timing-protocol
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: rule the lane-timing protocol (QE-119-a) together with the unruled `NFR-008` lane clause

QE-119-a (MEDIUM): on this machine the catalog's null-twin admissibility rule passed two sets that
landed on opposite sides of a 0.30 s CPU bound (−0.715 s / +0.725 s); the twin's own 95 % range for
its median (−0.99..+1.57 s) and the 1.5 % allowance (0.50 s) are both wider than the bound. Every
ticket today that read `N8-LANE` or a paired cost hit the same wall (ABC-036, 051, 127, 128, 119).
`NFR-008` (whole lane ≤ 15 s CPU per `ADR-0019`) reads 24.9–26.7 s and is still unruled; its
variable list names only `PERFT_DEEP` (six `*_DEEP` lanes exist now incl. `CLI_DEEP`).
Rule: what timing evidence a ticket can be asked for on this machine (resolution floor, protocol,
when a bound below the floor is refused at cut), and what `NFR-008` becomes (re-level, re-scope to
a count/per-file model like `ADR-0019` decision 5, or hand to the owner). Any NFR level move is the
owner's — recommend, don't move it. Cite measured readings; run new timing only if essential and
say load1. Output: ADR `proposed` (next free after ADR-0034), decision note, proposed nfr-catalog
wording in the note (do not edit the catalog), trace row at the END of `plans/traceability.md`.
Fences: no `src/`, `plans/board.md`, catalog, ticket pages, `AGENTS.md`.
