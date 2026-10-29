---
id: ABC-235
title: "Value-identical cuts in cost per node, chosen from ABC-227's profile: same moves, same order, same scores, more nodes a second"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-010
---

# ABC-235: value-identical cuts in cost per node

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 7, the
> part that stands (SA `…837e6fa8`): pseudo-legal generation before the legality test (`src/legal.ts:94-95`), the
> 64-square evaluator walk (`src/evaluate.ts:368-385`), and per-move allocation in `orderMoves`
> (`src/search.ts:193-196`). **Waits in Backlog on `ABC-227`**, which names the cuts. Value-identical, so it is not
> held by Q4.

> **NOTED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`): a smoke pair per **value-changing** ticket. This ticket is value-identical, so it
> stays on `EPIC-008`'s S2 and plays no smoke. Its DoR (9/10) is unchanged. `ABC-227` is Done (`f4301d0c`), and this
> ticket is In Design (`arch-ABC-235`) on the Orchestrator's board.

## Problem

- **User:** the owner at level 5.
- **Pain:** a node costs more than it must in at least the places the SA named; which ones matter is `ABC-227`'s.
- **Value:** more nodes in the same 3 s with **identical** answers at any fixed node count, the `ABC-206` shape.
  Whether more nodes win games is not claimed (§ B item 7: "success is playing results, not nps alone"; `EPIC-008`
  shows depth alone did not).

## Scope

1. Only the cuts `ABC-227` `A5` names (bucket ≥ 5 % of self time on ≥ 2 boards) that Architect/Design confirms are
   value-identical. Each cut is its own commit.
2. Candidates by name (each only if `ABC-227` ranks it): allocation-free ordering (an in-place sort on a reused
   buffer), a cheaper evaluator walk (a piece list), cheaper legality for non-captures.

## Out of scope

- Incremental evaluation that changes any score (rounding, order of sums). Any change to the order of moves, the TT
  or a pruning decision. That would be value-changing and belongs to another ticket.

## Acceptance criteria

- **A1 (identity).** **Given** the `ABC-078` `A3` corpus and `ABC-121`'s 190, **when** searched at fixed depth 5 on
  base and head, **then** `(move, score, depth, nodes)` is equal on every position, and every `ADR-0026` door is
  node-equal to its pre-ticket self (`G4`).
- **A2 (evaluation).** `G3`: `evaluate` byte-equal on every position of the corpus; `G2` mean per call ≤ base's in the
  same session.
- **A3 (speed).** **Given** `kiwipete`, `position-6` and the start position, 5 interleaved runs per board per build at
  3 000 ms, **then** head's median nodes per second is **≥ 1.10 ×** base's on at least two boards and ≥ 1.00 × on the
  third. A cut that does not move its board's median by ≥ 3 % is dropped from the branch.
- **A4 (gates).** `G1` 54/58 unchanged rows, `G5`, `G6` "≥ base" (floor 6), `G7`, `G8`, `G9`.
- **A5 (the reading).** **S2** (`EPIC-008`): the mechanical bar A1–A3, and no playing reading by default.
  `ABC-206`'s D was waived the same way. If the owner extends Q4 to value-identical changes, his rule applies.

## NFR triggers

- **`NFR-001`'s leaf clause** is re-read (as `ABC-206`). **`NFR-005`:** `G6`. **`NFR-009`:** a reused buffer stays
  inside 16 MiB. **`NFR-008`:** identity rows at fixed depth only.
- **Security:** none.

## Test notes

1. A1 is the `ABC-206` identity sweep; it runs out of tree for the cross-build half.
2. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: M.** Up to three hot spots under one identity oracle and one speed bar (the `ABC-206` precedent). If
  `ABC-227` names more than three, BA/PM splits.
- **Priority: P2.** Cheapest engine change of the epic; no playing reading.

## Dependencies

- **`ABC-227`** Done. Architect/Design confirms value-identity at design (no ADR expected, as `ABC-206`).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 7b–7f |
| 2 | scope and out-of-scope | ⚠ the cuts are named by `ABC-227` |
| 3 | INVEST | ✅ independent of every value-changing ticket; M |
| 4 | testable, measurable acceptance | ✅ A1–A5 |
| 5 | dependencies known | ✅ `ABC-227` |
| 6 | NFR triggers with targets | ✅ ≥ 1.10 × nps; identity |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none beyond `ABC-227` |

**DoR 9/10. Backlog** until `ABC-227` is Done; then BA/PM names the cuts and it goes Ready.

> **Result 2026-10-29, Software Engineer** (task `se-ABC-235`, branch `grugops/ABC-235` from `main` `a37f1d87`): cuts
> 1 (`dcbad73d`), 3 (`7f3f0fda`) and 5 (`f9576af3`) built to `arch-ABC-235`; all three kept, none reverted. A1 byte-equal
> to the merge base at every cut (6 021 rows, plain `node`, out of tree, no golden file committed); perft counts equal,
> `PERFT_DEEP` 32/32. SE nps, indicative, 5 interleaved per board, tip against base: kiwipete 1.27x, position-6 1.28x,
> start 1.16x. QE's interleaved A3 reading, G2's binding read and G6's 5 interleaved runs decide. Notes:
> `se-ABC-235`.
