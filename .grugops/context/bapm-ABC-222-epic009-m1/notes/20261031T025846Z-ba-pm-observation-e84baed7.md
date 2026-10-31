---
id: 20261031T025846Z-ba-pm-observation-e84baed7
kind: observation
by: ba-pm
at: 2026-10-31T02:58:46Z
verified_by: 
confidence: high: copied from sealed notes read back through readContext and from plans/ files read with grep/sed at main 4bd9ac6a
refs:
  - bapm-ABC-222-epic009-m1
  - ABC-222
  - EPIC-009
  - ABC-220
  - ABC-221
  - ABC-223
  - ABC-225
  - EPIC-010
  - ABC-243
  - ABC-242
  - ABC-244
  - ADR-0052
  - NFR-004
  - AR-NFR004-A
  - AR-UCI-BUSY
  - RISK-EPIC009-01
  - RISK-EPIC009-02
  - RISK-EPIC009-03
  - RISK-EPIC009-04
  - M1
  - M2
  - M3
  - M4
  - QE-222-a
  - QE-222-b
  - QE-222-d
  - QE-222-e
  - QE-222-f
  - QE-225w1-b
  - qe-ABC-222/20261031T025144Z-qe-e2e-decision-cc542c76
  - qe-ABC-222/20261031T025128Z-qe-e2e-observation-00cc4db1
  - qe-ABC-222/20261031T025128Z-qe-e2e-observation-4daf292f
  - qe-ABC-222/20261030T232126Z-qe-e2e-decision-63f93685
  - qe-ABC-225-w1/20261030T223134Z-qe-e2e-decision-d0807789
  - qe-ABC-225-w1/20261030T223127Z-qe-e2e-observation-7e9bd36f
  - main ae7211c3
  - main 4bd9ac6a
  - 19d18df1
supersedes: 
seal: sha256:a0618004860f32fbad3804f99456a69eff9541a84aee866c15322c5190f5e723
---

# BA/PM observation, bapm-ABC-222-epic009-m1: the figures this hop graded from, copied from sealed notes at `main` `4bd9ac6a`. All five `qe-ABC-222` notes read back through `readContext`

Read with `cat`/`grep`/`sed` and with context-io `readContext`. Nothing was run.

## `qe-ABC-222` (5 notes, all read back sealed: `…63f93685`, `…00cc4db1`, `…1311e4dc`, `…4daf292f`, `…cc542c76`)
- **Build:** tip `19d18df1`. 5 games at `tc=40/900`, `timemargin=0`, `-maxmoves 80` (full moves; `PlyCount` 160 at
  the cap). Session 2026-10-30T23:23:19Z → 2026-10-31T02:49:27Z, 3.44 h play.
- **Games:** 87, 128, 59, 160 and 140 plies. 4 rule results and 1 cap. 10 side-periods.
- **M1:** 0 losses on time. Closest call 19 991 ms (g05 b, move 40). The next are 19 992, 19 993, 39 990 and 39 991.
- **M2:** per side-period 92.89, 92.89, 88.00, 88.00, 97.78 × 5 and 95.33 %. The minimum is 88.00 %.
- **Ceiling:** max 22 002 ms (g02 a, move 6). 150 of 574 moves are over 22 000 ms, each by ≤ 2 ms. 13 book moves carry
  no PGN time.
- **A6:** 574 of 574 `go` lines carry `movestogo`. 0 `isready` arrived during a search. The overhead has a median of
  0 ms, a max of +2 ms and a min of −1 ms over 561 searches.
- **Host:** ALONE, 1 231 samples. Tctl quarter medians 73.9 / 74.1 / 73.5 / 74.0 °C, max 76.1 °C. The frequency fell
  by ≤ 0.01 % against Q1.

## `ABC-220` (for M3; its MERGED block and `qe-ABC-220` `…7a09c5e1`, as folded by `bapm-ABC-220-merge-fold`)
- A8: 0 differences in 4 200 rows against base. A11: max 22 001.0 ms in-process.

## M4 sources
- Owner words: `…a67f71ac` (Q1–Q8), `…3dd61448` (OQ-0052-1: 22 s / 22 s) and `…f4673b9f` (whole-second confirmed).
- `plans/nfr-catalog.md` header lines of 2026-10-30 (`secnfr-ABC-220`, `secnfr-catalog-rebase`): "NO BOUND MOVED
  BEYOND THE OWNER'S WORD" and "NO LEVEL, BAR, TARGET OR MEASURED FIGURE MOVED".

## `qe-ABC-225-w1` (for the restated estimate)
- `…7e9bd36f` A6: play wall 6 645 s (1.846 h). 40 games, 21.67 games/h, 2.77 min a game. Projected 400-game pair at
  width 1: 18.46 h (17.5–19.4 h). The old basis was 3.3–3.6 min a game. 36 of 40 games ended in mate.
- `…d0807789`: QE-225w1-b (LOW, records). Tctl median 74.1 °C, max 78.8 °C.

## Board and pull state (`plans/board.md` at `4bd9ac6a`)
- Header: "Next: ABC-242 → ABC-221". `ABC-243` was pulled 2026-10-31 (`se-ABC-243`, claimed). `ABC-221` sits in
  Ready. `ABC-223` sits in Backlog at 9/10.
- `ABC-225`: the board header of 2026-10-30 22:40Z reads Done, merged `59dc3ab4`. Its ticket page front matter still
  reads `in-development`.
