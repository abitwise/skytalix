<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-244

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T22:46:40Z | decision | software-engineer | high: the step per unit follows SE parity runs that were run and recorded (9 mutants, frozen before any head run); QE re-confirms on its own frozen list (A6) |  | # `ABC-244`: U1 takes step 1 000 on both surfaces; U2 keeps 100 on both; no census unit joins. Tip `25282ad4` |
| 2026-10-30T22:46:40Z | observation | software-engineer | high for parity, counts, names, diff shape and gates (all run); the npm test wall is n=1 per arm, informal, UNKNOWN - verify |  | # `ABC-244` readings: SE kill-set parity (A2), row names and counts (A3), diff shape (A4, A5), gates (A10). Base `d59e3194`, tip `25282ad4` |
| 2026-10-30T22:46:40Z | observation | software-engineer | high on what was run; SE-244-c savings are estimates, UNKNOWN - verify until A9 |  | # `ABC-244` SE findings and what QE needs (A6–A9). Branch `grugops/ABC-244`, code `25282ad4` |
| 2026-10-30T22:46:40Z | observation | software-engineer | high: reads per search are arithmetic from the code; node equality for :1804/:1910 is a plain-node probe on base src |  | # `ABC-244` A1, the R1 census: one line per U1/U2 row and per census candidate, at base `d59e3194` and tip `25282ad4` |
