---
id: 20261012T140000Z-software-engineer-observation-gates-cli-deep-plants-clause-b-s3-adc2b5bb
kind: observation
by: software-engineer
task: wire-ABC-095
at: 2026-10-12T14:00:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-119
  - ABC-042
  - ABC-043
  - ABC-041
  - ADR-0036
  - ADR-0037
  - NFR-008
  - 20261012T133500Z-security-nfr-decision-s1-s2-ruled-r1-stands-s3-checklist-a096cf43
  - 20261012T135800Z-software-engineer-decision-wiring-built-to-r1-r3-s3-readings-taken-c2673608
supersedes:
---

# Gates, the `CLI_DEEP` lane, five plants, clause (b) and the S3 self-check, on `09740ea4`

This note is hand-authored and unsealed. Everything was run on `grugops/ABC-095-book-before-engine`.
Host: Apple M3, Mac15,13, Darwin 25.5.0 arm64, Node v26.11.0, AC power. Foreign vitest runs were live
throughout these correctness runs (`oeselg-labs/platform/repos/product-template/template` integration, and the
grugops kit's `install/` tests). That matters for timing only, and no timing is quoted here.

## Gates on `09740ea4`, 2026-10-12 ~13:56Z (load1 5.49)

| gate | result |
|---|---|
| `npm run -s lint` | exit 0, 112 files, no fixes |
| `npm run -s typecheck` | exit 0 |
| `npm run -s build` | exit 0 |
| `npm test` | exit 0; **58 files, 1780 passed**, 0 failed; `.test-results/last-run.json` `success: true`, `numPendingTests` 0, `numTodoTests` 0 |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |

The counts equal the pre-wiring branch (58 / 1780, `…2cc11fef`). The re-targets and pin moves add no row. The
default-lane `ABC-119` row is the same row, with its body amended.

## `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`

Two runs, 13:53:43Z–13:53:53Z and 13:54:00Z–13:54:10Z (load1 4.6–4.9). Both exit 0, **9 passed** (1 default +
6 `ABC-119` + 2 `ABC-095`), about 9.6 s. Record lines from the second run (`[CLI_DEEP]`, from the test):
- book-absent copy, `--colour black --ascii`, stdin `""`: wall 3103 ms, exit 0;
- book-absent copy, the same with `"zz9\n"`: wall 3103 ms, exit 0;
- book-absent copy, the same with `"quit\nquit\n"` (`A5` stream half): wall 3098 ms, exit 0;
- the repository's tree, `--colour white --ascii`, stdin `"e2e4\n"` (`A7`): wall 107 ms, exit 0.

0 `abc095-book-absent-*` directories were left in `$TMPDIR` after either run, or after the default lane.

## Five plants, each in its own copy outside the repository (`node_modules` symlinked)

| plant | `CLI_DEEP` lane | default lane |
|---|---|---|
| `leak`: book copied into the copy AFTER the pre-spawn check | **3 red**: `ABC-119` `A1` (floor), `A3`(iv) (warning missing), `ABC-095` `A5` | n/a |
| `leakprecheck`: book copied inside `makeBookAbsentCopy` | exit 1: `the copy's book: expected true to be false`; all 9 not run | **red**: the `ABC-119` default row, same message |
| `linked`: the copy's `src/` is a `symlinkSync` to the tree's `src/` | exit 1: `the copy's src/ itself: expected false to be true` | **red**: the default row, same message |
| `stdout`: `warn` writes to `process.stdout` | **2 red**: `A3`(iv), `A5` stream half | not run |
| `unwire`: `engine: createEngine(…)` restored | **2 red**: `A3`(iv), `A5`. **`A7`'s child row stays GREEN** | `src/cli.test.ts` **red**: `ABC-043` `A1`, `A2`, `A5`, `A7`, `ABC-044` `A6`, `A3` (the first 6 failing rows; the output was cut at 6, so the total was not read) |

**Read the `unwire` row. `A7`'s child row does not discriminate an unwired build by itself.** Without the book, the
real search's reply to 1. e4 at 3 s is a move the book also holds: the book has 19 replies there, the main lines
included. The row is a positive witness that a real session's reply is a book move. The build that skips the book
is caught by `A7`'s structural half (the `ABC-043` `A1` pin, and the re-targeted children, which red because the
double at `./book-engine.ts` is never reached), and by `A5`'s stream half. Test note 5 forbids the only
observable that would separate them in the child, its wall time (107 ms against ~3.1 s). **This is recorded for QE.
It is not hidden behind a wall-clock assertion.**

