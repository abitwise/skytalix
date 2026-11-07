---
id: ABC-291
title: "E4b: pawn structure. Connected and phalanx pawns earn a tapered bonus and backward pawns a tapered penalty, with hand values fixed by a stated rule and judged on its own C2′. First of the four terms on the tuning wait. NOT MET on C2′, 46.0 of 100 against ≥ 50.0, clean, by F4 through CF5. Nothing merged; d11 (d) applies"
status: dropped
column: Blocked
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0075, accepted by the owner 2026-11-05 (…c1623ae7), in force at this ticket's merge: form (b) on main's tapered evaluation. Definitions and hand values d1 and d2, pawn memo d3 with d5's named cut carried, so 576 KiB and NFR-009 +0, one switch and a test-only off-door pair d4, G2 ≤ 1.03 × d5, intent GAIN d6, bars K0–K7 d7, the probe d10, the tool line d11 (a). Its probe ran once, 2026-11-05: the premise stands under rule 3 (…2926c26b). K0 (c)'s counts and K2's list are in its § The probe's reading. 2026-11-07 (bapm-ABC-291-closed): NOT MET by F4 through CF5, C2′ 46.0 of 100 (…211fb87a), so it stays accepted, not in force, and d11 (d) applies. Its § Status is arch-ABC-291-closed's"
---

# ABC-291: connected, phalanx and backward pawns (E4b)

> **NOT MET ON C2′, 46.0 OF 100; F4 BY CF5; NOTHING MERGED; NOT RE-PLAYED; d11 (d) APPLIES; `NFR-008` UNRESOLVED AND MOOT ON THIS TREE, 2026-11-07, by BA/PM** (task `bapm-ABC-291-closed`, records only, at `main` `78f13b30`, `grugops/qe-ABC-291` read at `66ca8de0`, read only; nothing run).
> Sources: `qe-ABC-291` `…211fb87a`, `…6bea8618`, `…f1d180b8` and `…a207a827`, and the Orchestrator's `…ef659beb`. QE's notes sit only on `grugops/qe-ABC-291`, not on `main`, so they depend on that branch being kept.
> - **The read:** candidate `70d931ab` against `780d9021`, 100 of 100 complete, W/L/D 36 / 44 / 20, **46.0 against ≥ 50.0**, 0 faults, 0 losses on time. § The read as played holds every row.
> - **The bar is missed. The term is not shown worse.** Elo −27.9 ± 61.6, and the interval spans 0. Nor is this a defect finding: K0 to K3 and K7 stand on this tree.
> - **Not re-played, whatever the interval.** CF5 makes a clean low score final. F4 fired. No other CF line fired.
> - **d11 (d) applies: no second set of values.** `PAWN_CONNECTED`, `PAWN_PHALANX` and `PAWN_BACKWARD` get no new numbers by hand.
> - **S′ and the Levels lane were not played.** No score exists for either. QE sealed that reading before any score (`…a207a827` § 5), and the Orchestrator lets it stand (`…ef659beb`).
> - **`NFR-008` stays UNRESOLVED:** H − B +0.155 s against ≤ +0.10 s. It reads neither MET nor NOT MET, and no game moved it. It is moot on this tree because no merge rides on it. The budget for later terms stays open.
> - **K1 (c) stays in two halves:** the rows read, 60, green, in all four images. The order, "fixtures QE freezes before the build", is not met to the letter. Neither half is written as K1 (c) met.
> - **Nothing of this ticket is on `main`:** no term, door, row, re-pin or tool line. `grugops/ABC-291` (candidate `70d931ab`, tip `9e496e4a`) and `grugops/qe-ABC-291` are kept, unmerged. Every figure below is that tree's. `ABC-282` A0-3's dated line says so for its pins.
> - **`ADR-0075` stays accepted, not in force.** What its dated lines become is `arch-ABC-291-closed`'s, in flight, and so is what the miss means for the term order.
> - **Front matter:** status `dropped` and column Blocked, as `ABC-289`'s page and the board card read. No `closed:` line: column Done and `closed:` land at the close, which is the Orchestrator's board move. The title gains its outcome at the end and keeps its old words. The file name keeps its as-cut slug.
> - **What this page leaves for the owner: no question.** No answer of his holds this ticket, unlike `ABC-289`'s OQ-0074-2.
>   - His "route a" is spent. The budget option (b), ≤ +0.20 s for this ticket only, was never ruled and has no merge to apply to.
>   - K1 (c)'s order, and K1 (h)'s reading (accepted by the Orchestrator and told to him), each carried a merge question. No merge rides on either now.
>   - A new form would need a new definition, a reason drawn from no missed read, its own ADR and his acceptance (d11 (d)). Nobody proposes one.
>   - The budget for later terms is the one thing left, and it is not this page's: `arch-ABC-291-closed` item 4.
> - **No value, rule, definition, ratio, intent, level or bar moved.** No size or priority moves. The board stays the Orchestrator's.

> **K1 (c)'S FREEZE CAME AFTER THE BUILD; THE SIX PINS READ GREEN; DRIFT IS NO DEFECT; DoR 10/10, UNCHANGED, 2026-11-06, by BA/PM** (task `bapm-ABC-291-k1-lines`, records only, at `main` `e460342e`, `grugops/ABC-291` read at `9e496e4a`, read only; nothing run).
> Sources: `qe-ABC-291-k1` `…2e186a33`, `…b850a2ad`, `…a223d29a` and `…5de6a358`, `se-ABC-291-repair` `…fd2ea321` and `…2cddd25a`, `se-ABC-291-k1rows` `…96abeaf8` and `…c4360feb`, and the Orchestrator's `…a7dc99cb` and `…5a2d8753`.
> - **K1 (c): the freeze was missed at dispatch.** QE froze its fixtures after the build. 0 of the 36 rows' values differed, and 24 rows joined, 60 in all. The bar's words "before the build" were not met, and no later step can meet them. This page records that and does not read the clause as met. K1 (c).
> - **K2: the figures allowed read green at the repair,** `a3474306`. `cp 88`, `cp 99` and `nodes 10614` are confirmed by run. The run is the Engineer's, and QE's read is owed. K2.
> - **Drift at d5: no defect.** M3 moved it, and why it reacts is by reading only. C2′ prices it. § Reports, not bars.
> - **Stale lines dated:** § Dependencies' Order line, `ABC-282` A2 (b)'s fixture and the row count in § `UNKNOWN - verify`, and Scope 4 and K7's `QUIET_RULES` pointer. "K3 is unread" stays until QE closes it.
> - **No value, rule, definition, ratio, intent or level moved,** and no bar's words changed. This is no verdict and no merge call. **DoR 10/10, unchanged.**

