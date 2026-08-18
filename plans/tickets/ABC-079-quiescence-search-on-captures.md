---
id: ABC-079
title: Quiescence search on captures — the horizon fix
status: backlog
column: Backlog
size: S
priority: P0
epic: EPIC-004
feature: —
---

# ABC-079 — do not evaluate a position in the middle of a trade

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). Separated from
> `ABC-077` because it is independently valuable, independently measurable against a puzzle set, and
> because it is the term `ADR-0003`'s depth model prices separately (**quiescence 2.5x**).

## Problem

*User*: the player who watches the engine capture a defended pawn with its queen.

*Pain*: a fixed-depth search evaluates whatever position it lands on. If the last ply was a capture,
the recapture is one ply beyond the horizon and the evaluator scores a won pawn on a position where
a queen is about to be lost. **This is the single largest source of nonsense moves in a
material-evaluated search**, and it is exactly the failure the epic's fourth acceptance criterion
names: *"a piece hangs to a simple one-move tactic … it does not play the losing move."*

*Value*: it is the cheapest large strength gain in this epic — the epic's own scope calls move
ordering *"where most of the strength-per-line-of-code lives"*, and quiescence is second.

## Scope

- At a leaf, instead of evaluating, **search capture moves only** until the position is quiet.
- **Stand-pat**: the static evaluation is a lower bound — if it already beats beta, cut.
- Alpha-beta inside the quiescence search, same convention as `ABC-077`.
- A depth cap on the quiescence recursion **as a runaway guard only**, not as a budget.

## Out of scope

- **Checks in quiescence, delta pruning, SEE (static exchange evaluation).** Not requested; coding
  rule 5. If `ABC-084`'s puzzle count says one is needed, that is a new ticket with evidence.
- **Promotions as quiescence moves.** Deliberately excluded for now and named so it is a decision
  rather than an omission — revisit only with a puzzle-count measurement.
- **The per-move budget.** `ABC-078`'s. The runaway cap here is not a budget and must not become
  one.

## Acceptance (Given/When/Then)

- **`A1` (the hanging-piece criterion, from the epic).** **Given** a curated set of **≥ 20**
  positions where a naive material search plays a losing capture, **when** searched at default
  strength with quiescence, **then** the losing move is **not** chosen in **≥ 19 of 20** — and the
  same set is run **without** quiescence in the same test to show the *before* number, which must be
  strictly worse. *(A criterion with no baseline cannot show the feature did anything.)*
- **`A2` (stand-pat is a lower bound, not a replacement).** **Given** a quiet position, **then** the
  quiescence result equals the static evaluation **exactly**. **Given** a position where a winning
  capture exists, **then** the result is **strictly greater** than the static evaluation.
- **`A3` (it terminates).** **Given** **≥ 200** positions from the perft corpus including
  capture-dense ones, **then** quiescence returns on all 200 and the observed recursion depth never
  exceeds the stated cap.
- **`A4` (it does not change quiet-position results).** **Given** positions with **no** captures
  available at any depth in the leaf neighbourhood, **then** search scores are **identical** to the
  pre-quiescence build.
- **`A5` (cost is bounded and reported).** **Then** the measured node-count multiplier from
  quiescence is reported on `kiwipete` and `position-6`. **`ADR-0003`'s model assumes 2.5x.** If the
  measured multiplier exceeds **4x**, **stop and report** — the depth arithmetic this epic rests on
  was derived at 2.5x and a 4x reading invalidates it. **Do not tune the number to fit.**
- **`A6` (position integrity).** **Then** the input `Position` is byte-identical after every search,
  over the corpus.

## Dependencies

- **`ABC-077` — MERGED to `main` 2026-08-18, DISCHARGED.** It is the search this modifies. Measured
  2026-08-18 at HEAD `7ea9e1b`: `search()` at `src/search.ts:167`, `searchWithoutPruning()` at
  `:178`, `MATE_SCORE` at `:40`. **`A4`'s "pre-quiescence build" baseline is therefore a real thing
  in the tree**, not a hypothetical.
- **`ABC-076` — MERGED to `main` 2026-08-17, DISCHARGED** (transitively; stand-pat is the static
  evaluation, `src/evaluate.ts`).
