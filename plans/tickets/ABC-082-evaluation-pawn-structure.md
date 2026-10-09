---
id: ABC-082
title: Evaluation — pawn structure (doubled, isolated, passed)
status: ready
column: Ready
size: M
priority: P1
epic: EPIC-004
feature: —
---

# ABC-082 — the three pawn terms the epic names, and no fourth

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). Second of three
> evaluation tickets (`ABC-076` material + PST, `ABC-083` king safety + mobility).
>
> **Re-scored 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-abc082`, Workflow 07)
> against the merged engine at `f952983` (`ABC-077`…`ABC-081`, `ABC-121`, `ABC-122`). This is the
> **first value-changing EVALUATION** to land on a search with exact pins: every merged row that
> pins a node count, score, move or depth on a position with pawns can move. Those rows are listed
> in **§ Merged bars this change can move**, each with who re-pins or rules it. New: `A8` (the
> re-pin ledger), the `NFR-005` depth read in `A6`, and a corrected `A7` third clause. Size
> `S` → `M`. **DoR 10/10 → `Ready`.** Reasoning: `.grugops/context/rescore-abc082/notes/`.

## Problem

*User*: the player who reaches an endgame against an engine that does not know a passed pawn from a
doubled one.

*Pain*: `ABC-076` scores a pawn on `a2` and a pawn on `a7` almost identically. Piece-square tables
give a static rank bonus but cannot express *doubled*, *isolated* or *passed*, all three of which
are relational.

*Value*: the epic's scope names exactly these three. It is the cheapest large evaluation gain after
material, and it is what makes endgame play recognisable rather than random.

## Scope

- **Doubled pawns** — a penalty per extra pawn on a file.
- **Isolated pawns** — a penalty for a pawn with no friendly pawn on an adjacent file.
- **Passed pawns** — a bonus, scaled by rank.
- One additive term on `ABC-076`'s score, same centipawn units, same negamax sign convention.
  The term goes inside `evaluate` (`src/evaluate.ts:158`, `whiteMinusBlack` at `:128`). Its two
  callers, the bare leaf (`src/search.ts:302`) and quiescence stand-pat (`src/quiescence.ts:100`),
  stay unchanged.
- **Re-pinning the merged pins this term moves**, each from a fresh measurement, with each pin's
  bite re-checked (`A8`). The term changes leaf values, so the engine's exact pins move with it.
  That re-pinning is this ticket's work. No other ticket owns it.

## Out of scope

- **Backward pawns, pawn chains, connected passers, pawn storms.** The epic names three; coding
  rule 5. Adding a fourth needs a measured strength justification.
- **A pawn hash table.** A caching optimisation nobody has asked for and no measurement calls for —
  coding rule 7. Revisit only if `ABC-083`'s or `ABC-080`'s figures show pawn evaluation as a
  measurable cost.
- **King safety and mobility** — `ABC-083`.
- **Tapered / endgame-specific weights.** Same fence as `ABC-076`.
- **An evaluator off-switch or a "pre-`ABC-082`" test door.** `ADR-0026` decision 10 binds the
  next value-changing *search heuristic*. It does not cover an evaluation term. Every door and
  the shipped search call the same `evaluate`, so every identity row moves on both sides at once
  and stays valid. Only literal pins move, and the standing rulings already say how to handle
  them: `ADR-0024` decision 3 and ruling `…f7e66060` R1 give the ratio levels a 1.5x headroom
  that "absorbs legitimate evaluator changes", and ruling `…8c3e5a72` gives the re-pin rule for
  the oracle answers on an evaluator change. Architect/Design owns `ADR-0026` and can overrule
  this reading.
- **Re-levelling any ratio bar, drift bar or NFR level.** If a level reddens, stop and report it
  (§ Merged bars, class R). Do not tune it.

## Acceptance (Given/When/Then)

- **`A1` (symmetry — `ABC-076`'s property, extended not forked).** **Given** any position and its
  colour mirror, **then** the scores are **exactly equal**, over `ABC-076`'s corpus **plus ≥ 15 new
  pawn-structure positions**. *(Pawn terms are directional and this is where a sign bug lives.
  `ABC-076`'s 184 are inherited as INPUTS, not as evidence: their equality under `ABC-076`'s term is
  an algebraic identity of its mirrored-index read, so only THIS ticket's term is under test here.)*
- **`A2` (doubled).** **Given** two positions identical except that white's two pawns share the
  `c`-file in one and stand on `c` and `d` in the other, **then** the doubled position scores
  **strictly lower** for white, and the difference is **≤ 50 centipawns** — a structural term must
  not outweigh material.
- **`A3` (isolated).** **Given** a white pawn on `d4` with friendly pawns on `c3`/`e3` versus the
  same pawn with those removed, **then** the isolated case scores **strictly lower** for white.
- **`A4` (passed, and scaled by rank).** **Given** a white passed pawn on `a5` versus the same pawn
  on `a7`, **then** `a7` scores **strictly higher**, and both score higher than the non-passed
  equivalent.
- **`A5` (a passed pawn is correctly identified).** **Given** **≥ 20** curated positions labelled
  passed / not-passed by hand — including the cases that catch a naive file-only check: an enemy
  pawn on an **adjacent** file ahead, and an enemy pawn **behind** on the same file — **then** the
  classification is correct **20/20**. *(A file-only "passed" check is wrong and passes `A4`.)*
- **`A6` (purity and cost).** **Then** the position is byte-identical after evaluation, and the
  measured mean cost per call stays within **`ABC-076`'s ≤ 1,100 ns total bar** for the combined
  evaluation. **If the combined evaluation exceeds 1,100 ns, report and stop** — `ADR-0003`'s depth
  model is derived at that leaf cost. **And (added 2026-10-09)** `NFR-005`'s depth-in-budget is
  re-read on plain `node`: `chooseMove` at `DEFAULT_BUDGET_MS` on kiwipete and position-6, three
  rounds, alternating with the base build, load recorded. **Depth below 6 on either position is
  FAIL: stop.** Depth 7 not reached is WARN, reported to the owner. Do not tune around either one.
  *(Why a second bar is needed: 1,100 ns no longer guarantees depth 7. The real engine reaches
  depth 7 at 532 363 / 467 461 cumulative nodes (kiwipete / position-6, `qe-ABC-121` `…dc82fb03`),
  against about 650k–820k nodes in 3 s (`uat-run-ABC-121` `…80a5e0a0`, `secnfr-ABC-121`
  `…76eb826c`). On kiwipete that is a margin of roughly 1.2–1.5x. `ABC-076` measured 133 ns/call,
  so a combined cost at the 1,100 ns bar would likely use up that margin.)*
- **`A7` (one corpus and one mirror helper, not two — the non-fork made mechanically red).**
  **Given** this ticket's mirror corpus, **then** it is a **strict superset** of `ABC-076`'s 184
  positions keyed on `board|blackToMove|castling|epSquare` — all 184 present — **and**
  `src/evaluate.test.ts` and this ticket's suite **import that corpus and the mirror helper from one
  shared module**, lifted out of `src/evaluate.test.ts` here rather than in a standalone refactor
  ticket (`clonePosition` `:80`, `mirrorSquare` `:92`, `mirrorPosition` `:107`, `buildCorpus`
  `:139`). That lift replaces the advisory docblock at `:12`–`:20`. **And** that shared module is
  **imported by no production module**: a row asserts that no non-`.test.ts` file under `src/`
  imports it. This follows `src/search.mate-corpus.ts`'s precedent (`ADR-0026` decision 9): a
  plain module, not named `*.test.ts`, so `tsc` and Biome check it and vitest does not collect it.
  *(A forked corpus fails the superset half; a retyped helper fails the import half.)*
  *(Re-worded 2026-10-09. The earlier clause, "not counted by `productionModules()`", is stale and
  cannot be met. `ABC-103` deleted the hand-maintained count it protected (`src/cli.test.ts:1498`),
  and `productionModules()` (`:169`) is `ADR-0011` clause 1's expression, which counts every
  non-test `.ts` in `src/`. `search.mate-corpus.ts` is already counted that way.)*
- **`A8` (the re-pin ledger — the merged pins this term moves, re-measured, never re-levelled).**
  **Given** every row in **§ Merged bars this change can move**, classes **P** and **F**, **when**
  the build lands, **then** the PR note carries one line per row it touched: file:line, old value,
  new value, the command that measured it, and the lane. It also carries one line per **F** row
  saying the fixture still bites (its named mutant or counter-case still reads differently), or
  naming the replacement fixture. **And** no class **R** row's level or bar changed
  (`git diff` shows no edit to those literals). **And** every row stays green on the default lane
  and on the opt-in lanes of the six engine test files: `SEARCH_DEEP=1` on `src/search.test.ts`,
  `src/search.ordering.test.ts`, `src/search.pvs-lmr.test.ts`, `src/quiescence.test.ts` and
  `src/transposition.test.ts`, and `ENGINE_DEEP=1` on `src/engine.test.ts` and
  `src/transposition.test.ts`. *(A pin re-set from the failure message alone,
  or a fixture that no longer bites, fails this. QE checks the list against the tree.)*

## Dependencies

- ~~**`ABC-076` must land first — OPEN.**~~ **`ABC-076` — `Done`** (merged to `main` 2026-08-17).
  Its `evaluate` and the mirror helper are on the base.
- **The merged engine — `ABC-077`…`ABC-081`, `ABC-121`, `ABC-122` — all `Done`.** Their pins are the
  ones `A8` re-measures. This is a code fact on the base, not an open dependency.
- **`ABC-086` (deterministic move selection) — a parallel lane, NOT a dependency.** Both tickets
  touch EPIC-004 engine readings. The one that merges second re-measures any pin the other added.
  The Orchestrator decides merge order (`wave-2026-09-25` `…3b8e51d0`).
- **Downstream:** `ABC-083` should land after this ticket (its page says so). `ABC-084`, the
  strength gate, is unbuilt, so no oracle measures whether this term makes play stronger. The
  value claim is structural, as it was for `ABC-121` (`ADR-0026` Consequences).

## Security / NFR triggers

- **`NFR-005`, part 1** — `A6`'s **≤ 1,100 ns combined** leaf-evaluation bar, which is `ADR-0003`'s
  own modelled worst case. Exceeding it is a **reportable event with a named owner
  (Architect/Design)**, not a thing to tune around.
- **`NFR-005`, part 2 (added 2026-10-09)** — the depth-in-budget read in `A6`: depth 6 is the FAIL
  floor and depth 7 the WARN level (PROVISIONAL). The runner is plain `node`, the binding runner
  per the catalog row. Security/NFR adjudicates the reading at this ticket's gate. Only the
  owner's word moves a level.
- **`NFR-004` (≤ 3 s, 5 s ceiling)** — not plausibly reddened. The budget is clock-enforced, and
  the overshoot is bounded by `NODES_PER_CLOCK_CHECK` (`src/engine.ts:137`, 1 024 nodes) times the
  per-node time. A few-percent slower node moves that by well under 1 ms, against `AR-NFR004-A`'s
  ≤ 31 ms. Security/NFR confirms at the gate.
- **`NFR-009` (16 MiB)** — not triggered. No allocation, and a pawn hash is fenced out above.
- **`N8-LANE` — ≤ 650 ms CPU, net of the 160 ms per-file floor.** The new rows (`A1`–`A5`, `A7`)
  are pure evaluation over about 220 positions, with no search, so they cost little. The
  re-pinned rows are existing rows and are not charged to this lane. **Second-order effect, which
  N8-LANE does not charge but `NFR-008` sees:** a costlier `evaluate` slows every existing default-
  lane search and engine row, because the evaluator runs at nearly every node. The Engineer
  reports that delta (`UNKNOWN - verify`, measure it, do not estimate it). `NFR-008` is already
  breached or unruled (`ABC-108`), so the delta is reported, not claimed against a level.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A5` is the real test.** "Passed" is the only one of the three that is easy to get subtly wrong,
   and `A4` will pass with a wrong definition.
