# qe-ABC-271 K4 (`G6` at `LEVELS[5]` 4 000 ms, graded "≥ base") under PREREG `…c55891e0`: **MET**. Head kiwipete 9 × 5 and position-6 12 × 5; medians equal base (9 / 9, 12 / 12); every head run at depth ≥ 9 (none below 6, 0 WARN at ≤ 7); the same move every run (Bxa6, Nd5). The instrument ran unchanged, with the 60 °C cool-down kept, not relaxed

QE/E2E, task `qe-ABC-271`, right after K3, one `flock <scratch>/host-test.lock` hold for the whole session (14:36:19Z–14:42:42Z). Raw: `raw/out/g6/g6.jsonl`, `wait.log`, `grade.json`, `session.txt`. Scripts: `qe-ABC-268`'s `g6.mjs` / `timed.mjs` / `host.mjs`, **byte-identical** to `qe-ABC-268/raw/qe-scripts/` (cmp), and `qe-ABC-270`'s `grade-g6.mjs` (sha256 `bb284999…`).

## Instrument
- 5 interleaved rounds; each a kiwipete pair then a position-6 pair; base first in odd rounds, head first in even.
- One fresh plain `node` process per search. `timed.mjs` accepted both trees (`LEVELS[5].budgetMs` = `DEFAULT_BUDGET_MS` = 4 000, blunder rate 0).
- Wait-clear before every read: 0 vitest, 0 cutechess-cli, load1 ≤ 2.0, **Tctl ≤ 60.0 °C, not relaxed** (the Engineer's 75 °C was not taken). Every one of the 20 reads waited one 15 s poll (Tctl 68–72 after the previous search) and then cleared at 40.4–47.1 °C.
- Tctl over the reads: median 57.8, max 72.3. No thermal stop. Width 1.
- Base = `main` `src/` `4fb3da04`; head = `grugops/ABC-271` `src/` `08e56302`.

## Readings (depth completed per run)
| board | base | head | median base / head | median nodes base / head | move |
|---|---|---|---|---|---|
| kiwipete | 9 9 9 9 9 | 9 9 9 9 9 | 9 / 9 | 2 777 368 / 2 787 608 | Bxa6 every run |
| position-6 | 12 12 12 12 12 | 12 12 12 12 12 | 12 / 12 | 2 627 657 / 2 644 041 | Nd5 every run |
- ms per run 3 999.4–4 001.3; load1 before each read 0.28–1.50.
- **Graded:** each median head ≥ base (9 ≥ 9, 12 ≥ 12); every head run ≥ 6 (minimum 9); 0 runs at ≤ 7. **MET.**
- **S2 nps beside it (reported, never graded, `…6ccd8243` item 2):** median nodes in 4 000 ms H / B are 1.0037 kiwipete and 1.0062 position-6. On these two boards (phase 24 at the root) the build searches as many nodes as `main`.
- **What K4 does not read:** both boards are full-material middlegames, where the loop runs only deep in the tree, once material comes off. The endgame cost (`QE-271-f`) is not read by any graded row. The K3 note reports it in search: 1.021 / 1.037 × ns per node on the endgame set at depth 9.
