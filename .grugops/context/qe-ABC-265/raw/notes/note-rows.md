# qe-ABC-265 per row: A1 MET, A2 MET (incl. T10 x2), A3 MET on QE's own sample (1 382 fixed-depth rows, 107 390 335 head nodes, 96 tick-clock rows, 140 game plies, 0 differ), A4 see the gates note, A5 MET, A7 none owed

Head `e5694864` against base `94be445f`, read by QE at `grugops/qe-ABC-265`. Every run held `flock host-test.lock`. Rules as fixed in the PREREG (`…1aca37a5`). Raw evidence under `raw/` of this task.

- **A1 (the layout): MET.** The four A1 rows of `src/transposition.shared.test.ts` are green (3 head `npm test` runs). QE re-read the source by hand against the page's four bullets:
  - one `SharedArrayBuffer` of `TABLE_ENTRIES * 16` = 4 194 304 B, viewed by one `Uint32Array<ArrayBufferLike>`, allocated by the first `clearTable`, then refilled; `tableByteLength()` returns the view's `byteLength`;
  - no `BigUint64Array` / `BigInt64Array` and no `Atomics` in the code;
  - `storeEntry` writes `table[base + 2]`, `+ 3`, `table[base]`, `+ 1`, in that order, plain writes;
  - `probeTable(key: bigint): number` and `storeEntry(key: bigint, …)` keep their signatures; typecheck 0.
  - `git diff --name-only 94be445f e5694864 -- '*.test.ts'` lists only the new file. `ABC-081`'s `vi.mock` rows ran unedited.
- **A2 (the XOR check): MET.** The seven A2 rows are green and read row by row against the page's five bullets: K hits with move, bound, depth and score; K′ (same slot, other keyHi) and K″ (keyLo differs above the mask) miss; both torn mixes miss for A and for B, and each restored slot hits again (non-vacuity); keyLo and keyHi with bit 31 set hit; T10 both cases (K′ exact at d with −456, and K′ at d + 1) return s_K = 123 after K′'s four words overwrite the slot. The test checks the slot really holds K′ first.
  - The code reads w2 and w3 once each in `probeTable` and copies them (`hitData`, `hitScore`) before returning; `tableCutoff` reads only the copy, so no second read of words 2 or 3 sits between the check and the cutoff (the amendment's rule). `entryMove` stays a live read of word 2 (the amendment's rule).
  - QE plants on the check: see the plants note. 5 of 5 expected-red plants are red.
- **A3 (identity, G4, T8): MET, QE's own sample.** `raw/scripts/a3q.mjs`, written by QE, plain node, out of tree, base tree against head tree, one process holding both builds. **0 rows differ** in move, score, nodes (and depth):
  - corpus = `ABC-078` `A3`'s 276 positions (12 roots and their in-progress children), the same build as the SE's;
  - `search()` d5 on 69 corpus positions; `chooseMove` fixed to 5 on 69 others;
  - 202 2-ply descendants of the perft roots: `search()` d3-4 (404 rows) and `chooseMove` fixed to 4 (202);
  - the 58 shipped puzzles: `search()` d4 and `chooseMove` fixed to 5;
  - 3 game-1 positions, `chooseMove` fixed to 7;
  - high-table-load rows: the six mate and endgame roots at `search()` d8-9 and `chooseMove` fixed to 10 and 12 (24.4 M head nodes; mate-score relativity through the `ToUint32` score word); startpos, kiwipete, position-3 and position-6 at `chooseMove` fixed to 9; startpos, position-3 and position-6 at `search()` d8;
  - every pre-existing door against its pre-ticket self, one depth deeper than the SE read: 9 `searchWithout*` at d4 on 34 corpus positions; the two pruning-free doors at d3 on the 6 endgame roots; 5 `chooseMoveWithout*` to 5 on 34. The door sets and the `search.ts` / `engine.ts` export lists are equal in both builds;
  - **1 382 fixed-depth rows, 107 390 335 head nodes, all equal**;
  - **96 tick-clock rows**: 12 roots x 7/60/1200/6000 ticks (clock step 3) x prior none, or a 7-key history holding the root key twice. 0 differ, including the tick count at return;
  - **140 game plies**: 4 roots, 30-40 plies each, consecutive `chooseMove` calls in one process (1 500 ticks, the game's keys as `priorKeys`), with a `search()` d3 and a `searchWithoutTable` d2 interleaved every 5th ply. 0 differ. This exercises the per-search clear between searches.
  - Wall 806 s. A 3-rows-a-set smoke run before the PREREG (`raw/a3/a3-quick-smoke.txt`) also read 0 differ.
  - **`ABC-081`'s, `ABC-122`'s and `ABC-208`'s rows: unedited, green.** The default lane is green ×3. Deep lanes: `SEARCH_DEEP` transposition 40/40, `ENGINE_DEEP` transposition 26/26 (incl. ABC-081 A7), `SEARCH_DEEP` search.null-move 44/44, search.pvs-lmr 29/29, search 57/57, `ENGINE_DEEP` engine 78/78. No row needed an edit, so no stop for a ruling.
- **A4 (G6, T9) and the profile:** in the gates note and the profile note.
- **A5 (memory, G7): MET.** Fresh `node --expose-gc` process per build and board, readings after `gc()` x2 (`raw/g7/g7.jsonl`):
  - head, kiwipete: depth 7 at 1 s, 9 at 4 s. `heapUsed` growth +1 320 B, `arrayBuffers` growth 0, `arrayBuffers` 4 732 211 B.
  - head, position-6: depth 8 / 10. Growth +14 728 B / 0, `arrayBuffers` 4 732 211 B.
  - The `SharedArrayBuffer` is counted in `arrayBuffers` to the byte: +4 194 432 B from import to after the first search, the same as base's three typed arrays.
  - The fixed sum (table 4 194 304 + key array 1 032 + pawn memo 393 216 + two scratches 2 048 each) is 4 592 648 B, under 16 MiB. Base reads the same figures (growth +3 616 / +17 360 B heap, 0 arrayBuffers).
  - The ABC-081 A7 deep row is green: 9.14 MiB heap and 4.51 MiB arrayBuffers at both 1 s and 4 s.
- **A6 (gates):** in the gates note. **A7: none owed** (Orchestrator ruling `…d39f74ef`; no game read, no S2).
- **Scope 7 comments:** all four were rewritten as the page names them: the storage paragraph, the lifetime paragraph ("Clearing zeroes the whole buffer"), the threading line (pointing to `ADR-0057` D2 and the amendment), and `MATE_FLOOR`'s 10 885 cp bound. No test reads them.
