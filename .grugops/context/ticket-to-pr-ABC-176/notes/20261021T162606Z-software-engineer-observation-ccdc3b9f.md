---
id: 20261021T162606Z-software-engineer-observation-ccdc3b9f
kind: observation
by: software-engineer
at: 2026-10-21T16:26:06Z
verified_by: 
confidence: high
refs:
  - ABC-176
  - grugops/ABC-176
  - 01836fff
  - ffd53f41
  - plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md
  - ABC-149
  - A1
  - A2
  - A3
  - A4
  - NFR-008
supersedes: 
seal: sha256:f47854a4d1c22fc5fd77510d27b3036f32d36ace5a7421cbf0846a4e005792b3
---

# ABC-176 readings at the tip: A1-A4 arms, seven reporter rows, gates, mutants, waiver

Code commit `ffd53f41` on `grugops/ABC-176` (base `01836fff`). No timing was taken.

## A1 / A2 (the same string: the AGENTS.md line without its prefix is the old verbatim text)
- Refusal arm, SUITE shape: stdout is empty (no line matches `^\s*-?\d+\s*$`) and the pipe exits 5. jq's stderr
  reads `jq: parse error: Invalid numeric literal at line 1, column 11`. Raw vitest stdout begins with
  `heap-guard: refused. This run's V8 heap_size_limit is 4192 MiB, above the SUITE row of 224 MiB (59 test files; …`,
  and the JSON report follows it.
- Gate fed that empty `N`: `Skip count was not provided (UNKNOWN - verify); …`, rc 1.
- ONE-FILE shape (`npx vitest run src/zobrist.test.ts --reporter=json 2>/dev/null | jq …`): empty stdout, rc 5.
- Green arm (as spelled, prefix 128): `rc=0 N=[0]`, one line. Gate: `No findings.`, rc 0.

## A3 and A4: the seven `ABC-149` rows
Run in a scratch copy OUTSIDE the repository (git archive of `ffd53f41` plus a `node_modules` symlink), with a private
`TMPDIR`. The plants went into `src/fen.test.ts`, which was restored by `cmp` after each row. Every row matched its
recorded exit, fields and query lines, compared by content:
- green: exit 0; `success` true, `exited`, `exitCode` 0, 1992 tests. Query: no line.
- unhandled: exit 1; `success` false, `exitCode` 1, `unhandledErrors` ["PLANT-timer"]. Query: `error  PLANT-timer`, `run    exited exitCode=1`.
- hang: exit 124; `success` false, `runState` "started", no `exitCode`, `startTime` 1792599734774 > stamp 1792599734435. Query: `run    started exitCode=none, killed`.
- suite: exit 1; `numFailedTestSuites` 1. Query: `suite  <copy>/src/fen.test.ts  PLANT-suite`, `run    exited exitCode=1`.
- assertion: exit 1; `numFailedTests` 1. Query: `test   <copy>/src/fen.test.ts  FEN field parsing parses the side to move`, `run    exited exitCode=1`.
- exit code only: exit 1; `numFailedTests` 0, `numFailedTestSuites` 0, `unhandledErrors` []. Query: exactly `run    exited exitCode=1`.
- refused (new): exit 1; `success` false, `exitCode` 1, `numTotalTests` 0, `unhandledErrors[].message` is the guard's
  message verbatim (`heap-guard: refused. This run's V8 heap_size_limit is 4192 MiB, above the SUITE row of 224 MiB
  (59 test files; ABC-173, ADR-0008 addendum 2026-10-19). Prefix the command with NODE_OPTIONS=--max-old-space-size=128,
  as AGENTS.md spells it.`). Query: `error  <that message>`, `run    exited exitCode=1`.
- A3 non-vacuity: green files carry `unhandledErrors` [] and the query prints nothing.

## Gates on the tip
- lint (biome, 116 files), typecheck and build: all exit 0.
- `npm test`: exit 0. `last-run.json` reads `success` true, `exitCode` 0, 1992/1992. That is base 1987 + 5 new rows.
  Skips 0. Skip-integrity `--skip-count 0`: `No findings.`, rc 0.
- One-file runs used `NODE_OPTIONS=--max-old-space-size=400`. Whole-suite runs used 128, via `npm test`.

## Mutants on the new rows (in place, restored by `cmp`): 5 run, 5 killed
- The refusal written to stderr only (the page's A2 mutant): 2 rows red.
- A fixed `"heap-guard: refused"` stdout line: 2 rows red.
- `catchError` given a fixed-string copy (the A3 "hard-coded" class): 2 rows red.
- No `catchError` call: 2 rows red.
- `0` written to stdout: 2 rows red.

## UAT waiver: 0 production lines
- `git diff --name-only ffd53f41~1 ffd53f41 | grep -v '\.test\.ts$' | grep '^src/'`: prints nothing.
- `git diff --numstat 01836fff ffd53f41 -- src | awk '$1=="-"'`: prints nothing.
- Files: `src/cli.test.ts` +142/-1, `tools/grugops/heap-guard.js` +28/-1, `tools/grugops/result-file-reporter.js` +12/-3.
- The waiver is not a signature.
