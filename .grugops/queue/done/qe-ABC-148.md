---
task: wave-2026-09-25
subtask: qe-ABC-148
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-148-the-binder-count-comment-lists-two-forms-as-open-that-tsc-already-closes.md
ref: .grugops/context/qe-ABC-148/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-148-binder-comment (tip 94ca6c7e; code 7acd8db2; base 3537fe48)
---

# Subtask: QE on `ABC-148`, the binder-count comment correction

Verify A1–A5 independently. **A5 is yours and is the criterion most likely to fail: re-plant all five forms YOURSELF**, one at a time, in a
scratch worktree or copy (the plant goes in an async IIFE at the `runTurnLoop(` call in `src/cli.ts`, as the page says), and record your own
`tsc` exit and `src/cli.test.ts` result for each. A verdict that quotes the delivery note's numbers FAILS A5. Only after your readings, compare them
with the Engineer's table (`.grugops/context/ticket-to-pr-ABC-148/notes/` on the branch) and with QE-114-c; name every disagreement.
Then check that the delivered paragraph and the ABC-113 page note say exactly what YOUR readings show (open / counted / closed-by-typecheck),
that line 64 of the ABC-113 page is byte-unchanged, that the struck words are kept, and the A4 fence from git (comment lines only under `src/`,
`it(`/`expect(` counts unchanged, `npm test` counts equal base, 0 skips). Look for a sixth binder form the paragraph ought to name and does not.
Measure the UAT-waiver reading yourself.

## Fences
Do not touch production `src/` or `plans/board.md`; revert every plant (`git status --porcelain` empty). Work in your OWN worktree checked out
from the branch tip in detached HEAD or a QE branch `grugops/qe-ABC-148` off it — NEVER `update-ref` the Engineer's branch. No `--force`, `-D`,
`reset --hard`. Take no timing readings (other hops run in parallel). Never merge or push. `diff` is a git wrapper here; use `/usr/bin/diff` or
`cmp`. Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`, and a § QE
section on the ticket, committed on `grugops/qe-ABC-148`. Move the queue file pending → claimed → done by hand; leave the done file uncommitted.
End commits with a `Co-Authored-By:` trailer naming the model you are. Report the branch tip, verdict, each criterion with your reading, and gaps.
