# qe-ABC-250 pre-registration: ABC-250 A4 (perft, GO ≥ 1.25 / HOLD 1.10–1.25 / NO-GO < 1.10 on two of three boards) and A5 (search ≥ 0.98 on every board), both under ADR-0055 D3-V2; perft runs use a fixed in-process repetition count chosen here, before any timed run

QE/E2E, task `qe-ABC-250`. Sealed and committed before any timed run of this hop. D3-V2 (the ADR-0055 addendum of 2026-11-01) predates this note, so this read is forward-only under it (item 5). One read. A written result is final; the only repeat is D3's one board re-run. Grading is mechanical (`grade.mjs`, `g56.mjs`), never by hand.

## Trees and host
- **Base B** = `ceb28780` (merge base of `grugops/ABC-250` and `main`). **Head H** = code `2e04eee5` (branch tip `35139b31`, records only above it). `main` `fa9e6f7f` differs from `ceb28780` in three test files only, so B is main's production engine. `git merge-tree main grugops/ABC-250` is clean.
- Trees: `git archive <sha> src package.json` into the scratchpad (`qe-250/trees/{B,H}`). H's `src` is `diff -r`-equal to this worktree's.
- node v26.12.1, 24 CPUs (AMD Ryzen AI 9 HX 370), Linux.
- **Disclosed before this note, no timed run:** both trees import-smoked (`perft(kiwipete, 2)` = 2039 on each; `chooseMove` loads). The driver and `run.sh` were logic-tested with a stub probe (`test/stub-probe.mjs`, `A4_PROBE` override; no perft, no search): discard and order-keeping retry, VOID-LOAD on an INFO board ignored, the re-run path to VOID, and the (v1) STOP. The grader passed 20 synthetic cases (`test/grade-cases.mjs`), including the edges 1.25, 1.10, 0.98 and spread 5.0 %.

## Scripts (`raw/qe-scripts/`, sha256 prefixes)
`ab.mjs a35ed1d1e6b48ad2` (qe-ABC-254-a4v2's `a4v2.mjs` with changes marked Q250), `host.mjs d2b80f7823dc3b0a` and `probe.mjs a9742d21999959ae` (both byte-identical to qe-ABC-254-a4v2's), `probe-perft.mjs 37837176195b2f26` (new), `analyse.mjs f76e6a298fea53e6`, `grade.mjs 761ba9e93dd2be75`, `g56.mjs be75e799844ebaa7`, `run.sh 69f9c03ade324d09`, `seal.mjs ef92d4298f9ed71c`. Test-only: `test/stub-probe.mjs 2d701b4b6735a825`, `test/grade-cases.mjs 7f0bc85e2ac42847`.

## A4: what a perft run is (the repetition rule, chosen here)
- **The page fixes:** W1 perft on `kiwipete`, `position-6` and `start` at `src/perft-bench.ts`'s depths (4, 4, 4). It also fixes 5 interleaved fresh-process runs per board per build, ALONE, and the 5 % spread bar. The other three perft positions are read as INFO.
- **The page states no repetition method.** At those depths one perft lasts 0.02–0.24 s (se-ABC-250 `…ff7ffb6e`), and the Engineer's single-call spreads ran 3.8–46 %. So this note fixes the method **before any timed run**, as the brief directs:
  - one fresh process per run (`probe-perft.mjs`). It runs the tree's own `perft()`, the function `perft-bench.ts` calls: the object path on B, the packed path on H;
  - **first call:** one `perft(board, depth)`, timed and reported apart (`firstNps`, INFO only). This follows ADR-0055 D3's method: "the first call (compile, instantiate, JIT warm-up) is reported apart from the steady state";
  - **graded nps (steady state):** then **REPS** further calls of `perft(board, depth)` on the same position. nps = their total nodes ÷ their total wall time (`performance.now()`);
  - **REPS, fixed per board** from se-ABC-250's recorded rates, aiming at ≥ about 1.5 s of timed work per run on either build: kiwipete 12, position-6 12, start 150; INFO: position-3 (d5) 40, position-4 (d4) 80, position-5 (d4) 20. They never change during the read.
