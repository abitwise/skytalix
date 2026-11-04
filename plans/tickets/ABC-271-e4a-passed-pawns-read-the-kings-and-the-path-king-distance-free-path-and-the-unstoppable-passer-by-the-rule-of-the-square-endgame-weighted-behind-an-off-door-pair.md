---
id: ABC-271
title: "E4a, structure only: passed pawns read the kings and the path. Three endgame terms (king distance to the queening square, a free path, and the unstoppable passer by the rule of the square) enter the evaluation with every value 0, computed outside the pawn memo, so the build is value-identical and node-identical to main, with no switch, no doors and no games; the second tuning pull fits king distance and free path and holds the unstoppable passer at 0 (ADR-0070)"
status: done
column: Done
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "ADR-0070: ACCEPTED 2026-11-04 by the owner (form (a), structure only; \"a\", orch-2026-10-30a …e8a3b5df, on the Orchestrator's ruling …e0ff0aeb); restated ACCEPTED by arch-ADR-0070-accept (…212d6a4c, merged 139d5cfa). In force from this ticket's merge. Was PROPOSED (arch-ABC-271 …bbc0a213; PREREG …eeb25cc6 at 029533f0; addendum …3a9eba86 at 904b3fff; text of record 01d2434b): the rule values judged on play, with P0–P8; not taken. Rides ADR-0064 (E1) and ADR-0067 (the tuner)"
---

# ABC-271: passed pawns that know about the kings (E4a, structure only)

> **STRUCTURE ONLY, BY `ADR-0070` (ACCEPTED, FORM (a)); DoR 10/10, READY; SIZE M → S, 2026-11-04, by BA/PM** (task
> `bapm-ABC-271-ready`, records only, at `main` `7968c97f`, `src/` tree `4fb3da04`; nothing run). Sources: the
> owner's *"a"* (`orch-2026-10-30a` `…e8a3b5df`), `ADR-0070` (merged `139d5cfa`), the Architect's owed lines
> (`arch-ADR-0070-accept` `…212d6a4c` § 5) and the Orchestrator's rulings on them (`…730399e5`). Each is applied below.
> - **Title:** it drops "behind an ADR-0026 test-only off-door pair" and names the structure-only form. The file name
>   keeps the as-cut slug, because sealed notes cite the path (`ADR-0070` keeps its own slug for the same reason).
> - **Intent GAIN is struck.** There is no intent class and no read, because the build is value-identical. The firing
>   figure (29.75 % of positions ≥ 10 cp at 100 ms, at the probed values) is history and a forecast for the second pull.
> - **Scope:** 1–3 stand as rules with every value 0, and each comment records its rule as the prior. Scope 3's value
>   is 0; the rule value 400 is not shipped (`ADR-0070` d7). Scope 4: the memo is 576 KiB. **Scope 5 (the switch and
>   the door pair) is struck.** The seam `passerTermsForTest` stays, and only test files call it.
> - **Acceptance: `ADR-0070` d5's K0–K4 replace P0–P8. Falsifiers: `ADR-0070` F1–F5 replace F1–F6.** The as-cut rows
>   are kept unedited under § As cut. No games.
> - **The door reading** (Orchestrator `…730399e5` item 1): no new switch or door pair. "The door pair" means that
>   every existing door reads its pre-ticket counts (K0).
> - **QE freezes K1 (a)'s passer positions and K1 (c)'s fixtures before the build** (test note 1). UAT is owed, and the
>   QE verdict signs it (test note 3).
> - **Order:** this ticket comes before the second pull, whose fit is taken on a `main` that contains it. U is held at
>   0 there (`…730399e5` item 2).
> - **Size M → S. DoR 9/10 → 10/10** (row 10: `ADR-0070` is written and accepted). The front matter goes to Ready,
>   which is BA/PM's exit. The board is the Orchestrator's.
> - **Not on this page:** the `EPIC-011` E4 / E2 / Phase-4 lines fold into the next `EPIC-011` cut task (`…730399e5`
>   item 4; `bapm-W1-bundle-cut` holds that page). Whether S2 nps is reported is the Orchestrator's ruling, still open.
> - **Flagged, not a wait of this ticket:** `ADR-0070` d1 says `tools/tune` "reads and writes them unchanged". On
>   `main`, the tracer reads named exports only, and the emitter writes a fixed list of 13 value exports that does not
>   name the four new ones (§ Dependencies). That is the second pull's tool work. `UNKNOWN - verify`.

