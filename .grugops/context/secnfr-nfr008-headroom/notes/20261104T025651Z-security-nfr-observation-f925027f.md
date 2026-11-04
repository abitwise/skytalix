---
id: 20261104T025651Z-security-nfr-observation-f925027f
kind: observation
by: security-nfr
at: 2026-11-04T02:56:51Z
verified_by: 
confidence: high: 15 scored npm test runs on main 08843504 inside the host lock, exit 0, 2650/2650; diag reporter 3 scored runs; not a graded verdict (no twin)
refs:
  - secnfr-nfr008-headroom
  - NFR-008
  - NFR-010
  - R-N8H-1
  - R-N8H-2
  - R-N8H-3
  - Q-N8H-1
  - QE-280-b
  - QE-279-e
  - ADR-0008
  - ADR-0035
  - ADR-0040
  - ADR-0046
  - T-QEHOP-GROWTH
  - ABC-248
  - ABC-244
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - plans/nfr-catalog.md
  - qe-ABC-280/20261104T024152Z-qe-e2e-observation-29cd8440
  - qe-ABC-279/20261104T003652Z-qe-e2e-observation-c49b050d
  - 08843504
supersedes: 
seal: sha256:b84a6f3089e24085a9799ad70133f33cfdef7248bcdff5a93b261322d13580cc
---

# Security/NFR observation, secnfr-nfr008-headroom: main's default lane read ALONE — median 9.77 s (n 8) and 9.90 s (n 7) wall, 0 of 15 over 10 s; CPU 32.4 s; `src/cli.test.ts` is 30 % of the lane's slot time, all of it child start-up at collect

Reported, not a graded `NFR-008` verdict: no twin arm (`ADR-0035` D1) and no pre-registration. Tree: `main` `08843504` (this branch adds records only; `src/`, `tools/`, config byte-identical). Host `oeselg-dev`, Node v26.12.1, vitest 4.1.12, heap cap on (`npm test` as spelled). No `/sys/class/power_supply` entry (no battery), so the AC rule holds trivially. Every run inside the host lock; the only other matching processes were the Scribe's lock-wrapped command waiting on the same lock. Exit 0 and 2 650 / 2 650 tests (69 files) on every run.

## Readings (raw `n8-alone-A.tsv`, `n8-paired-P.tsv`, `diag-D-times.tsv`)
- **Session A, 1 warm-up + 8, `npm test`, back to back, load1 0.88–2.56:** wall 9.63–9.94 s, **median 9.77 s**; CPU (user + sys) median **32.36 s**.
- **Session P, base arm (7 scored, interleaved with a probe arm), load1 1.34–3.56:** wall 9.65–9.98 s, **median 9.90 s**, CPU median 32.49 s.
- **Combined main, 15 scored runs: median 9.79 s, max 9.98 s, 0 over 10 s.** Headroom on the median: **0.10–0.23 s**. QE read 9.73 s on the same `src` tree a few hours earlier (`QE-280-b`) and 9.42 s the day before (`QE-279-e`): the window-to-window spread (≈ 0.3–0.5 s) is larger than the headroom.
- vitest's own `Duration` reads 9.33–9.66 s (import 6.50–6.65 s, tests 7.25–7.54 s, summed over both workers); the ≈ 0.3 s gap to `/usr/bin/time` is npm + `run-bounded.js` + vitest boot.

## Where the time goes (diagnostic reporter, 3 scored runs; raw `diag-slot.txt`, `diag-timeline.tsv`, `perfile-A.txt`)
With `maxWorkers: 2`, wall ≈ (Σ per-file slot time + per-file worker gaps) / 2 + boot. Σ slot (queued → end) is **14.1–14.4 s**; the remaining ≈ 2.3 s of slot is ≈ 67 ms of worker turnover per file (69 files, isolation on).

| file | slot ms | collect ms | tests ms | note |
| --- | --- | --- | --- | --- |
| `src/cli.test.ts` | 4 158–4 389 | 3 420–3 560 | 734–827 | ~28 synchronous children spawned at module top level (`CHILDREN`), ≈ 85 ms per `node src/cli.ts` child, 145–171 ms for `npm run chess`, plus a fixed 0.6 s settle sleep (`A9_SETTLE_SECONDS`) |
| `src/uci-session.test.ts` | 1 797–1 900 | 146–170 | 1 622–1 750 | many 40–106 ms protocol rows; already thinned by `ABC-248` |
| `src/search.null-move.test.ts` | 1 134–1 164 | 72–84 | 1 054–1 075 | one row 365 ms (`QE-208-a`) |
| `src/engine.test.ts` | 781–806 | 164–190 | 611–632 | one row 236 ms (`ABC-230` A4) |
| `src/levels.test.ts` | 554–587 | 68–71 | 481–514 | one row 135 ms (`A9`) |
| `tools/grugops/qe-hop-integrity.test.ts` | 367–417 | 14–24 | 347–389 | reads the real note store (5 064 note files today) |

Everything else is ≤ 250 ms slot per file; 49–51 files have < 60 ms of tests and cost ≈ 3.0–3.4 s of slot between them (start-up, not tests). The last file ends within 10 ms of the run's end: the two workers are balanced, so there is no tail to re-order away.

## Slowest rows (median ms over 8 runs, `perfile-A.txt`)
365 `search.null-move` QE-208-a "position-6, the even readings 4 to 24"; 236 `engine` ABC-230 "A4: an empty list is node-equal to an absent one"; 176 `qe-hop-integrity` ABC-105 A9 sweep (real notes); 170 `cli` ABC-241 A4; 137 `cli` ABC-042 "spawns TWENTY-EIGHT children"; 135 `levels` A9 "different seeds actually differ"; 130 / 119 `search.null-move` A2 (instrumented; zugzwang rows); 106 / 81 `uci-session` ABC-167 A5 time rule.
