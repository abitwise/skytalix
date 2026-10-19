---
id: 20261018T193742Z-software-engineer-artifact-ref-delivery-469c4efb
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-167
at: 2026-10-18T19:37:42Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-167
  - ABC-167
  - ADR-0044
  - EPIC-007
supersedes:
---

# ABC-167 delivery: `grugops/ABC-167`, code `3dd0db1b`, base `e286526d`

Hand-authored, unsealed.

- Files: `src/uci-session.ts` (new, 291 lines) and `src/uci-session.test.ts` (new, 327 lines, 44 rows). No existing file was edited.
- The only export is `createUciSession({ write, now })`, which returns `{ handleLine }`, plus its two interfaces.
- Imports: `engine`, `fen`, `coordinate-move`, `apply`, `levels`, `position`, `search` (`MATE_SCORE`) and `transposition` (`MATE_FLOOR`). That is within the D2 allowed list.
- Gates, all exit 0:
  - lint, typecheck and build;
  - `npm test`: 59 files, 1888/1888, `last-run.json` `success: true`;
  - skip-integrity `--skip-count 0`: `No findings.`;
  - `CLI_DEEP=1`: 10/10;
  - `PERFT_DEEP=1`: 32/32;
  - `merge-tree` against main `3001668b`: clean.
- The production diff is `src/uci-session.ts`. It is in scope, so the UAT waiver does not apply.
