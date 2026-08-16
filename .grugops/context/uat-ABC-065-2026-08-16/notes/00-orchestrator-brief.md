---
kind: decision
task: uat-ABC-065-2026-08-16
role: orchestrator
ticket: ABC-065
date: 2026-08-16
---
# Brief — conduct UAT for ABC-065

Classification: `uat`. Workflow: `agent-factory/workflows/06-uat-pack.md`.
Board: moved `Ready for UAT` -> `In UAT` by the Orchestrator (WIP 2/4, inside limit).

Ticket is MERGED to `main` and gates are GREEN both sides of the merge (figures on the board
row and in the gate notes — read them there, do not restate).

## The one thing that is NOT yours
The `In UAT` exit signature. AGENTS.md § Test and UAT authority: the owner granted the CONDUCT
of UAT, and did NOT say an agent's report is the acceptance signature. Conduct it, report it,
never self-sign, never move it to `Ready to Release` or `Done`. The signature is the owner's
to give or to redefine; escalating it is the Orchestrator's, already planned.

## Boundaries
- Do NOT edit `plans/board.md` or `plans/traceability.md` — a second agent runs concurrently.
  Put your trace delta in your notes; the Orchestrator appends it.
- `agent-factory/…` is read-only KIT. `.grugops/`, `plans/`, `memory-bank/` are STATE.
- Branch guard: never commit on `main`; use `grugops/uat-ABC-065-2026-08-16`.
