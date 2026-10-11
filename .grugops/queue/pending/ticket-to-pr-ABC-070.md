---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-070
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-070-abc065-dependencies-names-a-drained-claim-as-live.md
ref: .grugops/context/ticket-to-pr-ABC-070/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-070-abc065-dependencies
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-070`, the drained claim in ABC-065 § Dependencies

XS, P3, DoR 10/10. The ticket page is the contract (A1–A5). Re-verify the premise at the current tip first.
If the sentence has already been repaired, STOP and report "close unstarted", as the page says.

## Stop conditions
- A4 and A5 are binding. **The delivered commit** changes exactly one path under `plans/tickets/`: the `ABC-065` page, inside § Dependencies' first bullet only. Put your § Delivery on the ABC-070 page, the trace row and your notes in a **separate, later** commit, so A5's `git diff <delivered>~1 <delivered>` stays clean.
- 0 `src/` lines. The suite must be green with 0 skips. A BA/PM agent is editing other ticket pages in parallel, and none of them is ABC-065.
- Take no timing readings for grading; the machine is loaded.

## Fences
Never merge or push. Do not touch `plans/board.md`, ADRs or `AGENTS.md`. Work in your own worktree, with `node_modules` linked into it only. Use real UTC
stamps and quoted heredocs only. End each commit with a `Co-Authored-By:` trailer naming the model you actually are.

## Publish
Publish notes per Workflow 16 and a trace row at the END of `plans/traceability.md`. Move the queue file pending → claimed → done by hand,
in the main checkout, uncommitted. Report: gates, per-criterion evidence, the delivered sha, the branch tip.
