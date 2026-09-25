---
task: wave-2026-09-25
subtask: refold-abc121-adr0026
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (fold an accepted ADR + DoR re-score)
ticket: plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
ref: .grugops/context/refold-abc121-adr0026/
adr: memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md (ACCEPTED 2026-09-25, amended)
amend_ref: .grugops/context/amend-adr0026/
review_ref: .grugops/context/validate-adr0026/
enqueued_by: orchestrator
enqueued_at: 2026-09-26T00:10:00Z
branch: grugops/refold-abc121
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: fold accepted `ADR-0026` into `ABC-121` and re-score

Both prior ⚠️ are discharged by fact: `ABC-122` is `Done` (on `main` at `26c0fe0`), and the owner
accepted `ADR-0026` (*"4. accept"*, note `…6a63f2b7`). Fold the amended ADR into the ticket:
- the predicate returns plies (0/1) and classifies the move itself (a pure-function criterion);
- drift bars at depth 5 in both recursions;
- the one-extra-ply mate floor (d4 → d5) on the frozen mate-rich corpus `src/search.mate-corpus.ts`
  (287 positions per the probe, length-pinned; the Engineer builds it) — "0 flips on the 190
  corpus" is a report, not a bar;
- `A4`'s constructed fail-high at a null-window node, through both recursions;
- the review's planted-wrong-variant list as test notes (which row catches which).

Name, with measurable lines:
- `N8-LANE`: the new rows' default-lane cost is unmeasured (probe 11–19 s per depth pair under
  load) — say which rows belong in a deep lane and state that the Engineer measures.
- **`AGENTS.md` headroom: 32 565 B of 32 768 B (203 B).** Any deep-lane line `ABC-121` owes the
  Scribe will overflow; name `ABC-109` as a dependency for that follow-up (not for the build).

Re-score DoR out of 10 with every ⚠️ named.

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never push.
Own `git worktree` under `.claude/worktrees/`; commit messages via a scratchpad file and
`git commit -F`.

## Publish
Ticket edits, a trace row, a `decision` note (DoR) under `ref:`. Queue pending → claimed → done
per Workflow 17. Report: DoR with each ⚠️, criteria one line each, sha, numstat.
