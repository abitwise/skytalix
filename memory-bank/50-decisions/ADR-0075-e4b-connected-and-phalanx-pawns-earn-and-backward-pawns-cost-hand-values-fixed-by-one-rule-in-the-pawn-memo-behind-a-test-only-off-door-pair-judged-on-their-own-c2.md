---
kind: adr
id: ADR-0075
---
# ADR-0075: E4b (`ABC-291`): connected and phalanx pawns earn, and backward pawns cost, hand values fixed by one rule from `PASSED` and `ISOLATED`. The three terms sit in the pawn memo at 640 KiB, behind one switch and a test-only off-door pair, and are judged on their own C2′, intent GAIN

*Dated 2026-11-05 (`arch-ABC-307-records`): "640 KiB" is d3's form before d5's cut. The probe's rule 3 puts the cut in the build, so the memo stays at 576 KiB, 589 824 bytes, and `NFR-009`'s +65 536 reads 0 (`…2926c26b` call 3, `…69ee96e7` ruling 3). The title stands as accepted.*

## Status

**ACCEPTED 2026-11-05 by the owner. In force only at `ABC-291`'s merge.** Recorded by Architect/Design (task `arch-ABC-291-accept`, records only, on
`grugops/arch-ABC-291-accept` from `main` `a6ae8227`). Nothing was run.
- **His word, verbatim** (`orch-2026-10-30a` `…c1623ae7`): *"1. yes"*. The question was § The owner's question: "Do you accept ADR-0075?"
- **What it settles:** d1–d12 as written. **No definition, rule, value, bar or probe row changes with this acceptance.** The probe stays written and not run.
  F5's "accepted, not in force" now applies to a miss.
- **d11 (d), no second set of values after a miss:** a rule for this term. It does not yet bind the later terms. Each asks him in its own ADR (`…c1623ae7`).
- **d11's readings** stay open to overruling at any third-pull call (`…c1623ae7`).
- **The dated lines of `arch-ABC-291`** in `ADR-0056` and `ADR-0067` stand, and now read accepted.
- **Still owed, unchanged:** § Consequences' lines. `ABC-305` comes before the build.
- ***Dated 2026-11-05 (`arch-ABC-291-probe`): the probe ran, once. The premise stands under rule 3 and the work does not stop.*** PR1 to PR7 and PR9 hold. PR8 reads R = 1.04287, above 1.03, so the build carries d5's named cut. K2's list is written, and no value, rule, definition, ratio, intent or bar moved. See § The probe's reading.
- ***Dated 2026-11-05 (`arch-ABC-307-records`, records only): the memo lines are dated, and F2's K5 half is written.*** Every "640 KiB" reads d3's form before the cut. A run below depth 6 on the build is F2's second miss. No value, rule, definition, ratio, intent, bar or level moved. See § What would falsify this.
- ***Dated 2026-11-06 (`arch-records-1106`, records only at `main` `8e115110`): a `G1` miss on `ABC-291` is class B, and F3 reads as written.*** The Order line is dated for `ABC-289`'s NOT MET. No value, rule, definition, ratio, intent, bar or level moved. See § What would falsify this and § Consequences.
- ***Dated 2026-11-06 (`arch-ABC-291-stop`, records only at `main` `48993089`; nothing run): `se-ABC-291`'s STOP is ruled.*** `ABC-282` A0-3's six rows are pins, re-pinned to the lines in `ADR-0071` D8's dated line. No build that holds d4 can meet K1 (h)'s letter for one export, so the row reads the off branches, and one real read is added. The `ABC-303` depth-8 re-point and `QUIET_RULES`' `pawnShape: true` are confirmed. No value, rule, definition, ratio, intent or level moved. K1 (h) is the one place a bar's words do not hold as written, and its dated line says why. See d4, K1 (h), K2 and d11 (a).
- ***Dated 2026-11-06 (`arch-ABC-291-k1c`, records only at `main` `85731c89`; nothing run): K1 (c)'s order, "QE freezes before the build", is not met to the letter, and no line reads it as met.*** So K1 (h) is no longer the one place, as the line above says. Unlike K1 (h), an exact build could have met these words. Whether `ABC-291` merges with them not met is not ruled here. Test note 1's "(b) rows" are form (b)'s, and PR10's drift is dated. No value, rule, definition, ratio, intent, bar or level moved. See K1 (b), K1 (c) and § The probe's reading.

*Before acceptance:* **PROPOSED 2026-11-05.** Recorded by Architect/Design (task `arch-ABC-291`, records only, on `grugops/arch-ABC-291` from `main` `148fd329`).
**Nothing was run:** no test, build, engine or probe. A timing read (`ABC-282`'s A4) held the host. Every figure below is arithmetic on
`src/evaluate-params.ts` at that commit, or is quoted from a named record. Anything that needs a reading is marked `UNKNOWN - verify`.

**Acceptance is the owner's:** this is a new ADR (`ABC-291`'s front matter, reading (b); `ADR-0056` D6's dated line of
`arch-owner-answers-1105`). His question is § The owner's question. Not in force until `ABC-291` merges.

**What it sets, in short.** Three pawn-only terms in form (b), on `main`'s tapered evaluation. Values come from one stated rule, fixed
here before any row or game is read. `G2` ≤ 1.03 ×. Memo 576 → 640 KiB. Intent GAIN. A written premise probe, run on the host after A4.
**The probe cannot change a value** (d10).
*Dated 2026-11-05 (`arch-ABC-307-records`): "Memo 576 → 640 KiB" is d3's form before d5's cut. With the cut in the build, the memo stays at 576 KiB (`…2926c26b` call 3, `…69ee96e7` ruling 3).*

**Inputs read:** `ABC-291`'s page; the Orchestrator's `…ba886714` and `…42f7fd67`; `ADR-0056` D2, D5's dated blocks and D6 with their
dated lines; `ADR-0067`'s dated blocks; `ADR-0070`; `ADR-0064` d3–d8; `ADR-0026` d10; `…ba8265e9`, `…2b3440cf`, `…e5a5ac0c`, `…a717244e`;
`src/evaluate.ts`, `src/evaluate-params.ts`, `tools/tune` on `main` and at `b297ab89`.

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-05 | Architect/Design | PROPOSED: definitions, rule, memo, `G2` ratio, intent, the probe written and not run, the four carried items. Nothing run | `arch-ABC-291` |
| 2026-11-05 | Owner | ACCEPTED ("1. yes"), in force only at `ABC-291`'s merge | `orch-2026-10-30a` `…c1623ae7` |
| 2026-11-05 | Architect/Design | Status, this log and the dated lines in `ADR-0056` and `ADR-0067` read accepted. No value, rule, bar or probe row moved. Nothing run | `arch-ABC-291-accept` |
| 2026-11-05 | Architect/Design | The probe, once, under PREREG `…2a579895` (`d033ea0e`): premise stands under rule 3, PR8 R = 1.04287, PR9 14.72 %. K0 (c)'s counts and K2's list by dated line. No value, rule, definition, ratio, intent or bar moved | `arch-ABC-291-probe` `…65c7a9c9`, `…2926c26b` |
| 2026-11-05 | Architect/Design | The 640 KiB lines dated; F2's K5 half written, as a reading open to the Orchestrator until K4's PREREG seals. No value, rule, definition, ratio, intent, bar or level moved. Nothing run | `arch-ABC-307-records` |
| 2026-11-06 | Architect/Design | Dated pointers to `…43e6d8fd` 3 on d11 (d)'s list and on "What stays open". No value, rule, definition, ratio, intent, bar or level moved. Nothing run | `arch-ABC-303-b5` |
| 2026-11-06 | Architect/Design | `G1`'s class on `ABC-291` ruled from `ADR-0034` d2's letter: class B, F3 as written. The Order line dated for `ABC-289`'s NOT MET. No value, rule, definition, ratio, intent, bar or level moved. Nothing run | `arch-records-1106` |
| 2026-11-06 | Architect/Design | `se-ABC-291`'s STOP ruled: A0-3's six pins, K1 (h) against d4 with one real read added, the `ABC-303` depth-8 re-point, `QUIET_RULES`. No value, rule, definition, ratio, intent or level moved. Nothing run | `arch-ABC-291-stop` |
| 2026-11-06 | Architect/Design | K1 (c)'s order stated as not met to the letter, its rows read, one stage-0 read named, the merge question left open. Test note 1's "(b) rows" read as form (b)'s. PR10's drift dated. No value, rule, definition, ratio, intent, bar or level moved. Nothing run | `arch-ABC-291-k1c` |

## Context

