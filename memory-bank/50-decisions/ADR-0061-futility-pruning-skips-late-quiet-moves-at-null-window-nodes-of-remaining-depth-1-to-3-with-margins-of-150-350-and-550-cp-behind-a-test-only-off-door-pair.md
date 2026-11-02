---
kind: adr
id: ADR-0061
---
# ADR-0061: Futility pruning skips the late quiet moves at null-window nodes of remaining depth 1 to 3, with margins of 150, 350 and 550 cp, in both recursions behind a test-only off-door pair. Every margin from depth 2 up is above a minor piece

## Status

**ACCEPTED, IN FORCE on `main` since 2026-11-02**, at the `ABC-268` merge `e72487e1`. Recorded by Architect/Design
(task `arch-post-268`, records only, on `grugops/arch-post-268` from `main` `56b3782d`).
- **The merge:** the Orchestrator merged on `qe-ABC-268-p2`'s PASS_WITH_GAPS (`…186a743e`), by the owner's "merge on
  pass" (`orch-2026-10-30a` `…77a82ec1`).
- **The part-2 reads, as QE recorded them** (`…d582d7dd`):
  - **`A6` C2′:** 58.0 / 100 against the base `ca6e8506` at 100 ms, so GAIN is MET (bar ≥ 50.0). W/D/L 41/34/25,
    Elo +56.1 ± 56.1, LOS 97.6 %, 0 faults, 0 losses on time.
  - **S′:** 8.0 / 10 against E 1 650 (8/0/2). MET.
  - **Levels deep lane:** 57 / 57, 0 skipped. MET.
- **After the merge, on `main`** (the Orchestrator, `…77a82ec1`): typecheck 0, lint clean, `npm test` 2 429 / 2 429.
  That closes `QE-268-p2-e`. The Orchestrator ruled on `QE-268-p2-a`: the read stands and is not re-played.
- **What 58.0 means** (decision 10): a point estimate ≥ 0. The ± 56.1 interval crosses 0, so it is not a proven
  gain.
- **The shipped search now:** `main`'s `search()` and `chooseMove` carry futility. Their d8 counts are this ADR's
  instrument-check counts (decision 9): 888 786 / 1 262 046 for `search()` and 1 306 981 / 391 451 for
  `chooseMove`, with reach 5.837 at 47 000 nodes. `arch-post-268`'s probe door read all of them again, to the node.
- **What follows from it:**
  - The S′ pool reaches 26 / 30, which fires the upward re-pin (`ADR-0056`, dated line of this date).
  - `ADR-0060`'s decision 1 was re-measured on this `main`. P1 stays parked (`ADR-0060`, dated status of this date).
- **Rollback** is as § Rollback states: two booleans.

*Earlier status, kept:* **ACCEPTED 2026-11-02 by the owner. NOT IN FORCE on `main` until `ABC-268` merges.** His words, verbatim
(`orch-2026-10-30a` `…773be7de`): *"61 yes"*. Recorded by Architect/Design (task `arch-owner-answers-1102b`, records
only, on `grugops/arch-owner-answers-1102b` from `main` `b47adfbb`). Nothing was run.
- **What acceptance releases:** `ABC-268` part 2, from `grugops/ABC-268-fix`. Part 2 is the QE re-check of QE-268-a,
  -b and -c; `A6`, 100 games at 100 ms against the base, GAIN ≥ 50.0; S′, a 10-game smoke at 0.5 s against E 1 650;
  and the Levels deep lane.
- **When it comes into force:** at `ABC-268`'s merge, which happens only if part 2 passes, `A6` included.
- **If `ABC-268` does not merge** (an `A6` miss included), a dated line here reads "accepted, not in force on `main`"
  (`ADR-0026` decision 9's form). `main` then keeps no futility pruning, as the default below says.
- **Until the merge,** `main` has no futility pruning, and the PROPOSED text below is the rule `ABC-268` builds.
  "Acceptance is the owner's" and "the read and the merge wait for acceptance" are settled by this line.

*As proposed, kept:* **PROPOSED** 2026-11-02 by Architect/Design (task `arch-phase2-p3`, records only, on `grugops/arch-phase2-p3` from
`main` `cfff6993`). The probe ran on a scratch copy of the branch's `src/` (tree `f2388e40`, the same as `main`'s at
dispatch and at this commit), outside the repository, under the host lock. The copy is deleted. Nothing was committed
to `src/`. The patch, the driver and every output are under `.grugops/context/arch-phase2-p3/raw/probe/`.

