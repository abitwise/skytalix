<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: se-ABC-243

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-31T02:58:51Z | decision | software-engineer | high: the rows were written, run green, and each plant was run red on scratch copies |  | # `ABC-243`: the Hash row reads a bare `go` on `LEVELS[5].budgetMs`; the memory row names `DEFAULT_BUDGET_MS`; one UCI row for a FEN carrying an uncapturable ep square. Code `8772cf36` |
| 2026-10-31T02:58:51Z | observation | software-engineer | high: reads per search are arithmetic from the budget and step in the code |  | # `ABC-243` R1 census (`ADR-0046` § Addendum 2026-10-30): one changed real-search row, one added |
| 2026-10-31T02:58:51Z | observation | software-engineer | high for gates, counts, names and plants (all run); the npm test wall is informal (n=1 base, n=2 tip), UNKNOWN - verify |  | # `ABC-243` readings at code `8772cf36` (base `4bd9ac6a`) |
| 2026-10-31T02:58:51Z | observation | software-engineer | high on what was run; wall cost estimates UNKNOWN - verify until QE's G8 |  | # `ABC-243` findings and QE handoff |
