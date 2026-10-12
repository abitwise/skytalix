---
task: wave-2026-09-25
subtask: fix-ABC-148
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-148-the-binder-count-comment-lists-two-forms-as-open-that-tsc-already-closes.md
ref: .grugops/context/fix-ABC-148/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-148-binder-comment (tip 94ca6c7e) + grugops/qe-ABC-148 (tip 238acd95, fast-forwards onto it)
---

# Subtask: repair QE-148-a and QE-148-b on `ABC-148` before merge (Orchestrator routing: repair, not a follow-up)

QE's verdict is PASS_WITH_GAPS (`.grugops/context/qe-ABC-148/notes/` on `grugops/qe-ABC-148`). The ticket exists to stop this paragraph naming
the wrong set as open; shipping "the open remainder is the two" after QE found eight would repeat its defect class in the other direction.
1. In your worktree on `grugops/ABC-148-binder-comment`, first `git merge --ff-only grugops/qe-ABC-148` (QE's notes; it is a fast-forward).
2. **QE-148-a:** re-plant QE's six extra forms YOURSELF (array destructure, typed array destructure, object-rename destructure, `function (history)`
   callback, destructured-param callback, `for…of` with object destructure) — `tsc` exit and `src/cli.test.ts` result each, reverted each time.
   Then rewrite the open-remainder sentence so it is TRUE WITHOUT CLAIMING COMPLETENESS: name the open forms by family (loop binders, callback
   parameters incl. `function` and parenthesised arrows, destructuring patterns), state that the regex sees only `history` directly followed by
   `[:=]`, and say the list is what was measured, not exhaustive. Keep the closed-by-typecheck and counted sentences.
3. **QE-148-b:** fix the "five `[:=]`-free forms" wording so it does not contradict the bare arrow's `=` being counted.
4. Append a dated line to the ABC-113 page correction note (struck words kept, line 64 byte-unchanged) and to § Delivery, matching the new wording.
Fence unchanged from `ticket-to-pr-ABC-148`: comment lines only under `src/`, only `src/cli.test.ts`, `it(`/`expect(` counts unchanged, lane
counts equal base. A short QE re-check follows you (a different agent).

## Fences
Never merge to main or push. Do not touch `plans/board.md`. Own worktree, `node_modules` symlinked. No `update-ref` on another branch, no
`--force`, `-D`, `reset --hard`. Other hops run in parallel: no timing readings. Gates before your last commit: lint, typecheck, build, `npm test`
with `.test-results/last-run.json` success:true. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Notes per Workflow 16, a trace row at the
END of `plans/traceability.md`. Queue pending → claimed → done by hand; leave the done file uncommitted. `Co-Authored-By:` trailer with your real
model. Report the tip, gates, your six readings, and the new sentence verbatim.
