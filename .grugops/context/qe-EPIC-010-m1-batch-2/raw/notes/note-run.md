# qe-EPIC-010-m1-batch-2 run record: block-01 guard PASS on both builds (943 / 951 moves at 4.0 s, 0 at 3.0 s); 20 block-runs, 0 faults, 0 time losses, 0 pauses; Stockfish nps spread 12.1 %; Tctl median 75.1 °C, max 89.5 °C; contamination 7.7 % of ticks

QE/E2E, task `qe-EPIC-010-m1-batch-2`. The re-run: harness launched with `setsid -f` at 08:39:34Z (QE-M1B2-b), block 01 base
started 08:39:39Z, harness exit 2026-11-01T06:52:33Z. Raw: `raw/batch/` (the tool's records, already redacted by the tool;
`watch.log` and `waitclear.log` redacted by QE; the 20 `r.out` files of about 7 MB each are not committed and their sha256 is
in `SHA256SUMS`).

## Before game 1
- **Wait-clear** (`raw/batch/waitclear.log`): it snapshotted 2 foreign `vitest` pids at 08:32:19Z, which were gone at 08:34:59Z.
  Then Tctl and load cleared only after the other repository's burst ended: 3 / 3 at 08:38:39–08:39:19Z, with Tctl 40.5, 39.1
  and 37.9 °C and load1 1.28, 1.05 and 0.83.
- **The tool's builds:**
  - `artifacts.txt`: base `ca6e675c` dist tree `41d93d04…`; candidate `51902be5` dist tree `0610504d…`.
  - Both declare `option name Skill Level type spin default 5 min 1 max 7`.
