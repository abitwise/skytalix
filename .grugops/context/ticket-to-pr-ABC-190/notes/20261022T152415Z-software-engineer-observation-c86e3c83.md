---
id: 20261022T152415Z-software-engineer-observation-c86e3c83
kind: observation
by: software-engineer
at: 2026-10-22T15:24:15Z
verified_by: 
confidence: high (run on the tip; counts only, no timing)
refs:
  - ABC-190
  - QE-172-a
  - ABC-168
  - EPIC-007
  - 823a9885
  - 15766056
supersedes: 
seal: sha256:0ada2abd3efa43bfb9b2d2d459aee90cc2837531f787cc796370aa52880b4f31
---

# ABC-190 gates on tip 15766056

- node_modules: a symlink to the fresh clone's `npm ci` install of the tip; worktree status stayed clean.
- lint (biome check .) rc 0, 119 files; typecheck rc 0; build rc 0.
- npm test rc 0: 60 files / 1995 tests passed = base 60 / 1995; last-run.json success true, numPendingTests 0, numTodoTests 0.
- Skip-count capture as spelled (heap 128) -> 0; `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` -> No findings., rc 0.
- UAT waiver (owner's form) `git -c core.quotePath=false diff --name-only 823a9885 15766056 | grep -v '\.test\.ts$' | grep '^src/'` -> empty: 0 production lines, so UAT is waived.
- NFR-008 is not triggered: 0 tests and 0 spawns added.
