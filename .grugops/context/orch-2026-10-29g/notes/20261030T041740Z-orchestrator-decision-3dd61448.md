---
id: 20261030T041740Z-orchestrator-decision-3dd61448
kind: decision
by: orchestrator
at: 2026-10-30T04:17:40Z
verified_by: 
confidence: high
refs:
  - ADR-0052
  - ADR-0053
  - ADR-0054
  - OQ-0052-1
  - OQ-228-1
  - EPIC-009
  - EPIC-010
  - ABC-220
  - ABC-228
  - ABC-229
  - ABC-230
supersedes: 
seal: sha256:75d20846e974a0228ea7be813a4d41d3bcdcce4299ca833d0ead0ddd0d3bd3cd
---

The owner's answers of 2026-10-30, in session, transcribed verbatim:

"ADR-0052: accept, but change 22.5s to 22s for simplicity and compatibility, ceiling also at 22s, no need to implement fraction of a second ceiling or time per move if it is not supported by current solution ; ADR-0053: accept ; QQ-228-1: If engine requires more effort then increase 3s to 4s, build it fully. ; ADR-0054: accept ; Q1: ok defer Syzygy tables ; Q3: I need more info to answer"

How each answer is recorded:
- **ADR-0052:** ACCEPTED by the owner with an amendment. simple-tournament spends T = 22 000 ms under a ceiling of 22 000 ms (was 22 500). Budgets stay whole seconds; nothing sub-second is introduced. min(T, C) and the ≥ 1 s safety keep as in D2/D3. uci-clock-mode (D4, 59.5 s under 60 s, the clamp moving to 60 s at ABC-221) is accepted as written. The owner changed only the simple-tournament figures.
- **ADR-0053:** ACCEPTED as written.
- **OQ-228-1:** "build it fully" = the full evasion design (not option (b)). The 3 s → 4 s clause applies only if decision 9's forecast still misses G6 after ABC-235/240 (nps now ~1.3–1.4×). Its exact reading (G6's measurement budget, or level 5's per-move time) goes back to the owner. It is only needed on a miss.
- **ADR-0054:** ACCEPTED as written. ABC-230 → Ready.
- **Q1 (Syzygy):** deferred. It stays out of EPIC-010.
- **Q3 (ep key):** open. The owner asked for more information, which goes to him in session from arch-ABC-230-reading …90a3aa31 § 3.

Routing:
- `arch-adr-accept-0052-0053-0054` (records only): mark the three ACCEPTED, apply the 22 s amendment, and add dated pointer lines to the ADRs they amend.
- `bapm-owner-adr-fold` (records only): fold the 22 s change into EPIC-009, ABC-220 and ABC-222; set DoR on ABC-220/228/229/230; record Q1 as deferred.

The builds follow once both are merged.
