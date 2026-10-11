---
id: 20261011T212237Z-qe-e2e-observation-abc152-gap-register-8bfb6cb5
kind: observation
by: qe-e2e
at: 2026-10-11T21:22:37Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-143
  - ABC-149
  - ADR-0042
  - RISK-ABC143-01
  - RISK-ABC152-NEGWORKERS
  - QE-152-a
  - QE-152-b
  - QE-152-c
  - QE-152-d
  - QE-152-e
  - QE-152-f
  - QE-152-g
  - QE-152-h
  - ABC-084
  - src/puzzle-suite.test.ts
  - 20261011T212237Z-qe-e2e-observation-abc152-v2-reporter-rows-0d5f42fb
  - 20261011T212237Z-qe-e2e-observation-abc152-v4-plants-cdea38ad
  - 20261011T203648Z-software-engineer-observation-abc152-handoff-what-is-owed-4567b6b5
supersedes:
---

# QE `ABC-152`: gap register. 1 HIGH (blocking), 3 LOW and 4 INFO. `QE-152-h` is a mock this ticket blinds, outside `V4`'s set: `PUZZLE_DEEP=weakened`. An admitted form re-arms it, so it is a repair, not a ruling 7 case. `QE-152-a` is a `V2` sub-clause not met as written

This note is hand-authored and unsealed. The readings are in `…0d5f42fb` (`V2`), `…cdea38ad` (`V4`) and the
readings note.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-152-h` | **HIGH (blocking)** | Software Engineer (a repair hop). The Architect confirms that R2's form covers this site. The Orchestrator routes it | **`PUZZLE_DEEP=weakened`, `ABC-084` A3's red demonstration of the puzzle gate, is BLIND at head, and the exit code hides it.** `src/puzzle-suite.test.ts:368-374` stubs `evaluate` with `vi.doMock("./evaluate.ts", …)` and then does `await import("./engine.ts")`. With the runner off, the stub never reaches the engine. The weakened run solves **54/58 at head** (the shipped engine's count) against **15/58 at base 3.2.7**. The gate row is **green**. The run still exits **1**, because A3 ("solves FEWER") fails. So a reader of the exit code, including `AGENTS.md`'s "exits 1 by design" and the task's "exits 1", sees nothing wrong. **This is the failure class `ABC-152` exists to prevent** (`ADR-0041` d3; `V4`: "every guard still armed: the reason this ticket exists"). It escaped because `D3`'s screen and `V4`'s set came from the default lane only, and this is opt-in code. It does not weaken production, and `PUZZLE_DEEP=1` still guards at 54/58. What is lost is the proof that the gate can go red. **The fix is an admitted form, proven on a scratch copy:** R2's shape, `vi.mock("./evaluate.ts", { spy: true })` at file top plus `vi.mocked(evaluate).mockImplementation(() => 0)` in place of the `doMock` block. It gives weakened **1 red, the gate row** (15/58), `PUZZLE_DEEP=1` 18/18 green and default 12/12 green, with `expect(` unchanged. R2's `finally` reset has no reader here ("no leak reader"). **QE's search found no other site:** no `doMock`, no `resetModules`, no namespace `spyOn`, and no other dynamic import of a mocked graph |
| `QE-152-a` | **LOW** (a `V2` sub-clause, not met as written) | Orchestrator to route. The fix is one line in the reporter, but ruling 5 did not name the specifier, so the Architect's nod is needed, or a follow-up | **`ABC-143` `A5`'s "the console gains no line" is broken on 4.1.** `V2` says `ABC-143` `A1`–`A6` still hold. Every `npm test` now prints `Importing from "vitest/reporters" is deprecated since Vitest 4.1. Please use "vitest/node" instead.` It is a `console.warn` at module load (`vitest/dist/reporters.js:26`), triggered by the reporter's `import { JsonReporter } from "vitest/reporters"`. It is also `RISK-ABC143-01`'s surface 1 drifting toward removal. **No false result follows:** every row and every count is right. **Fix shape, proven on a scratch copy and not applied:** `vitest/node` exports the identical class (`===`). Swapping the specifier gives 0 deprecation lines, `npm test` exits 0 with 56 / 1741, and the green file is unchanged. The SE saw it and left it, because ruling 5 lists the route, the check, the header and the plant block, and not the specifier |
| `QE-152-b` | **LOW** (residual kept) | Security/NFR (`V12` review). The Scribe adds the `AGENTS.md` line (test note 6) | **`RISK-ABC152-NEGWORKERS` is confirmed, and it is a class.** Any negative `VITEST_MAX_WORKERS` (`-1`, `-2`) makes `npm test` **exit 0 with no test run**. The file reads `success` false, `exitCode` 0 and `testResults` 0, and READ IT prints `run    exited exitCode=0`. On a narrow `vitest run`, the JSON reporter writes no file at all. The pin cannot see it, because nothing runs. **The mandatory gate reads `npm test`'s exit code**, so a hop that exported a negative value would read the gate green. Nobody sets this by accident. The residual stays LOW, and QE keeps it |
| `QE-152-c` | **LOW** | BA/PM (fold into the next ticket that edits the reporter's block), or the Architect | **The exit-code-only row's precondition margin is 0.57 points.** On 4.x, `coverage.all` is gone. Lines coverage reads 99.43% over loaded files (38.48% on 3.2.7). When any hop takes lines to 100%, `npm test -- --coverage --coverage.thresholds.lines=100` exits 0. The row then **disagrees loudly** on its exit code, so this is not a silent pass. The block already says the row must then be re-planted. The cost is a misdiagnosed first run. Statements read 99.2% and branches 97.94%, so a threshold on another metric buys little time. The durable fix is another exit-code-only red that vitest's verdict calls green |
| `QE-152-d` | INFO | BA/PM (comment-only follow-up) or Scribe | **Stale comments: the SE's three, plus three more QE found.** The SE's: `src/render-seam.test.ts` header line 4 ("NO `vi.mock`"); `src/cli.test.ts` line 5 ("It holds no `vi.mock`"); `tools/opening-book/book.test.ts` line 101 ("doMock + a fresh module registry"). **QE's:** (1) `src/render-seam.test.ts` lines 6-7, in the same header ("`A2`'s spies are `vi.spyOn` over imported namespaces"); (2) `src/command-input.test.ts` lines 51 and 63, which still describe the mechanism as `vi.fn(actual.…)`, while both mocks are now `{ spy: true }` (the "calls through" property is still true); (3) `src/history-pane.nfr.test.ts` line 670 cites "the `await import` at `:58-60`", which R4 replaced with static imports (the line numbers had drifted before this ticket too). All are comment-only. `V5` keeps them out of this diff |
| `QE-152-e` | INFO (pre-existing test gap) | BA/PM (a follow-up; adding an assertion is outside `V5`) | **The `PRODUCTION_DEPS` path (`src/move-input.ts:108`) has no upper-bound count.** "A2 control" asserts `>= 1`. The SE's add-plant is green at head and at base 3.2.7. The removal plant and QE's route-around plant are red. So the spy does reach the path; it is just unbounded above. Not a ruling 7 case, and not a blinding by this ticket |
| `QE-152-f` | INFO (latent) | Architect (`ADR-0042` residuals) | **A `{ spy: true }` automock does not cover a query-string import of the same file. A factory `vi.mock` does** (scratch probe: factory static 1 / query 1; `{ spy: true }` static 1 / query 0). R1 and R5 moved guards from factories and namespace spies to `{ spy: true }`. So a production module that imported `./legal.ts?x` would route around those guards, where the old factory forms would have counted it. **No production file uses a query import today** (grep, exit 1). The only query imports are in tests: ruling 3's `book.ts?abc094-a2=` (`book.ts` is not mocked there) and `history-pane.nfr`'s fixtures |
| `QE-152-g` | INFO (pre-existing) | none (recorded so it is not re-found) | **`engine.capacity`'s `writesPerIteration()` pads the last iteration with `+ 1`**, so removing the engine's **root** key write still reads a maximum of 128. This is green at head and at base. The guard is armed by an add-plant on either key write (`expected 129 to be 128`). It measures capacity, not an exact write count |

## Not gaps (checked)

- **Ruling 7: 0 cases.** Every one of the 20 files has a red QE plant. No test needed weakening (`…cdea38ad`). `QE-152-h` is armed by an admitted form, so it is a repair, not a ruling 7 case.
- **`V5`'s content** is exactly the admitted forms, plus `V3`'s `it` and `V6`'s `A7`. `expect(` counts are equal
  per file, except `src/cli.test.ts` 321 → 324.
- **The `vitest.config.ts` isolation warning is word for word.** The diff removes only the two lines of the one
  pin sentence.
- **`QE-144-a` closes**, because the pin reads `test.projects`: an `r4` entry and an empty `projects: []` are both
  red, the latter at startup. **`QE-151-a` and `QE-151-b` are folded:** `0x3` is red, the empty value is green,
  and `0x2`, `2.9` and `1e9` agree with vitest's own parse.

## Owed elsewhere (not graded here)

- **Security/NFR:** `V9`–`V11` (the width-1 window) and `V12`'s dependency review. QE read no timing, CPU or heat.
- **The Scribe, after the merge (test note 6):**
  - `AGENTS.md`'s worker-cap line: `VITEST_MAX_THREADS` ≤ 2 becomes `VITEST_MAX_WORKERS`, 1 ≤ n ≤ 2;
  - the Stack line;
  - the `RISK-ABC143-01` line;
  - the coverage figure's meaning (`coverage.all` is gone);
  - a `RISK-ABC152-NEGWORKERS` line (`QE-152-b`).
  - **Byte budget:** `AGENTS.md` is 24,485 B at head, against a 24,576 B budget, which leaves 91 B. These edits
    have to be paid for with cuts.