- **Acceptance is the owner's.** A new ADR is his call under the 2026-10-22 delegation
  (`memory-bank/45-standing-rulings.md`). `ADR-0056` (accepted in direction) lists P3 in D2 and in Phase 2 (D6). That
  covers the direction, not this text.
- **The answer that settles it:** *"accept ADR-0061"* or *"decline it"*.
- **Reading (b)**, the `ABC-208` / `ABC-238` / `ADR-0059` precedent: the build and its gates may start while this ADR
  is PROPOSED. The 100-game read (`A6`) and the merge wait for acceptance.
- **Default without an answer:** no futility pruning on `main`.
- **The order is the Orchestrator's.** This is the Phase 2 item that stands without P1 (§ Context, "Why P3"). The
  re-opened `ADR-0060` (P1) and this ticket edit the same two files. Whichever merges second re-reads its door counts
  on the new `main`, under decision 9's instrument rule.
- **What it amends:** no ADR. It follows `ADR-0026` decision 10's pattern: a switch, a pair of doors, off in every
  older door, and rows re-pointed by `ADR-0050` decision 4, `ADR-0058` decision 5 and `ADR-0059` decision 6.

## Context

`EPIC-011` Phase 2 is the pruning block. `ADR-0056` D2 lists P1 (log LMR), P2 (reverse futility), P3 (futility near
the leaves), P4 (move-count pruning), P5 (null-move R by depth) and P6 (razoring). Since `arch-phase2-rebase` the
order is P1 (re-opened) → P4 → P3 → P5 → P6, and P2 is dropped.
- P2 (`ABC-264`, `ADR-0059`) bought +0.70 ply at the 100 ms node budget and still read 44.0 / 100, about −42 Elo.
- P1 (`ADR-0060`) misses two of its own bars on `main`. The `arch-ADR-0060-reopen` hop found no form of nine that
  meets every bar, and it put the 27 cp cap to the owner.

This hop measured the four remaining items on `main`, each alone over `main`'s shipped search, so the result stands
independent of P1.

### The instrument

- **Base:** `main`'s `src/`, patched with switchable knobs in BOTH recursions. With every knob at 0 it is `main`, node
  for node.
- **Instrument check:** the door reads 1 116 785 / 1 602 457 (`search()` depth 8, kiwipete / position-6) and
  1 575 537 / 476 244 (`chooseMove` to depth 8). Those are `ADR-0059`'s door counts.
- **Calibration:** a rebuilt reverse-futility knob (120 cp a ply) reproduces `4d1c0616`'s head counts to the node:
  658 971 / 1 021 190 / 972 596 / 299 183.
- **Runs:** deterministic only, with fixed depth, or `chooseMove` with `maxDepth` / `maxNodes` on a frozen clock.
  `G1` uses its virtual clock. Every run was under `flock` of the host lock, at most 5 min each. No timing was read.
- **Readings:**
  - nodes at depth 8, both recursions;
  - the mean completed depth at 47 000 nodes on `ABC-121`'s 190 (`chooseMove`, `maxNodes`);
  - drift at depth 5 on the 190, both recursions;
  - the mate floor on the 287 at depth 5;
  - `ADR-0050` d9's seven zugzwang rows;
  - `G1`;
  - firing at depth 6;
  - the **cut audit**, below.

### The cut audit: the tactical check that the drift oracle is not

`ADR-0059` § Status item 4 guessed that `ABC-264` lost to "the depth-1 guess under a piece's value": a cut that
skips a fork. It also noted that the drift oracle cannot see this, because minimax mutes interior errors at the root.
So this hop built a cheap check that looks at the interior node itself.

- **How it works.**
  1. `search()` runs at depth 6 (the depth reached at 100 ms) over the 190 rows plus 6 endgames, and every N-th node
     where the rule fires is recorded as FEN, remaining depth and window.
  2. Each sampled node is searched fresh (cleared table, at ply 1, so not a root) three times: with the rule at the
     node's null window, without it at the same window, and without it at a full window. The third is the reference
     value v.
  3. A **flip** is a node where the rule and the door fall on opposite sides of alpha. Its **error** is how far v lies
     beyond the bound the rule claimed, in centipawns.
