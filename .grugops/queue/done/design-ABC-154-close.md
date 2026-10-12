---
subtask: design-ABC-154-close
role: architect-design
status: done
branch: grugops/design-ABC-154-close
tip: 0fe43646
base: b89b3fd2
notes: .grugops/context/design-ABC-154-close/notes/ (…59338ee3 observation, …4ef98a0b decision, …ecdd3407 artifact-ref)
---
- RISK-ABC105-LANE CLOSED in plans/nfr-catalog.md (Closure subsection + dated line under the risk header): qe-ABC-154 w1 at 0f8036f9 MET at 650 ms CPU, +0.380 s (+0.350..+0.410), twin -0.005 s (-0.870 %), non-zero signs +1/-4 p 0.375, R 0.030 s; recomputed from the raw TSV, agrees with QE on every figure. Not back-dated to 8fd0c233.
- QE-154-b: satisfies A1 (b9a5c957 committed after e7d8a09f, its ancestor, and before the first run; same blob on main). Wording clarified in ADR-0035 § Addendum 2026-10-12 (after ABC-154) B1; no state moves.
- QE-154-c: F stays 0.020 s CPU / 0.020 s wall (median of 0.010/0.020/0.030); one dated floors sub-bullet. Counting QE4 w2 would give 0.030 CPU; it is not counted (A1 forward-only).
- T-c re-homed as T-QEHOP-GROWTH (4,000 notes; 2660 at b89b3fd2; projection ~0.49 s at 4,000). LOW.
- QE-154-d: no bearing on admissibility; no new rule.
- NFR-00[1-8] c74e7426…0d3b, all nine 6b62892c…6b41, unchanged. Gates green (lint 109, typecheck, build, npm test 57/1775 success:true, No findings). No timing taken.
- Owed: the board's "catalog entry owed" line (Orchestrator). Trace row and BA/PM's both append at the end of plans/traceability.md: a both-append merge conflict for the Orchestrator.
