---
task: frame-merge-order-2026-08-11
subtask: repair-panel-tickets
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/repair-panel-tickets/
parent_ref: .grugops/context/frame-merge-order-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T00:00:00Z
branch: grugops/frame-merge-order-2026-08-11
---

# Subtask: repair `ABC-016` and `ABC-017` so both can pass the `Ready for Dev` gate

Both sit in `Ready` and NEITHER is dev-ready. `ADR-0009` (accepted, this round) is the input.

Owed, per Architect/Design's flags:

1. **Strike the `frameHeight(...) is 23` clause** from `ABC-017`'s `A1` and from `ABC-016`'s `A11`.
   Each keeps its own row-count clause. That clause was the entire import edge between the tickets.
2. **`ABC-016`'s `A11` is defective as promoted** — it PASSES the only two mutants that push the frame
   past 24 rows and make epic `4b` unreachable, because it hardcodes `history`. `A11` was added by `D8`
   specifically to protect `4b`. Repair it so it can fail on the cases it exists to catch.
3. **`A1` is blind to a 10-row board** (`board: 9` literal). Same class.
4. **`ABC-017` merges second, so it OWES the composition fit-check** as an acceptance criterion — in
   `src/frame.test.ts`, read from DELIVERED geometry (`renderBoard(...).length` plus the real exported
   constants), with a `= 23` tripwire and a `<= 24` requirement. The merged assertion at
   `src/frame.test.ts:632` is a tautology over three local literals and cannot fail on a panel that
   changes its row count — verified by the Orchestrator.
5. **`ABC-016`'s carried `NFR-002` flag reads "owed by Architect/Design" and is STALE** — it was ruled
   at `refinement-ABC-026` on the day it was raised. Correct it on the ticket.

Do not re-litigate `ADR-0009`; it is accepted. If applying it exposes a further defect, that is yours
to report, and constructing a wrong build that passes a criterion remains the way to prove a criterion
weak.

You may write `plans/tickets/ABC-016-*.md`, `plans/tickets/ABC-017-*.md` and `plans/traceability.md`.
You may NOT write `plans/board.md` (the Orchestrator's) and NOT `plans/nfr-catalog.md` or
`memory-bank/50-decisions/` (a concurrent Architect/Design hop owns those this wave). Flag, do not take.
