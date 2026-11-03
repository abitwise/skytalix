---
id: 20261103T202049Z-architect-design-observation-e81f6b25
kind: observation
by: architect-design
at: 2026-11-03T20:20:49Z
verified_by: 
confidence: high
refs:
  - arch-owner-answers-1103
  - grugops/arch-owner-answers-1103
  - ADR-0067
  - ADR-0056
  - ADR-0024
  - ADR-0048
  - ABC-239
  - ABC-274
  - ABC-270
  - ABC-277
  - EPIC-011
  - Q-3K-7
  - Q-3K-9
  - Q-3K-6
  - Q-3K-8
  - B-T8
  - SEC-HP-2
  - Q1
  - E2
  - E2-pre
  - NFR-008
  - RISK-EPIC010-05
  - dc7dc15d
  - 2410d4f7
  - 1e558566
  - orch-2026-10-30a/20261103T200613Z-orchestrator-decision-af126c04
  - qe-ABC-274/20261103T143139Z-qe-e2e-decision-fa87f74d
  - arch-ABC-239/20261103T105010Z-architect-design-decision-e4c34239
supersedes: 
seal: sha256:ed5ce76610d28e421a6c1eb8ea8ecd168112e01b9df136fb5f44974360ba4ed8
---

# arch-owner-answers-1103 owed lines: BA/PM's lines on `ABC-239`, `ABC-277`, `EPIC-011` and a future Q1 ticket; one `ADR-0064` pointer and one `ADR-0067` label for a later Architect fold; one count mismatch in `ABC-277` A7

None of these were edited here (fences: ticket pages and `EPIC-011` are BA/PM's).

## For BA/PM
- **`ABC-239`:**
  - A1: the data is own games plus Lichess `2017-03`, per `ADR-0067` § Addendum 2026-11-03 (owner yes `…af126c04`).
  - DoR row 10 / method: "`ADR-0067` ACCEPTED 2026-11-03; data pinned".
  - Dependencies: E2-pre merged (`2410d4f7`); the Lichess file downloaded by hand and checked against its sha256.
  - A6 / B-T8: "approved by the owner (`…af126c04` item 5)".
  - Test notes: add the addendum's test list (comment blindness, known-issue parse, filter counts, the sha256
    refusal, leakage direction, the zstd fixture).
  - The four data-stage stops (under 250 000 rows; reader drops over 0.1 %; a run over 30 min; a heap over 3 000 MB)
    go in § What happens on a miss, as STOPs to Architect/Design.
- **`ABC-277`:** A7 is **done** at `1e558566` (`SEC-HP-2`, owner yes). **A count mismatch:** A7's text says "the 2
  processes". Line 5 actually held **3** (one vitest runner and two fork workers), so it now reads `count=3`. The
  page's A7 wording owes a correction, or a note.
- **`EPIC-011`:** § Owner questions:
  - Q-3K-7 (a) yes / (b) no / (c) no, B-T8 approved, Q-3K-9 yes and `SEC-HP-2` yes are answered;
  - `ADR-0067` is ACCEPTED;
  - Phase 4: E2-pre is done;
  - `ABC-270`'s design may start now (item 8).
  - Q-3K-6 and Q-3K-8 stay open.
- **Q1 (SEE pruning of losing captures):** no ticket exists yet ("none (fenced out of `EPIC-010`)"). It is cut after
  `arch-Q1-see-pruning`'s design, with its PREREG and ADR. The build is graded by C2′ at 100 ms, with S′ and the
  Levels lane.

## For a later Architect/Design fold (not in this brief's list)
- **`ADR-0064`:** d4's and d6's dated pointers still say "`ADR-0067` (PROPOSED …)". Each owes a dated
  "(ACCEPTED 2026-11-03)".
- **`ADR-0067` decision numbering:** the data block that § Status, F2 and `ADR-0056` call "decision 9" begins
  "- **Default (A1), today …**". Its list number was lost: it renders as a bullet under decision 8, before "10.". The
  content is right. This is flagged here, not edited (coding rule 12).
