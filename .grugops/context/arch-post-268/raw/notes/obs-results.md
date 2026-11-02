# arch-post-268 results: ADR-0060 decision 1, unchanged, on `main` `e72487e1` (futility in force) misses A4 (a) (0.8528), A3's 27 cp cap (63) and zugzwang.004 (6 / 7); reach +0.384, mate floor 0 / 163, G1 54 / 58 met; audit 5.37 % flips, max 48 cp

Architect/Design, task `arch-post-268`, by the PREREG `…3a0aac14` (sealed and committed `d65e4bfb` before any run). Scratch `git archive e72487e1 src`; four batches under `flock <host-test.lock> timeout 300`, every job exit 0; node counts only. Raw: `raw/probe/out/`.

## Instrument check: exact
Door (= `main`): `search()` d8 888 786 / 1 262 046, `chooseMove` d8 1 306 981 / 391 451 (kiwipete / position-6), reach 5.837 at 47 000: `ADR-0061` d9's counts to the node. Door zugzwang counts 905 900 (`.004`) and 1 310 019 (`.005`) equal `ADR-0061`'s; door G1 54 / 58.

## Every bar (ADR-0060 d8 / d9, unchanged)
| bar | read | state |
|---|---|---|
| A4 (a) `search()` kiwi / pos-6 <= 0.85 | 0.7538 (669 982) / 0.7718 (974 021) | met |
| A4 (a) `chooseMove` kiwi / pos-6 <= 0.85 | 0.7195 (940 419) / **0.8528** (333 830 / 391 451) | **MISSED** (pos-6) |
| A4 (b) reach 47 000 >= +0.25 | 5.837 -> 6.221, **+0.384**; 67 deeper, 1 shallower, 16 moves differ | met |
| A4 (c) G6 | not read (timing) | — |
| A3 drift d5 `search()` | 99.47 % within 25, **max 63** (position-6/g5h6 319 -> 382), 0 sign, 0 mate-status flips, 5 moves differ | **MISSED** (27 cp cap) |
| A3 drift d5 `chooseMove` | 100 %, max 18 (startpos/g2g4 54 -> 36), 0 / 0, 3 moves differ | met |
| mate floor d4 -> d5 | 0 of 163 (same-depth report: 2 of 189) | met |
| zugzwang 7 rows | **6 / 7**: `zugzwang.004` d11 plays g7f6 (151 797 nodes), want h3h4; the other six play their moves (`.001` 47 552, `.005` 521 851) | **MISSED** (F3) |
| G1 | 54 / 58, no newly missed, none newly solved | met |

## Reports
- d8 other roots, `search()` / `chooseMove`: position-4 0.833 / 0.719; position-5 0.601 / 0.918; startpos 0.641 / 0.733.
- Reach at 20 000: 4.842 -> 5.095 (+0.253; 47 deeper, 2 shallower, 10 moves differ).
- Firing d6 on the 190 (`search()`): 226 104 of 1 438 291 non-first moves reduced (15.7 %), 99 247 by two plies (43.9 %); nodes 12 276 686 / 14 311 902 = 0.858x.
- Diagnostic (not pre-registered, added after the miss): `zugzwang.004` head g7f6 at d10 (94 038) and d11, h3h4 at d12 (948 570) and d13; door g7f6 at d10, h3h4 from d11 (905 900).

## ADR-0061's cut audit, information only
`search()` d6 over the 190 + 6 endgames; 2 930 marked null-window nodes (decision 1 reduces a searched move deeper than the flat rule; no "less" case exists at a null window); every 10th: 210 sampled, 205 read (5 with |alpha| > 15 000 skipped). **11 flips (5.37 %)**: d4 8 of 192 (all false fail-low), d5 3 of 13 (all false fail-high). Errors: max 48 cp; 0 >= 100 cp, 0 >= 200, 0 >= 300. Door noise (door null window vs its own full window) 5. ADR-0061's bars for scale: <= 0.5 % flips, 0 >= 200 cp.

## Against the pre-futility `main` (`arch-phase2-rebase`)
A4 (a) pos-6 `chooseMove` 0.8699 -> 0.8528; reach +0.2526 -> +0.384; the 63 cp line unchanged; zugzwang 7 / 7 -> 6 / 7.
