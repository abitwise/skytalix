---
subtask: se-ABC-249
role: software-engineer
ticket: ABC-249
ref: .grugops/context/se-ABC-249/
branch: new grugops/ABC-249 from main (worktree .claude/worktrees/se-ABC-249)
width: parallel coding allowed (owner 2026-11-01: "you can work in-parallel apart from running tests"); test/timing runs are serialized — see Host rule.
---
# SE ABC-249
## Read
- plans/tickets/ABC-249-a-pre-root-repetition-met-four-or-more-plies-into-the-search-scores-0-so-qply4-turns-the-lane-red-test-only.md in full (acceptance, scope, fences, Test notes). ADR-0003 as amended 2026-11-01 ((1-A), (3-A), (1-R)) for ABC-254; ABC-248/245 precedent rows for ABC-249.
## Host rule (binding)
- Writing and reading code needs no gate. **Before ANY vitest / npm test / npm run build|lint|typecheck / perft / benchmark / engine run, wait until the file `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-clear` exists** (poll it every 60 s with a background waiter or a file check; a QE timing probe holds the host until then).
- **Wrap every such command in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** so no two hops run tests at once. Never hold the lock while idle.
- Any timing you record (informal G8, nps) only under the lock, with load1 and foreign processes logged.
## Do
- Implement the ticket to its acceptance; gates via `npm run …` (under the rule above); npm test green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names. No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`; never vitest on the same command line as a wait. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `se-249/`.
## Publish
Sealed notes (task `se-ABC-249`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

SE, 2026-11-01, branch `grugops/ABC-249` from `main` `09d1f675`. Row commit **`25371747`**; notes commit `80276547`. Every run was made after `host-clear` and under `flock host-test.lock`.

- **Row:** one, in `src/engine.test.ts`. It is a new describe at the end of the file (no existing row touched): "ABC-249 — a pre-root repetition met four plies deep scores 0 (QE-248-c)" › "Qe5+ at ply 4 stood twice before the root: Ke1 at 404 with the keys, Kg1 at 497 without". `git diff --name-only 09d1f675 25371747` prints `src/engine.test.ts` only, with 0 removed lines. The UAT-waiver grep is empty.
- **Fixture:** a queen perpetual. FEN `6k1/RR3ppp/8/4q3/8/7P/PP4PK/1N6 w - - 0 1`, moves `h2h1 e5e1 h1h2 e1e5 h2g1 e5d4 g1f1 d4f6`. The root is `6k1/RR3ppp/5q2/8/8/7P/PP4P1/1N3K2 w - - 8 5`, and the prior keys are 8 (`trimPriorKeys`).
  - Line to the repeating node: **Kf1-g1 Qf6-d4+ Kg1-h2 Qd4-e5+**, at **ply 4**. That position stands exactly 2 times in the prior keys and 0 times among the root and plies 1 to 3. The row asserts both counts.
  - Depth 4: with the keys **f1e1 +404**; withheld **f1g1 +497**. The root FEN is unchanged after each search.
  - Why not a KQ v K shuttle: all 9 972 4-ply quiet transitions were probed with no move or score change. Decision note `…bcb0e207`.
- **A3 QPLY4:** applied alone out of tree (`se-249/mut/`, a one-line diff). The row is **red**: expected {f1e1, 404}, received {f1g1, 497}. At production it is **green**. The mutant was never committed.
- **A5 cost:** row 6.05 / 3.80 / 3.93 ms in three head JSON reports, **median 3.93 ms** (budget 100 ms). Nodes are 1 642 with the keys plus 767 withheld = 2 409.
- **A6 gates:** lint, typecheck and build exit 0.
  - Base `npm test`: 2 362 / 2 362, 9.05 s, load1 2.18.
  - Head `npm test`: **2 363 / 2 363, 0 skipped** in each of three runs: 9.27 s (load1 2.63), 9.70 s (2.77), 9.47 s (2.89). The informal median is 9.47 s. It is **not G8**: a foreign vitest run (another project) was running throughout.
  - Skip-integrity: `No findings.` Lane-inventory: 63/63, `No findings.`
- **Notes:** `20261101T152620Z-software-engineer-decision-bcb0e207`, `…-observation-3bbfaabc` (artifacts), `…-observation-67c090b7` (runs).
- STOP: none. QE re-reads QPLY4 and G8.

### Trace row (10 cells, header order)

| ABC-249 | A position that stood twice before the root, met four plies into the search, scores 0, so QPLY4 turns the default lane red (test-only, QE-248-c) | EPIC-010 | ADR-0054 decision 3 | NFR-008: row median 3.93 ms, fixed depth, no clock read; informal head 9.47 s, G8 owed | grugops/ABC-249 @ 25371747: src/engine.test.ts | npm test 63 files / 2 363 pass, skips 0 (base 2 362); QPLY4 red (f1g1 497 ≠ f1e1 404), production green | No UAT (test-only, no production line) | — | In Review (branch, not merged; QE and G8 owed) |
