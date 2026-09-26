---
id: 20260926T201000Z-orchestrator-decision-52aaf5f3
kind: decision
by: orchestrator
at: 2026-09-26T20:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-109
  - ABC-121
  - AR-N8LANE-121
  - ADR-0026
  - ADR-0006
  - ruling-abc121-g6
supersedes: 
---

Owner (Olger Oeselg), 2026-09-26, verbatim: "1. accept ABC-109, merge it to working branch ; 2. accept the extra ; 3. accept"

1. ABC-109 UAT ACCEPTED by the owner on the QE UAT-run evidence at `ed92218` (`uat-run-ABC-109`, A1–A8 PASS). Merge `grugops/ABC-109-agents-md-cap` into the wave `grugops/wave-2026-09-25` authorised. Not to main — main waits for ABC-121 (owner's earlier word).
2. `AR-N8LANE-121` ACCEPTED by the owner as drafted by Security/NFR at `6570343` (ABC-121 ticket `## Security/NFR`): +910 to +1,285 ms CPU net against N8-LANE's 650 ms; optional arm F not applied; arm G rejected. Discharge terms as drafted.
3. The clarifying amendments proposed in `ruling-abc121-g6` ACCEPTED: ADR-0026 (decision 7, decision 9 note, Consequences) and ADR-0006 (G6 cell). Architect/Design to apply them verbatim from the ruling notes.