### What `main` scores today
- Material, square tables, `PASSED` by rank, `DOUBLED` 15 / 15 and `ISOLATED` 10 / 10 (`src/evaluate-params.ts`).
- `src/evaluate.ts`'s header leaves backward pawns and chains out. A defended chain and a backward pawn read the same as loose pawns.
- `pawnStructure` is a pure function of the two pawn masks, memoised 2^14 slots deep at 576 KiB (`ADR-0070` d2).
- Every table on `main` is rule-made. No fitted table has played a graded game.

### Why hand values, and why this term first
- Tuning waits: no third fit and no date (`ADR-0067`'s dated block of `arch-owner-answers-1105`). `ADR-0056` D2's dated line supersedes
  "structure at 0, values from a pull" for rows E3–E6.
- Form (a) pays its cost now for a pull that does not exist. E4a's 1.12 × endgame cost stays on `main` for no value.
- Hand values have failed here by cost (`ABC-205`), by a lost read (`ABC-207`), and on pre-registered rows (`ADR-0068`, `ADR-0070`). `…ba8265e9` reasons
  that a pawn-only term is the least exposed to cost and to lost mates. That is reasoned, not read.

### What this ADR takes from the earlier misses
- **`ADR-0070`'s E3 missed on whole-evaluation relations:** other terms moved the score, and the term's own part was right. So the rows here
  read the term's own part by arithmetic (K1 (c), PR3), never a generated relation on `evaluate`.
- **`QE-271-h`:** seam-only rows passed a colour-symmetric fault on the hot path. So K1 (d) ties the hot path to the seam.
- **`QE-271-f`:** `G2`'s roots did not read where E4a's loop runs. The same limit is stated here at d5, not found later.

### Blindness to `zugzwang.001`
`ADR-0067` test 3 reads "no value … chosen with the row or its attribution in hand". **The row played no part in d1 or d2.** I read
what `ADR-0070` and the wait's notes say of it, because the brief names them. I did not open its FEN, and I worked no term through it. d2's inputs are
two lines of `src/evaluate-params.ts`. Attribution of e1e5 is not run. Whether this term holds the row is `UNKNOWN - verify`.

## Decision

Notation: R is the pawn's own rank index, as in `PASSED`. 1 is its start rank, 6 is one step from promotion. f is its file. "Friendly" and
"enemy" are from the pawn's side. All three definitions read pawns only.

1. **The definitions.**
   - **Connected:** a friendly pawn stands on (f − 1, R − 1) or (f + 1, R − 1), so a friendly pawn defends it. It counts once per pawn, however
     many defenders it has. At R = 1 it cannot fire.
   - **Phalanx:** a friendly pawn stands on (f − 1, R) or (f + 1, R), and R ≥ 2. It counts once per pawn, however many neighbours it has. Each
     pawn of a pair earns it. At R = 1 it does not fire: eight pawns at home are not a formation, and a bonus there would charge every first
     pawn move.
   - **Backward:** all three hold:
     - (a) the side has a pawn on f − 1 or f + 1, on any rank. Otherwise the pawn is isolated, and `ISOLATED` charges it;
     - (b) no such pawn stands on rank R or behind it. All its neighbours have passed it, and pawns never step back, so none can defend it;
     - (c) its stop square (f, R + 1) holds an enemy pawn, or an enemy pawn attacks it from (f − 1, R + 2) or (f + 1, R + 2).
   - **What follows by arithmetic:** backward excludes connected and phalanx by (b), isolated by (a), and passed by (c). Connected and phalanx
     may both fire on one pawn, and either may fire on a passer. Each adds. A backward rear pawn of a doubled pair pays both `DOUBLED` and
     `PAWN_BACKWARD`. The double step and en passant are not read.

2. **The rule, and the values it gives.** A pair half h is mg or eg. Division floors. Every other index reads 0.
   - **Backward costs what isolated costs:** `PAWN_BACKWARD`[h] = `ISOLATED`[h]. Both are a pawn no friendly pawn can ever defend.
   - **A defended pawn on the first rank of the enemy half earns what an isolated pawn pays, and other ranks follow the passer's shape:**
     `PAWN_CONNECTED`[h][R] = `PASSED`[h][R] × `ISOLATED`[h] / `PASSED`[h][4], for R = 2 … 6.
     - R = 4 is the anchor, because it is the first rank where a defended pawn takes squares in the enemy half. Below it, the bonus stays under
       `ISOLATED`, so a quiet pawn move at home cannot outvote a structural weakness.
     - The anchor is the rule's one judgment. It is stated here because nothing on the records fixes it.
   - **A pair earns the same side by side as in a chain:** `PAWN_PHALANX`[h][R] = `PAWN_CONNECTED`[h][R] / 2, for R = 2 … 6. A chain pair earns
     once, on its front pawn. A phalanx pair earns twice, once per pawn.

   | R | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
   |---|---:|---:|---:|---:|---:|---:|---:|---:|
   | `PAWN_CONNECTED` mg = eg | 0 | 0 | 2 | 5 | 10 | 17 | 28 | 0 |
   | `PAWN_PHALANX` mg = eg | 0 | 0 | 1 | 2 | 5 | 8 | 14 | 0 |

   `PAWN_BACKWARD` = { mg 10, eg 10 }, a penalty held as a positive value, as `ISOLATED` is.
   - **The halves come out equal, and that is the rule's output.** `PASSED.eg` is 2 × `PASSED.mg` and `ISOLATED`'s halves are equal, so the
     ratio cancels. So **"tapered" on `ABC-291`'s page reads "a middlegame / endgame pair that enters the blend". The blend changes nothing
     at today's table.** `ADR-0064` d3's line stands: no endgame value is hand-written without a rule. Equal halves also leave nothing for the
     blend's trunc to drop (`ADR-0070`'s resolution limit).
   - **Fixed now.** The values are set here, before any row or game is read. If `PASSED` or `ISOLATED` move before the build, these numbers stay.
     They are the values, and the rule records how they were made.
   - **Licence:** the rule is this project's own (`ABC-215`, `ADR-0048`). No value is taken from another engine.

3. **In the pawn memo, at 640 KiB.** All three terms are pure functions of the two pawn masks, so they sit in the memo. They need no king,
   piece or side to move.
   - **One new `Int32Array` part, `pawnCacheShape`:** the packed sum of the three terms, white minus black. `pawnStructure` computes it in its
     second pass. A hit sets it, as a hit sets the passer words. It stays **out** of `pawnStructure`'s return value, and the caller adds it.
   - **Why a separate part:** the off door reads the same memo, keyed the same way, and simply does not add the part. No second memo, no key salt.
   - **Size:** 2^14 × 40 bytes = **655 360 bytes, 640 KiB**, up 65 536 bytes from 589 824. It is fixed at load. `NFR-009`: far under 16 MiB, and
     no growth between a 1 s and a 4 s search.
     *Dated 2026-11-05 (`arch-ABC-307-records`): this figure and the heading's 640 KiB are the form before d5's cut, and the form the probe read. With the cut, `doubled` and `isolated` share a word: 2^14 × 36 = 589 824 bytes, 576 KiB, +0 (`…2926c26b` call 3, `…69ee96e7` ruling 3). The build carries the cut. Nobody has read it yet: K4 is its first read.*
   - **The miss path allocates nothing.** The rearmost pawn per file comes from the first pass, in a word and not an array.
   - **Parameters:** three new exports, `PAWN_CONNECTED`, `PAWN_PHALANX` (by rank) and `PAWN_BACKWARD` (a pair). `src/evaluate-params.ts` stays data
     only, and each comment carries its rule.

