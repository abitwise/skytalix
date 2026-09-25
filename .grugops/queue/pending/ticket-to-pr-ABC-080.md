---
task: wave-2026-09-24
subtask: ticket-to-pr-ABC-080
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-080-move-ordering-mvv-lva-killers-hash-move.md
ref: .grugops/context/ticket-to-pr-ABC-080/
ruling_ref: .grugops/context/ruling-abc080-081/   (R1 decision + the ordering observation and probe/)
refine_ref: .grugops/context/refine-abc080-081-cut-c1/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T14:00:00Z
branch: grugops/ABC-080-move-ordering
base: grugops/wave-2026-09-24 (tip after this enqueue)
---

# Subtask: build `ABC-080` — move ordering (MVV-LVA, killers, hash move)

DoR 10/10. The ticket page is the contract: its acceptance criteria (`A3` ≤ 4%, `A4` read at
d4 AND d5 with the delete rule judged on d5), its Scope (`src/search.ts` + `src/engine.ts`), its
test notes (including `ABC-079` QE G4, the `mvvLvaKey` promotion term), and its `N8-LANE`
line. The Architect's out-of-tree prototype in `ruling_ref:` `probe/` is a reference reading,
not code to copy blind. Reuse `mvvLvaKey` from `src/quiescence.ts` (`ADR-0024`).

## Stop conditions (hand up, do not trim or widen)
- Any score change against the unordered search at fixed depth: ordering must be lossless.
- `A3` above 4% on either position: report the reading and stop.
- A needed change outside the ticket's Scope.
- `N8-LANE` over its line: measure it, report it, do not trim tests to fit. The lane is
  already 22.29 s against 15 s (`AR-N8LANE-079` accepted by the owner).

## Fences
Never merge; never push. Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, or
ADRs. Own `git worktree` (symlink `node_modules` from the main checkout). Commit messages via a
scratchpad file and `git commit -F`; probes as node scripts.

## Publish
`decision` + `observation` + `claim` notes under `ref:`, a trace row, a ticket § Delivery.
Queue pending → claimed → done per Workflow 17. Report: gates (lint / typecheck / build / files
/ passed / skipped / skip-integrity), `A1`–`An` each MET or not with its reading, depth reached
in 3 s on kiwipete and position-6 (`chooseMove` at the default budget), the mutants you ran and
which rows red them, the `N8-LANE` charge with load average, sha, numstat.
