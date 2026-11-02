---
id: 20261102T205000Z-orchestrator-decision-77a82ec1
kind: decision
by: orchestrator
at: 2026-11-02T20:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-268
  - ADR-0061
  - ADR-0056
  - ABC-265
supersedes: 
seal: sha256:795f66893ead633d9e268ee94fdff2ad247f0872b45b2a84a63c0490f4d54baf
---

ABC-268 MERGED to local main e72487e1 on qe-ABC-268-p2 PASS_WITH_GAPS (…186a743e): A6 58.0/100 (41/34/25, +56.1 ± 56.1, LOS 97.6 %, 0 time losses), smoke 8/10 vs E1650, Levels 57/57. Post-merge on main (with ABC-265): typecheck 0, lint clean, npm test 2 429/2 429 — closes QE-268-p2-e. Ruling on QE-268-p2-a (foreign unlocked vitest during games 24–64): read stands — not ours (no hop of this session ran tests then), load bounded (load1 ≤ 3.61, 0 time losses), and the candidate scored lower inside the window (21.5/40) than outside (36.5/60), so the load biased against the pass; no re-play per ADR-0061. S′ pool now 26/30 = 86.7 % > 85 % → upward re-pin fires (owner pre-authorised upward moves).
