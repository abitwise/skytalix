---
id: 20261010T091643Z-software-engineer-observation-abc127-gates-a1-a8-readings-eee7be49
kind: observation
by: software-engineer
at: 2026-10-10T09:16:43Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-084
  - RISK-003
  - N8-LANE
  - ADR-0027
  - ADR-0033
  - src/puzzle-corpus.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - 20261010T085351Z-software-engineer-decision-abc127-curated-rows-oracles-one-budget-558e9520
  - 20261010T085351Z-software-engineer-claim-abc127-agents-md-line-and-owed-6341cc47
supersedes:
---

# `ABC-127` readings: gate green, `A3` 8 of the 10 survivors red, plus all 7 old reds; 58/62 with 4 headroom rows; 4× reads 62/62; `A7` 20–21 s gating and 32–34 s whole lane; `N8-LANE` +435 ms gross

Hand-authored and unsealed. Worktree `grugops/ABC-127-harder-puzzles`:
- `e1f5732` holds the rows and the runner;
- `47433c5` holds the baseline, alone.

Machine: Apple M3, 8 cores, 16 GiB, macOS 26.5.2, Node v26.11.0. Lanes ran one at a time, but other
agents' lanes were on the machine, so load is given with every reading. Raw files are in `../probe/`.

## Gate (Workflow 05, at `47433c5`)

| step | result | raw |
|---|---|---|
| lint | exit 0, 97 files | `raw-lint.txt` |
| typecheck / build | exit 0 / exit 0 | `raw-typecheck-build.txt` |
| `npm test` | exit 0, **50 files / 1543 passed / 0 skipped**, 6.0 s (base `4a64dd9`: 50 / 1540) | `raw-npm-test.txt` |
| skip count | 0 (`jq '.numPendingTests + .numTodoTests'`) | `raw-integrity.txt` |
| integrity | `No findings.`, exit 0 | `raw-integrity.txt` |
| host check | exit 2, `UNKNOWN - verify`, never read as a pass | `raw-host.txt` |
| `PUZZLE_DEEP=1` ×3 | exit 0, 17 passed each | `raw-a6-process{1,2,3}.txt` |
| `PUZZLE_DEEP=weakened` | **exit 1** as designed, 19/62, gate row red (`expected 19 to be greater than or equal to 58`) | `raw-weakened.txt` |

## `A1` — rows by tag

- 22 new rows after the 40: **12 mate-in-3** and **10 win-material**. Of the win-material rows,
  **7 have black to move**.
- Tags: **quiet-key 14**, **depth≥5 10**, **quiescence 11**, **headroom 4**. Every row has at least
  one tag.
- The 40 old rows and `HANGING_CORPUS` are byte-identical. The corpus diff is +50/−1, and the one
  removed line is the `kind` union in the type.
- The default lane gains 3 rows: shape and tags, the quiet-key check, and the mirror and repeat
  check.
- Mutants of these checks are red, 8 of 8 (`raw-mutants.txt`). One mutant was mis-built first
  (it mirrored the row it replaced). It was rebuilt and is red.
- Tag truth was checked against the `A3` runs. Every `depth≥5` row is in `W5`'s `NEWLY-MISSED`
  (10/10). Every `quiescence` row is in `W1`'s (11/11).

## `A2` — answers re-proven in the deep lane

- **ORACLE mate-in-3:** 12 rows exact, none with a mate in ≤ 2, 6.8–8.0 s quiet.
- **ORACLE win-material:** 16 rows exact (the 6 from `ABC-084` included), gain > 0, 4.4–4.6 s.
- Both independent oracles derived the same sets first (`probe/curation/verify-selected.mjs` →
  `pools/selected.jsonl`, all `ok: true`).
- The curation oracle's move generator passes perft (`curation/perftcheck.out.txt`).

## `A3` — QE's 17 weakenings (`probe/a3-weakenings.mjs`, `.out.jsonl`, `.console.txt`)

Each weakening was planted alone and run through `PUZZLE_DEEP=1`, then reverted with
`git checkout`. `git status --porcelain src` was empty after every run. Baseline is 58/62.

| id | weakening | solved | exit | `NEWLY-MISSED` | gate |
|---|---|---|---|---|---|
| W1 | quiescence off | 47 | 1 | 11 | **red** (was survivor) |
| W1b | quiescence off at engine leaf | 41 | 1 | 17 | **red** (was survivor) |
| W2 | quiescence 1 ply | 53 | 1 | 5 | **red** (was survivor) |
| W3 | depth cap 2 | 35 | 1 | 23 | red (stays) |
| W4 | depth cap 3 | 44 | 1 | 14 | **red** (was survivor) |
| W5 | depth cap 4 | 48 | 1 | 10 | **red** (was survivor) |
| W6 | N↔R values | 54 | 1 | 4 | red (stays) |
| W7 | Q = 300 | 50 | 1 | 8 | red (stays) |
| W8 | P = 300 | 53 | 1 | 5 | red (stays) |
| W9 | eval ignores side | 46 | 1 | 12 | red (stays) |
| W10 | PST off | 58 | 0 | 0 | survives (not required) |
| W11 | mate score ignores ply | 58 | 0 | 0 | **survives** |
| W12 | interior mate = stalemate | 48 | 1 | 10 | red (stays) |
| W13 | LMR reduces checks | 55 | 1 | 3 | **red** (was survivor) |
| W14 | LMR reduces by 2 | 56 | 1 | 2 | **red** (was survivor) |
| W15 | TT accepts shallower | 35 | 1 | 23 | red (stays) |
| W16 | ordering off | 48 | 1 | 10 | **red** (was survivor) |

