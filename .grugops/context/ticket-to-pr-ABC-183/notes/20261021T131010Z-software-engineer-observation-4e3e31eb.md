---
id: 20261021T131010Z-software-engineer-observation-4e3e31eb
kind: observation
by: software-engineer
at: 2026-10-21T13:10:10Z
verified_by: 
confidence: high
refs:
  - ABC-183
  - AR-180-VALIDATED
  - AR-162-FALLBACK
  - ABC-180
  - ABC-095
  - grugops/ABC-183
  - 7bd2b54f
  - 19abbdb1
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
  - P6f
  - TMO
supersedes: 
seal: sha256:662375ced5739fe06d51acf466cdebf1e79dc65440be39f09de2e4a861ea442d
---

# ABC-183 A4 plant matrix: TMO + P6f is 11/11 green on the base test and 10/11 red at the new AR-162-FALLBACK assertion on the head test

Method: each cell is `git archive 19abbdb1` into a scratch copy outside the repository (session scratchpad `…/a183/copies/`), plus the cell's test file and `src/book-file.ts`, with a `node_modules` symlink and a private `TMPDIR` per run. One run per cell: `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`. Runs one at a time. The worktree's `git status --porcelain` showed only the intended edit throughout.

- **P6f:** the delivered `book-file.ts` with the body replaced by `try { return readFileSync("data/opening-book/book.json"); } catch { return readFileSync(new URL("../data/opening-book/book.json", import.meta.url)); }` (QE `…567002e7`'s P6f, body-equivalent). sha256 `afeab577…f71e`. It does NOT equal QE's `e4947664…1d6` byte-for-byte; QE's exact file was not in shared context.
- **TMO:** the decoy's `mkdirSync` and `writeFileSync` lines moved to directly after the `booked = spawnReal(` line; at head the capture line stays where it is. Test sha256: base-TMO `49dd6aa6…d5f2`, head-TMO `c9ff8261…af06`; base `5e590b23…cdd5`, head `8a84dfa3…d2a6`.

| plant | base test | head test |
|---|---|---|
| none | 11/11 green | 11/11 green |
| P6f | 10/11, red `A7` at the stderr detector (`expected 'opening book is not valid UTF-8 JSON;…' to be ''`) | 10/11, red `A7` at the stderr detector (same message) |
| **TMO + P6f** | **11/11 green** | **10/11, red `A7` at the new assertion**: `AssertionError: AR-162-FALLBACK: the decoy must exist before the booked child spawns, or the detector is disarmed: expected false to be true` |
| TMO | 11/11 green | 10/11, red `A7` at the new assertion (same message) |

The TMO + P6f head failure output contains `AR-162-FALLBACK`. Matches the page's table in every cell. QE re-plants independently.
