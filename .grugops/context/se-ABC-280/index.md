<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-280

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T02:27:26Z | decision | software-engineer | high (cherry-picks clean; tools/tune diff vs 8c03b713 empty; comparison emission byte-equal to 26d06118's file) |  | # se-ABC-280 decision: four separate cherry-picks (`-x`), no tool edit; A6 emits through the tool's own `emit()` to a scratch target |
| 2026-11-04T02:27:26Z | observation | software-engineer | high (every figure read from the runs' logs, extract.json and reporter output named in raw/out) |  | # se-ABC-280 observation: A3–A6 on `main`'s table. N 2 647 → 2 650; TUNE_DEEP 17/17; B-T1 0 misses over 1 488 071 keys; B-T3 two byte-identical emissions; no data-stage stop fired |
| 2026-11-04T02:27:26Z | observation | software-engineer | high (git commands as run); observation because artifact-ref needs a section-14 gate_run this hop does not have |  | # se-ABC-280 artifact record: branch `grugops/ABC-280`, four tool commits, A1/A2/A7, the frozen sha for QE |
