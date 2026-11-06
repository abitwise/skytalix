---
id: 20261106T134724Z-software-engineer-observation-e6cff498
kind: observation
by: software-engineer
at: 2026-11-06T13:47:24Z
verified_by: 
confidence: high
refs:
  - se-ABC-303-main2
  - grugops/ABC-303
  - ABC-303
  - ABC-305
  - ABC-307
  - EPIC-011
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - se-ABC-303-main/20261105T122839Z-software-engineer-observation-bd60978c
  - se-ABC-303-rows/20261105T125756Z-software-engineer-observation-1932d8a5
  - qe-ABC-305/20261106T132438Z-qe-e2e-observation-ab07f1f1
supersedes: 
seal: sha256:0377b2f313ef64d1c449316d3cdcb4b743847b99be41dedb57936b5bffb4647c
---

# se-ABC-303-main2 observation: every gate and lane green at the merged tip `bb0cc134`; 2 734 = 2 710 + 24; 26 bound rows hold

Read at `bb0cc134`, each run under the host lock, one at a time, 13:29:01Z to 13:45:52Z. Every output file was non-empty before it was read. Raw: `.grugops/context/se-ABC-303-main2/raw/`.

**Unchanged production (`proof.txt`).** Filter: every path under `src/` and `data/` not ending `.test.ts`.
- `main`: `572edf13`, `c9ff7ff9` and `38914841` hash one tree listing, `3a8f4ab0305457ba`. 0 paths differ from either base. `572edf13` is included because R1, R2 and A0 were read on it, one merge before the last merge base.
- Branch: `39a5b912`, `80bc0711` and `bb0cc134` hash one listing, `2f552c0276603bc6`. So the tree those counts were read on is the production tree at this tip.
- Against `main`, the bundle's production is `src/engine.ts` and `src/search.ts`, nothing else.
- Config and lockfile, `c9ff7ff9` to `38914841`: 0 paths.

**Gates.** typecheck 0; lint 0; build 0; `npm test` exit 0, 71 files, 2 734 / 2 734; skip capture 0 (2 734 total, 0 failed); `test-skip-integrity` at 0, `No findings.`, exit 0.

**Deep lanes, from each JSON report, 0 failed, 0 skipped, exit 0.**
| lane | passed / total |
|---|---|
| `SEARCH_DEEP` `src/evaluate.passer.test.ts` | 29 / 29 |
| `TUNE_DEEP` `tools/tune/tune.test.ts` | 25 / 25 |
| `ENGINE_DEEP` `src/book.test.ts` | 36 / 36 |
| `ENGINE_DEEP` `tools/grugops/qe-hop-integrity.test.ts` | 36 / 36 |
| `ENGINE_DEEP` `src/uci-session.test.ts` | 270 / 270 |
| `ENGINE_DEEP` `src/levels.test.ts` (Levels) | 58 / 58 |

Each count on the arriving files equals QE's on `ABC-305` (`qe-ABC-305` `…ab07f1f1`), so the bundle added no row to them. `src/cli.test.ts` has no deep lane, by the brief.

**The expected count.** `main` 2 710 + the bundle's 24 = 2 734, read 2 734. The 24 are all in `src/search.bundle.test.ts`, 15 → 39 (`counts.txt`, per file). Also 2 733 before the merge + 1 from `main` (`src/evaluate.passer.test.ts` 21 → 22).
`counts.txt` comes from scratch exports of `38914841`, `c9ff7ff9` and `80bc0711`, which hold no `plans/` or `.grugops/`. There `src/pgn.test.ts` and `tools/grugops/qe-hop-integrity.test.ts` fail at load, exit 1, on all three alike, which is why those columns read 0 and the sums run low. That is the export's artefact, not a red. The gap is 56 = 24 + 32 on `38914841` (2 654 against 2 710) and on `80bc0711` (2 677 against 2 733). The tip's column is the real tree.

**`tools/tune` against the bundle.** The brief expects the bounds to meet the bundle's parameters for the first time. **They do not meet, and could not: the bundle has no evaluation parameter.**
- Every bound row is a linear inequality on `evaluate`. The tool's import closure is `apply`, `moves`, `position`, `evaluate`, `evaluate-params`, `fen`, `legal`, `quiescence`, `see`, `san`, and it reaches neither `src/search.ts` nor `src/engine.ts`. Those ten files differ from `main` in 0 paths, and neither does `tools/tune`.
- A grep for the bundle's names (`countermove`, `moveCount`, `MOVE_COUNT`, `quietBundle`) in `tools/tune/*.ts` and `src/evaluate-params.ts`: 0 lines.
- **The rows, read, not only counted (`bounds-tip.tsv`):** 26 of 26 hold at the tip: 8 king-mobility, 9 pawns, 6 taper, 3 evaluate. Least slack 1 cp, on two rows: the f-pawn on e5 twin at phase 24, and d4 with its neighbour on e3. The same driver on the export of `38914841` gives a byte-identical table.
- In the lane: the FEN source row, "every bound row holds on the table in place", the margin row and both refit rows are named and passed (`tune-rows.tsv`). The bundle's one change to a bound file, `src/evaluate.taper.test.ts`, touches door lists and source pins and no bound row.
- So this green says the merge broke nothing. It does not show the tuner has been exercised against anything of the bundle's.

**Not read here.** `G6` and `NFR-008` were not read: no graded timing. L4 was last read in `se-ABC-303-main` (P3, P4 in `…bd60978c`) and stands by the proof above. No row of tables 1 to 3 was re-graded in this hop; none reads red in what ran. `npm test`'s printed 10.25 s is no reading: a foreign `marketing` vitest was live at about 13:28Z, seen in `ps` and not touched.
