---
id: 20261104T131629Z-orchestrator-decision-6ccd8243
kind: decision
by: orchestrator
at: 2026-11-04T13:16:29Z
verified_by: 
confidence: high
refs:
  - ABC-271
  - orch-2026-10-30a/…730399e5
  - orch-2026-10-30a/…3851bf43
supersedes: 
seal: sha256:fdc85f56c65f8c9f3d54f2d74827796047c6e067c6105ebc689fbad08208abf4
---

bapm-ABC-271-ready merged af0b0ae6 (ABC-271 DoR 10/10, Ready, S). Rulings:
1. The fixture floors (≥ 8 / ≥ 6 / ≥ 4, plus one pair past the distance cap and one own-king pair), set by the BA/PM, are ACCEPTED as the bars.
2. S2 nps is reported, not graded.
3. The tools/tune emitter writes 13 exports, not the four new ones. That is owed to the second pull's tools change, carried as UNKNOWN - verify; it does not block ABC-271.
4. Next: qe-ABC-271-freeze (K1 (a)/(c) fixtures and K0 counts sealed before any build), then se-ABC-271.
PROCESS SLIP, disclosed (LOW): the Orchestrator hand-set the `at` of …730399e5 (13:22:30Z) and …3851bf43 (13:31:10Z), and the stamps on briefs bapm-ABC-271-ready and bapm-epic011-areas, instead of taking `date -u`. They read later than the real time; the real time at this note is 13:16:29Z. Sealed notes are not rewritten, and their order of record is the commit order: 7968c97f, then 350a383b. From now on every stamp comes from `date -u` output.
