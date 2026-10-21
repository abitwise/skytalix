---
id: 20261021T134733Z-qe-e2e-observation-d0b8f5a8
kind: observation
by: qe-e2e
at: 2026-10-21T13:47:33Z
verified_by: 
confidence: high (commands run by QE)
refs:
  - ABC-185
  - plans/traceability.md
  - grugops/ABC-185
  - grugops/qe-ABC-185
  - bf6fc623
  - 745c6225
  - 3d166e01
  - a78c353a
  - 6273bed2
supersedes: 
seal: sha256:e05363e954e8301914dd3cdd0c79ad91c1bedd8f2c56b3a48c46af037dbf007f
---

# ABC-185 gates at 6273bed2 (src/, tools/ and configs identical to code 745c6225): green; UAT waiver applies

`git diff --stat 745c6225 6273bed2 -- src tools package.json package-lock.json tsconfig*.json vitest* eslint*` is empty, so these runs are the code tip's gates.
- `npm run lint` 0, `npm run typecheck` 0, `npm run build` 0.
- `npm test` rc 0: **59 files / 1987 tests passed**. `.test-results/last-run.json` (untracked, written by this run): success true, 1987 total / 1987 passed / 0 failed / 0 pending / 0 todo, 59 test results. Equal to base. No timing taken.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, rc 0.
- UAT waiver, AGENTS.md form: `git diff --name-only 745c6225~1 745c6225 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing (grep rc 1), and the same holds for `main...HEAD`. 0 production lines, so the waiver applies. A waiver is not a signature.
- `node_modules` was symlinked from the main checkout; it is git-ignored and removed before finish.
