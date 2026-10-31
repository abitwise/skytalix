---
id: 20261031T061812Z-software-engineer-observation-f0b04c75
kind: observation
by: software-engineer
at: 2026-10-31T06:18:12Z
verified_by: 
confidence: high on what was run; SE-245-a's range by reasoning from the asserted offsets
refs:
  - se-ABC-245
  - ABC-245
  - ABC-242
  - EPIC-010
  - ADR-0046
  - ADR-0054
  - ADR-0032
  - NFR-008
  - QE-242-b
  - SE-242-f
  - R1
  - R2
  - R4
  - arch-qe242a-ruling
  - bapm-ABC-245-rescore
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-93eb0bf9
  - grugops/ABC-245
  - 7e81732e
  - 9c008db4
  - 4387d4e8
  - src/levels.test.ts
supersedes: 
seal: sha256:af8883bdf5ad22301270205c11dff04f7ebbe95136f403236a900a2ee50591e2
---

# `ABC-245` SE notes and QE handoff (INFO only; none blocks)

- **SE-245-a (INFO).** The row kills every cap below 98, not only 8 and 50: its nearer match is at −94, its farther at
  −98, and nothing matches in −4…−92. Caps 98–99 and the cap's removal (Q7) stay equivalent on this list, as QE and
  the SE agreed at `ABC-242` for any trimmed caller.
- **SE-245-b (INFO).** The fixture's queen checks the black king on some plies of the walk; every move is legal and
  reversible (clock reaches 98 with no reset), and no position other than the start repeats. 0 is the best score in
  the root list, so the strict second-best (`d7c8`, −1000) is the move played; the row does not assert the pick.
- **SE-245-c (INFO).** The header's other words ("every search is depth 1", the A-list) were not rewritten; only the
  count the ticket names. It reads 46 at this commit and goes stale with the next row in this file.
- **For QE:** re-run Q6 and Q8 on the whole lane (A2), read `G8`. No production line changed: no UAT (Test note 2).
  The generator is `raw/fixture-gen.ts` (node, seed 7); the plant outputs are `raw/plants/`.