> **`se-ABC-291`'S STOP IS RULED; `G1` HERE IS CLASS B; K1 (h)'S WORDS DO NOT HOLD FOR ONE EXPORT; IN DEVELOPMENT; DoR 10/10, UNCHANGED, 2026-11-06, by BA/PM** (task `bapm-ABC-291-stop-lines`, records only, at `main` `d9a44fe6`; nothing run).
> Sources: `arch-records-1106` `…860a0dbd`, `arch-ABC-291-stop` `…2d2c2bad` and `…77dd9228`, the Orchestrator's `…5c911039`, and the dated lines of those tasks in `ADR-0075` and `ADR-0071` D8.
> - **`G1`'s class is ruled:** every `G1` row missed on this ticket is class B, and F3 reads as written. K3.
> - **K1 (h): one bar's words do not hold as written, for one export.** No build that holds d4 can meet them for `evaluateAtPhaseWithoutPawnShape`. `ADR-0075`'s dated line reads the row for it and adds one real read. The Orchestrator accepts that as a reading, not a loosening, and has told the owner. If he reads it as a loosening, it returns to the Architect. K1 (h).
> - **K2:** 64 rows at `8e115110`, and six deep pins join the list, `ABC-282` A0-3's. K2.
> - **The tip stays do-not-merge** until `…2d2c2bad` § 5's list lands (`se-ABC-291-repair`). If `qe-ABC-291-k1` finds a defect whose fix moves a production line, the six pins are void, they return to the Architect, and K0 (c) and K3 are read again.
> *2026-11-06 (`bapm-ABC-291-k1-lines`; `…2cddd25a`, `…a223d29a`, `…5a2d8753`): § 5's list landed at `a3474306`. QE found no defect and no production line moved, so the void did not fire and `…2d2c2bad` § 1's lines stand. This is no merge call: the tip's merge state is QE's and the Orchestrator's.*
> - **Not on this page yet:** K1 (c)'s line. `qe-ABC-291-k1` is reading it, after the build, and the line follows its report.
> *2026-11-06 (`bapm-ABC-291-k1-lines`): written. See K1 (c).*
> - **No value, rule, definition, ratio, intent or level moved.** K3, F3, d11 (d) and `G1`'s bar are unchanged. **DoR 10/10, unchanged:** row 7 reads 1–5. Status and column read In Development, as the board card does.

> **`ABC-289` COMES OFF THE BUILD; THE READ QUEUE IS MET; K3 IS UNREAD ON A P4 TREE; DoR 10/10, UNCHANGED, 2026-11-06, by BA/PM** (task `bapm-lines-1106b`, records only, at `main` `bc2bb953`; nothing run).
> Sources: `arch-ABC-289-joint` `…7c297147` § 4 and `…d61479af`, `arch-ABC-303-b5` `…28283e48`, and the Orchestrator's `…40ef8351` and `…aaeffb04`.
> - **The build goes now, on `main`:** bundle 1 is in, and there is no delta door. `…69ee96e7`'s `ABC-289` clause is lifted (`…40ef8351`). § Dependencies and DoR row 5.
> - **The read queue is met:** `ABC-303` merged at `434fa171`, and `ABC-289`'s outcome is recorded, NOT MET on an exact build. § Dependencies.
> - **Re-derived on the build's base:** K0 (b), K0 (c) and K2. `ADR-0075` d4's "those `ABC-303` and `ABC-289` add" reads `ABC-303`'s only.
> - **New `UNKNOWN - verify`:** the probe ran before bundle 1, so K3 is unread on a tree with P4 in it. `G1` is thin there (K3).
> - **Not settled, and not ruled here:** which `ADR-0034` class a `G1` miss by growth takes on this diff (K3).
>   *2026-11-06 (`bapm-ABC-291-stop-lines`; `…860a0dbd`): ruled. Class B, and F3 reads as written. See K3.*
> - **Carried:** `…28283e48`'s (a) to (f) (test note 5). E stays 1 810 (K6).
> - **No bar, value, definition, ratio or intent moved. DoR 10/10, unchanged.** The front matter is not on this hop's list and still reads Ready; the board card reads In Development.
>   *2026-11-06 (`bapm-ABC-291-stop-lines`): the front matter reads In Development.*

> **THE PROBE RAN: THE PREMISE STANDS UNDER RULE 3; THE BUILD CARRIES d5'S CUT; SIZE M; DoR 10/10; READY, 2026-11-05, by BA/PM** (task `bapm-ABC-291-probe-lines`, records only, at `main`
> `f22de7e8`; nothing run). Sources: `arch-ABC-291-probe` `…65c7a9c9` and `…2926c26b`, `ADR-0075` § The probe's reading, and the Orchestrator's rulings `…69ee96e7`.
> - **No value, rule, definition, ratio, intent or bar moved.** The line reads "the premise stands under rule 3", not "MET": PR8 read R = 1.04287, above 1.03, so rule 5 does not apply.
> - **The memo stays 576 KiB and `NFR-009`'s +65 536 reads 0** (ruling 3). `ADR-0075`'s title, d3 and § Consequences still read 640 KiB and +65 536. That is d3's form before the cut, not a disagreement: d5 named the
>   cut, rule 3 spends it, and ruling 3 reads the result. On these two figures those hold, not the older lines.
> - **On the page:** the probe's reading, K2's list by pointer, K0 (c)'s counts by pointer, rulings 1 and 2, size M, § `UNKNOWN - verify` trimmed to what stays open.
> - **DoR row 10 closes** on `…2926c26b`. Status and column read Ready. The board move is the Orchestrator's. **The build stays behind `ABC-303`, `ABC-289` and `ABC-305`.**
>   *2026-11-06 (`bapm-lines-1106b`; `…40ef8351`, `…7c297147` § 4): `ABC-289` comes off, and `ABC-303` and `ABC-305` are Done, so nothing holds the build. See § Dependencies.*

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
  *2026-11-07 (`bapm-ABC-291-closed`; `ADR-0075` d11 (d), `…211fb87a`): **this term did not merge, so neither this line nor "Its own read" above fires.** It opens no third-pull door, and a term that missed is not on `main`, so no pull can fit it. Scope 5's tool line did not land on `main`.*

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
   *2026-11-06 (`bapm-ABC-291-k1-lines`; `ADR-0075` d11 (a)'s dated line of `arch-ABC-291-stop`, `…2d2c2bad` § 3): **`QUIET_RULES` carries `pawnShape: true` too, and that ADR line governs.** d4's "on in `search()` and `chooseMove` only" speaks of the shipped recursions, and a tool's own record is not one. The words above stay. `se-ABC-291-repair`'s source row reads every carrier, K1 (h)'s added read (`…fd2ea321`, `…2cddd25a`).*
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
    *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 item 3): **the build's base is `main`, with bundle 1 in and no `…WithoutDeltaPruning`.** So (b) and (c) are re-derived there, by (c)'s own line, with both sets in the PR. (b)'s older doors include the six bundle 1 added, `…WithoutMoveCountPruning`, `…WithoutCountermove` and `…WithoutQuietBundle`, each a `search` and a `chooseMove` door. `ADR-0075` d4's "those `ABC-303` and `ABC-289` add" reads `ABC-303`'s only: `ABC-289` merged nothing and adds no door. A re-derived count is a dated line here, never a moved bar.*
