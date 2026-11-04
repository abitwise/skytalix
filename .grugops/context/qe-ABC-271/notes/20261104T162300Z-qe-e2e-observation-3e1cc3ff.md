---
id: 20261104T162300Z-qe-e2e-observation-3e1cc3ff
kind: observation
by: qe-e2e
at: 2026-11-04T16:23:00Z
verified_by: 
confidence: high: qe-ABC-268's G6 scripts byte-identical, Tctl 60.0 cool-down kept, 5 interleaved rounds, 20 fresh processes; graded by qe-ABC-270's grade-g6.mjs
refs:
  - qe-ABC-271
  - grugops/qe-ABC-271
  - grugops/ABC-271
  - ABC-271
  - EPIC-011
  - E4a
  - ADR-0070
  - ADR-0067
  - ADR-0046
  - ADR-0035
  - R-281-a
  - K0
  - K1
  - K2
  - K3
  - K4
  - F1
  - F2
  - F3
  - G1
  - G2
  - G6
  - S2
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - QE-271-a
  - QE-271-b
  - QE-271-c
  - QE-271-d
  - QE-271-e
  - QE-271-f
  - QE-271-g
  - QE-271-h
  - QE-271-i
  - QE-271-j
  - QE-271-k
  - QE-271-l
  - UAT
  - main/d2f01e7c
  - src/4fb3da04
  - 10f29a82
  - src/08e56302
  - 9644b44c
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.passer.test.ts
  - src/evaluate.passer-fixtures.json
  - src/evaluate.taper.test.ts
  - src/evaluate.pawns.test.ts
  - src/transposition.test.ts
  - qe-ABC-271/20261104T143423Z-qe-e2e-decision-c55891e0
  - qe-ABC-271-freeze/20261104T133856Z-qe-e2e-decision-67b5eeac
  - qe-ABC-271-freeze/20261104T133902Z-qe-e2e-observation-a8173b00
  - se-ABC-271/20261104T142439Z-software-engineer-decision-2340385e
  - se-ABC-271/20261104T142439Z-software-engineer-observation-d3690ae6
  - se-ABC-271/20261104T142439Z-software-engineer-observation-863fb251
  - se-ABC-271/20261104T142439Z-software-engineer-observation-4e7d2740
  - orch-2026-10-30a/…730399e5
  - orch-2026-10-30a/…6ccd8243
  - sha256:bf3c205bf4106209e3151717d93542180d90d344cecfdfbb6f2a30c9d5db887a
supersedes: 
seal: sha256:f5a7145f595a8b6c9074a331061d2832c7e9233674e534bef650b9c082fb9eb0
---

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
