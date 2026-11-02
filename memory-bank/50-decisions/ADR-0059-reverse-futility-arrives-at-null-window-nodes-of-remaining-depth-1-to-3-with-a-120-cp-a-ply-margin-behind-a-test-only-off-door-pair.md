---
kind: adr
id: ADR-0059
---
# ADR-0059: Reverse futility arrives in both recursions at null-window nodes of remaining depth 1 to 3, with a margin of 120 cp a ply, behind a test-only off-door pair. It is guarded at the root, in check, in the mate band and below three non-pawn pieces, and returns beta

## Status

**ACCEPTED** 2026-11-02 by the owner. **Not yet in force on `main`:** it comes into force at `ABC-264`'s merge.
Recorded by Architect/Design (task `arch-owner-answers-1102`, records only, on `grugops/arch-owner-answers-1102` from
`main` `7daf8086`). Nothing was run.

- **His word, verbatim** (`orch-2026-10-30a` `…81ae2db4`): *"R yes"*, the answer to "accept / decline ADR-0059".
- **What it releases:** `ABC-264` part 2. That is `A6` (C2′, 100 games at 100 ms against the merge-base, GAIN
  ≥ 50.0 of 100), S′ (10 games at 0.5 s against Stockfish 19 at E 1 650) and the Levels deep lane. Then the merge to
  local `main`. Reading (b) ends here: the read and the merge no longer wait on him.
- **If `ABC-264` does not merge** (F4 or F5 fires), a dated line here records "accepted, not in force on `main`", as
  the first status block says. Nothing else changes.
- **One premise corrected, `QE-264-b`** (`qe-ABC-264` `…3a95d391`, LOW, records). Decision 2's static-score bullet
  said "a static evaluation is under 10 000 (asserted in `src/transposition.test.ts`)". Both halves were wrong:
  - **The premise is false at the extremes.** QE measured `evaluate` = **−10 535** on
    `QQQQQQQQ/QRRBBNN1/8/8/8/8/8/K6k b`.
  - **Nothing asserts it.** `src/transposition.test.ts:188` asserts `MATE_FLOOR > 10 000`, a relation between
    constants. The evaluation's range is only in a comment.
  - **The conclusion stands.** Decision 2 now states the true bound, derived by reading `src/evaluate.ts` at
    `7daf8086`. It is far below `MATE_FLOOR`, so the beta-only band test is sound. See decision 2's dated bullet.
  - **Owed elsewhere, not by this hop:** the page's `A2` wording (BA/PM) and the comment at
    `src/transposition.ts:58-60` (the Engineer, with the next `src/transposition.ts` edit). The comment still reads
    "under 10 000 (a full board of queens)".

*First status, kept:* **PROPOSED** 2026-11-02 by Architect/Design (task `arch-ABC-264`, on `grugops/arch-ABC-264` from `main` `ecc0331f`).
Records only. The probe ran on a scratch copy of `main`'s `src/`, outside the repository, under the host lock; the copy
is deleted. Nothing was committed to `src/`.

- **Acceptance is the owner's.** A new ADR is his call under the 2026-10-22 delegation
  (`memory-bank/45-standing-rulings.md`). `ADR-0056` (accepted in direction) lists P2 in D2 and puts it first in
  Phase 2 (D6). That acceptance covers the direction, not this text. The Orchestrator reports this ADR to him.
- **The answer that settles it:** *"accept ADR-0059"* or *"decline it"*.
- **Reading (b)**, the `ABC-208` / `ABC-238` precedent: `ABC-264`'s build and its gates may proceed while this ADR is
  PROPOSED. The 100-game read (`ABC-264` `A6`) and the merge wait on his acceptance.
- **Default without an answer:** no reverse futility on `main`.
- **If `ABC-264` does not merge** (A4 missed, A6 NOT MET, or an S′ collapse), a dated line here records "accepted, not
  in force on `main`", as `ADR-0026` decision 9 does.