> **NEXT, AND BEFORE A SECOND TUNING PULL, 2026-11-04, by BA/PM** (task `bapm-ABC-239-close`, records only, at `main`
> `ac55ddf6`; nothing run). `ABC-239`'s first pull closed NOT MET (`orch-2026-10-30a` `…4c76bf7a`). The Architect traced
> its F4 miss (`zugzwang.001`, e1e5 at depth 9) to the fitted endgame halves of the pawn, passer and king terms, and
> found that the passer part needs this ticket's free-path and king-distance terms (`arch-ABC-239-f3f4` `…4eae0fd3`,
> `…69f22167` § 1). The Orchestrator orders this ticket next, in design now (`arch-ABC-271`). See § Dependencies. **No
> bar on this page moved. DoR stays 9/10** (row 10: the ADR).

> **`ABC-269` MERGED, 2026-11-03, by BA/PM** (task `bapm-269-done`, records only, at `main` `128e3c6c`; nothing run).
> `ABC-269` (E1) merged to local `main` at `54dee3f2` (QE PASS_WITH_GAPS `qe-ABC-269` `…eff2fe64`), so this page's wait
> on that merge is **met**. DoR stays 9/10: row 10 now waits on the ADR alone. Order unchanged: after `ABC-274` and
> `ABC-239` (`EPIC-011` § Dependencies).

