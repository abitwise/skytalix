---
id: 20261104T024334Z-orchestrator-decision-6b09d896
kind: decision
by: orchestrator
at: 2026-11-04T02:43:34Z
verified_by: 
confidence: high
refs:
  - ABC-280
  - QE-280-b
  - QE-280-c
  - NFR-008
supersedes: 
seal: sha256:9a64e3b61166b59bd9f6543e3b6a71705866ea9c51bcd4131a90a2f6d612a75f
---

ABC-280 (tools/tune lands alone): QE PASS_WITH_GAPS (…cf60119e); UAT waived under A2 (zero production lines). Merge to local main as a merge commit (QE-280-d: keeps the emitted header's tool hash). QE-280-c: Orchestrator checks the src/ diff of the real merge is empty, then post-merge npm test. Gaps accepted LOW: QE-280-a (unterminated PGN comment cuts a game silently; owed to the second pull if its data changes), QE-280-b (NFR-008 default-lane headroom ≈ 0: main median 9.73 s, tip 9.82 s, two tip reads 10.04/10.05 s) → Security/NFR review before anything else is added to the default lane; QE-280-e/f/g INFO.