- **K1, units (default lane, no search):**
  - (a) the mirror, `Object.is`: `G3` + `TAPER_MIRROR_POSITIONS` + ≥ 12 new pawn-shape positions, 0 mismatches;
  - (b) `evaluateAtPhaseWithoutPawnShape` and `evaluateWithoutTaper` are `Object.is`-equal to the pre-ticket entries over the frozen corpora;
  - (c) **seam rows, by arithmetic, on fixtures QE freezes before the build:** at least one per definition per colour, and one per edge file per
    definition. They include each clause of Backward failing alone, and d1's exclusions;
    *2026-11-06 (`bapm-ABC-291-k1-lines`; the Orchestrator's `…a7dc99cb`, `…5a2d8753`, `qe-ABC-291-k1` `…2e186a33`, `…b850a2ad`, `…5de6a358`, `se-ABC-291-k1rows` `…96abeaf8`, `…c4360feb`): **QE's freeze came after the build, not before it. It was missed at dispatch:** the Orchestrator sent the build without it, so `SEAM_ROWS`' first 36 rows are the Engineer's.*
    - ***The compare:** QE wrote its list blind from d1 and d2, and committed it at `4948aad0` before it opened `SEAM_ROWS`. At `63af973e`, **0 of the 36 rows' values differed.** QE's hand values and labeller have one author, so this catches arithmetic, not a misreading of d1.*
    - ***The gaps:** d1's double step and en passant had no row, and 13 of QE's 31 labeller mutants passed the 36 unseen. These are missing rows, not faults: no d1–d4 defect was found, and F1 did not fire.*
    - ***The rows:** the Orchestrator took QE's whole gap table. **24 rows were added at `70d931ab`, 60 in all,** QE's values unchanged, and none read red. The Engineer also made the block read the file flip, a call open to QE (`…96abeaf8`). QE's read of K1 at the tip is owed.*
    - ***The bar:** the words above stay. "Before the build" was not met, and no later step can meet it. This line records the order. It does not read the clause as met, and it rules nothing. `ADR-0075` K1 (c) has no dated line on it.*
    - *2026-11-07 (`bapm-ABC-291-closed`; `…f80750e9`, `…211fb87a`, `…ef659beb`): **the two halves, as QE read them.** Rows: 60, green, in all four images, read by count and by reading, so the read owed above is made. Order: not met to the letter. No line reads the clause as met. Whether the ticket could merge on that was the owner's question, and no merge rides on it now.*
  - (d) **the hot path:** `evaluate` minus the off-door evaluation equals the seam's white minus black, signed for the side to move, exactly. With
    equal halves the blend adds nothing, so there is no tolerance. A second row, inside `withParametersForTest` at unequal test halves, reads the blend in
    `ADR-0070` d4's own-phase form;
  - (e) the rule: each export equals d2's table, rebuilt in the row from the rule and the anchors' values at this ADR's date;
  - (f) `ABC-274` A9's bound reads the three pairs (8 × (largest connected + largest phalanx + backward) per side);
  - (g) the memo: a hit returns what a fresh `pawnStructure` returns, shape part included, on a forced collision too, and on an on-then-off read of one slot;
  - (h) a source row: `pawnShapeForTest` and `evaluateAtPhaseWithoutPawnShape` are called from test files only.
    *2026-11-06 (`bapm-ABC-291-stop-lines`; `…2d2c2bad` § 2, `…5c911039`): **`ADR-0075` K1 (h)'s dated line of `arch-ABC-291-stop` governs.** The words above stay. For `evaluateAtPhaseWithoutPawnShape` they do not hold as written: d4 calls it "the evaluation those doors call", so no build that holds d4 meets them. For that export the row reads: its only callers outside test files are the three off branches, and no shipped search takes one. `pawnShapeForTest` keeps the letter. One read is added, a default-lane source row on `pawnShape: true` (`…2d2c2bad` § 5 item 3), and it lands with the repair. The Orchestrator accepts this as a reading, not a loosening, and has told the owner. If he reads it as a bar loosened after Ready, it returns to the Architect.*
- **K2, the re-pins.** Two byte rows, 589 824 → 655 360: `src/evaluate.pawns.test.ts` (with its slot formula) and `src/transposition.test.ts`. They
  record a structure's size. ~~**The value rows and the re-point list are `UNKNOWN - verify` until PR11's lane report.** That list joins this
  decision by a dated line before Ready.~~ A re-pin outside it is a defect.
  *Dated 2026-11-05 (`arch-ABC-291-probe`): the list is in § The probe's reading. With d5's cut in the build, the two byte rows do not move.*
  - **K2's list, by pointer:** `ADR-0075` § The probe's reading, and `…2926c26b` § K2's list. Its 58 rows in six groups, and four more call lines in `src/search.futility.test.ts`, are not restated here.
  - **It binds at `cc6e64d1`.** On a later base it is re-derived as K0 (c)'s counts are, with both lists in the PR. A re-derived line is a dated line, never a moved bar.
    *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 item 3): that later base is the build's: `main`, bundle 1 in, no `…WithoutDeltaPruning`. The list is re-derived there.*
    *2026-11-06 (`bapm-ABC-291-stop-lines`; `ADR-0075` K2's dated line of `arch-ABC-291-stop`): **re-derived at `8e115110`: 64 rows** (`se-ABC-291` `…cb124720`), with K0 (c)'s two sets in `…f0c9e801`. The 58 above stay the list at `cc6e64d1`.*
  - **The deep lanes** (`…69ee96e7` ruling 2): re-points and door joins follow d4 by reference, each named in the PR. Any deep value re-pin or lost fixture goes to the Architect before it lands.
    *2026-11-06 (`bapm-ABC-291-stop-lines`; `…2d2c2bad` § 1, `ADR-0075` K2's dated line, `ADR-0071` D8's dated line of `arch-ABC-291-stop`): **that hop is made. Six deep pins join K2's list:** `ABC-282` A0-3 in `src/uci-session.test.ts`. `ADR-0071` D8's line holds each literal and governs.*
    - *`D8`, four rows: cp 45 → 74. `D7`, one row: cp 43 → 88. `D6`, one row, `go depth 6`: cp 87 → 99, nodes 10 513 → 10 614, nps 618 412 → 624 353. `depth`, `time` and `bestmove c3d5` stay on all six, and `nodes` and `nps` on the five.*
    - *These are the figures allowed, not yet a green read: the six rows are red at `63af973e`, and the repair lands them. `cp 88`, `cp 99` and `nodes 10614` rest on `…a8daf408` alone (`…77dd9228`). The repair's lane run is their check, and a literal that reads otherwise is its STOP.*
    - *2026-11-06 (`bapm-ABC-291-k1-lines`; `se-ABC-291-repair` `…fd2ea321`, `…2cddd25a`, `…5a2d8753`): **the figures allowed now read green at the repair.** All six rows are in at `a3474306`, and `ENGINE_DEEP` `src/uci-session.test.ts` read 270 of 270 on that tree. So `cp 88`, `cp 99` and `nodes 10614` are confirmed by run, and no STOP line fired. That test file is unchanged at `9e496e4a`. `…2d2c2bad` § 6's void did not fire. The run is the Engineer's. QE's read of K2 is owed, and so is `D8`'s leak plant (`…77dd9228`).*
    - *2026-11-07 (`bapm-ABC-291-closed`; `…710af068`, `…d8e51b65`): **QE's read of K2 and `D8`'s leak plant are made.** K2 holds with one row named: 62 of 63 reds are in the list, and the 63rd, `tools/tune/tune.test.ts`'s rules-record row, is confirmed by `…2d2c2bad` § 3 and is no defect. `ENGINE_DEEP` `src/uci-session.test.ts` read 270 of 270. Each `D8` row and the `D7` row go red under a planted `W1` leak. **None of these re-pins is on `main`:** `ABC-282` A0-3's dated line of this date.*
    - *Deep re-points, figures unchanged: `ABC-303`'s depth-8 counts, 2 rows, by `ADR-0075` d4's dated line, and `ABC-282` A0-1, 6, and A0-2, 4.*
- **K3, safety (`ADR-0064` d7's rows):** mate floor 0 violations, door d4 → head d5 and d5 → d5 on the 287; zugzwang **7 / 7** at recorded depths with
  `zugzwang.001` among them; `G1` no NEWLY-MISSED line. All read all-on. No depth moves, and no expected result is rewritten.
  *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 items 4 and 5, `…d61479af` § 2, `…40ef8351`):*
  - ***K3 is unread on this tree.** The probe's PR1 to PR7 ran before bundle 1, on `cc6e64d1`. Moving the tree under a read bar is what stopped `ABC-289`. § `UNKNOWN - verify`.*
  - ***`G1` is thin on this base.** "mate in 3, seed 1632" uses 16 838 of 20 534 nodes on `main`, 82 % of its budget, and `main` misses it at 0.8× readings, so the row has lost `ADR-0034` d5's margin. `main` is green at 1×. The Orchestrator carries a watch on every `G1` read, and QE reports it. Bars unchanged: K3 and F3 stand.*
  - ~~***The class of a miss by growth is not settled.** `…7c297147` reads it as class D, the owner's, because an evaluation-only diff has a drift class. `ADR-0034` d2 gives that class only when its instrument prints `src/evaluate*.ts` alone. `ADR-0075` d4 puts the switch in `src/search.ts`, `src/engine.ts` and quiescence's rules record, and the probe's patch edits those three files. On that letter the diff has no drift class, every missed row is class B, and F3 reads as it stands. This page writes neither reading as ruled, and neither moves a bar. It is the Architect's.*~~
    *2026-11-06 (`bapm-ABC-291-stop-lines`; `…860a0dbd` § 1): **ruled. Every `G1` row missed on this ticket is class B, and F3 reads as written,** on `ADR-0034` d2's letter. This diff has no class D and no class L, whatever a ladder would show. `…7c297147` § 4 item 5's class sentence is withdrawn, and the rest of that note stands. A red stays a QE FAIL, then F3 runs: a defect is F1's, and with no defect the miss is real, so NOT MET, not merged, and a miss under d11 (d). `ADR-0034` d3's table, its owner line and d4's fixture and level lines are not routes here. A rung may be reported as evidence for the defect check, and it classes nothing. `ADR-0075` § What would falsify this holds the ruling. K3, F3, d11 (d) and `G1`'s bar are unchanged.*
  *2026-11-07 (`bapm-ABC-291-closed`; `…710af068`): **read on this tree, and met, so "K3 is unread" above is closed.** Mate floor 0 of 163 and 0 of 191 on the 287. Zugzwang 7 / 7, `zugzwang.001` among them. `G1` 54 / 58, 0 NEWLY-MISSED. Row 1632 solved at 1×, 16 838 of 20 534 nodes, 82.0 %, unchanged, and 0.8× still misses it. F3 did not fire.*
- **K4, `G2` ≤ 1.03 ×** (d5). The endgame report set is reported beside it.
  *2026-11-05 (`bapm-ABC-291-probe-lines`; `…69ee96e7` ruling 1): K4 on the build is F2's one re-read. K4 above 1.03 × is the second miss: not merged, and a miss under d11 (d). K4 runs with the owner holding the other
  project, so a void cannot be mistaken for a miss.*
  *2026-11-07 (`bapm-ABC-291-closed`; `…024bbd63`): **read and met:** R = 1.0267065, under the bar by 0.0033. F2's one re-read is spent. The endgame report set read 1.03298, a report with no bar.*
- **K5, `G6` under `Q-3K-4` (b):** every run at depth ≥ 6, depth 7 a WARN, "≥ base" reported, not graded.
  *2026-11-06 (`bapm-lines-1106`; `ADR-0075` § What would falsify this, `…7cb68537`, confirmed `…43e6d8fd` 2): the bar stands as written. A clean run below depth 6 on the build is F2's second miss. See § Falsifiers, F2's note.*
  *2026-11-07 (`bapm-ABC-291-closed`; `…024bbd63`): **read and met:** 20 of 20 runs, every head run at depth 10 or 12, no depth 7 WARN. "≥ base": head equals base on both boards, reported.*
- **K6, the read:** C2′ GAIN ≥ 50.0 of 100 at 100 ms against the merge-base, 100 of 100 complete, 0 candidate faults, 0 losses on time; then S′ at the E
  in force (1 810 today), S-4; then the Levels deep lane.
  *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 item 6, `…28283e48` § 5): E stays 1 810. `ABC-289` merged nothing and adds no S′, so the pool stands at 27.5 / 40.*
  *2026-11-07 (`bapm-ABC-291-closed`; `…211fb87a`, `…f1d180b8`): **C2′ read 46.0 of 100: NOT MET.** S′ and the Levels deep lane were not played, so "then S′" and "then the Levels deep lane" have no read here. `ABC-291` adds no S′: E stays 1 810 and the pool stands at 27.5 / 40. § The read as played.*
