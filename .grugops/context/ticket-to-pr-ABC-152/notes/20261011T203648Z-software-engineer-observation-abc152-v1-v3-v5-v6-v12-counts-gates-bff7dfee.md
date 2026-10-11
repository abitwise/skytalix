---
id: 20261011T203648Z-software-engineer-observation-abc152-v1-v3-v5-v6-v12-counts-gates-bff7dfee
kind: observation
by: software-engineer
at: 2026-10-11T20:36:48Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0040
  - QE-144-a
  - QE-151-a
  - QE-151-b
  - N8-LANE
  - .grugops/context/ticket-to-pr-ABC-152/probe/pinplant.py
  - .grugops/context/ticket-to-pr-ABC-152/probe/pin-plants.out.txt
  - .grugops/context/design-ABC-152/probe/resolved-workers-v4.mjs
supersedes:
---

# SE `ABC-152`: `V1`, `V3`, `V5`, `V6`, `V8`'s collection, and `V12`'s 0-production-lines check, with the gates. No timing was read

This note is hand-authored and unsealed. Base is `main` `91024242`; head is `23c5521a`.

## `V1`, the version

- `npm ls vitest @vitest/coverage-v8 vite` exits **0**: `vitest@4.1.11`, `@vitest/coverage-v8@4.1.11`,
  `vite@7.3.6` (direct, and deduped under vitest and `@vitest/mocker`).
- `package.json`: `"@vitest/coverage-v8": "~4.1.11"`, `"vite": "~7.3.6"`, `"vitest": "~4.1.11"`.
- **No other devDependency moves**: `@biomejs/biome` 2.5.5, `@types/node` 22.20.1 and `typescript` 5.9.3 resolve the
  same at base and head.
- **Lockfile:** +3 / −61 / 20 changed, as `ADR-0042` d1 read.
  - Added: `@standard-schema/spec`, `convert-source-map`, `obug`.
  - Changed majors besides vitest's own: `chai` 5→6, `ast-v8-to-istanbul` 0.3→1.0, `es-module-lexer` 1→2,
    `js-tokens` 9→10, `std-env` 3→4, `tinyexec` 0.3→1.3, `tinyrainbow` 2→3, `magicast` 0.3→0.5.
  - Install-script warnings: `esbuild`, `fsevents`, the same set as base.
  - The licence and audit review is Security/NFR's (`V12`).

## `V3`, the runner is off and pinned

- `resolved-workers-v4.mjs` at head reads: `pool` threads, `maxWorkers` 2, `isolate` true, `fileParallelism` true,
  `projects` null, **`viteModuleRunner` false**, `effectiveWorkers` 2.
- The `V3` `it` ("ABC-152 V3 …") passes at head.
- On scratch copies (`probe/pinplant.py`), the key **deleted** gives `expected undefined to be false`, and the key
  **`true`** gives `expected true to be false`. Both are red.

## `V6`, the `A7` pin on 4.1 (`npx vitest run src/cli.test.ts -t "ABC-144 A7|ABC-152 V3"`, one scratch copy per arm)

| arm | result | message |
|---|---|---|
| control | 2 passed | — |
| r1 delete `maxWorkers` | **red** | `expected undefined to be 2` |
| r2 `isolate: false` | **red** | `expected false to be true` |
| r3 `VITEST_MAX_WORKERS=8` | **red** | `VITEST_MAX_WORKERS: expected 8 to be less than or equal to 2` |
| r3b `=3` | **red** | `expected 3 to be less than or equal to 2` |
| r4 `projects: [{ test: { maxWorkers: 8 } }]` | **red** | `expected [ { test: { maxWorkers: 8 } } ] to be undefined` |
| `maxWorkers: 3` | **red** | `expected 3 to be 2` |
| `fileParallelism: false` | **red** | `expected false to be true` |
| `poolOptions: { threads: { maxThreads: 8 } }` | **red** | `expected true to be false` |
| `=0x3` (`QE-151-a`) | **red** | `expected 3 to be less than or equal to 2` |
| `=0` | **red** | `expected 0 to be greater than or equal to 1` |
| `=abc` | **red** | `expected NaN to be greater than or equal to 1` |
| `=` empty (`QE-151-b`) | green | — |
| `=1` / `=2` | green / green | — |

