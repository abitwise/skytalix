---
kind: adr
id: ADR-0064
---
# ADR-0064: The evaluation is tapered by one phase (N 1, B 1, R 2, Q 4, out of 24). Every term is held as a middlegame and endgame pair in one parameter table. At E1 only the king square (`ABC-231`) and the passed pawns (`ABC-232`) get endgame halves of their own, blended in the existing board walk, behind a test-only off-door pair

## Status

**PROPOSED** 2026-11-02 by Architect/Design (task `arch-E1`, records only, on `grugops/arch-E1` from `main`
`a2b593d5`). The probe ran on a scratch copy of `main`'s `src/` (tree `58fa3eb4`), outside the repository, under the
host lock. The copy is deleted, and nothing was committed to `src/`. The patch, the driver and every output are under
`.grugops/context/arch-E1/raw/probe/`. The PREREG `…01c2d6a5` was sealed and committed (`b11b802f`) before any
measured run.

- **This is `EPIC-011` row E1** (`ADR-0056` D2, D6 Phase 4), pulled forward by `arch-next-pull`'s ranking
  (`…7e3ace66`). It folds `ABC-231` (the king by phase) and `ABC-232`'s phase scaling (passed pawns by phase).
  `ABC-232`'s other passer terms are E4's. `ABC-205` stays dropped.
- **Acceptance is the owner's.** A new ADR is his call under the 2026-10-22 delegation
  (`memory-bank/45-standing-rulings.md`). `ADR-0056` (accepted in direction) lists E1. That covers the direction, not
  this text.
- **The answer that settles it:** *"accept ADR-0064"* or *"decline it"*.
- **Reading (b)**, the `ABC-208` / `ADR-0059` / `ADR-0061` precedent: the build and its gates may start while this ADR
  is PROPOSED. The 100-game read and the merge wait for acceptance.
- **Default without an answer:** `main` keeps its untapered evaluation.
- **`Q-3K-4` is open and live** (`G6` "≥ base"; `ADR-0056` D7). This design works under both answers; decision 8
  item B7 says how each one grades `G6`. The build does not wait for his answer. Grading `G6` does.
