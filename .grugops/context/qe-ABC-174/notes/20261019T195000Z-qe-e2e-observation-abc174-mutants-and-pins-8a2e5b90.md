---
id: 20261019T195000Z-qe-e2e-observation-abc174-mutants-and-pins-8a2e5b90
kind: observation
by: qe-e2e
task: qe-ABC-174
at: 2026-10-19T19:50:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-174
  - ADR-0045
  - ABC-087
  - ABC-101
  - ABC-061
  - ABC-167
  - ABC-171
  - .grugops/context/qe-ABC-174/probe/mutants.tsv
  - .grugops/context/qe-ABC-174/probe/mut.sh
  - .grugops/context/qe-ABC-174/probe/mutants.out
supersedes:
---

# ABC-174 mutants: 22 run, 22 killed. Every re-pinned row is equal or stronger strength

Hand-authored and unsealed.

**Method.** A scratch tree (`git archive be6a5599` in the session scratchpad, `node_modules` symlinked) was used. A
control run of the whole default lane was green first: 1987/1987. Then each mutant was applied with one `sed`
(`probe/mutants.tsv`) and the whole default lane was run as `NODE_OPTIONS=--max-old-space-size=128 npx vitest run`.
After each run the file was restored from the pristine arm and checked with `cmp`. No restore failed. The branch, the
SE's worktree and `src/` on every branch were not touched. Raw output: `probe/mutants.out`.

| id | wrong build | failed | killed by (abridged) |
|---|---|---:|---|
| M01 | level 1 budget 100 → 110 | 2 | ABC-174 A1 deep-equal; A7 step-4 row |
| M02 | level 2 budget 180 → 200 | 1 | ABC-174 A1 |
| M03 | level 3 rate 0.1 → 0 | 3 | ordering row; ABC-174 A1; A5 skill-3 row |
| M04 | level 4 rate 0.05 → 0 (page armed red) | 2 | ABC-174 A1; **A5 skill-4 row** |
| M05 | level 4 rate 0.05 → 0.1 | 1 | ABC-174 A1 |
| M06 | level 3 rate 0.1 → 0.2 | 1 | ABC-174 A1 |
| M07 | level 4 budget 1000 → 900 | 1 | ABC-174 A1 |
| M08 | level 5 budget 3000 → 3500 | 15 | A1, A2, A7 A/B, A6, ABC-101 A8′, ABC-086 A5, ABC-167 A5/A6/A7. **Not the A3 row** |
| M09 | level 5 rate 0 → 0.01 | 52 | A1, A2, A6 rate-0, A8′, ABC-167 rows |
| M10 | `DEFAULT_LEVEL` 5 → 4 | 62 | ABC-087 A1, ABC-174 A2/A3/A7, A6 ×3, ABC-101 A2/A8′, ABC-086 A5 |
| M11 | `DEFAULT_LEVEL` 5 → 3 (page armed red) | 62 | as M10 |
| M12 | `DEFAULT_DIFFICULTY` 5 → 4 | 6 | ABC-061 A2/A3, ABC-101 A2, ABC-174 A2/A3, A8′, ABC-086 A5 |
| M13 | `DEFAULT_DIFFICULTY` 5 → 3 | 6 | as M12 |
| M14 | parser seeds `difficulty` 3 (constant left at 5) | 6 | as M12 |
| M15 | UCI option literal `default 3` (page armed red) | 4 | ABC-167 A1, ABC-171 A1, ABC-174 A5 ×2 |
| M16 | UCI option `default ${DEFAULT_LEVEL - 1}` | 4 | as M15 |
| M17 | UCI session starts at skill 3 (the option line still says 5) | 46 | ABC-167 A3/A4/A5 rows, ABC-174 A5 bare go |
| M18 | `createLevel` engine budget + 300 ms | 11 | **ABC-174 A3**, A6, QE-087-a, ABC-171 A2/A6 |
| M19 | `createLevel` engine budget × 1.4 | 4 | **ABC-174 A3**, A6, QE-087-a, ABC-171 A6 |
| M20 | `createLevel` engine budget − 1 ms | 1 | QE-087-a only (**not the A3 row**) |
| M21 | level 3 rate 0.1 → 0.05 (equal to level 4) | 1 | ABC-174 A1 only |
| M22 | level 2 rate 0.2 → 0.4 (equal to level 1) | 1 | ABC-174 A1 only |

**The page's three armed reds reproduce** (M04, M11, M15), as the SE reported.

**Thin spots, not survivors:**
- M21 and M22 make two adjacent levels share a blunder rate. The merged ordering row still passes, because the budget
  still rises. Only the D1 deep-equal kills them. That is enough, because D1 is the contract, but the deep-equal row
  is the only guard on the rate column.
- M20 is killed only by the QE-087-a spy row.
- M08 is not killed by the A3 row. See `…c41d7e2a`.

## Pins (the SE's § Pins), each read in `git diff bd480c99 be6a5599`
| pin | old → new | strength |
|---|---|---|
| ABC-087 A1 | `[1,3,5]` → `[1,5,5]`, title | equal |
| ABC-087 A6, engine.test.ts:901/903 | unchanged | equal |
| ABC-101 A2 | `== median` and `< max` → `== max`, `== HARDEST_LEVEL`, `== DEFAULT_LEVEL` | equal (still an exact value); M12–M14 red it |
| ABC-061 A2/A3 (7 objects) | `difficulty: 3` → `5`; none of the argvs sets `--difficulty` | equal |
| ABC-101 A8′ | comment only | equal |
| ABC-167 A1, ABC-171 A1 | `default 3` → `default 5` | equal |
| ABC-171 A6 table | `[3,3000]` → `[3,330]`, `[5,3500]` → `[5,3000]` | equal |
| ABC-171 A6 precondition | level 1 only → every level with rate > 0 | **stronger** |
| `levelTime` | `level <= 2` → `LEVELS[level].blunderRate > 0` | equal; it reads the data |
| ABC-171 A2 read-back | `levelTime(…,3)` → `levelTime(…,5)`, value 3000 | equal: a Hash `setoption` that moved the level to 3 or 4 gives 330 or 1000 and reds it |
| ABC-171 A7 | level 3 → 5 | equal; ABC-174 A5 adds the same check at the default, with no `setoption` |
| ABC-171 A8 | "level 3 draws none" → level 5 | equal (a rate-0 level) |
| ABC-167 A5 rows | label only, values unchanged | equal |
| ABC-171 A13a–d | unchanged; A13b now covers 3 and 4 | stronger by data |

**None was loosened, skipped or deleted.** No `.skip`, `.todo` or `.only` was added (skip count 0).
