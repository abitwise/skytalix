---
task: design-low-batch-2026-10-11
subtask: design-low-batch-2026-10-11
role: architect-design
ref: .grugops/context/design-low-batch-2026-10-11/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/design-low-batch-2026-10-11
base: grugops/wave-2026-09-25 @ HEAD
---

# Subtask: Architect LOW batch, handoff #5 item 5

Handoff #5 is `.grugops/context/wave-2026-09-25/notes/…handoff-5-e41d7a20.md`. Find each item's source note with
`grep -rl` under `.grugops/context/` and `memory-bank/`. Rule on each item, or route it with one line.

1. **QE-093-b:** the book compiler does not check the source sha against the pin.
2. **ADR-0035 `--dir src` vs tests under `tools/`:** does the clause cover `tools/` tests?
3. **ABC-084 file count 49/51:** reconcile the count and name the stale one.
4. **N8-LANE "5 %" with no CPU level:** state which load level the 5 % is read at.
5. **`AR-N8SPAWN-DRIFT`:** it needs a new discharge point now that ABC-108 is DROPPED.
6. **The `host-protection.js` exit 2 reading:** the note reads "N/A — no git remote" (ADR-0007). Is exit 2 a pass, an N/A, or a fault?

## Fences
- **Take no timing or CPU measurements.** Other agents are loading the machine.
- Do not touch `src/`, `plans/board.md` or `AGENTS.md`. Do not touch the ABC-083, ABC-085, ABC-094, ABC-095 or ABC-105 tickets, because other agents own them right now.
- If an ADR change is needed, write it PROPOSED or as an amendment note. If an item needs a ticket, recommend the ticket and leave the cutting to BA/PM. Do not merge or push.

## Publish
Publish one typed note per item per Workflow 16 into `ref:`. Claim per Workflow 17, then mark the subtask done.
