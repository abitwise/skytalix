# se-ABC-305: the branch at the stop. Scope 1 and 2 done; A1, A2 and A3 proven at `158bb992`

- **Branch** `grugops/ABC-305`, cut from `main` `a21136b0`, worktree `.claude/worktrees/se-ABC-305`. Commits: `2dd18186` claim; `158bb992` the merge; `a321b45e` PREREG and harness; then records. Nothing pushed or merged into `main`.
- **Conflict list, read fresh at `a21136b0`:** the same two as the page; `plans/traceability.md` merged clean. `src/evaluate.passer.test.ts`: `type Position` from the branch, `searchWithoutBundle` from `ABC-304`. `se-ABC-301-fit-2`: `main`'s `done/` copy kept.
- **One addition the page does not list:** the branch's `.grugops/queue/claimed/se-ABC-301-fit-2/claim.md`, which the merge would have brought in as a stale claim, was dropped too. `main`'s `done/se-ABC-301-fit-2.claim.md` is byte-equal to it, so nothing is lost.
- **A1:** `git merge-base --is-ancestor` exits 0 for `b297ab89` and `e763119c`, and 1 for `dd88560f`, `d5041c54` and `e9cbeb40`. `158bb992`'s parents are `2dd18186` and `b297ab89`, the only commit on the branch with `b297ab89` as a parent.
- **A2:** outside the record paths, `git diff --name-only main...HEAD` lists exactly the six paths. `git diff b297ab89 HEAD -- tools/tune src/evaluate.king-mobility.test.ts` is empty. Both `searchWithoutBundle` rows and `chooseMoveWithoutBundle` stand in `src/evaluate.passer.test.ts`.
- **A3:** `git diff --name-only main HEAD -- src` prints the two test files and nothing else. `src/evaluate-params.ts` is byte-equal to `main`'s. The waiver's reference filter prints nothing.
- **Preflight (counts only, one run each):** `a21136b0` 71 / 2 709 / 0 / 0; `158bb992` 71 / 2 710 / 0 / 0, each exit 0. N + 1 as A4 asks, on one run. The rest of A4 is not read.
