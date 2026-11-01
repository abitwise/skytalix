# ABC-254 A4 under ADR-0055 D3-V2: MET. All four boards valid on the main schedule with no re-run owed. kiwipete 1.112, position-6 1.120, start 1.106 (the bar: ≥ 1.10 on two, ≥ 1.00 on the third; all three clear 1.10); position-4 guard 1.095 (≥ 0.97). Agreement guard holds on every board

QE/E2E, task `qe-ABC-254-a4v2`. Graded by `grade.mjs` under the PREREG `…a1136cf6`, sealed and committed (`acc092ca`) before any timed run. Raw: `raw/a4/a4.jsonl` (sha256 `2d404bd8011b4289`), `analysis-main.jsonl` (`f333f6907dad93ed`) and `grade.json` (`8be96d1f27b9a176`). Script hashes after the run match the PREREG.

## Scope
Only ABC-254 A4: base `09d1f675` against head `600d8de3`, at 4 000 ms per run, one fresh process per run. A1–A3 and A5 are carried from qe-ABC-254 (`…1c801504`). No run of qe-ABC-254 or qe-ABC-254-a4 is pooled or re-graded (D3-V2 item 5).

## The graded reading (main schedule; counted pairs = the first 5 admitted)

| board | attempts | counted | head ÷ base (graded) | paired-ratio median | agree | spread B / H | B median nps | H median nps | status |
|---|---:|---:|---:|---:|---|---|---:|---:|---|
| kiwipete | 5 | 5 | **1.1118** | 1.1118 | yes | 2.67 % / 2.72 % | 787 899 | 875 963 | valid |
| position-6 | 5 | 5 | **1.1198** | 1.1246 | yes | 2.42 % / 2.80 % | 782 279 | 875 975 | valid |
| start | 5 | 5 | **1.1059** | 1.1059 | yes | 1.18 % / 3.82 % | 605 806 | 669 957 | valid |
| position-4 (guard) | 6 | 5 | **1.0947** | 1.0972 | yes | 2.35 % / 2.22 % | 916 363 | 1 003 147 | valid |

- **Counted-pair orders:** BH HB BH HB BH on every board (3 : 2, as D3-V2 item 2 requires).
- **The bar:** sorted, the three ratios are 1.1198, 1.1118 and 1.1059. The top two are ≥ 1.10 and the third is ≥ 1.00, so the bar holds. The third also clears 1.10.
- **The guard:** 1.0947 ≥ 0.97.
- **Agreement guard (item 4):** on every board, the paired median and the graded ratio sit on the same side of each bar (1.10 and 1.00; 0.97 for position-4).
- **Spread (v2):** every board and build is ≤ 5 % (largest 3.82 %), so no re-run was owed and `run.sh` launched none.
- **(v1) values:** no STOP. At equal depth, base and head chose the same move and score on every attempt: position-6 `34-67` 73 at d10; start `1-34` 9 at d11; position-4 `50-66` −482 at d11. On kiwipete, base completed d8 and head d9 in every run, so the moves are not compared there (both chose `20-80`; scores −59 / −72).
- **(v3) thermal:** the median after-run Tctl of the counted runs is 75.4–77.2 °C per board, with a maximum of 78.6 °C. No thermal STOP.
- **All counted positions stayed pure** (FEN unchanged after the search).

## Paired ratios of the counted pairs (INFO; the guard reads their median)
- kiwipete: 1.119, 1.112, 1.095, 1.134, 1.100
- position-6: 1.095, 1.089, 1.127, 1.125, 1.136
- start: 1.112, 1.120, 1.106, 1.083, 1.100
- position-4: 1.098, 1.081, 1.084, 1.097, 1.105

No counted pair fell below 1.00, and none on position-4 fell below 0.97.

## INFO, not graded (G5 and G6 stay MET from qe-ABC-254)
- **G6, completed depth B → H:** kiwipete 8 → 9 in every run; position-6 10 = 10; start 11 = 11; position-4 11 = 11.
- **G5, max wall:** 4 001.2 ms over all 42 runs.

## Risks
- **start sits close to its bar.** start's 1.1059 is 0.006 above 1.10. Under the bar it is only the "third board" (≥ 1.00), since kiwipete and position-6 already carry the two 1.10 boards. Even so, the bar needs at least two of the three ratios at ≥ 1.10, and kiwipete is 0.012 above. The SHARED near-bar rule does not apply, because the read was not SHARED.
- One schedule on one host on one day. These ratios agree with both earlier reads' valid boards (kiwipete 1.120, start 1.105 in qe-ABC-254-a4) and with their INFO paired ratios. That is noted as agreement only; nothing was pooled.
