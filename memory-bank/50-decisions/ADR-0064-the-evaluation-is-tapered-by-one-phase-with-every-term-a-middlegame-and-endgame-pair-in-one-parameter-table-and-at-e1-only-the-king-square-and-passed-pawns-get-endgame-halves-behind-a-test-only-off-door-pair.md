---
kind: adr
id: ADR-0064
---
# ADR-0064: The evaluation is tapered by one phase (N 1, B 1, R 2, Q 4, out of 24). Every term is held as a middlegame and endgame pair in one parameter table. At E1 only the king square (`ABC-231`) and the passed pawns (`ABC-232`) get endgame halves of their own, blended in the existing board walk, behind a test-only off-door pair

## Status

**ACCEPTED, IN FORCE on `main` since 2026-11-03**, at the `ABC-269` merge `54dee3f2` (2026-11-03T12:25:48Z).
Recorded by Architect/Design (task `arch-post-269`, records only, on `grugops/arch-post-269` from `main` `128e3c6c`).
Nothing was run.
- **The merge:** the Orchestrator merged on `qe-ABC-269`'s PASS_WITH_GAPS (`…eff2fe64`), which signs UAT under the
  owner's delegation. No gap blocks; one is LOW (`QE-269-f`) and five are INFO (`…9ba289c2`). The candidate head was
  `grugops/ABC-269` `be87a2f1`, with cut C1 in it.
- **QE's readings, as recorded:**
  - **B6, `G2`:** read once under the PREREG `…e36ee7ca`: R = (1.0186 + 1.0560) / 2 = **1.0373 ×** ≤ 1.0500, MET
    (unrounded 1.0373360328). Both sessions were valid on the control (c = 1.0200, 0.9974) (`…cebf49fe`). The margin
    is 0.0127, about one session's spread (`QE-269-f`, answered in `ADR-0067` decision 8's dated line of this date).
  - **B5:** 1 flip in 2 986 sampled firing nodes, worst error 17 cp, none ≥ 100 cp. **B7** (`G6` at 4 000 ms,
    `Q-3K-4` = (b)): every run at depth 9 / 10, no WARN, medians equal base (`…48b34063`).
  - **B8:** C2′ **57.0 / 100** against the merge-base `01a67c5d` at 100 ms (W/L/D 44/30/26, Elo **+49.0 ± 59.5**,
    LOS 94.8 %, 0 faults, 0 time losses), so GAIN is MET (bar ≥ 50.0). S′ **7.0 / 10** at E 1 810 (7/3/0), MET.
    Levels deep lane **57 / 57**, MET (`…2c51ee30`).
  - B0's 11 counts exact, `npm test` 2 566 / 2 566, S1–S3 +13 / +13 / +23 (a report; `ABC-270`'s first graded rows),
    D1–D6 all ≥ 20 cp (`…3fb121de` is QE's re-read).
- **After the merge, on `main`** (the Orchestrator, board line of 2026-11-03): `npm test` 2 566 / 2 566.
- **What 57.0 means** (as for `ADR-0061`): a point estimate ≥ 0. The ± 59.5 interval crosses 0, so it is not a proven
  gain (`QE-269-i`).
- **The shipped evaluation now:** `main`'s `evaluate` is tapered by one phase (decisions 1–2), with endgame halves for
  the king square and the passed pawns only. In the search the phase is carried by the recursion (cut C1), not by
  `Position`. The door pair still turns it off in tests. Per `QE-269-h` (a report), the carried phase costs
  +2.4–4.5 % ns per node against the pre-E1 `main`; B7 shows no depth lost.
- **What follows from it:**
  - **`ABC-274`'s base** (E2-pre, `ADR-0067` d8 / F8) is this `main`: `54dee3f2`, cut C1 included.
  - **The S′ pool at E 1 810 opens** with this merge's 7.0 / 10. No step fires (`ADR-0056` S′, dated line of this
    date).
  - **R1 (`ABC-273`)'s window opens.** Its control is ruled in `ADR-0056` D6's dated line of this date.
  - P1 re-opens only on a new named premise read against this tree (`ADR-0056` D6). None is named here.
- **Rollback** is as § Rollback states: the switch and its doors.

