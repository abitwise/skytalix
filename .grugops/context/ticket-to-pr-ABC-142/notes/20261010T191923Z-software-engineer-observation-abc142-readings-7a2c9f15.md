---
id: 20261010T191923Z-software-engineer-observation-abc142-readings-7a2c9f15
kind: observation
by: software-engineer
at: 2026-10-10T19:19:23Z
verified_by:
confidence: high
refs:
  - ABC-142
  - NFR-008
  - ADR-0035
supersedes:
---

# SE `ABC-142`: readings for A1–A6, the gates and cost (code `41abc389`, base `086185d9`)

This note is hand-authored and unsealed. Each reading below was RUN on 2026-10-10 on macOS with
Node 24 and vitest 3.2.7.

## Gates, on the delivered tree

`npm run lint` exit 0 (102 files). `npm run typecheck` exit 0. `npm run build` exit 0. `npm test`
exit 0: 53 files, 1680 tests, the same as the base run in the same worktree just before (53 / 1680).
Skip-count capture `0`. `test-skip-integrity.js --skip-count 0` printed `No findings.` and exited 0.

## Acceptance

- **A1.** A scratch copy of the worktree was made outside the repo with `rsync`, plus a linked
  `node_modules`. In `src/zobrist.test.ts:22`, `.toBe(` was changed to `.not.toBe(`. `npm test` then
  exited 1, and the console read `1 failed | 1679 passed (1680)`. The file was read with `node -e`:
  `numFailedTests` 1 / `numPassedTests` 1679 / `numTotalTests` 1680, and the only failed entry was
  `file: src/zobrist.test.ts` with `fullName: "zobristKey is deterministic — the same position
  hashes to the same key"`. That is the console's `FAIL` line, with ` > ` joined as spaces. The copy
  was then reverted and deleted. The worktree's `git status --porcelain` was never touched by the
  plant.
- **A2.** The same red run piped through `| tail -3` showed only the Duration line, a blank line
  and the "JSON report written" line. The file had been deleted first, and the same `node -e` read
  of the new file gave the identical single failed entry.
- **A3.** Green `npm test` exited 0, and the console read `Tests  1680 passed (1680)`. The file read
  `success` true, `numFailedTests` 0, `numPassedTests` 1680, `numTotalTests` 1680, with 53
  `testResults`.
- **A4.** After A3, `git status --porcelain` listed only the four intended edits (now committed) and
  no `.test-results/`. The counts were 53 / 1680 against 53 / 1680 at the base.
- **A5.** `git diff --name-only -- src/ | grep -v '\.test\.ts$'` is empty. `git diff --numstat --
  src/` gives one row: `1 1 src/cli.test.ts`. `run-bounded.js` has only line 10 (the comment)
  changed. The AGENTS.md skip-count command returns `0`.
- **A6.** `src/cli.test.ts:1685` is still `expect(scripts[name], ...).toBe(command)`, and
  `added` is still `["chess"]`. In a scratch copy with `X` appended to the `test` script,
  `npx vitest run src/cli.test.ts` exited 1 with `1 failed | 66 passed (67)`. The failure was
  `ABC-042 — the shape of what was delivered > A10 — package.json gains exactly one scripts key and
  nothing else`.

## Console delta (green, base vs new, timings normalized and lines sorted)

There are two differences. The first is npm's own echo of the script text, which is inherent to
any script change. The second is one added line, `JSON report written to <abs path>`. Nothing else
differs.

## Cost (`ADR-0035`): 0 test files, 0 tests, 0 spawns added

Three interleaved pairs were run at load1 18.8→25.7, through `run-bounded.js` with
`node_modules/.bin` on PATH:

| pair | base wall s | base CPU s | new wall s | new CPU s |
|---|---|---|---|---|
| 1 | 7.46 | 31.79 | 9.69 | 35.83 |
| 2 | 11.95 | 37.40 | 10.68 | 35.91 |
| 3 | 12.92 | 36.92 | 12.56 | 37.16 |

The paired deltas change sign (wall +2.23 / −1.27 / −0.36, CPU +4.04 / −1.49 / +0.24). The cost is
not distinguishable from noise at this load, and no bound is claimed. The file is about 674 KB per
run.

## Limits

- Two runs in one checkout at once overwrite the file.
- An exit 124 writes no file and can leave a stale one in place.
