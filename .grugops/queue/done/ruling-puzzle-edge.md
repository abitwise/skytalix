---
task: wave-2026-09-25
subtask: ruling-puzzle-edge
role: architect-design
workflow: agent-factory/workflows (Architect ruling hop; ADR per memory-bank/50-decisions/ADR-template.md)
ref: .grugops/context/ruling-puzzle-edge/
source_refs: .grugops/context/secnfr-ABC-127/ (decision …2468e396 R1 + options, observation …6a3b6274 sweep)  .grugops/context/qe-ABC-127/ (QE-127-a)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:32:46Z
branch: grugops/ruling-puzzle-edge
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: rule Security/NFR R1 — how a budget-edge `PUZZLE_DEEP` red on a value-changing ticket is read and routed

Security/NFR (ABC-127, PASS_WITH_RISKS) measured: −4 % readings reds the gate (58 → 57); 4 of 5
harmless planted eval terms red it by node-cost drift alone; `ADR-0028` gives such a red no route
but the owner. Options (a) owner's word per red with depth + re-run at +5/+10 % attached; (b) re-cut
the four edge rows for margin (58 → 54, owner's word); (c) raise budget 10–15 %. Rule — or
recommend, where the decision is the owner's (any baseline/budget move is) — BEFORE `ABC-083`
enters dev. Constraints: do not loosen the gate, do not touch the baseline, do not change option
B's red rule (red = QE FAIL). Say how your answer composes with `ADR-0028` and `ADR-0031`
(`ABC-083`'s mobility cut) and `ADR-0032` (`ABC-087`'s blunder search spend). The ABC-127 branch is
not merged yet — read it with `git show grugops/ABC-127-harder-puzzles:<path>`. Output: ADR
`proposed` (next free number after ADR-0033), decision note per Workflow 16, trace row at the END of
`plans/traceability.md`. Fences: no `src/`, no `plans/board.md`, no baseline, no ticket pages.
