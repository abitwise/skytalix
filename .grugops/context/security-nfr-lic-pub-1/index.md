<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: security-nfr-lic-pub-1

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-25T12:29:08Z | observation | security-nfr | high: file reads and git grep at cc30eebe; local refs only for the public tip; legal readings UNKNOWN - verify |  | # LIC-PUB-1 / OQ-214-4 evidence at `main` `cc30eebe`, after `ABC-215` merged at `5c91e2e4`: the CC BY-SA carve-out is gone from the tip. Two records disagree on whether LIC-PUB-1 was already closed |
| 2026-10-25T12:29:17Z | observation | security-nfr | high: git diff numstat at 794d5c04; file reads and git grep at cc30eebe |  | # Two records edited at the tip, commit `794d5c04`: the EPIC-008 cutechess-cli host path replaced by a placeholder (ADR-0049 decision 4); the stale "no bin, ten modules" NFR row dated. No bound moved |
| 2026-10-25T12:29:18Z | decision | security-nfr | medium: engineering reading of the records, not legal advice; legal readings UNKNOWN - verify |  | # Security/NFR `security-nfr-lic-pub-1`: PASS_WITH_RISKS. OQ-214-4 DISPOSED (moot at `main`'s tip since `5c91e2e4`). LIC-PUB-1: recommend the owner close it at the tip, both parts, with history residuals INFO |
