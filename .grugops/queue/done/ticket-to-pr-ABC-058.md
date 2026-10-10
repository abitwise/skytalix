---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-058
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-058-three-security-bar-instruments-cannot-observe-their-own-clauses.md
ref: .grugops/context/ticket-to-pr-ABC-058/
source_refs: .grugops/context/rescore-batch-2-2026-10-10/ (decision …4fdfe525, probe/)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T10:59:39Z
branch: grugops/ABC-058-security-bar-instruments
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-058` — security-bar instruments that cannot observe their own clauses

DoR 10/10, XS (re-scored today: `S1` already fixed and cut; `A3`/`A4` struck). The ticket page is the
contract. `ABC-059` follows on the same file (`src/cli.test.ts`) — do not touch its scope.

## Stop conditions
- Any file outside those the page names — STOP. No production file.
- `N8_SPAWN` / the `spawnSync` call-site pin must not move unless the page says so — STOP.
- Timing: per `ADR-0035` (proposed), read any cost on the narrowest file set (the touched test file
  alone, twin control) and report its spread R; if R exceeds the bound, report UNRESOLVED, not MET.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules`
into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: gates (+ `lane-inventory.js`), per-criterion evidence (mutants
red before/after), cost reading, `src/` numstat, branch + sha.
