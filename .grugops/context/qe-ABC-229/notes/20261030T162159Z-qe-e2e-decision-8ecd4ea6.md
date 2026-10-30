---
id: 20261030T162159Z-qe-e2e-decision-8ecd4ea6
kind: decision
by: qe-e2e
at: 2026-10-30T16:21:59Z
verified_by: 
confidence: high: written before any timed read, value read on the delivered build, or game; bars copied from ABC-229 A1-A5 (RE-SCORED 2026-10-30), ADR-0053 d5-d10 and EPIC-010 § The merge rule
refs:
  - qe-ABC-229
  - ABC-229
  - EPIC-010
  - ADR-0053
  - ADR-0026
  - grugops/ABC-229
  - e196a281
  - f6ff1c4a
  - b92a3394
  - 01c37946
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
  - qe-ABC-229-qset/20261030T144215Z-qe-e2e-decision-fd9819a5
  - se-ABC-229/20261030T161118Z-software-engineer-observation-292fc055
  - se-ABC-229/20261030T161118Z-software-engineer-observation-3a1286b6
  - se-ABC-229/20261030T161118Z-software-engineer-observation-dbc87a5b
  - qe-ABC-228-ii/20261030T093852Z-qe-e2e-decision-45da5a05
supersedes: 
seal: sha256:15ec2f1136fa3e196bdd438d7989a1579a64d8a2d770c7ce432850d302ff511f
---

# qe-ABC-229 PREREG: the Q-SET gate, QE's own breaking reads, the gates (G8 first), graded G6 at 4 000 ms on both sides, G5, G11, then the A5 smoke pair. Sealed before any timed read, value read or game

