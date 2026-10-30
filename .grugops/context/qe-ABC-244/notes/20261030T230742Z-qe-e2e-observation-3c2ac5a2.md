---
id: 20261030T230742Z-qe-e2e-observation-3c2ac5a2
kind: observation
by: qe-e2e
at: 2026-10-30T23:07:42Z
verified_by: 
confidence: high: ALONE, wait-clear by PID, n = 8 (A8) and 3 per arm (A9), admissible; G8 is one window
refs:
  - qe-ABC-244
  - ABC-244
  - ADR-0046
  - ADR-0035
  - NFR-008
  - N8-LANE
  - EPIC-010
  - ABC-230
  - ABC-241
  - R1
  - R2
  - R3
  - QE-229-a
  - se-ABC-244/20261030T224640Z-software-engineer-decision-f1e84d64
  - se-ABC-244/20261030T224640Z-software-engineer-observation-497faf89
  - se-ABC-244/20261030T224640Z-software-engineer-observation-1b63ff56
  - se-ABC-244/20261030T224640Z-software-engineer-observation-ee17f704
  - grugops/ABC-244
  - 25282ad4
  - d59e3194
  - grugops/qe-ABC-244
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:5ab717ec0c6d41b172e6ca79078a509d9717b54afcba9e57d3870782b6ae9b9f
---

# `ABC-244` A8 and A9 as run, ALONE: `N8-LANE` MET (H−B CPU −1.145 s) and `G8` H 9.25 s (B 9.69 s), `NFR-008` MET and under the 9.4 s design target

Host: 24 CPUs, Linux. Clear at spawn (0 vitest, 0 cutechess-cli). This hop ran nothing else during either window.

## A8 `N8-LANE`, the two-file set `src/cli.test.ts` + `src/uci-session.test.ts` (ADR-0035 D2, `lane.mjs`)
- Arms B (`d59e3194`), T (`cp -R B`, `diff -r` clean), H (`25282ad4`); one symlinked `node_modules` shared (the D2
  condition, stated). `node_modules/.bin/vitest run <set>`, heap 128 (the SUITE row), `/usr/bin/time -p`, CPU = user + sys.
- 9 rounds, order rotated, round 0 discarded: n = 8, k = 2. 27/27 runs ok, 308 tests in every run.
- One wait-clear before the window (23:01:09Z, load1 0.81, Tctl 38.1 °C). Logged, never gated: load1 1.30–2.10 before the
  scored runs; foreign vitest 0 on every run; Tctl rose to 74 °C inside the window.

| arm | CPU median | wall median |
|---|---:|---:|
| B | 11.295 s | 4.780 s |
| T | 11.170 s | 4.740 s |
| H | 10.125 s | 4.060 s |

- Twin T−B CPU: median −0.145 s (1.5 % of B = 0.169 s), sign +1/−7 (p 0.070), interval [−0.250, −0.030], **R 0.250 s**.
  Admissible; resolves 0.650 s.
- **H−B CPU: median −1.145 s, interval [−1.220, −1.070], sign 0/−8. STATE at 650 ms CPU: MET.**
- H−B wall: median −0.725 s, interval [−0.780, −0.660] (twin wall R 0.100 s). This is the narrow-set saving.
- `F`: provisional 16 % of B CPU = 1.807 s (`UNKNOWN - verify`); "650 ms ≥ F" prints false. This is the set's first
  admissible reading, so its R (0.250 s) is the candidate `F` for the set (ADR-0035 D3 amendment). Security/NFR records it.

## A9 `G8`, `npm test` as spelled, b h h b b h (`g8.mjs`)
Wait-clear before every run: 0 foreign vitest (waited by PID), 0 cutechess-cli, load1 ≤ 2.0, Tctl ≤ 60 °C.

| run | arm | wall | CPU | vitest Duration | load1 before / after | Tctl before | tests |
|---|---|---:|---:|---:|---|---:|---|
| 1 | base | 9.90 s | 31.39 s | 9.59 s | 1.76 / 1.94 | 41.4 | 2 322/2 322 |
| 2 | head | 9.34 s | 29.89 s | 9.00 s | 1.58 / 1.94 | 40.5 | 2 322/2 322 |
| 3 | head | 9.25 s | 30.01 s | 8.92 s | 1.51 / 1.67 | 40.3 | 2 322/2 322 |
| 4 | base | 9.69 s | 30.81 s | 9.35 s | 1.30 / 1.41 | 39.8 | 2 322/2 322 |
| 5 | base | 9.59 s | 30.54 s | 9.25 s | 1.10 / 1.31 | 39.6 | 2 322/2 322 |
| 6 | head | 8.81 s | 29.08 s | 8.49 s | 1.02 / 1.25 | 39.6 | 2 322/2 322 |

- Admissible: all rc 0, load1 ≤ 8 before and after every run (max 1.94). No re-run was taken.
- **H median wall 9.25 s → `NFR-008` (≤ 10 s) MET.** B median 9.69 s. **H−B −0.44 s.**
- **Design target ≤ 9.4 s: MET** (by 0.15 s). The tranche-2 trigger at this gate does not fire. The > 10 s owner route
  does not fire.
- CPU (from the parent's child-CPU counters): B median 30.81 s, H 29.89 s, H−B −0.92 s.
- Per-file median test time, H−B: `src/cli.test.ts` −609 ms (1 224 → 615), `src/uci-session.test.ts` −243 ms
  (1 965 → 1 722); every other file within ±31 ms (`raw/g8/g8-perfile.txt`).
- The SE-244-c estimate (about 0.71 + 0.27 s of in-thread time from U1 alone) lands as −0.85 s of per-file test time and
  −0.44 s of lane wall.