- **What it sees.** A skipped fork or threat shows as a flip with an error of a piece (300 cp or more). It needs no
  production hook: it runs on a scratch copy, as the probe did. Each candidate costs about 20 s. The check is the one
  reading that separated the items here, where drift did not.
- **Calibration on reverse futility** (`ADR-0059`'s rule, 120 cp a ply):

  | sample | flips | error ≥ 200 cp | error ≥ 300 cp |
  |---|---|---|---|
  | 28 486 sampled cuts | 24 (0.08 %) | 1 | 0 |

  - By depth, the flips were 23 of 24 380 at depth 1, 1 of 3 731 at depth 2 and 0 of 375 at depth 3.
  - **Sensitivity:** the flip rate rises as the margin falls: 0.25 % at 40 cp (one 386 cp promotion threat), and
    0.42 % at a zero margin.
- **What that says about `ABC-264`, plainly.** At the nodes it cut, reverse futility agreed with the depth-d search
  it replaced in 99.92 % of samples, and it was never wrong by a piece. **The "skipped forks" judgement is not
  supported by this instrument.** The −42 is then one of two things:
  - noise: P(≤ 44 | 0) = 0.095, and P(≤ 44 | +20) = 0.023;
  - or a cost outside the cut verdicts. Examples: fail-hard beta with nothing stored; changed table and killer
    state; game positions unlike the 190. None of these is measured.
- **So the audit is a guard, not a predictor.** It stops a rule that makes piece-sized errors. Passing it does not
  promise a gain. `ADR-0059` gets a dated line with these figures.

### What the probe measured

Each item alone, over `main`. Depth 8 ratios are head / door. Reach is the gain in mean completed depth at 47 000
nodes on the 190. Drift is at depth 5 on the 190 (within 25 cp; max). The audit gives the flip rate and the count of
errors of 200 cp or more.

| item, form | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | reach | drift `search()` / `chooseMove` | mate | zugzwang | audit | `G1` |
|---|---|---|---|---|---|---|---|---|
| **P3 futility, 150 / 350 / 550 cp, d ≤ 3 (chosen)** | **0.796 / 0.788** | **0.830 / 0.822** | **+0.279** | **100 %, 10 / 100 %, 0** | **0 / 189** | **7 / 7** | **0 of 2 943; 0** | **54 / 58** |
| P3, 150 / 350 / 550 / 750, d ≤ 4 | 0.752 / 0.774 | 0.799 / 0.798 | +0.321 | 100 %, 10 / 100 %, 0 | 0 / 189 | 7 / 7 | 0 of 3 021; 0 | — |
| P3, 100 / 200 (linear 100 a ply), d ≤ 2 | 0.797 / 0.801 | 0.871 / 0.837 | +0.268 | 100 %, 0 / 100 %, 0 | 0 / 189 | 7 / 7 | 3 of 3 227 (d2 0.27 %); 0 | 54 / 58 |
| P3, 200 / 400 / 600, d ≤ 3 | 0.813 / 0.809 | 0.844 / 0.830 | +0.263 | — | — | — | 1 of 2 700; 0 | — |
| P3, 150 / 300, d ≤ 2 | 0.832 / 0.819 | 0.858 / 0.855 | +0.226 | — | — | — | — | — |
| P3, 150 / 350, d ≤ 2 | 0.840 / 0.835 | 0.867 / 0.872 | +0.210 | — | — | — | 0 of 2 880; 0 | — |
| P3, 150, d = 1 only | 0.952 / 0.947 | 0.953 / 0.948 | +0.079 | — | — | — | 0 of 1 895; 0 | — |
| P4 move-count, 3 + d², d ≤ 3 | 0.721 / 0.756 | 0.801 / 0.687 | +0.426 (38 moves differ) | **87.7 %**, 79 / 95.7 %, 82 | 0 / 189 | 7 / 7 | **11.5 %; 8** | — |
| P4, 3 + d², d ≤ 2 | 0.817 / 0.973 | 0.922 / 0.754 | +0.342 (36 differ) | **89.3 %**, 79 / 95.7 %, 82 | 0 / 189 | 7 / 7 | **11.9 %; 15** | — |
| P4, 3 + d², d = 1 | 0.986 / **1.030** | 0.946 / **1.096** | — | — | — | — | — | — |
| P4, (3 + d²) / 2, d ≤ 3 | 0.683 / 0.654 | 0.771 / 0.636 | +0.500 (44 differ) | — | — | — | — | — |
| P5 null move, R = 3 + ⌊d / 4⌋ | 0.947 / 0.930 | 0.925 / 0.883 | +0.058 | 100 %, 0 / 100 %, 0 | 0 / 189 | 7 / 7 | 0 of 2 076; 0 | — |
| P5, R = 3 + ⌊d / 3⌋ | 0.936 / 0.927 | 0.922 / 0.644 | +0.089 | — | — | — | — | — |
| P5, eval term only (+1 per 200 cp, cap 2) | 0.997 / 0.998 | 0.997 / 0.998 | — | — | — | — | — | — |
| P6 razoring, 250 / 450 / 650, d ≤ 3 | 0.792 / 0.812 | 0.793 / 0.833 | +0.305 | 95.7 %, **345** / 97.3 %, 92 | 0 / 189 | **6 / 7** | **1.98 %; 6** (one missed mate) | — |
| P6, 300 / 500, d ≤ 2 | 0.875 / 0.884 | 0.858 / 0.903 | +0.221 | 97.9 %, 92 / 98.4 %, 92 | 0 / 189 | **6 / 7** | **1.43 %; 4** | — |
| P6, 300, d = 1 | 0.962 / 0.960 | 0.936 / 0.975 | +0.084 | — | — | — | — | — |

- **Reach baseline:** the door's mean completed depth is 5.558 at 47 000 nodes, the same as `ADR-0060`'s `main`
  figure.
- **The chosen P3 form at 20 000 nodes:** 4.426 → 4.842 (+0.416), 76 rows deeper and 0 shallower.
- **Firing at depth 6 on the 190** (`search()`): 0.803× the door's nodes. 30 272 nodes fire, which is 2.1 per
  1 000 nodes visited, and 901 655 moves are skipped.
- **Depth 8 values:** the root move and score are unchanged on all four readings.
- **Zugzwang node counts against the door at the recorded depth:** `zugzwang.004` 905 900 against 587 282 (1.54×,
  still h3h4); `zugzwang.005` 1 310 019 against 2 412 618; the other five at 0.71–0.87× the door's nodes.

### Why P3: the item that pays, stays exact enough and stands without P1

- **P4 (move-count pruning) is not ready.** Without a history order, the late quiet moves are in generation order, so
  it prunes arbitrary quiet moves.
  - It reaches deepest (+0.34 to +0.50), but it changes a fifth of root moves.
  - It fails the drift bar (87.7 % within 25 cp in `search()`) and makes the most piece-sized errors (8 to 15 flips
    of 200 cp or more per ~2 800 samples).
  - Its depth-1 form costs nodes on position-6 (1.03× / 1.10×).
  - D2 ties it to P1. The measurement ties it to an ordering of quiets, which is O1h (`ABC-233`). It waits for O1h.
- **P6 (razoring)** pays like P3. But it loses `zugzwang.004` in both measured forms, it drifts up to 345 cp, and its
  audit shows 1.4–2.0 % flips, with piece-sized ones and one missed mate. Its depth-1 return of the quiescence score
  hides the side to move's quiet defences. It is rejected on this evaluation.
- **P5 (depth-grown R)** is clean, as expected: it is depth-gated. At 47 000 nodes it reaches only +0.06 to +0.09,
  and its pay is at depth (`ADR-0056` C2′ names P5 depth-gated). Its outlier (`chooseMove` position-6 0.644 at
  ⌊d / 3⌋) is one reading. It suits a NEUTRAL (invisible at 100 ms) ticket with a deep-depth bar, later.
- **P3 (futility)** has a clean safety record and real pay:
  - Measured: 0.79–0.83× at depth 8 and +0.279 ply at the 100 ms budget, close to P1's +0.25 bar. Drift is 100 %
    within 25 cp (max 10). Mate is 0 / 189, zugzwang 7 / 7, `G1` 54 / 58, and the audit shows 0 flips.
  - It reads no move number and no reduction, so it does not depend on P1. Its D2 dependency, "P2", was a sequencing
    note, not a mechanism. It was measured here without P2.
  - It costs an S: one node test, one move test, a switch and two doors.

### The margins: ABC-264's lesson as a design rule

- **At remaining depth 1,** a quiet move's child is a quiescence node, where the opponent may stand pat. So the
  move's value is at most the static evaluation after it, unless it gives check, and checks are never skipped. The
  depth-1 margin only has to cover a quiet move's own change in evaluation (piece-square, mobility up to ±100, pawn
  terms): 150 cp. Measured: 0 flips at depth 1 for every margin from 100 cp up.