2. **Extend `ABC-076`'s corpus and mirror helper; do not fork them** — `A7` is the red test that
   enforces it, and it replaces the advisory comment in `src/evaluate.test.ts`. The lift is in scope
   HERE, so it is not a coding-rule-9/10 drive-by refactor. Do not relax
   `lint/suspicious/noExportsInTest`: the answer is a plain module, not an exception.
3. **Assert relations, not totals.** The weights are hand-tuned and will move.
4. **Re-pin from a measurement, never from the failure message** (rule already written at
   `src/search.ordering.test.ts:602`–`:610`). Re-run the named mutant or counter-case before you call a
   fixture "still biting". The probes that built the fixtures are on record:
   `.grugops/context/ticket-to-pr-ABC-121/probe/` (`a4scan.ts`, `a4engine.ts`) and the
   `ruling-abc079-g1g2` oracle (`searchWithoutPruning(p, 3)` in plain node, about 160 s on
   kiwipete and 28 s on position-6).
5. **Weights affect the pins.** `A2` caps the doubled penalty at 50 cp. The passed bonus has no
   cap, and a large one narrows `QE-G3`'s `> 400` margin (black's c6/d5 are passed). Size the
   bonus with that in mind. This note adds no new bar.
6. **Pawnless fixtures cannot move** (mate corpus, `FORK`, the `G6` knight pair, the depth-10 rook
   ending). If one of them goes red, the term is firing where no pawn exists, and that is a bug.

