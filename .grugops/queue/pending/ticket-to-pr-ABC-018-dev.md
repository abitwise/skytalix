---
task: ticket-to-pr-ABC-018
subtask: engineer-abc018-implement
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-018/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T08:37:04Z
branch: grugops/ticket-to-pr-ABC-018
---

# Subtask: implement `ABC-018` and take the `In Development → In Review` exit

Read the shared verified context at `ref:` first (Workflow 16 step 1). Nothing is inlined here. The
ticket was corrected at its `Backlog → Ready` exit — **five acceptance defects were fixed in place
before promotion** — so read `plans/tickets/ABC-018-frame-output-and-redraw.md` as it stands now, and
read the correction block under `## Acceptance` before you design anything: it decides `N`, the
reserved prompt row, the width constant and the ASCII sanitizer clause, and each ruling names the
alternative it rejected.

The Definition-of-Ready gate passed at the pull. `In Development` is 1/3.

Publish typed notes per Workflow 16. `finding` is not admissible on this task — see the substrate
section of the Orchestrator's first note.
