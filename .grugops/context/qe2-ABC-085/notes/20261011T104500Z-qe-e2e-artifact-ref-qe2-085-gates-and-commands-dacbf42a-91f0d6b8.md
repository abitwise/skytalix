---
id: 20261011T104500Z-qe-e2e-artifact-ref-qe2-085-gates-and-commands-dacbf42a-91f0d6b8
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T10:45:00Z
verified_by:
confidence: high
refs:
  - ABC-085
  - sha dacbf42a (fix f28d91ad)
  - branch grugops/ABC-085-self-play-ladder
  - .grugops/context/qe2-ABC-085/probe/RUN.txt
supersedes:
---

# QE2 `ABC-085`: commands run and gate results at `dacbf42a`

Hand-authored and unsealed. No `sha` / `gate_run` / `content_hash` triple is claimed, because no §14 gate ran. QE used its own worktree
on the branch, with `node_modules` symlinked. **No timing grades.**

- `npm run lint`, `npm run typecheck`, `npm run build`: exit 0 each.
- `npm test` (`LADDER_DEEP` unset): exit 0, 54/54 files and 1693/1693 tests (`../probe/default-lane-dacbf42a.out.txt`). The ladder file
  has 13 rows.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
- `node tools/grugops/lane-inventory.js`: 54 = 54, `No findings.`
- `LADDER_DEEP=1 npx vitest run src/ladder.test.ts`, run **once**: exit 0, 18/18 (`../probe/short-run-qe2-dacbf42a.out.txt`).
- `node ../../qe-ABC-085/probe/cmp.mjs <earlier run> <this run>`, against each of the three earlier runs: 32 = 32 lines, all equal.
- `node ../probe/mutants.mjs <worktree>`: 17 plants, 3 call-site plants and a control (`../probe/mutants.out.txt`).
- `git diff --name-only aee4b8cb dacbf42a -- src`: `src/ladder.test.ts` only.
- **Not run:** `LADDER_DEEP=verdict`, and no mutant in a deep lane.
