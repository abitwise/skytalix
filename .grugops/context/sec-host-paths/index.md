<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: sec-host-paths

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-03T14:48:02Z | decision | security-nfr | high (result read from this task's scan and exposure notes; accepted risks need the owner's word to stand, owner Olger Oeselg) |  | # Security/NFR on host paths in records (QE-273-b): PASS_WITH_RISKS. 0 credentials, 0 HIGH. Required: (a) `rating.ts` r/d redact like rpair, (b) a records path check and a placeholder rule. (c) No bulk redaction of existing files (accepted, owner Olger Oeselg), except one targeted line (SEC-HP-2) |
| 2026-11-03T14:48:02Z | observation | security-nfr | high on counts and source reading (git grep at 878217bd and local origin/main 31f185b8, gz decompressed; rating.ts read, not run); severities are Security/NFR's judgement |  | # Host paths in committed records: SEC-HP-1 LOW (the home path in one of three forms in 816 tip files, 812 already public; it breaches ADR-0049 D4's "no personal path"), SEC-HP-2 LOW (one foreign private-project capture, public), SEC-HP-3 INFO (hostname label, owner-ruled) |
| 2026-11-03T14:48:02Z | observation | security-nfr | high (regex sweep of 1,497 commits + all 192 gz blobs with a positive control that fired 27/27 rules; formats no rule names UNKNOWN - verify; remote state UNKNOWN - verify) |  | # Credential sweep since the last one: 0 credential values in 1,497 new commits, 7,929 text blobs and all 192 gzipped blobs (positive control 27 of 27 rules, path rule 4 of 4). ADR-0049 D4's "no creds" condition still holds |
