---
id: ABC-291
title: "E4b: pawn structure. Connected and phalanx pawns earn a tapered bonus and backward pawns a tapered penalty, with hand values fixed by a stated rule and judged on its own C2′. First of the four terms on the tuning wait"
status: in-design
column: In Design
size: S–M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0075, accepted by the owner 2026-11-05 (…c1623ae7), in force at this ticket's merge: form (b) on main's tapered evaluation. Definitions and hand values d1 and d2, pawn memo at 640 KiB d3, one switch and a test-only off-door pair d4, G2 ≤ 1.03 × d5, intent GAIN d6, bars K0–K7 d7, the probe d10, the tool line d11 (a). Its probe runs on the host after ABC-282's A4. K2's value rows and re-point list join it by a dated line before Ready"
---

# ABC-291: connected, phalanx and backward pawns (E4b)

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
3. **In the pawn memo, at 640 KiB** (d3): one new `Int32Array` part, `pawnCacheShape`, the packed sum of the three terms, white minus black. It stays out of `pawnStructure`'s return value,
   and the caller adds it. 2^14 × 40 bytes = 655 360 bytes, up 65 536 from 589 824 (576 KiB, `ADR-0070` d2). d5's one named cut, if it is carried, returns the memo to 576 KiB.
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

**K0–K7, word for word from d7.** "d" numbers are `ADR-0075`'s. "Here", "this decision" and "this ADR" name it, not this page.

- **K0, the doors:**
  - (a) `chooseMoveWithoutPawnShape` and `searchWithoutPawnShape` are node-equal to the merge-base's `chooseMove` and `search()`: nodes, score and move,
    on kiwipete d8 and d9, position-6 d8, d9 and d10, and `search()` d8 on both;
  - (b) every older door reads its pre-ticket counts;
  - (c) the head reads the probe's P0 counts. If `main`'s `src/` has moved, the Engineer applies the probe's patch to the new base, re-reads, and puts both
    in the PR. A re-derived count is a dated line here, never a moved bar.
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
  record a structure's size. **The value rows and the re-point list are `UNKNOWN - verify` until PR11's lane report.** That list joins this
  decision by a dated line before Ready. A re-pin outside it is a defect.
- **K3, safety (`ADR-0064` d7's rows):** mate floor 0 violations, door d4 → head d5 and d5 → d5 on the 287; zugzwang **7 / 7** at recorded depths with
  `zugzwang.001` among them; `G1` no NEWLY-MISSED line. All read all-on. No depth moves, and no expected result is rewritten.
- **K4, `G2` ≤ 1.03 ×** (d5). The endgame report set is reported beside it.
- **K5, `G6` under `Q-3K-4` (b):** every run at depth ≥ 6, depth 7 a WARN, "≥ base" reported, not graded.
- **K6, the read:** C2′ GAIN ≥ 50.0 of 100 at 100 ms against the merge-base, 100 of 100 complete, 0 candidate faults, 0 losses on time; then S′ at the E
  in force (1 810 today), S-4; then the Levels deep lane.
- **K7, the tool line** (d11 (a)): `TUNE_DEEP` green at the tip, its count reported.
- **Reports, not bars:** drift at d5, reach at 47 000, PR10's figures.

- **What a pass means (d9):** "not seen worse", not "proven better". By `ADR-0056`'s C2′ table a term truly worth +20 Elo passes 79 % of the time, +10 passes 66 %, 0 passes 50 %, −10 passes 34 %, and
  −20 passes 21 %. The term's Elo stays unknown, and the score is not added to any forecast.

### The premise probe (d10): written, not run

- **It runs on the host after `ABC-282`'s A4,** once, under the host lock, on one core, under its own task (the Architect's). It plays no games. Its rows are PR1–PR11.
- **It can change:** K0 (c)'s counts, K2's value-row and re-point list, the forecasts, the fixture list, and whether this ticket is built at all.
- **It cannot change:** d1's definitions (except by rule 1's STOP, back to him), d2's rule or any value, d3's memo form, d5's ratio, d6's intent, any bar, or the term order. It cannot turn a miss
  into a pass, and it cannot be re-run after one.
- **Its rule 2 or 4 fires** (a real miss on PR5, PR6 or PR7; PR9 below 5.0 %): this ticket is not built and comes back to BA/PM. d11 (d) applies. Rule 4 tells the owner.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | d1–d4: a seam, mirror, memo or door row red; K0 not reproduced | a defect, fixed before any cost bar |
| F2 | K4 above 1.03 ×, or a run below depth 6 on K5 | STOP to Architect/Design: d5's one value-identical cut, then one re-read under a PREREG. A second miss: not merged |
| F3 | K3: a mate-floor, zugzwang or `G1` row red | a defect check first. If real, NOT MET. Never a re-pin, a moved depth or a new value |
| F4 | C2′ NOT MET | not merged, not re-played, back to BA/PM, through CF1–CF10 and d8's table. d11 (d) applies |
| F5 | the probe's rule 2 or 4 | this ticket is not built. `ADR-0075` reads "accepted, not in force". d11 (d) applies |
| F6 | an identity-gate miss at the tip (d11 (a)) | read against d1's words. `evaluate` wrong is F1. The tracer wrong is a tool defect. No production line changes to fit the tool |

