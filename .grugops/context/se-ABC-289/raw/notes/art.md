# se-ABC-289 artifact: `grugops/ABC-289` from `main` `063ca870`; not pushed, not merged

- Claim `57a9612a`; code and rows `41525692`; R7 re-point `dfd63769`.
- Production diff: `src/quiescence.ts`, `src/search.ts`, `src/engine.ts`. UAT is not waived.
- Tests: `src/quiescence.test.ts` (DP0–DP3 rows), `src/search.bundle.test.ts`, `src/search.test.ts`, `src/engine.test.ts`, `src/see.test.ts`, `src/search.futility.test.ts`, `src/search.null-move.test.ts`, `src/evaluate.taper.test.ts`.
- Raw: `.grugops/context/se-ABC-289/raw/`: `read.ts`, `reads.sh`, `lanes.sh`, `mut.py`, `mut.sh`, `diag.ts`, `w1.ts`, `out/`.
- **The branch is red by design of the STOP:** five default-lane rows, 16 deep W1 rows, two drift rows, the `G1` gate. Do not merge. No expectation was moved to green them.
- The worktree's `node_modules` is a symlink to the main checkout's (ignored); without it `src/cli.test.ts` A2 reds.
