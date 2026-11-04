---
id: 20261104T135528Z-software-engineer-failed-attempt-0b0b135f
kind: failed-attempt
by: software-engineer
at: 2026-11-04T13:55:28Z
verified_by: 
confidence: high on the measurement and the attribution (each part's door read on every miss); the cause beyond 'history reorders LMR/futility indices' is UNKNOWN - verify
refs:
  - se-ABC-283
  - grugops/ABC-283
  - ABC-283
  - ABC-233
  - ABC-234
  - ABC-236
  - EPIC-011
  - O1h
  - O3s
  - S1
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - ADR-0064
  - ADR-0069
  - ADR-0026
  - ADR-0050
  - ABC-279
  - ABC-122
  - ABC-084
  - P0
  - G1
  - F2
  - NFR-008
  - NFR-009
  - orch-2026-10-30a
  - 4c4cb03d
  - 09694a4e
  - 0d573303
  - d15752cc
  - 2b192331
  - src/search.ts
  - src/engine.ts
  - src/see.ts
  - src/search.bundle.test.ts
  - src/see.test.ts
  - src/engine.capacity.test.ts
  - src/search.futility.test.ts
  - src/evaluate.taper.test.ts
  - src/quiescence.test.ts
  - src/search.null-move.test.ts
  - src/search.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:8d5649dfc5a52924e47a482d10fd0b18da9210bb3b6f83f3e8d41aec9dd9ed0c
---

Cause: engineer

# se-ABC-283 BLOCKED on one bar: the ADR-0064 d7 mate floor. The bundle as built (ADR-0063 H1 + ADR-0065 S1m + ADR-0066 A100, each to its ADR) loses same-depth mates on KRK in both recursions. The history part alone causes it. Do not retry by tuning history in place.

- **Measured:**
  - `search()` d5: 1 of 190 door mates is not a mate;
  - `chooseMove` d5: 2 of 188; d6: 4 of 209.
  - Every miss is a lone rook with king against king, scored 652 / −652 instead of mate in 3.
  - Turning off history alone (`searchWithoutHistory`, `chooseMoveWithoutHistory`) restores every one. SEE ordering and aspiration lose none.
- **Not a wiring defect, as far as this hop can show:**
  - P0 is exact.
  - The table is node-faithful to the probe's H1 rules.
  - Lifetime, update and order units are green.
  - The value change goes through LMR and futility indices (ADR-0063 d11).
- **Tried and not done:** nothing was tuned. ADR-0063 § Status forbids tuning after the read, and the design of record is the Architect's. Holding the history-ordered quiet moves out of LMR or futility on mating material, or another form (H0, H2, H3), is a design change. It needs a new probe and the Architect.
- **Open to the Orchestrator** (the owner's 2026-11-04 ruling made these bars the gate before the one 100-game read):
  - (a) the Architect rules on F2 for the history part;
  - (b) re-scope the bundle without O1h (SEE ordering + aspiration pass the mate floor here);
  - (c) the owner's word on the bar.
- **What stands either way:** the build is on `grugops/ABC-283`; nothing was merged or pushed, and no game was played.
