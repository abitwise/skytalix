---
id: 20261011T222155Z-qe-e2e-observation-abc152-delta-group4-census-9dc4714f
kind: observation
by: qe-e2e
at: 2026-10-11T22:21:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-084
  - ADR-0042
  - QE-152-h
  - QE-152-j
  - RISK-ABC152-PUZZLE-SPY
  - RISK-ABC152-SPY-QUERY
  - src/puzzle-suite.test.ts
  - src/quiescence.ts
  - .grugops/context/qe2-ABC-152/probe/group4/
  - .grugops/context/qe2-ABC-152/probe/plants/
  - .grugops/context/qe2-ABC-152/probe/census/
  - 20261011T220201Z-software-engineer-observation-abc152-weakened-rearmed-census-130fe00c
  - 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
supersedes:
---

# QE `ABC-152` delta: `V4` group 4 holds at the tip, row for row equal to base 3.2.7; the plants read as ruling 8 says; the census reproduces byte for byte and QE's widened census adds no member

This note is hand-authored and unsealed. **No timing was read.** `wall` / `Duration` / `ms` were cut from every
record in `probe/`.

## Group 4: `PUZZLE_DEEP=weakened` (ruling 8's graded reading)

| run | tree | exit | rows | the reading |
|---|---|---|---|---|
| weakened | tip `49997a87` (worktree, 4.1.11, runner off) | 1 | 1 failed / 13 passed | **× the gate row**, `expected 15 to be greater than or equal to 54`; **✓ A3** (verbose); `solved 15/58` |
| weakened | base `91024242` (scratch, own `npm ci`, 3.2.7) | 1 | 1 failed / 13 passed | × the gate row, `expected 15 to be greater than or equal to 54`; ✓ A3; `solved 15/58` |
| **per-row compare** | tip vs base | — | — | **all 97 lines identical** (`/usr/bin/diff` exit 0): 58 `SOLVED`/`MISSED` rows carrying chosen move, depth and node count, plus 39 `NEWLY-` lines. 15 `SOLVED` |
| `PUZZLE_DEEP=1` | tip | 0 | 18 passed | `shipped: solved 54/58, baseline 54/58`; 0 `NEWLY-` |
| `PUZZLE_DEEP=1` | base | 0 | 18 passed | the same; **58 rows byte-identical to the tip's**, so the file-top spy changes no result (`RISK-ABC152-PUZZLE-SPY`: results unchanged; wall not read) |
| default | tip | 0 | 12 passed | — |

- **Reach.** Ruling 8 asks for the count 15. Every row's node count equals base's. The stub reaches `search.ts` and
  `quiescence.ts` (the two importers of `evaluate`) exactly as `doMock` did on 3.2.7.
- `src/puzzle-suite.baseline.json` is unchanged over the delta and over the ticket.

## Plants (each on its own APFS clone of `git archive 49997a87`; `probe/plant.sh` aborts unless the anchor matches exactly once)

| plant | change | expected (ruling 8) | got |
|---|---|---|---|
| (a) `pa-delete-impl` | delete `vi.mocked(evaluate).mockImplementation(() => 0);` | 54/58, gate green, A3 red | **as expected**: `solved 54/58`, × A3 `expected 54 to be less than 54`, 1 failed / 13 passed |
| (b) | — | "no leak reader" | **confirmed by reading.** Every default row (`A6`, `ABC-127 A1`, `A4`) is defined above line 364. Under `weakened` the only rows after `gatingRun()` are the gate row and A3, and both read the memoized `run` |
| QE x1 `x1-finally-reset` | wrap the `return` in `try { … } finally { vi.mocked(evaluate).mockReset(); }`, the shape ruling 8 forbids | blind | **blind**: 54/58, gate green, × A3. Ruling 8's "no reset" is load-bearing, and A3 is the backstop |
| QE x2 `x2-query-quiescence` (production plant) | `src/quiescence.ts`: `from "./evaluate.ts"` → `from "./evaluate.ts?qe2"` | partial reach (a count other than 15) | **fully blind**: 54/58, gate green, × A3. All the weakened signal flows through quiescence's import |
| QE x2 on **base** 3.2.7 | the same production plant | — | **also fully blind**: 54/58, × A3. **This is not a regression.** On 3.2.7, `doMock` did not cover a query import either |

- x2 is `RISK-ABC152-SPY-QUERY` made concrete at this site (`QE-152-j`, INFO). It is accepted under ruling 11, and
  its tripwire is review. The graded reading, "gate row red at 15", catches it, and so does A3. Only an exit-code
  reader is fooled, as on base.

## The census (ruling 8), re-derived

- **Universe:** `npx vitest list --filesOnly` gives 56 paths, the same as the SE's `census-paths-56.txt`. Of the
  tracked `*.test.*` files, the 14 outside it are all `.grugops/**` probes, which the config excludes.
- **Steps 1 and 2 at `476fdde0`,** with the ruling's two patterns exactly. Sorted, they are **byte-identical** to the
  SE's raw files: 27 lines in 16 files, and 103 lines in 23 files.
- **At the tip `49997a87`:** step 1 is the same. Step 2 gains 3 lines. All are commit 3's comment text: in
  `command-input` :51 and :63, and in `render-seam` :7. `history-pane` :670 changed wording only. None of these
  files carries a gate.
- **Regions, checked independently:**
  - `levels` `if (RUN_DEEP)` from 466;
  - `line-input` from 820;
  - `puzzle-suite` 364–473, with weakened-only at 371–373 and 467–;
  - `search.ordering` :326 (row `continue`), 401 and 461;
  - `search.pvs-lmr` 232, 524, 617, 638, 669 and 688;
  - `transposition` 189, 327, 397, 449 and 531 (`RUN_SEARCH_DEEP`), and 637 (`RUN_ENGINE_DEEP`);
  - `cli` 3416 (`if (raw)`, inside a default row).
- **Classification agrees with the SE's.**
  - `puzzle-suite:368-374` is **(iv)**, the only one.
  - `levels:468/469` are (iii).
  - `transposition:650-651` is child-process script text.
- **QE's widened census (extras the ruling did not ask for):**
  - **Env reads not spelled `process.env`** (`node:process`, `process[…]`, `import.meta.env`, destructured `env`)
    and `.skip`/`.only`/`runIf`/`skipIf`: 3 hits, all in comments.
  - **Mock mechanisms that step 2 does not name** (`mockImplementation`, `mockReturnValue`, `vi.fn(`, `vi.stubEnv`,
    `vi.stubGlobal`, `vi.hoisted`, `vi.mocked(`, fake timers), in the 7 gate-carrying mock files:
    - inside a gate region there is only `puzzle-suite:372`, the site itself;
    - every other hit sits outside every region: `levels:51`, `search.ordering:46/524/529`, `search.pvs-lmr:70`,
      `transposition:60/587` (`vi.stubGlobal` in a default-lane helper, a global and not a module namespace),
      `line-input:143-152/476/531-534`, and `cli:1151`.
  - **The file-top factory mocks whose readers include deep rows** (`levels`, `search.ordering`, `search.pvs-lmr`,
    `transposition`) are class (i) wherever they are read. QE's first-hop `V4` plants were red in all four files
    (`…cdea38ad`).
- **Result: one (iv), and no second one. No STOP.**
