---
task: wave-2026-09-25
subtask: design-ABC-083-refind-5061
role: architect-design
ticket: plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
ref: .grugops/context/design-ABC-083-refind-5061/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-083-king-safety-mobility (tip 1b5d5c42)
base: 5ed308a8
---

# Subtask: rule and land the re-find of PUZZLE_DEEP seed 5061. You are the ONLY hop running (width 1).

QE classed seed 5061 class L (note `…b631991b`, `…67b0c99a`): an LMR near-tie at depth 5 (g2e1 over the label
f5e6 by 5 cp, within ADR-0026 d9), not an evaluator preference. Rule the re-find under ADR-0028 d2 read through
ADR-0034 d4, and land it in its OWN commit on the ticket branch: no trigger-list file, not the baseline file,
count and total unchanged. Weigh QE's recommended re-find bar (label leads best non-accepted move by > 75 cp in a
clean search at the solving depth, on base AND branch) and QE-083-c (the 0.8x margin cannot see LMR near-ties).
Show `PUZZLE_DEEP=1` reads 54/58 on the branch and `PUZZLE_DEEP=weakened` exits 1. Do not touch `src/*.ts`
production files or plans/board.md; never merge or push. Use /usr/bin/diff.
