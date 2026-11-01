---
id: 20261101T123526Z-architect-design-observation-909876c0
kind: observation
by: architect-design
at: 2026-11-01T12:35:26Z
verified_by: 
confidence: high on the quoted records and file reads at 0ca365b3; every speed figure is ADR-0003's July M3 measurement, UNKNOWN - verify on this host
refs:
  - arch-adr0003-amend
  - ADR-0003
  - ADR-0055
  - ADR-0002
  - ADR-0020
  - EPIC-010
  - ABC-254
  - ABC-250
  - ABC-252
  - ABC-206
  - ABC-235
  - ABC-229
  - ABC-009
  - NFR-005
  - NFR-001
  - NFR-009
  - G6
  - G7
  - OD-206-1
  - Q-SP-3
  - orch-2026-10-30a/20261101T131000Z-orchestrator-decision-f7a50e95
  - owner-word-2026-10-24/20261024T105800Z-orchestrator-decision-fb0468ff
  - bapm-goal3000-o1-cut/20261101T115328Z-ba-pm-observation-9963a89f
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - 0ca365b3
  - grugops/arch-adr0003-amend
supersedes: 
seal: sha256:568b8728653bb8fafbd6f6f060efa24df9cf9c1958360093ae2546ab34312ccb
---

# Architect/Design, arch-adr0003-amend: the facts the amendment rests on

Everything here was read from files at `main` `0ca365b3`. Nothing was run.

- **What ADR-0003 says (2026-07-30, owner-ratified).**
  - Clause 1 reads: "`src/legal.ts` is not changed. Make/test/unmake stays the legality strategy."
  - Clause 3 lists (c1), then (c2), then (b), "authorizes none of the three", and names the trigger: the depth floor
    missed on target hardware. The trigger has not fired.
  - (c2) was measured at 3.39× on kiwipete, 4.38× on position-6 and 3.43× at startpos per call. In check, on
    position-4, it was 1.21× with the board-only test folded in and 0.97× without it.
  - It was differentially verified on 518,474 nodes with 0 mismatches and 0 mutations.
  - 8.1% of moves can be illegal at all, and 1.6% of nodes are in check.
  - All of this is one Apple M3 in July 2026. On this host it is `UNKNOWN - verify`.
- **The clause-1 reading already in force.**
  - `OD-206-1` is on the `ABC-206` page, Design ruling item 6: "the clause keeps the strategy. It is not a byte freeze
    of the file."
  - The owner did not veto it (`owner-word-2026-10-24/20261024T105800Z-orchestrator-decision-fb0468ff`).
  - `ABC-235` cited it (`arch-ABC-235/…eebca902`).
  - `src/legal.ts` has had commits from `ABC-206`, `ABC-235` and `ABC-229` (`git log -- src/legal.ts`), and its header
    cites "ADR-0003 clause 1, OD-206-1". It is 299 lines.
  - The counter-reading is also on record: `ADR-0020` cites clause 1 for a byte-identical `src/legal.ts` within
    `ABC-075`, as quoted on the `ABC-206` page.
- **The open question BA/PM recorded** (`bapm-goal3000-o1-cut/…9963a89f`, "Architect/Design (1)"): confirm that
  clause 1 reads "make/test/unmake stays the strategy" for `ABC-250`/`ABC-252`. The `ABC-250` page, scope item 4,
  says it waits if clause 1 is read literally.
- **The legality filters exported from `src/legal.ts`:** `legalMoves`, `hasLegalMove`, `legalCaptures` and
  `legalCapturesAndQueenPromotions`. Also exported: `isInCheck`, `givesCheck` and `hasLegalEnPassant`.
- **What "perft 32/32" counts.** `src/perft.test.ts` has 28 count rows over the six positions, 3 perftDivide tests and
  1 base case, which makes 32 tests.
- **Position-4 is in check.** It has white to move. The black bishop on b6 attacks g1 along c5–d4–e3–f2, and all four
  squares are empty in the FEN.
- **ABC-250 is in Ready** (board line 1285), not In Development. `ABC-254` is in Backlog at DoR 9/10, and row 10 is the
  amendment.
- **ADR-0002** says the re-measurement "becomes owed only if a human ratifies clause 3's (c1) or (c2)". Under (c2),
  ADR-0003 measured the history penalty at 1.93× at kiwipete and 0.99× at startpos, and ADR-0002 clause 1 holds on
  that.
