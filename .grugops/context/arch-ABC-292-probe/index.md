<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-292-probe

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-08T09:24:41Z | decision | architect-design | high (pre-registration; nothing measured yet: a type-check, the load-only smoke and parse checks only) |  | # arch-ABC-292-probe PREREG: `ADR-0076` d13's premise probe, sealed before any measured run. Two stages: A now (the untimed rows), B only on the Orchestrator's later line citing the owner's held-host word (PR8, then PR10's lane read, last) |
| 2026-11-08T09:27:10Z | decision | architect-design | high on the form (fixed before the check runs); the check's outcome is UNKNOWN - verify until batch K reads |  | # arch-ABC-292-probe addendum 1: rule 2's defect check on PR7's NEWLY-MISSED line, its form sealed before it runs. It moves no bar, no depth and no budget, and reads no single term |
| 2026-11-08T09:28:39Z | decision | architect-design | high that the probe ran as sealed and the miss is real by its rule; low on what one puzzle row says about play |  | # arch-ABC-292-probe decision: **the premise is NOT MET, by rule 2.** PR7 has one NEWLY-MISSED line, and the defect check found no defect. `ABC-292` is not built and goes back to BA/PM. The probe has ended: nothing timed ran, and stage B is not asked for |
| 2026-11-08T09:28:39Z | observation | architect-design | high on every figure (copied from raw/out; deterministic counts, no timing); PR8-PR11 not read, UNKNOWN - verify |  | # arch-ABC-292-probe readings, stage A: PR1 exact; PR2, PR3, PR4 0 mismatches; PR5 0 violations; PR6 7 / 7; **PR7 misses: one NEWLY-MISSED line, seed 1700, real after the defect check.** By the PREREG the probe ended there: PR9, PR10, PR11 and stage B were not run |
