---
id: ABC-083
title: Evaluation — king safety and mobility
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-004
feature: —
---

# ABC-083 — the last two evaluation terms the epic names, and the one that costs

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). Third and last
> evaluation ticket (`ABC-076`, `ABC-082`). **Mobility is here rather than in `ABC-076` because it
> is the only evaluation term that calls the move generator, which makes it the only one with a real
> cost risk — and that risk belongs in one ticket where it can be measured, not spread across
> three.**
>
> **Folded 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-09`,
> Workflow 07). Two criteria were added. `A8` is QE's `ABC-082` gap G-QE-1, the one-sided
> isolated-pawn check. `A9` is the trigger of the accepted risk `AR-NFR005-082`, put on the page as
> a criterion. The Dependencies section now records that all three dependencies are `Done`. The
> routing note is `.grugops/context/cut-followups-2026-10-09/notes/`.

## Problem

*User*: the player whose attack the engine walks into.

*Pain*: with material, tables and pawn structure, the engine still shuffles pieces to no purpose and
leaves its king in a draughty position, because nothing scores *activity* or *exposure*. These are
the last two terms the epic's scope names and neither exists.

*Value*: mobility is the cheapest proxy for "having a plan"; king safety is what stops the engine
losing to a straightforward attack, which at 1400–1700 is how most games are decided.

## Scope

- **King safety** — a penalty scaled by missing pawn shelter in front of the king and by open or
  half-open files adjacent to it.
- **Mobility** — a bonus proportional to the number of legal moves available, from the side to
  move's point of view, symmetric across colours.
- Additive terms on `ABC-076`'s score, same units, same sign convention.

## Out of scope

- **Attack-unit / king-tropism tables, pawn storms, piece-specific mobility weights.** Not requested;
  coding rule 5.
- **Tapered evaluation** (king safety mattering less in an endgame). It is the obvious next step and
  it is **deliberately not cut** — recorded as a decision, revisitable with a measured strength
  justification, not an omission.
- **Pawn structure** — `ABC-082`. The open-file component here reads pawn placement but does not
  duplicate `ABC-082`'s terms.

## The cost risk, stated up front

**Mobility needs a move count for both sides, and `legalMoves` is 2.1–5.4 µs per call**
(`ADR-0003`, measured). **Two `legalMoves` calls at every leaf would put leaf evaluation at 4–11 µs
— four to ten times `ADR-0003`'s 1,100 ns worst case — and the entire depth-in-budget derivation
this epic rests on would stop holding.** `A5` makes this a hard stop rather than a discovery.
**A cheaper mobility proxy (pseudo-legal counts, or attack-map counts) may be required; choosing one
is a design decision inside this ticket's own module, but if the answer is that mobility cannot be
afforded at all, that is Architect/Design's call and this ticket reports rather than drops the
term.**

## Acceptance (Given/When/Then)

- **`A1` (symmetry).** **Given** any position and its colour mirror, **then** scores are **exactly
  equal**, over the `ABC-076`/`ABC-082` corpus **plus ≥ 15 new positions** covering exposed and
  sheltered kings.
- **`A2` (shelter).** **Given** a white king castled kingside with pawns on `f2`/`g2`/`h2` versus
  the same position with `g2` removed, **then** the second scores **strictly lower** for white.
- **`A3` (open file next to the king).** **Given** a castled king with a half-open adjacent file
  versus a closed one, **then** the half-open case scores **strictly lower** for white.
- **`A4` (mobility, and it is bounded).** **Given** a position where white has substantially more
  available moves than black and material is equal, **then** white scores **strictly higher**, and
  the total mobility contribution never exceeds **±100 centipawns** — mobility must not outvote a
  minor piece.
- **`A5` (the cost stop — the criterion this ticket exists to enforce).** **Then** the measured mean
  cost of the **complete** evaluation (`ABC-076` + `ABC-082` + this) is reported with machine and
  Node version and is **≤ 1,100 ns**. **Above 1,100 ns: STOP and report to Architect/Design.** Do
  not ship an evaluation that invalidates `ADR-0003`'s depth model and do not re-derive the model to
  fit the code.
- **`A6` (purity).** **Then** the position is byte-identical after evaluation, over the whole corpus
  — asserted, because a mobility term is the most likely place in this epic to call something that
  make/unmakes.
- **`A7` (depth does not regress).** **Given** a 3 s budget on `kiwipete` and `position-6`, **then**
  completed depth is **≥** the pre-`ABC-083` build's, same machine, same process. *(A leaf term is
  paid at every leaf; this is the criterion that notices.)*
- **`A8` (the isolated-pawn neighbour check reads BOTH adjacent files; added 2026-10-09).** This
  is QE's `ABC-082` gap G-QE-1 (`…9b4e2d61`, mutants `E8`/`E9` in `…5c1e7a20`). **Given**
  `src/evaluate.pawns.test.ts`, **then** it carries a row in the style of `ABC-082`'s `A3` in which a
  white pawn's only friendly neighbour stands on **one** adjacent file. There is one such case per
  side, left and right. **And** with QE's `E8` planted (the isolation check sees only the right-hand
  file), at least one of those rows is **red**, and likewise with `E9` (left-hand file only). Both
  are on the default lane of that file, and both rows are green with the mutant removed. The PR
  note records each mutant run: the command, the exit code and the red row. *(A red only on the
  class-P exact node pins elsewhere does not count. Those pins move with every evaluator change.)*
- **`A9` (`AR-NFR005-082`'s trigger, the owner's accepted risk; added 2026-10-09).** **Given**
  this ticket's build and its base, **then** the PR note carries two readings.
  - **Plain-node depth.** Repeat `ABC-082` `A6`'s read: `chooseMove` at `DEFAULT_BUDGET_MS` on
    `kiwipete` and `position-6`, on plain `node`, a fresh process per run, three rounds
    alternating with the base build, with the machine, the Node version and the 1-minute load
    recorded.
  - **Clock-free nodes to depth 7 on `kiwipete`.** Report the cumulative nodes to complete depth
    7, on base and on branch. The `ABC-082` reading was 532 363 → 610 179.

  **Depth below 6 on either position is FAIL: stop.** If `kiwipete` does not reach depth 7 on an
  uncontended reference machine, **stop and report to Security/NFR**. **The owner decides whether
  depth 7 stays a level** (`AR-NFR005-082`, accepted 2026-10-09, note `…8e3f0b17`). Do not tune
  around it. *`A7` reads the same runs. A `kiwipete` drop from 7 to 6 reds `A7`, and that drop is
  exactly this trigger. It is routed here, and `A7` is not re-levelled on this page.*

## Dependencies

- ~~**`ABC-076` must land first — OPEN.**~~ **`ABC-076` — `Done`** (merged 2026-08-17).
- ~~**`ABC-082` should land first — OPEN.**~~ **`ABC-082` — `Done`** (accepted 2026-10-09, merged
  `0de4a93`). `A5`'s combined-cost bar and `A1`'s shared corpus (`src/evaluate.mirror-corpus.ts`)
  are on the base. Its evaluator reads **357.8–366.1 ns** (Security/NFR, `…c04abe30`), which leaves
  this ticket roughly 735 ns of `A5`'s 1,100.
- ~~**`ABC-078` must land first for `A7` — OPEN.**~~ **`ABC-078` — `Done`.** The deepening loop
  exists.
- **`ABC-084`'s trigger applies.** This ticket changes `src/evaluate*.ts`, so QE runs the puzzle
  suite at review, and a red result is a QE FAIL (`ABC-084` § The trigger, once it merges).

## Security / NFR triggers

- **`NFR-005` — this is the ticket most likely to break it.** `A5`'s **≤ 1,100 ns** total leaf cost
  and `A7`'s **non-decreasing completed depth** are both hard bars with a named owner
  (Architect/Design) for the overrun.
- **`NFR-005`, depth (added 2026-10-09).** `A9` carries `AR-NFR005-082`'s trigger. Depth 6 is the
  FAIL floor and depth 7 the WARN level (PROVISIONAL), read on plain `node`. Security/NFR
  adjudicates the reading, and only the owner moves a level.
- **`NFR-001`** — if mobility calls `legalMoves`, the per-node call count rises. **Report the
  measured calls per leaf**; the existing `gameend.nfr.test.ts` call-count guards must stay green.
- **`N8-LANE` — ≤ 650 ms CPU.** `A7`'s 3 s runs are **opt-in**, not default lane.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A5` before the term is tuned, not after.** The cheap-proxy decision is made by that
   measurement, and making it late means writing the term twice.
