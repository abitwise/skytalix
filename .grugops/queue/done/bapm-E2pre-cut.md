---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T10:51:36Z
subtask: bapm-E2pre-cut
role: ba-pm
ref: .grugops/context/bapm-E2pre-cut/
branch: grugops/bapm-E2pre-cut — worktree .claude/worktrees/bapm-E2pre-cut (from main)
width: records only.
---
# Cut E2-pre; align ABC-239 to ADR-0067
arch-ABC-239 (ADR-0067 PROPOSED; decision …e4c34239 § 5 lists the owed lines; results …48ae6a93).
1. Cut **ABC-274 E2-pre**: src/evaluate.ts blends every term's mg/eg halves (value-identical at E1's values: same scores, same node counts); bars G2 ≤ 1.05×, G6 "≥ base" (not an evaluation-value change — Q-3K-4 (b) does not apply unless ADR-0067 says so), no games; waits ABC-269 merged + ADR-0067 acceptance. Size S, P2. DoR as the evidence supports.
2. ABC-239 page: apply …e4c34239 § 5 (A1 data under ADR-0048 with Q-3K-7 (a)/(b)/(c) pending; A2 cross-entropy below base, split by opening; A3/A4 hold once ABC-274 merges; DoR row 10; dependencies ABC-269 → ABC-274 → ABC-239; GAIN intent; test note 1; ABC-215 A2 provenance check). Mark owner items pending — do not assume answers: ADR-0067 acceptance, Q-3K-7 (a) Lichess CC0 training (rec. yes), (b) Stockfish-labelled set (rec. no), (c) games vs Stockfish (rec. no), B-T8 outside 200+200 pair ~5 h (rec. yes).
3. EPIC-011: Phase 4 rows and order (ABC-269 → ABC-274 → ABC-239 → ABC-270 / ABC-271; ABC-272 any order); owner-questions table: Q-3K-7 split (a)/(b)/(c), ADR-0067 acceptance, B-T8; the king-table finding (fits weight king tables ~3× lighter — supports ABC-270's premise).
Fences: plans/tickets, plans/epics/EPIC-011*, plans/traceability.md + your records. Not board.md, ADRs, src. No push, force, amend, rebase, merge into main.
Publish: sealed notes (task bapm-E2pre-cut, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result; brief + claim to done/. Return the proposed Backlog line.

## Result
- **By:** BA/PM (claude-opus-5-5), on branch `grugops/bapm-E2pre-cut` from `main` `0b87f2d5` (`src/` tree `58fa3eb4`). Records only, in `plans/` and this task's context. Nothing run, built or timed except the note seal, under the host lock. Not edited: the board, ADRs, `src/`, tests, `memory-bank/`.
- **`ABC-274` (E2-pre), cut:** every term enters the blend, value-identical at E1's table. Size **S**, priority **P2**, `EPIC-011` Phase 4 between E1 and E2. Intent: none, because it is value-identical. No games.
  - **Bars from `ADR-0067` d8:**
    - A1 node identity: B0's 11 readings exact, plus the 190 cross-build (nodes, score, move) at 0 mismatches against `main` with `ABC-269` merged;
    - A2 `Object.is` on `G3`, the taper corpus and the 190;
    - A4 `G3`;
    - A5 `G2` ≤ 1.05 ×;
    - A6 `G6` "≥ base", graded, with every run ≥ 6. `Q-3K-4` (b) does not apply (`ADR-0056` D7);
    - A7 0 test expectations moved;
    - A8 no games, R-TC read at review.
  - **A3 (BA/PM's row):** every term family's endgame half is blended, exact against the formula on an offset table. `ADR-0067` d8's bars would pass a blend that ignores the new halves.
  - `src/evaluate-params.ts` is byte-unchanged. No switch or door.
  - **DoR 9/10, Backlog.** Row 10 ❌: `ABC-269` is not merged (F3 fired; `arch-ABC-269-F3`), and the Architect owes an E2-pre falsifier / disposition line in `ADR-0067`, which has none. *"accept ADR-0067"* gates the merge only (reading (b)), pending.
  - **Open, the Orchestrator's:** S2 nps. BA/PM recommends the `ABC-265` exception. The default is reported with no speed bar.
- **`ABC-239`:** `…e4c34239` § 5 applied.
  - A1 → B-T0: own games by default; Lichess only on the owner's recorded yes.
  - A2 → B-T2: an opening split, cross-entropy < 1.000 ×. The page said "≤"; the ADR's stricter "<" governs, and this is recorded on the page.
  - A3 / A4 hold once `ABC-274` merges (B-T4). A5 → B-T5 / B-T6. A6 → B-T7 / B-T8.
  - Intent GAIN. Test note 1. The `ABC-215` A2 provenance row. One tool module. Dependencies `ABC-269` → `ABC-274` → `ABC-239`. DoR rows 3 / 5 / 6 / 10 dated.
  - **DoR 8/10, unchanged.** Priority stays P3; raising it at the pull is the Orchestrator's call.
- **`EPIC-011`:**
  - a top block;
  - § Phases: E2-pre row new; E2, E3, E4 and E7 rows dated;
  - § Tickets: row 12, row 26 (new), rows 22–24, the id line;
  - § Owner questions: Q-3K-7 split into (a) / (b) / (c), plus `ADR-0067` acceptance and B-T8, **each pending** with the recommendation and the default;
  - § Dependencies: the order line and the stall clause;
  - `RISK-EPIC011-12`: the own-games pull may be too small to read;
  - the "Open owner calls" line.
- **`ABC-270` / `ABC-271`:** dated order lines. `ABC-270` also gets the king-table finding as supporting information.
- **The king-table finding, corrected against the brief:** the fits scale the king tables **up** about 3 × (D4 king mg −178 against `KING_TABLE`'s −50). So the rule tables are about 3 × too light. The brief's wording, "fits weight king tables ~3× lighter", is the inverse.
- **Notes** (sealed via `admitAndAppend`; contextRoot = this worktree's `.grugops/context`; `at` from the UTC clock; 2 of 2 read back): decision `20261103T110035Z-ba-pm-decision-a193625d`; observation `20261103T110035Z-ba-pm-observation-36f388c6`.
- **Commits:** claim `3b036285`; pages `fde77e1b`. This Result, the notes, the trace row and the move to done/ are in the closing commit. Not pushed, not merged.
- **Proposed Backlog line:** `- [ABC-274] E2-pre: every term enters the blend, value-identical at E1's table (same scores, same node counts; packed score recommended; no games) (EPIC-011 Phase 4; size: S, priority: P2, DoR 9/10; value-identical; bars node identity + G2 ≤ 1.05× + G6 ≥ base graded; waits ABC-269 merged + Architect's E2-pre disposition line in ADR-0067; merge waits "accept ADR-0067" (pending); S2 ruling owed) **cut 2026-11-03 (bapm-E2pre-cut)**`
- **Open:**
  - **Owner, pending:** `ADR-0067`; Q-3K-7 (a) yes?, (b) no?, (c) no?; B-T8 yes?
  - **Architect:** the E2-pre disposition line in `ADR-0067`; the `ADR-0056` folds (E2 row, Q-3K-7, D6); the `ADR-0064` d4 / d6 pointers.
  - **Orchestrator:** the board line and the S2 ruling.
