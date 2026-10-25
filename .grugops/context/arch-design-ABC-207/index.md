<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-design-ABC-207

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-25T12:33:06Z | decision | architect-design | high for the form, the moved set and the counts (deterministic, probed on scratch clones at 0e2358ce); G2 and G6 are UNKNOWN - verify until QE reads them |  | # Architect/Design: ABC-207 designed. Weights N 4, B 4, R 2, Q 1 (K 4 unchanged); early-queen term 25 cp; inside ADR-0031 D2's attack-map form and the ±100 cp clamp (no STOP); 12 pins move by existing routes; G6 predicted MET (position-6 d8 −18.0 %); S, no split; no ADR, no owner word |
| 2026-10-25T12:33:06Z | observation | architect-design | high: deterministic counts on four scratch clones; the base reproduces QE a34270bf exactly; no real-clock reading |  | # Architect/Design: ABC-207 design probes. Default and deterministic deep lanes, frozen-clock nodes d6–d8, the oracle, A1/A2 premises, mirror and relation margins on four scratch trees. No real-clock timing |
