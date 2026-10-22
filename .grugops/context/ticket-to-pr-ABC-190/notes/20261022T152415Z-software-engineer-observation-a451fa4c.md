---
id: 20261022T152415Z-software-engineer-observation-a451fa4c
kind: observation
by: software-engineer
at: 2026-10-22T15:24:15Z
verified_by: 
confidence: high (run)
refs:
  - ABC-190
  - QE-172-a
  - ABC-168
  - EPIC-007
  - 823a9885
  - 15766056
supersedes: 
seal: sha256:1ba333a2bbcae0421e1086360cb63f9ba059aa4a6521fda3572668f26447e577
---

# ABC-190 artifact: branch grugops/ABC-190 @ 15766056, one file

- Base main 823a9885; tip 15766056; files: package-lock.json (+4 -0).
- A1: `git diff --numstat main...HEAD -- package-lock.json` -> `4	0	package-lock.json`.
- A2: the version/resolved/integrity grep over `-U0` -> 0; `git diff --name-only main...HEAD` -> package-lock.json only (notes under .grugops/ are excluded by the page).
- A3: in a fresh clone of the tip (scratchpad, not main's node_modules): `npm ci --ignore-scripts --dry-run` rc 0, `npm ci --ignore-scripts` rc 0, `git status --porcelain` empty; re-running the regeneration there rc 0 with no diff.
- npm audit before and after: identical vulnerabilities object, {info 0, low 0, moderate 4, high 3, critical 0, total 7}; packages @vitest/coverage-v8, @vitest/mocker, nanoid, postcss, source-map-js, vite, vitest. AR-1 is not re-stated here (Release Manager's).
