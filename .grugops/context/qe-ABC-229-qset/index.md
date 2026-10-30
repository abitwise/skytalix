<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-229-qset

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T14:42:15Z | decision | qe-e2e | high: deterministic fixed-depth and quiesce reads on main a649fbc4; two independent derivations (QE plain negamax, oracle alpha-beta) agree on every row; predictions written before the first read all held |  | # qe-ABC-229-qset FREEZE: the quiet-promotion Q-SET, 9 rows plus 1 INFO row, frozen before the build |
| 2026-10-30T14:42:15Z | observation | qe-e2e | high: commands and outputs committed under raw/; rerun byte-identical; no clock, no game |  | # qe-ABC-229-qset: the reads behind the Q-SET freeze, and what the SE must know before building |
