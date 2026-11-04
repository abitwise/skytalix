# qe-ABC-270 K4 (`G6` at `LEVELS[5]` 4 000 ms, graded "≥ base") under PREREG `…f8ab73a7`: **MET**. Head kiwipete 9 × 5, position-6 10 × 5; medians equal base (9 / 9, 10 / 10); every head run at depth ≥ 9 (none below 6, 0 WARN at ≤ 7); the same move every run (Bxa6, Nd5). The instrument ran unchanged, with the 60 °C cool-down kept

QE/E2E, task `qe-ABC-270`, right after K3, one `flock <scratch>/host-test.lock` hold for the whole session (00:35:55Z–00:42:18Z). Raw: `raw/out/g6/g6.jsonl`, `wait.log`, `grade.json`, `session.txt`. Scripts: `qe-ABC-268`'s `g6.mjs` / `timed.mjs` / `host.mjs`, **byte-identical** to `qe-ABC-268/raw/qe-scripts/` (cmp), and `qe-ABC-274`'s `grade-g6.mjs`.

## Instrument
5 interleaved rounds; each a kiwipete pair then a position-6 pair; base first in odd rounds, head first in even; one fresh plain `node` process per search; wait-clear before every read (0 vitest, 0 cutechess-cli, load1 ≤ 2.0, **Tctl ≤ 60.0**, not relaxed). `timed.mjs` accepted both trees (`LEVELS[5].budgetMs` = `DEFAULT_BUDGET_MS` = 4 000, blunder rate 0). Width 1. Base = `main` `src/` `4cb84035`; head = `grugops/ABC-270` `src/` `0f393c18`.

## Readings (depth completed per run)
| board | base | head | median base / head | median nodes base / head | nodes per ms base / head | move |
|---|---|---|---|---|---|---|
| kiwipete | 9 9 9 9 9 | 9 9 9 9 9 | 9 / 9 | 3 447 513 / 3 463 897 | 843–878 / 852–874 | Bxa6 every run |
| position-6 | 10 10 10 10 10 | 10 10 10 10 10 | 10 / 10 | 3 352 347 / 3 433 243 | 836–856 / 841–864 | Nd5 every run |

- `ms` 3 999.4–4 000.9 on every run. load1 before each read 0.31–1.56. Tctl before each read 39.5–45.3 °C; over all reads median 56.6, max 73.1; no thermal stop. Every read waited one or two 15 s polls for Tctl ≤ 60 (20 wait lines in `wait.log`); no precondition timeout.
- Host at start: load1 1.20, Tctl 74.0; at end: load1 0.61, Tctl 69.5. Top CPU users as in K3 (`abtop` foreign, not touched).
- **Graded: both medians ≥ base, every head run ≥ 6: MET. WARN (depth ≤ 7): 0 runs.** `NFR-005`'s floor holds with three plies to spare.
- Residual risk (as `qe-ABC-274`): a board on a depth edge could flip its median on a few percent of nodes; neither board is on an edge (both builds complete the same depth in every run, at about 3.4 M nodes). The trees are node-identical (K0), so a median difference could only come from speed.
