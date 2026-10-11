---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-143
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-143-a-red-npm-test-can-leave-a-result-file-that-reads-green.md
ref: .grugops/context/ticket-to-pr-ABC-143/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-143-result-file-reads-red
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-143`, so that a red `npm test` can never leave a result file that reads green

S, P2, DoR 10/10. The ticket page is the contract. Re-verify the premise at the current tip first (the page says "re-measure at pull time").

## Stop conditions
- The count is the pin (`ADR-0035` d3): **0 test files, 0 tests, 0 spawns added** unless the page says otherwise. No timing bound. Report lane cost as
  "loaded machine, not graded".
- `package.json`'s `test` script is byte-pinned (`ABC-042` A10) and the pin moves with it. Touch exactly what the page allows. `vitest.config.ts`
  is NOT yours: `ABC-144`/`ADR-0040` own it.
- `run-bounded.js`'s documented exit contract stays byte-unchanged.

## Fences
Never merge or push. Do not touch `plans/board.md`, ADRs or `AGENTS.md`. Work in your own worktree, with `node_modules` linked into it only. Use real UTC stamps and quoted heredocs only.
End each commit with a `Co-Authored-By:` trailer naming the model you actually are. In this shell `diff` is a git wrapper; use `/usr/bin/diff`.

## Publish
Publish notes per Workflow 16, a trace row at the END of `plans/traceability.md`, and the ticket's § Delivery. Move the queue file pending → claimed → done by hand.
Report: gates, per-criterion evidence, diff names, branch and sha.
