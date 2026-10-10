---
id: 20261009T213713Z-software-engineer-observation-abc084-gates-criteria-baseline-n8lane-26f28829
kind: observation
by: software-engineer
at: 2026-10-09T21:37:13Z
verified_by: 
confidence: high
refs:
  - ABC-084
  - ABC-079
  - ADR-0027
  - N8-LANE
  - NFR-008
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
supersedes: 
---

# `ABC-084` build: gates green, `A1`–`A7` met, three processes identical, `N8-LANE` +120 / +400 / +790 ms net

Hand-authored, no seal. Tip `a287461` (code `b3321f0`). Machine: Apple M3, 8 cores, 16 GiB, macOS
26.5.2, Node v26.11.0. The load came from other agents' lanes plus Spotlight. Raw files sit beside
this note.

## Gate (Workflow 05 order, `raw-out-gate.txt`)

| step | result |
|---|---|
| host protection | exit 2, `UNKNOWN - verify` (no remote). Never a pass |
| `npm run lint` | exit 0, 97 files |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 |
| `npm test` | exit 0, **50 files, 1539 passed**, 7.3 s. The base `7b54dae` reads 49 / 1530 (harness arm B); the change is +1 file and +9 rows |
| skip count | `0` |
| skip integrity | `No findings.`, exit 0 |
| e2e / UAT spec integrity | not applicable (no UI, no `*.uat.spec.ts`) |

## Opt-in lanes

- **`SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`** (the corpus moved): exit 0, **37 passed
  (29 default)**, 2.7 s. This matches `AGENTS.md`. `A1` at depth 3 reads 0/24 losing with
  quiescence and 0/24 without it. The default arms are green (0/24, and 24/24 for the bare leaf).
- **`PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`**: exit 0, 12 passed (9 default), in
  **three separate processes** between 21:18:44Z and 21:19:25Z at load1 3.9–4.3:
  - each read solved **40/40**;
  - wall was 13.20 / 13.01 / 12.23 s in vitest (14.2 / 13.9 / 13.2 s process real);
  - the 40 per-puzzle lines (move, depth, nodes) are **`cmp`-identical** across the three
    (`raw-out-a4-process{1,2,3}.rows.txt`).
- **`PUZZLE_DEEP=weakened`** (`A3`): exit **1**, the gate row is red (`expected 10 to be >= 40`), and
  the `A3` row is green. Solved **10/40**: all 10 mates are still found, because mate scores do not
  come from `evaluate`, and all 30 material rows are lost. 10.7 s at load1 16.9.

## Criteria

| # | reading |
|---|---|
| `A1` | **10/10** mate-in-2 found. Depths 5–7, ~44–46 k nodes per move |
| `A2` | **0/24 losing** on the do-not-hang rows (bar ≤ 1). Win-material **6/6** |
| `A3` | weakened 10/40 < 40, red, exit 1, **10.4–10.7 s** (≤ 60) |
| `A4` | three processes identical. The step guard refuses 0.049@50, 0.001@2, `NaN` and 0 before any search, and accepts the bound 0.05@50 |
| `A5` | **12.2–13.2 s** gating run (≤ 60); load recorded in the baseline |
| `A6` | every row has a FEN, its accepted or losing move, a class and a source. The mate keys are re-proven in the default lane |
| `A7` | `src/puzzle-suite.baseline.json` holds 40/40, budget 25, step 1, measured at `b3321f0` (descends from `0de4a93`), with machine, load and wall. Its own commit `a287461` touches only that file and states a reason |
| `A8` | Scribe's. The line is drafted in claim `…a9bf6ab2` |

## Found on the shared rows (reported, not fixed)

Two of ABC-079's 24 rows start **in check**, which contradicts their doc comment:
- `R takes a bishop a pawn defends` (`4k3/8/1p6/b7/…`): Ba5 checks Ke1;
- its mirror (`r3k3/8/8/8/B7/…`): Ba4 checks Ke8.

Both are still valid do-not-hang rows: the losing capture takes the checker and is legal, and ABC-079
`A1` only asserts legality. They move byte-identical (`ADR-0028`), so the suite's not-in-check row
applies to its own additions only.

## `N8-LANE` (standing instrument, `raw-harness-lane084.mjs.txt`)

The instrument is CPU (user + sys) of `npx vitest run --dir src`, one fresh process per run, rotated,
9 rounds with round 0 discarded. The arms:
- A = `a287461` (50 / 1539);
- N = a byte copy of A (`diff -rq -x node_modules` clean);
- B = `7b54dae` (49 / 1530).

Net is the gross figure minus a 160 ms floor for one new test file. There are no spawns.

| run (UTC) | load1 median | null N − A | charge A − B (gross, sign) | **net** |
|---|---|---|---|---|
| 1 (21:21–21:27) | **53.7** (9–75) | +0.36 %, 5/8 | +950 ms, 8/8 | **+790 — over 650** |
| 2 (21:28–21:32) | 31.3 | −0.62 %, 3/8 | +560 ms, 6/8 | **+400** |
| 3 (21:32–21:36) | 24.3 | +0.39 %, 5/8 | +280 ms, 6/8 | **+120** |

- **All three are admissible by the null rule** (≤ 1.5 %).
- The lane CPU was 32–37 s, against ~15 s on a quiet machine, so contention inflates the charge with
  everything else.
- The charge falls as the load falls.
- **Direct attribution in vitest:** the new file's rows sum to 174 / 205 / 240 ms over three runs.
  The `A6` mate oracle is ~157 ms of that, and every other row is ≤ 5 ms.
- The data module adds no test file. `src/quiescence.test.ts` only swaps a literal for an import.
- **Reading: the median of the three runs is +400 ms net, under 650, but run 1 is over.** A
  quiet-machine run was not available.