## Size and priority rationale

**Size `M` (3) — re-sized 2026-10-09 from `S` (2).** The term itself is still small. The size
change comes from what `S` could not see in August, when no search existed: the first evaluator
change on a pinned engine. It means eight rows of exact pins (about 20 values) re-measured (`A8`), seven fixture bites
re-verified (rows 3 and 8–13), an oracle run of about 190 s, the six engine test files' opt-in lanes (the
`search.pvs-lmr.test.ts` deep lane alone is about 926 s wall, `AGENTS.md`), and a three-round
plain-node depth read. That is measuring, not thinking, but it does not fit in `S`. **Not `L`:**
no new production module, no new dependency edge. **Not `XL`.** The text below is the original
`S` rationale, kept as written.

**Original rationale, `S` (2).** Three small predicates and a weighted sum, on an existing module with an existing
test property. **`A7`'s lift is inside `S`:** moving three working functions into a shared module and
re-pointing two imports is typing, not thinking. **Not `M`:** no new production module, no new
dependency edge, no open decision.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** The engine plays legal, non-blundering chess without it — `P0` work in this epic
is what makes it *work*; this makes it *good*. Six `P0` tickets sit in front of it.

## Merged bars this change can move

Found at `f952983` by reading every engine test file for a pinned node count, score, move or
depth, and checking each fixture for pawns. A row on a pawnless board cannot move. "Could
redden" is a judgement, `UNKNOWN - verify` until the build measures it. **Classes:** **P** = exact
pin; the Engineer re-pins it from a measurement and QE checks it. **F** = a fixture whose purpose
is a property the term can destroy; the Engineer re-measures it, re-finds the fixture with the
recorded probe if the property is lost, and QE re-kills the named mutant. If no fixture can be
found, Architect/Design decides. **R** = a level or relation; nobody re-levels it here. If it
reddens: stop and report. Architect/Design rules on code bars. Security/NFR measures NFR levels,
and only the owner's word moves one.