- **K7, the tool line** (d11 (a)): `TUNE_DEEP` green at the tip, its count reported.
  *2026-11-06 (`bapm-ABC-291-k1-lines`; `ADR-0075` d11 (a)'s dated line of `arch-ABC-291-stop`, `…2d2c2bad` § 3): **K7 cannot read green without `QUIET_RULES`' `pawnShape: true`, and that ADR line confirms it.** The record follows the evaluation, as its `taper: true` does, and `QUIET_RULES_NAME` changes with it. See Scope 4. The bar is unchanged.*
  *2026-11-07 (`bapm-ABC-291-closed`; `…710af068`): **read and met at the tip:** `TUNE_DEEP` 28 of 28. The tool line stays on the branch.*
- **Reports, not bars:** drift at d5, reach at 47 000, PR10's figures.
  *2026-11-06 (`bapm-ABC-291-k1-lines`; `qe-ABC-291-k1` `…a223d29a`, `…5de6a358`, `…5a2d8753`): **drift at d5 on the build's base is no defect, and F1 does not fire.** `se-ABC-291` read 96.79 % within 25 cp, largest 89 (position-6/e2d2, 12 → 101), against PR10's 100 % and 24 at `cc6e64d1`.*
  - ***M3 moved it, read by one short run.** With the bundle off, the figure reads the probe's on every field: 187 rows, 100 %, 24, position-5/e1f2, 4 moves. With M3 off alone it reads 100 %, largest 16. With countermove off it stays 96.79 %, 89. The term's values did not move.*
  - ***Of the 89, 10 is the static term and 79 is the tree.** A full-width tree reads 12 on both forms, so ON's 101 is a line the search missed. Δ falls to −2 at d6, and the row stays noisy: 23 at d8, 49 at d9.*
  - ***Why M3 reacts is by reading only.** No control term ran. § `UNKNOWN - verify`.*
  - ***Whether it costs play is C2′'s to price.** Drift has no bar and decides no merge. § The premise probe's PR10 line stays the reading at `cc6e64d1`. Whether it earns a dated line goes to the next Architect hop.*
  - *2026-11-07 (`bapm-ABC-291-closed`; `…710af068`, `…f1d180b8`): QE's own read matches: 96.79 % within 25 cp, largest 89. Reach at 47 000 read 7.0158 off, 7.0421 on. **C2′ read the term as a whole, and no split was run, so no read ties the miss to M3, to drift or to load.***

- **What a pass means (d9):** "not seen worse", not "proven better". By `ADR-0056`'s C2′ table a term truly worth +20 Elo passes 79 % of the time, +10 passes 66 %, 0 passes 50 %, −10 passes 34 %, and
  −20 passes 21 %. The term's Elo stays unknown, and the score is not added to any forecast.

### The read as played (2026-11-07)

*2026-11-07 (`bapm-ABC-291-closed`; `…211fb87a`, `…f1d180b8`, `…6bea8618`, `…ef659beb`): QE's rows as read, under PREREG `…a49d69d7`, addenda `…7febbbfe`, `…51558b04` and `…a207a827`. Candidate `70d931ab`, base `780d9021`. Every figure is `grugops/ABC-291`'s tree, not `main`'s. **Verdict: NOT MET on C2′, F4 by CF5, not merged, not re-played. UAT is not signed.***

| row | read | bar | state | note |
|---|---|---|---|---|
| Five files | blob equal at `63af973e` and the tip | equal | holds | `…710af068` |
| K0 (a), (b), (c) | 7 of 7, 70 of 70, 7 of 7 | exact | met | `…710af068` |
| K1 (a), (b), (d)–(h) | `npm test` 2 814 of 2 814; `ENGINE_DEEP` pawns 121 of 121 | green | met | `…710af068` |
| K1 (c), rows | 60, green, in all four images | by count | read, the first half | `…f80750e9` |
| K1 (c), order | "fixtures QE freezes before the build" | the letter | **not met to the letter**, the second half | `…f80750e9` |
| K2 | 62 of 63 reds in the list, the 63rd named and no defect | no re-pin outside the list | holds, one row named | `…710af068` |
| K3 | mate floor 0 of 163 and 0 of 191; zugzwang 7 / 7; `G1` 54 / 58, 0 NEWLY-MISSED | as sealed | met | `…710af068` |
| K4, `G2` | R 1.0267, F2's one re-read, spent | ≤ 1.03 × | met | `…024bbd63` |
| K5, `G6` | every head run at depth 10 or 12 | ≥ 6 | met | `…024bbd63` |
| K7 | `TUNE_DEEP` 28 of 28 | every row | met | `…710af068` |
| `NFR-008` | H − B +0.155 s, H 9.30 s, 0 of 8 flagged | H − B ≤ +0.10 s | **UNRESOLVED** | `…024bbd63` |
| K6, C2′ | 100 of 100, 36 / 44 / 20, **46.0**, 0 faults, 0 losses on time | ≥ 50.0 | **NOT MET** | `…f1d180b8` |
| K6, S′ at E 1 810 | not played | S-1, S-2, S-4 | no read | `…f1d180b8` |
| K6, Levels deep lane | not played | exit 0, every test | no read | `…f1d180b8` |

- **C2′:** one hold, 19:33:49Z to 19:55:24Z, 100 games at 100 ms, one launch, no void. Elo −27.9 ± 61.6, 20.5 / 50 as White, 25.5 / 50 as Black. Largest move 105 ms on each side, 0 past 150 ms. The harness's `state: NEUTRAL` is not the verdict. The raw files are `.grugops/context/qe-ABC-291/raw/out/c2/` on `grugops/qe-ABC-291`.
- **The line that fired:** CF5, "B6" by d8's table: NOT MET, nothing merges, a `failed-attempt` (`…6bea8618`), and back to BA/PM. CF1, CF2, CF3 and CF9 read and did not fire. H2's CF3 branch did not fire, and CF4 and CF6 to CF8 were not reached.
- **No ticket MET was open on this read.** `…a207a827` § 1 and the brief barred it, because `NFR-008` is unresolved and the budget call is the owner's. C2′ closes the ticket by its own line, so no MET waits on that call.
- **What the score does not say.** One read of 100 games does not show the term worse. The bar is what was missed. The term's Elo stays unknown: by d9's table a term truly worth +20 Elo still misses 21 % of the time.
- **S′ and the Levels lane:** QE's reading, sealed before any score, is that a clean C2′ NOT MET ends the read. § 6 lists all three in order, and no line says outright that a miss ends the rest. The Orchestrator let the reading stand and did not order them (`…ef659beb`). Neither could change this verdict.
- **`NFR-008`:** route (a), games first, was the owner's word after this result (`…6e0445ef`, `…d312965c`), so the games ran with the leg over. It stays UNRESOLVED: no bar moved, and no game result moved it. It is moot on this tree (`…ef659beb`). QE does not say it has lapsed, and this page does not: the budget for later terms stays open.
- **Foreign load, by class and count (FL).** W was dropped by a recorded line before the first game (`…70f8b0c2`). `fsample.sh` read 126 busy foreign of 428, and `host.log` 32 of 123, at most 3. Largest load1 4.11. One class, vitest in one foreign project, from 19:38:48Z to 19:53:48Z. FL grades the read as played, so no line changes and nothing is void. How load moves a score stays `UNKNOWN - verify`, and it is no ground for a re-read.
- **`<scratch>/qe291`'s arms are deleted** (`…ef659beb`). They rebuild from git, and no read is owed on them.

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
| F4 | C2′ NOT MET | not merged, not re-played, back to BA/PM, through CF1–CF10 and d8's table. d11 (d) applies *(fired 2026-11-07 by CF5: a clean C2′ at 46.0; `…211fb87a`, `…6bea8618`; `bapm-ABC-291-closed`)* |
| F5 | the probe's rule 2 or 4 | this ticket is not built. `ADR-0075` reads "accepted, not in force". d11 (d) applies. *Did not fire (2026-11-05, `…2926c26b`)* |
| F6 | an identity-gate miss at the tip (d11 (a)) | read against d1's words. `evaluate` wrong is F1. The tracer wrong is a tool defect. No production line changes to fit the tool |

- **F2 after the probe** (2026-11-05, `bapm-ABC-291-probe-lines`; `…69ee96e7` ruling 1): rule 3 spends d5's cut before the build. **K4 on the build is F2's one re-read. K4 above 1.03 × is the second miss: not merged, and a miss under d11 (d).**
  This is the stricter reading, and it stands before QE seals K4's PREREG. The ruling names K4 only. F2's other half, a run below depth 6 on K5, still stops to Architect/Design, but no cut is left for it, and what follows there is not ruled.
  *2026-11-06 (`bapm-lines-1106`): **K5's half now has its reading,** `ADR-0075` § What would falsify this (`…7cb68537`), confirmed by the Orchestrator (`…43e6d8fd` 2). The ADR holds the text; in short:*
  - *F2 is one row, so one cut and one re-read. PR8 spent the cut, so the build is the one re-read for both halves.*
  - *A clean run below depth 6 on K5 is F2's second miss: STOP to Architect/Design, a defect check first, then not merged.*
  - *No re-read of the same code: it could only replay a recorded FAIL into a pass.*
  - *A void is not a miss, and a re-read after a void is not F2's re-read.*
  - *No bar or level moves: depth 6, the depth-7 WARN, "≥ base" reported, `G6`'s rule and `NFR-005`'s level stand.*

- **A candidate fault in the read:** CF1–CF10 reach this read, by the owner's word (`…0f1ab02e` item 1). ~~The form QE copies for a single-part read
  is `arch-owner-answers-1105b`'s, in flight.~~ *2026-11-05 (`bapm-pointers-1105`): **settled.** The form, alone or in a bundle, is `ADR-0056` D5's dated block of
  `arch-owner-answers-1105b` (`…65557abd`): QE copies its Reach line and CF1–CF10 unaltered, then its table, filled from this page and the ADR. The block governs. No bar moves.*
  *2026-11-05 (`bapm-ABC-291-lines`): `ADR-0075` d8 is that table, filled for this ticket. It adds no bar.*
- **No second set of values after a miss** (`ADR-0075` d11 (d)): a rule for this term, on his acceptance (`…c1623ae7`). It does not yet bind the later terms; each asks him in its own ADR.
  - After a miss, `PAWN_CONNECTED`, `PAWN_PHALANX` and `PAWN_BACKWARD` do not get new numbers by hand.
  - **A miss is:** a real safety red (F3), C2′ below the bar on a clean read, a CF2 or CF8 NOT MET, a second `G2` miss *(K4 above 1.03 × on the build, ruling 1)*, or the probe's rule 2 or 4.
    *2026-11-06 (`bapm-lines-1106`; `…43e6d8fd` 3): **a second K5 miss counts as a miss here.** That is F2's second miss on K5's half: a clean run below depth 6 on the build. New numbers after a cost miss are numbers chosen after a miss, so this narrows what may follow and loosens nothing. It is the Orchestrator's ruling, told to the owner and open to his overruling, as d11's readings are. `ADR-0075`'s list names only "a second `G2` miss", and its § What would falsify this leaves this point with the Orchestrator; the ruling answers that question.*
  - **Not a miss:** a defect fix that restores d1 or d2.
  - A miss here leaves `ABC-292` where it stands.
  - *2026-11-07 (`bapm-ABC-291-closed`; `…6bea8618`, `…ef659beb`): **this miss is on the list above:** C2′ below the bar on a clean read. d1, d2, d3 and d4 do not move to rescue it. Where the term order stands after it is `arch-ABC-291-closed`'s.*

## NFR triggers

- **`NFR-009`** (`G7`): ~~+65 536 bytes, 640 KiB~~ **+0 bytes, 576 KiB, with d5's cut** *(2026-11-05, `bapm-ABC-291-probe-lines`; `…69ee96e7` ruling 3)*, fixed at load; ≤ 16 MiB in all, ≤ 1 MiB growth between a 1 s and a 4 s search.
- **`NFR-001` / `G2`:** K4, ≤ 1.03 ×. **`NFR-005`:** K5. **`NFR-008`** (≤ 10 s): K1's rows are units with no search. Their cost in the lane is `UNKNOWN - verify`, and the row census the Orchestrator placed
  after A4 gates the merge.
  *2026-11-07 (`bapm-ABC-291-closed`; `…024bbd63`, `…211fb87a`, `…ef659beb`): **`NFR-008` read UNRESOLVED:** H 9.30 s, under 10 s, and H − B +0.155 s against ≤ +0.10 s. The added rows cost 34 ms in-thread. No bar moved. Moot on this tree, since no merge rides on it. The budget for later terms stays open.*

## Test notes

1. QE freezes the seam fixtures and the (b) rows before the build. The probe's 16 positions (`PAWN_SET`, in `arch-ABC-291-probe`'s `raw/scripts/e4bprobe.ts`) meet K1 (a)'s "at least 12", and they are offered to QE.
   *2026-11-06 (`bapm-ABC-291-k1-lines`; `…a7dc99cb`, `…b850a2ad`): the seam fixtures were frozen after the build (K1 (c)). The "(b) rows" were outside `qe-ABC-291-k1`'s brief and are not read, and no freeze of them is on the record.*
