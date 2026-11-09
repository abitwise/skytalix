# qe-ABC-295 R2 reading on `main` `e069b49a` (`src/` `bba42fb7`): **VALID. 126.0 / 200 (63.0 %) against Stockfish 19 at E 1 810, Elo +92.5 ± 49.1, so X = 1 902.5 ± 49.1** (opening-cluster ± 42.3). 0 faults, 0 time losses, depth guard 0 of 10 608. Inside the 25–75 % band, so **E 1 810 is confirmed. No step was taken; the pre-approved step was not needed.** Highest milestone met: **none** (E < 2 200). Read once under PREREG `…4151e128`

QE/E2E, task `qe-ABC-295`, stage B. One run, launched 15:28:10Z and ended 16:04:06Z, under the host lock with the host ALONE (0 foreign processes in all 213 samples). Runs and host: this task's stage B readings note (the observation sealed just before this one). This is a reading, not a merge gate: it gates nothing (`EPIC-011` § Phases). Raw: `raw/out/r2/` and `raw/out/session/r2-e1810.read.txt`.

## The figure (scope 3), on the scale "Stockfish 19 `UCI_Elo`, skytalix at 100 ms (`st=0.1`, `timemargin` 50, level 5), Stockfish `st=0.1`, this host"

| figure | value |
|---|---|
| W / D / L (skytalix) | **122 / 8 / 70** |
| points / score | **126.0 / 200 = 63.0 %**. As White 76.0 / 100, as Black 50.0 / 100 |
| `cutechess-cli` Elo against E | **+92.5 ± 49.1** (LOS 100.0 %, draw ratio 4.0 %) |
| X = E + Δ (the tool's state line) | **1 810 + 92.5 ± 49.1 = 1 902.5 ± 49.1** |
| opening-cluster interval | **± 42.3** Elo: 100 openings × 2 games, design effect 0.749, about 267 effective games. The iid figure is ± 48.9 |
| validity (R2-A1) | 200 of 200 games (200 results in the PGN). faults 0, unclassified 0. skytalix loses **0 on time**, and so does Stockfish (0 "loses on time" lines). Both stderr files are 0 bytes. Depth guard: 0 of 10 608 moves below depth 4. State `rating`, not UNRESOLVED. Neither stop fired. **MET** |
| terminations (skytalix's view) | won 122 by mate. Lost 70 by mate. Drew 5 by the fifty-move rule, 2 by threefold repetition and 1 by the move cap (round 24; Stockfish showed `+M3`; see the readings note) |
| latency go → bestmove | skytalix: 10 634 moves, median 101 ms, p95 102, max **105**, 0 moves at 150 ms or more. Stockfish: 10 608 moves, median 100, max 102 |
| `G11` (reported, not graded) | level 5 at 4 000 ms: 4.Qa4 → **e4** (d12, +39); 8.e5 → **g3** (d10, +40); 10.Ne4 → **exd6** (d11, +2); 13.d4 → **d4** (d12, −201); 17.Kc1 → **Kc1** (d12, −218). Two of the five differ from R1's (d3 → e4, Be2 → g3). Three are the same |
| highest milestone (`ADR-0056` D5 claim rule: E = M ≥ 2 200 at ≥ 50 %) | **none**. E 1 810 is below the first milestone, 2 200 |

- **R2 against R1 (reported, not graded):** X₂ − X₁ = 1 902.5 − 1 806.5 = **+96.0**, with R2 at ± 49.1 and R1 at ± 47.4. Combined in quadrature that is about ± 68, so the difference lies at about +28 to +164. Each is one 200-game sample, on the same E, control, openings and pins.
- **Against the PREREG estimate** (50–74 %, X ≈ 1 806–1 988): it lands inside, at 63 %. That is consistent with about half of the +181 self-play gain since R1 showing against this outside opponent. That is an inference from one sample, not a measurement of the transfer.
- **Its own scale.** It is never compared with the 4 s ≈ 2 074 and never pooled into S′.
- **What it cannot say:** the ± 49 interval runs 1 853–1 952. One sample cannot resolve a step under about 65–70 Elo against R1.

## The band rule (`ABC-204` A4, the 25–75 % band), as sealed
- P = 126.0, inside 50.0–150.0. That is outcome 2 of the PREREG: **E 1 810 is confirmed, and this reading stands as R2's figure.**
- **No step, upward or downward.** The owner's pre-approval of one band step (go line, "2 yes") was not used. There was no second run, and nothing goes to the owner.

## Acceptance (QE's reading of each row; the records hop is BA/PM's)
- **R2-A1: MET** (above).
- **R2-A2: MET.** Every scope-3 figure is above. The command as run was `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> node tools/rating/rating.ts r e069b49a <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1`, with both variables set to the pinned binaries. The `main` sha was `e069b49a` and E was 1 810. `cmd.txt` shows Stockfish at `st=0.1 timemargin=2000`. The `machine.txt` `control:` line is byte-equal to `control: skytalix st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000` (`ABC-275` A6), and both tool lines read `= pin`.
- **R2-A3: MET.** The estimate was 0.4–0.9 h, and the measured time was 0.60 h (`r` 35 min 56 s; session 36 min 17 s). No step.
- **R2-A4: open.** It is BA/PM's records hop (`EPIC-011` § Phases R2 row and G2 cite this note).

## Gaps
- **One move-cap draw** (round 24, a likely Stockfish mate cut off at 400 plies). It changes the score by at most 0.5 and leaves the band outcome unchanged. It is not a fault under R2-A1. It is noted for whoever reads `-maxmoves 200` against long endgames.
- **No product finding.** skytalix had 0 faults, 0 time losses and a max latency of 105 ms.
- **Not covered:** the 40/15 claim (G1), C4's anchors and R3 (`ABC-299`), all out of scope. EPIC-011's G7 400-game read was waived by the owner (orch `…810191ff` item 3), so this one 200-game sample is the epic's last reading.
