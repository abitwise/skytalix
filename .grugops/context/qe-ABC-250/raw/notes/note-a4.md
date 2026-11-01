# ABC-250 A4 under ADR-0055 D3-V2: UNRESOLVED (VOID, not VOID-LOAD). kiwipete VOID (re-run: base spread 12.9 %, guard split at 1.10: 1.094 vs paired 1.107); start VOID (re-run: guard split at 1.25: 1.237 vs paired 1.255); position-6 valid at 1.111. GO not read; HOLD / NO-GO not read

QE/E2E, task `qe-ABC-250`, graded by `grade.mjs perft` under the sealed PREREG `…7ff2b573`. Nothing here is graded by hand.

## The graded reading (graded boards; perft-bench depth 4; steady state over REPS calls in one fresh process)

| board | schedule | attempts | counted | B median nps | H median nps | H ÷ B | paired median | agree (1.25 / 1.10) | spread B / H | status |
|---|---|---:|---:|---:|---:|---:|---:|---|---|---|
| kiwipete (×12) | main | 5 | 5 | 22.490 M | 25.734 M | 1.144 | 1.146 | yes | **6.3 %** / 4.7 % | re-run owed |
| kiwipete (×12) | re-run | 5 | 5 | 23.098 M | 25.261 M | **1.094** | 1.107 | **no (1.10)** | **12.9 %** / 1.6 % | **VOID** |
| position-6 (×12) | main | 9 | 5 | 31.313 M | 34.802 M | **1.111** | 1.128 | yes | 2.1 % / 3.5 % | valid |
| start (×150) | main | 5 | 5 | 22.877 M | 28.944 M | 1.265 | 1.261 | yes | **8.1 %** / **8.1 %** | re-run owed |
| start (×150) | re-run | 5 | 5 | 22.862 M | 28.285 M | **1.237** | 1.255 | **no (1.25)** | 4.2 % / 3.8 % | **VOID** |

- **A4 = UNRESOLVED (kiwipete VOID, start VOID).** On the page: "above it again, the reading is VOID and goes back to QE". It is not VOID-LOAD: every board reached 5 admitted pairs, at most 9 attempts against a cap of 15.
- **(v1) values held on every attempt.** Every one of the 1 + REPS perft counts equalled the published count on both builds, every position stayed pure, and the B and H node totals were equal. No STOP.
- **Paired ratios, kiwipete** (10 counted pairs over both schedules): 1.216, 1.143, 1.176, 1.087, 1.146 | 1.060, 1.097, 1.107, 1.192, 1.217.
- **Paired ratios, start:** 1.294, 1.261, 1.168, 1.240, 1.327 | 1.207, 1.256, 1.255, 1.222, 1.270.

## INFO boards (main schedule only; never re-run, never graded)

| board | counted | H ÷ B | paired median | spread B / H | status |
|---|---:|---:|---:|---|---|
| position-3 d5 (×40) | 5 of 6 | 1.223 | 1.204 | 5.3 % / 5.8 % | INFO-not-valid (spread) |
| position-4 d4 (×80) | 5 of 9 | 1.102 | 1.104 | 0.4 % / 2.2 % | valid |
| position-5 d4 (×20) | 5 of 5 | 1.127 | 1.111 | 1.9 % / 5.6 % | INFO-not-valid (spread) |

- **First-call (cold) ratio, INFO:** H ÷ B median `firstNps` of the counted runs. kiwipete 1.137 (main) and 1.195 (re-run); position-6 1.118; start 1.081 and 1.239; position-3 1.141; position-4 0.920; position-5 1.151.
- **NFR-001 (INFO):** head steady-state perft ran at 16.8–35.7 M nodes/s per counted run on this host, far above 1 M/s. No bar moves.

## What the numbers say (INFO, post hoc, not a grade, and no hypothetical grade is computed)
- No counted pair reached 1.25 on kiwipete in either schedule (max 1.217). On position-6, the one valid graded board read 1.111.
- A GO needs two of the three boards at ≥ 1.25. Every reading this hop made put kiwipete and position-6 between 1.06 and 1.22, and only start crossed 1.25 in some pairs.
- A fresh read would be graded on its own runs alone (D3-V2 item 5). These figures only inform whether to spend one.
- Both HOLD and NO-GO lead to the same consequence on the page: not merged, and dropped.

## Validity evidence (why the boards voided)
- **Load did not void the boards.** Counted runs read foreign cores ≤ 0.64, every one below the 0.8 bar. kiwipete's re-run base runs, at 20.76–23.73 M (12.9 %), read 0.29–0.36 foreign cores.
- **The host ran hot through the perft schedule.** After-run Tctl on counted runs was 69.0–82.1 °C, with per-board medians 77.8–79.7 °C. One gate pause hit Tctl 86.25 °C (19:47:20Z).
- Each probe is about 2.5 s of single-thread work, back to back. The spread follows base's per-run swings at low foreign cores. Its mechanism (boost and thermal, core placement or SMT sibling) is `UNKNOWN - verify` (QE-250-a).
