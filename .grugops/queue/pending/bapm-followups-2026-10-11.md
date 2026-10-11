---
task: wave-2026-09-25
subtask: bapm-followups-2026-10-11
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-followups-2026-10-11/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/bapm-followups-2026-10-11
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: BA/PM follow-ups owed by today's hops

1. **Cut ABC-145 from QE-093-b:** the book compiler must check each source file's sha256 against a pinned `SOURCE_SHA256`. XS, P3, `tools/` only. The Architect specified it fully in note `…e95791ae` (`.grugops/context/design-low-batch-2026-10-11/notes/`).
2. **ABC-116:** re-point its two lines (about 124 and 185) that name ABC-108 as the `AR-N8SPAWN-DRIFT` discharge so they name ABC-144. Pointer only: no DoR, size or column change.
3. **G-QE-070-1:** ABC-065's DoR row 5 still says "the live `agents-md-owner-grants` claim". Choose between accepting it as a dated score and adding an annotation in the A2-re-wording style. Test note 2 forbids re-scoring, not annotating. The source is `.grugops/context/qe-ABC-070/notes/`.
4. **G-QE-070-2:** a line grep cannot see prose that wraps across lines. Record that a future text criterion uses a joined-text search, wherever the BA/PM criteria guidance lives. If no such place exists, write a `decision` note and skip the edit.

## Fences
Do not touch `src/`, `plans/board.md`, `AGENTS.md`, or the ABC-083, ABC-094 or ABC-114 tickets (QE owns ABC-114 right now; its XS re-size comes after). Take no
timing readings. Never merge or push. Work in your own worktree.

## Publish
Publish notes per Workflow 16, ticket pages, and trace rows at the END of `plans/traceability.md`. Move the queue file pending → claimed → done by hand, in the
main checkout, uncommitted.