- **A candidate fault in the read:** CF1–CF10 reach this read, by the owner's word (`…0f1ab02e` item 1). ~~The form QE copies for a single-part read
  is `arch-owner-answers-1105b`'s, in flight.~~ *2026-11-05 (`bapm-pointers-1105`): **settled.** The form, alone or in a bundle, is `ADR-0056` D5's dated block of
  `arch-owner-answers-1105b` (`…65557abd`): QE copies its Reach line and CF1–CF10 unaltered, then its table, filled from this page and the ADR. The block governs. No bar moves.*
  *2026-11-05 (`bapm-ABC-291-lines`): `ADR-0075` d8 is that table, filled for this ticket. It adds no bar.*
- **No second set of values after a miss** (`ADR-0075` d11 (d)): a rule for this term, on his acceptance (`…c1623ae7`). It does not yet bind the later terms; each asks him in its own ADR.
  - After a miss, `PAWN_CONNECTED`, `PAWN_PHALANX` and `PAWN_BACKWARD` do not get new numbers by hand.
  - **A miss is:** a real safety red (F3), C2′ below the bar on a clean read, a CF2 or CF8 NOT MET, a second `G2` miss, or the probe's rule 2 or 4.
  - **Not a miss:** a defect fix that restores d1 or d2.
  - A miss here leaves `ABC-292` where it stands.

## NFR triggers

- **`NFR-009`** (`G7`): +65 536 bytes, 640 KiB, fixed at load; ≤ 16 MiB in all, ≤ 1 MiB growth between a 1 s and a 4 s search.
- **`NFR-001` / `G2`:** K4, ≤ 1.03 ×. **`NFR-005`:** K5. **`NFR-008`** (≤ 10 s): K1's rows are units with no search. Their cost in the lane is `UNKNOWN - verify`, and the row census the Orchestrator placed
  after A4 gates the merge.

## Test notes

1. QE freezes the seam fixtures and the (b) rows before the build.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S–M.** **Priority: P2** *(2026-11-05, `bapm-wait-lines-1105`: was P3; first in the accepted order)*.

## Dependencies

- **`ADR-0075`: accepted by the owner (`…c1623ae7`), in force at this ticket's merge.** Its probe runs on the host after `ABC-282`'s A4; it need not wait for `ABC-303` or `ABC-289`,
  only for the host (`ADR-0056` D6's dated line).
- **K2's list:** the Architect's dated line, after the probe's PR11, before Ready. DoR row 10.
- **`ABC-305` merges before this ticket's build** (d11 (a)). `ABC-305` A6 would STOP on a `TUNE_DEEP` lane this merge had reddened. If E2 closes for good, no tool line is owed by any later term.
- **First of the four.**
- **The read queues.** A value-changing merge stales the read after it, so this term's C2′ follows `ABC-303` and `ABC-289`.
- **`ABC-301` closed NOT MET:** the trigger is met. *2026-11-05: "E2's second pull merged or closed" is gone as a wait.*
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-290`, `ABC-292`–`ABC-294`.

## `UNKNOWN - verify`

`ADR-0075` § `UNKNOWN - verify` is the list. In short:

- Every reading: whether any row holds, `G2`, `G6`, the firing share, the memo's hit rate, the miss-path cost, and the probe's wall time.
- Whether this term holds `zugzwang.001`. Whether any hand-valued term pays. Its share of row E4's estimate.
- K2's value rows and re-point list. This ticket's exact default-lane row count.
- Whether `TUNE_DEEP` is red on `main` today. That the merge reddens it is by reading, not by a run.
- Whether d2's low ranks push the engine toward flank pawn moves in front of its king. Reasoned as small, and unread.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no chain or backward terms; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–5 |
| 3 | INVEST | ✅ S–M; pawn-only terms |
| 4 | testable, measurable acceptance | ✅ form (b): K0–K7 from `ADR-0075` d7. K2's value rows are row 10's |
| 5 | dependencies known | ✅ `ADR-0075`; the probe after A4; `ABC-305` before the build; first of the four; its read after `ABC-303` and `ABC-289`; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-009` 640 KiB, ≤ 16 MiB; `G2` ≤ 1.03 ×; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S–M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **`ADR-0075` is accepted; K2's value rows and re-point list are owed: the Architect's dated line, after the probe** |

**DoR 9/10. In Design.**
