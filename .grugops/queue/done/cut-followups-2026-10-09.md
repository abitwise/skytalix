---
task: wave-2026-09-25
subtask: cut-followups-2026-10-09
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (cut tickets from review findings)
ref: .grugops/context/cut-followups-2026-10-09/
source_refs: .grugops/context/qe-ABC-086/  .grugops/context/qe-ABC-082/  .grugops/context/qe-ABC-102/  .grugops/context/ruling-abc082-levels/  .grugops/context/fold-abc084-gate-b/
enqueued_by: orchestrator
enqueued_at: 2026-10-09T21:07:11Z
branch: grugops/cut-followups-2026-10-09
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: cut the review findings of 2026-10-09 into tickets (or fold them into existing ones)

Each finding gets exactly one home — a new ticket, or a named criterion on an existing one. Do not
duplicate; say for each where it went and why.
1. QE `ABC-086` G-QE-1 — no row runs two live virtual clocks at different steps (mutant M5 survives).
   QE's proposed row is in its notes. Must land before `ABC-085` builds on the clock.
2. QE `ABC-082` G-QE-1 — one-sided isolated-pawn neighbour check survives; one `A3` relation row.
   Candidate home: `ABC-083` (next to touch `src/evaluate.pawns.test.ts`).
3. Architect `ruling-abc082-levels` side finding — the quiescence corpus pair "R takes a bishop a
   pawn defends" starts with the side to move in check (Ba5+/Ba4+), against the corpus header; the
   "none in check" test only checks legality. NOTE: `ABC-084` (building now) moves that corpus into a
   data module — order the fix AFTER `ABC-084` merges and say so.
4. QE `ABC-102` G2 — the start-position help row is 21/21 columns; an eighth/ninth token hides
   commands. Affects `ABC-036`, `ABC-038`: put the constraint on those pages.
5. `ABC-087` Dependencies list `ABC-078` as OPEN (it is Done); `ABC-079`'s page still carries the
   "whichever lands first builds the corpus" open wording that `ABC-084` now settles.
6. `ABC-083` carries `AR-NFR005-082`'s trigger (repeat the plain-node depth read and the clock-free
   nodes-to-depth-7 read on kiwipete) — confirm it is on the page as a criterion.
Size and prioritise any new ticket; DoR-score each.

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Do not edit
`ABC-084`'s page (in development). Never merge; never push. Own worktree under `.claude/worktrees/`.
Commit messages via a scratchpad file + `git commit -F`. Real UTC stamps. Trace rows at the end only.

## Publish
Ticket pages/edits, trace rows, a `decision` note under `ref:` mapping each finding → its home.
Queue pending → claimed → done per Workflow 17. Report: per finding, its home (new id or page +
criterion), DoR of any new ticket, the board rows the Orchestrator should add/change, branch + sha.
