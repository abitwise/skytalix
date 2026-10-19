---
subtask: ticket-to-pr-ABC-167-i
role: software-engineer
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
branch: grugops/ABC-167 @ 6922f772
worktree: ../wt-ABC-167
hold: do not start before the ABC-166 verdict run ends (width 1)
---

# Add the QE-167-i keyword-boundary tests (owner word `…9e4b2c71`, tests only)

`qe2-ABC-167` reported that "a keyword is never a value" is pinned only for `depth`, `nodes` and `mate`, and only when the next keyword is `movetime`. Read `.grugops/context/qe2-ABC-167/notes/…92d6d4e6` (mutants) and `…c02ebd96` (verdict). Then add rows to `src/uci-session.test.ts` that kill the surviving mutants:

| Mutant | What the wrong build does | Row that kills it |
|---|---|---|
| N06 | Time tokens read a keyword as their value. | e.g. `go movetime depth 3`: one `info string` naming `movetime`, then depth 3 |
| N07 | `movestogo` reads a keyword as its value. | a row for `movestogo` followed by a keyword |
| N13 | `infinite` is missing from the keyword set. | `go depth infinite` and `go searchmoves e2e4 infinite` must **hold** `bestmove` until `stop` |
| N14 | `depth` is missing from the keyword set. | a row with `depth` as the next keyword |
| N15 | `winc` is missing from the keyword set. | a row with `winc` as the next keyword |
| N09 (QE-167-j, cheap) | Writes the held `bestmove` and the refused `position`'s `info string` in the wrong order. | pin the order: `bestmove` first, then the `info string` |

## Rules for the rows
- Use the ruled clock steps (`bapm-amend2` `…5c7a1e30`). Use no step 1 where G is large, and do not raise the timeout.
- Each row must fail on its mutant. Check this on scratch copies.
- `src/uci-session.ts` should need no change. If it does, stop and report.
- The `src` diff stays exactly `src/uci-session.ts` and `src/uci-session.test.ts`.

## Gates
Run these on your tip:
- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`.
- Confirm `last-run.json` shows `success: true` with the full count.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`.
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`.

## Fences
- Take no timing readings.
- Do not touch `plans/board.md`, `plans/traceability.md`, `../wt-ABC-146`, `../wt-secnfr-ABC-167`, or any process you did not start.
- Never push. Never merge to main.

## Handoff
Write `.grugops/queue/done/ticket-to-pr-ABC-167-i.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the tip
- the rows added, with the mutant each one kills
- the gates
- the production-lines measurement
- a trace row
