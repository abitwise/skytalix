<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-design-ABC-210

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-27T04:12:09Z | decision | architect-design | high for the form, the doors, the moved set and the counts (deterministic, probed at f0c50046); ADR-0051 is PROPOSED and the owner's; G6 is UNKNOWN - verify until QE reads it; STOP: P1 and P2 are the Orchestrator's to route |  | # Architect/Design: ABC-210 designed. ADR-0051 PROPOSED (owner's): form (a) at the horizon only, +1 ply once per line; doors searchWithoutCheckExtension / chooseMoveWithoutCheckExtension; oracle d5 ≥ 90 % within 25 cp, max 174 cp, same-depth mate floor; A3 d6 1.054× / 1.007×; G6 predicted MET against "≥ base" (strike "≥ base − 1"); STOP: 2 shipped-path pins move under every form (P1, P2); M, no split |
| 2026-10-27T04:12:09Z | observation | architect-design | high: deterministic counts on scratch clones of f0c50046; base reproduces ADR-0050 head counts and the qe-ABC-209 pre-check exactly; no real-clock reading |  | # Architect/Design: ABC-210 design probes. Both forms and five placements/caps, five planted mutants, frozen-clock d6–d10, A3 d6 nodes, d5 drift, the same-depth mate floor, A2 rows and instrument, G1, and the moved-pin lanes on scratch clones. No real-clock timing |
