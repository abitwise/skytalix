---
id: ABC-082
title: Evaluation — pawn structure (doubled, isolated, passed)
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-004
feature: —
---

# ABC-082 — the three pawn terms the epic names, and no fourth

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). Second of three
> evaluation tickets (`ABC-076` material + PST, `ABC-083` king safety + mobility).

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

## Out of scope

- **Backward pawns, pawn chains, connected passers, pawn storms.** The epic names three; coding
  rule 5. Adding a fourth needs a measured strength justification.
- **A pawn hash table.** A caching optimisation nobody has asked for and no measurement calls for —
  coding rule 7. Revisit only if `ABC-083`'s or `ABC-080`'s figures show pawn evaluation as a
  measurable cost.
- **King safety and mobility** — `ABC-083`.
- **Tapered / endgame-specific weights.** Same fence as `ABC-076`.

## Acceptance (Given/When/Then)

- **`A1` (symmetry — `ABC-076`'s property, extended not forked).** **Given** any position and its
  colour mirror, **then** the scores are **exactly equal**, over `ABC-076`'s corpus **plus ≥ 15 new
  pawn-structure positions**. *(Pawn terms are directional and this is where a sign bug lives.)*
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
  model is derived at that leaf cost.

## Dependencies

- **`ABC-076` must land first — OPEN.** This is an additive term on its score and reuses its mirror
  helper.

## Security / NFR triggers

- **`NFR-005`** — `A6`'s **≤ 1,100 ns combined** leaf-evaluation bar, which is `ADR-0003`'s own
  modelled worst case. Exceeding it is a **reportable event with a named owner
  (Architect/Design)**, not a thing to tune around.
- **`N8-LANE` — ≤ 650 ms CPU.** Pure functions over ~35 positions; comfortably inside.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A5` is the real test.** "Passed" is the only one of the three that is easy to get subtly wrong,
   and `A4` will pass with a wrong definition.
2. **Extend `ABC-076`'s corpus and mirror helper; do not fork them.**
3. **Assert relations, not totals.** The weights are hand-tuned and will move.

## Size and priority rationale

**Size `S` (2).** Three small predicates and a weighted sum, on an existing module with an existing
test property. **Not `M`:** no new module, no new dependency edge, no open decision.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** The engine plays legal, non-blundering chess without it — `P0` work in this epic
is what makes it *work*; this makes it *good*. Six `P0` tickets sit in front of it.

## Definition of Ready

Assessed by BA/PM, **2026-08-16**. **Result: 9 of 10 clean, 1 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** stated as a limitation of the delivered PST term, not as a missing feature |
| 2 | scope and out-of-scope clear | **✅** four fences, including a rejected optimisation with the evidence that would reopen it |
| 3 | INVEST-shaped | **⚠️** **not independent** — `ABC-076` must land first |
| 4 | acceptance testable and measurable | **✅** six: exact-equality mirror over an extended corpus, three strict orderings, a **≤ 50 cp** ceiling on a structural term, **20/20** passed-pawn classification with the two hard cases named, a **≤ 1,100 ns** combined cost bar |
| 5 | dependencies known | **✅** one open ticket |
| 6 | security/NFR triggers with a measurable target | **✅** ≤ 1,100 ns combined with a named owner for the overrun; lane bar assessed |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P1`, with the reason for not being `P0` stated |
| 10 | no major unresolved blocker | **✅** none |
