---
id: 20261011T212237Z-qe-e2e-observation-abc152-readings-469a3462
kind: observation
by: qe-e2e
at: 2026-10-11T21:22:37Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0040
  - ADR-0008
  - QE-144-a
  - QE-151-a
  - QE-151-b
  - RISK-ABC152-NEGWORKERS
  - RISK-ABC151-FOREIGN
  - QE-152-h
  - ABC-084
  - N8-LANE
  - NFR-008
  - vitest.config.ts
  - src/cli.test.ts
  - sha a99e9845 (reviewed tip; code 9313dda7..23c5521a; base 91024242)
  - sha 0ff618be (main, dry-run merge)
  - 20261011T203648Z-software-engineer-observation-abc152-v1-v3-v5-v6-v12-counts-gates-bff7dfee
  - 20261011T203648Z-software-engineer-observation-abc152-v7-v8-runs-lanes-coverage-ac190931
supersedes:
---

# QE `ABC-152`: `V1`, `V3`, `V5`, `V6`, `V7`, `V8`, `V12`'s line check, the gates and the dry-run merge, all on QE's own runs. All MET. But `PUZZLE_DEEP=weakened` is blind at head (`QE-152-h`). No timing was read

This note is hand-authored and unsealed. Every reading was taken 2026-10-11 on the M3, with Node v26.11.0:
- the head, in QE's worktree `../wt-qe-ABC-152` (detached at `a99e9845`, its own `npm ci`);
- base `91024242`, from a `git archive` copy with its own `npm ci`.

**No wall, CPU or heat reading was taken or graded.** vitest's duration prints were ignored. load1 was about 3–7
throughout. Another project's vitest ran on the host during parts of the session (`RISK-ABC151-FOREIGN`). It was
logged, and it is relevant only as load.

## Gates at head `a99e9845`

| gate | result |
|---|---|
| `npm run lint` | exit 0 (`Checked 107 files … No fixes applied.`) |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0: `56 passed (56)`, `1741 passed (1741)`. The file reads `success` true, `exited`, `exitCode` 0, 0 pending, 0 todo |
| skip-count capture | `0` |
| `test-skip-integrity.js --skip-count 0` | `No findings.`, exit 0 |
| `lane-inventory.js` | `The lane collects 56 test files; git tracks 56.` `No findings.`, exit 0 |
| `git status --porcelain` after the run | empty |

## `V1`, the version: MET

- `npm ls vitest @vitest/coverage-v8 vite` exits 0, with `vitest@4.1.11`, `@vitest/coverage-v8@4.1.11` and
  `vite@7.3.6`. vite is direct, and deduped under vitest and `@vitest/mocker`.
- `package.json` changes three lines and no other: `"@vitest/coverage-v8": "~4.1.11"`, `"vite": "~7.3.6"` and
  `"vitest": "~4.1.11"`.
- **No other devDependency moves.** `npm ls --depth=0` at base and at head both read `@biomejs/biome@2.5.5`,
  `@types/node@22.20.1` and `typescript@5.9.3`.

## `V3`, the runner off and pinned: MET (`probe/pin-results.tsv`)

- `resolved-workers-v4.mjs` at head reads: `pool` threads, `maxWorkers` 2, `isolate` true, `fileParallelism`
  true, `projects` null, **`viteModuleRunner` false**, `effectiveWorkers` 2.
- **QE's plants:**
  - the key **deleted** gives **red** (`expected undefined to be false`);
  - the key **`true`** gives **red** (`expected true to be false`);
  - QE's extras are red too: the key `0` (`expected +0 to be false`), and `experimental: {}`
    (`expected undefined to be false`).
- The `it` makes no wall-clock or CPU assertion.

## `V6`, the cap on 4.1: MET (`probe/pin-results.tsv`; one scratch copy, restored and checked clean between arms)

