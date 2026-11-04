<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-280

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T02:41:52Z | decision | qe-e2e | high: every acceptance row re-read on the frozen code tip by QE's own runs; A5/A6 by an independent full run through the tool's unchanged CLI in a scratch clone |  | # qe-ABC-280 VERDICT: PASS_WITH_GAPS, no blocking gap. ABC-280 A1–A7 are MET on the frozen code tip `edb9fddd`, each re-read by QE's own runs. A5 and A6 come from a third, independent run through the tool's unchanged CLI. A8 is this note. UAT is waived by A2 (zero production lines) |
| 2026-11-04T02:41:52Z | observation | qe-e2e | high: each gap tied to a reading or a source line; none is a landing defect |  | # qe-ABC-280 gaps, by severity: 0 blocking, 0 high, 0 medium; 3 low and 4 information. None is a defect in the landing |
| 2026-11-04T02:41:52Z | observation | qe-e2e | high: git commands and gate runs as run, exit codes and reporter counts copied from raw/out |  | # qe-ABC-280 re-grades A1–A4 on the frozen code tip `edb9fddd`: 7 paths, `tools/tune` = `8c03b713`; `src/` diff empty (also on the simulated merge with `main` `4e8ab57a`); `npm test` 2 647 → 2 650 / 2 650, skips 0 = 0; lint, typecheck, build 0, `dist/` 24 files, none from `tools/`; `TUNE_DEEP` 17 / 17, 0 skipped |
| 2026-11-04T02:41:52Z | observation | qe-e2e | high: figures read from the run's stages.log, extract/fit output and sha256sum; the mutation and refusal probes ran in a scratch clone, never on the branch |  | # qe-ABC-280 A5–A6 by a third, independent run through the tool's unchanged CLI (`emit` stage included), plus probes: B-T1 0 misses over 1 488 071 keys, worst 0.9583 cp; the emission is byte-identical to the Engineer's two, sha256 `329452a3…5b14`; a wrong-content export of the pin's exact length is refused (exit 1, nothing written); an untraced +1 cp in `evaluate` is caught by the gate; Lichess comments are skipped unread |
