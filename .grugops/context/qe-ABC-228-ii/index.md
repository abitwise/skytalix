<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-228-ii

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T09:38:52Z | decision | qe-e2e | high: written before any timed read, value reading or game; bars copied from ABC-228 A5/A6 Under (ii), ADR-0053 d10 and EPIC-010 § The merge rule |  | # qe-ABC-228-ii PREREG: the gates under reading (ii) (G5, G6, G11 at 4 s, G8), then the A6 smokes, sealed before any timed run or game |
| 2026-10-30T10:35:42Z | decision | qe-e2e | high: planted fault red on base (L6, L7) and on the head control (L4), green on head (L6, L7); scratch copies only |  | # qe-ABC-228-ii ruling on SE-228ii-a: CONFIRMED, LOW (test strength), non-blocking. A planted "setoption Hash moves the level to 6 or 7" is red on base and green on head |
| 2026-10-30T10:35:42Z | observation | qe-e2e | high: 20 clean interleaved real-clock reads at each build's own LEVELS[5], wait-clear before each, no foreign process at any poll; 10 G11 reads |  | # qe-ABC-228-ii G6 under (ii) MET on both boards (kiwipete 8 = 8, position-6 10 = 10; head at 4 000 ms, base at 3 000 ms); G11 at 4 s reported |
| 2026-10-30T10:35:42Z | observation | qe-e2e | high: every gate and lane run in this session on the candidate, wait-clear before each lane and each G8 run; exit codes and counts as run |  | # qe-ABC-228-ii checks: G9 under (ii), the Q-SET in src, lint / typecheck / build / npm test, the 15 deep lanes (G1, G5 at 4 s, G7, A4), G8 |
| 2026-10-30T11:59:00Z | decision | qe-e2e | high: verdict applied mechanically from the sealed PREREG section 7 to the readings |  | # qe-ABC-228-ii verdict: PASS_WITH_GAPS under reading (ii). G6 MET (8 = 8, 10 = 10), S-1..S-4 MET (D 5.0, R 7.0 at 4 000 ms). Gaps are non-blocking: SE-228ii-a LOW confirmed, QE-228ii-b INFO |
| 2026-10-30T11:59:00Z | observation | qe-e2e | high: both smokes ALONE at width 1, wait-clear at start, harness summaries and PGNs as played; foreign-vitest overlap recorded, no thermal stop, frequency fall <= 0.55 % |  | # qe-ABC-228-ii A6 smoke pair under (ii), ALONE at width 1: D 3/3/4 (5.0 / 10), R at 4 000 ms 7/3/0 (7.0 / 10); 0 faults, 0 time losses; S-1..S-4 MET |
| 2026-10-30T11:59:00Z | observation | qe-e2e | high: a pointer to files committed on the QE branch (an observation: an artifact-ref needs §14-gate provenance this run does not have) |  | # qe-ABC-228-ii artifacts: where the records are |
