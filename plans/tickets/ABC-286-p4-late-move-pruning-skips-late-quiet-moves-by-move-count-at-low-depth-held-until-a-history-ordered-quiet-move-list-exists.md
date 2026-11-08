---
id: ABC-286
title: "P4: late-move (move-count) pruning skips the late quiet moves at low remaining depth, by a move-count table, behind a test-only off-door pair. Held until a quiet-move order exists on main (history, ABC-283) and a joint probe with history as its input meets every bar"
status: done
column: Done
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "ADR-0072 ACCEPTED 2026-11-04 by the owner's word, OVER A MISSED PREMISE (OQ-0072-1, option (a); orch-2026-10-30a …3e73f9f9; Status line arch-owner-answers-1104b …88ca95bd). Form M3; L2 stays missed and F1 stays fired. Not in force until bundle 1 (ABC-303) merges on its read; on NOT MET, B6 returns it to PROPOSED, premise not met, and this page to held. (Was: PROPOSED, premise not met; arch-bundle-1.) 2026-11-08 (bapm-ABC-292-accept): delivered by ABC-303, merged 434fa171; ADR-0072 IN FORCE on main as a part of bundle 1 (ADR-0072 § Status, arch-ABC-303-b5 …28283e48); B6 did not fire"
---

# ABC-286: late-move pruning (P4)

> **DONE 2026-11-08: DELIVERED BY `ABC-303` (MERGED `434fa171`), by BA/PM** (task `bapm-ABC-292-accept`, records only, at `main` `6eaeee01`; nothing run). Source: the Orchestrator's
> ruling in the brief `bapm-ABC-292-accept`, item 5. P4 was built and read only as `ABC-303`, bundle 1, which merged at `434fa171` on QE's verdict `…ebefbfa2` (C2′ 55.5 / 100); `ADR-0072` is in
> force on `main` as a part of bundle 1, and B6 did not fire (`arch-ABC-303-b5` `…28283e48`). The credit is the bundle's: no reading isolates this part's share. Front matter reads Done, as
> `ABC-233`'s did for `ABC-283`. Nothing else on this page moves. The board card's move is the Orchestrator's.

> **`ADR-0072` ACCEPTED OVER A MISSED PREMISE (THE OWNER, OQ-0072-1, OPTION (a)); THIS PAGE STAYS A DESIGN PAGE; THE BUILD AND
> THE READ ARE `ABC-303`, 2026-11-04, by BA/PM** (task `bapm-bundle-1-cut`, records only, at `main` `3ad21218`; nothing run). Sources:
> the owner's word `orch-2026-10-30a` `…3e73f9f9`, `arch-owner-answers-1104b` `…88ca95bd` § 6 item 1, `ADR-0072` d1, d6, d8
> and d9, and `ADR-0056` D5's dated block, tables 1–3.
> - **This is an override, not a pass.** L2 stays missed and F1 stays fired. His word lifts L2's drift share, cap and audit
>   for bundle 1, and nothing else: L2's 0 mate sign changes, L3 and L4 stay bars.
> - **The build, the bars, the one read and the disposition are on `ABC-303`.** On NOT MET, B6 returns `ADR-0072` to PROPOSED,
>   premise not met, and this page to held.
> - **Lines changed:** `adr:`; scope 1; L0; L2; L4; DoR rows 4 and 10; the closing line.
> - **Not on this hop's list, and read with this block:** the title ("Held until…"), L5, F1's disposition and
>   § Dependencies' probe line. The blocks below this one are history.
> - **DoR 10/10 as a design page.** `ABC-303` carries the Ready state, as `ABC-283` did for its parts. The board move is the
>   Orchestrator's.

> **THE `adr:` LINE NAMES `ADR-0072`, PROPOSED, PREMISE NOT MET; EVERYTHING ELSE WAITS ON THE OWNER'S ANSWER, 2026-11-04,
> by BA/PM** (task `bapm-lines-1104b`, records only, at `main` `732a0cea`; nothing run). Sources: `arch-bundle-1`
> `…37b7fb23` and the Orchestrator's `orch-2026-10-30a` `…878035ca` 4.
> - **The joint probe has run.** Form M3 is carried by Rule B. On its own door it meets L3 and L4 and misses **L2**: drift
>   93.58 % / 94.12 % (≥ 95 %), 80 / 79 cp (≤ 75); audit 15.27 % (≤ 0.5 %), 29 errors ≥ 200 cp (0). **F1 fired.**
> - **Open: OQ-0072-1,** one answer with OQ-0073-1, (a), (b) or (c) (`EPIC-011` § Owner questions). (c) is the default
>   without an answer. The build does not start without his word.
> - **Waiting on his answer, and not written here:** DoR row 10's text; L2 and L4's numbers (`ADR-0072` d9); scope 1's
>   clauses (d1); L0's door; on (a), the bundle ticket. Lines below that still read "held on the joint probe" or "the
>   ADR is owed" are read with this block.
> - No bar moves. **DoR 9/10, Backlog, held, unchanged.** The board move is the Orchestrator's.