*Earlier status, kept:* **ACCEPTED 2026-11-02 by the owner. NOT IN FORCE on `main` until `ABC-269` merges.** His words, verbatim
(`orch-2026-10-30a` `…cc7db847`): *"64 yes, Q-3K-4 b"*. Recorded 2026-11-03 by Architect/Design (task
`arch-ABC-269-rule`, records only, on `grugops/arch-ABC-269-rule` from `main` `17725732`). Nothing was run.

- **What acceptance releases:** `ABC-269`'s B8 (C2′, S′, the Levels deep lane) and its merge, after the build and QE.
- **When it comes into force:** at `ABC-269`'s merge, and only if B0–B8 hold. If it does not merge, a dated line here
  reads "accepted, not in force on `main`" (F6). Until then `main` keeps its untapered evaluation.
- **Settled by this line, in the text kept below:** "Acceptance is the owner's", "The answer that settles it",
  "Default without an answer", and "`Q-3K-4` is open and live".
- **`Q-3K-4` = (b).** This is a value-changing evaluation ticket, so it is judged on play. B7 is graded by its
  alternative: every run at depth ≥ 6, depth 7 a WARN, and "≥ base" reported, not graded. F3's `G6` clause does not
  fire. See B7's and F3's dated lines and `ADR-0056` D7.
- **`QE-269-a`, ruled (a): the claim is narrowed, and no bar moves.** B1 (d)'s ≥ 20 cp covers the corner king that is
  not behind both of its shelter pawns. The castled corner is a report, and E3 owns the fix. § Decision log has the
  exact text, written before any E1 code exists.
- **Two wording corrections, with no bar moved:** d2's "bit for bit" (`QE-269-b`) and B1 (e)'s "≥ 1.75 × by
  construction" (`QE-269-c`). Both are dated lines in place.
- **F3 fired on `G2` (B6), 2026-11-03 (`arch-ABC-269-F3`).** The miss is real: 1.0711 / 1.0672 ×, mean 1.069. One
  value-identical cut is ordered, C1: the phase leaves the board walk and rides the search's recursion. `Position` and
  make/unmake are untouched. One new `G2` reading follows, by QE, under the sealed PREREG `…e36ee7ca`. A second miss:
  not merged. No bar moved. § Decision log.