- **(v1) values for perft (Q250):** on every attempt, admitted or not, both runs must meet all of these:
  - every one of the 1 + REPS counts equals the published count at that depth (`src/perft.test.ts`);
  - the position is unchanged (`toFen`);
  - B's and H's node totals are equal.

  Anything else is a defect: STOP, no grade, ABC-250 FAIL.
- **Disclosed choice:** this reads steady-state throughput, not perft-bench's single cold call. The Engineer's informal steady-state ratio (1.07–1.09×) was below the cold one (1.11–1.14×). The cold-call ratio is reported as INFO for every board (`firstCallRatioInfo`) and grades nothing.

## D3-V2, as implemented (`ab.mjs`), for A4 and A5 alike
1. **Admission (discard, never force).** A pair is admitted only if, read after the pair, all of these hold:
   - no foreign vitest and no `cutechess-cli`;
   - both runs read foreign cores ≤ **0.8** (unrounded). Foreign cores = (host busy CPU-s from `/proc/stat` − the probe's own CPU-s) ÷ process wall;
   - both runs' after-run Tctl is **< 85 °C**.

   Otherwise the pair is **discarded**, logged with its reasons, and never enters a median, a spread or a ratio.
2. **Blind, fixed count.** Admission reads host counters and the probe's CPU time only. A board's reading is its **first 5 admitted pairs**. Order: base first when the board's admitted count is even, head first when it is odd. A retry keeps the order.
3. **Rounds and cap.** Boards go round by round. A4 order: kiwipete, position-6, start, position-3, position-4, position-5. A5 order: kiwipete, position-6, start.
   - At most **15 attempts** per board per schedule.
   - Fewer than 5 admitted pairs at the cap → **VOID-LOAD**: not a result and not a miss. It gets no re-run.
4. **(v2) spread:** per build and board, over the 5 counted runs, (max − min) ÷ median nps ≤ 5 % (unrounded).
5. **Agreement guard:** the median of the 5 paired ratios (H ÷ B) must fall on the same side as the graded ratio (H median ÷ B median) of every bar the board is read against. A4 bars: **1.25 and 1.10**, ABC-250's own (D3-V2 item 4 names ABC-254's bars; this ticket's are these). A5 bar: **0.98**.
6. **One board re-run (D3):**
   - a graded board with spread > 5 % on either build, or a failed guard, gets one fresh schedule (same rules, fresh cap), right after its main schedule. That reading replaces the main one;
   - in the re-run, the same failure → **VOID**;
   - INFO boards are never re-run; a not-valid INFO board is reported as INFO-not-valid.
7. **(v3):**
   - **Thermal:** a board whose counted runs' median after-run Tctl exceeds 85 °C stops the read (UNRESOLVED).
   - **Start precondition:** 0 running foreign vitest, 0 `cutechess-cli`, no foreign process above 50 % of one core over a 3 s sample, load1 ≤ 2.0, Tctl ≤ 60 °C; polled every 15 s.
   - **Gate before each attempt:** a foreign vitest is waited out by PID; Tctl ≥ 85 °C pauses until ≤ 75 °C.
   - **Wait cap:** lock acquisition + 45 min, else the read is labelled **SHARED**. A ratio within 0.03 of a bar under SHARED → QE recommends another ALONE read.
   - **Lock:** the whole job is `flock …/scratchpad/host-test.lock bash run.sh …` in one background job. It holds the lock from the first wait to the last run. While it runs, this hop runs no other command and kills nothing foreign.

## Grades
- **A4 (`grade.mjs perft`):**
  - any graded board RERUN-OWED → re-run;
  - any graded board VOID or VOID-LOAD, or thermal → **UNRESOLVED**;
  - else let r2 be the **second-highest** of the three graded ratios ("on at least two of the three boards"): r2 ≥ 1.25 → **GO**; 1.10 ≤ r2 < 1.25 → **HOLD**; r2 < 1.10 → **NO-GO**.
- **A5 (`grade.mjs search`):** chooseMove at 4 000 ms on the real clock, `probe.mjs` (nps = nodes ÷ elapsedMs × 1000); (v1) = same move and score at equal depth. All three boards valid and every ratio ≥ 0.98 → **MET**; a valid miss → **NOT-MET** (a defect, back to the Engineer); not valid → UNRESOLVED.
- **G6 (`g56.mjs`, from A5's runs, over ALL runs as the EPIC-008 row says, admitted or discarded):** kiwipete and position-6, H median depth ≥ B median depth, and no run below 6 → MET. Runs below 7 → WARN. Counted-only medians are INFO.
- **G5 (`g56.mjs` + the `ENGINE_DEEP` engine lane):** every A5 wall ≤ 5 000 ms and the lane green → MET. The max is reported against 4 000 ms.

## Not timed (run after the timed job, each under the lock)
- **A3 / G4:** qe-ABC-254's `g4.mjs` (sha256 8057449ea5b4e457, byte-identical), out of tree in plain node, B against H. It covers the ABC-078 A3 corpus and ABC-121's 190 at depth 5, every ADR-0026 door, and `chooseMove` with its doors at budgets 3 and 5 on a ticking clock (1 per read). Every row must be byte-equal (`cmp`). No golden file is committed.
- **A1 / A2 spot:**
  - `PERFT_DEEP=1` `src/perft.test.ts` at head;
  - `ENGINE_DEEP=1` `src/legal.test.ts -t "ABC-250"` (the 285 074-node walk) at head.
- **Plants (QE's own, in a full archive of `2e04eee5`, never the worktree):**
  - QP1: the packed make writes a queen for every promotion;
  - QP2: the undo slot drops the castling rights;
  - QP3: the undo slot drops the en-passant square;
  - QP4: `packedCaptured` loses the colour bit;
  - QP5: the packed key omits the new en-passant file;
  - QP6: the packed generator emits castling first (order only; perft counts cannot see it).
  - Each runs the default `perft.test.ts` and `legal.test.ts` lanes. The deep A1 and A2 rows run only if both lanes stay green. Each plant must turn something red; a survivor is a gap.
- **QE-261-c relay:** `git diff ceb28780 2e04eee5 -- src/moves.ts` must hold additions only, so `generateMoves` is byte-unchanged. The ABC-261 early-exit row (`src/gameend.nfr.test.ts`) must be green in the default lane at head.
- **Gates:**
  - lint, typecheck, build;
  - `npm test` × 3 at head inside G8: order b h h b b h, B = the full archive of `ceb28780`. G8 needs H's median ≤ 10 s; the new rows' sum is reported (N8-LANE ≤ 0.1 s);
  - skip count, skip-integrity, lane inventory;
  - G1: `PUZZLE_DEEP=1`, 54/58, plus se-ABC-235's `g1.mjs` rows out of tree, B `cmp` H;
  - G7: code read (every new typed array allocated once at module load), plus the `ENGINE_DEEP` and `SEARCH_DEEP` transposition lanes;
  - G9: `git diff ceb28780 2e04eee5 -- src/levels.ts` empty.

## The verdict (per the page)
1. A1, A2 or A3/G4 red, a (v1) STOP, or a mandatory gate red → **FAIL** (defect, back to the Engineer). A4 is read again after the fix.
2. Else A4 or A5 UNRESOLVED → **UNRESOLVED** (VOID-LOAD / VOID / thermal), reported with the load evidence.
3. Else A4 **HOLD** or **NO-GO** → that verdict: not merged. QE records a `failed-attempt` note with the medians, ratios, load1 and Tctl, and the ticket goes back to BA/PM to be closed as dropped. An A5 miss is reported beside it.
4. Else A4 GO and A5 NOT-MET → **FAIL** (A5 defect).
5. Else A4 GO, A5 MET and A6 green → **GO: PASS**, or **PASS_WITH_GAPS** if a non-blocking gap is named.

## Run time
- **Timed job, bounded by construction:**
  - A4: 6 boards × 15 attempts × 2 runs × about 2.5 s ≈ 7.5 min worst case;
  - A5: 3 × 15 × 2 × about 4.3 s ≈ 6.5 min;
  - with every graded board re-run, about 25 min worst case. Expected about 6 min.
- **Untimed work:** about 20–25 min (G4 pool about 10 min).
- The hop estimate is about 35–45 min excluding waits.
