---
id: 20260925T140821Z-architect-design-observation-pvs-is-value-identical-but-breaks-two-ratio-bars-3b7e1a52
kind: observation
by: architect-design
at: 2026-09-25T14:08:21Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-077
  - ABC-078
  - ABC-080
  - ABC-081
  - ADR-0025
  - .grugops/context/ruling-abc121-lmr-oracle/probe/faithful.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/identity-d3.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/identity-d4.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/ratios.jsonl
  - .grugops/context/ruling-abc121-lmr-oracle/probe/work-d4.jsonl
supersedes:
---

# PVS keeps every score, but with PVS on both sides two merged ratio bars fail

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). Node counts and scores are exact and
deterministic. No wall-clock figure is used here.

## The probe is the shipped recursion

`probe/lmr.ts` is a copy of `src/search.ts`'s `negamax` + `searchRoot` and of `src/engine.ts`'s
deepening loop, with warm table and killers across iterations. It adds three switches: `pvs`,
`lmr` (reductions inside PVS) and `lmrPlain` (reductions without PVS). Every other function is
imported from `src/` unchanged.

- **With every switch off it reproduces `search()` exactly.** It also reproduces
  `searchWithoutTable` to the node. The cells were the six roots and six endgames at depths 1–4,
  48 cells in all, compared on score, nodes and move: **0 mismatches** (`faithful.jsonl`).
- **It reproduces the shipped ratio figures to the node:**
  - `ABC-080` `A3`: 2 467 / 9 804 and 26 175 / 990 122.
  - `ABC-081` `A3`: 1 137 / 1 820, 123 920 / 193 821 and 91 420 / 183 215.
  - The one figure that differs from a test COMMENT is position-6's unordered depth-4 count:
    1 663 124 here against 1 663 808 in `search.ordering.test.ts`'s comment. The comment dates
    from the `ABC-080` tip, before `ABC-081`'s repetition detection. The assertion is a ratio,
    and it is unaffected.

## PVS changes no score (the corpus is 190 positions)

The corpus is the six roots, every in-progress position one legal move from each, and the six
`engine.test.ts` endgames.

| shape (both sides PVS unless named) | depth 3 | depth 4 |
|---|---|---|
| PVS vs shipped `search()` (the `ABC-077` `A1` / `ABC-080` `A1` shape) | 0 / 190 | 0 / 190 |
| PVS table on vs PVS table off vs shipped `searchWithoutTable` (`ABC-081` `A1`) | 0 / 190 | 0 / 190 |
| PVS deepening (engine shape) vs PVS fixed depth (`ABC-078` `A3`) | 0 / 190 score; 2 move differences at equal score | 0 / 190 score; 6 at equal score |
| total nodes, PVS / base | 0.905 | 0.659 |

The move differences are all at equal score, which is exactly the licence `ABC-078` `A3`
already grants.

## But PVS on BOTH sides of a work row breaks its bar

PVS saves more on the weaker side of each pair (unordered, or table off), so it shrinks the
denominator (`ratios.jsonl`):

| row | bar | shipped (PVS off both) | PVS on both |
|---|---|---|---|
| `ABC-080` `A3` position-6 depth 2 (default lane) | ≤ 40.5% | 25.16% | **47.49% FAIL** |
| `ABC-080` `A3` kiwipete depth 4 | ≤ 4% | 2.64% | **6.59% FAIL** |
| `ABC-080` `A3` position-6 depth 4 | ≤ 4% | 2.10% | **4.19% FAIL** |
| `ABC-081` `A3` position-3 deepened to 4 (default lane) | ≤ 70% | 62.47% | **77.31% FAIL** |
| `ABC-081` `A3` kiwipete deepened to 5 | ≤ 70% | 63.94% | **77.01% FAIL** |
| `ABC-081` `A3` position-6 deepened to 5 | ≤ 70% | 49.90% | 43.65% |

Scores agree on every row either way.

## PVS moves exact node pins, at every depth

Fixed depth 4, shipped vs PVS (`work-d4.jsonl`):

| position | shipped | PVS |
|---|---|---|
| startpos | 2 385 | 2 470 |
| kiwipete | 22 323 | 18 773 |
| position-3 | 1 123 | 758 |
| position-4 | 9 054 | **12 227** |
| position-5 | 8 783 | 8 832 |
| position-6 | 28 829 | 21 430 |

The position-3 row is `transposition.test.ts`'s 1 123 pin. **PVS makes some trees bigger**, as
position-4 shows.

**What this decides:** the doors that predate `ABC-121` must keep PVS OFF, and the work rows'
shipped side must point at a PVS-off door. See decision `…c41d9e07` (R1).
