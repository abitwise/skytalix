---
subtask: ticket-to-pr-ABC-173
role: software-engineer
ticket: ABC-173
page: plans/tickets/ABC-173-cap-vitest-at-two-cores-and-a-two-gb-heap-ceiling-that-every-lane-applies.md
from: main (current tip)
branch: grugops/ABC-173
worktree: ../wt-ABC-173
---

# Implement ABC-173 end to end, per the ADR-0008 addendum (ACCEPTED)

The contract is the ticket page plus the ADR-0008 § ADDENDUM 2026-10-19, which the owner accepted in `…9f3b6e20`:
- OQ1: two sizes;
- OQ3: every run.

The Architect's handoff lists the exact changes as items 1–10, the pins that move and the armed reds. Read `.grugops/queue/done/arch-ABC-173-adr0008.md` and the notes `…9c2f7a41`, `…4e81d0b6`, `…b7d35e20`.

## Do
- Make every change the Architect listed:
  - `package.json` `test` / `test:watch`
  - `tools/grugops/run-bounded.js` header
  - the new `tools/grugops/heap-guard.js`
  - the `vitest.config.ts` `globalSetup` and its paragraph
  - the `src/cli.real-engine.test.ts` heap token and probe
  - the `src/cli.test.ts` rows and re-pins (A10 values, `N8_SPAWN` 28, C2/A3/A6 static rows, A4)
  - the `AGENTS.md` lane lines
  - the `src/line-input.test.ts:77` comment
- Write tests first where the page asks for them.
- **AGENTS.md budget (ABC-109 A5).** `AGENTS.md` is at its 24,576 B budget. In the same diff, move at least the added bytes of receipt comments into `memory-bank/90-agents-md-command-log.md`, as the addendum rules. Do not touch the Dev/run slot.
- **A7.** Run every `AGENTS.md` lane exactly as spelled and record its counts. Record peak `heapUsed` as an observation, and the max live-worker count once. If more than 4 workers are live at once, or there is any out-of-memory error: **stop and report**. The owner's word is "ask on breach".
- **Armed reds.** Watch each one go red, then revert it, as item 10 lists.
- **If a lane fails under the cap, stop and report.** Do not raise a flag.

## Gates
Run each lane as `AGENTS.md` now spells it, with the prefix:
- lint, typecheck and build
- `npm test`; `last-run.json` must show `success: true` with the full count
- integrity at skip 0
- `CLI_DEEP`: the count rises from 10 to 11
- `PERFT_DEEP`: 32/32

## Fences
- **No timing readings.** The N8-LANE and A9 twin readings go to QE, before merge.
- Do not touch:
  - `plans/board.md`
  - `plans/traceability.md`
  - `../wt-ABC-171`
  - any process you did not start
- Never push. Never merge.

## Handoff
Write `.grugops/queue/done/ticket-to-pr-ABC-173.md` and `.claim.md` in main's working tree, uncommitted, with:
- the tip
- each criterion's result
- the lane counts table
- the armed reds
- the `AGENTS.md` byte accounting
- the production-lines measurement (`git diff --name-only <base>...<tip> | grep -v '\.test\.ts$' | grep '^src/'`)
- a trace row

---

## Result (software-engineer, 2026-10-19)

- **Tip:** `840ebbf7` on `grugops/ABC-173`, in `../wt-ABC-173`, from `68bbf33f`. Not pushed and not merged.
  - `affee860`: the heap ceiling.
  - `48842a1f`: the lightened rows, on the owner's word `…6e1d9b47`.
  - `840ebbf7`: receipts and notes.
  - In all: 16 files, +772/−59.
- **This hop stopped once.** Both coverage lines went red on their first capped run (5 s test timeouts, no OOM). The
  owner ruled "Lighten the rows, keep cap". The rows were lightened, and every lane is now green as spelled.
- **No timing readings.** The `N8-LANE` and `A9` twin readings are QE's, before merge. No flag was raised.
- **Notes:** `.grugops/context/ticket-to-pr-ABC-173/notes/`, hand-authored and `sealed: false`:
  - decisions `…5c1e8a37` and `…a7c3d910`;
  - artifact-ref `…8d42b6f1`;
  - observations `…e3f09b52` (the stop) and `…4b2e8f61` (after the resume).

### Criteria
| criterion | result |
|---|---|
| C1 | `ABC-144 A7` and `ABC-152 V3` green, their blocks byte-identical. `globalSetup` is a path string. |
| C2 | Green, using the TS parser: 0 async `child_process` calls and ≥ 4 sync sites. Armed red: a planted `spawn(` gives `C2` red. |
| A1 | (b) none. `resourceLimits` appears in 0 files of `vitest/dist`; `new Worker` is at `cli-api.CnMVyzaz.js:3229`. |
| A2 | The addendum's table, in `heap-guard.js`: SUITE 224 × 9 = 2016, ONE-FILE 496 × 4 = 1984. |
| A3 | Static row green over 17 commands. Armed reds: default lane without the prefix is refused, `CLI_DEEP` without the line prefix is refused, `INPUT_DEEP` without the heap flag is refused, a bare `npx` is refused, and an `AGENTS.md` line without its prefix turns `A3` red. |
| A4 | Worker row green. Armed reds: `globalSetup` removed turns `A4` red, and a row raised above the table (flag 500) is refused. |
| A5 | The guard reads the limit in the main process and refuses every armed case above. Two files at the ONE-FILE flag are refused. |
| A6 | Green: the `childOf` `heapProbe`, the static row, and the `CLI_DEEP` probe (11/11). Armed red: the argv token dropped turns `A6` red. `CHILD_ENV` stays `{}`. |
| A7 | Every lane green as spelled (table). Max live workers 4. No OOM. `heapUsed` peaks are recorded in `…4b2e8f61`. |
| A8 | Pins moved, each with its reason: `A10` (`test`, `test:watch`), `N8_SPAWN` 27 -> 28, the `run-bounded.js` quote, `CLI_DEEP` 10 -> 11, two comments, `ABC-170 A3` step 1 -> 5, `ABC-167 A5` "movetime 100" step 1 -> 10 (owner). |
| A9 | QE's, before merge. |