- **From remaining depth 2 up,** a skipped quiet move could be a threat that the remaining plies would cash: a fork,
  or an attack on a pinned or trapped piece. **So each margin sits above the piece such a threat most often wins:**
  - 350 cp at depth 2, above a minor piece (325);
  - 550 cp at depth 3, above a rook (500).
  - The margin form `ADR-0059` used (120 a ply, under a piece at every depth) is the form this rule refuses.
- **Measured: the rule tracks the margin.** The linear 100 / 200 form shows flips at depth 2 (0.27 %, up to 110 cp),
  and 200 / 400 / 600 shows one. 150 / 350 / 550 shows none in 2 943 samples.
- **The residual, named:** a threat worth more than the margin, such as a fork of king and queen at depth 2, can
  still be skipped. The audit is the check that watches for it.

## Decision

1. **The rule.** At a node in either recursion where **every** condition holds:
   - it is not the root (`ply > 0`);
   - it was entered with a null window (`alphaIn + 1 === beta`, read from the entry window);
   - the remaining depth `d` is 1, 2 or 3;
   - the side to move is not in check;
   - alpha and beta are both strictly inside (−`MATE_FLOOR`, `MATE_FLOOR`);
   - and `evaluate(position) + M[d] ≤ alpha`, with **M = 150 / 350 / 550 cp** for d = 1 / 2 / 3.

   Then every move after the first in the ordered list (index ≥ 1) that **neither captures nor promotes nor gives
   check** is skipped. It is not made, not searched and not counted as a node.
   - **The first move is always searched**, whatever it is. Captures, promotions and checking moves are always
     searched.
   - **The index still advances past a skipped move**, so the LMR index of later moves is unchanged.
   - **The node returns the best score among the moves searched**, fail-soft, and stores it as today
     (`boundOf(best, alphaIn, beta)`). With every searched move at or below alpha, that is an upper bound, as the door
     would store.
   - **The node test runs once per node**, after the table probe and the null move and after the move list exists.
     Before any move is made, it costs one `evaluate` and one `isInCheck` per eligible node.
