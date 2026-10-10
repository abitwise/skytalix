---
task: wave-2026-09-25
subtask: qe-ABC-094
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-094-book-probe-lookup-weighted-choice-and-safe-failure.md
ref: .grugops/context/qe-ABC-094/
source_refs: .grugops/context/ticket-to-pr-ABC-094/ (notes …d14f72cb, …77180424, …93e5f38e; probe/) — on the ticket branch; memory-bank/50-decisions/ADR-0037*, ADR-0036* (instrument .grugops/context/design-F-072-1/probe/clause-b.mjs), ADR-0035*
enqueued_by: orchestrator
enqueued_at: 2026-10-10T19:18:10Z
branch: grugops/ABC-094-book-probe (tip 59358836)
---

# Subtask: QE `ABC-094` — the book probe

Verify A1–A7 independently with your own harness (base `97223dfe`, code `8cf395fc`). Break `src/book.ts`
(wrong key encoding, off-by-one in the weighted pick, returning an empty-`m` entry, an illegal move slipping
through, a throw on corrupt input, a read at construction, a second warning) — which mutants stay green?
Run ADR-0036's clause (b) instrument yourself on `97223dfe..8cf395fc` and confirm 0/0/0. Re-take the
ADR-0035 cost (narrow set `src/book.test.ts` + twin); the engineer's reading was inadmissible (twin 3.1–3.3 %
at load1 8.5–10.7) — record load1 and say plainly if yours is inadmissible too. Confirm the production/test
numstat and that ABC-083's files are untouched.

## Fences
Test-only additions on the ticket branch if gaps need closing; no production `src/`. Never merge; never push.
No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into YOUR worktree only
(`diff -r -x node_modules`). Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.
Trailer `Co-Authored-By:` naming the model you actually are. Quoted heredocs only (`<<'EOF'`; placeholder + sed
for timestamps). Committed probe scripts may be run with node/bash/python3; if refused, say so. On any red
`npm test`, keep the JSON log and name the failing test.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
mutants, clause (b), cost, gaps with severity, gates, branch + sha.
