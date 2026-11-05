---
id: 20261104T230342Z-qe-e2e-observation-b4427cbd
kind: observation
by: qe-e2e
at: 2026-11-04T23:03:42Z
verified_by: 
confidence: high: harness records, SHA256SUMS verified, one lock hold; period-use figures are information, not A4
refs:
  - qe-ABC-282
  - grugops/ABC-282
  - grugops/qe-ABC-282
  - ABC-282
  - ABC-300
  - ABC-223
  - ABC-221
  - ABC-078
  - EPIC-011
  - EPIC-009
  - ADR-0071
  - A0
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - D12
  - F5
  - NFR-004
  - NFR-008
  - R-0071-1
  - R-281-a
  - QE-300-a
  - QE-282-a
  - QE-282-b
  - QE-282-c
  - QE-282-d
  - QE-282-e
  - QE-282-f
  - QE-282-g
  - QE-282-h
  - QE-282-i
  - QE-282-j
  - UAT
  - 04ebeb7e
  - 22931005
  - d235214c
  - src/engine.ts
  - src/uci-session.ts
  - src/engine.test.ts
  - src/uci-session.test.ts
  - qe-ABC-282/20261104T212617Z-qe-e2e-decision-416a183f
  - qe-ABC-282/20261104T213029Z-qe-e2e-decision-5833fc48
  - qe-ABC-282/20261104T213054Z-qe-e2e-observation-0680580d
  - se-ABC-282/20261104T211719Z-software-engineer-decision-988cd2cb
supersedes: 
seal: sha256:ad437b84ea8713c9de51b7f5a33a3572b07971c29cd1abe018ef1bdf442399c8
---

# qe-ABC-282 A6: 100 / 100 at `tc=40/8`, W1 against the merge-base, **W/L/D 45 / 32 / 23 = 56.5 ≥ 50.0, MET**, 0 faults, 0 losses on time. Elo +45.4 ± 60.7, so the harness's own label is NEUTRAL: the bar is met, and the read does not by itself prove a gain. QE-300-a closes

Read against PREREG `…416a183f`, with `…5833fc48` and `…0680580d`. Played once, launch 3. Launches 1 and 2 stopped before any game (`raw/out/a6-launch1/`, `raw/out/a6-launch2/`). Records: `raw/out/a6/`.

## The read
- **Command:** `rating.ts d 04ebeb7e 22931005 <out> --tc 40/8 --rounds 50 --concurrency 1`, ONE lock hold, 21:34:42Z to 22:10:23Z, **35 min 41 s** (estimate 30–45 min).
- **Result:** 100 of 100 complete, `skytalix` 45 / 32 / 23, **56.5 of 100, MET**. Faults 0, unclassified 0, move-cap draws 0, both stderr files 0 bytes. By colour 27.0 / 50 as White, 29.5 / 50 as Black. Opening pairs (0, ½, 1, 1½, 2): 4, 7, 20, 10, 9.
- **Terminations:** mates 77, repetition 11, fifty moves 8, insufficient material 4. Mean game 130.1 plies, the longest 366.
- **Elo +45.4 ± 60.7, LOS 93.1 %.** The interval includes 0, so `state:` reads NEUTRAL. The PREREG says that label is not the verdict, and the ticket's bar is the score. It is stated so nobody reads 56.5 as a measured gain: D10's forecast band is not confirmed or refuted by 100 games.
- **Builds:** candidate dist tree sha256 `c3f8c88d…d304` equals launch 1's, as the amendment required. `SHA256SUMS` verifies, `d.out` included, before its deletion.

## QE-300-a, closed
From this real run: `machine.txt` has `control: skytalix and base tc=40/8 timemargin=0 TimeMode=uci-clock-mode`. `cmd.txt` has `tc=40/8 timemargin=0 restart=on option.TimeMode=uci-clock-mode` in both engine blocks, `-repeat -games 2 -rounds 50 -concurrency 1 -maxmoves 200`, no `st=`. **`ABC-300` A6 is MET.**

## Reports (not bars; `raw/out/a6/a6-read.txt`)
| | head (W1) | base |
|---|---|---|
| moves / searched | 6 510 / 6 416 | 6 501 / 6 407 |
| mean completed depth | **8.062** | 7.973 |
| moves from a partial iteration | **169 = 2.63 %** of searched | 0 |
| median move / longest | 115 ms / 1 335 ms | 144 ms / 528 ms |
| closest call | 1 099 ms | 891 ms |
| clock left at period end, min / median / max | 1 099 / 1 469.5 / 1 862 ms | 891 / 1 100 / 1 101 ms |
| completed side-periods | 106 | 106 |
| period use, min / median / max | **76.72 / 82.27** / 107.73 % | 86.24 / 86.25 / 100.03 % |

- A period can read over 100 % because time banked in earlier periods is spent there. The reader leaves a side's last move out of period sums.
- **Period use at 40/8 is information. It is not A4.** It is worth reading, though: D11's model forecast period 1 at min 87.8 %, median 95.4 % at 40/15, and the head's real least here is 76.72 %, 1.72 points over M2's 75 %. Two different controls, so no conclusion, but R-0071-1 stays open.
- The base's 891 ms is `main`'s behaviour, above 500 ms, and not a W1 row.

## Host
load1 1.02–2.35. `foreign_vitest_procs` non-zero in 6 of 137 samples, from 21:57Z, up to 2 (QE-282-d). Both sides played through those windows alike.
