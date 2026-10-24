---
id: 20261024T084630Z-software-engineer-observation-e3ee9c45
kind: observation
by: software-engineer
at: 2026-10-24T08:46:30.593Z
verified_by: 
confidence: high: deterministic plant runs on a scratch copy, holder restored and cmp-checked
refs:
  - se-ABC-213-probe-rows
  - ABC-213
  - QE-213-a
  - QE-213-b
  - QE-213-c
  - QE-213-d
  - ADR-0047
  - grugops/ABC-213
  - 7adc85ac
  - e46db08e
  - src/pgn.test.ts
  - src/pgn-file.ts
  - qe-ABC-213/20261024T084131Z-qe-e2e-observation-1bb1938c
  - qe-ABC-213/20261024T090500Z-orchestrator-decision-502866f9
supersedes: 
seal: sha256:4ff6328d12200ae08a952ef9378081d34a91b7866595646313e230b918bcaca6
---

# ABC-213 probe rows Q6/Q7/Q8 in src/pgn.test.ts at 7adc85ac: each reds only under its own plant, passes at head

Software Engineer, task `se-ABC-213-probe-rows`, branch `grugops/ABC-213` in `../wt-ABC-213`, commit **`7adc85ac`** (parent `e46db08e`).

## The change
- `src/pgn.test.ts` +20 lines: QE's three rows from `qe-ABC-213/raw/probe-rows.ts`, verbatim, appended to the `ABC-213` describe, on the existing `node:fs` double. 0 new spawns (1 `spawnSync(` site, A7), 0 new files, no ABC-203 expected value edited. No other file changed.
  - **Q6** (QE-213-b): write `EFBIG` + close `EIO` gives `EFBIG` (the first code).
  - **Q7** (QE-213-a): a fault at the `-2` candidate leaves `games/` = `[<stem>.pgn]` with the earlier game's bytes intact.
  - **Q8** (QE-213-c): a codeless write failure is rethrown (D5).

## Plants (QE's `raw/plants.mjs`, unedited, on a scratch copy of the worktree; `src/` never edited; result `raw/plants-result.json`), `src/pgn.test.ts` 24 rows
| plant | result |
|---|---|
| HEAD | 24/24 |
| Q6 `failure = error` | 23/24, red only `QE probe Q6` |
| Q7 unlink `games/${stem}.pgn` | 23/24, red only `QE probe Q7` |
| Q8 codeless → `EIO` | 23/24, red only `QE probe Q8` |
| X1 drop unlink | 18/24: A1 ×2, A2 ×2, A3, probe Q7 |
| X3 / X4 | 22/24: A1 ×2 |
| X5 `catch {}` | 23/24: A3 |

Identical to QE's `plants-probe-result.json`. No `games/` in the copy's root.
