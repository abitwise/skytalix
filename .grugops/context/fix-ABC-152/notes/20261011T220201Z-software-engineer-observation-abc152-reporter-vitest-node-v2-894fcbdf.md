---
id: 20261011T220201Z-software-engineer-observation-abc152-reporter-vitest-node-v2-894fcbdf
kind: observation
by: software-engineer
at: 2026-10-11T22:02:01Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-143
  - ADR-0042
  - QE-152-a
  - RISK-ABC143-01
  - tools/grugops/result-file-reporter.js
  - 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
  - 20261011T212237Z-qe-e2e-observation-abc152-v2-reporter-rows-0d5f42fb
supersedes:
---

# SE `ABC-152` commit 2 (`502df2b6`, `QE-152-a`): `vitest/node` at the reporter; `===` is true, 0 deprecation lines, and `V2`'s six rows agree by content

This note is hand-authored and unsealed. **No timing was read.**

- **The change:** `tools/grugops/result-file-reporter.js:76`, `from "vitest/reporters"` → `from "vitest/node"`.
  `git diff -U0` shows exactly that one line. Nothing else in the file changed. `npx biome check` reports no fixes.
- **`===`:** `node --input-type=module -e 'console.log((await import("vitest/node")).JsonReporter === (await import("vitest/reporters")).JsonReporter)'`
  printed **`true`**. The `vitest/reporters` import in that one-off check prints its own deprecation line, as
  expected.
- **`npm test`:** exit **0**, 56 files, **1741 passed**. `grep -c deprecated` on its console gives **0**.
- **Skip count:** `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'` gives **0**.

## `V2`'s six rows at `502df2b6`, by content

- **Method:** QE's `probe/v2rows.mjs` (`.grugops/context/qe-ABC-152/probe/`), copied unmodified.
  - The pristine tree is a `git archive 502df2b6` outside the repository. `node_modules` is an APFS clone of the
    worktree's 4.1.11 install. Mutant: `none`.
  - The commands are cut from the committed header by program (`probe/v2-cut-commands.txt`).
  - Each row runs on a fresh copy, and the copy is deleted after the row.
  - Plant files are QE's: `apply` (unhandled), `fen` (suite), `legal` (assertion) and `moves` (hang).
- **Output:** `probe/v2-head-502df2b6.json`.

| row | exit (got / want) | fields | query lines (by content) | verdict |
|---|---|---|---|---|
| green | 0 / 0 | true | none | **AGREE** |
| unhandled | 1 / 1 | true | `error  PLANT-timer`, `run    exited exitCode=1` | **AGREE** |
| suite | 1 / 1 | true | `suite  …/src/fen.test.ts  PLANT-suite`, `run    exited exitCode=1` | **AGREE** |
| assertion | 1 / 1 | true | `test   …/src/legal.test.ts  isInCheck is false in the starting position`, `run    exited exitCode=1` | **AGREE** |
| exit code only | 1 / 1 | true | exactly `run    exited exitCode=1` | **AGREE** |
| hang | 124 / 124 | true | exactly `run    started exitCode=none, killed` | **AGREE** |

- **The console tails of all six rows hold 0 `deprecated` lines.**
- **`M9b` and the `onFinished` mutant were not re-run.** Ruling 9 says `M9b` is QE's to re-run.
- **After the hang row:** a bracketed `pgrep -fl '[v]itest'` found no vitest process from this worktree or the
  scratch copies. It did list a vitest run that belongs to another project (`…/Projects/public/grugops`). That run
  was left alone.
