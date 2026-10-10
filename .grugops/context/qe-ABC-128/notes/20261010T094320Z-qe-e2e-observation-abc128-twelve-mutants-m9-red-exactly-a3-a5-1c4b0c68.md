---
id: 20261010T094320Z-qe-e2e-observation-abc128-twelve-mutants-m9-red-exactly-a3-a5-1c4b0c68
kind: observation
by: qe-e2e
at: 2026-10-10T09:43:20Z
verified_by:
confidence: high
refs:
  - ABC-128
  - ABC-120
  - ABC-021
  - QE-051-b
  - M9
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - .grugops/context/qe-ABC-128/probe/mut.mjs
  - .grugops/context/qe-ABC-128/probe/run-mutants.sh
  - .grugops/context/qe-ABC-128/probe/out-base-2files.txt
  - .grugops/context/qe-ABC-128/probe/out-tip-2files.txt
  - .grugops/context/qe-ABC-128/probe/out-tip-full-suite.txt
  - .grugops/context/qe-ABC-128/probe/out-base-full-suite.txt
supersedes:
---

# `ABC-128`: 12 `keyHistory` mutants on base and tip; `M9` reds exactly `A3`/`A4`/`A5` across the whole suite

Hand-authored, no seal (degraded posture, `AGENTS.md`). Apple M3, load1 7.6–15.5 (other QE lanes
running). Base `fcbf06b` and tip `61a785f` were each extracted with `git archive` into a private
scratchpad, with `node_modules` symlinked. Each mutant adds ONE `keyHistory(history);` line at a
unique anchor in that copy's `src/turn-loop.ts` (`probe/mut.mjs` refuses if the anchor hits ≠ 1).
After each run the copy is restored and `cmp`-checked. Both copies' `turn-loop.ts` were then
`cmp`-identical to the worktree's. The worktree was never planted. QE wrote its own runner and did
not reuse the Engineer's or BA/PM's.

Command per mutant: `npx vitest run src/turn-loop.test.ts src/turn-loop.nfr.test.ts --reporter=json`
(67 tests). `M9`, `M14`, `M17` and the unmutated tip were also run on the whole default lane
(`npx vitest run`, 50 files / 1540 tests).

| id | edge (where the line goes) | base `fcbf06b` | tip `61a785f` |
|---|---|---|---|
| none | — | 67/67 green | 67/67 green; full lane 1540/1540 |
| `M9` | take-back, after `takeBack(history, outcome.plies)` | **67/67 green (survives)**; full lane **1540/1540 green** | **3 red: `ABC-120` `A3`, `A4`, `A5`**, each `expected "keyHistory" to be called +0 times, but got 1 times`; full lane **1537 passed / 3 failed, the same 3** |
| `M9b` | take-back, BEFORE `takeBack` | survives | 3 red: `A3`, `A4`, `A5` |
| `M9c` | take-back, only `if (outcome.plies > 0)` | survives | 2 red: `A3`, `A4`. `A5` (ply 0) stays green, as it should |
| `M10` | allowed claim, before the `draw` return | 1 red: `ABC-021` `A8` (iv) | 1 red: `A8` |
| `M11` | advancing ply, human, after `playMove(history, outcome.move)` | 1 red: `A8` (got 4) | 3 red: `A8`, `A3` (got 4), `A4` (got 2) |
| `M12` | advancing ply, engine, after `playMove(history, move)` | 1 red: `A8` (got 4) | 3 red: `A8`, `A3`, `A4` |
| `M13` | refused claim, a second replay before `claimShortfall` | 1 red: `A8` (`expected 1 times, but got 2`) | 1 red: `A8` |
| `M14` | `rejected` / `ambiguous` / `command` (shared branch) | survives | **survives; full lane 1540/1540 green** |
| `M15` | `quit`, before the notice | survives | 1 red: `A3` (its script ends in `quit`) |
| `M16` | `eof`, before the notice | 1 red: `A8` | 3 red: `A8`, `A4`, `A5` |
| `M17` | `game-over` from the seam, before the return | survives | **survives; full lane 1540/1540 green** |

Readings:

1. **`A1` is reproduced.** `M9` survives the base on the whole lane and reds exactly `A3`/`A4`/`A5`
   at the tip on the whole lane. No other row in any file fails. The planting position (before or
   after `takeBack`) does not change this (`M9b`).
2. **The narrowed `A8` title is true of its rows.** Each edge it names has a planted mutant that a
   row kills. Refused claim → `M13` (and the count `== 1`). Advancing ply → `M11` (human) and `M12`
   (engine). Allowed claim → `M10`. Take-back → `M9`/`M9b`/`M9c`.
3. **The edges the title no longer claims, measured.** The ticket left these `UNKNOWN - verify`.
   `quit` (`M15`) and `eof` (`M16`) are killed, but only incidentally: the count rows happen to end
   on those edges. `eof` was already killed at the base by `A8`. `quit` is killed only at the tip,
   by `A3`'s new line. **`rejected`/`ambiguous`/`command` (`M14`) and seam `game-over` (`M17`)
   survive the whole suite.** See the gap register note.
