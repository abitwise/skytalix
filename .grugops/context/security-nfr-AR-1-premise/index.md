<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: security-nfr-AR-1-premise

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-22T17:35:38Z | observation | security-nfr | high |  | # AR-1 premise re-read: readings at `main` `6ccbcc3e`, with `bin` and `dist/` in scope. No npm package is loaded or shipped on any runtime path, and a consumer of the packed artifact does not install any of the three flagged packages |
| 2026-10-22T17:35:46Z | decision | security-nfr | high |  | # Security/NFR: AR-1 premise re-read, **PASS_WITH_RISKS**. AR-1's reason still holds with `bin` → `dist/uci.js` in scope: no flagged package is reachable from any shipped or runtime path. All 3 pairs are **LOW in context**, and none is HIGH, so there is no STOP. The reason's descriptive sentences are false and are rewritten below, with a revised check table for the Release Manager to adopt. **ABC-056's `P1` `bin` trigger has FIRED.** What it requires is § 4 |
