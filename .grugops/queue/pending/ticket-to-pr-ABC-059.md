---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-059
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-059-agents-md-runnability-guard-pins-a-spelling-not-a-fact.md
ref: .grugops/context/ticket-to-pr-ABC-059/
source_refs: .grugops/context/rescore-batch-2-2026-10-10/ (…4fdfe525)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:15:31Z
branch: grugops/ABC-059-runnability-guard
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-059` — the `AGENTS.md` runnability guard pins a spelling, not the fact

DoR 10/10, XS, P2. The ticket page is the contract (A1 re-worded today: 3 `Dev / run` occurrences, one a
pointer naming no command). `ABC-058` (same file, `src/cli.test.ts`) is merged. `ABC-133` follows on the
same file — don't touch its scope. Note: `AGENTS.md` content will change when `ABC-087` merges (Scribe
tightened receipts; the `Dev / run` slot is byte-identical) — the guard must read the fact, not a byte count.

## Stop conditions
- Any production file or any file beyond the page's — STOP. `AGENTS.md` itself is the Scribe's — do not edit.
- If your diff adds a literal containing `//` or `/*`, or a second `node:child_process` import form, to
  `src/cli.test.ts`, AR-058-STRIP's trigger fires — report it (it promotes `ABC-133` to P1).
- Cost per `ADR-0035` (proposed): narrow set + twin, report R.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules`
into YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: gates, per-criterion evidence (mutants red before/after), cost, `src/`
numstat, branch + sha.
