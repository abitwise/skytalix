---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-148
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-148-the-binder-count-comment-lists-two-forms-as-open-that-tsc-already-closes.md
ref: .grugops/context/ticket-to-pr-ABC-148/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-148-binder-comment
base: main @ 61aef6e6
---

# Subtask: deliver `ABC-148`. Correct the binder-count comment in `src/cli.test.ts` to what `tsc` actually closes.

XS, P3, DoR 10/10. The ticket page is the contract. `A1` is a re-measurement: plant all five forms yourself, one at a time, record the `tsc` exit and the vitest result for each, and revert each with `git status --porcelain` empty after. Never copy QE-114-c's table: if your readings disagree, yours win and the disagreement goes in the delivery note. Comment lines only under `src/`. The `ABC-113` page note under line 64 is corrected in place with the struck words kept (`A3`); line 64 stays byte-unchanged. Another hop (`ABC-117`) edits a DIFFERENT comment in `src/cli.test.ts` in parallel; stay inside your paragraph. `A5` (author ≠ validator) is the QE hop's, not yours.

## Fences
Never merge or push. Do not touch `plans/board.md`. Work in your OWN worktree (`git worktree add ../wt-ticket-to-pr-ABC-148 -b grugops/ABC-148-binder-comment main`), with `node_modules` symlinked in only. Never use `git update-ref` on another hop's branch, never `--force`, `-D` or `reset --hard`. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. In this shell `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, with `.test-results/last-run.json` success:true. Two other SE hops run in parallel (width 3): take NO timing readings, and grade nothing on wall/CPU. Publish typed notes per Workflow 16 under `ref:`, add a trace row at the END of `plans/traceability.md`, fill § Delivery on the ticket page. Move the queue file pending → claimed (`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-148`) → done by hand; leave the done file uncommitted. Report: branch tip, gate results, each criterion PASS/FAIL with its reading, the UAT-waiver reading (`git diff --name-only main...HEAD | grep -v "\.test\.ts$" | grep "^src/"`), and the board move you recommend.
