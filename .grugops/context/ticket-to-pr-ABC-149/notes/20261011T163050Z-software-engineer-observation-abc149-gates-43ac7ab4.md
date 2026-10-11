---
id: 20261011T163050Z-software-engineer-observation-abc149-gates-43ac7ab4
kind: observation
by: software-engineer
at: 2026-10-11T16:30:50Z
verified_by:
confidence: high
refs:
  - ABC-149
  - NFR-008
  - 20261011T163050Z-software-engineer-observation-abc149-readings-bd52fa01
supersedes:
---

# SE `ABC-149`: gates and fences at `e3e9c126` (base `4973d8e0`), worktree

This note is hand-authored and unsealed. Every line below was RUN on 2026-10-11.

- **`A1`.** `grep -cE '^//\s+(green|unhandled|hang|suite|assertion|exit code only):'
  tools/grugops/result-file-reporter.js` printed **6**.
- **`A6`, comment-only.** `git diff -U0 4973d8e0 -- tools/grugops/result-file-reporter.js | grep -E
  '^[+-][^+-]' | grep -vE '^[+-]\s*//'` printed nothing. `node --check` exited 0.
- **`A6`, fences.** `git diff --name-only 4973d8e0 -- src/ package.json package-lock.json
  vitest.config.ts tools/grugops/run-bounded.js AGENTS.md` printed nothing. The code commit changes
  two paths: the reporter (+35) and the `ABC-143` page (+1).
- **`A6`, the `ABC-143` page.** `--numstat` read `1 0`. Lines 1-298 are byte-identical to the base,
  by `cmp`, and so is everything after the inserted line 299.
- **`A6`, counts.** Base copy (`git archive 4973d8e0`): `npm test` exit 0, 56 files, 1740 tests,
  skip 0. Head worktree: exit 0, `56 passed (56)`, `1740 passed (1740)`, and the file read `success`
  true, `exited`, `exitCode` 0, with 56 `testResults`, 1740 tests and 0 pending or todo. The two
  are equal.
- **Mandatory gates.** lint 0 (107 files, `No fixes applied`); typecheck 0; build 0; `npm test` 0.
- **Integrity.** The skip-count capture returned `0`. `test-skip-integrity.js --skip-count 0`
  printed `No findings.`, exit 0. `lane-inventory.js`: `56 … git tracks 56`, `No findings.`, exit 0.
  `run-bounded.proof.js`: `all rows held`, exit 0.
- **Production filter.** `git diff --name-only 4973d8e0 HEAD | grep -v '\.test\.ts$' | grep '^src/'`
  was empty, so the UAT waiver should apply. That is measured again at the exit.
- **Not run.** E2E and acceptance are `UNKNOWN - verify` (no command). `host-protection.js` was not
  run. No deep lane was run: no `src/` file changed.
- `git status --porcelain` in the worktree was empty after `npm test`.
