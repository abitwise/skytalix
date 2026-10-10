# `AGENTS.md` § Commands — verification receipts

_Created 2026-09-26 by the AGENTS.md Scribe (task `scribe-abc109-restructure`, `ABC-109` `A1`–`A4`/
`A6`–`A8`)._ `AGENTS.md` was approaching the inherited 32,768-byte silent-truncation cap (`ABC-109`).
This file is the extraction target the ticket named as available raw material: the long
`<!-- RUN … -->` provenance comments that sat inline after each command slot in `AGENTS.md` §
Commands, moved here **verbatim in substance** (comment delimiters dropped, wording unchanged) so no
directive, trap or measurement is lost — only relocated. `AGENTS.md` keeps each command line plus the
single most load-bearing fact (exit code / count / timing) and a pointer to the matching section
below.

**Reader:** the `AGENTS.md` Scribe, before adding or amending any Commands-section line (so a new
receipt is appended in the right place and stale receipts are visible together); any role that needs
the full history behind a command's exit code beyond the one-line summary `AGENTS.md` carries inline.
Not read on every hop — `AGENTS.md` § Commands is the one-line-per-command index every role reads;
this file is its footnoted detail.

_Reconciled 2026-10-10 by the AGENTS.md Scribe (task `scribe-command-log-2026-10-10`) against `git log
-- AGENTS.md` since this file's last touch (`ea68a2d8`, 2026-09-26): four commits, each with its entry
below and a row in § "Reconciliation ledger, 2026-10-10" at the end._

## Dev / run — `npm run chess`

Verified 2026-08-14 at `ABC-042`: prints the start position (23 rows) on stdout and exits 0.
Optional arguments, the complete set: `--colour white|black|random`, `--ascii`, `--unicode`.

IT PLAYS A GAME as of `ABC-043` (2026-08-19) — the line above described a board-printer and is kept
for the row count and the option set, which are unchanged. It prints the board, prompts with `> `,
reads one line per turn and answers with the merged engine, which occupies UP TO 3 SECONDS PER MOVE
(`DEFAULT_BUDGET_MS`): `--colour black` opens with the engine, so the first board sits there thinking
before the prompt appears, and that is the product working. RUN 2026-08-19 at the `ABC-043` branch
tip: `node src/cli.ts` on a closed stdin prints one board, the prompt and `input ended`, and exits 0
(real 0.07 s); `--colour black` on a closed stdin prints two boards and exits 0 (real 3.09 s, one
engine ply). EXIT CODES: 0 when the session ran, 1 for a refused command line, 70 for an internal
error — a bug that ended the session, which is never a chess result.

Pass an option AFTER `--`: `npm run chess -- --colour black` — RUN 2026-08-15 at `4e9ed1d`, exit 0,
black-bottom board. The separator is load-bearing; do not tidy this example away. Without it npm
keeps the flag: `npm run chess --ascii` (RUN 2026-08-15 at `4e9ed1d`, npm 11.7.0) warns `Unknown cli
config "--ascii"` on stderr, runs `node src/cli.ts` with NO arguments, prints the DEFAULT board and
exits 0 — the option is silently discarded and stdout looks like success.

WRITING RULES for this slot (`ABC-069`, commit `6117a2a4`, 2026-10-10; comment-only, `AGENTS.md`
23,464 -> 23,879 B, collected option set unchanged at three tokens, 0 files under `src/`, guard not
touched). `ABC-065`'s block in `src/cli.test.ts` reads the slot's RAW text, so it binds how the slot
is written as well as what it says, and until `ABC-069` neither coupling was written where a Scribe
would see it. (1) Keep the invocation inside backticks: the guard strips the fence with
`.split("`")[0]`, so a separator example written without backticks runs past the invocation and eats
the prose after it (QE's `N15`, red at `A1`). (2) Name an option in the slot only if the program
accepts it, even to say it does not: the collector cannot tell "documented as available" from "named
as unavailable", so "There is no `--help`." reds `A3` (QE's `N16`); write that sentence elsewhere in
`AGENTS.md`. The same block requires exactly ONE `- Dev / run:` slot (`ABC-071`, counted, so a
duplicate reds wherever it sits) and a comment that closes before the next top-level list item
(`ABC-067`). The guard was NOT loosened — QE's ruling at `ABC-065` (ticket `ABC-069`'s fence) was "the cost of
the coupling is a diagnosable false red once; the cost of relaxing it is a silent pass forever", and
`ABC-069` documents the cost instead of removing it. `AGENTS.md`
carries the rules in the slot's own comment; this entry is their receipt.