2. UAT is owed (production lines); the QE verdict signs it.
   *2026-11-07 (`bapm-ABC-291-closed`; `…211fb87a`): UAT is not signed. The verdict is NOT MET, and no production line landed.*
3. QE's PREREG for K4 states PR8's two levels, about 316 and 335 ns, and expects K4 to read the same way. Their cause is `UNKNOWN - verify`.
4. *2026-11-06 (`bapm-lines-1106`; `…43e6d8fd` 3 and 5):* K4's PREREG carries K5's read and void rule. QE's briefs carry `ADR-0046`'s 23rd line, `F1`'s, in § Dated 2026-11-05 (`arch-ABC-307-records`), so the run rule's "every line" reads 23. It read 1 passed by name at `qe-ABC-305` (`…482f3e67`). That is the rule's count, not a new bar on this page.
5. *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 item 6, `…28283e48` § 3, `…aaeffb04` 1 to 3):* `…28283e48` § 3's lines stay owed, and no line of them is a bar. This read's QE brief and PREREG carry its (a) to (f):
   - (a) FL word for word, after CF10 and after `ADR-0075` d8's table.
   - (b) `fsample.sh` by name, sha256 `705353d632274a01`.
   - (c) W is not inherited. The Orchestrator asks the owner before the first game, and the timing rows keep their void lines.
   - (d) the Levels line, confirmed by `…aaeffb04` 1: "alone" means alone under the lock, no void for load, graded as played, and a red is CF7's.
   - (e) the bar, not the harness's `state:` label.
   - (f) FL stops at games. It does not reach `G6`, K4, K5 or `NFR-008`.

