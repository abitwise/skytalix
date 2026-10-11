---
id: 20261011T124750Z-security-nfr-observation-abc144-window-b-readings-bfdcf3b3
kind: observation
by: security-nfr
at: 2026-10-11T12:47:50Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0035
  - NFR-008
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-warm.tsv
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-warm.summary.txt
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-cooled.tsv
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-cooled.summary.txt
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-cli-narrow.tsv
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-cli-narrow.summary.txt
  - .grugops/context/secnfr-ABC-144-window-b/probe/abc144-deep-walls.tsv
  - .grugops/context/secnfr-ABC-144-window-b/probe/readout.out.txt
supersedes:
---

# `ABC-144` Window B: the readings. Base `5ed308a8` vs head `5ddf150e`, width 1, 81 runs, 0 harness errors

This note is hand-authored and unsealed. The raw `.tsv`, the harness summaries and the readout are in
`../probe/`, unedited. The method and its limits are in `…866dc5af`, heat is in `…1ff56629`, and the
grades are in `…e451fa31`.

## Full lane (`npm test`), per arm, scored rounds 1–8 (n = 8)

| state | arm | workers | CPU median (min–max) s | wall median (min–max) s | wall IQR s | CPU ÷ wall | load1 before, median (range) | load1 > 8 before | files / tests |
|---|---|---|---|---|---|---|---|---|---|
| warm | B | 7 | 28.35 (27.68–29.15) | 6.66 (6.51–6.86) | 0.230 | 4.258 | 7.21 (3.42–10.84) | 4/8 | 55 / 1728 |
| warm | H | 3 | 24.01 (22.81–25.50) | 7.54 (7.25–8.08) | 0.267 | 3.165 | 6.63 (3.54–11.10) | 3/8 | 55 / 1729 |
| warm | T | 7 | 28.48 (27.64–28.87) | 6.68 (6.42–6.89) | 0.190 | 4.239 | 5.82 (3.49–10.43) | 3/8 | 55 / 1728 |
| cooled | B | 7 | 26.49 (26.38–26.66) | 6.43 (6.20–6.53) | 0.170 | 4.129 | 2.55 (2.16–3.99) | 0/8 | 55 / 1728 |
| cooled | H | 3 | 22.26 (22.15–22.52) | 7.08 (6.95–**12.04**) | 0.148 | 3.147 | 2.75 (2.29–4.09) | 0/8 | 55 / 1729 |
| cooled | T | 7 | 26.62 (26.43–27.67) | 6.33 (6.19–6.69) | 0.100 | 4.200 | 2.92 (2.27–3.28) | 0/8 | 55 / 1728 |

The harness summary prints T's cooled CPU median as 26.63; the readout prints 26.62. That is
floating-point rounding of the same two middle values.

## Paired against B (R per `ADR-0035` d1, k = 2 at n = 8)

| state | pair | CPU median | % of B CPU | sign (+) | CPU interval | wall median | sign (+) | wall interval |
|---|---|---|---|---|---|---|---|---|
| warm | H−B | −4.550 s | **−16.05 %** | 0/8 | [−4.810, −4.140] = [−16.96 %, −14.60 %] | **+0.860 s** | 8/8 | [+0.740, +0.950] |
| warm | T−B | −0.025 s | −0.09 % | 3/8 | [−0.280, +0.060], **R 0.280** | −0.025 s | 4/8 | [−0.090, +0.180], **R 0.180** |
| cooled | H−B | −4.200 s | **−15.85 %** | 0/8 | [−4.390, −4.090] = [−16.57 %, −15.44 %] | **+0.660 s** | 8/8 | [+0.600, +0.940] |
| cooled | T−B | +0.170 s | +0.64 % | 6/8 | [−0.030, +0.870], **R 0.870** | −0.050 s | 3/8 | [−0.220, +0.140], **R 0.220** |

- Ratio of medians H ÷ B: CPU **0.847 warm, 0.840 cooled**; wall 1.133 warm, 1.102 cooled.
- Cooled ÷ warm wall factor: **H 0.939**, B 0.966. Cooled ÷ warm CPU: H 0.927, B 0.934.
- Round 0 (discarded): warm B 26.27 / 6.72, H 22.32 / 7.12, T 27.49 / 6.29; cooled B 26.69 / 6.43,
  H 22.19 / 7.08, T 26.73 / 6.23 (CPU s / wall s).

## `src/cli.test.ts` narrow set (`npx vitest run src/cli.test.ts`, back to back, n = 8)

