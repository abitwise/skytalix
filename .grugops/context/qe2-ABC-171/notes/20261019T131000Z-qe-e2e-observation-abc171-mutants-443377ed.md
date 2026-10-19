---
id: 20261019T131000Z-qe-e2e-observation-abc171-mutants-443377ed
kind: observation
by: qe-e2e
task: qe2-ABC-171
at: 2026-10-19T13:10:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ABC-167
  - R-167-1
  - QE-171-a
  - QE-171-b
  - QE-171-c
  - QE-171-d
  - QE-171-f
  - 20261019T120500Z-qe-e2e-observation-abc171-mutants-c48a1f60
  - .grugops/context/qe-ABC-171/probe/mutants3.mjs
  - .grugops/context/qe2-ABC-171/probe/mutants3-file-named.log
  - .grugops/context/qe2-ABC-171/probe/mutants3-file-full.log
supersedes:
---

# ABC-171 mutants at `5dee231c`: 94 run, 80 killed, 14 survived. All 7 named are killed, and nothing regressed

Hand-authored and unsealed.

## How it ran
- **Harness:** `qe-ABC-171/probe/mutants3.mjs`, unchanged. The copy I ran has md5 `922fe541…4fdb`, the same as the
  original.
- **Where:** a fresh scratchpad copy made by `git archive 5dee231c`. `diff -rq` showed it identical to the worktree
  (`.git`, `node_modules` and `.test-results` excluded).
- **Mode:** file mode (`src/uci-session.test.ts`), with `--testTimeout=120000`.
- **Timing:** from 2026-10-19T12:49:01Z to 13:08:16Z.
- **Cleanup:** `src/` was restored and `diff -r` checked it. The copy is deleted.
- **Counts:** `N11` is a BAD-PATTERN, as before, and `N11b` stands in for it. 94 mutants ran.

## The named seven: all KILLED, each by its intended row
| mutant | killed by |
|---|---|
| S12 (invalid `OwnBook` → `false`) | A13d (1 failure) |
| S25 (book only at rate 0) | A13b, levels 1 and 2 |
| S31 (a seed drawn on a blunder-level book hit) | A13b, levels 1 and 2 |
| S32 (constant seed, draw kept) | A13a, k = 2, 4, 6, … (4 failures) |
| S33 (seed scale `2^16`) | A13a, k = 2, 3, 4 (3 failures) |
| S38 (only `depth` named) | A13c, both rows |
| S39 (one line per limit) | A13c, the combined row |

I ran them first on their own and then inside the full set. Both runs gave the same result.

## The full set, compared with `…c48a1f60` at `9ae31679`
- **ABC-167 regressions: 44 run, 37 killed.** This is unchanged. The brief's 17 and `qe2-ABC-167`'s six are still
  killed.
- **ABC-171: 50 run, 43 killed** (was 36).
- **Status changes:** exactly the named seven went from SURVIVED to KILLED. No mutant went the other way.
- **The 14 survivors**, each ruled before or since:
  - **M09, M10 and N08:** equivalent.
  - **M38 and M41:** caught by lint (`biome=1`).
  - **M40 and M42:** under R-167-1.
  - **S02, S03 and S07:** QE-171-f f1, f2 and f4, which BA/PM accepted with no row.
  - **S29, S45 and S47:** equivalent (the probe's memo).
  - **S46:** not observable.
