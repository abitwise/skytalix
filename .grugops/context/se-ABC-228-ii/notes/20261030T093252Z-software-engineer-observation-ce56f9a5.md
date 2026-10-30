---
id: 20261030T093252Z-software-engineer-observation-ce56f9a5
kind: observation
by: software-engineer
at: 2026-10-30T09:32:52Z
verified_by: 
confidence: high: exit codes and counts as run
refs:
  - se-ABC-228-ii
  - ABC-228
  - EPIC-010
  - ADR-0053
  - grugops/ABC-228
  - 8c82399f
  - d9c5bcde
  - 61d5d629
  - qe-ABC-228/20261030T091456Z-qe-e2e-decision-70c4723b
  - qe-ABC-228/20261030T091456Z-qe-e2e-observation-8829bc22
  - qe-ABC-228/20261030T073301Z-qe-e2e-observation-bcf2fd7c
  - QE-228-c
  - QE-228-b
  - A9
  - G9
  - OQ-228-1
supersedes: 
seal: sha256:8df18fb0571608ebc4186ef9a4fd423cecbdddcb49f9edeaf3288640a052d59e
---

# Software Engineer observation, se-ABC-228-ii: the delivered diff, the gates, 2 219 / 2 219

## Where
- Branch `grugops/ABC-228`, forward from `d9c5bcde`.
- Code commit `8c82399f`. The docs commit that carries this note follows it.
- Nothing pushed, nothing merged.

## Files (`git diff d9c5bcde 8c82399f --stat`: 7 files, +152 / −32)
- **Production:** `src/levels.ts`, `src/engine.ts`, `tools/rating/rating.ts`, one literal each (decision note).
- **Test only:** `src/levels.test.ts`, `src/engine.test.ts`, `src/uci-session.test.ts` (the followers), and `src/quiescence.test.ts` (QE-228-b).

## QE-228-b: QE's rows in `src/quiescence.test.ts`
The new describe is "ABC-228 QE-228-b — QE's Q-SET rows (qe-ABC-228), in src". It adds 8 tests:
- **QE-C1..C3:** each pins the in-check fact, the static score (−292, 14, −349), the shipped value (131, 181, 940), the brute force, and the pre-ticket value (131, 181, 938).
- **QE-C4** (`5rk1/6pp/8/8/8/8/PPP2n2/3Q1R1K w - - 0 1`): 475, against static 652 and pre-ticket 652. A second row asserts that shipped ≠ pre-ticket, and that Rxf2's own score one ply on is 475. **This closes QE-228-a's test-strength gap:** a regression to the pre-ticket rule reds it.
- **QE-M1:** −(MATE_SCORE − 2) from `quiesce`, the brute force, `search` d1–3 and `chooseMove` d1–3. The evasion door does not see a mate at d1.
- **QE-M2:** MATE_SCORE − 1, and MATE_SCORE − 6 from ply 5. The pre-ticket rule reads no mate.
- **QE-M3:** −MATE_SCORE at ply 0, −(MATE_SCORE − 3) at ply 3, and static at qply = cap.
- Every value equals QE's checkpoint (`qe-ABC-228/…bcf2fd7c`).
- The SE-row comment now records QE's freeze-review.

## Gates (exit codes as run, worktree at `8c82399f`'s tree)
- `npm run lint`: 0 (129 files). `npm run typecheck`: 0. `npm run build`: 0.
- `npm test`: **0, 63 files, 2 219 / 2 219 passed, 0 failed, 0 pending, 0 todo** (`.test-results/last-run.json`; `raw/npm-test.txt`). That is QE's 2 211 + the 8 new rows.
- Deep lanes were not run here. G5, G8 and G6 at 4 s are QE's under A5's "Under (ii)".
