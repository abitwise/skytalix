---
subtask: fix-ABC-167-a4a2-step
role: software-engineer
ticket: ABC-167 (Done; test-only defect on main)
branch: grugops/fix-ABC-167-a4a2-step (from main, current tip)
worktree: ../wt-fix-ABC-167-a4a2-step
---

# Re-step ABC-167's heavy default-step rows (tests only)

## What fails

On main, `npm test` failed twice, at load1 of about 47. One test, `src/uci-session.test.ts` "A4-a2: an echoed control character in a go value is dropped from the info string", timed out (`Test timed out in 5000ms`, 6.0–6.3 s).

The cause: `go depth \x1b[31m` drops the depth token, so the line runs as a bare `go` (G = 3000 ms) on `talk`'s default step. With a clock check every 1024 nodes, that is about 3M nodes. `bapm-amend2-ABC-167` (`…5c7a1e30`) re-stepped the A5, A6 and A7 rows, but missed A4-a2 and any other row like it.

## What to do

1. Find every row in `src/uci-session.test.ts` whose search runs on the default step with a large G. That covers a bare `go`, a large `movetime`, or a dropped limit that falls back to G = 3000. Line ~490 is one candidate: `go movetime 500` on step 1, about 500k nodes.
2. For each row, pass the coarsest step from {10, 100} that keeps the row's assertions meaningful. A4-a2 asserts no time window, so step 100 is enough.
3. Do not raise any timeout, and do not change `src/uci-session.ts`.
4. Report each row you changed, with its node count before and after, read on the virtual clock.

## Gates

On your tip, all of the following:
- lint, typecheck, build and `npm test`;
- `last-run.json` shows `success: true` with the full count;
- integrity at skip 0;
- `CLI_DEEP` 10/10 and `PERFT_DEEP` 32/32.

Also run `npx vitest run src/uci-session.test.ts` three times. Report each file's duration as a count only, not a timing reading.

## Fences

- Change only `src/uci-session.test.ts`.
- Do not touch `plans/board.md`, `plans/traceability.md`, `../wt-ABC-171`, `../wt-arch-levels-recut`, or any process you did not start.
- Never push. Never merge.
- Note for the Orchestrator: ABC-171's branch also edits this file, and its merge will need to absorb this change.

## Handoff

Write `.grugops/queue/done/fix-ABC-167-a4a2-step.md` and `.claim.md` in main's working tree. Leave them uncommitted. Include the tip, the rows changed, the gates and a trace row.
