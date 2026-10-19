---
id: 20261019T110602Z-software-engineer-artifact-ref-delivery-a171d003
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-171
at: 2026-10-19T11:06:02Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-171
  - ABC-171
  - ADR-0044
  - EPIC-007
  - R-167-1
supersedes:
---

# ABC-171 delivery: `grugops/ABC-171`, code `b6afd021`, base `7df64755`

Hand-authored, unsealed.

- **Files** (A12: `git diff --name-only 7df64755 b6afd021 -- src`): `src/uci-session.ts` (+97/−15) and `src/uci-session.test.ts` (+417/−5, 30 new rows). No other file under `src/` changed.
- **Shape:** `createUciSession({ write, now, random, book })` → `{ handleLine }`.
  - New imports: `import type { BookProbe } from "./book.ts"` (type only, A11) and `createLevel` from `levels.ts`.
  - None of `book-file.ts`, `book-engine.ts` or `level-seam.ts` is imported.
- **Gates at `b6afd021`**, all exit 0:
  - lint, typecheck and build;
  - `npm test`: 59 files, 1945/1945, `last-run.json` `success: true`, inside the 60 s bound on the first run;
  - skip-integrity `--skip-count 0`: `No findings.`;
  - `CLI_DEEP=1`: 10/10;
  - `PERFT_DEEP=1`: 32/32;
  - `merge-tree` against main `00b62340`: clean.
- **R-167-1 grep** on the added `src` lines prints one hit, `164:+  for (const value of ["0", "6", "2.5", "x", "constructor"]) {`. That line is in `src/uci-session.test.ts`: it is A2's required invalid value, a string literal passed as UCI input. On `src/uci-session.ts` alone the grep prints nothing. The production code reads `LEVELS` only after `Object.hasOwn(LEVELS, value)`.
- **Production lines:** `src/uci-session.ts` only. It is in scope, so the UAT waiver does not apply.
