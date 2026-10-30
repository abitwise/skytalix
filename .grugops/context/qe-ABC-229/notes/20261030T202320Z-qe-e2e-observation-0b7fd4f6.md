---
id: 20261030T202320Z-qe-e2e-observation-0b7fd4f6
kind: observation
by: qe-e2e
at: 2026-10-30T20:23:20Z
verified_by: 
confidence: high: read from the committed raw records under .grugops/context/qe-ABC-229/raw/; an observation, because no §14-gate verdict stamps this run
refs:
  - qe-ABC-229
  - ABC-229
  - EPIC-010
  - ADR-0053
  - grugops/ABC-229
  - grugops/qe-ABC-229
  - e196a281
  - f6ff1c4a
  - b92a3394
  - Q-SET
  - A1
  - A2
  - A3
  - A4
  - A5
  - G1
  - G5
  - G6
  - G8
  - G9
  - G11
  - S-1
  - S-2
  - S-3
  - S-4
  - NFR-004
  - NFR-005
  - NFR-008
  - qe-ABC-229/20261030T162159Z-qe-e2e-decision-8ecd4ea6
supersedes: 
seal: sha256:d96b9ea331f0c3b41670ae7238dd4eea21fc86f57cbe5447a98ff7fbb4c4f255
---

# qe-ABC-229 gates and timing: lint, typecheck, build, npm test 2 322/2 322, 16/16 deep lanes, G1 54/58, A3 1.019×/1.000×, G5 4 001 ms, G9 identical, G8 head 9.90 s (base 9.90 s, MET with 0.10 s headroom), G6 MET at 4 000 ms (8 = 8, 10 = 10), G11 5/5

QE/E2E, task `qe-ABC-229`. This note covers PREREG §§ 3–5 (`…8ecd4ea6`). Head is `e196a281`; base is `b92a3394`. Before G8, before G6 and before the smokes, `git diff b92a3394 main -- src data tools package.json package-lock.json` was empty (`main` `461a013b`).

Read by the first QE run (16:22Z–17:42Z). The resumed QE run checked these figures against the records on 2026-10-30 (`g8.log`, `g6.jsonl`, `deep/runs.log`, the gate outputs). Nothing here was re-run, and nothing differed.

## Mandatory gates (`npm run …`, in the worktree)
- `npm run lint`, `npm run typecheck` and `npm run build` each exit 0. `npm test` exits 0 with 63 files and **2 322 / 2 322** passed. That is the combined tree: SE's 2 270 at `f6ff1c4a` plus `main`'s `ABC-220` rows.
- **Skips:** 0 (`.test-results/last-run.json`). `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` reports `No findings.`
- **G9:** `git diff b92a3394 e196a281 -- src/levels.ts tools data package.json package-lock.json` is empty. On head, `LEVELS[5]` = `{ budgetMs: 4_000, blunderRate: 0 }`, `DEFAULT_BUDGET_MS` = 4 000 and `HARD_CEILING_MS` = 32 000. Met, with no waiver.
- **No real-clock row in the default lane:** every new `chooseMove` call in the test diff goes through `deepenWith`, which uses `now: () => 0`. Met (`ADR-0053` d9).

## Deep lanes (`raw/deep/`, one file per run, local vitest entry, heap 400, wait-clear before each lane): 16/16 green

| lane | result |
|---|---|
| `SEARCH_DEEP` quiescence | 116/116 |
| `SEARCH_DEEP` search.null-move | 44/44 |
| `SEARCH_DEEP` search | 57/57 |
| `SEARCH_DEEP` search.ordering | 43/43 |
| `SEARCH_DEEP` search.pvs-lmr | 29/29 |
| `SEARCH_DEEP` transposition | 40/40 |
| `ENGINE_DEEP` quiescence | 99/99 |
| `ENGINE_DEEP` search.ordering | 30/30 |
| `ENGINE_DEEP` search.pvs-lmr | 21/21 |
| `ENGINE_DEEP` transposition (G7) | 26/26 |
| `PUZZLE_DEEP` | 18/18 |
| `ENGINE_DEEP` engine | 77/77 |
| `ENGINE_DEEP` levels | 45/45 |
| `CLI_DEEP` | 11/11 |
| `UCI_DEEP` | 9/9 |
| `ENGINE_DEEP` uci-session (`ABC-220`, reported) | 206/206 |

