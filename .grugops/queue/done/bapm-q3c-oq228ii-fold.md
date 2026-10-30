---
subtask: bapm-q3c-oq228ii-fold
role: ba-pm
ref: .grugops/context/bapm-q3c-oq228ii-fold/
branch: new grugops/bapm-q3c-oq228ii-fold from main, own worktree
---

# BA/PM: cut the Q3 (c) ticket; fold OQ-228-1 (ii) into ABC-228; fix EPIC-010

Source: the owner note `orch-2026-10-29g/…c4ab73de`, and the Architect's `arch-q3c-oq228ii/…b86f7d93` (with the
ADR-0020 § AMENDMENT 2026-10-30 and ADR-0053 decision 10 on main).

## Do
1. **Cut the Q3 (c) ticket** (next free id after ABC-240): S, P2, EPIC-010 M1, value-changing (10 D + 10 R smoke with
   the repetition-ending count), waits on ABC-230's merge. Scope C1–C4 from the amendment. Its acceptance comes from
   the tests the amendment lists, including `turn-loop.ts` claimShortfall counting the same list. DoR scored.
2. **Fold (ii) into ABC-228:** the re-forecast at 4 000 ms with its ≤ 133 % bar (above → back to the owner); the
   conditional G9 waiver on LEVELS[5] only; G5, G6 and G11 under (ii); the trend-pool close and the 4 000 ms batches. Decide and
   record which ticket carries the `tools/rating/rating.ts` R literal 3000 → 4000 (only on a miss; it must land before
   ABC-228's R smoke). Note that ABC-225 is Blocked (thermal), so ABC-228 is likely the carrier. List the re-reads the
   ADR names.
3. **EPIC-010:** Q3 answered (c) (Out of scope ep line, § B item 3, owner-questions table, ticket table); the header
   line that still says "pending the owner" → (ii).

## Fences
- plans/epics, plans/tickets and your context only. No ADR, src/, tools/, data/ or board edits. An SE is building ABC-230
  in parallel: don't edit the ABC-230 page.
- Never push, force, amend or rebase. Never merge into main. No host paths. Never bare `npx`.

## Publish
- Seal notes (task `bapm-q3c-oq228ii-fold`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/.

## Result

*BA/PM, 2026-10-30, task `bapm-q3c-oq228ii-fold`; records only, at `main` `7b8eeb94`. Branch `grugops/bapm-q3c-oq228ii-fold` @ `a9cd0a02` (records), this brief move on top.*

- **`ABC-241` cut** (`plans/tickets/ABC-241-a-repetition-against-the-games-earlier-positions-ignores-an-ep-square-no-pawn-can-legally-take.md`): the repetition key, `ADR-0020` § AMENDMENT 2026-10-30 C1–C4. S, P2, milestone 1 (order 9), value-changing. A1 helper rows; A2 hash rows unedited; A3 the `1.e4` line (threefold at 5.Ng1, base 7.Ng1; fivefold at 9.Ng1, base 11.Ng1; `claimShortfall` "2 of 3" after 3.Ng1; legal-ep twin keeps base); A4 prior keys score exactly 0 on CLI and UCI; A5 CLI list = UCI list, blunder root key; A6 identity; A7 consistency; A8 fences; A9 `G4`/`G8`/`G9`/`G10`; A10 the smoke pair with the repetition-ending count. **DoR 9/10, Backlog** until `ABC-230` merges (row 10), then 10/10 Ready with no further BA/PM hop unless that merge moves the seams.
- **`ABC-228`** (FOLDED block): (ii) conditional on an `A8` miss. Scope 5 (level 5 and `DEFAULT_BUDGET_MS` to 4 000 ms, pins, the `rating.ts` R literal); `A8`'s miss branch builds it; **`A9` (new)** re-forecast at 4/3 of base's time, bar ≤ 133 %, above it back to the owner; `A5` `G5` ≤ 4 s, `G6` head 4 000 v base 3 000, `G11` at 4 s, `G8` real-clock rows, **`G9` waived on `LEVELS[5]` only**; `A6` R smoke from the candidate head, never compared with a 3 000 ms reference, trend pool closes at the merge; Test note 4 (batches both sides at 4 000 ms); NFR text; § Follow-ups (the ADR's re-reads with owners) and § Rollback. **DoR stays 10/10, Ready.**
- **The `rating.ts` R literal (3000 → 4000) is `ABC-228`'s**, in the same merge, before its R smoke. `ABC-225` is Blocked and unmerged. `ABC-225`'s branch adds `rpair`'s own `budget: 3000`; a dated line on its page moves it to 4 000 when it rebases onto (ii).
- **`EPIC-010`**: header block; "pending the owner" → (ii); "Q3 still open" → (c); § B item 3 row; § Out of scope (ep line struck, `G9` line carries the conditional exception); owner-questions heading and Q3 row; tickets table (`ABC-228` waits-on; row 9 `ABC-241`; 10–17 renumbered); milestone 1 row 9 and re-cost ≈ 16 h; batch list, § Scope count, § Dependencies, `RISK-EPIC010-04`.
- **Notes** (sealed via the plugin's `admitAndAppend`; `propose_note` not available): `20261030T045127Z-ba-pm-decision-0d7e33ff`, `20261030T045127Z-ba-pm-observation-1ff9828b`.
- **Checks:** `node tools/grugops/reference-check.js` on the four pages: "No findings.", exit 0. Host-path scan of the diff and notes: 0 hits.
- **Left by fence:** the `ABC-230` page still says Q3 is open and (c) "would be a separate ticket" (stale; fold after `ABC-230` merges). `EPIC-010`'s table still shows `ABC-235`/`ABC-240` in old columns (board is live state).
- **No** `src/`, `tools/`, `data/`, ADR or board edits. Nothing pushed or merged.

### Trace row (10 cells, header order)

| ABC-241 (cut) + ABC-228 (fold) | Q3 (c): repetition key drops an uncapturable ep file in the game-end count and the prior keys, hash unchanged (ADR-0020 § AMENDMENT 2026-10-30 C1–C4); OQ-228-1 (ii) folded into ABC-228: on an A8 miss level 5 → 4 000 ms, A9 ≤ 133 %, G9 waived on LEVELS[5] only, rating.ts R literal carried by ABC-228 | EPIC-010 | — | NFR-002 (< 16 ms, one hasLegalEnPassant per double push), NFR-005 (ABC-241 node-equal; ABC-228 referent 4 s under (ii)), NFR-004 (≤ 4 s at default under (ii), 5 s ceiling), NFR-008; ADR-0020 amendment, ADR-0053 d10; notes …0d7e33ff, …1ff9828b | grugops/bapm-q3c-oq228ii-fold @ a9cd0a02 (records only): plans/tickets/ABC-241-…md (new), ABC-228-…md, ABC-225-…md (one line), plans/epics/EPIC-010-…md, .grugops/context/bapm-q3c-oq228ii-fold/notes/ (2) | none run (records only); reference-check No findings | — (UAT owed at each build; QE verdict signs) | — | ABC-241 Backlog DoR 9/10 (waits ABC-230 merge); ABC-228 Ready 10/10 |
