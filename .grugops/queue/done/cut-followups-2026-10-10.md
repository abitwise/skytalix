---
task: wave-2026-09-25
subtask: cut-followups-2026-10-10
role: ba-pm
workflow: agent-factory/workflows (BA/PM cut; DoR per AGENTS.md)
ref: .grugops/context/cut-followups-2026-10-10/
source_refs: .grugops/context/qe-ABC-051/ (gap register …e9262a1c: QE-051-b, QE-051-c)  .grugops/context/qe-ABC-036/ (gap register …8c334653: G1, G3, G5)  .grugops/context/ticket-to-pr-ABC-051-r2/ (observation …0db3513e: five stale cites)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:16:22Z
branch: grugops/cut-followups-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: cut follow-up tickets from today's QE gap registers

Candidates (decide cut / fold / drop for each, with a reason):
1. **QE-051-b:** no test catches a `keyHistory` call on the take-back edge; `ABC-051`'s A8 title
   ("nowhere else") claims more than its rows check.
2. **QE-051-c:** 13 of 14 `turn-loop.ts:<line>` cites in other `src/` files are stale — cite by
   symbol. Sequence after `ABC-036` and `ABC-051` merge (`src/command-input.ts:58` is one).
3. **ABC-036 G1/G3/G5:** stale "seven tokens" comment at `src/command-input.ts:91` (may be fixed
   before `ABC-036` merges — owner's call; if so, drop); table order pinned by one row only; FEN
   identity asserted for one `moves` spelling only.
Next free ticket id is ABC-128. Size, prioritise, DoR-score each; name file overlaps with in-flight
`ABC-127` (puzzle files) and Ready `ABC-126`. Fences: no `src/`, no `plans/board.md`, no ADRs,
no existing ticket pages except to add a cross-reference line. Decision note per Workflow 16;
trace rows at the END of `plans/traceability.md`.