> **Cut 2026-11-03 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-cut`, records only, at `main` `17725732`; nothing
> run, built or timed). Source: the owner's *"Analyze and create tickets under EPIC-011"* and this task's gap analysis
> (`EPIC-011` top block of 2026-11-03). **Rank 2 of the uncut items.**
> - **`EPIC-011` Phase 4, row E4, first slice.** It takes `ABC-232`'s "any other passer term" (closed 2026-11-02 as
>   merged into `ABC-269` and E4). Connected / phalanx and backward pawns stay in the E4 stub (E4b, weights from the
>   tuner).
> - **Intent: GAIN (≥ 50.0 of 100)** unless the ADR's firing figure at 100 ms shows the terms barely fire. Then the ADR
>   names "NEUTRAL (invisible at 100 ms)" with its own measured bar, before Ready, under `ADR-0056` C2′'s 2026-11-02
>   line. Never re-classed after a score is seen.

## Problem

- **User:** the owner at level 5, in every ending with a passed pawn.
- **Pain:**
  - Passed pawns are scored by rank only (`PASSED_PAWN_BONUS`). E1 doubles the endgame half by rank (`ADR-0064` d3),
    still blind to whether a king can catch the pawn, whether its path is blocked, or whose king is nearer.
  - In a pawn ending a passer outside the enemy king's square promotes by force. A depth-6 search (the 100 ms median,
    `qe-tc-depth-probe`) sees that only when the race is short.
- **On the evaluation instrument** (information only): 8 of the 25 persistent errors on the 123 unique positions
  have a passed pawn on the board; 2 have one on rank 5–7. E1's form fixes 1 of the 25 (this task's
  re-classification). Weak support, stated as such.
- **Value:** E4's row is +20–60 Elo for the whole of pawn and passer terms (`ADR-0056` D2, an estimate). This slice
  (king distance, free path, unstoppable) is **+10–30 (BA/PM estimate, not a reading).**
  - *2026-11-04 (`bapm-ABC-271-ready`; `ADR-0070`):* **this ticket alone moves no Elo, because the build is
    value-identical.** Its value is the feature class the second pull fits: king distance and free path, the
    features whose absence `ADR-0067` F4's cause names (`zugzwang.001`). On `main`'s table at the probed values, FP
    alone widened that row's depth-9 margin from 29 to 87 cp. The +10–30 above is a forecast for the second pull's
    read, which judges both.

## Scope

The ADR governs each line; every value comes from a rule it states (`ABC-215`).
*2026-11-04 (`bapm-ABC-271-ready`; `ADR-0070` d1–d4): every term below lands at 0. Each rule stands as the prior in
its comment ("start (prior): 0. The rule (below) was probed and not shipped (`ADR-0070`)"), and a data row pins
every E4a middlegame half at 0. R is the passer's own rank index (1–6), d the Chebyshev distance, Q the queening
square.*

1. **King distance, endgame half only:** for each passer, a term in the two kings' distances to its queening square
   (the rule, the distance metric and the rank weighting are the ADR's). Its middlegame half is 0, so at phase 24 the
   evaluation equals `ABC-269`'s exactly.
   *2026-11-04:* the rule is eg += `PASSED_KING_ENEMY[R]` × min(d(enemy king, Q), 5) − `PASSED_KING_OWN[R]` ×
   min(d(own king, Q), 5). Both arrays are by rank, `{ mg, eg }` pairs, **every half 0**.
2. **Free path, endgame half only:** a passer whose squares ahead are empty gets a bonus by rank (the ADR's rule).
   *2026-11-04:* eg += `PASSED_FREE[R]` when every square ahead, up to and including Q, is empty. A piece of either
   colour blocks, a king included. Attacked squares are not read. **Every half 0.**
3. **The unstoppable passer:** in a pawn ending (phase 0), a passer outside the defending king's square, with the side
   to move counted, is scored by ~~a stated value below a queen~~ *(2026-11-04)* **`PASSED_UNSTOPPABLE`, 0; the rule
   value 400 is not shipped (`ADR-0070` d7).** The rule: phase 0, a free path, and moves < d(defending king, Q) − (1
   if the defender is to move), where moves = 5 from the start rank and 7 − R otherwise. It is added once per side.
4. **Where it is computed:** the pawn memo is keyed by the two pawn masks (`ADR-0064` d5), so king-dependent and
   piece-dependent parts sit outside it. The ADR states the cost.
   *2026-11-04 (`ADR-0070` d2, d3):* `pawnStructure` also records, per side, the frontmost passer of each file (a
   24-bit word), and the memo stores the two words. **The memo grows from 448 to 576 KiB** (2^14 × 36 bytes). One loop
   over the files runs after the walk, when w < D and a passer exists. It reads the king squares the walk already
   found. The cost is paid in full at 0, with no zero-value fast path.
5. ~~**One switch and a door pair** (`ADR-0026` d10's pattern); every older door turns it off. Rows by reference
   (`ADR-0064` d7's list); no zugzwang depth is re-pinned.~~ *2026-11-04:* **struck** (`ADR-0070` d4; `ADR-0068` d4:
   a door would reproduce a path that does not differ). **One test-only seam, `passerTermsForTest(position)`,**
   returns each side's three eg parts at the parameters in force (the `kingExposureForTest` precedent, so it reads
   the table set by `withParametersForTest`). Only test files call it. No zugzwang depth is re-pinned.

## Out of scope

- Connected / phalanx, backward and candidate passers (E4b, under the tuner). Tuning (E2).
- King safety (`ABC-270`), endgame scaling (`ABC-272`), search changes.
- *2026-11-04 (`bapm-ABC-271-ready`; `ADR-0070`):* any non-zero value (the second pull's, under `ADR-0067` d5 /
  d6); a switch or a door pair; games and an intent read; a value for `PASSED_UNSTOPPABLE` (only a later attempt with
  its own PREREG); a safe path (an attack map); the rear passer of a doubled pair; any `tools/` edit.

## Acceptance criteria

*2026-11-04 (`bapm-ABC-271-ready`): **`ADR-0070` decision 5's K0–K4 replace the as-cut P0–P8** (kept unedited under
§ As cut). They are pre-registered there and are not loosened after Ready. **No games:** the build is
value-identical, and E4a's values are judged only in the second pull's read (`ADR-0070` d7).*

- **K0 (node identity with `main`).** **Given** the build, **when** `chooseMove` is deepened on a frozen clock and
  `search()` runs at fixed depth, **then** the counts equal `main`'s exactly:
  - `chooseMove` kiwipete d8 / d9: **766 275 / 1 725 150**;
  - `chooseMove` position-6 d8 / d9 / d10: **87 475 / 253 724 / 533 916**;
  - `search()` d8 kiwipete / position-6: **605 117 / 406 787**;
  - every existing door reads its pre-ticket counts.

  These are the probe's I1, on `src/` tree `8adb0a18`. `main` `7968c97f`'s `src/` tree `4fb3da04` differs from it in
  three test files only (`engine.test.ts`, `levels.test.ts`, `search.null-move.test.ts`; `ABC-281`), so they stand.
  **If `main`'s non-test `src/` has moved by the build**, the Engineer re-reads them on the new base and puts both
  sets in the PR. A re-derived count is a dated line in `ADR-0070`, never a moved bar. A miss is a defect (F1).
- **K1 (units, default lane, no search).**
  - **(a) Mirror:** **given** `G3` + `TAPER_MIRROR_POSITIONS` + **≥ 10 new passer positions** (frozen by QE before the
    build), **then** `evaluate` is mirror-equal by `Object.is` on every row: **0 mismatches**.
  - **(b) Value identity:** **given** the frozen corpora (`G3`'s 184, `TAPER_DOOR_CORPUS` with the KP rows, `ABC-270`'s
    queen pairs, and K1 (a)'s new passer positions), **then** `evaluate` is `Object.is`-equal to the pre-ticket
    `evaluate` on every row, in `ABC-270` K1 (b)'s form. `Object.is` sees the sign of a zero.
  - **(c) The structure through the seam, by arithmetic.** **Given** QE's frozen fixtures (test note 1), **when** the
    E4a eg halves are set through `withParametersForTest` to `ADR-0070` d1's probed values (`PASSED_KING_ENEMY` 0, 1,
    2, 4, 7, 12, 20; `PASSED_KING_OWN` 0, 0, 1, 2, 3, 6, 10; `PASSED_FREE` 0, 5, 10, 20, 35, 60, 100; U 400), **then**
    `passerTermsForTest` returns:
    - a king-distance part that moves by **exactly** `PASSED_KING_ENEMY[R]` per step of the enemy king's capped
      distance, and by **exactly** `PASSED_KING_OWN[R]` per step of the own king's, and by **0** for a step beyond the
      cap of 5;
    - a free part that is **non-zero only when the path is empty**;
    - **U on exactly the positions the square names at phase 0, and 0 on every other fixture.**

    With the values 0, (b) holds. These rows read E4a's own part. They are not E3's generated relation rows on
    `evaluate`, which stay NOT MET on record.
  - **(d) The range row** (`ABC-274` A9) reads the new pairs, and the packed int16 range holds.
  - **(e) The memo:** a hit returns what a fresh `pawnStructure` returns, the two passer words included.
  - **A source row:** the king squares come from the walk; there is no new pass over the pieces.
- **K2 (two re-pins, and no others).** Exactly two rows are re-pinned, both of the memo's byte size,
  **458 752 → 589 824** (448 → 576 KiB): `src/evaluate.pawns.test.ts`'s "is a fixed 448 KiB" row (`ABC-235` cut 5;
  both of its `expect` lines) and the `NFR-009` sum row of `src/transposition.test.ts` (A7). They record a structure's
  size, not a value. **Any other re-pin, in any lane, means the build is not value-identical: a defect (F1).**
- **K3 (`G2`).** `evaluateAtPhase` per call is **≤ 1.05 ×** `main`'s. QE reads it under a PREREG sealed before
  timing, with `ADR-0067` d8's A5 instrument (two sessions in reverse order, and a `main`-copy control). The endgame
  report set is reported beside it, not graded (probe: 1.084 / 1.086 ×).
- **K4 (`G6`, graded "≥ base").** At `LEVELS[5]`, each board's median completed depth is **≥ `main`'s**, and **every
  run reaches depth ≥ 6**. `Q-3K-4` (b) does not apply, because no value changes (as `ABC-270`).
- **Reported, not graded:** the endgame `G2` set; `N8-LANE` before and after. S2 nps only if the Orchestrator rules
  as for `ABC-270` and `ABC-274` (`…690d3b30`, `…401c3d09`). That ruling is his and is open.

### Falsifiers (`ADR-0070` § What would falsify this; its table is authoritative)

| # | fires when | row | disposition |
|---|---|---|---|
| F1 | a node, score or move mismatch against `main`; an `Object.is` miss; a re-pin outside K2 | K0–K2 | a defect, fixed before any cost bar; never re-pinned |
| F2 | `G2` > 1.05 ×, a `G6` median below `main`'s, or a run below depth 6 | K3, K4 | STOP to Architect/Design: `ADR-0070` d3's one value-identical cut, then one re-read under a PREREG. A second miss: **not merged**, and the second pull fits without E4a's features (a re-plan, its own dated line) |
| F3 | a seam row: a part that does not match its rule on a frozen fixture | K1 (c) | a defect in the structure, fixed before merge; no value is chosen to pass |
| F4 | the second pull's fit leaves every E4a eg half at its 0 bound | (the second pull) | recorded; the structure is dead weight, and a later ticket may remove it. No re-fit on play |
| F5 | the second pull's read is NOT MET | (the second pull) | `ADR-0067` F6: the tuned set is not merged; this structure stays, value-identical |

## NFR triggers

- ~~**`NFR-005`:** P7, every run ≥ 6. **`NFR-001` / `G2`:** P6 ≤ 1.05 ×.~~ *2026-11-04 (`bapm-ABC-271-ready`):*
  **`NFR-005`:** K4, the median "≥ base" and every run ≥ 6. **`NFR-001` / `G2`:** K3, ≤ 1.05 × per call.
- ~~**`NFR-009`:** no new table expected; any growth stated by the ADR (≤ 16 MiB total, ≤ 1 MiB growth).~~
  **`NFR-009`:** **+128 KiB** (the memo, 448 → 576 KiB), at value 0 as at any value. That is under the 1 MiB growth
  line and far under 16 MiB. If F2's cut is taken, +16 KiB more (`ADR-0070` d3).
- **`NFR-008`:** ~~P1 rows are units with no search; P0, P2–P4 behind deep flags;~~ K1 rows are units with no
  search; K0 and the deep half of K2 run behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1`; `N8-LANE` before and after.
