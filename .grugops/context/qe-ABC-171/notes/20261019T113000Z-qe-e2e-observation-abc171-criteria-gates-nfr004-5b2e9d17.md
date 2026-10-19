---
id: 20261019T113000Z-qe-e2e-observation-abc171-criteria-gates-nfr004-5b2e9d17
kind: observation
by: qe-e2e
task: qe-ABC-171
at: 2026-10-19T11:30:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
  - ADR-0044
  - NFR-004
  - AR-NFR004-A
  - R-167-1
  - ABC-167
  - 20261019T110600Z-software-engineer-decision-choices-the-page-left-open-a171d001
  - 20261019T110601Z-software-engineer-observation-readings-a171d002
  - 20261019T110602Z-software-engineer-artifact-ref-delivery-a171d003
  - .grugops/context/qe-ABC-171/probe/qe171-probe.test.ts
  - .grugops/context/qe-ABC-171/probe/probe.out
supersedes:
---

# ABC-171 at `9ae31679` (code `b6afd021`): the criteria, the gates, NFR-004 and R-167-1

Hand-authored and unsealed. Everything ran in the scratch worktree `../wt-qe-ABC-171`, detached at `9ae31679`, with
main's `node_modules` symlinked in (the manifests are identical). The probes ran on a scratchpad copy whose `src/`
was `diff -r`-identical to the tip. The probe file was never in the worktree or the branch. **Every time figure here
is on the virtual clock (`virtualClock(step)`). No wall time was read.**

## Gates at the tip
- lint 0 (biome, 115 files), typecheck 0, build 0.
- `npm test` exit 0 on the first run: 59 files, **1945/1945**. The run had foreign load, so its time is not a reading.
- `.test-results/last-run.json`: `success: true`, `numTotalTests` 1945, 1945 passed, 0 failed, 0 pending, 0 todo.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- **A12:** `git diff --name-only 7df64755 9ae31679 -- src` lists exactly `src/uci-session.test.ts` and
  `src/uci-session.ts`.
- `git merge-tree --write-tree 398603fa 9ae31679` (main now): exit 0, clean.
- `src/uci-session.test.ts`: 101 rows, all green.

## R-167-1, re-run
- `git diff -U0 7df64755...9ae31679 -- src | grep '^+' | grep -nE 'globalThis|\bglobal\b|Reflect|constructor'`
  prints one line, `164:+  for (const value of ["0", "6", "2.5", "x", "constructor"]) {`. That line is the test
  file's A2 input literal.
- The same grep on `src/uci-session.ts` alone prints nothing (exit 1).
- Bracket access among the added production lines: one, `const level = LEVELS[skill];`. `skill` is typed
  `keyof typeof LEVELS`. It starts at `DEFAULT_LEVEL` and is only ever set after `Object.hasOwn(LEVELS, value)`
  passes. No inherited key can reach it: `constructor`, `__proto__` and `toString` are each refused with one
  `info string` (probe P5). **No new R-167-1 exposure.**

## The criteria, graded against the page (not the code)
| row | verdict | evidence |
|---|---|---|
| A1 | **MET** | exactly 5 lines in order (ABC-171 A1 row, and ABC-167 A1 amended) |
| A2 | **MET** | lower case `skill level value 1` writes nothing, and A6 then reads 200 on budget 100. `0`, `6`, `2.5`, `x` and `constructor` each give one `info string` and keep 1. `OwnBook maybe` gives one line and keeps `false`. `Hash 64` writes nothing, and the book and level 3 are unchanged. **Thin:** "keep the old value" is pinned in one direction only per option (S12, below) |
| A3 | **MET** | exactly `info string book`, `bestmove e2e4`. `position fen <start>` hits the same entry. The position after `moves` is probed |
| A4 | **MET** | `read` is called 0 times over `uci`, `setoption`, `isready`, `go`, `ucinewgame`, `isready` |
| A5 | **MET** | 0 after `uci`, 1 after the first `isready`, still 1 after that. 1 at the first `go` without `isready`. Probe P7: off → search, 0 reads; on → book hit, 1 read |
| A6 | **MET** | G = 3 500, step 100: level 1 → 200 (budget 100), level 3 → 3 100 (3 000), level 5 → 3 600 (3 500). Probe P8, not on the page: level 2 → 600 (500), level 4 → 3 600 (3 500) |
| A7 | **MET** | the same `k` gives the same sequence. The level line has no `score`. Level 1 `go depth 3` gives one naming line. Level 3 `go depth 3` gives `depth 3`. Probe P2: for k = 1…8 the session's level-1 moves equal `createLevel` driven by `floor(random() · 2^32)` per `go` (the tip follows D11), but **no row pins that derivation** (S32, S33, below) |
| A8 | **MET** | `ucinewgame` draws 0 times. Each level-1 `go` draws 1. A level-3 `go` draws 0 |
| A9 | **MET** | `read` throwing, and `{"format":2}`: 3 legal `bestmove`s, no throw, `warn` exactly once. Probe P6: the warning is `opening book could not be read; playing on without it`, and no byte of the error text is in it. **The session itself writes nothing for it.** D10's "reaches the GUI as `info string …`" is therefore the `warn` binding's job, in ABC-168 (QE-171-e) |
| A10 | **MET** | `go infinite` writes `info string book`. `stop` writes `bestmove e2e4`. A second `stop` writes nothing |
| A11 | **MET** | the only `./book.ts` import is `import type`. ABC-167 A11 and A11-g1 still hold. The M4 sweep covers every row |
| A12 | **MET** | two files. Every ABC-167 row is green. The only ABC-167 row that changed is A1. The shared helpers `dialogue` and imports changed (choice 1) |

## NFR-004, on the virtual clock only
**The page's claim is confirmed:** level 5 is 4 500 ms, under the 5 s ceiling, and the clamp still applies.
- **The rule in the code** is `budgetMs = Math.min(request.budgetMs, LEVELS[skill].budgetMs)`, and `chooseMove`
  clamps at `HARD_CEILING_MS` (5 000) as before (`src/engine.ts:481`, unchanged). The blunder path is passed the same
  minimum. `createLevel` also clamps its blunder total at `HARD_CEILING_MS` (`src/levels.ts:123`, unchanged).
- **Probe P1** ran each level 1–5 against five unbounded `go`s: bare `go`, `movetime 100000`,
  `wtime 600000 btime 600000`, `depth 99`, and `infinite` + `stop`. Step 100, start position.
  - Every reading was the level's budget + one step: 200, 600, 3 100, 4 100 and 4 600.
  - The maximum over all 25 rows was **4 600 virtual ms**, the 4 500 budget plus one step. That is under
    `HARD_CEILING_MS`.
- **Against the catalog's NFR-004:**
  - **Clause A** (≤ 3 s at the default difficulty): the UCI default is level 3, which is `DEFAULT_BUDGET_MS` =
    3 000. That is the same call as ABC-167, so `AR-NFR004-A` (+12 ms max on the real clock) stands as written.
  - **Clause B** (5 s at any difficulty): the session's highest budget rises from 3 000 to **4 500**. That is still
    under 5 000. Levels 4 and 5 were already player-reachable through `level-seam.ts` (the ABC-101 re-read). The
    real-clock readings on record for 4 500 ms are 30/30 ≤ 5 s, max 4 526–4 590, plus the +90 ms first-call
    reading. They now apply to a UCI `go` as well. **No new mechanism reaches the ceiling.**
  - **Not covered by this note:** a real-clock reading of a UCI `go` at level 5. That is the Security/NFR gate's
    call, if it wants one. The `Verified by` cell does not move on virtual-clock readings.
