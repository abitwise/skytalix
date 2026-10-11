---
task: wave-2026-09-25
subtask: secnfr-ABC-083-quiet-readings
role: security-nfr
ticket: plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
ref: .grugops/context/secnfr-ABC-083-quiet-readings/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-083-king-safety-mobility (tip 09b8c960; re-level 547b5155; main merged in at 0129c4c8)
base: the branch's merge-base with main BEFORE the ABC-083 code (the pre-ABC-083 build the page's A7/A9 name)
---

# Subtask: ABC-083 quiet-window readings. You are the ONLY hop running (width 1).

Owner said yes to the A9 position-6 depth reading in a quiet window. Two readings, in order:

1. **A9** exactly as the page writes it: `chooseMove` at `DEFAULT_BUDGET_MS` on `kiwipete` and `position-6`,
   plain `node`, fresh process per run, three rounds alternating with the base build; record machine, Node
   version, load1 and `com.apple.system.thermalpressurelevel` per run. Plus clock-free cumulative nodes to
   complete depth 7 on `kiwipete`, base vs branch (ABC-082 read 532 363 → 610 179). Also A7 (3 s, depth ≥ base).
   If depth 7 is lost on kiwipete, state it plainly: that fires ADR-0031 d5 (mobility cut first, re-levels
   547b5155 become moot). Do NOT make the cut yourself; report it.
2. **N8-LANE**: re-read the default-lane CPU cost of the branch vs its base (the earlier read was +1.08 s CPU
   against the ≤ 650 ms clause), now on the k = 3 worker cap that main carries (ABC-144 merged f272eedb).
   Rule MET / NOT MET with required fixes or a proposed accepted risk for the owner.

Do not run anything else concurrently. Use worktrees. Commit notes and raw TSVs on the ticket branch.
Never merge or push. Do not touch `src/` or `plans/board.md`. Use /usr/bin/diff (a `diff` shell function wraps git).
