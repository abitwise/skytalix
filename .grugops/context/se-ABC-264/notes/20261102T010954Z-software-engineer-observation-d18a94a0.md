---
id: 20261102T010954Z-software-engineer-observation-d18a94a0
kind: observation
by: software-engineer
at: 2026-11-02T01:09:54Z
verified_by: 
confidence: high: every gate run under the lock; G8 interleaved x3; QE-owned gates not run
refs:
  - se-ABC-264
  - ABC-264
  - ADR-0059
  - ADR-0050
  - ADR-0026
  - ADR-0028
  - ADR-0056
  - EPIC-011
  - ABC-229
  - ABC-086
  - ABC-249
  - NFR-005
  - NFR-008
  - grugops/ABC-264
  - 358b5f4a
  - 0b73f51d
  - arch-ABC-264/20261102T003352Z-architect-design-observation-1e9c2549
supersedes: 
seal: sha256:c84dfabcbe55afd814f2f17ccb3d780d5cec2740d4f3b2d64a0801080a0df587
---

# se-ABC-264 gates: lint, typecheck and build exit 0; npm test 2 403 passed, skips 0; skip-integrity and lane inventory clean; 14 deep lanes green; G1 54/58; G8 head 8.93 s; G9 met

At `358b5f4a`. Every run was under the host lock. load1 ranged 0.8-3.1 during the runs. The only foreign long-running process was a `fake-oidc` node service from another repo (pid 3594620, ~0 % CPU), left untouched. No foreign `vitest` was seen. Tctl was 69.5 °C after the runs.

- **Static gates:** `npm run lint` 0 (132 files, no fixes); `npm run typecheck` 0; `npm run build` 0.
- **Unit:** `npm test`, 64 files, **2 403 passed**, against base's 2 376 (+27, the new file); 0 failed.
- **Skips:** 0 (`vitest --reporter=json`, pending + todo). `test-skip-integrity.js --skip-count 0`: "No findings." `lane-inventory.js`: 64 collected, 64 tracked, "No findings."
- **Deep lanes, exit 0 each** (local `./node_modules/.bin/vitest`, never npx):

  | lane | file | result | time |
  |---|---|---|---|
  | SEARCH_DEEP | search | 57/57 | |
  | SEARCH_DEEP | search.null-move | 44/44 | |
  | SEARCH_DEEP | search.pvs-lmr | 29/29 | 311 s |
  | SEARCH_DEEP | quiescence | 116/116 | |
  | SEARCH_DEEP | transposition | 40/40 | |
  | SEARCH_DEEP | search.reverse-futility | 35/35 | ~30 s |
  | ENGINE_DEEP | transposition | 26/26 | |
  | ENGINE_DEEP | engine | 78/78 | after the A6 re-pin; 77/78 before it, the fixture row |
  | ENGINE_DEEP | uci-session | 241/241 | 292 s |
  | PUZZLE_DEEP | puzzle-suite | 18/18 | |
  | ZOBRIST_DEEP | zobrist | 33/33 | |
  | CLI_DEEP | cli.real-engine | 11/11 | |
  | UCI_DEEP | uci.real-engine | 13/13 | |
  | LADDER_DEEP=1 | ladder (short mode) | 18/18 | 24 s |

- **G1:** PUZZLES shipped solved **54/58**, baseline 54/58, no NEWLY line.
- **G8:** `npm test` wall, interleaved ×3. Head 9.17 / 8.92 / 8.93 s (median **8.93 s**); base `0b73f51d` 8.91 / 8.73 / 8.66 s (median 8.73 s). Bar ≤ 10 s.
- **G9:** `git diff 0b73f51d -- src/levels.ts` is empty.
- **G10:** one fixture re-pin (`ABC-086` A6), recorded in the acceptance note. No catalog level moved.
- **G7:** not owed (no structure held between nodes, `ADR-0059` Consequences).
- **QE's, not run here:** G5 (real clock), graded G6, G11, the Levels deep lane, A6's 100-game read and the Stockfish smoke. They wait on the owner's acceptance of ADR-0059.
