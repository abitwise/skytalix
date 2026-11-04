---
id: 20261104T172222Z-security-nfr-observation-e2c442d3
kind: observation
by: security-nfr
at: 2026-11-04T17:22:22Z
verified_by: 
confidence: medium-high: 8 / 8 paired in one hold, H reproduced at 9.82 s; an estimate by skip, not a move, and never a grade
refs:
  - secnfr-nfr008-1104
  - NFR-008
  - NFR-010
  - R-N8H-1
  - R-N8H-2
  - R-N8H-3
  - R-281-a
  - Q-N8H-1
  - T-QEHOP-GROWTH
  - ADR-0035
  - ADR-0046
  - ADR-0008
  - ABC-283
  - ABC-271
  - ABC-281
  - ABC-282
  - ABC-248
  - EPIC-011
  - src/search.null-move.test.ts
  - src/uci-session.test.ts
  - src/search.futility.test.ts
  - src/zobrist.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/engine.capacity.test.ts
  - src/cli.real-engine.test.ts
  - plans/nfr-catalog.md
  - secnfr-nfr008-1104/20261104T170654Z-security-nfr-decision-c7289371
  - secnfr-nfr008-1104/20261104T171458Z-security-nfr-decision-39f73707
  - qe-ABC-283/20261104T164437Z-qe-e2e-observation-d15c2a10
  - qe-ABC-283/20261104T164437Z-qe-e2e-decision-de1dc511
  - qe-ABC-283/20261104T164437Z-qe-e2e-observation-3f370426
  - se-ABC-283-merge/20261104T170008Z-software-engineer-observation-f7f63e1d
  - qe-ABC-271/20261104T162300Z-qe-e2e-decision-74da20bf
  - qe-ABC-281/20261104T041512Z-qe-e2e-observation-c7e298cd
  - secnfr-ABC-281-a9/20261104T042047Z-security-nfr-decision-2e3b747f
  - secnfr-nfr008-headroom/20261104T025651Z-security-nfr-decision-8a4fb936
  - secnfr-nfr008-headroom/20261104T025651Z-security-nfr-observation-f925027f
  - orch-2026-10-30a/20261104T151305Z-orchestrator-decision-c7609f51
  - orch-2026-10-30a/20261104T164704Z-orchestrator-decision-2409cec9
  - fd6b595f
  - 58e90d07
  - ebd1263f
  - ea08d7b6
supersedes: 
seal: sha256:5c4ba8908051e19b430134bff181898a53131ca2e47e808bea39d909db85a5dc
---

# secnfr-nfr008-1104 probe (an estimate, never a grade): **the seven form-S rows (P1) save −0.26 s of wall [−0.54, −0.13], 8 / 8. Adding the two critical-path rows whose files have no deep gate (P2) saves −0.555 s [−0.69, −0.29], 8 / 8.** Those two rows alone are worth about −0.30 s

Security/NFR, task `secnfr-nfr008-1104`. Arms and rows as sealed in the probe plan `…39f73707`. Records: `raw/out/probe/` (`a8.tsv`, `grade.out`, `probe.console`), plus `raw/out/probe-P1.diff` and `raw/out/probe-P2-over-P1.diff` (each changed line is one `it(` → `it.skip(`). Scripts: `raw/scripts/probe.sh` and `probe-grade.py`.

## The session
- **ONE `flock <scratch>/host-test.lock` hold**, 2026-11-04 17:15:15Z → 17:19:35Z. The wait-clear took 0 s (load1 0.35).
- 9 rounds, rotated H P1 P2 / P1 P2 H / P2 H P1. Round 0 was discarded, so n = 8 complete scored rounds and k = 2.
- Every run exited 0 with its expected counts (H 2 687 passed; P1 2 680 + 7 skipped; P2 2 678 + 9 skipped; 71 files each).
- load1 0.35–3.75 and 0 foreign vitest in every row.
- **Time on the host for both sessions: 8 min 46 s of lock holds**, against the brief's 1 h.

## Readout (`probe-grade.py`)
| arm | wall median [x(2), x(7)] | max | CPU median | − H, wall (paired) | − H, CPU (paired) |
|---|---|---:|---:|---|---|
| H (`main`) | 9.82 s [9.73, 9.84] | 10.00 | 33.11 s | — | — |
| **P1** (R1–R7 skipped; 632 ms in-thread) | 9.52 s [9.30, 9.69] | 9.71 | 32.42 s | **−0.260 s [−0.540, −0.130], 8 / 8 negative** | −0.910 s [−1.080, +0.130], 5 / 8 |
| **P2** (P1 + 2 rows; 935 ms in-thread) | 9.25 s [9.15, 9.44] | 9.60 | 31.66 s | **−0.555 s [−0.690, −0.290], 8 / 8 negative** | −1.400 s [−1.860, −0.820], 8 / 8 |

- **H reproduces session 1:** 9.82 s here against 9.84 s graded. This was a separate hold, 4 minutes later.
- **Wall per in-thread ms is not uniform.**
  - P1's seven rows return about 0.41 s of wall per in-thread second. That is near the ÷ 2 of two workers, less the per-file start-up that stays.
  - The two P2 rows return about 0.30 s for 303 ms, roughly one for one. `src/cli.test.ts`'s worker is the lane's critical path: its collect-time children (3.4 s at `…f925027f`) plus its 0.77 s slot. Rows in that worker shorten the wall directly.
- **What the probe does not show.**
  - A skip keeps the row's collection and any describe setup, so a real move saves a little more.
  - A form-S remnant keeps a little, so it saves less. ABC-281's remnants kept about 6 % (`ADR-0046` § Dated 2026-11-04), and its graded −0.37 s matched the probe's −0.38 s.
  - **Expected with remnants:** P1 about −0.24 s; P2 about −0.50 s.
