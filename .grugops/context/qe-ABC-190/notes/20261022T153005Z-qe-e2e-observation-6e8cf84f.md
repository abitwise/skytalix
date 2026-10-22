---
id: 20261022T153005Z-qe-e2e-observation-6e8cf84f
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
  - AR-1
supersedes: 
seal: sha256:43098778105b126546dccb082e2da1ae9b0965b78b143909aebd8cbce7b0ab6f
---

# ABC-190 QE: the regeneration is reproducible byte-for-byte; audit 7 = 7; nothing reads the lock; a second npm major agrees

- **Independent regeneration.**
  - Fresh clone of base 823a9885 in scratch; npm 11.20.0; `npm install --package-lock-only --ignore-scripts` rc 0 -> numstat `4	0`.
  - `cmp` against the tip's package-lock.json: byte-equal. sha256 `6ffeccdf3e5fc599b194621a24a4fcfc5749e462334e92e2ab3ddcbab510f40f` on both.
  - At the tip it is a no-op (A3 note).
- **Other npm major.** `npx npm@10` (10.9.9) `install --package-lock-only --ignore-scripts` on a fresh tip clone: rc 0 and no diff. So a contributor on npm 10 or 11 does not churn this lock.
- **npm audit --json**, after `npm ci --ignore-scripts` in fresh clones (rc 1 at both, as with any non-zero count):
  - base: {info 0, low 0, moderate 4, high 3, critical 0, total 7};
  - tip: the same;
  - the vulnerabilities objects are JSON-equal; packages @vitest/coverage-v8, @vitest/mocker, nanoid, postcss, source-map-js, vite, vitest;
  - dependency metadata equal (prod 1, dev 122, optional 60, total 122).
  - AR-1 is the Release Manager's and is not re-stated here.
- **Lock readers.** `grep -rn package-lock` over src/, tools/, scripts and the configs finds one doc comment only (src/san.suffix.hardening.test.ts:35). No test or tool reads the lock or its root.
  - The package.json readers (src/cli.test.ts A10 and the scripts pins, src/line-input.test.ts, src/cli.real-engine.test.ts) read package.json, which is unchanged.
  - This change cannot turn one red; the suite confirms it (equal files and test names at base and tip).
