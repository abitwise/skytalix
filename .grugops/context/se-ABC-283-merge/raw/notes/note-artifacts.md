# se-ABC-283-merge artifacts: branch `grugops/ABC-283-merge` (worktree `.claude/worktrees/se-ABC-283-merge`, from `grugops/qe-ABC-283` `bc287789`). Nothing pushed, nothing merged into `main`, no history rewrite, no game played, nothing left running

## Commits
- `6a93d3e9` claim the brief;
- `62151993` merge `main` `715beb1c` (no-ff), `src/` `af2b77dc`;
- then the records commit: these notes, `raw/`, the Result, the trace row, and the brief and claim moved to done/.

## Changes
- **Files by hand:** `plans/traceability.md` (the conflict, both sides kept), then the records. No `src/` file was edited by hand; every `src/` change in the merge is git's, from the two parents.
- **Tests:** none added or removed by this hop. The default lane reads 2 687 = the bundle's 2 665 + `ABC-271`'s 22 (`main` 2 672 − its base 2 650), in 71 files (70 + `src/evaluate.passer.test.ts`).
- **Production lines:** the merge carries the bundle's (`src/search.ts`, `src/engine.ts`, `src/see.ts`) on top of `main`. No UAT waiver applies; UAT is signed by QE's verdict `…de1dc511` (ruling `…2409cec9`).

## Records
- **Raw:** `raw/scripts/` holds `drv.ts` and `grade-offline.py` (copies of qe-ABC-283's v2 driver and readout, plus a K0 part), `offline.sh`, `lanes.sh`, `pairs.sh` and `seal.mjs`. `raw/out/` holds `offline/`, `lanes/`, `npm-test-pairs.txt` and `npm-test-pairs-2.txt`.
- **Arms:** out of tree, `git archive` of `main` `715beb1c` (B) and of the merge `62151993` (H), in `<scratch>`, removed afterwards. Every run under `flock <scratch>/host-test.lock`.
- **Host paths:** the lane logs had the worktree path replaced by `<worktree>`; `records-path-check.js --base main` exits 0 before the records commit.

## Next
- Orchestrator: merge `grugops/ABC-283-merge` into `main` on green (the standing ruling), run the gates on `main` after; then `arch-ABC-283-accept`, and the Security/NFR hop for R-N8H-1 (QE-283-a, `…c7609f51` 3).