> **UNHELD FOR ITS PROBE 2026-11-04: `ABC-283` MERGED (`58e90d07`), by BA/PM** (task `bapm-ABC-283-done`, records
> only, at `main` `fd6b595f`; nothing run). Source: the Orchestrator's disposition `orch-2026-10-30a` `…2409cec9` 5
> and the Architect's owed lines (`arch-ABC-283-accept` `…cbf0bc7b` § Owed, item 4).
> - **The first half of the re-open trigger is met:** a quiet-move order is on `main`, `ADR-0063`'s history table with
>   K3 (max(0, h)), ACCEPTED as a bundle and in force at the merge.
> - **What still holds it:** the Architect's pre-registered joint probe with history as its input (`ADR-0063`
>   decision 11) meeting every bar, and the ADR. The probe may now run. DoR row 10 stays ❌ on the probe and the ADR
>   only. **DoR 9/10, Backlog.** The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog, HELD** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 2,
> stub row P4.
> - **Hold:** without a quiet-move order it prunes generation-order moves. Measured alone on `main` (`ADR-0061`
>   § Alternatives): 0.64–0.97× at depth 8 and +0.34 to +0.50 ply at 47 000 nodes, but only 87.7–89.3 % within 25 cp,
>   11.5–11.9 % audit flips with piece-sized errors, and the depth-1 form costs nodes on position-6.
> - **Re-open trigger:** `ABC-283` merges (the history table, `ADR-0063`, on `main`), then the Architect's
>   pre-registered joint probe with history as its input (`ADR-0063` decision 11) meets every bar. If `ABC-283`
>   misses, this stays held: O1h stays parked, and no other quiet-move order is on record.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game; the deeper the search, the more it pays.
- **Pain:** at low remaining depth every quiet move is searched, however late, unless futility (`ADR-0061`) drops it on
  the static margin. The late quiet moves of a low node rarely raise alpha.
- **Value:** `ADR-0056` D2 row P4 estimates **+20–40 Elo** (an estimate, [B] 7.5, about +30). Not a reading.

## Scope

The ADR governs each line.

