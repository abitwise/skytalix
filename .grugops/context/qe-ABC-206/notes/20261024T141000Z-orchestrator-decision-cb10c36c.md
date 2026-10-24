---
id: 20261024T141000Z-orchestrator-decision-cb10c36c
kind: decision
by: orchestrator
at: 2026-10-24T14:10:00Z
verified_by: 
confidence: medium
refs:
  - ABC-206
  - ABC-204
  - A6
  - G11
  - S2
  - NFR-001
  - QE-206-a
  - QE-206-b
  - qe-ABC-206/…809cd42a
  - owner-word-2026-10-24/…4c3f7639
  - owner-delegation-2026-10-22/…5aaf7cec
supersedes: 
seal: sha256:d4d7fbf44f1bd221b28b37d414de964722cb97fe4f509dd6084cbeb8bb9ff878
---

# ABC-206 QE accepted; A6 (D not LOSS) waived; merge after the NFR-001 dated note

- **QE PASS_WITH_GAPS accepted** (`…809cd42a`, merge `b8a30264`, tip `918f308a`). A1–A5 MET: A4 ratio 0.438 (kiwipete) / 0.419 (position-6) vs bar 0.85; G6 depth 7 = base at 3 s with ~2x nodes; G1 54/58 identical rows; perft counts equal, 5.05 M n/s; A1 7 664 rows byte-identical; A2 0 mismatches. UAT signed by the QE verdict (`…5aaf7cec` item 2). This was the ONE run under `…4c3f7639`; nothing is re-run.
- **A6 / G11 (ship rule S2: D vs base not LOSS once ABC-204 is Done): WAIVED — the merge does not wait.** Reason: the owner's rule ends timing runs after the four pending ones, and a harness D reading for ABC-206 is not one of them. Evidence standing in for it: identical move/score/depth/nodes at every fixed limit (A1), 2.3x speed, depth-in-budget ≥ base (G6), identical puzzle rows (G1). In a timed game head searches the same tree further, so LOSS would need deeper search to play worse on balance. **Accepted risk LOW (owner: Orchestrator):** an unmeasured strength regression from a speed-only change. Veto open to the owner.
- **QE-206-a LOW (no plain-move discovered-check row in the lane) and QE-206-b LOW (count guards see only cross-module calls): accepted → Backlog** as one XS test-hardening follow-up (the two FENs and the `apply.ts` makeMove count). ENGINE_DEEP, A1 and A2 already catch both plants.
- **QE-206-c/-d/-e INFO:** closed; -e (stale `gameStatus` comment at `src/gameend.ts:17`) rides the follow-up.
- **Security/NFR:** the page says no hop is owed and names a dated NFR-001 note at the merge (the leaf no longer calls `gameStatus`). Routed as a short records hop `security-nfr-note-ABC-206` on the line; merge on green after it. Board: In Review → In Security/NFR for that hop.
