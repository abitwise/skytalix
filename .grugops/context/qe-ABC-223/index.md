<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-223

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T08:53:45Z | decision | qe-e2e | high (written and sealed before any game; pins verified by QE; method copied from qe-ABC-222's PREREG 63f93685; bars from ABC-223 A1-A7 as re-scored) |  | # qe-ABC-223 pre-registration: the `uci-clock-mode` smoke at 40/15: 5 games of `main`'s tip build against itself in `cutechess-cli` 1.5.1, ALONE, width 1, launched detached; A1–A7 bars, derivations, thermal stop, the foreign-process rule and the VOID rule |
| 2026-11-01T12:52:58Z | observation | qe-e2e | high: paths, hashes and commands as run |  | # qe-ABC-223 artifacts: branch, commits, scripts, commands and raw records |
| 2026-11-01T12:52:58Z | observation | qe-e2e | high: one real run, read against the sealed PREREG bars by QE's own reader; figures copied from raw/run/read.txt |  | # qe-ABC-223 reading: 5 games of `uci-clock-mode` at 40/15, run to the end. A1–A5 MET, A6 reported, A7 GAP (not ALONE: another repository's vitest in 48.8 % of samples). 0 losses on time, closest call 1 099 ms, worst period use 99.88 % over 12 side-periods, longest move 25 285 ms |
| 2026-11-01T12:52:58Z | observation | qe-e2e | high for the measured facts; severities by QE |  | # qe-ABC-223 observations and gaps, with severity: one host gap (not ALONE), none blocking, no defect |
| 2026-11-01T12:53:06Z | decision | qe-e2e | high: by the pre-registered verdict rule (PREREG caae8984) |  | # qe-ABC-223 verdict: PASS_WITH_GAPS. `uci-clock-mode` plays 40/15 over UCI with 0 losses on time (closest call 1 099 ms), ≥ 99.88 % clock use over 12 side-periods, longest move 25 285 ms (≤ 60 000); gap: not ALONE (another repository's vitest in 48.8 % of samples, logged, not killed) |
