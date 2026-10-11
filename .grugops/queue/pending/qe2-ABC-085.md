---
task: wave-2026-09-25
subtask: qe2-ABC-085
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-085-self-play-ladder.md
ref: .grugops/context/qe2-ABC-085/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-085-self-play-ladder (tip dacbf42a; fix f28d91ad)
---

# Subtask: second QE pass on the ABC-085 fix (QE-085-a/b/c)

The Engineer refactored `src/ladder.test.ts` into `colourSchedule`, `ladderPlan` and `summarizePair`, injected the level factory, and added 4 rows. The claim is
that they kill M5, M6, M7, M7b, M11, M12, M13 and M14. The notes are under `.grugops/context/fix-ABC-085/notes/` on the branch.
- **Re-plant all 16 of your mutants yourself** against the refactored file, and confirm which are killed. A refactor can move a plant site.
- **Check that the refactor did not change behaviour:** run `LADDER_DEEP=1` once. Its pair digests must equal the earlier three runs.
- Confirm the default lane plays 0 games, and state the file and test counts.
- The Engineer names one remaining gap: the `PLY_CAP` argument at the `runGame` call is unpinned. Rule whether it matters.
Do not touch production `src/` or `plans/board.md`. Take no timing grades. Never merge or push.
Publish notes per Workflow 16 with a PASS / PASS_WITH_GAPS / FAIL verdict, a trace row at the END of `plans/traceability.md`, and a § QE (2nd pass) section on the ticket.
