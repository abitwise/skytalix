---
id: 20261011T115111Z-architect-design-observation-abc150-d1-d2-factor-and-candidates-edc1ffd9
kind: observation
by: architect-design
at: 2026-10-11T11:51:11Z
verified_by:
confidence: high
refs:
  - ABC-150
  - ABC-147
  - RISK-ABC147-02
  - ADR-0041
  - .grugops/context/design-ABC-150/probe/METHOD.md
  - .grugops/context/design-ABC-150/probe/d-pairs.mjs
  - .grugops/context/design-ABC-150/probe/c3-control.mjs
  - .grugops/context/design-ABC-150/probe/analyze.mjs
  - .grugops/context/design-ABC-150/probe/raw/d-pairs.tsv.txt
  - .grugops/context/design-ABC-150/probe/raw/d-pairs.summary.tsv.txt
  - .grugops/context/design-ABC-150/probe/raw/c3-control.tsv.txt
  - .grugops/context/design-ABC-150/probe/raw/analysis.txt
supersedes:
---

# `ABC-150` `D1`/`D2`: the factor re-reads at **5.0x / 5.1x / 4.3x** (E / S / P), and only cross-module interop (C3) or turning the runner off for `src/` (C4) removes it, at **~100 %** of the excess

This note is hand-authored and unsealed, which is the repo norm: no sanctioned `context-io` writer was reachable from this hop.
It is the independent re-measure `ABC-147` G4 asked for, on the ratio side.

## Conditions

- **Tree and stack:** wave tip `304bbd9d` (uncapped, 7 workers; the ratio is per node, so the cap does not
  enter). Apple M3, Node v26.11.0, vitest 3.2.7, vite 7.3.6, AC power on all 150 processes.
- **Order:** the method was committed at `f24469bf` before the first graded run. Graded processes ran
  2026-10-11 11:36:21–11:38:53Z.
- **Load and heat:** load1 3.23–5.47 and `thermalpressurelevel` 1 or 2 before every process. 0 waits, 0 pairs
  over load1 8, 0 void, and 75 of 75 pairs usable.
- **QE's `ABC-144` count screen ran in parallel.** That is allowed: the readings are paired ratios (`L6`).
- **Digests:** E `f66389c97154ff65` and S `0f86f021e96f607d` (the same as `ABC-147`), P `5ae607b117d26ad2`
  (perft 197281). Equal on every pair.

## `D1`: vitest ÷ node, median (min–max), n = 5 per file

| workload | ratio | thermal before (pairs at 1 / at 2) |
|---|---|---|
| E | **5.009 (4.903–5.454)** | 3 / 2 |
| S | **5.106 (4.872–5.395)** | 3 / 2 |
| P (third, `perft.test.ts` startpos perft(4)) | **4.328 (4.127–4.498)** | 2 / 3 |

- **Stop rule:** the lowest E or S pair is 4.872, which is ≥ 1.67, so `D2` proceeds.
- `ABC-147` read 5.09 / 5.03. **This re-read agrees.**
- The factor reaches pure move generation (P). That weighs against `RISK-ABC147-02`'s two-file reading. It
  is not a bar.

## `D2`: share of the excess removed, (r_base − r_cand) ÷ (r_base − 1)

| cand | varied (vitest side only) | E ratio, share | S ratio, share | P ratio, share | explains |
|---|---|---|---|---|---|
| C1 | `test.server.sourcemap: false` | 4.949, 1.5 % | 5.049, 1.4 % | 4.212, 3.5 % | no |
| C2 | `pool: "forks"` | 5.133, −3.1 % | 5.128, −0.5 % | 4.228, 3.0 % | no |
| C3 | workload as one esbuild bundle, still under the runner | 0.802, 104.9 % | 0.812, 104.6 % | 0.858, 104.3 % | **yes** |
| C4 | `test.server.deps.external` over `src/*.ts` | 1.011, 99.7 % | 1.005, 99.9 % | 0.988, 100.4 % | **yes** |

- **Mechanism checks:** every pair passed its candidate's check (thread or process; accessor vs data
  export; bundle path).
- **C3 control** (plain node, bundle ÷ `src/`): E 0.894, S 0.880, P 0.910. E and S fall below the declared
  0.90.
  - So the bundle is ~10 % faster under node by itself, and C3 is reported with that caveat.
  - Against the bundle on both sides, C3 is still ≥ 100 %. The ruling does not change.
- **No pair of candidates was needed.**
- **Ungraded inspections, before the method:**
  - esbuild's output equals Node's type stripping on 37 of 37 files;
  - the runner's `src/` namespace object is null-prototype and in dictionary mode, with accessor exports.
