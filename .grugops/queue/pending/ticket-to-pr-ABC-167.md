---
subtask: ticket-to-pr-ABC-167
role: software-engineer
ticket: ABC-167
page: plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
from: main e286526d
branch: grugops/ABC-167
worktree: ../wt-ABC-167
---

# Implement ABC-167 end to end

The ticket page `plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md` is the contract: its scope, acceptance criteria and fences. Read it together with ADR-0044 (ACCEPTED, D3, D4 and D12) and the notes it cites.

ABC-170 is merged at `abfc1acb`. `EngineOptions` now has `maxDepth` and `maxNodes`, and this ticket builds on them.

QE-170-g, from `.grugops/context/qe-ABC-170/notes/`, is the hand-off of edge semantics to this ticket:
- `go depth 0`,
- a very small `nodes` value,
- `go mate N` → `maxDepth` 2N−1.

Read it, and make sure the page's criteria cover these edge cases. If the page leaves an edge case undecided, **stop and report it**. Do not decide it yourself.

## How to work
- Write the tests first where the page asks for them, and stay within the page's scope.

## Gates
Run these on your tip. Each must be green:
- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`.
- `.test-results/last-run.json` shows `success: true` with the full count. If the 60 s bound cut the run off, re-run it.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`.
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`.

## Fences
- **No timing readings at this hop.** Any timing criterion is left OPEN and reported as "owed".
  - Do not estimate it.
- **Keep this hop lean and finish it.** ABC-166's width-1 verdict run in `wt-ABC-146` (about 10.6 h) waits for this hop to end before it starts.
- Do not touch:
  - `plans/board.md`,
  - `plans/traceability.md`,
  - the `wt-ABC-146` worktree,
  - any process you did not start.
- Never push, never merge, never `git push -f`.

## Handoff
When done, write `.grugops/queue/done/ticket-to-pr-ABC-167.md` and `.grugops/queue/done/ticket-to-pr-ABC-167.claim.md` in main's working tree. Leave both uncommitted. The handoff includes:
- the tip;
- the result for each acceptance criterion;
- the gate output;
- the zero-production-lines measurement, `git diff --name-only e286526d...<tip> | grep -v '\.test\.ts$' | grep '^src/'`;
- a trace row.
