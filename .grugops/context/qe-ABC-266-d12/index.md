<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-266-d12

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-02T17:20:16Z | decision | qe-e2e | high: pre-registration, sealed before the measured run |  | # qe-ABC-266-d12 PRE-REGISTRATION (sealed before any corpus result is read): ADR-0062 D12 timing probe, the rule, the load voids, the instrument |
| 2026-11-02T17:22:56Z | decision | qe-e2e | high: outcome by the sealed rule, no hand grade |  | # ADR-0062 D12 rule outcome: MISS (not loaded). Median played depth at 100 ms: Threads 12 = 7, Threads 1 = 7. By the pre-registered rule the Architect re-proposes before any ABC-266 build |
| 2026-11-02T17:22:56Z | observation | qe-e2e | high for the depths, nodes and load as measured (one pass, one go per cell); the 0.69 cause UNKNOWN - verify |  | # ADR-0062 D12 probe, measured: at 100 ms the median played depth is 7 at Threads 1, 4 and 12, so T12 is not above T1. The 12 workers finish the same depth in 19 of 20 searches. Not loaded |
| 2026-11-02T17:23:03Z | observation | qe-e2e | high (artifact list; recorded as an observation because an artifact-ref needs a §14-gate run id this probe has none of) |  | # Artifacts of qe-ABC-266-d12: the D12 probe prototype, its scratch edit, the raw run and the grader |
