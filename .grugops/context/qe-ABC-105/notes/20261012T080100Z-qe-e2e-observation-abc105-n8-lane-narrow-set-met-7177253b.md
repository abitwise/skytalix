---
id: 20261012T080100Z-qe-e2e-observation-abc105-n8-lane-narrow-set-met-7177253b
kind: observation
by: qe-e2e
at: 2026-10-12T08:01:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - N8-LANE
  - NFR-008
  - ADR-0035
  - QE-105-x
  - tools/grugops/qe-hop-integrity.test.ts
supersedes:
---

# QE `ABC-105` `N8-LANE`: the narrow set reads +0.475 s CPU, twin R 0.010 s, and is MET at 650 ms

Hand-authored and unsealed (`AGENTS.md`). This is the set's **first** reading on vitest 4.1.11. QE was the only
hop running (width 1). The numbers below were read, not estimated.

## Instrument (`ADR-0035` decision 2)

- **Set:** `tools/grugops/qe-hop-integrity.test.ts`, the only file the ticket adds or modifies. There is no
  `src/` file, so there is no `vitest related` extension.
- **Arms** are out-of-tree `git archive 60415a8a` trees, each with a symlinked shared `node_modules`. This is
  the condition `ADR-0035`'s 2026-10-12 per-set paragraph states.
  - **H** is the tip.
  - **B** is the tip with the file replaced by a one-assertion placeholder at the same path
    (`probe/placeholder.test.ts`).
  - **T** is a twin of B. `diff -r` shows them identical.
- Stack: vitest **4.1.11**, `pool: "threads"`, `maxWorkers: 2`, `experimental.viteModuleRunner: false` (read from
  the arm's `vitest.config.ts`), 0 `VITEST_` env vars, node v26.11.0, Mac15,13 (Apple M3), AC power,
  `lowpowermode 0`.
- **Harness:** `secnfr-ABC-144-window-b/probe/lane144b.mjs`, used **in place and unchanged** (sha256
  `652b7793…c80c7c`), with `NARROW=<the file>`, `CONDS=B,H,T`, `ROUNDS=9` (round 0 discarded, n = 8), rotated
  order and `GAP=0`. CPU is user + sys from `/usr/bin/time -p`. The harness logs load1, thermal pressure
  level, other runner processes and power source **before and after every run**, and asserts counts (B and T
  1 file / 1 test, H 1 file / 28 tests).
- **Overlap control.** A separate 5 s sampler (`probe/sampler.tsv`) logs every runner process that is not this
  window's, and every `oeselg-labs/platform` process. `probe/readout105.py` discards a whole round if any run in
  it was overlapped by such a sample, by a nonzero thermal level or by a non-AC source. The limit is the 5 s
  cadence: a foreign process that lives less than 5 s between samples and also misses the per-run before and
  after reads would go unseen.

## The quiet window

| attempt | gate | result |
|---|---|---|
| 1 | `secnfr-ABC-152-window/probe/gate.sh` in place: thermal 0, **load1 ≤ 4.0**, no runner, 4 × 15 s | **not passed** 07:35:23–07:48:30Z. Abandoned, no runs. load1 read 4.9–6.9, and a foreign runner was live most of the time (the grugops kit's own `vitest run … install/*.test.ts` from another session). Log: `probe/n8-attempt1/` |
| 2 | the same gate with **load logged, not gated** (`ADR-0035` d2: "Load is logged, never gated"): thermal 0, no runner, AC, 4 × 15 s | **passed 07:58:46Z.** The lane ran 07:58:46–07:59:09Z. Every run read thermal 0→0, foreign 0→0, AC, and the sampler saw 0 foreign runner and 0 platform processes. **0 rounds discarded** |

**Load1 during the reading was 5.10–5.34.** It is high, it is logged, and it was not gated. It is stated here
because it is the main condition a later reader should weigh.

## Reading (n = 8, k = 2)

| arm / delta | CPU | wall |
|---|---|---|
| B (placeholder) median | 0.575 s | 0.430 s |
| H (the file) median | 1.065 s | 0.810 s |
| T (twin) median | 0.580 s | 0.430 s |
| **twin T − B**: median, sign, R | +0.000 s (0.00 % of base), 3/8, **R 0.010 s** | −0.005 s, 2/8, R 0.010 s |
| **treatment H − B**: median, interval x(2)..x(7) | **+0.475 s**, +0.460..+0.520 | +0.380 s, +0.350..+0.400 |

The sorted twin CPU deltas are −0.13, −0.01, −0.01, 0.00, 0.00, +0.01, +0.01, +0.01. The sorted treatment CPU
deltas are +0.39, +0.46, +0.46, +0.47, +0.48, +0.49, +0.52, +0.60.

## Grade

- **Admissible:** the twin median of 0.000 s is ≤ 1.5 % of the 0.575 s base, and the sign of 3/8 is at chance
  (two-sided p 0.73).
- **Provisional `F`** = 16 % × 0.575 s = **0.092 s**. 650 ms ≥ `F`, so the page's condition is satisfied.
- **Resolves 650 ms:** R 0.010 s ≤ 0.650 s.
- **State: MET.** It is admissible, it resolves the bound, and the treatment median of +0.475 s is ≤ 0.650 s. The
  whole treatment interval, up to +0.520 s, also sits under the bound.
- **This set's first 4.1 reading** gives R = 0.010 s. Under the 2026-10-10 amendment it replaces the provisional
  16 %. Recording the per-set `F` is Architect/Design's job. QE reports the R and does not write it into the
  ADR.
- **Count pins** (the page's): 1 test file added, under `tools/`; **0 spawns** (the file imports the tool
  in-process; QE read it); 0 files under `src/`.

## Risk (`QE-105-x`, LOW)

The file's content cost is **+0.475 s of a 0.650 s bound, about 73 %**. It walks the real notes tree: three full
`--sweep` reads inside `A4`, plus folder-filtered reads. That tree grows with every hop (2624 notes at
`60415a8a`), so the cost grows with the record and not with the code. Nothing here predicts when it would cross
650 ms. Re-read it on this set when a later ticket touches the file.
