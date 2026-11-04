---
id: 20261104T172140Z-orchestrator-decision-87b1a957
kind: decision
by: orchestrator
at: 2026-11-04T17:21:40Z
verified_by: 
confidence: high
refs:
  - ABC-301
  - B-T8
  - B-T4
  - ADR-0067
  - NFR-008
supersedes: 
seal: sha256:cbbf8b79e51ae3609e667f59774256730fdab5ba1455df9a74e48cf7e100bb3c
---

bapm-ABC-301-cut merged e932e46e (ABC-301, DoR 10/10, Ready). Rulings on its open items:
1. B-T8's command. On main, `rpair` has no --budget-ms; it plays 4 000 ms at Skill Level 6. B-T8 runs as TWO `r --budget-ms 500` reads, candidate vs Stockfish and main vs Stockfish, 200 games each, with the same Stockfish settings, openings, seed rule and harness commit. Each read runs alone in one flock, sequentially.
   - The pair's comparison is read as ADR-0067 B-T8 states it.
   - No harness ticket: `r --budget-ms 500` already plays 0.5 s.
   - The owner's ~5 h approval (…dda43b71) covers both reads.
2. The endgame G2 row above 1.02×: it is a B-T4 row, so a reading above 1.02× is a B-T4 miss with B-T4's own consequence. No new falsifier is invented. The Architect may restate this in a dated ADR-0067 line at the next records hop; it is not blocking.
3. The ten pages that mention "the second pull" without an id: optional, left for a later records sweep.
4. Board: ABC-301 → Ready. Its scope 0 (the preconditions) goes to SE after secnfr-nfr008-1104 rules on test-time headroom, because the hot-path row adds default-lane rows.
