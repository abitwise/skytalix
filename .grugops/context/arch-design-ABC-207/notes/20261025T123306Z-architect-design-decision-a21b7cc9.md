---
id: 20261025T123306Z-architect-design-decision-a21b7cc9
kind: decision
by: architect-design
at: 2026-10-25T12:33:06Z
verified_by: 
confidence: high for the form, the moved set and the counts (deterministic, probed on scratch clones at 0e2358ce); G2 and G6 are UNKNOWN - verify until QE reads them
refs:
  - ABC-207
  - EPIC-008
  - ADR-0031
  - ADR-0028
  - ADR-0026
  - NFR-005
  - NFR-004
  - NFR-008
  - G2
  - G6
  - QE-205-c
  - QE-215-d
  - plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
  - arch-design-ABC-215/20261025T045829Z-architect-design-decision-e04234f4
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - arch-rule-ABC-205-g6/20261025T042840Z-architect-design-decision-912bcb0d
  - qe-ABC-215/20261025T121200Z-qe-e2e-observation-a34270bf
  - orch-2026-10-25w/20261025T121545Z-orchestrator-decision-ccf209d9
  - grugops/arch-design-ABC-207
  - 0e2358ce
  - 5c91e2e4
supersedes: 
seal: sha256:a692e63c3bb23ec59ce89d5257bbb11cef646135b7787107f3e011f8e312cc53
---

# Architect/Design: ABC-207 designed. Weights N 4, B 4, R 2, Q 1 (K 4 unchanged); early-queen term 25 cp; inside ADR-0031 D2's attack-map form and the ±100 cp clamp (no STOP); 12 pins move by existing routes; G6 predicted MET (position-6 d8 −18.0 %); S, no split; no ADR, no owner word

Task `arch-design-ABC-207`, records plus probes, at `main` `0e2358ce` (`src/` = `5c91e2e4`), branch
`grugops/arch-design-ABC-207`. Full text: `plans/tickets/ABC-207-…md` § Design ruling. Probes: this task's observation
note. Inputs: the page, `ADR-0031` (decision 2), `ADR-0028` (d2, d4), `arch-design-ABC-215` `…e04234f4` (the pattern),
QE `…a34270bf` (base's value-identical G6/G2 reading), Orchestrator `…ccf209d9`.

## Weights (Scope 1)
- `MOBILITY_WEIGHT` by `pieceType` = `[0, 0, 4, 4, 2, 1, 4]`. Rule: minors keep 4; rook ½ (2), queen ¼ (1). The more
  squares a type can reach on an open board (N 8, B 13, R 14, Q 27), the less one more is worth. The quarter is the
  page's own probe. King unchanged at 4 (out of scope; flagged).
- The multiply moves onto each piece's reach before the same ±100 clamp. `squaresReached` is unchanged.
  `evaluateWithoutMobility` passes an all-zero array, so `evaluate − evaluateWithoutMobility` is still exactly the
  clamped term.
- **Form: unchanged.** This is the attack-map count with a per-type weight: not a subset of pieces, no cache, no
  `Move` objects, no state. **No `ADR-0031` change, no STOP.**

## Early-queen term (Scope 2)
- Per side: a queen off its home square (d1/d8) **and** ≥ 2 of its four minors on their home squares → charged
  **25 cp** (¼ pawn). Symmetric, outside the mobility clamp. The queen flag is set in the existing walk; the home-square
  reads happen only when that side's queen is off home. One private helper, no new export.
- **The cut-off is the condition itself.** No phase counter. `A2`'s no-minors endgame reads 0 by construction.
- 20 cp was probed first and rejected before any count: `A2`'s pair read −2. The queen's trip earns 18 cp at weight 1.

## Tests read it without a new door
- `A1`: `evaluate − evaluateWithoutMobility` on one-square pairs.
- `A2`: `evaluateWithoutMobility` pair differences, where a4 and d1 queen-table cells are equal. Head reads −25 (minors
  home), 0 (developed) and 0 (no minors). `evaluate` reads −7 on the minors-home pair.
- `A3` mirror: 12/12 on head.

## G2 by construction — `UNKNOWN - verify`
- Base 642.6 / 641.2 ns (`…a34270bf`). The additions per call:
  - ≤ 16 array reads and multiplies;
  - ≤ 16 compares;
  - ≤ 2 four-square reads.

  Expected at tens of ns, well under 990.

## Moved set (deterministic): 12 rows in 4 files, 0 relations, 0 levels
- Default lane: 9 reds (`ordering` `A4` p6 d2 and `G1`; `pvs-lmr` `A4` ×2; `transposition` `A1` ×3 and `A5` ×2).
- Deep: 3 in `quiescence` (`A4` bare leaf; `A5` `ORACLE_AT_DEPTH_3` ×2).
- Routes:
  - re-pin: 10 rows;
  - `ADR-0028` d2 re-find: `pvs-lmr` `A4` `search()`, whose premise is lost (shipped 10 against unreduced 2);
  - the oracle rule: kiwipete 8 → 20 / e2a6, position-6 85 → 78 / c3d5, re-run equal on all three.
- `w` (the weights) carries all of them. `q` (the queen term) carries none.
- Levels hold, and none moves:
  - the multiplier cells all fall (position-6 d1 8.96 → 4.19x of 10);
  - d5 drift max 63 → 45 cp (≤ 75);
  - `G1` 54/58.

## G6 pre-check (a count)
- Base → head:
  - kiwipete d7 609 900 → 602 091, d8 1 735 339 → 1 700 946;
  - position-6 d7 586 333 → 469 639, d8 1 355 149 → **1 111 000 (−18.02 %)**.
- Base straddles no depth: position-6 8 ×5 at 1.464–1.470 M nodes, kiwipete 7 ×5.
- **Predicted `G6` MET** while head's throughput cost stays under about 24 %. For the record, not a grade.

## Size: S (upper edge), no split
- About 25 production lines, plus the relation rows and 12 routine rows. A split would put every row in the weights
  half and cost a second D for a half that moves nothing.

## Owed
- Orchestrator: merge the records, then In Design → Ready for Dev.
- Owner: nothing.
- BA/PM: nothing. A relabel to M is optional.
