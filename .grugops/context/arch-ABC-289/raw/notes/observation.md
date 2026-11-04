# arch-ABC-289 readings: the premise on `main` with Q1 in it, the instrument check, the pay and safety gates for six forms, and the reports for D200b. 62 jobs, every exit 0, 7 min 14 s under the host lock. No game, no timing

Architect/Design, task `arch-ABC-289`, under PREREG `…174760a3` (commit `9e07dae4`). Base `git archive 0cc9afd1 src package.json`, patched by `raw/probe/patch_q2.py`, on a scratch copy outside the repository. Every output is in `raw/probe/out/`.

## Runs
- Batch 1 20:30:06Z–20:34:23Z, batch 2 20:36:15Z–20:38:09Z, batch 3 20:42:19Z–20:43:22Z (`b?.start`, `b?.end`). `exits.txt`: 62 lines, all exit 0.
- **`main` moved during the hop** (`ABC-302`, records). `git diff --name-only 0cc9afd1 main -- src tools package.json`, less `*.test.ts`, is empty at `main` `22931005`, so the measured production code is `main`'s.

## Instrument (`D200-doors.out`, `DOOR-zug.out`, `DOOR-g1.out`): exact, every count
- Knob off = `main`: `search()` d8 523 847 / 234 214; `chooseMove` d8 707 548 / 101 425.
- All-off door, knob off: 605 117 / 406 787; 766 275 / 87 475.
- `ABC-279`'s door pair, knob off and knob on alike: 839 514 / 1 533 901; 1 296 788 / 404 930.
- Door zugzwang 7 / 7; door `G1` 54 / 58, none newly missed. Reach on `main` at 47 000: 6.868.

## The premise (`D{300,200,100}-premise-D6.out`), door tree, `search()` d6 over the 190
Nodes 5 469 355, quiescence nodes 4 735 926 (**86.59 %**). Captures reached out of check 4 563 246; `seePruning` skips 1 834 596; searched 2 728 650.

| margin | overlap with SEE | delta-only | % of searched | refuted | raised | gave check | mates | largest non-mate raise | gives check, of delta-only | mate-band alpha | q-nodes under (overstated) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 300 | 640 158 | 926 160 | 33.94 % | 99.67 % | 3 074 | 3 074 | 355 | 1 027 | 5.62 % | 913 | 27.70 % |
| 200 | 843 051 | 1 193 138 | 43.73 % | 99.52 % | 5 764 | 5 721 | 485 | 1 128 | 5.74 % | 913 | 36.38 % |
| 100 | 1 028 861 | 1 466 651 | 53.75 % | 99.12 % | 12 950 | 9 497 | 582 | 1 142 | 5.82 % | 913 | 46.59 % |

## Gates (`*-nodes.out`, `*-reach-N47000.out`, `*-drift-*.out`, `*-mate-*-D5-PLUS0.out`, `*-zug.out`, `*-g1.out`)
Gate lines: P1 ≤ 0.95× on four; P2 ≥ +0.10; drift ≥ 90 %, ≤ 150 cp, 0 sign changes; mate 0; zugzwang 7 / 7; `G1` ≥ 54 / 58, none new.

| form | d8 `search()` | d8 `chooseMove` | reach (deeper, shallower; moves) | drift `search()` | drift `chooseMove` | mate s / c | zug | `G1` | pay | safety |
|---|---|---|---|---|---|---|---|---|---|---|
| D300 | 0.6954 / 0.9375 | 0.7032 / 0.8505 | 7.079, +0.211 (40, 1; 6) | 98.40 %, 192 | 100 %, 0 | 0 / 0 | 7 | 53, 1 new | pass | **FAIL** drift, `G1` |
| D200 | 0.6354 / 0.8863 | 0.6443 / 0.8267 | 7.142, +0.274 (50, 0; 6) | 96.79 %, 192 | 98.93 %, 132 | 0 / 0 | 7 | 54 | pass | **FAIL** drift |
| D100 | 0.4516 / 0.8116 | 0.5264 / 0.7730 | 7.237, +0.369 (65, 2; 13) | 87.70 %, 226 | 95.19 %, 94 | 0 / 0 | 7 | 54 | pass | **FAIL** drift |
| D200c | 0.7446 / 0.9373 | 0.7404 / 0.8401 | 7.053, +0.185 (36, 1; 4) | 97.86 %, 192 | 99.47 %, 58 | 0 / 0 | 7 | 54 | pass | **FAIL** drift |
| D200e | 0.6354 / 0.8863 | 0.6443 / 0.8267 | 7.137, +0.269 (49, 0; 6) | 97.33 %, 192 | 98.93 %, 132 | 0 / 0 | 7 | 54 | pass | **FAIL** drift |
| **D200b** | 0.6362 / 0.8263 | 0.6484 / 0.8201 | 7.147, +0.279 (54, 2; 8) | 100 %, 12 | 100 %, 20 | 0 / 0 | 7 | 54 | pass | **pass** |

- Mates read 191 (`search()`) and 189 (`chooseMove`) on the door. The largest drift row, in four forms, is position-6/f3d4 565 → 373.
- D300's newly missed line: "mate in 3, seed 1632: white Q+R+N against N+2P".
- D200e's d8 counts equal D200's exactly: no d8 tree on these two roots reaches phase ≤ 6.

## Reports, D200b only (the PREREG's rule)
- `fire100`, 47 000 nodes on the 190: 3 785 544 skips of 7 845 226 captures reached (**48.25 %**), on 185 / 190 rows; 1 661 210 of them SEE-losing, so 2 124 334 delta-only (**27.08 %** of reached). By quiescence ply 0–7: 2 495 543 / 503 690 / 366 592 / 142 925 / 106 264 / 73 583 / 58 423 / 38 524, so 65.9 % at ply 0.
- `fire`, d6 over the 190: nodes 0.7288×, quiescence nodes 0.6840×.
- **The SEE ratio is not clean.** The output reads 0.9448×, but the head's counter calls `isLosingCapture` on skipped moves. Taking out the 759 440 such calls that certainly reach `see` gives ≤ 0.748×. The exact figure is `UNKNOWN - verify`.
- d7: `search()` 0.6778 / 0.8602, `chooseMove` 0.6831 / 0.8345.
- d8, `search()` / `chooseMove`: position-4 0.5386 / 0.5067, position-5 0.7350 / 0.7784, startpos 0.9238 / 1.0147.
- Reach at 20 000: 5.784 → 6.100 (+0.316; 58, 1; 10).
- Mate d4 → d5 `search()`: 0 of 163. `chooseMove` d6 → d6: 0 of 209.
- `qaudit`: 459 147 fired, 9 090 sampled, 9 071 read, 19 mate rows set aside; 81 flips (0.893 %); errors ≥ 100 cp: 0; largest 99.
