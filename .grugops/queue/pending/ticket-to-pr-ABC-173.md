---
subtask: ticket-to-pr-ABC-173
role: software-engineer
ticket: ABC-173
page: plans/tickets/ABC-173-cap-vitest-at-two-cores-and-a-two-gb-heap-ceiling-that-every-lane-applies.md
from: main (current tip)
branch: grugops/ABC-173
worktree: ../wt-ABC-173
---

# Implement ABC-173 end to end, per the ADR-0008 addendum (ACCEPTED)

The contract is the ticket page plus the ADR-0008 § ADDENDUM 2026-10-19, which the owner accepted in `…9f3b6e20`:
- OQ1: two sizes;
- OQ3: every run.

The Architect's handoff lists the exact changes as items 1–10, the pins that move and the armed reds. Read `.grugops/queue/done/arch-ABC-173-adr0008.md` and the notes `…9c2f7a41`, `…4e81d0b6`, `…b7d35e20`.

## Do
- Make every change the Architect listed:
  - `package.json` `test` / `test:watch`
  - `tools/grugops/run-bounded.js` header
  - the new `tools/grugops/heap-guard.js`
  - the `vitest.config.ts` `globalSetup` and its paragraph
  - the `src/cli.real-engine.test.ts` heap token and probe
  - the `src/cli.test.ts` rows and re-pins (A10 values, `N8_SPAWN` 28, C2/A3/A6 static rows, A4)
  - the `AGENTS.md` lane lines
  - the `src/line-input.test.ts:77` comment
- Write tests first where the page asks for them.
- **AGENTS.md budget (ABC-109 A5).** `AGENTS.md` is at its 24,576 B budget. In the same diff, move at least the added bytes of receipt comments into `memory-bank/90-agents-md-command-log.md`, as the addendum rules. Do not touch the Dev/run slot.
- **A7.** Run every `AGENTS.md` lane exactly as spelled and record its counts. Record peak `heapUsed` as an observation, and the max live-worker count once. If more than 4 workers are live at once, or there is any out-of-memory error: **stop and report**. The owner's word is "ask on breach".
- **Armed reds.** Watch each one go red, then revert it, as item 10 lists.
- **If a lane fails under the cap, stop and report.** Do not raise a flag.

## Gates
Run each lane as `AGENTS.md` now spells it, with the prefix:
- lint, typecheck and build
- `npm test`; `last-run.json` must show `success: true` with the full count
- integrity at skip 0
- `CLI_DEEP`: the count rises from 10 to 11
- `PERFT_DEEP`: 32/32

## Fences
- **No timing readings.** The N8-LANE and A9 twin readings go to QE, before merge.
- Do not touch:
  - `plans/board.md`
  - `plans/traceability.md`
  - `../wt-ABC-171`
  - any process you did not start
- Never push. Never merge.

## Handoff
Write `.grugops/queue/done/ticket-to-pr-ABC-173.md` and `.claim.md` in main's working tree, uncommitted, with:
- the tip
- each criterion's result
- the lane counts table
- the armed reds
- the `AGENTS.md` byte accounting
- the production-lines measurement (`git diff --name-only <base>...<tip> | grep -v '\.test\.ts$' | grep '^src/'`)
- a trace row
