# qe-ABC-273 R1 reading on `main` `85a304ff` (`src/` `4d6b117b`, after E1): **VALID. 99.0 / 200 (49.5 %) against Stockfish 19 at E 1 810, Elo −3.5 ± 47.4, so X = 1 806.5 ± 47.4** (opening-cluster ± 48.4). 0 faults, 0 time losses, depth guard 0 of 10 508. Inside the 25–75 % band, so **E 1 810 is confirmed: no step, no second run, no owner ask.** Highest milestone met: **none** (E < 2 200). Read once under PREREG `…3cda6a60`

QE/E2E, task `qe-ABC-273`, branch `grugops/ABC-273`. One run, launched 13:12:07Z and ended 13:47:36Z. The host was ALONE (foreign vitest showed in 21 of 211 samples, 10 %, which is under the sealed 20 % line), and the run was under the host lock. This is a reading, not a merge gate (`ABC-273` § Out of scope; `EPIC-011` § Phases, milestone readings "gate nothing"). Raw: `raw/out/r1/` (the tool's records, paths redacted) and `raw/out/read.txt` (`read.mjs`, sealed).

## The figure (scope 3), on the scale "Stockfish 19 `UCI_Elo`, skytalix at 100 ms (`st=0.1`, `timemargin` 50, level 5), Stockfish `st=0.1`, this host"

| figure | value |
|---|---|
| W / D / L (skytalix) | **95 / 8 / 97** |
| points / score | **99.0 / 200 = 49.5 %**: as White 54.5 / 100, as Black 44.5 / 100 |
| `cutechess-cli` Elo against E | **−3.5 ± 47.4** (LOS 44.3 %, draw ratio 4.0 %) |
| X = E + Δ (the tool's state line) | **1 810 + (−3.5) ± 47.4 = 1 806.5 ± 47.4** |
| opening-cluster interval | ± **48.4** Elo (100 openings × 2 games, design effect 1.047, about 191 effective games). The iid figure is ± 47.3 |
| validity (R1-A1) | 200 of 200 games; faults 0, unclassified 0, move-cap draws 0. skytalix loses **0 on time**, and so does Stockfish. Both stderr files are 0 bytes. Depth guard: 0 of 10 508 moves below depth 4. **MET** |
| latency go → bestmove | skytalix: 10 507 moves, median 100 ms, p95 101, max **106**, 0 moves at 150 ms or more. Stockfish: 10 508 moves, median 100, max 102 |
| `G11` (reported, not graded) | level 5 at 4 000 ms: 4.Qa4 → **d3** (d11, +56); 8.e5 → **Be2** (d10, +51); 10.Ne4 → **exd6** (d10, +10); 13.d4 → **d4** (d11, −122); 17.Kc1 → **Kc1** (d11, −209). These are the same five moves as `qe-ABC-268`'s pre-E1 head |
| highest milestone (`ADR-0056` D5 claim rule: E = M ≥ 2 200 at ≥ 50 %) | **none**. E 1 810 is below the first milestone, 2 200 |

- **Read against the Architect's estimate** (1 730–1 840 at 100 ms, 40–55 %): the reading lands inside it. It is an outside baseline for E2 / E3a, read on its own scale. It is never compared with the 4 s ≈ 2 074 or with S′'s 0.5 s pool (`ADR-0056` C3′ figures rule). R1 never pools into S′.
- **What it cannot say:** the ± 47 interval holds 1 759–1 854. The reading shows where `main` stands, and it cannot show a change of under about 50 Elo.

## The band rule (`ABC-204` A4, the 25–75 % band), as sealed
- P = 99.0, which is inside 50.0–150.0. That is outcome 2 of the PREREG: **E 1 810 is confirmed, and the reading stands as R1's figure.**
- **No step, upward or downward, so no second run and nothing for the owner.** Host time was 35 min 29 s, under 1 h (R1-A3).

## Acceptance (QE's reading of each row; the records hop is BA/PM's)
- **R1-A1:** MET (above).
- **R1-A2:** MET. Every scope-3 figure is above. The command line as run is `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> node tools/rating/rating.ts r 85a304ff <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1`, with the `main` sha and E 1 810. Both variables were set, and both `machine.txt` tool lines read `= pin`. `cmd.txt` shows Stockfish at `st=0.1 timemargin=2000`.
- **R1-A3:** MET. The estimate was 0.4–0.9 h; the measured time was 0.59 h. No step.
- **R1-A4:** open. It is BA/PM's records hop (`EPIC-011` § Phases, the R1 row, and G2 cite this note).
- **`ABC-275` A6:** **MET.** The `control:` line in `machine.txt` is byte-equal to `control: skytalix st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000`. So `qe-ABC-275`'s "UNKNOWN - verify at R1" is closed.
