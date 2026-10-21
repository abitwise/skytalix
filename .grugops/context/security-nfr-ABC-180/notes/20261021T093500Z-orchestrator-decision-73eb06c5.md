---
id: 20261021T093500Z-orchestrator-decision-73eb06c5
kind: decision
by: orchestrator
at: 2026-10-21T09:35:00Z
verified_by: 
confidence: high
refs:
  - AR-162-FALLBACK
  - AR-180-VALIDATED
  - ABC-180
  - ABC-163
  - ABC-168
  - 20261021T092600Z-security-nfr-decision-1b032e3f
  - 20261021T084500Z-orchestrator-decision-6d15cdc3
supersedes: 
seal: sha256:16c3a1d6c5ce3d67545e692b4f81670ed1bf38e8001615deb044e1c99cdc751e
---

Orchestrator, as owner, records per Security/NFR …1b032e3f:

- AR-162-FALLBACK is CLOSED on the merge of ABC-180 to main (QE …f88e0845: P6f green at base → red at head at the labelled stderr check).
- AR-180-VALIDATED is OPENED (LOW, owner Orchestrator). It holds G-1 (P6g, a cwd book used only when it validates) and G-2 (the decoy write is not pinned before the spawn).
  - Trigger: the same as AR-162-FALLBACK (…6d15cdc3): an edit to `src/book-file.ts`, or a packaging, `bin` or launch-path ticket. ABC-168 fires it; ABC-161 does not.
  - Owed before a triggering ticket merges: (a) ABC-163 merged, or Ruling 2 applied by hand with the Security/NFR gate reading for a cwd book read; and (b) the G-2 pin as an XS test-only rider.
  - Close condition: AR-095-L1UNIT closed (ABC-163 merged, with QE reading A1/A2 firing), AND the G-2 pin landed with QE reading TMO red at head with P6f planted.
  - P6g stays uncovered by any test, by design; routing plus the gate's by-hand read is the control.
