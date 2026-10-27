---
id: 20261027T032800Z-ba-pm-observation-5b15b48c
kind: observation
by: ba-pm
at: 2026-10-27T03:28:00Z
verified_by: 
confidence: high (git reads and greps at a5306773; the re-tune arithmetic is BA/PM's, not a measurement)
refs:
  - ABC-209
  - ABC-210
  - ABC-208
  - EPIC-008
  - S1
  - A2
  - A5
  - A6
  - G6
  - M1
  - M2
  - M3
  - T1
  - T5
  - ADR-0025
  - QE-205-c
  - QE-209-a
  - QE-209-b
  - QE-209-c
  - QE-209-d
  - QE-209-e
  - QE-209-f
  - QE-207-g
  - plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
  - orch-2026-10-27a/20261027T032148Z-orchestrator-decision-00f47145
  - qe-ABC-209/20261027T032028Z-qe-e2e-decision-e32e0ee4
  - qe-ABC-209/20261027T032028Z-qe-e2e-failed-attempt-0932c037
  - qe-ABC-209/20261027T032028Z-qe-e2e-observation-b3f525d2
  - bapm-s1-ABC-207/20261026T005931Z-ba-pm-decision-f249ca34
  - orch-2026-10-26u/20261026T125807Z-orchestrator-decision-388d6d51
  - arch-design-ABC-209/20261026T125648Z-architect-design-decision-2e73dcd9
  - qe-ABC-208/20261026T122350Z-qe-e2e-decision-0477ac64
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - owner-word-2026-10-26b/20261026T132424Z-orchestrator-decision-2ae5fc12
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - orch-2026-10-26x
  - grugops/bapm-s1-ABC-209
  - a5306773
  - 64394974
  - bb6cf451
  - 694aa3af
  - b5c67ab7
supersedes: 
seal: sha256:9da380b799cfc394864305ced7d8169e3fd99e1eeb76e36c93165ea0133addab
---

# BA/PM re-reads for the ABC-209 S1 call, at main a5306773 (records only; no npm, vitest or timing)

- `git diff --stat 64394974 a5306773 -- src data tools`: empty. `main`'s code equals the D base, so no revert is owed.
- `grugops/ABC-209` = `bb6cf451`, `grugops/qe-ABC-209` = `694aa3af`; `git merge-base --is-ancestor grugops/ABC-209
  main` is false (not on `main`).
- `b5c67ab7` is on `main`: "merge(ABC-208): … QE PASS …0477ac64, S1 MET D +38.4 ± 23.3". `qe-ABC-208` `…0477ac64`
  carries "GAIN +38.4 ± 23". `EPIC-008` had no `b5c67ab7` line before this task (grep: 0 hits).
- `src/quiescence.ts:21-24` at `a5306773` is byte-equal in text to `55a8f4ef:src/quiescence.ts:21-24` ("Not here, each
  a recorded decision rather than an omission: checks in quiescence, …"). `ABC-210`'s cite holds.
- `ABC-210` page § Dependencies: "Ready trigger: `ABC-209` reaches Done, or BA/PM closes it under S1"; DoR 9 of 10,
  row 10 "held by sequence: `ABC-209`"; no re-score since 2026-10-23.
- The `orch-2026-10-26x` LOW (board line 5): "the ABC-209 page's A5 G6 sub-line and two DoR row-10 cells still read
  QE-205-c open". Located at page `A5` (2026-10-26 `bapm-ready-ABC-209` sub-line) and DoR row 10 of the
  `bapm-ready-ABC-209` and `bapm-amend-ABC-209` re-scores. After this task, `grep QE-205-c` on the page shows only
  closed or struck-through readings.
- `ABC-208` page frontmatter: `status: ready`, `column: Ready`; board: ABC-208 under Done. Not edited (outside this brief).
- Re-tune arithmetic (BA/PM's, not a measurement): pooled Y = 18.25 → standard error ≈ 9.31; GAIN over 800 games needs
  X > about 18.3; from the +8.69 point estimate that is z ≈ 1.03, P ≈ 0.15.
- Reading duration from `…b3f525d2`: d1 6.18 h + d2 6.41 h ≈ 12.6 h.
