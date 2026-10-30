<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-241

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T12:42:13Z | decision | qe-e2e | high: written before any timed read, value read of QE rows or game; bars copied from ABC-241 A1-A10, ADR-0020 § AMENDMENT 2026-10-30 and EPIC-010 § The merge rule |  | # qe-ABC-241 PREREG: QE rows (A1–A9), mutants, gates, G8, the SE-241-b cost read, then the A10 smoke pair; sealed before any timed read, value read or game |
| 2026-10-30T14:31:12Z | decision | qe-e2e | high: by the sealed PREREG rule; every criterion read in this session |  | # qe-ABC-241 verdict: PASS_WITH_GAPS, no blocking gap. A1–A10 met; S-1..S-4 MET (D 6.0 / 10, R 6.5 / 10 at 4 000 ms); G4, G8, G9 and G10 MET; this verdict signs UAT |
| 2026-10-30T14:31:12Z | observation | qe-e2e | high: read off git and the scratchpad at the time of sealing |  | # qe-ABC-241 artifact record |
| 2026-10-30T14:31:12Z | observation | qe-e2e | high: ALONE, wait-clear before every run, interleaved base/head, same session |  | # qe-ABC-241 timed reads: G8 MET (head 9.63 s, +0.19 s); SE-241-b CLOSED (the per-ply derive costs +0.13 to +0.67 µs, 0.3–1.6 %); NFR-002 MET |
| 2026-10-30T14:31:12Z | observation | qe-e2e | high: both smokes ALONE at width 1, wait-clear at start, harness summaries and PGNs as played; foreign-vitest overlap recorded, no thermal stop, frequency fall <= 0.10 % |  | # qe-ABC-241 A10 smoke pair, ALONE at width 1: D 4/2/4 (6.0 / 10), R at 4 000 ms 6/3/1 (6.5 / 10); 0 faults, 0 time losses; S-1..S-4 MET; repetition endings D 1 (by the candidate) / R 1 (by Stockfish), neither touched by ABC-241's rule |
| 2026-10-30T14:31:12Z | observation | qe-e2e | high: rows, mutants, fences and gates as run; v1's 2 FAIL rows are QE's own predicates, kept and fixed in v2 |  | # qe-ABC-241 checks: QE rows A1–A8 (v2 0 FAIL; v1's 2 FAIL were QE's own base predicates), 4 mutants, fences, gates |
| 2026-10-30T14:31:12Z | observation | qe-e2e | high: each item backed by a mutant, a measured row or a replay in raw/ |  | # qe-ABC-241 findings and gaps: QE-241-a LOW (UCI `position fen` carrying ep has no src row); SE-241-a LOW confirmed; SE-241-b CLOSED; four INFO |