| # | row (file:line) | pinned | class | could redden? |
|---|---|---|---|---|
| 1 | `ABC-080` `A4` `search.ordering.test.ts:419`–`:422` | position-6 d2: 9 804 / 3 391 / 2 467 nodes | P | likely, pawn-rich |
| 2 | `ABC-079` QE G4 `search.ordering.test.ts:436`–`:438` | promotion-capture d3: 261 nodes | P | yes (b7 passed pawn) |
| 3 | `ABC-080` QE G1 `search.ordering.test.ts:612`–`:620` | position-3, 3 ticks: depth 3, 358 nodes (mutant `N3` reads 355) | P+F | likely |
| 4 | `ABC-081` `A1` `transposition.test.ts:360`–`:366` | position-3 d4: 1 123 / 1 299 nodes | P | likely |
| 5 | `ABC-081` `A5` `transposition.test.ts:484`–`:494` | 7 241 nodes; −470 at d3 (the 0 and `f7f8` hold: exact draw score, ≥ 300 cp margins) | P | possible (g/h pawns) |
| 6 | `ABC-079` `A4` `quiescence.test.ts:415`–`:434` | position-6 bare leaf: d2 136 / `g5f6`; deep d3 2 273 / `c3d5` | P | likely |
| 7 | `ABC-079` `A5` oracle `quiescence.test.ts:471`–`:474`, `:509`–`:516` (deep) | kiwipete 50 / `e2a6`, position-6 30 / `c3d5` | P | likely. Re-pin only by the in-file rule: `searchWithoutPruning(p, 3)` equals `search()` |
| 8 | `ABC-121` `A4` `search.pvs-lmr.test.ts:406`, `:441`–`:476` | `[95, "h5e5"]`, both recursions; a null-window re-search > 0 | P+F | near-certain (`A4_FEN` has isolated pawns). Bite: `noLmrResearch`/`noResearch` must still differ (`a4scan.ts`, `a4engine.ts`). This is the only row that reds `noLmrResearch` (`ADR-0026`) |
| 9 | `ABC-078` `A3` `engine.test.ts:303`–`:341`; deep `:916`–`:919` | `A3_FEN`, 3 ticks: depth 2, aborted in depth 3, move ≠ `g4g5`; deep `g4g5` | F | likely: the tick depth is a node count |
| 10 | `ABC-080` Scope tie `search.ordering.test.ts:353`–`:371` | `TIE_FEN` d1: `f8f7` vs `e7f7` at equal score (mutant `M11`) | F | possible: same pawns at the root, but quiescence lines differ |
| 11 | `ABC-078` `A2` `engine.test.ts:254`–`:268` | kiwipete 10 ms step: nodes ≤ 10 × 1 024. Was 267 under the bound at `ABC-079` (mutant `M1`) | F (bound is R) | possible, thin margin |
| 12 | `ABC-078` `A4` `engine.test.ts:521`–`:532`; deep `:898`–`:912` | kp-vs-k ticks: deep ≥ 6, > shallow; deep lane ≥ 7 | F | possible |
| 13 | `ABC-081` `A5` `transposition.test.ts:502`–`:525` | 6 ticks: depth 4, score 0; deep: 10 ticks depth ≥ 5 | F | possible (tick depth) |
| 14 | `ABC-079` `A5` levels `quiescence.test.ts:450` | `ADR-0024` stops: 180/50/70×, 10/26/13×. The 1.5x headroom was designed for this change | R | unlikely; this ticket is the first test of that headroom |
| 15 | `ABC-080` `A3` `search.ordering.test.ts:386`–`:401` | ≤ 40.5% d2 (reads 25.2%); ≤ 4% d4 deep (read 2.64 / 2.10%) | R | unlikely |
| 16 | `ABC-077` `A2` `search.test.ts:430`–`:443` | pruned/unpruned < 40% | R | unlikely |
| 17 | `ABC-081` `A2`/`A3` `transposition.test.ts:380`–`:446` | hit rate ≥ 15%; ≤ 70% nodes | R | unlikely |
| 18 | `ABC-080` `A4` deep `search.ordering.test.ts:457`–`:470` | each heuristic cuts nodes; delete rule at d5 | R | possible |
| 19 | `ABC-121` `A1` drift `search.pvs-lmr.test.ts:616`–`:645` (deep) | ≥ 95% within 25 cp, ≤ 75 cp (read 98.40 / 99.47%, max 50 / 45) | R | possible. Do not tune (`ADR-0026` decision 9) |
| 20 | `ABC-121` `A5`/`A2`/door-bites `search.pvs-lmr.test.ts:208`–`:231`, `:496`–`:512`, `:647`–`:662` | shipped < pre nodes; node inequalities | R | unlikely |
| 21 | `ABC-079` `A1` `quiescence.test.ts:303`–`:345`; `QE-G3` `search.qe.test.ts:108`–`:120` | ≤ 1/24 losing; bare ≥ 23/24; poisoned pawn > 400 | R | unlikely (see test note 5) |
| 22 | `NFR-005` (`A6`) | depth ≥ 6 FAIL, depth 7 WARN, plain node | R | **possible, depth 7 on kiwipete** (margin ~1.2–1.5x) |
| 23 | `NFR-008` total (`ABC-108`) | default-lane CPU | R | yes, slightly; report the delta |

