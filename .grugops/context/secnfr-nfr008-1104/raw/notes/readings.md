# secnfr-nfr008-1104 NFR-008 graded on `main` `fd6b595f` with twin arms, ALONE: **H median 9.84 s [9.78, 10.00], max 10.05 s. MET, graded, with 0.16 s of headroom.** Against 9.5 s (`R-N8H-1`) and 9.6 s (`Q-N8H-1`), it is above both

Security/NFR, task `secnfr-nfr008-1104`. Harness, arms, host gate and rules as sealed in the PREREG `…c7289371`, with no change for session 1. Records: `raw/out/n8/` (`a8.tsv`, `grade.out`, `n8.console`) and `raw/out/census-H.txt`; scripts in `raw/scripts/`.

## The session
- **ONE `flock <scratch>/host-test.lock` hold**, 2026-11-04 17:07:06Z → 17:11:32Z. The wait-clear took 0 s (load1 0.59).
- 9 rounds. Round 0 was discarded, so **n = 8 complete scored rounds and k = 2**. Every one of the 27 runs exited 0 with its expected counts (B 69 files / 2 650; H and H2 71 / 2 687; 0 skipped, 0 failed).
- **The host gate held on every run:** load1 1.81–3.37 before the scored runs (the limit is 8), no load wait, 0 foreign `vitest run` processes and 0 busy foreign vitest in every row. No power-supply entry (mains).
- Arms out of tree, each borrowing `node_modules` by symlink: **H = `main` `fd6b595f`** (lane inputs = merge `58e90d07`); **H2 = `cp -a` of H**, `diff -r` clean; **B = `ebd1263f`**, `main` after ABC-281, whose lane inputs are `ea08d7b6`'s.

## Readout (`n8-grade.py`, `qe-ABC-283`'s, unchanged)
| arm | wall median | interval [x(2), x(7)] | max | CPU median |
|---|---:|---|---:|---:|
| **H (`main`)** | **9.84 s** | **[9.78, 10.00]** | **10.05 s** | 33.37 s |
| H2 (twin) | 9.88 s | [9.78, 9.97] | 10.04 s | 33.48 s |
| B (`ebd1263f`) | 9.59 s | [9.51, 9.68] | 9.75 s | 32.15 s |

- **The twin, H2 − H:** CPU median +0.170 s = 0.51 % of H's CPU (the limit is 0.500 s), sign 6 / 8, which is at chance; wall median −0.035 s, **R 0.190 s**. **ADMISSIBLE.**
- **H − B (what ABC-271 and ABC-283 cost together, in one window):** wall **+0.280 s [+0.220, +0.370], 8 / 8 positive**; CPU +1.155 s [+0.790, +1.630], 8 / 8.
- **State, by ADR-0035 D1: NFR-008 MET, graded.** The twin is admissible, R 0.19 s ≤ 10 s, and H's median 9.84 s ≤ 10 s.

## Against the three lines
| line | H median 9.84 s | margin |
|---|---|---|
| **10 s** (`NFR-008`, W) | MET | **0.16 s on the median; 0.00 s at the interval top (10.00)** |
| **9.5 s** (`R-N8H-1`'s re-MEDIUM trigger) | above | +0.34 s |
| **9.6 s** (`Q-N8H-1`'s trigger) | above | +0.24 s |

- **Single runs:** H read 10.05 s and 10.00 s, and H2 read 10.04 s. So 2 of the 16 H / H2 runs were over 10 s, and one more sat exactly at 10.00. Every B run was ≤ 9.75 s.

## How this window compares with the earlier reads
- **This window ran about 0.15 s slow.** B's tree (`ea08d7b6`'s lane inputs) graded 9.42 s in `qe-ABC-281` `…c7e298cd`, and QE's `09694a4e` base read 9.45 s in `qe-ABC-283` `…d15c2a10`. Here B read 9.59 s. That is inside the 0.3–0.5 s window-to-window spread (`secnfr-nfr008-headroom` `…f925027f`).
- **The cost of the two merges is consistent across reads.** QE read ABC-283 alone at +0.14 s over its base. ABC-271 alone was about +0.17 s (9.17 → 9.34 s, `qe-ABC-271` `…74da20bf`). Here the two together read +0.28 s.
- On QE's window, H would sit near 9.60 + 0.14 ≈ 9.74 s, and SE's quiet read was 9.77 s (`…f7f63e1d`). **`main` sits at about 9.7–9.85 s, depending on the window.** The headroom to W is about 0.15–0.3 s, which is less than the spread.

## The census (information): where the lane's in-thread time goes, H and H2, 16 runs
- Sum of in-thread time: 6.96 s over 71 files, on 2 workers.
- **The six largest files:** `src/uci-session.test.ts` 1 676 ms; `src/cli.test.ts` 769 ms (plus its collect-time children, outside the slot); `src/search.null-move.test.ts` 667 ms; `src/engine.test.ts` 400 ms; `src/levels.test.ts` 378 ms; `tools/grugops/qe-hop-integrity.test.ts` 367 ms.
- The slowest rows and the per-file table are in `raw/out/census-H.txt`.
- **The note store:** 5 210 note files at `fd6b595f`, 290 short of `T-QEHOP-GROWTH`'s 5 500 re-arm point. There were 5 087 at `ebd1263f`.