- **The old reds:** all 7 stay red.
- **The survivors: 8 of 10 now go red.** `W1`, `W1b`, `W4` and `W5` are all among them. From the
  optional set, `W2`, `W13`, `W14` and `W16` went red (4 of 5; the bar is ≥ 2). **The stop rule did
  not fire.**
- **`A5` holds under every red weakening.** No weakening produced a `NEWLY-SOLVED` line, and the
  `NEWLY-MISSED` lines name exactly the missed rows that the baseline records as solved.
- The plain-node prediction (`curation/predicted-a3-plain-node.txt`) matched every count.
- Thin margins: `W14` is red by 2 rows and `W13` by 3. Both runs are deterministic.

## `A4` — headroom

- At the recorded config: **58/62 solved**, so solved = total − 4 (the bar is ≤ total − 3). The
  original 40 read **40/40**.
- `ABC-084` `A1` passes: mates 10/10. `ABC-084` `A2` passes: 0/24 losing. `PUZZLE_DEEP=weakened`
  is red.
- **4× run** (budget 25, step 0.25; baseline edited in the tree, run, then `git checkout`):
  **62/62 > 58**. It printed four `NEWLY-SOLVED` lines, one per headroom row, and lost nothing.
  The gating run took 119.6 s, the whole run 133.0 s, at load1 6.9 → 11.8
  (`raw-a4-4x-step0.25.txt`). This is a reading, not a lane row.

## `A5` — baseline in its own commit

- `47433c5` touches only `src/puzzle-suite.baseline.json` (+14/−7), and its message states the
  reason. It records the count, total, budget, step, `unsolved` (4 names), commit, machine, load,
  gating wall and whole-lane wall.
- **Not a lowering:** the count went 40 → 58.

## `A6` — determinism

- Three separate processes at `47433c5`: all 62 per-row lines (move, depth, nodes) are
  `cmp`-identical. They are also identical to the three baseline-measuring processes at
  `e1f5732`.
- The step-guard rows (5) are green in the default lane.

## `A7` — the price, as readings

| run | load1 start → end | gating | whole lane (vitest) | process real |
|---|---|---|---|---|
| `a6-process1` | 7.56 → 5.53 | 20.34 s | 32.10 s | 32.72 s |
| `a6-process2` | 5.53 → 4.19 | 20.44 s | 32.17 s | 32.71 s |
| `a6-process3` | 4.19 → 6.50 | 20.76 s | 33.53 s | 34.13 s |
| baseline runs (recorded in the file) | 7.4–7.8 → 7.4–14.4 (5-min 22–38) | 26.0 / 29.0 / 33.5 s | 40.9 / 54.6 / 47.2 s | 41.6 / 55.5 / 47.8 s |

- **Every reading is under the caps:** ≤ 45 s gating and ≤ 90 s whole lane.
- **Nothing is asserted.** Every deep row keeps a 300 s guard.
- **Where the extra time goes:**
  - the mate-in-3 oracle costs 6.8–17.6 s, the most load-sensitive part;
  - the win-material oracle costs 4.4–7.5 s.
- **The baseline file carries the noisier readings.** They are what that measuring commit saw.

## `A8` — `N8-LANE` (`probe/n8/`, the `secnfr-ABC-084` protocol shape)

**Instrument.** Arms were `git archive`d out of tree, with `node_modules` linked:
- **A** = `47433c5`;
- **N** = a copy of A, `diff -rq` clean;
- **B** = base `4a64dd9`.

Each run was a fresh `npx vitest run --dir src`, with order rotated, round 0 discarded and counts
asserted.

**The lane:** 0 new test files, so the net charge is the gross charge.
- 8 rounds: **A − B +435 ms gross = net**, sign 6/8.
- Null N − A −0.14 % (admissible).
- Medians: A 27.6 s CPU, B 27.3 s CPU.
- **Contended:** load1 before runs was min 5.6, median 15.1, max 59.6.
- **Under the 650 ms bar**, but at this load the lane instrument cannot separate it from zero.

**One file alone** (`src/puzzle-suite.test.ts`), 12 rounds, load1 7.5–9.3:
- **A − B +30 ms**, sign 7/12;
- 12 tests against 9;
- 1.445 s against 1.42 s median CPU.

The content added to the default lane is three cheap rows plus 22 data rows. The oracle rows are
deep-only.

**The bar is Security/NFR's to read.**

## `ADR-0033` (coordinator's ask)

The 22 new rows pass the six rules (`probe/adr0033-rows.out.txt`). The two existing defects are
named and left untouched (decision `…558e9520` D6).

## `src/` numstat, base `4a64dd9` → `47433c5`

| file | added | removed |
|---|---|---|
| `src/puzzle-corpus.ts` | 50 | 1 |
| `src/puzzle-suite.test.ts` | 202 | 2 |
| `src/puzzle-suite.baseline.json` | 14 | 7 |

Trigger-list files (`engine`, `search*`, `evaluate*`, `quiescence`, `transposition`): **0 lines**.
