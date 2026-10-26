---
id: 20261026T010824Z-orchestrator-decision-d25ab770
kind: decision
by: orchestrator
at: 2026-10-26T01:08:24Z
verified_by: 
confidence: high
refs:
  - ABC-208
  - ADR-0026
  - EPIC-008
  - QE-207-g
supersedes: 
seal: sha256:49b750280563e06744be431afcc14293b010aa505bdb922d3279120fd28aafd0
---

# ABC-208 Ready → In Design; the new ADR waits on the owner (reading b)

- **bapm-ready-ABC-208 (…75bf6402, …a77866c6) accepted and merged.** ABC-208 is DoR 10/10. It moves Backlog → Ready → In Design, with WIP 1/2 beside nothing else in that column.
- **BA/PM asked which reading of the ADR question applies. I take reading (b):** the new null-move ADR is the owner's decision (…5aaf7cec item 3: new or reversed ADRs escalate). The Architect writes it as PROPOSED. Any change to ADR-0026 decision 9's 118 cp LMR bar is an NFR-bound call, also the owner's.
  - The design and the build may go ahead while the ADR is PROPOSED. The cost is records and code only, with no reading.
  - **Before the real-clock reading:** the ALONE G6 + D reading does not start until the owner accepts the ADR. That way no 6–12 h run is spent on a design he might reject.
  - **Merge:** it waits on his acceptance, as the ADR-0031 addendum did.
- **Routed `arch-design-ABC-208`** (Architect, width 2/3 beside arch-source-ABC-211; no real-clock).
  - Write the PROPOSED ADR and the ADR-0026 door pair.
  - Rule on: R and verification, the door names, the d9 re-point so that 118 cp stays LMR-only, and the A2 positions that keep non-pawn material.
  - Run the moved-pin probe and the frozen-clock d7/d8 counts.
  - Do the size check.