2. **`A6` matters more here than in `ABC-076`/`ABC-082`** — this is the term that might call
   `legal.ts`, and `zobristKey`'s transient mutation is already on this project's record.
3. **Extend the existing corpus and mirror helper. Third ticket, same helper, no fork.**
4. **`A4`'s ±100 cp ceiling is a guard, not a target.** Assert the bound and the ordering, not the
   value.
5. **`A8`: a strict ordering may not separate the mutant** *(added 2026-10-09)*. Under `E8`/`E9`
   the one-sided pair still scores one isolated pawn fewer than a fully isolated pair at equal
   material, so "scores higher" can stay green. QE's exact hand row `H20` (`a4` + `b2`, neither
   isolated, +25) is red under both mutants. A relation that only the isolated term can decide
   (like `A3`'s `a3`/`g3` row) works too. Prove the row with the mutants; do not rely on reading
   it.
6. **`A9` needs a quiet machine** *(added 2026-10-09)*. At a 1.05x margin, load alone moves
   `kiwipete` across depth 7 (Security/NFR read it lost under a spike on base too). Record the load
   with every round. The nodes-to-depth-7 read does not depend on the clock, so it is the number
   that does not move with load.

## Size and priority rationale

**Size `S` (2).** Two additive terms on an existing module with an existing test property. **The
risk is in the measurement, not the volume of code** — and a risk that is fully expressed as two
hard-stop criteria does not make a ticket bigger, it makes it honest.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** Same reason as `ABC-082`: the engine plays sound chess without it.

## Definition of Ready

**Fold re-read, 2026-10-09** (subtask `cut-followups-2026-10-09`, wave tip `7b54dae`). This hop
re-read the items the fold touched. **Result: 9 of 10, 1 ⚠️, NOT met; stays in `Backlog`.**
- **Item 3, ⚠️ → ✅.** All three dependencies are `Done` (§ Dependencies), so the ticket is
  independent.
- **Item 4 stays ✅.** It now has nine criteria. `A8` is a mutant-kill check, red under `E8` and
  under `E9`. `A9` repeats the depth read with a FAIL at depth 6 and an owner stop at depth 7.
- **Item 5 stays ✅.** `ABC-084`'s trigger is now named.
- **Item 6 stays ✅,** and now covers `NFR-005` depth.
- **Item 7 stays ✅,** with six test notes.
- **Item 10 stays ⚠️, and it is wider now.** It is still unknown whether mobility is affordable.
  `AR-NFR005-082` adds a second likely stop: at a 1.05x margin, `kiwipete` depth 7 will very likely
  be lost. Both stops are written as criteria (`A5`, `A9`) with named owners. Neither fallback is
  decided in advance.

Assessed by BA/PM, **2026-08-16**. **Result: 8 of 10 clean, 2 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** both terms named by the epic; the pain stated as observed behaviour |
| 2 | scope and out-of-scope clear | **✅** three fences, one recorded as a deliberate deferral with its reopening evidence |
| 3 | INVEST-shaped | **⚠️** **not independent** — three open dependencies, one of them soft |
| 4 | acceptance testable and measurable | **✅** seven: exact-equality mirror, three strict orderings, a **±100 cp** bound, a **≤ 1,100 ns** hard stop with a named owner, byte-identical purity, non-decreasing depth |
| 5 | dependencies known | **✅** three open tickets, one flagged as soft with the cost of ignoring it stated |
| 6 | security/NFR triggers with a measurable target | **✅** ≤ 1,100 ns, non-decreasing depth, reported `legalMoves` calls per leaf against merged guards |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2), with the volume-vs-risk reasoning stated |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **⚠️** **whether mobility is affordable at all is genuinely unknown** — 2 × `legalMoves` per leaf is 4–10x over the modelled budget. `A5` makes it a stop rather than a surprise, **but the fallback (a cheaper proxy, or dropping the term) is not pre-decided and is Architect/Design's if the bar is missed** |
