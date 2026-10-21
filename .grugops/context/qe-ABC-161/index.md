<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-161

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-21T11:12:52Z | decision | qe-e2e | high |  | # QE verdict for ABC-161: PASS_WITH_GAPS; A1–A4 met on QE's own runs; gaps QE-161-a (LOW), QE-161-b..e (INFO) |
| 2026-10-21T11:12:52Z | observation | qe-e2e | high |  | # ABC-161 QE artifacts and trace row (observation: an artifact-ref needs a §14-gate gate_run, and none exists on this install) |
| 2026-10-21T11:12:52Z | observation | qe-e2e | high (each gate run by QE on the tip) |  | # ABC-161 gates on tip 5e755bcb (code tree = ee1818bb): all green, counts equal base 59/1987, skips 0; A4 fences met; UAT waiver reading empty with .snap not filtered |
| 2026-10-21T11:12:52Z | observation | qe-e2e | high (each gap measured or read from the code) |  | # ABC-161 QE gap register: QE-161-a (LOW), QE-161-b..e (INFO); none blocks, none is against a criterion |
| 2026-10-21T11:12:52Z | observation | qe-e2e | high (12 scratch probes run against the head row) |  | # ABC-161 fix 3 graded beyond the plants: the `\|`-list capture is blind to anything after the first non-word character (6 survivors); spaced, slashed, ranged or single-value lists red loudly |
| 2026-10-21T11:12:52Z | observation | qe-e2e | high (QE's own plants and direct reads, base vs head, whole lane) |  | # ABC-161 QE readings: A1, A2 and A3 met on QE's own plants, base 35788fd4 test vs head ee1818bb test, whole default lane; seed 7 draws re-derived from the code |
