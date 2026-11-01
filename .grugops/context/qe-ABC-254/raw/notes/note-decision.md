# QE on ABC-254 at 600d8de3 (base 09d1f675): verdict UNRESOLVED, not PASS and not FAIL. A1, A2, A3 and A5 MET; A4 UNRESOLVED (QE-254-a, BLOCKING: two boards VOID by the D3 spread rule on a shared host); gaps QE-254-b and QE-254-c LOW. UAT NOT signed; ALONE A4 re-read owed

QE/E2E, task `qe-ABC-254`. The ticket was read against its acceptance criteria, by the PREREG `…6b25d0a8` (committed in `12288266` before any run). One run per reading. The only repeats are the ones the PREREG names, plus the disclosures in the findings note. The readings are in this task's timing, identity, gates and findings notes.

## Candidate
- `grugops/ABC-254` tip `fe53dbda`; code `600d8de3`; base `09d1f675`, the merge base. `main` has not moved `src`, `data`, `tools` or `package*.json` since, so the candidate merges as read.
- **Code read against `ADR-0003` (1-A)** (SE decision `…cb525705`):
  - The king square, the check flag and the pin set are worked out once per call. In check, there is no pin set and every move is tested.
  - Out of check, the test runs on king moves (castles included, at `move.to`), en passant and marked pieces.
  - `markPins` marks an own piece that stands alone before the first enemy piece on a ray, when that piece slides on the ray (R/Q orthogonal, B/Q diagonal). It may mark too much, never too little.
  - The two-byte test applies only to `FLAG_NONE` moves. Castle, en passant and promotion take the full `makeMove`.
  - The list is the same array compacted in place, in the same order. `legalCapturesAndQueenPromotions` re-marks the same pin set.
  - I found no completeness hole: a non-king, non-ep move by an unpinned piece cannot open a line to its own king, and capturing on `to` leaves `to` occupied. QE's differential agrees (0 of 777 439).

## Acceptance
| criterion | grade | reading |
|---|---|---|
| **A1** differential | **MET** | `ENGINE_DEEP` legal 48/48: the 285 074 and 518 474 walks, four lists in order, `hasLegalMove`, `toFen`/Zobrist/state unchanged. QE's own fuzz (playouts plus random placements): 777 439 nodes, **0 mismatches, 0 mutations** |
| **A2** fallback classes | **MET** | All rows green at head. PQ1 and PQ3 turn the lane red. PQ2 is caught only in the deep lane (QE-254-c, LOW) |
| **A3** perft + identity | **MET** | `PERFT_DEEP` 32/32, and 54 perft count lines equal B vs H. **G4 out of tree `cmp` byte-equal**: 7 827 rows (lists incl. quiescence's list; `chooseMove` + 5 doors at budgets 3/5 on `tickingClock(1)` with clock reads; `search` + 9 doors at depth 5; unpruned at 2) plus 264 rows of unpruned doors at depth 5. 0 impure |
| **A4** speed | **UNRESOLVED** | kiwipete **1.115** (valid), in-check guard position-4 **1.102** (valid, ≥ 0.97). **position-6 and start VOID** (spread 6.9 % after the one re-run) on a host shared with a recurring foreign vitest and 100–264 % foreign `node`. Every paired round reads 1.067–1.192 (INFO). Not graded, so neither MET nor NOT MET |
| **A5** gates | **MET** | lint, typecheck, build exit 0. `npm test` 2 368/2 368 ×3, skips 0. **G1** 54/58, rows equal. **G4** above. **G5** lanes green, max 4 002.7 ms. **G6** kiwipete 8 → 9, position-6 10 = 10. **G7** a 512 B fixed scratch, growth 0, transposition lanes green. **G8** H 9.01 s (B 9.59 s), new rows 21.7 ms. **G9** empty diff. 16 deep lanes, 711/711 |
| **A6** grade | S2, no smoke | No games were run, and no `cutechess-cli` at any check |

## Verdict: UNRESOLVED (as the PREREG pre-registered: "A4 UNRESOLVED → no PASS; reported for a re-read")
- **Not PASS and not PASS_WITH_GAPS:** both need every graded item MET, and A4 is not graded.
- **Not FAIL:** no gate or lane is red, there is no identity mismatch, and A4 is not NOT MET. No `failed-attempt` note is written. The ticket's "A4 missed → dropped" rule does **not** apply.
- **Operationally:**
  - The ticket stays **In Review**.
  - **UAT is NOT signed** (production lines in `src/legal.ts`; it needs PASS, or PASS_WITH_GAPS with no blocking gap).
  - **Merge is not recommended until the re-read.**
- **Owed:** one ALONE A4 re-read, about 15 min of host time, on a new PREREG, in a window with no other hop and no foreign vitest. On a MET re-read, with nothing else moving, the expected verdict is PASS_WITH_GAPS: QE-254-b and QE-254-c are LOW and non-blocking.

## Gaps
- **QE-254-a (BLOCKING):** A4 UNRESOLVED. Carrier: the Orchestrator (re-read routing). The D3 spread-rule question goes to BA/PM or the Architect.
- **QE-254-b (LOW):** the tightened `hasLegalMove` bar does not catch a rebuild on the lazy list (PL3a survives the whole default lane). Carrier: BA/PM, test-only.
- **QE-254-c (LOW):** no default-lane row reads quiet promotions in check (PQ2 survives the lane and dies in the deep lane). Carrier: BA/PM, test-only.
- **The SE's `gameend.nfr.test.ts` edit:** confirmed. The full-filter rebuild (PL1) turns both tightened rows red, and the full-list rebuild (PL2) turns three red. Accepted as a stricter, test-only deviation.

## Run time
About 46 min under the lock, within the 60 min the brief allows: A4 about 13.5, G4 10, gates/G8/fuzz/plants 2.7, deep lanes 19.7, plus two count prints. Waiting for the lock and for a clear host took about 70 min and is excluded.