**Cannot redden** (both sides call the same `evaluate`, or the board has no pawns): `ABC-077` `A1`,
`A3`, `A5`; `ABC-078` `A3` identity sweeps; `ABC-079` `A2` and `A4`'s quiet rows; `ABC-080` `A1`;
`ABC-081` `A1` sweeps, the `G6` knight pair (`:315`, pawnless), and the depth-10 rook ending (`:208`);
`ABC-121`'s PVS identity chain, mate floor (`src/search.mate-corpus.ts`, 0 pawns), and `A3`
predicate table; `QE-G2` `FORK`; `ABC-122`'s capacity guards (expected score computed, not
pinned); `NFR-004`; `NFR-009`. `ABC-076` `A1`–`A5` hold provided the new term is mirror-exact,
which is this ticket's own `A1`.

## Definition of Ready

Assessed by BA/PM, **2026-08-16**. **Result: 9 of 10 clean, 1 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** stated as a limitation of the delivered PST term, not as a missing feature |
| 2 | scope and out-of-scope clear | **✅** four fences, including a rejected optimisation with the evidence that would reopen it |
| 3 | INVEST-shaped | **⚠️** **not independent** — `ABC-076` must land first |
| 4 | acceptance testable and measurable | **✅** seven (`A7` added 2026-08-17): exact-equality mirror over an extended corpus, a strict-superset + one-module corpus check, three strict orderings, a **≤ 50 cp** ceiling on a structural term, **20/20** passed-pawn classification with the two hard cases named, a **≤ 1,100 ns** combined cost bar |
| 5 | dependencies known | **✅** one open ticket |
| 6 | security/NFR triggers with a measurable target | **✅** ≤ 1,100 ns combined with a named owner for the overrun; lane bar assessed |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P1`, with the reason for not being `P0` stated |
| 10 | no major unresolved blocker | **✅** none |

### DoR re-score — 2026-10-09, BA/PM (`rescore-abc082`, against `f952983`)

**Result: 10 of 10 — MET. Page set to `Ready`.** The board move belongs to the Orchestrator.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged |
| 2 | scope and out-of-scope clear | **✅** the term's call sites are now named; re-pinning is in scope; an evaluator door and any re-levelling are fenced out, with the reason given |
| 3 | INVEST-shaped | **✅ flips from ⚠️.** `ABC-076` is `Done`. `ABC-086` is a parallel lane whose merge order the Orchestrator decides, not a dependency |
| 4 | acceptance testable and measurable | **✅** eight criteria. `A6` gains the `NFR-005` depth read; `A7`'s stale `productionModules()` clause is replaced by an import check that can actually be met; `A8` makes the re-pin ledger checkable |
| 5 | dependencies known | **✅** none open; parallel lane and downstream tickets named |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-005` in two parts (≤ 1,100 ns; depth 6 FAIL / 7 WARN on plain node); `NFR-004` and `NFR-009` assessed as not reddened; `N8-LANE` ≤ 650 ms net, with the `NFR-008` second-order delta reported |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `M` (3), re-sized from `S`, with the reason given |
| 9 | priority assigned | **✅** `P1`, unchanged |
| 10 | no major unresolved blocker | **✅** none. One reading is recorded, not left open: `ADR-0026` decision 10 does not reach an evaluation term (Out of scope). Architect/Design can overrule it. If they do, Scope and Size change and this score must be redone |
