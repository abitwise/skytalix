<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-295

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-09T09:26:43Z | decision | qe-e2e | high: bars, rules and outcome consequences copied from ABC-295 R2-A1..A4, ABC-204 A4, ADR-0056 D5/D6, R1's PREREG and the owner's ruling a9c03e07 before any game; the expected score and the 0.4-0.9 h time are estimates (UNKNOWN - verify until the run) |  | # qe-ABC-295 PREREG for R2, sealed before any game: one run of 200 games (`r` at 100 ms, **E 1 810**) on `main` `e069b49a` (`src/` `bba42fb7`), in R1's shape, estimated **0.4–0.9 h** (about 0.6 h; under 1 h). Validity, the figures, the claim rule and the band-rule consequence of each outcome are fixed here. A miss is reported, never re-played. The games wait for the Orchestrator's brief line citing the owner's held host (W) |
| 2026-11-09T09:26:43Z | observation | qe-e2e | high: every check run under the host lock on 2026-11-09, one at a time, outputs in raw/out; no game, build or search ran |  | # qe-ABC-295 stage A checks: both tools = pin, `r` dry-runs (no smoke needed), its argv byte-equal to R1's, read sha `e069b49a` (`src/` `bba42fb7`), `node` v26.12.1. No game, no build, no engine search. Every command ran under the host lock, one at a time |