- **Pins:** `machine.txt` shows `cutechess-cli 1.5.1 … = pin`, `Stockfish 19 … = pin`, and the openings sha256 `0d7f7a72…`
  (the tool's own check).

## The block-01 guard (`ABC-247` Test note 3; PREREG): PASS on both builds
| build | when read (watcher) | skytalix moves | at 4.0 s | at 3.0 s | book | engine `info time` lines in [3 900, 4 100] / [2 900, 3 100] | `setoption … Skill Level value 6` / `go movetime 4000` |
|---|---|---|---|---|---|---|---|
| base `ca6e675c` | 09:50:15Z | 950 | **943** | **0** | 7 | 943 / 0 (max 4 002 ms) | 20 (one per game) / 950 of 950 go |
| head `51902be5` | 11:01:17Z | 958 | **951** | **0** | 7 | 951 / 0 (max 4 002 ms) | 20 / 958 of 958 go |

- QE re-read both PGNs by hand after block 01, with the same counts.
- **Over all 20 PGNs** (`raw/batch/clocks-per-block.txt`): base 8 536 and head 9 305 skytalix moves at 4.0 s, 0 at 3.0 s, and
  no other clock value. The rest are book moves (83 and 79).
- So both builds searched 4 000 ms on every search move, as `ADR-0053` d10 requires.

## Per block-run (`raw/batch/analyse.txt`, from `schedule.log`, `nps.log`, `thermal.log`, `watch.log`)
| block-run | wall min | W/L/D | faults / time losses | Stockfish nps median | Δ vs previous run | Tctl med / max °C | busy MHz | foreign ticks |
|---|---|---|---|---|---|---|---|---|
| base b01 | 70.5 | 12/3/5 | 0 / 0 | 1 673 196 | – | 76.3 / 88.1 | 5 008 | 24/70 (34 %) **> 25 %** |
| cand b01 | 71.0 | 15/5/0 | 0 / 0 | 1 726 596 | +3.2 % | 74.5 / 77.3 | 5 033 | 0 |
| cand b02 | 60.3 | 18/2/0 | 0 / 0 | 1 666 510 | −3.5 % | 74.9 / 77.4 | 5 031 | 0 |
| base b02 | 57.5 | 18/2/0 | 0 / 0 | 1 682 344 | +1.0 % | 74.8 / 77.3 | 5 030 | 0 |
| base b03 | 78.2 | 12/7/1 | 0 / 0 | 1 736 412 | +3.2 % | 75.0 / 79.3 | 5 029 | 0 |
| cand b03 | 61.2 | 14/6/0 | 0 / 0 | 1 664 920 | −4.1 % | 75.3 / 78.6 | 5 027 | 0 |
| cand b04 | 63.9 | 11/9/0 | 0 / 0 | 1 648 088 | −1.0 % | 75.3 / 77.8 | 5 029 | 0 |
| base b04 | 63.9 | 15/4/1 | 0 / 0 | 1 686 932 | +2.4 % | 75.9 / 89.5 | 5 011 | 19/64 (30 %) **> 25 %** |
| base b05 | 51.6 | 16/3/1 | 0 / 0 | 1 583 794 | −6.1 % | 77.3 / 88.1 | 4 998 | 11/52 (21 %) |
| cand b05 | 59.2 | 17/3/0 | 0 / 0 | 1 624 126 | +2.5 % | 77.3 / 88.6 | 4 999 | 25/59 (42 %) **> 25 %** |
| cand b06 | 83.8 | 16/2/2 | 0 / 0 | 1 747 872 | +7.6 % | 75.9 / 89.1 | 5 009 | 20/84 (24 %) |
| base b06 | 75.9 | 13/7/0 | 0 / 0 | 1 779 826 | +1.8 % | 75.3 / 87.9 | 5 024 | 3/75 (4 %) |
| base b07 | 61.9 | 17/2/1 | 0 / 0 | 1 668 370 | −6.3 % | 75.4 / 87.3 | 5 029 | 0 |
| cand b07 | 70.8 | 14/5/1 | 0 / 0 | 1 694 584 | +1.6 % | 74.9 / 78.4 | 5 030 | 0 |
| cand b08 | 87.7 | 11/7/2 | 0 / 0 | 1 787 990 | +5.5 % | 74.8 / 78.1 | 5 034 | 0 |
| base b08 | 59.0 | 16/4/0 | 0 / 0 | 1 713 786 | −4.2 % | 75.0 / 78.1 | 5 029 | 0 |
| base b09 | 61.1 | 17/1/2 | 0 / 0 | 1 718 068 | +0.2 % | 75.4 / 78.0 | 5 015 | 0 |
| cand b09 | 68.1 | 13/7/0 | 0 / 0 | 1 763 060 | +2.6 % | 74.9 / 78.3 | 5 032 | 0 |
| cand b10 | 69.3 | 12/7/1 | 0 / 0 | 1 762 526 | −0.0 % | 74.5 / 78.1 | 5 035 | 0 |
| base b10 | 58.1 | 15/5/0 | 0 / 0 | 1 678 022 | −4.8 % | 74.9 / 78.1 | 5 030 | 0 |

- **Stockfish nps** (information, QE-225w1-d):
  - base: min 1 583 794, median 1 684 638, max 1 779 826, spread 11.6 % of the median;
  - head: min 1 624 126, median 1 710 590, max 1 787 990, spread 9.6 %;
  - all 20 runs: spread 12.1 %. The largest swing between consecutive block-runs was +7.6 % (base b05 → cand b06, at the end of
    a contamination burst).
  - The lowest value (base b05, −6.1 %) falls in a contaminated stretch.
- **Thermal:** `thermal.log` held 7 996 samples, median 75.1 °C and max 89.5 °C. The watcher's highest 5-min median was
  83.30 °C and its highest reading 88.8 °C. **0 pauses, 0 THERMAL STOP.** Every per-block max above 80 °C falls in a block with
  foreign `vitest` ticks.
- **Contamination** (`raw/batch/watch.log`):
  - 102 of 1 332 ticks (7.7 %) had a foreign process, all `vitest` from `<home>/projects/public/grugops`, in bursts:
    08:44–09:10Z, around 17:00Z, around 18:40Z and around 20:40Z.
  - There were no foreign `cutechess-cli`, Stockfish or skytalix engines.
  - Named (> 25 %): base b01, base b04, candidate b05. Information only under the PREREG. Two of the three are base runs and
    one is a head run, so the contamination fell on both sides.
- **Wall:**
  - the session ran 22.216 h, play 22.215 h, builds about 5 s, 0 pause time;
  - 400 games at 18.01 games/h (3.33 min a game);
  - the block-run walls ran 51.6–87.7 min.
- **Crashes, halts, VOID:** none in this run. Run 1 was VOID (`…3fb3b1fd`).
