---
id: 20261022T153005Z-qe-e2e-observation-b413b9cd
kind: observation
by: qe-e2e
at: 2026-10-22T15:30:05Z
verified_by: 
confidence: high
refs:
  - ABC-190
  - QE-172-a
  - ABC-168
  - EPIC-007
  - grugops/ABC-190
  - grugops/qe-ABC-190
  - 823a9885
  - 15766056
  - d79f4684
supersedes: 
seal: sha256:7d5d421b70fe150fe79c8b1428bdccb9ea584ef1f930bb3c22f629675b8fb8b5
---

# ABC-190 QE gates at d79f4684 (my worktree; npm ci --ignore-scripts there, rc 0, status clean)

- lint (`npm run lint`, biome check .) rc 0, 119 files, no fixes; typecheck rc 0; build rc 0 (dist/ ignored, status clean).
- `npm test` rc 0: 60 files / 1995 tests passed.
  - `.test-results/last-run.json`: success true, runState exited, exitCode 0, numPendingTests 0, numTodoTests 0.
  - The reporter's red-line jq prints nothing.
- Base 823a9885 (fresh scratch clone): `npm test` rc 0, 60 / 1995. The same 60 files and the same 1995 test full names (sorted diff empty).
- Skip-count capture as spelled (`NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`) -> `0`. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` -> `No findings.`, rc 0.
- UAT waiver, the owner's unfiltered form: `git -c core.quotePath=false diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing for 15766056, for d79f4684, and over main...HEAD. 0 production lines; the waiver holds.
- Heap 128 on whole-suite runs; no timing taken.
