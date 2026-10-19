---
id: 20261019T110601Z-software-engineer-observation-readings-a171d002
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-171
at: 2026-10-19T11:06:01Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-171
  - ABC-171
  - ADR-0044
  - EPIC-007
  - NFR-008
  - ABC-167
supersedes:
---

# ABC-171 readings on the virtual clock (`virtualClock(step)`), code `b6afd021`

Hand-authored, unsealed. **No wall-clock timing was read.** Every figure below is on the virtual clock. Any timing criterion is OWED to its gate.

- **A6** (`go wtime 60000 btime 60000 winc 1000 binc 1000`, G = 3500, step 100, bound G..G+200):
  - level 1: `info depth 1 nodes 21 time 200 pv e2e4` (budget 100);
  - level 3: `info depth 5 score cp 55 nodes 25621 time 3100 … pv g1f3` (budget 3000);
  - level 5: `info depth 5 score cp 55 nodes 30741 time 3600 … pv g1f3` (budget 3500).
- **A7** (level 1, step 10, three `go movetime 1000`s from startpos, after `e2e4 e7e5`, and Kiwipete):
  - `k = 2` gives `b1c3, b1c3, e2a6` in both sessions. Its draws take the blunder path, then the engine path twice. A row asserts that as a precondition.
  - `k = 3` gives `e2e4, b1c3, d5e6`.
  - At level 1, `go depth 3` gives `info string skill level 1 ignores go depth; searching on time`, then `info depth 4 nodes 6165 time 110 pv e2e4`, then `bestmove e2e4`.
- **A2**: `value constructor` gives `info string Skill Level takes an integer 1-5, got constructor; kept 3`. `OwnBook value maybe` gives `info string OwnBook takes true or false, got maybe; kept true`.
- **Observation (not a defect, outside scope):** on a coarse virtual clock, level 1's **blunder** path does not fit `G + 2·step`. It runs one `chooseMove` per legal root move, and each one reads the clock several times. So A6 and A2 pin `seededRandom(1)`, whose first draw (0.694 ≥ 0.4) takes the engine path. A row asserts that precondition rather than assuming it. Changing this would mean editing `src/levels.ts`, which is fenced off.
- **NFR-008:** `src/uci-session.test.ts` goes from 71 to 101 rows, with 0 spawns, on an existing file. The N8-LANE delta is owed at the gate. Row durations that vitest printed are incidental and are not a reading.
