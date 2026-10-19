---
id: 20261019T125000Z-qe-e2e-observation-abc171-rows-and-gates-90488973
kind: observation
by: qe-e2e
task: qe2-ABC-171
at: 2026-10-19T12:50:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
  - ABC-174
  - R-167-1
  - QE-171-a
  - QE-171-b
  - QE-171-c
  - QE-171-d
  - 20261019T121000Z-qe-e2e-decision-abc171-verdict-pass-with-gaps-9d61b7e3
  - .grugops/queue/done/ticket-to-pr-ABC-171-rows.md
  - .grugops/queue/done/bapm-adr0045-cut.md
  - .grugops/context/qe2-ABC-171/probe/gate-npm-test.txt
supersedes:
---

# ABC-171 at `5dee231c` (rows `b62baabc`, code `b6afd021`): the rows are present, and the gates are green

Hand-authored and unsealed. The checks ran in the scratch detached worktree `../wt-qe2-ABC-171` at `5dee231c`,
which is now removed.

## The rows, against the amended page (`bapm-adr0045-cut`)
- **A8 (reworded):** **present.**
  - The existing row stands, now at step 100: `ucinewgame` draws 0, level 1 draws 1 per `go`, and level 3 draws 0.
  - A new row: each level in `BLUNDER_LEVELS` draws exactly 1 seed on a searched `go`. `BLUNDER_LEVELS` is read from
    `LEVELS`, where `blunderRate > 0`.
  - The book-hit half is A13b.
- **A13a:** **present.** It has both non-vacuity rows (S32 and S33 clauses) plus 8 rows for k = 1..8. The oracle is
  `createLevel({ budgetMs: 100, blunderRate: LEVELS[1].blunderRate }, { seed: floor(seededRandom(k)() * 2^32), now: virtualClock(100) })`,
  and the rig's default step is 100. This matches the page.
- **A13b:** **present.** It has a precondition row, then one row per blunder level (1 and 2 at this tip). Each asserts
  exactly `info string book` and `bestmove e2e4`, no `info depth`, and 0 draws. This matches the page.
- **A13c:** **present.**
  - `go nodes 100` and `go depth 3 nodes 100 mate 2` each give 3 lines.
  - Each has exactly one `info string`, a level line with no ` score `, and a matching `bestmove`.
  - The `info string` names the tokens. This matches the page.
- **A13d:** **present.** A fresh session with `START_BOOK` gets `OwnBook value maybe`. It writes one `info string`,
  then the book answers. This matches the page.
- Each row is green at the tip. The kills are in `…443377ed`.
- `src/uci-session.ts` is unchanged by the hop: `git diff 9ae31679 5dee231c -- src` is the test file only.

## Gates at `5dee231c`
- lint 0, typecheck 0, build 0.
- `npm test` exit 0: 59 files, **1962/1962**.
- `.test-results/last-run.json`: `success: true`, `numTotalTests` 1962, 1962 passed, 0 failed, 0 pending, 0 todo.
- `test-skip-integrity .grugops/test-skips.md --skip-count 0`: `No findings.`
- `git merge-tree --write-tree main 5dee231c`, against main `68bbf33f`: **clean** (exit 0, tree `8adebc28`).
- **A12:** `git diff --name-only main...5dee231c -- src` lists exactly `src/uci-session.test.ts` and
  `src/uci-session.ts`.
- **R-167-1:** the grep on the added `src` lines prints only the test's A2 literal `"constructor"`, as in the first
  pass. There is nothing on `src/uci-session.ts`.
- Dependencies: `package.json`, `package-lock.json` and `vitest.config.ts` are identical to main. `node_modules` was
  symlinked from main's working tree.
- **Incidental, not a reading:** `npm test` printed 11.69 s duration under a foreign load. It is not an N8 figure.

## Forward pins (ABC-174), checked as INFO
- ABC-174's § Pins that move hold at `5dee231c` for `:44`, `:121`, `:211-212`, `:284-285`, `:412`, `:448`, `:453`,
  `:647`, `:665`, `:719`, `:802` and `:866-873`.
- **One reference drifted:** the ABC-171 A8 row is cited at `:877-893`. At `5dee231c` it sits at `:882-897`, because
  the rows hop added `BLUNDER_LEVELS` at `:877`. The row is findable by its name ("level 3 draws none"). This is
  QE2-171-g, INFO, routed to ABC-174.
