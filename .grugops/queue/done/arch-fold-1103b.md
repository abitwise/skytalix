---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T11:02:09Z
subtask: arch-fold-1103b
role: architect-design
ref: .grugops/context/arch-fold-1103b/
branch: grugops/arch-fold-1103b — worktree .claude/worktrees/arch-fold-1103b (from main)
width: records only.
---
# ADR folds owed after arch-ABC-239 and bapm-E2pre-cut
1. ADR-0067: add the E2-pre (ABC-274) falsifier and disposition row (bapm …a193625d notes it is missing; needed before ABC-274 can be Ready). Record the Orchestrator ruling …690d3b30: ABC-274 exempt from S2 nps (reported only), G2 ≤ 1.05× and G6 "≥ base" graded. Note: F3's cut C1 on ABC-269 is incremental phase, NOT the packed score — say whether that changes ABC-274's recommended form.
2. ADR-0056: row E2 → ADR-0067; Q-3K-7 split (a)/(b)/(c) pending; D6 Phase 4 order ABC-269 → ABC-274 → ABC-239 → ABC-270/271, ABC-272 any (from …e4c34239 § 5).
3. ADR-0064: dated pointers at d4 and d6 to ADR-0067 (do not touch the F3 block written by arch-ABC-269-F3).
Owner items stay pending (ADR-0067 acceptance, Q-3K-7, B-T8, Q-3K-9). Fences: memory-bank/50-decisions + your records. No src. No push, force, amend, rebase, merge into main.
Publish: sealed notes (task arch-fold-1103b, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result; brief + claim to done/.

## Result
*Architect/Design, 2026-11-03T11:07:28Z. Records only, on `grugops/arch-fold-1103b` from `main` `239ac715`. Nothing run, built or timed. Not pushed, not merged.*

- **`ADR-0067` (+42 / −0):**
  - a Status bullet;
  - three Decision-log rows;
  - a dated d8 block: the ruling `…690d3b30` folded; the `G2` base and instrument; C1 against the packed form; an int16 range row as a condition on the packed form;
  - **row F8**, E2-pre's falsifier and disposition.
- **The `ABC-274` disposition row (F8):**
  - **Fires on:**
    - (a) A1 / A2 / A4 / A7: a node, score or move mismatch against the pre-ticket head, an `Object.is` miss, or a test expectation that has to move;
    - (b) A5: `G2` above 1.05 × the pre-ticket head (the mean of two sessions, `ADR-0031` d3);
    - (c) A6: a `G6` board's median depth below the pre-ticket head's, or any run below depth 6.
  - **If it fires:**
    - (a) is a defect: fixed first, never re-pinned.
    - (b) or (c) is a STOP to Architect/Design. One value-identical cut is allowed (the packed score if the build is not packed; otherwise the Architect names it), then one re-read of the bar that missed, under a PREREG sealed before it. A second miss means not merged. No value is tuned to pass, and no bar moves. `ABC-239`'s re-plan then needs a new dated decision and the owner's word for any bar it changes.
    - S2 nps is reported, never graded.
- **C1 against `ABC-274`'s form: no change. The packed score stays recommended, on a stronger reason.**
  - BA/PM's coupling clause does not fire, so the scope stays whole.
  - On `ABC-269`, one per-piece operation added to the walk cost about 7 %. An unpacked delta form adds one for every piece, so it is forecast to miss A5.
  - v8 / v9 packed the phase, not a table entry.
  - The packed form's cost is `UNKNOWN - verify`. A5 reads it.
- **`ADR-0056` (+52 / −0):**
  - a Status fold block;
  - D2: row E2 → `ADR-0067`; row E3 gets the king-table signal as information;
  - D6: Phase 4 `ABC-269` → `ABC-274` → `ABC-239` → `ABC-270` / `ABC-271`, with `ABC-272` in any order;
  - D7: Q-3K-7 split into (a) / (b) / (c), plus `ADR-0067` acceptance and B-T8, all pending.
- **`ADR-0064` (+6 / −0):** dated pointers at d4 and d6. The F3 block is untouched.
- **Notes** (sealed via `admitAndAppend`; contextRoot = this worktree's `.grugops/context`; 2 of 2 read back): `20261103T110658Z-architect-design-decision-e16881f5` and `20261103T110658Z-architect-design-observation-b20aa1c0`. Trace row appended.
- **Commits:** records `70067ae6`. This Result and the move to done/ are in the closing commit.
- **Owed:**
  - **BA/PM:** `ABC-274` page fold lines: DoR row 10's falsifier half is met (the row stays ❌ until `ABC-269` merges); S2 is ruled; the coupling is resolved; the int16 range row; the A5 base and instrument wording.
  - **Owner, pending:** `ADR-0067` acceptance, Q-3K-7 (a) / (b) / (c), B-T8, Q-3K-9.
