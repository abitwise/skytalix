---
id: 20261011T220201Z-software-engineer-observation-abc152-weakened-rearmed-census-130fe00c
kind: observation
by: software-engineer
at: 2026-10-11T22:02:01Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-084
  - ADR-0042
  - QE-152-h
  - RISK-ABC152-PUZZLE-SPY
  - src/puzzle-suite.test.ts
  - 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
  - 20261011T212237Z-qe-e2e-observation-abc152-gap-register-8bfb6cb5
supersedes:
---

# SE `ABC-152` commit 1 (`476fdde0`, `QE-152-h`): weakened is red on the gate row at 15/58 with A3 green; plant (a) flips it; the census finds exactly one (iv)

This note is hand-authored and unsealed. Every reading below was run in the worktree at `476fdde0` unless it says
otherwise. **No timing was read.** The `PUZZLES` line prints a `wall`; it is cut from every quote here.

## The change (ruling 8, exactly)

- `import { evaluate } from "./evaluate.ts";` after the `./engine.ts` type import. `npx biome check --write`: no
  fixes.
- `vi.mock("./evaluate.ts", { spy: true });` after the imports, before `const MODE`.
- The four-line `vi.doMock` block in `engineUnderTest()` becomes `vi.mocked(evaluate).mockImplementation(() => 0);`.
- The `return (await import("./engine.ts")).chooseMove;` line is unchanged. **No reset, no `finally`.**
- Nothing else: the header, every `expect(`, and the baseline file are untouched. `expect(` count: **45 → 45**.

## Readings

| run | exit | rows | the reading |
|---|---|---|---|
| `PUZZLE_DEEP=weakened npx vitest run src/puzzle-suite.test.ts` | 1 | **1 failed / 13 passed** | the failed row is **the gate row**, `the gate: solved >= the recorded baseline`: `AssertionError: expected 15 to be greater than or equal to 54`. `PUZZLES weakened (evaluate = 0): solved 15/58, baseline 54/58`. A3 (`the weakened engine solves FEWER than the baseline`) is **✓** (verbose reporter). |
| plant (a): the `mockImplementation` line deleted, in a scratch copy outside the repository (`git archive HEAD` + the edited file + an APFS clone of `node_modules`), same command | 1 | 1 failed / 13 passed | `solved 54/58`. The gate row is **✓**. A3 is **×**: `AssertionError: expected 54 to be less than 54` |
| plant (b) | — | — | **"no leak reader"**. Under `weakened` the only rows after the memoized `gatingRun()` are the gate row and A3, and both read the memoized result (`src/puzzle-suite.test.ts`, the `describe` after `gatingRun`; the `MODE === "1"` rows are not defined under `weakened`) |
| `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts` | 0 | **18 passed** | with `--silent=false`: `PUZZLES shipped: solved 54/58, baseline 54/58`; **no `NEWLY-` line** (count 0) |
| `npx vitest run src/puzzle-suite.test.ts` (default) | 0 | **12 passed** | — |
| `PUZZLE_DEEP=1 npx vitest run` (the full lane) | 0 | **56 files, 1747 passed** | `V8`'s count |

- 15 is base 3.2.7's weakened count, so it is the reach proof that ruling 8 asks for. **No STOP:** the count is
  15/58.
- The weakened reading was re-run at the tip `49997a87`: the same reading (exit 1, 1 failed / 13 passed, the gate
  row, 15/58).
- `vitest 4.1` hides stdout of passing tests by default. So the `PUZZLE_DEEP=1` count line was read with
  `--silent=false`. The default-reporter run printed only the counts.

## The census (ruling 8)

- **File universe:** `npx vitest list --filesOnly` at the worktree root gives 56 paths, the lane's
  (`node tools/grugops/lane-inventory.js`: "collects 56 test files; git tracks 56", exit 0). The list is in
  `probe/census-paths-56.txt`.
- **Step 1** (`grep -nE 'process[.]env|[.](runIf|skipIf)[(]' <paths>`): 27 lines in 16 files. No `runIf` or
  `skipIf` exists.
- **Step 2** (`grep -nE 'vi[.](mock|doMock|unmock|doUnmock|resetModules|importActual|importMock|spyOn)[(]|importOriginal|import[(]' <paths>`):
  103 lines in 23 files.
- Raw output: `probe/census-step*-476fdde0.txt`.
- **Commit 1 touches only `src/puzzle-suite.test.ts`.** So every other file reads the same at `88009d0b`.
  `puzzle-suite` is given at both commits.

**Gate regions.** These are the step-1 lines that gate rows, with their regions at `476fdde0`:

