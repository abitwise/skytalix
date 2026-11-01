---
id: 20261101T230952Z-architect-design-decision-2c2c1df6
kind: decision
by: architect-design
at: 2026-11-01T23:09:52Z
verified_by: 
confidence: high on the rule and its value-safety derivation (standard practice, argued from main 13627d0f); UNKNOWN - verify on the firing rate at 100 ms and on the size of the drift, both measured by the build
refs:
  - ABC-238
  - ADR-0058
  - ABC-081
  - EPIC-011
  - ADR-0056
  - ADR-0026
  - ADR-0050
  - ADR-0054
  - ADR-0025
  - ADR-0057
  - ABC-257
  - ABC-236
  - ABC-249
  - NFR-005
  - NFR-009
  - arch-epic011-phase1
  - grugops/arch-epic011-phase1
supersedes: 
seal: sha256:9a89b035ff09d8bb124459f5593602e79186e5ec00c4ee31fc104aa15912c09b
---

# T1 (ABC-238): ADR-0058 PROPOSED — a deeper stored entry may cut off a shallower search, behind an off-door pair

Deliverable: `memory-bank/50-decisions/ADR-0058-a-deeper-stored-entry-may-cut-off-a-shallower-search-behind-a-test-only-off-door-pair-and-abc-081-a1s-identity-binds-the-doors-that-predate-it.md`. New ADR (not an ADR-0025 amendment: ADR-0025's decisions do not hold the exact-depth rule; ABC-081 A1 and the code comment do). Acceptance is the owner's (new ADR, 2026-10-22 delegation). Reading (b): build and gates may proceed while PROPOSED; the read and the merge wait on his acceptance. Default without an answer: exact-depth stays, ABC-238 does not merge.

## Ruling
- **Rule (d1):** with the switch on, an entry settles a node when stored depth >= requested remaining depth; bound rules unchanged (exact; lower >= beta; upper <= alpha; fail-soft stored score). Root never cuts. Order at node entry unchanged: in-path repetition, pre-root repetition (engine), leaf/capacity, probe. Quiescence neither probes nor stores. storeEntry untouched.
- **Switch (d2):** `deeperCutoffs` in both recursions (Switches / Heuristics), passed to tableCutoff as an argument; no module state, no option.
- **Doors (d3):** searchWithoutDeeperCutoffs(position, depth), chooseMoveWithoutDeeperCutoffs(position, options) = pre-ABC-238 shipped, node for node. ABC-077 A6 / ABC-078 A4 export lists grow by two names.
- **Ladder (d4):** every older door turns it off, so ABC-081 A1 rows, ABC-077 A1, ABC-078 A3 and all old doors read as today.
- **Rows (d5):** ADR-0050 d4 form — rows with shipped side vs an older door re-point to the new door; shipped value rows stay and are re-pinned only if they move; ABC-249 row follows ABC-238 test note 2; PR lists every re-point and re-pin.
- **Oracle (d6), both recursions:** d5 on ABC-121's 190, >= 95 % non-mate within 25 cp, 0 mate sign changes; max drift a report, not a bar; sign floor on the 287 mate corpus at d5 (distance reported). Regression net, not proof.
- **Value safety (d7):** bounds sound (deeper is better-informed; fail-soft kept; PVS instability tolerated by searchMove taking the re-search score); mate distances ply-restored, bounded by 264 plies << the 10 000 gap MATE_SCORE-MATE_FLOOR; null move stores nothing; in-path repetition and 75-move are the accepted graph-history inaccuracy, more often reached; **pre-root scan is a function of the key alone within one search on null-free paths** (a key equal to a pre-root key is reached by reversible moves only, so ply - halfmoveClock = -rootClock; start index fixed by parity), across a pass it reads nothing (graph-history class); abort never stores; depth field unchanged.
- **ABC-081 A1 revised (d8):** identity holds for the exact-depth table (deeper cutoffs off), on the pre-ABC-121 doors as today; with deeper cutoffs on, value change judged by d6 and C2', never identity. BA/PM writes the dated line on ABC-081.

## Falsifiers
F1 drift bar red either recursion (defect; fallback = cutoffs at null-window nodes only, new attempt). F2 any mate sign change on 190 or door-mate lost/flipped on 287 at d5. F3 repetition row red on shipped path unexplained by a re-pin, or probe moved above a repetition check. F4 fixed-depth-8 nodes > 0.95 x door on kiwipete or position-6, or G6 below base (not merged; "accepted, not in force"). F5 C2' NOT MET or S' collapse (same). F6 door not node-for-node the pre-ticket search on ABC-078 A3 corpus.

## The read ABC-238 owes (ADR-0056 D5)
Intent **GAIN**. C2': 100 games at 100 ms vs merge-base, >= 50.0/100, 0 faults, 0 time losses (50 ms margin). S': 10 games at 0.5 s vs SF19 E 1 650, >= 3.0/10 (else >= 7.0/20). Levels deep lane exit 0, every test passed (QE counts; EPIC-010 close read 57/57; ADR-0056's 41 is stale). R-TC item 2 at review. **100 ms sees it:** not depth-gated; null move (from remaining 2), LMR (from 3) and cross-ply/cross-iteration transpositions are live at the depth-6 median. Firing rate UNKNOWN - verify: the build reports deeper-settled share of probes at depth 6 on the 190 via the existing vi.mock call-through; under 1 in 100 => QE states the limit (report, not bar).
