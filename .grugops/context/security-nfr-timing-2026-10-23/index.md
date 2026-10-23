<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: security-nfr-timing-2026-10-23

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-23T07:52:06Z | decision | security-nfr | high on this host; UNKNOWN - verify beyond the M3 and for a disk-cold launch |  | # ABC-201: A1–A4 **MET** at S = `c91445e3`. NFR-007 MET at 220.9 ms max (n = 10, first launch counted, and it was the max). EPIC-006 acceptance 1 MET. ADR-0018 Decision 3's revisit trigger does **not** fire |
| 2026-10-23T07:52:06Z | decision | security-nfr | high (state read in three readout views; F re-read is Architect/Design, UNKNOWN - verify) |  | # ABC-200 N8-LANE: **MET.** H − B +0.030 s CPU [−0.010, +0.060] against 650 ms, twin R 0.050 s (admissible). The full-lane NFR-008 reading is not owed before merge |
| 2026-10-23T07:52:06Z | observation | security-nfr | high (every figure read in this window; disk-cold and other machines not read) |  | # Quiet-host timing pass 2026-10-23: every precondition reading, (1) ABC-200's N8-LANE window and (2) ABC-201's fresh-clone readings |
