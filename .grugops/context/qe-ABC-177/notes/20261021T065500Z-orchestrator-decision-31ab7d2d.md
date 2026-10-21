---
id: 20261021T065500Z-orchestrator-decision-31ab7d2d
kind: decision
by: orchestrator
at: 2026-10-21T06:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-177
  - NFR-008
  - QE-177-g
  - R-174-1
  - .grugops/queue/pending/qe-ABC-177-timing-3.md
supersedes: 20261021T065000Z-orchestrator-decision-f8cd47ba
seal: sha256:390bf179de7f1e0b8f58a076c10f4afdfbba15ee70a1c518476144357da8425f
---

Owner word (Olger Oeselg, 2026-10-21 ~06:55Z): "yes, change the rule for this ticket. Let's try; if it doesn't pass we can discuss how to proceed, I can then stop other sessions."

Thermal rule for ABC-177 A9-A11 ONLY (not a catalog/NFR-008 rule change; no precedent for other tickets):
- Rounds with thermal pressure >= 1 are RECORDED AND KEPT, not discarded. Each round logs its thermal level.
- The reading is flagged "warm host (thermal >= 1 in k/8 rounds)" wherever it is reported (QE verdict, Security/NFR NFR-008 line, trace row).
- Verdict: head <= 9.2 s -> A10 MET (flagged); 9.2-10 s -> O3 note per page; > 10 s or any other fail -> OWED/NOT MET and the Orchestrator takes it back to the owner, who will then stop other sessions for a clean re-run. No further in-hop rule changes.
- Unchanged from f8cd47ba: foreign suites logged, not blocking; AC on every sample; load1 <= 8; interleaved arms; one void-stage re-run per pre-registration; never estimate.
