---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-054
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-054-import-guards-count-statements-not-consumers.md
ref: .grugops/context/ticket-to-pr-ABC-054/
source_refs: .grugops/context/postmerge-followups-2026-10-10/ (…b974ac00)  .grugops/context/owner-adrs-followups/ (…41693c28)  .grugops/context/ruling-abc053-abc054/ (decision …3ab45af1)  .grugops/context/secnfr-ABC-053/ (…8deff3d6)  memory-bank/50-decisions/ADR-0030-* ADR-0029-* (accepted)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T12:36:35Z
branch: grugops/ABC-054-consumers
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-054` — "imports" vs "consumes" (`ADR-0030`)

DoR 10/10, S, P1. The ticket page is the contract: licence half = docblock prose only (regex lines
byte-identical); `ABC-041` A8 counts value-binding consumers (8 import spellings: 4 count, 4 do not);
`A6` narrows the composer tripwire's "fails closed" claim (AR-053-COMPOSER); test note 5 re-runs QE's two
arming-order controls (AR-053-ORDER).

## Stop conditions
- Any production file would change — STOP.
- The licence regex lines (`:324`, `:393` per the page) must stay byte-identical — STOP if not.
- Widening the tripwire's set is Architect/Design's (ADR-0029 decision 2) — do not.
- Cost per `ADR-0035` (proposed): narrow set + twin, report R; UNRESOLVED ≠ MET.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules`
into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.
`ABC-057` follows on the same files — don't touch its scope.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: gates, per-criterion evidence (X3b reds A8; 8-spelling table), cost,
`src/` numstat, branch + sha.
