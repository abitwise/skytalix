---
id: 20261102T144148Z-orchestrator-decision-d39f74ef
kind: decision
by: orchestrator
at: 2026-11-02T14:41:48Z
verified_by: 
confidence: high
refs:
  - ABC-265
  - ABC-264
  - ADR-0025
  - ADR-0057
  - ADR-0059
  - ADR-0056
supersedes: 
seal: sha256:84ef5d512c65873b0e630906ca618dd37212cb3807f05cdf5adbf35ab1a7aea2
---

Rulings: (1) ABC-265 owes no S2 nps read — identity ticket; its cost bar is A4 (G6 + profile, per ADR-0057 and the ADR-0025 amendment); probe/store are 0.95–1.44 % of samples, below run-to-run nps spread; fallback still fires on G6 below base (arch-ABC-265 …e396e5ab). (2) ABC-264 → Blocked (A6 NOT MET 44.0/100, qe-ABC-264-p2 …4a487d20); retry ruling owed to the Architect. (3) ABC-265 pulled to In Development on reading (b): build now, merge waits owner acceptance of the ADR-0025 shared-table amendment. (4) BA/PM smoke-pool ruling adopted: only merged builds pool into S′ (…5991ff69).
