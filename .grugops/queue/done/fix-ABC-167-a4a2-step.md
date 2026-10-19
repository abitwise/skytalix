---
subtask: fix-ABC-167-a4a2-step
role: software-engineer
ticket: ABC-167 (Done; test-only defect on main)
branch: grugops/fix-ABC-167-a4a2-step (worktree ../wt-fix-ABC-167-a4a2-step, from main 94b4cfd8)
tip: a259a926
done_at: 2026-10-19T11:37:24Z
status: DONE — gates green; not pushed, not merged
refs: [ABC-167, bapm-amend2-ABC-167, 20261018T204242Z-ba-pm-decision-abc167-clock-step-ruling-5c7a1e30]
---

# Re-step ABC-167's heavy default-step rows (tests only)

## What changed
- Commit a259a926 changes `src/uci-session.test.ts` only (+2/-2). `src/uci-session.ts` is untouched, and no timeout was raised.
- Two rows now pass step 100 to `talk`.

## Correction to the brief
`dialogue`'s default step is **10**, not 1 (`function dialogue(lines, stepMs = 10)`), so the brief's estimates of about 3M and 500k nodes were too high by about ten times. The node counts below come from the virtual clock: a scratch probe drove `createUciSession` with the same lines and steps and read `nodes` off the info line.

## Every search row on the default step (step 10), measured
| row | go | nodes on step 10 | action |
|---|---|---|---|
| **A4-a2** | `go depth \x1b[31m` (dropped, so bare go, G 3000) | **300 053** (depth 7, time 3010) | **step 100: 25 621** (depth 5, time 3100) |
| **A8 mate -1** | `go movetime 500` on MATED_NEXT | **41 985** (depth 9) | **step 100: 548** (depth 5, still `mate -1`, bestmove h8g8) |
| A3, A3-h1 | `go movetime 100` | 6 173 | unchanged (small) |
| A9 ucinewgame, A9-h1 | `go movetime 100` | 6 165 | unchanged (small) |
| A7 go nodes 20000 | node-capped | 20 501 | unchanged (the node cap bounds it, not the clock) |
| A7 depth 1 / nodes 1 / mate 2 / depth 3 mate 5 / mate 1 depth 5 | depth- or mate-capped | 21–1 226 | unchanged |
| A4 refused positions, A4-a1, stalemate | no search (bestmove 0000) | 0 | unchanged |

Why step 100 is enough: A4-a2 asserts no time window. A8 asserts only the mate score, and at step 100 the search still reaches depth 5 and still reads `mate -1`.

Rows I saw but left alone, because they set their own step and so are outside the brief: `go` on step 50 (A7 depth-3 row) searches 55 317 nodes, and `go movetime 1000` on step 50 (the searchmoves row, run twice) searches 15 381 nodes each time. Every other heavy row was already on step 100.

## Gates (on a259a926; machine heavily loaded)
- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`: exit 0. Test Files 59/59, Tests 1915/1915.
- `.test-results/last-run.json`: `success: true`, numTotalTests 1915, passed 1915, failed 0, pending 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: 10/10.
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`: 32/32.
- `npx vitest run src/uci-session.test.ts`, three times: 71/71, 71/71, 71/71. These are counts only; no timing reading is reported.

## Fences kept
Only `src/uci-session.test.ts` was changed. `plans/board.md`, `plans/traceability.md`, `../wt-ABC-171`, `../wt-arch-levels-recut` and other processes were not touched. Nothing was pushed or merged. The worktree got its own `npm ci`.
- No context notes were written. This repo has no sanctioned `context-io` writer, and the fence allows only the test file. This handoff is the record.
- **For the Orchestrator:** ABC-171's branch also edits `src/uci-session.test.ts`, so its merge must absorb these two one-line changes (lines ~151 and ~490).

## Trace row (proposed; plans/traceability.md not touched)
| ABC-167 | grugops/fix-ABC-167-a4a2-step @ a259a926 | src/uci-session.test.ts | A4-a2 and A8 mate -1 moved from default step 10 to step 100 (300 053 → 25 621 and 41 985 → 548 nodes); timeout not raised; 1915/1915, CLI_DEEP 10/10, PERFT_DEEP 32/32 | Done (test-only fix; awaiting human merge) |
