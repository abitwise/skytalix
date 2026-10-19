---
id: 20261019T091900Z-qe-e2e-observation-abc146-166-merge-result-gates-and-waiver-2c6a9e14
kind: observation
by: qe-e2e
task: qe-ABC-146-166
at: 2026-10-19T09:19:00Z
verified_by:
confidence: high
refs:
  - ABC-146
  - ABC-166
  - NFR-008
supersedes:
---

# Merge readiness: merge-tree clean; on the merge result lint, typecheck and build exit 0, and `npm test` passes 58 files, 1844/1844; skips 0; waiver grep empty

Hand-authored and unsealed. These are gate results, not a §14 stamp.

- **Merge-tree:** `git merge-tree --write-tree main d93e247b` exits 0 with tree `4c97977cfa4b61e76d45cd6ae2a272975205f73f`.
  Main is `70759081`, and the merge-base is `eb216351`.
- **The scratch worktree.** `../wt-qe-ABC-146-166` was created detached at `70759081`, then
  `git merge --no-commit --no-ff d93e247b` ran. The index `write-tree` is `4c97977c`, the same tree as merge-tree.
  `node_modules` was symlinked from main's. The real branch was not touched. The worktree was removed at the end, after
  `git merge --abort`.
- **Gates on the merge result:**
  - `npm run -s lint` exits 0 ("Checked 113 files … No fixes applied."). `npm run -s typecheck` exits 0, and
    `npm run -s build` exits 0.
  - `npm test` exits 0 on the first run, inside the 60 s bound: 58 files, 1844/1844, 19.63 s. A foreign vitest
    (`public/grugops`) was running at the same time, so this is not a lane reading.
  - `.test-results/last-run.json`: `success: true`, `numTotalTests` 1844, passed 1844, failed 0, pending 0, todo 0,
    58 test results. This equals main's last recorded 58/1844. The branch adds no test.
  - The skip count from `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` is **0** (total 1844,
    `success` true).
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed "No findings." and
    exited 0.
- **NFR-008 / the default lane:** the file and test counts are unchanged from main, and the lane plays 0 ladder games
  because `LADDER_DEEP` is unset.
- **The UAT waiver (AGENTS.md § Test and UAT authority), measured:**
  - `git diff --name-only d93e247b~1 d93e247b | grep -v '\.test\.ts$' | grep '^src/'` prints nothing;
  - `eb216351..d93e247b`, the whole delivered range: nothing;
  - the merge delta against main (`git diff --cached --name-only HEAD` in the scratch tree), filtered the same way:
    nothing. That delta also has 0 files under `src/`, `tools/`, `vitest.config.ts`, `package*.json` or `AGENTS.md`.
  - **The production-lines grep is empty, so the waiver applies.** A waiver is not a signature.
