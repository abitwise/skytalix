---
id: 20261011T120000Z-software-engineer-artifact-ref-fix085-branch-f28d91ad-ladder-test-ts-gates-a1f28d91
kind: artifact-ref
by: software-engineer
at: 2026-10-11T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-085
  - QE-085-a
  - QE-085-b
  - QE-085-c
  - sha f28d91ad (on 3783ae15)
  - branch grugops/ABC-085-self-play-ladder
  - src/ladder.test.ts
  - .grugops/context/fix-ABC-085/probe/mutants.mjs
  - .grugops/context/fix-ABC-085/probe/mutants.out.txt
supersedes:
---

# fix-ABC-085: `f28d91ad` on the ABC-085 branch: diff, gates and commands

Hand-authored and unsealed, following QE's precedent. No `sha` / `gate_run` / `content_hash` triple is claimed, because no §14 gate ran. This
was run in the SE's own worktree with `node_modules` symlinked. **No timing grades.** No `LADDER_DEEP` run was taken.

- **Diff:** `src/ladder.test.ts` only (+194 / -31), plus `.grugops/context/fix-ABC-085/probe/` (the driver and its output).
  `git diff --name-only aee4b8cb -- src` gives `src/ladder.test.ts`: 0 production lines.
- `npm run lint` (after `biome format` on the file), `npm run typecheck`, `npm run build`: exit 0 each.
- `npm test` (`LADDER_DEEP` unset): exit 0. 54 files of 54, 1693 tests of 1693, 0 failed, 0 pending, 0 todo
  (`.test-results/last-run.json` reads `success: true`). The ladder file has 13 rows (it had 9), and the last is still the 0-game pin.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
- `node tools/grugops/lane-inventory.js`: 54 = 54, `No findings.`
- `LADDER_DEEP=0 npx vitest run src/ladder.test.ts`: RangeError at collection, exit 1, no games (the refusal is unchanged).
- `node .grugops/context/fix-ABC-085/probe/mutants.mjs <wt>`: CONTROL green 13/13, and the result per mutant is in the observation note.
