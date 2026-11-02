---
id: 20261102T172256Z-qe-e2e-observation-cc1de664
kind: observation
by: qe-e2e
at: 2026-11-02T17:22:56Z
verified_by: 
confidence: high for the depths, nodes and load as measured (one pass, one go per cell); the 0.69 cause UNKNOWN - verify
refs:
  - ABC-266
  - qe-ABC-266-d12
  - grugops/qe-ABC-266-d12
  - 5432f3f5
  - b082549a
  - d7aaea5e
  - qe-ABC-266-d12/20261102T172016Z-qe-e2e-decision-6231db75
  - ADR-0062
  - ADR-0057
  - ADR-0058
  - ADR-0055
  - grugops/ABC-265-fix
  - 28ad3a8d
  - arch-ABC-266/20261102T161450Z-architect-design-observation-0c8cf7d0
  - EPIC-011
supersedes: 
seal: sha256:13f65701c7459f2687ef4b7a32415105fe376bf3469ec5e18181135ba840564f
---

# ADR-0062 D12 probe, measured: at 100 ms the median played depth is 7 at Threads 1, 4 and 12, so T12 is not above T1. The 12 workers finish the same depth in 19 of 20 searches. Not loaded

QE/E2E, task `qe-ABC-266-d12`, ALONE window. Graded against the pre-registration sealed before the run (`…decision-6231db75`, commit `d7aaea5e`). The instrument is the prototype described there. Measured run: 17:20:24–17:21:37Z (73.2 s, exit 0, 0 worker `error` events), plus the earlier smoke (17:19:27–17:19:32Z). Host time about 78 s in total, all under `flock host-test.lock timeout`. Node v26.12.1, host `oeselg-dev`.

## Played depth (D6), 20 positions of `ABC-078` A3 (indices `i % 14 == 0`), one go per cell

| cell | median | min | max | depths by position 0..19 | nodes median / sum | wall ms median / max |
|---|---|---|---|---|---|---|
| 100 ms T1 | **7** | 5 | 11 | 6 7 5 5 5 8 8 7 7 6 6 6 6 6 9 11 11 9 11 10 | 81 696 / 1 664 975 | 100 / 101 |
| 100 ms T4 | 7 | 5 | 11 | 6 7 5 5 5 8 8 7 7 6 6 6 6 6 9 11 11 9 11 9 | 321 152 / 6 512 411 | 101 / 102 |
| 100 ms T12 | **7** | 5 | 11 | 7 7 5 5 5 7 8 7 7 6 6 6 5 6 9 10 11 9 11 9 | 672 594 / 13 666 716 | 101 / 103 |
| 1000 ms T1 | 10 | 8 | 13 | 10 8 8 8 8 11 11 10 10 9 8 8 8 8 11 13 13 11 13 11 | 812 288 / 17 225 679 | 1 000 / 1 001 |
| 1000 ms T4 | 9.5 | 8 | 14 | 9 8 8 8 8 11 11 10 10 9 8 8 8 8 11 13 13 11 14 12 | 3 203 444 / 68 464 443 | 1 000.5 / 1 001 |
| 1000 ms T12 | 10 | 8 | 13 | 10 9 8 8 8 11 11 10 10 9 8 8 8 8 11 13 13 11 13 12 | 6 806 745 / 145 645 747 | 1 001 / 1 002 |

`nodes` is the sum over the workers (D6).

## Per position, against Threads 1
- **100 ms:**
  - T12: above on 1, equal on 15, below on 4 (positions 5, 12, 15 and 19, each 1 ply shallower);
  - T4: above 0, equal 19, below 1.
- **1000 ms:**
  - T12: above 2, equal 18, below 0;
  - T4: above 2, equal 17, below 1.

## The workers move in lockstep (PR-1 to PR-4 confirmed against the clock)
- At 100 ms T12, all 12 workers completed the same depth in 19 of 20 searches. Position 0 is the exception: worker 1 reached 7 while the others reached 6.
- The deepest-completed rule (D6) beat worker 0's depth once at 100 ms and once at 1000 ms at T12, and never at T4.
- **Per-worker rate at T12:** the median nodes per worker per go is about 0.69 of Threads 1's (56 050 against 81 696 at 100 ms; 567 229 against 812 288 at 1000 ms). At T4 it is about 0.98 (80 288 and 800 861).
- So 12 workers spend about 8× the nodes of Threads 1 in total (13.7 M against 1.66 M at 100 ms). Each worker runs slower than the single thread, and the shared table does not turn that into depth.
- The cause of the 0.69 (Zen 5c cores, SMT siblings, memory or table contention, or thermal: Tctl rose 37 → 79 °C over the run) was not separated. `UNKNOWN - verify`.

## Foreign load (the pre-registered LOADED test, 100 ms phase)
- **Start:** load1 0.58, 0 foreign vitest, 0 `cutechess-cli`, no foreign process above 20 % of a core over 3 s, Tctl 37.25 °C.
- **100 ms phase:**
  - (a) 0 foreign vitest or `cutechess-cli` at every block check;
  - (b) phase foreign cores 0.454 (≤ 0.8);
  - (c) 2 of 20 blocks above 0.8 (positions 5 at 1.22 and 12 at 1.36; ≤ 4);
  - no foreign process above 20 % of a core over the phase; Tctl 70.5 °C at the phase end.
  - **LOADED: no.**
- **1000 ms phase (info):** foreign cores 0.371, 0 of 20 blocks above 0.8 (max 0.49), no foreign vitest or `cutechess-cli`, Tctl 79 °C (below D3-V2's 85).
- The foreign-core figure includes this session's own shell and tools and the owner's idle sessions (`abtop`, `claude`). No process was killed.

## Warm-up (discarded)
`go movetime 300` on the game-1 move-4 board: T1 depth 7, T4 7, T12 6.

## Scope
The pool prototype on the `ABC-265-fix` table, as pre-registered. It is not the `ABC-266` build, not A7, and not a strength reading.

## Risks
- **One go per cell.** Iteration boundaries make depth flip by ±1 on noise. All three thread counts sit on the same median, so the result is not a near miss on one cell.
- **The prototype differs from the build:** no UCI session and the OS places the workers. The T12 per-worker rate is a property of this host.
