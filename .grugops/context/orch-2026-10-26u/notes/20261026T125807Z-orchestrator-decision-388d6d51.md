---
id: 20261026T125807Z-orchestrator-decision-388d6d51
kind: decision
by: orchestrator
at: 2026-10-26T12:58:07Z
verified_by: 
confidence: high
refs:
  - ABC-209
  - ADR-0025
  - arch-design-ABC-209/…2e73dcd9
  - arch-design-ABC-209/…b7d4b710
  - orch-2026-10-26t/…e496fc70
supersedes: 
seal: sha256:e6b1ffeaa1ac6145d3c4c00342db5da6e86ccc21b5c3610c0bdecf896226f5d9
---

# ABC-209 design accepted; ADR-0025 D4 amendment PROPOSED to the owner; BA/PM page lines next

- **arch-design-ABC-209 (…2e73dcd9, …b7d4b710) is accepted and merged** (b35d3997).
  - **Form:** an ADR-0025 decision 4 amendment, PROPOSED. The table lives for one game behind an opaque token (`EngineOptions.game`). A call with no token clears the table as it does today; that is the clear door, and no new export is added.
  - **Strict-prefix tracker:** held by the CLI level seam and by the UCI session.
  - **Clear points:** process start, CLI `new`/`undo`, `ucinewgame`, a non-continuing `position`, and the same position searched again.
  - **Unchanged:** the blunder path, 4 MiB, and always-replace.
  - **NFR-009 probe:** 41 024 B over 40 searches. Over 1 MiB is a STOP.
  - **Pins:** 0 moved pins and 0 re-points. Frozen-clock counts are 8/8 equal. Size S, no split.
- **What the owner is told: the expected value is low.** In the probe, moves 2–8 cost 0.94–0.97× of fresh nodes at d7 (record only).
  - A 3–6 % node saving is a small fraction of ABC-208's ~74 % reduction, and S1 needs a GAIN.
  - So D may well read NEUTRAL. That costs the one extension (~12 h in total), and then NOT MET.
  - This goes to the owner with the yes/no: accepting the ADR also buys that run. Declining closes ABC-209 undelivered.
- **Gate (reading b, …e496fc70):** the build may proceed. The ALONE reading and the merge wait on his acceptance.
- **Next: `bapm-amend-ABC-209`** (records only), carrying the Architect's page lines:
  - Scope 1: the CLI `new` clear path.
  - Scope 2: the clear door is "no token".
  - Scope 3: the adr front-matter line.
  - Test note 2: answered.
  - A4: the shape of the 40-search row.
  - A3: pair selection.
  - No bar changes. Then DoR → Ready for Dev → In Development.