| file | gate | region |
|---|---|---|
| `src/cli.real-engine.test.ts` | `:40` `CLI_DEEP` | no step-2 hit in the file |
| `src/engine.test.ts` | `:73` `ENGINE_DEEP` | no step-2 hit in the file |
| `src/ladder.test.ts` | `:45` `LADDER_DEEP` | no step-2 hit in the file |
| `src/perft.test.ts` | `:66` `PERFT_DEEP` | no step-2 hit in the file |
| `src/quiescence.test.ts` | `:59` `SEARCH_DEEP` | no step-2 hit in the file |
| `src/search.test.ts` | `:114` `SEARCH_DEEP` | no step-2 hit in the file |
| `src/zobrist.test.ts` | `:339` `ZOBRIST_DEEP` | no step-2 hit in the file |
| `src/levels.test.ts` | `:68` `ENGINE_DEEP` | `if (RUN_DEEP)` 466–592 |
| `src/line-input.test.ts` | `:107` `INPUT_DEEP` | `if (RUN_DEEP)` 820–943 |
| `src/puzzle-suite.test.ts` | `:41` `PUZZLE_DEEP` (`:38` at `88009d0b`) | `if (MODE === "1" \|\| MODE === "weakened")` 364–473; `weakened` only: 371–373 and 467– |
| `src/search.ordering.test.ts` | `:38` `SEARCH_DEEP` | 326 (row-level `continue`), 401–415, 461–493 |
| `src/search.pvs-lmr.test.ts` | `:59` `SEARCH_DEEP`, `:60` `ENGINE_DEEP` | blocks at 232, 524, 617, 638, 669 and 688 |
| `src/transposition.test.ts` | `:56` `SEARCH_DEEP`, `:57` `ENGINE_DEEP` | blocks at 189, 327, 397, 449 and 531 (search); 637–682 (engine) |
| `src/cli.test.ts` | `:3415` `VITEST_MAX_WORKERS` | `if (raw)` 3416–3421: gates two `expect`s inside one default row, not rows. No step-2 hit inside |
| `src/glyph-mode.test.ts` | `:43`, `:54-55`, `:64-65` | they save and restore locale variables; they gate no row. `:7`, `:11`, `:13` and `:192` are comments |
| `src/glyph-mode.nfr.test.ts` | `:5`, `:91` | comments; they gate no row |

**Step-2 hits inside a gate region, classified:**

| file:line | API | lane | class | reason |
|---|---|---|---|---|
| `src/puzzle-suite.test.ts:368-374` at `88009d0b` (`:369` `vi.doMock`, `:370` `importOriginal`, `:374` `import(`); **`:371-374` at `476fdde0`** (`:372` `vi.mocked(evaluate).mockImplementation`, `:374` `import(`) | `vi.doMock` + `importOriginal` + dynamic `import(` → now `mockImplementation` on the file-top `{ spy: true }` automock + `import(` | `PUZZLE_DEEP=weakened` | **(iv)** | it is a mock mechanism that runs only under `weakened`. It is group 4's one member, now armed in R2's form. Its plant is plant (a) above: red as A3, 54/58 |
| `src/levels.test.ts:468` | `import(` `./evaluate.mirror-corpus.ts` | `ENGINE_DEEP=1` | (iii) | The graph is `evaluate.mirror-corpus.ts` → `apply`, `fen`, `legal`, `position` (and `moves`, transitively). `levels` mocks only `./engine.ts` (`:52`). |
| `src/levels.test.ts:469` | `import(` `./puzzle-corpus.ts` | `ENGINE_DEEP=1` | (iii) | `puzzle-corpus.ts` has no runtime import. The graph is itself. |
| `src/transposition.test.ts:650-651` | `import(` | `ENGINE_DEEP=1` | not a mock site | The text sits in a template-literal script that a `spawnSync` child runs (`--input-type=module -e`). Read as a site, it would be (iii): the child's graph holds no mock at all. |

**Step-2 hits in gate-carrying files that sit outside every gate region.** These are recorded, not classified.
They run in the default lane too:

- `src/puzzle-suite.test.ts:39`: the new file-top `vi.mock("./evaluate.ts", { spy: true })`.
- `src/levels.test.ts:52-53`, `src/search.ordering.test.ts:47-48`, `src/search.pvs-lmr.test.ts:84-85` and
  `src/transposition.test.ts:68-69`: file-top factory mocks.
- `src/cli.test.ts:53`: a file-top `{ spy: true }`. `:3402` and `:3427` are `import("../vitest.config.ts")` in
  default rows. `:1713`, `:1852` and `:1854` are text: a string literal and comments.
- `src/line-input.test.ts:531-534`: `vi.spyOn` on `console`, `process.stdout` and `process.stderr`. `:45` is a
  comment.
- `src/search.ordering.test.ts:524` and `:529`: `vi.spyOn(KillerTable.prototype, …)` in the default `A6` describe.
- **The ruling expects these `spyOn`s, in `line-input` and `search.ordering`, to be (ii).** They are outside every
  gate region at `476fdde0`. Were they counted, they would be (ii): object and prototype spies, not
  module-namespace spies.

**Result:** **one (iv)**, `puzzle-suite.test.ts:368-374` (at `88009d0b`). **No second (iv), so no STOP.** This
matches the Architect's read: seven files carry both a gate and a mock API. Two more files, `glyph-mode` and
`glyph-mode.nfr`, match step 1 only through comments or locale save/restore, and those gate no row.