## Size and priority

- **Size: M** *(2026-11-05, `bapm-ABC-291-probe-lines`; `…2926c26b`: was S–M. Priced from the prototype, 305 lines added and 18 removed in five `src/` files, plus d5's cut, the tool line, QE's frozen fixtures and K1's rows (a) to (h). K2's list touches 58 rows and four more lines in 12 test files, and one fixture is re-found)*. **Priority: P2** *(2026-11-05, `bapm-wait-lines-1105`: was P3; first in the accepted order)*.

## Dependencies

- **`ADR-0075`: accepted by the owner (`…c1623ae7`), in force at this ticket's merge.** Its probe ran on 2026-11-05 (§ The premise probe).
- **K2's list:** written, the Architect's dated line in `ADR-0075` § The probe's reading. DoR row 10 is closed. It is re-derived on the build's base.
- ~~**The build stays behind `ABC-303`, `ABC-289` and `ABC-305`** *(2026-11-05, `bapm-ABC-291-probe-lines`; `…69ee96e7`)*. Each can add a door or a row to K0 (c) and K2.~~
  *2026-11-06 (`bapm-lines-1106b`; `…40ef8351`, `…7c297147` § 4): **`ABC-289` comes off, and the build goes now on `main`,** on a base with bundle 1 in and no delta door. `…69ee96e7`'s `ABC-289` clause is lifted. `ABC-303` merged `434fa171` and `ABC-305` merged `d00164ce`, so neither holds it.*
