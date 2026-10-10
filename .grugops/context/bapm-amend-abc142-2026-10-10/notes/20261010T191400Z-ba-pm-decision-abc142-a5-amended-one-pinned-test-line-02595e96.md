---
id: 20261010T191400Z-ba-pm-decision-abc142-a5-amended-one-pinned-test-line-02595e96
kind: decision
by: ba-pm
at: 2026-10-10T19:14:00Z
verified_by:
confidence: high
refs:
  - ABC-142
  - ABC-042
  - QE-141-a
  - QE-093-e
  - NFR-008
  - package.json
  - src/cli.test.ts
  - tools/grugops/run-bounded.js
  - .grugops/context/ticket-to-pr-ABC-142/notes/20261010T191119Z-software-engineer-observation-abc142-premise-stale-3e7c51a0.md
supersedes:
---

# BA/PM `ABC-142`: A5 amended to allow one pinned test line; A6 added; DoR re-scored at 10 of 10, `XS` `P2`

This note is hand-authored and unsealed.

## Decision

This follows the route the Orchestrator chose, which is the SE's option 1. The script change goes in
`package.json`'s `test` script. `ABC-042` A10's `SCRIPTS_AT_HEAD.test` literal (`src/cli.test.ts:1667`
at base `3ba56112`) moves with it.

- **`A5`** now allows four touches:
  - the `test` script;
  - `.gitignore`;
  - that one `src/cli.test.ts` line;
  - the `run-bounded.js` header comment that quotes the script (line 10, comment only).
- **Zero production `src/` lines.** Measured by `git diff --name-only -- src/ | grep -v '\.test\.ts$'`
  reading empty, and by `numstat` reading one row, 1 added / 1 deleted, on `src/cli.test.ts`.
- **`run-bounded.js`'s code and exit contract stay byte-unchanged.**
- **New `A6`:** the pin stays a full-string `toBe` that equals the new script byte for byte, with no
  prefix, regex, `toContain` or `startsWith`. `added` is still `["chess"]`. A scratch copy with one
  appended character turns `A10` red.

## Out, one line each

- **Option 2 (`vitest.config.ts` reporters):** it also applies to every direct `npx vitest run`,
  including the `*_DEEP` lanes, so it reaches past `npm test`.
- **Option 3 (`run-bounded.js` injecting flags):** a generic wrapper would be rewriting its own argv,
  which goes around A10's intent. The SE also rejected it.

## Also found

`run-bounded.js:10` quotes the `test` script verbatim. Neither the original cut nor the SE's note
named it. Without the comment allowance it would go stale on delivery.

## Re-score

- **DoR is 10 of 10** after re-scoring.
  - Items 2, 4, 5 and 10 were re-worded. Item 5 now names the pin.
  - The first 10 of 10 missed the pin. That was a premise error, and it is recorded here.
- **Size:** still `XS`, because the change is one more literal.
- **Priority:** still `P2`. Triggers are unchanged.
- **UAT waiver:** still expected, because the filter reads only test files. It is measured at the
  exit.
- **`NFR-008` count pin:** 0 files / 0 tests / 0 spawns, unchanged.
- **Column moves are the Orchestrator's.**
