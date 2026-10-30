<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-220

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T14:48:10Z | decision | qe-e2e | high: written before any timed read or value read of QE rows; bars copied from ABC-220 A1-A14 (amended by arch-ABC-220-a14) and ADR-0052 D1-D9 |  | # qe-ABC-220 PREREG: QE rows (A1–A10, A13), mutants, A8 fence, gates, then A12, A11, A14a, A14b and G8 ALONE, each separately; sealed before any timed read |
| 2026-10-30T15:21:47Z | decision | qe-e2e | high: graded against the sealed PREREG; every A row, gate and timed reading met; one LOW and five INFO gaps, none blocking |  | # qe-ABC-220 verdict: PASS_WITH_GAPS. A1–A14 met (A14 = A14a + A14b), gates green, A11 / A12 / G8 met; one LOW test-strength gap, the rest INFO; the verdict signs UAT |
| 2026-10-30T15:21:47Z | observation | qe-e2e | high: paths and commands as run |  | # qe-ABC-220 artifacts: branch, commits, scripts, commands, raw records |
| 2026-10-30T15:21:47Z | observation | qe-e2e | high: each reading ALONE after wait-clear; figures copied from raw/alone and raw/g8 |  | # qe-ABC-220 timing: A12, A11, A14a, A14b and G8, each read ALONE and separately, wait-clear before each |
| 2026-10-30T15:21:47Z | observation | qe-e2e | high: every figure read from the run outputs in raw/gates, raw/qrows, raw/mutants, raw/deep |  | # qe-ABC-220 checks: gates, the A8 fence, skip integrity, 19 QE rows, 4 mutants and the deep lanes, as run |
| 2026-10-30T15:21:47Z | observation | qe-e2e | high for the measured facts; severities per PREREG section 5 |  | # qe-ABC-220 gaps and observations, with severity (none blocking), and what Security/NFR needs |
