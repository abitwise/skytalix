<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: security-nfr-ABC-200

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-22T19:43:45Z | observation | security-nfr | high (instrument, probes and pty runs read at the tip in a scratch clone; outputs hashed) |  | # ABC-200 Security/NFR readings: clause (b) on the canonical instrument, the input surface probed, a pty Ctrl-D reading, AR-1 checks 4 and 5a–5e. Records only, no vitest, no timing |
| 2026-10-22T19:43:46Z | decision | security-nfr | high on (b1), the input surface and AR-1; the N8-LANE reading is owed, not taken |  | # ABC-200 Security/NFR gate: **PASS_WITH_RISKS**. ADR-0036 (b1) fires on limb 2 only and adds no capability. The input surface holds at L1. An `N8-LANE` reading is owed after `ABC-178`'s hop; `NFR-003` is not owed. AR-1 5a–5e are clean. No required fixes |
