---
id: 20261018T201100Z-qe-e2e-observation-abc167-mutants-8bb44ca0
kind: observation
by: qe-e2e
task: qe-ABC-167
at: 2026-10-18T20:11:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - ADR-0044
  - QE-170-g
  - .grugops/context/qe-ABC-167/probe/mutants.mjs
  - .grugops/context/qe-ABC-167/probe/mutants.log
  - .grugops/context/qe-ABC-167/probe/mutants-lane.log
  - .grugops/context/qe-ABC-167/probe/m29.ts
supersedes:
---

# ABC-167 mutants: 51 in total, 28 killed and 23 survived

Hand-authored and unsealed. The mutants ran on a scratch copy of the tip tree in the session scratchpad. They never touched a
repo worktree, and the copy was `diff`-verified identical to the tip's `src/` before and after.

Each mutant is one exact-string replacement in `src/uci-session.ts`, asserted to match exactly once, at `--testTimeout=120000`.
Every kill below is an assertion failure, not a timeout.
- **Pass 1:** M01–M46 against `src/uci-session.test.ts`.
- **Pass 2:** every pass-1 survivor except M04, M09 and M10, re-run against the whole default lane (`vitest run --dir src`).
  M47–M51 ran only in this pass.
- For the A11 mutants, `tsc --noEmit` and `biome check` were also run.

## Killed (28)
- **A1, A3, A10:**
  - M36 (`id` lines swapped);
  - M45 (extra pv token);
  - M37 (`quit` → continue).
- **A4:**
  - M26 (`bestmove 0000` not written);
  - M27 (`bestmove (none)`);
  - M28 (refusal keeps the old position);
  - M30 (an illegal move is skipped, not refused).
- **A5:**
  - M01 (`/19`);
  - M07 (no level cap);
  - M08 (`wtime`/`btime` swapped).
- **A6:**
  - M13 (`held` is not cleared, so a second `stop` writes again);
  - M14 (`ponderhit` ignored);
  - M16 (never hold).
- **A7:**
  - M17 (`mate` → 2N);
  - M18 (max instead of min);
  - M19 (accepts 0);
  - M20 (`parseInt` accepts `2.5`);
  - M21 (`maxNodes` not passed);
  - M22 (no `searchmoves` `info string`);
  - M24 (a bad value maps to depth 1 instead of being dropped);
  - M25 (`maxDepth` not passed).
- **A8:**
  - M31 (floor);
  - M32 (sign lost);
  - M33 (never `score mate`).
- **A9:**
  - M34 (`ucinewgame` no-op);
  - M35 (`setoption` writes).
- **A11:**
  - M46 (a stray `readyok` after `bestmove`);
  - M39 (side-effect `import "./history.ts"`). The file misses M39, but the lane kills it through the `ADR-0011`
    licence row (*"licenses src/history.ts's runtime importers"*).

**QE-170-g edges, each pinned by a row that fails on a wrong build:**
- `go depth 0` / `go mate 0` (M19, M24);
- `go depth 2.5` (M20);
- tiny `nodes`: `go nodes 1` → d1 (M21);
- `mate N` → 2N−1 (M17, plus the `go mate 1 depth 5` → d1 row).

## Survived (23)
| id | criterion | mutation | lane | other gates |
|---|---|---|---|---|
| M02 | A5 | move overhead 50 → 0 | survives | — |
| M03 | A5 | increment ignored | survives | — |
| M04 | A5 | increment not halved | file only | — |
| M05 | A5 | `movestogo` ignored | survives | — |
| M06 | A5 | the other side's increment | survives | — |
| M09 | A5 | `max(1, …)` → `max(0, …)` | file only | observationally equivalent at step 1 (the engine plays d1 on budget ≤ 0) |
| M10 | A5 | `max(1, …)` floor removed | file only | the same |
| M11 | A5 | a clock beats `movetime` | survives | — |
| M12 | A6 | `go ponder` does not hold | survives | — |
| M15 | A6 / choice 3 | a held answer is dropped, not released, on a new `go` | survives | — |
| M23 | A7 / choice 4 | `searchmoves` eats to end of line | survives | — |
| M29 | A4 | C0 filter removed | survives | `m29.ts`: an ESC reaches the output via `moves e2e4\x1b[31m` and `go depth \x1b[31m` |
| M38 | A11 | `from 'node:fs'` (single quotes) | survives | **biome exit 1** |
| M40 | A11 | `globalThis["Math"]["random"]()` | survives | tsc 0, biome 0 |
| M41 | A11 | `import fs from "fs"` (bare specifier) | survives | **biome exit 1** |
| M42 | A11 | `globalThis["process"]` | survives | tsc 0, biome 0 |
| M43 | A3 / choice 5 | `nps` = `nodes` | survives | — |
| M44 | choice 1 | a new session holds no position | survives | — |
| M47–M51 | A11 | side-effect `import "./<m>.ts"` for `turn-loop`, `book-file`, `line-input`, `book-engine`, `level-seam` | survives | tsc 0, biome 0 |
