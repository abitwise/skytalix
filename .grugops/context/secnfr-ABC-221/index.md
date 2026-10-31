<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: secnfr-ABC-221

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-31T05:52:07Z | decision | security-nfr | high: records-only gate read from code c48a6f83 (git show/diff) and the SE's sealed readings; nothing run; real-clock lines pending QE's re-run (UNKNOWN - verify); ADR-0036 clause (b) read, not run |  | # Security/NFR decision, secnfr-ABC-221: gate PASS (PASS_WITH_RISKS). No required fix; NFR-004's 60 s clause placed and clause B's raw-call bound moved 32 s → 60 s on the owner's Q5; AR-NFR004-A re-accepted at 59.5 s; AR-UCI-BUSY holds exactly at ≤ 60 s |
| 2026-10-31T05:52:07Z | observation | security-nfr | high for the read facts; figures copied from se-ABC-221 notes, none re-measured |  | # Security/NFR observation, secnfr-ABC-221: two INFO items (SEC-221-a, SEC-221-b), the NFR-010 and NFR-008 reads, and what is carried |
