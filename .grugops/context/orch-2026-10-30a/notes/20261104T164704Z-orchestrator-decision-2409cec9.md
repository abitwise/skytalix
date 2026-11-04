---
id: 20261104T164704Z-orchestrator-decision-2409cec9
kind: decision
by: orchestrator
at: 2026-11-04T16:47:04Z
verified_by: 
confidence: high
refs:
  - ABC-283
  - QE-283-i
  - QE-283-a
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - R-N8H-1
  - Q-N8H-1
supersedes: 
seal: sha256:7e3f585b5e7fac74aab0e92367413aedb12fa3f728c06d6b71725f6df4df1440
---

ABC-283: QE PASS_WITH_GAPS (…de1dc511). The verdict signs UAT (owner delegation).
- C2′: 59/27/14 = 66.0/100 ≥ 50.0, MET; Elo +115.2 ± 67.0.
- S′: 6.0/10 against E1810 (information).
- Every offline bar is met, and the Levels lane is 58/58.
- NFR-008 graded: a 9.60 s median.
Dispositions:
1. QE-283-i, MEDIUM, before the merge: se-ABC-283-merge merges main (with ABC-271) into the QE branch, with no rewrite, and resolves the test-file conflicts. On the merged tree it re-reads the following (no games re-run), and every count is explained against main's post-271 figures:
   - P0 against main's post-271 counts;
   - the mate floor at d5;
   - zugzwang;
   - G1;
   - typecheck, lint and build;
   - npm test ≤ 10 s.
2. Bundle acceptance: on the pass, ADR-0063 (with K3), ADR-0065 and ADR-0066 are ACCEPTED as a bundle by the owner's word (…4c4cb03d item 2). arch-ABC-283-accept writes the Status lines, plus the R-283-LMR carry and QE-283-c.
3. QE-283-a, MEDIUM: R-N8H-1 → MEDIUM; Q-N8H-1's 9.6 s trigger fires. A Security/NFR hop follows the merge (…c7609f51 item 3).
4. QE-283-b and c, LOW: carried to the Architect. The d to h items are information.
5. After the merge, ABC-282 (W1) is unheld, and ABC-286 and ABC-288 are unheld for their probes.
