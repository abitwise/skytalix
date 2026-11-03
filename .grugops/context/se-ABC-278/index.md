<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-278

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-03T15:37:16Z | decision | software-engineer | high (design as built; each fix guarded by a row that goes red without it) |  | # SE decisions for ABC-278: the records path check reads every record as text, opens `.xz`, sees more process lines, and reads both homes |
| 2026-11-03T15:37:16Z | observation | software-engineer | high (every row and gate run under the host lock and read as printed) |  | # SE acceptance for ABC-278 as run: A1 to A10 met; A4 has 1 new non-process hit (bar 10); A9 exits 0 on all three runs |
| 2026-11-03T15:37:16Z | observation | software-engineer | high |  | # SE artifact for ABC-278: branch `grugops/ABC-278`, code commit `d7c0b3ce`, not pushed, not merged |
