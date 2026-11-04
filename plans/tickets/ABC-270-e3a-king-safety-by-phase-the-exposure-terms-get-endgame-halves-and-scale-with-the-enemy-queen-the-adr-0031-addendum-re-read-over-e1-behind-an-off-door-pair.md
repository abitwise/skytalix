---
id: ABC-270
title: "E3a, structure only: three queen-on king-exposure pairs (KING_SHELTER_MISSING_QUEEN, KING_FILE_HALF_OPEN_QUEEN, KING_FILE_OPEN_QUEEN) enter the evaluation at { mg: 0, eg: 0 }, added per file while the enemy has a queen, so the build is value-identical and node-identical to main, with no switch, no doors and no games; ABC-239's first pull fits them (ADR-0068)"
status: done
column: Done
closed: "2026-11-04, merged to local main at a81a6c7d (onto post-Q1 main); QE PASS_WITH_GAPS (qe-ABC-270 …e4da95d0), which signs UAT; K0-K4 MET, G2 0.9911; post-merge typecheck + npm test 2 647 / 2 647 (the Orchestrator's board card). Front matter only, by bapm-W1-bundle-cut"
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0068: ACCEPTED 2026-11-03 by the owner (\"yes, accept ADR-0068 and ADR-0069\", orch-2026-10-30a …401c3d09); in force from this ticket's merge. Was PROPOSED (arch-ABC-270 …c858b5a5; PREREG …117475f9 at 6bdd433b; addendum …3f24d8a0 at 9b3859be; merged 9553a772). It replaces the 'owed' design this page was cut against: the ADR-0031 addendum's rule values (× 3, endgame half 0) are probed and not shipped, its shelter gate (A3) is out. Rides ADR-0064 (E1, in force) and ADR-0067 (the tuner, accepted)"
---

# ABC-270: king safety by phase, the queen-on structure (E3a)

> **THE PHASE-24 TWINS CARRY LITERAL FENS, 2026-11-03, by BA/PM** (task `bapm-ABC-239-rulings`, records only, at
> `main` `4230d409`; nothing run). Source: the Architect's owed lines `arch-ABC-239-rulings` `…c54dda72` and
> `ADR-0067` ruling (b) ("the rows' FENs are constants in `tools/tune`, and a source row checks that each FEN appears
> literally in its test file"). **No bar moved. DoR stays 10/10.** The column is the Orchestrator's (In Development,
> `se-ABC-270`).
> - **K1 (e) gains one line, and so does test note 7:** each phase-24 twin of `ABC-083` A2 (b) and A3 (b) carries its
>   FEN as one full string literal in its test file. `ABC-239`'s fit may turn a twin into a bound (A2 (b)'s twin is
>   forecast red on `da3f8599`'s mg values, `UNKNOWN - verify`), and `tools/tune` then pins that row by its FEN text.
> - **Order unchanged:** `ABC-239`'s fit of record waits on this ticket's merge (`ADR-0068` d7).

> **STRUCTURE ONLY, BY `ADR-0068` (ACCEPTED); DoR 10/10, READY; SIZE M → S, 2026-11-03, by BA/PM** (task
> `bapm-owner-answers-1103b`, records only, at `main` `0bf243df`, `src/` tree `4cb84035`; nothing run). Sources: the
> owner's *"yes, accept ADR-0068 and ADR-0069"* (`orch-2026-10-30a` `…401c3d09`), `ADR-0068` and the Architect's
> owed lines (`arch-ABC-270` `…c858b5a5` § 5), applied one by one below.
> - **Scope rewritten, numbering kept.** Scope 2 is now the three queen-on pairs at `{ 0, 0 }`. Scope 1 (the exposure
>   endgame halves) needs no change here: `ABC-274` made them data, and the tuner frees them (`ADR-0067` d6). Scope 5
>   gains the re-found `ABC-083` A2 (b) / A3 (b) rows. **Scopes 3 (the shelter gate) and 4 (a switch and doors) are
>   struck.** The `ADR-0031` rule values (× 3, endgame half 0) are **not shipped**: both rule-value forms failed the
>   d5-against-d5 mate floor (2 / 190 and 1 / 190, all KQK; `ADR-0068` § Context).
> - **Acceptance: `ADR-0068` d6's K0–K4 replace K0–K8.** **Intent GAIN is struck.** The build is value-identical, so
>   there are no games, and no C2′, S′ or Levels read of its own. E3a's play value is read only inside `ABC-239`'s read
>   (B-T7, B-T8).
> - **S1–S3 leave this ticket.** On a value-identical build they stay +13 / +13 / +23. They become a **report in
>   `ABC-239`'s PR, on its emitted set** (`ADR-0068` § Consequences; `QE-269-a` moves to the tuner).
> - **S2 nps: exempt, reported only.** The Orchestrator ruled it so (`…401c3d09`), as for `ABC-274` (`…690d3b30`).
> - **QE freezes ≥ 6 queen pairs before the build** (K1 (c)).
> - **Size M → S** (`ADR-0068` § Consequences). **DoR 9/10 → 10/10** (row 10: `ADR-0068` is written and accepted).
>   **Front matter → Ready**, which is BA/PM's exit. The brief asks for **Ready for Dev**; that board move is the Orchestrator's.
> - **Order:** this ticket's build runs beside `ABC-239`'s tool build. **`ABC-239`'s fit is taken on a `main` that
>   contains this ticket**, or after its failed disposition (`ADR-0068` d7; the owner's order, `…401c3d09`).
> - **Rows touched:** title; § Problem (value); § Scope; § Out of scope; § Acceptance criteria (new K0–K4); § NFR
>   triggers; § Test notes; § Size and priority; § Dependencies; § Definition of Ready. The as-cut K0–K8, their
>   falsifiers, the dependencies and the DoR table are kept unedited under § As cut, at the end.

> **`ABC-269` MERGED, 2026-11-03, by BA/PM** (task `bapm-269-done`, records only, at `main` `128e3c6c`; nothing run).
> `ABC-269` (E1) merged to local `main` at `54dee3f2` (QE PASS_WITH_GAPS `qe-ABC-269` `…eff2fe64`), so this page's wait
> on that merge is **met**. DoR stays 9/10: row 10 now waits on the design alone. On the merged build QE read S1–S3,
> this ticket's first graded rows (K1 (b), ≥ 20 cp), at **+13 / +13 / +23**, equal to the forecast (`…3fb121de`). That
> is E1's starting point for them, not a reading of this ticket. Order unchanged: after `ABC-274` and `ABC-239`, with
> the stall clause (`EPIC-011` § Dependencies).

> **`QE-269-a` RULED (a), 2026-11-03, by BA/PM** (task `bapm-ABC-269-fold`, records only; nothing run). The Architect
> (`arch-ABC-269-rule` `…8ccb561f`; `ADR-0064` § Decision log; `ADR-0056` D2 row E3): `ABC-269`'s B1 (d) is graded on
> QE's D1–D6 only; the castled corner, **S1–S3** (`TAPER_KP_SHELTER_STRESS`, `grugops/ABC-269` `d6a57653`, E1 forecast
> +13 / +13 / +23), is E3's. **S1–S3 are this ticket's first graded rows, at ≥ 20 cp** (K1 (b)). Scope 1 stays here;
> the "(ii)" fold-back branches below are struck. DoR stays 9/10 (row 10: the design and `ABC-269`'s merge).

> **Cut 2026-11-03 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-cut`, records only, at `main` `17725732`; nothing
> run, built or timed). Source: the owner's *"Analyze and create tickets under EPIC-011"* (2026-11-03, the
> Orchestrator's brief) and this task's gap analysis (`EPIC-011` top block of 2026-11-03; the sealed notes of
> `bapm-epic011-cut`). **Rank 1 of the uncut items** by evidence-backed expected gain per host hour.
> - **`EPIC-011` Phase 4, row E3, first slice.** The rest of E3 (a king-zone attacker term) stays a stub, after E2.
> - **Intent: GAIN (≥ 50.0 of 100).** The exposure terms act at every node, and the queen scale at every node with a
>   queen on. NEUTRAL is not open to it. Named here, before any read, and never re-classed after a score is seen.
> - **It waits on ~~`ABC-269`'s merge and~~ the Architect's design** *(the merge is met, 2026-11-03)*. The board move is the Orchestrator's.

## Problem

- **User:** the owner at level 5, in every game with a castled king, and every later reading of this epic.
- **Pain, from the records:**
  - **King safety does not see the queen.** In game 1 the exposure term moved 35 cp when 13.d4 opened the d-file in
    front of the e1 king. Stockfish moved about 360 cp (`memory-bank/analysis/2026-10-23-game-1.md`; `ADR-0031`
    addendum § Context).
  - **After E1, the untapered shelter holds a castled king in its corner in the endgame.** `kingExposure` keeps equal
    halves at E1, so a centre king pays up to 105 cp while a sheltered corner pays 0. QE's frozen stress endings read
    **+13, +13 and +23 cp** for the centre king against the castled corner, under E1's own 20 cp mark (`QE-269-a`,
    `qe-ABC-269-freeze` `…34cbabaf`, MEDIUM; "a real strength hole in the most common king-and-pawn shape").
    `ADR-0064` § Alternatives names the same residual and leaves the fix to E3.
  - **On the evaluation instrument** (information only, never a bar): of the 25 errors of 50 cp or more that survive
    two node doublings on the 123 unique positions, 22 sit at phase ≥ 7 and **14 have queens on**. E1's chosen form
    fixes 1 of the 25 (this task's re-classification of `arch-next-pull` and `arch-E1` outputs). That is consistent
    with a middlegame king-safety gap. It does not prove one.
- **Why now, when `ABC-205` died:** `ABC-205` shipped these forms with a taper and closed unmerged on `G6`'s "≥ base"
  alone (position-6 median depth 7 against 8). That was cost, never play: its D read never ran. **The owner's
  `Q-3K-4` = (b)** (2026-11-02, `…cc7db847`) judges value-changing evaluation tickets on play, with `NFR-005`'s depth-6
  floor; "≥ base" is reported, not graded. The reason it died is gone. Its code is on `grugops/ABC-205-final`
  `b5d5cea5`, and its two owner levels (`OD-205-1`, `OD-205-2`) are already accepted.
- **Value:** E3's row is +40–100 Elo self-play for the whole of king attack (`ADR-0056` D2, an estimate). This slice
  is the structural half, without the attacker term: **+15–50 (BA/PM estimate, not a reading).** C2′ resolves about
  ± 56 Elo, so GAIN means "point estimate ≥ 0".
- *2026-11-03 (`bapm-owner-answers-1103b`; `ADR-0068`):* **this ticket no longer carries a value of its own.** It adds
  the structure, and `ABC-239`'s first pull fits it. E3a's value is read only jointly with the tuner's (B-T7, B-T8):
  C2′'s ± 56 Elo could not resolve a +15–50 slice alone (`ADR-0068` § Consequences). The +15–50 above stays an
  estimate for E3a as a whole, not a bar.

## Scope

*2026-11-03 (`bapm-owner-answers-1103b`; `ADR-0068` ACCEPTED, decisions 1–5): the numbering is kept, as in the
Architect's owed lines (`…c858b5a5` § 5).* `ADR-0068` governs each line. Every term keeps `ABC-215`'s provenance rule:
a stated rule, with this project's own values. Here the rule is "start (prior): 0", and the tuner owns the values.

1. ~~**The exposure terms get endgame halves.** `KING_SHELTER_MISSING`, `KING_FILE_HALF_OPEN` and `KING_FILE_OPEN` in
   `src/evaluate-params.ts` (`ADR-0064` d4) get endgame halves by a rule the ADR states (candidate: 0), blended by
   E1's phase.~~ ~~**If the Architect rules `QE-269-a` (ii)** and the shelter taper moves into `ABC-269`, this item
   folds there and is struck here with a dated line.~~ *2026-11-03 (`bapm-ABC-269-fold`): `QE-269-a` ruled (a); this
   item stays here.* *2026-11-03 (`bapm-owner-answers-1103b`; `ADR-0068` d1): **no change here.** The three existing
   exposure pairs keep E1's values (endgame half = middlegame half). Since `ABC-274` they are data only, and
   `ABC-239`'s first pull frees them (`ADR-0067` d6). The tuner owns all six pairs.*
2. ~~**The queen scale** (`ADR-0031` addendum A1): each king's exposure penalty × 3 while the enemy has a queen, × 1
   otherwise; ceiling 3 × 105 = 315 cp, below a minor piece. Its form on E1's table (a factor, or an mg / eg pair) is
   the ADR's.~~ *2026-11-03 (`bapm-owner-answers-1103b`; `ADR-0068` d1–d3):* **The queen-on structure, at 0.**
   - `src/evaluate-params.ts` gains three pairs: `KING_SHELTER_MISSING_QUEEN`, `KING_FILE_HALF_OPEN_QUEEN` and
     `KING_FILE_OPEN_QUEEN`, each `{ mg: 0, eg: 0 }`.
   - **While the enemy has at least one queen**, each pair is added per file to the matching base term of a king's
     exposure. The pairs are additive, not a factor, so the tuner's traced model fits each one as a feature: the
     exposure count × the enemy-queen flag (`ADR-0067` d4).
   - Their comment records the rule they start from: "start (prior): 0. The `ADR-0031` A1 rule, 2 × the base pair
     (× 3 in all), was probed and not shipped (`ADR-0068`)".
   - **No new per-piece operation.** The walk's `type === KING` test becomes `type >= QUEEN`, and KING and QUEEN are
     told apart inside it. That gathers the two queen flags. `kingExposure` takes the enemy-queen flag and adds the
     packed queen-on terms once per king, before its file loop. The phase stays an argument (`ABC-269` cut C1).
3. ~~**The shelter gate** (`ADR-0031` addendum A3): the middlegame king-table bonus is paid only while no shelter file
   is missing, by `kingExposure`'s own test. **In or out by the ADR's premise probe:** in `ABC-205` it carried the
   +3.2–5.0 % tree growth at depth 8 that lost `G6`. Under `Q-3K-4` (b) that growth is reported, not graded.~~
   *2026-11-03 (`bapm-owner-answers-1103b`): **struck. Out by reading** (`ADR-0068` § Context). `ABC-215`'s `KING_MG`
   has no positive cell, so the gate gates nothing on `main`. It re-opens only by its own ADR, if a tuned `KING_MG`
   gains a positive cell.*
4. ~~**One switch and a door pair** (`ADR-0026` d10's pattern, as `ADR-0064` d7): a switch in both recursions, a
   `…WithoutKingPhase`-style evaluate door and two search doors (names the ADR's). Every door that exists before
   this ticket turns the switch off.~~ *2026-11-03 (`bapm-owner-answers-1103b`): **struck** (`ADR-0068` d4). A
   value-identical build needs no switch and no door (the `ABC-274` precedent). So `OD-205-1` / `OD-205-2` cannot
   move.*
5. **Rows by reference** (`ADR-0064` d7's list): re-point, re-pin with old → new in the PR, re-find a lost fixture
   under `ADR-0028` d2; **no zugzwang depth is re-pinned.** ~~`OD-205-1` (the `ABC-079` `A5` cell at ⌊1.5 × reading⌋)
   and `OD-205-2` (`ABC-121` `A1`'s depth-5 drift maximum, 118 cp in `ADR-0026` d9) are re-read on E1's base by the
   ADR, not assumed.~~ *2026-11-03 (`bapm-owner-answers-1103b`; `ADR-0068` d5, d6 K2): **no re-pin is expected.** A
   needed re-pin is a defect (K2). The `OD-205` levels cannot move (scope 4). **Added: `ABC-083` A2 (b) and A3 (b)
   are re-found at phase 24** (`ADR-0028` d2, tests only):*
   - *the same pawn shapes and the same equal material, plus symmetric heavy pieces, so the rows grade the term
     where it is meant (middlegame king safety, not a pawn ending);*
   - *each new row reads **red with its term zeroed** through `withParametersForTest` (the fixture bites);*
   - *the pawn-ending rows go once their phase-24 twins are green on `main`. Both are green before and after, so no
     expectation moves.*
   - *This is done before the tuner emits, so that `ADR-0067` d6's "a red relation becomes a bound" cannot bind the
     endgame exposure through a pawn-ending fixture.*

## Out of scope

- **A king-zone attacker term** (E3b): its weights come from E2's tuner (`ABC-207`'s hand weights lost, −18.3 ± 16.5).
- **Tuning** (E2, `ABC-239`). E2 may later move every half this ticket writes.
- Mobility, passers (E4), endgame scaling (E7), search changes.
- Re-opening `ABC-205`. It stays dropped; its forms are input.
- *2026-11-03 (`bapm-owner-answers-1103b`; `ADR-0068`):* **any non-zero value** for the queen-on pairs or a moved
  exposure half (the tuner's, `ABC-239`); **games** of any kind for this ticket; **S1–S3 as a bar** (a report in
  `ABC-239`'s PR); **the shelter gate**; **a switch or doors**; a fixed × 3 factor (the tuner could not fit its size).

## Acceptance criteria

*2026-11-03 (`bapm-owner-answers-1103b`): **`ADR-0068` decision 6's K0–K4 replace the as-cut K0–K8** (kept unedited
under § As cut). They are pre-registered there and are not loosened after Ready. **No games:** the intent GAIN is
struck, because the build is value-identical. Its play value is read only inside `ABC-239`'s read (`ADR-0068` d7).*

- **K0 (node identity with `main`).** **Given** the build, **when** `chooseMove` is deepened on a frozen clock and
  `search()` runs at fixed depth, **then** the counts equal `main`'s exactly:
  - `chooseMove` kiwipete d8 / d9: **1 296 788 / 2 733 330**;
  - `chooseMove` position-6 d8 / d9 / d10: **404 930 / 926 005 / 1 692 669**;
  - `search()` d8 kiwipete / position-6: **839 514 / 1 533 901**;
  - every older door reads its pre-ticket counts.

  These are the probe's I1 and `ADR-0064` B0's counts, on `src/` tree `4cb84035`, which is `main`'s tree at this cut.
  **If `main`'s `src/` has moved by the build** (for example, the Q1 ticket `ABC-279` merged first), the Engineer
  re-reads them on the new base and puts both sets in the PR. A miss is a defect (F1), fixed before any cost bar.
- **K1 (units, default lane, no search).**
  - **(a) Mirror:** `G3` + `TAPER_MIRROR_POSITIONS`, `Object.is`, **0 mismatches**.
  - **(b) Value identity:** **given** the frozen corpora (`G3`'s 184, `TAPER_DOOR_CORPUS`, the KP rows), **then**
    `evaluate` is `Object.is`-equal to the pre-ticket `evaluate` on every row.
  - **(c) The queen-on structure through the seam:** **given** QE's frozen set of **≥ 6 pairs of positions that
    differ only by the enemy queen**, **when** the three queen-on pairs are set to 2 × their base pairs through the
    test seam, **then** each king's exposure is **exactly 3 ×** its queenless exposure, in each half. **With the pairs
    at 0, (b) holds.**
  - **(d) The range row** (`ABC-274` A9) reads the new pairs' maxima, and the packed int16 range holds.
  - **(e) The re-found rows** (scope 5): each phase-24 twin of `ABC-083` A2 (b) / A3 (b) is green on the build and
    **red with its term zeroed**.
    *2026-11-03 (`bapm-ABC-239-rulings`; `ADR-0067` ruling (b)):* **and each twin's FEN is literal.** **Given** the
    test file that holds the twins, **when** it is read as text, **then** each twin's FEN appears in it as one full
    string literal, not built by a helper, a template or a concatenation. That is because `ABC-239`'s `tools/tune` pins
    a bound row by a source row that finds the FEN literally in its test file.
  - **A source row:** the queen flags come from the walk's existing non-pawn branch, and no new per-piece operation
    is added.
- **K2 (zero re-pins).** In every lane, default and deep, **0** expectations are re-pinned. A row that needs one means
  the build is not value-identical. That is a defect (F1).
- **K3 (`G2`).** `evaluateAtPhase` per call **≤ 1.05 ×** `main`'s, read by QE under a PREREG sealed before timing,
  with `ADR-0067` d8's A5 instrument (two sessions, reverse order, a `main`-copy control).
- **K4 (`G6`, graded "≥ base").** At `LEVELS[5]` (4 000 ms), each board's median completed depth is **≥ `main`'s**,
  and **every run reaches depth ≥ 6** (FAIL below; depth 7 is a WARN). `Q-3K-4` (b) does not apply, because no value
  changes (as `ABC-274`).
- **Reported, not graded:** the S2 nps figure (the Orchestrator's ruling, `…401c3d09`, as for `ABC-274`); `N8-LANE`
  before and after.
- **Not this ticket's (moved to `ABC-239`'s PR as reports, on its emitted set):** S1–S3 (`TAPER_KP_SHELTER_STRESS`;
  the forecast that they clear 20 cp is `UNKNOWN - verify`), and game 1's move 13 (`ADR-0068` d8).

### Falsifiers (`ADR-0068` § What would falsify this; its table is authoritative)

| # | fires when | row | disposition |
|---|---|---|---|
| F1 | a node, score or move mismatch against `main`; an `Object.is` miss; a needed re-pin | K0–K2 | a defect, fixed before any cost bar; never re-pinned |
| F2 | `G2` > 1.05 ×, a `G6` median below `main`'s, or a run below depth 6 | K3, K4 | STOP to Architect/Design: one value-identical cut, then one re-read under a PREREG. A second miss: **not merged**, and the tuner fits without the queen-on terms |
| F3 | `ABC-239`'s fit leaves every queen-on mg at its 0 bound | (`ABC-239`'s fit) | recorded; the structure is dead weight, and a later ticket may remove it. No re-fit on play |
| F4 | `ABC-239`'s read is NOT MET | (`ABC-239` A6) | `ADR-0067` F6: the tuned set is not merged; this structure stays, value-identical |
| F5 | a phase-24 twin not red with its term zeroed, or not green on `main` | K1 (e) | a defect in the fixture; re-found again before merge |

## NFR triggers

- ~~**`NFR-005`** (depth floor 6 at the default budget): K7, every run ≥ 6, depth 7 WARN.~~ *2026-11-03
  (`bapm-owner-answers-1103b`):* **`NFR-005`:** K4. The median is graded "≥ base", every run ≥ 6, and depth 7 is a
  WARN. The floor holds by construction, because the tree is identical.
- ~~**`NFR-001` / `G2`:** K6, ≤ 1.05 × per call.~~ **`NFR-001` / `G2`:** K3, ≤ 1.05 × per call.
- **`NFR-009`:** ~~no new table expected (a few parameters in `src/evaluate-params.ts`); the ADR states any growth.~~
  six integers (three pairs), and no memory that grows per search.
- **`NFR-008`** (`npm test` ≤ 10 s): K1 rows are units with no search. ~~K0, K2–K4 behind `SEARCH_DEEP=1` /
  `ENGINE_DEEP=1` / `PUZZLE_DEEP=1`.~~ K0 and the deep half of K2 run behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1`.
  `N8-LANE` is reported before and after.
- **Security:** none. No new input, data, format, option or dependency. `plans/nfr-catalog.md` is untouched.

## Test notes

1. **QE freezes before the build:** ~~the ≥ 6 queen pairs for K1 (c). K1 (b) reuses `ABC-269`'s frozen fixture
   (`src/evaluate.taper-corpus.ts`, S1–S3 and the 6 endings) unchanged.~~ *2026-11-03 (`bapm-owner-answers-1103b`):*
   **the ≥ 6 queen pairs for K1 (c)**: positions that differ only by the enemy queen, with at least one missing
   shelter file, one half-open file and one open file among them. K1 (b) reuses the frozen corpora it names, unchanged.
2. ~~**The `ADR-0031` addendum's rejected alternative is a known conflict:** it rejected "exposure tapered by phase"
   because `ABC-083` `A2` / `A3`'s equal-material rows are pawn endings. The ADR re-reads those rows on E1's base and
   classes each under `ADR-0028` (re-pin, re-find, or a level for the owner).~~ *2026-11-03: resolved by `ADR-0068`
   d5. The rows are re-found at phase 24 (scope 5, K1 (e)). The probe's batch E reddened A2 (b) with values moved,
   so the conflict is real for the tuner, not for this value-identical build.*
3. ~~Reuse `ABC-205`'s probes and forms (`grugops/ABC-205-final` `b5d5cea5`; `arch-design-ABC-205` notes) as input;
   nothing from them is merged as is.~~ *2026-11-03:* The probe's patch is the form of record for the walk change
   (`.grugops/context/arch-ABC-270/raw/probe/`). Its counters and modes are scratch-only; nothing from it is merged
   as is.
4. Deterministic mode (`ADR-0027`) holds: integer, mirror-exact, the same input and virtual clock give the same move.
5. **UAT is owed** (production lines). The QE verdict signs it (owner delegation `…5aaf7cec` item 2). *2026-11-03:
   not waived, although the build is value-identical (`…c858b5a5` § 5).*
6. *2026-11-03 (`bapm-owner-answers-1103b`):* the PR lists the K0 counts it read, both sets if `main` moved, and the
   S2 nps figure as a report.
7. *2026-11-03 (`bapm-ABC-239-rulings`; `arch-ABC-239-rulings` `…c54dda72`; `ADR-0067` ruling (b)):* **the phase-24
   twins of `ABC-083` A2 (b) and A3 (b) (`ADR-0068` d5) carry their FENs as literal strings in the test file** (K1
   (e)). If `ABC-239`'s fit turns a twin into an F3 bound, `tools/tune` holds that FEN as a constant, and a source row
   checks that it appears literally in the test file. A twin whose FEN is computed would break that source row.

## Size and priority

- ~~**Size: M.** Three exposure halves, one queen factor, one gate (in or out), a switch and doors, re-pins on the
  rows the addendum moved (eleven default-lane rows and one deep row in `ABC-205`), and the frozen pairs.~~
  *2026-11-03 (`bapm-owner-answers-1103b`; `ADR-0068` § Consequences):* **Size: S.** Three zero pairs, one walk
  branch, one per-king add, the range row, the re-found rows and K1's units. Host time is about 0.2 h (two `G2`
  sessions, `G6` rounds, the lanes), with no games.
- **Priority: P2.** ~~Rank 1 of the uncut items: the largest estimate pullable before E2, the killer removed by the
  owner's word, code and owner levels already in hand, and it closes `QE-269-a`'s hole.~~ *2026-11-03: unchanged, P2.
  `ABC-239`'s fit waits on this merge (or on its failed disposition), and `ABC-239` is In Development.*

## Dependencies

*2026-11-03 (`bapm-owner-answers-1103b`):* **every hard dependency is met.**
- **`ADR-0068` ACCEPTED** (owner `…401c3d09`). It is in force from this ticket's merge.
- **`ABC-269` merged** (`54dee3f2`) and **`ABC-274` merged** (`2410d4f7`). This ticket adds packed pairs to the blend
  that `ABC-274` built.
- **Before `ABC-239`'s fit.** `ABC-239`'s fit and emission are taken on a `main` that contains this ticket, or after
  its failed disposition (F2's second miss). This ticket's build runs beside `ABC-239`'s tool build (`ADR-0068` d7;
  the owner's order, `…401c3d09`).
- **QE's freeze of the ≥ 6 queen pairs** comes before the build (test note 1). It is a step, not a blocker.
- **File collisions, one at a time:** `src/evaluate.ts` and `src/evaluate-params.ts` with `ABC-239` (its tool
  writes the file's present shape, which then includes the new pairs), `ABC-271` and `ABC-272`. **The Q1 ticket
  `ABC-279`** edits `src/see.ts` (new), `src/quiescence.ts`, `src/search.ts` and `src/engine.ts`, so there is no file
  collision. If it merges first, K0's counts are re-read on the new `main` (K0; `ADR-0069` § Consequences).
- The as-cut dependencies are kept under § As cut.

## Definition of Ready

*2026-11-03 (`bapm-owner-answers-1103b`), re-scored on `ADR-0068` (ACCEPTED):*

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ game 1 (35 against 360 cp); `QE-269-a`; the probe's D5: on own games the tuner moves the whole middlegame shelter weight into the queen-on term (shelter (0, 0), with the queen (29, 0)), so the structure is what the tuner needs to fit queen-dependent king safety. That is information, not a reading |
| 2 | scope and out-of-scope | ✅ scope 2 (three pairs at 0) and 5 (rows, the re-find); 1 is a no-op here; 3 and 4 are struck; values, games, S1–S3, the gate, doors and a × 3 factor are out |
| 3 | INVEST | ✅ S; independent (`ABC-269` and `ABC-274` merged); one mechanism with no switch; valuable as the structure `ABC-239`'s first pull fits (F3 records it if the fit leaves it at 0); testable by K0–K4 |
| 4 | testable, measurable acceptance | ✅ K0 seven exact counts; K1 0 mismatches, `Object.is` on the frozen corpora, exactly 3 × on ≥ 6 pairs, the range row, red-when-zeroed twins; K2 0 re-pins; K3 ≤ 1.05 ×; K4 median ≥ base and every run ≥ 6 |
| 5 | dependencies known | ✅ `ADR-0068` accepted; `ABC-269` / `ABC-274` merged; before `ABC-239`'s fit; QE's freeze; collisions (`ABC-239`, `ABC-271`, `ABC-272`; `ABC-279` re-read rule) |
| 6 | NFR triggers with targets | ✅ `NFR-005` K4 (≥ 6, median ≥ base); `G2` ≤ 1.05 ×; `NFR-009` six integers; `NFR-008` ≤ 10 s, units only in the default lane |
| 7 | test notes | ✅ 1–6 *(2026-11-03, `bapm-ABC-239-rulings`: 7, the twins' literal FENs)* |
| 8 | size | ✅ S (was M) |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ `ADR-0068` is written and ACCEPTED (`…401c3d09`); K0's counts are fixed; scope 3 is out by reading; the form of scope 2 is additive pairs |

**DoR 10/10 (re-scored 2026-11-03, `bapm-owner-answers-1103b`). Ready.** Row 10 flips. Rows 2–8 are re-read against
the structure-only scope. The board move to Ready for Dev is the Orchestrator's.

## As cut (superseded 2026-11-03 by `ADR-0068`; kept unedited for the record)

### Acceptance criteria

The ADR fixes the exact counts before Ready (its PREREG). The rows below are the bars it must carry; none is loosened
after Ready.

- **K0 (node identity with the design).** **Given** the build on the base the ADR names, **when** `chooseMove` and
  `search()` are deepened on a frozen clock on kiwipete and position-6 (depths the ADR names, as `ADR-0064` B0),
  **then** they read exactly the ADR's counts, and every door reads `main`'s counts. A miss is a defect, fixed before
  any other row is read.
- **K1 (relations; default-lane units, no search).**
  - (a) **Mirror:** `G3`'s corpus plus `ABC-269`'s frozen mirror set, `Object.is`, 0 mismatches.
  - (b) **The castled king walks:** **given** QE's `TAPER_KP_SHELTER_STRESS` S1–S3 and `ABC-269`'s 6 B1 (d) endings
    (9 frozen king-and-pawn endings), **then** the centre king beats the corner king by **≥ 20 cp** on all 9, from
    that king's side. (E1 forecasts +13 / +13 / +23 on S1–S3.) ~~If scope 1 folds into `ABC-269`, (b) is read there and
    this row reads 9 / 9 unchanged.~~ *2026-11-03 (`bapm-ABC-269-fold`): **S1–S3 are this ticket's first graded
    rows** (`QE-269-a` ruled (a); `ADR-0064` § Decision log). `ABC-269`'s PR prints their E1 readings as a report;
    this row grades them, with D1–D6 kept at ≥ 20 cp.*
  - (c) **The queen scale:** **given** QE-frozen pairs that differ only by the enemy queen (≥ 6), **then** the
    exposure penalty with the queen is exactly 3 × the penalty without it, and the queenless score equals `ABC-269`'s.
  - (d) **Off is E1:** the evaluate door equals `ABC-269`'s `evaluate`, `Object.is`, over a frozen corpus (the run is
    in the PR).
- **K2 (mate floor; `search()`, the 287, `SEARCH_DEEP=1`):** door d4 → head d5 same-sign mates, **0 violations**; d5
  against d5, **0 violations**.
- **K3 (zugzwang, hard):** `ADR-0050` d9's seven rows at their recorded depths, **7 / 7**. Never re-pinned deeper.
- **K4 (`G1`):** `PUZZLE_DEEP=1`, **≥ 54 / 58, no NEWLY-MISSED line.**
- **K5 (`ADR-0061`'s futility audit on this scale):** flips **≤ 0.5 %** of sampled nodes and **0 flips ≥ 200 cp**,
  read by QE on a scratch copy. A miss: `ADR-0061`'s margins are re-read by a dated amendment before this merges.
- **K6 (`G2`):** the complete evaluation **≤ 1.05 ×** `ABC-269`'s head per call, same session, `ABC-076`'s method.
- **K7 (`G6`, by `Q-3K-4` (b)):** `LEVELS[5]` (4 000 ms), plain `node`, reference host, ≥ 5 interleaved rounds per
  board per build, load recorded. **Every run completes depth ≥ 6 (FAIL below); depth 7 is a WARN.** The median
  against base is **reported, not graded.**
- **K8 (the read; `EPIC-011` § The per-change rule, by reference). Intent GAIN.**
  - **C2′:** 100 games at 100 ms, the candidate rebased on `main` against its merge-base, self-play, openings 1–50
    both colours, one game at a time, `Threads 1` against `Threads 1`, QE with the host ALONE, through `ABC-255`.
    **MET** on 100 / 100 complete, 0 candidate faults, 0 losses on time at the 50 ms margin, **≥ 50.0 of 100.** A
    miss is NOT MET and is not re-played.
  - **S′:** `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`
    (or the E in force at the read, `ADR-0056` S′), `timemargin` 50 ms: 10 / 10 complete, 0 faults, 0 losses on time,
    S-4 ≥ 3.0 of 10 (below that, 10 more and ≥ 7.0 of 20). Pooled only if merged.
  - **Levels deep lane:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts
    --reporter=verbose`, exit 0, every test passed (QE counts its own run).
  - **R-TC part 1, item 2, at review:** the diff reads no budget, deadline, `movetime`, test flag or environment.
- **Reports, not bars:** drift against the doors at d5 on the 190; reach at 47 000 nodes; the evaluation instrument
  on the unique positions (errors at 47 000 nodes, information only); the `G6` medians.

#### Falsifiers

| # | fires when | row | disposition |
|---|---|---|---|
| F1 | K0's counts not reproduced | K0 | a defect; fixed first |
| F2 | a mirror mismatch, a door not equal to its pre-ticket self | K1 (a), (d), `G4` | a defect |
| F3 | K1 (b) or (c) missed on the build | K1 | STOP to Architect/Design: the design is not what was claimed. No value is tuned to pass |
| F4 | a zugzwang row, a mate-floor violation or a NEWLY-MISSED `G1` line | K2–K4 | defect check first; if real, NOT MET and the ADR re-opens. Never a deeper re-pin |
| F5 | the futility audit above its bars | K5 | `ADR-0061` re-read before merge |
| F6 | `G2` > 1.05 × or a run below depth 6 | K6, K7 | STOP to Architect/Design: one value-identical cost cut, then one new reading |
| F7 | C2′ < 50.0, an S′ collapse, or a red Levels lane | K8 | not merged; the addendum stays "accepted, not shipped"; E3 waits for E2's tuner |

### Dependencies

- **`ABC-269` merged** (E1's phase, blend and parameter table). Hard. *Met 2026-11-03: merged to local `main` at `54dee3f2` (`bapm-269-done`).*
- **The Architect's design:** a dated re-open of the `ADR-0031` addendum on E1's base, or a new ADR. A change to A1
  or A3 as accepted is the owner's to accept (reading (b): build first, read and merge on acceptance). By the owner's
  2026-11-03 order the Architect designs `ABC-234`, `ABC-236` and `ABC-239` first; this design follows unless the
  Orchestrator re-orders.
- ~~**The `QE-269-a` ruling** (`arch-ABC-269-rule`, in flight) decides scope 1's home (here, or `ABC-269`).~~
  *2026-11-03: ruled (a) (`…8ccb561f`); scope 1 and S1–S3 are here. Not a wait.*
- **File collisions, one at a time:** `src/evaluate.ts` and `src/evaluate-params.ts` with `ABC-271`, `ABC-272` and
  `ABC-239`; `src/search.ts`, `src/engine.ts`, `src/quiescence.ts` (the switch) with `ABC-269`. The second to merge
  re-reads its door counts.
- **E2 (`ABC-239`):** not a wait. If E2 merges first, this ticket keeps only the structure E2 cannot create (the
  queen scale, the gate) and E2's tuned halves stand.
  *2026-11-03 (`bapm-E2pre-cut`):* **the recommended order now puts this ticket after `ABC-239`** (`ADR-0067` § Consequences 4, PROPOSED;
  adopted on `EPIC-011` § Dependencies): `ABC-269` → `ABC-274` → `ABC-239` → this. Its new terms then enter traced,
  with fitted weights (`ABC-207` lost on hand weights). **Stall clause:** if `ABC-239` stalls on data, this ticket
  may go first on its rule values, and the tuner's first pull traces it. That is still not a hard wait. **Supporting
  information, not a bar** (`arch-ABC-239` `…48ae6a93` reading 3): every tuner fit weights the king's square tables
  about 3–3.6 × (mg) and 2.2–2.8 × (eg) above E1's rule tables (D4: king mg −178 against E1's −50). This is consistent
  with this ticket's premise, and part of the gap may be a weight the tuner finds.

### Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ game 1 (35 vs 360 cp); `QE-269-a` (+13 / +13 / +23 < 20); 14 of 25 persistent errors with queens on (information); `ABC-205` died on cost, not play; estimate labelled |
| 2 | scope and out-of-scope | ✅ scope 1–5; attacker term, tuning, E4 / E7 out |
| 3 | INVEST | ✅ M; one mechanism behind one switch; independent of every open ticket but `ABC-269` (its base) |
| 4 | testable, measurable acceptance | ✅ K0 exact counts; K1 0 mismatches, ≥ 20 cp × 9, exactly 3 ×, `Object.is`; K2 0 violations; K3 7 / 7; K4 ≥ 54 / 58; K5 ≤ 0.5 % and 0 ≥ 200 cp; K6 ≤ 1.05 ×; K7 every run ≥ 6; K8 ≥ 50.0 of 100, S′, Levels |
| 5 | dependencies known | ✅ `ABC-269` *(merged `54dee3f2`)*; the ADR; ~~`QE-269-a`~~ *(ruled (a) 2026-11-03)*; collisions |
| 6 | NFR triggers with targets | ✅ `NFR-005` ≥ 6; `G2` ≤ 1.05 ×; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–5 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ the design is owed (K0's counts, scope 3's in / out, the form of scope 2); ~~`ABC-269` not merged~~ *(merged 2026-11-03, `54dee3f2`)* |

**DoR 9/10. Backlog.** Ready once the ADR (or the addendum's dated re-open) is written ~~and `ABC-269` has merged~~ *(merged
2026-11-03, `54dee3f2`)*.
