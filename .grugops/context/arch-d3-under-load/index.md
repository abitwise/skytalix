<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-d3-under-load

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-01T18:15:55Z | decision | architect-design | high on the rule as written and its forward-only scope; the false-pass probability is an estimate under an independence assumption (UNKNOWN - verify) |  | # Architect ruling D3-V2: ADR-0055 D3's nps validity rule, read for a shared host. Discard dirty pairs and never force-grade them; foreign cores ≤ 0.8; 5 admitted pairs per board in ≤ 15 attempts; an agreement guard. Forward-only. No owner ask |
| 2026-11-01T18:15:55Z | observation | architect-design | high for the figures as read from the committed raw files; the slowdown mechanism is UNKNOWN - verify |  | # Evidence behind D3-V2, from the seen A4 runs of both ABC-254 reads (calibration only, not a re-grade). The probe's CPU time is flat under load, so the loss is per cycle. Slowdown tracks per-run foreign cores. The host has 4 fast and 8 slow cores |
