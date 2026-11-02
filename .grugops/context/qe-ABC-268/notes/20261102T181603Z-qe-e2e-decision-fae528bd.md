---
id: 20261102T181603Z-qe-e2e-decision-fae528bd
kind: decision
by: qe-e2e
at: 2026-11-02T18:16:03Z
verified_by: 
confidence: high: fixed before any graded or timed run; nothing measured yet
refs:
  - qe-ABC-268
  - ABC-268
  - ADR-0061
  - ADR-0050
  - ADR-0026
  - ADR-0056
  - EPIC-011
  - EPIC-008
  - NFR-004
  - NFR-005
  - NFR-008
  - ABC-229
  - grugops/ABC-268
  - grugops/qe-ABC-268
  - df984484
  - ca6e8506
  - 4ca819c3
  - se-ABC-268/20261102T180901Z-software-engineer-observation-68b320a6
  - se-ABC-268/20261102T180901Z-software-engineer-observation-6f57c250
  - se-ABC-268/20261102T180901Z-software-engineer-decision-a787198c
  - arch-phase2-p3/20261102T171413Z-architect-design-observation-55f7725e
supersedes: 
seal: sha256:2f6068aa1e3cdb9005c9caa945fed3c186f270f065b0ad08c846ab2fadd77244
---

# qe-ABC-268 PREREG (part 1): how A1-A4, A3 (d)'s cut audit, the QE plants, G1/G5/G6/G8/G9/G11, the gates and the re-pointed ABC-229 rows are read, fixed before any graded or timed run

QE/E2E, task `qe-ABC-268`, on `grugops/qe-ABC-268` from `grugops/ABC-268` `4ca819c3` (code `df984484`, base `main` `ca6e8506`, base `src/` tree `f2388e40`, head `src/` tree `98075412`). Part 1 only: **no 100-game read, no Stockfish smoke, no Levels lane** (they wait on the owner's acceptance of `ADR-0061`). Every test, build and engine run is wrapped in `flock <host-test.lock>`, one run at a time; local `./node_modules/.bin/vitest`, never npx. Scratch trees outside the repository: base = `git archive ca6e8506` (full tree), head = `git archive df984484` (its `src/` hashes equal to the worktree's), `node_modules` symlinked; plain `node` imports out of tree.

## Criteria (contract: the `ABC-268` page and `ADR-0061` d1-d10)
- **A1 (G4, F7), QE's own sample, not SE's script:** a new QE script `qe-a1.mjs`, base tree against head tree, move + score + nodes (+ depth on the engine side) per row:
  - new doors against base's shipped path: `searchWithoutFutility` vs base `search()` at d5 and d6 on the 12 roots (6 roots + 6 endgames) and at d3 on the 287 mate corpus; `chooseMoveWithoutFutility` vs base `chooseMove` to 5 on the 12 roots (frozen clock), at `maxNodes` 47 000 on the 190, and **with game history**: `priorKeys` = the keys of the root's first eight two-ply grandchildren, to 5 on the 12 roots (non-vacuity: head `chooseMove` with those keys differs from without on at least one row);
  - every older door against its base self: the 11 search doors at d4 on the 12 roots except the minimax-scale three (`searchWithoutPruning`, `…PruningOrQuiescence`, `…Ordering`) at d3; the 5 older engine doors to 5 on the 12 roots;
  - non-vacuity: head `search()` d5 and head `chooseMove` to 5 differ from base on at least one root each;
  - export diff (`exports.mjs`): head = base + {`searchWithoutFutility`, `futilityNode`, `futileMove`} in `src/search.ts` and + {`chooseMoveWithoutFutility`} in `src/engine.ts`, nothing removed.
  - **MET** iff 0 rows differ on every pair, both non-vacuity counts > 0, and the export diff is exactly 3 / 1.
- **A2:** the default-lane file `src/search.futility.test.ts` green, reviewed row by row against the page's A2 list. **QE plants (declared now; each on a scratch copy of head, the copy re-diffed equal to head after each):**
  - QP1 `futilityNode` reads the static score from White's side (`blackToMove ? 0 - evaluate : evaluate`);
  - QP2 `futileMove` treats an en-passant capture as quiet (skippable);
  - QP3 fail-hard at a futile node in `src/search.ts` (`if (futile && best < alphaIn) best = alphaIn;` before the store);
  - QP4 the same fail-hard line in `src/engine.ts`;
  - QP5 `chooseMoveWithoutFutility` with `priorKeys: false`;
  - QP6 `futileMove` never skips a king move (a narrowed skip set);
  - QP7 the mate-band guard reads `MATE_SCORE` for `MATE_FLOOR` (alpha and beta lines);
  - QP8 the engine's call passes `index + 1` to `futileMove`.
  - Each is run on the default lane of the five touched test files (`search.futility`, `search`, `engine`, `search.null-move`, `quiescence`); a plant green there runs `SEARCH_DEEP=1` `search.futility`; QP5 green there also runs `qe-a1.mjs`'s history pair. Expected red: all. A plant that survives every lane is a named gap (LOW unless it changes a bar).
