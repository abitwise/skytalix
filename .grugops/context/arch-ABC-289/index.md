<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-289

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T20:18:07Z | decision | architect-design | high (written and sealed before any measured run; the forms, gates, choice rule, bars and verdict rule are fixed here) |  | # arch-ABC-289 PREREG: Q2 (delta pruning in quiescence) on `main` `0cc9afd1` (Q1 `seePruning`, the `ABC-283` bundle, `ABC-271`): instrument, six forms, the premise reading, the pay gate, the safety gate, the choice rule, the bar rules and the verdict rule, sealed and committed before any measured run |
| 2026-11-04T20:48:20Z | decision | architect-design | high on the verdict (the sealed rule applied to deterministic counts); medium on the mechanism of the drift, which is reasoned; UNKNOWN - verify on wall-clock cost until G6 |  | # arch-ABC-289 decisions: `ADR-0074` is written PROPOSED, **premise MET on `main`**. Form D200b is chosen, the only form to pass both gates: out of check, skip a capture when stand pat + victim + 200 ≤ alpha, and raise `best` to that bound. It amends `ADR-0024` d4 on the owner's acceptance. Owed lines and the owner question are below |
| 2026-11-04T20:48:20Z | observation | architect-design | high: deterministic counts, 62 jobs exit 0, the instrument exact on every named count; the SEE-call ratio is stated as an upper bound only |  | # arch-ABC-289 readings: the premise on `main` with Q1 in it, the instrument check, the pay and safety gates for six forms, and the reports for D200b. 62 jobs, every exit 0, 7 min 14 s under the host lock. No game, no timing |
