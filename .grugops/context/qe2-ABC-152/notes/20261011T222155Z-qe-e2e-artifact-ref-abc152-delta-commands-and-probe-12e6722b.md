---
id: 20261011T222155Z-qe-e2e-artifact-ref-abc152-delta-commands-and-probe-12e6722b
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T22:21:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - sha 49997a87 (reviewed tip; delta 476fdde0, 502df2b6, 49997a87 over 88009d0b; base 91024242)
  - sha 9ad2c5f5 (main at this re-check; dry-run merge, aborted, not committed)
  - branch grugops/ABC-152-vitest-4-1-runner-off
  - .grugops/context/qe2-ABC-152/probe/
supersedes:
---

# QE `ABC-152` delta re-check: commands run and the probe files

This note is hand-authored and unsealed. It claims no `sha` / `gate_run` / `content_hash` triple, because no §14
gate ran.

## Trees

**None symlinks `node_modules`, and none sits in the main checkout.**

| tree | what | `node_modules` |
|---|---|---|
| `../wt-qe2-ABC-152` | QE's worktree **on** `grugops/ABC-152-vitest-4-1-runner-off` at `49997a87` (no other worktree held the branch) | its own `npm ci` (vitest 4.1.11) |
| scratch `P-head` | `git archive 49997a87`, pristine | `cp -Rc` (APFS clone) of the worktree's |
| scratch `W-<plant>` | per-plant clones of `P-head`, deleted after each run | cloned |
| scratch `base` | `git archive 91024242` | its own `npm ci` (vitest 3.2.7) |
| scratch merge worktree | detached at `49997a87`, `git merge --no-commit --no-ff main`; aborted and removed | cloned |

The main checkout was not switched, and its `node_modules` was not touched.

## Commands

- **Gates:**
  - `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`;
  - `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `node tools/grugops/lane-inventory.js`.
- **Group 4:**
  - `PUZZLE_DEEP=weakened npx vitest run src/puzzle-suite.test.ts --silent=false [--reporter=verbose]`, at the tip
    and on base;
  - `PUZZLE_DEEP=1 …` (with `--reporter=verbose` at the tip; on 4.1 a passing row's stdout needs it);
  - the default run;
  - per-row compare: `grep -E '^(SOLVED|MISSED|NEWLY-)'` on both runs, then `/usr/bin/diff`.
- **Plants:** `QE2_SCRATCH=<scratch> probe/plant.sh <name> <file> '<perl s{}{}g>' PUZZLE_DEEP=weakened
  src/puzzle-suite.test.ts --silent=false --reporter=verbose`. It aborts unless the substitution matches exactly
  once (checked with a zero-match control). Base x2 was done by hand on a clone of `base`.
- **Census:**
  - `npx vitest list --filesOnly`;
  - `grep -nE 'process[.]env|[.](runIf|skipIf)[(]'` and `grep -nE 'vi[.](mock|doMock|unmock|doUnmock|resetModules|importActual|importMock|spyOn)[(]|importOriginal|import[(]'`
    over the 56 paths, at `476fdde0` (archive) and at the tip;
  - `sort`, then `/usr/bin/diff` against the SE's raw files;
  - QE's widened patterns are in `…9dc4714f`.
- **`V2`:** `node probe/v2rows-qe2.mjs <P-head> <worktree node_modules> <out> <label> none|m9b
  green,unhandled,suite,assertion,exitonly,hang`.
- **A5:** `npm test` against `npx vitest run --reporter=default`, normalised, then `/usr/bin/diff`.
- **Comment-only:**
  - `git diff -U0 49997a87~1 49997a87 | grep -E '^[+-]' | grep -vE '^(\+\+\+|---) ' | grep -vcE '^[+-]\s*(\*|//)'`
    gives `0`;
  - `git show <sha>:<file> | grep -o 'expect(' | wc -l`.
- **`V5`:** `expect(` per file over `git diff --name-only 91024242 HEAD -- '*.test.ts'`, plus a scan of `+` lines
  for skip / only / todo.
- **`V7`:** `node .grugops/context/qe-ABC-144/probe/screen.mjs <worktree> 20 20 <tsv>`.
- **Merge:**
  - `git merge-tree --write-tree --name-only main 49997a87`;
  - then a detached worktree, `git merge --no-commit --no-ff main`, `git merge-file --union` on
    `plans/traceability.md`, the gates, `git merge --abort` and `git worktree remove`.
- `/usr/bin/diff` throughout. The shell's `diff` is a function that wraps git.

## Probe files (`.grugops/context/qe2-ABC-152/probe/`)

| path | what |
|---|---|
| `plant.sh` | the plant harness: exactly-once anchor, diff, run, timing cut, clone deleted |
| `plants/` | `pa-delete-impl`, `x1-finally-reset`, `x2-query-quiescence`, `x2-query-quiescence-BASE`: each with its diff, run and reds |
| `group4/` | weakened and `PUZZLE_DEEP=1` per-row TSVs at the tip and on base, run summaries (verbose for the tip's weakened run and `PUZZLE_DEEP=1`) and the default run |
| `census/` | `paths-56.txt`, steps 1–2 sorted at `476fdde0` and `49997a87`, and QE's env-variant extra |
| `v2rows-qe2.mjs`, `v2/` | the harness with new plant files, the commands as cut, and per-row JSON (plain and `M9b`) |
| `a5/` | the two normalised consoles that `/usr/bin/diff` found equal |
| `v7/v7-screen-49997a87.tsv` | the 20-run screen (`load1_before` dropped) |
| `merge/dry-run-merge-main-9ad2c5f5.txt` | the conflict, its resolution, and the merged tree's gates |
