---
id: 20261022T160338Z-software-engineer-observation-240b63df
kind: observation
by: software-engineer
at: 2026-10-22T16:03:38Z
verified_by: 
confidence: high (each gate run by SE on 2026-10-22 at d1a175f5; outputs read; no timing)
refs:
  - ABC-198
  - ABC-192
  - ABC-143
  - RISK-ABC143-01
  - NFR-010
  - 4952425a
  - d1a175f5
  - 20261022T160059Z-software-engineer-observation-59297619
  - 20261022T160319Z-software-engineer-observation-f4334765
supersedes: 
seal: sha256:3026407aab9b13d7a958269c24988b198fd792118973aa86cf0f901108fbd198
---

# ABC-198 A4/A5/A6 gate readings at the tip `d1a175f5`: lint/typecheck/build 0; `npm test` 60 files / 1995 tests, names equal to base, success true; skips 0 → `No findings.`; CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32 all green; the UAT waiver form prints nothing; a planted red reads `success: false`

Software Engineer, task `ticket-to-pr-ABC-198`, 2026-10-22. Readings were taken in the worktree `../wt-ABC-198` at `d1a175f5` (vitest 4.1.12, vite 7.3.7, own `node_modules` from `npm ci --ignore-scripts`), except A6's red, which was in a fresh scratch clone. Heap flags: 128 for multi-file runs, 400 for one-file runs, as AGENTS.md spells them. No timing is claimed.

## A4
- Red first: 1 test failed (ABC-192 A2), printing `BUMP_RERUN_LIST`; the readings are in `…59297619`.
- `git diff --numstat main...HEAD -- src/ tools/` prints only `1	1	src/cli.test.ts`. That line is `CAPTURE_ARM_READ_ON_VITEST = "4.1.11"` → `"4.1.12"`.

## A5
- `npm run lint` exits 0 (biome, 119 files). `npm run typecheck` exits 0. `npm run build` exits 0.
- `npm test` exits 0: Test Files 60 passed (60), Tests 1995 passed (1995).
  - The sorted list of (file, full name, status) from `last-run.json` is byte-equal to base's list. Base's list was taken in the same worktree at `4952425a` before the bump: 60 / 1995, success true.
- Skip-count capture, as spelled (`NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`): `0`, pipe rc 0.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` reads `No findings.`, exit 0.
- Deep lanes (`NODE_OPTIONS=--max-old-space-size=400`, one file each):
  - `CLI_DEEP`: rc 0, 1 file, 11 passed.
  - `UCI_DEEP`: rc 0, 1 file, 5 passed.
  - `PERFT_DEEP`: rc 0, 1 file, 32 passed.
  - No lane log carries a skipped or todo count.
- **UAT waiver form** (`git -c core.quotePath=false diff --name-only <A> <B> | grep -v '\.test\.ts$' | grep '^src/'`) prints nothing in each of three cases:
  - `main...HEAD` (the files changed: the note, `package-lock.json` and `src/cli.test.ts`);
  - `a42f4bbb~1 a42f4bbb`;
  - `d1a175f5~1 d1a175f5`.
  - The waiver is expected: 0 production lines. That is not a signature.
- **Vite fallback NOT needed:** A5 is green with vite 7.3.7.

## A6 (RISK-ABC143-01)
- In the worktree, at the tip, `npm test` wrote `.test-results/last-run.json` with an mtime after a stamp taken just before launch.
  - It parses, reads `success: true`, `runState: exited` and `exitCode: 0`, and holds 60 files and 1995 tests. That equals the console.
- In a fresh scratch clone of `d1a175f5` (after `npm ci --ignore-scripts`; Scope command plus plain lock-only install = no diff):
  - green: exit 0 and `success: true`;
  - then a planted inverted assertion (`src/glyph-mode.test.ts:133` `toBe("ascii")` → `toBe("unicode")`): exit 1, `success: false`, `exitCode` 1, `numFailedTests` 1. The READ IT query prints the `test` line for that row and `run    exited exitCode=1`.
  - The plant was reverted, and the clone's status is empty.
- `BUMP_RERUN_LIST` (2), the reporter header's seven rows, is present in `tools/grugops/result-file-reporter.js` (green, unhandled, hang, suite, assertion, exit code only, refused). All seven were re-run; see `…59297619`.

## Not mine (A7, A8)
- `A7`, the socket probe, is QE's.
- `A8`, clause (a) on the lock diff, is Security/NFR's. The `resolved` host and the `integrity` scope are already read in `…f4334765` as builder readings only.
