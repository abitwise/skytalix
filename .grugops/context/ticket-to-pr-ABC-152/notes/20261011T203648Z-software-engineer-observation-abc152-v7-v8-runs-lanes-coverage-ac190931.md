---
id: 20261011T203648Z-software-engineer-observation-abc152-v7-v8-runs-lanes-coverage-ac190931
kind: observation
by: software-engineer
at: 2026-10-11T20:36:48Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0008
  - ADR-0042
  - NFR-001
  - NFR-005
  - NFR-007
  - RISK-ABC151-FOREIGN
  - .grugops/context/ticket-to-pr-ABC-152/probe/v7-20-runs.txt
  - .grugops/context/ticket-to-pr-ABC-152/probe/lanes.sh
  - .grugops/context/ticket-to-pr-ABC-152/probe/lanes.out.txt
supersedes:
---

# SE `ABC-152` `V7` and `V8`: 20 of 20 consecutive green runs with every `*.nfr` file passing; all eight opt-in lanes exit 0; coverage exits 0

This note is hand-authored and unsealed. All readings were taken at head `23c5521a` in the worktree, on the M3 (Node
v26.11.0).

## `V7`, isolation kept

- `isolate` resolves `true` (`resolved-workers-v4.mjs`).
- **20 consecutive `npm test` runs** (`probe/v7-20-runs.txt`). Each ran in 20 of 20: exit 0, `success` true,
  56 files, 1741 passed, 0 failed, 0 pending, and **all 7 `*.nfr.test.ts` files passed** (by file status and by
  every assertion).
- load1 was about 4–5 around the screen. Another project's vitest was present for at least part of the session.

## `V8`, the lanes (`probe/lanes.sh`: one at a time, `node tools/grugops/run-bounded.js 1800000 vitest run`, with nothing of this hop's running beside it)

| lane | exit | files | tests (passed / total) | wall (s, rounded, reported only) |
|---|---|---|---|---|
| `PERFT_DEEP=1` | 0 | 56 | 1749 / 1749 | 11 |
| `SEARCH_DEEP=1` | 0 | 56 | 1816 / 1816 | 278 |
| `ENGINE_DEEP=1` | 0 | 56 | 1762 / 1762 | 205 |
| `INPUT_DEEP=1` + `NODE_OPTIONS=--expose-gc` | 0 | 56 | 1745 / 1745 | 8 |
| `ZOBRIST_DEEP=1` | 0 | 56 | 1742 / 1742 | 12 |
| `PUZZLE_DEEP=1` | 0 | 56 | 1747 / 1747 | 11 |
| `CLI_DEEP=1` | 0 | 56 | 1747 / 1747 | 14 |
| `LADDER_DEEP=1` | 0 | 56 | 1746 / 1746 | 191 |

- Each total is base's collected count + 1 (`V3`), per `…bff7dfee`.
  - `INPUT_DEEP` runs 1745 against a collected list of 1744. `vitest list` ran without `--expose-gc`, so the
    retention guard was not defined there: AGENTS.md's "34 vs 33" line.
- **The walls are reported, never graded.** A foreign project's `vitest` (`install/*.test.ts`) was on the host for
  at least the start of `SEARCH_DEEP` (`RISK-ABC151-FOREIGN`). load1 at each lane's start was 3.75–6.15.
  - `pmset -g therm` read "No thermal warning level has been recorded". That is not `thermalpressurelevel`, and it
    grades nothing.
  - **These walls are not `V9`/`V10`.** They come from no width-1 window, have no twin, and no base was read
    beside them.
  - AGENTS.md's base walls (`SEARCH_DEEP` search ~23 s plus pvs-lmr 926 s; `ENGINE_DEEP` ~5 min plus levels
    ~3.5 min; `LADDER_DEEP` 848 s) were per file, or loaded. They are not compared here.
- **No lane read differently** on a wall-clock budget. Every lane was green. No baseline was moved.
- **Failed attempt, recorded:** the first lane run invoked `run-bounded.js` without `node_modules/.bin` on `PATH`.
  It exited 2 with `spawn vitest ENOENT` on all eight lanes, and **no lane ran**. The script now exports `PATH`, and
  the second run is the one reported (`lanes.out.txt` keeps both logs).
- **`PUZZLE_DEEP=weakened`** (which exits 1 by design) was not run. QE owes it.

## Coverage

- `npx vitest run --coverage`: exit 0. 56 / 1741 passed; `All files` 99.2 % statements, 97.94 % branches,
  100 % functions, 99.43 % lines.
- `npx vitest run --coverage --coverage.include='src/**'`: exit 0. `All files` 95.73 / 97.34 / 97.61 / 95.55.
- On 4.x, `coverage.all` is gone, so the first denominator is the loaded files only. It is not comparable to
  AGENTS.md's "856/856 on 30 files". That is the Scribe's.
