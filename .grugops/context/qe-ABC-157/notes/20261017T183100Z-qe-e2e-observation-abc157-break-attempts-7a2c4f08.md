---
id: 20261017T183100Z-qe-e2e-observation-abc157-break-attempts-7a2c4f08
kind: observation
by: qe-e2e
task: qe-ABC-157
at: 2026-10-17T18:31:00Z
verified_by:
confidence: high
refs:
  - ABC-157
  - QE-157-a
  - 20261017T183000Z-qe-e2e-observation-abc157-mutants-and-criteria-3d5b7e91
  - .grugops/context/qe-ABC-157/probe/qe-mask-mutants.out
  - .grugops/context/qe-ABC-157/probe/qe-table-mutants.out
  - .grugops/context/qe-ABC-157/probe/qe-witness.out
supersedes:
---

# ABC-157 break attempts: weaker right-mask variants; one conjunction passes every lane

Same instrument as `…3d5b7e91` (archive trees, whole default lane, `*_DEEP` unset, md5 restored). No timing read.
Counts are failed tests; `ABC-157` = how many of the failures are the six new rows.

**Right-test rewrites** (`probe/qe-mask-mutants.mjs`):

| variant (the line `(position.castling & option.right) === 0` becomes…) | base 1824 | head 1830 |
|---|---:|---:|
| `X-any-right`: `castling === 0` | 0 (survives) | 6, all six rows |
| own colour, any wing: `castling & (black ? 12 : 3)` | 0 (survives) | 4 (A1 ×4) |
| same wing, either colour | 0 (survives) | 2 (A2 ×2) |
| kingside reads K\|k, queenside correct (wrong colour on one wing) | 0 (survives) | 2 (A2 ×2) |
| queenside reads Q\|q, kingside correct | 0 (survives) | 2 (A2 ×2) |
| white reads any right, black correct | 0 (survives) | 3 |
| black reads any right, white correct | 0 (survives) | 3 |
| opponent's same-wing right only (colour swap) | 38 | 44 (+6) |
| own colour, wing swapped | 8 | 12 (+4) |
| **own other-wing right accepted when the opponent also holds one** (`W-mixed`) | **0 (survives)** | **0 (survives)** |

**Table rewrites** (`probe/qe-table-mutants.mjs`; one `CastleOption.right` entry changed): WK→BK, WQ→BQ, BK→WK,
BQ→WQ, WK→WQ, BQ→BK. All six are already killed at base (25/12/9/10/5/2 failures); each gains 2 `ABC-157` kills at head.

"A right read by side-to-move only" is the delivered code: `generateMoves` sets `black = position.blackToMove`
and passes it to `addCastlingMoves`. That variant is equivalent by construction and was not planted.

**`W-mixed` passes every lane.** The line becomes
`if ((position.castling & option.right) === 0 && !((position.castling & (black ? 12 : 3)) !== 0 && (position.castling & (black ? 3 : 12)) !== 0)) continue;`.
- Default lane: 1824/1824 at base, 1830/1830 at head.
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts` on the head tree with it planted: exit 0, **32/32**.
- Witness (`probe/qe-witness.out`): the six ticket rows read as delivered (25/25/25/25/24/24). On mixed-rights
  positions of the same board it offers the other wing's castle: `w Qk` → `e1g1 e1c1` (26, delivered `e1c1` 25),
  likewise `w Kq`, `b Kq`, `b Qk`, `w Qkq`, `b KQk`.
- Why the rows pass it: every `A1` row has the opponent at 0 rights, and every `A2` row has the mover at 0
  rights. No row holds one of the mover's rights **and** an opponent right while the castle's own right is absent.
- Grade **LOW**: it is a two-clause conjunction, not a one-token slip like `X-any-right`. The ticket scoped the
  "exactly ONE right that is not the castle's own" class, and it closes that class. It is a residual, not an unmet criterion.
