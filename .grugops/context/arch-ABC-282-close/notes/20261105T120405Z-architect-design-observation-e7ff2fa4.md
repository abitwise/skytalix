---
id: 20261105T120405Z-architect-design-observation-e7ff2fa4
kind: observation
by: architect-design
at: 2026-11-05T12:04:05Z
verified_by: 
confidence: high for what git and file reads show at main 2e46933f; which branch stopped each move stays UNKNOWN - verify
refs:
  - arch-ABC-282-close
  - grugops/arch-ABC-282-close
  - ABC-282
  - ABC-223
  - ABC-221
  - ABC-078
  - EPIC-009
  - EPIC-011
  - ADR-0071
  - ADR-0066
  - ADR-0052
  - ADR-0044
  - NFR-004
  - AR-NFR004-A
  - AR-UCI-BUSY
  - R-0071-1
  - R-0071-2
  - QE-282-f
  - QE-282-l
  - QE-282-n
  - QE-223-c
  - QE-223-d
  - a6ae8227
  - 2e46933f
  - qe-ABC-282/20261105T113544Z-qe-e2e-decision-5191f871
  - qe-ABC-282/20261105T113544Z-qe-e2e-observation-4f8f7f5d
  - qe-ABC-282/20261105T113537Z-qe-e2e-observation-1434a7d1
  - orch-2026-10-30a/20261105T114920Z-orchestrator-decision-16e0ec2c
supersedes: 
seal: sha256:15d41b91c3ccd764883f8e84fc4d28d50ce1cf4b57e3b209a5bd90e17638e535
---

# arch-ABC-282-close readings: QE-282-l's figures re-read from `moves.tsv` and agree; `ADR-0071` D11's arithmetic applies the cap; `NFR-004`'s real-clock line is stale; three dated lines left as they are

Read with git and file reads at `main` `2e46933f`. Nothing was run.

**Re-read from `qe-ABC-282` `raw/out/a4/moves.tsv`, 606 rows. Every figure agrees with `…4f8f7f5d`.**
- 13 budgets at 59 500. The highest budget under the cap is 59 120.5.
- Longest move 59 501 ms, g05 Black move 39. Next 59 500 ms, g05 White move 40.
- Seven moves ≥ 50 900 ms, all at moves 36–40 of a period.
- g01 White move 40: clock 88 532, budget 59 500, elapsed 26 947, left 61 585.
- Near budget (within 1 000 ms), 129 searched moves: median +0.6 ms, max +3.9 ms.
- Of the 13 moves at the cap, 2 ended at the budget (59 500, 59 501) and 11 under it (26 947–54 786). The least is above 59 500 / 2.3 = 25 869.6. Which branch stopped each move stays `UNKNOWN - verify` (QE-282-f).

**Other checks.**
- `a6ae8227` is a merge on `main`, dated 2026-11-05T11:37:14Z.
- `src/uci-session.ts` holds `ITERATION_GROWTH` = 2.3, and `softMs` is set only in the `uci-clock-mode` clock branch, as D3 says.
- `src/engine.ts` leaves `reached` untouched on an abort, and replaces `best` only when a soft limit is set and a root move beat the incumbent. So the dated line under `ADR-0066` decision 5 matches the code.
- `arch-ABC-282` `raw/alloc-w1.mjs` and `raw/alloc-w1-mc.mjs` both spend from min(CAP, C). D11's figures therefore already carry the cap.
- `plans/nfr-catalog.md`'s `NFR-004` row ends "`UNKNOWN - verify` until QE's `A10` re-run". No catalog line names `qe-ABC-221`'s 59 500.8 ms or `ABC-223`'s 25 285 ms.

**A reading of the brief.** "`ADR-0066`'s d5 line" is decision 5, per `ADR-0071` D12 item 5. It is not a depth.

**Seen, not edited; outside the brief.**
- `ADR-0056`'s dated line of 2026-11-04 on row W1 and its row cell, and `ADR-0052`'s dated line under A10, describe `ADR-0071` before its merge. Each is true of its date.
- `ADR-0066` § Status still reads "In force when `ABC-283` merges". That is true as a condition, and it has been met.
- The kept block in `ADR-0071` § Status still lists BA/PM's owed lines of 2026-11-04. `bapm-ABC-282-close` has since closed the `ABC-282` page.
