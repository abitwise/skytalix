# qe-ABC-274 A6 (`G6` at `LEVELS[5]` 4 000 ms, graded "≥ base") under PREREG `…4b732a08`: **MET**. Head kiwipete 9 × 5, position-6 10 × 5; medians equal base (9 / 9, 10 / 10); no run below depth 6, none at 7 or below (0 WARN); the same move every run (Bxa6, Nd5). nps at 4 000 ms (report): head 844–875 / 847–867 nodes per ms against base 858–889 / 830–858

QE/E2E, task `qe-ABC-274`, right after A5, same ALONE window, one `flock …/host-test.lock` hold for the whole session (14:06:56Z–14:13:04Z; `uptime` load1 0.83 at start, 0.55 at end). Raw: `raw/out/g6/g6.jsonl`, `wait.log`, `grade.json`; scripts `qe-ABC-268`'s `g6.mjs` / `timed.mjs` / `host.mjs` unchanged, and `raw/scripts/grade-g6.mjs` (`qe-ABC-269`'s, with "median head ≥ base" added to the verdict, as A6 grades it).

## Instrument
5 interleaved rounds; each a kiwipete pair then a position-6 pair; base first in odd rounds, head first in even; one fresh plain `node` process per search; wait-clear before every read (0 vitest, 0 cutechess-cli, load1 ≤ 2.0, Tctl ≤ 60.0). `timed.mjs` accepted both trees (`LEVELS[5].budgetMs` = `DEFAULT_BUDGET_MS` = 4 000, blunder rate 0). Width 1. Base = `main` `src/` `4d6b117b`; head = `grugops/ABC-274` `src/` `4cb84035` (the repair head itself).

## Readings (depth completed per run)
| board | base | head | median base / head | median nodes base / head | nodes per ms base / head | move |
|---|---|---|---|---|---|---|
| kiwipete | 9 9 9 9 9 | 9 9 9 9 9 | 9 / 9 | 3 461 849 / 3 446 489 | 858–889 / 844–875 | Bxa6 every run |
| position-6 | 10 10 10 10 10 | 10 10 10 10 10 | 10 / 10 | 3 398 427 / 3 412 763 | 830–858 / 847–867 | Nd5 every run |

- Every run's `ms` 3 999.8–4 001.0. load1 before each read 0.39–0.83. Tctl over reads: median 55.1, max 71.8; no thermal stop. Each read waited one 15 s poll for Tctl ≤ 60 (logged in `wait.log`); no precondition timeout.
- **Graded: medians ≥ base on both boards, every head run ≥ 6: MET.** WARN (depth ≤ 7): 0 runs.
- Residual risk (as in `qe-ABC-269`): a board on a depth edge can flip its median on a few percent of nodes; neither board is on an edge at 4 000 ms (both builds complete the same depth in every run, with about 3.4 M nodes).
