---
id: 20261030T032110Z-qe-e2e-observation-48d23dbc
kind: observation
by: qe-e2e
at: 2026-10-30T03:21:10Z
verified_by: 
confidence: high (counts as run)
refs:
  - ABC-240
  - EPIC-010
  - EPIC-008
  - qe-ABC-240/20261030T013846Z-qe-e2e-decision-e7b79773
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - se-ABC-240/20261030T013022Z-software-engineer-decision-626a3c3a
  - se-ABC-240/20261030T013022Z-software-engineer-observation-79fe0aa4
  - se-ABC-240/20261030T013022Z-software-engineer-observation-ba9b4b1f
  - se-ABC-240/20261030T013022Z-software-engineer-observation-78815fa3
  - grugops/qe-ABC-240
  - 0e0ef856
  - 220ab978
  - 69e19fc4
  - 7913499d
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - src/transposition.test.ts
  - src/levels.ts
  - .grugops/test-skips.md
supersedes: 
seal: sha256:4359357b5641316c3ba8efae35fc9c31980a5bfb947f0ecc1d414d2eb007642d
---

# qe-ABC-240 gates at the tip 220ab978: mandatory four green, npm test 2 148/2 148, skips 0, G8 8.37 s; 22 deep-lane files 743/743; G1 54/58 rows equal; G7, G9 green

QE/E2E, task `qe-ABC-240`, in the QE worktree on `grugops/qe-ABC-240` (src = `220ab978` = `7913499d`), after
`npm ci --ignore-scripts`, Node v26.12.1. Raw: `raw/gates/`, `raw/deep/`.

## Mandatory
- `npm run lint` exit 0 (129 files, no fixes). `npm run typecheck` exit 0. `npm run build` exit 0.
- `npm test` exit 0: 63 files, **2 148 / 2 148** (base 2 139 + 9 new rows, as the SE's arithmetic says).
- **Test integrity:** `.test-results/last-run.json` pending + todo = **0**, failed 0.
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- **G8:** `npm test` wall **8.37 s** (vitest duration 8.03 s), host clear before and after (0 `cutechess-cli`, 0
  foreign vitest), load1 ≤ 1.2. Bar ≤ 10 s at load1 ≤ 8: **MET**.

## Deep lanes, one file at a time, heap 400 (`raw/scripts/deep.sh`), 03:01Z–03:17Z
| env | file: tests |
|---|---|
| `ENGINE_DEEP=1` | legal 40, moves 38, gameend 47, gameend.nfr 9, evaluate.pawns 44, transposition 26, engine 60 (136 s), levels 41 (544 s), search.pvs-lmr 21, search.ordering 30, quiescence 34 |
| `SEARCH_DEEP=1` | search 57, search.null-move 44, search.ordering 43, quiescence 41, search.pvs-lmr 29, transposition 40 |
| others | `PERFT_DEEP` perft 32, `PUZZLE_DEEP` puzzle-suite 18, `ZOBRIST_DEEP` zobrist 33, `CLI_DEEP` cli.real-engine 11, `UCI_DEEP` uci.real-engine 5 |

All 22 files exit 0: **743 / 743**. Not run, as pre-registered: `LADDER_DEEP` (self-play games) and `INPUT_DEEP`.

## EPIC-008 gates
- **G1 MET:** `PUZZLE_DEEP=1` solved **54/58**, baseline 54/58. All 58 rows' move, score, depth and nodes equal to
  base by `se-ABC-235/raw/g1.mjs`: both builds sha256 `ade68870…0d81`, the SE's.
- **G4 MET:** A1 (identity note) plus the deep lanes above.
- **G5 MET:** the `ENGINE_DEEP` engine and levels lanes green; the 110 timed searches max `elapsedMs` 3 001, wall
  ≤ 3 001.8 ms (timing note).
- **G6 MET:** 8 = 8 and 10 = 10, minimum 8 (timing note).
- **G7 MET:** both scratches are fixed `Float64Array(256)` module constants (2 048 B each, read in the code), counted in
  `NFR-009` (a)'s byte sum in `src/transposition.test.ts` and asserted at 2 048 each. (b)/(c) growth green under
  `ENGINE_DEEP=1` and `SEARCH_DEEP=1` transposition (26/26, 40/40). Growth from the scratches is 0: they exist at module load.
- **G9 MET:** `git diff 0e0ef856 220ab978 -- src/levels.ts` empty.
- **G2, G3:** not owed (`src/evaluate.ts` diff empty). G3's rows are green in `npm test` anyway.
- **Perft:** not owed (`moves.ts` and `legal.ts` untouched). `PERFT_DEEP` 32/32 anyway.

## Tool route and re-runs, disclosed
- Linters and the four mandatory gates ran only through `npm run …`. The deep lanes, the plant and two verbose
  re-prints ran through `./node_modules/.bin/vitest`, because `npm test` pins heap 128 and a 60 s bound. **No bare
  `npx` ran in this task.**
- The re-prints, for evidence only: the two `ENGINE_DEEP` walk files once with `--reporter=verbose`, and the puzzle
  lane twice to print its count. Both green.
