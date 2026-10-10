---
id: 20261010T110929Z-qe-e2e-observation-abc126-readings-oracle-deep-lanes-mutants-f7db18ad
kind: observation
by: qe-e2e
at: 2026-10-10T11:09:29Z
verified_by:
confidence: high
refs:
  - ABC-126
  - ABC-079
  - ABC-084
  - ABC-127
  - ABC-010
  - ADR-0033
  - RISK-003
  - N8-LANE
  - src/puzzle-corpus.ts
  - src/quiescence.test.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - 20261010T105616Z-software-engineer-decision-abc126-four-fens-chosen-assertion-carve-out-7c41a2e9
  - 20261010T105616Z-software-engineer-observation-abc126-gates-red-first-margins-puzzle-lane-b3d870e5
  - 20261010T110929Z-qe-e2e-decision-abc126-verdict-pass-with-gaps-0e70ef4f
supersedes:
---

# `ABC-126` QE readings at `efcda60d`: the independent oracle agrees on all four FENs; `PUZZLE_DEEP=1` 58/62 ×3, `cmp`-identical, no `NEWLY` line; 11 plant runs: 6 killed, 2 expected survivors (M5, equivalent M11), 2 gap survivors (M7 on two lanes, M9)

Hand-authored and unsealed (degraded posture, `AGENTS.md`). Review tip `efcda60d` on
`grugops/ABC-126-corpus-repairs`, base `d6aceeb5`. Apple M3, Node v26.11.0. BA/PM and Architect hops
ran in parallel, so load1 is given beside every timed reading. Raw files and scripts are in `../probe/`
(`RUN.txt` lists them). Every plant was made in a fresh `git archive` copy in QE's scratchpad. The
worktree's `src/` was never edited. `git diff --stat d6aceeb5 246ddfc7 -- src` is empty, so the
wave tip has not moved `src/` under this branch.

## The oracle: no engine code, and no project code at all

`probe/oracle.mjs` has its own FEN grammar and applies `ADR-0033`'s six rules in decision 3's order:
non-string, clock round-trip, pawns on rank 1/8, castling rights, en passant, and the side not to
move in check. It has its own legal-move generator and attack test. It re-implements both material
oracles from their semantics:
- `ABC-084`'s raw probe: depth 4 plus capture-only quiescence;
- `ABC-127` `A2`: 3 plies, then 8 capture plies with evasions in check.

It reads `src/puzzle-corpus.ts` as text and never imports it.

- **Generator check:** perft is exact on 5 of 5 reference positions (start d4, Kiwipete d3, pos3 d5,
  pos4 d4, pos5 d3; `oracle-perft.txt`).
- **Red first, on the base:** the scan flags exactly four rows. Both pair rows are `inCheck=true`;
  "pin" fails with `pawn on rank 8 (h8)`; "discovered check" fails with
  `side not to move (black) is in check` (`oracle-base-scan.txt`).
- **Tip:** all 62 rows read 0 with the side to move in check and 0 `ADR-0033` rejections.

| row (tip) | in check | legal / non-king | `ADR-0033` | capture legal | oracle reading |
|---|---|---|---|---|---|
| R takes a bishop a pawn defends `…/R4K2 w` | false | 12 / 8 | accepted | yes | `a1a5` −1 against best other +1: **loses 2 pawns** |
| mirror `r4k2/… b` | false | 12 / 8 | accepted | yes | `a8a4` −1 against +1: **loses 2** |
| pin: Re1 `4k3/7p/…` | false | 14 / 10 | accepted | — | stand −3, best +1, next −4. Keys **`[a1e1]`**, gain **+4**, margin 5. Both variants agree |
| discovered check `3q1k2/…` | false | 26 / 23 | accepted | — | stand +1, best +5, next +1. Keys **`[d4c5, d4g7]`**, gain **+4**, margin 4. Both variants agree |

The `accept` set equals the oracle's strictly-best set in both rows and under both variants, and each
`source` `+N` equals the oracle gain (`oracle-tip-focus.txt`). The ticket's own instrument,
`recut-abc010/probe/rules-only.mts`, prints `accepted` for the four new FENs. On the two shipped
`A7` FENs it prints `pawn on rank 8 (h8)` and `side not to move (black) is in check`
(`static-checks.txt`).

## `A3`, engine side (`a3-engine.mts`, load1 4.8)

| row | `search` d1 | d3 | bare leaf d1 | losing @d3 | best other @d3 | margin |
|---|---|---|---|---|---|---|
| R takes a bishop a pawn defends | `f1g1` | `a1b1` (105) | `a1a5` | −80 | 105 | **185** |
| mirror | `f8g8` | `a8b8` (105) | `a8a4` | −80 | 105 | **185** |

On all 24 rows the losing capture is chosen 0/24 at d1 and 0/24 at d3, and the bare leaf takes it
24/24. These match the Engineer's `…b3d870e5` exactly.

