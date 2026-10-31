---
id: 20261031T040755Z-qe-e2e-observation-ead81a11
kind: observation
by: qe-e2e
at: 2026-10-31T04:07:55Z
verified_by: 
confidence: high: every plant run at H (and the ticket's at B) on scratch copies; diff read from git
refs:
  - qe-ABC-243
  - ABC-243
  - EPIC-010
  - ADR-0046
  - NFR-008
  - NFR-009
  - ABC-228
  - ABC-241
  - ABC-244
  - SE-228ii-a
  - QE-228ii-b
  - QE-241-a
  - QM3
  - QE-244-a
  - R1
  - se-ABC-243/20261031T025851Z-software-engineer-decision-c408ef9e
  - se-ABC-243/20261031T025851Z-software-engineer-observation-9c3d34df
  - se-ABC-243/20261031T025851Z-software-engineer-observation-a66447b8
  - se-ABC-243/20261031T025851Z-software-engineer-observation-fd162ca2
  - grugops/ABC-243
  - 8772cf36
  - 4bd9ac6a
  - grugops/qe-ABC-243
  - src/uci-session.test.ts
  - src/transposition.test.ts
supersedes: 
seal: sha256:775307b3af09a683ca9ce4dde7dacf377d079c0de9d323e99688750779cf8aba
---

# `ABC-243` A1, A2, A3, A4, A6 at head `8772cf36` (base `4bd9ac6a`): plants red where they must be, the diff is the ticket's

Scratch trees B = `git archive 4bd9ac6a`, H = `git archive 8772cf36`; `diff -r B H` = the two test files only. Plants live
in per-run scratch copies (`qe-scripts/plant.mjs`), one exact replacement in `src/uci-session.ts` asserted unique, deleted
after each run; never committed. Runner `node_modules/.bin/vitest run`, json reporter, `NODE_OPTIONS=--max-old-space-size=128`.

## A2: "`setoption Hash` sets the level to L" (QE's own insertion point: an early return at the top of `setOption`)

File `src/uci-session.test.ts` only (H 201 rows, B 200).

| plant | H (head test file) | failing assertion at H | B (base test file) |
|---|---|---|---|
| none | **green** 201/201 | — | green 200/200 |
| L4 (ticket) | **red**, Hash row only | `expected 1100 to be greater than or equal to 4000` | red: `not an info line: info depth 5 nodes 5140 time 1100 …` (a parse fail, not a bound) |
| L6 (ticket) | **red**, Hash row only | `expected 5100 to be less than or equal to 4200` | **green** (SE-228ii-a reproduced) |
| L7 (ticket) | **red**, Hash row only | `expected 30100 to be less than or equal to 4200` | **green** (SE-228ii-a reproduced) |
| L1 (QE ext.) | red, Hash row only | `expected 200 to be greater than or equal to 4000` | not run |
| L2 (QE ext.) | red, Hash row only | `expected 300 to be greater than or equal to 4000` | not run |
| L3 (QE ext.) | red, Hash row only | `expected 500 to be greater than or equal to 4000` | not run |
| L5 (identity control) | green 201/201 | — | not run |

- **A2 MET.** The three ticket reds match the SE's readings (1 100, 5 100, 30 100) from a different plant site. The row
  now catches a jump to every other level, 1–7, each on the time bound and not on a format detail.
- **A1 MET.** Read at H `:757`–`:774` (level half `:765`–`:773`): fresh `rig()` (step 100), `setoption name Hash value 64` → `[]`, `position startpos`,
  bare `go`, 2 lines, `time` from `/ time (\d+) /`, `expectWithin(Number(time), LEVELS[5].budgetMs)` (the constant), then
  the `bestmove` shape. Green with no plant; the reds above show the bound bites both ways (below 4 000, above 4 200).

## A6: QM3 (`qe-ABC-241` `mutate.mjs` strings, byte for byte), the whole suite

| run | result | red rows |
|---|---|---|
| none @ H | **green** 2 323/2 323, 0 pending, 0 suite errors | — |
| QM3 @ H | **red** 2 322/2 323 | exactly one: "A6: a FEN carrying an uncapturable ep square: its own key counts, d1e1 scores exactly 0; base's list does not" — `expected 'cp -875' to be 'cp 0'` |
| QM3 @ B | green 2 322/2 322 | none (QE-241-a reproduced: no base row sees QM3) |

- **A6 MET.** Code read: `position fen 4k2q/8/8/8/P7/8/8/4K3 b - a3 0 1 moves h8h7 e1d1 h7h8 d1e1 h8h7 e1d1 h7h8`, `go depth 4`
  (N = 4, in 1–5), `cp 0` and `bestmove d1e1`; the base half runs `chooseMove` at the same root, `maxDepth 4`, with
  `trimPriorKeys(keyHistory(game), halfmoveClock)` and asserts the score is not 0 (green, so the raw list does not draw).

## A3 / A4: the diff

- `git diff --name-only 4bd9ac6a 8772cf36` (whole tree): `src/transposition.test.ts`, `src/uci-session.test.ts`. Nothing
  in `tools/`, `data/` or any production file.
- `--numstat`: transposition 3/3, uci-session 33/1. The one removed uci-session line is the Hash row's old
  `expectWithin(levelTime(level.send, 5), 3_500)`.
- **A3 MET.** `-U0` on `src/transposition.test.ts`: exactly 3 lines (header `:19`, doc `:660`, title `:667`); the word
  diff is `3 s` → `` `DEFAULT_BUDGET_MS` (4 s) `` three times (no backticks in the title). No code, bound or budget token.
  The deep row's script does read `${DEFAULT_BUDGET_MS}` (`engine.ts:149`, 4 000), so the title is now true.
- **A4:** the `it(` lines added/removed in `src/`: the deep row's title (renamed, `ENGINE_DEEP` only, not in the default
  lane) and one added, the A6 row. Default-lane counts and names: see the timing note (from the `G8` runs' `last-run.json`).
