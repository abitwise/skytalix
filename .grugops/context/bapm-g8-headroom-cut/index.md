<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: bapm-g8-headroom-cut

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T22:34:15Z | decision | ba-pm | high on the records cut and amended (design facts from arch-g8-headroom 5fd3eee7, figures copied from qe-ABC-229 …0b7fd4f6); the savings and per-ticket costs are the Architect's estimates, UNKNOWN - verify until ABC-244's A9 and each ticket's G8 read them; nothing run, built, timed or played |  | # BA/PM decision, bapm-g8-headroom-cut: `ABC-244` is cut (S, P1, test-only, `EPIC-010`, DoR 10/10) and pulled before `ABC-242`, `ABC-221` and `ABC-243`. `ADR-0046` § Addendum 2026-10-30 R1–R4 gets BA/PM's word. `ABC-242`, `ABC-221` and `ABC-243` gain dated lines |
| 2026-10-30T22:34:15Z | observation | ba-pm | high for line numbers and row contents read with grep/sed at main 161e940d; per-row ms are the Architect's shape-only figures from QE's G8 run-6 report, not admissible; census-candidate classes UNKNOWN - verify |  | # BA/PM observation, bapm-g8-headroom-cut: what the four tranche-1 blocks hold at `main` `161e940d`. Eight of their 18 rows read a `STEP_MS` (four constants, all 100). The other ten are fixed-depth or do not search |
