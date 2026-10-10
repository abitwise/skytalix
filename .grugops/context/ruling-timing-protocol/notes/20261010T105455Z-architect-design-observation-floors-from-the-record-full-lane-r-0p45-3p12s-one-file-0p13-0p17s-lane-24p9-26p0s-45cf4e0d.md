---
id: 20261010T105455Z-architect-design-observation-floors-from-the-record-full-lane-r-0p45-3p12s-one-file-0p13-0p17s-lane-24p9-26p0s-45cf4e0d
kind: observation
by: architect-design
at: 2026-10-10T10:54:55Z
verified_by:
confidence: high
refs:
  - QE-119-a
  - NFR-008
  - N8-LANE
  - ADR-0035
  - ADR-0019
  - ADR-0014
  - ADR-0017
  - ABC-119
  - ABC-127
  - ABC-128
  - ABC-084
  - ABC-082
  - ABC-079
  - ABC-122
  - ABC-110
  - ABC-111
  - ABC-108
  - .grugops/context/ruling-timing-protocol/probe/floors.mjs
  - .grugops/context/ruling-timing-protocol/probe/run.sh
  - .grugops/context/ruling-timing-protocol/probe/floors.out.txt
  - .grugops/context/qe-ABC-119/notes/20261010T103438Z-qe-e2e-observation-abc119-a2-closers-admissible-twice-cpu-straddles-e28c062a.md
  - .grugops/context/qe-ABC-119/notes/20261010T103438Z-qe-e2e-observation-abc119-gap-register-b300968a.md
  - .grugops/context/rule-abc119-a2/notes/20261010T100852Z-ba-pm-decision-9f278676.md
  - grugops/ABC-127-harder-puzzles:.grugops/context/secnfr-ABC-127/notes/20261010T102840Z-security-nfr-observation-abc127-a7-quiet-20-24s-n8lane-225ms-net-budget-edge-4pct-red-6a3b6274.md
  - .grugops/context/secnfr-ABC-079/notes/20260925T102000Z-security-nfr-decision-abc079-pass-with-risks-no-security-finding-nfr008-non-conforming-owner-word-owed-a5b722a4.md
  - .grugops/context/secnfr-ABC-084/notes/20261009T223620Z-security-nfr-observation-abc084-n8lane-met-85-210ms-net-a6-oracle-195ms-a5-false-red-under-load-7f3b2d61.md
supersedes:
---

# Timing floors from the record. The full-lane null spread R is 0.45–3.12 s CPU in October, and the touched file alone gives 0.13–0.17 s. The lane is 24.86–26.04 s CPU / 6.52–7.16 s wall on conforming base arms, and the reference Node is no longer installed

Hand-authored and unsealed: there is no sanctioned writer on this install, and `human_admission` is
`off`. **No lane was run.** Every number below is arithmetic over per-run files that other hops
already committed. To re-derive it from the repository root:

```
sh .grugops/context/ruling-timing-protocol/probe/run.sh <dir>
```

