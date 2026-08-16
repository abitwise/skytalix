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

## Dependencies

- **`ABC-076` must land first — OPEN.**
- **`ABC-082` should land first — OPEN.** Not strictly required, but `A5`'s combined-cost bar and
  `A1`'s shared corpus both assume it; running this first means measuring a bar twice.
- **`ABC-078` must land first for `A7` — OPEN.** A 3 s budget needs the deepening loop.

## Security / NFR triggers

- **`NFR-005` — this is the ticket most likely to break it.** `A5`'s **≤ 1,100 ns** total leaf cost
  and `A7`'s **non-decreasing completed depth** are both hard bars with a named owner
  (Architect/Design) for the overrun.
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

## Size and priority rationale

**Size `S` (2).** Two additive terms on an existing module with an existing test property. **The
risk is in the measurement, not the volume of code** — and a risk that is fully expressed as two
hard-stop criteria does not make a ticket bigger, it makes it honest.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** Same reason as `ABC-082`: the engine plays sound chess without it.

## Definition of Ready

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
