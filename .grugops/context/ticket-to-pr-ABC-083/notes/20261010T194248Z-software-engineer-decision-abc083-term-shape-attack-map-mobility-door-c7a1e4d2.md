---
id: 20261010T194248Z-software-engineer-decision-abc083-term-shape-attack-map-mobility-door-c7a1e4d2
kind: decision
by: software-engineer
at: 2026-10-10T19:42:48Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ADR-0031
  - ADR-0003
  - src/evaluate.ts
  - src/evaluate.king-mobility.test.ts
  - .grugops/context/ruling-abc083-abc087/probe/r1-cost.mjs
supersedes:
---

# `ABC-083`: the term shapes, the mobility form, and one test-only door

Hand-authored and unsealed. A decision, not a finding.

1. **King safety**, per king, over the king's file and the files either side of it (two files on an
   edge file). SHELTER 15 cp: no own pawn one or two ranks ahead on that file. FILE 10 cp half-open
   (no own pawn on the file, an enemy pawn on it) or 20 cp open (no pawn of either colour). White's
   point of view, `step` +1/−1 so the term is mirror-exact. Untapered, as the page's Out of scope says.
2. **Mobility: the attack-map form** (`ADR-0031` decision 2): squares each NON-PAWN piece reaches
   (empty, or the first enemy-occupied square on a line), counted inside `whiteMinusBlack`'s existing
   board walk, no `Move` objects, no make/unmake. 4 cp per square, total clamped to ±100 (`A4`).
   Pawns are not counted, as in the prototype the ADR measured. This is the form's definition, not a
   piece subset chosen to fit the bar: the pseudo-legal and legal forms were measured with all moves.
3. **Weights are the `ADR-0031` prototype's** (`r1-cost.mjs`: 15 / 10 / 20 / 4). Chosen before
   any measurement and NOT tuned afterwards (test note 1; `ADR-0034` decision 6; `A9` "do not tune").
   The weight sensitivity of the two red class-R rows was measured on scratch copies only
   (`probe/r14.out.jsonl`, `probe/r15.out.jsonl`); nothing was applied.
4. **No new dependency edge.** The knight/king steps and the eight rays are local constants in
   `src/evaluate.ts`; `src/moves.ts` keeps its offsets private and is not imported.
5. **One TEST-ONLY door, `evaluateWithoutMobility`.** The walk takes the mobility weight as a
   parameter (`evaluate` passes 4, the door passes 0), so `evaluate(p) − evaluateWithoutMobility(p)`
   is exactly the mobility term. `A4` reads its ±100 bound through it. It follows the
   `searchWithout…` doors' precedent; nothing in production calls it. Overrule: delete the export and
   `A4`'s bound row goes with it.
6. **King-less boards** are not handled: every position `parseFen` admits has both kings (coding rule 8).