| arm | CPU median (min–max) s | wall median s | CPU ÷ wall | load1 median | files / tests |
|---|---|---|---|---|---|
| B | 5.94 (5.88–6.01) | 4.04 | 1.469 | 3.17 | 1 / 67 |
| H | 5.68 (5.63–5.73) | 4.02 | 1.409 | 3.12 | 1 / 68 |
| T | 5.93 (5.86–6.05) | 4.04 | 1.472 | 2.94 | 1 / 67 |

- H−B CPU **−0.255 s** (−4.29 %), sign 0/8, interval [−0.320, −0.200].
- T−B CPU −0.030 s (−0.51 %), sign 3/8, **R 0.070 s**. T−B wall R 0.050 s.

## Power, foreign load, heat column

- AC power before and after all 81 runs.
- `foreign_vitest` 0 before and after all 81 runs.
- `speed_limit` `none` on all 81 runs. That is the absent `CPU_Speed_Limit` field, not a reading.
- Thermal pressure: see `…1ff56629`.

## `*_DEEP` opt-in lanes (`A6`: wall reported, not bounded). One run per tree, after the window, width 1

Raw: `../probe/abc144-deep-walls.tsv`, from `../probe/deep-walls.sh`, with the lane sets of QE's
`run-lanes.sh`. These are **single runs**: no rounds, no twin, no R. They are reported and not bounded,
as `A6` asks. A difference of a few percent between B and H is inside what one run can resolve.

| lane | files | B wall s (CPU s) | H wall s (CPU s) | H−B wall | exit B / H | tests B / H | load1 before B / H | thermal before→after |
|---|---|---|---|---|---|---|---|---|
| `PERFT_DEEP` | 1 | 37.22 (37.78) | 37.38 (37.61) | +0.16 | 0 / 0 | 32 / 32 | 3.72 / 3.67 | 0→0 both |
| `INPUT_DEEP` (+ `--expose-gc`) | 1 | 0.77 (1.25) | 0.60 (0.94) | −0.17 | 0 / 0 | 34 / 34 | 3.54 / 3.54 | 0→0 both |
| `ZOBRIST_DEEP` | 1 | 36.03 (36.61) | 35.98 (36.22) | −0.05 | 0 / 0 | 33 / 33 | 3.54 / 3.72 | 0→0 both |
| `PUZZLE_DEEP` | 1 | 27.82 (28.48) | 28.81 (29.22) | +0.99 | 0 / 0 | 18 / 18 | 3.50 / 3.67 | 0→0 both |
| `CLI_DEEP` | 1 | 6.90 (7.71) | 6.75 (7.47) | −0.15 | 0 / 0 | 7 / 7 | 3.20 / 3.19 | 0→0 both |
| `ENGINE_DEEP` | 4 | 293.97 (542.66) | 283.01 (531.39) | −10.96 | 0 / 0 | 121 / 121 | 2.81 / 3.47 | 0→0 both |
| `SEARCH_DEEP` | 5 | 950.69 (1249.33) | 968.22 (1256.76) | +17.53 (+1.8 %) | 0 / 0 | 201 / 201 | 2.96 / 3.33 | 0→0 both |
| `LADDER_DEEP=1` | 1 | **not timed** | **not timed** | — | — | — | — | — |
| `LADDER_DEEP=verdict` | 1 | **not run** (~44 h; `ABC-146`'s) | — | — | — | — | — | — |

- **Every timed lane exits 0 at both trees, with equal test counts.** That agrees with QE's `A6` read at head.
- **The cap does not visibly slow the two multi-file lanes.** `ENGINE_DEEP` (4 files) read −3.7 % at H, and
  `SEARCH_DEEP` (5 files) read +1.8 %. Both are single runs. Their CPU ÷ wall is about 1.3–1.9, so neither
  lane fills even 3 workers for long.
- **`LADDER_DEEP=1` was started at B and stopped after ~11 min**, by this hop's choice. It is one file on
  one worker under any cap (`ADR-0040` addendum, d5 narrowed), so only `tinypool`'s idle boots differ. It
  runs ~14 min per tree (848 s on record, loaded). Timing both would have held the width-1 window for
  about 28 more minutes, for a wall that is "reported, not bounded". QE's head run exited 0 (`…f287edc5`).
  **Its wall at head is `UNKNOWN - verify`**, and it is owed to whoever next runs that lane.
- These runs ran 12:46Z–13:43Z, after the 81-run window, still with no other hop. Every before and after read of
  the thermal level was 0.
