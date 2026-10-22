---
id: 20261022T171339Z-qe-e2e-observation-8f2ab7fe
kind: observation
by: qe-e2e
at: 2026-10-22T17:13:39Z
verified_by: 
confidence: high
refs:
  - ABC-198
  - A4
  - A5
  - A6
  - RISK-ABC143-01
  - RISK-ABC173-STATE
  - ABC-192
  - 24f32527
  - d1a175f5
  - 20261022T160059Z-software-engineer-observation-59297619
  - 20261022T160319Z-software-engineer-observation-f4334765
  - 20261022T160338Z-software-engineer-observation-240b63df
  - 20261022T160354Z-software-engineer-decision-7e9699c3
supersedes: 
seal: sha256:e79b34289a0e243e383abc53d9c9ab194f349390591571c020395e0233a5b088
---

# qe-ABC-198 A4, A5 and A6 — MET at my merge 24f32527: red-first is exactly ABC-192 A2; the one `src/`/`tools/` line is the literal; the gates are green with 60/1995 and names byte-equal to base; skips 0 → `No findings.`; deep lanes green; the waiver prints nothing; a planted red reads `success: false`. `BUMP_RERUN_LIST` (1)–(3) re-read on 4.1.12

QE/E2E, task `qe-ABC-198`, 2026-10-22. Worktree `../wt-qe-ABC-198` at `24f32527` with its own `node_modules` (`npm ci --ignore-scripts`); scratch clones in `…/scratchpad/qe198`. Heap 128 multi-file, 400 one-file. No timing claims.

## A4 — MET
- **Red first** (scratch copy `a4red` of the head clone, literal set back to `"4.1.11"`): `npm test` rc 1, Test Files 1 failed | 59 passed (60), Tests 1 failed | 1994 passed (1995). `last-run.json` `success` false, `numFailedTests` 1. The one red is `src/cli.test.ts` `ABC-192 … A2 — the installed vitest is the version the capture arm was last read on (QE-176-b)`, and the console prints `BUMP_RERUN_LIST` items (1)–(4).
- `git diff --numstat main...HEAD -- src/ tools/` prints only `1	1	src/cli.test.ts`; the hunk is `CAPTURE_ARM_READ_ON_VITEST = "4.1.11"` → `"4.1.12"` (`src/cli.test.ts:4270`). `d1a175f5`'s message cites `…59297619`.
- **`BUMP_RERUN_LIST` re-read by me on 4.1.12:**
  - (1) With `NODE_OPTIONS` unset, the skip-count line without its prefix, in both SUITE and ONE-FILE (`src/apply.test.ts`) shapes: raw stdout line 1 begins `heap-guard: refused. This run's V8 heap_size_limit is 4192 M…` with the JSON report after it, and vitest rc 1. The capture prints no integer, the pipe exits 5 (with and without `pipefail`), and `test-skip-integrity.js` reads `Skip count was not provided (UNKNOWN - verify)…`, exit 1. The green arm, as spelled, prints exactly `0`.
  - (2) The header in `tools/grugops/result-file-reporter.js` carries all seven rows: green, unhandled, hang, suite, assertion, exit code only, refused. I re-ran three of them: green (A5 below), assertion (A6 below), and exit code only (30 runs, below).
  - (3) `StateManager.getPaths()` and `catchError(error, type)` are present at 4.1.12 (`cli-api.B0Pz1_R7.js`). The `JsonReporter` chunk `index.UpGiHP7g.js` is byte-identical between base and head. Every `vitest` file that differs differs only in version strings and chunk names. The refusal in (1) shows `getPaths`/`catchError` working live. `RISK-ABC173-STATE` and `RISK-ABC143-01` are unchanged.

## A5 — MET
- `npm run lint` rc 0 (biome, 119 files, no fixes). `npm run typecheck` rc 0. `npm run build` rc 0 (`dist/` is ignored; status clean).
- `npm test` rc 0: Test Files 60 passed (60), Tests 1995 passed (1995). Base `fbb967f2` (fresh clone) gives the same 60/1995 rc 0.
  - The root-relative sorted `file :: full name` lists from both `last-run.json` files are **byte-equal**: 1995 names. Both sides carry the same 2 duplicate full names, so that is pre-existing.
- Skip-count capture as spelled → `0`. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`, rc 0.
- `CLI_DEEP` rc 0, 11/11. `UCI_DEEP` rc 0, 5/5. `PERFT_DEEP` rc 0, 32/32. One file each, heap 400.
- **UAT waiver form** (`git -c core.quotePath=false diff --name-only <A> <B> | grep -v '\.test\.ts$' | grep '^src/'`) prints nothing over `main 24f32527`, `4952425a ef1d5ebc`, and each of `a42f4bbb`, `d1a175f5`, `ef1d5ebc`, `24f32527` against its `~1`.
- The ABC-170 A2 intermittent does not touch A5: it is pre-existing and coverage/CPU-sensitive (see the flake note).

## A6 — MET
- The worktree's `npm test` wrote `.test-results/last-run.json` with an mtime after a stamp taken at launch, and a `startTime` ≥ the stamp. It parses: `success` true, `runState` exited, `exitCode` 0, 60 files, 1995 tests, 0 failed/pending/todo, 0 unhandled. That equals the console.
- Plant (scratch copy `a6plant`, `src/book-engine.test.ts:84` `toBe(0)` → `toBe(1)`): rc 1, 1 failed | 1994 passed. `success` false, `runState` exited, `exitCode` 1, `numFailedTests` 1, fresh `startTime`. READ IT prints `test   src/book-engine.test.ts  ABC-095 … A1 — a book hit returns one of the book's entries and calls the search exactly 0 times` and `run    exited exitCode=1`.
- The exit-code-only row held in all 30 sequential coverage-form runs, 15 at base and 15 at head: `[false, 1, 0, 0, 0, "exited"]`, query exactly `run    exited exitCode=1`.

## Against the SE's notes (opened only after all of the above)
`…59297619`, `…f4334765`, `…240b63df` and `…7e9699c3` agree with my readings on every shared number:
- 53/53, 20 version lines, 123 entries, the 10 packages, the webdriverio `^` exception;
- the 13-row and 3-row audit lists and their metadata, and omit-dev 0;
- `npm ci`, `npm ls` and idempotence;
- red-first 1/1994 on ABC-192 A2; 60/1995 with names equal; skips 0; 11/5/32; the waiver;
- the plant reading `success: false`.

My choices differed in three places: base is `main` `fbb967f2` (test-identical to `4952425a`), the one-file shape used `src/apply.test.ts`, and the planted file was `book-engine`. The SE's one open item, the ABC-170 A2 red on 1 of 5 coverage-form head runs, is answered in the flake note.
