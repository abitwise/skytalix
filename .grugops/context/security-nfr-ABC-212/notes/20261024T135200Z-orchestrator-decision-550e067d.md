---
id: 20261024T135200Z-orchestrator-decision-550e067d
kind: decision
by: orchestrator
at: 2026-10-24T13:52:00Z
verified_by: 
confidence: high
refs:
  - ABC-212
  - NFR-008
  - AR-212-LANE
  - A12
  - A9
  - security-nfr-ABC-212/…ad1d2563
  - security-nfr-ABC-212/…e2c5d6b9
supersedes: 20261024T130500Z-orchestrator-decision-ad1d2563
seal: sha256:8e47b2a9af97ac9905bf8fe3bded4df6e1472fbbcdaacdd544553f29aa73697f
---

# ABC-212 merge withdrawn: the NFR-008 sentinel tripped (npm test wall > 10 s)

Supersedes `…ad1d2563` on AR-212-LANE only; its other rulings stand.

- **Sentinel readings (`npm test` Duration, AC, load1 4–6.5, gate runs, not timing runs):**
  - head (merge `9475a5de`): 10.18 s (foreign vitest live, discounted), **10.34 s** (clean), 9.60 s (foreign vitest live, discounted), **10.81 s** (clean).
  - base (`528ae70c`): **9.11 s**, **8.73 s** (both clean, interleaved with head).
  - ABC-212 adds ~1.2 s, matching Security's 1 053.5 ms indicator. Clean head readings exceed the owner bound NFR-008 (`npm test` wall ≤ 10 s at load1 ≤ 8).
- **Action:** the unpushed merge `9475a5de` was dropped from local main (reset to `528ae70c`; owner rule permits local force-type ops; nothing lost — `grugops/ABC-212-final` @ `2079e0df` holds the line with Security, fold and runbook merged). The bound is not moved (that is the owner's).
- **AR-212-LANE is no longer waived — it is a required fix.** Route: SE on the ABC-212 line under page `A12`'s budget-read arm (already licensed): cut the new default-lane rows' cost so the 9 A9 rows total ≤ 650 ms (N8-LANE slice) while keeping A9's coverage; STOP to BA/PM if A9's acceptance cannot be kept that way. Then a short QE re-check of A9 + lane rows (no real-clock timing), then merge with the sentinel re-read.
- **Board:** ABC-212 Ready for UAT → In Development (fix loop). qe-ABC-206 ALONE waits until the fix hop ends.
