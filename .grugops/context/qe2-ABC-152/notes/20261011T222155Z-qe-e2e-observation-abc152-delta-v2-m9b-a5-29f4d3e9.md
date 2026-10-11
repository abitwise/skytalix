---
id: 20261011T222155Z-qe-e2e-observation-abc152-delta-v2-m9b-a5-29f4d3e9
kind: observation
by: qe-e2e
at: 2026-10-11T22:21:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-143
  - ABC-149
  - ADR-0042
  - QE-149-c
  - QE-152-a
  - QE-152-c
  - RISK-ABC143-01
  - tools/grugops/result-file-reporter.js
  - .grugops/context/qe2-ABC-152/probe/v2rows-qe2.mjs
  - .grugops/context/qe2-ABC-152/probe/v2/
  - .grugops/context/qe2-ABC-152/probe/a5/
  - 20261011T220201Z-software-engineer-observation-abc152-reporter-vitest-node-v2-894fcbdf
  - 20261011T212237Z-qe-e2e-observation-abc152-v2-reporter-rows-0d5f42fb
supersedes:
---

# QE `ABC-152` delta, commit 2 (`502df2b6`, ruling 9), graded at the tip `49997a87`: the six rows AGREE on new plant files, `M9b` is killed by the exit-code-only row alone, and the reporter adds no console line (`ABC-143` A5 closed)

This note is hand-authored and unsealed. **No timing was read.**

## Method

- **`probe/v2rows-qe2.mjs`** is QE's first-hop `v2rows.mjs` with **different plant files**. The first hop and the
  SE both used `apply` / `fen` / `legal` / `moves`. This hop uses:
  - **unhandled:** `src/render.test.ts`, with the header's own `e.g.` appended verbatim (the awaited form);
  - **suite:** `src/frame.test.ts`, with `throw new Error("PLANT-suite")` as the first line of
    `describe("ABC-018 acceptance — the assembled frame")`;
  - **assertion:** `src/moves.test.ts`, `isSquareAttackedBy(…"b2"…, false)` `toBe(false)` → `toBe(true)`;
  - **hang:** `src/evaluate.test.ts`, with `it("QE2-152 hang", () => { while (true) {} })` appended after the green
    pre-run and the stamp.
- **It also adds a whole-console `deprecat` count per row.** The grading logic and the command cut are unchanged:
  the commands are cut from the committed header, and READ IT keeps its line breaks.
- **Pristine tree:** `git archive 49997a87`. `node_modules` is an APFS clone of the worktree's own `npm ci`. Each row
  runs on a fresh clone, and the clone is deleted after the row.

## Rows at `49997a87` (`probe/v2/v2-head-49997a87.json`)

| row | exit (got / want) | fields | query lines (by content) | `deprecat` | verdict |
|---|---|---|---|---|---|
| green | 0 / 0 | true | none | 0 | **AGREE** |
| unhandled | 1 / 1 | true | `error  PLANT-timer`, `run    exited exitCode=1` | 0 | **AGREE** |
| suite | 1 / 1 | true | `suite  …/src/frame.test.ts  PLANT-suite`, `run    exited exitCode=1` | 0 | **AGREE** |
| assertion | 1 / 1 | true | `test   …/src/moves.test.ts  ABC-004 — attack detection sees a rook …`, `run    exited exitCode=1` | 0 | **AGREE** |
| exit code only | 1 / 1 | true | exactly `run    exited exitCode=1` | 0 | **AGREE** |
| hang | 124 / 124 | true (`runState` started, no `exitCode`, `startTime` after the stamp) | exactly `run    started exitCode=none, killed` | 0 | **AGREE** |

- The exit-code-only precondition reads `Coverage for lines (99.43%) does not meet global threshold (100%)`. That is
  the same margin as the first hop (`QE-152-c`, unchanged).
- The assertion row reads `numFailedTestSuites` 2 with `numFailedTests` 1. That is vitest's own count, and the
  first hop read the same.

## `M9b` (`QE-149-c`; ruling 5 item 4; ruling 9's "QE re-runs it") at `49997a87` (`probe/v2/v2-m9b-49997a87.json`)

| row | verdict under `M9b` |
|---|---|
| green, unhandled, suite, assertion, hang | AGREE |
| **exit code only** | **DISAGREE**: exit 1, but the file reads `success` **true** and `exitCode` **0**, and READ IT prints **0** lines |

**The exit-code-only row alone kills `M9b`, as it must.**

## `ABC-143` A5, "the console gains no line": MET

- **0 `deprecat` lines** in all 12 consoles (6 rows plain, 6 under `M9b`) and in the worktree's own `npm test`.
- **A direct test of the clause:**
  - QE compared `npm test` (default reporter plus the result-file reporter) with `npx vitest run
    --reporter=default`, on the same tree;
  - normalised: `Duration` / `Start at` / `ms` cut, per-file lines dropped, npm's `> ` echo dropped;
  - **19 = 19 lines, `/usr/bin/diff` exit 0.** The reporter adds no console line.
  - Files: `probe/a5/`.
- **`QE-152-a` is closed.** The specifier change is one line (`git show 502df2b6`: +1 / −1, at `:76`).
- The load-time check is unchanged, and it still guards `RISK-ABC143-01` surface 1, which now reads `vitest/node`.
