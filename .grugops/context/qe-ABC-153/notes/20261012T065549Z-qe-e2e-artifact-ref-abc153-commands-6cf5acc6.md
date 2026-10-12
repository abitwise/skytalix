---
id: 20261012T065549Z-qe-e2e-artifact-ref-abc153-commands-6cf5acc6
kind: artifact-ref
by: qe-e2e
at: 2026-10-12T06:55:49Z
verified_by:
confidence: high
refs:
  - ABC-153
  - 20261012T065549Z-qe-e2e-observation-abc153-readings-cfba105e
  - 20261012T065549Z-qe-e2e-observation-abc153-plants-3d6ce640
supersedes:
---

# QE `ABC-153`: commands run and where

Hand-authored and unsealed; a pointer. Scratch = the session scratchpad (outside the repo), not retained.

- **Worktree:** `git worktree add -b grugops/qe-ABC-153 ../wt-qe-ABC-153 fe6add38`; `node_modules` symlinked from
  the main checkout. The Engineer's branch and worktree were not touched; no `update-ref`.
- **Plant copy:** `git archive 917df052 | tar -x -C <scratch>/copy` (+ `node_modules` symlink). Per reading: write
  the mutated `compile.ts` (string-replace, each replacement asserted to match exactly once) and the base/head/edited
  test into the copy, then `npx vitest run tools/opening-book/book.test.ts --reporter=json --outputFile=<scratch>/out/<label>.json`;
  exit code and the result file's counts and first failure line are the reading.
- **Base sources:** `git show 21980135:tools/opening-book/{book.test.ts,compile.ts}`; head: `git show 917df052:…`.
- **Base `npm test`:** `git archive 21980135` into `<scratch>/basecopy`, `npm test`, counts from
  `.test-results/last-run.json`.
- **Head gates (tip worktree):** `npm run -s lint`, `npm run -s typecheck`, `npm run -s build`, `npm test`;
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
- **Fences:** `git diff --name-status 21980135 917df052`; `git diff --diff-filter=A --name-only 21980135 917df052`;
  `git diff --name-status 917df052 fe6add38`; `sed -n` windows + `cmp`; `/usr/bin/diff` for hunk positions;
  `git show 21980135:<path> | cmp`; `grep -cE 'spawn|execFile|child_process'`.
- **UAT-waiver line:** `git diff --name-only 917df052~1 917df052 | grep -v '\.test\.ts$' | grep '^src/'` and the
  same over `21980135 fe6add38`: both empty (grep exit 1).
- **Not run:** any timing reading; any `*_DEEP` lane (no `src/` or engine change; the puzzle-suite trigger list is
  not touched).
