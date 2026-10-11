---
id: 20261011T114054Z-qe-e2e-artifact-ref-abc144-commands-and-probe-f8aab052
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T11:40:54Z
verified_by:
confidence: high
refs:
  - ABC-144
  - sha d675ef42 (reviewed tip; code d4468fd3; base 5ed308a8)
  - sha 9d0fcb96 (wave tip, dry-run merge, not committed)
  - branch grugops/ABC-144-cap-test-workers
  - .grugops/context/qe-ABC-144/probe/
supersedes:
---

# QE `ABC-144`: commands run and the probe files

Hand-authored and unsealed. No `sha` / `gate_run` / `content_hash` triple is claimed, because no §14 gate
ran. QE used its own worktree on the branch (session scratchpad `wt-qe-144`, removed at exit), with
`node_modules` symlinked. **No timing grades.**

## Commands

- `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`: run at head and on the dry-run merge.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
- `node tools/grugops/lane-inventory.js`.
- `node tools/grugops/host-protection.js`.
- `node .grugops/context/design-ABC-144/probe/resolved-workers.mjs`: at head, base, the wave tip and the
  merge, plus at head under `VITEST_MAX_THREADS=8`.
- `git merge --no-commit --no-ff grugops/wave-2026-09-25` at `9d0fcb96`, then `git merge --abort`.
- `npx vitest run src/cli.test.ts -t "ABC-144"` on each plant copy.

## Probe files (`.grugops/context/qe-ABC-144/probe/`)

| file | what |
|---|---|
| `plants.mjs`, `plants.out.tsv` | the 22 rows: control, the SE's 8 reds, 2 lowerings and QE's 11 extras |
| `projects-probe.mjs` | each resolved project's `isolate` (q5 / q5b) |
| `qe-leak-a.test.ts.txt` | the shared-global leak probe. Three copies, `a`/`b`/`c`, ran in the plant copies, never in the repository |
| `screen.mjs`, `screen-head-d675ef42.tsv` | `A6`'s 20-run count screen |
| `collect.mjs`, `deep-collect-5ed308a8-vs-d675ef42.tsv` | `A6`'s opt-in lanes, equal collection |
| `run-lanes.sh`, `deep-lanes-exit-d675ef42.tsv` | `A6`'s opt-in lanes, exit and counts at head |

The scripts take their trees as arguments. Each writes nothing inside the tree it reads, except
`npm test`'s own git-ignored `.test-results/`.