2. **Two new exported pure functions in `src/search.ts`.**
   - `futilityNode(position, depth, ply, alphaIn, beta): boolean` is decision 1's node test. It derives the check and
     the evaluation from the position, as `ADR-0026` decision 6 requires. The caller supplies only depth, ply and the
     window, which no position carries.
   - `futileMove(position, move, index): boolean` returns true for index ≥ 1 and a move that neither captures nor
     promotes nor gives check (`givesCheck`, as `ABC-206` answers it).
   - The margins are one module constant, `FUTILITY_MARGIN = [0, 150, 350, 550]`. It is never written after load.
   - Both functions are pure: the position is byte-identical on return.
3. **One switch, `futility`, in BOTH recursions:** `src/search.ts`'s `Switches` and `src/engine.ts`'s `Heuristics`.
   - It is on in `search()` and `chooseMove` only.
   - It reaches the recursion as a switch. It is never module state, an `EngineOptions` field or a parameter of
     `search()` (`ADR-0026` decision 2).
4. **Two TEST-ONLY doors: `searchWithoutFutility(position, depth)` and
   `chooseMoveWithoutFutility(position, options)`.**
   - Each is the shipped path with `futility` off and everything else on. Node for node, they are the pre-ticket
     `search()` and `chooseMove`.
   - The engine door takes no depth (`ABC-078` `A4`).
   - **Export lists:** `ABC-077` `A6` (`src/search.ts`) grows by **three**: the door and the two predicates.
     `ABC-078` `A4` (`src/engine.ts`) grows by **one**, its door.
