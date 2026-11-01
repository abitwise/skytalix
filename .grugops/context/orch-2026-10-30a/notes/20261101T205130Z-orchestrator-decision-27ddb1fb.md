---
id: 20261101T205130Z-orchestrator-decision-27ddb1fb
kind: decision
by: orchestrator
at: 2026-11-01T20:51:30Z
verified_by: 
confidence: high
refs:
  - ABC-253
  - EPIC-010
  - memory-bank/50-decisions/ADR-0055
  - memory-bank/50-decisions/ADR-0056
supersedes: 
seal: sha256:bafa42b8234587a1bebc59a5248fe82315724e9e4828f59e1d396d9d7a65e251
---

ABC-253 CLOSED as dropped — "nothing to cut" (profile-first STOP; not a graded miss, no failed-attempt owed). Evidence (se-ABC-253 …efd7790c, …ba045718): key path ≈ 1.9–2.4 % of search self time; a full u32-halves scratch prototype (48/48 identity) cut the key update to 0.27 % but the TT probe cost is cache misses on the 4 MiB table, not bigint; GC unchanged; ceiling ≈ 1.007×; informal A/B 1.004 / 0.992 / 1.015× vs bar 1.02×. Also a page conflict (scope 1 vs A2's unedited ABC-081/122/208 rows) recorded for any re-open; re-open trigger stays "key path ≥ 5 %".

**EPIC-010 milestone 1b is CLOSED** (delivered: ABC-254, ABC-249, ABC-259/260/261; closed without delivery: ABC-250 by routing, ABC-251/252/253 dropped). The EPIC-010 close reads are now owed: the 400-game head-to-head at 100 ms (head = main, base ca6e675c; owner-set, pre-approved), the 0.5 s smoke vs E1650 on the head, the Levels deep lane, the ladder short mode and the UCI session deep lane on the head → `qe-EPIC-010-close`; then a BA/PM close hop grading M3/M4 and closing the epic.
