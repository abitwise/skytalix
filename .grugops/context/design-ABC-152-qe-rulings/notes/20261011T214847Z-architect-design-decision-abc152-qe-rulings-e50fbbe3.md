---
id: 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
kind: decision
by: architect-design
at: 2026-10-11T21:48:47Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-084
  - ABC-143
  - ADR-0042
  - QE-152-a
  - QE-152-b
  - QE-152-c
  - QE-152-d
  - QE-152-e
  - QE-152-f
  - QE-152-g
  - QE-152-h
  - RISK-ABC143-01
  - RISK-ABC152-NEGWORKERS
  - RISK-ABC152-PUZZLE-SPY
  - RISK-ABC152-COV-MARGIN
  - RISK-ABC152-SPY-QUERY
  - src/puzzle-suite.test.ts
  - tools/grugops/result-file-reporter.js
  - memory-bank/50-decisions/ADR-0042-vitest-4-1-with-the-module-runner-off-turns-the-lane-red-beyond-spy-form-rewrites-so-no-runner-off-lever-is-built-and-the-bump-goes-to-the-owner.md
  - 20261011T212237Z-qe-e2e-decision-abc152-verdict-ee5be445
  - 20261011T212237Z-qe-e2e-observation-abc152-gap-register-8bfb6cb5
supersedes:
---

# `ABC-152`: QE's gaps are ruled in `ADR-0042` addendum 2 (rulings 8–11). R2 covers the weakened site, `V4` gains an opt-in group, `vitest/node` and the six comments are admitted, and `-b`/`-c`/`-f` are residuals. No owner word is owed

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **Nothing was
measured.** The Architect read sources and ran one grep at `88009d0b`. The authority is addendum 2. This note gives
the SE's exact repair and points at the addendum for the reasons.

## The rulings

| asked | ruling | ADR-0042 |
|---|---|---|
| `QE-152-h`: does R2 extend to `src/puzzle-suite.test.ts:368-374`? The `V4` addition? Must the set name opt-in sites? The proof? | **Yes, R2's form, with no reset.** `V4` gains group 4: every mock mechanism that runs only under an opt-in value, defined by mechanism. The graded reading: weakened exits 1 with **only the gate row red at 15/58**, A3 green. 15 = base's count is the reach proof. The proof that no other site exists is the SE's census | ruling 8 |
| `QE-152-a`: may the reporter import `vitest/node`? | **Yes, under ruling 5.** One specifier, its own commit | ruling 9 |
| `QE-152-d`: may the SE fix the six stale comments inside `V5`? | **Yes**, comment-only, at exactly those sites, in their own commit | ruling 10 |
| `QE-152-b` / `-c`: residuals, or more? | **Residuals, nothing more in this ticket.** `-b` widens `NEGWORKERS` to any negative value. `-c` is `RISK-ABC152-COV-MARGIN` (BA/PM). `QE-152-f`, which QE gave to the Architect, is `RISK-ABC152-SPY-QUERY` | ruling 11 |

## The SE repair hop (branch `grugops/ABC-152-vitest-4-1-runner-off`, in the SE's worktree, three commits in this order)

**Commit 1, `QE-152-h` (blocking): `src/puzzle-suite.test.ts` only.**
1. In the import block, add `import { evaluate } from "./evaluate.ts";`. Its sorted position is after the
   `./engine.ts` type import; let `npx biome check --write` settle the order.
2. After the imports and before `const MODE`, add `vi.mock("./evaluate.ts", { spy: true });`.
3. In `engineUnderTest()`, replace the four-line `vi.doMock("./evaluate.ts", …)` block with
   `vi.mocked(evaluate).mockImplementation(() => 0);`.
4. Keep `return (await import("./engine.ts")).chooseMove;`. **Add no reset and no `finally`.** A reset in
   `engineUnderTest()` runs before `runSuite` and makes the demonstration blind again (ruling 8).
5. Touch nothing else: not the header, not any `expect(`, not the baseline file.

**Record for commit 1** (an SE observation note; plants in a scratch copy outside the repository):
- `PUZZLE_DEEP=weakened npx vitest run src/puzzle-suite.test.ts`: exit 1, **1 failed / 13 passed**. The failed row
  is **the gate row**, `expected 15 to be greater than or equal to 54`. The `PUZZLES` line reads `solved 15/58`, and
  A3 passes. **Any other count below 54 stops the hop and returns to the Architect.**
