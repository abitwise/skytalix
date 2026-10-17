---
id: 20261017T141000Z-software-engineer-decision-a1-proposal-9c4d0e17
kind: decision
by: software-engineer
task: resume-ABC-039
at: 2026-10-17T14:10:00Z
verified_by:
confidence: high
refs:
  - ABC-039
  - A1
  - A7
supersedes:
---

# Proposed A1 edit (Orchestrator's to make)

Line: `plans/board.md:1001` at branch tip `3062071c`, and `:1006` on `main` `e696d05b`. The `- [ABC-009]` row in `Done`.

Replace exactly `**FIRST BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY**` with
`` **SECOND BACKWARD BOARD MOVE IN THIS PROJECT'S HISTORY (the first was `ABC-011`, 2026-08-03; register: `plans/tickets/history/backward-move-ordinals.md`)** ``

Dry-run on copies of both boards: the old label occurs exactly once; afterwards `grep -c` of it gives 0,
`grep -c "^- \[ABC-009\]"` gives 1, and `/usr/bin/diff` shows exactly one changed line. The row still says
"Ready for UAT -> In Review on 2026-08-09 when `A11` was found unmet", and it names the register (A7).
