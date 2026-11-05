# se-ABC-303-rows observation: the gates, the lanes and the list's `UNKNOWN - verify` items as read

Tree: `046cac35`, the commit the edits landed in. Each run held the host lock, one at a time. Outputs are in `raw/out/`, each checked non-empty before it was read, except typecheck's, which prints nothing on success and exited 0. `lint` and `typecheck` were re-run on the final record tree.

**Gates**

| run | exit | read |
|---|---|---|
| typecheck | 0 | |
| lint | 0 | 148 files, no fixes |
| `npm test` | 0 | 2 733 / 2 733, 71 files, skip count 0 |
| `ENGINE_DEEP` engine | 0 | 105 / 105, 269 s |
| `SEARCH_DEEP` engine | 0 | 79 / 79 |
| `ENGINE_DEEP` uci-session | 0 | 265 / 265, 342 s |

`se-ABC-303-main`'s reds are all green: engine 93 / 105 to 105 / 105, 77 / 79 to 79 / 79, uci-session 258 / 265 to 265 / 265, `npm test` 2 730 to 2 733. Row counts did not change: no row was added or removed.

**`…0f8a4f82` § 7, as read (`raw/out/rows-read.jsonl`)**

- **E1 at budget 5:** head depth 3, 1 262 nodes = N(3). Base depth 3, 2 121 nodes. N(4) reads 2 197, so the base aborted 76 short of it. As forecast.
- **The door on `virtualClock(1)`, A0-2's four rows:** kiwipete 50: e2a6, −59, depth 5, 47 384. Kiwipete 200: e2a6, −59, depth 6, 199 960. Position-6 50: c3d5, 79, depth 7, 44 105. Position-6 200: c3d5, 71, depth 8, 196 681. All the base's figures. The shipped side reads the same but for score: −75, −101, 43, 45.
- **`softMs: 1` on the tip, A0-1's six rows:** equal to `softMs` absent on all six, move, score, depth and nodes: 104 780, 244 677, 573 518, 10 513, 39 268, 94 911.
- **D5's full output:** three lines. `info string partial depth 3`; `info depth 2 score cp 475 nodes 3125 time 6 nps 520833 pv a1f6`; `bestmove a1f6`.

**Also read:** A10 walls 59 500.4 / 59 499.9 / 59 501.0 ms, depth 15 / 14 / 13; heap and arrayBuffers within their rows; the clocked fourth search 47 746.9 ms, depth 13. Ungraded: another project's vitest was on the host at the start of this hop.

**Not read, as `…0f8a4f82` § 7 left it:** whether E2's row tells "latest such move" from "first such move", which is for QE's mutant read. `G6` and the rest of `…bd60978c` § Not read stand. No game was played and no graded timing taken.
