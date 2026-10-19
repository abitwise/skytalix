---
id: 20261019T095550Z-qe-e2e-observation-abc167-gates-fences-controls-530eb78c
kind: observation
by: qe-e2e
task: uat-ABC-167
at: 2026-10-19T09:55:50Z
verified_by:
confidence: high
refs:
  - ABC-167
  - ABC-166
  - QE-166-d
  - NFR-008
  - R-167-2
  - grugops/ABC-167
  - grugops/uat-ABC-167
  - .grugops/context/uat-ABC-167/probe/controls.txt
  - 20261019T095300Z-qe-e2e-artifact-ref-abc167-uat-pack-af06cf1f
supersedes:
---

# `ABC-167` UAT: the gates at the tip, the fences, the harness controls, and the QE-166-d pointer

This note is hand-authored and unsealed.

## Gates at `660a0d50` (worktree `../wt-uat-ABC-167`, before any UAT file was added)

- `npm run -s lint` → exit 0 (115 files). `npm run -s typecheck` → exit 0. `npm run -s build` → exit 0.
- `npm test` → exit 0 on the first run: 59 files, **1915/1915** passed.
- `.test-results/last-run.json`: `success: true`, `numTotalTests` 1915, passed 1915, failed 0, pending 0, todo 0,
  `runState` `exited`, `exitCode` 0, 0 unhandled errors.
- Integrity: `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`
  (exit 0).
- `git merge-tree --write-tree main HEAD` against main `ad8b5e3b` → exit 0, tree `d6782dc3`, clean.
- `node_modules` was an APFS clone of main's (`cp -c -R`), and `package-lock.json` is identical to main's.
- The lane's duration is not graded and not quoted. N8-LANE is OWED (R-167-2).

## Fences

- Waiver test: `git diff --name-only main...HEAD | grep -v '\.test\.ts$' | grep '^src/'` → `src/uci-session.ts`.
  This is production code, so the UAT is conducted.
- A12: `git diff --name-only 32f8fc4a 660a0d50 -- src` (from the merge base) → exactly `src/uci-session.test.ts`,
  `src/uci-session.ts`.
- `src/uci-session.ts` md5 `b05800c2601b5b83165690c56598f8fd` before the gates, before and after both harness runs,
  and after the controls. Controls ran on scratch copies outside the repository.
- Untouched: `src/`, `AGENTS.md`, `package.json`, `vitest.config.ts`, `plans/board.md` and `plans/traceability.md`,
  and `../wt-ABC-167` (still clean at `660a0d50`). No other process was touched. Nothing was pushed or merged, and
  nothing was self-signed. No `uat/*.uat.spec.ts` was written.

## Harness controls (`probe/controls.txt`)

All eight are caught:
- C1, printable filter off: S8, S13.
- C2, `position` keeps the held line: S7, S13.
- C3, no 3 000 cap: S2, S4, S5, S6, S8; 165 checks.
- C4, black takes `winc`: S5.
- C5, no promotion letter: S3.
- C6, `ponder` does not hold: S6.
- C7, overhead 0: S5.
- C8, `quit` drops the held line: S7, S13.

**C4, C5 and C7 are each caught by a single check.** That is a thin margin, and the lane's A5-b1/b2 and A5-c1 rows
are the stronger pins for C4 and C7.

## Lane cost (reported, not graded)

Default lane: +0 files, +0 rows, +0 spawns. Nothing was added to `src/` or to the suite. Outside the lane, the
harness runs about 5.73M engine nodes per run and 0 child processes. It ran 3 times on the tip (RUN-0, RUN-1 and
RUN-2) and 8 times on the controls. One gate pass was run. **No wall-clock figure is reported.**

## QE-166-d pointer (main's working tree, uncommitted)

- I wrote
  `.grugops/context/qe-ABC-166/notes/20261019T095041Z-qe-e2e-decision-abc166-pointer-to-qe-abc146-166-3acddd34.md`.
  It points to `…7b4e1d93` (PASS_WITH_GAPS) and adds no grading.
- It carries `kind: decision` / `by: qe-e2e`, the keys the tool parses (`qe-hop-integrity.js:121`). It also carries
  the brief's `type: decision` / `role: qe-e2e`. The tool reads only `kind` and `by`, so a note with only `type` /
  `role` would still exit 1.
- `node tools/grugops/qe-hop-integrity.js --ticket ABC-166` → `ABC-166: covered (qe-e2e).`, **exit 0**. It also
  prints "ABC-166 is not a row in "## Done" of plans/board.md", which is informational and the Orchestrator's to
  act on.
