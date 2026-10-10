---
task: wave-2026-09-25
subtask: scribe-ABC-119-lane
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md (Scribe's pen: AGENTS.md)
ref: .grugops/context/scribe-ABC-119-lane/
source_refs: .grugops/context/ticket-to-pr-ABC-119-r2/ (…2409b286 drafted line)  .grugops/context/qe-ABC-119/ (gates …bc7d8341, gaps …b300968a QE-119-b/d)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:39:00Z
branch: grugops/scribe-ABC-119-lane
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: land the real-engine CLI lane line in `AGENTS.md` (ABC-119, merged `1cbd3ab1`)

The Engineer drafted it; QE's readings (3116–3147 ms children, 7/7) are the latest. Land it under
`### Test`, with the trigger "run at QE and after any `src/cli.ts` or `src/engine.ts` change"
(QE-119-b). Check the size against the 24,576 B cap on a scratch MERGE with
`grugops/ABC-127-harder-puzzles` too (it adds +169 B to `AGENTS.md` and is awaiting UAT) — if the
two together would exceed the cap, STOP and report the byte count. Keep the edit away from the
`PUZZLE_DEEP` lines so that merge stays clean. Do NOT refresh other test-count receipts. Fences:
only `AGENTS.md`, a note, a trace row at the END of `plans/traceability.md`. Gates: lint,
typecheck, `npm test` (the `AGENTS.md` guards in `src/cli.test.ts` must stay green),
`lane-inventory.js`.