## S3 item 1 — `clause-b.mjs 0974102f 09740ea4 <limb>` (self-check; Security/NFR re-runs it at the gate)

Production files changed: `src/book-engine.ts`, `src/book-file.ts`, `src/cli.ts`.
- **Limb 1 FIRES.** (b1) `src/book-file.ts:13 import { readFileSync } from "node:fs";`. (b2) 3 new edges, 1 reaching
  a holder: `src/cli.ts -> src/book-file.ts`. Edges reaching no holder: `cli.ts -> book.ts`, `cli.ts ->
  book-engine.ts`. Holders at head: 1 (`src/book-file.ts`).
- **Limb 2 FIRES.** (b1) `src/cli.ts:177 warn: (line) => process.stderr.write(`${line}\n`),`. (b2) 0 edges reach a
  holder. Holders at head: 3 (`src/cli.ts`, `src/glyph-mode.ts`, `src/perft-bench.ts`).
- **Limb 3 does not fire.** 0 (b1), 0 (b2), 0 holders.
- **Word hits on added lines:** 0 on every limb.
- **The holder set at the tip is exactly 4**, as predicted. Ruling 2, applied by hand: limb 1's (b1) unit is the
  holder file, and the file is new, so it fires either way.

## S3 items 2–8, self-check

| item | reading |
|---|---|
| 2 `book-file.ts` | 1 import `{ readFileSync } from "node:fs"`; 1 export `readBookFile()`, 0 params; 1 call `readFileSync(new URL("../data/opening-book/book.json", import.meta.url))`; `grep -E 'process\|catch\|write\|import\(\|eval'` → 0 hits (comments included); nothing at import |
| 3 `cli.ts` | diff = 3 imports + the one `const` (read/warn/random) + the `engine:` line; `warn` is `` (line) => process.stderr.write(`${line}\n`) ``. Inside `runTurnLoop({…})` the only changed line is `engine:` |
| 4 `A9` | sorted list gains a third `"process.stderr"`; `\bprocess\b` 9 → 10; a reason paragraph; `not.toContain("globalThis")` still there |
| 5 bars 1/4 | unedited and green. New `cli.ts` lines grepped for `eval`, `Function(`, `child_process`, `import(`, `fetch`, `WebSocket`, `XMLHttpRequest` → 0 |
| 6 hostile input | `git diff 0974102f 09740ea4 -- src/book.ts` → 0 lines. The warning is `opening book could not be read; playing on without it` (derived in the test): no path, no errno |
| 7 tree copy | real (`lstat`, no link; `linked` plant reds), byte-identical `src/` + `package.json` asserted before spawn, book absent (`leakprecheck` reds), `mkdtempSync(join(tmpdir(), "abc095-book-absent-"))`, `rmSync(root, { recursive: true, force: true })` on the exact return only. `A3`(iv) asserts the warning PRESENT exactly once (`leak` reds) |
| 8 (a) | `git diff --numstat … -- package.json package-lock.json` → 0 |
| 8 (c) | default lane: 0 new spawns (`ABC-119`'s default row still spawns nothing; `src/cli.test.ts` `N8_SPAWN` pin unchanged at 27); filesystem writes only under `os.tmpdir()`. `CLI_DEEP`: 2 new children, named: the book-absent `quit` child (`A5`) and the repository `e2e4` child (`A7`) |
| 8 (d) | `git diff --numstat 0974102f 09740ea4 -- src/` names exactly the six files of § Scope's list |

## `A6`

`git diff --numstat 0974102f 09740ea4` over `src/engine.ts`, `src/search*.ts`, `src/evaluat*.ts`,
`src/quiescence.ts`, `src/transposition.ts`, `src/levels.ts`, `src/*order*.ts`, `src/virtual-clock.ts`,
`src/turn-loop.ts` and `data/` → 0 lines.

## Not read here, `UNKNOWN - verify` (QE's under `ADR-0035`)

The two `N8-LANE` costs: the 10 children's real `./engine.ts` closure, and the default row's tree copy, which ran
in 22–31 ms per run here under load. That is a single observation, not an `N8-LANE` reading.
