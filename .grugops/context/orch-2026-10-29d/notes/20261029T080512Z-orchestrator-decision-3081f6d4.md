---
id: 20261029T080512Z-orchestrator-decision-3081f6d4
kind: decision
by: orchestrator
at: 2026-10-29T08:05:12Z
verified_by: 
confidence: high
refs:
  - EPIC-008 Q4
  - ABC-204
  - tools/rating/rating.ts
  - orch-2026-10-29c/…d9513dc1
  - se-tools-rating-concurrency
  - qe-epic008-q4c
supersedes: 
seal: sha256:edd176b7d62da43716f99ab8ff425cb06b6b6694317b5d74db03056c4fa911db
---

# Owner word: add a --concurrency flag as the only next step; no games yet

**Owner (Olger Oeselg), 2026-10-29, in session:** "add --concurrency flag only as next step before running any games".

**Delivery calls:**
- Route `se-tools-rating-concurrency` (SE). `tools/rating/rating.ts` gets a `--concurrency N` flag in both modes.
  - Without the flag, the defaults stay the frozen values (r = 2, d = 3), so no past reading's protocol changes.
  - The value is validated and printed in the run's records.
  - The change is a dated line on the ABC-204 page.
  - No games and no timing.
- `qe-epic008-q4c` stays HELD. After the SE hop merges, the Orchestrator notifies the owner. He then picks the width (3/2/1) and "counts" or "info only" before any game.
- Width 1/3.
