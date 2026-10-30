---
id: 20261030T050005Z-software-engineer-observation-f3c542f4
kind: observation
by: software-engineer
at: 2026-10-30T05:00:05Z
verified_by: 
confidence: high on counts as run; G5 real clock, G6 interleaved runs and A7 smokes are QE's and not run here; scan cost UNKNOWN - verify
refs:
  - se-ABC-230
  - ABC-230
  - EPIC-010
  - EPIC-008
  - ADR-0054
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - RISK-EPIC010-06
  - grugops/ABC-230
  - 2fbcb380
  - .grugops/context/se-ABC-230/raw/deep.txt
supersedes: 
seal: sha256:21e487650b6bdf1927d1a611216706135d6658e90f94f986a32910104c948956
---

# Software Engineer observation, se-ABC-230: the gates as far as an SE runs them, and what QE owes

All results are as they ran in the worktree on `grugops/ABC-230` at `2fbcb380` (the code commit), plain `node` v26.12.1, load1 0.4–1.6. Output of the deep lanes: `raw/deep.txt`.

## Mandatory gates at the code commit
- `npm run lint`: exit 0 (129 files).
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.
- `npm test`: 63 files, 2 178 passed, 0 failed. The base `c0698ddd` has 2 148, so 30 rows were added and none removed.
- **Skip count:** `./node_modules/.bin/vitest run --reporter=json | jq` gives 0. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` reports `No findings.`, exit 0.

## Deep lanes (`raw/deep.sh`, one at a time)
- `ENGINE_DEEP=1` `src/engine.test.ts`: 77/77 (136 s). This includes `ABC-078` `A3`'s full identity sweep (`G4`) and `A1`/`NFR-005` on the real clock.
- `ENGINE_DEEP=1` `src/transposition.test.ts`: 26/26. This includes `NFR-009` growth in a child process (`G7`) and `ABC-081` `A6` unchanged.
- `PUZZLE_DEEP=1` `src/puzzle-suite.test.ts`: 18/18 (`G1`: the baseline holds, with no NEWLY row; the puzzles carry no prior keys).
- `SEARCH_DEEP=1` `src/search.pvs-lmr.test.ts`: 29/29 (the `ADR-0026` bounded oracle). `src/search.null-move.test.ts`: 44/44.
- `UCI_DEEP=1` `src/uci.real-engine.test.ts`: 5/5. `CLI_DEEP=1` `src/cli.real-engine.test.ts`: 11/11. Each is a single real-engine ply through the delivered entry points, not a game.
- `ENGINE_DEEP=1` `src/levels.test.ts`: 44/44 (545 s, real-clock rows).

## The ticket's A6 gates
- **G1:** see the puzzle lane above. The out-of-tree identity also covers every search with no prior keys.
- **G5 (`NFR-004`):** clock reads are byte-equal to base in the identity harness (2 408 `chooseMove`-family rows). The real-clock `NFR-004` read is QE's.
- **G6 (`NFR-005`):** identity covers it. The benchmarks carry no prior keys, and `kiwipete` and `position-6` (and their children) are node-equal and read-equal in the `choose` part. QE runs the 5 interleaved real-clock runs per its rule if it wants them.
- **G7 (`NFR-009`):** the engine holds no copy, and `Budget.prior` borrows the caller's array (≤ 100 keys are read). `ABC-081` `A6`'s one-array rows are green unchanged. The deep growth row is green.
- **G8 (`NFR-008`):** `npm test` vitest Duration 8.10 s, 8.46 s and 8.50 s at load1 0.4–1.6 (bar ≤ 10 s).
- **G9:** `git diff c0698ddd -- src/levels.ts` touches `createLevel`/`blunder` and one import only. The `LEVELS`, `DEFAULT_LEVEL`, `EASIEST_LEVEL` and `HARDEST_LEVEL` lines are unchanged, and `HARD_CEILING_MS` is unchanged in `src/engine.ts`. The file's diff is NOT empty.
- **A6's protected rows,** green and unchanged: `ABC-081` `A6` (import and one-array), the `ADR-0011` licence equality (`src/history-pane.nfr.test.ts`), and every bare-FEN node pin.

## Not run by the SE
- **A7, the smoke pair S-1..S-4** with the repetition-ending count, is QE's. No game was played, and `cutechess-cli` was never started.
- **Cost of the pre-root scan on this host:** `UNKNOWN - verify` (`ADR-0054` decision 8). S-2 reads it.
- **Security (`RISK-EPIC010-06`):** the bound is pinned by `A5` (600 plies → 100 keys). The transient replay list holds one `bigint` per accepted move. Security/NFR reads it at the gate.
- **UAT** is owed (production lines on both surfaces). The QE verdict signs it.
