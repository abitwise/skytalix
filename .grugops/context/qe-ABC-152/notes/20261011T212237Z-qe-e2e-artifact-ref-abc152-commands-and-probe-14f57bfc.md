---
id: 20261011T212237Z-qe-e2e-artifact-ref-abc152-commands-and-probe-14f57bfc
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T21:22:37Z
verified_by:
confidence: high
refs:
  - ABC-152
  - sha a99e9845 (reviewed tip; code 9313dda7..23c5521a; base 91024242)
  - sha ccb8f1bd (A2 old form, runner off before ruling 3)
  - sha 0ff618be (main at QE's review, dry-run merge, not committed)
  - branch grugops/ABC-152-vitest-4-1-runner-off
  - .grugops/context/qe-ABC-152/probe/
supersedes:
---

# QE `ABC-152`: commands run and the probe files

This note is hand-authored and unsealed. It claims no `sha` / `gate_run` / `content_hash` triple, because no
§14 gate ran.

## Trees

All of these sit outside the repository. **None symlinks `node_modules`.**

| tree | what | `node_modules` |
|---|---|---|
| `../wt-qe-ABC-152` | QE's worktree, detached at `a99e9845` (the branch is checked out in the SE's `../wt-ABC-152`, which QE did not use) | its own `npm ci` (vitest 4.1.11, coverage-v8 4.1.11, vite 7.3.6) |
| scratch `P-head` / `W-head` | `git archive a99e9845`: pristine and work copies | `cp -Rc` (APFS clone) of the worktree's |
| scratch `P-old` / `W-old` | `git archive ccb8f1bd` (its lockfile is byte-equal to head's) | `cp -Rc` of the worktree's |
| scratch `P-base` / `base` | `git archive 91024242` | its own `npm ci` (vitest 3.2.7) |
| scratch merge worktree | detached at `a99e9845`, then `git merge --no-commit --no-ff main` (`0ff618be`); aborted and removed | `cp -Rc` of the worktree's |

The main checkout was not switched, and its `node_modules` was not touched.

## Commands

- **Gates in the worktree:**
  - `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`;
  - the skip capture: `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `node tools/grugops/lane-inventory.js`;
  - `npm ls vitest @vitest/coverage-v8 vite`.
- **`V3` / `V6`:** `node probe/plant.mjs probe/specs/pin-specs.mjs <P-head> <W-head> <out>`. It runs
  `vitest run src/cli.test.ts -t "ABC-144 A7|ABC-152 V3"` per arm. The resolver is
  `.grugops/context/design-ABC-152/probe/resolved-workers-v4.mjs`, run per env value.
- **`V4`:** the same harness with `specs/v4-specs.mjs`, `v4b-head.mjs`, `v4b-base.mjs` (on the base tree),
  `v4c-old.mjs` and `v4d-a2.mjs` (on the old-form tree).
- **`V2`:** `node probe/v2rows.mjs <P-head> <node_modules> <out> <label> none|m9b|onfinished <rows>`.
- **`V5`:**
  - `git show <sha>:<file> | grep -o 'expect(' | wc -l`, per file, at `91024242` and `a99e9845`;
  - `git diff 91024242 a99e9845 -- '*.test.ts'`, searched for `it` / `test` / `describe` / `skip` / `only` /
    `todo` / `skipIf` / `runIf` lines.
- **`V7`:** `node .grugops/context/qe-ABC-144/probe/screen.mjs <worktree> 20 20 <tsv>`, unchanged.
- **`V8`:**
  - `node probe/collect.mjs <base> <worktree> <out>` (`vitest list --json`, 9 configurations);
  - `bash probe/lanes.sh <worktree> <out>`: each lane's exit and counts, **no wall read**,
    `PUZZLE_DEEP=weakened` and the two coverage commands.
- **`RISK-ABC152-NEGWORKERS`:** `VITEST_MAX_WORKERS=-1 npm test` and `VITEST_MAX_WORKERS=-2 vitest run
  src/san.test.ts`, on the work copy.
- **Dry-run merge:**
  - `git merge-tree --write-tree --name-only main a99e9845`;
  - then a detached worktree with `git merge --no-commit --no-ff main`, the gates, and `git merge --abort`.
- `/usr/bin/diff` and `cmp` for byte checks. The shell's `diff` wraps git, so it was not used.

## Probe files (`.grugops/context/qe-ABC-152/probe/`)

| file | what |
|---|---|
| `plant.mjs` | the plant harness: exactly-once anchors, diff, run, restore, `diff -rq` clean check |
| `specs/pin-specs.mjs`, `pin-results.tsv` | `V3` / `V6`: 31 arms (control, the ticket's 11 reds, `V3`'s 2, 3 greens, 14 QE extras) |
| `specs/v4*.mjs`, `v4-results-head.tsv`, `v4-results-base-91024242.tsv`, `v4-results-old-ccb8f1bd.tsv` | `V4`'s plants and results |
| `plants-condensed.txt` | every plant's diff and first reds (`condense.mjs` made it from the per-plant logs) |
| `v2rows.mjs`, `v2/cut-commands.txt`, `v2/v2-{head,m9b,onfinished}.json` | `V2`'s rows, the commands as cut, and per-row records |
| `query-url-probe/` | the two scratch test files (as `.txt`) and their output: factory mock vs `{ spy: true }` under a query URL |
| `collect.mjs`, `collect.tsv` | `V8`'s collection, base against head, by path and by test id |
| `v7-screen-head-a99e9845.tsv` | `V7`'s 20-run screen |
| `lanes.sh`, `lanes.tsv` | `V8`'s lane exits, `PUZZLE_DEEP=weakened`, coverage |
| `neg1-npm-test.txt` | `VITEST_MAX_WORKERS=-1 npm test`'s console |

Every script takes its trees as arguments. None writes inside a tree it reads, except `vitest`'s own output and
the harness's own edits, which it restores.
