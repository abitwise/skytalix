---
subtask: arch-ABC-163-adr
role: architect-design
ticket: ABC-163
ref: .grugops/context/arch-ABC-163-adr/
branch: grugops/ABC-163 @ dc4d4f15 (read only)
width: queued; dispatched when a slot frees
---

# Architect: confirm the ABC-163 fold of ADR-0036 § S1 Ruling 2

The ABC-163 page names Architect/Design as the builder, but the Orchestrator routed the build to the SE. The SE folded Ruling 2 into `clause-b.mjs` (`87d3897d`) and added a dated line to ADR-0036 § S1 (`d8c073e2`) saying the by-hand check is no longer needed.

## Decide (kind: decision)
1. **Fidelity.** Does `87d3897d` implement Ruling 2 as ADR-0036 states it, including the "holders at base AND head" union?
2. **The ADR line.** Is the `d8c073e2` line accurate? Does it retire the by-hand check?
3. **AR-095-L1UNIT.** Does it close on this fold plus QE's re-plants?

Also read QE's result if `.grugops/queue/done/qe-ABC-163.md` exists by then.

## Fences
- Records only. No edits to the branch, `src/`, `AGENTS.md` or `plans/board.md`.
- If the ADR line needs changing, say exactly how; the Orchestrator routes the change.
- Never push or merge.

## Publish
- Seal notes with the plugin writer (task `arch-ABC-163-adr`).
- Write `.grugops/queue/done/arch-ABC-163-adr.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
