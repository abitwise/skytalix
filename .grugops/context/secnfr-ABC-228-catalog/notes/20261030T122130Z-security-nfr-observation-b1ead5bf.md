---
id: 20261030T122130Z-security-nfr-observation-b1ead5bf
kind: observation
by: security-nfr
at: 2026-10-30T12:21:30Z
verified_by: 
confidence: high: catalog, EPIC-008 and QE notes read at 09060f67; node --version read; severities LOW and INFO
refs:
  - ABC-228
  - NFR-004
  - NFR-005
  - NFR-009
  - AR-NFR004-A
  - ADR-0053
  - ADR-0053 d10
  - ADR-0045
  - plans/nfr-catalog.md
  - orch-2026-10-29g/20261030T044400Z-orchestrator-decision-c4ab73de
  - orch-2026-10-29g/20261030T041740Z-orchestrator-decision-3dd61448
  - qe-ABC-228-ii/20261030T115900Z-qe-e2e-decision-e39d190c
  - qe-ABC-228-ii/20261030T103542Z-qe-e2e-observation-3fac6579
  - qe-ABC-228-ii/20261030T103542Z-qe-e2e-observation-269152b2
  - grugops/secnfr-ABC-228-catalog
  - 0c54910e
  - 09060f67
  - e42b637b
  - SEC-228-a
  - SEC-228-b
  - NFR-008
  - NFR-012
  - G8
  - EPIC-008
  - bapm-epic008-hostB/20261028T211452Z-ba-pm-decision-f0c8fedb
supersedes: 
seal: sha256:3be4a3cc71304be2b96ca040a1bdc4c319b566b9cf41264ce49a4c7802f1a86f
---

# SEC-228-a (LOW): catalog's M3 reference machine and Node v26.11.x runtime are stale since the 2026-10-28 host move; SEC-228-b (INFO): NFR-009 "not built yet" stale; G8 headroom 0.39 s recorded

Found while placing the ABC-228 (ii) text. Records only.

## SEC-228-a (LOW, records; owner: the Orchestrator, to route to the owner)
- plans/nfr-catalog.md says "Every target in this file holds on the M3 reference only" (ABC-074 drop, owner's word 2026-10-10); declared runtime Node v26.11.x.
- The agents moved to a new Linux host on 2026-10-28 (EPIC-008, bapm-epic008-hostB, owner …5dbd717b); the previous host is retired. QE's 4 000 ms readings (G5, G6, G8) were taken on it; node --version reads v26.12.1 there.
- So the NFR-004/NFR-005 readings are recorded with their host and do not re-base either row. Re-basing the reference machine and runtime is the owner's word (as the runtime re-base was on 2026-10-10). It does not gate ABC-228: the bounds are met on the host that now runs everything, and the old host can no longer be read.
- Not an ASVS row; LOW because every timing and depth target's scope sentence is now about a machine nobody can read.

## SEC-228-b (INFO; owner: Security/NFR at the next catalog hop)
- NFR-009 Verified by still ends "UNKNOWN - verify: not built yet. First consumer is ABC-081 A7." It was built at ABC-081, read MET at 30 s at ABC-212, and its instrument ran green at 4 000 ms at ABC-228. Outside this brief; not edited. Fix: one dated line of the SEC-212-b shape.

## G8 (NFR-008 R-1), recorded, not ruled
- QE: npm test head median 9.61 s vs base 8.91 s (+0.70 s), load1 <= 1.15; 0.39 s under R-1's 10 s. Real-clock DEFAULT_BUDGET_MS rows sit behind ENGINE_DEEP (QE, from source). Head has 41 more tests (2 219 vs 2 178). Whether default-lane virtual-clock rows search more at the larger budget is UNKNOWN - verify; the split of the +0.70 s is not on record. NFR-008 not edited (outside the brief); headroom is the Orchestrator's to watch.

## Neighbours checked, no edit owed
- NFR-011 / NFR-012: bounds not denominated in 3 000 ms; NFR-012 reads "default options" at Skill Level 5, now 4 000 ms per ADR-0044 D11 (recorded at the ADR-0045 fold). S-2 at 4 000 ms: 0 time losses in 20 games (EPIC-010 smoke; supportive, not an NFR-012 reading).
