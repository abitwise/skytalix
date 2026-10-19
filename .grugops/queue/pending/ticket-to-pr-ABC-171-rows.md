---
subtask: ticket-to-pr-ABC-171-rows
role: software-engineer
ticket: ABC-171
branch: grugops/ABC-171 @ 9ae31679
worktree: ../wt-ABC-171
---

# Add ABC-171's amended rows (A8 reworded, A13a–d); tests only

## Setup

In `../wt-ABC-171`, run `git merge --no-ff main`. That brings in two things:
- the amended page (`bapm-adr0045-cut`);
- main's fix that re-steps the A4-a2 and A8 mate-1 rows to step 100 (`a259a926`).

Resolve any conflict in `src/uci-session.test.ts`, keeping both sides.

## Write the rows

Write these rows exactly as the page states them. They are also listed in `.grugops/queue/done/bapm-adr0045-cut.md` § "Exact rows for ABC-171's SE hop".

| Row | What it covers | Mutants it must kill |
|---|---|---|
| A8 | reworded: draws per `ucinewgame`, a searched blunder `go`, a book hit, rate 0 | — |
| A13a | the seed oracle (k = 1..8; non-vacuous) | S32, S33 |
| A13b | a book hit at blunder levels draws 0 | S25, S31 |
| A13c | the dropped-limit line for `nodes`, and for `depth` + `nodes` + `mate` together | S38, S39 |
| A13d | an invalid `OwnBook` keeps `true` | S12 |

Each row must be green at the tip and must turn its named mutants red. Check that on scratch copies; QE's harness is at `.grugops/context/qe-ABC-171/probe/mutants3.mjs`.

## Rules for the rows

- Use coarse clock steps (100) wherever a search runs. No row may run a bare `go` on a step finer than 100.
- Do not raise any timeout.
- `src/uci-session.ts` should not need a change. If it does, stop and report.

## Gates (on your tip)

- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`
- `last-run.json` shows `success: true` with the full count.
- integrity at skip 0
- `CLI_DEEP` 10/10
- `PERFT_DEEP` 32/32
- the R-167-1 grep on added production lines

## Fences

- No timing readings.
- Do not touch `plans/board.md`, `plans/traceability.md`, `../wt-arch-ABC-173-adr0008`, or any process you did not start.
- Never push. Never merge to main.

## Handoff

Write `.grugops/queue/done/ticket-to-pr-ABC-171-rows.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the tip
- the rows, with the mutants each one kills
- the gates
- the production-lines measurement
- a trace row
