---
id: 20261011T152136Z-qe-e2e-observation-abc083-refind-5147-readings-54of58-weakened-exit1-levels-green-ee53fec8
kind: observation
by: qe-e2e
at: 2026-10-11T15:21:36Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-084
  - ABC-087
  - ABC-127
  - ADR-0028
  - ADR-0034
  - b29c837c
  - 35f49bb7
  - 5ed308a8
  - src/puzzle-corpus.ts
  - src/puzzle-suite.baseline.json
  - .grugops/context/qe2-ABC-083-refind/probe/summary.tsv
  - .grugops/context/qe2-ABC-083-refind/probe/gates.txt
  - .grugops/context/qe2-ABC-083-refind/probe/levels-deep-branch.txt
  - .grugops/context/qe2-ABC-083-refind/probe/scope.txt
  - .grugops/context/design-ABC-083-refind-5061/notes/20261011T150610Z-architect-design-decision-abc083-refind-5061-as-5147-clean-lead-bar-8205516a.md
supersedes:
---

# QE delta readings on the re-find: `PUZZLE_DEEP=1` 54/58 exit 0 on both trees (2 + 2 runs, per-row lines identical), `=weakened` 15/58 exit 1, gates green, and the `ENGINE_DEEP` levels lane, which the re-find feeds, green 28/28

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install. Every
reading is QE's own, width 1. An AGENTS.md Scribe ran lint, typecheck and one test file beside it.

- **Trees.** Branch tip `35f49bb7` (its `src/` equals `b29c837c`'s; `35f49bb7` touches no `src/` file), and
  base `5ed308a8` with `b29c837c`'s corpus patch applied (a `git archive` copy). `src/puzzle-corpus.ts` is
  byte-identical on the two (`/usr/bin/diff`). The only production difference is `src/evaluate.ts`.
- **Load.** load1 and thermal are recorded at the start and end of every budgeted run: **load1 2.25–4.51,
  thermal 0 throughout.** The suite's readings are node counts on a virtual clock, so load moves the wall
  only.

| run (`probe/`) | start → end load1, thermal | result |
|---|---|---|
| `r1-base` `PUZZLE_DEEP=1` | 4.51 → 3.96, 0 | **54/58, exit 0**, 18/18; seed 5147 SOLVED `b5b4` d5 n20514 |
| `r1-branch` | 3.96 → 3.28, 0 | **54/58, exit 0**, 18/18; seed 5147 SOLVED `b5b4` d5 n20514 |
| `r2-base` | 3.28 → 3.31, 0 | 54/58, exit 0, 18/18 |
| `r2-branch` | 3.31 → 3.27, 0 | 54/58, exit 0, 18/18 |
| `weakened-branch` `PUZZLE_DEEP=weakened` | 3.27 → 3.22, 0 | **15/58, exit 1**: the gate row red, `A3` ("solves FEWER than the baseline") green |
| `gates.txt` `npm test` | 2.25 → 2.31, 0 | exit 0, 56 files, **1 739/1 739** |
| `npm run lint` / `npm run typecheck` | 2.31, 0 | exit 0 / exit 0 |
| skip count / integrity | 2.31 → 3.39, 0 | **0** / `No findings.` |
| `levels-deep-branch` `ENGINE_DEEP=1 src/levels.test.ts` | 3.19 → 3.11, 0 | exit 0, **28/28**, 200 s; `A4 [perft + puzzles]` 96 / 242 = 39.7 % against 40 %; `A3` easiest 31/58, default 54/58 |
| `levels-a3-attribution` `-t "A3 — the easiest level"`, base + 5147 | 2.14 → 2.73, 0 | exit 0; easiest **35**/58, default 54/58 |
| same, branch before the re-find (`1b5d5c42`) | 2.73 → 3.04, 0 | exit 0; easiest **31**/58, default 53/58 |

- **No other row changed solved state.** The per-row lines are identical across r1 and r2 on each tree.
  Against QE's own `qe-ABC-083-seed5061/probe/r1-{base,branch}.rows`, the only differing line on either tree
  is line 56: seed 5061 (`f5e6` SOLVED on base, `g2e1` MISSED on the branch) → seed 5147 SOLVED `b5b4` d5
  n20514. They also equal the Architect's `branch-1.rows` and `base-1.rows` byte for byte.
- **The oracle row is green on both trees:** `ABC-127` `A2` "each win-material row accepts EXACTLY the
  material-best moves, and they gain" passes in all four runs, so the oracle re-proves 5147's accept set and
  its `+3`. The pool entry (`ticket-to-pr-ABC-127/probe/curation/pools/cand-wm.jsonl`, `wm-5147`) carries the
  same FEN, accept set and gain.
- **Scope (`scope.txt`).** `b29c837c` (parent `1b5d5c42`) touches `src/puzzle-corpus.ts` only. No option-B
  trigger glob matches it. `src/puzzle-suite.baseline.json` is untouched in that commit and over
  `5ed308a8..35f49bb7` (54 / 58, budget 25, step 1, same four `unsolved`). No non-test module imports the
  corpus. The `ADR-0034` d2 instrument still prints `src/evaluate.ts` only.
- **What the earlier hops did not run, and QE did.** The corpus is not loaded by production, but it IS loaded
  by the `ENGINE_DEEP` levels lane: `src/levels.test.ts` `A4` plays the easiest level over the perft corpus
  plus every `PUZZLES` FEN, and `A3` counts the easiest and default levels over `PUZZLES`. The re-find
  therefore changes that lane's input. The Architect's scope check ("no production importer") is right and
  did not cover it. QE re-ran it: green, 28/28.
- **`A3`'s easiest count reads 31/58 on the branch, against 35/58 recorded on `main` (`qe-ABC-131`,
  AGENTS.md).** QE attributed it with two `-t` runs (the 27 "skipped" there are the `-t` filter, not
  skips). Base + 5147 reads 35/58, so the re-find does not move it on base. The branch before the re-find
  reads 31/58, so the −4 is the evaluator's (king safety and mobility), not the re-find's. The re-find moves
  only the default count (53 → 54). `A3` asserts `easiest < default` and nothing more; it is green.
- **The weakened run, read per row.** The `evaluate = 0` engine solves 15 rows: 13 mates, seed 5527 and seed
  5147. The count is 15/58, the same as at `67c189b9` (QE `…6b2e2f3b`), so the swap did not move it. 5147
  adds no bite against that one mutant. Proof 3 rests on the suite count (15 < 54), which holds.
