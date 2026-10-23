<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: security-nfr-ABC-203

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-23T21:15:44Z | decision | security-nfr | high on clause (b), the path surface and the symlink; the N8-LANE reading is owed, not taken |  | # Security/NFR on ABC-203: **PASS_WITH_RISKS.** No code fix is owed before merge. **One reading is owed before merge: `N8-LANE`.** QE-203-a/-b/-c are accepted as LOW. The `games` symlink is accepted as LOW. § Decision 3 gets no call-graph reach. No HIGH, so nothing goes to the owner |
| 2026-10-23T21:15:44Z | observation | security-nfr | high (instrument output on the delivered pair; one-process holder probe in scratch; source reads; no lane or timing run) |  | # ABC-203 Security/NFR readings: clause (b) on 55a8f4ef..5e23e249, the shipped holder under four probes, and the source reads behind D2/D4/D5 |
