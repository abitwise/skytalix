---
id: 20261017T102023Z-qe-e2e-artifact-ref-abc155-commands-1999d843
kind: artifact-ref
by: qe-e2e
at: 2026-10-17T10:20:23Z
verified_by:
confidence: high
refs:
  - ABC-155
  - tools/opening-book/book.test.ts
  - tools/opening-book/compile.ts
supersedes:
---

# QE `ABC-155`: commands run (all RUN 2026-10-17)

Hand-authored and unsealed. `$SP` is the session scratchpad (outside the repo). Its contents are not kept.
The commands below are enough to reproduce every reading.

- Scratch copies: `git archive 819e6933 | tar -x -C $SP/qe155/tree` and `git archive c9746851 | tar -x -C $SP/qe155/basetree`,
  each with `node_modules` symlinked from the main checkout. The base test is `git show c9746851:tools/opening-book/book.test.ts`.
  The head test is `git show 819e6933:…`.
- Plants: a node script makes exact-once string replacements in a copy of `compile.ts` or of the head test.
  It refuses if an anchor's count is not 1. Lane, per build: `npx vitest run tools/opening-book/book.test.ts --reporter=json --outputFile=<out>`
  from the scratch tree. Exit code, passed/failed/pending/todo and the first failure message are read from the JSON.
- Fences: `git diff --name-status c9746851 819e6933`; `git diff --name-status --diff-filter=A c9746851 dcc04871`;
  `/usr/bin/diff base head`; `cmp <(sed -n 1,315p base) <(sed -n 1,315p head)`; `cmp <(sed -n '316,$p' base) <(sed -n '336,$p' head)`;
  `cmp` on `fixture()` 68–75 and on the `A3` `it` (base 318–326 / head 338–346); `cmp` of `compile.ts` and `book.json` against
  `git show c9746851:<path>`; `grep -c 'spawn\|execFile\|child_process'` at base and head.
- Gates (tip worktree): `npm run -s lint`, `npm run -s typecheck`, `npm run -s build`, `npm test`;
  `jq '{success, runState, exitCode, numTotalTests, numPendingTests, numTodoTests, files: (.testResults|length)}' .test-results/last-run.json`;
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`. Base `npm test` was run in `$SP/qe155/basetree`.
- UAT waiver: `git diff --name-only c9746851...dcc04871 | grep -v '\.test\.ts$' | grep '^src/'` (and the `819e6933~1 819e6933` form).
- Record check: `node tools/grugops/qe-hop-integrity.js --ticket ABC-155`. Before this note set it gave exit 1 ("No QE verdict note").
  After the verdict note `…4b5342ba` was written it gave exit 0, `ABC-155: covered (qe-e2e)`, naming that note. It also prints that
  `ABC-155` is not yet a `## Done` row, which is expected at `In Review`.
