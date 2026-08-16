---
id: 20260816T071500Z-ba-pm-decision-fourteen-tickets-the-build-order-and-the-size-correction-7b2e15f4
kind: decision
by: ba-pm
at: 2026-08-16T07:15:00Z
verified_by:
confidence: high
refs:
  - EPIC-004
  - EPIC-003
  - EPIC-006
  - ABC-074
  - ABC-075
  - ABC-076
  - ABC-077
  - ABC-078
  - ABC-079
  - ABC-080
  - ABC-081
  - ABC-082
  - ABC-083
  - ABC-084
  - ABC-085
  - ABC-086
  - ABC-087
supersedes:
---

# Fourteen tickets, four ids unspent, one size correction upward — and why the count is fourteen

## The count

**`ABC-074`…`ABC-087`. Fourteen tickets. `ABC-088`…`ABC-091` deliberately unspent.** The range was
given as *"a CEILING, never a quota"* and I treated it as one — the same way the previous refinement
hop left `ABC-074` unused rather than filling its range.

**The count is not a target I hit; it is what the epic's own structure produced.** `EPIC-004`'s
`## Scope` names five workstreams and its `## Acceptance` names five criteria. Mapping them:

| epic scope item | tickets |
|---|---|
| search (negamax, alpha-beta, iterative deepening, quiescence, TT) | `ABC-077`, `ABC-078`, `ABC-079`, `ABC-081` |
| move ordering (MVV-LVA, killers, hash move) | `ABC-080` |
| evaluation (material, PST, pawn structure, king safety, mobility) | `ABC-076`, `ABC-082`, `ABC-083` |
| difficulty levels (budget + blunder rate) | `ABC-087` |
| time control | `ABC-078` |
| `RISK-002` mitigation | `ABC-074` |
| `RISK-003` mitigation (`## Test notes`) | `ABC-084`, `ABC-085` |
| the seam the architecture audit says is missing | `ABC-075` |
| epic acceptance criterion 5 (seeded reproducibility) | `ABC-086` |

**Nothing is cut that the epic does not name**, and every epic acceptance criterion has an owner:

| epic criterion | owned by |
|---|---|
| hardest scores ≥ 90% over 100 games vs easiest | `ABC-085` `A1` |
| a legal move within the budget, every time | `ABC-078` `A1`/`A7`, `ABC-087` `A5` |
| finds a forced mate in 2 | `ABC-084` `A1` (and `ABC-077` `A3`) |
| does not play the losing move to a one-move tactic | `ABC-084` `A2` (and `ABC-079` `A1`) |
| reproducible under a fixed seed | `ABC-086` `A1` |

**No criterion is uncovered** and no ticket was stretched to cover one.

## Where I split, and where I refused to

**Split** — evaluation into three (`ABC-076` / `ABC-082` / `ABC-083`). One "evaluation" ticket would
have sized `XL` and triggered `SPLIT_REQUIRED`. Split by **term**, not by module: each term is
independently valuable, independently testable against the shared mirror property, and independently
reversible. **Mobility is deliberately in `ABC-083` and not `ABC-076`** because it is the only
evaluation term that may call the move generator, which makes it the only one with a real cost risk
— and that risk belongs in one ticket where it can be measured (`ABC-083` `A5`), not smeared across
three.

**Split** — `ABC-077` (recursion core) from `ABC-078` (the clock). This is the split that honours
`RISK-002`. One "time-bounded search" ticket would have been `L` and would have buried the
constraint inside an implementation detail. Separated, the constraint becomes two grep-able
criteria on two pages.

**Refused to split** — `ABC-080`. The three ordering heuristics share one comparator, one call site
and one measurement. Three tickets would each be unmeasurable alone, which is the opposite of
INVEST.

**Refused to split** — `ABC-081`. `ADR-0002` clause 3 makes the TT and in-tree repetition **one
structure** — a preallocated per-ply key array seeded once per search. Two tickets would each build
a key array and the second would discover the first's. That is precisely the failure `ADR-0002`
exists to prevent: *"`EPIC-004` would then build a second, incompatible notion of the path."*

**No ticket sized `XL`. `SPLIT_REQUIRED` was not emitted.**

## Build order — six phases, and the one inversion I had to rule on

