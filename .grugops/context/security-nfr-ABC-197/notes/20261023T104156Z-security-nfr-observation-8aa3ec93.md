---
id: 20261023T104156Z-security-nfr-observation-8aa3ec93
kind: observation
by: security-nfr
at: 2026-10-23T10:41:56Z
verified_by: 
confidence: high (QE instrument output checked against the committed readouts and checksums; git diffs read; arithmetic only; nothing re-timed)
refs:
  - ABC-197
  - security-nfr-ABC-197
  - NFR-008
  - N8-LANE
  - 1f2aa4b0
  - 051d557a
  - 11b745e3
  - 88854d7e
  - plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
  - plans/nfr-catalog.md
  - 20261023T103455Z-qe-e2e-observation-13c7935f
  - 20261023T103455Z-qe-e2e-observation-c12590b6
  - 20261023T103455Z-qe-e2e-observation-fc6590fe
  - 20261023T103455Z-qe-e2e-observation-b4a96d77
  - 20261023T103518Z-qe-e2e-decision-9dc058a9
  - 20261023T080227Z-architect-design-decision-578a9290
  - 20261023T072556Z-security-nfr-decision-d0c770b5
  - ADR-0035
  - ADR-0046
  - A6
  - A7
supersedes: 
seal: sha256:7b86806cf3c9da91af016a9ef8d49c431932c6957ff56e1e9257e7e95e36b54c
---

# `security-nfr-ABC-197`: the readings this gate rules on, the lane-input checks, and the published headroom. Records only. Nothing was run or timed

Security/NFR, task `security-nfr-ABC-197`, 2026-10-23. Every figure is read from QE's committed probe on `grugops/qe-timing-ABC-197` @ `11b745e3` (`.grugops/context/qe-timing-ABC-197/probe/`), extracted by `git archive` into scratch. No vitest, no lane, no probe and no timing ran at this hop.

## Probe integrity
- `probe/RUNSUMS`: **64/64 OK** (`shasum -a 256 -c`). `probe/SHA256SUMS` (instruments, scripts, pre-registration): **15/15 OK**.
- `preregistration-qe197t.txt` sha256 `be4505d379e6…` matches QE `…b4a96d77`. It was written 10:16:43Z. The first gate poll was 10:16:55Z. It names F = 0.070 s for the n8 readouts (Architect `…578a9290`) and 174b as the A7 grading view.

## A7 (`NFR-008` R-1), cross-checked against `full-a1/readout-nfr008-full-b.out` and `nfr008-full.summary.txt`
- **H (`1f2aa4b0`): 8.935 s** median wall, x(2)..x(7) [8.68, 9.11]; range 8.63–9.13 s; CPU 25.855 s. `A9 STATE at 10 s wall: MET`.
- H/H2 twin: CPU median −0.065 s ≤ 0.388 s, sign +4/−4 p 1.000 → admissible. Wall R 0.100 s.
- **B (`051d557a`): 8.815 s** [8.66, 8.92] (`readout-nfr008-full-BT-b.out`, B/T relabelled, admissible, R 0.15 s).
- H−B: wall +0.090 s [+0.010, +0.200], sign 7/8; CPU +0.245 s [+0.030, +0.420].
- 8/8 scored, thermal 0 → 0 on every run, warm 0/8, load1 before scored runs 3.38–5.01 (H/H2) and 2.88–5.15 (B/T), all ≤ 8. AC on every run (QE `…13c7935f`). 0 foreign window polls.
- Host name `MacBook-Air.local` here, `Mac.lan` at `ABC-178`'s hop (QE disclosed it). Whether it is the same machine is `UNKNOWN - verify`. B and H were read in the same window, so the H−B charge does not depend on it.

## A6 (`N8-LANE`), cross-checked against `n8-a1/readout-n8-lane-a.out` (174a) and `readout-n8-lane.out` (strict 174)
- H−B CPU **+0.125 s** [+0.120, +0.160], 8/8 positive; wall +0.130 s [+0.090, +0.140].
- T−B twin CPU median +0.000 s, R 0.040 s, admissible; wall R 0.070 s, admissible.
- `per-set F = 0.070 s; 650 ms >= F: True`; `STATE at 650 ms CPU: MET` in both views.
- Admissible Rs on this set (CPU / wall): `ABC-177` A8 0.070 / 0.090; `ABC-178` B7 0.030 / 0.050; `ABC-197` A6 0.040 / 0.070. Median of three: **0.040 s CPU / 0.070 s wall**. That is arithmetic only, and the ruling on F belongs to Architect/Design.

## Lane-input diff (lane inputs = `src tools package.json package-lock.json vitest.config.ts tsconfig.json`)
- **`1f2aa4b0` → `main` `88854d7e`, literal: NOT empty.** `src/uci-session.test.ts` −11. That is R2's own reverse: `ABC-197` is not merged yet.
- **B `051d557a` → `main` `88854d7e`: empty, on every path outside `plans/`, `.grugops/` and `memory-bank/`.** `main` added records only since B.
- **`1f2aa4b0` → `11b745e3` (timing tip): empty.**
- **`1f2aa4b0` → trial merge tree of `main` `88854d7e` with `11b745e3` (`git merge-tree --write-tree`, tree `2bb0d729`, clean): empty.** So the reading describes the tree the merge would produce.

## Change surface
`051d557a..1f2aa4b0` outside records: `src/uci-session.test.ts` +11/−0 only. It adds one `it` row (`talk([...], 100)`, `parseInfo`, four `expect`s) and one comment. There is no production byte, input surface, I/O, secret or dependency change.

## Published headroom (H = 8.935 s, the latest admissible verdict)
- **To W (10 s): 1.065 s**, ≈ 10.7 × the wall R 0.100 s. **To `ADR-0046` D4's 9.2 s: 0.265 s.**
- On `main`/B (8.815 s): 1.185 s / 0.385 s.
- Against `ABC-178`'s published 0.990 s: the headroom grew, although R2 added cost, because the two windows differ (B 8.985 s there, 8.815 s here). R2's charge is the in-window +0.090 s wall. It is not a saving.