- **Security:** none. No new input, data, format, option or dependency. `plans/nfr-catalog.md` is untouched.

## Test notes

1. **QE freezes before the build** ~~P1 (c)–(e)'s positions~~ *(2026-11-04)* **K1 (a)'s ≥ 10 passer positions and
   K1 (c)'s fixtures**, each with FEN, phase and side to move, never changed to fit. K1 (c)'s floor carries the as-cut
   counts (BA/PM's carry, not an `ADR-0070` bar):
   - **≥ 8 pawn endings for U:** 4 with the passer outside the defending king's square and 4 twins with the king
     one step inside, side to move stated. At least one more fixture above phase 0 must read U = 0.
   - **≥ 6 king-distance pairs:** they differ only by one king step. At least one pair moves the enemy king, one
     moves the own king, and one steps beyond the cap of 5.
   - **≥ 4 free-path pairs:** they differ only by a piece on a square ahead of the passer.
2. Deterministic mode holds (integer, mirror-exact).
3. **UAT is owed**; the QE verdict signs it. *2026-11-04:* the diff has production lines, so the standing rule
   (2026-10-22) applies and the waiver does not, even though the build is value-identical.
4. *2026-11-04:* the PR lists the K0 counts it read, both sets if `main` moved, and K3's endgame report set.
5. *2026-11-04 (Orchestrator `…730399e5` item 3; `ADR-0046` `R-281-a`):* the QE hop runs the moved rows' four `-t`
   lines with their expected passed counts, as the Orchestrator's `qe-ABC-271` brief carries them.

## Size and priority

- ~~**Size: M.** Three rules, an outside-the-memo computation, a switch and doors, re-pins.~~ *2026-11-04
  (`ADR-0070` § Consequences):* **Size: S.** Three zero by-rank arrays and one zero pair, the passer words in the
  memo, one loop after the walk, the seam, K1's units and two re-pins. Host time is about 0.2 h (two `G2` sessions,
  `G6` rounds, the lanes), with no games.
