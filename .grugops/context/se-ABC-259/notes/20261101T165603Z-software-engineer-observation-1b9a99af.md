---
id: 20261101T165603Z-software-engineer-observation-1b9a99af
kind: observation
by: software-engineer
at: 2026-11-01T16:56:03Z
verified_by: 
confidence: high: every gate below ran at e1c10e19 under flock host-test.lock, 2026-11-01 ~16:54Z; figures from npm test's own JSON report (.test-results/last-run.json copied per run)
refs:
  - se-ABC-259
  - ABC-259
  - EPIC-010
  - ADR-0056
  - R-TC
  - G-1
  - grugops/ABC-259
  - 8f2fc9b5
  - 496a8941
  - f40665b1
  - e1c10e19
  - src/levels.test.ts
  - A7
  - A8
  - A9
  - NFR-008
  - G8
  - UAT-waiver
supersedes: 
seal: sha256:de3a2750ab5a9b71f4c6f62377c0853829aa515ed945e99fab4942a6b895a5b9
---

# se-ABC-259 artifact (observation; artifact-ref needs a §14 gate_run, not emittable here): grugops/ABC-259 @ e1c10e19 (code f40665b1 + e1c10e19), src/levels.test.ts only; gates green; 2 365 tests, 0 skips

- **Branch:** `grugops/ABC-259`, worktree `.claude/worktrees/se-ABC-259`, from main 8f2fc9b5. Commits: 496a8941 (claim), f40665b1 (the block, +63 lines including the header 46 → 49), e1c10e19 (message fix, 3 lines). Not pushed, not merged.
- **A7:** `git diff 496a8941 e1c10e19 --name-only` gives `src/levels.test.ts` only. Over 8f2fc9b5 it also lists the two queue files (decision item 9). The diff removes nothing except the header count line (46 → 49): no existing title or `expect(` line changes. The added comments cite ABC-259, ADR-0056 and R-TC only.
- **UAT waiver:** `git -c core.quotePath=false diff --name-only e1c10e19~1 e1c10e19 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing, and the same is true over f40665b1~1..f40665b1. Zero production lines.
- **A8 cost:** the three new rows' summed duration is 0.83 / 0.78 / 1.26 ms over 3 head `npm test` runs, median **0.83 ms** (≤ 20 ms).
- **A9 gates:** `npm run lint` rc 0, `npm run typecheck` rc 0, `npm run build` rc 0. `npm test` ×3: rc 0, 63 files, **2 365 / 2 365**, numPending + numTodo = 0, all from the npm test JSON report rather than the separate npx skip-capture line. Base 2 362 (ABC-248's and qe-ABC-249's base count; not re-run at 8f2fc9b5) + 3 rows = 2 365. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", rc 0. `node tools/grugops/lane-inventory.js`: "The lane collects 63 test files; git tracks 63. No findings.", rc 0.
- **G8 (informal, head only, n = 3):** vitest Duration 9.29 / 8.78 / 9.45 s, median 9.29 s; shell wall 9.59 / 9.06 / 9.75 s, median 9.59 s. Measured at load1 4.84 / 4.85 / 4.65, NOT alone: a foreign vitest and a node API from another repo (oeselg-tech marketing) were running, plus postgres and abtop. ≤ 10 s holds as read, but this is not an admissible G8 window. QE owns A9's G8 (UNKNOWN - verify).
- **Open (Architect, non-blocking, from the ticket):** whether to widen the list to src/legal.ts, src/moves.ts and the milestone-1b modules.
