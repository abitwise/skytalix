---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T22:59:12Z
subtask: arch-epic011-phase1
role: architect-design
ref: .grugops/context/arch-epic011-phase1/
branch: new grugops/arch-epic011-phase1 from main (worktree .claude/worktrees/arch-epic011-phase1)
width: records only, beside arch-adr0057-fix (ADR-0057/0056 only — do not edit those).
---
# Architect: EPIC-011 Phase 1 design — T1 (ABC-238) and T2 (ABC-237)
## Read
EPIC-011 (Phase 1 rows 3–6, C-rows, § The per-change rule); ADR-0056 (D5 100-game GAIN/NEUTRAL read at 100 ms, smoke at 0.5 s, R-TC, Levels lane per strength ticket; "changes that only act deep" note); ADR-0025 (TT) and its d4; ABC-081 (A1); plans/tickets/ABC-238*, ABC-237*, ABC-257*, ABC-258*; src/transposition.ts, src/search.ts as they are on main.
## Do
1. Write the ADR (new, or an amendment — your call) that revises ABC-081 A1 so a deeper stored entry may cut off a shallower search (T1), with value-safety analysis (mate scores, bounds, repetition/50-move interaction, the pre-root repetition scan), and its falsifiers.
2. Write the ADR-0025 amendment for depth-preferred replacement (T2).
3. State the read each ticket owes under ADR-0056 D5 (GAIN bar, smoke, Levels lane) and whether 100 ms (depth ~6) can see the effect; if not, what the ticket's design names.
4. Say what ABC-238/237 DoR row is now met, so BA/PM can move them to Ready. Note any ADR-0057 coupling (shared-table layout) without deciding it.
## Fences
memory-bank/50-decisions/ (new ADR and ADR-0025 amendment only), your notes. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-epic011-phase1, contextRoot = worktree's .grugops/context, never the plugin cache; queue moves inside your worktree), commit, ## Result + trace row, brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-epic011-phase1` from `main` `13627d0f`. Records
  only. Nothing was run, built or timed.
- **T1 (`ABC-238`):** new **`ADR-0058`**, PROPOSED, the owner's to accept (it is a new ADR).
  `memory-bank/50-decisions/ADR-0058-a-deeper-stored-entry-may-cut-off-a-shallower-search-behind-a-test-only-off-door-pair-and-abc-081-a1s-identity-binds-the-doors-that-predate-it.md`.
  - **The rule:** stored depth ≥ requested depth settles a node, with the bound rules unchanged. The root never cuts.
    The repetition checks stay ahead of the probe.
  - **The doors:** a `deeperCutoffs` switch with an off-door pair in both recursions (`ADR-0026` d10, `ADR-0050`
    form). Every older door turns it off.
  - **`ABC-081` `A1` revised:** the identity binds the exact-depth table, on the doors that predate `ABC-121`, as
    today. On the shipped path, a value change is judged by a bounded oracle and C2′.
  - **Value safety:** bounds, mate scores (bounded at 264 plies), graph history, the pre-root scan (a function of the
    key alone within one search on paths without a null move), abort, depth field.
  - **Falsifiers:** F1–F6.
- **T2 (`ABC-237`):** an **`ADR-0025` amendment** of decision 2's replacement bullet, PROPOSED, the owner's.
  - **The rule:** a store writes the slot when it is empty, holds the same key, or holds another position whose stored
    depth ≤ the new depth. Otherwise the store is dropped.
  - **The doors:** a `depthPreferred` switch with an off-door pair. No bits and no arrays are added, and the table is
    still cleared per search.
  - **Falsifiers:** T6 and T7 are new; T2 and T5 are re-read.
- **The reads (`ADR-0056` D5):** both tickets declare intent GAIN. Each owes C2′ (≥ 50.0 of 100 at 100 ms), S′ at E 1 650
  and the Levels deep lane, and R-TC item 2 is read at review.
  - **T1 fires at 100 ms** (null move, LMR and transpositions are live at depth 6). Its firing rate is reported by a
    test-side count.
  - **T2 barely fires at 100 ms:** at most 8.5 % of stores collide (arithmetic from `…1889e3b0`). Its limit is stated,
    and its mechanism evidence is `A3`. No 500 ms read is recommended.
- **DoR:**
  - **`ABC-238` row 10 is met** under reading (b), so the ticket is 10/10.
  - **`ABC-237` row 10:** the ADR half is met. The `ABC-238` sequence hold remains, and BA/PM scores it.
- **Coupling named, not decided:** `ADR-0057` (layout-neutral; read-compare-write under a lockless table; age bits only
  from the depth field); `ABC-257` (three re-reads); `ABC-236` (instability).
- **Commits:** claim `264461ba`; ADRs + notes `e220e7c0`. This Result, the trace row and the move to done/ are in the
  closing commit.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` 2026-11-01T23:09:52Z
  from `date -u`; each reads back sealed):
  - decision `20261101T230952Z-architect-design-decision-2c2c1df6` (T1);
  - decision `20261101T230952Z-architect-design-decision-3209a6d0` (T2);
  - observation `20261101T230952Z-architect-design-observation-1dcdd8c7` (DoR, wording deltas, couplings, the open
    question).
- **For the Orchestrator:**
  - Take both acceptances to the owner: *"accept ADR-0058"* and *"accept the ADR-0025 T2 amendment"*.
  - Open question, the owner's if asked: may T2 and T4 be read on the NEUTRAL bar?
  - BA/PM owes the wording deltas named in the observation note and the dated `ABC-081` line.
  - A QE hop on these records is owed.
