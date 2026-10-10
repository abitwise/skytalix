---
id: 20261010T105616Z-software-engineer-observation-abc126-gates-red-first-margins-puzzle-lane-b3d870e5
kind: observation
by: software-engineer
at: 2026-10-10T10:56:16Z
verified_by:
confidence: high
refs:
  - ABC-126
  - ABC-079
  - ABC-084
  - ABC-127
  - ADR-0033
  - N8-LANE
  - RISK-003
  - src/puzzle-corpus.ts
  - src/quiescence.test.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - 20261010T105616Z-software-engineer-decision-abc126-four-fens-chosen-assertion-carve-out-7c41a2e9
supersedes:
---

# `ABC-126` readings: `A1`–`A7` met; red first on exactly the pair; 0/24 in check; margins 185 cp; `PUZZLE_DEEP=1` 58/62 ×3, no `NEWLY-MISSED`; gates green

Hand-authored and unsealed. Worktree `.claude/worktrees/ABC-126-corpus-repairs`, branch
`grugops/ABC-126-corpus-repairs`, base `d6aceeb5`, code `d10ffeff`. Apple M3, Node v26.11.0. Other
agents' hops were running; load1 is beside every reading. Raw files: `../probe/`.

## Red first

| step | quiescence `A1` row | puzzle-suite `A6` row | raw |
|---|---|---|---|
| shipped pair, assertion added / carve-out removed | red: "R takes a bishop a pawn defends" | red: same row | `red-a1-step0.txt`, `red-a6-step0.txt` (load1 9–10) |
| first row re-found, mirror shipped | red: "mirror: r takes a bishop a pawn defends" only | red: mirror only | `red-step1.txt` (load1 5.1) |
| both re-found | green | green | `green-step2.txt` (load1 5.1) |

`A7` red on the shipped FENs (`recut-abc010/probe/rules-only.mts`): `pawn on rank 8 (h8)` and
`side not to move (black) is in check` — `red-a7-rules-shipped.txt` (load1 9.3).

## The four rows on the final tree

Pair (`pair-probe.mts`, `pair-probe.corpus.out.txt`, load1 5.8; candidates before the edit:
`pair-probe.candidates.out.txt`):

| row | in check | legal / non-king | `ADR-0033` | d1 | bare d1 | d3 | losing @d3 | best other @d3 | margin |
|---|---|---|---|---|---|---|---|---|---|
| R takes a bishop a pawn defends | false | 12 / 8 | accepted | `f1g1` | `a1a5` | `a1b1` | −80 | 105 | **185** |
| mirror | false | 12 / 8 | accepted | `f8g8` | `a8a4` | `a8b8` | −80 | 105 | **185** |
| (shipped pair, for the record) | true | 5 / 1 | accepted | `e1f1` | `a1a5` | `e1f1` | −100 | 85 | 185 |

All 24 rows: 0 in check, 0 `ADR-0033` rejections, losing chosen 0/24 at d1 and 0/24 at d3, bare
leaf 24/24 at d1, min non-king moves 4, min margin 160 (`pair-probe.corpus.summary.txt`).

`A7` (`a7-oracle-rules.out.txt`, load1 6.6; `ABC-084`'s `raw-probe-oracle.mts.txt`):

| row | FEN | stand / best / next | keys | gain | rules | stm in check / legal |
|---|---|---|---|---|---|---|
| pin: Re1 | `4k3/7p/8/4q3/8/1P6/P2K4/R7 w` | −3 / 1 / −4 | `[a1e1]` | +4 | accepted | false / 14 |
| discovered check | `3q1k2/8/8/8/3B4/8/6PP/3R2K1 w` | 1 / 5 / 1 | `[d4g7, d4c5]` | +4 | accepted | false / 26 |

## Deep lanes

- `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`: exit 0, **37 passed**, 2.31 s; "A1 depth 3:
  losing capture chosen 0/24 with quiescence, 0/24 without". 10:53:43Z, load1 10.2
  (`search-deep-quiescence.txt`).
- `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`, three sequential processes
  (`puzzle-deep-process{1,2,3}.txt`):

| process | start (load1) | gating | lane real | solved | oracle mate-in-3 / win-material | `NEWLY-*` |
|---|---|---|---|---|---|---|
| 1 | 10:53:52Z (9.8) | 22.26 s | 35.13 s | 58/62 | 7.23 s / 4.76 s (16 rows) | none |
| 2 | 10:54:27Z (8.5) | 21.37 s | 34.14 s | 58/62 | 6.98 s / 4.74 s | none |
| 3 | 10:55:01Z (6.7) | 21.10 s | 33.78 s | 58/62 | 6.99 s / 4.71 s | none |

  All 17 passed, exit 0 each. The four rows, identical in all three: `SOLVED a1e1 d7` (pin),
  `SOLVED d4c5 d6` (discovered check), `SOLVED f1g1 d6` (pair), `SOLVED f8g8 d7` (mirror). The four
  `MISSED` rows are exactly the baseline's `unsolved`.

## Gates (`gates.txt`, 10:53:03Z–10:53:13Z, load1 5.4 → 7.8)

lint exit 0 (98 files); typecheck exit 0; build exit 0; `npm test` exit 0, **51 files / 1581
passed**, 6.93 s; skip count 0; `test-skip-integrity.js … --skip-count 0` → `No findings.`;
`lane-inventory.js` → "51 test files; git tracks 51", `No findings.`

## `N8-LANE` (`n8-lane.txt`, load1 10.7)

48 added `isInCheck` calls. Measured: 62 000 calls in 57.1 ms CPU, so ~0.9 µs each and ~0.04 ms
added. The two whole rows read 2.0–2.6 ms and 9.0–10.5 ms. No new test file. Far under 650 ms.

## `A5`

`git diff --numstat d6aceeb5...d10ffeff -- src`: `src/puzzle-corpus.ts` 12/4,
`src/puzzle-suite.test.ts` 1/4, `src/quiescence.test.ts` 4/2. Zero production lines (UAT waived by
the standing rule; QE still applies). The baseline file and every trigger-list file are untouched.
