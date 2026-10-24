---
id: 20261024T080253Z-architect-design-observation-05d1c022
kind: observation
by: architect-design
at: 2026-10-24T08:02:53Z
verified_by: 
confidence: high (deterministic byte comparison on git objects); the CPW page was read through a page-to-text fetch on 2026-10-24
refs:
  - ABC-205
  - ABC-214
  - ADR-0048
  - ADR-0031
  - src/evaluate.ts
  - 4f650a45
  - d4d49c5a
  - c487d89c
  - KING_TABLE
  - KING_ENDGAME_TABLE
supersedes: 
seal: sha256:1b8944e97fbeeb365193e8142feac12a7247037d0eb2ea4cbd72969d661585a4
---

# ABC-205's new king values: KING_TABLE stays on the carve-out list, and KING_ENDGAME_TABLE does not join. The list stays seven

Read on `grugops/ABC-205` `4f650a45`, read only (`git show … :src/evaluate.ts`), against `main` `d4d49c5a` and `c487d89c`. The comparison scripts were in the session scratchpad.

- **`KING_TABLE` stays.** It is byte-equal across build, base (`d4d49c5a`) and `c487d89c`. It equals Michniewski's "king middle game" table on https://www.chessprogramming.org/Simplified_Evaluation_Function (fetched 2026-10-24). The build keeps it as the middlegame half of the blend.
- **`KING_ENDGAME_TABLE` (new) does not join.** All 64 cells equal `40 − 15 × m`, where m is the Manhattan distance to the nearest of d4, e4, d5 and e5.
  - It is not the page's "king end game" table: 54 of 64 cells differ.
  - The 10 that agree follow from the rule: a8, h8, a1 and h1 (−50), d4, e4, d5 and e5 (40), and b7 and g7 (−20).
  - The value range, −50 to 40, is the same as the page's. Engineering reading: a distance rule is a method, not a copy. UNKNOWN - verify.
- **`PHASE_WEIGHT` (N 1, B 1, R 2, Q 4) and `PHASE_MAX` 24 (new):** from the ABC-205 design ruling (`…1fb6e1bc`). The page has no phase weights and no blend: it switches tables on a material rule.
- **`KING_EXPOSURE_QUEEN_SCALE` = 3 (new):** ours, the game-1 analysis probe's value.
- **The shelter gate's 0:** ours (ADR-0031 addendum `A3`).
- The other six credited identifiers are byte-equal between the build and base.
- **Consequence for ABC-214:** if ABC-205 merges first, `A5`'s base check fires, and BA/PM's re-read already has its answer here: the list is unchanged.
  - The build also edits header line 20, adding "The king endgame table is this project's own." That is the line ABC-214 Scope 7 anchors after. The later merge rebases and keeps both.
  - `KING_ENDGAME_TABLE` must **not** be named in the carve-out section, because `A5` asks for exactly seven.
