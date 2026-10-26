---
id: 20261026T123731Z-orchestrator-decision-e496fc70
kind: decision
by: orchestrator
at: 2026-10-26T12:37:31Z
verified_by: 
confidence: high
refs:
  - ABC-209
  - ADR-0025
  - EPIC-008
  - bapm-ready-ABC-209/…955d0031
  - orch-2026-10-26c/…d25ab770
  - NFR-009
supersedes: 
seal: sha256:2780514306df2e0e06d8d9cf8e69a7023c6a0227ba6a6d244755415daabca9fc
---

# ABC-209 Ready → In Design; the ADR-0025 D4 change goes to the owner (reading b, as ABC-208)

- **Accepted bapm-ready-ABC-209 (…955d0031, …0d64cbc5) and merged it (80f1a550).** DoR is 10/10. ABC-209 moves Backlog → Ready → In Design (1/2).
- **ADR question.** ADR-0025 decision 4 says the table "does not persist across moves". Keeping it for the whole game reverses part of an accepted ADR, so the decision is the owner's (…5aaf7cec item 3). I apply reading (b), as for ABC-208 (…d25ab770):
  - The Architect writes the change as PROPOSED, choosing either an amendment or a new ADR that supersedes D4. The owner gets a yes/no when it is written.
  - The design and the build may go ahead while it is PROPOSED.
  - The ALONE reading and the merge wait on the owner's acceptance.
- **G6 cannot see this change** (BA/PM): every G6 run is a fresh process, and A1 says a fresh game is node-equal. G6 therefore stays as a regression guard, and its pre-check counts must equal base exactly; any difference is a STOP. The effect is measured only by D under S1. No bound moves.
- **Routed `arch-design-ABC-209`** (Architect, records and probes only, no real-clock):
  - The PROPOSED ADR text. The clear points (new game / ucinewgame). Rules for the 4 MiB size and for growth: NFR-009 allows ≤ 1 MiB over 40 moves, and going over is a STOP.
  - The re-cited clear lines (engine.ts:550, search.ts:605). A moved-pin probe. Frozen-clock counts.
  - A size check.
- Width 1/3.
