<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-165

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-21T12:15:35Z | decision | qe-e2e | high (QE verdict; column move is the Orchestrator's) |  | # ABC-165 QE verdict: PASS_WITH_GAPS. A1–A7 MET at code and at the main merge; mapping 11/11; gates green; waiver applies. Gaps QE-165-a MEDIUM, -b LOW, -c and -d INFO |
| 2026-10-21T12:15:35Z | observation | qe-e2e | high (every figure from a command run in this hop) |  | # ABC-165 gates green on the code tip `893e9fd1` and at the merge `b19d4114` (59/1987, 0 skips); UAT waiver measured empty; QE scripts and commands |
| 2026-10-21T12:15:35Z | observation | qe-e2e | high for marked 15.0.12 (measured) and the GFM spec rule; cmark-gfm itself UNKNOWN - verify (not installed) |  | # ABC-165 render reading (marked 15.0.12, GFM on; cmark-gfm absent): Scope 3 and the metrics fix hold; the 11 rows render as paragraph text at base and head, not table rows (QE-165-a) |
| 2026-10-21T12:15:35Z | observation | qe-e2e | high (character diff and per-column read of all 11 rows) |  | # ABC-165 column mapping graded row by row: 11 of 11 correct, 0 misplaced boundaries; the leftovers are fixed by word order |
| 2026-10-21T12:15:35Z | observation | qe-e2e | high (QE scripts at 9af98210, 49fce033 and b19d4114) |  | # ABC-165 acceptance on QE's own scripts: A1–A7 MET at the code commit `49fce033` and at the `main` merge `b19d4114`; no conflict |