## Test (all) — `npm test`

`node tools/grugops/run-bounded.js 60000 vitest run` (`ABC-122`). RUN 2026-09-25: exit 0, 47 files,
1446 tests, 5.45 s. A hung lane exits 124 within the 60 s bound — stop it with Ctrl-C/SIGTERM, never
SIGKILL (owner-accepted R1: SIGKILL/SIGHUP can orphan a hung vitest). `*_DEEP` lanes run via `npx
vitest run` directly, never through `npm test` (`ENGINE_DEEP` alone is ~99 s, over the bound).
Wrapper's own proof: `node tools/grugops/run-bounded.proof.js` (RUN 2026-09-25: exit 0, all rows
held).

RE-MEASURED, twice since. (1) 2026-10-09, `ABC-084` `A8` (commit `5a15fb4f`, Scribe branch
`grugops/scribe-abc084-lane` @ `e426e91` base): exit 0, 50 files, 1539 tests, 6.66 s — the figure
`AGENTS.md` carries today. (2) 2026-10-10, this hop, wave tip `9128e7a3`, load1 8.2 at start: exit 0,
**51 files, 1584 tests, 5.52 s**. The count is a moving figure: 47/1446 (09-25) -> 50/1539 (10-09) ->
51/1584 (10-10); `ABC-119`'s own Scribe hop read 51/1541 on its branch, before the `ABC-127` merge
added its rows. `AGENTS.md` still reads 50/1539 and is one lane-count stale; the refresh is owed to the next
Scribe edit of `AGENTS.md` (this hop may not touch it — `ABC-087` is in UAT with its own edit). Not a
gate on the count: only the exit code and 0 failed are.

## Search deep lane (`ABC-077`) — `SEARCH_DEEP=1 npx vitest run src/search.test.ts`

RUN 2026-08-17 at the `ABC-077` branch tip: exit 0, 41 passed (28 in the default lane), 23.0 s.
Unset, the deep cases are NOT DEFINED rather than skipped, so the gate's skip count stays 0 — the
same shape as `PERFT_DEEP`. It holds the expensive REPETITIONS of A1–A7 (the depth-3 sweep on five of
the six perft positions, A2's own kiwipete-depth-3 case, the 204-position broad corpus, and the
depth-7 mate-in-2-vs-mate-in-4 case); every criterion is also answered in the default lane. Run it at
the QE hop and after any change to `src/search.ts`.

## Engine deep lane (`ABC-078`) — `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`

RUN 2026-08-18 at the `ABC-078` branch tip: exit 0, 23 passed (17 in the default lane), 98.7 s.
Unset, NOT DEFINED rather than skipped, same shape as `PERFT_DEEP` and `SEARCH_DEEP`. It holds every
WALL-CLOCK case, which is why it is opt-in: `plans/nfr-catalog.md`'s standing rule keeps wall-clock
assertions out of the default lane, and the default lane runs entirely on an INJECTED clock. It
carries A1's 30-position run at the 3 s budget (90.4 s of the 98.7), `NFR-005`'s depth-in-budget
measurement, and the real-clock repetitions of A2, A3, A5 and A7. Run it after any change to
`src/engine.ts`.

