<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-249

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T16:15:12Z | decision | qe-e2e | high: every figure below was run by QE at this hop under flock host-test.lock; gaps are LOW/INFO and none blocks |  | # qe-ABC-249 verdict: PASS_WITH_GAPS (QE-249-a LOW, QE-249-b INFO, QE-249-c INFO; none blocking). UAT waived, so this verdict closes the gate |
| 2026-11-01T16:15:12Z | observation | qe-e2e | high: mutants applied out of tree by QE (scratch qe-249/, diffs in raw/mutants/*.diff); the probe is an out-of-tree vitest file (raw/qe-scripts/qe249-probe.test.ts), never committed |  | # qe-ABC-249 mutant reads and non-vacuity probe: QPLY4 red (sole lane killer), QPLY5 green, QDRAW25 leaves the row green |
| 2026-11-01T16:15:12Z | observation | qe-e2e | high on the figures as run; admissibility is split (see body): NFR-008's load1 <= 8 and rc 0 line holds for all 6 runs, QE's ALONE precondition holds before runs 1-4 only; mid-run overlap with a short foreign vitest is UNKNOWN - verify |  | # qe-ABC-249 G8: head median 9.15 s, base 9.45 s, H−B −0.30 s (b h h b b h); ≤ 10 s MET; W1 not triggered; window ALONE for runs 1–4 only |
| 2026-11-01T16:15:12Z | observation | qe-e2e | high on the readings (probe and QDRAW25 as run); the durability call is QE judgment; the ply>=4-only draw-value survivor is reasoning, not run: UNKNOWN - verify |  | # qe-ABC-249 gaps and brittleness: pin the move and keep the score pin, but a relational assert (with keys ≠ withheld) is what proves QPLY4 dead durably |
| 2026-11-01T16:15:12Z | observation | qe-e2e | high: commands and outputs as run (raw/gates/, raw/mutants/); every run under flock host-test.lock |  | # qe-ABC-249 gates and commands run: lint, typecheck and build rc 0; npm test 2 363/2 363, 0 skips; skip-integrity and lane-inventory: No findings; A4 diff shape holds |
