---
task: wave-2026-09-25
subtask: fix-ABC-138
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (fix-forward before the Security/NFR gate)
ticket: plans/tickets/ABC-138-spawn-pin-holes-are-watched-by-hand-move-the-checks-into-the-pin.md
ref: .grugops/context/fix-ABC-138/
source_refs: .grugops/context/qe-ABC-138/notes/ (gap register …d5a380ba: QE-138-a/b/d; probe/RUN.txt) — on the ticket branch
enqueued_by: orchestrator
enqueued_at: 2026-10-10T16:33:02Z
branch: grugops/ABC-138-spawn-pin-in-suite (tip 1759e14c)
---

# Subtask: fix-forward `ABC-138` — close QE-138-a (and QE-138-d) in count (iii); correct the comment (QE-138-b)

1. **QE-138-a:** count (iii) skips any reference under a type node, and a class `extends` expression
   (`ExpressionWithTypeArguments`) is a value position — `class S extends (spawnSync as …) {}` + `new S(…)`
   spawned a real child with the suite green. QE verified a one-line fix in a scratch copy; read it in the gap
   register and make it yourself. The hole must red; the control and every type-only plant must stay green;
   re-check QE-138-d (instantiation expression) with it.
2. **QE-138-b (comment only):** the pin's comment names only non-literal names as count (i)'s blind spot; a
   literal module name in a non-first argument (`.call(process, "node:child_process")`, `Reflect.apply(...)`)
   is also unseen. Make the comment say so. Do not widen count (i) — that is Security/NFR's residual call.

A1–A6 must still hold; re-run the plant tables (engineer's and QE's) and A5's cost (load1 logged).

## Fences
`src/cli.test.ts` only. Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own NEW worktree;
link `node_modules` into it only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.
Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery addendum. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: before → after, plants, cost,
gates, numstat, sha.
