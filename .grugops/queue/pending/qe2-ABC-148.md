---
task: wave-2026-09-25
subtask: qe2-ABC-148
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-148-the-binder-count-comment-lists-two-forms-as-open-that-tsc-already-closes.md
ref: .grugops/context/qe2-ABC-148/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-148-binder-comment (tip 9c3efd62; repair code 2208d2a0; QE notes 238acd95; base 3537fe48)
---

# Subtask: QE re-check of the `ABC-148` repair (QE-148-a, QE-148-b)

Short re-check, not a full re-run. The repair notes are under `.grugops/context/fix-ABC-148/notes/` on the branch.
1. Re-plant at least THREE of the six extra forms yourself (one per family: a destructure, a `function (history)` callback, the `for…of` object
   destructure) plus the bare-arrow control; record your own `tsc` exit and `src/cli.test.ts` result before reading the Engineer's table.
2. Read the new paragraph against all eleven readings: every form it calls open is `tsc` 0 and green; counted and closed-by-typecheck are
   right; it claims NO completeness ("measured, not exhaustive"); QE-148-b's contradiction is gone.
3. Try for a seventh family (e.g. class field / parameter property, `let` re-assignment through a differently named binder, `using`, a
   labelled IIFE parameter default) — two or three plants are enough. If one is open, say whether the paragraph's "not exhaustive" wording
   already covers it (then INFO, not a gap).
4. Fence from git against `3537fe48`: comment lines only under `src/`, only `src/cli.test.ts`, `\bit(`/`\bexpect(` counts unchanged, lane counts
   equal base, ABC-113 line 64 byte-unchanged and struck words kept. Gates at the tip. UAT-waiver reading measured yourself.

## Fences
Do not touch `src/` or `plans/board.md`; revert every plant. Own worktree (sibling of the repo) on `grugops/qe2-ABC-148` off the tip — NEVER
`update-ref` the Engineer's branch. No `--force`, `-D`, `reset --hard`. Another SE hop runs in parallel: no timing readings. Never merge or
push. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at
the END of `plans/traceability.md`, a dated addendum to § QE on the ticket. Queue pending → claimed → done by hand; leave the done file
uncommitted. `Co-Authored-By:` trailer with your real model. Remove your worktrees when done. Report tip, verdict, readings, gaps.
