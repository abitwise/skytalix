---
task: wave-2026-09-25
subtask: qe-ABC-083-seed5061
role: qe-e2e
ticket: plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
ref: .grugops/context/qe-ABC-083-seed5061/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-083-king-safety-mobility (tip 67c189b9)
base: 5ed308a8
---

# Subtask: class PUZZLE_DEEP seed 5061 for ABC-083. You are the ONLY hop running (width 1).

The build read PUZZLE_DEEP 53/58 vs base 54/58; seed 5061 was class L by the scope command. Class it per
ADR-0034 (puzzle classing; b @ 0.8x accepted) and ADR-0028: re-run the puzzle on base and branch on a quiet
machine (record load1 and `com.apple.system.thermalpressurelevel` per run), decide whether the miss is a
budget-edge/load artefact or a real evaluator regression, and state what the page's criterion then requires
(green, re-level by Architect, or a fix). Then do the ticket's QE pass on what remains un-reviewed.
Commit notes on the ticket branch; never merge or push; do not touch src/ or plans/board.md.
Use /usr/bin/diff (a `diff` shell function wraps git).
