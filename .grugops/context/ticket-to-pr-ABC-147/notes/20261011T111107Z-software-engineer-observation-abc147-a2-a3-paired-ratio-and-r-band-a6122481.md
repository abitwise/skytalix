---
id: 20261011T111107Z-software-engineer-observation-abc147-a2-a3-paired-ratio-and-r-band-a6122481
kind: observation
by: software-engineer
at: 2026-10-11T11:11:07Z
verified_by:
confidence: medium
refs:
  - ABC-147
  - ABC-085
  - .grugops/context/ticket-to-pr-ABC-147/probe/workload.mjs
  - .grugops/context/ticket-to-pr-ABC-147/probe/a2-pairs.mjs
  - .grugops/context/ticket-to-pr-ABC-147/probe/a2-node.mjs
  - .grugops/context/ticket-to-pr-ABC-147/probe/a2.probe.test.mjs
  - .grugops/context/ticket-to-pr-ABC-147/probe/vitest.probe.config.mjs
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a2-pairs.tsv.txt
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a2-pairs.summary.tsv.txt
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a3-estimate.txt
  - .grugops/context/ticket-to-pr-ABC-085/probe/RUN.txt
supersedes:
---

# `ABC-147` `A2`/`A3`: on the lane's two heaviest files, vitest runs production code **~5.0–5.1x** slower than plain `node`. R ≈ **34 %** of lane CPU, band 29.7–35.8 %

This note is hand-authored and unsealed. These are estimates, labelled as such.

## A2: paired, interleaved, n = 5 per file, 10 of 10 pairs usable, 0 void

- **The workloads:** the call each file's heaviest default-lane test makes, imported from `src/` by
  both sides.
  - **E**, from `engine.test.ts` "A3 (identity)":
    - `chooseMoveWithoutReductions` on kq-corner, kr-corner, kqk-h8 and kp-vs-k, at budgets 3 and 5,
      on `tickingClock(1)`;
    - plus `searchWithoutReductions` at the completed depth.
  - **S**, from `search.test.ts` "A1 position-4 at depth 2": `searchWithoutReductions` and
    `searchWithoutPruning`.
- **The vitest side** is a probe test file under a probe-only config with `pool: "threads"`.
  `vitest.config.ts` was not touched.
- **Timing:** each process makes one warm-up call, then 5 timed calls, and reports the median.
- **Equal work:** the sha256 digest of the node counts, scores, depths and moves was **equal on all 10
  pairs**. E read `f66389c97154ff65` and S read `0f86f021e96f607d` on every process (`raw/a2-pairs.tsv.txt`).
- **Conditions:** load1 5.18–5.95 and `thermalpressurelevel` **1** before every process. The order
  alternated per pair.

| file | ratio vitest ÷ node, median (min–max) | node median ms | vitest median ms | cold first call ratio (supplementary) |
|---|---|---|---|---|
| `src/engine.test.ts` (E) | **5.093 (4.929–5.379)** | 28.7–30.4 | 142.6–157.5 | 3.317 (3.306–3.802) |
| `src/search.test.ts` (S) | **5.028 (4.948–5.184)** | 80.6–87.6 | 400.6–440.4 | 4.050 (3.938–4.145) |

- **The two files are within 2x of each other** (1.013), so the band uses the pooled range,
  4.929–5.379.
- **Compared with the record:** `ABC-085` measured ~4.35x on a single `chooseMove` at load1 ~2.8
  (`RUN.txt` item 4). These readings are a little higher, at higher load and thermal level 1. Same
  order.

## A3: R = lane CPU × share(i-w) × (1 − 1 ÷ ratio)

- **Lane CPU:** 28.10 s, the unprofiled median, n = 9.
- **share(i-w):** 42.62 % (37.27–43.91).
- **Pooled ratio median:** 5.06.

| | R % of lane CPU | R s at 28.10 s | band % | band s |
|---|---|---|---|---|
| **declared, share (i-w)** | **34.20** | **9.61** | **29.71–35.75** | 8.35–10.04 (7.99–11.00 with lane CPU min/max) |
| on the letter, share (i) | 34.45 | 9.68 | 30.04–35.97 | 8.44–10.11 |
| sensitivity, cold ratios (not declared) | 31.61 | 8.88 | lower edge 26.00 | — |

- **How the band is built:**
  - lower edge = share min × (1 − 1 ÷ the lowest ratio);
  - upper edge = share max × (1 − 1 ÷ the highest ratio).
- **This is an estimate.** It assumes the factor read on E and S holds across all of (i-w). Those two
  files hold ~14.5 % of the lane's 42.6 % (i-w). The rest is `moves.ts`/`legal.ts`-heavy code in
  perft, transposition and other tests, and it was **not** ratio-read.