## Gates on the tip (`gates.txt`, 11:02:49Z–11:03:09Z, load1 4.65 → 7.61)

- lint exit 0 (98 files); typecheck exit 0; build exit 0.
- `npm test` exit 0: **51 files / 1581 passed**, 7.81 s.
- Skip count **0** (JSON reporter: 1581 total, 0 failed).
- `test-skip-integrity.js … --skip-count 0`: `No findings.`, exit 0.
- `lane-inventory.js`: "51 test files; git tracks 51", `No findings.`, exit 0.

## Deep lanes (worktree, tip, run in sequence)

| run | start (load1) | gating | oracle m3 / wm | real | solved | rows | `NEWLY-*` | exit |
|---|---|---|---|---|---|---|---|---|
| `PUZZLE_DEEP=1` #1 | 11:03:16Z (7.48) | 24.17 s | 7.93 / 4.97 s | 38.07 s | 58/62 | 62 | none | 0 |
| `PUZZLE_DEEP=1` #2 | 11:03:54Z (6.56) | 22.04 s | 7.20 / 4.88 s | 35.00 s | 58/62 | 62 | none | 0 |
| `PUZZLE_DEEP=1` #3 | 11:04:29Z (5.67) | 25.13 s | 9.58 / 6.53 s | 42.47 s | 58/62 | 62 | none | 0 |
| `PUZZLE_DEEP=weakened` | 11:05:41Z (7.20) | 23.93 s | — | 25.30 s | **19/62** | — | — | **1** (by design) |
| `SEARCH_DEEP=1` quiescence | 11:06:06Z (7.53) | — | — | 3.65 s | 37 passed | — | — | 0 |

- **Per-row output:** `rows-1.txt`, `rows-2.txt` and `rows-3.txt` are `cmp`-identical (move, depth,
  nodes, name). The four `MISSED` names equal the baseline's `unsolved` exactly.
- **The four changed rows**, identical in all three runs: `SOLVED a1e1 d7` (pin), `SOLVED d4c5 d6`
  (discovered check), `SOLVED f1g1 d6` (pair), `SOLVED f8g8 d7` (mirror).
- **Totals:** 17 passed each run. Total 62 = baseline 62, and solved 58 ≥ 58. Budget 25, step 1.
- **Quiescence deep line:** "A1 depth 3: losing capture chosen 0/24 with quiescence, 0/24 without".
- Every reading is under `ABC-127` `A7`'s 45 s gating / 90 s lane. Those caps are never asserted.

## Static (`static-checks.txt`)

- **`A5`:** `git diff --numstat d6aceeb5...efcda60d -- src` lists exactly three files:
  `src/puzzle-corpus.ts` 12/4, `src/puzzle-suite.test.ts` 1/4, `src/quiescence.test.ts` 4/2.
- **Baseline:** 0 commits on the branch touch `src/puzzle-suite.baseline.json`, and its diff is empty.
- **Names, kinds and losing moves:** the name list and the `losing` list hash identically on base
  and tip. Counts: `win-material` 16 = 16, `mate-in-3` 12 = 12, hanging rows 24 = 24. Outside the
  four rows, only comment lines are added.
- **"Exactly 24":** asserted by the puzzle-suite row "ABC-079 still reads exactly those 24"
  (`toBe(24)`), which is green.

## Mutants (fresh archive copy of the tip; one plant each)

| # | plant | lane | result |
|---|---|---|---|
| M1 | pair row back to `…/R3K3 w` | default quiescence + puzzle-suite | **killed**, 2 rows red: both name only "R takes a bishop a pawn defends" |
| M2 | mirror back to `r3k3/… b` | same | **killed**, 2 rows red: mirror only |
| M3 | both back | same | **killed**, 2 rows red; the hard `expect` stops at the first row |
| M4 | an unrelated hanging row put in check (`…/3RK3 w`, Nd3+) | same | **killed** in both files: the assertion is general, not keyed to the pair |
| M5 | carve-out restored, with the shipped pair | puzzle-suite | **survives (expected):** removing the carve-out is what makes `A6` catch the pair |
| M7a | both `A7` rows back to their shipped FEN, accept and source | default | **survives** → gap `QE-126-a` |
| M7b | same | `PUZZLE_DEEP=1`, the `A2` win-material row | **survives** → gap `QE-126-a` |
| M8 | discovered check, new FEN with the old accept set | same deep row | **killed** (`expected [d4c5,d4g7] to deeply equal [d4a1,d4b2,d4c3,d4e5]`) |
| M9 | discovered check, `source` `+4` → `+6` | same deep row | **survives** → gap `QE-126-b` |
| M10 | discovered check, accept `[d4c5]` only | same deep row | **killed** |
| M11 | pin, pawn h7 → h6 | same deep row | survives, **equivalent**: same oracle keys and gain |

Plants M1–M5 were also run on the default lane of each file. Load1 is on each `mutant-*.txt` header.
