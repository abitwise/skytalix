---
kind: adr
id: ADR-0070
---
# ADR-0070: E4a (`ABC-271`) lands as structure only, before the second tuning pull. King distance to the queening square, a free path, and the unstoppable passer by the rule of the square are added as endgame terms at 0, computed outside the pawn memo. So the build is value-identical and node-identical to `main`, with no switch, no doors and no games. The second pull fits king distance and free path; the unstoppable passer is held at 0. The probed rule values are not shipped

## Status

**ACCEPTED 2026-11-04 by the owner, in form (a): structure only, in `ADR-0068`'s form. Not in force until `ABC-271`
merges.** Recorded by Architect/Design (task `arch-ADR-0070-accept`, records only, on `grugops/arch-ADR-0070-accept`
from `main` `7a9ee712`). Nothing was run.
- **His word, verbatim** (`orch-2026-10-30a` `…e8a3b5df`): *"a"*. The question (`…e0ff0aeb`) was "accept ADR-0070 in
  the structure-only form (Orchestrator recommends), or override to the values route".
- **The Orchestrator's ruling it accepts** (`…e0ff0aeb`): the PREREG's sealed choice rule governs, not the judgment
  made after the reading. E3's generated relation rows missed (the square 44 / 404, king distance 312 / 2 123) and stay
  NOT MET. The restated relation domains apply only to a future attempt with its own PREREG. So choice rule 1 is not
  taken, and **choice rule 4** is: the fallback this ADR's § Alternatives named.
- **What it settles:** `ABC-271` is a structure ticket. It adds the three terms at `{ 0, 0 }`, value-identical and
  node-identical to `main` (K0–K4, decision 5), and plays no games. The second pull fits king distance and free path.
  One read, the second pull's, judges E4a's values.
