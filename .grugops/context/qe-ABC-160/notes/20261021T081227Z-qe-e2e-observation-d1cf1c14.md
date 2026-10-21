---
id: 20261021T081227Z-qe-e2e-observation-d1cf1c14
kind: observation
by: qe-e2e
at: 2026-10-21T08:12:27Z
verified_by: 
confidence: high
refs:
  - ABC-160
  - ABC-155
  - ABC-153
  - ABC-145
  - QE-155-a
  - plans/tickets/ABC-160-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-first-character.md
  - tools/opening-book/book.test.ts
  - tools/opening-book/compile.ts
  - NFR-008
  - N8-LANE
  - QE-160-b
  - data/opening-book/book.json
  - 1d2fd467
  - 51503331
supersedes: 
seal: sha256:2c434feaaae0d02b592e155b3b5d2962a94759cedc33e1d503e346cfa46b5b39
---

# QE `ABC-160`: gates on the tip, `A3` fences and the UAT-waiver measurement (RUN 2026-10-21)

Sealed via `admitAndAppend`. Run in QE's worktree `../wt-qe-ABC-160`, branch `grugops/qe-ABC-160` at `1d2fd467`
(`node_modules` symlinked, git-ignored). Commands were run one at a time. **No timing reading.**

## Gates (tip `1d2fd467`)

| gate | command | result |
|---|---|---|
| lint | `npm run lint` (`biome check .`) | exit 0, 116 files, no fixes |
| typecheck | `npm run typecheck` | exit 0 |
| build | `npm run build` | exit 0 |
| unit | `NODE_OPTIONS=--max-old-space-size=400 npm test` | exit 0, 59 files, 1987 tests passed |
| result file | `.test-results/last-run.json` | `success: true`, 1987 / 1987 passed, 0 failed, 0 pending, 0 todo |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| `CLI_DEEP` | `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts` | exit 0, 1 file, 11 passed, 0 skipped |
| `PERFT_DEEP` | `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts` | exit 0, 1 file, 32 passed, 0 skipped |

The `npm test` script sets `NODE_OPTIONS=--max-old-space-size=128` itself, so it overrides the `400` prefix. The
unit gate ran at the script's own 128 (`QE-160-b`).

## `A3` fences (base `51503331`, tip `1d2fd467`)

- `git diff --name-only 51503331 1d2fd467` lists exactly `tools/opening-book/book.test.ts`. `--diff-filter=A`
  gives **0** new files.
- One hunk, `@@ -335,0 +336,18 @@`, which adds 18 lines. The `A1/A2` `it` opens at head `:274` and closes at
  `:354`, before the `A3` `it` at `:356`. Every changed line is inside it.
- `compile.ts` and `data/opening-book/book.json` are `cmp` 0 against base.
- `npm test` at base (the scratch copy with the base test, compiler unmutated): exit 0, 59 files, 1987 tests, 0
  pending, 0 todo. That equals head.
- `NFR-008` / `N8-LANE`: `spawn|execFile|child_process` in `book.test.ts` is 0 at base and 0 at head. No new `it`.
  The diff adds one in-process compile.

## UAT waiver (measured)

`git diff --name-only 51503331...1d2fd467 | grep -v '\.test\.ts$' | grep '^src/'` gives **0 lines** (grep exit 1).
Without the `^src/` filter, it also gives 0 non-test paths. The zero-production-lines waiver applies by its rule;
applying it is the Orchestrator's.