- **Priority: P3.** Rank 2: rule-derived knowledge the tuner cannot create, pullable after E1; weaker instrument
  support than `ABC-270`. *2026-11-04: unchanged. Its place before the second pull comes from the dependency, not
  from the priority.*

## Dependencies

*2026-11-04 (`bapm-ABC-271-ready`):* **every hard dependency is met.**
- **`ADR-0070` ACCEPTED** (owner `…e8a3b5df`). It is in force from this ticket's merge.
- **`ABC-269` merged** (`54dee3f2`) and **`ABC-274` merged** (`2410d4f7`): E1's passer halves, the table and the
  packed blend.
- **Before the second pull (`ADR-0070` d7).** The second pull's fit is taken on a `main` that contains this ticket,
  and one read judges both. It is a new attempt under `ADR-0067` F6 with its own PREREG. It fits the eg halves of
  `PASSED_KING_ENEMY`, `PASSED_KING_OWN` and `PASSED_FREE` (≥ 0) and holds every mg half and `PASSED_UNSTOPPABLE` at
  0 (`…730399e5` item 2). The owner's items open before it (the `ADR-0067` d6 amendment and B-T8's re-confirmation)
  are not waits of this ticket.
- **QE's freeze** (test note 1) comes before the build. It is a step, not a blocker.
- **`tools/tune` (`ABC-280`, merged `0c8b385a`).** This ticket edits no `tools/` file. At value 0 the tracer's
  identity gate is expected to hold, since the new terms add 0 (`UNKNOWN - verify`). **Flagged:** `ADR-0070` d1 says
  `tools/tune` "reads and writes them unchanged", but on `main` the emitter (`tools/tune/tune.ts`, `valuesOf` and the
  writer) writes a fixed list of 13 value exports that does not name the four E4a exports. Writing them is the second
  pull's tool work, beside `ADR-0067` d5's tracer extension. It is the Architect's to confirm.