- **G1:** "solved 54/58, baseline 54/58". No row was newly solved or newly missed.
- **A3** (bar ≤ 1.2×): kiwipete 330 314 / 324 162 = **1.019×**; position-6 154 466 / 154 464 = **1.000×**. Both equal the reference.
- **`ABC-229` drift on the 190** (bars ≥ 95 % within 25 cp, none beyond 12 cp):
  - `search()` d5: **100.00 %**, max **8 cp** (kiwipete/d2e3, 350 → 358), 0 flips.
  - `chooseMove` to d5: the same.
- **`ABC-228`'s re-pointed rows** read exactly `se-ABC-228`'s figures: 89.30 % / 118 cp and 88.77 % / 118 cp.
- **G5:**
  - Level 5, the A5 row (30 moves, real clock): **max 4 001 ms**, every move ≤ 5 000 ms. **MET** (≤ 4 031).
  - The engine A1 row at the default budget: worst 4 001 ms.
  - Levels 6 and 7, reported: max 5 001 ms and max 30 001 ms.
- **Host during the lanes:** a foreign vitest appeared twice, before `ENGINE_DEEP` quiescence and before search.ordering. The wait-clear waited on its PIDs (`kill -0`, 30 s and 105 s), so no lane started beside it.

## G8 (NFR-008): MET, 0.10 s of headroom (`raw/g8/`)
`npm test` wall, ALONE, interleaved b h h b b h, wait-clear before each run. Head ran in the worktree. Base ran in a full `git archive` of `b92a3394` that shares `node_modules`.

| run | build | wall | vitest Duration | tests |
|---|---|---:|---:|---|
| 1 | base | 9.64 s | 9.33 s | 2 297 / 2 297 |
| 2 | head | 9.82 s | 9.48 s | 2 322 / 2 322 |
| 3 | head | **10.03 s** | 9.71 s | 2 322 / 2 322 |
| 4 | base | 9.90 s | 9.57 s | 2 297 / 2 297 |
| 5 | base | **10.09 s** | 9.80 s | 2 297 / 2 297 |
| 6 | head | 9.90 s | 9.56 s | 2 322 / 2 322 |

- **Medians: head 9.90 s ≤ 10 s, base 9.90 s; head − base = +0.01 s.**
- **Per-file cost (median vitest time per file, head − base):** `src/quiescence.test.ts` **+22 ms** (93 → 115). `src/gameend.nfr.test.ts` −1, `src/search.null-move.test.ts` −53, `src/engine.test.ts` −18, the capacity files −1 and −5. Those last are within noise. This ticket's measurable cost is about 22 ms.
- **The budget is spent by the base.** `src/uci-session.test.ts` (`ABC-220`) takes about 2.0 s of test time per run. One base run and one head run each went over 10 s. The base median sat at 9.90 s before this ticket added anything (finding `QE-229-a`).
- **A VOID first session, QE's own fault and not counted:** QE's first base archive held only `src`, `data` and `tools`. Eight doc-reading rows went red there for want of `AGENTS.md` and `plans/`, so base was not comparable. That session's head runs were valid: 10.08, 9.67 and 9.78 s, median 9.78. Pooled with the graded three, the six head runs give a median of 9.86 s. The record is `raw/g8-void/g8.log.txt`.

## G6 graded, both builds at 4 000 ms (`raw/g6/g6.jsonl`): MET
5 rounds, interleaved, one fresh plain-node process per search, wait-clear before each search. `timed.mjs` checked `LEVELS[5]` = `DEFAULT_BUDGET_MS` = 4 000 on both trees.

| board | base depths | head depths | median base / head | nodes, median base / head | move and score |
|---|---|---|---|---|---|
| kiwipete | 8, 8, 8, 8, 8 | 8, 8, 8, 8, 8 | **8 / 8** | 3 144 168 / 3 111 661 | Bxa6, −59, on both |
| position-6 | 10 ×5 | 10 ×5 | **10 / 10** | 3 147 547 / 3 120 923 | Nd5, 73, on both |

- Head's median is ≥ base's on both boards. No run is below depth 6, and no head run is below 7.
- The longest search took 4 001.4 ms.

## G11 at 4 s, reported (`raw/g6/g11.jsonl`)
| before | base depth, move, score | head depth, move, score |
|---|---|---|
| 4.Qa4 | 11 d3 56 | 11 d3 56 |
| 8.e5 | 9 Be2 62 | 9 Be2 62 |
| 10.Ne4 | 9 exd6 7 | 9 exd6 7 |
| 13.d4 | 11 d4 −109 | 11 d4 −109 |
| 17.Kc1 | 11 Kc1 −215 | 11 Kc1 −215 |

Depth and move are equal on 5/5.

**Timing-session host:** Tctl median 56.8 °C and max 73.3 °C over the reads. The thermal stop did not fire.
