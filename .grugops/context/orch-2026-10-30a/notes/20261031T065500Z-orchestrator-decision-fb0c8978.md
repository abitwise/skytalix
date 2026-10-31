---
id: 20261031T065500Z-orchestrator-decision-fb0c8978
kind: decision
by: orchestrator
at: 2026-10-31T06:55:00Z
verified_by: 
confidence: high
refs:
  - qe-EPIC-010-m1-batch
  - QE-M1B-a
  - QE-M1B-b
  - ADR-0053
  - EPIC-010
  - ABC-225
  - src/levels.ts
supersedes: 
seal: sha256:14bf0a5f358892a48e3c0ac84366d0584a8ec8173ff9a08384b42ec01fb271af
---

## Ruling: milestone-1 batch route (A): rpair passes Skill Level 6 to skytalix

qe-EPIC-010-m1-batch STOPPED before game 1 (QE-M1B-a, HIGH). The base, ca6e675c (main just before ABC-230), caps `go movetime 4000` at level 5's 3 000 ms, so the pinned rpair would play 3 s against 4 s. That contradicts ADR-0053 d10 ("4 000 ms both sides") and biases the result toward not LOSS.

**Route (A) chosen** (delivery call, within the 2026-10-22 delegation; the ADR is unchanged, its intent kept).
- A tools-only change: rpair passes `option.Skill Level=6` to skytalix.
- Read at main 3dc2f2f0 `src/levels.ts`: level 5 is {4 000 ms, rate 0} and level 6 is {5 000 ms, rate 0}. Levels 5 and 6 differ in budget only, and both are rate 0 at the base too (QE probe: base Skill Level 6 → 4 001 ms).
- The SE must confirm that the level reaches nothing else in `go()` at both SHAs.
- Route (B) needs an ADR amendment plus a confounded verdict. Route (C) is outside the instrument. Both rejected.

**Cost restated:** about 21.7–24.1 h ALONE (QE-M1B-b), against the 18.5 h the owner was told. I am telling the owner; he may stop or reschedule.

**Audit owed (records reading):** any R smoke whose base predates ABC-228 (level 5 = 3 000 ms) while rating.ts's R sends 4 000 was also asymmetric. Candidates: ABC-228's own R smoke, and ABC-225-w1 A5's games/h (confirmed 3 000 ms by QE). BA/PM reads the ledger and names which readings were affected and whether any verdict moves.

**Order:**
1. qe-ABC-245 runs ALONE now (the host is free).
2. bapm cuts the rpair ticket beside it.
3. The SE builds after qe-ABC-245.
4. The tools QE.
5. The batch.
