---
kind: adr
id: ADR-0067
---
# ADR-0067: The evaluation's weights are tuned offline by a logistic fit of game results against the two-half evaluation. The loss is cross-entropy, K is fixed first, and Newton steps run on a traced linear model. At the first pull material stays frozen and the free set is bounded and sign-bounded. The tool lives under `tools/tune/` and writes only `src/evaluate-params.ts`. A value-identical blend of every half lands first

## Status

**ACCEPTED 2026-11-03 by the owner. IN FORCE as the method** for `ABC-239` and every later pull. Recorded by
Architect/Design (task `arch-owner-answers-1103`, records only, on `grugops/arch-owner-answers-1103` from `main`
`dc7dc15d`). Nothing was run except a data-size probe (HTTP headers and the export's index files, under the host lock).
- **His words, verbatim** (`orch-2026-10-30a` `…af126c04`): *"1. yes ; 2. yes ; 3. no ; 4. no ; 5. ok yes ; 6. yes ;
  7. yes; 8. yes"*. Item 1 is this ADR. Items 2–5 touch it:
  - **Q-3K-7 (a): yes.** The tuner may train on the public-domain (CC0) Lichess database export, beside own self-play.
    Decision 9's Lichess block is now live, pinned by **§ Addendum 2026-11-03: the Lichess data pin**.
  - **Q-3K-7 (b): no.** No Stockfish-labelled position is ever a training target. § Alternatives' "not used" is now
    his rule, not only a recommendation.
  - **Q-3K-7 (c): no.** Our games against Stockfish are never training data. They stay the outside measure (S′,
    B-T8, C4's anchors).
  - **B-T8: approved** ("5. ok yes"): the 200 + 200 outside pair (about 5 h) runs before `ABC-239` merges. Its bar
    is unchanged.
  - Item 8 (`ABC-270`'s design may start now) is read in § Consequences' dated line.
- **E2-pre is in force on `main`:** `ABC-274` merged at **`2410d4f7`** (2026-11-03T20:07:05Z) on `qe-ABC-274`'s
  PASS_WITH_GAPS (`…fa87f74d`), which signs UAT under the owner's delegation. QE read `G2` at **0.9897 ×** (sessions
  0.9797 / 0.9997, controls valid), `G6` depth 9 / 10 equal to base, and 0 mismatches over A1's 9 120 and A2's
  4 840 290 rows (the Orchestrator's board line). F8 did not fire. So `ABC-239`'s A3 and A4 hold as written.
- **What is still not his yes:** nothing in this ADR waits on him now. `ABC-239`'s build, its fit and its reads go
  ahead under decisions 1–11, the addendum and B-T0–B-T8.
- *Dated 2026-11-03 (`arch-owner-answers-1103b`, records only, at `main` `0bf243df`; his word `…401c3d09`, verbatim
  "yes, accept ADR-0068 and ADR-0069"):* **`ADR-0068` (E3a, `ABC-270`) and `ADR-0069` (Q1) are accepted.** The lines
  `ADR-0068` d8 owes are written here: d4 / d5 and d6 (dated lines), B-T4's re-pin rule and B-T5's risk (under the bars
  table), and § Consequences item 4's order. Decision 9's list number is restored. **No bar moves.**

*Before acceptance:* **PROPOSED 2026-11-03.** Recorded by Architect/Design (task `arch-ABC-239`, on `grugops/arch-ABC-239` from `main`
`af15cbc9`). **Acceptance is the owner's:** this is a new ADR (`memory-bank/45-standing-rulings.md`, 2026-10-22).
`ADR-0056` (accepted in direction) lists E2. That covers the direction, not this text.

- **This is `EPIC-011` row E2, `ABC-239`'s method ADR.** It is `ADR-0056` D2's "largest single eval lever", and
  `ADR-0064` d4 names it the owner of `src/evaluate-params.ts`'s provenance line.
- **A prototype ran under the width cap.** It used a scratch copy of E1 as built (`grugops/ABC-269` `b7a8fc3a`, `src/`
  tree `4e23078f`), outside the repository, under the host lock. About 1 min of host time. Nothing was committed to
  `src/` or `tools/`. Scripts and outputs are under `.grugops/context/arch-ABC-239/raw/proto/`.
  - The PREREG `…9ed1db11` was sealed and committed (`ed922f3e`) before any measured run.
  - Two inner-split diagnostic addenda were each sealed before their own run: `…255e9bcf` (`acc97083`) and `…f8d36d73`
    (`a2bbdee0`).
- **The prototype's verdict, by its rule: "the loss moves on own games".**
  - G-P1 holds: 0 misses of 254 485 positions, worst 0.958 cp.
  - G-P2 holds: K = 0.585.
  - G-P3 holds: the chosen configuration's rounded set reads **0.9863 ×** E1's outer-validation cross-entropy (bar
    ≤ 0.995 ×).
- **The unconstrained fit is not safe to play, and this ADR is built around that.**
  - The fitted material is queen 2 593 / 137 (mg / eg) and knight 572 / 246. A minor is worth less than three pawns in
    the endgame half, and four sign relations break.
  - The diagnostics place the cause in the data, not in the loss. Squared error makes the queen worse (3 470 / −237).
  - With material frozen and sign bounds, the move left is **0.9960 ×** (inner split).
  - So the method and the pipeline are settled. Own self-play games alone can carry only a small, bounded first pull.
    Broader data is the owner's question, Q-3K-7 (§ Consequences, and decision `…e4c34239` § 4).
- **What this ADR does not settle:** the data answer (his), and whether the general blend becomes its own ticket
  (BA/PM; recommended below).
- **The answer that settles it:** *"accept ADR-0067"*, or *"decline it"*, with Q-3K-7 answered beside it.
- **Reading (b), the `ADR-0064` precedent:** the build (E2-pre, then the tool) may start while this ADR is PROPOSED.
  The 100-game read and the merge wait for acceptance.
- **Default without an answer:** `main` keeps E1's rule-made table.
- *Dated 2026-11-03 (`arch-fold-1103b`, records only, at `main` `239ac715`):* the general blend is its own ticket,
  **`ABC-274` (E2-pre)**, cut by BA/PM (`bapm-E2pre-cut` `…a193625d`). Its falsifier is **F8**. The Orchestrator's
  ruling `…690d3b30` is folded at decision 8. The owner items stay **pending**: acceptance of this ADR, Q-3K-7
  (a) / (b) / (c), and B-T8.

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-03 | Architect/Design | PREREG of the prototype sealed before any measured run | `arch-ABC-239` `…9ed1db11`, `ed922f3e` |
| 2026-11-03 | Architect/Design | Prototype run. G-P1, G-P2 and G-P3 hold, and the fitted material is implausible | `…48ae6a93` |
| 2026-11-03 | Architect/Design | Addendum: D1–D3 on the inner split, sealed before running. The loss hypothesis is falsified | `…255e9bcf`, `acc97083` |
| 2026-11-03 | Architect/Design | Addendum 2: D4 (bounded), sealed before running, the last diagnostic | `…f8d36d73`, `a2bbdee0` |
| 2026-11-03 | Architect/Design | PROPOSED | `…e4c34239` |
| 2026-11-03 | BA/PM | E2-pre cut as `ABC-274` (S, P2) | `bapm-E2pre-cut` `…a193625d` |
| 2026-11-03 | Orchestrator | `ABC-274` exempt from S2 nps (reported only); `G2` ≤ 1.05 × and `G6` "≥ base" graded | `orch-2026-10-30a` `…690d3b30` |
| 2026-11-03 | Architect/Design | F8 written (E2-pre's falsifier and disposition). `ADR-0064` F3's cut C1 read against d8: the packed form stays recommended | `arch-fold-1103b` |
| 2026-11-03 | Architect/Design | `ABC-269` merged (`54dee3f2`), so A5's base exists. A5's PREREG content written ahead (`QE-269-f` / `-g`); no bar moved | `arch-post-269` `…3f30baf8` |
| 2026-11-03 | Architect/Design | `ABC-274`'s A3 seam `withParametersForTest` accepted with S1–S3 (one test-only repair). `ABC-239` does not reuse it. A3's rule suffices, so QE freezes no rows (Q1–Q4); no bar moved | `arch-ABC-274-seam` `…3169a174` |
| 2026-11-03 | Owner | **ACCEPTED.** Q-3K-7 (a) yes, (b) no, (c) no; B-T8 approved | `orch-2026-10-30a` `…af126c04` |
| 2026-11-03 | Orchestrator | `ABC-274` (E2-pre) merged; F8 did not fire | `2410d4f7`; QE `…fa87f74d` |
| 2026-11-03 | Architect/Design | ACCEPTED / IN FORCE line. § Addendum: the Lichess data pin (2017-03 export, ≤ 1 M positions, own share 0.5 of the loss). B-T0–B-T8 and F1–F7 re-read; no bar moved | `arch-owner-answers-1103` |
| 2026-11-03 | Owner | `ADR-0068` and `ADR-0069` accepted: `ABC-270` lands as structure before the fit; Q1 merges or misses before `ABC-239`'s B-T7 / B-T8 freeze | `orch-2026-10-30a` `…401c3d09` |
| 2026-11-03 | Architect/Design | `ADR-0068`'s owed lines: d4 / d5 tracer, d6 free set (queen-on mg ≥ 0, eg 0), B-T4 re-pin rule, B-T5 risk, Consequences order. Decision 9's number restored; no bar moved | `arch-owner-answers-1103b` |

## Context

### What the tuner acts on
- E1 (`ADR-0064`, accepted, not in force until `ABC-269` merges) holds every term as an mg / eg pair in the data-only
  `src/evaluate-params.ts`, about 800 numbers.
- **`src/evaluate.ts` blends only the terms whose halves differ** (`ADR-0064` d6: the king's square table and the
  passed pawns). A tuned set makes every half differ, so the evaluation has to blend every term. `ADR-0064` d6 names
  this "the two-accumulator form … E2's", with cost read by `G2` and `G6`.
- **That is a logic change in `src/`.** `ABC-239` A3 says "`src/` gains constants only" and A4 says `G2` ≤ 1.02 ×
  "(only constants change)". Both hold only if the general blend lands first, at E1's values (decision 8).

### Why hand weights are not tried again
- `ABC-207`'s hand mobility weights lost (−18.3 ± 16.5).
- `ABC-205` died on `G6` cost before play was read.
- Every table on `main` is made by a stated rule, never fitted (`ABC-215`).
- The evaluation probe's persistent errors survive two doublings of search (`arch-next-pull` `…d0f1a5fc`; 25 of 38 on
  unique positions, `bapm-epic011-cut` `…0fd882f7`). E1 fixes 1 of those 25.

### The data that exists today (A1: own games, allowed by default)
- **88 PGN files tracked at `main`** hold 5 438 games.
  - Excluded by rule: 1 399 games with another player (Stockfish reads, the owner's UAT game) and 608 exact
    duplicates (bapm's n / n + 200 replays).
  - That leaves **3 431 unique self-play games from 17 files, starting from 100 openings.** The openings come from the
    CC0 book (`ADR-0023`, `tools/rating/openings.ts`).
- **Positions.** 388 632 positions were seen. The filters removed:
  - 6 509 book positions;
  - 15 232 under a mate score;
  - 28 181 in check;
  - 84 225 noisy ones, where quiescence differs from the static score.

  **254 485 rows are kept.** By position key that is 153 165 unique training positions and 39 568 validation
  positions, from 19 held-out openings. 1 412 validation keys were removed because they also occur in training.
- **Of the rows, 40 % come from openings 1–50,** the openings C2′ plays. See Consequences.

### The prototype (PREREG `…9ed1db11`; results `…48ae6a93`)

| reading | figure |
|---|---|
| G-P1 identity, model at E1's values against the engine's `evaluate` | 0 misses of 254 485; worst 0.958 cp (the blend's trunc) |
| K (cross-entropy, E1's values, training set) | 0.585 (G-P2: 0.3–3.0) |
| inner choice: C-S (46 free) / C-F (402 free, best λ = 1e-7) / E1 | 0.58667 / 0.58748 / 0.59206 → **C-S** by the rule |
| outer validation cross-entropy: E1 / `main` untapered / C-S / C-F | 0.59153 / 0.59636 (1.0082 ×) / **0.58342 (0.9863 ×)** / 0.58372 (0.9868 ×) |
| outer validation squared error, C-S against E1 | 0.9711 × |
| overfit gap, C-S | training 0.9880 ×, validation 0.9863 ×: none |
| re-run of the fit | byte-identical output (timing fields aside) |
| host time | extract 8.5 s, fit 18 s |

- **The fitted values (C-S, rounded), mg / eg:**
  - pawn 103 / 114, knight 572 / 246, bishop 610 / 231, rook 905 / 360, **queen 2 593 / 137**;
  - passed bonus by rank, mg: 9 12 −25 26 106 208;
  - missing shelter 35 / −29, half-open file 29 / −16;
  - the king's tables scaled by about 3.4 × (mg) and 2.2 × (eg).
  - Relations broken: a minor ≤ 3 pawns (eg), passed mg not monotone, two endgame king penalties below 0.
- **Diagnostics** (inner split only; the outer validation was never read by a design choice):

  | run | loss | material | inner CE / MSE against E1 | sign relations broken |
  |---|---|---|---|---|
  | D1 | squared error | free | 0.9882 / 0.9790 | queen 3 470 / −237; 9 breaks |
  | D2 | cross-entropy | frozen | 0.9952 / 0.9941 | 7 breaks (doubled, open file, mobility eg below 0, …) |
  | D3 | squared error | frozen | 0.9944 / 0.9879 | 6 breaks |
  | D4 | cross-entropy | frozen, sign-bounded | **0.9960 / 0.9955** | passed mg r3 < r2 only (monotonicity not enforced) |

- **Readings:**
  1. **The loss is not the cause.** Damping decided positions (squared error) inflates the queen further.
  2. **The cause is the data.** In weak, short-control self-play, a queen up in the middlegame nearly always wins and
     a pawn or two often draws (49 % of the games and 51 % of the rows are draws; K = 0.585 is flat). The fit learns this engine's conversion odds against
     itself, not the values a search needs to compare trades.
  3. **Bounded, the own-games move is small:** 0.4 % of loss.
  4. **One signal is robust across every fit.** The king's square tables are under-weighted against the rules, by
     about 3–3.5 × in mg and 2.2–2.8 × in eg (C-S, D4). This matches `ABC-270`'s premise (E3a). It is information, not
     a bar.

## Decision

1. **Method: a logistic fit of game results against the static evaluation** (Texel's method, CPW).
   - Each kept position is labelled with its game's result from White's side (1, ½, 0).
   - The prediction is σ(e) = 1 / (1 + 10^(−K·e/400)), where e is the evaluation from White's side.
   - No outside engine labels anything (§ Alternatives).
2. **Loss: mean cross-entropy, with squared error reported beside it.**
   - With K fixed and the evaluation linear in its weights, cross-entropy is convex. The optimum is then unique, so the
     result does not depend on the start or on the optimiser's path.
   - D1 showed that squared error does not cure the data's pull.
3. **K: fitted once per pull, then fixed.**
   - It is fitted by golden section on [0.1, 5] (60 steps), minimising the loss of the *base* values on the training set.
   - It is recorded in the provenance header. Fixing it anchors the centipawn scale.
4. **Optimiser: Newton steps on a traced linear model.**
   - The tool traces every position once into white-minus-black counts per term, the mobility count and the phase w.
   - The evaluation is (w/24)·(c·θ_mg + clamp(W_mg·m)) + ((24 − w)/24)·(c·θ_eg + clamp(W_eg·m)).
   - Gradient and Hessian are exact for the linear part, and the mobility clamp is handled by its active set.
   - Each step has a backtracking line search, then a projection onto the bounds (decision 6). It stops at a relative
     change < 1e-9 or after 50 steps.
   - Full batch, single thread, fixed order, no random number generator.
   - **A new term (E3–E7) must be traceable:** linear in its weights, or multiplied by a per-position constant that the
     tracer applies (a scale factor such as `ABC-272`'s). Otherwise its ADR says how it is fitted.
5. **The identity gate (the tracer stays honest).**
   - The tracer lives in `tools/tune/` and re-implements the term counts. `src/` gains no tracing code (A3).
   - **Before any fit,** on every position of the data set, |model(current values) − `evaluate`| < 1 cp, and the two are
     exactly equal where w = 24 (or where the general blend makes them so). One miss aborts the run.
   - Every PR that adds or changes a term extends the tracer, so the gate passes on that PR's head.
   - *Dated 2026-11-03 (`arch-owner-answers-1103b`; `ADR-0068` accepted, its d1–d3 and d8): **the tracer traces
     `ABC-270`'s three queen-on features.***
     - **The features:** per king, each of the three exposure counts (shelter files missing, half-open files, open
       files), counted only while the enemy has at least one queen. They are taken white minus black and enter both
       halves by w, as the base exposure terms do. They are linear in `KING_SHELTER_MISSING_QUEEN`,
       `KING_FILE_HALF_OPEN_QUEEN` and `KING_FILE_OPEN_QUEEN`, so d4's Newton model fits them unchanged.
     - **The identity gate covers them, but B-T1 alone cannot see them:** at the base values the three pairs are 0.
       Two checks close that gap. Neither is a bar, and neither moves one:
       1. **A tracer row, added to decision 10's test list:** on the positions `ABC-270` K1 (c) froze (at least 6
          pairs that differ only by the enemy queen), each queen-on count equals the matching base count when the
          enemy has a queen, and is 0 when it has none.
       2. **The gate runs once more on the emitted file** (its current values are now the fitted ones, so the queen-on
          mg halves may be non-zero). A miss is F1, a defect.
     - If `ABC-270` has not merged at fit time, the features are absent and the fit runs without them (`ADR-0068`
       § Status).
6. **The free set at the first pull: bounded.**
   - **Material is frozen** at the classical scale (P 100, N 325, B 325, R 500, Q 900, both halves). The king is 0.
     `PHASE_WEIGHT`, `PHASE_MG` / `PHASE_EG` and `MOBILITY_CAP` (100) are fixed.
   - **Free:** passed pawns by rank, doubled, isolated, the three king-file terms, the mobility weight (each mg / eg),
     and the PSTs. The PSTs are either one scale per table per half (C-S, 36 free with material frozen) or the cells,
     tied left-right, with an L2 pull toward the rule-made values (C-F).
   - **Which of C-S and C-F:** the prototype's rule, re-run on the build's own data. The lower inner-validation loss
     wins; a difference under 0.1 % relative goes to C-S. λ comes from {1e-8, 1e-7, 1e-6} on inner-validation.
   - **Sign bounds, from the relation tests in `src/evaluate*.test.ts`:**
     - every penalty is ≥ 0, in both halves;
     - the mobility weight is ≥ 0, in both halves;
     - every passed bonus is ≥ 0;
     - every PST scale (C-S) is ≥ 0.
   - **If an emitted set turns a relation test red,** that relation becomes a bound and the fit runs once more. This
     rule is stated here, before any build. **No test bar is edited by the tuner ticket.** The one exception is
     `ABC-215` A2's rebuild-from-rule rows. They retire for tuned values by design, and a provenance row replaces them:
     each tuned array equals the tool's output for the recorded data hash.
   - **Material moves only at a later pull,** on broader data, inside a box of ± 25 % of the classical value and with a
     minor > 3 pawns in each half. That pull needs its own pre-registration.
   - *Dated 2026-11-03 (`arch-owner-answers-1103b`; `ADR-0068` accepted, its d8): **the free set gains `ABC-270`'s
     three queen-on exposure pairs.***
     - **mg: free and ≥ 0** (the penalty sign bound above).
     - **eg: held at 0 at the first pull.** `arch-ABC-270`'s D5 fitted half-open-with-queen at eg 140 on own games.
       That is the same data pathology as the queen at 2 593. It is freed only at a later pull, under its own
       pre-registration.
     - The three base exposure pairs stay free in both halves, as written above.
     - The pairs count only if `ABC-270` has merged at fit time.
7. **Integer emission and provenance.**
   - Values are rounded half away from zero, and the reported loss is the rounded set's.
   - `tools/tune` writes `src/evaluate-params.ts` in its present shape, mg / eg arrays and the same exports, and
     nothing else.
   - **Header:** "tuned by `tools/tune` (`ADR-0067`)", plus the data manifest's sha256 (over repository-relative paths
     and file hashes), the split strings, K, the configuration, λ, positions / games / openings, validation loss base
     → fit, and the tool's commit.
   - Each table's rule comment stays as "start (prior): <rule>".
   - **The same inputs on the same Node major give a byte-identical file.** The prototype re-run was identical.
8. **The general blend lands first, value-identical: "E2-pre".**
   - In `src/evaluate.ts`, every term enters the blend: mg + trunc(Δ × (D − w) / D), with Δ = eg − mg summed over all
     terms. That is `ADR-0064` d2's delta form, unchanged.
   - **At E1's values it is the same number, bit for bit.** So it is node-identical to `ABC-269`'s head, and
     `ADR-0064` B0's counts carry over exactly.
   - **The recommended form is a packed score:** one int32 per table entry, eg in the high 16 bits and mg in the low.
     It reads each PST once, so the cost stays near E1's. That is the cost cut `ADR-0064` F3 names.
   - **Bars:**
     - node identity (B0's rows);
     - `G3` mirror `Object.is`;
     - `evaluate` equal to the pre-ticket `evaluate` on the frozen corpus;
     - `G2` ≤ **1.05 ×** per call (`ADR-0064` B6's level);
     - `G6` "≥ base", as for any value-identical ticket (`ADR-0056`'s dated `Q-3K-4` line).
   - **No games:** a value-identical ticket keeps its S2 reading (C2′). Recommended as its own small ticket (size S),
     cut by BA/PM. Then `ABC-239`'s A3 and A4 hold as written.
   - *Dated 2026-11-03 (`arch-fold-1103b`): E2-pre is `ABC-274`. The bars are graded as the Orchestrator ruled
     (`…690d3b30`). C1 leaves the recommended form unchanged. F8 holds the disposition.*
     - **Graded:** node identity (A1), the same evaluation (A2), `G3` (A4), `G2` ≤ 1.05 × (A5), and `G6` "≥ base"
       (A6): each board's median depth ≥ the pre-ticket head's, and every run at depth ≥ 6. `Q-3K-4` (b) does not apply,
       because no value changes.
     - **Not graded:** S2 nps, which is reported only. `ABC-274` is exempt from S2, as `ABC-265` was. "No games" above
       is unchanged. Its words "keeps its S2 reading" are superseded for this ticket only.
     - **The `G2` base is the pre-ticket head,** `main` with `ABC-269` merged, cut C1 included (the ticket page's
       definition). The instrument has `arch-ABC-269-F3`'s PREREG `…e36ee7ca` shape. Both arms are each build's shipped
       tapered entry, called `ev(position, phase)` with the phase computed once per root before timing, plus a
       pre-ticket-head copy as the noise control. The ratio against `main`'s pre-E1 tree `58fa3eb4` is reported beside
       it, not graded. It shows the cost E1 and E2-pre add together.
     - **F3's cut was not the packed score.** `ADR-0064` F3's one cut on `ABC-269` is C1, an incremental **phase**
       carried by the search's recursion (`arch-ABC-269-F3` `…a0468a78`). The sentence above, "That is the cost cut
       `ADR-0064` F3 names", is history. The packed score is E2-pre's own form, not anyone's spent cut. Three
       consequences follow:
       1. **`ABC-274`'s scope stays whole.** BA/PM's coupling clause ("if F3's cut is the packed score, part of scope 2
          lands in `ABC-269`") does not fire.
       2. **The packed score stays the recommended form, and F3's evidence makes the reason stronger.** On `ABC-269`,
          one extra per-piece operation in the walk (the phase add) cost about 7 % per call. The uncut build read
          1.067–1.112 in five sessions, against v2's 1.0032 (`se-ABC-269` `g2-variants.txt`; `arch-ABC-269-F3`
          `…a0468a78`). That is above 1.05 ×. An unpacked delta form puts the same kind of
          operation back in the walk for every piece: a second table read and add. So it is forecast to miss A5. A
          packed table entry keeps one read and one add per piece, which is `main`'s count. The variants v8 / v9 that
          read 1.07 packed the **phase** into the mobility sum. That is still a separate per-piece operation, so they
          are not a reading of a packed table entry. The packed form's cost is **`UNKNOWN - verify`**, and A5 reads it.
       3. **The form keeps C1 intact.** The phase stays an argument, and no phase add returns to the walk (C1's P5
          guard stays green). Once the king's table is packed, the king's Δ can come from the packed sum instead of
          the read after the walk. That choice is the Engineer's, inside A1 / A2.
     - **A condition on the packed form: a range row.** One test row bounds Σ mg and Σ eg (white minus black) inside
       int16, computed from `src/evaluate-params.ts`'s own maxima. Mobility sits outside the packed sum unless the
       Engineer shows it fits. The row exists so that a later table that would overflow (`ABC-239`'s emitted set)
       turns it red instead of silently giving wrong values. It reads the table, so it moves no expectation (A7). It is
       owed to the ticket page as a fold line (BA/PM).
   - *Dated 2026-11-03 (`arch-post-269`, records only, at `main` `128e3c6c`; `qe-ABC-269` `QE-269-f` LOW and
     `QE-269-g` INFO, `…9ba289c2`): **what A5's PREREG says before the reading.** The bar stays **≤ 1.0500**, and no
     bar, session count or statistic moves.*
     - **Why.** `ABC-269`'s `G2` met at R = 1.0373 by 0.0127. Session 2 alone read 1.0560. Between the two sessions r
       moved 0.037 and the control c moved 0.023 (1.0200 → 0.9974). So that bar was met by about one session's
       spread. A5 uses the same instrument, so its reading near 1.05 is just as coarse.
     - **The A5 PREREG is sealed before anyone times `ABC-274`'s build**, by its reader (QE, as the ticket page
       says), and it states:
       1. **The bar and the statistic:** as `…e36ee7ca` had them. R = (r₁ + r₂) / 2 with r_s = mean(H) / mean(B), MET
          iff R ≤ 1.0500 on the unrounded value. No third session and no tie-break. A miss is F8 (b).
       2. **The arms:** as this decision's dated line of `arch-fold-1103b` says. H is `ABC-274`'s shipped tapered
          entry. B is the pre-ticket head, `main` `54dee3f2` (or the later `main` it is built on, named). C is a copy
          of B. All three are called `ev(position, phase)` with the phase computed once per root. The ratio against
          `58fa3eb4` is reported, not graded.
       3. **The void rule:** c_s outside [0.970, 1.030] voids that session. One re-run is allowed. A second void in the
          same slot is a STOP to Architect/Design.
       4. **The spread, stated ahead as a report:** each r_s, |r₁ − r₂|, and each arm's per-round min–max. The reference
          spread is `qe-ABC-269`'s, 0.037 in r. If |R − 1.0500| ≤ 0.037, the verdict line adds "within one session
          spread". The label grades nothing: MET stays MET and a miss stays a miss.
       5. **The round order in words** (`QE-269-g`): "rounds 2, 4 and 6 (counted from 1) reverse the session's arm
          list; round 1 is the dropped warm-up", which is how `g2b.ts`'s `r % 2` with a 0-based `r` runs.
          Session 2 lists the arms in reverse (`ADR-0031` d3).
     - **The forecast stays `UNKNOWN - verify`.** The packed form keeps one table read and one add per piece, which is
       `main`'s count, so a reading near 1.00 × the pre-ticket head is expected. Nobody has measured it.
   - *Dated 2026-11-03 (`arch-ABC-274-seam`, records only, at `main` `e2d99bc1`; it reads `grugops/ABC-274`, code
     `c131ecd0`, and `se-ABC-274` `…22e25cea` / `…3219e70e`; nothing was run): **A3's test-only seam
     `withParametersForTest(parameters, run)` is accepted, with three conditions (S1–S3).** No bar moves.*
     - **Why it is allowed.**
       - **It is not a door** (`ADR-0064` d7, `ADR-0026` d2–d3). It reproduces no older path and adds no switch. No
         shipped call reads a flag or an argument for it. Scope 4 ("no new switch and no new door") holds.
       - **It is not the "module-level hook" that `ADR-0026` d2 rejects.** That hook was a switch the shipped
         recursion would read. This seam writes only the arrays that the shipped loader already writes at load. It
         does so inside one synchronous call, and it rebuilds them from `src/evaluate-params.ts` in a `finally`.
         `evaluate` still writes no module state (A4).
       - **It is the kind of TEST-ONLY export `src/evaluate.ts` already has** (`clearPawnCacheForTest`,
         `VALUE_TABLES_FOR_TEST`), and it tests `src/evaluate.ts` itself. The other route, a check outside `src/`,
         would test a model of the blend.
       - **`ADR-0002` does not govern it.** It adds nothing to `Position` or to make / unmake (clause 1, as `ADR-0064`
         d6's dated line reads it).
     - **Its price is on the shipped path, and A5 reads it.** The five scalar terms and mobility's four values now sit
       in typed arrays so that the seam can refill them. That is about nine typed-array reads per call, where `main`
       read module constants. The cost is inside A5's bar, and its size is **`UNKNOWN - verify`**. It is named here
       as a known part of the cost, not as F8's cut. If F8 (b) fires, the Architect still names the cut then.
     - **Its scope of use.** Inside `run`, a test calls the evaluation entries only. A search under the seam is not a
       reading: Lazy SMP workers (`ADR-0062`) have their own module state, so they would read the shipped table.
     - **The conditions, met before QE's verdict.** They are one test-only repair by the Engineer. No line of the
       shipped path changes. So A1, A2, A5 and A6 readings taken on `c131ecd0` carry over to the repair's head **iff**
       `git diff c131ecd0 <repair> -- src/` touches only `withParametersForTest`'s body and `src/*.test.ts`.
       1. **S1: A3 reads the table, not E1's equal halves.**
          - A3 reads the mobility count m as (`evaluate` − `evaluateWithoutMobility`) / `MOBILITY_WEIGHT.mg`. That
            difference is the mg mobility term only while mobility's two halves are equal (E1: weight 4 / 4, cap
            100 / 100). Under the tapered entry it is mob_mg + trunc((Δ′ + mob_eg − mob_mg)(D − w) / D) −
            trunc(Δ′(D − w) / D), where Δ′ is the rest of Δ.
          - `ABC-239` frees the mobility weight in both halves (d6), and it may edit no test (d6, B-T4). Its emitted
            set would therefore turn A3's `MOBILITY_WEIGHT` and `MOBILITY_CAP` rows red with no defect in `evaluate`.
            An mg weight of 0, which d6's bound "≥ 0" allows, divides by zero.
          - So m is taken a way that holds for any table. One way is a counter in the test, by `squaresReached`'s
            rule. Another is the seam itself, with both weights 1 and a cap that does not bind. Which one is the
            Engineer's choice. The selection rule is otherwise unchanged, and the mutant check is re-run for the two
            mobility families.
       2. **S2: the seam restores on any throw.**
          - `loadParameters(parameters)` is called before the `try`. A throw from the loader would leave the arrays
            half-written for the rest of that test file. The call moves inside the `try`.
          - One row: a `run` that throws, and a parameter object the loader throws on (a missing table, cast), each
            make the seam throw. After each, every corpus score equals its score before (`Object.is`). The existing
            restore row covers only the normal exit.
       3. **S3: a source pin.**
          - One row, in the form of `src/evaluate.pawns.test.ts`'s "no non-test module under src/ imports …" row.
            No non-test file under `src/` other than `src/evaluate.ts` names `withParametersForTest`, and no file
            under `tools/` does.
          - In `src/evaluate.ts`, `loadParameters(` is called at module load and inside the seam only.
     - **`ABC-239` does not reuse the seam.**
       - Its identity gate (d5) compares the tracer with `evaluate` at the current values, and those are the shipped
         file. After `emit`, the file is the values, so `evaluate` reads them with no seam.
       - `tools/tune/` imports no TEST-ONLY export (S3 pins it).
       - A3 and A9 then re-check the emitted set with no new row, and S1 is what makes A3 hold there.
       - If a later tool needs `evaluate` at values that are not in the file, it needs a new dated decision here.
     - **A3's positions: the Engineer's stated rule suffices, and QE does not freeze rows before the verdict.**
       - Test note 1 asked QE to freeze the rows before the build, so that nothing could be changed afterwards to make
         a row fit. That ordering was missed. A freeze made now would come after the build and would protect nothing
         more.
       - What protects the rows is that the selection is code. It is a filter over frozen corpora, on phase 1–23 and
         on the test's own count, read at the shipped table and never inside the seam. It cannot pick rows by their
         result.
       - QE checks four things, Q1–Q4, and records the missed freeze as a LOW process gap, not a defect:
         - **Q1:** the selection reads nothing inside `withParametersForTest` (source read).
         - **Q2:** each family's row count (≥ 3, asserted) and its phase spread, reported.
         - **Q3:** the mate corpus was added for a row count (`KING_FILE_OPEN` had no row), not for a result. The
           corpora are whole files in a fixed order, and no position is dropped.
         - **Q4:** C = 24 is a multiple of D, so A3 cannot always tell one trunc over the summed Δ from a trunc per
           term. QE confirms by source read that the tapered return has one `Math.trunc`, over `egDelta`
           (`ADR-0064` d2's form).
       - QE may add frozen rows (rows added only, A7). They are not owed.
9. **Data.** *(List number restored 2026-11-03, `arch-owner-answers-1103b`. It was lost in an edit of 2026-11-03
   (`f554dba4`). The content is unchanged.)*
   - **Default (A1), today: own self-play games.**
     - Source: every PGN tracked at the fit commit whose two players are both this engine.
     - Each future C2′ / C3″ read adds 100–400 games through M0 (`ABC-255`).
     - Licence: the project's own (Apache-2.0, `ADR-0048`). The openings are CC0 (`ADR-0023`).
     - Excluded: games against Stockfish (Q-3K-7 (c)), the owner's own games, and unfinished games.
   - **On the owner's yes (Q-3K-7 (a), recommended): one Lichess standard-game monthly export, for training only.**
     - Its page reads "Database exports are released under the Creative Commons CC0 license" (fetched 2026-11-03).
     - Its URL and sha256 are recorded, and the file is kept outside the repository.
     - Filters: rated standard games; base time ≥ 180 s; both ratings ≥ 2000; termination "Normal"; positions from
       ply 16 on.
     - **Every comment is ignored, `[%eval]` included,** so no engine label enters.
     - At most 1 M positions, sampled deterministically by hash.
     - **Validation stays own games** (held-out openings): the domain the product plays.
     - *Dated 2026-11-03 (`arch-owner-answers-1103`): the owner said yes (`…af126c04` item 2). The export, the
       slice, the filters, the split, the mix weight and the provenance are pinned in § Addendum 2026-11-03. Where
       the addendum is more exact than the five lines above, the addendum governs. It loosens none of them.*
   - **Rules for any source:**
     - de-duplicate games (start FEN + moves), then positions (four FEN fields, labels averaged);
     - a position is kept only if it is not a book position (for own games, the move played from it carries an engine
       comment; for Lichess, ply ≥ 16) and is not under a mate score, the side to move is not in check, and quiescence
       equals the static score;
     - **split by opening:** fnv1a32("ABC-239/split/v1\n" + start FEN) mod 5 = 0 is validation, and a key seen in
       training leaves validation;
     - the inner split is mod 4 on "ABC-239/inner/v1";
     - Lichess games count as training openings.
   - **The tool reads local files only. No network at run time** (`ABC-239` NFR triggers).
10. **The tool: one module, `tools/tune/`.**
    - `tune.ts` with three stages, `extract | fit | emit`, plus `tracer.ts`. About 800–1 000 lines of TypeScript.
    - It imports `src/` read-only, as `tools/rating/openings.ts` does.
    - Its tests run outside the default lane (`NFR-008`), by `vitest run tools/tune`. They cover the identity gate on
      a fixture, determinism (two runs, one file), the split's disjointness, and emission round-trip.
    - It is not in `dist/` (A3's `git diff` on the built tree).
    - **One tool module,** so `ABC-239`'s split rule ("more than one new tool module") does not fire. E2-pre is a
      separate `src/` ticket, not a tool module.
11. **The intent is GAIN (≥ 50.0 of 100).** The mechanism acts at every node, at 100 ms. It is named here and never
    re-classed after a score is seen.

### The pre-registered bars of `ABC-239` (fixed here; not loosened after Ready)

| # | bar | level |
|---|---|---|
| B-T0 | A1: source and licence recorded before any fit; the data manifest's sha256 in the PR | own games, or Lichess only on the owner's recorded yes |
| B-T1 | identity gate (decision 5) on the full data set at the base values | 0 misses |
| B-T2 | A2: the emitted integer set's outer-validation cross-entropy, against the base table's on the same rows | **< 1.000 ×** (A2 as written); the figure reported to 4 places, with training against validation |
| B-T3 | reproducibility: `extract` + `fit` + `emit` run twice | byte-identical `src/evaluate-params.ts` |
| B-T4 | A3 / A4: the diff under `src/` is that file only (plus the `ABC-215` A2 rows' replacement test); `G3` mirror; `G2` ≤ 1.02 × | after E2-pre. *Re-pin rule: dated line below the table (2026-11-03)* |
| B-T5 | play safety on the shipped path: `ADR-0050` d9's zugzwang rows 7 / 7 at their depths; mate floor 0 violations (`ADR-0064` B2's form); `G1` ≥ 54 / 58 with no NEWLY-MISSED line; `ADR-0061`'s futility audit (flips ≤ 0.5 %, 0 flips ≥ 200 cp) | as written. *Risk: dated line below the table (2026-11-03)* |
| B-T6 | `NFR-005` (`Q-3K-4` = (b)): `G6` boards at `LEVELS[5]`, ≥ 5 interleaved rounds, every run at depth ≥ 6; depth 7 is a WARN; the median against base reported | FAIL below 6 |
| B-T7 | A6: C2′ 100 games at 100 ms against the merge-base, GAIN ≥ 50.0, C-1 / C-2; S′ 10 games at 0.5 s against Stockfish 19 at E 1 810 (≥ 3.0 of 10, else 10 more and ≥ 7.0 of 20); the Levels deep lane exit 0 | `EPIC-011` § The per-change rule |
| B-T8 | A6's outside pair, 200 + 200 at 0.5 s against Stockfish (≈ 5 h), **asked of the owner first** (*approved 2026-11-03, `…af126c04` item 5*) | point estimate ≥ 0 |

*Dated 2026-11-03 (`arch-owner-answers-1103b`; `ADR-0068` accepted, `…401c3d09`; its § Consequences): **B-T4's re-pin
rule and B-T5's risk. No bar moves.***
- **B-T4, the re-pin rule for a tuned table** (old → new, `ADR-0064` d7's rule, by reference).
  - **Why it is needed.** A tuned table changes the numbers that tests pinned at the rule-made table. That holds on the
    shipped path and on every older door, because the doors read the same table. `arch-ABC-270`'s batch E (QX's
    rule values wired into every path) showed 28 reds in 7 files.
  - **What B-T4 grades is unchanged.** `src/evaluate-params.ts` is the only non-test file under `src/` that changes,
    plus `ABC-215` A2's replacement row. `dist/` holds no tuning code. A4's `G3` and `G2` ≤ 1.02 × stand.
  - **Re-pinned, old → new in the PR:** a figure in `src/*.test.ts` that records the old table, such as a node count,
    a score, a chosen move, a PV or an oracle value. Only the literal moves; the assertion's form stays.
    `quiescence.test.ts`'s deep pins and `ORACLE_AT_DEPTH_3` re-pin only by re-running the oracle.
  - **Never re-pinned:** a zugzwang depth, the mate floor, `G1`, the identity gate, and any relation test in
    `src/evaluate*.test.ts`. A red relation takes d6's rule (a bound and one refit). A red safety row is F4.
  - **A lost fixture property** is re-found under `ADR-0028` d2, as `ADR-0068` d5 does for `ABC-083`. The new row
    must be red with its term zeroed. A row is never loosened.
  - **A level that reddens** (`src/levels.test.ts`) follows `ADR-0028`: the fixture first, then one headroom, then the
    owner.
  - **The PR lists every re-pin** in one table (file, row, old → new). QE checks each one against this rule. A re-pin
    outside it is a defect.
  - **Why this is not a moved bar:** d6's "no test bar is edited" is read as the relation tests it sits among, plus
    B-T5's safety rows. A pin is a record of the old table, not a level. Every bar it could be mistaken for is named
    above as never re-pinned. *(If the Orchestrator reads a pin as a test bar, this line becomes an owner question.)*
- **B-T5, the KQK mate risk.** On `ADR-0068`'s probe, the rule values lost same-depth KQK mates at d5 against d5:
  X (three exposure endgame halves at 0) 1 / 190, QX 2 / 190. Both found them one ply deeper. The cause: the exposure
  term charges a bare king up to 105 cp in a pawnless ending. A tuned set moves far more, so B-T5's mate floor may fire on pawnless rows.
  - **The bar does not move.** If it fires: F4 as written. A defect check comes first. If the miss is real, the set is
    NOT MET. It is never re-pinned and never read at a deeper depth.
  - **The structural fix is `ABC-272` (E7a, the pawnless mop-up), not a re-pin.** A later pull over it is a new attempt
    under its own pre-registration (F6's rule).
  - **Recommended to QE (it grades nothing):** read B-T5 before B-T7 and B-T8, so that a miss spends no games.

## What would falsify this

| # | clause | what would falsify it | if it fires |
|---|---|---|---|
| **F1** | 4, 5: the traced model is the engine | an identity-gate miss | a defect, fixed before any fit is read |
| **F2** | 1–3, 9: the data carries the signal | B-T2 ≥ 1.000 × | NOT MET at the data stage: no play read. A re-open needs a changed data set, pre-registered |
| **F3** | 6: the bounds keep play sane | an `src/evaluate*` relation test red on the emitted set | that relation becomes a bound, one refit. A second red: NOT MET |
| **F4** | play safety | B-T5 | a defect check first. If real: NOT MET. Never a re-pin. `ADR-0061`'s margins are re-read if the audit fires (`ADR-0064` F5's rule) |
| **F5** | `NFR-005` | a `G6` run below depth 6 | NOT MET. There is no cost cut to take on a constants-only diff |
| **F6** | 11, the strength premise | C2′ < 50.0, an S′ collapse, or a red Levels lane | NOT MET, not re-played. **No set is ever re-fitted on play results**, and the configuration and λ are never chosen on play. A new attempt is a new data set or free set with a new pre-registration |
| **F7** | 7: reproducibility | B-T3 not byte-identical | a defect |
| **F8** | 8: E2-pre (`ABC-274`) is value-identical and cheap. *Added 2026-11-03 (`arch-fold-1103b`)* | (a) `ABC-274` A1 / A2 / A4 / A7: a node, score or move mismatch against the pre-ticket head, an `Object.is` miss, or a test expectation that has to move; (b) A5: `G2` above 1.05 × the pre-ticket head (the mean of two sessions, `ADR-0031` d3); (c) A6: a `G6` board's median depth below the pre-ticket head's, or any run below depth 6 | (a) a defect. It is fixed before any cost bar is read, and never re-pinned. (b) or (c): STOP to Architect/Design. **One value-identical cut is allowed, then one re-read of the bar that missed,** under a PREREG sealed before the re-read. If the build is not packed, the cut is the packed score. If it is already packed, the Architect names the cut. A second miss: **not merged**. No value is tuned to pass, and no bar moves. `ABC-239`'s A3 / A4 then cannot hold as written. Its re-plan (the blend folded into E2, § Alternatives) needs a new dated decision here, and the owner's word for any bar it changes. S2 nps is reported, never graded (`…690d3b30`). *Dated 2026-11-03 (`arch-post-269`, `QE-269-f` / `-g`):* A5's PREREG states the session spread and the round order ahead of the reading (decision 8's dated line). The bar stays 1.0500. *Dated 2026-11-03 (`arch-ABC-274-seam`):* A3's seam is accepted with S1–S3 (decision 8's dated line). A red S1–S3 row is A3's disposition, a defect: it is fixed and never re-pinned |

## Addendum 2026-11-03: the Lichess data pin (Q-3K-7 (a))

*Architect/Design, task `arch-owner-answers-1103`, records only, on `grugops/arch-owner-answers-1103` from `main`
`dc7dc15d`. The owner's yes is `…af126c04` item 2. The only thing run was a data-size probe under the host lock: HTTP
headers and the export's `counts.txt`, `list.txt` and `sha256sums.txt`, under 2 s. Nothing was downloaded beyond
those index files.* This pins decision 9's Lichess block for `ABC-239`'s first pull. **No bar moves** (§ The re-read
below).

### The export: one month, `2017-03`
- **File:** `lichess_db_standard_rated_2017-03.pgn.zst` at
  `https://database.lichess.org/standard/lichess_db_standard_rated_2017-03.pgn.zst`.
  - **2 169 142 067 bytes** (HTTP `Content-Length`, read 2026-11-03).
  - **11 346 745 games** (the export's `counts.txt`).
  - **sha256 `b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320`** (the export's `sha256sums.txt`).
- **Why this month:**
  1. **It is the last month before clock comments begin, and the largest month without them.** The page reads:
     "Games contain clock information … as PGN `%clk` comments since April 2017." `2017-04` has the same count
     (11 348 506) at 3 481 200 992 bytes, which is 1.6 × the bytes for the same games. `2017-01` and `2017-02` are a
     little smaller (1.90 and 1.80 GB) with fewer games (10.68 M and 10.19 M). The most games without clock text gives
     the cap the widest pool. The latest month, `2026-10`, is 30 982 323 881 bytes and 95 395 628 games. That is 14 ×
     the download for a slice capped at 1 M positions. The probe's table is
     `.grugops/context/arch-owner-answers-1103/raw/lichess-probe.txt`.
  2. **It clears the export's own known-issue list.** It comes after "everything before March 2016: some players could
     play themselves in rated games" and after "up to August 2016: 7 games with illegal castling moves". It lies
     outside the December 2016 evaluation issue, which would not matter anyway, because comments are not read. It
     lies far from 2020–2021 (for example "12 March 2021: some games have incorrect results").
     - **One issue does apply:** "up to December 2020: some exports lack the `Round` and `Date` tags and have missing
       black move numbers after comments." So the reader needs neither tag, and it needs no black move numbers.
  3. **It comes before the Bot API (2018).** No `BOT`-titled game is expected. The filter runs anyway, and its count
     is reported.
  4. **No month is free of engine labels:** "about 6% of the games include Stockfish analysis evaluations"
     (`[%eval]`), in every month. So the guarantee for Q-3K-7 (b) is the reader, not the month. Every comment is
     dropped unread (decision 9), and a test proves it (§ Test strategy below).
- **The players' era does not matter here.** These are static evaluation weights, not an opening book. Ratings are
  Lichess Glicko-2, on its 2017 scale.

### The slice: at most 1 000 000 positions
- **Game filters, in this order, each with a reported count:**
  1. `Event` starts with "Rated ". There is no `Variant` tag (or it reads "Standard"), and no `FEN` or `SetUp` tag.
  2. `TimeControl` is "B+I" with base **B ≥ 180 s** (decision 9). Correspondence ("-") is out.
  3. **`WhiteElo` ≥ 2000 and `BlackElo` ≥ 2000** (decision 9), **and |`WhiteElo` − `BlackElo`| ≤ 200.**
     - The gap bound is new, and it only narrows the set. A large gap predicts the result without the position, so
       it adds noise to a label that is meant to grade the position.
  4. `Termination` is "Normal". Time forfeit, abandoned, rules infraction and unterminated games are out.
  5. `Result` is one of 1-0, 0-1 or 1/2-1/2.
  6. Neither `WhiteTitle` nor `BlackTitle` is "BOT".
  7. **Every move replays legally,** from the start position, through the engine's own move generator (SAN matched
     against `legalMoves`). A game with any unmatched or ambiguous move is dropped whole and counted.
  8. **De-duplicate games** by start FEN plus moves, across Lichess and own games (decision 9).
- **Position rules, in this order:**
  1. **Ply ≥ 16.** For Lichess this stands in for the book (decision 9).
  2. **Sample by key, before the costly filters.** Keep a position iff fnv1a32("ABC-239/lichess/v1\n" + key) mod 8
     = 0, where key is the four FEN fields (decision 9's position key).
     - Every occurrence of a key is then taken or left together, so the label average below uses every game that
       reached it.
  3. **The side to move is not in check,** and it has a legal move.
  4. **Quiet:** quiescence equals the static score, at the base values (decision 9). This is the engine's own search,
     not an outside label.
  5. **No mate-score filter.** For own games that filter reads the engine's comment. Lichess comments are not read, so
     the signal does not exist. Rule 4 and the result label carry those positions.
  6. **The label** is the game's result from White's side. Positions are de-duplicated by key with the labels
     averaged (decision 9).
  7. **Leakage runs one way:** a Lichess key that equals any own-validation key (outer or inner) leaves the Lichess
     rows. Lichess never trims validation. Own training against own validation keeps decision 9's rule.
     - **Why:** the validation rows are then exactly the own-only run's rows, so B-T2 reads the same rows whichever
       data trained. Lichess's opening coverage would otherwise remove a sample-dependent share of validation.
  8. **The cap.** If more than **1 000 000** keys survive, keep the 1 000 000 with the smallest rule-2 hash, with ties
     broken by key string order. If fewer than **250 000** survive, **STOP to Architect/Design before any fit.** The
     design assumed data broader than own games (about 153 000 training positions today). A smaller slice, or a second
     month, is a new dated decision here.
- **The expected size is `UNKNOWN - verify`.** It is an estimate: 1–3 % of 11.35 M games pass the game filters
  (110 000–340 000 games). About 55 positions per game lie at ply 16 or later, so 6–19 M positions; ÷ 8 is 0.75–2.3
  M. The quiet and check filters then keep about two thirds, as the prototype did (254 485 of 388 632 seen). That is
  about 0.5–1.5 M, at or near the cap. No 2017 rating distribution was read for this. The tool reports every count.

### What the host carries (the numbers)
- **Disk:** 2.17 GB, kept outside the repository at `<data>/lichess/`. It is never decompressed to disk. The tool
  streams it through `node:zlib`'s `createZstdDecompress` (present on the host's Node v26.12.1; checked
  2026-11-03). No `zstd` binary is required. The host had 844 GB free at the probe.
- **The decompressed stream:** about 7–10 GB of PGN text, at 700–900 bytes a game (`UNKNOWN - verify`). It is read
  once and never held.
- **Rows held:** at most 1 000 000 Lichess rows plus the own rows (153 165 training and 39 568 validation today), so
  about 1.2 M.
- **RAM:** the run stays inside the prototype's heap flag, `--max-old-space-size=3000`. The host has 29 GB (21 GB
  available at the probe). The peak heap at 1.2 M rows is `UNKNOWN - verify`. The prototype held 254 485 rows inside
  that flag. The Engineer records peak RSS. If the run cannot fit the flag, the fault is in the row storage. The slice
  is not shrunk to make it fit.
- **Time, one `extract | fit | emit` run: ≤ 30 min, hard.** Each stage runs under `timeout 1800`, as the prototype's
  job did (1 700). The estimate is about 10–15 min, `UNKNOWN - verify`:
  - extract about 5–12 min: the header scan of 11.35 M games, SAN replay of the qualifying games (about 19 M plies at
    the top of the range), then quiescence, tracing and the identity gate on the sampled positions only. The
    prototype ran about 45 000 positions a second through replay, quiescence and trace;
  - fit about 1.5–3 min: the prototype took 18 s for 254 485 rows over C-S and C-F at three λ, which is linear in rows;
  - emit: seconds.
  - **Over 30 min is a STOP to Architect/Design,** with the stage times. The slice is not cut inside the build.
  - B-T3 runs the whole thing twice, and each run has the same limit.

### The split and the mix
- **Outer validation: own games only,** by decision 9's opening split, unchanged ("ABC-239/split/v1", mod 5 = 0).
- **The inner split** (the C-S / C-F choice and λ): own training openings only, by decision 9's mod 4 on
  "ABC-239/inner/v1". **Every Lichess row is inner-training.** Every choice is read on own games, the domain the
  product plays.
- **The mix weight: own games carry 0.5 of the loss.**
  - L(θ) = 0.5 · (mean cross-entropy over own training rows) + 0.5 · (mean cross-entropy over Lichess rows), plus
    C-F's L2 term.
  - **Fixed here, before any fit.** It is never chosen on validation or on play (F6).
  - **Why 0.5:** by row count, Lichess would carry about 87 % (1 M against about 150 000). Own games are the domain
    and the validation, and Lichess is the correction for their pull (queen 2 593). Equal shares give neither source
    a majority. Choosing the weight on own inner-validation would favour own games by construction, and that is the
    pull the yes was for.
- **K is fitted per source: K_own and K_lichess.** Each one comes from decision 3's golden section, on that source's
  training rows at the base values, and is then fixed. Both go into the header. Validation reads K_own.
  - **Why:** 2000+ humans at blitz and this engine at 100 ms convert the same edge at different rates. One shared K
    would bend the shared weights to fit both slopes. With each K fixed, the loss stays convex (decision 2).
- **Material stays frozen. This is still the first pull** (decision 6). Moving material inside ± 25 % needs its own
  PREREG, unchanged.
- **C-S or C-F:** decision 6's inner rule, unchanged. On broader data C-F may win it. That is the rule's call.
- **Emitted: the mixed fit.** Reported beside it, grading and deciding nothing:
  - the own-only fit (the A1 default, the same rules) on the same outer rows;
  - the emitted set's cross-entropy on the Lichess rows.

  If the mixed fit misses B-T2, F2 fires. Swapping in the own-only fit is then a re-open with its own PREREG. It is
  not a fallback.

### Provenance: what the tool writes
- **The data manifest** (decision 7's sha256) gains one Lichess entry: the file name, its URL, its byte length and its
  sha256. The entry is recorded **by URL, never by local path**: no host path goes in a record (`45-standing-rulings.md`,
  2026-11-03). The own PGNs stay repository-relative.
- **The tool hashes the local file before `extract`.** If the hash is not the pinned sha256 above, it exits non-zero
  and writes nothing.
- **The header also records:**
  - the count for each game filter (1–8) and each position rule (1–8), and the Lichess rows kept;
  - rule 2's string and modulus, the cap, and the leakage drop count;
  - K_own and K_lichess, the own weight 0.5, the configuration and λ;
  - the licence line "Lichess database export, CC0 (database.lichess.org)" (`ADR-0048`'s dated line of this date).
- **The download is a manual, documented step.** It uses the URL, then `sha256sum -c` against the export's line. It
  happens outside the repository, before the run. The tool reads local files only (decision 9). The file is never
  committed.

### Test strategy (added to decision 10's list; `vitest run tools/tune`, outside the default lane)
- **Comment blindness, the evidence for Q-3K-7 (b):** a fixture game carrying `[%eval]`, `[%clk]` and free-text
  comments gives rows byte-identical to the same game with every comment stripped.
- The export's known issue: a game with no `Round` or `Date` tag, and no black move numbers after comments, parses.
- One fixture game per game-filter drop reason, with the expected counts.
- The sha256 refusal: a byte-changed copy makes the tool exit non-zero and write nothing.
- Leakage direction: a Lichess key equal to an own-validation key leaves the Lichess rows, and validation is
  unchanged.
- One small `.pgn.zst` fixture (CC0 games, or games written by hand) exercises the zstd stream.

### The re-read: B-T0–B-T8 and F1–F7 against this data. No bar moves.

| # | reading with Lichess | moves? |
|---|---|---|
| B-T0 | Holds. The Lichess entry joins the manifest, and the yes is recorded (`…af126c04`) | no |
| B-T1 | Holds on the full set, Lichess rows included. The positions are more varied than own games, and the gate is the check. A miss is F1 | no |
| B-T2 | Holds. Its rows are own outer validation, unchanged by Lichess (position rule 7). < 1.000 × as written. A mixed fit reading above the own-only fit on own rows is a report, not a miss | no |
| B-T3 | Holds. The input is identified by sha256. Stream order is fixed, there is no random number generator, and the cap's tie-break makes it independent of order | no |
| B-T4 | Holds: the diff is `src/evaluate-params.ts` only. `ABC-274`'s packed int16 range row reads the emitted table. With material frozen, its sums are expected well inside the range (`UNKNOWN - verify`). A red row takes decision 6's rule: it becomes a bound, with one refit | no |
| B-T5 | Holds | no |
| B-T6 | Holds (constants only) | no |
| B-T7 | Holds. With own weight 0.5, the C2′-opening share of the loss falls from about 40 % to about 20 %, so § Consequences' C2′ bias (`RISK-EPIC010-05`) shrinks. That is an estimate | no |
| B-T8 | Holds, now approved. Its games, like S′'s, never enter training (Q-3K-7 (c)). A1's source rule ("both players are this engine") already excludes them | no |
| F1 | Holds. Game filter 7 is a separate reader check, run before any fit: over 0.1 % of games reaching replay dropped is a reader defect, fixed first | no |
| F2 | Holds. An own-only refit after a miss is a re-open with its own PREREG | no |
| F3–F5 | Hold | no |
| F6 | Holds. The export, the filters, the cap, the 0.5 weight and K per source join the list of things never chosen on play | no |
| F7 | Holds. A different export file is a different input (sha256) | no |

- **The new stops are data-stage stops, not bars:** under 250 000 Lichess rows; reader drops over 0.1 %; a run over
  30 min; a heap over the 3 000 MB flag. Each one goes to Architect/Design with its count. None of them is a pass or
  a fail.

## Alternatives

- **Free material at the first pull.** Rejected on the prototype's evidence: queen 2 593 / 137 (C-S), 3 470 / −237 (D1).
  A search compares trades with these values, and a queen worth 26 pawns would give up two rooks and a minor piece to
  keep it.
- **Squared error (Texel's own loss).** Not chosen. D1 showed it does not cure the data's pull, and it is not convex
  through σ. It is reported beside cross-entropy.
- **Texel's original ±1 coordinate search on the engine's own `evaluate`.** Rejected: it needs O(parameters × passes ×
  positions) evaluations against a few Newton steps here, with the same optimum. The tracer plus the identity gate
  gives the same model at a small fraction of the cost.
- **Adam or plain gradient descent.** Workable, but it needs a learning rate and an iteration count, both tunable knobs.
  Newton on a convex problem has no rate and lands on the optimum.
- **A test-only tracing export in `src/evaluate.ts`,** with no duplicated logic. Rejected because `src/` would gain
  code (A3). The duplication is guarded by the identity gate.
- **A Stockfish-labelled position set** (regression to engine scores). Not used, and not needed. It raises the product
  identity question (labels from a neural engine), and that question is the owner's (Q-3K-7 (b)). Recommend no.
- **Games against Stockfish as training data.** Not used: half the moves are Stockfish's, and the results lean to
  losses. Q-3K-7 (c); recommend no.
- **SPSA or other play-based tuning.** Rejected for width: every step costs games, and C2′ alone is 0.4 h for one
  reading.
- **Generate more own games at a longer control.** Possible, but costly: 259 games/h at 100 ms, so about 4 h per 1 000
  games, over the 1 h line. If the owner declines Lichess, it is the next data step, asked first.
- **Tune before E1.** Rejected: one half per term cannot express the phase. That is E1's whole point (`ADR-0064`).
- **Fold the general blend into `ABC-239`.** Possible. But A3 / A4 would then need amending, and the cost reading
  would mix with the values. A separate value-identical change is node-checkable on its own.

## Consequences

- **Order and dependencies:**
  1. **`ABC-269` merges first.** The build waits for it: it needs E1's table and the delta-form blend. If `ABC-269`
     does not merge (`ADR-0064` F6), its structure re-offered value-identical becomes E2's base, folded into E2-pre.
  2. **E2-pre** (the general blend, value-identical). A new ticket of size S, cut by BA/PM.
  3. **`ABC-239`:** the tool and the first pull. The tool does not wait for the data answer. The fit uses whatever
     source is accepted at fit time.
  4. **`ABC-270` (E3a), after `ABC-239`.** Its queen scale and exposure-by-phase terms then enter traced, with fitted
     weights rather than hand ones (`ABC-207`'s loss). The king-table signal above suggests that part of E3a's gap is a
     weight the tuner fits. **If `ABC-239` stalls on data,** `ABC-270` may go first on its rule values. The tuner's
     first pull then traces it (decision 5).
  5. **`ABC-271` (E4a), after `ABC-239`.** King distance and free path are weights the tuner fits; the rule of the
     square stays a rule.
  6. **`ABC-272` (E7a): order free.** Mop-up and the drawish scale are a pawnless rule and a multiplicative factor, so
     the tuner neither fits nor blocks them. The tracer applies the factor (decision 4). Its premise probe can run any
     time after E1.
  7. `ABC-273` (R1) in the window after E1, as BA/PM ordered. It gives an outside anchor before E2.
- **The C2′ openings:** 40 % of today's rows come from openings 1–50, which C2′ replays. A fitted set may read a few
  Elo better there than elsewhere. S′ and the owner-asked pair (B-T8) are the outside checks (`RISK-EPIC010-05`).
  Recommend asking for B-T8 on this ticket: a tuned set judged by self-play alone is the failure on record
  (`EPIC-008`).
- **Expected size:** own games, bounded, about 0.4 % of loss. That is likely near C2′'s noise (± 48), so F6 may fire.
  On Lichess data the free set can be wider (C-F may win the rule), and the expectation is `ADR-0056` D2's
  +100–250, discounted. Estimates, not readings.
- **NFR impact:**
  - `G2`: E2-pre ≤ 1.05 ×, `ABC-239` ≤ 1.02 ×.
  - `NFR-005`: floor under (b).
  - `NFR-008`: the tool's tests stay out of the default lane.
  - `NFR-009`: unchanged (no memory added; the pawn memo is untouched).
  - Security: local files only, and comments are ignored on read.
  - No new NFR row.
- **Host time:** extract and fit take minutes (Lichess at 1 M positions: ≤ 30 min, `UNKNOWN - verify`). The reads
  take ≈ 0.7 h (C2′ 0.4 h, S′ 10 min, Levels 9 min) plus the `G6` readings and the futility audit. B-T8 adds ≈ 5 h, if
  he says yes.
- **Effort:** E2-pre is S. `ABC-239` stays L: the tool with tests and records, one fit, the reads.
- **Owed lines** (not edited here; decision `…e4c34239` § 5 lists them): `ABC-239` (A1 / A2 / A3 / A4 / DoR row 10 /
  dependencies / intent), a new E2-pre ticket, `ADR-0056` (row E2, Q-3K-7, Phase 4), `EPIC-011` (Phase 4), and a
  pointer in `ADR-0064` d4 / d6.
- *Dated 2026-11-03 (`arch-owner-answers-1103`; `…af126c04`):*
  - **Order item 2 is done:** E2-pre merged (`2410d4f7`). `ABC-239` is next, on the data of § Addendum.
  - **Order item 4, read with his item 8:** `ABC-270`'s **design** may start now, ahead of `ABC-239`'s build. The
    order of the **builds** is unchanged: `ABC-239` first. If `ABC-270` merges first on its rule values, the tuner's
    first pull traces it (decision 5) under the stall clause above. Which build lands first is the Orchestrator's
    call.
  - **Host time:** a Lichess run is estimated at 10–15 min, with a hard limit of 30 min (§ Addendum). That replaces
    "≤ 30 min, `UNKNOWN - verify`" above. B-T8's ≈ 5 h is now approved.
- *Dated 2026-11-03 (`arch-owner-answers-1103b`; his word `…401c3d09` accepts `ADR-0068` and `ADR-0069`):* **order
  item 4 now reads `ABC-270` (structure) → `ABC-239`.**
  - `ABC-270` lands value-identical (`ADR-0068`). Its build runs beside `ABC-239`'s tool build. `ABC-239`'s fit and
    emission are taken on a `main` that contains `ABC-270`. If `ABC-270` fails (`ADR-0068` F1 / F2), they are taken on
    its disposition, and the fit runs without the queen-on terms. One read, B-T7 and B-T8, covers both.
  - **Superseded:** item 4's "after `ABC-239`" and its stall clause, "`ABC-270` may go first on its rule values". The
    rule values are not shipped (`ADR-0068`, choice rule 3). Also superseded: the dated line above, "the order of the
    **builds** is unchanged: `ABC-239` first".
  - **Q1 (`ADR-0069`):** its build runs beside `ABC-239`'s tool build. It merges, or misses, before `ABC-239`'s
    candidate is frozen for B-T7 / B-T8, and never between that freeze and `ABC-239`'s merge. `ABC-239`'s quiet filter
    calls `quiesce` with its own rules record, so a Q1 merge does not move its data (`ADR-0069` d6).
  - Items 5–7 are unchanged.

## Rollback

- **Before acceptance:** mark this ADR `rejected`. Nothing in `src/` or `tools/` has moved.
- **After E2-pre merges:** it is value-identical, so it can stay, or be reverted as one commit.
- **After a tuned set merges:** revert the one `src/evaluate-params.ts` commit, which brings back the rule-made table.
  The tool stays under `tools/` and ships nothing.

## Sources

- Texel's Tuning Method (CPW): https://www.chessprogramming.org/Texel%27s_Tuning_Method
- Lichess open database: https://database.lichess.org/ ("Database exports are released under the Creative Commons CC0
  license", fetched 2026-11-03). Whether a given monthly file carries `[%eval]` comments is `UNKNOWN - verify`; the
  reader ignores every comment either way.
  - *Read 2026-11-03 (`arch-owner-answers-1103`):* the Standard section says "About 6% of the games include
    Stockfish analysis evaluations", "`%clk` comments since April 2017", and "The `WhiteElo` and `BlackElo` tags
    contain Glicko2 ratings". Its known-issue list is quoted in § Addendum. So the `UNKNOWN - verify` above is
    answered: every month carries `[%eval]` in some games.
  - `https://database.lichess.org/standard/counts.txt`, `…/list.txt` and `…/sha256sums.txt` (read 2026-11-03): the
    game count and the sha256 of `2017-03`. The byte length comes from an HTTP `HEAD` of the file.