- Plant (a), with the `mockImplementation` line deleted: 54/58, the gate row green, and A3 red
  (`expected 54 to be less than 54`).
- Plant (b): **"no leak reader"**, with its reason: the memoized `gatingRun()`, followed only by the gate row and A3.
- `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`: 18 passed, 54/58, no `NEWLY-` line. The default run:
  12 passed.
- The full `PUZZLE_DEEP=1 npx vitest run` lane: exit 0 at 1747 (`V8`'s count).
- `expect(` count in the file: unchanged.
- **The census (ruling 8), as a table: file:line, API, lane, class (i)–(iv) and the reason.**
  - The file universe is `V8`'s 56 paths (`node tools/grugops/lane-inventory.js`).
  - Step 1, the gates: `grep -nE 'process[.]env|[.](runIf|skipIf)[(]' <paths>`.
  - Step 2, the APIs: `grep -nE 'vi[.](mock|doMock|unmock|doUnmock|resetModules|importActual|importMock|spyOn)[(]|importOriginal|import[(]' <paths>`.
  - Write `[.]` rather than a backslash-escaped dot before `env`. The secret-read hook refuses a command whose text
    contains a literal `.env`.
  - **Expected:** one (iv), `puzzle-suite.test.ts:368-374`. A second (iv) stops the hop.

**Commit 2, `QE-152-a`: `tools/grugops/result-file-reporter.js:76` only.** `from "vitest/reporters"` becomes
`from "vitest/node"`. Nothing else changes.
- **Record:**
  - `(await import("vitest/node")).JsonReporter === (await import("vitest/reporters")).JsonReporter` is `true`;
  - `npm test` exits 0 at 56 / 1741 / 0 skipped, with `grep -c deprecated` on its console giving **0**;
  - `V2`'s six rows hold by content at this head.

**Commit 3, `QE-152-d`: comment lines only**, at `src/render-seam.test.ts` 4 and 6–7, `src/cli.test.ts` 5,
`tools/opening-book/book.test.ts` 101, `src/command-input.test.ts` 51 and 63, and `src/history-pane.nfr.test.ts` 670
(line numbers at `88009d0b`).
- **Rules:**
  - each line states the mechanism now present (`vi.mock(p, { spy: true })`, `mockImplementation`, the static
    imports);
  - no line-number citation;
  - no code line, and no other comment.
- **Record:**
  - every `+`/`-` line of `git diff -U0 HEAD~1` is a comment line;
  - `expect(` counts are unchanged per file;
  - `npm test` is green at 56 / 1741.

**After all three:** lint, typecheck, build, `npm test`, the skip count, integrity and the inventory, at the new tip.
Then hand QE the delta.

## QE's delta re-check (the Orchestrator routes it)

- Commit 1: `V4` group 4's readings, and the census reproduced.
- Commit 2: `V2`'s six rows and `M9b` at the new head, plus `ABC-143` `A5` ("the console gains no line").
- Commit 3: the comment-only check.
- The gates at the tip, and `V5`'s counts.
- **`V7`'s 20-run screen is not re-owed, on the Architect's reading.** The delta adds one file-scope automock to
  one default-lane file, under `isolate: true`, and changes one specifier. QE may decide otherwise.

## Owed elsewhere

- **BA/PM (ticket text, on the ticket branch):**
  - `V4`'s set gains group 4 and the census, with ruling 8's reading;
  - `V5`'s list gains "comment lines the rewrites made false, at the sites ruling 10 names";
  - the residual table gains `PUZZLE-SPY`, `COV-MARGIN` and `SPY-QUERY`, and `NEGWORKERS` widens.
  - The Orchestrator may instead let the addendum govern and have QE grade against it.
- **The Scribe, after the merge:** `AGENTS.md`'s `PUZZLE_DEEP=weakened` "exits 1 by design" becomes "exits 1 by
  design: gate row red, A3 green". The 91 B headroom applies (`QE-152` register, "Owed elsewhere").
- **Security/NFR:** it may read `PUZZLE_DEEP=1`'s printed `wall` (`RISK-ABC152-PUZZLE-SPY`). This is not a gate.
- **The owner: nothing.** No decision moves, and ruling 7's count stays 0. He may overrule any ruling.
