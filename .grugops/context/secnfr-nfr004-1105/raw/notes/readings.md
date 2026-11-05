# secnfr-nfr004-1105 readings: the 60 s clause has 5 QE readings at the hard stop and a longest move of 59 501 ms in play; overshoot max +3.9 ms, at a 23 s budget, not at the cap. Both triggers (≥ 59 900 ms, past ~31 ms) stay unfired

Security/NFR, records only, on `grugops/secnfr-nfr004-1105` from `main` `fefa1601`. Nothing was run: no test, build, engine, vitest, tsc or lint. Inputs: Architect/Design `…1ce8828d`, QE `…4f8f7f5d` and `…1434a7d1`, A4's `moves.tsv`, `read.txt` and logs, `qe-ABC-221` `…b348899a` and `…8ad25906`, `qe-ABC-223` `…5c8f2995` and `…2c62a346`, `secnfr-ABC-221` `…ef060512`. My re-read of A4 is `raw/scripts/a4-reread.py`, output `raw/out/a4-reread.txt`. It reads records only.

## QE's `A10` re-run (`qe-ABC-221`, code `c48a6f83`, `raw/deep/engine-deep-a10.txt`)
- 3 positions, one search each at 59 500 ms, real clock. Walls 59 500.1, 59 500.8 and 59 499.4 ms. Engine `time` 59 500, 59 501 and 59 500.
- Max wall 59 500.8 ms: 499.2 ms under 60 000, +0.8 ms over the budget.
- `secnfr-ABC-221` set three reopen lines. None fired: no wall over 60 000 ms; memory growth +0.12 MiB against 1 MiB; `A14b` R1 0.41 ms against 100 ms.
- Host: load1 1.4 at the start. A foreign orphan held one of 24 cores at 100 % through the window (QE-221-c), so this read was not quiet either.
- W1 moved this row to `go movetime 90000`, which W1 leaves alone (D1). QE read the change as a pin (`…e4b8527a`). QE's `ENGINE_DEEP` uci-session lane passed 265 of 265 there (`…e4b8527a`), so the moved row held its ≤ 60 000 assertion, but QE's records carry no walls for it. The walls on record after W1 are the SE's, 59 499.4–59 501.0 ms (`se-ABC-282` `raw/a3-ceiling.txt`).

## A4 against `NFR-004` (`qe-ABC-282`, code `04ebeb7e`, 606 moves, 5 games, 40/15)
- **QE's figures reproduce.** Longest move 59 501 ms, g05 Black's move 39, budget 59 500, exact clock. 13 of 606 budgets at the cap. Seven moves of 50 900–59 501 ms, each at a period's moves 36–40. Over 59 500 ms: 1 move. ≥ 59 900 ms: 0. Over 60 000 ms: 0.
- **The budget column is right.** I recomputed all 606 from `safeClockShare` and the cap, from each row's clock and `movestogo`: 0 mismatches. So the overshoot does not rest on the reader's arithmetic.
- **Three readings of the longest move agree within 1 ms:** the clock read 59 501, the engine's own `time` 59 501, the debug-log stamps 59 502. The PGN's `60s` is 59.501 s rounded. It is not a reading of 60 000 ms.
- **The cap was reached 13 times and run to twice.** The two moves at the hard stop read 59 501 and 59 500 ms. The other 11 ended 4 714–32 553 ms short of it. So the hard stop at 59 500 has 5 QE readings in all: 3 in `A10`, 2 in play.

## A4 against `AR-NFR004-A`
- **+3.9 ms is not a reading at the cap.** It is g01 Black's move 42, 23 036 ms against a budget of 23 032.1 ms: 0.017 %. At the cap the figures are +1 and 0 ms. `…1ce8828d` reads "A4's +3.9 ms" against the risk; that is right, but the figure belongs to the 23 s band.
- **The sample is 118 moves, not 591.** 462 searched moves ended over 1 000 ms under budget and 11 ended 86–664 ms under. Neither group reached the abort, so they say nothing about its overshoot. 118 ended within 5 ms of budget, at budgets of 22 542.6–59 500 ms. QE's 129 near-budget moves hold the same max and the same median, +0.6 ms.
- **5 of the 118 are stamp-read,** max +2.0 ms. The stamp read at most 25 ms under the clock over 596 moves, so those five are at most about +27 ms. That is a measured spread, not a hard bound, and it stays under 31 ms. The 113 exact-clock moves give the +3.9.
- **`QE-223-d`:** +2.5 ms max, median +0.6 ms, over 614 searched moves at budgets of 22.4–25.3 s: at most 0.012 %. That host was not alone either (QE-223-a, 48.8 %).
- **What these figures measure.** A4's and `ABC-223`'s are elapsed on cutechess's clock, through the pipe, in whole milliseconds. The risk names the engine's abort granularity. So they bound the risk's overshoot from above, plus pipe and timer time.

## The foreign load, read at the moves that matter
The logs are on disk in QE's worktree only. All 16 files present there match `SHA256SUMS`.

| move | elapsed | samples | foreign vitest in | load1 | Tctl |
|---|---|---|---|---|---|
| g05 Black 39 | 59 501 ms | 6 | 6 of 6 (2 running) | 2.56–2.80 | 79.1–83.5 °C |
| g05 White 40 | 59 500 ms | 6 | 0 of 6 | 2.03–2.39 | 76.4–79.2 °C |
| g01 Black 42 | 23 036 ms | 2 | 2 of 2 (2 running) | 3.97–4.12 | 86.1 °C |

- QE's statement that the longest move sat inside a foreign window holds.
- With load (59 501) and without foreign vitest (59 500) the two moves at the cap differ by 1 ms. Two moves show no more than that.
- **The load was light for this host:** load1 about 4 at most at these moves, against 24 threads. So A4 did not test the stall tail under saturation. It shows these figures survive light foreign load, and no more.

## Host label
Neither QE note spells the label `oeselg-dev`. A4's PREREG names Node v26.12.1, QE-221-c counts 24 cores, and this repository's reads run under the one host lock. I read both as the reference. That is inference, not a recorded line.

## Records gap
`…1434a7d1` says the logs are committed. They are not: `.gitignore` carries `*.log`, and `raw/out/a4/` holds 9 tracked files on `main`. The 9 logs that `SHA256SUMS` lists (g01–g05, harness, precheck, foreign, thermal) exist only in QE's worktree. `moves.tsv`, `read.txt` and the PGNs carry every figure above except the foreign-load table, which `raw/out/a4-reread.txt` now keeps. A cleared worktree loses the raw logs.
