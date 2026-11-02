---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T01:11:26Z
subtask: qe-ABC-264
role: qe-e2e
ref: .grugops/context/qe-ABC-264/
branch: new grugops/qe-ABC-264 from grugops/ABC-264 (head 4e6a59ee; code 358b5f4a; base 0b73f51d) — worktree .claude/worktrees/qe-ABC-264
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`.
---
# QE part 1: grade ABC-264 (reverse futility) — everything EXCEPT A6's games
## Read
plans/tickets/ABC-264*.md (aligned to ADR-0059), ADR-0059 (PROPOSED), se-ABC-264 notes on the branch (…1fad1ebe, …470e5bf6, …d18a94a0).
## Do
- Re-read A1 (doors node-equal, out of tree), A2 (predicate table; plant at least 3 defects of your own, including the mate-band guard), A3 (drift + 160 cp cap, mate corpus, zugzwang 7/7), A4 (deterministic counts 658 971 / 1 021 190 / 972 596 / 299 183).
- Gates: G1, G5 (real clock), graded G6, G8 interleaved, G9, G11, lint/typecheck/build, npm test ×3 (expect 2 403), skip-integrity, lane inventory. Review the ABC-086 A6 fixture re-pin (3→5 ms).
- Measure how often the rule fires at 100 ms on startpos/kiwipete/position-6 (INFO).
- DO NOT run the 100-game read, the smoke or the Levels lane: they wait for owner acceptance of ADR-0059 (a part-2 hop).
- Verdict for part 1: READY-FOR-A6 / GAPS (with ids) / FAIL.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-264, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.

## Result

**2026-11-02, QE/E2E (claude-opus-5-5), branch `grugops/qe-ABC-264` from `grugops/ABC-264` `4e6a59ee` (code `358b5f4a`, base `0b73f51d`). Part 1 only. No 100-game read, no smoke and no Levels lane were run: they wait for the owner to accept `ADR-0059`. Every run was under `flock host-test.lock`, with local vitest only (never npx). Nothing pushed or merged.**

**Verdict, part 1: GAPS (`QE-264-a` LOW, `QE-264-b` LOW), none blocking.** A1–A4 are MET and every part-1 gate is green. It is not READY-FOR-A6 only because the PREREG requires every plant to go red, and QP6 survived. Neither gap touches the shipped path or a bar. A6 may go ahead once the owner accepts `ADR-0059`.

- **A1 MET:**
  - SE's `a1.mjs` was reviewed and re-run out of tree, base against head, on 276 positions: 0 differ on every pair.
  - The shas are the same as SE's.
  - Non-vacuity: 449/1 104 (`search()`) and 156/276 (`chooseMove`).
  - QE added a d5 spot on the 12 roots: 15 door pairs, 0 differ.
  - Export lists: +2 in `search.ts` (`reverseFutilityCut`, `searchWithoutReverseFutility`) and +1 in `engine.ts` (`chooseMoveWithoutReverseFutility`). Nothing was removed.
- **A2 MET:**
  - The file was reviewed row by row against the page.
  - QE plants: 7 of 8 went red. QP1 (mate band strict) and QP2 (mate band upper side only) are both red; so are margin `>`, the engine and search gates above the probe, `ply <= 1`, and depth 1–2.
  - **QP6 survives** every lane: the new engine door with `priorKeys: false`.
- **A3 MET:**
  - The deep lane is 35/35.
  - An independent QE script (head shipped against base shipped) gives `search()` 97.33 % within 25 cp, max 107 cp, and `chooseMove` 97.33 %, max 107 cp. Nothing is beyond 160 cp, with 0 sign flips and 0 mate-status flips.
  - Mate floor: 0/189. The engine side is 0/188 (INFO).
  - Zugzwang: 7/7 (null-move lane 44/44).
- **A4 MET:**
  - `search()` d8: kiwipete 658 971 / 1 116 785 = **0.5901**, position-6 1 021 190 / 1 602 457 = **0.6373**.
  - `chooseMove` to 8: kiwipete 972 596 / 1 575 537 = **0.6173**, position-6 299 183 / 476 244 = **0.6282**.
  - **All four equal the probe to the node.** The door equals base in all four.
- **ABC-086 A6 re-pin (3 → 5 ms): justified.**
  - At 3 ms the row goes red on the non-vacuity line only (`expected 0 to be greater than 0`). At 5 ms it is green.
  - The ENGINE_DEEP engine lane is 78/78.
- **Gates:**

  | gate | result |
  |---|---|
  | lint / typecheck / build | exit 0 |
  | npm test ×3 | **2 403/2 403** each |
  | skips | 0; skip-integrity and lane inventory (64 = 64) "No findings." |
  | G1 | 54/58 |
  | G5 | MET: 30 real-clock reads, max 4 001.2 ms, 0 over 5 000; engine lane green |
  | G6 (graded) | MET: kiwipete medians 9 = 9, position-6 10 → 11, min 8, 0 WARN |
  | G8 | head median 9.18 s (base 8.83 s) |
  | G9 | empty |
  | G11 (reported) | same move at all five positions; head one ply deeper at 10.Ne4 and 13.d4 |
  | deep lanes | 7, all green |

- **Firing at 100 ms (INFO), median cuts per node:**
  - startpos 0.32 % (d6);
  - kiwipete 3.66 % (d4, cold process);
  - position-6 4.82 % (d6).
  - The predicate cuts on 1.3 %, 78 % and 65 % of its tries.
  - The scratch instrument was checked to the node (972 596).
- **Gaps:**
  - **`QE-264-a` (LOW, Engineer):** no row pins the new engine door's `priorKeys`. One row closes it.
  - **`QE-264-b` (LOW, Architect / BA-PM):** the static-score mate argument cites a constant assertion (`transposition.test.ts:188`). Its premise, "under 10 000", is false at the extremes: `evaluate` measured −10 535. The conclusion still holds, because the score stays far below 20 000.
  - **INFO:**
    - `QE-264-c`: the engine-side mate floor has no row;
    - `QE-264-d`: SE's A1 reads the older search doors at d3, where null move is idle;
    - `QE-264-e`: a stalemated cut node returns beta (same class as null move; not named in the ADR).
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`; 8 of 8 read back):
  - PREREG `20261102T011645Z-qe-e2e-decision-4e787c10`;
  - verdict `…decision-b19fef14`;
  - rows `…observation-b492622f`;
  - plants `…ccd50260`;
  - gates `…05cb1d0d`;
  - firing `…9600020a`;
  - gaps `…3a95d391`;
  - host/artifacts `…e9e9aa8c`.
  - No `finding` (`human_admission` off).
