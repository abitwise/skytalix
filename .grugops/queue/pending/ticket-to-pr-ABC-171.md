---
subtask: ticket-to-pr-ABC-171
role: software-engineer
ticket: ABC-171
page: plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
from: main 7df64755
branch: grugops/ABC-171
worktree: ../wt-ABC-171
---

# Implement ABC-171 end to end

The ticket page is the contract: scope, acceptance criteria and fences. Also read:
- ADR-0044, which is ACCEPTED: D10 (`OwnBook`) and D11 (`Skill Level`).
- The notes the page cites.
- ABC-167's merged session: `src/uci-session.ts`, with its notes under `.grugops/context/ticket-to-pr-ABC-167*/`, `qe*-ABC-167/` and `uat-ABC-167/`.

Carry these forward:
- **R-167-1** (`secnfr-ABC-167` `…99713c0e`). On your added lines, run this grep and report the result:
  `git diff -U0 7df64755...<tip> -- src | grep '^+' | grep -nE 'globalThis|\bglobal\b|Reflect|constructor'`
  It should print nothing. If it prints anything, explain each hit.
- **The ABC-085 verdict.** Levels 3, 4 and 5 do not separate in strength (`…4c1d8e27`). The owner is still deciding how to re-cut them.
  - `Skill Level` maps to `LEVELS` as the page says.
  - **Do not change `LEVELS` or `src/levels.ts` values.**

Where the page asks for tests, write them first, and stay within the page's scope. If an edge case on the page is undecided, **stop and report**; do not decide it.

## Gates
All of these must be green on your tip:
- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`
- `.test-results/last-run.json` shows `success: true` with the full count. Re-run if the 60 s bound cut the run off.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`

## Fences
- Take no timing readings. Leave any timing criterion OWED, and do not estimate it.
- Use the virtual clock and the ruled coarse steps where you can.
- Do not touch `plans/board.md`, `plans/traceability.md`, or any process you did not start.
- Never push, never merge, never `git push -f`.

## Handoff
Write `.grugops/queue/done/ticket-to-pr-ABC-171.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the tip;
- each criterion's result;
- the gates;
- the R-167-1 grep output;
- the production-lines measurement: `git diff --name-only 7df64755...<tip> | grep -v '\.test\.ts$' | grep '^src/'`;
- a trace row.
