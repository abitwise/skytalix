---
id: 20261010T115230Z-software-engineer-observation-abc087-gates-a1-a10-readings-n8-lane-not-met-25962b19
kind: observation
by: software-engineer
at: 2026-10-10T11:52:30Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ABC-084
  - ABC-085
  - ADR-0032
  - ADR-0027
  - ADR-0034
  - ADR-0035
  - NFR-004
  - NFR-005
  - N8-LANE
  - src/levels.ts
  - src/levels.test.ts
  - 20261010T112902Z-software-engineer-decision-abc087-levels-module-shape-table-values-two-corpora-4e5f0323
  - 20261010T115230Z-software-engineer-claim-abc087-agents-md-line-nfr004-wording-a4-bias-53ebd6d1
supersedes:
---

# `ABC-087` readings: gate green; `A1`-`A10` met; `ENGINE_DEEP=1` 25/25 in 199 s; `A3` easiest 35/62 vs default 58/62; `A5` max 4,527 ms; **`N8-LANE` NOT MET: +0.825 s CPU (0.78-0.85), R 0.060 s**

This note is hand-authored and unsealed. Branch `grugops/ABC-087-difficulty-levels` from `94cf5e6b`:
- `659215a3` adds the module and tests;
- `3a133d26` makes the default lane lighter and unbiased and makes the deep steps cheaper;
- the docs commit follows.

Machine: Apple M3, 8 cores, macOS (Darwin 25.5.0), Node v26.11.0, vitest 3.2.7. The QE (`ABC-058`) and
Security/NFR lanes ran on the same machine in parallel, so load1 is given with every reading. The raw
files are in `../probe/`.

## Gate (Workflow 05, at `3a133d26`; `raw-gates-3a133d26.log`)

| step | result |
|---|---|
| lint | exit 0, 100 files |
| typecheck / build | exit 0 / exit 0 |
| `npm test` | exit 0, **52 files / 1601 passed / 0 skipped**, 8.30 s real at load1 10.35 (at `659215a3`: same counts, 6.04 s at load1 4.32). This file adds 1 file and 20 default-lane tests |
| skip count | 0 (`jq '.numPendingTests + .numTodoTests'`) |
| `test-skip-integrity.js --skip-count 0` | `No findings.`, exit 0 |
| `lane-inventory.js` | 52 collected = 52 tracked, `No findings.`, exit 0 |

## Deep lanes the diff triggers

- **`ENGINE_DEEP=1 npx vitest run src/levels.test.ts`** (this ticket's own): exit 0, **25 passed (20
  default)**, 199.0 s real, load1 5.82 → 3.96 (`raw-deep-3-final.log`). An intermediate tree (before
  the corpus swap and the lazy imports) read 207.5 s at load1 5.90 → 4.32 (`raw-deep-2.log`). A5 accounts for 135 s of it, because it is 30 real
  moves of 4.5 s.
- **Not triggered:** `ENGINE_DEEP` on `src/engine.test.ts` and `CLI_DEEP` (no `src/engine.ts`,
  `src/virtual-clock.ts` or `src/cli.ts` change). `SEARCH_DEEP` (no `src/search.ts`).
  **`PUZZLE_DEEP=1` (option B): 0 trigger-list files in the diff**, so QE does not run it. `A3` is the
  only puzzle reading, per `ADR-0034` § Consequences.
- **Failed attempt, recorded so it is not retried:** `A3` at a 10 virtual ms step ran **321.7 s and
  failed on its 300 s guard**. The counts printed before the timeout were 35/62 and 61/62
  (`raw-deep-1-step10-a3-timeout.log`). Fixed at step 120 (decision note).

## Per criterion (at `3a133d26`)

