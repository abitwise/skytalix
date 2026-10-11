---
task: wave-2026-09-25
subtask: fix-ABC-152
role: software-engineer
ticket: plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
ref: .grugops/context/fix-ABC-152/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-152-vitest-4-1-runner-off (tip 88009d0b)
base: 91024242
---

# Subtask: repair ABC-152 per ADR-0042 addendum 2 (decision note `…e50fbbe3`, now on main).

Exactly the three commits in the note's "SE repair" order: (1) QE-152-h in src/puzzle-suite.test.ts only, with the
weakened / plant (a) / PUZZLE_DEEP=1 readings and the census table (grep spelled `process[.]env`); (2) QE-152-a,
`vitest/node` at the reporter, with the six V2 rows; (3) QE-152-d comment lines only at the named sites. STOP and
report on any count other than 15/58 or a second class-(iv) site. Then full gates at the new tip. No timing reads.
Never merge. Use /usr/bin/diff.