- **The door reading.** The brief for this restatement wrote "behind the off-door pair" and listed "the door pair" among
  the bars. The accepted form has **no switch and no doors** (`…e0ff0aeb`; this ADR's § Alternatives; `ADR-0068` d4).
  Both readings are named here. The one taken is the accepted form: "the door pair" is read as **every existing door
  pair reads its pre-ticket counts** (K0). A new door pair is not added (§ Alternatives).
- **The file name** keeps the PROPOSED slug ("ship as rule values … behind a test-only off-door pair"), because sealed
  notes cite the path. The title above is the decision.
- **Lines written with the acceptance:**
  - `ADR-0067`: d5 (the tracer) and d6 (the second pull's free set), § Consequences item 5, a log row and a Status line;
  - `ADR-0056`: row E4 and D6 item 5;
  - `ADR-0064`: d10.
  - **Still owed** (BA/PM): the `ABC-271` page and `EPIC-011`. The lines are in this task's decision note.
- **Still the owner's, and not decided here:** `ADR-0067`'s d6 amendment (every relation bounded at once, the
  margin-aware form) and the re-confirmation of B-T8 for the second pull (`ADR-0067` d6's dated line of 2026-11-04).

*Before acceptance:* **PROPOSED 2026-11-04** (task `arch-ABC-271`, on `grugops/arch-ABC-271` from `main` `ac55ddf6`;
text of record `01d2434b`). It proposed choice rule 1: the three terms shipped on their rule values, judged on their
own 100-game read (GAIN), behind a test-only off-door pair, with P0–P8 as the bars.
- **Why then:** `ABC-239`'s first pull closed NOT MET (`…4c76bf7a`). `arch-ABC-239-f3f4` (`…4eae0fd3`, `…69f22167`)
  traced `zugzwang.001`'s e1e5 to the fitted endgame halves of the pawn, rook, king and passer terms. No relation on
  today's features could hold it: the passer part needs free-path and king-distance features. Its path (iii) put E4a
  before a second pull.
- **The probe** ran under the PREREG `…eeb25cc6` (commit `029533f0`), sealed before any measured run, and one
  addendum `…3a9eba86` (commit `904b3fff`), sealed before its diagnostic. It ran on scratch copies of `main`'s `src/`
  (tree `8adb0a18`), outside the repository, under the host lock, about 3 min of runs in all. Scripts and outputs:
  `.grugops/context/arch-ABC-271/raw/`.
- **Its verdict:** H (all three terms on their rule values) held every play-safety and cost row. E3 missed as
  pre-registered. The PROPOSED text took choice rule 1 as a flagged judgment and named rule 4 as the fallback. That
  judgment is the one the Orchestrator overruled.

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-04 | Architect/Design | PREREG sealed before any measured run | `arch-ABC-271` `…eeb25cc6`, `029533f0` |
| 2026-11-04 | Architect/Design | Batches A, B read: I1 exact; H holds E1, E2, E4–E6; E3 missed. Addendum before one diagnostic | `…3a9eba86`, `904b3fff` |
| 2026-11-04 | Architect/Design | Batch D: E3's failures classed (c) 44 F; (d) 196 F, 101 P, 15 R (trunc at phase 4 on rank-2 passers). Batches G, F, C, E read. PROPOSED: rule values ship on play, GAIN | `…c9af6d84` (results), `…bbc0a213` (decision) |
| 2026-11-04 | Orchestrator | The sealed choice rule governs: E3 stays NOT MET, rule 1 is not taken, rule 4 (structure only, `ADR-0068` form). Owner asked | `orch-2026-10-30a` `…e0ff0aeb` |
| 2026-11-04 | Owner | **ACCEPTED, form (a)** ("a") | `orch-2026-10-30a` `…e8a3b5df` |
| 2026-11-04 | Architect/Design | Restated as ACCEPTED in form (a): the terms at 0, K0–K4, U held at 0 at the second pull. `ADR-0067` d5 / d6 / item 5, `ADR-0056` E4 / D6, `ADR-0064` d10 written. No bar moved | `arch-ADR-0070-accept` |

## Context

### What `main` is
- `PASSED` (mg / eg by own rank) scores a passer by its rank alone: E1 (`ADR-0064` d3) doubled its endgame half.
- Nothing reads whether a king can catch the passer, whether its path is blocked, or whose king is nearer.
- The pawn memo is keyed exactly by the two pawn masks (`ADR-0064` d5, 448 KiB), so anything that reads a king or a
  piece sits outside it.
- `ABC-239`'s first pull closed NOT MET on F3 and F4. In `zugzwang.001`, the fitted passer eg half charged Black's
  three h-passers alike in both lines, though all three are frozen (h1 holds Black's king, h2 and h3 Black's own
  pawns). No term could tell a frozen passer from a free one.

### The probe (PREREG `…eeb25cc6`, addendum `…3a9eba86`). History: the rule values it read are not shipped

**Forms:** BASE (every term off, = `main`); H (all three: the candidate); the singles KD, FP and UN (reports).

**I1, the instrument, exact.** BASE equals the unpatched `main` on all seven count rows (nodes, score, move).

**Counts** (`chooseMove` on a frozen clock; the root move is unchanged on every row):

| board, depth | `main` = BASE | H |
|---|---:|---:|
| kiwipete 8 / 9 | 766 275 / 1 725 150 | 776 478 / 1 696 188 |
| position-6 8 / 9 / 10 | 87 475 / 253 724 / 533 916 | 87 548 / 253 904 / 534 281 |
| `search()` d8, kiwipete / position-6 | 605 117 / 406 787 | 551 487 / 406 807 |

**Eligibility (H):**

| row | H | bar |
|---|---|---|
| E1 mirror, `Object.is`, 226 positions (`G3` + `TAPER_MIRROR_POSITIONS` + 12 passer positions) | 0 | 0 |
| E2 phase 24 equals BASE, 333 positions | 0 | 0 |
| E3 (c) the square, twin pairs ≥ U | **44 / 404 fail** | 0 |
| E3 (d) king distance strictly monotone, twin pairs | **312 / 2 123 fail** | 0 |
| E3 (e) free path present only when empty | 0 / 120 | 0 |
| E4 mate floor, d4 → d5 / d5 → d5 (the 287) | 0 / 163, 0 / 190 | 0, 0 |
| E5 zugzwang, `ADR-0050` d9's seven rows | 7 / 7 | 7 / 7 |
| E6 `G1` | 54 / 58, none newly missed | ≥ 54, none |
| E7 `G2`, two sessions in reverse order | r 1.0351 / 1.0186 (c 1.0199 / 1.0042), **R = 1.0269** | ≤ 1.05 |

**E3's diagnostic (addendum, batch D; decides nothing).** Each failing twin pair was split into E4a's own part
(H − BASE) and the rest:
- **(c):** all 44 failures are class F. E4a's own part is ≥ U on every pair. The rest is king exposure: E1's file
  terms charge a bare king per file around it, 2 files on the rim and 3 elsewhere, so h7 against g8 is 35 cp, and
  400 − 35 = 365. On twins that also share their exposure: 0 / 302.
- **(d):** 196 F (exposure), 101 P and 15 R.
  - P: the defending king steps off the passer's path, which frees the path.
  - R: E4a's own part reads 0. Every printed example is a passer on its own second rank at phase 4 (a rook each).
    There a king step is worth `PASSED_KING_ENEMY[1]` = 1 cp of eg, × 20 / 24, and the blend's trunc drops it.
  - At phase 0 the eg half is exact, so E4a's own part is ≥ 1 on every off-path pair by arithmetic. That was not
    run separately.

**The firing figure at 100 ms** (static evaluate, form − BASE, over all 27 896 positions of the 200 C2′ games on
record, `qe-ABC-269` b8 and `qe-ABC-279` c2):

| form | ≠ 0 | ≥ 10 cp | ≥ 25 cp | games with a ≥ 25 cp position |
|---|---:|---:|---:|---:|
| **H** | 45.10 % | **29.75 %** | 19.31 % | 87.0 % |
| KD | 43.85 % | 18.21 % | 7.69 % | 69.0 % |
| FP | 31.29 % | 25.20 % | 16.40 % | 84.5 % |
| UN | 0.58 % | 0.58 % | 0.58 % | 14.5 % |

29.75 % ≥ 5.0 %, so the intent was GAIN by the pre-registered rule. *Under form (a) no value ships, so `ABC-271` has
no intent class and no read. The figure is history and a forecast for the second pull.*

**`zugzwang.001` at depth 9** (v(m) = −`search`(after m, 8), White's view; `arch-ABC-239-f3f4` D2's form):

| table, form | v(e1f1) | v(e1e5) | gap | played |
|---|---:|---:|---:|---|
| `main`, BASE | −390 | −419 | +29 | e1f1 |
| `main`, KD / FP / UN | −410 / −355 / −305 | −442 / −442 / −419 | +32 / +87 / +114 | e1f1 |
| **`main`, H** | **−263** | −454 | **+191** | e1f1 |
| `26d06118` (the first pull's fit), BASE | −464 | −445 | −19 | **e1e5** |
| `26d06118`, H | −331 | −481 | +150 | e1f1 |

- On the rule values, E4a widened the depth-9 margin from 29 cp to 191 cp. On the fitted table it turned the failure
  back to e1f1, by 150 cp.
- The last row is not a fit: hand terms were added onto a table fitted without them. It says that E4a's features
  carry the distinction the first pull lacked, not that a refit keeps it (`UNKNOWN - verify`).
- *Under form (a), `main`'s margin stays 29 cp until the second pull emits.*

**Reports (decide nothing):**
- Reach at 47 000 nodes: 6.716 → 6.679 (−0.037 ply).
- Drift at depth 5 against BASE: 99.47 % within 25 cp; max 409 (`pawn-race`, an unstoppable passer); 4 root moves
  differ; 0 mate flips.
- `G2` on the endgame report set (six positions chosen by rule from the C2′ games, phases 3–8, with passers):
  1.084 / 1.086 ×.
- **The default lane with H wired in:** 23 reds beside `main`'s one environment red, all migration (batch E,
  `raw/out/E-lane-summary.md`). At 0 only the two memo-size rows arise (decision 6).

## Decision

1. **The three terms: endgame structure, every value 0.** This is the PREREG's choice rule 4.
   - `src/evaluate-params.ts` gains, in the file's present shape: three by-rank arrays of `{ mg, eg }` pairs,
     `PASSED_KING_ENEMY`, `PASSED_KING_OWN` and `PASSED_FREE`, and one pair, `PASSED_UNSTOPPABLE`. **Every half of
     every entry is 0.** `tools/tune` reads and writes them unchanged.
   - Each comment records its rule as the prior: "start (prior): 0. The rule (below) was probed and not shipped
     (`ADR-0070`)". A data row pins every E4a middlegame half at 0.
   - Notation: R is the passer's own rank index (1 is its start rank, 6 is one step from promotion). d is the
     Chebyshev distance (king steps). Q is the queening square.
   - **King distance:** eg += `PASSED_KING_ENEMY[R]` × min(d(enemy king, Q), 5) − `PASSED_KING_OWN[R]` ×
     min(d(own king, Q), 5). Both distances are capped at 5.
     - **The target is the queening square, not the stop square.** The `arch-ABC-271` brief wrote "the stop square";
       the ticket's scope 1 names the queening square. The rule of the square reads the same square, and on the
       seventh rank the two are the same square.
   - **Free path:** eg += `PASSED_FREE[R]` when every square ahead of the passer, up to and including Q, is empty. Any
     piece of either colour blocks, and a king on the path is a blocker. Attacked squares are not read: that needs an
     attack map, which the evaluation does not build.
   - **The unstoppable passer (the rule of the square):** at phase 0 only, a passer with a free path, when moves <
     d(defending king, Q) − (1 if the defender is to move). moves = 5 from the start rank (the double step), else
     7 − R. It adds `PASSED_UNSTOPPABLE` once per side, however many such passers the side has. When both sides have
     one, they cancel, and the race is the search's.
   - **The probed rule values (not shipped; K1 (c)'s seam values):**
     - `PASSED_KING_ENEMY` eg = PASSED.eg[R] / 10 = 0, 1, 2, 4, 7, 12, 20;
     - `PASSED_KING_OWN` eg = floor(PASSED.eg[R] / 20) = 0, 0, 1, 2, 3, 6, 10;
     - `PASSED_FREE` eg = PASSED.eg[R] / 2 = 0, 5, 10, 20, 35, 60, 100;
     - U = 400 = Q − (P + PASSED.eg[6] + PASSED_FREE.eg[6] + 5 × PASSED_KING_ENEMY.eg[6]) = 900 − 500.
     - The addendum's resolution clause stays with them as history: the king-distance part is strictly monotone in
       the eg half; above phase 0 the blend's trunc may drop a step worth less than 24 / (24 − w) cp.
   - **Every middlegame half stays 0, at the build and at every pull.** Decision 2 skips the loop at w = D, which is
     exact only while those halves are 0.
2. **Which passers count, and where.**
   - `pawnStructure` also records, per side, the **frontmost passer of each file** as a 24-bit word (3 bits a file:
     the board rank, 0 for none). The memo stores the two words beside its three parts. A hit still returns what a
     miss computes.
   - A rear passer of a doubled pair is not read. Its path is blocked by its own pawn, and its king distances would
     count the file twice.
   - **The memo grows from 448 to 576 KiB** (2^14 × 36 bytes), at value 0 as at any value. `NFR-009`: +128 KiB, under
     the 1 MiB growth line and far under 16 MiB.
   - **After the walk, when w < D and a passer exists**, one loop over the eight files reads the two words, the two
     king squares (already found by the walk), the board squares ahead of each passer, and the side to move. It adds
     its sum to Δ only.
     - At w = D the loop is skipped (decision 1's last line).
     - The phase stays the recursion's argument (cut C1), and the unstoppable rule reads phase = 0.
3. **Cost per leaf (`G2`): paid in full at value 0.**
   - A memo hit adds two typed-array reads. A position with no passer, or at phase 24, pays one compare.
   - A position with passers pays, per passer, two distances and a walk of at most six squares.
   - **At 0 the loop does the same work with zero weights,** so the cost is H's: R = 1.0269 on QE's six roots (bar
     1.05), about 1.085 × on the endgame report set.
   - **No fast path skips the loop when every value is 0.** It would hide from K3 the cost that the second pull's
     emission pays.
   - **F2's single value-identical cost cut, named now:** the two distances from a 128 × 128 `Int8Array` (16 KiB,
     `NFR-009`), and the loop entered only for files with a set field (bit-scan of the words).
4. **No switch and no doors** (`ADR-0068` d4's reason: a door would reproduce a path that does not differ).
   - `ABC-271`'s scope 5 (a switch and a door pair) is struck. With every value 0 the loop adds 0 on every path, so
     every existing door, older or newer, reads its pre-ticket counts (K0).
   - **One test-only seam, `passerTermsForTest(position)`,** returns each side's three eg parts (king distance, free,
     unstoppable) at the parameters in force. It follows the `kingExposureForTest` precedent, so inside
     `withParametersForTest` it reads the test's table. It is called only from test files.
5. **The bars of `ABC-271`, pre-registered** (fixed here; not loosened after Ready). The PROPOSED P0–P8 are not bars.
   - **K0, node identity:** `chooseMove`, frozen clock, kiwipete d8 / d9 **766 275 / 1 725 150**; position-6 d8 / d9 /
     d10 **87 475 / 253 724 / 533 916**; `search()` d8 **605 117 / 406 787**.
     - These are the probe's I1, `main` at `src/` tree `8adb0a18`. `main` `7a9ee712`'s tree `4fb3da04` differs from it
       in three test files only (`ABC-281`), so they stand.
     - If `main`'s non-test `src/` moves by the build, the Engineer re-reads them on the new base and puts both in the
       PR. A re-derived count is a dated line here, never a moved bar.
     - Every existing door reads its pre-ticket counts.
   - **K1, units (default lane):**
     - (a) the mirror, `Object.is`: `G3` + `TAPER_MIRROR_POSITIONS` + ≥ 10 new passer positions (frozen by QE before
       the build), 0 mismatches;
     - (b) `evaluate` `Object.is`-equal to the pre-ticket `evaluate` over the frozen corpora (`G3`'s 184,
       `TAPER_DOOR_CORPUS` with the KP rows, `ABC-270`'s queen pairs, and K1 (a)'s new passer positions), in
       `ABC-270` K1 (b)'s form. `Object.is` sees the sign of a zero: adding a +0 to a −0 gives +0;
     - (c) **the structure through the seam.** Inside `withParametersForTest` at decision 1's probed values,
       `passerTermsForTest` returns, on fixtures QE freezes before the build: a king-distance part that moves by
       exactly `PASSED_KING_ENEMY[R]` per step of the enemy king's capped distance and by `PASSED_KING_OWN[R]` per
       step of the own king's; a free part non-zero only when the path is empty; and U on exactly the positions the
       square names at phase 0, else 0. With the values 0, (b) holds. These rows read E4a's own part, by arithmetic.
       They are not E3's generated relation rows on `evaluate`, which stay NOT MET on record;
     - (d) the packed int16 range row (`ABC-274` A9) reads the new pairs;
     - (e) the memo: a hit returns what a fresh `pawnStructure` returns, the two passer words included.
   - **K2, two re-pins and no others,** both the memo's byte size, 458 752 → 589 824: `src/evaluate.pawns.test.ts`
     (`ABC-235` cut 5) and `src/transposition.test.ts` (A7's `NFR-009` sum). They record a structure's size, not a
     value. Any other re-pin, in any lane, means the build is not value-identical: a defect.
   - **K3, `G2` ≤ 1.05 ×** `main`'s `evaluateAtPhase` per call. QE reads it under a PREREG sealed before timing, with
     `ADR-0067` d8's A5 instrument (two sessions, reverse order, a `main`-copy control). The endgame report set is
     reported beside it.
   - **K4, `G6` "≥ base":** each board's median depth ≥ `main`'s, and every run at depth ≥ 6. `Q-3K-4` (b) does not
     apply, because no value changes (as `ABC-270`).
   - **No games.** S2 nps is reported only if the Orchestrator rules as for `ABC-270` and `ABC-274` (`…690d3b30`,
     `…401c3d09`). That ruling is his.
   - **A source row:** the king squares come from the walk; there is no new pass over the pieces.
6. **Migration: K2's two rows only.** The probe's batch E list (23 rows) was read at the rule values. At 0 none of its
   value rows moves (`UNKNOWN - verify` until built). At the second pull, E4a's value rows follow `ADR-0067` B-T4: pins
   are re-pinned old → new, and a lost fixture property is re-found under `ADR-0028` d2.
7. **The order: `ABC-271` (structure) → the second pull, and one read judges both.**
   - The second pull is a new attempt under `ADR-0067` F6, with its own PREREG, on a `main` with E4a's structure. Its
     read (C2′, S′, Levels, and B-T8 if the owner re-confirms it) is where E4a's values are judged.
   - **What it fits:** the eg halves of `PASSED_KING_ENEMY`, `PASSED_KING_OWN` and `PASSED_FREE`, each free and ≥ 0.
     The mg halves are held at 0 (decision 1). The lines are `ADR-0067` d5 and d6's dated lines of 2026-11-04.
   - **`PASSED_UNSTOPPABLE` is held at 0. It is not free, and it is not held at 400.** The reasons:
     1. 400 is a rule value whose pre-registered relation row, E3 (c), missed and stays NOT MET (`…e0ff0aeb`).
        Holding it through the tuner would ship that value by another route. Its restated domain belongs to a future
        attempt with its own PREREG.
     2. `ADR-0067` item 5 keeps the rule of the square a rule, not a fitted weight (`…e0ff0aeb`: "UN stays a rule"),
        so the tuner may not free it.
     3. 400 is derived from E1's `PASSED.eg[6]` and the probed `PASSED_FREE` and `PASSED_KING_ENEMY` values. The
        second pull fits those, so on the fitted table 400 is no longer that rule's output.
     - **The cost, stated:** on `main`'s table UN alone widened `zugzwang.001`'s depth-9 margin from 29 to 114 cp. The
       second pull does not get that help. Its F4 row rests on king distance and free path (FP alone: +87 cp).
     - U gets a value only from a later attempt with its own PREREG (a ticket on its own read, or a later pull that
       names it). Until then its structure costs the phase-0 check and nothing else.

## Alternatives

- **Rule values judged on play (the PROPOSED route; the PREREG's choice rule 1).** Not taken. The Orchestrator ruled
  that the sealed choice rule governs, so E3's miss bars it (`…e0ff0aeb`), and the owner chose (a). It would have read
  E4a on its own C2′ for about 0.7 h more host time.
- **A new door pair at value 0** (`ABC-271` scope 5; "the door pair" in this restatement's brief). Not taken: a door
  would reproduce a path that does not differ (`ADR-0068` d4). Doors come back with the first value-changing passer
  ticket that is not the tuner's.
- **U held at its rule value 400 through the second pull.** Not taken: decision 7's three reasons.
- **U freed in the second pull.** Not taken: `ADR-0067` item 5. A pawn race decides the game result, so a fitted weight
  on an indicator that fires on 0.58 % of positions would mostly learn the race's outcome.
- **A fast path that skips the loop while every value is 0.** Not taken: decision 3.
- **The stop square as the king-distance target** (Stockfish's classical form). It needs a second target square beside
  the rule of the square's, and the ticket names the queening square.
- **One centred king-distance weight on (enemy − own).** Not taken: one feature per rank where the tuner can use two.
- **Every passer, not the frontmost per file.** Not taken: the rear one is always blocked, and the file counts twice.
  The memo would need a 48-bit mask per side.
- **A safe path (attacked squares).** Not taken: it needs an attack map pass per call. That is E4b's or the tuner's
  question.
- **Computing passers again outside the memo.** Not taken: it re-runs `isPassedPawn` per pawn per call.
- **Re-tuning a bar, re-pinning a zugzwang depth, or moving the mate floor.** Not open (`ADR-0064` F4, `ABC-271` F3).

## What would falsify this

| # | clause | what would falsify it | if it fires |
|---|---|---|---|
| F1 | 1, 2, 4: value-identical | a node, score or move mismatch against `main`; an `Object.is` miss; a re-pin outside K2 (K0–K2) | a defect, fixed before any cost bar; never re-pinned |
| F2 | 3: cheap | K3 `G2` > 1.05 ×, or K4 a `G6` median below `main`'s, or a run below depth 6 | STOP to Architect/Design: decision 3's one value-identical cut, then one re-read under a PREREG (`ADR-0067` F8's pattern). A second miss: not merged, and the second pull fits without E4a's features, which `ADR-0067` F4's cause names as missing (a re-plan, its own dated line) |
| F3 | 1: the rules as built | a K1 (c) seam row: a part that does not match its rule on a frozen fixture | a defect in the structure, fixed before merge; no value is chosen to pass |
| F4 | 7: the tuner wants the terms | the second pull's fit leaves every E4a eg half at its 0 bound on the accepted data | recorded. The structure is dead weight, and a later ticket may remove it. No re-fit on play |
| F5 | 7: one read judges both | the second pull's read is NOT MET | `ADR-0067` F6. The tuned set is not merged. The structure stays, value-identical. E4a's values are never fitted on play results |

## Consequences

- **Host time.** `ABC-271`: about 0.2 h (two `G2` sessions, `G6` rounds, the lanes), with no games. That is about
  0.7 h less than the values route. E4a's play value is read only jointly with the tuner's.
- **Size:** `ABC-271` goes from M to S (BA/PM): no switch, no doors, two re-pins.
- **For the second pull:**
  - It gets the feature class that F4 lacked. Whether a fit keeps e1f1 is `UNKNOWN - verify`.
  - `main`'s `zugzwang.001` margin stays 29 cp until then. The 191 cp and +150 readings were rule values, not shipped.
- **NFRs:**
  - `NFR-009`: the memo is +128 KiB (576 KiB) from the build on, value or not. If F2's cut is taken, +16 KiB more. The
    sum stays far under 16 MiB.
  - `NFR-001` / `G2`: K3. `NFR-005`: K4. `NFR-008`: K1 rows are units with no search.
  - Security: none. No new NFR file; `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`) and licence (`ADR-0048`):** unchanged. The terms are integer and mirror-exact, and the
  rules are this project's own. The rule of the square is classical chess knowledge.
- **File collisions:** `src/evaluate.ts` and `src/evaluate-params.ts`, with `ABC-272` and the second pull. One at a
  time.
- **Risk:** the cost is paid before any value: about 2.7 % per call on `G2`'s roots and about 8.5 % where passers
  exist. `G2`'s roots under-sample the second, and `G6` reads middlegame boards. QE reports the endgame set; F2's
  cut is named. If no pull ever fits the terms, F4 lets a later ticket remove them.

## Rollback

- **If `ABC-271` does not merge:** this ADR reads "accepted, not in force". Strike the dated lines of 2026-11-04 in
  `ADR-0056`, `ADR-0067` and `ADR-0064`.
- **After the build merges:** revert the one commit. It is value-identical, so nothing else moves. If a tuned set has
  merged on top, revert that first (`ADR-0067` § Rollback).
