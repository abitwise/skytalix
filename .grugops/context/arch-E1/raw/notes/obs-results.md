# arch-E1 results: both forms pass every play check. By the pre-registered rule the linear phase (L) is chosen, because its `G6`-shape statistic is 1.034 against the plateau's 1.129. E1 is identical to `main` at phase 24, and it adds about 30 operations per evaluate call. The evaluation instrument reads L level with `main` and P better: that is information only

Architect/Design, task `arch-E1`, by the PREREG `…01c2d6a5` (sealed and committed `b11b802f` before any run).
- **Base:** a scratch `git archive` of `main`'s `src/` `58fa3eb4`.
- **Batches:** A–C pre-registered; D and E added after them as reports. Each ran under `flock <host-test.lock> timeout 300`.
  - Walls: 9 s, 18 s, 11 s, 30 s, and 1 s + 19 s (E's first attempt was refused by the heap guard; no test ran).
  - Every pre-registered exit was 0.
- **Readings:** node counts only, no timing.
- **Raw:** `raw/probe/out/`.
- **Scratch:** deleted, and nothing is left running.

## Instrument check: exact
- BASE reproduces `main`'s door to the node: `search()` d8 888 786 / 1 262 046; `chooseMove` d8 1 306 981 / 391 451.
- BASE's 145 moves at 47 000 nodes equal `arch-next-pull`'s (move, score and nodes).
- Stockfish's best move and score are identical on all 145.
- One counter-only fix after batch A: the mobility counter's `sub` was missing. No value is touched by it.

## The G6 shape (`chooseMove` nodes to complete depth, ratio to BASE)
- **L:**
  - kiwipete: d7 1.0357, d8 0.9922, d9 0.9617;
  - position-6: d7 0.9949, d8 1.0344, d9 1.0120, d10 1.0050;
  - **S = 1.0344**.
- **P:**
  - kiwipete: d7 1.1854, d8 1.1286, d9 1.1132 (root move d5e6 at d7–d8);
  - position-6: d7 0.9969, d8 1.0369, d9 1.0127, d10 1.0032;
  - **S = 1.1286**.
- **L's build counts (`ADR-0064` B0):**
  - kiwipete: d8 1 296 788, d9 2 733 330;
  - position-6: d8 404 930, d9 926 005, d10 1 692 669;
  - `search()` d8: 839 514 / 1 533 901.

## Work proxy (BASE, `chooseMove` d8, kiwipete / position-6)
- 0.900 / 0.873 evaluate calls per node;
- 25.46 / 26.88 pieces per call (13.22 / 14.70 pawns);
- 64.4 / 60.4 mobility squares per call.
- **E1's addition:** about 30 simple operations per call; no new loop, no new board read.
- **Estimate:** 1–2 % of node time, against O1-e's 4.2–5.3 % for the whole material + PST walk (`UNKNOWN - verify`; the build's `G2` reads it).

## Play checks (L | P)
| check | L | P |
|---|---|---|
| mirror | 0 / 184 | 0 / 184 |
| mate floor, BASE d4 → d5 | 0 / 163 | 0 / 163 |
| mate floor, same depth d5 | 0 / 189 | 0 / 189 |
| zugzwang | 7 / 7 | 7 / 7 |
| `G1` | 54 / 58, none newly missed | 55 / 58, +1 newly solved |

**Both forms are eligible, and the rule chooses L.**

## Static shapes (L = P)
- King-and-pawn endings, centre minus corner: +95, +67, +75, +44, +75, +44 (BASE −35 to −86).
- Seven full-material positions: form − BASE = 0 on all seven.
- The passer rows were whole-evaluation readings, and the king term confounds them. They decide nothing.

## Reports (decide nothing)
- **Reach at 47 000 on the 190:** 5.837 → L 5.879 / P 5.868.
- **Drift at d5, `chooseMove`:** L 98.40 % within 25 cp, max 61 (kiwipete/f3f4 494 → 555), 0 sign changes, 0 mate flips. P 97.86 %, max 60.
- **D, `ADR-0061` d8 re-read on each scale.** BASE reproduces 100 % / max 10, 0 / 189. L and P: futility drift 100 %, max 0, in both recursions; mate floor 0 / 190 and 0 / 189.
- **E, the default lane with every path tapered.**
  - Off 2 429 / 2 429; on 2 389 / 2 429: **40 reds in 7 files**.
  - The reds: quiescence 18, engine 8, transposition 5, futility 3, ordering 3, pvs-lmr 2, null-move 1. `src/evaluate*.test.ts` stays green.
  - All of them are pinned values or fixture properties.
  - It is an upper bound, because the design's ladder keeps the older doors untapered. The deep lanes were not run.

## Evaluation instrument (information only)
| at 47 000 nodes | mean loss | errors ≥ 50 / 150 / 300 | Stockfish's best | errors after 60 plies |
|---|---|---|---|---|
| BASE | 54.1 | 48 / 15 / 7 | 46.2 % | 13 |
| L | 55.7 | 49 / 16 / 7 | 46.2 % | 16 |
| P | 51.8 | 39 / 16 / 9 | 52.4 % | 11 |

- L against BASE: 17 better, 12 worse. P against BASE: 28 better, 11 worse.
- By the PREREG, this decides neither a form nor a bar.
