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
