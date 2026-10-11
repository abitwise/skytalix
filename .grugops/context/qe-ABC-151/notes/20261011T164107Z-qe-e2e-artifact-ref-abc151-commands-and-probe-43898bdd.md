---
id: 20261011T164107Z-qe-e2e-artifact-ref-abc151-commands-and-probe-43898bdd
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T16:41:07Z
verified_by:
confidence: high
refs:
  - ABC-151
  - sha fc4ebb33 (reviewed tip; code 0035001c; base f439c8fd)
  - sha aa932974 (wave tip, dry-run merge, not committed)
  - branch grugops/ABC-151-two-test-workers
  - branch grugops/ABC-149-reporter-plants (merge-order check, not committed)
  - .grugops/context/qe-ABC-151/probe/
supersedes:
---

# QE `ABC-151`: commands run and the probe files

Hand-authored and unsealed. No `sha` / `gate_run` / `content_hash` triple is claimed, because no §14 gate ran.

**Trees:**
- QE's worktree on the branch (session scratchpad `wt-qe-151`), with `node_modules` symlinked;
- `git archive` copies of base `f439c8fd`, the head `fc4ebb33` and the wave tip `aa932974`;
- a detached worktree for the dry-run merge.

All of them sit outside the repository. The main checkout was not switched. **Nothing was timed.**

## Commands

- `npm run lint`, `npm run typecheck`, `npm run build`: at head, on the wave merge and on the both-merged tree.
- `npm test`:
  - 20 runs at head, through `.grugops/context/qe-ABC-144/probe/screen.mjs` (reused unchanged);
  - one run each at base, on the wave merge and on the both-merged tree.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`, and
  `node tools/grugops/lane-inventory.js`: at head, and the inventory again on the wave merge.
- `node .grugops/context/design-ABC-144/probe/resolved-workers.mjs`:
  - at head, base and the wave tip;
  - on both merge trees;
  - at head under `VITEST_MAX_THREADS=8`.
- `npx vitest run src/cli.test.ts -t "ABC-144"` on each plant copy (`probe/plants.mjs`).
- **The wave merge.** `git merge --no-commit --no-ff aa932974` in a detached worktree at `fc4ebb33`. It was
  aborted, and nothing was committed.
- **The both-merged tree.** `git merge-tree --write-tree --name-only` was run for `ABC-149` against `fc4ebb33`,
  and for `aa932974` against `ABC-149`. This writes tree objects only, with no commit and no ref. The tree was
  then built from `883564e6`, the wave plus `ABC-149`:
  - `vitest.config.ts` and `src/cli.test.ts` were overlaid from `fc4ebb33`. Neither the wave since base nor
    `ABC-149` touches them, so the overlay equals the true three-way merge for code;
  - the conflict markers in `plans/traceability.md` were deleted, which is a union.
- `npx vitest list --json=…` per lane configuration, at base and head (`probe/collect.mjs`).
- `/usr/bin/cmp` for byte checks. The shell's `diff` wraps git, so it was not used.

## Probe files (`.grugops/context/qe-ABC-151/probe/`)

| file | what |
|---|---|
| `plants.mjs`, `plants.out.tsv` | 27 rows: the control, the 7 addendum-2 rows and QE's 19 extras, at `fc4ebb33` |
| `plants-rerun-q6-q8.tsv` | q6 and q8 re-run with the fixed message regex (red both times) |
| `plants-base-f439c8fd-q11b.tsv` | q11b (`VITEST_MAX_THREADS=0x8`) at base: the pin is green, and the config resolves 8 |
| `rt.sh`, `rt-src/qe-pool.test.ts.txt`, `rt.out.tsv` | the runtime pool-slot probe. Six one-test files record `VITEST_POOL_ID` in a scratch copy. As it ran, it writes logs under `<script dir>/out/`, so copy it out of the repository before running it |
| `screen-head-fc4ebb33.tsv` | `A6`'s 20-run count screen at head (script: `../../qe-ABC-144/probe/screen.mjs`) |
| `collect.mjs`, `collect.tsv` | `A6`'s opt-in lanes, compared for equal collection between base and head |

Each script takes its trees as arguments. Nothing writes inside the tree it reads, except `npm test`'s own
git-ignored `.test-results/`, and the probe files, which `rt.sh` copies into its own scratch copy.
