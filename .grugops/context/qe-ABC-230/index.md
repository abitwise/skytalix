<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-230

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T05:11:04Z | decision | qe-e2e | high: written before any check, gate or game; bars copied from the ticket and EPIC-010 § The merge rule |  | # qe-ABC-230 PREREG: what QE reads, how, and what passes, sealed before any game |
| 2026-10-30T05:30:38Z | observation | qe-e2e | high on counts, hashes and exit codes as run; one host, plain node v26.12.1; v1 spot predicate faults named, not hidden |  | # qe-ABC-230 identity, spot checks, the planted fault and the gates at dad753dc: all MET. G9 ruled MET on its named lines |
| 2026-10-30T06:41:00Z | decision | qe-e2e | high: every row read by QE as pre-registered; QE-230-a is a design gap, not a build fault, and is not blocking under A1's wording |  | # qe-ABC-230 verdict: PASS_WITH_GAPS, with no blocking gap. A1–A9 MET, the gates are green, G9 is ruled MET, and S-1..S-4 are MET |
| 2026-10-30T06:41:00Z | observation | qe-e2e | high on counts, scores and host readings as run, ALONE, one host; 10 games per smoke see faults and collapses only |  | # qe-ABC-230 A7, the smoke pair, read ALONE at width 1: S-1..S-4 MET. D 5.5/10, R 8.0/10, no thermal stop |
