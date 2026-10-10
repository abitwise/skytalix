---
task: wave-2026-09-25
subtask: cut-harder-puzzles
role: ba-pm
workflow: agent-factory/workflows/03-epic-to-tickets.md (one ticket from owner word + QE findings)
ref: .grugops/context/cut-harder-puzzles/
owner_word: .grugops/context/wave-2026-09-25/notes/20261010T075200Z-orchestrator-decision-e47a1c08.md
source_refs: .grugops/context/qe-ABC-084/ (QE-084-a..d; 17-weakening probe)  .grugops/context/secnfr-ABC-084/ (N8-LANE, F1)  plans/tickets/ABC-084-*.md
enqueued_by: orchestrator
enqueued_at: 2026-10-10T07:52:00Z
branch: grugops/cut-harder-puzzles
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: cut the "harder puzzles" ticket (owner: "cut the harder puzzles ticket")

`ABC-084` is Done: 40/40 at budget 25, baseline at the ceiling. QE showed the gate is coarse —
10 of 17 subtle weakenings survive (quiescence off ×2, quiescence 1-ply, depth cap 3 and 4, PST off,
mate score ignoring ply, two LMR changes, ordering off). Cut ONE ticket (EPIC-004) that makes the
suite able to (a) catch those weakenings and (b) show an improvement:
- harder rows: mate-in-3, quiet-move tactics, positions needing depth ≥ 5, and rows whose answer
  flips if quiescence is off; independently sourced (`A6` discipline, QE's oracle approach);
- an acceptance criterion that names QE's 10 surviving weakenings and requires the new suite to
  go below baseline on a stated number of them — measured, not hoped;
- a baseline BELOW the ceiling so a stronger engine can raise it (option-B baseline rule applies);
- QE-084-c (win-material answers re-checked in a lane) and -d (black-to-move win-material rows,
  fewer mirror duplicates) as criteria if they fit, else name their home;
- `N8-LANE`, `A5`'s wall under option B's QE run (the suite runs at every engine ticket — price it),
  and `F1`'s lesson (no wall-clock assertion).
Check the next free id against `plans/tickets/` and the board. Size, prioritise, DoR-score.

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never push.
Own worktree; link `node_modules` into YOUR worktree only. Commit-message file in a PRIVATE
scratchpad subdirectory; `git commit -F`. Real UTC stamps.

## Publish
Ticket page, one trace row, a `decision` note under `ref:`. Queue pending → claimed → done per
Workflow 17. Report: id, title, size, priority, DoR with each ⚠️, criteria one line each, the board
row to add, branch + sha.
