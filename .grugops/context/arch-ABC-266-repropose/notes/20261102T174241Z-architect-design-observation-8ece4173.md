---
id: 20261102T174241Z-architect-design-observation-8ece4173
kind: observation
by: architect-design
at: 2026-11-02T17:42:41Z
verified_by: 
confidence: high for depths, Q, nodes and load as measured (scratch prototype, 20 positions); the (c)-artifact reading and Q's ceiling are judgement
refs:
  - ABC-266
  - arch-ABC-266-repropose
  - grugops/arch-ABC-266-repropose
  - 6413f91f
  - 6e749801
  - 7f110a31
  - arch-ABC-266-repropose/20261102T173019Z-architect-design-decision-3c920b97
  - ADR-0062
  - ADR-0058
  - ADR-0057
  - ADR-0044
  - grugops/ABC-265-fix
  - 28ad3a8d
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-decision-9f9aeb87
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-observation-cc1de664
  - ABC-257
  - EPIC-011
supersedes: 
seal: sha256:9d7f9917f6550301c579905d29b6590d296314482866d2f4ec8cacac146a9808
---

# arch-ABC-266-repropose probe, measured. At 100 ms no candidate passes the sealed rule cleanly: plain pools stay in lockstep at T1's depth. Skip + deeper + perturbation adds one ply of median played depth (T4SDP, T12SDP), but each read loses 1.7–2 positions of 20 on the quality proxy. With the deeper-entry rule, nominal depth rises even at Threads 1

Architect/Design, task `arch-ABC-266-repropose`. Graded by `raw/probe/analyse.mjs` against the pre-registration `…decision-3c920b97` (commit `7f110a31`), sealed before any corpus run. Node v26.12.1, host `oeselg-dev`. Every run was `flock host-test.lock timeout 300 …`. No process was killed, and nothing is left running.

## Runs (UTC 2026-11-02)
| run | what | window | host s |
|---|---|---|---|
| ident + smoke | T1 identity (3/3 equal) and warm-up-board smoke | 17:28:35–17:28:49 | ≈ 14 |
| R0 | T1 reference, 5 000 ms × 20 (median depth 11.5) | 17:30:31–17:32:16 | 105 |
| R1 | P12 at 100 ms, 3 passes, 9 cells | 17:32:16–17:33:21 | 65 |
| R2 | P4 (`taskset -c 0-3`) at 100 ms, 3 passes, 4 cells | 17:33:21–17:33:52 | 31 |
| R5a | confirmation of T4SDP [T1, T4SDP], pinned, 100 ms, 3 passes | 17:34:45–17:35:03 | 18 |
| R2b | the one allowed re-run of R2 (its T4 and T4SD were VOID-LOAD) | 17:35:54–17:36:25 | 31 |
| R3 | P12 at 1 000 ms, 1 pass (info) | 17:36:25–17:39:35 | 190 |
| R4 | P4 at 1 000 ms, 1 pass (info) | 17:39:35–17:41:00 | 85 |

Total ≈ 539 s (≈ 9 min) of the 20-min allowance; every run under 5 min.

## 100 ms (the rule). D = median played depth over 60 gos; Q = proxy, of 20; Δ against the same run's T1
| run | cell | D (mean) | Q | ΔD | ΔQ | outcome |
|---|---|---|---|---|---|---|
| R1 | T1 | 7 (7.38) | 18 | — | — | baseline |
| R1 | T1D (info) | 7 (7.88) | 17 | 0 | −1 | info |
| R1 | T12 (control) | 7 (7.23) | 18.33 | 0 | +0.33 | control; lockstep 57/60 |
| R1 | T12S | 7 (7.63) | 17.67 | 0 | −0.33 | MISS |
| R1 | T12D | 7 (7.75) | 16.67 | 0 | −1.33 | MISS |
| R1 | T12P | 7 (7.60) | 17 | 0 | −1 | MISS |
| R1 | T12SD | 7 (8.62) | 17 | 0 | −1 | MISS |
| R1 | T12SDP | **8** (9.02) | 16 | +1 | **−2** | MISS (quality guard: needs ΔQ > −2) |
| R1 | T4SD | 7 (8.42) | 16 | 0 | −2 | MISS |
| R2 | T1 | 7 (7.40) | 18 | — | — | LOADED |
| R2 | T4 | 7 (7.52) | 18 | 0 | 0 | VOID-LOAD |
| R2 | T4SD | 7 (8.48) | 17.33 | 0 | −0.67 | VOID-LOAD |
| R2 | T4SDP | **8** (8.80) | 16.33 | +1 | −1.67 | **PASS (SHARED)** → R5 |
| R5a | T1 / T4SDP | 7 (7.40) / **8** (8.77) | 18 / 16.33 | +1 | −1.67 | **PASS (SHARED)**: R5 LOADED, so not a WIN |
| R2b | T1 | 7 (7.40) | 18 | — | — | not loaded |
| R2b | T4 | 7 (7.42) | 18 | 0 | 0 | MISS (lockstep 60/60) |
| R2b | T4SD | 7 (8.52) | 16.67 | 0 | −1.33 | MISS |
| R2b | T4SDP (info; its R2 status stands) | 8 (8.83) | 16 | +1 | −2 | would miss the guard |

