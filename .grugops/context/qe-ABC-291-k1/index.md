<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-291-k1

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-06T20:28:14Z | decision | qe-e2e | high: hand values and labeller agree on 352 images; both are one author's reading of d1 |  | # Blind seam fixtures for ADR-0075 K1 (c), frozen after the build |
| 2026-11-06T20:36:39Z | observation | qe-e2e | high: deterministic counts, reproduced; the mechanism line is by reading only |  | # Drift at d5: no defect. It moved because the base gained move-count pruning; with the bundle off it reads the probe's own figure. Of the 89, 10 is the term and 79 is the tree |
| 2026-11-06T20:36:39Z | observation | qe-e2e | high: counts read at the tip; mutants act on the labeller, not on src |  | # K1's fixtures compared: 0 values differ, 0 of my rows red at the tip; `SEAM_ROWS` meets K1 (c) except d1's double step and en passant, and 13 fault classes pass it unseen |
| 2026-11-06T20:37:02Z | observation | qe-e2e | high: a record correction, checked against raw/out/compare.out |  | # Correction to `…b850a2ad` and `…a223d29a`: two slips of the record, no reading moved |