- **11 reds and 3 greens**, as the ticket lists.
- `QE-144-a` closes: the pin reads `test.projects`.
- `QE-151-a` and `QE-151-b` are folded: the parse is vitest's own, `Number.parseInt` with no radix and the
  `biome-ignore`.
- In the `vitest.config.ts` header, `VITEST_MAX_WORKERS` replaces the 3.x pair. The isolation warning is
  byte-identical: the diff removes exactly the two lines of the one pin sentence.

## `V5`, the test content (`git diff 91024242 23c5521a -- '*.test.ts'`)

| file | form | `expect(` base → head |
|---|---|---|
| `src/cli.test.ts` | ruling 4 (`A7` edited, `V3` +1 `it`), R1 | 321 → **324** (+3: `A7` 6 → 8, `V3` +1) |
| `src/render-seam.test.ts` | R1 | 36 → 36 |
| `tools/opening-book/book.test.ts` | R2 | 26 → 26 |
| `src/command-input.test.ts` | R3, R5 | 295 → 295 |
| `src/gameend.nfr.test.ts` | R4 | 9 → 9 |
| `src/glyph-mode.nfr.test.ts` | R4 | 6 → 6 |
| `src/history-pane.nfr.test.ts` | R4 | 44 → 44 |
| `src/san.nfr.test.ts` | R4 | 9 → 9 |
| `src/status-panel.nfr.test.ts` | R4, R5 | 15 → 15 |
| `src/turn-loop.nfr.test.ts` | R4 | 8 → 8 |
| `src/turn-loop.test.ts` | R4 | 268 → 268 |
| `src/zobrist.nfr.test.ts` | R4 | 4 → 4 |
| `src/san.test.ts` | ruling 2 (one assertion, one comment sentence) | 10 → 10 |
| `src/book.test.ts` | ruling 3 (one import) | 77 → 77 |

- **14 test files changed.** There are no `.skip`, `.only`, `.todo`, `skipIf` or `runIf` lines, and no removed
  `it(` / `describe(` / `test(` lines.
- **Counts at head:** files **56** (base 56); tests **1741** (base 1740 + 1); skipped **0**.
- Every collected test name equals base's, plus the one `V3` title (see `V8`).

## `V8`, collection (no timing)

- **`npm test`'s collected path list** (`npx vitest list --filesOnly`, sorted) is **identical** to base's: 56 paths.
- **Each opt-in lane's collected test list** (`<ENV>=1 npx vitest list`, sorted by full name) equals base's plus
  exactly the one line
  `src/cli.test.ts > ABC-152 V3 — … > vitest.config.ts sets experimental.viteModuleRunner to exactly false`.
  Base read: `PERFT_DEEP` 1748, `SEARCH_DEEP` 1815, `ENGINE_DEEP` 1761, `INPUT_DEEP` 1743, `ZOBRIST_DEEP` 1741,
  `PUZZLE_DEEP` 1746, `CLI_DEEP` 1746, `LADDER_DEEP` 1745. Each lane collects all 56 files.
- The lane exits are in `…ac190931`.

## `V12`, the zero-production-lines part

`git diff --name-only 91024242 23c5521a | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (grep exit 1). The
non-test files changed are `package.json`, `package-lock.json`, `vitest.config.ts` and
`tools/grugops/result-file-reporter.js`. The lockfile, licence and audit review is Security/NFR's.

## Gates at head `23c5521a`

| gate | result |
|---|---|
| `npm run lint` | exit 0 (`Checked 107 files … No fixes applied.`) |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0: **56 files, 1741 passed, 0 failed**; the result file reads `success` true, `runState` exited, `exitCode` 0 |
| skip-count capture | **0** |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