### Lane counts after the resume (each exactly as `AGENTS.md` spells it)
| lane | exit | passed |
|---|---:|---|
| lint / typecheck / build | 0/0/0 | — |
| `npm test` | 0 | 59 files, 1920; `last-run.json` `success: true` |
| skip count / integrity | 0 / 0 | 0 / `No findings.` |
| Coverage ×2 | 0, 0 | 1920, 1920 |
| Coverage `src/` ×2 | 0, 0 | 1920, 1920 |
| PERFT_DEEP | 0 | 32/32 |
| SEARCH_DEEP search / transposition / quiescence / pvs-lmr | 0 | 57 / 40 / 37 / 29 |
| ENGINE_DEEP engine / levels / transposition | 0 | 60 / 28 / 26 |
| INPUT_DEEP / ZOBRIST_DEEP / PUZZLE_DEEP | 0 | 34 / 33 / 18 |
| CLI_DEEP | 0 | 11 (10 -> 11) |
| LADDER_DEEP (short mode) | 0 | 18 |
| single file (`src/fen.test.ts`) | 0 | 82 |

Every coverage outcome this hop, before and after the lightening:
- **Before:** `--coverage` red 1, green 2; `src/` red 1, green 2. All the reds were 5 s timeouts in the lightened rows.
- **After:** `--coverage` green 2 + 1 (observation pass); `src/` green 2 + 1.

### Lightened rows (nodes per row, before -> after)
- **`ABC-170 A3`, step 1 -> 5:** startpos 90 154 -> 12 330; kiwipete 95 412 -> 17 588; position-3 88 092 -> 10 268;
  position-4 93 080 -> 17 304; position-5 92 288 -> 14 464; position-6 93 490 -> 17 032. M15 still reds all 6.
- **`ABC-167 A5` "movetime 100", step 1 -> 10:** 96 277 -> 6 165. Kill sets of M01–M11 plus 3 `movetime` wrong builds
  are unchanged; step 100 would lose 2.
- **Not changed, reported:**
  - "white reads wtime" (45 077 nodes): step 10 admits M01;
  - "black reads btime" (40 991 nodes): step 100 admits M01;
  - `A6` `go infinite` ×2 (76 863 nodes each): already at step 100, the coarsest in BA/PM's set;
  - `A7` `go depth 3` (55 972 nodes): its depth ≥ 5 precondition was not shown at a coarser step.

### Armed reds
Each was watched red, then reverted:
- default lane without the prefix: refused, `last-run` `success=false`, `exitCode=1`;
- `CLI_DEEP` without the argv token: `A6` red;
- `CLI_DEEP` without the line prefix: refused;
- `INPUT_DEEP` without the heap flag: refused;
- a planted `spawn(`: `C2` red;
- 2 files at the ONE-FILE flag: refused;
- the flag in `execArgv`: `ERR_WORKER_INVALID_EXEC_ARGV`;
- a bare `npx vitest run`: refused;
- flag 500 on one file: refused;
- `globalSetup` removed: `A4`/`A6` red;
- an `AGENTS.md` line without its prefix: `A3` red.

### Reporter plants (`result-file-reporter.js` header)
- All 6 rows match: green 0, unhandled 1, hang 124, suite 1, assertion 1, exit-code-only 1.
- A 7th row, the guard refusal: `success: false`, `exitCode` 1, but the file names no error (only the `run` line). It
  is reported, and nothing was changed for it.

### `AGENTS.md` bytes
- 24,576 -> **24,343 B** (budget 24,576; 233 B of headroom).
- The prefixes cost +635 B.
- 868 B of RUN receipts moved, verbatim, to `memory-bank/90-agents-md-command-log.md` § "`ticket-to-pr-ABC-173` pass".
- The `Dev / run` slot is untouched.

### Production lines
`git diff --name-only 68bbf33f...840ebbf7 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing: **0 production files.**

### Trace row (for the Orchestrator to apply)
`| ABC-173 (C1, C2, A1–A8) | NODE_OPTIONS heap flag on scripts.test/test:watch + 17 AGENTS.md vitest lines; globalSetup tools/grugops/heap-guard.js refuses above its row (A5); A4/A6/C2/A3 rows in src/cli.test.ts; CLI_DEEP argv heap token + A6 probe; owner-ruled lightening: ABC-170 A3 step 1→5, ABC-167 A5 movetime 100 step 1→10; Software Engineer ticket-to-pr-ABC-173 | 840ebbf7 on grugops/ABC-173 (from 68bbf33f) | ADR-0008 addendum 2026-10-19; owner word …6e1d9b47 | NFR-008 (A9 owed to QE before merge) | 0 production lines under src/; default lane 1915→1920; CLI_DEEP 10→11; N8_SPAWN 27→28 | every AGENTS.md lane green as spelled; coverage ×2 each green after the lightening; 11 armed reds watched; max live workers 4; no OOM; reporter plants 6/6; no timing taken | QE: N8-LANE narrow-set + A9 twin before merge | notes …5c1e8a37, …8d42b6f1, …e3f09b52, …a7c3d910, …4b2e8f61 |`
