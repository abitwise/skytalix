---
subtask: se-fix-ABC-208
role: software-engineer
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/se-fix-ABC-208/
branch: grugops/ABC-208 (continue from 80345eb9), worktree ../wt-ABC-208
width: 1 of 2 (test-only; no real-clock timing)
---

# ABC-208: three test-only rows for QE-208-a/b/c

## Do
- Per QE `qe-gate-ABC-208/…8c4f3e57`, `…98174381` (the plants and why they survive) and Orchestrator `orch-2026-10-26h`, add test rows so that each of these plants goes red:
  - **QE-208-a (MEDIUM):** the engine's `finally` around the null-move unmake is removed. Abort at a depth where a null move is tried (deeper than d2); the root position must come back byte-identical, with the side to move unchanged.
  - **QE-208-b (MEDIUM):** the null child's key write (`keys[ply + 1] = zobristKeyAfterNullMove(…)`) is dropped, in each recursion separately.
  - **QE-208-c (LOW):** null move is wired on in each PVS-off door (`searchWithoutPvsOrReductions`, `searchWithoutTable`, `chooseMoveWithoutPvsOrReductions`).
- Show each plant red, and green at head. Prefer deterministic rows; put a row in a deep lane only if it can't be made fast.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration; NFR-008 headroom), skips, SEARCH_DEEP null-move lane.

## Fences
- Tests only. No production line changes, and no value pin, relation, level or bound moves (if one is needed → STOP). Only your worktree and `<scratchpad>/se208fix/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on grugops/ABC-208. Seal notes (task se-fix-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Three gaps closed by 5 test-only rows in `src/search.null-move.test.ts`, default lane, all deterministic. Each of the six QE plants is red on exactly one new row, and head is green. Zero production lines. No value pin, relation, level or bound moved. No STOP.**
- Branch `grugops/ABC-208` in `../wt-ABC-208`, from `80345eb9`: tests **`2d3db645`**, tip **`2e9eb9a7`** (notes). Not pushed, not merged. Plants ran on a scratch copy under `<scratchpad>/se208fix/`, each restored and `cmp`-verified. No real-clock timing.

| gap | row(s) | plant: head's old tests → with the new rows |
|---|---|---|
| QE-208-a | `chooseMove` on position-6 under a virtual clock that turns at reading 3..25: every root back byte-identical; ≥ 3 aborts land with a null move open (head: 6 of 23) | `finally` removed: 0/2 123 → 1/2 128 (6 roots mutated, side to move flipped) |
| QE-208-b | call-through `probeTable` watch: every probe key = `zobristKey` of the probed position; `search()` d6 and `chooseMove` to 6, position-6 | search key write dropped: 0 → 1 (`search()` row); engine key write dropped: 0 → 1 (`chooseMove` row) |
| QE-208-c | source row per module: each door's `nullMove` literal; only `search`/`chooseMove` true (9 + 3 doors false) | `searchWithoutPvsOrReductions` / `searchWithoutTable` / `chooseMoveWithoutPvsOrReductions` on: 0 → 1 each |

Gates at `2d3db645`: lint, typecheck, build 0. `npm test` 63 files, **2 128 / 2 128**; `last-run.json` success, 0 failed, 0 pending, 0 todo; **Duration 8.02 s** (7.71 s at `80345eb9`; NFR-008 W 10 s; width 1 of 2, not a reading). Skips 0, `No findings.`; lane inventory 63 = 63. `SEARCH_DEEP` null-move lane 44/44, A3 readings unchanged. The door comment that said PVS-off doors "cannot show" a null window was corrected to match QE's measurement (test comment only).

Notes sealed via `admitAndAppend` in `../wt-ABC-208/.grugops/context/se-fix-ABC-208/notes/`: decision `…2beeb930` (rows and choices), observation `…ce9cdb99` (plants and gates). Read back 2/2.

### Trace row
| ABC-208 (se-fix-ABC-208) | test-only rows for QE-208-a/b/c: abort under a null move, the null child's key, the door switch literals | EPIC-008 | — | ADR-0050 PROPOSED (owner's); no bound moved; NFR-008 8.02 s ≤ 10 s (not a reading) | grugops/ABC-208 @ 2e9eb9a7 (tests 2d3db645)<br>src/search.null-move.test.ts (+5 default rows); .grugops/context/se-fix-ABC-208/notes/ (2) | 6 plants 0/2 123 on old tests → each red on one new row; npm test 63/2128 (8.02 s); SEARCH_DEEP null-move 44/44; skips 0, No findings. | owed: QE re-runs the plants; QE verdict signs (owner delegation 2026-10-22) | — | In Review (unchanged) |