| # | verdict | reading |
|---|---|---|
| `A1` | MET | `LEVELS` keyed `1`-`5` (frozen), each `{ budgetMs, blunderRate }` and nothing else. `EASIEST_LEVEL` 1, `DEFAULT_LEVEL` 3, `HARDEST_LEVEL` 5. Monotone: budgets never fall and rates never rise |
| `A2` | MET | Virtual clock, test note 3. Shipped path (50 readings per move): 102/100, 510/500, 3060/3000, 4080/4000, 4590/4500 → **+2.0 % each**. Blunder path at the easiest level (300 readings): over 20 children **101.3/100**, over 43 children **101.3/100**. All ≤ 5 000 |
| `A3` | MET (measurement) | `ABC-084`'s rule, one step of 120 virtual ms for both levels: **easiest 35/62, default 58/62**. The default's 58 equals the `ABC-084` baseline, because the default sits on its 25-reading config. Baseline JSON untouched |
| `A4` | MET | Default lane (`ENDGAMES`, 204 moves): **80 / (204 − 1) = 39.4 %** against 40 %, 1 no-candidate. Deep (perft 184 + puzzles 62 = 246 moves): **97 / (246 − 0) = 39.4 %**, 0 no-candidate. Every move legal. On every blunder and no-candidate move: never the worst class of its own list, the strict second-best (ties to first), the list = `legalMoves` order. Positions come back byte-identical |
| `A5` | MET | Hardest = 4 500 ms, rate 0. **30/30 ≤ 5 000 ms on the real clock, max 4,527 ms** (4,501-4,527; load1 ~4-6). The blunder clause does not apply (rate 0, asserted). Earlier runs: max 4,536 / 4,526 |
| `A6` | MET | `LEVELS[3].budgetMs === 3000 === DEFAULT_BUDGET_MS`. The rate is 0, and a rate-0 level returns `chooseMove`'s move, depth, nodes and elapsed reading-for-reading on the same clock (6 positions) |
| `A7` | MET | Seed 2026 over 30 positions: identical decision sequence on two runs, with ≥ 1 blunder in it |
| `A8` | MET | `git diff --numstat 94cf5e6b..3a133d26 -- src/`: `src/levels.ts` +182/−0 and `src/levels.test.ts` +484/−0 **only**. 0 lines in `cli.ts`, `cli-options.ts`, `turn-loop.ts`, `engine.ts` and `search.ts`. A test asserts the module's import set (no `virtual-clock.ts`) and checks its code with comments stripped: no `process.`/`argv`/`readline`/`prompt`/`stdin`/`stdout`/`console.` |
| `A9` | MET | 5 seeds × the same 30 positions → **5 distinct** sequences (≥ 2 required). It runs before `A7` in the file (test note 5) |
| `A10` | MET | Two instances, seeds 11 and 12, each on its own virtual clock, called A, B, A, B over 10 positions. Each gives the same moves as the instance run alone, **10/10 each**, and A's moves ≠ B's |

## Cost (`ADR-0035` decision 2, narrow set = `src/levels.test.ts`; `cost-readings.txt`, `runs-*.tsv`)

The harness (`harness.sh`, `analyse.mjs`) uses three out-of-tree trees:
- base, a one-assertion placeholder at the same path, so the reading is already net of the 160 ms floor;
- head;
- a twin of head, identical under `diff -r src`.

Each round runs `npx vitest run src/levels.test.ts`, CPU = user + sys. There are 9 rounds in rotated
order, and round 0 is discarded (n = 8, k = 2). Counts are asserted (1 / 20 / 20), and load1 is logged
before every run.

| tree | treatment median | sign | interval x(2)..x(7) | twin null | twin sign | R | load1 | state vs 650 ms |
|---|---:|---:|---|---:|---:|---:|---|---|
| **`3a133d26` (shipped)** — `runs-v3` | **+0.825 s** | 8/8 | **0.78-0.85** | +0.54 % | 4/8 | **0.060 s** | 5.56-6.31 | **NOT MET** (admissible; resolves; lower end 0.78 > 0.65) |
| intermediate (lighter corpus, eager imports) — `runs-v2` | +0.810 s | 8/8 | 0.78-0.89 | −1.31 % | 3/8 | 0.090 s | 8.74-10.03 | NOT MET |
| first draft (`659215a3`) — `runs-v1` | +0.995 s | 8/8 | 0.90-1.03 | −1.49 % | 1/8 | 0.080 s | 8.67-10.00 | NOT MET (null sign 1/8 is off chance; admissibility doubtful) |
| variant: the default-lane `A4` run moved under `ENGINE_DEEP` (NOT shipped) | +0.540 s | 8/8 | 0.47-0.57 | **−1.92 %** | 2/8 | 0.040 s | 5.35-6.37 | **inadmissible** (null > 1.5 %); indicative only |

- **Where the cost is.** Importing the engine and building `ENDGAMES` cost ~0.17 s (a `-t A1`-only
  run: 1.20 s against the base's 1.03 s). The rest is content. Under vitest, a blunder costs ~2.5 ms
  (warm plain node: ~0.5 ms; the vitest transform plus cold JIT is the multiplier). The criteria's
  own default-lane counts need about 170 blunder moves: `A4` ≥ 200 moves at 0.40, `A9` 5 × 30,
  `A7` 2 × 30, and `A10`.
- **The bar is not reachable with `A4` in the default lane as the ticket places it.** The only lever
  measured below the bar moves a criterion between lanes, and that is not mine to move (stop condition:
  report it, do not lower it). See the claim note for the routing.
- **Spawn account:** 0 children. **Floor account:** +1 file × 160 ms, charged by count.
