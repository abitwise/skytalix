---
id: ABC-291
title: "E4b: pawn structure. Connected and phalanx pawns earn a tapered bonus and backward pawns a tapered penalty, with hand values fixed by a stated rule and judged on its own C2′. First of the four terms on the tuning wait"
status: ready
column: Ready
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0075, accepted by the owner 2026-11-05 (…c1623ae7), in force at this ticket's merge: form (b) on main's tapered evaluation. Definitions and hand values d1 and d2, pawn memo d3 with d5's named cut carried, so 576 KiB and NFR-009 +0, one switch and a test-only off-door pair d4, G2 ≤ 1.03 × d5, intent GAIN d6, bars K0–K7 d7, the probe d10, the tool line d11 (a). Its probe ran once, 2026-11-05: the premise stands under rule 3 (…2926c26b). K0 (c)'s counts and K2's list are in its § The probe's reading"
---

# ABC-291: connected, phalanx and backward pawns (E4b)

> **THE PROBE RAN: THE PREMISE STANDS UNDER RULE 3; THE BUILD CARRIES d5'S CUT; SIZE M; DoR 10/10; READY, 2026-11-05, by BA/PM** (task `bapm-ABC-291-probe-lines`, records only, at `main`
> `f22de7e8`; nothing run). Sources: `arch-ABC-291-probe` `…65c7a9c9` and `…2926c26b`, `ADR-0075` § The probe's reading, and the Orchestrator's rulings `…69ee96e7`.
> - **No value, rule, definition, ratio, intent or bar moved.** The line reads "the premise stands under rule 3", not "MET": PR8 read R = 1.04287, above 1.03, so rule 5 does not apply.
> - **The memo stays 576 KiB and `NFR-009`'s +65 536 reads 0** (ruling 3). `ADR-0075`'s title, d3 and § Consequences still read 640 KiB and +65 536. That is d3's form before the cut, not a disagreement: d5 named the
>   cut, rule 3 spends it, and ruling 3 reads the result. On these two figures those hold, not the older lines.
> - **On the page:** the probe's reading, K2's list by pointer, K0 (c)'s counts by pointer, rulings 1 and 2, size M, § `UNKNOWN - verify` trimmed to what stays open.
> - **DoR row 10 closes** on `…2926c26b`. Status and column read Ready. The board move is the Orchestrator's. **The build stays behind `ABC-303`, `ABC-289` and `ABC-305`.**

