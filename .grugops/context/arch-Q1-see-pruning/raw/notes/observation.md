# arch-Q1-see-pruning results: Q1 (SEE pruning of losing captures) on `main` `dc7dc15d` (`src/` tree `4cb84035`). All three pre-registered forms pass both gates. QS reads d8 0.7208 / 0.2652 in `search()` and 0.5909 / 0.2160 in `chooseMove`, and reach +0.837 ply at 47 000 nodes; it is safe on every bar. The door reproduces E1's counts exactly

Architect/Design, task `arch-Q1-see-pruning`. Scratch copy of `main`'s `src/` outside the repository, patched by `raw/probe/patch_q1.py`, driven by `raw/probe/probe.ts`. Three batches ran, each under `flock <host-test.lock> timeout 1800`, with every job under `timeout 600`, one job at a time. 42 jobs, every exit 0. Batch walls: 2 min 14 s, 2 min 10 s, 2 min 29 s. Deterministic counts only; no timing is read. The PREREG `…1f71e417` was committed at `a9af0ec8` before batch 1. Outputs are in `raw/probe/out/`.

## Instrument checks (met)
- **SEE:** 24 / 24 `HANGING_CORPUS` losing moves are `see < 0` and LOSING. The six hand rows are exact: +100, −220, −800, 0, 0, −10.
- **Door:** `search()` d8 839 514 / 1 533 901, `chooseMove` d8 1 296 788 / 404 930 (kiwipete / position-6), reach 5.879 at 47 000. These equal `ABC-269` B0 and `ADR-0064` form L **exactly**. Door zugzwang 7 / 7, door `G1` 54 / 58.
- **Wording correction:** the PREREG's "the 190 (+ 6 endgames)" is 190 rows **in all**. The corpus function includes the six endgames, as in `arch-ABC-234` and `ADR-0064`. Same instrument; the door's 5.879 confirms it.

## Premise counters (door, `fire` d6, `search()`, 190 rows)
- Quiescence moves that are LOSING (`see < 0`): 3 752 813 of 12 068 862 (31.1 %), with 97.27 % refuted. The quiescence nodes under them read 81.4 %, but nested subtrees are counted at each level, so that share is overstated.
- Total nodes: door 14 372 440. QS 6 437 380 (0.448×), with 2 077 972 captures skipped. QSM 6 102 192 (0.425×), with 1 986 104 skipped in quiescence and 93 891 in the main search.

## Pay gate (≤ 0.95× on all four d8 readings; reach ≥ +0.10)

| form | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | reach 47 000 | pass |
|---|---|---|---|---|
| QS | 0.7208 / 0.2652 | 0.5909 / 0.2160 | 5.879 → 6.716 (+0.837; 121 deeper, 1 shallower; 22 moves differ) | yes |
| QSc | 0.8496 / 0.3909 | 0.6953 / 0.3541 | 6.374 (+0.495; 86, 1; 17) | yes |
| QSM | 0.6748 / 0.2421 | 0.5496 / 0.2040 | 6.758 (+0.879; 127, 1; 22) | yes |

Raw head counts (search kiwi, pos-6; choose kiwi, pos-6): QS 605 117, 406 787, 766 275, 87 475. QSc 713 253, 599 580, 901 707, 143 367. QSM 566 494, 371 343, 712 706, 82 624. Kiwipete's d8 root move is e2a6 (−81) → d5e6 (−89) in every form and in both recursions. Position-6's is c3d5 throughout.

## Safety gate (drift ≥ 90 % within 25 cp and max ≤ 150 cp, 0 sign changes; mate 0; zugzwang 7 / 7; `G1` ≥ 54 / 58 with no NEWLY-MISSED)

| form | drift `search()` | drift `chooseMove` | mate d5 → d5 | zugzwang | `G1` | pass |
|---|---|---|---|---|---|---|
| QS | 96.26 %, max 66 (kiwipete/a1d1 298 → 232), 0 sign, 9 moves differ | 95.72 %, max 96 (kiwipete/f3f4 555 → 459), 0 sign, 7 differ | 0 of 190 | 7 / 7 | 54 / 58, none newly missed or solved | yes |
| QSc | 96.26 %, 66 | 95.72 %, 96 | 0 of 190 | 7 / 7 | 54 / 58 | yes |
| QSM | 96.26 %, 66 | 95.72 %, 96 | 0 of 190 | 7 / 7 | 54 / 58 | yes |

Zugzwang nodes, QS: zugzwang.001 72 969 (door 84 325); zugzwang.004 705 301 (697 684); zugzwang.005 914 568 (1 044 425). The KPK rows are equal to the door.

## Choice rule
Best reach QSM +0.879. QS +0.837 is within 0.05, so **QS**. QSc is not within 0.05.

## Reports (not bars)
- **d7, QS:** `search()` 0.7230 / 0.2943, `chooseMove` 0.5141 / 0.1828. QSM: 0.6784 / 0.2687, 0.4834 / 0.1715.
- **d8, other roots, QS (`search()` / `chooseMove`):** position-4 0.590 / 0.552; position-5 0.447 / 0.678; startpos 0.769 / 0.827. Startpos's `search()` move changes from d2d4 to b1c3, the move `chooseMove` already plays.
- **Reach at 20 000:** door 4.842. QS 5.689 (+0.847), QSc 5.400 (+0.558), QSM 5.721 (+0.879).
- **Mate d4 → d5:** 0 of 163 for every form.
- **Quiescence audit** (every 50th skipping node, d6). A flip is a different class (≤ alpha / inside / ≥ beta) or a different exact value inside the window; its error is |clamp(h) − clamp(v)|.
  - QS: 930 of 19 402 (4.79 %); errors ≥ 100: 9, ≥ 200: 0; max 185 cp.
  - QSc: 770 of 22 624 (3.40 %); ≥ 100: 5, ≥ 200: 1 (213).
  - QSM: 899 of 18 387 (4.89 %); ≥ 100: 7, ≥ 200: 0.
- **Main-rule audit** (QSM, every 10th firing null-window node, d6, `ADR-0061`'s shape): 90 of 5 244 (1.72 %); ≥ 100: 8, ≥ 200: 1, ≥ 300: 1 (325 cp at depth 1). That is above `ADR-0061`'s bars (≤ 0.5 %, 0 ≥ 200).

## Not done
- No game was played. C2′, S′, `G6` and the Levels lane are the build's reads.
- No timing was read. SEE's per-node cost is `UNKNOWN - verify`; `G6` (F9) reads it.
- No diagnostic was run after the gates.