- **File collisions, one at a time:** `src/evaluate.ts` and `src/evaluate-params.ts`, with `ABC-272` and the second
  pull.
- The as-cut dependencies are kept under § As cut.

## Definition of Ready

*2026-11-04 (`bapm-ABC-271-ready`), re-scored on `ADR-0070` (ACCEPTED, form (a)):*

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ rank-only passers; the square; `zugzwang.001`'s F4 cause (no term reads a frozen or a free passer); this ticket's value is the structure the second pull fits, judged in that read, with no Elo of its own |
| 2 | scope and out-of-scope | ✅ scope 1–4 at 0 with the rules as priors; 5 struck; values, U's value, doors, games, a safe path and `tools/` are out |
| 3 | INVEST | ✅ S; independent (`ABC-269` and `ABC-274` merged); one mechanism with no switch; valuable as the second pull's features (F4 records it if the fit leaves them at 0); testable by K0–K4 |
| 4 | testable, measurable acceptance | ✅ K0 seven exact counts; K1 0 mismatches, `Object.is` on the frozen corpora, seam parts exact per step and 0 past the cap, free non-zero only when empty, U on exactly the square's positions, the range row, memo hit = fresh; K2 exactly two re-pins (458 752 → 589 824); K3 ≤ 1.05 ×; K4 median ≥ base and every run ≥ 6 |
| 5 | dependencies known | ✅ `ADR-0070` accepted; `ABC-269` / `ABC-274` merged; before the second pull; QE's freeze; `tools/tune`'s emitter flagged for the second pull; collisions (`ABC-272`, the second pull) |
| 6 | NFR triggers with targets | ✅ `NFR-005` K4 (≥ 6, median ≥ base); `G2` ≤ 1.05 ×; `NFR-009` +128 KiB (576 KiB); `NFR-008` units only in the default lane |
| 7 | test notes | ✅ 1–5 |
| 8 | size | ✅ S (was M) |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ `ADR-0070` is written and ACCEPTED (`…e8a3b5df`); K0's counts are fixed; the door reading is ruled (`…730399e5` item 1); U at 0 is ruled (item 2) |

