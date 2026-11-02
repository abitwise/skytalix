# qe-ABC-264 plants: 8 QE defects declared in the PREREG, 7 red on the default lane, 1 survives every lane (QP6, the new engine door's priorKeys: gap QE-264-a); the mate-band guard planted twice, red both times

QE/E2E, task `qe-ABC-264`. Each plant on a scratch copy of head `358b5f4a` (`plant.py`), run on the default lane of the five touched files (`search.reverse-futility`, `search`, `engine`, `quiescence`, `search.null-move`; 256 tests), and if green there on `SEARCH_DEEP=1` `search.reverse-futility`. Restored after each; the copy's `src/` was diffed equal to head's at the end. Distinct from SE's nine plants (`…470e5bf6`).

| id | defect planted | default lane | red rows |
|---|---|---|---|
| QP1 | mate band strict (`beta > MATE_FLOOR \|\| beta < -MATE_FLOOR`) | **red** 2/256 | guarded: beta at -MATE_FLOOR; beta at +MATE_FLOOR |
| QP2 | mate band upper side only (`beta >= MATE_FLOOR`) | **red** 2/256 | guarded: beta at / below -MATE_FLOOR |
| QP3 | margin strict (`> beta`) | **red** 8/256 | the five `cuts` rows and band edges |
| QP4 | engine gate moved above the table probe | **red** 1/256 | source row, `./engine.ts` |
| QP5 | search gate moved above the table probe | **red** 1/256 | source row, `./search.ts` |
| QP6 | `chooseMoveWithoutReverseFutility` with `priorKeys: false` | **green** 256/256; deep 35/35 green | none: **survives** |
| QP7 | root guard over-wide (`ply <= 1`) | **red** 6/256 | `cuts` rows at ply 1, band edges |
| QP8 | depth range 1-2 (`depth >= 3` returns false) | **red** 2/256 | `cuts` at depth 3 (White, Black) |

- **QP6** is not caught by any row: the literal maps pin `nullMove`, `quiescenceEvasions`, `quietPromotions` and `reverseFutility` on the new door, not `priorKeys`; the `ABC-230` door rows in `src/engine.test.ts` that pass prior keys do not include the new door; and A1's cross-build feeds FENs with no prior keys, so it would not catch it either. Effect is test-only (a door that is not the pre-ticket `chooseMove` once prior keys are passed); the shipped path is untouched. Gap `QE-264-a`, LOW.
- **QF (fixture check, not a plant):** the `ABC-086` A6 row with engine B back at 3 ms reds on the non-vacuity line only; at 5 ms green (rows note).
