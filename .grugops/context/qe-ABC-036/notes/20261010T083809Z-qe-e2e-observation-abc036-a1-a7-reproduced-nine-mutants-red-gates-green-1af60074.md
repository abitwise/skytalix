---
id: 20261010T083809Z-qe-e2e-observation-abc036-a1-a7-reproduced-nine-mutants-red-gates-green-1af60074
kind: observation
by: qe-e2e
at: 2026-10-10T08:38:09Z
verified_by:
confidence: high
refs:
  - ABC-036
  - ABC-035
  - EPIC-003
  - N8-LANE
  - src/command-input.ts
  - src/command-input.test.ts
  - .grugops/queue/claimed/qe-ABC-036/qe-ABC-036.md
  - 20261010T082218Z-software-engineer-decision-abc036-count-first-code-unit-sort-eighth-row-daa1392b
  - 20261010T083105Z-software-engineer-observation-abc036-a1-a7-met-mutants-red-gates-green-n8lane-605aa727
  - 20261010T083120Z-software-engineer-claim-abc036-built-owed-qe-three-of-twenty-visible-83696dfe
supersedes:
---

# `ABC-036` QE evidence: A1–A7 reproduced, nine QE mutants red, gates green

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `qe-ABC-036`. QE worked in the
Engineer's worktree, branch `grugops/ABC-036-moves-command`. The review tip was `a261966` (code
`6aad5c9`, merge-base `85eb80c`). QE's rows are `3f61b33`. Machine: Apple M3. Load1 was 8 to 32
(other hops running). Raw files are beside this note (`raw-*`).

## Criteria, read against the page

| # | QE reading | result |
|---|---|---|
| `A1` | The six FENs in the test match `src/perft.test.ts` `PERFT_SUITE` byte for byte, and so do their depth-1 counts (20, 48, 14, 6, 44, 46). The criterion asks for the start position and three mid-games, and six positions exceed that. The stated count is read from item 0 by regex, never from the listing's length. QE probe: 1 in check (`Kxg2`), 28 with promotion and castling, 0 at mate and stalemate | **MET** |
| `A2` | The listing is set-equal to the strings the `toSan` spy RETURNED. `toSan`'s second arguments equal the derived array in order, and the listing is strictly ascending. "Ascending SAN-string order" is read as code-unit order, which is JS's default string order. The page does not contradict it (see the gap note). Probe order: `Kd1 … O-O O-O-O Ra2 … Rh8+ a8=B a8=N a8=Q+ a8=R+` | **MET** |
| `A3` | Start position, delivered panels, Unicode: `(+17 more)`, N > 0, stated total 20, and the count is visible. QE added the same row for **ASCII**: identical region (W = 21, `legal moves: 20 Na3` / `Nc3 Nf3 (+17 more)`). Neither the width nor N's value is asserted (test note 2) | **MET** |
| `A4` | One `legalMoves` per line on the prompt position. `toSan` is called `legal.length` times, each with that position and the same array (`toBe`), on all six positions. Neither parser is called. On the production path (no seam) the module-level `legalMoves` count is exactly 1 | **MET** |
| `A5` | Pure function at ply 4: FEN byte-identical, 4 moves, 0 `gameStatusOf`, 0 `repetitionCounts`. Through the merged loop: 2 renders, frame 2 equals the listing, and exactly 1 `gameStatusOf` (the loop's own, before the first frame). QE mutant QM4 (a `gameStatusOf` on the `moves` path) reds both rows | **MET** |
| `A6` | `git diff --numstat 85eb80c a261966 -- src`: `237 13 src/command-input.test.ts` and `47 11 src/command-input.ts` only. `src/frame.ts`, `src/move-input.ts` and `src/turn-loop.ts` are byte-identical (`git diff --quiet` against the wave tip). Suite green, skip 0. `PERFT_DEEP=1` re-run by QE: **32/32**, exit 0, 53.7 s | **MET** |
| `A7` | The `ABC-035 A7` rows are unedited (the diff shows no hunk in them) and green. Region: `help board quit claim` / `resign new undo moves`, 21/21 each. QE's ASCII row confirms the same 21/21 with no marker | **MET** |

## Gates (re-run by QE)

| step | at `a261966` | at `3f61b33` (with QE rows) |
|---|---|---|
| `npm run lint` | exit 0, 97 files | exit 0, 97 files, no fixes |
| `npm run typecheck` | exit 0 | exit 0 |
| `npm run build` | exit 0 | exit 0 |
| `npm test` | exit 0, 50 files, 1573 passed | exit 0, 50 files, **1577 passed** |
| skip count (`--reporter=json`, pending + todo) | 0 | 0 |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 | `No findings.`, exit 0 |
| `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | 32/32, exit 0 | not re-run (QE changed a test file only, not `src/perft*`) |

`PUZZLE_DEEP` was **not triggered**. The diff touches no file on the trigger list (`src/engine.ts`,
`src/search*.ts`, `src/evaluate*.ts`, `src/quiescence.ts`, `src/transposition.ts`, move
ordering). Its only `src/` files are `src/command-input.ts` and its test.

## QE's own mutants

Each was planted in `src/command-input.ts` by exact string replacement (`raw-mutate.mjs.txt`). The
file was run and then reverted with `git checkout`. Afterwards `git diff --quiet HEAD --
src/command-input.ts` held. Output: `raw-out-mutants.txt`.

| id | mutant | before QE rows | after QE rows (188) | killed by |
|---|---|---|---|---|
| QM1 | bypass the seam: module-level `legalMoves` in place of `deps.legalMoves` | — | **red**, 14 | `A4` seam rows (6), `A2` (6, no derive result) |
| QM2 | descending sort | — | **red**, 7 | `A2` (6 + pinned order) |
| QM3 | drop the first listed move (count still `legal.length`) | — | **red**, 7 | `A2` length and set checks |
| QM4 | `gameStatusOf(history)` on the `moves` path | — | **red**, 3 | `A5` pure, `A5` loop, `A4` production row |
| QM5 | `moves` moved to table index 3 | — | **red**, 1 | the "EIGHTH row" row ONLY. `help` still fits at both frames (see gap note) |
| QM6 | `help` appends a foreign token `pager` | — | **red**, 5 | `ABC-035 A4` length row, `ABC-035 A7`, `ABC-046`/`ABC-102` help rows, QE ASCII row. The retired negative row is not missed |
| QM7 | `moves` keeps an armed `quit` | **green 184/184 (survived)** | **red**, 1 | QE row quit / moves / quit |
| QM8 | zero legal moves answers `["no legal moves"]` | **green 184/184 (survived)** | **red**, 2 | QE rows at checkmate and stalemate |
| QM9 | strip `+`/`#` from the listing | — | **red**, 2 | `A2` at position-3 and position-6 (the positions with checking moves) |

All nine are red with the QE rows in place. QM7 and QM8 show that two of the three cases the build
hop left unguarded were real holes, and that the new rows close them.

## Tests added (commit `3f61b33`, +65 lines, same file, no new file)

`describe("ABC-036 QE — zero legal moves, an armed quit, and the ASCII glyph set")`, 4 rows:
checkmate (fool's mate) and stalemate, each answering `["legal moves: 0"]` with one derive and no
`toSan`; quit / moves / quit; and A3 plus A7 in ASCII at the start position. Wall time 0.98 ms
total for the four rows. No new test file, so no 160 ms floor applies. The Engineer's `N8-LANE`
reading (+130 ms net against 650) was not re-measured. QE's rows add about 1 ms of wall time, not
measured on the CPU instrument.