- **What it amends:** no ADR. It follows `ADR-0026` decision 10 (a switch, a pair of doors, off in every older door, a
  bounded oracle) and `ADR-0050`'s form, and cites them rather than restating them. **It tightens `ABC-264`'s `A3` and
  `A4`** (decisions 8 and 9). The ticket page lets the ADR tighten them; it does not loosen any bound.

## Context

- **The gap.** The search has no futility pruning of any kind (`ADR-0056` § Inventory: "Futility, reverse futility,
  razoring, late-move pruning | **no**"). A node near the leaves whose static score is already far above beta is still
  expanded move by move.
- **The idea.** Reverse futility (also called static null move): at a shallow node, if the static evaluation minus a
  margin that grows with remaining depth is still at least beta, the side to move is assumed to keep at least beta,
  and the node returns without searching its moves. It changes the VALUE: the cut is a guess. It fails in the same
  places as null move (zugzwang, a threat larger than the margin) and when the side to move is in check.
- **The expected value.** `ADR-0056` D2 row P2: +30–60 Elo, basis [B] (Blunder 6.0, bundled with history), size S,
  risk low–medium. That is an estimate, not a reading.
- **`ABC-264`'s A4 figure (0.90×) was a proposal** that waited on this design's probe ("learn from `ABC-238`: measure
  the premise before the bar").
- **The inputs read:** `ABC-264` (A1–A6, Dependencies, DoR); `ADR-0056` D2, D5 (C2′, S′, R-TC), D6; `ADR-0026`
  decisions 1–10; `ADR-0050` (all); `ADR-0058` decisions 5–7 and § What would falsify this; `arch-phase1-replan`
  notes `…c0e9f5a0` (bar fragility under ~10 %) and `…5ea73b5c`; `bapm-phase1-pause` `…425d9834`; and on `main`
  `ecc0331f`: `src/search.ts` (`nullMoveReduction` `:354-375`, `negamax` `:450-560`, `searchRoot` `:662-724`),
  `src/engine.ts` (`negamax` `:375-468`), `src/transposition.ts` (`MATE_FLOOR` `:56-64`), `src/evaluate.ts`.

### What the probe measured

The probe patched a scratch copy of `main` `ecc0331f` with one switchable predicate in both recursions. Every run is
deterministic (fixed depth, or `chooseMove` with `maxDepth` on a frozen clock), and the door's node counts reproduce
`se-ABC-238`'s door to the node (kiwipete 1 116 785, position-6 1 602 457 at depth 8). Full figures:
`.grugops/context/arch-ABC-264/` observation `…1e9c2549` (the probe note); the ruling is decision `…b48c5a3e`.

- **Nodes, fixed depth 8, head / door, the chosen rule (120 cp a ply, depth 1–3, guard 3, beta, null-window only):**

  | position | `search()` | `chooseMove` to 8 |
  |---|---|---|
  | kiwipete | **0.5901** (658 971 / 1 116 785) | **0.6173** (972 596 / 1 575 537) |
  | position-6 | **0.6373** (1 021 190 / 1 602 457) | **0.6282** (299 183 / 476 244) |
  | position-4 | 0.4584 | 0.3470 |
  | position-5 | 0.3651 | 0.4273 |
  | startpos | 0.9259 | 1.0350 |

  Root move and score are unchanged on kiwipete and position-6 in both recursions (kiwipete `search()` −60 → −59).
  Startpos is level, so the margin rarely holds there (2 747 cuts of 40 156 tries), and its ratio is noise.
- **Drift at depth 5 on `ABC-121`'s 190, against the door:** 97.33 % of 187 non-mate scores within 25 cp in both
  recursions; largest 107 cp (kiwipete/f3g4, 1 142 → 1 035, a won position); 0 mate-status flips, 0 sign flips.
- **Mate floor on the 287 at depth 5 (`search()`):** 189 door mates, 0 violations, 0 mates longer.
- **`ADR-0050` d9's seven zugzwang rows** (`chooseMove`, recorded depths): all seven played.
- **`G1`** (`PUZZLE_DEEP=1` on the scratch copy, reverse futility on): **54/58**, baseline 54/58, no NEWLY line.
- **Firing at depth 6 on the 190 (`search()`, about what 100 ms reaches):** 571 398 cuts of 893 168 tries, 5.8 % of
  the head's 9 917 583 nodes; nodes 0.556× the door.
- **Wall time, informal** (not a `G6` reading; `search()` at depth 8, three runs each, host under the lock): kiwipete
  0.62×, position-6 0.67×. The time ratio sits a little above the node ratio: the predicate evaluates at each try.

**The variants (same figures; the bar-relevant ones):**

| variant | A4 `search()` kiwi / pos-6 | A4 `chooseMove` kiwi / pos-6 | drift d5 `search()` / `chooseMove` (within 25 cp; max) | zugzwang rows |
|---|---|---|---|---|
| 75 cp a ply | 0.514 / 0.530 | 0.448 / 0.535 | 95.72 % / 95.19 %; 107 | 7/7 |
| 100 cp a ply | 0.557 / 0.578 | 0.557 / 0.634 | 96.26 % / 95.72 %; 107 | 7/7 |
| **120 cp a ply (chosen)** | **0.590 / 0.637** | **0.617 / 0.628** | **97.33 % / 97.33 %; 107** | **7/7** |
| 150 cp a ply | 0.644 / 0.672 | 0.709 / 0.660 | 97.86 % / 97.86 %; 99 | 7/7 |
| 120, depth 1–5 | 0.581 / 0.631 | 0.617 / 0.618 | 97.33 % / 97.33 %; 107 | 7/7 |
| 150, depth 1–5 | 0.635 / 0.669 | 0.709 / 0.654 | 97.86 % / 97.86 %; 99 | 7/7 |
| 100, guard 0 or 1 piece | 0.557 / 0.578 | 0.557 / 0.634 | as 100 cp | **6/7** (`zugzwang.004` plays Bf6) |
| 100, guard 2 pieces | as above | as above | as 100 cp | **6/7** (`zugzwang.005` plays Ne2) |
| 120, returns the static score | 0.566 / 0.550 | 0.685 / 0.629 | **94.65 %** / 95.19 %; **166** | 7/7 |
| 120, PV nodes too | 0.590 / 0.637 | 0.637 / 0.628 | 96.79 % / 96.79 %; 107 | 7/7 |
| 120, after the null move | 0.737 / 0.718 | 0.778 / 0.740 | 97.33 % / 97.33 %; 107 | 7/7 |
| 120, no mate-band guard (planted) | as chosen | as chosen | as chosen | 7/7 |
| 120, no check guard (planted) | 0.581 / 0.624 | 0.616 / 0.618 | **93.58 %** / 95.19 %; **345 / 365** | 7/7 |

Every variant kept the 287 mate floor at 0 violations.

## Decision

1. **The rule.** At a node of the main tree, after the in-path repetition check, the pre-root repetition check (in
   `src/engine.ts`), the leaf and capacity guard and the table probe, and **before the null move** and before any
   move is generated: if the switch of decision 3 is on, the node is a **null-window node** (`alpha + 1 === beta`),
   and decision 2's predicate says so, **the node returns beta**. It stores no table entry. Otherwise the node is
   searched exactly as today (null move, then the moves).
   - **Null-window nodes only** (`ADR-0050` decision 1's shape). So reverse futility lives inside PVS's frame and
     implies `pvs`, as `reductions` and `nullMove` do. A PV node never takes a static guess for its exact score.
     Measured: allowing it at PV nodes saves nothing at depth 8 (0.590 / 0.637 both ways) and drifts more (96.79 %).
   - **Before the null move.** A cut costs one evaluation; a null move costs a reduced subtree. Measured: placing it
     after the null move gives 0.74–0.78× instead of 0.59–0.64×.
   - **Returns beta, never the static score.** Measured: returning the static score (fail-soft) reds the drift bar
     (94.65 %, max 166 cp). Beta is the least claim that makes the parent's null-window test fail high, and it is the
     null move's return (`ADR-0050` decision 7).
   - **Stores nothing,** as the null move. No guess enters the table, so no pruned bound is reused at another depth
     or ply.
2. **The predicate is ONE exported pure function in `src/search.ts`: `reverseFutilityCut(position, depth, ply, beta)`,
   returning a boolean.** Both recursions call it (the engine imports it, as it imports `nullMoveReduction`), so the
   rule cannot drift between them. It returns **false** when any of these holds, checked in this order:
   - **the root:** `ply` is 0. (Neither recursion's `negamax` is entered at ply 0: `searchRoot` and the engine's root
     loop call children at ply 1. The clause keeps the predicate's table complete, as `ADR-0050` decision 6 does.)
   - **outside the depth range:** remaining `depth` above **3**. (Depth ≤ 0 never reaches it: that is the leaf.)
   - **the mate band:** `beta >= MATE_FLOOR` or `beta <= -MATE_FLOOR` (`src/transposition.ts`, 20 000). A static guess
     never claims a bound against a mate score, on either side.
   - **in check:** `isInCheck(position)`.
   - **the zugzwang guard:** the side to move has **fewer than three non-pawn pieces** (knights, bishops, rooks and
     queens): exactly `ADR-0050` decision 6's count. The Engineer may move that one loop into a helper both predicates
     call; its count does not change.

   Otherwise it returns **`evaluate(position) - 120 * depth >= beta`**. The margin is **120 cp per ply of remaining
   depth**: 120, 240 and 360 at depths 1, 2 and 3.
   - It derives check, material and the static score from the position. The caller passes only depth, ply and beta
     (`ADR-0026` decision 6's contract). It evaluates last, so a guarded node pays no evaluation.
   - **The static score's mate band** (the ticket's "or the static score is a mate score"): a static evaluation is
     under 10 000 (`src/transposition.ts:56-64`, asserted in `src/transposition.test.ts`), so it is never in the band.
     The predicate does not test it, and `A2`'s row for it is met by that asserted relation plus the beta row.
   - *Corrected 2026-11-02 (`arch-owner-answers-1102`; `QE-264-b`).* The bullet above overstates its premise. The
     10 000 figure is false at the extremes (QE measured −10 535), and the test asserts only `MATE_FLOOR > 10 000`.
     The true bound, derived by reading `src/evaluate.ts` at `7daf8086` (not measured):
     - **|`evaluate`| ≤ 10 885 cp** on any board where neither side holds more than legal promotion allows. That is
       at most 15 non-king pieces, at most 8 of them promoted.
     - The largest case is 9 Q, 2 R, 2 B and 2 N against a bare king. Material plus square tables give at most 10 630.
       The bare king's square table adds at most 50, mobility at most 100 (its clamp), and king safety at most 105
       (3 files × (15 + 20)). A pawn in place of a queen scores at most 230 (100 + 30 + a passer's 100), less than
       the queen's 910, so no mix of pawns beats the all-queens case.
     - QE's −10 535 sits inside it. 10 885 is under `MATE_FLOOR` (20 000) by more than 9 000.
     - **So the static score is never in the mate band.** The predicate does not test it, and `A2`'s row for it is
       met by this derived bound plus the beta row. No test row is owed for it.
     - **Named limit, not owed here.** The FEN reader (`ADR-0033` decision 3) does not bound piece counts. A
       constructed board with about 22 or more queens a side would reach `MATE_FLOOR`. No game reaches such a board.
       The limit belongs to `ADR-0033` and the table's mate test as a whole, not to this predicate.
3. **One switch, `reverseFutility`, in BOTH recursions:** `src/search.ts`'s `Switches` and `src/engine.ts`'s
   `Heuristics`. It is on in `search()` and `chooseMove` only. It reaches the recursion as a switch, never as module
   state, an `EngineOptions` field or a parameter of `search()` (`ADR-0026` decision 2's rejections).
4. **Two TEST-ONLY doors: `searchWithoutReverseFutility(position, depth)` and
   `chooseMoveWithoutReverseFutility(position, options)`.** Each is the shipped path with `reverseFutility` off and
   everything else on: the pre-`ABC-264` `search()` and `chooseMove`, node for node (`ABC-264` `A1`). The engine door
   takes no depth (`ABC-078` `A4`).
   - **Export lists:** `ABC-077` `A6` (`src/search.ts`) grows by **two** names, the door and the predicate;
     `ABC-078` `A4` (`src/engine.ts`) by **one**, its door. That is three names in all, the `ADR-0050` decision 2
     precedent. `ABC-264` `A1`'s "grow by exactly two names" reads that way (decision 10).
5. **Every door that exists before `ABC-264` turns `reverseFutility` off** (`ADR-0026` decision 3's ladder rule).
   Reverse futility is the top rung, above null move. So `searchWithoutNullMove`, the `ABC-228` / `ABC-229` doors,
   the `…WithoutReductions` pair, `searchWithoutPvsOrReductions` and every older door read exactly as today.
6. **Rows: `ADR-0050` decision 4 and `ADR-0058` decision 5, by reference.**
   - **Re-point.** Every row whose shipped side is `search()` or `chooseMove` and whose other side is an older door
     re-points its shipped side to the new door of the same recursion (for example the `ABC-229` drift rows, and any
     `ABC-230` row that compares `chooseMove` with a door). They then read their pre-ticket figures; no bound moves.
   - **Value and behaviour rows on the shipped path stay there.** A row that moves is re-pinned, old and new figures
     in the PR. The `ABC-249` row follows `ABC-264` test note 3.
   - **The PR lists every re-pointed and every re-pinned row.**
7. **`A2`'s instrument.** The predicate's table, called directly: true inside the range with the margin met; false
   for each clause of decision 2 (root, depth 4, `beta` at `±MATE_FLOOR`, in check, two non-pawn pieces), each on a
   position where every other clause would cut. The "0 child moves searched; the door searches them" row uses a
   call-through module mock (`vi.mock(path, { spy: true })`, the `ADR-0050` decision 9 pattern) of `./legal.ts`
   (`legalMoves`) or `./apply.ts` (`makeMove`). No production counter or hook. A source row reads both `negamax`
   bodies: each gates on `alpha + 1 === beta`, calls `reverseFutilityCut` before the null move, and returns `beta`
   (the "PV nodes too" and "after the null move" variants pass every value row, so this row and `A4` are what
   catch them).
8. **The bounded oracle (`ABC-264` `A3`), tightened.**
   - **Drift at depth 5 on `ABC-121`'s 190, in BOTH recursions:** `search()` against `searchWithoutReverseFutility`
     at fixed depth 5; `chooseMove` against `chooseMoveWithoutReverseFutility`, each deepened to 5 on a clock that
     does not expire. **At least 95 % of non-mate scores within 25 cp, none beyond 160 cp, and 0 mate scores change
     sign.** 160 is ⌊1.5 × 107⌋, the measured maximum with `ADR-0050` decision 8's headroom. **This cap is the
     tightening:** it reds the planted no-check-guard build in `chooseMove` (365 cp), where the 95 % clause alone
     passes it (95.19 %), and the fail-soft return (166 cp). Mate-status flips are reported.
   - **Mate floor on the 287 (`src/search.mate-corpus.ts`) at depth 5, `SEARCH_DEEP=1`:** every position the door
     scores as a mate, `search()` scores as a mate of the same sign. Distance is reported (measured: 0 longer).
   - **Zugzwang:** `ADR-0050` d9's seven rows, `chooseMove` at their recorded depths (9, 11, 12, 8, 8, 8, 8): each
     plays its recorded move. This row is what fixes the guard at three pieces (Context: one or two pieces lose a row).
   - **Scope, said plainly: this oracle is a regression net, not a proof.** A missing mate-band guard passes every
     row of it (planted, Context). The predicate's table (decision 7) is what catches that. Do not tighten 25 cp to
     chase it.
9. **`A4`, replaced: at fixed depth 8 on kiwipete and position-6, in BOTH recursions** (`search()` at depth 8;
   `chooseMove` deepened to 8 on a frozen clock), **nodes ≤ 0.75× the door's** on each of the four readings; and `G6`
   "≥ base" by its rule (floor 6). It is not loosened after Ready.
   - **The premise, measured:** 0.5901 / 0.6373 (`search()`), 0.6173 / 0.6282 (`chooseMove`). The worst reading has
     0.11 of headroom to the bar.
   - **Why 0.75 and not 0.90:** these readings are deterministic, and a build that implements decisions 1–2 exactly
     reproduces the probe's head counts **to the node**: 658 971 / 1 021 190 (`search()`), 972 596 / 299 183
     (`chooseMove`). So the bar does not have to absorb noise the way `ABC-238`'s ~1 % effect did. At 0.75 it reds a
     value-correct but mis-built rule: the null move tried first (0.74–0.78×). A 0.90 bar would pass it.
   - **A count that differs from the probe's is explained in the PR before `A4` is read.** That is an instrument
     check, not a bar: a different count means a different rule.
10. **The read and the reports (`ABC-264` `A6`, `ADR-0056` D5 as folded):** as the page states, by reference: C2′
    100 games at 100 ms, GAIN ≥ 50.0 of 100; S′ 10 games at 0.5 s against Stockfish 19 at E 1 650; the Levels deep
    lane on the candidate head.
    - **What 100 ms can see: reverse futility fires there.** It is depth-gated at 1–3, and the 100 ms median depth is
      6. At depth 6 on the 190 it cuts 5.8 % of nodes and the head needs 0.556× the door's nodes.
    - **The firing rate at 100 ms** is reported from a test-side or scratch instrument (a call-through spy on the
      predicate's import in `src/engine.ts`, or a scratch copy). Never a production counter.
    - **R-TC part 1, item 2, read at review:** the diff reads no budget, deadline, `movetime` or environment. The rule
      is keyed on depth, beta and the position only.
    - **Page deltas this ADR owes BA/PM** (they are not this hop's fence): `A1`'s export count (decision 4); `A3`'s
      160 cp cap and the zugzwang depths (decision 8); `A4`'s 0.75× in both recursions (decision 9); `A2`'s
      static-score row met by argument (decision 2).

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 1, 2 — the margin and the return | the drift bar red in either recursion (< 95 % within 25 cp, or any score beyond 160 cp) | decision 8, `A3` | a defect, back to the Engineer. Red on a predicate that matches decision 2 exactly: NOT MET. The first fallback is 150 cp a ply (measured 97.86 %, max 99 cp, A4 0.64–0.71×), by a dated amendment here, the owner's |
| **F2** | 2 — mate band, check | a mate score changing sign on the 190, or a door-mate becoming a non-mate or an opposite mate on the 287 | decision 8 | a defect |
| **F3** | 2 — the zugzwang guard | any of `ADR-0050` d9's seven rows not played at its depth | decision 8 | a defect (first check the count: one or two pieces lose a row, measured) |
| **F4** | the premise — it pays | nodes above **0.75×** the door's at depth 8 on kiwipete or position-6 in either recursion; or `G6` below base | decision 9 | `ABC-264` not merged; this ADR "accepted, not in force" |
| **F5** | the premise — strength | C2′ NOT MET (< 50.0 of 100), or an S′ collapse | decision 10 | the same as F4 |
| **F6** | 4, 5 — the doors | a new door not node-equal to the pre-ticket shipped search, or an older door not node-equal to its pre-ticket self, on the `ABC-078` `A3` corpus | `ABC-264` `A1` (`G4`) | a defect in the door or the switch wiring |
| **F7** | regression | `G1` below 54/58 (measured 54/58 on the scratch head) | `ABC-264` `A5` | classed per row under `ADR-0034`; an unexplained loss is a defect |

## Alternatives

- **A smaller margin (75 or 100 cp a ply).** More nodes saved (0.45–0.63×) but the drift sits on the bar: 95.19 % and
  95.72 % in `chooseMove`, one or two positions from red. Rejected: a regression net that a correct build barely
  passes is no net.
- **A larger margin (150 cp a ply).** Passes everything, saves less (0.64–0.71×). Kept as F1's first fallback.
- **A wider depth range (1–5, or the deeper ranges stronger engines use).** At depth 8, 1–5 adds 1–2 % (0.581 / 0.631
  against 0.590 / 0.637), and it widens the guess. Not taken now. The 40/15 claim searches deeper (about 14), where
  a wider range may pay; that is a later, measured change, after E1/E2 re-scale the evaluation.
- **No zugzwang guard, or a guard of one or two pieces.** Rejected by measurement: each loses a zugzwang row.
- **Return the static score (fail-soft).** Rejected by measurement: drift 94.65 %, max 166 cp.
- **Also at PV nodes.** Rejected: no node saving, more drift, and a PV node would take a static guess for an exact
  score.
- **After the null move.** Rejected by measurement: 0.74–0.78×. It is the classic order (Stockfish tries reverse
  futility before null move) for that reason.
- **Store a lower bound for the cut node.** Rejected: it would put a guess in the table and reuse it at other depths
  and plies, a new interaction with `ADR-0025` that nothing asks for. The null move's "store nothing" is the precedent.
- **A margin from a table, or improving/history terms.** Not needed; one linear term is the boring rule, and E1/E2
  re-scale it anyway.

## Consequences

- **NFRs.**
  - `NFR-005`: expected to improve (fewer nodes per depth); read by `G6`, floor 6 unchanged.
  - `NFR-004`: abort granularity unchanged. A cut node returns sooner; the clock check stays at the node; no new
    throw site.
  - `NFR-008`: the predicate's table and the source row are default-lane units (no search). The drift, mate floor and
    zugzwang rows go behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1`.
  - `NFR-009`: unchanged. No structure is held between nodes, so `G7` is not owed.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** the predicate is pure. Same input and virtual clock give the same move.
- **Repetition and the table keep their authority.** A repeated node is scored 0 before the predicate; a stored
  result settles a node before it. The 75-move leaf and in-path repetitions below a cut node are not seen, the same
  graph-history class `ADR-0025` § Consequences and `ADR-0058` decision 7 accept.
- **Eval-scale coupling (`ADR-0056` D2, named, not decided).** 120 cp is in today's centipawns. E1 (taper) and E2
  (`ABC-239`, tuning) re-scale the evaluation; the margin is re-read when they land.
- **P3 / P6 coupling (named, not decided).** Futility pruning near the leaves and razoring will want the same static
  score at the same nodes. Their ADRs decide whether to share one evaluation per node; this one computes it inside
  the predicate.
- **Module headers** in `src/search.ts` and `src/engine.ts` name the new switch, as they name `ABC-208`'s.
- **Migration:** none. No data, format, option or dependency changes.

## Rollback

- **Before acceptance:** mark this ADR `withdrawn`. Nothing else was edited.
- **After it ships:** set `reverseFutility` to false in `search()` and `chooseMove`, two booleans. The shipped path is
  then node for node the door. Deleting the switch, the predicate, the two doors and the re-points afterwards is a
  mechanical revert of one ticket.
