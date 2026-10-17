---
id: 20261017T110100Z-software-engineer-decision-row-shape-5d19189d
kind: decision
by: software-engineer
at: 2026-10-17T11:01:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-024
  - ABC-024
  - 20261017T110000Z-software-engineer-observation-remeasure-31f8734a
supersedes:
---

# How the rows are shaped

- **New tables, new `describe` blocks, appended at the end of the file** (test note 8). `EMPTY_CORRIDOR_SQUARE`
  has 10 rows. `NO_RIGHT_OFF_DEFAULT_SCALARS` has 4. `RIGHT_HELD_OFF_DEFAULT_SCALARS` has the 2 controls, one
  per class, both white. No existing row, table or quantifier is touched.
- **A1's occupants.** There are two ENEMY rows: a knight on b1 and a knight on b8, one per colour. The criterion
  needs at least one; two cost nothing, because both still are one row per square. The other eight are own
  bishops, knights and queens. Every row asserts four things before it reads any outcome:
  1. the byte (type and colour), and that it is the only occupied square of the blocked corridor;
  2. that the other corridor is clear;
  3. that king and rook are home and both rights are held;
  4. that both king paths are unattacked, so the `empty` test is the only possible refuser.
- **A3(i) reads the production corridor through `generateMoves`, not only this file's `CASTLE_SHAPE` copy.**
  `CastleOption` is not exported, so a quantifier that read only the copy would stay green on a widened
  `src/moves.ts` corridor. The ticket asks that this go red. The probe puts a lone own knight on every empty
  square, with only that right held. A knight neither attacks for the enemy nor stands on a home square, so
  only the `empty` test can refuse. Measured: a widened corridor turns this test red, and nothing else in the
  file.
- **A3(ii)** asserts `NO_RIGHT_HELD` sits at `- 0 1`. It also asserts that **every** A2 row is off `- 0 1`,
  not just some row, so narrowing any single row turns it red. Per class, it asserts the field the class
  moves, that each colour has one row, and that each class has one control.
- **Diff size: +280 / -0, one file.** That is under the security threshold of +525 or a second file. It
  contains no spawn, network, env read or unbounded loop (grep over the added lines).
