---
id: 20261009T160220Z-architect-design-decision-q1-the-seed-does-not-reach-move-selection-41fa9d86
kind: decision
by: architect-design
at: 2026-10-09T16:02:20Z
verified_by:
confidence: high
refs:
  - ABC-086
  - ABC-087
  - ABC-085
  - ABC-078
  - ABC-121
  - ADR-0027
  - ADR-0026
  - NFR-005
  - memory-bank/50-decisions/ADR-0027-deterministic-mode-is-the-shipped-engine-on-a-virtual-clock-and-the-seed-does-not-reach-move-selection.md
  - .grugops/context/ruling-abc086-seed/probe/fixed-d4-broad.jsonl
  - .grugops/context/ruling-abc086-seed/probe/fixed-d5-small.jsonl
supersedes:
---

# Q1 ruling: (b). The seed does not reach move selection; its first consumer is `ABC-087`

Hand-authored, no `seal` (degraded posture per `AGENTS.md`). Recorded in `ADR-0027` (proposed)
decisions 1–2.

## Ruling

- **(b).** Root tie breaking stays as merged: strict `>`, first in `orderMoves` order
  (`src/engine.ts:397-401`). It is explicit and deterministic, and it is not seeded.
- `src/engine.ts` and `src/search.ts` gain no PRNG and no seed.
- The seed and its small generator land with the first random consumer, `ABC-087`'s blunder draw.
  - The generator's state is per instance and passed in. It is never module state, and it adds
    no dependency.
  - `ABC-085`'s seeded opening choice reuses that generator.

## Why: (a) is value-changing and work-changing, measured

The measurements are in the observation note
`20261009T160220Z-architect-design-observation-q1a-measured-and-the-virtual-clock-is-a-node-budget-bafc5088`.

- (a) is **value-changing with LMR on**, and the widened root window alone causes it. At equal
  depth on the 190 corpus:
  - 2 positions diverge at depth 4 (max 5 cp);
  - 2 positions diverge at depth 5 (max 10 cp);
  - seeded, 10 of 950 runs diverge at each depth (max 20 cp at depth 5);
  - with LMR off, 0 diverge at depths 3, 4 and 5.
- `ADR-0026` decision 10 therefore applies in full. (a) would need:
  - a switch and a pair of doors;
  - "off in every older door";
  - a bounded oracle;
  - two more names in `ABC-078` `A4`'s pin;
  - re-pointing `ABC-078` `A3`.
- (a) is **work-changing**: +3.3–5.2% nodes at every depth. Under the same virtual budget it
  completes one ply less on 1 to 3 of 30 positions. That puts `NFR-005` in play.
- (a) buys only variety among equal moves: 22 of 190 positions pick ≥ 2 distinct moves across 5
  seeds at depth 4. The epic asks for reproducibility, which already holds without it. Nobody
  asked for variety.
- BA/PM's product position was (b). This ruling agrees, on measurement, so there is no
  disagreement to escalate.
