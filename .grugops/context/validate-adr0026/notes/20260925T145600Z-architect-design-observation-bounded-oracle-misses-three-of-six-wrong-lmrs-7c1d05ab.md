---
id: 20260925T145600Z-architect-design-observation-bounded-oracle-misses-three-of-six-wrong-lmrs-7c1d05ab
kind: observation
by: architect-design
at: 2026-09-25T14:56:00Z
verified_by:
confidence: high
refs:
  - ADR-0026
  - ABC-121
  - .grugops/context/validate-adr0026/probe/lmr.ts
  - .grugops/context/validate-adr0026/probe/oracle.ts
  - .grugops/context/validate-adr0026/probe/matecorpus.ts
supersedes:
---

# The bounded oracle, alone, reds three of six deliberately wrong LMRs. It misses the other three at both depths

Hand-authored, no `seal`. Scores and nodes are exact and deterministic. The variants are mine,
wired into `probe/lmr.ts` behind `cfg.bug`, and they are unset for "correct".

**The oracle applied** is `ADR-0026` decision 9 plus the ticket's `A1` bars:

- 0 mate-status flips on the 190-position corpus;
- ≥ 95% of the non-mate positions within 25 cp;
- no position more than 75 cp;
- the five pinned mate rows (`search.test.ts` `A3` × 4 and the depth-10 rook ending) at their
  literals, both fixed and deepened.

It compares PVS+LMR(variant) with PVS alone at a fixed depth (`oracle.ts`).

| variant (what is wrong) | d4: w25 / max | d4 verdict | d5: w25 / max | d5 verdict | slack mate floor d4→5 / d5→6 (see below) |
|---|---|---|---|---|---|
| **correct** (the ruling's rule) | 98.40% / 50 | GREEN | 99.47% / 45 | GREEN | 0 / 0 |
| `tactical`: also reduces captures, promotions, checks and in-check nodes | 96.79% / 70 | **GREEN — missed** | 99.47% / 45 | **GREEN — missed** | 0 / 0 |
| `r2`: reduces by 2 plies | 99.47% / 35 | **GREEN — missed** | 98.93% / 65 | **GREEN — missed** | **17 / 16** |
| `noLmrResearch`: no reduced-move re-search on fail-high (PVS's own re-search kept) | 97.86% / 65 | **GREEN — missed** | 95.72% / 45 | **GREEN — missed** | 0 / 0 |
| `noResearch`: reduced depth used for every search of the move | 96.79% / 65 | **GREEN — missed** | **89.30%** / 45 | RED (w25) | 0 / 0 |
| `early`: reduces from index 1 at remaining depth 2 | 96.79% / 65 | RED, only on the rook-ending mate row (−29 992 → −505) | 95.72% / **120** | RED (max) | 0 / 0 |
| `gross`: all four of the above | 83.42% / 545 | RED (all three clauses) | 70.05% / 395 | RED | **19 / 24** |
| `pvsNoResearch`: a PVS WINDOW bug, with LMR correct | 64.71% / 430 | RED | 45.99% / 395 | RED | **3 / 4** |

- **The corpus mate-flip clause fired on no variant, `gross` included.** Every RED above came
  from the centipawn clauses or from the depth-10 rook-ending row.
- **Depth matters.** At d4 the oracle reds 3 of 7 wrong builds (`early`, `gross`,
  `pvsNoResearch`). At d5 it reds 4 of 7 (adding `noResearch`). `ABC-121` `A1` says "a fixed
  depth ≥ 4". Run at d4 alone, it misses `noResearch`.
- **The centipawn distributions overlap.** The correct rule's d4 max is 50. The wrong rules read
  35–70 at d4. `r2` drifts LESS than the correct rule at d4: its reduced child at remaining depth
  3 drops straight into quiescence and fails low. So tightening the bars cannot separate them
  without also failing correct builds on noise. **Do not chase these bugs with the cp bars.**
- **What does catch the three misses:**
  - `tactical`: `A3`'s predicate table does, if the predicate derives the tactical facts itself
    (the decision 6 amendment in `…9a3f6e21`).
  - `r2`: `A3`'s "exactly one ply" does, if the recursion subtracts the predicate's return value.
    The slack mate floor also catches it (17 / 16 flips).
  - `noLmrResearch`: only `A4` catches it, and only if `A4`'s fail-high happens at a NULL-WINDOW
    node. At a PV node, PVS's own full re-search masks the missing LMR re-search whenever the
    score stays below beta.

## The mate floor: the 190-corpus clause means nothing, and on a mate-rich corpus the correct rule fails it

`matecorpus.ts` takes every in-progress position within two plies of seven mating endgame FENs
(the five mate-row FENs plus the ruling's KQK/KRK endgames). That gives 287 positions, deduplicated.
It keeps those that PVS alone scores as mate: 180 at d4, 205 at d5.

| variant | flips, same depth d4 / d5 | flips, LMR one ply deeper (d4→5 / d5→6) |
|---|---|---|
| **correct** | **16 / 15** | **0 / 0** |
| tactical | 16 / 17 | 0 / 0 |
| r2 | 17 / 32 | **17 / 16** |
| noLmrResearch | 16 / 16 | 0 / 0 |
| noResearch | 17 / 17 | 0 / 0 |
| early | 18 / 21 | 0 / 0 |
| gross | 23 / 40 | **19 / 24** |
| pvsNoResearch | 21 / 22 | **3 / 4** |

- **The same-depth floor is unattainable by a correct LMR.** An example is
  `6k1/8/4K3/8/8/8/8/R7 w - - 2 2`: PVS at d5 reads mate (29 995), and correct LMR at d5 reads
  +450. The mating line's quiet king and rook moves sit at index ≥ 3 and get reduced past the
  horizon.
- **"0 flips, hard" is therefore green on the 190 corpus only because that corpus holds 3 mates.**
- **One ply of slack is the floor LMR actually promises:** LMR buys the ply, and the depth-7
  margin is 1.68x / 1.83x. Correct reads 0 of 180 and 0 of 205, and the slack floor reds `r2`,
  `gross` and `pvsNoResearch`. No mate-distance lengthening was seen under slack in any variant.
- **Cost, under load 60–122:**
  - 11–19 s per variant per depth pair (`ms` in `matecorpus-*.jsonl`);
  - by comparison, the 190-corpus d5 drift pass took 140–160 s, and 96 s deepened.
  - Both are deep-lane work. Their default-lane cost is `UNKNOWN - verify`.
