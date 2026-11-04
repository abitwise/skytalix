---
kind: adr
id: ADR-0070
---
# ADR-0070: E4a (`ABC-271`): passed pawns read the kings and the path. King distance to the queening square, a free path, and the unstoppable passer by the rule of the square, as endgame halves made by stated rules and computed outside the pawn memo. They ship as rule values judged on play, behind a test-only off-door pair, before the second tuning pull, which then fits king distance and free path

## Status

**PROPOSED 2026-11-04.** Recorded by Architect/Design (task `arch-ABC-271`, on `grugops/arch-ABC-271` from `main`
`ac55ddf6`). ADR-0070 was the next free id after `ADR-0069`; no other record used it.
- **Acceptance is the owner's.** This is a new ADR, and its values are a requirement-level choice
  (`memory-bank/45-standing-rulings.md`, 2026-10-22).
- **Reading (b)** (the `ADR-0064` / `ADR-0068` precedent): the build may start while this ADR is PROPOSED. The
  100-game read and the merge wait for acceptance.
- **The answer that settles it:** *"accept ADR-0070"* or *"decline it"*.
- **Default without an answer:** `main` keeps E1's passer term, and the second pull waits for E4a's disposition.
- **Why now:** `ABC-239`'s first pull closed NOT MET (`…4c76bf7a`). `arch-ABC-239-f3f4` (`…4eae0fd3`, `…69f22167`)
  traced `zugzwang.001`'s e1e5 to the fitted endgame halves of the pawn, rook, king and passer terms. It found that no
  relation on today's features can hold it: the passer part needs free-path and king-distance features. Its path
  (iii) put E4a before a second pull.
- **The probe:**
  - It ran under the PREREG `…eeb25cc6` (commit `029533f0`), sealed before any measured run, and one addendum
    `…3a9eba86` (commit `904b3fff`), sealed before its diagnostic.
  - It ran on scratch copies of `main`'s `src/` (tree `8adb0a18`: E1, E2-pre, E3a structure, Q1), outside the
    repository, under the host lock, about 3 min of runs in all. Nothing was committed to `src/` or `tools/`.
  - Scripts and outputs: `.grugops/context/arch-ABC-271/raw/`.
- **The verdict: H, all three terms on their rule values, holds every play-safety and cost row.**
  - The mirror and phase 24 hold, and so do the mate floor (0 / 163, 0 / 190), zugzwang (7 / 7), `G1` (54 / 58, none
    newly missed) and `G2` (R = 1.0269).
  - **E3, the generated relation rows, missed as pre-registered.** The diagnostic classes every failure: the other
    terms (king exposure), the king leaving the passer's path, or a one-step king distance of 1 cp of eg lost to the
    blend's trunc at phase 4.
  - By the addendum, the third class means STOP and restate the rule. The rule is restated in decision 1's
    resolution clause and decision 5's relation domains. **No value moved.**
  - **Taking choice rule 1 after an E3 miss is a judgment.** The Orchestrator may overrule it with choice rule 4
    (structure only), which is named in § Alternatives.