| arm | result | message |
|---|---|---|
| control | green (2 passed) | — |
| r1 delete `maxWorkers` | **red** | `expected undefined to be 2` |
| r2 `isolate: false` | **red** | `expected false to be true` |
| r3 `VITEST_MAX_WORKERS=8` | **red** | `VITEST_MAX_WORKERS: expected 8 to be less than or equal to 2` |
| r3b `=3` | **red** | `… expected 3 to be ≤ 2` |
| r4 `projects: [{ test: { name: "qe", maxWorkers: 6 } }]` | **red** | `expected [ { test: … } ] to be undefined` |
| `maxWorkers: 3` | **red** | `expected 3 to be 2` |
| `fileParallelism: false` | **red** | `expected false to be true` |
| `poolOptions: { forks: { singleFork: true } }` (QE's own entry) | **red** | `expected true to be false` |
| `=0x3` (`QE-151-a`) | **red** | `expected 3 to be ≤ 2` |
| `=0` | **red** | `expected 0 to be greater than or equal to 1` |
| `=abc` | **red** | `expected NaN to be ≥ 1` |
| `=` empty (`QE-151-b`) | green | — |
| `=1` / `=2` | green / green | — |

- **11 reds and 3 greens, as listed.**
- **QE's extras:**
  - red as designed: `maxWorkers: "2"` (a string), `maxWorkers: "50%"`, `projects: []` (a loud startup error,
    "No projects were found"), `poolOptions: undefined` (an own key), `= 3` (leading space) and `=3abc`;
  - green as designed: an explicit `isolate: true`; `=0x2`, `=2.9` and `=1e9`, where vitest's parse and the
    pin's agree (2, 2, 1);
  - green: `VITEST_MAX_THREADS=8 VITEST_MAX_FORKS=8`. The resolver reads `effectiveWorkers` **2**, so 4.1 reads
    neither name, and the dropped loop loses nothing.
  - **`=-1` is green** (`RISK-ABC152-NEGWORKERS`): nothing runs, so the pin cannot see it (`…0d5f42fb`).
- **Parse.** Resolved `effectiveWorkers` per env value: `8` → 8, `0x3` → 3, `0` → 7, `abc` → 7, `-1` → −1,
  empty → 2, `1` → 1, `2` → 2. The pin parses as vitest does: `Number.parseInt` with no radix
  (`coverage.DM_a_rWm.js:380`), with the `biome-ignore`.
- **`QE-144-a` closes. `QE-151-a` and `QE-151-b` are folded.**
- **Header.** In `vitest.config.ts`, `VITEST_MAX_WORKERS` replaces the 3.x pair. The diff removes only the two
  lines of that one sentence, so the isolation warning is word for word.

## `V5`, test content: MET (`git diff 91024242 a99e9845 -- '*.test.ts'`)

| file | form | `expect(` base → head |
|---|---|---|
| `src/cli.test.ts` | R1; ruling 4 (`A7` 6 → 8, `V3` +1) | 321 → **324** |
| `src/render-seam.test.ts` | R1 | 36 → 36 |
| `tools/opening-book/book.test.ts` | R2 | 26 → 26 |
| `src/command-input.test.ts` | R3, R5 | 295 → 295 |
| `src/status-panel.nfr.test.ts` | R5, R4 | 15 → 15 |
| `src/gameend.nfr.test.ts`, `glyph-mode.nfr`, `history-pane.nfr`, `san.nfr`, `turn-loop.nfr`, `turn-loop`, `zobrist.nfr` | R4 | 9, 6, 44, 9, 8, 268, 4: all equal |
| `src/san.test.ts` | ruling 2 (one assertion, one comment sentence) | 10 → 10 |
| `src/book.test.ts` | ruling 3 (one import) | 77 → 77 |

- 14 files: +109 / −102.
- The only added `it` / `describe` lines are `V3`'s. No `it` / `test` / `describe` line was removed. There is no
  `.skip`, `.only`, `.todo`, `skipIf` or `runIf`.
- **The content is exactly the admitted forms, read line by line.**
  - R1 adds a 5-line `spyFrom` helper in `render-seam`: `vi.mocked` plus `mockClear`, which is the form's own
    text.
  - R2 adds one comment on its reset line.
  - `A7`'s comment is rewritten for 4.1's precedence. The SE stated this choice.
  - The stale comments are listed in `QE-152-d`.
- **Counts at head:** files **56** (= base), tests **1741** (= base 1740 + 1), skipped **0**.

## `V7`, isolation kept: MET (`probe/v7-screen-head-a99e9845.tsv`)

- `isolate` resolves `true`.
- **20 of 20 consecutive green `npm test` at head, in 20 runs total, with no restart.** Every run read: exit 0;
  56 files; 1741 tests, 1741 passed; 0 failed, 0 pending, 0 todo; **7 of 7 `*.nfr.test.ts` files passed**; 0
  unhandled errors.
- It is a count screen, not a timing.

## `V8`, the lanes collect the same things: MET as written (collection, every lane's exit, coverage). The weakened demonstration below is outside `V8`'s text, and it is blind

**Collection is EQUAL** (`probe/collect.tsv`, `vitest list --json`, base copy against head worktree, by path and by
test id):

| lane | exit base / head | files base = head (same paths) | tests base → head | only at base | only at head |
|---|---|---|---|---|---|
| default | 0 / 0 | 56 = 56, **same paths** | 1740 → 1741 | none | the `V3` `it` |
| `PERFT_DEEP` | 0 / 0 | 56, same | 1748 → 1749 | none | the `V3` `it` |
| `SEARCH_DEEP` | 0 / 0 | 56, same | 1815 → 1816 | none | the `V3` `it` |
| `ENGINE_DEEP` | 0 / 0 | 56, same | 1761 → 1762 | none | the `V3` `it` |
| `INPUT_DEEP` (+ `--expose-gc`) | 0 / 0 | 56, same | 1744 → 1745 | none | the `V3` `it` |
| `ZOBRIST_DEEP` | 0 / 0 | 56, same | 1741 → 1742 | none | the `V3` `it` |
| `PUZZLE_DEEP` | 0 / 0 | 56, same | 1746 → 1747 | none | the `V3` `it` |
| `CLI_DEEP` | 0 / 0 | 56, same | 1746 → 1747 | none | the `V3` `it` |
| `LADDER_DEEP=1` | 0 / 0 | 56, same | 1745 → 1746 | none | the `V3` `it` |

**The lanes' exits** (`probe/lanes.sh`, `probe/lanes.tsv`; one at a time in the worktree; **no wall read**, by the
task's fence):

| lane | exit | files | passed / total | failed, pending, todo |
|---|---|---|---|---|
| `PERFT_DEEP=1` | **0** | 56 | 1749 / 1749 | 0, 0, 0 |
| `SEARCH_DEEP=1` | **0** | 56 | 1816 / 1816 | 0, 0, 0 |
| `ENGINE_DEEP=1` | **0** | 56 | 1762 / 1762 | 0, 0, 0 |
| `INPUT_DEEP=1` + `NODE_OPTIONS=--expose-gc` | **0** | 56 | 1745 / 1745 | 0, 0, 0 |
| `ZOBRIST_DEEP=1` | **0** | 56 | 1742 / 1742 | 0, 0, 0 |
| `PUZZLE_DEEP=1` | **0** | 56 | 1747 / 1747 | 0, 0, 0. The gate reads `solved 54/58, baseline 54/58`, with no `NEWLY-` line |
| `CLI_DEEP=1` | **0** | 56 | 1747 / 1747 | 0, 0, 0 |
| `LADDER_DEEP=1` | **0** | 56 | 1746 / 1746 | 0, 0, 0 |
| `PUZZLE_DEEP=weakened` (`src/puzzle-suite.test.ts`) | **1**, but **the wrong row is red** | — | 13 / 14 | **see below: the demonstration is blind at head (`QE-152-h`)** |
| `npx vitest run --coverage` | **0** | — | — | — |
| `npx vitest run --coverage --coverage.include='src/**'` | **0** | — | — | — |

- Every opt-in lane exits 0, with base's collected count + 1 (the `V3` `it`), every test passed, and none
  skipped. **No lane read differently on a wall-clock budget, and no baseline was moved.**
- The `foreign_vitest_at_start` column in `lanes.tsv` is a `pgrep` count that also matches the previous lane's
  exiting workers. It is load context only, and it grades nothing.
- **`PUZZLE_DEEP=weakened` exits 1 at head, but for the wrong reason** (`probe/puzzle-weakened/base-vs-head.txt`):
  - **base `91024242` (3.2.7):** `PUZZLES weakened (evaluate = 0): solved 15/58`. The red row is **the gate**
    (`expected 15 to be greater than or equal to 54`). A3 passes. This is the designed demonstration.
  - **head `a99e9845`:** `PUZZLES weakened (evaluate = 0): solved 54/58`, the shipped engine's own count. **The
    gate row is GREEN.** The red row is A3 (`expected 54 to be less than 54`).
  - **So the `evaluate = 0` mock never reaches the engine with the runner off.** The mock is
    `vi.doMock("./evaluate.ts", …)` followed by `await import("./engine.ts")` (`src/puzzle-suite.test.ts:368-374`),
    the fresh-registry family that R2 rewrote in `tools/opening-book/book.test.ts`.
  - It was outside `D3`'s screen, which ran the default lane only, and so outside `V4`'s set.
  - **The exit code is 1 either way.** A check that reads only "exits 1" passes it. That includes the task's own
    wording and `AGENTS.md`'s "exits 1 by design".
- **An admitted form re-arms it, on a scratch copy** (`probe/specs/v4e-puzzle-r2.mjs`,
  `probe/puzzle-weakened-results.tsv`, `probe/puzzle-weakened/r2-shape-repair-probe.txt`). It is R2's shape:
  `vi.mock("./evaluate.ts", { spy: true })` at file top, `import { evaluate }`, and
  `vi.mocked(evaluate).mockImplementation(() => 0)` in place of the `doMock` block.
  - weakened: **1 failed, 13 passed, and the failing row is the gate** (`expected 15 to be ≥ 54`). That is 15/58,
    base's own number;
  - `PUZZLE_DEEP=1`: 18 / 18 green;
  - default: 12 / 12 green;
  - the `expect(` count is unchanged (the `doMock` block holds none).
  - QE did not write this into the branch.

## `V12`, the zero-production-lines part: MET

`git diff --name-only 91024242 a99e9845 | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (grep exit 1). The
lockfile, licence and audit review belongs to Security/NFR.

## The dry-run merge against `main`

- `git merge-tree --write-tree --name-only main a99e9845` is **clean** (tree `67fd02e3`, no conflict line).
- **In a detached worktree at `a99e9845`, `git merge --no-commit --no-ff main` (`0ff618be`):** "Automatic merge
  went well".
  - The incoming changes are only `.grugops/queue/done/ticket-to-pr-ABC-152.{md,claim.md}`,
    `.grugops/queue/pending/qe-ABC-152.md` and `plans/board.md`.
  - No `src/`, `tools/`, `package*.json` or `vitest.config.ts` path differs from head, so the merged tree's code
    is head's, byte for byte.
- **The merged tree is green.**
  - lint 0, typecheck 0, build 0;
  - `npm test` 0: 56 / 1741, with the file reading `success` true, `exited`, 0 pending, 0 todo;
  - skip capture `0`; integrity `No findings.`; inventory 56 = 56.
  - Its `node_modules` was an APFS clone of the worktree's (`cmp` showed the lockfile equal).
- Then `git merge --abort`, and the worktree was removed. Nothing was committed.
- **After QE's record commit**, the branch adds notes, probe files, one ticket section and one trace row. `main`
  since base touches only queue files and `plans/board.md`, so the merge stays clean (re-checked after the
  commit; see the verdict).
