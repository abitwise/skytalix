<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: security-nfr-ABC-214

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-24T08:44:59Z | decision | security-nfr | high on the dependency surface, the private guard and the personal-data scan; licence readings UNKNOWN - verify (not legal advice) |  | # ABC-214 Security/NFR result: PASS_WITH_RISKS. No required fix. QE-214-a is carried as an accepted LOW (owner BA/PM). One INFO |
| 2026-10-24T08:44:59Z | observation | security-nfr | high (every reading run this hop at head 2a9f38cf, output read; npm private guard by source read, no publish run) |  | # ABC-214 Security/NFR readings: ABC-041 (a) fires with no finding; `private` still blocks publish; no personal or host detail beyond the owner's copyright line |
