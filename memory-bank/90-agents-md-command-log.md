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

## Test (all) — `npm test`

`node tools/grugops/run-bounded.js 60000 vitest run` (`ABC-122`). RUN 2026-09-25: exit 0, 47 files,
1446 tests, 5.45 s. A hung lane exits 124 within the 60 s bound — stop it with Ctrl-C/SIGTERM, never
SIGKILL (owner-accepted R1: SIGKILL/SIGHUP can orphan a hung vitest). `*_DEEP` lanes run via `npx
vitest run` directly, never through `npm test` (`ENGINE_DEEP` alone is ~99 s, over the bound).
Wrapper's own proof: `node tools/grugops/run-bounded.proof.js` (RUN 2026-09-25: exit 0, all rows
held).

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

## Input-seam deep lane (`ABC-037`) — `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts`

RUN 2026-08-19 at `298bb95`: exit 0, 33 passed, 0.28 s. COUNT YOUR RUN: 33 is the whole lane; 32
means `NODE_OPTIONS` was dropped and the external-memory retention guard did not run — it exits 0
either way, so the count is the only signal. 29 is the default lane. Unset, NOT DEFINED rather than
skipped, same shape as `PERFT_DEEP`, `SEARCH_DEEP` and `ENGINE_DEEP`. It holds the BREADTH plus that
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
