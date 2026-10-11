---
id: 20261011T101214Z-qe-e2e-artifact-ref-abc085-gates-and-commands-773b48cc-9e47d0b3
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T10:12:14Z
verified_by:
confidence: high
refs:
  - ABC-085
  - sha 773b48cc (reviewed tip; harness d5b0f0e2)
  - branch grugops/ABC-085-self-play-ladder
  - .grugops/context/qe-ABC-085/probe/RUN.txt
supersedes:
---

# QE `ABC-085`: commands run and gate results at `773b48cc`

Hand-authored and unsealed. No `sha` / `gate_run` / `content_hash` triple is claimed, because no §14 gate ran. QE used its own worktree on
the branch, with `node_modules` symlinked. **No timing grades.**

- `npm run lint`, `npm run typecheck`, `npm run build`: exit 0 each.
- `npm test` (`LADDER_DEEP` unset): exit 0. 54 files passed of 54, and 1689 tests passed of 1689. `.test-results/last-run.json` reads
  `success: true`, 0 failed, 0 pending, 0 todo. The ladder file has 9 rows, all passed, and the last is the 0-game pin.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
- `node tools/grugops/lane-inventory.js`: 54 = 54, `No findings.`
- `grep -rhoE 'process\.env\.[A-Z_]+_DEEP' src`: `LADDER_DEEP` appears once (`NFR-008`'s Applies-to picks it up by itself).
- `LADDER_DEEP=1 npx vitest run src/ladder.test.ts`, run **once**: exit 0, 14/14 (`../probe/short-run-qe-773b48cc.out.txt`). Every pair
  line has `commit` = `773b48cc…`, clean.
- `node ../probe/cmp.mjs` (SE run 2 against QE): 32 = 32 lines, all equal with wall, load1 and commit excluded.
- `node ../probe/mutants.mjs`: 17 mutants plus a control (`../probe/mutants.out.txt`).
- `LADDER_DEEP` refusals at collection, with no games: `""`, `0`, `true`, `VERDICT`, `4`.
- `git diff --name-only aee4b8cb 773b48cc -- src`: `src/ladder.test.ts` only. That is 0 production lines.
- **Not run:** `LADDER_DEEP=verdict`.
