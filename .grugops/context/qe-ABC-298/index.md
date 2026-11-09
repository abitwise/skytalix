<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-298

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-09T00:13:40Z | decision | qe-e2e | high: sealed and committed before any SG3, G6 or paired NFR-008 figure exists; scripts hashed; two readings (QE-298-k no pinning, QE-298-n 10 s legs INFO) held for the Orchestrator's stage-B line; durations UNKNOWN - verify |  | # qe-ABC-298 PREREG for stage B: SG3 by S2 under `ADR-0055` D3-V2 at `ADR-0077` d7's bar, then `G6` "≥ base", then `NFR-008` ≤ +0.10 s as H − B with one worker on one core. Sealed before any figure of these reads exists. Nothing was timed in this hop |
| 2026-11-09T00:13:40Z | observation | qe-e2e | high on every reading stated: deterministic, under the host lock, one core, one worker; G4 re-run by QE and byte-equal; other deep lanes read from the Engineer's e57979e2, not re-run |  | # qe-ABC-298 stage A (untimed): stage 0 holds; SG0, SG1 (a)–(c), SG2 and the gates are equal to the freeze at the head `b40a2d7e`. QE ran `G4` itself, and it is byte-equal to the frozen digest. No F1, F2, F3, F6 or F8. Stage B, the timed half, is sealed in the PREREG note beside this one and is not run |
| 2026-11-09T00:13:40Z | observation | qe-e2e | high on the text read line by line; identity of the sort keys rests on ADR-0077 § Context and on the SG1 runs, not on reading alone |  | # qe-ABC-298 QE's own code read of the build against `ADR-0077` d1–d3: every duty is kept as the text reads. Nothing found that breaks identity. Four readings and one gap, none blocking |
