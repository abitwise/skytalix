# `ABC-245` R1 census and plants: one row, level 1's 100 ms at step 10, 10 reads per level call; red at cap 8 and 50, green at 100, ≠ 0 on base

## R1 census line (`ADR-0046` § Addendum R1, § Ruling 2026-10-31)

| row (file § title) | searches | budget | step | reads **per level call** | per-child budget, as actually handed | A2 kill set / A3 at this step |
|---|---|---|---|---|---|---|
| `levels.test.ts` "ABC-245 — a third occurrence whose earlier two lie more than 50 plies back" › "A1–A3: it scores exactly 0 with legal − 1 child searches at matches −98 and −94; base reads it otherwise" | 1 level call (7 child searches for 8 legal moves) + 1 base oracle (8) | 100 ms | 10 | **10 per level call** (⌈100 ÷ 10⌉) | 2.5, −25, −52.5, −80, −95, −122.5, −150 ms (the 7 children, read from the recorded `chooseMove` options; the skipped repeat's slot passes on). Every child searched depth 1; the level call's elapsed reads 290 virtual ms (base 330) | both hold: cap 8 and cap 50 red, cap 100 green; base reads −1005 |

The per-child figures are a reading, never the nominal 12.5 ms slice. 0 real-clock rows added.

## Plants (scratch tree, never committed)
Scratch tree: `src/`, `tools/`, configs copied from the worktree at `7e81732e`, `node_modules` linked. Each plant is one
exact string edit of `src/levels.ts` (`const PRIOR_KEYS_WINDOW = 100;`, found exactly once), or base's file;
`src/levels.test.ts` run alone through node (json reporter, heap 128). Raw: `raw/plants/plant-*.json`.

| plant | edit | `levels.test.ts` result | the ABC-245 row |
|---|---|---|---|
| cap 8 (QE's Q6) | 100 → 8 | 45 pass, 1 fail | **red**: `expected [ 'd7e8:-1005' ] to deeply equal [ 'd7e8:0' ]` |
| cap 50 (QE's Q8) | 100 → 50 | 45 pass, 1 fail | **red**: the same |
| cap 100 (none) | — | 46 pass | green |
| base | `src/levels.ts` from `4387d4e8` | 41 pass, 5 fail (`ABC-242` A1 ×3, A5, and this row) | **red**: the repeat reads −1005, not 0 (A3: base's score ≠ 0) |

In the cap-8 and cap-50 runs no other row turned red, which is QE-242-b's gap: before this row, Q6 and Q8 survived
the lane. The plant runs were in-file only; QE re-reads A2 on the whole lane.
