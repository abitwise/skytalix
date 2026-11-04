# arch-ABC-283-mate measurement, under PREREG `…07f1eb6d` (commit `6ad10900`): the miss is LMR on a malus-demoted mating move. Of the pre-registered candidates only K3 meets every bar.

A scratch copy of `grugops/ABC-283` `src/` (tree `8171d713`), patched by `raw/scripts/patch_probe.py`. Every run was under `flock <scratch>/host-test.lock`, with fixed depth or a frozen clock. Measured runs took about 8 minutes in all. No games were played, the copy is outside the repository, and nothing was committed to `src/`.

## Instrument check: exact

- With no probe flag, the copy equals the branch node for node: `search()` and `chooseMove` d6 on the three rows and kiwipete (`doors.jsonl`).
- It also reproduces se-ABC-283's floors: 1 / 190, 2 / 188, d6 4 / 209 (`floor.jsonl`, `base`).

## The mechanism (step 1)

**Door by door, history kept on (`doors.jsonl`).**
- LMR off restores the mate on all three rows. So does PVS off, which also turns off LMR.
- Futility off, aspiration off and SEE ordering off do not.
- The table off still misses (`search()` row: a7b7 at 652).
- **The door is LMR.**

**Node trace (`trace-search-row.txt`, `trace-choose-row{1,2}.txt`).** The door's line on the `search()` row is a7b7 g8h8 f6g6 h8g8 b7b8#.
- At node `a7b7 g8h8`, ply 2: White, depth 3, null window (652, 653).
  - The door searches `f6g6` at index 2. It is unreduced and returns 29995.
  - The head holds −9 in every White king-move cell, one depth-3 malus, while the rook moves read 0. So `f6g6` sorts to **index 16 (pre-history index 2)**.
  - LMR reduces it by one ply. The child, now depth 1, is settled by a table entry of −611. So 611 ≤ α, no re-search runs, and the mate is gone.
- The `chooseMove` rows show the same thing at the same node (ply 2, depth 3).
  - The waiting rook move `h1h2` / `a1a2` has pre-history index 1. History puts it at index 10 / 9.
  - It is reduced (R1) and scores 592 at null window (652, 653), with no re-search.
- **H-L holds**: history moves a quiet mating move to index ≥ 3 at a depth-3 node, and LMR's reduced null-window search does not fail high.
- **H-M holds**: under K2 (no update from a mate-band cutoff), `f6g6`'s cell is 0. So the −9 that demoted it came from cutoffs scored in the mate band (`trace-search-row-K2.txt`).
- **H-F does not**: K1F and futility off change nothing.

**H-pre is a pre-existing property, and history unmasks it (`floor.jsonl`, `hpre`).**
- The history-off door with only its quiet tier reversed loses **6 / 190** mates in `search()` d5 (one is KQK) and **4 / 188** in `chooseMove` d5.
- With LMR off, the same reversal loses **0 / 190**.
- So on this tree the same-depth floor depends on the order of the quiet moves through LMR. History is one such reorder. The door's generation order happens to put these KRK mating moves at index < 3.

## Candidates (`floor.jsonl`, `rest-K2.jsonl`, `rest-K3.jsonl`)

| | B1 `search()` d5 | B2 `chooseMove` d5 | B3 older rows (futility / see / taper d5 / taper d4→5) | R1 d6 | B4 P0 | B5 zugzwang | B6 G1 |
|---|---|---|---|---|---|---|---|
| base (as built) | 1 / 190 | 2 / 188 | 1 / 1 / 1 / 0 | 4 / 209 | 6 / 6 | 7 / 7 | 54, none new |
| K2 | 0 | 0 | 0 / 0 / 0 / 0 | 1 / 209 | 6 / 6 | **6 / 7** (`zugzwang.001` plays e1e6 at d9) | 54, none new |
| K1L | **1** (`8/6k1/8/6K1/8/8/8/6Q1 w`, 29995 → 1042) | 0 | 0 / 1 / 0 / 0 | 0 / 209 | — | — | — |
| K1F | 1 | 2 | 1 / 1 / 1 / 0 | 4 / 209 | — | — | — |
| K1 | **1** (the same KQK) | 0 | 0 / 1 / 0 / 0 | 0 / 209 | — | — | — |
| **K3** | **0 / 190** | **0 / 188** | **0 / 0 / 0 / 0** | **2 / 209** | **6 / 6 exact** | **7 / 7** | **54 / 58, none new** |

- **Both K2 and K3 act on the named node.** `f6g6` returns to index 2, and `h1h2` / `a1a2` to index 1–2, unreduced, at 29995 (`trace-*-K2.txt`, `trace-*-K3.txt`).
- **K2 fails B5**, so it is not a fix.
- **K1L and K1 fail B1** on a KQK row. Changing which moves are reduced, while history still changes α and the table, loses a different mate.

## Reports for K3 (they cannot change the verdict)

- **R1:** `chooseMove` d6 is 2 / 209 (was 4): `7k/8/R4K2/8/8/8/8/8 b` and `7k/8/5K2/8/8/8/8/5R2 b`, −29994 → −652.
- **R2, ADR-0063 d8 drift at d5 on the 190**, against the history-off doors. The bar is ≥ 95 % within 25 cp, max ≤ 42 cp, 0 mate changes.

  | | within 25 cp | max | mate changes |
  |---|---|---|---|
  | K3 `search()` | 99.47 % | **28** | 0 |
  | K3 `chooseMove` | 99.47 % | **27** | 0 |
  | the bundle as built, `search()` | 98.93 % | **44** | 0 |
  | the bundle as built, `chooseMove` | 98.93 % | 28 | 0 |

  As built, the `search()` maximum of **44 cp** is above ADR-0063 d8's 42 cp (F1). se-ABC-283 did not read it. K3 also clears it.
- **R3, d8 nodes against main** (K3 / main):
  - `search()`: kiwipete 523 847 / 605 117 = **0.8657**, position-6 234 214 / 406 787 = **0.5758**;
  - `chooseMove`: kiwipete 707 548 / 766 275 = **0.9234**, position-6 101 425 / 87 475 = **1.1595**;
  - the root move and score are the door's on all four.
  - As built: 0.8503 / 0.5464 / 0.9184 / 1.1100.
  - K2's counts equal the build's exactly.
- **The bundle file's lifetime row (`lifetime.jsonl`):** non-zero cells after `search()` / `chooseMove` d5 on its rook ending. As built: 87 / 30. K2: 87 / 16. K3: 77 / 28. The row's "> 0" still holds.