- **`ABC-305` merges before this ticket's build** (d11 (a)). `ABC-305` A6 would STOP on a `TUNE_DEEP` lane this merge had reddened. If E2 closes for good, no tool line is owed by any later term.
- **First of the four.**
- **The read queues.** A value-changing merge stales the read after it, so this term's C2′ follows `ABC-303` and `ABC-289`.
  *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4, `…40ef8351`): **met.** `ABC-303` merged at `434fa171`, and `ABC-289`'s recorded outcome, NOT MET on an exact build with nothing merged, meets it. OQ-0074-2 blocks nothing. If the owner opens a route there, this read goes first or waits, and the Orchestrator tells him that its going first differs from what he was shown. `ADR-0075` § Consequences' Order line is owed to the next Architect hop.*
  *2026-11-06 (`bapm-ABC-291-k1-lines`; `…860a0dbd`, `…2d2c2bad` § 4): that line is no longer owed. `arch-records-1106` dated `ADR-0075` § Consequences' Order line, and `arch-ABC-291-stop` dated `ADR-0056` D6's.*
- **`ABC-301` closed NOT MET:** the trigger is met. *2026-11-05: "E2's second pull merged or closed" is gone as a wait.*
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-290`, `ABC-292`–`ABC-294`.
- *2026-11-07 (`bapm-ABC-291-closed`; `…211fb87a`, `…ef659beb`):* **the waits above are spent.** The ticket read and merged nothing, so `ADR-0075` did not come into force and no value-changing merge stales a later read. OQ-0074-2 stays open, and `ABC-291`'s read went first: the Orchestrator's line to the owner on that stands if he opens a route (`…40ef8351`). This term merged nothing, so it is not on the tree any route would read. `ABC-292` stands where it stood (d11 (d)). What the miss means for the order, the wait and `ADR-0056` D5 is `arch-ABC-291-closed`'s, in flight.

## `UNKNOWN - verify`

`ADR-0075` § `UNKNOWN - verify` is the list, with its dated line. *2026-11-05 (`bapm-ABC-291-probe-lines`): trimmed to what stays open. The rows, `G2` at the probe, the firing share, the memo's hit rate and K2's list are read, and § The premise probe holds them.* Still open:

- *2026-11-06 (`bapm-lines-1106b`; `…7c297147` § 4 item 4):* **K3 on a tree with P4 in it: the mate floor, zugzwang and `G1`.** The probe ran before bundle 1, so none of the three is read there. A red is F3's. Drift is a report on this page, so that half of what stopped `ABC-289` is not here.
- ~~*2026-11-06 (`bapm-lines-1106b`):* **Which `ADR-0034` class a `G1` miss by growth takes on this diff:** D by `…7c297147`, B by d2's instrument on `ADR-0075` d4's files (K3). The Architect's, before QE seals.~~ *2026-11-06 (`bapm-ABC-291-stop-lines`; `…860a0dbd`): **ruled, so no longer open:** class B, and F3 reads as written (K3).*
- `G6`, the miss-path cost (the memo-bypassed ratio is void), what the cut buys, and every play read.
- The cause of PR8's two levels.
- *2026-11-06 (`bapm-ABC-291-k1-lines`; `…a223d29a`):* **Why M3 moved drift at d5, and whether that costs play.** Whether M3 reacts this way to any small evaluation change, or to this term more than others, is unread. C2′ prices the play.
- The deep lanes' rows. They were not read. Ruling 2 says how a row there is handled, not which rows move.
- ~~`ABC-282` A2 (b)'s new fixture, which d4 sends to `ADR-0028` d2. It is the one default-lane figure left.~~ *2026-11-06 (`bapm-ABC-291-k1-lines`; `se-ABC-291` `…d68ef14e` item 6, `…cb124720`): **re-found under `ADR-0028` d2 by the row's own scan, not re-pinned:** `r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/3RK2R b Kkq - 1 1`, b4c3 230, budget 5, depth 2. The Engineer's report. QE's read of K2 is owed.*
- Whether this term holds `zugzwang.001`. Whether any hand-valued term pays. Its share of row E4's estimate.
- ~~This ticket's exact default-lane row count.~~ *2026-11-06 (`bapm-ABC-291-k1-lines`; `…668c63b4`, `…2cddd25a`, `…c4360feb`): **2 734 → 2 814 at `70d931ab`, +80:** the build 55, the repair 1, K1's rows 24, no new file. The Engineer's counts. A later row moves the figure. The rows' cost stays with § NFR triggers.*
- Whether `TUNE_DEEP` is red on `main` today. That the merge reddens it is by reading, not by a run.
- Whether d2's low ranks push the engine toward flank pawn moves in front of its king. Reasoned as small, and unread.
- *2026-11-07 (`bapm-ABC-291-closed`; `…710af068`, `…024bbd63`, `…f1d180b8`):* **no read is owed on this tree.** The words above stay.
  - **Closed by QE's reads:** K3 on a tree with P4 in it. The deep lanes' rows. `G6`, as K5. `zugzwang.001`, read among the 7 / 7. `TUNE_DEEP` at the tip, 28 of 28; red on `main` is moot, since the merge did not happen. The miss-path ratio, now not void, r 1.0417 and 1.0568, a report.
  - **Stays unread:** S′ and the Levels lane on this tree. The cause of PR8's two levels, seen again at K4. Why M3 moved drift. How load moves a score. The term's worth, and whether any hand-valued term pays. Whether d2's low ranks push flank pawn moves.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no chain or backward terms; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–5 |
| 3 | INVEST | ✅ M; pawn-only terms |
| 4 | testable, measurable acceptance | ✅ form (b): K0–K7 from `ADR-0075` d7. K2's list is in § The probe's reading |
| 5 | dependencies known | ✅ `ADR-0075`; ~~the probe after A4~~ ~~*the probe after the census, which has reported (2026-11-05, `bapm-rows-cut-1105`; `…16e0ec2c`, `…19cea480`)*~~ *the probe has run (2026-11-05, `bapm-ABC-291-probe-lines`)*; ~~the build behind `ABC-303`, `ABC-289` and `ABC-305`~~ *the build on `main` now, `ABC-289` off, `ABC-303` and `ABC-305` Done (2026-11-06, `bapm-lines-1106b`; `…40ef8351`)*; first of the four; its read after `ABC-303` and `ABC-289` *(met 2026-11-06, `bapm-lines-1106b`; `…7c297147` § 4)*; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-009` 576 KiB, +0, ≤ 16 MiB; `G2` ≤ 1.03 ×; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ ~~1–2~~ 1–5 *(2026-11-06, `bapm-ABC-291-stop-lines`)* |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ **closed 2026-11-05** (`…2926c26b`): K2's list is written. The deep lanes are ruled (`…69ee96e7` ruling 2). The one default-lane figure left, `ABC-282` A2 (b)'s new fixture, goes to `ADR-0028` d2 |

**DoR 10/10. Ready.** *2026-11-06 (`bapm-lines-1106b`): unchanged. Row 5 follows the build's line. Row 10 holds: OQ-0074-2 blocks nothing, and K3's unread tree and the class question are `UNKNOWN - verify`, not blockers.*
*2026-11-06 (`bapm-ABC-291-stop-lines`; `…860a0dbd`): the class question is ruled, class B, F3 as written, and it leaves that line. Row 7 reads 1–5. DoR 10/10, unchanged. Status and column read In Development.*
*2026-11-06 (`bapm-ABC-291-k1-lines`): DoR 10/10, unchanged. Row 10's A2 (b) fixture is re-found (§ `UNKNOWN - verify`). K1 (c)'s order was missed at dispatch, after Ready, and no row here reads it.*
*2026-11-07 (`bapm-ABC-291-closed`): the rows stand as the record of what was Ready. The ticket reads NOT MET on C2′, status `dropped`, column Blocked. No DoR row moves.*
