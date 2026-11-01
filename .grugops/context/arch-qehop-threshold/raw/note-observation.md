# `arch-qehop-threshold`: `T-QEHOP-GROWTH` reading written as **MET** at `37a93b76` (4 272 notes); recompute from QE's raw TSV agrees on every figure

## Scope
Recompute of `qe-qehop-growth` w1 (`.grugops/context/qe-qehop-growth/probe/w1/n8-qeg.tsv`, 24 scored rows, round 0 dropped) in integer centiseconds by `raw/recompute.py` → `raw/recompute.out.txt`. Arithmetic over committed data; nothing run on the host.

## What agrees with QE `…625483bc` / `…21479114`
- CPU: B 0.370, H 0.830, T 0.360 s. Twin sorted −0.04, −0.02, −0.02, 0.00, +0.02, +0.03, +0.03, +0.03 → median **+0.010 s**, **R 0.030 s**. Treatment +0.42 … +0.54 → median **+0.455 s**, x(2)..x(7) **+0.440..+0.490 s**.
- Wall: twin median +0.005 s, R 0.020 s; treatment +0.270 s (+0.260..+0.310).
- Projection at s = 81.75 µs: crossings 6 657.3 (median) and 6 229.2 (upper end); 75 % point 4 669.6; at 5 500: 0.5554 / 0.5904 s.
- Note counts: 4 272 at `37a93b76`, 4 287 at `28e46464` (`git ls-tree`).
- Harness sha256 on `main` `28e46464` equals `probe/w1/window-once.txt`; preregistration blob `3aab3adc` at `8dfbabf5` and on `main`, and `8dfbabf5` is an ancestor of `main`.

## Where written
- `ADR-0035` § Addendum 2026-11-01 (after qe-qehop-growth) C1, plus a § Status pointer paragraph.
- `plans/nfr-catalog.md` § "`N8-LANE` at `ABC-105`", subsection "`T-QEHOP-GROWTH`, 2026-11-01", plus one `_Updated:` line.
- State at 650 ms CPU: **MET**. Not paired with `qe-ABC-154`'s +0.380 s (M3 history).

## Risks
- The admissibility rests on A1's one-tick floor (`QE-QHG-a`); stated, not hidden.
