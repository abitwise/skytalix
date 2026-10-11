---
id: 20261011T095343Z-security-nfr-observation-abc144-window-a-frontier-readings-a898a14a
kind: observation
by: security-nfr
at: 2026-10-11T09:53:43Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0035
  - NFR-008
  - .grugops/context/design-ABC-144/notes/20261011T085525Z-architect-design-decision-abc144-quiet-window-measurement-plan-ff54a750.md
  - .grugops/context/design-ABC-144/probe/lane144.mjs
  - .grugops/context/secnfr-ABC-144-window-a/notes/raw-abc144-frontier-warm.tsv.txt
  - .grugops/context/secnfr-ABC-144-window-a/notes/raw-abc144-frontier-warm.summary.txt
supersedes:
---

# `ABC-144` Window A: the frontier, read at width 1 on the wave tip `af6ada41`. 54 runs, 0 harness errors

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
The readings are raw and unedited in the `raw-*` files beside this note.

## How it was run (as `…ff54a750` Window A pre-registered it)

- **Commit:** `af6ada416f2543bf5d9d7f32a3ea8e27fd340c47`, the wave tip. Six out-of-tree arms made with
  `git archive af6ada41 | tar -x`, `node_modules` symlinked to the main checkout.
- **Arms:** `B`, the twin `T`, and `K4 K3 K2 K1`. Each `Kk` is `B` plus the line `    maxWorkers: k,` after
  `    pool: "threads",`. Before any run, `/usr/bin/diff -rq -x node_modules B T` was clean, and each
  `Kk` differs from `B` by that one line (`raw-arm-diffs.txt`). `K4m1` was not run. The subtask fixed 6 arms.
- **Resolved workers, before any timed run** (`resolved-workers.mjs`, `raw-resolved-workers.jsonl.txt`):
  B 7, T 7, K4 4, K3 3, K2 2, K1 1. `isolate: true` in every arm. `VITEST_MAX_THREADS` unset.
- **Command:** `ARMS=<scratchpad>/win-a/arms CONDS=B,T,K4,K3,K2,K1 BASE=B TWIN=T ROUNDS=9 GAP=0
  TAG=abc144-frontier-warm node .grugops/context/design-ABC-144/probe/lane144.mjs`. The harness was not
  edited. It runs `npm test`, with a rotated order and round 0 discarded, so **n = 8**.
- **Window:** 2026-10-11 09:44:47Z → 09:52:17Z, about 7.5 min of runs. The Orchestrator held every other
  hop. Load was logged and never gated.
- **Once per window** (`raw-window-once.txt`): `lowpowermode 0`, node v26.11.0, vitest 3.2.7, Mac15,13
  Apple M3 (4 P + 4 E), AC power at 100 % charged, load1 2.40 at start.

## Counts

All 54 runs `ok`: exit 0, a fresh result file, 0 failed, 0 skipped, **53 files and 1680 tests in every run
of every arm**. Round 0 fixed each arm's counts, and the arms equal each other.

## Per arm (scored rounds 1–8, n = 8)

| arm | workers | CPU median (min–max) s | wall median (min–max) s | wall IQR s | CPU/wall | load1 before, median (range) | load1 after, median (range) | load1 > 8 before |
|---|---|---|---|---|---|---|---|---|
| B | 7 | 27.15 (26.78–28.54) | 6.28 (6.08–6.39) | 0.118 | 4.385 | 5.52 (3.43–6.36) | 6.24 (4.35–8.98) | 0/8 |
| T | 7 | 27.44 (26.99–27.90) | 6.38 (6.17–6.51) | 0.170 | 4.293 | 6.24 (4.15–8.98) | 6.42 (4.06–8.42) | 2/8 |
| K4 | 4 | 24.46 (23.82–24.92) | 6.57 (6.50–6.76) | 0.195 | 3.705 | 5.61 (4.06–8.42) | 5.84 (4.29–8.39) | 1/8 |
| K3 | 3 | 22.87 (22.09–23.19) | 7.22 (6.99–7.30) | 0.163 | 3.177 | 5.84 (4.29–7.05) | 5.74 (4.01–6.57) | 0/8 |
| K2 | 2 | 21.02 (20.77–21.14) | 8.23 (8.17–8.26) | 0.078 | 2.556 | 5.74 (4.01–8.39) | 5.60 (3.93–7.71) | 1/8 |
| K1 | 1 | 19.20 (19.09–19.42) | 14.68 (14.56–14.86) | 0.123 | 1.308 | 5.81 (3.93–7.71) | 5.29 (3.43–6.36) | 0/8 |

## Paired against B (the harness summary; R per `ADR-0035` d1, k = 2 at n = 8)

| arm | CPU delta median | % of B's CPU median | sign (+) | CPU interval | wall delta median | sign (+) | wall interval |
|---|---|---|---|---|---|---|---|
| T | +0.195 s | +0.72 % | 5/8 | [−0.640, +0.460], **R 0.640** | +0.105 s | 8/8 | [+0.010, +0.150], **R 0.150** |
| K4 | −2.895 s | **−10.66 %** | 0/8 | [−3.760, −2.410] | +0.355 s | 8/8 | [+0.250, +0.440] |
| K3 | −4.475 s | **−16.48 %** | 0/8 | [−5.180, −4.350] | +0.950 s | 8/8 | [+0.840, +0.980] |
| K2 | −6.165 s | **−22.71 %** | 0/8 | [−7.300, −6.010] | +1.945 s | 8/8 | [+1.880, +2.080] |
| K1 | −7.945 s | **−29.26 %** | 0/8 | [−9.120, −7.690] | +8.430 s | 8/8 | [+8.340, +8.520] |

- **The twin is admissible** under `ADR-0035` d1: its CPU median delta is 0.72 % of base (limit 1.5 %), and
  its sign is 5/8, which is at chance. Twin CPU R is 0.640 s, which is 2.36 % of base CPU.
- **R-1's load1 ≤ 8 clause:** no arm has more than half of its scored runs above 8. The highest is T at 2/8,
  so every arm's wall counts as a reading of the clause.
- K1's −29.26 % sits next to the recorded −30.1 % (`…28788b30`, 22 files, forks, v24.12.0). Its wall factor is
  ×2.34 against the recorded ×2.4.

## Heat and power

See the companion caveats note `…41ff7c05`. In short: AC power on all 54 runs. `CPU_Speed_Limit` is
**absent** from `pmset -g therm` on this machine, so the harness logged `none` 54 times. A supplementary
sampler read `com.apple.system.thermalpressurelevel`: 0 (nominal) until 09:50:48Z and 1 (moderate) from
09:51:03Z to the end.
