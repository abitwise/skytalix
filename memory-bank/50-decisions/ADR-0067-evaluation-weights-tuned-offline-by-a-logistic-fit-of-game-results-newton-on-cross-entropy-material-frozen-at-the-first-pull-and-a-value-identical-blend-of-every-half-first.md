---
kind: adr
id: ADR-0067
---
# ADR-0067: The evaluation's weights are tuned offline by a logistic fit of game results against the two-half evaluation. The loss is cross-entropy, K is fixed first, and Newton steps run on a traced linear model. At the first pull material stays frozen and the free set is bounded and sign-bounded. The tool lives under `tools/tune/` and writes only `src/evaluate-params.ts`. A value-identical blend of every half lands first

## Status

**PROPOSED 2026-11-03.** Recorded by Architect/Design (task `arch-ABC-239`, on `grugops/arch-ABC-239` from `main`
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
9. **Data.**
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
| B-T4 | A3 / A4: the diff under `src/` is that file only (plus the `ABC-215` A2 rows' replacement test); `G3` mirror; `G2` ≤ 1.02 × | after E2-pre |
| B-T5 | play safety on the shipped path: `ADR-0050` d9's zugzwang rows 7 / 7 at their depths; mate floor 0 violations (`ADR-0064` B2's form); `G1` ≥ 54 / 58 with no NEWLY-MISSED line; `ADR-0061`'s futility audit (flips ≤ 0.5 %, 0 flips ≥ 200 cp) | as written |
| B-T6 | `NFR-005` (`Q-3K-4` = (b)): `G6` boards at `LEVELS[5]`, ≥ 5 interleaved rounds, every run at depth ≥ 6; depth 7 is a WARN; the median against base reported | FAIL below 6 |
| B-T7 | A6: C2′ 100 games at 100 ms against the merge-base, GAIN ≥ 50.0, C-1 / C-2; S′ 10 games at 0.5 s against Stockfish 19 at E 1 810 (≥ 3.0 of 10, else 10 more and ≥ 7.0 of 20); the Levels deep lane exit 0 | `EPIC-011` § The per-change rule |
| B-T8 | A6's outside pair, 200 + 200 at 0.5 s against Stockfish (≈ 5 h), **asked of the owner first** | point estimate ≥ 0 |

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
| **F8** | 8: E2-pre (`ABC-274`) is value-identical and cheap. *Added 2026-11-03 (`arch-fold-1103b`)* | (a) `ABC-274` A1 / A2 / A4 / A7: a node, score or move mismatch against the pre-ticket head, an `Object.is` miss, or a test expectation that has to move; (b) A5: `G2` above 1.05 × the pre-ticket head (the mean of two sessions, `ADR-0031` d3); (c) A6: a `G6` board's median depth below the pre-ticket head's, or any run below depth 6 | (a) a defect. It is fixed before any cost bar is read, and never re-pinned. (b) or (c): STOP to Architect/Design. **One value-identical cut is allowed, then one re-read of the bar that missed,** under a PREREG sealed before the re-read. If the build is not packed, the cut is the packed score. If it is already packed, the Architect names the cut. A second miss: **not merged**. No value is tuned to pass, and no bar moves. `ABC-239`'s A3 / A4 then cannot hold as written. Its re-plan (the blend folded into E2, § Alternatives) needs a new dated decision here, and the owner's word for any bar it changes. S2 nps is reported, never graded (`…690d3b30`) |

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
