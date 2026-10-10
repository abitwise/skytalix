---
id: 20261010T083105Z-software-engineer-observation-abc036-a1-a7-met-mutants-red-gates-green-n8lane-605aa727
kind: observation
by: software-engineer
at: 2026-10-10T08:31:05Z
verified_by: 
confidence: high
refs:
  - ABC-036
  - EPIC-003
  - ABC-035
  - N8-LANE
  - NFR-008
  - NFR-003
  - src/command-input.ts
  - src/command-input.test.ts
  - .grugops/queue/claimed/ticket-to-pr-ABC-036/ticket-to-pr-ABC-036.md
supersedes: 
---

# `ABC-036`: A1–A7 met, six mutants red, gates green, `N8-LANE` +130 ms

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `ticket-to-pr-ABC-036`, branch
`grugops/ABC-036-moves-command` from `85eb80c`, code commit `6aad5c9`. Machine: Apple M3,
Node v26.11.0. The host was heavily loaded (load1 20–95; `ABC-127` was building in parallel).
Raw files are beside this note (`raw-*`).

## Test-first

The 33 new rows were written first. Against the wave tip's `src/command-input.ts`, exit 1 with
28 failed and 156 passed (`raw-out-red.txt`). The 5 rows that passed are the "not a command"
negatives, which are true before and after. After the implementation, one merged row went red:
`ABC-035 A4`'s "does not name moves". It was retired (decision note `…daa1392b`, item 6).

## Criteria

| # | verdict | reading |
|---|---|---|
| `A1` | MET | Six `PERFT_SUITE` positions (start plus five mid-games). Stated count == `legalMoves(position).length` == published depth-1 count: 20, 48, 14, 6, 44, 46. Zero exceptions |
| `A2` | MET | On all six: the listing is the set of strings the `toSan` spy RETURNED, `toSan` was called once per legal move in array order, and the listing is strictly ascending. Start-position order pinned: `Na3 Nc3 Nf3 Nh3 a3 a4 … h4` |
| `A3` | MET | Start position through `assembleFrame` at the delivered panels: `(+N more)` present with N > 0, stated total 20, and `legal moves: 20` visible in the region. Seen: `legal moves: 20 Na3` / `Nc3 Nf3 (+17 more)` (`raw-out-region-start.txt`). Neither the width nor N's value is asserted |
| `A4` | MET | On all six through `MoveInputDeps`: `legalMoves` called once on the prompt position, `toSan` called `legal.length` times, each with that position and `toBe` the same array. Neither parser called. Production path (no seam), start position: exactly 1 module-level `legalMoves` |
| `A5` | MET | Pure function at ply 4: FEN byte-identical, `moves.length` 4, 0 `gameStatusOf`, 0 `repetitionCounts`. Through the merged loop: 2 renders, frame 2 carries the listing, FEN and ply unchanged, exactly 1 `gameStatusOf` (the loop's own) |
| `A6` | MET | `git diff --numstat 85eb80c 6aad5c9 -- src`: `237 13 src/command-input.test.ts`, `47 11 src/command-input.ts`, nothing else. `src/frame.ts`, `src/move-input.ts` and `src/turn-loop.ts` are byte-identical (`git diff --quiet`). Suite green, skip 0, `PERFT_DEEP=1` 32/32 (exit 0, 49.4 s) |
| `A7` | MET | The `ABC-035 A7` rows are unedited and green with `moves` as the eighth token. Rendered: `help board quit claim` / `resign new undo moves`, both 21/21, no marker |

## Mutants (planted in `src/command-input.ts`, run on the file, reverted; `raw-out-mutants.txt`)

| mutant | rows red | killed by |
|---|---|---|
| M1 drop the list from `toSan` (the `ABC-033` M11 shape) | 7 | `A4` (all six positions plus the production row) |
| M2 a second derive for the listing | 7 | `A4` |
| M3 `localeCompare` sort | 7 | `A2` (all six plus the pinned order) |
| M4 count item last | 18 | tolerance rows, `A1`, `A2`, `A3` |
| M5 states the SHOWN count (`min(n, 9)`) | 10 | `A1` (the five positions over 9), `A3`, tolerance rows |
| M6 unsorted | 7 | `A2` |

`src/` was clean afterwards (`git diff --quiet HEAD -- src`).

## Gates (on `6aad5c9`'s tree)

| step | result |
|---|---|
| `npm run lint` | exit 0, 97 files, no fixes |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, **50 files, 1573 passed**. At `85eb80c` the same command read 50 / 1540. +33 = 33 new rows − 1 retired + 1 (the per-table-row "neither grammar can read" loop now covers `moves`). This file: 151 → 184 |
| skip count | 0 (`npx vitest run --reporter=json`, `numPendingTests + numTodoTests`) |
| skip integrity | `No findings.`, exit 0 |

## `N8-LANE` (the standing instrument)

There are three trees from `git archive 85eb80c`. `null` is `diff -rq`-identical to `base`.
`tip` is `base` plus this branch's two `src/` files, `cmp`-identical. Each tree runs
`npx vitest run` directly with `PERFT_DEEP` unset, in a fresh process per run. CPU is user + sys
from `/usr/bin/time -p`. There were 9 rounds, interleaved and rotated, with round 0 discarded.
The run took 08:21:30Z–08:28:39Z. Harness and readings: `raw-harness-lane036.sh.txt`,
`raw-out-lane036.tsv`.

| figure | value |
|---|---|
| base CPU median | 37.67 s |
| tip − base, median of 8 paired deltas | **+0.130 s (+0.35 %)**, sign 5/8 |
| null − base, median of 8 paired deltas | +0.125 s (+0.34 %), sign 5/8, **admissible** (≤ 1.5 %, sign at chance) |
| harness errors | 0 of 27 runs non-zero |
| new test files | 0, so no floor to subtract; 0 spawns |

**`N8-LANE`: MET, +130 ms net against ≤ 650 ms.** The tip cannot be told apart from the null.
The magnitude has low confidence under this load. The verdict against 650 ms does not.

`NFR-003`: the count form holds by construction and by `A4`: one derive, and one `toSan` per
listed move with the list supplied. No wall-clock reading was taken. That reading belongs in
`plans/nfr-catalog.md`, which is fenced from this hop.
