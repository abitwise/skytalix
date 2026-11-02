---
id: 20261102T152900Z-software-engineer-observation-e94151a6
kind: observation
by: software-engineer
at: 2026-11-02T15:29:00Z
verified_by: 
confidence: high: every gate run under the lock at e5694864; QE-owned gates not run
refs:
  - se-ABC-265
  - ABC-265
  - EPIC-011
  - ADR-0025
  - ADR-0057
  - ADR-0026
  - ADR-0059
  - ABC-081
  - ABC-122
  - ABC-208
  - ABC-266
  - NFR-005
  - NFR-009
  - NFR-008
  - grugops/ABC-265
  - e5694864
  - 94be445f
  - src/transposition.ts
  - src/transposition.shared.test.ts
  - arch-ABC-265/20261102T143310Z-architect-design-decision-e396e5ab
supersedes: 
seal: sha256:b8df92f941d25bec9654d95d5583070d0464087d8e4d089b4ffbad73229283d2
---

# se-ABC-265 gates: lint/typecheck/build 0; npm test 64 files 2 387 passed, skips 0; G1 54/58; G9 empty

All under `flock host-test.lock`, at `e5694864` (gate runs on the tree identical to it).

- `npm run lint` 0 (132 files); `npm run typecheck` 0; `npm run build` 0.
- `npm test`: **64 files, 2 387 passed** (base 2 376 + 11 new rows), 0 failed; wall 10 s (vitest 8.98 s) — the `N8-LANE` / G8 figure reported, one run, not interleaved. Skip count (`--reporter=json`, numPending + numTodo) **0**. `lane-inventory.js`: "No findings." after the commit (64 collected, 64 tracked).
- **G1:** `PUZZLE_DEEP=1` 18/18, "PUZZLES shipped: solved **54/58**, baseline 54/58", no NEWLY line.
- **G4:** A3 (acceptance note). **G5:** ENGINE_DEEP `engine` lane 78/78 (real-clock rows); G6 session max `chooseMove` wall 4 000.8 ms, 0 over 5 000 ms. **G6:** A4 (SE reading; graded G6 is QE's). **G7:** A5 (ABC-081 A7 row green). **G9:** `git diff 94be445f -- src/levels.ts` empty.
- Not run (QE's or owner-gated): graded G6/G7, Levels lane, smoke, games. No S2 (ruled none).
- Nothing left running; base/head scratch trees under the session scratchpad only.
