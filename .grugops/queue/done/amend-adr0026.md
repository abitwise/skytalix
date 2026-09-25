---
task: wave-2026-09-25
subtask: amend-adr0026
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (ADR amendment on the owner's acceptance)
ref: .grugops/context/amend-adr0026/
adr: memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md
review_ref: .grugops/context/validate-adr0026/notes/20260925T145700Z-architect-design-decision-adr0026-accept-with-amendments-9a3f6e21.md
owner_ref: .grugops/context/wave-2026-09-25/notes/20260925T234000Z-orchestrator-decision-6a63f2b7.md
enqueued_by: orchestrator
enqueued_at: 2026-09-25T23:50:00Z
branch: grugops/amend-adr0026
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: write `ADR-0026`'s accepted amendments

Owner's word, verbatim: *"4. accept"* — `ADR-0026` accepted **with the independent review's four
amendments** (`review_ref:`, decision 5 there = the one-door alternative). Write them into the ADR:
1. Decision 6 — the predicate returns the reduction in plies (0 or 1); it classifies capture,
   promotion, gives-check and in-check itself; the caller passes depth, move index, root flag.
2. Decision 9 — drift bars run at depth 5, in both recursions.
3. Decision 9 — replace the corpus mate floor with the one-extra-ply floor on the mate-rich corpus;
   "0 flips on the 190 corpus" becomes a report, not a bar; state plainly the bounded oracle is a
   net for gross drift and window bugs, not a proof of the reduction rule.
4. Consequences for `ABC-121` `A4` — the constructed fail-high at a null-window node.
5. Alternatives — the one-door options-record alternative and why it is rejected.

Set **Status: accepted** 2026-09-25 with the owner's words verbatim and the review's note id.
Where the mate-rich corpus lives for the build (a checked-in fixture path the Engineer will own) —
name it; do not build it.

## Fences
Only the ADR file, a trace row, notes. No `src/`, `plans/board.md`, `AGENTS.md`, tickets. Never
merge; never push. Own `git worktree` under `.claude/worktrees/`; commit messages via a scratchpad
file and `git commit -F`.

## Publish
A `decision` note under `ref:`, a trace row. Queue pending → claimed → done per Workflow 17.
Report: each amended clause in one line, sha, numstat.
