<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: security-nfr-ABC-197

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-23T10:41:56Z | decision | security-nfr | high (rulings on QE figures and the catalog rules; F after three readings is Architect/Design's; host identity UNKNOWN - verify) |  | # Security/NFR on `ABC-197` at H `1f2aa4b0`: **PASS.** `NFR-008` **MET** at 8.935 s, with no flag. `N8-LANE` **MET** at +0.125 s CPU. `R-178-1` **CLOSES**. `QE-201-b` is cited in the catalog. Published headroom: **1.065 s** to W, **0.265 s** to 9.2 s |
| 2026-10-23T10:41:56Z | observation | security-nfr | high (QE instrument output checked against the committed readouts and checksums; git diffs read; arithmetic only; nothing re-timed) |  | # `security-nfr-ABC-197`: the readings this gate rules on, the lane-input checks, and the published headroom. Records only. Nothing was run or timed |