REFRESHED 2026-10-09 (`ABC-084` `A8`, `AGENTS.md` commit `5a15fb4f`): the "98.7 s" above went stale
when `ABC-086` shipped the virtual clock (`1ae52841`) and added 300-run virtual-clock cases to the
lane. Exit 0, **45 passed (32 default), 318.6 s wall** at load1 10.0 -> 7.6 (QE and Security/NFR were
running tests on the machine at the same time); `ABC-086`'s QE receipts at load1 ~7-8 read **291.9 s**
(user 284.3 s, load1 6.8 -> 8.1) and 291.4 s. The lane is about FIVE MINUTES, not ~100 s, and the
`AGENTS.md` line records both the loaded and the quiet reading. The trigger gained
`src/virtual-clock.ts`: run the lane after any change to it as well as to `src/engine.ts`.

RE-MEASURED 2026-10-10, this hop, wave tip `9128e7a3`, worktree alone on the lane, load1 13.1 at
start -> 4.8 at end: exit 0, **46 passed (33 default), 291.55 s** vitest duration (292.0 s real, user
285.3 s). The count moved by ONE since the 2026-10-09 line: `ABC-125` (`6a25164c`, "two live clocks at
different steps, interleaved") added a row to `src/engine.test.ts`. `AGENTS.md` still says "45
passed (32 default)" — stale by one; owed to the next Scribe edit of `AGENTS.md`. COUNT YOUR RUN: 46
is the whole lane now. The wall figure is load-dependent and is not a gate.

## Input-seam deep lane (`ABC-037`) — `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts`

RUN 2026-08-19 at `298bb95`: exit 0, 33 passed, 0.28 s. RE-MEASURED 2026-09-26 in this worktree: exit
0, 34 passed, 0.34 s — a test was added to the file between those two runs. COUNT YOUR RUN: 34 is now
the whole lane; 33 means `NODE_OPTIONS` was dropped and the external-memory retention guard did not
run — it exits 0 either way, so the count is the only signal. 30 is the default lane (re-measured
2026-09-26; the 2026-08-19 run recorded 29). Unset, NOT DEFINED rather than skipped, same shape as
`PERFT_DEEP`, `SEARCH_DEEP` and `ENGINE_DEEP`. It holds the BREADTH plus that
guard: a 16 MiB unterminated-flood survival row, the chunk-boundary permutation sweep, the
10,000-character totality row. Every ACCEPTANCE criterion is answered in the default lane. It is
opt-in because `ABC-108` has the default lane at or over `NFR-008`'s 13 s CPU clause, so this ticket
did not claim `N8-LANE`'s 650 ms. Run it after any change to `src/line-input.ts` — QE 2026-08-19
measured two mutants that die in this lane and in nothing else.

TRAP, and read all of it: `heapUsed` must never be how a memory bound gets asserted here. A build
retaining a 16,777,216-character line reports 0.01 MiB of `heapUsed` growth, so a `heapUsed` row is
green whichever build it runs against; one was written, watched NOT fail, and DELETED rather than
shipped green — do not put it back. But the bound IS testable, and `heapUsed` is not blind to
cons-strings: it accounts a FLATTENED 16 MiB string in full. An unflattened rope does read ~0.02 MiB,
so that account was HALF TRUE, and half-true aimed at the wrong field is worse than wrong: it ends
the search. The retained leaves are EXTERNAL string data, and `process.memoryUsage().external` after
a `gc()` separates the builds 0.00 vs 32.00 MiB (33,554,472 B, reproduced to the byte from a second
tree) — which is why `--expose-gc` is in the command. Numbers and the guard itself are in
`.grugops/context/quality-gate-ABC-037-qe-2026-08-19/notes/` and its `repair-ABC-037-2026-08-19/`
sibling, not restated here. The rule this cost us: never ship a memory guard you have not watched go
RED.

## Transposition deep lanes (`ABC-081`, `src/transposition.test.ts`)

`SEARCH_DEEP=1 npx vitest run src/transposition.test.ts` — RUN 2026-09-25 at `54565e8`: exit 0, 40
passed (25 default), 47.7 s. Holds A1/A2/A3/A4/A5's depth-4/5 hit-rate, node-savings and mate-reuse
pins.

`ENGINE_DEEP=1 npx vitest run src/transposition.test.ts` — RUN 2026-09-25 at `54565e8`: exit 0, 26
passed (25 default), 4.8 s. Holds A7's 1 s vs 3 s `heapUsed`/`arrayBuffers` growth reading. Same two
vars as `src/search.test.ts` / `src/engine.test.ts` above, applied to this file; unset, NOT DEFINED
rather than skipped, same shape as `PERFT_DEEP`.

## Zobrist deep lane (`ABC-075`) — `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts`

RUN 2026-09-25 at `54565e8`: exit 0, 33 passed (32 default), 37.0 s. Unset, NOT DEFINED rather than
skipped, same shape as `PERFT_DEEP`. Holds A1/A2's `zobristKeyAfterMove`-vs-full-scan-oracle walk
(11,024,485 nodes, 0 mismatches, 0 drift) within 4 plies of every perft position.

## Quiescence deep lane (`ABC-079`) — `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`

RUN 2026-09-25 at `54565e8`: exit 0, 37 passed (29 default), 1.8 s. Same var as
`src/search.test.ts` / `src/transposition.test.ts` above, applied to this file. Holds A3's
200+-position corpus sweep under the `QUIESCENCE_MAX_PLY` cap and A5's depth-2/3 node-count-multiplier
pins (kiwipete, position-6).

## PVS/LMR deep lane (`ABC-121`, `src/search.pvs-lmr.test.ts`) — `SEARCH_DEEP=1 npx vitest run src/search.pvs-lmr.test.ts`

RUN 2026-09-26 (default lane, this worktree, HEAD `652ed49`): exit 0, 20 passed, 0.6 s. Deep lane
NOT re-run here — QE's UAT run (`SEARCH_DEEP=1 npx vitest run src/search.pvs-lmr.test.ts`, 2026-09-26,
worktree `.claude/worktrees/ABC-121-pvs-lmr`, HEAD `6570343`) took 926.18 s wall under load, over the
10-minute bound this role works under; its receipt is cited instead:
`.grugops/context/uat-run-ABC-121/notes/20260926T220000Z-qe-e2e-observation-gate-and-a1-a5-deep-lane-reproduced-77854a65.md`
— exit 0, 29/29 passed (20 default), every figure (`A1` mate floor, `A1` `search()`/`chooseMove`
depth-5 corpus, `A2` node-count companions, `A5` kiwipete/position-6 node-savings) reproduced to the
exact number against the build's and QE's own earlier runs. Same var as `src/search.test.ts` /
`src/transposition.test.ts` / `src/quiescence.test.ts` above; unset, NOT DEFINED rather than skipped.
Only `src/search.pvs-lmr.test.ts` moved rows under `ABC-121` — `src/search.test.ts`,
`src/quiescence.test.ts` and `src/transposition.test.ts` were NOT touched by this ticket's diff (the
software-engineer's `…9bdce84b` decision moved two of four proposed rows into this file's
`SEARCH_DEEP` gate and kept two default; the ledger proof is `…17a0830d`), so their deep lanes above
are unchanged and were not re-run for this entry.