- Per-worker rate: T12 0.73–0.75 of T1 (all T12 cells), T4 pinned 0.97–0.99.
- Lockstep (every worker the same completed depth): T12 57/60, T12D 56/60, T12P 48/60, T4 54–60/60; every S form 0/60.

## Load (the pre-registered test)
| run | foreign cores | blocks > 0.8 | median block wall | LOADED | Tctl start → end °C |
|---|---|---|---|---|---|
| R0 | 0.36 | — | — | (ref) | → 74.4 |
| R1 | 0.448 | 5/60 | 0.95 s | no | 49.5 → 75.8 |
| R2 | 0.642 | 18/60 | 0.43 s | **yes (c)** | 54.9 → 91.6 |
| R5a | 0.565 | 14/60 | 0.22 s | **yes (c)** | 44.4 → 80.1 |
| R2b | 0.488 | 10/60 | 0.43 s | no | 42 → 87.9 |
| R3 | 0.425 | 0/20 | ≈ 9 s | no | 52 → 85.3 |
| R4 | 0.443 | 0/20 | ≈ 4 s | no | 59.8 → 96.5 |

No foreign vitest or `cutechess-cli` in any run. The only hot foreign process was the owner's `abtop`, at 21–22 %. **Observation, not a re-grade:** criterion (c) tracks block length, not load. Phase foreign cores stay at 0.43–0.64 in every run, yet the share of blocks over 0.8 rises as blocks shorten (0/20 at 4–9 s, 5/60 at 0.95 s, 10–18/60 at 0.43 s, 14/60 at 0.22 s). That fits `/proc/stat`'s 10 ms jiffies summed over 24 CPUs: up to about 0.24 s of error over a 0.2–0.4 s block. The rule was sealed with (c) as written and is read that way. A future pre-registration should apply (c) only to windows of at least 1 s.

## 1 000 ms (info only, one pass, 20 gos a cell)
| cell | D (mean) | Q | | cell (P4) | D (mean) | Q |
|---|---|---|---|---|---|---|
| T1 | 10 (9.85) | 17 | | T1 | 10 (9.85) | 17 |
| T1D | 10 (11.55) | 16 | | T4 | 10 (9.95) | 17 |
| T12 | 10 (9.90) | 16 | | T4SD | 10 (12.70) | 16 |
| T12S | 10 (10.30) | 17 | | T4SDP | 10.5 (12.55) | 15 |
| T12D | 10 (11.30) | 16 | | | | |
| T12P | 10 (10.30) | 17 | | | | |
| T12SD | 10 (12.60) | 15 | | | | |
| T12SDP | 11 (12.80) | 18 | | | | |
| T4SD | 10 (12.55) | 15 | | | | |

## What the numbers say (reading, not a rule)
- **Plain Lazy SMP adds nothing here.** T4 and T12 replicate D12: the same median, in lockstep, and Q equal to T1.
- **Every depth gain needs the deeper-entry rule (D) together with skip blocks (S).** With D, the reported depth inflates even at Threads 1: T1D's mean is +0.5 ply at 100 ms and +1.7 ply at 1 000 ms, while its Q falls by 1. So for any D form, played depth is not a like-for-like measure against today's T1. Q is the honest read, and Q does not rise in any 100 ms cell.
- **Where the extra disagreements fall:** mostly on near-equal choices. These are the start position (g1f3 or d2d4 for the reference's b1c3), p19 (the same −619 score) and the K+P ending p18. The proxy cannot separate "worse" from "different but equal" there. It also sits near its ceiling (T1 reads 18 of 20), so a QUALITY-PASS needed 20 of 20.

## Scope
Scratch prototype on `28ad3a8d`; not the build, not A7, not a strength reading.

## Risks
- 20 positions, one reference; Q's ceiling (above).
- High Tctl in the later runs (R2 91.6 °C, R4 96.5 °C). T1 and the candidates are interleaved in each run, so throttling falls on both sides. Tctl was not in the rule.
- `taskset` pinning is an upper bound for "cap at 4": production can set only the count, not the cores.
