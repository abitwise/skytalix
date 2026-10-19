---
id: 20261019T123000Z-software-engineer-decision-row-shape-a171r001
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-171-rows
at: 2026-10-19T12:30:00Z
verified_by:
confidence: high
refs: [ticket-to-pr-ABC-171-rows, ABC-171, QE-171-a, QE-171-b, QE-171-c, QE-171-d, bapm-adr0045-cut]
supersedes:
---

# ABC-171 A8/A13 row shape

Hand-authored, unsealed (no `context-io.ts` on this install).

- The blunder levels are read from `LEVELS` (`blunderRate > 0`) into `BLUNDER_LEVELS`, not by number, so A8's new row and A13b hold across ABC-174's re-cut.
- A8: the existing row stands (moved from step 10 to step 100). A second row sends one searched `go` per blunder level and checks the counter steps by exactly 1 each time. The book-hit half is A13b.
- A13a: k = 1..8 on the start position was non-vacuous for both clauses, so k was not widened and no position was added. The oracle is `createLevel(...)` on a fresh `virtualClock(100)`, which is the session's step.
- A13c: the wording is the tip's; the row checks the tokens `depth`, `nodes`, `mate` by word boundary and the count of `info string` lines (exactly 1).
- Every row that searches runs on step 100. No timeout was raised. `src/uci-session.ts` is unchanged.