- **What it amends (dated lines written here, records only):**
  - `ADR-0056` row E2's status (first pull NOT MET; E4a before a second pull), row E4 and D6's order;
  - `ADR-0067` § Consequences item 5 (the order);
  - `ADR-0064` d10 (E4's pointer).
  - **Owed, not edited here:** the `ABC-271` page and `EPIC-011` (BA/PM). The lines are in decision note `…bbc0a213` of
    this task, § 4.

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-04 | Architect/Design | PREREG sealed before any measured run | `arch-ABC-271` `…eeb25cc6`, `029533f0` |
| 2026-11-04 | Architect/Design | Batches A, B read: I1 exact; H holds E1, E2, E4–E6; E3 missed. Addendum before one diagnostic | `…3a9eba86`, `904b3fff` |
| 2026-11-04 | Architect/Design | Batch D: E3's failures classed (c) 44 F; (d) 196 F, 101 P, 15 R (trunc at phase 4 on rank-2 passers). Batches G, F, C, E read. PROPOSED: rule values ship on play, GAIN | `…c9af6d84` (results), `…bbc0a213` (decision) |

## Context

### What `main` is
- `PASSED` (mg / eg by own rank) scores a passer by its rank alone: E1 (`ADR-0064` d3) doubled its endgame half.
- Nothing reads whether a king can catch the passer, whether its path is blocked, or whose king is nearer.
- The pawn memo is keyed exactly by the two pawn masks (`ADR-0064` d5, 448 KiB), so anything that reads a king or a
  piece sits outside it.
- `ABC-239`'s first pull closed NOT MET on F3 and F4. In `zugzwang.001`, the fitted passer eg half charged Black's
  three h-passers alike in both lines, though all three are frozen (h1 holds Black's king, h2 and h3 Black's own
  pawns). No term could tell a frozen passer from a free one.

### The probe (PREREG `…eeb25cc6`, addendum `…3a9eba86`)

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

29.75 % ≥ 5.0 %, so **the intent is GAIN** by the pre-registered rule. NEUTRAL is not open.

**`zugzwang.001` at depth 9** (v(m) = −`search`(after m, 8), White's view; `arch-ABC-239-f3f4` D2's form):

| table, form | v(e1f1) | v(e1e5) | gap | played |
|---|---:|---:|---:|---|
| `main`, BASE | −390 | −419 | +29 | e1f1 |
| `main`, KD / FP / UN | −410 / −355 / −305 | −442 / −442 / −419 | +32 / +87 / +114 | e1f1 |
| **`main`, H** | **−263** | −454 | **+191** | e1f1 |
| `26d06118` (the first pull's fit), BASE | −464 | −445 | −19 | **e1e5** |
| `26d06118`, H | −331 | −481 | +150 | e1f1 |

- E4a widens the margin by which the row is held at depth 9 from 29 cp to 191 cp. On the fitted table it turns the
  failure back to e1f1, by 150 cp.
- The last row is not a fit: hand terms were added onto a table fitted without them. It says that E4a's features
  carry the distinction the first pull lacked, not that a refit keeps it (`UNKNOWN - verify`).

**Reports (decide nothing):**
- Reach at 47 000 nodes: 6.716 → 6.679 (−0.037 ply).
- Drift at depth 5 against BASE: 99.47 % within 25 cp; max 409 (`pawn-race`, an unstoppable passer); 4 root moves
  differ; 0 mate flips.
- `G2` on the endgame report set (six positions chosen by rule from the C2′ games, phases 3–8, with passers):
  1.084 / 1.086 ×.
- **The default lane with H wired in:** 23 reds beside `main`'s one environment red. All are migration, listed in
  decision 6.

## Decision

1. **The three terms. Endgame halves only, each by a stated rule** (`ABC-215`; this project's own, `ADR-0048`).
   - Every middlegame half is 0, so phase 24 is E1 exactly (`ABC-271` P1 (b); E2 0 / 333).
   - Notation: R is the passer's own rank index (1 is its start rank, 6 is one step from promotion). d is the
     Chebyshev distance (king steps). Q is the queening square.
   - **King distance:** eg += `PASSED_KING_ENEMY[R]` × min(d(enemy king, Q), 5) − `PASSED_KING_OWN[R]` ×
     min(d(own king, Q), 5).
     - `PASSED_KING_ENEMY` eg = PASSED.eg[R] / 10 = 0, 1, 2, 4, 7, 12, 20.
     - `PASSED_KING_OWN` eg = floor(PASSED.eg[R] / 20) = 0, 0, 1, 2, 3, 6, 10.
     - The enemy king counts double, because catching the pawn decides more than escorting it. Both distances are
       capped at 5.
     - **Resolution clause (the addendum's restatement):** the term is monotone in each king's capped distance. It
       is strictly monotone in the eg half, and so in `evaluate` at phase 0. At phase w > 0 the blend's trunc may
       drop a step worth less than 24 / (24 − w) cp, which is the rank-2 step of 1 cp at phase 4. That is a
       property of any small endgame-only term under `ADR-0064` d2's trunc, not of these values. No value moves.
     - **The target is the queening square, not the stop square.** The brief wrote "the stop square"; the ticket's
       scope 1 and P1 (d) name the queening square. The queening square is taken: the rule of the square reads the
       same square, and on the seventh rank the two are the same square. Both readings are named here, not picked
       silently.
   - **Free path:** eg += `PASSED_FREE[R]` = PASSED.eg[R] / 2 = 0, 5, 10, 20, 35, 60, 100.
     - It applies when every square ahead of the passer, up to and including Q, is empty. Any piece of either colour
       blocks, and a king on the path is a blocker.
     - Attacked squares are not read: that needs an attack map, which the evaluation does not build.
   - **The unstoppable passer (the rule of the square):**
     - It applies at phase 0 only, to a passer with a free path, when moves < d(defending king, Q) − (1 if the
       defender is to move). moves = 5 from the start rank (the double step), else 7 − R.
     - **U = 400**, once per side, however many unstoppable passers the side has. The rule: Q − (P + PASSED.eg[6] +
       PASSED_FREE.eg[6] + 5 × PASSED_KING_ENEMY.eg[6]) = 900 − 500. So a pawn's whole score while unstoppable stays
       at most a queen's.
     - When both sides have one, they cancel, and the race is the search's.
   - The values live in `src/evaluate-params.ts` as `{ mg, eg }` pairs in the file's present shape: three by-rank
     arrays and one scalar, each with its rule in the comment. `tools/tune` reads and writes them unchanged.
     - A data row pins every E4a middlegame half at 0.
2. **Which passers count, and where.**
   - `pawnStructure` also records, per side, the **frontmost passer of each file** as a 24-bit word (3 bits a file:
     the board rank, 0 for none). The memo stores the two words beside its three parts. A hit still returns what a
     miss computes.
   - A rear passer of a doubled pair is not read by E4a. Its path is blocked by its own pawn, and its king distances
     would count the file twice.
   - **The memo grows from 448 to 576 KiB** (2^14 × 36 bytes). `NFR-009`: +128 KiB, under the 1 MiB growth line and
     far under 16 MiB.
   - **After the walk, when w < D and a passer exists**, one loop over the eight files reads the two words, the two
     king squares (already found by the walk), the board squares ahead of each passer, and the side to move. It adds
     its sum to Δ only.
     - At w = D the loop is skipped. That is value-identical while every E4a middlegame half is 0.
     - The phase stays the recursion's argument (cut C1), and the unstoppable rule reads phase = 0.
3. **Cost per leaf (`G2`).**
   - A memo hit adds two typed-array reads. A position with no passer, or at phase 24, pays one compare.
   - A position with passers pays, per passer, two distances and a walk of at most six squares.
   - **Measured on QE's six roots:** R = 1.0269 (bar 1.05). The endgame report set reads about 1.085 ×. Those
     positions are where the term acts; the bar's roots are mostly at phase 24.
   - **F5's single value-identical cost cut, named now:** the two distances from a 128 × 128 `Int8Array`
     (16 KiB, `NFR-009`), and the loop entered only for files with a set field (bit-scan of the words).
4. **One switch and a door pair** (`ADR-0026` d10's pattern, by reference to `ADR-0064` d7).
   - One switch, `passerKings`, in `src/search.ts`'s `Switches` and `src/engine.ts`'s `Heuristics`. It is on in
     `search()` and `chooseMove` only, and it is never module state.
   - Three TEST-ONLY exports:
     - `evaluateWithoutPasserKings(position)`: `main`'s `evaluate`, `Object.is`;
     - `searchWithoutPasserKings` and `chooseMoveWithoutPasserKings`: node for node the pre-ticket paths.
   - **Every older door turns it off** (the ladder rule). Rows follow `ADR-0064` d7 by reference. **No zugzwang
     depth is re-pinned.**
   - **One test-only seam, `passerTermsForTest(position)`,** returns each side's three eg parts. It follows the
     `kingExposureForTest` precedent and is called only from test files.
5. **The bars of `ABC-271`, pre-registered** (fixed here; not loosened after Ready):
   - **P0, node identity with this design.** If `main`'s `src/` moves before the build, the Engineer applies
     `patch_e4a.py`'s rules to the new base, re-reads the counts and puts both in the PR. A re-derived count is a
     dated line here, never a moved bar.
     - `chooseMove`, frozen clock: kiwipete d8 / d9 **776 478 / 1 696 188**; position-6 d8 / d9 / d10
       **87 548 / 253 904 / 534 281**.
     - `search()` d8: **551 487 / 406 807**.
     - The doors read `main`'s: 766 275 / 1 725 150; 87 475 / 253 724 / 533 916; 605 117 / 406 787.
   - **P1, relations (default lane, no search).** The fixture conditions are the addendum's restatement. QE freezes
     the positions before the build.
     - **(a)** The mirror, `Object.is`: `G3` + `TAPER_MIRROR_POSITIONS` + ≥ 10 new passer positions, 0 mismatches.
     - **(b)** Phase 24 equals E1 (`evaluateWithoutPasserKings`), exactly, on every full-material position.
     - **(c)** The square. Twins share the defending king's endgame table cell, its reach, and its exposure (both
       halves, `kingExposureForTest`). Then outside − inside ≥ U = 400 from the passer's side.
       - Without the exposure condition the bar is not met by construction: −35 cp on rim twins.
     - **(d)** King distance:
       - pairs at phase 0;
       - the farther distance ≤ 5, and the same unstoppable status;
       - both defending-king squares off the passer's path;
       - the same table cell, reach and exposure.
       - Then the passer side is strictly lower with the king nearer.
     - **(e)** Free path, read through `passerTermsForTest`: the free part is non-zero only when the path is empty.
   - **P2, the mate floor:** door d4 → head d5, and d5 → d5, on the 287: **0 violations** each (probe 0 / 0).
   - **P3, zugzwang:** **7 / 7** at recorded depths (probe 7 / 7, with `zugzwang.001` held by 191 cp).
   - **P4, `G1`:** **≥ 54 / 58**, none newly missed (probe 54 / 58).
   - **P5:** `ADR-0061`'s cut audit on this scale: ≤ 0.5 % flips, 0 flips of ≥ 200 cp (QE).
   - **P6, `G2`:** ≤ **1.05 ×** `main`'s `evaluateAtPhase` per call, in `ABC-274` A5's form (QE). The endgame set is
     reported beside it.
   - **P7, `G6`** (by `Q-3K-4` (b)): every run ≥ depth 6, depth 7 a WARN; medians reported.
   - **P8, the read:** C2′ 100 games at 100 ms, **GAIN ≥ 50.0 of 100** (the firing figure, 29.75 %, rules out
     NEUTRAL); S′ at the E in force; the Levels deep lane. A miss is NOT MET and not re-played.
6. **Migration** (the probe's batch E, 23 reds; `ADR-0064` d7 and `ADR-0028` d2 by reference; old → new in the PR):
   - **Pins, re-pinned:**
     - the memo byte rows, 458 752 → 589 824, in `evaluate.pawns.test.ts` (cut 5) and `transposition.test.ts` (A7);
     - `engine.test.ts` `ABC-249`, 441 → 447.
   - **Re-pointed to the new door:**
     - `ABC-270` K1 (b)'s three value-identity rows (a value-identical ticket's rows read the door);
     - `ABC-269` B1 (e)'s nine phase-18 rows. They are E1's passer rule, so they read the door;
     - `ABC-274` A3's five formula rows. A3's oracle is the blend of the table's terms, so it reads the door, or it
       adds `passerTermsForTest`'s part to its expected value.
   - **Fixture properties re-found:**
     - `ABC-083` A8's two isolation rows. Their pawn-ending fixtures now hold an unstoppable passer on one side:
       317 against 693. Re-found at a phase > 0, or with the passer stopped, then checked red with the term zeroed.
     - `ABC-269` B1 (a)'s −0 trap `M-negzero-b`. Its "evaluates to exactly 0" check now reads E4a's part at phase 21;
       a new trap with no passer is found. The mirror row itself is green.
7. **The order: `ABC-271` (these values, on its own read) → the second pull.**
   - The second pull is a new attempt under `ADR-0067` F6 with its own PREREG, on a `main` with E4a.
   - It frees the eg halves of `PASSED_KING_ENEMY`, `PASSED_KING_OWN` and `PASSED_FREE` (eg ≥ 0, mg held at 0). It
     holds `PASSED_UNSTOPPABLE` as a rule (`ADR-0067` § Consequences 5).
   - The margin-aware bound form (`…69f22167` § 2) stays the owner's word, then.
   - If P8 misses: E4a's structure is re-offered at 0, value-identical (`ADR-0068`'s form), as the second pull's
     base. That is this ADR's F6, not a re-play.

## Alternatives

- **Structure only, at 0, value-identical, no games (`ADR-0068` form; the PREREG's choice rule 4).** Not taken.
  - It is cheaper now: about 0.2 h of host time against about 0.9 h.
  - But E4a's value then arrives only if a second pull passes F6. That pull needs the owner's word on the bound form,
    plus B-T7 (about 0.7 h) and B-T8 (about 5 h). The first pull of that design missed.
  - The hand values pass every play-safety row that killed `ADR-0068`'s rule values. On `zugzwang.001` they widen
    the very margin the first pull broke.
  - **This is the fallback if the Orchestrator rules that E3's pre-registered miss bars choice rule 1.** The design
    is then decisions 1–2 at 0, with no switch and no doors, and K0–K4 in `ADR-0068` d6's form.
- **The stop square as the king-distance target** (the brief's wording; Stockfish's classical form). It needs a
  second target square beside the rule of the square's, and P1 (d) names the queening square.
- **One centred king-distance weight on (enemy − own).** Not taken: one feature per rank where the tuner can use two.
- **Every passer, not the frontmost per file.** Not taken: the rear one is always blocked, and the file counts twice.
  The memo would need a 48-bit mask per side.
- **A safe path (attacked squares).** Not taken: it needs an attack map pass per call. That is E4b's or the tuner's
  question.
- **An unstoppable value by rank, or a race model.** Not taken: more rule than the evidence carries. The search reads
  the race.
- **Computing passers again outside the memo.** Not taken: it re-runs `isPassedPawn` per pawn per call.
- **Larger rank-2 king weights, so that (d) holds at phase 4.** Not open: that is a value tuned to pass (the
  PREREG's rule 2). The relation's domain is restated instead.
- **Re-tuning a bar, re-pinning a zugzwang depth, or moving the mate floor.** Not open (`ADR-0064` F4, `ABC-271` F3).

## What would falsify this

| # | clause | what would falsify it | if it fires |
|---|---|---|---|
| F1 | 1, 2, 4 as built | P0's counts not reproduced; a mirror, phase-24 or door mismatch | a defect, fixed before any other bar |
| F2 | 1, the rules | P1 (c)–(e) missed on fixtures that meet decision 5's conditions | STOP to Architect/Design; no value tuned to pass |
| F3 | play safety | P2–P4 red | defect check; if real, NOT MET and this ADR re-opens; no deeper re-pin |
| F4 | `ADR-0061` coupling | P5 above its bars | `ADR-0061`'s margins re-read before merge |
| F5 | 3, cheap | P6 > 1.05 ×, or a P7 run below depth 6 | decision 3's single value-identical cut, then one new reading; a second miss: not merged |
| F6 | 7, the strength premise | P8 NOT MET | not merged; the structure at 0 is re-offered for the second pull (`ADR-0068` form); E4a's values then come only from the tuner |

## Consequences

- **Host time.**
  - `ABC-271`: about 0.9 h (C2′ about 0.4 h, measured at 23 min 50 s for 100 games; S′ about 10 min; the Levels lane
    about 9 min; `G2`, `G6` and the cut audit about 0.2 h). That is about 0.7 h more than the structure route.
  - What it buys: E4a's value read on its own, with no dependence on the second pull. P(pass | +20 Elo) = 0.79,
    P(pass | 0) = 0.5 (`ADR-0056` C2′'s table). The slice's +10–30 is BA/PM's estimate, not a reading.
- **For the second pull:**
  - Its base is wider on the row that failed: `zugzwang.001`'s depth-9 margin is 191 cp on `main` with E4a.
  - The tuner gets the feature class that F4 lacked. Whether a fit keeps e1f1 is `UNKNOWN - verify`.
  - The 26d06118-plus-H reading (+150) is not a fit.
- **NFRs:**
  - `NFR-009`: the memo is +128 KiB (576 KiB); if F5's cut is taken, +16 KiB more. The sum stays far under 16 MiB.
  - `NFR-001` / `G2`: P6. `NFR-005`: P7. `NFR-008`: P1 rows are units with no search.
  - Security: none. No new NFR file; `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`) and licence (`ADR-0048`):** unchanged. The terms are integer and mirror-exact, and the
  rules are this project's own. The rule of the square is classical chess knowledge.
- **File collisions:** `src/evaluate.ts` and `src/evaluate-params.ts`, with `ABC-272` and the second pull. One at a
  time.
- **Risk:** the endgame cost of about 8.5 % per call where passers exist. `G2`'s roots under-sample it, and `G6` reads
  middlegame boards. QE reports the endgame set; F5's cut is named.

## Rollback

- **Before acceptance:** mark this ADR `withdrawn`, and strike the dated lines in `ADR-0056`, `ADR-0067` and
  `ADR-0064`.
- **After the build merges:** revert the one commit. The doors make it local. If a tuned set has merged on top, revert
  that first (`ADR-0067` § Rollback).
