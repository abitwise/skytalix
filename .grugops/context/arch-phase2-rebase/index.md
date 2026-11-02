<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-phase2-rebase

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T15:18:39Z | decision | architect-design | high on the measured figures and the F-rules as written; the margin explanation of the ABC-264 loss is a judgement (UNKNOWN - verify) |  | # ABC-264 retry ruling: DROP (no re-play, no 150 cp re-cut on today's main); ADR-0059 accepted, not in force, QE-264-e named; ADR-0060 re-measured on main misses A3's 27 cp cap and A4 (a) on chooseMove position-6, so F1 re-opens it and the build does not start; bars unchanged |
| 2026-11-02T15:18:39Z | observation | architect-design | high (deterministic fixed-depth and maxNodes runs on scratch copies of main 5ffbae25 and 4d1c0616; the main door reproduces ADR-0059's QE-confirmed door counts to the node); the 190-row reverse-futility reach is by argument from 184 read rows |  | # arch-phase2-rebase probe: ADR-0060's rule on main misses A3's 27 cp cap (63 cp, search(), position-6/g5h6) and A4 (a) on chooseMove position-6 (0.8699 > 0.85); A4 (b) holds by 0.0026 ply (+0.2526). Reverse futility (4d1c0616) buys +0.70 ply at 47 000 nodes yet read -41.9 Elo |
| 2026-11-02T15:18:39Z | observation | architect-design | high (files in this branch) |  | # Artifacts of arch-phase2-rebase: ADR-0059 "accepted, not in force" + DROP ruling; ADR-0060 re-based on main and re-opened; ADR-0056 D2 dated line; raw probe; and what BA/PM needs for the P1 page |
