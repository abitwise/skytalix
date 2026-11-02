# qe-ABC-265 plants: 10 QE defects declared in the PREREG. All 5 expected-red plants are red; QP8 reds a row that pins a choice the amendment leaves open; QP4 survives every lane (gap QE-265-a); QP6, QP7 and QP10 survive, as declared

Each plant was applied to P, a scratch copy of head `e5694864`, never `src/`, and restored from head after (`diff -r P/src head/src` equal at the end). It ran on the default lane of the eight table-adjacent files (189 rows: `transposition.shared`, `transposition`, `engine.capacity`, `search.capacity`, `search.null-move`, `search.pvs-lmr`, `search`, `engine`). A plant green there then ran `SEARCH_DEEP=1` `transposition` (40 rows) and my A3 script in its plant mode (3 rows a set, the 24 tick-clock rows, one 24-ply kiwipete game), base against P. All under the lock. Raw: `raw/plants/`.

| id | defect | result |
|---|---|---|
| QP1 | the per-search clear does not zero (`fill` removed) | **RED** 20/189: the layout row (a clear zeroes the slot), ABC-081 rows in `transposition` (3), the engine identity/determinism rows (13), `search.null-move` (2), `search.pvs-lmr` (1) |
| QP2 | wrong slot index, consistent in probe and store (`keyHi & mask`) | **RED** 7/189, all in `transposition.shared` (layout, K hit, K′/K″, torn, bit-31, both T10) |
| QP3 | wrong slot base: a stride of 2 words, so adjacent slots overlap | **RED** 4/189, all in `transposition.shared` (layout, torn, both T10) |
| QP4 | hit on a zero data word (empty-slot term dropped) | **survives**: default 189/189, deep 40/40, A3 plant mode 0 differ. **Gap QE-265-a** |
| QP5 | the copy's score is not refreshed by a hit | **RED** 25/189 (ABC-081 mate relativity, depth and bound rows; the K-hit, bit-31 and T10 rows; engine and null-move rows) |
| QP6 | hash move taken from the verified copy (the amendment's rejected alternative) | **survives**, also QE's full A3 sample run on it afterwards (1 382 rows + 96 tick + 140 plies, 0 differ). Declared: the amendment's probe saw 0 overwrites in 40 455. Sensitivity note, not a gap (QE-265-e INFO) |
| QP7 | the defensive `slot !== hitSlot` guard dropped | **survives**, as declared (value-equivalent at both call sites: probe then cut, with no store between) |
| QP8 | the clear zeroes word 2 only (the amendment permits it) | **RED** 1/189: the layout row asserts the cleared slot is `[0, 0, 0, 0]`. The row pins the Engineer's whole-buffer choice beyond the amendment (QE-265-d INFO). Not a defect |
| QP9 | score word read back unsigned (no `\| 0`) | **RED** 9/189 (the bit-31 row; ABC-081 mated-in-2; engine, null-move and pvs-lmr rows) |
| QP10 | `clearTable` does not reset the copy's slot | **survives**, as declared (every cutoff follows a hit that sets the copy) |

- **The plants the Engineer did not run:** QP1 (clear), QP2 and QP3 (slot index and base), QP4 (zero data word), QP5 (stale copy), QP6 (rejected alternative), QP7, QP8, QP9 and QP10. The Engineer's P1–P6 were a live score read, a live depth read, no XOR, keyHi dropped, a signed compare and the store order.
- **The new file is the only net for QP2 and QP3 on the default lane.** No pre-existing value row reds a consistent wrong slot or overlapping slots. Each changes node counts at Threads 1 by changing which entries collide. The cross-build A3 was read on both after the batch: see the gaps note, QE-265-c.
- **Expected-red and red: 5 of 5** (QP1, QP2, QP3, QP5, QP9). No expected-red plant survived.
