---
id: 20261019T161500Z-software-engineer-observation-abc173-a7-lane-counts-and-coverage-reds-e3f09b52
kind: observation
by: software-engineer
at: 2026-10-19T16:15:00Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-173
refs: [ABC-173, ADR-0008, NFR-008, ABC-170, ABC-167]
---

# `ABC-173` `A7`: every `AGENTS.md` lane, run as spelled at the cap. Counts only, no timing.

- **Gates green:** lint, typecheck, build. `npm test` exit 0, 59 files, 1920 passed, `last-run.json` `success: true`.
  Skip count 0. Integrity: `No findings.`, exit 0.
- **Deep lanes**, exit 0 each:
  - `PERFT_DEEP` 32; `SEARCH_DEEP` search 57, transposition 40, quiescence 37, pvs-lmr 29;
  - `ENGINE_DEEP` engine 60, levels 28, transposition 26;
  - `INPUT_DEEP` 34; `ZOBRIST_DEEP` 33; `PUZZLE_DEEP` 18; `CLI_DEEP` 11; `LADDER_DEEP` short 18;
  - single file (`src/fen.test.ts`) 82.
- **No heap out-of-memory error and no guard refusal in any lane.**
- **STOP CONDITION HIT: both coverage lines red on their first run as spelled.**
  - `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --coverage`: exit 1, 3 failed / 1917 passed, all
    `Test timed out in 5000ms` (`src/engine.test.ts` `ABC-170 A3` x2, `src/uci-session.test.ts` `ABC-167 A5`).
  - The `src/`-only line: exit 1, 1 failed (`ABC-170 A3`, the same timeout).
  - Re-runs: `--coverage` 2 of 2 green (1920), `src/`-only 2 of 2 green (1920).
  - Base `68bbf33f` uncapped, scratch copy: `--coverage` 2 of 2 green (1915).
  - Context: another hop's mutation run (`mutants3.mjs`, `uci-session.test.ts`) was live on the host during the
    first runs; load1 read 4.5-6.4. It had ended by the second `src/`-only re-runs.
  - **Cause: `UNKNOWN - verify`.** No timing was read, so GC pressure at 224 MiB cannot be told apart from host
    contention. Reported to the owner (his Q4: "ask on breach"). No row was raised.
- **Not done (stopped):** armed reds (addendum item 10), the live-worker census (`pre.mjs` + `analyze2.mjs`), peak
  `heapUsed` per lane, and the six `result-file-reporter.js` regression plants that its header requires when
  `scripts.test` changes.