> **`ADR-0075` ACCEPTED, IN FORCE AT THIS TICKET'S MERGE; ITS BARS ARE ON THIS PAGE; IN DESIGN, 2026-11-05, by BA/PM** (task `bapm-ABC-291-lines`, records only, at `main`
> `1d0c7acc`; nothing run). Sources: the owner's "1. yes" (`orch-2026-10-30a` `…c1623ae7`), `ADR-0075`, and `arch-ABC-291`'s § Result.
> - **Copied from the ADR, no new bar:** K0–K7, `G2` ≤ 1.03 ×, the memo at 640 KiB, what "tapered" means here, the tool line, `ABC-305` before the build, F1–F6, and d11 (d).
>   This page's "the ADR's ratio", "by rank or flat" and "the ADR is owed" wording is out; the old text is in git history. **If this page and the ADR disagree, the ADR holds.**
> - **Status and column read In Design,** as the board has since `148fd329` (the move was the Orchestrator's, `…ba886714`).
> - **DoR 9/10, unchanged.** Row 10 stays open until the Architect's K2 list follows the probe.

> **FORM (b), HAND VALUES ON ITS OWN READ; THE HOLD LIFTS; NEXT TERM, P3 → P2, 2026-11-05, by BA/PM** (task `bapm-wait-lines-1105`, records
> only, at `main` `a38315bf`; nothing run). Sources: the owner's "3. wait" (`orch-2026-10-30a` `…b836b85c` item 3), `ADR-0067`'s dated block and `ADR-0056` D2's and D6's dated
> lines of `arch-owner-answers-1105`, `…ba8265e9`, `…2b3440cf` item 4, and the order the Orchestrator accepted (brief
> `bapm-wait-lines-1105`).
> - **The hold lifts.** The trigger, "the second pull merges or closes", fired when `ABC-301` closed NOT MET. The ADR is owed now.
> - **Form (a) is gone for this term.** `ADR-0056` D2's dated line supersedes "structure at 0, values from a pull". This page's form (a)
>   rows and its weights section are out; the old text is in git history.
> - **The form (b) list gains its `G2` line.** The ratio is the ADR's. This page sets none.
> - **The intent is GAIN,** by `ADR-0056` D6's dated line: evaluation rows fire at 100 ms. The NEUTRAL 43.0 option on this page is gone.
> - **Order:** E4b (`ABC-291`), then E5 without per-piece mobility (`ABC-292`), then E3b (`ABC-290`), then E6 (`ABC-293`). The order is the
>   Architect's recommendation, accepted by the Orchestrator (`ADR-0056` D6's reorder rule, with the owner told).
>   **This page is first.** P3 → P2 by the brief, so it no longer goes ahead of two P2s at P3.
> - No bar is new. **DoR 9/10, unchanged: the ADR is owed. Backlog.** The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E4, the rest after E4a (`ABC-271`, Ready).
> - **Hold:** after E2's second pull (the ruled order `ABC-271` → the second pull). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game with pawns on the board.
- **Pain:** `main` scores pawns by material, PSTs, passed by rank, doubled and isolated (`src/evaluate-params.ts`).
  `src/evaluate.ts`'s header leaves backward pawns, chains and connected passers out. A defended pawn chain and a
  backward pawn on a half-open file read the same as loose pawns.
- **Value:** `ADR-0056` D2 row E4 estimates **+20–60 Elo** for the whole row (E4a and E4b; an estimate, [B] 7.3 /
  7.4). Not a reading.

## Where the values come from (hand values, on the wait)

- **One stated rule, `ADR-0075` d2,** fixed before any row or game was read, and accepted by the owner. Nothing is adjusted after a result is
  seen. If `PASSED` or `ISOLATED` move before the build, these numbers stay.
