---
id: 20261101T230113Z-architect-design-decision-b09b24ff
kind: decision
by: architect-design
at: 2026-11-01T23:01:13Z
verified_by: 
confidence: medium
refs:
  - ABC-263
  - ABC-253
  - EPIC-011
  - memory-bank/50-decisions/ADR-0057
  - memory-bank/50-decisions/ADR-0025
  - memory-bank/50-decisions/ADR-0026
  - memory-bank/50-decisions/ADR-0044
  - qe-ABC-263
  - arch-adr0057-fix
supersedes: 
seal: sha256:2b1b51314e7a556512b35be6304765b4d71cd3f62a72dc83b70260656df7b5ea
---

# ADR-0057 G1 corrected: the threads table makes its own key split at the table boundary; threads effort L, 32-65 h (42-85 h on fallback)

ADR-0057 stays PROPOSED. This note corrects the threads line and the effort in arch-ABC-263's decision ...b92cf5cd and in ADR-0057 (status block, Context "Keys", D2.3, Q2 summary, D6). It does not supersede that note's other content. The correction comes from QE gap G1 (qe-ABC-263 ...5e4c6533).

## Decision
- **The fact.** ABC-253 was DROPPED at 2026-11-01T20:51:36Z (608ebfa4, Orchestrator ...27ddb1fb), before ADR-0057 was written. Keys stay 64-bit bigint on main.
- **The design.** The shared table splits the key inside probeTable(key) and storeEntry(key, ...): keyLo = Number(key & 0xffffffffn), keyHi = Number(key >> 32n). The signatures stay bigint.
- **What is reused from se-ABC-253's prototype** (raw/patch.py, 48/48 identity): the table half only. That is two Uint32 key words a slot, slot = keyLo & mask (the same slot as today's key & mask), and probeHalves/storeHalves.
- **What is not reused:** the halves key update, the per-ply key array and the repetition scan. That half read about 1.00x (...efd7790c), and it is the half that collided with the ABC-081, ABC-122 and ABC-208 rows.
- **Why at the boundary.** Read, not run: ABC-081's vi.mock wraps probeTable(one bigint) and storeEntry(args[1], args[4]). A6 counts one BigUint64Array a call, and that is the per-ply key array, not the table. A7's 4 MiB still holds (4 x Uint32 x 2^18). ABC-122's zobristKeyAfterMove mocks and ABC-208's probe watch also stay on the call path. So se-ABC-253's page conflict does not arise. Whether every row passes unedited is UNKNOWN - verify until the shared-table ticket runs them.
- **Threads 1 stays node-for-node equal to today:** the same slot, the same always-replace, and the same hit rule (a non-zero data word and both halves equal). The G4 door test proves it.
- **One trap:** compare as unsigned, ((w0 ^ w2) >>> 0) === keyLo.
- **Effort.** Was L, 30-60 h; now **L, 32-65 h**. The split adds 2-5 h (estimate): 1-2 h for the split, and 1-3 h for a Threads 1 profile against main using se-ABC-253's raw/profile.sh and raw/analyse.mts. The door test was already counted.
- **Fallback, only if that profile shows a cost:** carry se-ABC-253's full halves path. That adds 10-20 h, so **42-85 h**, and re-points the ABC-081/122/208 rows under an Architect ruling within ADR-0026.
- **Unchanged:** the recommendation (pursue after EPIC-011 phase 1), the order and the verdicts.

## Scope
Records only: ADR-0057 text and these notes. Nothing run, no src/.

## Risks
- The split's cost is an estimate. It is about the same bigint work as today's probe; a store adds one shift.
- The rows' pass is read, not run. The brief's "reuse se-ABC-253's prototype approach" is followed for the table half only, with the reason stated above.
