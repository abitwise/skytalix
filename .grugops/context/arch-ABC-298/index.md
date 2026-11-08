<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-298

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-08T18:33:48Z | observation | architect-design | high on the src/ reading (table keys, writers, sort before loop, both recursions); the depth bound is arithmetic on it; how many nodes the gate keeps is UNKNOWN - verify |  | # arch-ABC-298 observation: `…5a155b2c`'s V3 form is node-identical only at remaining depth 1 and 2. Today the sort runs before the hash move's subtree; under V3 it runs after, and from depth 3 that subtree writes the history and countermove cells the sort reads |
| 2026-11-08T18:33:52Z | decision | architect-design | high on the src/ reading, the identity duty, the depth bound and the reuse of D3-V2; the 1.03 placement, the probe 0.6 bound and every speed and Elo figure are judgement, UNKNOWN - verify |  | # arch-ABC-298 decision: `ADR-0077` PROPOSED. V3 searches the hash move before the move list, at remaining depth 1 and 2 only, node-identical. A count probe can stop it first; then S2 at ≥ 1.03× on two of three boards, under D3-V2 unchanged. No games. `kingExposure` stays out |