QE/E2E, task `qe-ABC-229`. This note is written and sealed before any timed read (G8, G5's real-clock lanes, G6, G11), before any quiescence value or node count is read on the delivered build, and before any game. Before this note QE ran only: `readContext` on `qe-ABC-229` (0 notes), `qe-ABC-229-qset` (2) and `se-ABC-229` (5); `npm ci --ignore-scripts --offline` in the worktree; `git archive` of the two trees into the scratchpad; the sha256 check of the two tool binaries (both equal the harness pins `dc776901…` and `c78c22a9…`; paths not recorded; the env file is outside the repo, mode 600); and a source read of the delivered diff.

The contract is `ABC-229` A1–A5 with the 2026-10-30 RE-SCORED block, `ADR-0053` d5–d10, the frozen `Q-SET` (`qe-ABC-229-qset` `…fd9819a5`) and `EPIC-010` § The merge rule. The brief is `.grugops/queue/claimed/qe-ABC-229.md`. The predecessor's scripts (`qe-ABC-228-ii` `raw/qe-scripts/`) are reused, with the changes in § 9.

## The builds
- **Candidate:** `grugops/ABC-229` @ `e196a281` (code `f6ff1c4a` on `01c37946`, then `main` `b92a3394` merged in, no conflicts). **Base:** `b92a3394`.
- `git diff b92a3394 main -- src data tools package.json package-lock.json` is empty when this is written (`main` `461a013b`), and `b92a3394` carries `ABC-241` (`e7b22c11`) and `ABC-220`. So the candidate head is the build as it would merge, on a `main` that carries `ABC-241` (the ticket's § Dependencies). QE re-checks this before G8, before G6 and before each smoke. If `main` moves in `src`, `data` or `tools`, QE stops and reports.
- `git diff b92a3394 e196a281` touches 11 `src/` files only (4 production: `legal.ts`, `quiescence.ts`, `search.ts`, `engine.ts`; 7 test files). No `tools/`, `data/` or level change.
- QE's branch is `grugops/qe-ABC-229` from `e196a281`, in its own worktree. No `src/`, `tools/` or `data/` edit.

## 1. The Q-SET gate (A2)
- **(a) Source.** The `Q_SET_PROMOTIONS` table in `src/quiescence.test.ts` at `e196a281` holds QP-1..QP-9 with the frozen fixture's FEN, static, old and new, row for row (read mechanically from the source text by `qset-head.mjs`, against `raw/qset/qset-229-frozen.json` of `qe-ABC-229-qset`, sha256 `7ba64d89…`).
- **(b) Values on the head build.** For each row: head `quiesce` under the shipped record = frozen new = QE's plain-negamax reference (new rule); head `quiesce` under `{ evasions: true, quietPromotions: false }` = frozen old = QE's reference (old rule) = base's shipped `quiesce`; the safe rows read ≥ static + 600 and the pre-`ABC-229` record reads the static score. QP-7 at ply 5 reads 29 994. The INFO row `kpk-b6c6`: `search(…, 8)` 902, `searchWithoutQuietPromotions` 186.
- **(c) Lanes.** The rows are green in `npm test` and in the `SEARCH_DEEP` / `ENGINE_DEEP` quiescence lanes.
- **Pass:** every check holds. A mismatch is an `A2` FAIL unless it is QE's own predicate.

## 2. QE's own breaking reads (no clock)
- **(a) A1 door identity spot-check** (`a1spot.mjs`, QE's, independent of the SE's `a1.mjs`): head `searchWithoutQuietPromotions` = base `search()` at depths 1–4, head `chooseMoveWithoutQuietPromotions` = base `chooseMove` on a frozen clock to depth 4, and head `searchWithoutQuiescenceEvasions` = base's at depth 3, node, score, move and depth, on 19 positions: the six standard roots, three promotion-rich roots, the KPK INFO row and the nine Q-SET rows. **Pass:** 0 rows differ, and head `search()` differs from base `search()` on at least one row (non-vacuity).
- **(b) List sweep** (`sweep.mjs`): every node of perft-style trees from ten roots (start, kiwipete, positions 3, 4, 4-mirrored, 5, the promotion perft position, eight pawns each on the 7th/2nd, a pinned b7 pawn, blocked 7th-rank pawns) at depths 3–4. At each node `legalCapturesAndQueenPromotions` must equal `legalCaptures` in order, then the legal quiet queen promotions derived independently from `legalMoves` by `from` ascending, and the position must be unchanged. **Pass:** 0 mismatches, 0 mutations, and at least 1 000 nodes carry a quiet queen promotion (non-vacuity).
- **(c) Value sweep:** up to 400 distinct positions from (b) with a legal quiet queen promotion, evenly spread. Head `quiesce` (shipped) = QE's plain negamax (new rule); head `quiesce` (pre-`ABC-229` record) = QE's plain negamax (old rule) = base's shipped `quiesce`. Reference nodes are capped at 200 000 per position, and a capped position is counted as skipped, never as a pass. **Pass:** 0 mismatches, and at least 200 positions read.
- **(d) Planted faults** (`plant.mjs`, scratch copies only): three of the SE's (P2 quiet promotions at qply 0 only; P3 a second `legalMoves` pass; P5 quiet under-promotions included) and two of QE's own (QE1: quiet promotions only when no capture is legal; QE2: the empty-square test on the promotion square removed). Each copy runs `src/quiescence.test.ts` and `src/gameend.nfr.test.ts` one file at a time, then QE's sweep `--list-only`.
  - **Pass for the SE's three:** each is red in the default lane, as `se-ABC-229/raw/plant.txt` says. A plant the SE recorded red that stays green here is a finding (MEDIUM: the recorded test strength is not real).
  - **QE's two are a probe, not a bar.** If the default lane stays green on either, that is a test-strength gap. It is LOW if QE's sweep reds it (the behaviour is pinned by QE's evidence, the suite misses it), and it is reported either way. It is non-blocking unless the delivered build itself carries the fault, which (b) and (c) decide.
- **(e) A3, reported:** `search(…, 6).nodes` against `searchWithoutQuietPromotions` on kiwipete and position-6, read in the `SEARCH_DEEP` quiescence lane. Bar ≤ 1.2×. Reference 1.019× / 1.000×; a reading more than 3 % off is reported with its cause.

## 3. Gates at `e196a281` (via `npm run …`)
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`: each exits 0.
- **Skip integrity:** the skip count (`.test-results/last-run.json` `numPendingTests + numTodoTests`) is 0, and `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` reports `No findings.`
- **Deep lanes, one file at a time** (`deep.mjs`): `node ./node_modules/vitest/vitest.mjs run <file>` with `NODE_OPTIONS=--max-old-space-size=400` and the lane flag, never `npx` or `npm exec`. Wait-clear before every lane. The predecessor's 15 lanes, plus `ENGINE_DEEP src/uci-session.test.ts` (`ABC-220`'s A11 lane, now in the combined tree, reported). **Pass:** each lane is green.
  - **G1:** ≥ 54/58. A newly solved row is reported; a newly missed row is classed under `ADR-0034`.
- **G5** (`ADR-0053` d10, NFR-004 at ≤ 4 s): the `ENGINE_DEEP` `src/levels.test.ts` A5 row (level 5, real clock) and the `src/engine.test.ts` real-clock rows are green. Level 5's max ms is read from the lane log. **MET:** max ≤ 4 031 ms (4 s plus `AR-NFR004-A`'s ≤ 31 ms overshoot) and every move ≤ 5 000 ms. **WARN:** 4 031 < max ≤ 5 000, reported. **FAIL:** any move > 5 000 ms, or a red row. Levels 6 and 7 are reported.
- **G9:** `src/levels.ts`, `tools/` and `data/` byte-identical between base and head (`LEVELS[5]` = `{ 4000, 0 }`, `DEFAULT_BUDGET_MS` 4 000, `HARD_CEILING_MS` included). No waiver.
- **G7 (reported):** `ENGINE_DEEP` transposition green.

## 4. G8 (NFR-008), the named risk. Run FIRST of the timed reads
- `npm test` wall, 3 runs per build, interleaved (base, head, head, base, base, head), ALONE, wait-clear before each run. Head runs in the worktree; base runs in QE's `git archive` of `b92a3394`, which shares the worktree's `node_modules` (the predecessor's method, so the reading is comparable with `ABC-228`'s 9.61 s).
- **Pass:** head's median ≤ 10 s. The head − base median delta is reported, and so is the per-file cost: each file's median vitest time, head − base, largest first.
- **Head median > 10 s → G8 FAIL and STOP before G6 and the smokes**, with the per-file cost named so a fix can be routed.
- The default lane must hold 0 real-clock rows from this ticket (`ADR-0053` d9); QE checks the new rows from the source.

## 5. The timing session, ALONE (G6, then G11)
- **Preconditions before every timed read:** 0 `cutechess-cli` (`pgrep -x`), 0 foreign vitest, load1 ≤ 2.0, Tctl ≤ 60.0 °C; poll 15 s, up to 60 min. A foreign vitest is found by a bracketed pattern and waited on by PID with `kill -0`, never a `pgrep -f` loop. Tctl and load1 are logged per run.
- **G6 graded** (`A4`): 5 rounds. Each round is a `kiwipete` pair, then a `position-6` pair. Base goes first in odd rounds, head first in even rounds. Each search is one fresh plain-node process. **Both builds run `chooseMove` at their own `LEVELS[5].budgetMs`, which is 4 000 ms on both**; the script refuses to read if `LEVELS[5].budgetMs` ≠ `DEFAULT_BUDGET_MS` or ≠ 4 000. Completed depth = `choice.depth`.
  - **MET:** head's median depth ≥ base's median depth, per board, on both boards, and no run of either build below depth 6. A head run below 7 is a WARN, reported.
  - **NOT MET → STOP before the smokes** and report. It goes to the owner (the ticket: a miss is not pre-answered). QE plays no game.
  - Nodes and ms are reported.
- **G11 (reported, not graded):** the five game-1 positions of `g11-fens.jsonl` (before 4.Qa4, 8.e5, 10.Ne4, 13.d4 and 17.Kc1). Both builds at 4 000 ms, base then head, one run each.
- **Thermal:** if the median of the session's Tctl samples is > 85.0 °C from the 6th sample on, the session stops.

## 6. A5, the smoke pair. ALONE, D then R, after the gates, G8 and G6 MET
- **D:** `node tools/rating/rating.ts d e196a281 b92a3394 <out> --budget-ms 1500 --rounds 5 --concurrency 1`. Both sides at B = 1 500 ms.
- **R:** `node tools/rating/rating.ts r e196a281 <out> --elo 1910 --rounds 5 --concurrency 1`, from the worktree, whose `tools/rating/rating.ts` R literal reads 4000 (unchanged by this ticket).
- Both run through `driver.mjs`, with tool paths from the env file (outside the repo, mode 600). No path is recorded. The pins are read from `machine.txt`.
- **Before each smoke:** a host wait-clear (as § 5), and the `main` src re-check.
- **Host log:** every 10 s, Tctl, load1, foreign vitest, the cutechess count, and the busiest core's MHz.
- **THERMAL STOP:** from a run's 6th sample on, if the median Tctl of the run's samples is > 85.0 °C, the run gets SIGTERM and is NOT READ. QE STOPs and reports. A foreign vitest that appears mid-run is recorded; if the stop fires while one is present, that run is VOID and one re-run is allowed after wait-clear.
- **Frequency:** fall = 1 − (median busiest-core MHz / median of its first 6 samples). Over 5 % makes the smoke UNRESOLVED, and it is re-run once (`RISK-EPIC009-04`).
- **S-1:** 0 candidate faults in the 20 games (illegal move, crash, disconnect, stall). A fault by base or by Stockfish makes that smoke UNRESOLVED, and it is re-run once.
- **S-2:** 0 candidate losses on time.
- **S-3:** the candidate's D score (W + D/2) ≥ 3.0 of 10. **S-4:** the candidate's R score ≥ 3.0 of 10.
- **Below 3.0 on S-3 or S-4:** the same command again, 10 more games; all 20 are judged together, and ≥ 7.0 of 20 passes.
- **Reported:** each smoke's W/L/D and score, the repetition endings, and the ledger row. **R is recorded at 4 000 ms and NOT pooled**: the 3 000 ms pool closed at `e42b637b`, and no flag is evaluable until milestone 1's batch sets the 4 000 ms reference (`EPIC-010` § The smoke ledger). It is never compared with a 3 000 ms reference.

## 7. Verdict rule
- **PASS:** §§ 1–6 met, with no gap.
- **PASS_WITH_GAPS:** §§ 1–6 met (S-1..S-4 MET), with only non-blocking gaps named.
- **FAIL:** an A row, a gate, G5, G8, G6 or an S missed, or a THERMAL STOP that leaves A5 unread.
- **STOPPED:** G8 FAIL or G6 NOT MET stops before the smokes. The verdict is FAIL (STOPPED at G8 / G6).
- Under Test note 2 and the 2026-10-22 ruling, the verdict signs UAT.

## 8. Order of work
PREREG sealed and committed → § 1 (a, b) and § 2 (a–d) (no clock) → § 3 mandatory gates → § 4 G8 → § 3 deep lanes (G1, G5, A3, the Q-SET lanes) → § 5 G6 then G11 → § 6 D then R → verdict.

## 9. What changed from the predecessor's scripts
- **`host.mjs` (new):** the wait-clear, shared by `g6.mjs`, `g8.mjs`, `deep.mjs` and `driver.mjs`. A foreign vitest is waited on by PID (`kill -0`).
- **`timed.mjs`:** the expected budget is 4 000 ms on both builds.
- **`g8.mjs`:** extracts each file's vitest time, for the per-file cost.
- **`deep.mjs`:** + `ENGINE_DEEP src/uci-session.test.ts`.
- **New:** `qset-head.mjs`, `sweep.mjs`, `a1spot.mjs`, `plant.mjs` (§§ 1–2).
- **`redact.mjs` / `package.mjs` / `seal.mjs`:** the task name only. `g6.mjs`, `driver.mjs` and `analyse.mjs` are otherwise unchanged.