```
PHASE 0  seam + scoring floor, both independent of everything
         ABC-075  incremental Zobrist key      [BLOCKED on Architect/Design]
         ABC-076  eval: material + PST         [no dependencies at all]

PHASE 1  the search, in strict order
         ABC-077  negamax + alpha-beta         (needs 076)
         ABC-078  iterative deepening + EngineSeam   (needs 077)  <-- RISK-002 discharged here

PHASE 2  determinism, before anything is measured
         ABC-086  seeded determinism           (needs 078)

PHASE 3  strength, in any order among themselves
         ABC-079  quiescence                   (needs 077)
         ABC-080  move ordering                (needs 078; NOT blocked on 081)
         ABC-081  transposition table + repetition   (needs 075, 077)
         ABC-082  eval: pawn structure         (needs 076)
         ABC-083  eval: king safety + mobility (needs 076, 082, 078)

PHASE 4  the instruments
         ABC-084  puzzle suite gate            (needs 078; better after 079)
         ABC-087  difficulty levels            (needs 078, 086, 084)
         ABC-085  self-play ladder             (needs 087, 086)

PHASE 5  the verification that closes the epic
         ABC-074  SPIKE on non-M3 hardware     [BLOCKED on hardware]
```

**Critical path: `ABC-076` → `ABC-077` → `ABC-078`.** Everything else hangs off it. `ABC-075` and
`ABC-076` can start in parallel on day one.

**The inversion, ruled rather than hidden.** `RISK-002` calls its mitigation a spike *"before the
full build commits to the design"*, and I have placed `ABC-074` **last**. That is not carelessness:
the mitigation was **re-pointed by the owner's 2026-07-30 ratification** from *nodes/sec* to
**depth-in-budget**, and **a depth is not a real number until a search completes plies**. Running it
before `ABC-078` would measure a proxy — repeating exactly the error that got `ABC-008`'s 500k
target retired. **Ruling: it runs the moment `ABC-078` lands** — the earliest point at which its
metric exists — **and before `ABC-080`/`ABC-081` tune the numbers.** It is listed in phase 5 by
dependency, not by intent. Recorded on `ABC-074` `## Dependencies` as well, so it is not lost.

## Epic size: `L` → **`XL`**. Correction requested; I did not edit the epic.

Point scale as used by the two prior decompositions (`XS`=1, `S`=2, `M`=3, `L`=5):

| ticket | size | pts | | ticket | size | pts |
|---|---|---|---|---|---|---|
| `ABC-074` | S | 2 | | `ABC-081` | M | 3 |
| `ABC-075` | M | 3 | | `ABC-082` | S | 2 |
| `ABC-076` | M | 3 | | `ABC-083` | S | 2 |
| `ABC-077` | M | 3 | | `ABC-084` | M | 3 |
| `ABC-078` | M | 3 | | `ABC-085` | M | 3 |
| `ABC-079` | S | 2 | | `ABC-086` | S | 2 |
| `ABC-080` | M | 3 | | `ABC-087` | M | 3 |

**Total: 37 points over 14 tickets.**

Against this board's own two calibration points:

| epic | recorded | corrected to | points | tickets |
|---|---|---|---|---|
| `EPIC-003` | M | **XL** | 22 | 9 |
| `EPIC-006` (runnable half only) | M | **L** | 13 | 6 |
| **`EPIC-004`** | **L** | **XL (requested)** | **37** | **14** |

**37 points is 1.7x `EPIC-003`, which this board already corrected to `XL` at 22.** There is no
larger size on the scale, so `XL` is where it lands and it lands there with room to spare — worth
saying plainly, because **`XL` here understates it**. Both previously-decomposed epics were
corrected **upward** at decomposition; this is the third, and the pattern is now three for three,
which is itself worth someone's attention.

**I did not edit `plans/epics/EPIC-004-engine-and-ai-opponent.md`** — my subtask reserves it. The
correction is requested here and in my report so one hand applies it.

## Prose budget (project process rule 2)

Ticket page lengths, **measured with `wc -l`, not estimated**: 145, 143, 118, 139, 148, 118, 132,
147, 114, 137, 139, 135, 147, 156. **Total 1,918. Median 139 lines against the ≤ 300 budget**, and
the longest page (`ABC-087`, 156) is barely half of it. Measurements, rejected alternatives and narration are
in this note directory rather than on the pages, which is what the rule asks for. Every ticket
carries a full `DoR n/10` table with each ⚠️ named — the budget did not buy shorter pages at the
cost of rigour, which is the control the rule sets.
