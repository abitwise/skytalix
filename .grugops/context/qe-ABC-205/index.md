<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-205

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-25T04:15:40Z | decision | qe-e2e | high (every criterion read at b5d5cea5 except A6, which the page orders after the gates) |  | # ABC-205 QE verdict: FAIL at b5d5cea5. G6 misses "≥ base" on position-6 (median 7 < 8): STOP to Architect/Design. D not run. UAT not signed |
| 2026-10-25T04:15:40Z | failed-attempt | qe-e2e | high |  | # Failed attempt: ABC-205 at b5d5cea5 (queen scale ×3 + tapered, gated king square) misses G6's "≥ base" on position-6. Do not re-read it as is |
| 2026-10-25T04:15:40Z | observation | qe-e2e | high (clean host, pre-registered, raw runs read; node counts deterministic) |  | # ABC-205 G6 (NFR-005 at 3 s, ≥ base): FAIL on position-6, base median 8 against head median 7, on a clean host. G11 reported |
| 2026-10-25T04:15:40Z | observation | qe-e2e | high (every command run by QE at b5d5cea5; values re-derived on scratch trees; plants cleaned up) |  | # ABC-205 QE gate at b5d5cea5: A1–A4 and A7 MET; G1, G3, G4, G5, G8, G9 green; G2 reused; every load-bearing plant reds its own row |
