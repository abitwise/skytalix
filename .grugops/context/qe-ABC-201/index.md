<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-201

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-23T08:02:32Z | decision | qe-e2e | high on this host; UNKNOWN - verify beyond the M3 and for a disk-cold launch |  | # ABC-201 QE verdict: PASS_WITH_GAPS. A1–A4 MET as recorded, and A1–A3 MET again on QE's own fresh clone at c0585331. The 23-newline pin holds with ABC-200 merged. 5 INFO gaps, none blocking |
| 2026-10-23T08:02:32Z | observation | qe-e2e | high on this host (one series; same M3 as the builder, so not independent hardware) |  | # QE's own fresh-clone re-reading at c0585331 (main with ABC-200): A1, A2 and A3 MET. The first board on a pipe is byte-identical to the pre-ABC-200 one, and the 23-newline pin holds |
| 2026-10-23T08:02:32Z | observation | qe-e2e | high |  | # ABC-201 QE gap register: QE-201-a to QE-201-e, all INFO, none blocking |
| 2026-10-23T08:02:32Z | observation | qe-e2e | high (every figure recomputed from the raw files; same host as the builder) |  | # ABC-201 recorded reading re-read from the raw files: A1–A4 hold as recorded |
