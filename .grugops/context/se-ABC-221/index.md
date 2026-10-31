<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-221

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-31T05:39:32Z | decision | software-engineer | high: built to ADR-0052 as accepted; each choice is pinned by a row and every planted mutant was killed |  | # `ABC-221` built as `ADR-0052` D1, D2, D4, D6–D8 word it: `uci-clock-mode` in `src/uci-session.ts`, `HARD_CEILING_MS` 60 000 in `src/engine.ts` |
| 2026-10-31T05:39:32Z | observation | software-engineer | high: reads per search are arithmetic from budget and step; RF-1 reads probed at base and head |  | # `ABC-221` R1 census (`ADR-0046` § Addendum 2026-10-30; ticket A9): 3 real-engine rows added, all class P; 0 time-blind; RF-1 rows read the same |
| 2026-10-31T05:39:32Z | observation | software-engineer | high on what was run; SE-221-a is arithmetic against alloc.txt; SE-221-b is my reading of D8 for the Architect |  | # `ABC-221` SE findings and the handoff to the next roles (one LOW for the records, the rest INFO; none blocks) |
| 2026-10-31T05:39:32Z | observation | software-engineer | high for gates, counts, red checks and deep lanes (all run); the G8 wall is informal (n=3 per arm), UNKNOWN - verify |  | # `ABC-221` readings at code commit `c48a6f83` (base `d58f2d77`): gates, test count, red checks, informal `G8`, `ENGINE_DEEP` A10, `UCI_DEEP` A11 row 2 |