- **THE ≥ 20-POSITION CORPUS IS THIS TICKET'S TO BUILD — ruled 2026-08-18 by BA/PM** (task
  `refinement-p0-chain-2026-08-18`), and the ruling is **asymmetric on purpose**. Both this page and
  `ABC-084` carried *"whichever lands first builds it"*, which is a rule that decides nothing while
  both are open. **The dependency graph decides it, not preference:** at HEAD `7ea9e1b` this
  ticket's only two dependencies are merged, while `ABC-084` still needs `ABC-078`, which is not
  built — so this ticket is the only one of the two that CAN land first. `ABC-084`'s own page already
  says *"`ABC-079` should land first"*. **So: `ABC-079` builds the corpus; `ABC-084` extends it and
  does not fork it.** The cost was already priced into `S` (see `## Size and priority rationale`,
  which names the curated position set as this ticket's main cost). **`ABC-084`'s page and board row
  still carry the symmetric wording and need the one-line follow-up; that is the Orchestrator's to
  route, and it does not gate this ticket.**

## Security / NFR triggers

- **`NFR-005`** — `A5`'s **2.5x expected / 4x stop** multiplier is this ticket's contribution to the
  depth model. It is a named input to `ADR-0003`'s arithmetic, and exceeding it is a **reportable
  event with a named owner (Architect/Design)**, not a tuning exercise.
- **`N8-LANE` — ≤ 650 ms CPU.** `A1`'s 20-position set runs with a **millisecond budget**, not the
  3 s default — the puzzle work at real budgets is `ABC-084`'s and is opt-in.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A1` must run both arms in the same test.** A puzzle number with no baseline proves nothing
   about the change that claims it.
2. **`A2`'s quiet-position exact equality is the cheapest correctness check** — write it first.
3. **`A5` is a stop condition, not a metric to admire.** If it reads > 4x, the ticket reports and
   halts; it does not adjust the cap until the number looks acceptable.
4. **Reuse `ABC-076`'s mirror helper corpus** where positions overlap. Do not fork a second corpus.

## Size and priority rationale

**Size `S` (2).** One recursive function of maybe 25 lines, sharing `ABC-077`'s conventions, with a
curated position set as the main cost. **Not `M`:** no new module, no new dependency edge, no
design decision open.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P0`.** It is the direct implementation of one of the epic's five acceptance criteria.

## Definition of Ready

Cut-hop assessment by BA/PM **2026-08-16**: **8 of 10, ⚠️x2** — items 3 and 10.

**RE-SCORED against the tree at `main` HEAD `7ea9e1b` by BA/PM, 2026-08-18** (task
`refinement-p0-chain-2026-08-18`). **Result: 10 of 10, 0 ⚠️ — the Definition of Ready is MET.**

- **⚠️(3) is DISCHARGED BY MEASUREMENT.** `ABC-076` merged 2026-08-17 and `ABC-077` merged
  2026-08-18; both in `Done`, both exports present at HEAD.
- **⚠️(10) is DISCHARGED BY RULING, not by a merge.** The corpus still does not exist — what has
  changed is that **it is no longer nobody's**. It is **this ticket's to build**, ruled from the
  dependency graph rather than from preference (see `## Dependencies`). The corpus was never a
  blocker on BUILDING or on VERIFYING; it was an **ownership vacuum**, which is this board's recorded
  failure mode, and it is now filled asymmetrically. Building a fixture set is in-scope work, and the
  `S` sizing already priced it.

Column moves are the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the horizon effect stated as a behaviour, tied to the epic's own fourth criterion |
| 2 | scope and out-of-scope clear | **✅** three fences, two of them recorded as *decisions not to build*, with the evidence that would reopen them |
| 3 | INVEST-shaped | **✅** *(was ⚠️)* **independent** — both tickets in front of it (`ABC-076`, `ABC-077`) are merged to `main` and in `Done`. Discharged by measurement 2026-08-18 |
| 4 | acceptance testable and measurable | **✅** six: ≥ 19/20 with a mandatory worse baseline, exact equality on quiet positions, 200/200 termination under a stated cap, unchanged quiet scores, a 2.5x/4x multiplier with a stop rule, byte-identical position |
| 5 | dependencies known | **✅** the two ordering dependencies are **merged**, both named with the reason they ran in that direction; and the shared corpus now has **one named owner** rather than a symmetric race |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-005` 2.5x expected / **4x stop** with a named owner; lane bar with a stated remedy |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **✅** *(was ⚠️)* the ≥ 20 position set still does not exist, and **that is scope, not a blocker: it is now ruled THIS ticket's to build** (2026-08-18, from the dependency graph — `ABC-084` needs `ABC-078`, which is unbuilt, so this ticket is the only one of the two that can land first). `ABC-084` extends and does not fork. The symmetric *"whichever lands first"* rule that decided nothing is replaced by a named owner. **Open follow-up, not gating: `ABC-084`'s page and row still carry the old symmetric wording** |