`<dir>` holds the two `ABC-127` TSVs, extracted with `git show` from
`grugops/ABC-127-harder-puzzles` (the command is in `run.sh`'s header). The output is
`floors.out.txt`. load1 at this hop was 15.5, then 9.6.

## R: what the probe computes

- For each identity twin, take the per-round deltas (round 0 discarded) and sort them.
- **R** is the larger magnitude of `x(k)` and `x(n+1−k)`: the distribution-free interval for the
  median.
- `k` is the largest index with coverage ≥ 92 %. At the standing n = 8 that is `k` = 2, at 93.0 %
  coverage.
- The probe also reports each treatment's interval and the per-arm medians.

## Floors, CPU (user + sys)

| reading | stack | load1 median | lane / file | null median, sign | **R** | treatment median (interval) |
|---|---|---|---|---|---|---|
| ABC-110 full, 09-19 | v24.12.0 | 4.5 | 14.94 s | −0.055, 3/8 | **0.22** | — |
| ABC-079 full, 09-25 | v24.12.0 | 4.5 | 22.29 s | +0.130, 6/8 | **0.31** | +3.625 (+3.48..+3.70) |
| ABC-122 full, 09-25 | v24.12.0 | 12.6 | 23.46 s | −0.020, 2/8 | **0.12** | +0.670 (+0.45..+0.88) |
| ABC-082 full, 10-09, n = 14 | v26.11.0 | 17.2 | 30.86 s | +0.035, 7/14 | **0.45** | +0.870 (+0.65..+1.23) |
| ABC-084 full run 1, 10-09 | v26.11.0 | 7.1 | 25.13 s | +0.155, 6/10 | **0.99** | +0.245 (−1.28..+2.35) |
| ABC-084 full run 2 (null +1.66 %, inadmissible) | v26.11.0 | 7.6 | 25.35 s | +0.415, 6/8 | **1.58** | +0.460 |
| ABC-084 full run 3, 10-09 | v26.11.0 | 7.5 | 26.08 s | +0.370, 6/8 | **1.03** | +0.370 (−0.48..+1.65) |
| ABC-128 full, 10-10, n = 7 (null +1.76 %, inadmissible) | v26.11.0 | not logged | 34.59 s | +0.620, 6/7 | **2.89** | +0.590 |
| ABC-127 full, 10-10 | v26.11.0 | 26.5 | 35.21 s | −0.475, 3/8 | **0.76** | +0.225 (−1.49..+0.89) |
| ABC-119 full set A, 10-10 | v26.11.0 | 22.5 | 32.77 s | −0.110, 5/10 | **3.12** | −0.715 (−1.45..+1.21) |
| ABC-119 full set B, 10-10 | v26.11.0 | 29.7 | 34.40 s | −0.065, 5/10 | **1.72** | +0.725 (−0.83..+2.63) |
| ABC-128 one file, 10-10 | v26.11.0 | not logged | 2.06 s | +0.030, 7/9 | **0.17** | +0.030 (−0.16..+0.12) |
| ABC-127 one file, 10-10, n = 12 | v26.11.0 | 20.1 | 1.54 s | −0.025, 5/12 | **0.13** | +0.045 (−0.10..+0.15) |
| ABC-084 file vs one-assertion empty file (no twin) | v26.11.0 | 7.9 | 1.29 s | — | — | **+0.280 (+0.26..+0.30)** |

**Wall R, for the same sets:**
- Full lane: 0.07–0.50 s in most sets. It is 1.19 s at `ABC-127`, and **3.25 s and 4.39 s at `ABC-119`**.
- One file: 0.27 s (`ABC-127`).

### What the table shows
- **In October, no full-lane set resolves 0.30 s CPU.** Only `ABC-082` (R 0.45, n = 14) resolves
  650 ms, and six of seven do not.
- **Both one-file readings resolve 0.30 s at load1 ~20.**
- **The one-file instrument measures the cost directly.** `ABC-084`'s file-against-an-empty-file arm
  has a ±0.02 s interval.
- **September at load1 ~4.5 resolved 0.12–0.31 s on the full lane.** The floor followed load and lane
  size; it did not follow a defect.
- **At `ABC-119`, the full-lane wall R (3.25 s and 4.39 s) is as large as the +3.1 s spawn drift its
  wall bound was written to catch.** The counts caught that drift instead: 0 `[CLI_DEEP]` lines and
  0 spawned children in 67 runs.

## The `NFR-008` total, from conforming base arms

The admissibility test is: null median ≤ 1.5 % and sign at chance.

| reading | stack | files / tests | base CPU | base wall | null |
|---|---|---|---|---|---|
| ABC-079 B, 09-25 | v24.12.0 (reference) | 42 / 1361 | **18.61 s** | 4.89 s | +0.59 %, 6/8 |
| ABC-079 A, 09-25 | v24.12.0 | 43 / 1392 | **22.29 s** | 5.34 s | same set |
| ABC-122 B / A, 09-25 | v24.12.0 | 45 / 1444, 47 / 1446 | **22.85 / 23.46 s** | 5.39 / 5.46 s | −0.09 %, 2/8 |
| ABC-084 run 1 B, 10-09 | v26.11.0 | 49 / 1530 | **24.86 s** | 6.52 s | +0.62 %, 6/10 |
| ABC-084 run 3 B, 10-09 | v26.11.0 | 49 / 1530 | **26.04 s** | 7.16 s | +1.41 %, 6/8 |
| ABC-127 B, 10-10 (load1 median 26.5) | v26.11.0 | 50 / 1540 | 35.29 s | 14.07 s | −1.35 %, 3/8 |
| ABC-119 base, sets A and B (load1 median 22–30) | v26.11.0 | 50 / 1540 | 33.03–33.87 s | 9.50–9.83 s | −0.32 % / −0.20 %, 5/10 |

- **CPU ≤ 15 s has been exceeded on the reference stack since 2026-09-25.** Security/NFR wrote
  "`ADR-0019` trigger (a) HAS FIRED" at `ABC-079` (`…a5b722a4`).
- **The owner accepted that ticket's charge** (`plans/board.md`, 2026-09-25, *"3. accept"*). No level
  word followed.
- The catalog's last `NFR-008` section is still the 2026-09-19 "MET by 60 ms".
- **The wall bound:** 24.86 s ÷ 8 cores = 3.11 s. 24.86 ÷ 5.29 (the best CPU/wall ratio on record) =
  4.70 s. With CPU deflated by the row's +22 % thermal fence, 20.4 ÷ 5.29 = 3.85 s. **Every route lands
  over 3 s.**

## The stack

- At this hop, `node --version` printed `v26.11.0`.
- Two binaries are on `PATH`, `/opt/homebrew/bin/node` and `/usr/local/bin/node`. Homebrew lists only
  `node@26`. **v24.12.0 is not installed.**
- The first record on v26.11.0 is `ABC-082` (2026-10-09). Every record on or before 2026-09-25 is on
  v24.12.0, 230 mentions in all.
- **Whether Node accounts for part of the 22.3 → 24.9 s step is `UNKNOWN - verify`.** File growth alone
  projects ~19 s from `ADR-0019`'s 14.94 s, by +11 files × ~0.37 s.

## The opt-in variables

`grep -rhoE 'process\.env\.[A-Z_]+_DEEP' src | sort -u` at `2320269b` prints **seven** names:
`CLI_DEEP`, `ENGINE_DEEP`, `INPUT_DEEP`, `PERFT_DEEP`, `PUZZLE_DEEP`, `SEARCH_DEEP`, `ZOBRIST_DEEP`.
`PLIES_DEEP` and `RUN_DEEP` are local constants and are not variables. The `NFR-008` row's
`Applies to` cell names only `PERFT_DEEP`.

## A command checked

`npx vitest related --run src/line-input.ts` ran **2 files / 96 tests** (`line-input.test.ts`,
`cli.test.ts`) and exited 0. This checked that the command works. It is not a timing reading.