1. ~~At null-window nodes of low remaining depth, a quiet move past a move-count threshold by depth is skipped. The
   depths, the counts and the exclusions are the ADR's (futility's exclusions in `ADR-0061` are the nearest
   precedent).~~ *2026-11-04 (`bapm-bundle-1-cut`; `ADR-0072` d1, d2):* at a node in either recursion where every condition holds:
   - it is not the root (`ply > 0`);
   - it was entered with a null window (`alphaIn + 1 === beta`);
   - the remaining depth d is 1, 2 or 3;
   - alpha and beta are both strictly inside (−`MATE_FLOOR`, `MATE_FLOOR`);
   - the side to move is not in check;
   - the side to move has at least three non-pawn pieces (`NULL_MOVE_MIN_PIECES`, the null move's guard).

   Then, once **T[d] quiet moves have been searched** at the node (T = 4 / 7 / 12 for d = 1 / 2 / 3), every later move in
   the ordered list whose ordering key is 0 and that neither captures nor promotes nor gives check is skipped: not made,
   not searched, not counted as a node. A skipped quiet move does not count as searched, and neither does a futility skip.
   A quiet move that gives check is searched and counts. The index still advances past a skipped move. The node returns
   the best score among the moves searched and stores it as today.
2. The quiet moves are ordered by history (`ABC-283`) when the rule acts, so the skipped moves are the low-history
   ones.
3. One switch and a test-only off-door pair (`ADR-0026` d10). Older doors turn it off.

## Out of scope

- A history term in LMR (`ABC-284`), countermove ordering (`ABC-288`), any change to futility's margins.

## Acceptance criteria

The ADR fixes exact counts and bars before Ready. None is loosened after Ready.

- **L0 (identity):** ~~switch off,~~ *2026-11-04 (`bapm-bundle-1-cut`; `…37b7fb23` § Owed 1; `ADR-0072` d6): **the all-off door,**
  `searchWithoutQuietBundle` / `chooseMoveWithoutQuietBundle`:* node counts equal `main`'s exactly; every pre-ticket door
  reproduces its counts (`G4`).
- **L1 (the rule):** units on the count table and on each exclusion, one row each.
- **L2 (drift and audit, ~~owed~~):** ~~a drift bar (share within 25 cp, a cap) and a cut audit (flip share, no piece-sized
  error), each a number the ADR sets on the joint probe.~~ These are the rows P4 failed alone. *2026-11-04 (`bapm-bundle-1-cut`;
  `ADR-0072` d8 (d), § Context; `ADR-0056` tables 1 and 3):*
  - **The numbers the probe was held to:** drift ≥ 95 % within 25 cp, ≤ 75 cp, 0 mate sign changes; audit flips ≤ 0.5 %, 0
    errors ≥ 200 cp. **Read on P4's own door:** 93.58 % / 94.12 %, 80 / 79 cp; 288 of 1 886 (15.27 %), 29 errors ≥ 200 cp.
    **Missed.**
  - **Under his lift:** the drift share and cap are **reported** (row R1) and the audit is **reported** (row R2). No verdict
    rides on them. What "reported" means is that block's: exact on an unmoved base, both sets in the PR on a moved one,
    no ceiling.
  - **L2's 0 mate sign changes stays a bar** (row S6).
- **L3 (safety, `ADR-0064` d7's list):** mate floor 0 violations; zugzwang 7 / 7 at recorded depths, none re-pinned;
  `G1` ≥ 54 / 58 with no NEWLY-missed line.
- **L4 (pay, ~~owed~~):** a fixed-depth node ratio on kiwipete and position-6 in both recursions and a reach gain at 47 000
  nodes~~, numbers the ADR's~~. *2026-11-04 (`bapm-bundle-1-cut`; `ADR-0072` d9; `ADR-0056` rows P3, P4):* **(a) d8 on P4's own door ≤ 0.89 × on
  each of the four; (b) reach at 47 000 ≥ door + 0.10.** Read 0.6039 / 0.8170 / 0.7509 / 0.8363 and +0.116. Met, and it stays
  a bar: the override does not reach it.
- **L5 (the read; `EPIC-011` § The per-change rule, by reference).** Intent named by the ADR before Ready (the epic
  and `ADR-0056` state none). C2′ ≥ 50.0 (GAIN) or ≥ 43.0 (NEUTRAL) of 100, S′ at E 1 810, the Levels deep lane.
- **L6:** `G6` "≥ base" (a search ticket).

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | the joint probe misses L2, L3 or L4 | stays held; no form is tuned after the read |
| F2 | L0 red | a defect in the wiring |
| F3 | L3 red on the build | a defect check first; if real, NOT MET |
| F4 | L5 NOT MET | not merged |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds; every run ≥ 6.
- **`NFR-008`** (≤ 10 s): units in the default lane; the probe rows in `SEARCH_DEEP`.
  - *2026-11-04 (`bapm-lines-1104`; `…f30bd604` 1): **a default-lane budget of ≤ +0.10 s for bundle 1 as a whole**
    (this ticket and `ABC-288` together, not each; named `…3b15b361` 3), read as the head-minus-base median wall.
    Aim, not a gate: the rows the bundle adds or changes sum to ≤ 90 ms in-thread, none added to `src/cli.test.ts`.
    Rows of ≥ 50 ms go deep. No new default-lane file.*
- **`NFR-009`:** no new table beyond the count table (bytes).

## Test notes

1. QE freezes the joint probe's set and the door counts before the build.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S** (`ADR-0056` D2). **Priority: P3**, held on `ABC-283`.

## Dependencies

- **`ABC-283` merged** (hard): the history table. Its single read decides it. *2026-11-04 (`bapm-ABC-283-done`):
  **met**, merged `58e90d07` (C2′ 66.0 / 100).*
- **The joint probe and the ADR** (the Architect's). DoR row 10.
- **One at a time on `src/search.ts` / `src/engine.ts`** with `ABC-284`, `ABC-285`, `ABC-287`, `ABC-296`, `ABC-297`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no move-count pruning; why it failed alone is measured; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–3 |
| 3 | INVEST | ✅ S; one rule |
| 4 | testable, measurable acceptance | ✅ L0 exact; L3 0 / 7 of 7 / ≥ 54; L5 ≥ 50.0 or ≥ 43.0. ~~L2 and L4 numbers owed with the ADR (row 10)~~ *2026-11-04 (`bapm-bundle-1-cut`): L2 reported under the lift, its 0 mate sign changes a bar; L4 ≤ 0.89 ×, reach ≥ door + 0.10* |
| 5 | dependencies known | ✅ `ABC-283`; the probe; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-005`, `NFR-008` ≤ 10 s, `NFR-009` |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ~~❌~~ ✅ ~~**held on `ABC-283` and the joint probe**~~ ~~**held on the joint probe**; the ADR is owed~~ *(2026-11-04, `bapm-ABC-283-done`: `ABC-283` merged `58e90d07`)* *2026-11-04 (`bapm-bundle-1-cut`): the joint probe is read: L2 missed, F1 fired and stays fired. OQ-0072-1 answered (a), so `ADR-0072` is ACCEPTED over a missed premise, not in force. Built and read only as `ABC-303`; on NOT MET, held again (B6)* |

~~**DoR 9/10. Backlog, held.**~~
**DoR 10/10 as a design page** (2026-11-04, `bapm-bundle-1-cut`). `ABC-303` carries the Ready state; this page is not pulled on its own. The
board move is the Orchestrator's. *2026-11-08 (`bapm-ABC-292-accept`): **Done, delivered by `ABC-303`** (merged `434fa171`).*
