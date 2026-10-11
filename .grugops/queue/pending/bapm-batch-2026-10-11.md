---
task: bapm-batch-2026-10-11
subtask: bapm-batch-2026-10-11
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-batch-2026-10-11/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/bapm-batch-2026-10-11
base: grugops/wave-2026-09-25 @ HEAD
---

# Subtask: BA/PM batch for handoff #5, items 4 and 3 (ticket cut only)

Handoff #5 is `.grugops/context/wave-2026-09-25/notes/…handoff-5-e41d7a20.md`. Its standing rules apply.

## Do, in this order
1. **Fold `ADR-0038` (ACCEPTED) into `ABC-085`.** There are 9 items. Their source is the note `…8d778218`. Re-score DoR.
2. **Re-score `ABC-105`.** The owner answered its question in note `…owner-word-six-answers-b7c41e09`.
3. **Fold QE-094-a into `ABC-095` A5:** "warning → stderr, 0 bytes stdout". The source is the gap register `…3058eacd`, under `.grugops/context/qe-ABC-094/notes/` on branch `grugops/ABC-094-book-probe`. Do not touch the ABC-094 ticket. It is in UAT right now.
4. **Cut follow-up tickets from ABC-142's QE gaps.** The notes are under `.grugops/context/qe-ABC-142/`:
   - QE-142-a (MEDIUM: an unhandled error exits 1 but the file says success);
   - QE-142-b and QE-142-c (LOW).
5. **Cut a P1 ticket for the owner's new goal: reduce `npm test` CPU on the MacBook Air M3** (vitest chokes it). The owner allows the 10 s wall to rise "a bit". Make it measurable: Security/NFR proposes the new wall number from fresh quiet-machine readings, and the Architect owns pool/worker settings. `isolate: false` stays forbidden (`ADR-0008` d7). Re-read `ABC-111` against it and recommend whether it folds, drops, or stays.

## Fences
- **Do not run timing or CPU measurements.** Other agents are loading the machine.
- Do not touch `plans/board.md`, `src/` or `AGENTS.md`. Board moves are the Orchestrator's. Put the board moves you recommend in a `decision` note.
- Do not touch the ABC-083 or ABC-094 tickets. Other agents own them right now.
- Next free id: check `plans/tickets/` and the board for the highest ABC id before you cut.

## Publish
Publish typed notes per Workflow 16 into `ref:`, with the ticket pages under `plans/tickets/` and trace rows appended to `plans/traceability.md`. Claim per Workflow 17, then mark the subtask done.
