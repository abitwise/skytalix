---
id: 20261018T073403Z-ba-pm-observation-abc166-readings-b2b1241a
kind: observation
by: ba-pm
task: bapm-cut-ABC-166
at: 2026-10-18T07:34:03Z
verified_by:
confidence: high
refs:
  - ABC-166
  - ABC-146
  - ADR-0038
  - .grugops/context/abc146-verdict/notes/20261018T055215Z-orchestrator-observation-abc146-verdict-run1-no-score-lines-75f37904.md
  - .grugops/context/secnfr-ABC-146-a0/notes/20261017T191132Z-security-nfr-decision-abc146-a0-factor-reading-fhi-1006-route-v-f1558f02.md
supersedes:
---

# `ABC-166` cut readings: `A0` is not stale at `main` `fedb80d4`, and run 1 holds 0 `LADDER` lines

This note is hand-authored and unsealed. No `finding` is admissible on this install. **No test, vitest run or timing
was taken.** Everything here is a git read, an md5, a version print or a host-state print.

- **Branch facts, read with `git -C wt-ABC-146` and `git show`; the worktree was not edited.**
  - `grugops/ABC-146-ladder-verdict` tip is `d73c4d6c`. Its worktree is clean (`git status --porcelain` printed 0
    lines).
  - `main` (`fedb80d4`) is not an ancestor of that branch. The branch forks at `eb216351`.
  - `A0` (`c639a220`), `ADR-0038` addendum 2 (`3030bccf`) and run 1 (`d73c4d6c`) exist only on the branch.
- **Run 1** (`raw/verdict-run1.out.txt` at `d73c4d6c`): 9 lines, and `grep -c LADDER` is **0**. The meta file
  records commit `c639a220`, start `2026-10-17T19:13:37Z`, end `2026-10-18T05:50:59Z`, exit 0, load1 `9.11` at the
  start, node v26.11.1, vitest 4.1.11, and "Battery Power" at the start.
- **`A0` staleness inputs at `main` `fedb80d4`.**
  - `git diff --name-only eb216351 fedb80d4 -- src/ tools/ vitest.config.ts package.json package-lock.json` prints
    nothing.
  - `md5 -q src/ladder.test.ts` = `bba67b75565b4f4a2e8d231e8bcd6b2e`, and `md5 -q vitest.config.ts` =
    `2d2b6379dca047103493ab0bd9b10480`. Both equal `A0`'s values.
  - `node --version` = `v26.11.1`, and `npx vitest --version` = `vitest/4.1.11 darwin-arm64 node-v26.11.1`.
  - The branch adds no `src/` file over `eb216351` (`git diff --stat main grugops/ABC-146-ladder-verdict` lists records only).
- **The harness's print and plan**, from `src/ladder.test.ts` at `fedb80d4`:
  - `console.log` of `LADDER GAME` is at `:571` and of `LADDER PAIR` at `:597`.
  - The verdict rows assert at `:568`, `:588` and `:590`. `commitOf` is at `:298` and tags `+dirty-src`.
  - The plan is pinned at `:443`: `3v4 20`, `4v5 20`, `2v3 20`, `1v2 20`, `1v5 100`.
  - In short mode `SHORT_A2_GAMES` = 4 (`:56`), so the `-t "3v4"` pre-flight expects 4 `GAME` lines and 1 `PAIR` line.
  - No default-row test name contains `3v4`.
- **Host-state commands, checked to run** (07:32Z, main checkout): `pmset -g batt` printed `Now drawing from 'AC Power'`.
  `ioreg -r -k AppleClamshellState -d 4 | grep AppleClamshellState` printed `"AppleClamshellState" = No`. These are not
  readings for the run. They only show that the commands in `A1` exist and print what `A1` greps for.
- **`AGENTS.md`** is 24,576 B at `fedb80d4` (`wc -c`), which is exactly its budget.