- **Not from a pull.** Tuning waits: no third fit and no date (`ADR-0067`'s dated block of `arch-owner-answers-1105`).
- **Its own read.** If this term merges on its own read, or inside a bundle (`…0f1ab02e` item 2), a third pull may be asked for. Asking is not
  a yes.
- **Why first** (`…ba8265e9`): hand values here have failed by cost or by lost mates. This term looks only at pawns, so it may sit in the pawn
  memo, and the smallest job opens the way to a third pull as well as any other. That is reasoned, not read.
- **What it gives up:** it is not the largest estimate, and if its share of the row is small, 100 games may not show it.
- **The risk:** its endgame values touch pawn scores, and the row that failed both pulls is sensitive to those. **`zugzwang.001` played no
  part in this order.** Attribution is not run, and it may not choose the next term.
- **If he ever says yes to a third pull,** this term may enter its free set, and d2's values are its start. ~~Each new export is owed to that pull's emitter change
  (`…6ccd8243` item 3).~~ *2026-11-05 (`bapm-ABC-291-lines`): **superseded on this term by `ADR-0075` d11 (a):** the tool line lands at the term's merge (§ Scope 5).
  d12 is the pattern this term sets for `ABC-292`, `ABC-290` and `ABC-293`.*

## Scope

`ADR-0075` governs each line. R is the pawn's own rank index, as in `PASSED`: 1 is its start rank, 6 is one step from promotion. f is its file.

1. **Connected and phalanx pawns: a bonus by rank** (d1, d2).
   - **Connected:** a friendly pawn stands on (f − 1, R − 1) or (f + 1, R − 1). It counts once per pawn, however many defenders it has. At R = 1 it cannot fire.
   - **Phalanx:** a friendly pawn stands on (f − 1, R) or (f + 1, R), and R ≥ 2. It counts once per pawn, however many neighbours it has. Each pawn of a pair earns it.
2. **Backward pawns: a penalty** (d1, d2). All three hold:
   - (a) the side has a pawn on f − 1 or f + 1, on any rank;
   - (b) no such pawn stands on rank R or behind it;
   - (c) its stop square (f, R + 1) holds an enemy pawn, or an enemy pawn attacks it from (f − 1, R + 2) or (f + 1, R + 2).
   - Backward excludes connected and phalanx by (b), isolated by (a), and passed by (c). Connected and phalanx may both fire on one pawn, and either may fire on a passer. Each adds.
     A backward rear pawn of a doubled pair pays both `DOUBLED` and `PAWN_BACKWARD`. The double step and en passant are not read.

   **The values (d2), by one rule from `PASSED` and `ISOLATED`:**

   | R | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
   |---|---:|---:|---:|---:|---:|---:|---:|---:|
   | `PAWN_CONNECTED` mg = eg | 0 | 0 | 2 | 5 | 10 | 17 | 28 | 0 |
   | `PAWN_PHALANX` mg = eg | 0 | 0 | 1 | 2 | 5 | 8 | 14 | 0 |

   `PAWN_BACKWARD` = { mg 10, eg 10 }, a penalty held as a positive value, as `ISOLATED` is.
   - **What "tapered" means here** (d2): "tapered" on this page, its title included, reads "a middlegame / endgame pair that enters the blend". The halves come out equal, by the
     rule, so **the blend changes nothing at today's table.**
3. **In the pawn memo, which stays at 576 KiB** (d3, with d5's named cut): one new `Int32Array` part, `pawnCacheShape`, the packed sum of the three terms, white minus black. It stays out of `pawnStructure`'s return value,
   and the caller adds it.
   - **The build carries d5's cut** (the probe's rule 3): `doubled` and `isolated` share one memo word. They are only ever summed on a hit, so the cut is value-identical and saves a read.
   - **Size:** 2^14 × 36 bytes = 589 824 bytes (576 KiB, `ADR-0070` d2), +0. d3's 640 KiB (2^14 × 40 = 655 360, up 65 536) is the form before the cut, and it is the form the probe read.
4. **Form (b)** (d4; `ADR-0026` d10, in `ADR-0064` d7's form): one switch, `pawnShape`, on in `search()` and `chooseMove` only; the test-only exports `searchWithoutPawnShape`, `chooseMoveWithoutPawnShape` and
   `evaluateAtPhaseWithoutPawnShape`; the test-only seam `pawnShapeForTest(position)`. Every older door turns it off.
5. **The tool line, at this term's merge** (d11 (a), read by K7). `tools/tune` gains the three terms' counts in the tracer and the three exports in the emitter, **traced and held, not free**, as `T_UN`
   is. 17 → 20 exports. No fit, no emission to `src/`, and `src/` gains no tracing code. The line is the last commit on the branch: it holds no production line, so it stales no read.

## Out of scope

- Passer terms (E4a, `ABC-271`), pawn storms, king shelter, tuning itself.
- A dearer backward pawn on a half-open file (`ADR-0075` § Alternatives: not taken). § Problem names the pain, and d1's definition does not read the file.

## Acceptance criteria

`ADR-0075` d7 fixes the bars below, form (b) by `ADR-0056` D6's dated line. No bar is new, and none is loosened after Ready.

- **Values:** d2's table, fixed before any row is read. K1 (e) reads it.
- **Intent: GAIN, ≥ 50.0 of 100** (d6). It is never re-classed after a score is seen. NEUTRAL is not open.

**K0–K7, word for word from d7, with dated lines under them.** "d" numbers are `ADR-0075`'s. "Here", "this decision" and "this ADR" name it, not this page.

- **K0, the doors:**
  - (a) `chooseMoveWithoutPawnShape` and `searchWithoutPawnShape` are node-equal to the merge-base's `chooseMove` and `search()`: nodes, score and move,
    on kiwipete d8 and d9, position-6 d8, d9 and d10, and `search()` d8 on both;
  - (b) every older door reads its pre-ticket counts;
  - (c) the head reads the probe's P0 counts. If `main`'s `src/` has moved, the Engineer applies the probe's patch to the new base, re-reads, and puts both
    in the PR. A re-derived count is a dated line here, never a moved bar.
    *2026-11-05 (`bapm-ABC-291-probe-lines`; `…2926c26b`): the counts are the P0 table in `ADR-0075` § The probe's reading, at `src/` tree `cc6e64d1`. `patch_e4b.py`, in `arch-ABC-291-probe`'s `raw/scripts/`, is the probe's
    patch. Its edits are exact-string, so a new base may need its anchors moved.*
- **K1, units (default lane, no search):**
  - (a) the mirror, `Object.is`: `G3` + `TAPER_MIRROR_POSITIONS` + ≥ 12 new pawn-shape positions, 0 mismatches;
  - (b) `evaluateAtPhaseWithoutPawnShape` and `evaluateWithoutTaper` are `Object.is`-equal to the pre-ticket entries over the frozen corpora;
  - (c) **seam rows, by arithmetic, on fixtures QE freezes before the build:** at least one per definition per colour, and one per edge file per
    definition. They include each clause of Backward failing alone, and d1's exclusions;
  - (d) **the hot path:** `evaluate` minus the off-door evaluation equals the seam's white minus black, signed for the side to move, exactly. With
    equal halves the blend adds nothing, so there is no tolerance. A second row, inside `withParametersForTest` at unequal test halves, reads the blend in
    `ADR-0070` d4's own-phase form;
  - (e) the rule: each export equals d2's table, rebuilt in the row from the rule and the anchors' values at this ADR's date;
  - (f) `ABC-274` A9's bound reads the three pairs (8 × (largest connected + largest phalanx + backward) per side);
  - (g) the memo: a hit returns what a fresh `pawnStructure` returns, shape part included, on a forced collision too, and on an on-then-off read of one slot;
  - (h) a source row: `pawnShapeForTest` and `evaluateAtPhaseWithoutPawnShape` are called from test files only.
- **K2, the re-pins.** Two byte rows, 589 824 → 655 360: `src/evaluate.pawns.test.ts` (with its slot formula) and `src/transposition.test.ts`. They
  record a structure's size. ~~**The value rows and the re-point list are `UNKNOWN - verify` until PR11's lane report.** That list joins this
  decision by a dated line before Ready.~~ A re-pin outside it is a defect.
  *Dated 2026-11-05 (`arch-ABC-291-probe`): the list is in § The probe's reading. With d5's cut in the build, the two byte rows do not move.*
  - **K2's list, by pointer:** `ADR-0075` § The probe's reading, and `…2926c26b` § K2's list. Its 58 rows in six groups, and four more call lines in `src/search.futility.test.ts`, are not restated here.
  - **It binds at `cc6e64d1`.** On a later base it is re-derived as K0 (c)'s counts are, with both lists in the PR. A re-derived line is a dated line, never a moved bar.
  - **The deep lanes** (`…69ee96e7` ruling 2): re-points and door joins follow d4 by reference, each named in the PR. Any deep value re-pin or lost fixture goes to the Architect before it lands.
- **K3, safety (`ADR-0064` d7's rows):** mate floor 0 violations, door d4 → head d5 and d5 → d5 on the 287; zugzwang **7 / 7** at recorded depths with
  `zugzwang.001` among them; `G1` no NEWLY-MISSED line. All read all-on. No depth moves, and no expected result is rewritten.
- **K4, `G2` ≤ 1.03 ×** (d5). The endgame report set is reported beside it.
  *2026-11-05 (`bapm-ABC-291-probe-lines`; `…69ee96e7` ruling 1): K4 on the build is F2's one re-read. K4 above 1.03 × is the second miss: not merged, and a miss under d11 (d). K4 runs with the owner holding the other
  project, so a void cannot be mistaken for a miss.*
- **K5, `G6` under `Q-3K-4` (b):** every run at depth ≥ 6, depth 7 a WARN, "≥ base" reported, not graded.
- **K6, the read:** C2′ GAIN ≥ 50.0 of 100 at 100 ms against the merge-base, 100 of 100 complete, 0 candidate faults, 0 losses on time; then S′ at the E
  in force (1 810 today), S-4; then the Levels deep lane.
- **K7, the tool line** (d11 (a)): `TUNE_DEEP` green at the tip, its count reported.
- **Reports, not bars:** drift at d5, reach at 47 000, PR10's figures.

- **What a pass means (d9):** "not seen worse", not "proven better". By `ADR-0056`'s C2′ table a term truly worth +20 Elo passes 79 % of the time, +10 passes 66 %, 0 passes 50 %, −10 passes 34 %, and
  −20 passes 21 %. The term's Elo stays unknown, and the score is not added to any forecast.

### The premise probe (d10): run once; the premise stands under rule 3

*2026-11-05 (`bapm-ABC-291-probe-lines`): the "written, not run" text is out; the old text is in git history.*

- **It ran once,** on 2026-11-05, under PREREG `…2a579895`, on scratch copies of `src/` tree `cc6e64d1`, and it cannot be run again. Readings `…65c7a9c9`, decision `…2926c26b`. `ADR-0075` § The probe's reading holds every row.
- **Rule 3 fires.** PR8 read r₁ 1.02720 and r₂ 1.05855, R = 1.04287, above 1.03. Both controls stand. So the build carries d5's named cut, and QE reads K4 on the build. d5's forecast, "under 1 %", was wrong, and the reading replaces it.
- **Rules 1, 2 and 4 do not fire.** PR1 to PR7 hold: 0 mismatches, 0 mate-floor violations, zugzwang 7 / 7, `G1` no NEWLY-MISSED line. PR9 read 14.72 %, 4 106 of 27 896 positions, against ≥ 5.0 %.
- **Rule 5's words do not apply,** because not every row holds. The line reads "the premise stands under rule 3", not "MET".
- **PR8's shape:** the arm with the term read near 316 ns in some rounds and near 335 ns in others, and `main` held 315. So R mixes about 1.00 and about 1.06. The cause is `UNKNOWN - verify`. About one core of foreign work ran beside the hold.
- **Reports, which decide nothing (PR10):** reach 6.868 → 6.900; drift at d5 100 % within 25 cp, largest 24; ns per node 0.988 of `main`, on 3.45 % more nodes; memo hit rate in search 95.083 %; endgame set 1.0195.
  **The ratio with the memo bypassed is VOID:** both controls fell outside [0.970, 1.030]. It stays unread.
- **The probe read d3's form.** Its prototype had no cut, so nobody has read the cut. K4 is its first read.
- **Lock held:** about 3.5 minutes. That is the Architect's report, and the Orchestrator has not checked it (`…69ee96e7`).
- **What it changed:** K0 (c)'s counts, K2's list, d5's forecast, and the fixture list. **It changed none of** d1's definitions, d2's rule or values, d3's memo form, d5's ratio, d6's intent, any bar, or the term order.
- **The owner:** no question. Rule 4, the one rule that tells him, did not fire.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | d1–d4: a seam, mirror, memo or door row red; K0 not reproduced | a defect, fixed before any cost bar |
| F2 | K4 above 1.03 ×, or a run below depth 6 on K5 | STOP to Architect/Design: d5's one value-identical cut, then one re-read under a PREREG. A second miss: not merged |
| F3 | K3: a mate-floor, zugzwang or `G1` row red | a defect check first. If real, NOT MET. Never a re-pin, a moved depth or a new value |
| F4 | C2′ NOT MET | not merged, not re-played, back to BA/PM, through CF1–CF10 and d8's table. d11 (d) applies |
| F5 | the probe's rule 2 or 4 | this ticket is not built. `ADR-0075` reads "accepted, not in force". d11 (d) applies. *Did not fire (2026-11-05, `…2926c26b`)* |
| F6 | an identity-gate miss at the tip (d11 (a)) | read against d1's words. `evaluate` wrong is F1. The tracer wrong is a tool defect. No production line changes to fit the tool |

- **F2 after the probe** (2026-11-05, `bapm-ABC-291-probe-lines`; `…69ee96e7` ruling 1): rule 3 spends d5's cut before the build. **K4 on the build is F2's one re-read. K4 above 1.03 × is the second miss: not merged, and a miss under d11 (d).**
  This is the stricter reading, and it stands before QE seals K4's PREREG. The ruling names K4 only. F2's other half, a run below depth 6 on K5, still stops to Architect/Design, but no cut is left for it, and what follows there is not ruled.

- **A candidate fault in the read:** CF1–CF10 reach this read, by the owner's word (`…0f1ab02e` item 1). ~~The form QE copies for a single-part read
  is `arch-owner-answers-1105b`'s, in flight.~~ *2026-11-05 (`bapm-pointers-1105`): **settled.** The form, alone or in a bundle, is `ADR-0056` D5's dated block of
  `arch-owner-answers-1105b` (`…65557abd`): QE copies its Reach line and CF1–CF10 unaltered, then its table, filled from this page and the ADR. The block governs. No bar moves.*
  *2026-11-05 (`bapm-ABC-291-lines`): `ADR-0075` d8 is that table, filled for this ticket. It adds no bar.*
- **No second set of values after a miss** (`ADR-0075` d11 (d)): a rule for this term, on his acceptance (`…c1623ae7`). It does not yet bind the later terms; each asks him in its own ADR.
  - After a miss, `PAWN_CONNECTED`, `PAWN_PHALANX` and `PAWN_BACKWARD` do not get new numbers by hand.
  - **A miss is:** a real safety red (F3), C2′ below the bar on a clean read, a CF2 or CF8 NOT MET, a second `G2` miss *(K4 above 1.03 × on the build, ruling 1)*, or the probe's rule 2 or 4.
  - **Not a miss:** a defect fix that restores d1 or d2.
  - A miss here leaves `ABC-292` where it stands.

## NFR triggers

- **`NFR-009`** (`G7`): ~~+65 536 bytes, 640 KiB~~ **+0 bytes, 576 KiB, with d5's cut** *(2026-11-05, `bapm-ABC-291-probe-lines`; `…69ee96e7` ruling 3)*, fixed at load; ≤ 16 MiB in all, ≤ 1 MiB growth between a 1 s and a 4 s search.
- **`NFR-001` / `G2`:** K4, ≤ 1.03 ×. **`NFR-005`:** K5. **`NFR-008`** (≤ 10 s): K1's rows are units with no search. Their cost in the lane is `UNKNOWN - verify`, and the row census the Orchestrator placed
  after A4 gates the merge.

## Test notes

1. QE freezes the seam fixtures and the (b) rows before the build. The probe's 16 positions (`PAWN_SET`, in `arch-ABC-291-probe`'s `raw/scripts/e4bprobe.ts`) meet K1 (a)'s "at least 12", and they are offered to QE.
2. UAT is owed (production lines); the QE verdict signs it.
3. QE's PREREG for K4 states PR8's two levels, about 316 and 335 ns, and expects K4 to read the same way. Their cause is `UNKNOWN - verify`.

## Size and priority

- **Size: M** *(2026-11-05, `bapm-ABC-291-probe-lines`; `…2926c26b`: was S–M. Priced from the prototype, 305 lines added and 18 removed in five `src/` files, plus d5's cut, the tool line, QE's frozen fixtures and K1's rows (a) to (h). K2's list touches 58 rows and four more lines in 12 test files, and one fixture is re-found)*. **Priority: P2** *(2026-11-05, `bapm-wait-lines-1105`: was P3; first in the accepted order)*.

## Dependencies

- **`ADR-0075`: accepted by the owner (`…c1623ae7`), in force at this ticket's merge.** Its probe ran on 2026-11-05 (§ The premise probe).
- **K2's list:** written, the Architect's dated line in `ADR-0075` § The probe's reading. DoR row 10 is closed. It is re-derived on the build's base.
- **The build stays behind `ABC-303`, `ABC-289` and `ABC-305`** *(2026-11-05, `bapm-ABC-291-probe-lines`; `…69ee96e7`)*. Each can add a door or a row to K0 (c) and K2.
- **`ABC-305` merges before this ticket's build** (d11 (a)). `ABC-305` A6 would STOP on a `TUNE_DEEP` lane this merge had reddened. If E2 closes for good, no tool line is owed by any later term.
- **First of the four.**
- **The read queues.** A value-changing merge stales the read after it, so this term's C2′ follows `ABC-303` and `ABC-289`.
- **`ABC-301` closed NOT MET:** the trigger is met. *2026-11-05: "E2's second pull merged or closed" is gone as a wait.*
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-290`, `ABC-292`–`ABC-294`.

## `UNKNOWN - verify`

`ADR-0075` § `UNKNOWN - verify` is the list, with its dated line. *2026-11-05 (`bapm-ABC-291-probe-lines`): trimmed to what stays open. The rows, `G2` at the probe, the firing share, the memo's hit rate and K2's list are read, and § The premise probe holds them.* Still open:

- `G6`, the miss-path cost (the memo-bypassed ratio is void), what the cut buys, and every play read.
- The cause of PR8's two levels.
- The deep lanes' rows. They were not read. Ruling 2 says how a row there is handled, not which rows move.
- `ABC-282` A2 (b)'s new fixture, which d4 sends to `ADR-0028` d2. It is the one default-lane figure left.
- Whether this term holds `zugzwang.001`. Whether any hand-valued term pays. Its share of row E4's estimate.
- This ticket's exact default-lane row count.
- Whether `TUNE_DEEP` is red on `main` today. That the merge reddens it is by reading, not by a run.
- Whether d2's low ranks push the engine toward flank pawn moves in front of its king. Reasoned as small, and unread.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no chain or backward terms; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–5 |
| 3 | INVEST | ✅ M; pawn-only terms |
| 4 | testable, measurable acceptance | ✅ form (b): K0–K7 from `ADR-0075` d7. K2's list is in § The probe's reading |
| 5 | dependencies known | ✅ `ADR-0075`; ~~the probe after A4~~ ~~*the probe after the census, which has reported (2026-11-05, `bapm-rows-cut-1105`; `…16e0ec2c`, `…19cea480`)*~~ *the probe has run (2026-11-05, `bapm-ABC-291-probe-lines`)*; the build behind `ABC-303`, `ABC-289` and `ABC-305`; first of the four; its read after `ABC-303` and `ABC-289`; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-009` 576 KiB, +0, ≤ 16 MiB; `G2` ≤ 1.03 ×; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ **closed 2026-11-05** (`…2926c26b`): K2's list is written. The deep lanes are ruled (`…69ee96e7` ruling 2). The one default-lane figure left, `ABC-282` A2 (b)'s new fixture, goes to `ADR-0028` d2 |

**DoR 10/10. Ready.**