**DoR 10/10 (re-scored 2026-11-04, `bapm-ABC-271-ready`). Ready.** Row 10 flips. Rows 1–9 are re-read against the
structure-only scope. The board move to Ready for Dev is the Orchestrator's.

## As cut (superseded 2026-11-04 by `ADR-0070` ACCEPTED; kept unedited for the record)

### Acceptance criteria

The ADR fixes exact counts before Ready; none of these bars is loosened after Ready.

- **P0 (node identity with the design):** frozen-clock `chooseMove` and `search()` counts on kiwipete and position-6
  as the ADR names them, exact; every door reads `main`'s counts.
- **P1 (relations; default-lane units, no search):**
  - (a) **Mirror:** `G3`'s corpus plus `ABC-269`'s mirror set plus ≥ 10 new passer positions, `Object.is`, 0
    mismatches.
  - (b) **Phase 24 is E1:** on every full-material position in the corpus, `evaluate` equals `ABC-269`'s, exactly.
  - (c) **The square:** **given** ≥ 8 QE-frozen pawn endings (4 with the passer outside the defending king's square,
    4 the same pawn with the king one step inside, side to move stated), **then** each "outside" position scores at
    least the ADR's unstoppable value above its "inside" twin, from the passer's side.
  - (d) **King distance is monotone:** **given** ≥ 6 QE-frozen pairs that differ only by the defending king one step
    nearer the queening square, **then** the passer side's score is strictly lower with the king nearer.
  - (e) **Free path:** **given** ≥ 4 QE-frozen pairs that differ only by a piece on a square ahead of the passer,
    **then** the free-path bonus is present only when the path is empty.
