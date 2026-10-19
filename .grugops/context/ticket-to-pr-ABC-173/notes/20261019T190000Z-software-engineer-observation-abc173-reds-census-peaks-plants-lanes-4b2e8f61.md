---
id: 20261019T190000Z-software-engineer-observation-abc173-reds-census-peaks-plants-lanes-4b2e8f61
kind: observation
by: software-engineer
at: 2026-10-19T19:00:00Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-173
refs: [ABC-173, ADR-0008, ABC-143, ABC-149, NFR-008]
---

# `ABC-173` after the resume: armed reds, census, `heapUsed` peaks, reporter plants, lanes. Counts only, no timing.

Hand-authored and unsealed.

**Armed reds** (each planted in `../wt-ABC-173`, watched red, then reverted with `git checkout`; the tree was clean
after each):
1. `npm test` with the script prefix removed: the guard refused (4192 > SUITE 224). `last-run.json` reads
   `success=false`, `exitCode=1`.
2. `CLI_DEEP` with the argv token dropped: `A6` red (child 4 395 630 592 B > row 496 MiB), 1 failed / 10 passed.
3. `CLI_DEEP` with the line prefix dropped: the guard refused (4192 > ONE-FILE 496).
4. `INPUT_DEEP` with only `--expose-gc`: the guard refused.
5. A planted `spawn(` in `src/transposition.test.ts`: `C2` red (`transposition.test.ts spawn`).
6. Two files at the ONE-FILE flag: the guard refused (496 > SUITE 224).
7. The heap flag in vitest `execArgv` (ticket extra): `ERR_WORKER_INVALID_EXEC_ARGV`, no tests ran, exit 1.
8. A bare `npx vitest run src/fen.test.ts` (ticket extra): the guard refused.
9. A row raised above the table, one file at flag 500 (ticket extra): the guard refused (596 > 496).
10. `globalSetup` removed (ticket extra): `A4` and `A6` red ("no heapRowMiB").
11. An `AGENTS.md` lane line without its prefix: `A3` red.

**Live-worker census** (`pre.mjs` + `analyze2.mjs`, suite at flag 128):
- 59 worker starts and 30 Node child starts;
- **max live workers 4** (not over 4), children 2, main 1;
- every isolate read 224 MiB;
- peak counted, excluding the lane's npx client: 5.

**Peak `heapUsed`**, sampled; an observation, not a gate. Values are max MiB of main / worker / Node child. These
runs are the lane command with `--import=<peak.mjs>` added to `NODE_OPTIONS`.
- suite 32/99/14; coverage 69/109/13; coverage `src/` 63/107/15;
- `CLI_DEEP` 21/22 (its children have an empty environment, so they are not sampled); `INPUT` 20/18; quiescence 20/20;
- SEARCH transposition 22/24; ENGINE transposition 21/26/4; `ZOBRIST` 21/29; `PERFT` 21/22; `SEARCH` search 22/29;
- **`PUZZLE` 21/198**; single file 20/21; levels 23/38; engine 24/26; `LADDER` 24/34; pvs-lmr 23/47;
- the npx client 16–20 in every lane. No out-of-memory error.

**`result-file-reporter.js` plants** (scratch copy outside the repository): all six header rows match on exit code,
file fields and query lines:
- green 0;
- unhandled 1 (`PLANT-timer`);
- hang 124 (`started`, `startTime` > stamp);
- suite 1;
- assertion 1;
- exit-code-only 1 (0 failed tests, 0 failed suites, no unhandled errors).

A seventh row, the guard refusal (prefix removed): exit 1, `success: false`, `exitCode` 1, `numTotalTests` 0,
`unhandledErrors` empty. The query prints only `run    exited exitCode=1`: the file reads not-success but does not name
the guard. This is the exit-code-only class. It is recorded here, and nothing was changed for it.

**Lanes re-run as spelled:** all green (see the command log, § `ticket-to-pr-ABC-173` pass, "Resumed").
