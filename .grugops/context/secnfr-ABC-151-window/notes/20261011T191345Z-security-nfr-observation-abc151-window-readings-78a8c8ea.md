---
id: 20261011T191345Z-security-nfr-observation-abc151-window-readings-78a8c8ea
kind: observation
by: security-nfr
at: 2026-10-11T19:13:45Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ADR-0040
  - NFR-008
  - QE-151-d
  - .grugops/context/secnfr-ABC-151-window/probe/abc151-warm.tsv
  - .grugops/context/secnfr-ABC-151-window/probe/abc151-cooled.tsv
  - .grugops/context/secnfr-ABC-151-window/probe/abc151-lanes.tsv
  - .grugops/context/secnfr-ABC-151-window/probe/readout.out.txt
  - .grugops/context/qe-ABC-151/notes/20261011T164107Z-qe-e2e-observation-abc151-readings-6774ed96.md
supersedes:
---

# `ABC-151` window: the readings. Warm and cooled paired runs (n = 8 per arm), and the opt-in lanes once at head

This note is hand-authored and unsealed. It holds readings only. The grades are in `…fcf66342`.

**Reference stack:** Apple M3 Mac15,13, 4 P + 4 E cores, Darwin 25.5.0, Node v26.11.0, vitest 3.2.7, `lowpowermode 0`, **on battery** (discharging: 98 % at the first graded run, 78 % when the lanes started).

## Paired runs (`lane144b.mjs`; CONDS B,H,T; rotated; ROUNDS 9; round 0 discarded)

Medians, n = 8 each. load1 is the median before each run.

| state | arm | CPU s | wall s (range) | CPU ÷ wall | load1 | thermal reads (before / after) |
|---|---|---|---|---|---|---|
| warm (GAP 0), 17:18:36Z–17:22:25Z | B | 25.86 | 7.87 (7.62–8.06) | 3.296 | 5.15 | 0:6 1:2 / 0:6 1:2 |
| | H | 23.08 | 9.04 (8.96–10.02) | 2.554 | 4.89 | 0:6 1:2 / 0:5 1:3 |
| | T | 25.88 | 7.63 (7.49–8.29) | 3.345 | 4.89 | 0:5 1:3 / 0:5 1:3 |
| cooled (90 s idle before each), 17:39:39Z–18:22:27Z | B | 25.16 | 7.64 (7.15–7.98) | 3.295 | 3.51 | 0:8 / 0:8 |
| | H | 23.66 | 9.25 (8.91–10.46) | 2.541 | 3.45 | 0:8 / 0:8 |
| | T | 25.00 | 7.51 (7.02–7.87) | 3.296 | 3.53 | 0:8 / 0:8 |

**Paired deltas** (k = 2 of n = 8, `ADR-0035` d1):

| state | pair | CPU median | CPU interval | wall median | wall interval | sign (+) CPU / wall |
|---|---|---|---|---|---|---|
| warm | H − B | −2.345 s (**−9.07 %**) | [−2.910, −2.020] s = [−11.25 %, −7.81 %] | **+1.325 s** | [+1.140, +1.490] | 0/8 / 8/8 |
| warm | T − B | +0.270 s (+1.04 %) | [−0.560, +0.680] | −0.170 s | [−0.230, +0.220] | 5/8 / 3/8 |
| cooled | H − B | −1.080 s (**−4.29 %**) | [−2.430, −0.240] s = [−9.66 %, −0.95 %] | **+1.665 s** | [+1.340, +1.850] | 0/8 / 8/8 |
| cooled | T − B | −0.115 s (−0.46 %) | [−0.420, +0.490] | −0.080 s | [−0.130, +0.070] | 3/8 / 3/8 |