- **A3:** the `SEARCH_DEEP=1` rows of `search.futility` (drift d5 on the 190 in both recursions, bar: every non-mate score within 25 cp and 0 mate sign flips; mate floor on the 287; zugzwang node report) and `search.null-move` (the seven `ADR-0050` d9 rows, the bar). Plus an independent QE script `qe-a34.mjs`: head shipped against head door AND against base shipped (equal by A1), drift d5 on the 190 both recursions; mate floor on the 287 at d5 in BOTH recursions (`search()` barred, the engine side INFO); the seven zugzwang rows on head `chooseMove` at 9/11/12/8/8/8/8 (each must play its recorded move, no depth re-pinned), nodes against the door reported.
- **A3 (d), the cut audit, re-run independently** on a scratch copy of head (`df984484`) with a QE-written sampling hook (`qe-audit-patch.py`, never in `src/`) and a QE driver (`qe-audit.ts`) that follows `probe3.ts` audit mode exactly: `search()` d6 over the 190 (the six endgames included), every 10th node where the rule skips at least one move; each sampled node searched fresh three times (cleared table, ply 1, fresh killers): rule on at the node's null window (h), rule off at the same window (dnw), rule off at a full window (v). Flip = h and dnw on opposite sides of alpha; error = v - alpha (false fail-low) or beta - v (false fail-high). **Bars: flips <= 0.5 % of sampled nodes, 0 flips with error >= 200 cp.** **Instrument check (not a bar), expected exactly: 30 272 firing, 2 943 sampled (d1 1 918 / d2 966 / d3 59), 0 flips**; also the firing figure (head/door nodes at d6, 0.8028x, 901 655 skipped). Cross-check: the arch probe's own instrument (`patch_p3.py` + `probe3.ts`, `{"fut":[0,150,350,550]}`) on the BASE tree; the sampled (FEN, depth, alpha, beta) list of the head-build hook must equal the probe's, by sha. A different count is explained before the bar is read; the sample is never changed.
- **A4:** `qe-a34.mjs` reproduces, to the node, head **888 786 / 1 262 046** (`search()` d8 kiwipete / position-6) and **1 306 981 / 391 451** (`chooseMove` to 8, frozen clock); door **1 116 785 / 1 602 457 / 1 575 537 / 476 244**, each door equal to base's shipped; ratio <= 0.88 on each. Reach at `maxNodes` 47 000 on the 190: **5.558 -> 5.837**, bar >= +0.20; deeper/shallower/root-move counts reported (54 / 1 / 6 expected). A different count is a finding before A4 is read. Plus the deep rows of `search.futility`.
- **Re-pointed ABC-229 rows (figures unchanged):** `qe-a34.mjs` reads the ABC-229 A3 d6 ratio on kiwipete / position-6 twice, head `searchWithoutFutility`/head `searchWithoutQuietPromotions` and base `search()`/base `searchWithoutQuietPromotions`, and both ABC-229 d5 drift rows the same two ways; MET iff each pair is equal and the `SEARCH_DEEP=1` quiescence lane is green.

## Gates
- **Mandatory:** `npm run lint`, `npm run typecheck`, `npm run build` exit 0 (`dist/` removed after).
- **npm test x3 and G8:** `npm test` as spelled, interleaved order b h h b b h (base scratch tree / worktree), 0 foreign vitest and load1 <= 8 before each. Head: 3 runs, each **2 407 passed** / 0 failed (base expected 2 376). G8 MET iff head median wall <= 10 s.
- **Skips / integrity / inventory:** skip count by the AGENTS.md spelling (local vitest); `test-skip-integrity.js --skip-count <N>`; `lane-inventory.js`. Expected 0 / "No findings." / "No findings.".
- **G1:** `PUZZLE_DEEP=1` puzzle-suite: solved >= 54/58 and no NEWLY-MISSED line.
- **G9:** `git diff ca6e8506 df984484 -- src/levels.ts` empty.
- **Deep lanes (regression):** SEARCH_DEEP `search.futility`, `search.null-move`, `search`, `quiescence`, `search.pvs-lmr`; ENGINE_DEEP `engine`; PUZZLE_DEEP `puzzle-suite`. Not run: `uci-session` (no search value row; SE green), the Levels lane (A6, owner-gated).
- **G6 (graded, `EPIC-008` row as read 2026-10-25, owner word `…2ae5fc12`, qe-ABC-264's form):** 5 rounds; each a kiwipete pair then a position-6 pair; base first in odd rounds, head first in even; one fresh plain-node process per search (`timed.mjs`, unchanged); `chooseMove` at `LEVELS[5].budgetMs` = 4 000 ms on the real clock on both builds (it refuses otherwise); completed depth = `choice.depth`. **MET** iff head's median >= base's on both boards and no run < 6; runs < 7 reported as WARN. Wait-clear before EVERY read (0 foreign vitest, 0 cutechess-cli, load1 <= 2.0, Tctl <= 60.0 C; poll 15 s, 60 min max); thermal stop at session median Tctl > 85.0. Every run counts; no discards, no re-runs.
- **G11 (reported, not graded):** the five game-1 positions (qe-ABC-210's FEN file), base then head, one run each at 4 000 ms, same harness.
- **G5:** MET iff every G6 and G11 read's `chooseMove` wall <= 5 000 ms (max reported against 4 000 ms) AND the `ENGINE_DEEP=1` engine lane (its real-clock rows) is green.

## Verdict rule (part 1)
- **READY-FOR-A6:** A1-A4 MET (A3 (d) bars met with the instrument counts reproduced or explained), the re-pointed rows unchanged, every plant red, every gate above green, no gap above LOW.
- **GAPS (ids):** all of the above met except one or more named non-blocking gaps (a surviving plant, an UNKNOWN), each with a `QE-268-x` id.
- **FAIL:** A1, A2 or A3 red (a defect, back to the Engineer), A3 (d) above a bar, A4 missed or a count off the probe unexplained, or a gate red (G1 < 54 or NEWLY-MISSED, G5, G6, G8, a lane red with no recorded re-pin).
