---
id: 20261105T141916Z-ba-pm-observation-bf92ae84
kind: observation
by: ba-pm
at: 2026-11-05T14:19:16Z
verified_by: 
confidence: high that each item is open on the records; the items marked UNKNOWN - verify stay so; nothing run
refs:
  - bapm-ABC-291-probe-lines
  - ABC-291
  - EPIC-011
  - ADR-0075
  - ABC-307
  - NFR-008
  - NFR-009
  - arch-ABC-291-probe/20261105T141205Z-architect-design-decision-2926c26b
  - orch-2026-10-30a/20261105T141318Z-orchestrator-decision-69ee96e7
supersedes: 
seal: sha256:41fb7d3f4f63c37c346b5e7deb5320389461a8bc290eed3616899e6e230983c2
---

# bapm-ABC-291-probe-lines: what this hop leaves open

BA/PM, task `bapm-ABC-291-probe-lines`, records only. Nothing below is a reading.

**For the Orchestrator.**
1. **F2's K5 half is not ruled.** F2 fires on K4 above 1.03 × or on a run below depth 6 on K5, and both led to d5's cut and one re-read. Ruling 1 names K4 only, and the cut is spent. So a K5 run below depth 6 still stops to Architect/Design, with no cut left and no stated next step. The page says this at F2. It does not hold Ready: the bar is measurable and the STOP stands. It wants a line before K4's PREREG if the two should read alike.
2. **`ADR-0075` has lines without a dated mark.** d3, the title and § Consequences read 640 KiB and +65 536, and K2's first sentence reads 589 824 → 655 360. Only K2 carries a dated line. An Architect hop could date the other three. The page states the conflict and which side holds, so nothing waits on it.
3. **The board's `ABC-291` row reads In Design, DoR 9/10.** Fenced from me. The move to Ready is yours. Ready would read 5 of 8 by the pages.
4. **`NFR-008`'s line on the page is unchanged:** "the row census the Orchestrator placed after A4 gates the merge". The census has reported, and `ABC-307` now holds that work. `ADR-0075` § Consequences has the same words. It is not a probe line, so I left it. A later hop may want it re-worded.
5. **K2's "58" against the cut.** The list counts the 2 byte rows, and with the cut they do not move, so 56 of the 58 change, in 10 of the 12 files. The check of 2 708 of 2 709 ran on the uncut copy. The page keeps the Architect's count and says the byte rows do not move. The list has not been run against a build with the cut.
6. **`plans/traceability.md`:** this hop's row sits after `arch-ABC-291-probe`'s. If another hop lands first, the merge may need that hunk from both sides.

**Carried, `UNKNOWN - verify`, not mine to settle.** `G6`; the miss-path cost; what the cut buys; every play read; the cause of PR8's two levels; the deep lanes' rows; `ABC-282` A2 (b)'s new fixture; this ticket's exact default-lane row count; `TUNE_DEEP` on `main` today; the rest of § `UNKNOWN - verify` on the page.
