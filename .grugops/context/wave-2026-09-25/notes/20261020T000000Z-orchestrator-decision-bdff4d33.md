---
id: 20261020T000000Z-orchestrator-decision-bdff4d33
kind: decision
by: orchestrator
at: 2026-10-20T00:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-174
  - R-174-1
  - QE-174-b
  - NFR-008
  - secnfr-ABC-174
  - qe-ABC-174
supersedes: 
seal: sha256:05b121e456804c9f7141a8a1051a7a5acf803aa2db7087fa8098c838b7e3d0e5
---

Owner word (Olger Oeselg, 2026-10-20, verbatim "accepr R-174-1"): R-174-1 ACCEPTED, i.e. option (a) as put to him. The full default lane `npm test` reads 10.010 s median against NFR-008's 10 s bar (QE-174-b, secnfr-ABC-174). It is not attributable to ABC-174, which adds +0.115 s CPU and +0.03 s wall. ABC-174 may proceed to merge on this risk. Architect/Design is to size a remedy that brings the lane under 10 s; until it lands, any gate reading the lane sees NOT MET under R-174-1. R-173-1 stays open and unchanged. The pre-cap noise floor F is unchanged.