- **P2 (mate floor):** door d4 → head d5 and d5 → d5 on the 287, **0 violations** each.
- **P3 (zugzwang, hard):** `ADR-0050` d9's seven rows, **7 / 7**, recorded depths.
- **P4 (`G1`):** **≥ 54 / 58, no NEWLY-MISSED line.**
- **P5 (`ADR-0061`'s cut audit on this scale):** **≤ 0.5 %** flips and **0 ≥ 200 cp.**
- **P6 (`G2`):** the complete evaluation **≤ 1.05 ×** the base head's per call, same session.
- **P7 (`G6`, by `Q-3K-4` (b)):** `LEVELS[5]`, ≥ 5 interleaved rounds a board a build: **every run ≥ depth 6**,
  depth 7 WARN; medians reported, not graded.
- **P8 (the read; `EPIC-011` § The per-change rule, by reference):** C2′ 100 games at 100 ms, **≥ 50.0 of 100**
  (GAIN) or, only if the ADR named it before Ready, ≥ 43.0 with its own measured bar; S′ `r <candidate> <out> --elo
  1810 --budget-ms 500 --rounds 5 --concurrency 1` (or the E in force, `ADR-0056` S′), S-4; the Levels deep lane exit
  0; R-TC part 1 item 2 at review. A miss is NOT MET and not re-played.
- **Reports, not bars:** drift at d5 on the 190; reach at 47 000; the evaluation instrument; the firing rate at 100 ms.

#### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | P0 not reproduced; a mirror or door mismatch | a defect |
| F2 | P1 (c)–(e) missed | STOP to Architect/Design; no value tuned to pass |
| F3 | P2–P4 red | defect check; if real, NOT MET and the ADR re-opens; no deeper re-pin |
| F4 | P5 above bars | `ADR-0061` re-read before merge |
| F5 | P6 > 1.05 × or a run below depth 6 | STOP; one value-identical cost cut, one new reading |
| F6 | P8 NOT MET | not merged; E4 waits for E2's tuner |

### Dependencies

- **`ABC-269` merged** (E1's passer halves and table). Hard. *Met 2026-11-03: merged to local `main` at `54dee3f2` (`bapm-269-done`).*
- **The ADR** (the Architect's), after the owner's 2026-11-03 design order (`ABC-234`, `ABC-236`, `ABC-239`) unless
  the Orchestrator re-orders.
- **One at a time** with `ABC-270`, `ABC-272`, `ABC-239` on `src/evaluate.ts` / `src/evaluate-params.ts`.
- **E2:** not a wait. `ADR-0056` D2 lists E4 after E2; these three terms are rules, not fitted weights. The ADR may
  still order this after E2 if it shows a reason.
  *2026-11-03 (`bapm-E2pre-cut`):* `ADR-0067` (PROPOSED, § Consequences 5) gives that reason: king distance and free path become weights
  the tuner fits, while the rule of the square stays a rule. The recommended order (adopted on `EPIC-011`
  § Dependencies) is `ABC-269` → `ABC-274` → `ABC-239` → this ticket. The design may still keep the terms as rule
  values. That is the ADR's call.
- *2026-11-04 (`bapm-ABC-239-close`; Orchestrator `…4c76bf7a`; `arch-ABC-239-f3f4` `…69f22167`):* **the order flips:
  this ticket goes before a second `ABC-239` pull, not after the first.** The first pull closed NOT MET, and
  `main` keeps E1's table.
  - **Why:** `zugzwang.001`'s F4 miss needs this ticket's **free-path and king-distance terms**. Black's three
    h-passers there are frozen only because their paths are blocked and White's king covers g1 and g2, and no term on
    `main` reads either. The Architect measured the cause (`…4eae0fd3`, D1–D4). Whether a fit over E4a holds the row is
    `UNKNOWN - verify`.
  - **The second pull** is a new attempt under `ADR-0067` F6, with its own PREREG, on a `main` that contains this
    ticket. It needs the owner's word then on `ADR-0067` d6's amendment. It is not a wait of this ticket.
  - **Whether the terms ship as hand values judged on play, or land structure-only for the tuner (`ADR-0068`'s form),**
    is the ADR's call (the Orchestrator's brief `arch-ABC-271`).
  - **`ABC-280`** (the tuner landing alone, tools only) edits no file this ticket edits. If this ticket adds terms to
    `main` first, `ABC-280`'s identity gate may miss on them (its STOP). The tracer's extension to E4a belongs to the
    second pull.

### Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ rank-only passers; the square; 8 of 25 persistent errors with a passer (weak, stated); estimate labelled |
| 2 | scope and out-of-scope | ✅ scope 1–5; E4b, E2 out |
| 3 | INVEST | ✅ M; one mechanism behind a switch |
| 4 | testable, measurable acceptance | ✅ P0 exact; P1 0 mismatches / exact / ≥ the stated value / strict monotone / present-only-when-empty; P2 0; P3 7 / 7; P4 ≥ 54 / 58; P5 ≤ 0.5 %, 0 ≥ 200 cp; P6 ≤ 1.05 ×; P7 ≥ 6; P8 ≥ 50.0 |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ |
| 7 | test notes | ✅ 1–3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ the ADR is owed (rules, values, P0 counts, intent check); ~~`ABC-269` not merged~~ *(merged 2026-11-03, `54dee3f2`)* |

**DoR 9/10. Backlog.**
