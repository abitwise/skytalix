# `ABC-245` fixture and R1 census, re-derived independently: a legal game with no capture and no pawn move. Offsets are [−98, −94], child clock 98 < 100, 98 keys handed (≤ 101), and the project reads the child as a claimable threefold. The census equals the SE's line. 0 FAIL

## Fixture (`raw/qe-scripts/fixture.mjs`, output `raw/fixture/fixture.txt`)
The script reads `FAR_FEN`, `FAR_MOVES` and `REPEAT` from H's `src/levels.test.ts` by regex, with no transcription. It replays them on
QE's **own** K+Q v K board and move generator, with position identity as board plus side to move and no Zobrist. At every ply it
cross-checks against the project's `legalMoves`, `newGame`/`playMove`, `gameStatusOf`, `trimPriorKeys` and `repetitionKey`.
17 checks, **0 FAIL**:
- Start material is exactly K+Q v k, castling `-`, ep `-`, clock 0.
- All 98 plies (97 moves plus the repeat `d7e8`) are legal by QE's generator. QE's generator equals `legalMoves` at all 98
  positions (0 mismatches).
- **No capture and no pawn move** on any ply.
- `gameStatusOf` reads in-progress at every position before the child: no mate, stalemate, fifty-move or fivefold end comes
  earlier. That settles Test note 1's `UNKNOWN - verify` on `src/gameend.ts` for this fixture.
- The child position stands at plies **0, 4 and 98** only. Before it, the only position seen twice is the start, so no earlier
  third occurrence exists.
- **Child clock 98** by the project and by QE's independent ply count, under the fifty-move claim at 100. Root clock 97, and
  `trimPriorKeys` hands 97 keys. **Handed list 98 ≤ 101.**
- **Offsets `[−98, −94]`**, read both by key and by QE's position identity. Key equality mirrors position identity over all
  98² pairs (0 mismatches). Both offsets are < −50 and within min(child clock, list) = 98. Nothing matches in −4…−92.
- The −98 match sits **exactly at the oldest readable entry**. So the row also pins the clock and list-length terms of
  `standsTwiceBefore`'s bound at their edge, not only the cap. That is a bonus, not owed.
- `gameStatusOf` on the child reads `{"result":"in-progress","claimable":{"by":"white","draws":["threefold-repetition"]}}`:
  the project's own game-end agrees it is a real third occurrence.

## R1 census re-read (`raw/qe-scripts/qe245-census.test.ts`, run alone in P; output `raw/census/census.txt`)
| step | children / legal | handed budgets (ms) | depths | d7e8 | played | virtual elapsed | `now()` calls | intervals per level call ⌈100/step⌉ |
|---|---|---|---|---|---|---|---|---|
| 10 | 7 / 8 | 2.5, −25, −52.5, −80, −95, −122.5, −150 | all 1 | 0 | d7c8 | 290 | 30 | 10 |
| 1 (informative) | 7 / 8 | 11.5, 9, 9.5, 9, 22, 9.5, 9 | 5,4,5,4,5,4,4 | 0 | d7c6 | 103 | 104 | 100 |

- **Step 10 equals the SE's R1 line** (`se-ABC-245` `…c1655da6`) value for value: 7 children for 8 legal moves, the same seven
  handed budgets, depth 1 each, and 290 virtual ms. The per-child figures are read, not nominal, as Test note 3 asks.
  `ADR-0046` § Ruling 2026-10-31 admits this form: per level call, 10 intervals ≥ 2, and the ruling's limit does not fire,
  because the row asserts no child depth.
- At step 1 the repeat also reads 0 with 7 children. The property under test does not depend on the step, as the ruling
  expects: the check runs at the root and reads no clock.
- **QE-245-a (INFO).** The R1 line's "10 reads per level call" is the ruling's **interval** count, ⌈budget ÷ step⌉. The level call
  actually makes 30 `now()` calls at step 10 and runs to 290 of its 100 virtual ms. The ruling accepts both, as it said for
  `ABC-242` (210 of 100). This is a labelling note, not a fault.
