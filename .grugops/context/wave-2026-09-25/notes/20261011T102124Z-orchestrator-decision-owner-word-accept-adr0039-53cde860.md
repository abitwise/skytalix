---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-11T10:21:24Z
sealed: false
refs: [ADR-0039, ABC-083]
---

# Owner word, 2026-10-11: ADR-0039 ACCEPTED

Verbatim: "accepting ADR-0039"

- Under ADR-0028 d5, this is the owner's word for the two ABC-083 re-levels in ADR-0039 decision 3:
  - row 15 (ABC-080 A3 d2): ≤ 40.5 % → **≤ 65 %**;
  - row 14 (ABC-079 A5, position-6 d2): ≤ 26x → **≤ 42x**.
- The conditions ADR-0039 attaches still bind:
  - the re-levels apply only if mobility ships;
  - they go in their own commit, on the rebased branch, with the rows re-read;
  - row 14 also needs the unordered-quiescence mutant to read above 42x (proof (iii), `UNKNOWN - verify` until run).
- Still open on ABC-083, and not decided by this word:
  - QE classing of PUZZLE_DEEP seed 5061 (ADR-0034 d3);
  - Security/NFR's reading of N8-LANE +1.08 s CPU;
  - A9: position-6 depth 7, which needs a quiet window. A stop there fires ADR-0031 d5, and that would make these re-levels moot.
- This is the Orchestrator's transcription of the owner's word in session, not a stamp.
