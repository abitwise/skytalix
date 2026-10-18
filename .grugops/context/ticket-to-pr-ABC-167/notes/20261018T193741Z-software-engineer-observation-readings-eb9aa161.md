---
id: 20261018T193741Z-software-engineer-observation-readings-eb9aa161
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-167
at: 2026-10-18T19:37:41Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-167
  - ABC-167
  - ADR-0044
  - EPIC-007
  - NFR-008
supersedes:
---

# ABC-167 readings on the virtual clock (`virtualClock(step)`), tip `3dd0db1b`

Hand-authored, unsealed. **No wall-clock timing was read.** Every figure below is on the virtual clock.

- `A3`: after `e2e4 e7e5`, `go movetime 100` (step 10) gives `info depth 4 score cp 3 nodes 6173 time 110 … pv b1c3`, then `bestmove b1c3`.
- `A5`: the `time` field, against the bound G ≤ time ≤ G + 2·step:

  | go | step | time | G |
  |---|---|---|---|
  | `movetime 100` | 1 | 101 | 100 |
  | white, `wtime 1000 btime 9000` | 1 | 51 | 50 |
  | black, the same line | 10 | 460 | 450 |
  | `wtime 40 btime 40` | 1 | 2 | 1 |
  | `+inc 1000`, 60 s | 100 | 3100 | 3000 |
  | bare `go` | 100 | 3100 | 3000 |

- `A7`:
  - a free `go` (step 50) reaches d6, and `go depth 3` gives d3;
  - `go nodes 20000` gives 20 501 nodes (≤ 21 024);
  - `go nodes 1` gives d1 with 21 nodes;
  - `go mate 2` on the smothered mate gives `depth 3 score mate 2 … pv d5g8`, then `bestmove d5g8`. **Depth 3 finds it, so there is no D12 finding**;
  - `go depth 3 mate 5` gives d3, and `go mate 1 depth 5` gives d1.
- `A8`: on `7k/8/6K1/8/8/8/8/R7 b - - 1 1` the only legal move is `h8g8`, checked in the test. `go movetime 500` gives `score mate -1`. The FEN did not need replacing (test note 3).
- `A4`: the bad FEN gives `info string position refused: bad fen: placement must have 8 ranks …`. `e2e5` gives `… illegal move e2e5`. Each is followed by `bestmove 0000`.
- `NFR-008`: the lane gains 1 file with 44 rows and 0 spawns. The `N8-LANE` delta is owed at the gate. Row durations that vitest printed are incidental and are not a reading.