5. **Every door that exists before the ticket turns `futility` off** (`ADR-0026` decision 3's ladder rule).
   Futility is the top rung, and every older door reads exactly as today. If P1 merges first, its door
   (`…WithoutLogReductions`) also turns futility off, and this ticket's doors keep log reductions on: one rung each,
   in merge order.
6. **Rows follow `ADR-0050` decision 4, `ADR-0058` decision 5 and `ADR-0059` decision 6, by reference.**
   - A row whose shipped side is `search()` or `chooseMove`, and whose other side is an older door, re-points its
     shipped side to the new door of the same recursion. Its figures do not change.
   - Value and behaviour rows on the shipped path stay there: the zugzwang rows, the mate rows and `G1`. A row that
     moves is re-pinned, with old and new figures in the PR.
   - **No zugzwang row's depth is re-pinned.** A row that needs a deeper search is F3, not a re-pin.
7. **The rows this ticket adds (the instrument for `A2`).**
   - **`futilityNode`, called directly**, on a constructed position at d = 1, 2, 3:
     - true at `evaluate + M[d] = alpha` exactly, and false at alpha − 1;
     - false at the root, at a PV window, at d = 0 and d = 4, in check, with alpha in the mate band, and with beta in
       the mate band. Each clause is tested on a node where every other clause would prune.
   - **`futileMove`, called directly:** false at index 0, for a capture, for a promotion, and for a quiet move that
     gives check. True for a quiet, non-checking move at index ≥ 1.
   - **A source row** reads both `negamax` bodies. With `futility` on, each calls `futilityNode` once per node with
     the entry window. It skips exactly the moves `futileMove` names, and advances the index past each.
8. **The bounded oracle (`A3`).**
   - **Drift at depth 5 on the 190, in BOTH recursions.** `search()` is read against `searchWithoutFutility`, and
     `chooseMove` against `chooseMoveWithoutFutility`, deepened to 5.
     - Bar: **every non-mate score within 25 cp, and 0 mate scores change sign.** Mate-status flips are reported.
     - Measured: 100 %, max 10 cp (`search()`, position-3/b4b2 41 → 51); `chooseMove` 100 %, max 0.
     - 25 cp is 2.5× the measured maximum, and it is the band edge. No looser cap is admissible.
   - **Mate floor on the 287 at depth 5** (`search()`, `ADR-0059`'s form): every position the door scores as a mate,
     the head scores as a mate of the same sign. Measured: 0 of 189.
   - **Zugzwang:** `ADR-0050` d9's seven rows, `chooseMove` at their recorded depths, each plays its recorded move.
     Measured: 7 / 7.
   - **(d) The cut audit, the tactical check** (§ Context). It is read on a scratch copy of the build with a sampling
     hook that is never in production code.
     - The sample: `search()` at depth 6 over the 190 plus the 6 endgames, every 10th node where the rule skips a move.
       Each is re-searched fresh three times, as § Context describes.
     - Bars: **flips ≤ 0.5 % of the sampled nodes, and 0 flips with an error of 200 cp or more.**
     - Measured: 0 of 2 943 (depth 1: 1 918, depth 2: 966, depth 3: 59).
     - It reds P6's forms (1.43–1.98 %, 4–6 errors of 200 cp or more) and P4's (11.5–11.9 %). The linear 100 / 200
       form passes it (3 flips, at most 110 cp): the bar stops piece-sized errors, not every margin under a piece.
     - The error clause depends on the sample, so the sample is fixed exactly as above. On a deterministic build the
       counts reproduce.
   - **Scope, said plainly:** this oracle is a regression net and a guard against the tactical class. It is not a
     proof of strength. Reverse futility's audit was nearly clean (0.08 % flips, one 201 cp error in 28 486), and it
     still lost (§ Context).
9. **`A4`, its premise and its bars.** They are pre-registered here and not loosened after Ready.
   - **(a) Nodes at fixed depth 8 on kiwipete and position-6, in BOTH recursions:** ≤ **0.88×** the door's on each of
     the four readings.
     - Measured: 0.7958 (888 786 / 1 116 785), 0.7876 (1 262 046 / 1 602 457), 0.8295 (1 306 981 / 1 575 537) and
       0.8220 (391 451 / 476 244).
     - It reds the switch left unwired (1.00×) and a depth-1-only rule (0.95×).
   - **(b) Depth reached at 47 000 nodes on the 190** (`chooseMove`, `maxNodes: 47_000`, frozen clock): the mean
     completed depth is **≥ the door's + 0.20 ply**. Deeper and shallower counts are reported.
     - Measured: 5.558 → 5.837 (+0.279), 54 deeper, 1 shallower, 6 root moves differ.
     - It reds a depth-1-only rule (+0.079) and P5 (+0.058).
   - **(c) `G6` "≥ base"** by its rule (floor 6).
   - **The instrument check, not a bar.** On `main`'s `src/` tree `f2388e40`, a faithful build reproduces the probe's
     head counts to the node: 888 786 / 1 262 046 (`search()`) and 1 306 981 / 391 451 (`chooseMove`), with reach
     5.558 / 5.837.
     - If `main`'s search has moved by the time of the build (for example P1 merged), the Engineer first re-reads the
       door's counts. A count that differs is explained in the PR before `A4` is read.
     - The bars stay. A re-derived count is a dated line here, never a moved bar.
   - **`A5` `G1`:** ≥ 54 / 58 with no NEWLY-MISSED line. Measured: 54 / 58, none newly missed or solved.
10. **The read and the reports (`A6`, `ADR-0056` C2′ / D5 as folded):** C2′ is 100 games at 100 ms against the
    merge-base. S′ is 10 games at 0.5 s against Stockfish 19 at E 1 650. The Levels deep lane runs on the candidate
    head. All three are by reference.
    - **The intent is GAIN (≥ 50.0 of 100).** It is named before the read and never re-classed after a score is seen.
    - **Why GAIN:** the mechanism fires at 100 ms. At depth 6 it skips 901 655 moves at 30 272 nodes (0.803× the
      door's nodes), and at the 100 ms node budget it reaches +0.279 ply. NEUTRAL (invisible at 100 ms) is not open to
      it.
    - **What 100 ms can resolve, said before the read.** By `ADR-0055`'s 50–100 Elo a speed doubling, a 0.79–0.83×
      node saving suggests about +15–35 Elo (estimate, [D]/[J]), inside D2's +15–40. C2′ resolves about ± 48 at 95 %.
      So GAIN means "point estimate ≥ 0", not a proven gain. P2 is the warning: twice this reach, and it lost.
    - **R-TC part 1, item 2, read at review:** the diff reads no budget, deadline, `movetime` or environment. The rule
      is keyed on depth, ply, the window, the move and the position only.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 1 — margins | the drift bar red in either recursion (a non-mate score beyond 25 cp, or a mate sign change) | decision 8, `A3` | a defect first: check the guards and the margins against decision 1. Red on an exact match: NOT MET, and this ADR is re-opened with a new probe. No fallback margin is pre-chosen |
| **F2** | 1 — mates | a door mate at depth 5 on the 287 not a same-sign mate for the head | decision 8 | a defect (the mate-band and check guards first) |
| **F3** | 1 — zugzwang | any of `ADR-0050` d9's seven rows not played at its recorded depth | decision 8 | a defect. Never a re-pin to a deeper depth |
| **F4** | 1 — the tactical class | the cut audit above 0.5 % flips, or any flip of 200 cp or more | decision 8 (d) | NOT MET. The margins are not raised after the read; a new form is a new ticket |
| **F5** | the premise, it pays | `A4` (a) above 0.88× on any of the four readings, (b) under +0.20 ply, or `G6` below base | decision 9 | the ticket is not merged; this ADR reads "accepted, not in force" |
| **F6** | the premise, strength | C2′ NOT MET (< 50.0 of 100), or an S′ collapse | decision 10 | the same as F5. The next item is the Orchestrator's: P5 as NEUTRAL with a deep bar, or P1 if re-opened green. P4 waits for O1h |
| **F7** | 4, 5 — the doors | a new door not node-equal to the pre-ticket shipped search, or an older door not node-equal to its pre-ticket self, on the `ABC-078` `A3` corpus | `A1` (`G4`) | a defect in the door or the switch wiring |
| **F8** | regression | `G1` below 54 / 58, or a NEWLY-MISSED line | `A5` | classed per row under `ADR-0034`; an unexplained loss is a defect |

## Alternatives

- **P1 first (`ADR-0060`).** It is re-opened, and no measured form meets every bar on `main`. Its fate waits for the
  owner's word on the 27 cp cap. P3 does not wait for it.
- **P4, move-count pruning.** Rejected for now by measurement: drift 87.7–89.3 % (bar 95 %), 11.5–11.9 % audit flips
  with piece-sized errors, and a fifth of root moves changed at the 100 ms budget. It needs a quiet-move order (O1h)
  before its count means "late".
- **P6, razoring.** Rejected by measurement: it loses `zugzwang.004`, drifts up to 345 cp, and shows 1.4–2.0 % audit
  flips with one missed mate.
- **P5, R grown with depth.** It is clean, but depth-gated: +0.06 to +0.09 ply at the 100 ms budget. It suits a
  NEUTRAL ticket with a deep-depth bar (`ADR-0056` C2′). It is not the best Elo per cost at 100 ms.
- **The linear 100 cp a ply form (100 / 200).** About as cheap and almost as deep (+0.268). Rejected: its depth-2
  margin is under a minor piece, and it shows flips there (0.27 %), which is the class `ABC-264` warns of.
  `chooseMove` position-6 also reads 0.837 against 0.822.
- **Depth 1 only (150).** Exact by construction, but small: 0.95× and +0.079 ply. Rejected as below the pay bar.
- **Depth 4 too (750 cp).** Measured clean, and better: 0.75–0.80× and +0.321. Not taken now.
  - Its margin is under a queen at a depth where a 4-ply line can win one.
  - Its audit sample at depth 4 is thin (100 nodes).
  - It is the boring range's edge, and the textbook form stops at 3.
  - A dated amendment may add it after this ticket's read, with its own audit and reach rows.
- **Guarding futility with "three non-pawn pieces"** (null move's zugzwang guard). Not taken: futility only skips
  moves of the side to move; it never passes. Zugzwang 7 / 7 without it.
- **Change an existing predicate in place (no door).** Rejected by `ADR-0026` decision 10's pattern: every older row
  would change meaning.

## Consequences

- **NFRs.**
  - `NFR-005`: expected to improve (fewer nodes per depth); read by `G6`, floor 6 unchanged.
  - `NFR-004`: abort granularity unchanged; no new throw site.
  - `NFR-008`: the predicate rows and the source row are default-lane units with no search. Drift, mate floor,
    zugzwang and reach go behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1`. Reach costs about 18 M nodes, about 25 s as
    measured here. The cut audit is a QE scratch reading, not a lane test.
  - `NFR-009`: a four-entry constant. Nothing grows per search.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** the rule is pure and keyed on the position, depth and window. The same input and
  virtual clock give the same move.
- **Eval-scale coupling, named.** The margins are in the evaluation's centipawns. E1 / E2 (taper, tuning) re-scale
  it, so the margins are re-read on the new scale by a dated amendment, with the audit and drift rows re-run. The
  piece values (325 / 500) they sit above are in `src/evaluate.ts`.
  - *Dated 2026-11-02 (`arch-E1`, records only; probe on a scratch copy of `main`'s `src/` `58fa3eb4`): E1's scale.*
    E1 (`ADR-0064`) keeps every material value and every middlegame value, so it is identical to `main` at phase 24.
    Decision 8's drift and mate-floor rows were re-read with E1's evaluation on both sides, BASE as the control
    (which reproduced 100 % / max 10 and 0 / 189): 100 % within 25 cp, max 0, in both recursions; mate floor 0 / 190.
    The margins hold on E1's scale. The cut audit (d) is owed by the E1 build as a QE scratch reading
    (`ADR-0064` decision 8 B5), with its bars unchanged. E2 re-scales the evaluation, so it owes the full re-read.
- **P1 coupling:** file collision only (`src/search.ts`, `src/engine.ts`). The rule reads no move number or reduction.
  The second to merge re-reads its door counts (decision 9).
- **P4 coupling, later.** Move-count pruning would share this node test's guards. Its ADR decides whether it shares
  the predicate.
- **Threads (`ABC-265`–`ABC-267`, `ADR-0062`):** no interaction. The rule is per node and edits no
  `src/transposition.ts` line.
- **Module headers** in `src/search.ts` and `src/engine.ts` name the new switch.
- **Migration:** none. No data, format, option or dependency changes.

## Rollback

- **Before acceptance:** mark this ADR `withdrawn`, and strike the dated lines in `ADR-0056` D2 and `ADR-0059`
  § Status. Nothing else was edited.
- **After it ships:** set `futility` to false in `search()` and `chooseMove`, two booleans. The shipped path is then
  node for node the door. Deleting the switch, the two predicates, the constant, the two doors and the re-points
  afterwards is a mechanical revert of one ticket.