## Puzzle-suite strength gate (`ABC-084`, `ABC-127`) — `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`

Added to `AGENTS.md` by `5a15fb4f` (2026-10-09, `ABC-084` `A8`); its receipt widened by `f063ebce`
(2026-10-10, `ABC-127` `A9`, merged into the wave by `d45a0261` on the owner's word, UAT accepted
2026-10-10). Unset, NOT DEFINED rather than skipped, same shape as the other `*_DEEP` lanes.

**What it is.** A regression gate on the engine's tactical strength: a corpus of puzzle rows
(`src/puzzle-corpus.ts`), a recorded baseline (`src/puzzle-suite.baseline.json`), and a run that
fails when the engine solves fewer rows than the baseline. A run prints `NEWLY-MISSED` /
`NEWLY-SOLVED` per row that differs from the baseline. `PUZZLE_DEEP=weakened` is the red
demonstration — it runs a weakened engine against the gate and EXITS 1 BY DESIGN (RUN 2026-10-09:
10/40, 1 failed and 10 passed, 20.9 s); a red from it is the lane working.

**Trigger (the owner's, option B, 2026-10-09, verbatim list).** QE runs it during review when the
change touches engine code: `src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`,
`src/quiescence.ts`, `src/transposition.ts`, move ordering. **Red = QE FAIL.** It is NOT a
`quality.mandatory_gates` entry. Source: orchestrator decision `…b61e0d35` in
`.grugops/context/wave-2026-09-25/notes/`.

**Baseline rule.** The baseline moves only in its own commit with a stated reason, never in a commit
that also changes engine code (no trigger-list file in it). RAISING it is QE's; LOWERING it needs the
owner's word. The 2026-10-10 move 40/40 -> 58/62 (`ABC-127`, 22 rows appended) is a raise in the
denominator, not a lowering. The four unsolved rows are the recorded headroom, each solved at 4x the
readings: mate in 3 seed 24 (black Q+N against P), seed 234 (white Q+R against P), seed 288 and seed
580 (white Q+B against a bare king). Budget 25, step 1.

**Receipts.**
- 2026-10-09, `ABC-084` (Scribe base `e426e91`), 40 rows: exit 0, 12 passed (9 default), 17.3 s at
  load1 ~11 (Engineer: ~13 s quiet).
- 2026-10-10, `ABC-127`, 62 rows: exit 0, **17 passed (12 default), 32-36 s** whole lane, **20-24 s**
  for the gating run, at load1 4-8. The range is the union of every conforming reading from two hops:
  the Engineer's 32.1 / 32.2 / 33.5 s (gating 20.3 / 20.4 / 20.8 s) and Security/NFR's 32.9 / 34.5 /
  36.2 s (gating 20.4 / 21.4 / 24.3 s, load1 3.8-5.4). The Engineer's draft read "32-34 s / 20-21 s";
  the Scribe widened it (`f063ebce`) because Security/NFR's quiet readings fell outside it. Notes:
  `.grugops/context/scribe-ABC-127-a9/notes/…c82bebe0`, `secnfr-ABC-127/` (`…6a3b6274`).
- RE-MEASURED 2026-10-10, this hop, wave tip `9128e7a3`, load1 4.3: exit 0, **17 passed**, 36.05 s
  vitest duration (36.5 s real); the gating run 22.4 s (mate-in-3 oracle rows 8.5 s, win-material
  4.8 s). Default lane, `npx vitest run src/puzzle-suite.test.ts src/cli.real-engine.test.ts`: 13
  passed in 2 files (12 + the 1 `cli.real-engine` default test, matching each file's stated default
  count). Inside both ranges.
- `ABC-127` `A7` reads the lane's wall as <= 90 s and the gating run's as <= 45 s, NEVER ASSERTED;
  the only wall assertions are four `300_000` ms hang guards. A reading above 90 / 45 s at load1 > 8
  is load, not a breach.

**Not recorded in `AGENTS.md` on purpose** (outside `A9`; routed by the Orchestrator): Security/NFR's
`R1` / `AR-PUZZLE-EDGE` — at 4% fewer readings the budget edge goes red — which is a fact about the
engine's budget margin, not a `PUZZLE_DEEP` command fact.

## Real-engine CLI lane (`ABC-119`, `src/cli.real-engine.test.ts`) — `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`

Added to `AGENTS.md` by `46c986f7` (2026-10-10; Scribe branch `grugops/scribe-ABC-119-lane`, from
`f76e041d`). It closes QE's `QE-119-b` (LOW): the lane's only watcher is a human remembering to run
it — rows `M2` and `M3c` are green on the default lane and red only under `CLI_DEEP=1`, the lane is
not a mandatory gate, and before this line nobody reading `AGENTS.md` learned the lane existed.

**What it holds.** Two REAL children of `node src/cli.ts --colour black --ascii` against the real
engine (not a double), with an EMPTY child environment (`env: {}`) so a parent
`NODE_OPTIONS=--import=…` (for example from an `INPUT_DEEP` shell) cannot reach the child and slip
in a double. `played`: empty stdin, covers `A1`/`A3` (the reply is legal — the `last:` SAN is one of
`legalMoves(start).map(toSan)`, and the printed board equals `toFen` after `makeMove` — and the ply
advances by one). `rejected`: one `zz9` line, covers `A1`/`A4` (the refusal message comes from the
merged `rejectionMessage`, then the prompt returns and the session ends on `INPUT_ENDED_NOTICE`,
exit 0). Gated with `if (RUN_DEEP) { describe(...) }`; `describe.runIf` / `it.skipIf` / `.skip` are
never used, so unset is NOT DEFINED and the gate's skip count stays 0. The one DEFAULT-lane test
spawns nothing and can fail: it reds if anyone adds `--import` or a hook to the deep child's argv or
environment. Hang guard 4 x `HARD_CEILING_MS` (20 s).

**Trigger (written where a reader of `AGENTS.md` finds it, per `QE-119-b`).** Run at QE and after any
change to `src/cli.ts` or `src/engine.ts`.

**Receipts.**
- 2026-10-10, Scribe hop on `46c986f7`'s branch, load1 ~4.4: exit 0, **7 passed (1 default)**, 6.36 s;
  children 3099 and 3103 ms. QE (`…bc7d8341`): 6.3-6.5 s at load1 15-18, children 3116-3147 ms. Each
  child is one engine move at `DEFAULT_BUDGET_MS` (3 s) plus start-up, so ~3.1 s per child is the
  product working, and the lane's floor is ~6.2 s.
- RE-MEASURED 2026-10-10, this hop, wave tip `9128e7a3`, load1 4.5: exit 0, **7 passed**, 6.36 s;
  children 3097 and 3106 ms. COUNT YOUR RUN: 7 is the whole lane, 1 is the default lane.
- `node tools/grugops/lane-inventory.js`, RE-RUN 2026-10-10 this hop: exit 0, "The lane collects 51
  test files; git tracks 51. No findings." — the file is collected (`ABC-119`'s hop read the same 51).

Still owed elsewhere, not here: `NFR-008`'s variable list (six names missing, `CLI_DEEP` added) is
Architect/Design's. Notes: `.grugops/context/scribe-ABC-119-lane/notes/…61a7510f`,
`qe-ABC-119/`, `ticket-to-pr-ABC-119-r2/` (`…75c1c46a` for the lane shape).

## Coverage — `npx vitest run --coverage`

RUN 2026-08-15 at `daa20c4` (this hop changed no code): exit 0, 856/856 on 30 files.
`@vitest/coverage-v8` is in `devDependencies`; no npm script and no `vitest.config.ts` key invokes
it, and `coverage` is NOT in `quality.mandatory_gates` — a measurement you run, not a gate that runs
you. Figures, and which denominator decides whether this project meets `quality.coverage_threshold`
(`0.8`), are in `.grugops/context/owner-grants-2026-08-15/notes/` — read them before quoting a
number. TRAP from that note: `src/cli.ts`'s tests SPAWN it as a child process and v8 coverage does
not cross a process boundary, so it reads uncovered while being thoroughly tested.

## Coverage (`src/` only) — `npx vitest run --coverage --coverage.include='src/**'`

The other denominator; neither is the agreed one. RUN 2026-08-15 at `daa20c4`: exit 0.

## Skip-count capture

`npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'` — verified
2026-07-22: returns an integer (0 with no tests). Requires jq, confirmed present. This is the host
runner's reported skipped-test COUNT (an integer) for the gate's test-integrity step. Examples by
runner — verify against yours, never fabricate: vitest `vitest run --reporter=json | jq
'.numPendingTests + .numTodoTests'`; jest `jest --json | jq '.numPendingTests'`; pytest `pytest
--json-report --json-report-file=- | jq '.summary.skipped'`; go `go test -json ./... | jq -s
'[.[]|select(.Action=="skip")]|length'` — examples only, never a hard command. If the count cannot be
determined, record `UNKNOWN - verify`, never a silent 0.

## Test-integrity check

`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` — verified
2026-08-13: `No findings.`, exit 0, at skip count 0. `.grugops/test-skips.md` is HUMAN-OWNED (kit:
"the agent may not self-author a justification to clear its own gate") — an agent may READ it and
RUN this, never write a row into it. Created by the owner 2026-08-13, discharging `H2`; before that
this step exited 2 (could not run) on every gate.

## Lint (all) — `npm run lint`

`biome check .`

## Typecheck (single file)

`UNKNOWN - verify` — `tsc` is project-wide; there is no single-file mode. Use the project-wide
command.

## Typecheck (project) — `npm run typecheck`

`tsc --noEmit`

## Build (use sparingly) — `npm run build`

Currently `tsc --noEmit`: the project is type-checked but emits nothing, because nothing is
published until `EPIC-006` packaging. Honest naming — this is a typecheck wearing the build slot's
name, not a real bundle.

## E2E

`UNKNOWN - verify` — no runnable game until `EPIC-006`; `quality.ui_e2e` is `ui-or-critical-path` and
this project has no UI surface yet.

## Command slots, provenance

Command slots filled 2026-07-22 during `ABC-008`. Every command was RUN before being recorded.
Slots that are still `UNKNOWN - verify` are genuinely unknown — nothing was guessed to make the
table look complete.

## Reconciliation ledger, 2026-10-10

Every `AGENTS.md` change since this file's last touch (`ea68a2d8`, 2026-09-26), from `git log --
AGENTS.md` on the wave. Nothing earlier than `ea68a2d8` is owed: its two predecessors (`a84948ce`,
`ea68a2d8`) already have their entries (INPUT_DEEP 34; PVS/LMR).

| commit | date | ticket | what it did to `AGENTS.md` | entry here |
|---|---|---|---|---|
| `5a15fb4f` | 2026-10-09 | `ABC-084` `A8` (+ `ABC-086` receipts) | added the `PUZZLE_DEEP` line (owner's trigger list, red = QE FAIL, baseline rule); refreshed `Test (all)` to 50 files / 1539; corrected `ENGINE_DEEP` to 45 passed, 318.6 s, trigger gains `src/virtual-clock.ts`. 22,451 -> 23,464 B | § Puzzle-suite; § Test (all); § Engine deep lane |
| `6117a2a4` | 2026-10-10 | `ABC-069` | the `Dev / run` slot's two WRITING RULES (backticks; name only accepted options) with the enforcer cited, plus the `ABC-071` / `ABC-067` closure rules. Comment only, 23,464 -> 23,879 B | § Dev / run |
| `f063ebce` | 2026-10-10 | `ABC-127` `A9` | `PUZZLE_DEEP` receipt: 17 passed (12 default), wall 32-36 s / 20-24 s, baseline 58/62. +169 B. Merged by `d45a0261` | § Puzzle-suite |
| `46c986f7` | 2026-10-10 | `ABC-119` (closes `QE-119-b`) | the `CLI_DEEP` real-engine CLI lane line with its QE trigger. 23,879 -> 24,264 B | § Real-engine CLI lane |
| `d45a0261` | 2026-10-10 | `ABC-127` | merge commit, no `AGENTS.md` change of its own beyond `f063ebce` | — |

**Result on the wave tip `9128e7a3`:** `AGENTS.md` is 24,433 B against the 24,576 B cap (143 B of
headroom). Two receipts in it are one count stale against re-measurement today and are NOT corrected
here (this hop does not edit `AGENTS.md`): `Test (all)` reads 50 files / 1539, the tree is 51 / 1584;
`ENGINE_DEEP` reads 45 passed (32 default), the tree is 46 (33 default).

Not a command slot, so no receipt is owed: the `pgrep -f` wait-loop rule (`a84948ce`, 2026-09-26) is a
prose safety rule in `AGENTS.md` § Test and is complete there.

Owed after `ABC-087` merges (its branch carries its own `AGENTS.md` edit and a `Levels deep lane`
line, `ENGINE_DEEP=1 npx vitest run src/levels.test.ts`, not on the wave yet): re-reconcile this
file against that merge, and decide the two stale counts above with the headroom proposal in
`.grugops/context/scribe-command-log-2026-10-10/notes/`.
