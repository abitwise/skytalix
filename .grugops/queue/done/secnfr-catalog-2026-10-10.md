---
task: wave-2026-09-25
subtask: secnfr-catalog-2026-10-10
role: security-nfr
workflow: agent-factory/workflows (Security/NFR catalog maintenance)
ref: .grugops/context/secnfr-catalog-2026-10-10/
source_refs: .grugops/context/wave-2026-09-25/notes/ (…owner-word-d7a1c3e5 item 4, …owner-word-adrs-91c4e7a0 item 4)  memory-bank/50-decisions/ADR-0034-*  .grugops/context/secnfr-ABC-127/ (proposed RISK-003 wording)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T11:12:09Z
branch: grugops/secnfr-catalog-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: bring `plans/nfr-catalog.md` up to today's owner rulings

1. **`ABC-074` dropped** (owner, 2026-10-10: non-M3 spike ruled out). Close the catalog's "Any non-M3
   machine" open item with that ruling; say what the catalog's targets now hold on (M3 reference only)
   and whether any row's wording must change because no non-M3 reading will exist.
2. **`ADR-0034` accepted with (b) at 0.8x.** Word the `RISK-003` line(s) you proposed at
   `secnfr-ABC-127` (hang guard sized from the printed wall × 6.3; count-gate budget margin recorded —
   0.8x after the puzzle-edge re-cut lands; today −4 %), citing ADR-0034.
3. **Do NOT apply `ADR-0035`'s wording** — it is proposed and `NFR-008`'s level is awaiting the owner.
Only `plans/nfr-catalog.md`, a decision note, and a trace row at the END of `plans/traceability.md`.
No `src/`, `plans/board.md`, ADRs, ticket pages.
