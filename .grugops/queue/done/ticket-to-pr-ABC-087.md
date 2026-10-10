---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-087
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
ref: .grugops/context/ticket-to-pr-ABC-087/
source_refs: .grugops/context/owner-adrs-followups/ (decision …41693c28)  .grugops/context/ruling-abc083-abc087/ (R3 probes)  memory-bank/50-decisions/ADR-0032-* ADR-0027-* ADR-0028-* ADR-0034-* (all accepted)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T11:17:42Z
branch: grugops/ABC-087-difficulty-levels
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-087` — difficulty levels (mechanism only) with the ADR-0032 blunder construction

DoR 10/10, M, P1. The ticket page is the contract. Binding rulings: `ADR-0032` (seeded draw per move;
blunder scores every root move via `chooseMove` on children under one deadline; STRICT second-best;
level module clamps its own total to `HARD_CEILING_MS`), `ADR-0027` (virtual clock; seed never
reaches move selection), `ADR-0028`/`ADR-0034` (how a red on an existing bar is ruled).

## Stop conditions (hand up, do not trim or widen)
- `src/engine.ts` or `src/search.ts` would need to change — STOP (page A8 / ADR-0032 decision 1).
- Option B: if your diff touches a trigger-list file, `PUZZLE_DEEP=1` must stay ≥ baseline — a red is
  classified per `ADR-0034` and handed up, never tuned away.
- Any acceptance number not reachable — report it, do not lower it.
- Cost per `ADR-0035` (proposed): read on the narrowest file set with a twin; report R; UNRESOLVED ≠ MET.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `plans/nfr-catalog.md` (NFR-004 wording is
Security/NFR's — draft it in your note), `AGENTS.md` (draft any line). Own worktree; link
`node_modules` into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory.
Real UTC stamps.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: gates, per-criterion evidence, the deep lanes your diff triggers
(`ENGINE_DEEP`, `PUZZLE_DEEP` if applicable), cost reading, `src/` numstat, branch + sha.
