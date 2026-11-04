---
id: 20261104T022829Z-architect-design-decision-3a9eba86
kind: decision
by: architect-design
at: 2026-11-04T02:28:29Z
verified_by: 
confidence: high (the reading of batch B as printed; the causes in the section headed 'What the examples suggest' are hypotheses until batch D)
refs:
  - arch-ABC-271
  - arch-ABC-271/20261104T021559Z-architect-design-decision-eeb25cc6
  - ABC-271
  - E4a
  - ADR-0064
  - ADR-0068
  - ADR-0050
  - 029533f0
supersedes: 
seal: sha256:794e40633417b07cee056507b9a87d081ff3939142e4cb8b1f03c20516b3c2f4
---

# arch-ABC-271 PREREG addendum: E3 missed as pre-registered. One diagnostic, sealed before it runs, classifies why. It decides nothing

Architect/Design, task `arch-ABC-271`. This addendum to the PREREG `…eeb25cc6` (commit `029533f0`) is sealed and committed before the diagnostic it names.

## What was read (batch B, as pre-registered)
- **I1 holds:** BASE equals `main` on all seven count rows.
- **H's rows that hold:**
  - E1: 0 / 226 mirror mismatches;
  - E2: 0 / 333 at phase 24;
  - E4: 0 / 163 and 0 / 190;
  - E5: 7 / 7;
  - E6: 54 / 58, none newly missed.
- **H's E3 misses:**
  - (c): 44 of 404 twin pairs read 365, below U = 400;
  - (d): 312 of 2 123 twin pairs are not strictly lower;
  - (e): 0 / 120.
- **E3 is NOT MET as pre-registered.** That stands, and it is not re-graded. Choice rule 2's second clause reads "a defect in the rule. STOP; the ADR restates the rule, and no value is tuned to pass".

## What the examples suggest (read off the printed pairs; not yet measured)
1. **King exposure.** The fixture condition held the twin kings' endgame table cell and reach equal, but not their exposure.
   - E1's file terms (shelter 15, half-open 10, open 20, with eg = mg) charge a bare king per file around it: 2 files on the rim, 3 elsewhere.
   - So h7 against g8 differs by 35 cp, which is exactly 400 − 365. b5 against c6 differs by 10, which is (d)'s −9 example.
   - That is a fixture defect of the PREREG, not of E4a's rule.
2. **The path.** A defending king that steps off the passer's path, to a square nearer the queening square, frees the path. The free-path bonus then returns.
   - That would make (d) false for E4a's own part on such pairs. It would be a real interaction of the rules, which the ADR must state.

## The diagnostic (batch D; mode `rel2` in `e4aprobe.ts`; the printed classes only)
- **The pairs.** The same generated pairs as E3 (c) and (d), on H. For each failing twin pair, it prints:
  - the term-only difference, (H − BASE) on the outside / far twin minus (H − BASE) on the inside / near twin;
  - each king's exposure, both halves, from `kingExposureForTest` (BASE);
  - whether each defending-king square lies on the passer's path.
- **The classes:**
  - **(F) fixture:** the term-only difference holds the relation, and the exposure differs.
  - **(P) path:** the term-only difference fails, and exactly one twin king is on the path.
  - **(R) rule:** any other failure of the term-only difference.
- **It also counts** (c) and (d) on twins that further share king exposure and have both kings off the path.

## What it may do (fixed now)
- **If every failure is (F), or (P) for (d) only:**
  - The terms' rules stand as written, and no value moves.
  - The ADR restates `ABC-271` P1 (c) / (d)'s fixture conditions: twin kings share their exposure, and both are off the passer's path for (d). Optionally the rows read the term-only part through a test seam.
  - The choice then follows the PREREG's other rows; E3's pre-registered miss is recorded beside it.
- **If any (R) appears:** STOP as rule 2 says, and the ADR restates the rule.
- The diagnostic is not a re-play of E3: E3's reading stands. **Leaving E3's miss out of the choice in the (F)/(P) case is a judgment.** The ADR flags it for the Orchestrator, with the fallback (structure only, choice rule 4) named.

## Instrument
- `e4aprobe.ts` v2, sha256 `4180525d…`, adds only the `rel2` mode and the `kingExposureForTest` import. v1 (`81fe7385…`, which ran batches A and B) is reproduced byte for byte by reversing those edits, and is kept in `raw/` as `e4aprobe.v1.ts`.
- `batchD.sh`, sha256 `51b9a9ce…`, is one run under the host lock.
