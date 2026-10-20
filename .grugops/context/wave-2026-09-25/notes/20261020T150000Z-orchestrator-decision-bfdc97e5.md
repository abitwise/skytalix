---
id: 20261020T150000Z-orchestrator-decision-bfdc97e5
kind: decision
by: orchestrator
at: 2026-10-20T15:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-177
  - OQ-177-1
  - SEC-174-2
  - NFR-008
  - ADR-0046
supersedes: 
seal: sha256:f7d575b64b99bd4490af7d00d3d4bf92e7fd03420daa2649c82c6383241e3d2b
---

Owner word (Olger Oeselg, 2026-10-20, verbatim "start yes") answers both questions put to him: "Should I start ABC-177 now, and is mains-only a yes?"

1. He pulls ABC-177 into In Development, and the SE hop `ticket-to-pr-ABC-177` is dispatched.
2. **OQ-177-1 / SEC-174-2 is answered YES.** From now on, every NFR-008 reading (N8-LANE and the full lane) must be taken on AC power. Readings taken before today stay as taken. A reading taken on battery from now on is not admissible. Security/NFR is to fold this into the NFR-008 row of `plans/nfr-catalog.md` at the next catalog hop.
