---
id: 20261018T175550Z-qe-e2e-observation-abc170-gates-at-tip-a91f6c30
kind: observation
by: qe-e2e
task: uat-ABC-170
at: 2026-10-18T17:55:50Z
verified_by:
confidence: high
refs:
  - ABC-170
  - A4
  - A7
  - grugops/ABC-170
  - .test-results/last-run.json
supersedes:
---

# UAT `ABC-170`: gates, fences and entry readings at tip `36e3a753`

This note is hand-authored and unsealed. Every command ran in `../wt-uat-ABC-170` at `36e3a753`, before any
harness file was added. `node_modules` was an APFS clone of main's, and `package-lock.json` is identical to
main's.

## Gates (pass/fail is graded; duration is not)

- `npm run -s lint`: exit 0 (`Checked 113 files … No fixes applied.`).
- `npm run -s typecheck`: exit 0. `npm run -s build`: exit 0.
- `npm test`: exit 0 on the **first run**. The 60 s bound was not hit, so there was no re-run. 58 files,
  1844/1844 passed.
- `.test-results/last-run.json`: `success: true`, `numTotalTests` 1844, `numPassedTests` 1844, failed 0,
  pending 0, todo 0. That is the full count the fix hop recorded (1839 + 5).
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
  (My first call left out the registry argument and exited 2 with `cannot read the registry file: 0`. That
  was my invocation error and not a gate result. The correct call is the one above.)
- `git merge-tree --write-tree main 36e3a753`: exit 0, with main at `af3769e3`.

## Fences

- **Waiver:** `git diff --name-only main...grugops/ABC-170 | grep -v '\.test\.ts$' | grep '^src/'` →
  `src/engine.ts`. The waiver does not apply.
- **`A7`:** `git diff --name-only main...36e3a753 -- src` → `src/engine.test.ts`, `src/engine.ts`. The two-dot
  form from `358810ac` lists four files because of the main merge (`UAT-170-a`, `…e4d07b39`).
- **`A7` limb grep:** over the `+` lines of `git diff acfdbeb3 36e3a753 -- src/engine.ts`, the tokens
  `process`, `from "`, `require`, `import`, `spawn`, `exec`, `fork`, `fetch`, `eval`, `Function`, `Worker`,
  `globalThis`, `child_process`, `fs` and `net` match nothing.
- **`A4` hunks:** `git diff -U0 acfdbeb3 36e3a753 -- src/engine.test.ts` gives `-517 +517,13`,
  `-520,4 +532,13` and `-1200,0 +1222,153`. The edits sit inside `:478-556`, and the rest are appended rows. At
  QE's tip the last hunk was `+1222,149`; the four extra lines are the `QE-170-a` per-root split.