4. **One switch and a test-only off-door pair** (`ADR-0026` d10, in `ADR-0064` d7's form).
   - **One switch, `pawnShape`,** in `src/search.ts`'s `Switches`, `src/engine.ts`'s `Heuristics` and quiescence's rules record. It is on in `search()`
     and `chooseMove` only. It is never module state. All three terms share it: they are one structure with one rule, and no row reads them apart.
   - **Test-only exports:** `searchWithoutPawnShape`, `chooseMoveWithoutPawnShape`, and `evaluateAtPhaseWithoutPawnShape`, the evaluation those doors call.
   - **One test-only seam, `pawnShapeForTest(position)`:** each side's three parts, mg and eg, per side and never netted, from a fresh
     `pawnStructure` (the `kingExposureForTest` precedent). `pawnStructureForTest` gains one field, the shape part.
   - **Every older door turns it off,** including those `ABC-303` and `ABC-289` add. `evaluateWithoutTaper` never adds the part, so `ADR-0064` B1 (c)
     holds. `evaluateWithoutMobility` and `evaluateWithoutPawnCache` keep it on, because their rows read another term.
   - **Rows follow `ADR-0064` d7 by reference.** A shipped-side row whose other side is an older door re-points to the new door, with its figures
     unchanged. A pinned value that moves is re-pinned, old → new in the PR. A lost fixture property is re-found under `ADR-0028` d2. A level
     that reddens follows `ADR-0028`. **No zugzwang depth is re-pinned.**
     *Dated 2026-11-06 (`arch-ABC-291-stop`; `se-ABC-291` `…cb124720`): **a count row titled for an earlier ticket's tree re-points too.** `src/search.bundle.test.ts` "`ABC-303` — the bundle's own counts at depth 8", 2 rows, has no older door on its other side, so the first clause above does not name it, and "a pinned value that moves" would re-pin it. It re-points to `searchWithoutPawnShape` and `chooseMoveWithoutPawnShape`, figures unchanged. Its title says the counts are the bundle's and that it is "information, not a bar". A re-pin would make that title false, and the off door is the merge-base node for node (K0 (a), all four figures). `ABC-304` and `ADR-0072` d7 took this form. It reaches only a row whose figures belong to a named earlier tree. A row that pins the shipped path's own value still re-pins, and the head's counts stay K0 (c)'s.*

5. **Cost: `G2` ≤ 1.03 × the base, per call.**
   - **What a call adds on a hit:** one typed-array read, one add, one branch. There is no new walk and no new board read.
   - **Why 1.03.** It is the nearest recorded bar, `ABC-232` A3's 1.03 × for a passer-only change (`ADR-0064` B6). It is also the edge of the instrument's
     void window, [0.970, 1.030] (`ADR-0067` d8), so a tighter bar would grade noise. 1.05 × was form (a)'s precedent, and it leaves more room than
     one memo read needs. That a term built outside the memo would miss 1.03 × is my forecast, `UNKNOWN - verify`.
   - **The instrument:** `ADR-0067` d8's A5 shape, under a PREREG sealed before timing. R = (r₁ + r₂) / 2, on the unrounded value, two sessions in
     reverse order, a `main`-copy control, rounds 2, 4 and 6 (counted from 1) reversing the session's list, and round 1 the dropped warm-up.
   - **What it cannot read, stated now.** `G2` repeats six roots, so it reads the hit path (`ADR-0070` d3's dated line says the same of K3). The
     miss path, and how often it runs in search, are not graded. PR10 reports them, and C2′, played on the clock, prices them in.
   - **Forecast:** under 1 %, `UNKNOWN - verify`.
     *Dated 2026-11-05 (`arch-ABC-291-probe`): **the forecast was wrong.** PR8 read R = 1.04287 per call, on the hit path. In search, PR10's ns per node read 0.988 of `main`. The forecast is replaced by these readings; the ratio stands.*
   - **F2's one value-identical cut, named now:** `doubled` and `isolated` share one memo word. They are only ever summed on a hit, so that saves a
     read and returns the memo to 576 KiB.

6. **Intent: GAIN, ≥ 50.0 of 100.** `ADR-0056` D6's dated line fixes it: evaluation rows fire at 100 ms. It is named here and never re-classed after
   a score is seen. NEUTRAL is not open. PR9 checks the premise under the word, and it cannot change the intent.

7. **The bars of `ABC-291`, pre-registered** (form (b); no bar is new; none is loosened after Ready).
   - **K0, the doors:**
     - (a) `chooseMoveWithoutPawnShape` and `searchWithoutPawnShape` are node-equal to the merge-base's `chooseMove` and `search()`: nodes, score and move,
       on kiwipete d8 and d9, position-6 d8, d9 and d10, and `search()` d8 on both;
     - (b) every older door reads its pre-ticket counts;
     - (c) the head reads the probe's P0 counts. If `main`'s `src/` has moved, the Engineer applies the probe's patch to the new base, re-reads, and puts both
       in the PR. A re-derived count is a dated line here, never a moved bar.
       *Dated 2026-11-05 (`arch-ABC-291-probe`): P0's counts are in § The probe's reading, at `src/` tree `cc6e64d1`.*
   - **K1, units (default lane, no search):**
     - (a) the mirror, `Object.is`: `G3` + `TAPER_MIRROR_POSITIONS` + ≥ 12 new pawn-shape positions, 0 mismatches;
     - (b) `evaluateAtPhaseWithoutPawnShape` and `evaluateWithoutTaper` are `Object.is`-equal to the pre-ticket entries over the frozen corpora;
       *Dated 2026-11-06 (`arch-ABC-291-k1c`; `…cd569ec9`, `…085f647c` 1): **`ABC-291` test note 1's "(b) rows" are not this row.** The note was cut as "the seam fixtures (or the (b) rows)" (`aebc9783`), when the page held forms (a) and (b). `6cb4fb23` made it "and", 2.5 h before this ADR's first commit, so no K1 (b) existed for it to name. "(b)" is form (b): the seam, the mirror and `ADR-0064` d7's safety rows.*
       - ***The note's letter was not met, and no set was chosen after the build.** QE froze none of them. Each stands on a commit older than `aec95beb`, the build's first, unchanged to `9e496e4a`: `G3`, `TAPER_MIRROR_POSITIONS`, the 287, the seven, `G1`'s 58, and the 16, equal in order to `PAWN_SET` (`e4bprobe.ts`, sha256 `8b070dda…`, sealed at `d033ea0e`). This is `…085f647c` 1's form on `ABC-289`: committed corpora named in a sealed PREREG, no row chosen, LOW, disclosed. A test note carries no bar's words, so K1 (c)'s line below does not reach it. The seam is K1 (c)'s own.*
       - ***Owed by QE:** one line in the PREREG naming these sets, or an addendum before the first timing if it has sealed. No freeze: one now would protect nothing.*
       - ***This row's own corpora are frozen by date.** They are `G3_PRE`, `DOOR_PRE`, `QUEEN_PAIR_PRE`, `PASSER_PRE`, `G3_CORPUS_MAIN_EVALUATE` and `TAPER_DOOR_CORPUS`' scores. All stood on `main` at `8e115110`. The build changed which function the rows call and no table entry. They are not re-read here: K1 is in QE's stage 0.*
     - (c) **seam rows, by arithmetic, on fixtures QE freezes before the build:** at least one per definition per colour, and one per edge file per
       definition. They include each clause of Backward failing alone, and d1's exclusions;
       *Dated 2026-11-06 (`arch-ABC-291-k1c`; `…a7dc99cb`, `qe-ABC-291-k1` `…2e186a33`, `…b850a2ad`, `…5de6a358`, `se-ABC-291-k1rows` `…96abeaf8`, `…c4360feb`): **this bar has two halves. Its rows are read at `70d931ab`, 60 in all, with d1's double step and en passant among them. Its order, "fixtures QE freezes before the build", is not met to the letter. No later line reads it as met.** The Orchestrator dispatched the build with no freeze.*
       - ***Why this is not K1 (h)'s form.** K1 (h) took a reading because no exact build could meet its letter. A build dispatched after a freeze would have met this one, so a reading that made it met would turn a real miss green. That moves a bar (d7), and it is not taken. A rebuild now would meet the words alone: the rows and the patch are in hand, and the lines would be the same.*
       - ***What the order guarded, first half: values fixed with no sight of the code, and never changed to fit (`ABC-271`, `ABC-274` test note 1). Answered, in a weaker form.** QE sealed its list at `4948aad0`, before its compare. The sha256s match, no later commit touches the list, 0 of 704 reads missed, and 0 of 36 values differed. A prior freeze is blind by date. This one is blind by QE's word, because the code stood in its worktree. The commit proves the order of seal and compare, not what was opened before the seal.*
       - ***Second half: the rows in the Engineer's hand during the build (`EPIC-011` § Test notes). Not answered, and nothing buys it back.** `SEAM_ROWS`' first 36 are the Engineer's, and 13 of 31 mutants passed them. `EPIC-011`'s "a freeze made after the build protects nothing" stands: QE's list is a blind check, not a freeze in this bar's sense. A frozen row acts on a build by going red. No QE row reads red, so no red was lost on this tree. That is a result on this tree, not a guard.*
       - ***The real read, one owed at QE's stage 0.** The one set of expected parts fixed before the build by a seal is the probe's labeller: `labeller.ts`, sha256 `4dc558bb…`, at `d033ea0e`, about 30 h before `aec95beb`. It is blind to the build by date, and not to the patch, which has its author. On the build only the Engineer has read it (`…f0c9e801`). QE reads it at the tip, in PR3's form: `pawnShapeForTest` over PR3's 28 126 positions, on a copy, no quiet host. It is a report and adds no bar. A mismatch goes to F1's defect check.*
       - ***What the verdict says.** F1 reads a red row, so the missed order does not fire it. QE reports the halves apart: rows by count, order "not met to the letter". It never writes K1 (c) as met.*
       - ***What stays open, and is not mine.** Whether `ABC-291` merges with this order not met is no reading. Saying yes sets aside words of a bar he accepted, and d7 says none is loosened after Ready. The brief says he was told at about 20:22Z and has not answered. No line reads that silence as a yes. It holds no read, because K4, K5 and C2′ read the same five production files either way. It must be settled before the merge, which is his in any case.*
     - (d) **the hot path:** `evaluate` minus the off-door evaluation equals the seam's white minus black, signed for the side to move, exactly. With
       equal halves the blend adds nothing, so there is no tolerance. A second row, inside `withParametersForTest` at unequal test halves, reads the blend in
       `ADR-0070` d4's own-phase form;
     - (e) the rule: each export equals d2's table, rebuilt in the row from the rule and the anchors' values at this ADR's date;
     - (f) `ABC-274` A9's bound reads the three pairs (8 × (largest connected + largest phalanx + backward) per side);
     - (g) the memo: a hit returns what a fresh `pawnStructure` returns, shape part included, on a forced collision too, and on an on-then-off read of one slot;
     - (h) a source row: `pawnShapeForTest` and `evaluateAtPhaseWithoutPawnShape` are called from test files only.
       *Dated 2026-11-06 (`arch-ABC-291-stop`; `se-ABC-291` `…a8daf408` § 2): **no build that holds d4 can meet this row's letter for `evaluateAtPhaseWithoutPawnShape`. This line says so, and it adds a read.** d4 is `ADR-0064` d7's form: the switch picks the evaluation at the recursions' three call sites, two in `src/search.ts` and one in `src/quiescence.ts`, where `evaluateWithoutTaper` stands on `main`. So the evaluation the doors call has source callers by construction. The letter fits a seam, as `ADR-0070`'s line for `passerTermsForTest` does, and this export is not a seam.*
       - ***For this export the row reads:** its only callers outside test files are those three off branches, and no shipped search takes one. `pawnShapeForTest` keeps the letter.*
       - ***The real read, one default-lane source row, no search:** `pawnShape: true` stands exactly twice in `src/search.ts` and twice in `src/engine.ts`, in `RULES_PAWN_SHAPE` and in `search()`'s or `chooseMove`'s own record. It stands in no other non-test file under `src/`. Under `tools/`, only `QUIET_RULES` and its name carry it. Today no row reads d4's "on in `search()` and `chooseMove` only".*
       - ***Form (b), the switch passed into the evaluation, is not taken.** It drops d4's sentence and changes `evaluateAtPhase`'s signature on the hot path, after PR8 and before K4, which has one read left.*
       - ***What stands:** no production line moves, so K0, K2's list and K3 are not read again. If the Orchestrator or the owner reads this as a bar loosened after Ready, the line comes back here.*
   - **K2, the re-pins.** Two byte rows, 589 824 → 655 360: `src/evaluate.pawns.test.ts` (with its slot formula) and `src/transposition.test.ts`. They
     record a structure's size. **The value rows and the re-point list are `UNKNOWN - verify` until PR11's lane report.** That list joins this
     decision by a dated line before Ready. A re-pin outside it is a defect.
     *Dated 2026-11-05 (`arch-ABC-291-probe`): the list is in § The probe's reading. With d5's cut in the build, the two byte rows do not move.*
     *Dated 2026-11-06 (`arch-ABC-291-stop`): **re-derived at `8e115110` by § The probe's reading's own line: 64 rows (`se-ABC-291` `…cb124720`), with K0 (c)'s two sets in `…f0c9e801`. Six deep pins join the list:** `ABC-282` A0-3 in `src/uci-session.test.ts`, at the lines in `ADR-0071` D8's dated line of this task, as `…69ee96e7` ruling 2 asks. The deep re-points, figures unchanged, are `ABC-303`'s depth-8 counts, 2, `ABC-282` A0-1, 6, and A0-2, 4.*
   - **K3, safety (`ADR-0064` d7's rows):** mate floor 0 violations, door d4 → head d5 and d5 → d5 on the 287; zugzwang **7 / 7** at recorded depths with
     `zugzwang.001` among them; `G1` no NEWLY-MISSED line. All read all-on. No depth moves, and no expected result is rewritten.
     *Dated 2026-11-06 (`arch-records-1106`): a `G1` miss on this diff has no drift class. Every missed row is class B, and F3 governs. See § What would falsify this.*
   - **K4, `G2` ≤ 1.03 ×** (d5). The endgame report set is reported beside it.
   - **K5, `G6` under `Q-3K-4` (b):** every run at depth ≥ 6, depth 7 a WARN, "≥ base" reported, not graded.
     *Dated 2026-11-05 (`arch-ABC-307-records`): the bar stands as written. A run below depth 6 on the build is F2's second miss. See § What would falsify this.*
   - **K6, the read:** C2′ GAIN ≥ 50.0 of 100 at 100 ms against the merge-base, 100 of 100 complete, 0 candidate faults, 0 losses on time; then S′ at the E
     in force (1 810 today), S-4; then the Levels deep lane.
   - **K7, the tool line** (d11 (a)): `TUNE_DEEP` green at the tip, its count reported.
   - **Reports, not bars:** drift at d5, reach at 47 000, PR10's figures.

8. **The fault rule on this read.** CF1–CF10 reach it (`ADR-0056` D5's dated block of `arch-owner-answers-1105b`). QE copies the Reach line and CF1–CF10
   unaltered, then this table, which fills that block's third column for this ticket. It adds no bar.

   | the words | in | on `ABC-291`'s read |
   |---|---|---|
   | "50.0" | CF2, CF5 | 50.0 (GAIN) |
   | "B6" | CF2, CF5, CF8 | C2′'s miss line: NOT MET, nothing merges, QE records a `failed-attempt`, and the ticket goes back to BA/PM. d11 (d) applies |
   | "no form, T, tier, door, margin or table moves (row P2)" | CF3 | no definition (d1), rule or value (d2), memo form (d3), switch or door (d4) moves. Every value of `PAWN_CONNECTED`, `PAWN_PHALANX` and `PAWN_BACKWARD` is fixed |
   | "Tables 1 and 2" | CF3 | K0–K5 and K7: every graded row the PREREG reads before the first game |
   | "§ 6's order" | CF4 | C2′, then S′, then the Levels lane |
   | "S1, S2 and R7" | CF6, and CF7 through it | K0 (a), the off door against the merge-base; K0 (b), every older door; K0 (c), the head's counts |

   - **No change:** CF1, CF9, CF10. CF7 changes only through CF6, and CF8 only by "B6". 3.0 of 10 and 7.0 of 20 are S-4. "The sealed E" is the E in force at this read's seal.
   - **A defect fix is not a miss.** A fix that restores d1 or d2 as written is CF3's, and CF4's new read follows if CF2 sends it there.

9. **What a pass means: "not seen worse", not "proven better".** C2′ at GAIN keeps a score of 50.0 or more. By `ADR-0056`'s C2′ table a term truly worth
   +20 Elo passes 79 % of the time, +10 passes 66 %, 0 passes 50 %, −10 passes 34 %, and −20 passes 21 %. So a merged term's Elo stays unknown. A term worth
   nothing passes half the time. The read keeps clear gains and stops clear losses, and it cannot tell +10 from −10. The score is not a measure of the
   term, and it is not added to any forecast. `ADR-0056` D2's +20–60 stays an estimate for all of row E4, E4a included.

10. **The premise probe: written here, not run.** It runs on the host after A4, once, under the host lock, on one core. It plays no games.
    *Dated 2026-11-05 (`arch-ABC-291-probe`): **run, once.** It cannot be run again. Its reading is § The probe's reading. The rows below stand as sealed.*
    - **The premise, in three parts:** at d2's values the term is **safe** on the rows that have caught hand values before, **cheap** per call, and **fires** at
      100 ms often enough for 100 games to mean something.
    - **Sealed form.** A `decision` note under the probe's own task, sealed and committed **before any measured run**. It names `main`'s tip and `src/` tree, the
      sha256 of each script, the rows and bars below word for word, the batch order, and the rule below. One load-only smoke may run first: the start position
      with the term on reads 0, by symmetry, which carries no information. Then one results note and one decision note. Scripts and outputs go to the task's
      `raw/`, with `<scratch>`, `<home>` and `<repo>` as placeholders. **No bar moves after a reading, and a miss is not re-played.**
    - **The instrument.** Scratch `git archive` copies of `src/` at the sealed tree, outside the repository: `main` (unpatched), `main2` (unpatched, the control), and
      `cand` (d3 and d4 patched in, with a probe-only switch giving ON and OFF).
    - **The rows:**

      | row | reads | bar | class |
      |---|---|---|---|
      | **PR1**, instrument | OFF against unpatched `main`: nodes, score, move on K0 (a)'s rows | exact | else the probe is void: STOP |
      | **P0**, counts | ON on the same rows | none, a reading; it becomes K0 (c) | reading |
      | **PR2**, mirror | K1 (a)'s sets, ON, `Object.is` | 0 mismatches | exact |
      | **PR3**, arithmetic | the seam's parts against an independent labeller, written from d1's words and sharing no code with the patch, over `G3`, the probe's pawn positions and every position of PR9 | 0 mismatches | exact |
      | **PR4**, memo and off | a hit equals a fresh call; ON then OFF on one slot; OFF `Object.is`-equal to `main` on the corpora | 0 mismatches | exact |
      | **PR5**, mate floor | `ADR-0064` B2's two rows on the 287, ON | 0 violations | safe |
      | **PR6**, zugzwang | `ADR-0050` d9's seven rows at recorded depths, ON, the played move only | 7 / 7 | safe |
      | **PR7**, `G1` | the 58, ON against OFF | no NEWLY-MISSED line | safe |
      | **PR8**, `G2` | d5's instrument, ON against `main` | R ≤ 1.03; a void session leaves it `UNKNOWN`, and it moves to the build | cheap |
      | **PR9**, firing | static evaluate, ON minus OFF, at every position of the 200 C2′ games on record (`qe-ABC-269` b8, `qe-ABC-279` c2, `d.pgn`) | share with \|Δ\| ≥ 10 cp at or above 5.0 % | fires |
      | **PR10**, reports | reach at 47 000; drift at d5; ns per node on `G2`'s roots at fixed depth; the memo's hit rate in search, as a count; a per-call ratio with the memo bypassed; the endgame report set; PR9 by part | none | decides nothing |
      | **PR11**, lane report | the default lane with ON hard-wired, against `main`'s copy | none; it lists the value rows and re-points for K2 | decides nothing |

    - **Fenced out of the probe.** No margin on `zugzwang.001`, no v(e1f1) − v(e1e5), no per-part read of it, and no singles on any safety row. Under `ADR-0067` test 3 as read
      at `…3e6b25fb`, the all-on row owed by every value-changing read does not fail the test, and a per-part read of it does.
    - **The rule (fixed now):**
      1. **PR1, PR2, PR3 or PR4 misses:** a defect in the prototype gets one fix under a sealed addendum, and every row is re-read. If PR3 shows d1's words are wrong and not the patch,
         STOP: this ADR is restated and goes back to him. No value moves.
      2. **PR5, PR6 or PR7 misses:** a defect check first. If the miss is real, the premise is **NOT MET**. `ABC-291` is not built, and it goes back to BA/PM. d11 (d) applies, so no number is
         changed to pass. There is no subset fallback: form (a) is superseded, and dropping a term after a safety read is choosing with the row in hand.
      3. **PR8 above 1.03:** the premise stands. The build carries d5's named cut, and QE reads K4 on the build. This is `ADR-0070`'s rule 5 form.
      4. **PR9 below 5.0 %:** the premise is **NOT MET for an own read**. 100 games would then read a term that barely moves the score, near a coin flip, at the term's cost. The intent stays
         GAIN, and no value is raised. The ticket goes back to BA/PM, and the owner is told. A bundle under B1 stays lawful if a later ADR states the relation.
      5. **Every row holds:** the premise is **MET**, and the ADR gets its dated line.
    - **What the probe can change in this ADR:** K0 (c)'s counts; K2's value-row and re-point list; the forecasts at d5 and § Consequences, replaced by readings; the fixture list; and whether `ABC-291`
      is built at all.
    - **What it cannot change:** d1's definitions (except by rule 1's STOP, back to him), d2's rule or any value, d3's memo form, d5's ratio, d6's intent, any bar, or the term order. It cannot
      turn a miss into a pass, and it cannot be re-run after one.
    - **Host:** about 3 min of runs for `ADR-0070`'s probe, plus two `G2` sessions and one lane report. Under 1 h by estimate, `UNKNOWN - verify`. It takes the lock alone, as any timing read does.

11. **The four carried items.**
    - **(a) `TUNE_DEEP` against a hand-valued term: the tool line lands with the term, at its merge. Settled here, for `ABC-291`.**
      - **The fact, by reading, nothing run.** `tools/tune/tune.test.ts`'s gate rows compare the shipped `evaluate` with the tracer at the shipped table over `G3`'s 184. A term with real values
        that the tracer does not model misses wherever it fires. At `b297ab89`, which `ABC-305` lands, a second row reads the emission's exports equal to `main`'s, 17 of them, so a new export
        reddens that too. So **`ABC-291`'s merge would turn `TUNE_DEEP` red twice over.**
      - **Why at the merge and not at a pull.** A lane known to be red shows no new fault, and `ABC-305` A6 would STOP on it if it landed later. At real values the tracer is also a second, separate
        reading of d1 on the hot path, the class `QE-271-h` found. That has worth with no pull at all.
      - **The form.** `tools/tune` gains the three terms' counts in the tracer and the three exports in the emitter, **traced and held, not free**, as `T_UN` is (`ADR-0070` d7). 17 → 20 exports. No
        fit, no emission to `src/`, and `src/` gains no tracing code. K7 reads it. The line is the last commit on the branch: it holds no production line, so it stales no read.
        *Dated 2026-11-06 (`arch-ABC-291-stop`; `se-ABC-291` `…d68ef14e` item 5): **`QUIET_RULES` gains `pawnShape: true`, and the line is confirmed.** The fact above named two reds, and the build found a third. `isQuiet` compares a full-window `quiesce` with the shipped `evaluate`. A record with no field stands pat on the off evaluation, so every position the part touches reads as not quiet, and K7 cannot read green. **The record follows the evaluation, as its `taper: true` does.** `ADR-0069` d6 and `ADR-0074` d6 keep pruning switches out of it, so that no data set moves. Those switches change what `quiesce` searches. This one changes what `evaluate` reads, so this merge moves the filter with or without the field. `seePruning` stays out. d4's "on in `search()` and `chooseMove` only" speaks of the shipped recursions, and a tool's own record is not one. `QUIET_RULES_NAME` changes with it, so a later pull's manifest shows the filter it ran. No pull is open and no `src/` line follows. The test-only commits after this line (`e76d22f3`, and the STOP's repair) hold no production line, so its reason for "last" stands.*
      - **What this supersedes.** On this term, the pages' "each new export is owed to that pull's emitter change". `…6ccd8243` item 3 spoke of E4a at 0, before any row read the exports.
      - **Order.** `ABC-291`'s build follows `ABC-305`'s merge. If E2 closes for good, no tool line is owed by any later term.
    - **(b) How `ABC-306` reaches a fit: only on a yes that names it. The Architect writes the route at that yes.**
      - **The hold stands.** Nothing is built now.
      - **The route:** per-piece weights land value-identical, every piece at the shared `MOBILITY_WEIGHT` (not at 0), so the fit has a term on `main` to weigh. It needs its `ADR-0031` change and one dated line
        beside `ADR-0056` D2's supersession, since it is form (a) in substance. The reason for that supersession, "it buys nothing until a pull exists" (`…2b3440cf`), lapses only once he says yes.
      - **It does not ride in by default.** It would have no read of its own, so it fails `ADR-0067` test 2 as written. His yes must name it, or it stays out of the free set.
      - **`UNKNOWN - verify`:** whether the tracer's single `clamp(W · m)` fits a weight per piece. That ADR's.
      - **The Phase 4 ruling (`…42f7fd67` 2).** I find no record against it. `…2b3440cf` lists `ABC-272` and `ABC-290`–`ABC-294`, and `ADR-0056` D6's dated line leaves the list to the Orchestrator.
        `EPIC-011`'s row 58 labels `ABC-306` "Phase 4" as its home, which is not a closing rule. So a held `ABC-306` does not hold `ABC-295`.
    - **(c) E5 without per-piece mobility at the third-pull door: it counts. Settled here as a reading, open to overruling at any third-pull call.**
      - His table names "E3b, E4b, E5 or E6", and "E5" names the row. `ABC-292`'s three terms are that row, split by `ABC-207`'s loss and not by the row. All three are in `ADR-0056` D2's row E5 from 2026-11-01 and on `ABC-292`'s page from `181da9e3` (2026-11-04, 13:34Z), before `dd88560f`
        (23:58Z that day). So test 1 holds.
      - If the three split, each part that merges counts on its own. The four tests read on the part, and only merged parts enter the free set. Test 4 is unchanged: one door, one fit.
      - Its worst case is harmless: the door only lets a pull be **asked for**. Asking is not a yes.
    - **(d) No second set of values after a miss. Settled here for this term, on his acceptance. Each later term's ADR carries it, and he sees it each time.**
      - **The line.** After a miss, `PAWN_CONNECTED`, `PAWN_PHALANX` and `PAWN_BACKWARD` do not get new numbers by hand. New numbers chosen after a loss are tuning on play by hand.
      - **A miss is:** a real safety red (F3), C2′ below the bar on a clean read, a CF2 or CF8 NOT MET, a second `G2` miss, or the probe's rule 2 or 4.
        *Dated 2026-11-06 (`arch-ABC-303-b5`): a second K5 miss is also a miss here. The Orchestrator ruled it (`…43e6d8fd` 3) and told the owner. It stays open to his overruling, as d11's readings are. That miss is F2's second miss on K5's half (§ What would falsify this). The list's words above stand.*
      - **Not a miss:** a defect fix that restores d1 or d2.
      - **How it sits with C2′'s line** "a changed form may come back as a new attempt". It narrows that line for a hand-valued term. A change of values alone is not a changed form. A new form needs a new definition,
        a reason drawn from no missed read, its own ADR and his acceptance.
      - **What it does not do.** It does not hold the next term: a miss here leaves `ABC-292` where it stands (this answers `…fbc5050f` J10; no record says otherwise). A term that missed is not on `main`, so no pull can fit it.

12. **The pattern for `ABC-292`, `ABC-290` and `ABC-293`** (`…ba886714`: this ADR sets it). Each ADR states, in this order: definitions; one rule built on `main`'s own table, fixed before any row and blind to `zugzwang.001`; the memo or
    per-call seam; one switch and an off-door pair; a `G2` ratio with its reason and its blind spot; a probe with rows, a sealed form, and a line for what it can and cannot change; K rows reading the term's own part; CF's table filled; the
    tool line at the merge; no second set after a miss. Each sets its own ratio. Nothing here binds their values.

## The probe's reading

*Dated 2026-11-05 (`arch-ABC-291-probe`, on `main` `91c21a9f`, `src/` tree `cc6e64d1`). PREREG `…2a579895`, committed at `d033ea0e` before the first measured run. Readings `…65c7a9c9`, decision `…2926c26b`. About 3.5 minutes of lock. No value, rule, definition, ratio, intent or bar moved.*

**The premise stands under rule 3. `ABC-291` is built, and the build carries d5's named cut.**

| row | reading | bar | read |
|---|---|---|---|
| PR1 | 7 of 7 rows exact | exact | holds |
| PR2 | 230 pairs, 0 mismatches | 0 | holds |
| PR3 | 28 126 positions, 0 mismatches. d1's words stand | 0 | holds |
| PR4 | 28 126 positions and 1 068 forced collisions, 0 mismatches; OFF equal to `main` on 28 286 | 0 | holds |
| PR5 | 0 of 163 and 0 of 191 | 0 violations | holds |
| PR6 | 7 / 7 | 7 / 7 | holds |
| PR7 | 54 / 58 ON and OFF, no NEWLY-MISSED line | none | holds |
| PR8 | r₁ 1.02720, r₂ 1.05855, **R 1.04287**; controls 1.00427 and 1.01355, both sessions stand | R ≤ 1.03 | **above: rule 3** |
| PR9 | 4 106 of 27 896, **14.72 %**, 200 games | ≥ 5.0 % | holds |

- **Reports (PR10), which decide nothing:** reach 6.868 → 6.900; drift at d5 100 % within 25 cp, largest 24; ns per node 0.988 of `main`, on 3.45 % more nodes; memo 906 509 hits to 46 876 misses, 95.083 %; endgame set 1.0195. **The ratio with the memo bypassed is VOID:** both controls fell outside [0.970, 1.030], so the miss path's cost stays `UNKNOWN - verify`.
  *Dated 2026-11-06 (`arch-ABC-291-k1c`; `qe-ABC-291-k1` `…a223d29a`, `…5de6a358`, `…5a2d8753`): **"drift at d5 100 % within 25 cp, largest 24" is the reading at `cc6e64d1` and stands as that. It is not the build's figure.** On the build's base, `8e115110`, the shipped tree reads 96.79 %, largest 89 (position-6/e2d2, 12 → 101). With the bundle off it reads the probe's figure on every field: 187 rows, 100 %, 24, position-5/e1f2, 4 moves. With M3 off alone it reads 100 %, 16. So `ADR-0072`'s M3 moved the figure, and the term's values did not. Of the 89, 10 is the static term and 79 is the tree. No defect, and F1 does not fire. QE's run is a report under its own brief, not a re-run of the probe, and PR10's row stands as sealed. Why M3 reacts, and whether it costs play, stay `UNKNOWN - verify`. C2′ prices the second. No value, rule, definition, ratio, intent, bar or level moved.*
- **PR8's shape:** the arm with the term read near 316 ns in some rounds and near 335 in others. `main` held 315. So R mixes about 1.00 and about 1.06. The cause is `UNKNOWN - verify`.

**K0 (c), the head's counts at `cc6e64d1`.** nodes, score, move:

| row | head | row | head |
|---|---|---|---|
| `chooseMove` kiwipete d8 | 693 584, −87, d5e6 | `chooseMove` position-6 d9 | 250 777, 74, c3d5 |
| `chooseMove` kiwipete d9 | 1 517 556, −110, e2a6 | `chooseMove` position-6 d10 | 511 558, 75, c3d5 |
| `chooseMove` position-6 d8 | 120 104, 74, c3d5 | `search()` kiwipete d8 | 521 532, −87, d5e6 |
| | | `search()` position-6 d8 | 271 572, 74, c3d5 |

**K2's list, at `cc6e64d1`: the 58 rows PR11 read red, none red on `main` (2 709 green).** Rows follow d4. "Off" means `evaluateAtPhaseWithoutPawnShape`, or `chooseMoveWithoutPawnShape` where the row calls the engine.
1. **Byte rows (2):** `src/evaluate.pawns.test.ts` "is a fixed 576 KiB…" and `src/transposition.test.ts` A7 "stays inside NFR-009's 16 MiB…". With d5's cut the memo is 589 824 bytes and neither moves. Without it they read 655 360, as d7 has them.
2. **Value rows, old → new (2):** `src/engine.test.ts` `ABC-249` "Qe5+ at ply 4…", f1e1 441 → 443, f1g1 520 → 522, title with them; `ABC-282` A2 (c) "a completed mate above the incumbent…", e4d3 1 070 → 1 075.
3. **A lost fixture property (1):** `src/engine.test.ts` `ABC-282` A2 (b) "stopped before any root move beat it…". The incumbent reads a3b4 521, and the head stops at 1 157 nodes against the base's 3 197, so the row no longer reads its title. Re-found under `ADR-0028` d2, by the row's own scan. Not a re-pin.
4. **Re-points to off, figures unchanged (26):** `src/evaluate.passer.test.ts` `ABC-271` K1 (b), 4; `src/evaluate.queen-on.test.ts` `ABC-270` K1 (b), 3; `src/evaluate.taper.test.ts` `ABC-269` B1 (a) "the frozen rows span phases 0 to 24…", 1, B1 (b), 2, `ABC-274` A3, 13 (one loop body; its two green rows move with it); `src/search.bundle.test.ts` `ABC-283` (a) "iterations 1-4…" and "a non-mate fail high…", 2 (the loop's green mate row moves with it); `src/see.test.ts` `ABC-279` A1 (c) "a node whose every capture is losing…", 1.
5. **The new door joins a list (14):** exports, `src/engine.test.ts` A4 and `src/search.test.ts` A6; door lists, `src/evaluate.taper.test.ts` 2, `src/quiescence.test.ts` 4, `src/search.futility.test.ts` 2, `src/search.null-move.test.ts` 2, `src/see.test.ts` 2.
6. **The switch's call sites (13):** `src/evaluate.taper.test.ts` "the call sites…", 1; `src/quiescence.test.ts` "the leaf passes its ply…", 2; `src/search.futility.test.ts` "one futilityNode call gated…", 2, the arity row 7 → 8, 1, the boundary rows, 6, "the mate band's edges", 1. Also on the list, green but wrong: the `futilityNode` calls at `src/search.futility.test.ts` lines 275, 439, 440 and 698, which only `tsc` shows. This group assumes `futilityNode(…, taper, pawnShape, phase)`. If the build passes the switch another way, the same rows change with it.

Applied as edits on a scratch copy, the list leaves 2 708 of 2 709 green and `tsc` clean. The one red is item 3. **The list binds at `cc6e64d1`.** On a later base it is re-derived as K0 (c)'s counts are, by a dated line, never a moved bar. **Deep lanes were not read:** PR11 is the default lane. How d7's "a re-pin outside it is a defect" reads on them is with the Orchestrator (`…2926c26b` call 2).

**The fixture list:** the probe's 16 positions (`raw/scripts/e4bprobe.ts`, `PAWN_SET`) meet K1 (a)'s "at least 12" and are offered to QE.

**F2 after PR8:** with the cut spent before the build, whether K4 on the build is F2's one re-read is with the Orchestrator (`…2926c26b` call 1). My recommendation is that it is.

*Dated 2026-11-05 (`arch-ABC-307-records`): ruled, `…69ee96e7` 1: it is, and K4 above 1.03 × is the second miss: not merged, and a miss under d11 (d). K5's half is in § What would falsify this.*

## The owner's question

*Answered 2026-11-05 (`…c1623ae7`): "1. yes". The question stands below as it was asked.*

**Do you accept ADR-0075?**

In plain words: the engine would learn three pawn ideas. A pawn defended by another pawn earns a small bonus. Two pawns side by side earn half that each. A pawn left behind, which no pawn can ever defend and which cannot safely move, pays the same
penalty as an isolated pawn. The numbers are 1 to 28 centipawns, worked out by a fixed rule from numbers the engine already has, and nothing has been tested.

A yes locks those numbers before any test sees them. After that:
1. A short host check runs after A4, under an hour by estimate, with no games. It cannot change a number. It can only stop the work.
2. The term is built, then read in 100 games at 100 ms, after `ABC-303` and `ABC-289`.
3. If it loses, it is dropped, with no second try on new numbers.

A pass means "not seen worse", not "proven better". A term worth nothing still passes half the time, and we would not know what it is worth. A merge would also meet your condition for asking about a third tuning pull. Asking would still be a new call for you.

**My recommendation: yes.** By reasoning, not by any reading, it is the cheapest of the four and the least exposed to the failures seen so far. Accepting before the check keeps the numbers honest. If you want the biggest possible gain first, that is E3b, at a higher risk of the failures seen so far. If you would rather see the host check first, the numbers still cannot move, so waiting costs only time.

## Alternatives

- **Form (a), structure at 0.** Superseded (`ADR-0056` D2's dated line).
- **Flat values for connected and phalanx.** `ABC-291` allows it. Not taken: a flat bonus pays as much for a quiet h3 as for a chain head on the fifth rank, and by-rank costs one table read, in the memo.
- **Anchor at R = 3 (values 5, 10, 17, 30, 50) or R = 5 (1, 3, 5, 10, 16).** Not taken. R = 3 rewards pawn moves inside the home half as much as `ISOLATED` costs. R = 5 leaves almost nothing on the ranks where most pawns stand.
- **An endgame half of 2 × the middlegame, E1's passer rule.** Not taken. E1's reason is the promotion race, not support, and it would make a backward pawn dearer than an isolated one in the endgame. No record gives a rule for these halves.
- **Backward charged more on a half-open file.** The page's Problem mentions it. Not taken: one more feature and one more number, with no anchor. A later fit may ask for it.
- **Values from another engine.** Not taken: `ADR-0048`, and they were tuned on another table.
- **A subset fallback in the probe,** as `ADR-0070`'s rule 3. Not taken: d10's rule 2.
- **A door per term.** Not taken: no row reads the terms apart, and each door costs an export pair across both recursions.
- **Terms outside the memo.** Not taken: they read pawns only, so that is cost for nothing. `ABC-205` died on cost.
- **No memo growth, by merging `doubled` and `isolated` now.** Not taken: it changes tested code to save 64 KiB no NFR needs. It stays as F2's named cut.
  *Dated 2026-11-05 (`arch-ABC-307-records`): the probe's rule 3 spent that cut before the build, so the build does merge them. The reason given here was for the ADR as proposed.*
- **A second memo, or the on / off flag in the key.** Not taken: the separate part does it for 64 KiB.
  *Dated 2026-11-05 (`arch-ABC-307-records`): with d5's cut the separate part costs 0, not 64 KiB.*
- **`G2` at 1.05 ×, or at 1.02 ×.** Not taken: d5.
- **The tool line only at a third pull.** Not taken: d11 (a). It is cheaper today and leaves a known-red lane for as long as the wait lasts.

## What would falsify this

| # | clause | what would falsify it | if it fires |
|---|---|---|---|
| F1 | d1–d4: the design as built | a seam, mirror, memo or door row red; K0 not reproduced | a defect, fixed before any cost bar |
| F2 | d5: cheap | K4 above 1.03 ×, or a run below depth 6 on K5 | STOP to Architect/Design: d5's one value-identical cut, then one re-read under a PREREG. A second miss: not merged |
| F3 | K3: safe | a mate-floor, zugzwang or `G1` row red | a defect check first. If real, NOT MET. Never a re-pin, a moved depth or a new value |
| F4 | d6: the read | C2′ NOT MET | not merged, not re-played, back to BA/PM, through CF1–CF10 and d8's table. d11 (d) applies |
| F5 | d10: the premise | the probe's rule 2 or 4 | `ABC-291` is not built. This ADR reads "accepted, not in force", or is withdrawn if not yet accepted. d11 (d) applies |
| F6 | d11 (a): the tool line | an identity-gate miss at the tip | read against d1's words. `evaluate` wrong is F1. The tracer wrong is a tool defect. No production line changes to fit the tool |

*Dated 2026-11-05 (`arch-ABC-307-records`, records only; nothing run): **F2's K5 half, after PR8.** `…69ee96e7` ruling 1 names K4 only (`…bf92ae84` 1), so this line writes the other half. It is the Architect's reading, in that ruling's form, and it stands unless the Orchestrator overrules it before K4's PREREG seals.*

- **F2 is one row on one clause, d5: cheap.** It names one cut and one re-read, not one of each per half. Rule 3 spent the cut on PR8's miss of that clause.
- **So the build is the one re-read, for both halves.** K4's PREREG seals K5's read too, and both read the build that carries the cut.
- **A clean run below depth 6 on K5 is F2's second miss: STOP to Architect/Design, then not merged.** The STOP is a defect check first, in F3's form. A defect in d1–d4 as built is F1's, and d8 says what a fix that restores d1 or d2 is owed. With no defect, it is not merged.
- **No re-read of the same code.** With no cut left, a re-read reads the same build. All it could do is turn a recorded `NFR-005` FAIL into a pass by replay, and `ADR-0056` D7's dated line reads "every run completes depth ≥ 6 (FAIL below)". That would soften a floor whose level is the owner's, so it is not offered.
- **A void is not a miss.** A run inside a read voided by foreign load is not a run on K5. The PREREG states K5's void rule, K5 reads in the window ruling 1 gives K4, and a re-read after a void is not F2's re-read.
- **What does not move.** Depth 6, the depth-7 WARN, "≥ base" reported and not graded, `G6`'s reading rule and `NFR-005`'s level. K5 loses no re-read that was left to it: had PR8 held, a K5 miss would have earned the cut, and PR8 did not hold.
- **What stays open: d11 (d)'s list.** It names "a second `G2` miss", and K5 is `G6`. This line does not add K5, because d11 (d) was settled on his acceptance. So a K5 second miss is "not merged", in F2's words. Whether it is also a miss under d11 (d) is with the Orchestrator. My recommendation is that it is, since new numbers after a cost miss are still numbers chosen after a miss. K4's PREREG does not wait on this: nothing it seals turns on it.
  *Dated 2026-11-06 (`arch-ABC-303-b5`): no longer open. `…43e6d8fd` 3 ruled it: a second K5 miss is a miss under d11 (d). See d11 (d)'s dated line. The ruling stays open to the owner's overruling.*
- **How near.** `G6` on this term is `UNKNOWN - verify`. `qe-ABC-271` read kiwipete at 9 and position-6 at 12 on every run (`…3e1cc3ff`), and PR10, on the form before the cut, read 0.988 of `main`'s ns per node on 3.45 % more nodes. By reading, the floor is far off.

*Dated 2026-11-06 (`arch-records-1106`, records only at `main` `8e115110`; nothing run): **`G1`'s class on `ABC-291`.** BA/PM held it open (`…cd04f470` J1, `…710dc7ec`) against `…7c297147` § 4 item 5. It is ruled from the letter, before QE seals, without opening `se-ABC-291`'s build or figures.*

- **The ruling: every `G1` row missed on `ABC-291` is class B. This diff has no class D and no class L, whatever a ladder would show. F3 reads as written.**
- **The letter.** `ADR-0034` d2: "A diff that touches any other trigger-list file has **no drift class here**. Every missed row is class B." Its instrument: "Decisions 3 and 4 apply only if every printed line is `src/evaluate*.ts`."
- **This diff.** d4 puts `pawnShape` in `src/search.ts`'s `Switches`, `src/engine.ts`'s `Heuristics` and quiescence's rules record, and § Consequences names the three files. All three pass the instrument's filter at `8e115110`. `ADR-0034`'s control `ABC-079` prints the same three: "still all B, as decision 2 intends".
- **No figure can change this.** A build whose instrument printed `src/evaluate*.ts` alone would lack d4's switch, and that is F1's. So on an exact build the class does not wait on the diff.
- **d2 tests the diff, not the term.** `ADR-0034` § Context's first mark of drift is "the diff touches no search code". The READING under d2 sets aside test files and test-only fixtures, and nothing else. A switch is loaded search code. `ADR-0050`, `ADR-0051` and `ADR-0074`'s F7 line read d2 the same way.
- **`…7c297147` § 4 item 5's class sentence is withdrawn.** "An evaluation-only diff has a drift class" is true of such a diff, and this is not one. The note's "`G1` is thin" half stands, and so does the rest of the note.
- **What a miss does.** The red stays a QE FAIL (`ADR-0034` d1). Then F3 runs, with two outcomes:
  - **A defect.** d2 sends a not-a-defect argument to `ADR-0026` d10's oracle, "not through this ADR". My reading: on this ticket that oracle is d7's K rows, so a red in K3 cannot clear itself. A defect is F1's, and a fix that restores d1 or d2 is not a miss (d8, d11 (d)).
  - **No defect: the miss is real.** Growth on an exact build is not a defect, and F3 has no third outcome. NOT MET, not merged, and a miss under d11 (d). d10's rule 2 read PR7 the same way.
- **Not routes on this diff:**
  - `ADR-0034` d3's table, and its line "Any other row goes to the owner as a depth cost". Decision 3 does not apply here. A rung may be reported beside the red, as evidence for the defect check. It classes nothing.
  - d4's fixture and level lines. K3 reads `ADR-0064` d7's rows, d7 keeps "zugzwang, the mate rows and `G1`" on the shipped path, and K3 says "no expected result is rewritten".
- **The row's name.** `…40ef8351`'s "if a later term reds it, F7 governs" is `ADR-0074`'s F7. On `ABC-291` that row is F3.
- **What it costs, stated.** Row 1632 uses 16 838 of 20 534 nodes on `main`, and `main` misses it at 0.8×. If the build pushes it over, this term can end NOT MET on a row it cannot touch, with no second set of values. Whether it does is `UNKNOWN - verify`. Those are the bars he accepted. His word can still move a count, the corpus or the budget (`ABC-084` A7), but this ADR offers that as no route, and QE puts no D row to him.
- **What does not move.** K3, F3, d11 (d), `G1`'s bar, and `ADR-0034`. A class is a red's route, not a bar. No value, rule, definition, ratio, intent, bar or level moved.

## Consequences

- **Play:** every position with pawns can move. The start position stays 0 by symmetry. No read exists. The bars above are the first.
- **Host.** The probe, then a build, `G2`, `G6`, safety rows and C2′ at about 25 min, S′ and the Levels lane. Runs over 1 h need his word, as usual. None is planned.
- **Order.** `ABC-305`'s merge, then the build. C2′ follows `ABC-303` and `ABC-289`, because a value-changing merge stales the read after it. The probe needs only the host.
  *Dated 2026-11-06 (`arch-records-1106`, records only; nothing run): `ABC-305` is Done, and `ABC-303` merged at `434fa171`. `ABC-289` is recorded NOT MET on an exact build and stays unmerged (`…7c297147`, `…40ef8351`), and the Orchestrator lifted `…69ee96e7`'s `ABC-289` clause. So the build goes on `main`, with bundle 1 in and no `…WithoutDeltaPruning`, and d4's "those `ABC-303` and `ABC-289` add" reads `ABC-303`'s only. C2′ waits only for `ABC-289`'s outcome to be recorded, and that record meets this line: no merge is left to stale the read. `ABC-289` is not closed: OQ-0074-2 is with the owner. If he opens a route, `ABC-291`'s read goes first or waits. He was shown "after `ABC-303` and `ABC-289`", so the Orchestrator tells him if it goes first (`…40ef8351`). No value, rule, definition, ratio, intent, bar or level moved.*
- **Third pull.** A merge on its own read meets `ADR-0067`'s trigger. Asking stays a new call for him. If he says yes, the term may enter the free set, and d2's values are its start.
- **NFRs.** `NFR-009`: +65 536 bytes, 640 KiB. `NFR-001` / `G2`: K4. `NFR-005`: K5. `NFR-008`: K1 rows are units with no search. Their cost in the lane is `UNKNOWN - verify`, and the row census the Orchestrator placed after A4 gates the merge. No new NFR file. `plans/nfr-catalog.md` is untouched.
  *Dated 2026-11-05 (`arch-ABC-307-records`): `NFR-009` reads +0 bytes, 576 KiB, with d5's cut (`…2926c26b` call 3, `…69ee96e7` ruling 3). No level moves. `plans/nfr-catalog.md` stays untouched.*
- **Determinism (`ADR-0027`) and licence (`ADR-0048`):** integer terms, mirror-exact by construction. The rule is this project's own. Security: none.
- **File collisions:** `src/evaluate.ts` and `src/evaluate-params.ts`, one at a time with `ABC-272`, `ABC-290` and `ABC-292`–`ABC-294`. `src/search.ts`, `src/engine.ts` and `src/quiescence.ts` take the switch, so the door list is read on the base the build is cut from.
- **Owed by BA/PM, after his answer:** `ABC-291`'s page: K0–K7 and the bars, `G2` 1.03, 640 KiB, the meaning of "tapered", the tool line, `ABC-305` in § Dependencies, status In Design. `ABC-306`'s "Through a fit" line. The door reading on `ABC-292`. The "emitter change" line on `ABC-290`–`ABC-293`. `EPIC-011`'s rows.
  *Dated 2026-11-05 (`arch-ABC-307-records`): the page's 640 KiB reads 576 KiB, +0, since `bapm-ABC-291-probe-lines` (`…bc1c9835`). Its F2 note still reads K5's half as not ruled: BA/PM owes that one line.*
- **Owed by the Architect:** the probe under its own task after A4; K2's list by a dated line, before Ready.

### `UNKNOWN - verify`
- Every reading: whether any row holds, `G2`, `G6`, the firing share, the memo's hit rate, the miss-path cost, and the probe's wall time.
  *Dated 2026-11-05 (`arch-ABC-291-probe`): read, and now in § The probe's reading: the rows, `G2`, the firing share, the hit rate, the wall time, and K2's list. Still open: `G6`, the miss-path cost, what the cut buys, every play read, and the deep lanes' rows.*
- Whether this term holds `zugzwang.001`. Whether any hand-valued term pays. This term's share of row E4's estimate.
- K2's value rows and re-point list. `ABC-291`'s exact default-lane row count.
- Whether `TUNE_DEEP` is red on `main` today. That the merge reddens it is by reading, not by a run.
- Whether d2's low ranks push the engine toward flank pawn moves in front of its king. Reasoned as small, and unread.
- Whether a weight per piece fits the tracer's clamp (d11 (b)).

## Rollback

- **Before the merge:** this ADR reads "accepted, not in force", or is withdrawn. Strike the dated lines of `arch-ABC-291` in `ADR-0056` and `ADR-0067`.
- **After the merge:** revert the one merge. The memo returns to 576 KiB, the doors and the tool line go with it, and every read after it is stale by C2′'s rule. If a fit has merged on top, revert that first (`ADR-0067` § Rollback).
  *Dated 2026-11-05 (`arch-ABC-307-records`): with d5's cut the memo never leaves 576 KiB, so it has nothing to return from. The revert also restores `doubled` and `isolated` to words of their own.*
