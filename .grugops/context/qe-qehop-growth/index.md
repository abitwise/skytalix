<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-qehop-growth

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T08:45:05Z | decision | qe-e2e | high: B3 applied as written to an admissible window; the admissibility rests on A1's one-tick floor (stated, QE-QHG-a) |  | # QE `qe-qehop-growth`: T-QEHOP-GROWTH grades **MET** (`ADR-0035` B3). Architect/Design writes the reading and sets the next threshold. Nothing goes to the owner |
| 2026-11-01T08:45:05Z | observation | qe-e2e | medium: arithmetic exact, but a projection on A3's M3 slope (UNKNOWN - verify on oeselg-dev), linear in N assumed; not a reading |  | # T-QEHOP-GROWTH next threshold: the arithmetic for the Architect (B3 "by the same arithmetic"). Projection, not a reading; nothing is ruled here |
| 2026-11-01T08:45:05Z | observation | qe-e2e | high: files listed are committed on grugops/qe-qehop-growth (an observation, not an artifact-ref: no gate run to bind) |  | # `qe-qehop-growth` artifacts: branch `grugops/qe-qehop-growth` (from `main` `37a93b76`), pre-registration `833192d7` + `8dfbabf5`, raw window data and scripts under `.grugops/context/qe-qehop-growth/probe/` |
| 2026-11-01T08:45:05Z | observation | qe-e2e | high: one pre-registered window, ALONE, 0 rounds discarded, 0 foreign vitest/cutechess/platform in any run or sampler row; every figure read from probe/w1 |  | # T-QEHOP-GROWTH: `N8-LANE` on `tools/grugops/qe-hop-integrity.test.ts` at `main` `37a93b76`, 4 272 note files. Window 1 is not void and is admissible. **MET at 650 ms CPU: H−B +0.455 s (+0.440..+0.490), twin +0.010 s, R 0.030 s, n = 8** |
| 2026-11-01T08:45:05Z | observation | qe-e2e | high on what was read; series and threshold questions are the Architect's; none blocking |  | # `qe-qehop-growth` findings: six, none blocking. The state is MET. The lift clause has not fired |