- **Ratio of medians, H ÷ B:** CPU 0.892 warm and 0.940 cooled; wall 1.149 warm and 1.209 cooled.
- **Effective parallelism:** H runs at about 2.55 CPU-s per wall-s against B's 3.30. 2 workers do not reach 2.0, because the main process and `src/cli.test.ts`'s children add their own share.
- **Counts:** every run had 56 files, 1740 tests, 0 failed and 0 skipped, at B, H and T. A6's "equals base" holds on all 135 harness runs.
  - Every H run in this window was green: 8 + 1 warm, 27 `A5`, and 8 + 1 cooled.
  - That corroborates QE's 20-run screen, but it is not a replacement for it. The harness asserts 0 failed, which implies every `*.nfr` file passed, but it does not log them by name.
- **load1 > 8 before a scored run:** 0 of 24 warm runs, and 1 of 24 cooled runs (T round 1, at 15.70, during the foreign burst in `…2983f397`). R-1's clause is not engaged.
- **The cooled CPU interval is wider** ([−9.66 %, −0.95 %]). Rounds 1–2 ran under foreign bursts (foreign CPU up to 214 % of one core at 17:47:19Z, 130 % at 17:52:20Z). It is still wholly below 0.

## The opt-in lanes (`QE-151-d`, window step 5), once each, at head, back to back

Each lane ran with its variable over the **whole tree** (`npx vitest run`), which is the configuration QE compared for equal collection.

| lane | tree | exit | files | tests (passed / failed / skipped) | QE's base count | wall s | CPU s | CPU ÷ wall | level before → after |
|---|---|---|---|---|---|---|---|---|---|
| `PERFT_DEEP=1` | H | **0** | 56 | 1748 (1748 / 0 / 0) | 1748 | 41.32 | 63.23 | 1.53 | 0 → 0 |
| `INPUT_DEEP=1` + `--expose-gc` | H | **0** | 56 | 1744 (1744 / 0 / 0) | 1744 | 9.68 | 24.81 | 2.56 | 0 → 0 |
| `ZOBRIST_DEEP=1` | H | **0** | 56 | 1741 (1741 / 0 / 0) | 1741 | 44.29 | 63.93 | 1.44 | 0 → 0 |
| `PUZZLE_DEEP=1` | H | **0** | 56 | 1746 (1746 / 0 / 0) | 1746 | 36.33 | 55.81 | 1.54 | 0 → 0 |
| `CLI_DEEP=1` | H | **0** | 56 | 1746 (1746 / 0 / 0) | 1746 | 16.20 | 32.12 | 1.98 | 0 → 0 |
| `ENGINE_DEEP=1` | H | **0** | 56 | 1761 (1761 / 0 / 0) | 1761 | **330.80** | 612.27 | 1.85 | 0 → 1 |
| `SEARCH_DEEP=1` | H | **0** | 56 | 1815 (1815 / 0 / 0) | 1815 | 1182.25 | 1511.24 | 1.28 | 1 → 0 |
| `LADDER_DEEP=1` | H | **0** | 56 | 1745 (1745 / 0 / 0) | 1745 | 1007.67 | 1022.25 | 1.01 | 0 → 1 |
| `ENGINE_DEEP=1` (for addendum 2's projection) | B | **0** | 56 | 1761 (1761 / 0 / 0) | 1761 | **317.80** | 595.69 | 1.87 | 1 → 1 |

- **All 8 lanes exit 0 at head, and every count equals QE's base collection.** `LADDER_DEEP=verdict` was not run; it is `ABC-146`'s.
- **`ENGINE_DEEP`, k = 2 against k = 3: H 330.80 s, B 317.80 s (+13.0 s, +4.1 %).**
  - These are single runs. B ran last, about 42 min later (18:24:55Z → 19:06:56Z), after `LADDER_DEEP` and starting at level 1. The order is not rotated, so this is descriptive only.
  - Addendum 2 projected this lane as the most likely to lengthen. It did, by about 4 %.
- **The walls are not comparable with Window B's lane walls.** Window B ran explicit file sets (for example, `ENGINE_DEEP` over 4 files); these runs cover the whole tree.
- The foreign process during the lanes averaged 22 % of one core, with a maximum of 241 % (`probe/foreign-cpu.tsv`).
