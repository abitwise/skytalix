---
task: wave-2026-09-25
subtask: bapm-owed-batch-2026-10-10
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-owed-batch-2026-10-10/
source_refs:
  - .grugops/context/wave-2026-09-25/notes/20261010T132239Z-orchestrator-observation-handoff-2-7d3e1b84.md (§ Owed routings → BA/PM)
  - .grugops/context/qe-ABC-053/notes/20261010T120534Z-qe-e2e-observation-abc053-gap-register-a4b293d2.md (QE-053-b/c/d)
  - .grugops/context/qe-ABC-054/notes/20261010T130030Z-qe-e2e-observation-abc054-gap-register-ee331683.md (QE-054-a/c)
  - .grugops/context/qe-ABC-057/notes/20261010T133223Z-qe-e2e-observation-abc057-gap-register-a331f012.md (QE-057-b)
  - branch grugops/ABC-087-difficulty-levels: .grugops/context/secnfr-ABC-087/notes/20261010T130030Z-security-nfr-decision-abc087-pass-with-risks-nfr004-ruled-per-move-played-ar-nfr004-a-reaccepted-clamp-pin-owed-3f1974f5.md (ABC-101 forward note)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T13:40:27Z
branch: grugops/bapm-owed-batch-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: BA/PM batch — owed page repairs, gap dispositions and one re-score

For each item, read the source, then do one of three things: repair the page wording, cut a ticket (XS/S,
DoR scored), or record a no-ticket disposition with a reason. Re-verify each premise at the current wave
tip first. August/early-October premises have gone stale before.

1. **ABC-041 A8:** add the one-line note owed on the page.
2. **ABC-129 re-score:** its ⚠️3 is discharged. Re-score the DoR. Note that the owner has not yet ruled
   whether comment-only production diffs count as zero production lines. Record which way the ruling
   moves this ticket. Never build or score it in parallel with ABC-132 (they pair).
3. **QE-053-b/c/d:** wording on the ABC-053 page or follow-up.
4. **QE-054-a** (comments read as specifiers) **and QE-054-c** (two instrument rows, XS).
5. **QE-057-b:** the composer prose undercounts the uncounted static import spellings. QE found two more.
6. **ABC-101 forward note:** look up only its own integer keys. The source note is on the unmerged ABC-087 branch. Read it there with `git show`.
   _[Orchestrator 2026-10-10: repaired — an unescaped command substitution in the enqueue heredoc had pasted the `git show 97de9122` output here; the intended text is restored. Lesson: escape backticks in unquoted heredocs.]_

## Fences
Docs only: ticket pages, new ticket pages, your notes. Do not edit `src/`, `plans/board.md`, ADRs or
`AGENTS.md`. Do not change any existing ticket's column. New tickets get `status: backlog` or
`ready`, as scored, and the Orchestrator places them on the board. Never merge; never push. Work in your own worktree.
Write the commit-message file in a PRIVATE scratchpad subdirectory. Use real UTC stamps. Trailer:
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Write notes per Workflow 16 and add a trace row at the END of `plans/traceability.md`. Move the queue file
pending → claimed → done (by hand, in the main checkout, left uncommitted). Report per item: the disposition, files touched, any new
tickets with DoR, size and priority, and owner questions; then the branch, sha and numstat.