- **Commits:**
  - claim `8c80a3f2`;
  - PREREG `a55eb281`;
  - evidence + notes `432fa41d`;
  - then this closing commit.
- **Host:** nothing was left running and no foreign process was touched. Three self-inflicted incidents are recorded in `…e9e9aa8c`; none affected a reading. Scratch was deleted.
- **For the Orchestrator:**
  - the board move;
  - routing `QE-264-a` / `QE-264-b`;
  - after the owner's word, the part-2 hop (A6, the smoke, the Levels lane), which carries the UAT-signing verdict.

### Trace row (10 cells, header order)

| qe-ABC-264 | QE part 1 of ABC-264 (reverse futility, ADR-0059 PROPOSED): GAPS, none blocking. A1–A4 MET (A4 0.5901/0.6373/0.6173/0.6282, counts to the node); plants 7/8 red (QP6 door priorKeys survives); A6 re-pin 3→5 ms justified | EPIC-011 | ADR-0059 (proposed; unchanged by QE) | NFR-005 G6 MET (kiwipete 9=9, position-6 10→11); NFR-004 G5 max 4 001.2 ms; NFR-008 G8 head 9.18 s; G1 54/58; G9 empty; firing at 100 ms 0.32 % / 3.66 % / 4.82 % cuts per node (INFO) | `grugops/qe-ABC-264` (records only; notes `432fa41d`) | npm test 2 403 ×3, skips 0; 7 deep lanes green; A1 cross-build 0 differ (276 positions + d5 spot); independent A3/A4 script; QE plants QP1–QP8 | UAT owed (production lines); not signed by part 1 | QE-264-a LOW, QE-264-b LOW; QE-264-c/d/e INFO | QE part 1 done; part 2 (A6, smoke, Levels) waits on the owner's acceptance of ADR-0059 |
