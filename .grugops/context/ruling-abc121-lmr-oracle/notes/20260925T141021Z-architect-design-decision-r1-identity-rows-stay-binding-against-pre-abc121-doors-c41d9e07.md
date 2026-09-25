---
id: 20260925T141021Z-architect-design-decision-r1-identity-rows-stay-binding-against-pre-abc121-doors-c41d9e07
kind: decision
by: architect-design
at: 2026-09-25T14:10:21Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-077
  - ABC-078
  - ABC-079
  - ABC-080
  - ABC-081
  - ADR-0024
  - ADR-0025
  - ADR-0026
  - 20260925T140821Z-architect-design-observation-pvs-is-value-identical-but-breaks-two-ratio-bars-3b7e1a52
  - 20260925T140921Z-architect-design-observation-lmr-drift-order-dependence-and-depth7-nodes-8d25f0c6
supersedes:
---

# Ruling 1: every existing identity and work row stays binding, unchanged, against a pre-`ABC-121` door

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). The full shape is `ADR-0026`
(**proposed**). This note states what BA/PM and the Engineer need to act on.

## The doors

| recursion | door | PVS | LMR | is |
|---|---|---|---|---|
| `src/search.ts` | `search()` (shipped) | on | on | the product |
| | **`searchWithoutReductions`** (new) | on | off | LMR's reference |
| | **`searchWithoutPvsOrReductions`** (new) | off | off | the pre-`ABC-121` `search()`, node for node |
| | every older door (`…WithoutPruning`, `…Quiescence`, `…PruningOrQuiescence`, `…Ordering`, `…Killers`, `…Table`) | **off** | **off** | its pre-`ABC-121` self, node for node |
| `src/engine.ts` | `chooseMove` (shipped) | on | on | the product |
| | **`chooseMoveWithoutReductions`** (new) | on | off | the engine side of the drift detector |
| | **`chooseMoveWithoutPvsOrReductions`** (new) | off | off | the pre-`ABC-121` `chooseMove` |

**Export lists:**

- `ABC-077` `A6` grows by three: the two new `search.ts` doors and the reduction predicate (Ruling 3).
- `ABC-078` `A4` grows by two.
- None of these takes a defaulted depth, and none picks a move without a caller-supplied depth or
  budget.

## Which rows point where

1. **WORK rows re-point their shipped side to the pre-`ABC-121` door of the same recursion.**
   - A work row reads a node count, a node ratio, or a hit rate, or it compares the shipped path
     with a door. That includes rows that switch the table off through
     `transposition.test.ts`'s `vi.mock` instrument (`deepenTo`, `hitRate`).
   - The rows are:
     - `ABC-077` `A2`;
     - `ABC-079` `A4`/`A5` and `A1`'s bare-leaf comparison;
     - `ABC-080` `A1`, `A3`, `A4` and `G1` (358);
     - `ABC-081` `A1`, `A2`, `A3` and `A5`'s 7 241 pin;
     - `search.ordering.test.ts`'s 261 pin.
   - **This list is this hop's reading of the suite, not an inventory.** The Engineer lists
     every row it re-points, one line each, in the build notes, and QE checks that list against
     the tree.
   - **Every bar, ratio and pin stays exactly as merged.** The probe reproduces all of them with
     PVS off on both sides. With PVS on both sides, `ABC-080` `A3` and `ABC-081` `A3` FAIL
     (47.5% vs 40.5%, 6.59% vs 4%, 77.3% vs 70%; `…3b7e1a52`). **So the pre-`ABC-121` door is
     not a convenience. Without it, three merged bars must be re-levelled for a reason that is
     not theirs.**
2. **The two DRIFT DETECTORS take the `…WithoutReductions` pair, so PVS is under them.**
   - **`ABC-077` `A1`** (pruned vs unpruned, score only): the pruned side becomes
     `searchWithoutReductions`. It is the only window-bug detector, and PVS is a window change.
     Its quiescence-leaf cells are at depths 2–3. Its bare-leaf deep cells compare two older
     doors and are untouched.
   - **`ABC-078` `A3`** (engine vs `search()`, move and score, equal-score licence): this is the
     identity sweep plus the abort row's `search()` reference. It compares
     `chooseMoveWithoutReductions` with `searchWithoutReductions`.
   - Measured: 0/190 score divergences at depths 3 and 4, fixed and deepened; move differences
     occur at equal score only.
3. **VALUE and behaviour rows on the shipped path stay on `search()` / `chooseMove`, with PVS and
   LMR on.** They bind what the player gets.
   - The rows are:
     - mate found and shorter mate preferred (`search.test.ts` `A3`, including the depth-5 and
       depth-7 deep rows, which do exercise LMR);
     - stalemate exactly 0;
     - repetition exactly 0 (`ABC-081` `A5`'s score and move);
     - the legal root move;
     - the position unchanged;
     - the `G6` knight pair's literals;
     - `QE-G1`–`G3`;
     - the quiescence hanging-piece count;
     - every engine clock, abort, budget, ceiling and seam row.
   - The probe keeps all five mate literals under LMR (`…8d25f0c6`).
   - Where one row asserts both a literal and a door comparison, the literal half may stay on
     the shipped path. An example is `transposition.test.ts`'s depth-10 rook ending, which reads
     -29 992 under every configuration.
4. **New, owed by `ABC-121`: the PVS identity link.** `searchWithoutReductions` equals
   `searchWithoutPvsOrReductions` in score, on the 190-position corpus, at depth 4 (deep lane),
   plus a default-lane subset. Measured 0/190. This closes the chain:
   - `search()` ≈ `searchWithoutReductions`, bounded (Ruling 2);
   - `searchWithoutReductions` ≡ the pre-`ABC-121` search;
   - the pre-`ABC-121` search ≡ every old door and the unpruned search.

## What this does NOT allow

- It does not license re-levelling any merged bar in `ABC-121`. If a re-pointed row fails, the
  door is not the pre-`ABC-121` search, and that is a defect.
- It does not license LMR in a door older than `ABC-121`.

## Rejected

- **PVS on in every pruned door** (one door per recursion). Rejected by the measurement above.
- **Relaxing identity rows to a tolerance.** It blinds the window-bug detector exactly when PVS
  adds windows.
- **Leaning on "LMR cannot fire below depth 4" instead of doors.** Every row's meaning would
  hang silently on one threshold.
- **An options parameter or `EngineOptions` field.** This is `ADR-0024` decision 7.