*As proposed, kept:* **PROPOSED** 2026-11-02 by Architect/Design (task `arch-E1`, records only, on `grugops/arch-E1` from `main`
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

## Decision log

| date (UTC) | by | what | record |
|---|---|---|---|
| 2026-11-02 | Architect/Design | PREREG of the probe sealed before any measured run | `arch-E1` `…01c2d6a5`, `b11b802f` |
| 2026-11-02 | Architect/Design | PROPOSED, form L chosen by the pre-registered rule | `arch-E1` `…c524a01d`, `…d8150777` |
| 2026-11-02 | QE/E2E | B1's position sets frozen before any E1 code; S1–S3 held apart pending a ruling | `qe-ABC-269-freeze` `…1b856350`, `d6a57653` |
| 2026-11-02 | the owner | **ACCEPTED** ("64 yes"). **`Q-3K-4` = (b)** ("Q-3K-4 b") | `orch-2026-10-30a` `…cc7db847` |
| 2026-11-03 | Architect/Design | **`QE-269-a` ruled (a)**, the claim narrowed. `QE-269-b` and `-c` wording. The owner's two answers folded | `arch-ABC-269-rule` `…8ccb561f` |
| 2026-11-03 | Software Engineer | Built; B0 exact, B1–B4 met; **B6 (`G2`) 1.0711 / 1.0672 ×, a miss: F3** | `se-ABC-269` `…7445784f`, `…669f366c` |
| 2026-11-03 | Architect/Design | **F3 on `G2`:** the miss ruled real; the one cut ordered (C1, the phase leaves the walk); the one re-read pre-registered | `arch-ABC-269-F3` `…a0468a78`, PREREG `…e36ee7ca` |
| 2026-11-03 | Software Engineer | Cut C1 built; P1–P7 green; B0 11 / 11 exact | `se-ABC-269-cut` `…8e00e712`, `…c9da2d0f` |
| 2026-11-03 | QE/E2E | **`G2` MET 1.0373 ×** (read once); B5, B7, B8 MET; **PASS_WITH_GAPS**, signs UAT | `qe-ABC-269` `…cebf49fe`, `…eff2fe64`, gaps `…9ba289c2` |
| 2026-11-03 | Orchestrator | **Merged** `54dee3f2`; post-merge `npm test` 2 566 / 2 566 | board line of 2026-11-03 |
| 2026-11-03 | Architect/Design | **IN FORCE** line; `QE-269-f` answered in `ADR-0067` d8; `QE-269-g` wording fixed | `arch-post-269` `…3f30baf8` |

**2026-11-03, `QE-269-a`: ruling (a). The claim is narrowed; no bar is loosened or re-opened.**

- **The narrowed claim, exact.** B1 (d)'s ≥ 20 cp bar covers king-and-pawn endings at phase 0 where the corner king
  is **not** behind its own pawns on both files of its shelter. In the frozen fixture's terms that is
  `cornerShelter` `"none"` or `"partial"`. These are the six graded rows D1–D6, unchanged. The claim "the king walks"
  means exactly this: the centre square beats that corner by ≥ 20 cp. **The bar does not cover the castled corner.**
  That is a corner king behind its own pawns on both of its shelter files while the centre king's three files are
  bare (`cornerShelter` `"full"`, QE's S1–S3). E1 grades nothing there.
- **Why the line falls there.** At E1 the king's square table is the only king term that tapers (d3). `kingExposure`
  keeps equal halves (d10: no king safety). It charges 15 cp for each missing shelter pawn and 20 cp for each open file
  (10 cp for a half-open one), over three files. At phase 0 the reading is the endgame half exactly. So E1 moves
  centre minus corner by a fixed amount: **base + 130** for a corner on the king's own side (a1 / h1 for white, a8 /
  h8 for black: an endgame swing of +90 against the middlegame table's −40), and **base + 90** in the opponent's
  corners, where the two halves are equal. The bar holds wherever base ≥ −110 (own corner) or ≥ −70 (far corner).
  - A castled corner with the centre files bare reads −117 on `main` (S1: square table −40, mobility +28, exposure
    −105). So E1's own arithmetic forecasts **+13 / +13 / +23** on S1 / S2 / S3 (QE's forecasts `…aea4ceba`).
    Checked here by hand on S1: the +130 swing from `KING_TABLE` and the rule, and the 105 cp exposure from
    `kingExposure`. The −117 base is QE's reading on `main` (`verify.ts`).
  - On those endings **the sign turns**. The centre beats the corner, where `main` reads −107 to −117. The margin is
    under 20. The residual is the exposure term, which § Alternatives already named. The sentence there that went
    too far ("so the king walks") gets a dated line.
- **Why (a) and not (b).**
  1. **The hole is in a term E1 leaves alone on purpose** (d10). The design is not wrong. The prose claim reached
     past the probe's sample, which had no castled corner.
  2. **Re-opening means tapering the shelter and file terms now.** That is either an endgame half with no stated rule
     (d3 forbids it, and E2 overwrites it) or the `ADR-0031` addendum's shelter gate, the part of `ABC-205` that grew
     the tree. It would void B0's counts, the `arch-E1` form choice and QE's forecasts. It would need a new probe and
     a second acceptance, all for a slice of positions that the 100-game read cannot resolve on its own (± 56).
  3. **Said plainly:** `Q-3K-4` = (b) removes `G6` "≥ base" as a reason against the shelter taper. The rejection in
     § Alternatives now rests on two grounds: there is no rule to write the half by, and it is king safety (E3 under
     the tuner).
- **Not a loosening.**
  - The bar is B1 (d)'s from the start: "6 king-and-pawn endings that QE freezes before the build", at ≥ 20 cp. QE
    froze six graded rows, and they stay graded at ≥ 20 cp, byte for byte.
  - S1–S3 were never inside B1 (d). QE froze them apart, with both outcomes written into its PREREG before this
    ruling.
  - This text is written before any E1 code exists. `grugops/ABC-269` at `c9c27910` differs from `main` under `src/`
    only by QE's fixture, its worktree is clean, and `se-ABC-269` has not been dispatched.
- **What happens to S1–S3.**
  - They stay a **report** (QE's PREREG `…1b856350`, the branch "if it is out, they stay a reported reading").
  - The Engineer prints their three readings in the PR beside B1 (d). QE reads them in its verdict against the
    forecast +13 / +13 / +23. A difference is explained (`QE-269-e`), not graded. B0 already binds the build to this
    design's arithmetic, so a graded sign row would catch nothing new.
  - **E3 owns the fix.** S1–S3 are offered to E3 as its first graded rows, at ≥ 20 cp (a line owed to BA/PM).
- **QE's frozen sets and PREREG need no addendum, and nobody writes one.**
  - The ruling selects a branch QE pre-wrote. No row, bar or byte changes (the fixture sha256 stays
    `05ed9e81…6e96339`).
  - The fixture's docblock ("a REPORT until the Architect rules…") stays as frozen. Editing it would change the
    bytes and force a QE re-freeze, which is not owed.
  - `arch-E1`'s PREREG `…01c2d6a5` governs only the probe's form choice. It is untouched.
  - QE pulls this ruling at the verdict.

**2026-11-03, F3 on `G2` (B6): the miss is real, one cut is ordered, and one reading follows. No bar moves.**
(`arch-ABC-269-F3` `…a0468a78`; PREREG `…e36ee7ca`; the build `grugops/ABC-269` `110292d4`.)

- **The miss is real, and QE does not re-read the uncut build.**
  - The two `G2` sessions read 1.0711 and 1.0672 ×. Their mean, 1.069, is the verdict under `ADR-0031` d3, and it is
    above 1.05. Three more sessions of the same build read 1.08–1.11.
  - The same sessions' controls: a second copy of `main` reads 0.9888, and the build without the walk's phase and
    king adds reads 1.0032. So the cost is the per-piece phase add in the walk, not the memo or the blend.
  - Both sessions started base-first, not in reverse order. That is recorded and decides nothing: each session
    alternates every round, and the smallest excess (0.0172) is larger than the control's deviation (0.0112).
  - A re-read could only pass by noise, and that would be shopping for a reading.
- **The cut, C1: the phase leaves the walk** (O1-e-*style* incremental phase; phase only, not material or PST).
  - The recursion carries the phase of the current node as one integer. The root is seeded once by `phaseOf`. A child
    gets `phase − PHASE_WEIGHT[captured & 7] + PHASE_WEIGHT[promotion]`, which is exact without a branch because
    EMPTY, PAWN and KING weigh 0. A null move keeps the phase.
  - The tapered evaluation takes the phase as an argument. The king Δ is read from the two king squares after the
    walk. So the walk is `main`'s walk again, which is the measured 1.0032 form.
  - Files: `src/evaluate.ts`, `src/quiescence.ts`, `src/search.ts`, `src/engine.ts`, and the tests that call
    `quiesce` / `futilityNode` directly. `src/position.ts`, `src/apply.ts`, `src/legal.ts`, `src/moves.ts` and
    `src/evaluate-params.ts` are untouched.
  - **The carrier is the recursion, not `Position`.** `ADR-0002` clause 1 adds no state to `Position`, and
    `ADR-0020` d3 rejected a position-carried key for reasons that apply here unchanged: `UndoRecord` grows, the
    legality filters pay for an update nobody reads, and every board writer must re-sync. `evaluate(position)` keeps
    computing its own phase for every caller outside the search.
  - **Not the packed score.** It packs Δ, not the phase. The variant that packed the phase into an accumulator read
    1.0726 ×.
- **Node-equal by construction, then proved.**
  - The Engineer's rows P1–P7 (`…a0468a78`): B0's counts exact; a phase oracle walk over the perft set; `evaluate`
    `Object.is`-equal to the uncut build; the shipped trees and the doors cross-build equal; a guard against a
    per-call phase walk; zero re-pins in every lane; and the gates.
  - A row that needs a re-pin means the cut is not value-identical. That is a defect, and it stops to
    Architect/Design.
  - The Engineer takes no timing of the cut.
- **The one reading:** `G2`, by QE, under the PREREG `…e36ee7ca`.
  - The instrument is the one that recorded the miss, with two sessions in reverse order and a `main`-copy control
    that voids a session outside 0.970–1.030 (one re-run at most).
  - The graded arm is the shipped tapered entry with the phase supplied. The verdict is the mean of the two
    sessions, **≤ 1.0500**.
  - ns per node is reported beside it, so that a cost moved rather than cut is visible.
  - **If it is met:** B5, B7 (graded on `NFR-005`'s floor under `Q-3K-4` = (b), median reported) and B8.
  - **If it is not met:** the second miss. **Not merged**, and this ADR gets its "accepted, not in force" line.
  - *Dated 2026-11-03 (`arch-post-269`): it was met, 1.0373 × (`…cebf49fe`), and the build merged (§ Status).*
  - *Dated 2026-11-03 (`arch-post-269`, `QE-269-g`, wording only):* the PREREG's "odd rounds run the arm list in
    reverse" is read as `g2b.ts` runs it: `r % 2 === 1` with `r` counted from 0, that is, **rounds 2, 4 and 6 counted
    from 1**. Round 1, the dropped warm-up, runs the session's listed order. QE ran it that way. The sealed note keeps
    its text. A later PREREG of this shape says "rounds 2, 4 and 6 (counted from 1) reverse the session's list".
- **Rollback of the cut alone:** revert its commit. It is value-identical, so nothing else moves.

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
     - *Dated 2026-11-03 (`arch-ABC-269-rule`, `QE-269-b`):* the two forms give the same value, but not always the
       same bits. When mg = 0 and |Δ × (D − w)| < D, the full form returns −0 on one side and +0 on its mirror. That
       is an `Object.is` mismatch (QE's traps `M-negzero-a` and `M-negzero-b`). The delta form returns +0 on both.
       **Only the delta form is built.** B1 (a) over QE's fixture catches the other.
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
     - *Dated 2026-11-03 (`arch-fold-1103b`):* E2's method ADR is **`ADR-0067`** (PROPOSED; acceptance is the
       owner's, pending). It owns this file's provenance header (its d7). `tools/tune` writes this file in its present
       shape, with the same exports, and nothing else.
     - *Dated 2026-11-03 (`arch-owner-answers-1103b`):* **`ADR-0067` is ACCEPTED 2026-11-03** by the owner
       (`orch-2026-10-30a` `…af126c04`, "1. yes") and in force as the method. Its § Addendum pins the data. Under
       `ADR-0068` (accepted `…401c3d09`) the file also gains three queen-on exposure pairs at 0, which the tuner fits.
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
     - *Dated 2026-11-03 (`arch-fold-1103b`):* this blend is cut as **`ABC-274` (E2-pre)**, value-identical at
       E1's table, under **`ADR-0067`** d8 and F8. A packed score is recommended. `G2` ≤ 1.05 × and `G6` "≥ base" are
       graded against the pre-ticket head (`main` with `ABC-269` and cut C1). It plays no games.
     - *Dated 2026-11-03 (`arch-owner-answers-1103b`):* **`ADR-0067` is ACCEPTED 2026-11-03** (`…af126c04`).
       `ABC-274` merged at `2410d4f7`, so this blend is in force on `main` (QE `…fa87f74d`).
   - **No incremental state.** Phase, material and PST are not carried in `Position` or updated in make/unmake. That
     is O1-e (`ADR-0055`, 1.02–1.05×), which `EPIC-011` re-reads after E1 because the evaluation then has two halves.
     It is held as F3's single value-identical cost cut.
     - *Dated 2026-11-03 (`arch-ABC-269-F3`, `…a0468a78`):* F3 fired on `G2`. The cut ordered is incremental
       **phase** only. Its carrier is the search's recursion, not `Position` or make/unmake (`ADR-0002` clause 1,
       `ADR-0020` d3). The king Δ moves after the walk. § Decision log.
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
       - *Dated 2026-11-03 (`arch-ABC-269-rule`, `QE-269-a` ruled (a)):* the six graded endings are QE's D1–D6, and
         the bar is unchanged. It covers a corner king that is **not** behind its own pawns on both shelter files. The
         castled corner (QE's S1–S3, forecast +13 / +13 / +23) is a report, not graded, and E3 owns it. § Decision
         log has the exact claim and the reasons.
     - (e) the passers: the passed term's value at phase ≤ 6 is **≥ 1.5 ×** base's at the same rank (by construction
       ≥ 1.75 ×). At phase 24 it equals base's exactly. At phase ≥ 18 it is ≤ 1.25 × base's.
       - *Dated 2026-11-03 (`arch-ABC-269-rule`, `QE-269-c`):* "by construction ≥ 1.75 ×" is not exact under
         trunc. The lowest ratio at phase ≤ 6 is **1.6 ×** (rank 2 at phases 5–6). Rank 3 reads 1.7 × and rank 5
         1.743 × at phase 6. At phase 18, ranks 4, 6 and 7 meet ≤ 1.25 × at equality. The bars (≥ 1.5 ×, exact,
         ≤ 1.25 ×) do not change.
       - *Dated 2026-11-03 (`arch-ABC-239-rulings`):* **(e) retires at `ABC-239`, by `ADR-0067` d6's rule for E1's
         rule rows.** Its band (≥ 1.5 × at phase ≤ 6, ≤ 1.25 × at ≥ 18, mg > 0) is E1's passer rule, eg = 2 × mg, read
         through the blend, measured against the pre-E1 base. `ABC-215` A2's rule rows state the same rule, and d6 retires
         them for tuned values. The blend itself stays graded for the passers on any table by `ABC-274` A3 and, at phase
         24, by (b). (d) stays a relation; only its door literal (`mainCentreMinusCorner`) is re-pinned under
         `ADR-0067` B-T4. The record is `ADR-0067` d6's dated line of the same task.
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
     - *Dated 2026-11-03 (`arch-ABC-269-F3`):* the build read 1.0711 / 1.0672 ×, a miss (F3). After cut C1, B6 reads
       the shipped tapered entry as its call sites call it, with the phase supplied, against `main`'s `evaluate`. It
       is read once, by QE, under the PREREG `…e36ee7ca`. The bar is unchanged at 1.05 ×.
   - **B7, `G6`, by `Q-3K-4`'s answer.** Both readings run at `LEVELS[5]` (4 000 ms), plain node, on the reference
     host, by `ABC-205`'s reading rule: at least 5 interleaved rounds per board per build, at width 1, with load
     recorded; medians compared; any single run below depth 6 is a FAIL.
     - **The default, "≥ base" binds:** the median completed depth on kiwipete and on position-6 is ≥ base's. The
       frozen-clock pre-check is B0: the tree shape is then known (≤ 1.035 × at position-6 d8, ≤ 1.012 × at d9 / d10,
       0.96 × at kiwipete d9). A miss is F3.
     - **The alternative, judged on play:** `NFR-005` alone. Every run completes depth ≥ 6 (FAIL below), and depth 7
       is a WARN level. "≥ base" is reported, not graded. B8 decides.
     - *Dated 2026-11-03 (`arch-ABC-269-rule`; the owner, "Q-3K-4 b", `…cc7db847`):* **the alternative binds.** B7
       is graded on `NFR-005` alone: every run completes depth ≥ 6 (FAIL below), and depth 7 is a WARN. Each board's
       median against base is reported, not graded. The default bullet above no longer grades. B0 stays the
       instrument check.
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
      - *Dated 2026-11-03 (`arch-ABC-270`):* E3a is `ADR-0068` (PROPOSED). The queen-on exposure pairs land at 0,
        value-identical, before the tuner. `ABC-239` fits them with the exposure endgame halves. The shelter gate is
        out. S1–S3 (`QE-269-a`) become a report on the tuner's emitted set.
      - *Dated 2026-11-03 (`arch-ABC-239-rulings`):* **`ADR-0068` is ACCEPTED 2026-11-03** by the owner
        (`orch-2026-10-30a` `…401c3d09`). It is not in force until `ABC-270` merges.
    - no new passer term: no king distance, free path or unstoppable passer (E4);
      - *Dated 2026-11-04 (`arch-ABC-271`):* E4a is `ADR-0070` (PROPOSED). The three terms land as endgame halves
        by rules beside `PASSED`, outside the pawn memo; the memo grows to 576 KiB. They come behind their own door,
        `…WithoutPasserKings`, which every door of this ADR turns off.
      - *Dated 2026-11-04 (`arch-ADR-0070-accept`):* **`ADR-0070` is ACCEPTED in form (a)** (`…e8a3b5df`). The three
        terms land at 0, value-identical, with **no switch and no door**; every door of this ADR reads its
        pre-ticket counts. The second pull fits king distance and free path. **Superseded:** the line above, "behind
        their own door, `…WithoutPasserKings`".
    - no tuning (E2);
    - no endgame half without a rule, for any other term.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 1–6, the design as built | B0's counts not reproduced | B0 | a defect: the build is not this design. Fix it before any other bar is read |
| **F2** | 2, 7: the mirror and the doors | a mirror mismatch; `evaluateWithoutTaper` not equal to `main`'s `evaluate`; a door or an older door not node-equal to its pre-ticket self | B1 (a)–(c), `G4` | a defect |
| **F3** | 6, the cost premise | under the default, `G6`'s median below base on either board; or `G2` above 1.05 × | B6, B7 | STOP to Architect/Design. **One value-identical cost cut is allowed**: O1-e-style incremental phase, or a packed score. It is node-equal by B0, and it is followed by one new `G6` reading. A second miss: not merged, and the Orchestrator puts `Q-3K-4` to the owner with both readings (if he has not answered). No value is tuned to pass `G6`. *Dated 2026-11-03 (`Q-3K-4` = (b)):* the `G6` median clause no longer fires. F3 fires on `G2` above 1.05 ×, or on a B7 run below depth 6. Either one gets the same single value-identical cost cut, then one new reading of the bar that missed. A second miss: not merged. The "puts `Q-3K-4` to the owner" step is moot. *Dated 2026-11-03 (`arch-ABC-269-F3`):* **fired on `G2`** (1.0711 / 1.0672 ×). The cut ordered is C1: the phase leaves the walk and is carried by the recursion, not `Position`. The one new reading is `G2`, by QE, under the PREREG `…e36ee7ca`. § Decision log |
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
  - *Dated 2026-11-03 (`arch-ABC-269-F3`):* not F3's cut. The measured cost is the per-piece phase add, and a packed
    mg / eg score does not remove it. The Engineer's variant with the phase packed into an accumulator read 1.0726 ×.
- **Incremental phase / material / PST in `Position`** (O1-e). It saves the phase adds, but it touches make/unmake
  (`ADR-0003`, the O1 files) for about 1 % of node time. Held as F3's single cost cut.
  - *Dated 2026-11-03 (`arch-ABC-269-F3`):* ordered as F3's cut, for the phase alone, and **not in `Position`**. The
    phase rides the search's recursion (`ADR-0020` d3's carrier), so make/unmake are not touched. Material and PST stay
    in the walk. § Decision log.
- **`ABC-231` alone, then `ABC-232`.** Each would be read inside the ± 56 a 100-game read resolves. Reading the
  evaluation in pieces costs three reads for one decision (`arch-next-pull` § 2).
- **The `ADR-0031` addendum as it stands** (queen scale + shelter gate + taper). That is `ABC-205` again, and its gate
  carried the tree growth that lost `G6`. The two king-safety parts are E3's.
- **Tapering king shelter to 0 in the endgame.** It would free the centre king further. Rejected now: it is king
  safety (E3 / E2), and its halves are wired equal. Today the queenless exposure term still charges a centre king up
  to 105 cp against the endgame table's 90 cp range. The probe's endings still read +44 to +95, so the king walks.
  - *Dated 2026-11-03 (`arch-ABC-269-rule`, `QE-269-a`):* "so the king walks" holds for a corner king that is not
    behind both of its shelter pawns. All six probe endings were of that kind. On the castled corner with the centre
    files bare, E1 forecasts +13 / +13 / +23 (QE's S1–S3). The sign turns, but the margin is under 20 cp, and B1 (d)
    does not cover it (§ Decision log). Since `Q-3K-4` = (b), `G6` is no longer a reason against this alternative.
    It stays rejected for E1 on the two other grounds: no rule to write the half by, and it is king safety (E3 under
    the tuner).
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
