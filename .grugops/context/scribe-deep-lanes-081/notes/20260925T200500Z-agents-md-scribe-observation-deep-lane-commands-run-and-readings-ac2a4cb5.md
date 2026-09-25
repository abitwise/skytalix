---
id: 20260925T200500Z-agents-md-scribe-observation-deep-lane-commands-run-and-readings-ac2a4cb5
kind: observation
by: agents-md-scribe
at: 2026-09-25T20:05:00Z
verified_by:
confidence: high
refs:
  - AGENTS.md
  - src/transposition.test.ts
  - src/zobrist.test.ts
  - src/quiescence.test.ts
  - ABC-081
  - ABC-075
  - ABC-079
supersedes:
---

No sanctioned writer (`scripts/context-io.ts`) is present on this install, so this note is
hand-authored per `AGENTS.md`'s "No `finding` is admissible on this install" paragraph. Not
sealed, not a stamp.

# Owed deep-lane `AGENTS.md` lines — commands run, readings

Task `scribe-deep-lanes-081` (queue, subtask of `wave-2026-09-25`). Worktree
`.claude/worktrees/scribe-deep-lanes-081`, branch `grugops/scribe-deep-lanes-081` off `54565e8`.
Env-var names read from the test files themselves (`process.env.*` lines), not guessed.

## Commands run and their readings

1. `SEARCH_DEEP=1 npx vitest run src/transposition.test.ts` (ABC-081; var read from
   `src/transposition.test.ts:50`, `RUN_SEARCH_DEEP`). RUN 2026-09-25 at `54565e8`: exit 0, 40
   passed (25 in the default lane, confirmed separately with `npx vitest run
   src/transposition.test.ts` — 25 passed, 486 ms), 47.66 s (real 48.37 s). Holds `A1`-`A5`'s
   depth-4/5 hit-rate, node-savings and mate-reuse pins.

2. `ENGINE_DEEP=1 npx vitest run src/transposition.test.ts` (ABC-081; var read from
   `src/transposition.test.ts:51`, `RUN_ENGINE_DEEP`). RUN 2026-09-25 at `54565e8`: exit 0, 26
   passed (25 default), 4.79 s (real 5.41 s). Holds `A7`'s 1 s vs 3 s heapUsed/arrayBuffers growth
   reading (kiwipete: heapUsed 7.91 -> 7.92 MiB, arrayBuffers 4.01 -> 4.01 MiB).

3. `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` (ABC-075; var read from
   `src/zobrist.test.ts:339`, `RUN_DEEP`). RUN 2026-09-25 at `54565e8`: exit 0, 33 passed (32
   default, confirmed separately — 32 passed, 184 ms), 36.97 s (real 37.41 s). Holds A1/A2's
   `zobristKeyAfterMove`-vs-full-scan-oracle walk: 11,024,485 nodes, 0 mismatches, 0 drift, within
   4 plies of every perft position.

4. `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` (ABC-079; var read from
   `src/quiescence.test.ts:58`, `RUN_DEEP`). RUN 2026-09-25 at `54565e8`: exit 0, 37 passed (29
   default, confirmed separately — 29 passed, 245 ms), 1.80 s (real 2.22 s). Holds A3's 200+
   corpus sweep under `QUIESCENCE_MAX_PLY` and A5's depth-2/3 node-count-multiplier pins on
   kiwipete/position-6.

Same env-var shape as the existing `PERFT_DEEP`/`SEARCH_DEEP`/`ENGINE_DEEP` lines: unset, the
deep cases are NOT DEFINED rather than skipped, so the gate's skip count stays 0.

## `AGENTS.md`

`Test (all)` line NOT touched — `ABC-122` (in flight) owns it, per the subtask's fence.

Size (`wc -c AGENTS.md`): 30,637 bytes before -> 32,062 bytes after. `ABC-109`'s cap is 32,768
bytes (32 KiB) — 706 bytes of margin remain; no compression was needed.

`git diff --stat AGENTS.md`: `AGENTS.md | 15 ++++++++++++++++`, 1 file changed, 15 insertions(+),
0 deletions(-). Only `AGENTS.md` was touched in this hop's substrate edit (plus the queue
transition and this note, which are separate paths).

## Fences respected

No `src/`, `plans/board.md`, `plans/nfr-catalog.md`, ADRs, or `plans/tickets/` opened for
writing. `plans/traceability.md` (not fenced for this subtask) got one appended `_Updated:` line
at the top, no row touched or added.
