---
id: 20261017T181353Z-software-engineer-decision-row-shape-14459646
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-157
at: 2026-10-17T18:13:53Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-157
  - ABC-157
  - 20261017T181352Z-software-engineer-observation-readings-da7f6206
supersedes:
---

# How the six rows are shaped

- **Two tables and two `describe` blocks, appended after ABC-024's blocks**, with a region comment numbered 12 to
  continue the file's list. `ONE_RIGHT_HELD` has 4 rows (`A1`) and `OPPONENT_RIGHTS_ONLY` has 2 (`A2`). That makes
  exactly +6 tests. There is no quantifier `it`, because the ticket pins the count at base + 6. No existing row,
  table or helper is touched.
- **The setup is asserted before any outcome.** First the right: `A1` checks that `castling` equals that row's
  single `CASTLE_SHAPE[right].right` bit. `A2` checks that `castling & own === 0` and that
  `castling & opponent === opponent`. Then one new helper, `expectOnlyTheRightDecides`, which reuses ABC-024's
  `expectBothCastlesShapeHolds` (king and rooks home, both corridors clear) and adds that both king paths are
  unattacked. This makes both of the mover's castles alive but for the right, which is what lets an
  other-wing castle show. The helper is used by both blocks.
- **The outcome is checked by name at both layers**, as ABC-024's `A1`/`A2` do. `A1` checks `castleNames` of
  `generateMoves` and of `legalMoves` equal `[castle]`, then the exact count 25, then that `fullState` is
  unchanged. `A2` checks that `castleNames(generateMoves)` is `[]`, then calls the existing
  `expectNoCastleAndPure(fen, 24)`.
- **Diff: +90 / −0, one file**, formatted by `biome check --write`. The added lines hold no spawn, network, env
  read or loop beyond the four fixed-size option lists.