- **What it amends or revises:**
  - It revises `ABC-083` § Out of scope's "untapered by decision" (`src/evaluate.ts`'s header and `:220`), as
    `ABC-205`'s cut announced.
  - It carries the taper half of `ADR-0031` § Addendum 2026-10-24 (the king's endgame rule, the phase weights) in the
    form of decision 2. The addendum's queen scale and shelter gate stay "accepted, not shipped", as input to E3. A
    dated line there says so.
  - It answers `ADR-0061` § Consequences' "eval-scale coupling" for E1: the drift and mate-floor rows were re-read on
    this scale and are clean (§ Context). The cut audit is owed by the build (decision 8, B5). A dated line there says
    so.
  - It follows `ADR-0026` decision 10's pattern: a switch, a pair of doors, off in every older door.

## Context

### Why E1, now

- **The evidence** (`arch-next-pull` `…d0f1a5fc`): on 145 self-play positions, 31 of the 48 errors of 50 cp or more at
  the 100 ms node budget (47 000 nodes) survive two doublings of search. 11 of 13 survive after 60 plies. Evaluation
  reads as the bigger lever. Every open pruning or ordering item buys well under one doubling.
- **What `src/evaluate.ts` is today:** one pass over the board, nothing tapered. The king table hides the king in
  every phase (`KING_TABLE`, centre −20 to −50 on every rank). Passed pawns are scored by rank only
  (`PASSED_PAWN_BONUS`, 0 5 10 20 35 60 100). The pawn memo already keeps the passed part apart from the rest
  (`passedPart`, the `arch-ABC-235` seam "so `ABC-232` can blend the passed part by phase outside the cache").
- **E1 is E2's prerequisite** (`ABC-239`, the tuner). A tuner needs a middlegame and an endgame half for each weight.

### What killed `ABC-205`, and what that means here

- `ABC-205` shipped a queen scale, a shelter gate and a taper together. It closed unmerged on `G6`'s "≥ base" clause
  alone. On position-6 at 3 s, base read 8 7 8 7 8 and the head read 7 7 7 7 7. That was cost, not play: D was never
  run.
- **Its taper alone grew position-6's tree by +3.2 % to depth 8** (frozen clock, deterministic). Base sat on its
  depth-8 edge (3 of 5 runs). The `ADR-0031` addendum's status line records that the gate, not the blend, carried most
  of the growth.
- **So any evaluation that changes values can change the tree on the `G6` boards**, in either direction, and a board
  sitting on a depth edge can flip its median on a few percent. Per-node cost can be designed near zero. Tree shape
  can only be measured. That is why `Q-3K-4` matters for E1 and should be put to the owner now (§ Status).

### The instrument

- **The base:** `git archive` of `main`'s `src/` (tree `58fa3eb4`), outside the repository.
- **The patch:** `patch_e1.py` adds `E1CFG` to `src/evaluate.ts`. `on = 0` is `main`, node for node.
- **The driver:** `e1probe.ts`.
- **The batches:** each under `flock <host-test.lock> timeout 300`. Walls: 9 s, 18 s, 11 s, 30 s and 19 s.
- **Readings:** deterministic counts only. No timing is read.
- **The closed set** (PREREG):
  - BASE (`main`);
  - **L**, linear phase: weight w = phase, D = 24;
  - **P**, plateau: pure middlegame at phase ≥ 22, pure endgame at phase ≤ 6.
  - Both carry the same two value changes, decision 3's.
- **Instrument check: exact.**
  - BASE reproduces `main`'s door to the node: `search()` d8 888 786 / 1 262 046, `chooseMove` d8 1 306 981 / 391 451
    (kiwipete / position-6).
  - BASE's 145 moves at 47 000 nodes equal `arch-next-pull`'s move for move, score for score, node for node.
  - Stockfish's best move and score are identical on all 145 between that run and this one.

### What the probe measured

**The `G6` shape.** `chooseMove` nodes to complete each depth, against BASE (BASE counts in brackets):

| board | depth | L | P |
|---|---|---|---|
| kiwipete | 7 (650 620) | 1.0357 | 1.1854 |
| kiwipete | **8** (1 306 981) | **0.9922** | 1.1286 |
| kiwipete | **9** (2 842 284) | **0.9617** | 1.1132 |
| position-6 | 7 (194 791) | 0.9949 | 0.9969 |
| position-6 | **8** (391 451) | **1.0344** | 1.0369 |
| position-6 | **9** (915 007) | **1.0120** | 1.0127 |
| position-6 | **10** (1 684 330) | **1.0050** | 1.0032 |

- **The PREREG statistic S** is the largest ratio over the bold rows: **L 1.0344, P 1.1286.**
- `search()` d8, a report: L 0.9446 / 1.2154, P 1.2339 / 0.9922 (kiwipete / position-6). `search()` is not `G6`'s
  recursion.
- Root moves: L keeps BASE's move on both boards at every depth. P plays d5e6 on kiwipete at d7–d8.
- Where 4 000 ms lands on today's `main` (which depth completes on each board) is `UNKNOWN - verify`. It is a timing,
  and QE reads it at the build. The ratios at d9 and d10 are the likely edges.

**The per-node work proxy** (BASE, `chooseMove` d8, kiwipete / position-6; measured counts, then an estimate):

- evaluate calls per node: 0.900 / 0.873;
- pieces walked per call: 25.46 / 26.88, of which pawns 13.22 / 14.70, so about 10.2 phase-weighted pieces;
- squares reached by mobility per call: 64.4 / 60.4.
- **What E1 adds per call** (decision 6's form): about 10 phase adds (one small-table load and one add each), two king
  deltas (a load, an add and a sign), one passer add, and one clamp, multiply, divide and truncate. That is about 30
  simple operations, with no new loop and no new board read.
- **Estimate** (`UNKNOWN - verify`; the build's `G2` reads it): `ADR-0055` puts the whole material + PST walk at 4.2–5.3 %
  of self time (O1-e). E1's addition is a fraction of that walk's work, so **about 1–2 % of node time**. The two-half
  pawn memo adds one 4-byte read on a hit and one write on a miss.

**The play premise checks** (all pre-registered; each form against BASE):

| check | L | P |
|---|---|---|
| mirror, `Object.is`, `G3`'s 184 | 0 mismatches | 0 |
| mate floor, BASE d4 → form d5, the 287 | 0 / 163 | 0 / 163 |
| mate floor, same depth d5 | 0 / 189 | 0 / 189 |
| zugzwang, `ADR-0050` d9's seven rows | **7 / 7** | 7 / 7 |
| `G1`, 58 puzzles | 54 / 58, none newly missed | 55 / 58, one newly solved |

- **Both forms are eligible. The pre-registered choice rule picks L** (S 1.0344 against 1.1286).

**The static shapes** (L; P reads the same):

- Six king-and-pawn endings, the centre king minus the corner king: **+44 to +95 cp**. BASE reads −35 to −86.
- Seven full-material positions (the start, kiwipete, position-6 and four middlegames, all at phase 24): **form minus
  BASE = 0 on all seven.** At phase 24 the blend is the middlegame half exactly.
- The six passer positions were whole-evaluation readings, and the king term confounds them. They decide nothing.
  Decision 8's passer row isolates the term.

**Reports** (not bars; they decide nothing):

- **Reach at 47 000 on the 190:** BASE 5.837, L 5.879 (+0.042), P 5.868.
- **Drift at d5, `chooseMove`, the 190:** L 98.40 % within 25 cp, max 61 cp (kiwipete/f3f4, 494 → 555), 0 sign
  changes, 0 mate flips, 2 root moves differ. P: 97.86 %, max 60, 3 moves differ. Drift is expected for an evaluation
  change. This is a different evaluation, not a pruning error.
- **`ADR-0061` decision 8 re-read on this scale** (added after the PREREG, a report; BASE is the control and reproduces
  `ADR-0061`'s 100 % / max 10 and 0 / 189):
  - L: futility drift 100 % within 25 cp, max 0, in both recursions;
  - mate floor 0 / 190.
  - The futility margins hold on E1's scale.
- **The default test lane, with every path tapered** (added after the PREREG, a report): a full scratch copy with L
  hard-wired on, against the same copy off.
  - Off: 2 429 / 2 429. On: **40 reds in 7 files.** `src/evaluate*.test.ts` stays green: the mirror, `ABC-083` A2 / A3,
    `ABC-082` A4 and `ABC-215`'s rule rows.
  - The reds are pinned values and fixture properties: quiescence's Q-SET static and shipped scores (18), engine
    `ABC-170` A1 and `ABC-230` / `ABC-249` endgame rows (8), transposition pins (5), futility `QE-268-b` (3), ordering
    pins (3), pvs-lmr A4 (2), and null-move `QE-208-a`'s abort count (1). The list is in `out/E-lane-reds.txt`.
  - It is an upper bound. Decision 7's ladder keeps every older door untapered, so door-side readings do not move.
    The deep lanes were not run.

**The evaluation instrument** (information only; never a bar or a choice):

| at 47 000 nodes, the 145 | mean loss | errors ≥ 50 / 150 / 300 | Stockfish's best | after 60 plies: errors |
|---|---|---|---|---|
| BASE | 54.1 | 48 / 15 / 7 | 46.2 % | 13 |
| **L** | 55.7 | 49 / 16 / 7 | 46.2 % | 16 |
| P | 51.8 | 39 / 16 / 9 | 52.4 % | 11 |

- L against BASE: 17 positions better, 12 worse; 4 errors fixed, 5 new.
- P against BASE: 28 better, 11 worse; 11 fixed, 2 new.
- **Read plainly:** on this corpus L is level with `main`, and P reads better. The PREREG fixed before the run that this
  reading never chooses. A rule fitted to a fixed 145 measures nothing about Elo. P's phase limits are two of decision
  4's parameters, so E2's tuner owns them (§ Alternatives).

## Decision

1. **Phase.**
   - phase = Σ over both sides of N 1, B 1, R 2, Q 4. It is gathered in the existing board walk, in the non-pawn branch
     that already exists, and clamped to 24. The start is 24, and a pawn ending is 0.
   - The blend weight is **w = clamp(phase − `PHASE_EG`, 0, D)**, with D = `PHASE_MG` − `PHASE_EG`. **At E1,
     `PHASE_MG` = 24 and `PHASE_EG` = 0** (form L), so w = phase.
2. **The blend, one per evaluate call, mirror-exact.**
   - The score is **trunc((mg × w + eg × (D − w)) / D)**, where mg and eg are the white-minus-black sums of every
     term's two halves.
   - Because mg is an integer, this equals **mg + trunc(Δ × (D − w) / D)**, with Δ = eg − mg. **Build that form:** Δ
     sums only the terms whose halves differ. It is the same number, bit for bit.
   - trunc is odd, so a position and its colour mirror score exactly equal, as `G3` requires. Never `Math.floor`, and
     never a rounding that is not symmetric about 0. The negamax flip stays `0 − score`.
3. **What tapers at E1, in value.** Each change has a stated rule, under `ABC-215`'s provenance rule.
   - **The king's endgame half: 40 − 15 m**, where m is the Manhattan distance to the nearest of d4, e4, d5 and e5.
     It runs from +40 in the centre to −50 in a corner. It is the `ADR-0031` addendum's rule, accepted by the owner,
     and this project's own (`ADR-0048`). The middlegame half is today's `KING_TABLE`.
   - **The passed pawn's endgame half: 2 × today's bonus by rank** (0, 10, 20, 40, 70, 120, 200). The middlegame half
     is today's `PASSED_PAWN_BONUS`.
   - **Every other term has an endgame half equal to its middlegame half,** so it does not change value: material, the
     five other PSTs, doubled, isolated, the three shelter / file terms, and the mobility weight and cap. These halves
     exist so that E2 can move them. E1 hand-writes no endgame value without a rule.
4. **One parameter table, the seam E2 rewrites.**
   - **A new, data-only module, `src/evaluate-params.ts`.** It holds no logic and no imports. `src/evaluate.ts`
     imports it and derives its flat lookup arrays from it once, at load.
   - **Its contents, every entry a `{ mg, eg }` pair or an mg / eg array:**
     - `PHASE_WEIGHT` (N 1, B 1, R 2, Q 4), `PHASE_MG` 24, `PHASE_EG` 0;
     - `MATERIAL` (P 100, N 325, B 325, R 500, Q 900, both halves);
     - `PST` for all six pieces (64 squares each, both halves; only the king's endgame half differs);
     - `PASSED` by rank (decision 3);
     - `DOUBLED` 15 / 15, `ISOLATED` 10 / 10;
     - `KING_SHELTER_MISSING` 15 / 15, `KING_FILE_HALF_OPEN` 10 / 10, `KING_FILE_OPEN` 20 / 20;
     - `MOBILITY_WEIGHT` 4 / 4, `MOBILITY_CAP` 100 / 100.
   - **About 800 numbers.** E2 emits this file and nothing else (`ABC-239`'s "constants only"). Its diff is then data
     only.
   - **Each table keeps the rule in its comment** until E2 replaces it. E2's method ADR then owns the file's provenance
     line (`ADR-0048`).
   - `VALUE_TABLES_FOR_TEST` grows to expose the king's endgame half and the passed endgame half. `ABC-215` `A2`'s
     rebuild-from-rule row covers both.
5. **The pawn memo stores the passed endgame part.**
   - A third `Int32Array` part sits beside `pawnCacheStructure` and `pawnCachePassed`. The memo stays keyed exactly by
     the two masks, so a hit still returns what a miss computes.
   - The memo becomes 2^14 × 28 bytes = **448 KiB** (from 384 KiB). `transposition.test.ts`'s byte row re-pins
     384 → 448 KiB. `NFR-009`'s sum stays far under 16 MiB (the table is 4 MiB).
   - Δ takes the passed part as (passed eg − passed mg), so a later E2 value that is not 2 × mg needs no new code.
6. **Per-node cost: near zero by construction.**
   - **No second walk, no new loop, no new board read.** The phase add sits in the existing non-pawn branch, and the
     king delta sits where the king square is already found.
   - **Only the terms whose halves differ enter Δ.** At E1 that is the king PST and the passers: about 30 operations a
     call (§ Context).
   - **The two-accumulator form** (every PST read twice) is E2's, once E2 makes every half differ. It changes cost, so
     E2 reads `G2` and `G6` for it.
   - **No incremental state.** Phase, material and PST are not carried in `Position` or updated in make/unmake. That
     is O1-e (`ADR-0055`, 1.02–1.05×), which `EPIC-011` re-reads after E1 because the evaluation then has two halves.
     It is held as F3's single value-identical cost cut.
7. **One switch and a pair of doors** (`ADR-0026` decision 10's pattern).
   - **One switch, `taper`, in both recursions:** `src/search.ts`'s `Switches` and `src/engine.ts`'s `Heuristics`. It
     is on in `search()` and `chooseMove` only. It selects which evaluation the recursion calls at each of today's
     three call sites (the two in `src/search.ts` and the stand-pat in `src/quiescence.ts`). It is never module state.
   - **Three TEST-ONLY exports:**
     - `evaluateWithoutTaper(position)` is the blend with w = D. It equals `main`'s `evaluate` exactly, `Object.is` for
       `Object.is`.
     - `searchWithoutTaper(position, depth)` and `chooseMoveWithoutTaper(position, options)` are the shipped paths
       with `taper` off. Node for node, they are the pre-ticket `search()` and `chooseMove`.
   - **Every door that exists before the ticket turns `taper` off** (the ladder rule). Every older oracle reads exactly
     as today.
   - **Rows follow `ADR-0050` d4, `ADR-0058` d5, `ADR-0059` d6 and `ADR-0061` d6, by reference.**
     - A shipped-side row whose other side is an older door re-points to the new door of its recursion, and its
       figures do not change.
     - Value and behaviour rows on the shipped path stay: zugzwang, the mate rows and `G1`.
     - A pinned value that moves is re-pinned, with old → new in the PR.
     - A fixture property that is lost is re-found under `ADR-0028` d2.
     - A level that reddens follows `ADR-0028`: fixture first, then one headroom, then the owner.
     - **No zugzwang depth is re-pinned.**
8. **The pre-registered bars.** They are fixed here and not loosened after Ready.
   - **B0, node identity with this design** (the instrument check, which makes every probe reading transfer to the
     build). On `src/` tree `58fa3eb4`, the build's `chooseMove` reads exactly the counts below.

     | board | depth | nodes |
     |---|---|---|
     | kiwipete | 8 | 1 296 788 |
     | kiwipete | 9 | 2 733 330 |
     | position-6 | 8 | 404 930 |
     | position-6 | 9 | 926 005 |
     | position-6 | 10 | 1 692 669 |

     - Its `search()` d8 reads 839 514 / 1 533 901 (kiwipete / position-6).
     - Its doors read `main`'s counts: 1 306 981 / 391 451 and 888 786 / 1 262 046.
     - If `main`'s `src/` has moved by the build, the Engineer applies `patch_e1.py` (form L) to the new base, re-reads
       the expected counts, and puts both in the PR. A count that differs is explained before any other bar is read.
       A re-derived count is a dated line here, never a moved bar.
   - **B1, relations** (default-lane units, `src/evaluate*.test.ts`):
     - (a) the mirror, `Object.is`, over `G3`'s corpus plus ≥ 15 new positions at phases 0–24;
     - (b) **at phase 24, `evaluate` equals `evaluateWithoutTaper` exactly** on every full-material position in the
       corpus (probe: 7 / 7);
     - (c) `evaluateWithoutTaper` is `main`'s `evaluate`: in the PR, a frozen corpus run through the pre-ticket
       `evaluate` and the build's `evaluateWithoutTaper` reads equal, `Object.is`;
     - (d) the king: on 6 king-and-pawn endings that QE freezes before the build, the centre king beats the corner
       king by **≥ 20 cp** (probe +44 to +95; base −35 to −86);
     - (e) the passers: the passed term's value at phase ≤ 6 is **≥ 1.5 ×** base's at the same rank (by construction
       ≥ 1.75 ×). At phase 24 it equals base's exactly. At phase ≥ 18 it is ≤ 1.25 × base's.
     - (e) replaces `ABC-232` A1's "within 5 cp at phase ≥ 0.75". That clause cannot hold for an advanced passer: a
       passer one step from promotion (100 cp) reads 125 at phase 18. Read (e) through the `VALUE_TABLES_FOR_TEST` arrays, or
       through a pair that differs only by the passer.
   - **B2, mate floor** (`search()`, the 287):
     - the door's d4 mates are same-sign mates for the shipped search at d5: 0 violations (probe 0 / 163);
     - the same at d5 against d5: 0 violations (probe 0 / 189).
   - **B3, zugzwang:** `ADR-0050` d9's seven rows, `chooseMove` at their recorded depths, each plays its recorded move.
     **7 / 7** (probe 7 / 7). Hard.
   - **B4, `G1`:** ≥ 54 / 58 with no NEWLY-MISSED line (probe 54 / 58).
   - **B5, `ADR-0061`'s futility rows on this scale:** `ADR-0061` d8 (d), the cut audit, read by QE on a scratch copy of
     the build. Its bars do not change: flips ≤ 0.5 % and 0 flips of 200 cp or more. The drift and the mate floor are
     already read clean (§ Context), and B0 carries them over.
   - **B6, `G2`:** the complete evaluation ≤ **1.05 ×** base per call, in the same session, by `ABC-076`'s method as
     `ADR-0031` d3 applies it. This is `ABC-231` A4's level. `ABC-232` A3's 1.03 × was for a passer-only change and
     folds into this one.
   - **B7, `G6`, by `Q-3K-4`'s answer.** Both readings run at `LEVELS[5]` (4 000 ms), plain node, on the reference
     host, by `ABC-205`'s reading rule: at least 5 interleaved rounds per board per build, at width 1, with load
     recorded; medians compared; any single run below depth 6 is a FAIL.
     - **The default, "≥ base" binds:** the median completed depth on kiwipete and on position-6 is ≥ base's. The
       frozen-clock pre-check is B0: the tree shape is then known (≤ 1.035 × at position-6 d8, ≤ 1.012 × at d9 / d10,
       0.96 × at kiwipete d9). A miss is F3.
     - **The alternative, judged on play:** `NFR-005` alone. Every run completes depth ≥ 6 (FAIL below), and depth 7
       is a WARN level. "≥ base" is reported, not graded. B8 decides.
   - **B8, the read:** `EPIC-011` § The per-change rule, by reference: C2′'s 100 games at 100 ms against the
     merge-base, S′'s smoke, and the Levels deep lane. **The intent is GAIN (≥ 50.0 of 100).** It is named here and
     never re-classed after a score is seen.
   - **Reports, not bars:** drift against the doors at d5 (probe 98.40 %, max 61 cp), reach at 47 000 (probe +0.042),
     and the evaluation instrument on the 145 (probe: level with `main`). None of them is graded. An evaluation change
     is expected to drift.
9. **Why GAIN.**
   - The mechanism acts at every node with material off. The king and the passers are where the instrument's
     surviving errors sit (late in the game).
   - E1 changes nothing at phase 24 (B1 (b)). So it cannot cost the opening and the early middlegame anything in value.
     Their cost is the ≈ 1–2 % node estimate and a tree effect of at most 3.6 % at depths 7–10 on the `G6` boards.
   - D2's estimate for the full taper is +40–120. Discounted for having two endgame halves of ~800, `arch-next-pull`
     put it at +30–90. That is an estimate, and C2′ resolves about ± 56. GAIN means "point estimate ≥ 0", not a proven
     gain.
   - NEUTRAL is not open to it: the change acts at 100 ms.
10. **What E1 is not:**
    - no king safety: no queen scale, no shelter gate, no king-zone attackers (E3, under the tuner);
    - no new passer term: no king distance, free path or unstoppable passer (E4);
    - no tuning (E2);
    - no endgame half without a rule, for any other term.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 1–6, the design as built | B0's counts not reproduced | B0 | a defect: the build is not this design. Fix it before any other bar is read |
| **F2** | 2, 7: the mirror and the doors | a mirror mismatch; `evaluateWithoutTaper` not equal to `main`'s `evaluate`; a door or an older door not node-equal to its pre-ticket self | B1 (a)–(c), `G4` | a defect |
| **F3** | 6, the cost premise | under the default, `G6`'s median below base on either board; or `G2` above 1.05 × | B6, B7 | STOP to Architect/Design. **One value-identical cost cut is allowed**: O1-e-style incremental phase, or a packed score. It is node-equal by B0, and it is followed by one new `G6` reading. A second miss: not merged, and the Orchestrator puts `Q-3K-4` to the owner with both readings (if he has not answered). No value is tuned to pass `G6` |
| **F4** | 3, play safety | a zugzwang row not played at its depth, a mate-floor violation, or a NEWLY-MISSED `G1` line | B2–B4 | a defect check first. If it is real: NOT MET, and this ADR is re-opened. Never a re-pin to a deeper depth |
| **F5** | `ADR-0061` coupling | the futility audit above its bars | B5 | `ADR-0061`'s margins are re-read on this scale, by a dated amendment there, before E1 merges |
| **F6** | 9, the strength premise | C2′ NOT MET (< 50.0 of 100), an S′ collapse, or a red Levels lane | B8 | not merged; this ADR reads "accepted, not in force". The structure (decisions 1, 2, 4, 5, 7) may be re-offered with every endgame half equal to its middlegame half, value-identical to `main`, as E2's base. That is E2's ADR's call, not a re-play |

## Alternatives

- **P, the plateau phase (22 / 6).** Measured and eligible. Rejected by the pre-registered rule: S 1.1286 against L's
  1.0344, because P changes kiwipete's root move at d7–d8 and grows its tree 11–19 %. The evaluation instrument reads
  P better (39 errors against L's 49), but that reading was fixed as information before the run. P is two parameters
  of decision 4. E2's tuner may move them on data with a stated method. A re-read here would be form-shopping.
- **Hand-written endgame halves for every piece.** Rejected: there is no rule to write them by, and E2 overwrites
  them. Each one adds drift and tree change for the `G6` default to pay for.
- **The two-accumulator full blend at E1.** Same values. It costs about two operations per piece for halves that are
  still equal. It becomes E2's form.
- **A packed score** (mg and eg in one int32, one add per piece). Fewest operations once every half differs.
  Rejected now: it needs overflow reasoning, and only two terms differ. It is named as E2's option.
- **Incremental phase / material / PST in `Position`** (O1-e). It saves the phase adds, but it touches make/unmake
  (`ADR-0003`, the O1 files) for about 1 % of node time. Held as F3's single cost cut.
- **`ABC-231` alone, then `ABC-232`.** Each would be read inside the ± 56 a 100-game read resolves. Reading the
  evaluation in pieces costs three reads for one decision (`arch-next-pull` § 2).
- **The `ADR-0031` addendum as it stands** (queen scale + shelter gate + taper). That is `ABC-205` again, and its gate
  carried the tree growth that lost `G6`. The two king-safety parts are E3's.
- **Tapering king shelter to 0 in the endgame.** It would free the centre king further. Rejected now: it is king
  safety (E3 / E2), and its halves are wired equal. Today the queenless exposure term still charges a centre king up
  to 105 cp against the endgame table's 90 cp range. The probe's endings still read +44 to +95, so the king walks.
- **A material-weighted phase** (non-pawn material / 6 400). The same shape. 1 / 1 / 2 / 4 is the textbook form and
  the addendum's, and a small-table read costs the same.

## Consequences

- **NFRs.**
  - `NFR-005`: decision 8 B7 under each `Q-3K-4` answer; floor 6 unchanged.
  - `NFR-009`: the pawn memo grows 384 → 448 KiB, fixed; nothing grows per search.
  - `NFR-001` / `G2`: B6.
  - `NFR-008`: the relation rows are default-lane units with no search. B0, drift, mate, zugzwang and reach sit behind
    `SEARCH_DEEP=1` / `ENGINE_DEEP=1`.
  - No new NFR file; `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** pure and integer; trunc is odd; the same input and virtual clock give the same move.
- **Licence (`ADR-0048`):** every table stays this project's own, made by a stated rule.
- **Migration, for sizing.**
  - The lane probe gives an upper bound of 40 rows in 7 files when every path is tapered (§ Context). The ladder lowers
    it.
  - Each row is classed by decision 7.
  - The deep lanes were not run (`UNKNOWN - verify`). The Engineer runs every lane that reads `evaluate`, including
    `quiescence.test.ts`'s deep pins and `ORACLE_AT_DEPTH_3`, which re-pin only by re-running the oracle (that file's
    rule).
  - The header comments "No tapering, no endgame variants" and "Untapered by decision" point here.
- **Couplings.**
  - `ADR-0061`: answered for E1 (drift / mate clean; audit B5).
  - `ADR-0060` / `ADR-0063` (P1 / O1h parked): "an evaluation change that changes the tree" is a named re-open
    premise. E1 changes `G6`-board trees by under 4 % at d8–d10 in `chooseMove`. Whether that re-opens P1 is a new
    pre-registered probe after E1 merges. It is not owed.
  - `ADR-0059` (P2 dropped): its re-cut premise lists E1 / E2. The same applies.
  - E2 (`ABC-239`): decision 4 is its seam; `Q-3K-7` (data) goes live when E2 is pulled.
  - O1-e: re-read after E1 (`EPIC-011`).
- **File collisions:** `src/evaluate.ts` (no open ticket touches it), `src/search.ts`, `src/engine.ts` and
  `src/quiescence.ts` (the switch and the doors). The second to merge re-reads its door counts.
- **No data, format, option or dependency changes.**

## Rollback

- **Before acceptance:** mark this ADR `withdrawn`, and strike the dated lines in `ADR-0056` D2, `ADR-0031` § Addendum
  status and `ADR-0061` § Consequences. Nothing else was edited.
- **After it ships:** set `taper` to false in `search()` and `chooseMove`, two booleans. The shipped path is then node
  for node the door, which is `main` before the ticket. Deleting the switch, the doors, the params module and the
  memo's third part afterwards is a mechanical revert of one ticket.
